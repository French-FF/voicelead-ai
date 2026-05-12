import "server-only";

import { createHash } from "node:crypto";
import {
  CallStatus as DbCallStatus,
  CampaignStatus as DbCampaignStatus,
  LeadClassification as DbLeadClassification,
} from "@prisma/client";
import type {
  Agent,
  CallRecord,
  CallStatus,
  Campaign,
  CampaignStatus,
  FollowUpTask,
  KnowledgeBaseEntry,
  Lead,
  LeadCategory,
  TrainingAsset,
  Workspace,
} from "./types";
import {
  agents as mockAgents,
  calls as mockCalls,
  campaigns as mockCampaigns,
  followUpTasks as mockFollowUpTasks,
  knowledgeBaseEntries as mockKnowledgeBaseEntries,
  leads as mockLeads,
  trainingAssets as mockTrainingAssets,
  workspace as mockWorkspace,
} from "./mock-data";
import { DEFAULT_WORKSPACE_ID, hasDatabase, providerStatus } from "./config";
import { getPrisma } from "./prisma";
import type { ParsedLead } from "./csv";
import { isValidIndianMobile } from "./csv";

type StoreMode = "database" | "memory";

type Snapshot = {
  mode: StoreMode;
  workspace: Workspace;
  agents: Agent[];
  campaigns: Campaign[];
  leads: Lead[];
  calls: CallRecord[];
  knowledgeBaseEntries: KnowledgeBaseEntry[];
  trainingAssets: TrainingAsset[];
  followUpTasks: FollowUpTask[];
};

type InMemoryState = Omit<Snapshot, "mode"> & {
  feedback: Record<string, unknown>[];
  dnc: { phone: string; reason: string; createdAt: string }[];
};

const classificationToDb: Record<LeadCategory, DbLeadClassification> = {
  Hot: DbLeadClassification.HOT,
  Warm: DbLeadClassification.WARM,
  Cold: DbLeadClassification.COLD,
  "Not Interested": DbLeadClassification.NOT_INTERESTED,
  "Wrong Target Group": DbLeadClassification.WRONG_TARGET_GROUP,
  "Call Back Later": DbLeadClassification.CALL_BACK_LATER,
  "Invalid Number": DbLeadClassification.INVALID_NUMBER,
  Converted: DbLeadClassification.CONVERTED,
  "Needs Human Follow-Up": DbLeadClassification.NEEDS_HUMAN_FOLLOW_UP,
  "Do Not Contact": DbLeadClassification.DO_NOT_CONTACT,
};

const dbToClassification = Object.fromEntries(
  Object.entries(classificationToDb).map(([label, value]) => [value, label]),
) as Record<string, LeadCategory>;

const campaignStatusToDb: Record<CampaignStatus, DbCampaignStatus> = {
  Draft: DbCampaignStatus.DRAFT,
  Ready: DbCampaignStatus.READY,
  Live: DbCampaignStatus.LIVE,
  Paused: DbCampaignStatus.PAUSED,
  Completed: DbCampaignStatus.COMPLETED,
};

const dbToCampaignStatus = Object.fromEntries(
  Object.entries(campaignStatusToDb).map(([label, value]) => [value, label]),
) as Record<string, CampaignStatus>;

const callStatusToDb: Record<CallStatus, DbCallStatus> = {
  Connected: DbCallStatus.CONNECTED,
  Pending: DbCallStatus.PENDING,
  Failed: DbCallStatus.FAILED,
  "No Answer": DbCallStatus.NO_ANSWER,
  Scheduled: DbCallStatus.SCHEDULED,
  "In Progress": DbCallStatus.IN_PROGRESS,
};

const dbToCallStatus = Object.fromEntries(
  Object.entries(callStatusToDb).map(([label, value]) => [value, label]),
) as Record<string, CallStatus>;

const globalForStore = globalThis as unknown as {
  voiceLeadState?: InMemoryState;
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function getMemoryState() {
  if (!globalForStore.voiceLeadState) {
    globalForStore.voiceLeadState = {
      workspace: clone(mockWorkspace),
      agents: clone(mockAgents),
      campaigns: clone(mockCampaigns),
      leads: clone(mockLeads),
      calls: clone(mockCalls),
      knowledgeBaseEntries: clone(mockKnowledgeBaseEntries),
      trainingAssets: clone(mockTrainingAssets),
      followUpTasks: clone(mockFollowUpTasks),
      feedback: [],
      dnc: [],
    };
  }

  return globalForStore.voiceLeadState;
}

function asStringArray(value: unknown, fallback: string[] = []) {
  return Array.isArray(value) ? value.map(String) : fallback;
}

function asRecord(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, string>)
    : {};
}

function asList(value: unknown) {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    return value
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function durationLabel(seconds?: number | null) {
  if (!seconds) return "0m 00s";
  const minutes = Math.floor(seconds / 60);
  const remaining = String(seconds % 60).padStart(2, "0");
  return `${minutes}m ${remaining}s`;
}

function computeCampaignStats(campaign: Campaign, leads: Lead[], calls: CallRecord[]) {
  const campaignLeads = leads.filter((lead) => lead.campaignId === campaign.id);
  const campaignCalls = calls.filter((call) => call.campaignId === campaign.id);
  const scored = campaignCalls.filter((call) => call.conversionScore > 0);
  const averageScore = scored.length
    ? Math.round(scored.reduce((sum, call) => sum + call.conversionScore, 0) / scored.length)
    : campaign.averageScore;

  return {
    ...campaign,
    leadCount: campaignLeads.length || campaign.leadCount,
    callsCompleted:
      campaignCalls.filter((call) => call.callStatus === "Connected").length ||
      campaign.callsCompleted,
    connectedCalls:
      campaignCalls.filter((call) => call.callStatus === "Connected").length ||
      campaign.connectedCalls,
    hotLeads:
      campaignLeads.filter((lead) => lead.classification === "Hot").length ||
      campaign.hotLeads,
    warmLeads:
      campaignLeads.filter((lead) => lead.classification === "Warm").length ||
      campaign.warmLeads,
    callbackRequests:
      campaignLeads.filter((lead) =>
        ["Hot", "Needs Human Follow-Up", "Call Back Later"].includes(
          lead.classification,
        ),
      ).length || campaign.callbackRequests,
    averageScore,
  };
}

function mapWorkspace(record: {
  id: string;
  companyName: string;
  industry: string;
  website: string | null;
  subscriptionPlan: string;
  callCreditBalance: number;
  businessContext: unknown;
}): Workspace {
  const context = asRecord(record.businessContext);
  return {
    id: record.id,
    companyName: record.companyName,
    industry: record.industry,
    website: record.website ?? "",
    subscriptionPlan: record.subscriptionPlan,
    callCreditBalance: record.callCreditBalance,
    businessContext: String(context.businessContext ?? context.overview ?? ""),
    targetCustomers: String(context.targetCustomers ?? ""),
    geographies: asStringArray(context.geographies),
    usp: asStringArray(context.usp),
    complianceMode: "Configurable disclosure",
  };
}

function mapAgent(record: {
  id: string;
  workspaceId: string;
  name: string;
  voiceType: string;
  tone: string;
  language: string;
  instructions: unknown;
  disclosureMode: string;
}): Agent {
  const instructions = asRecord(record.instructions);
  return {
    id: record.id,
    workspaceId: record.workspaceId,
    name: record.name,
    voiceType: record.voiceType,
    tone: (record.tone || "Consultative") as Agent["tone"],
    language: (record.language || "Hinglish") as Agent["language"],
    speed: String(instructions.speed ?? "Medium"),
    assertiveness: String(instructions.assertiveness ?? "Balanced"),
    disclosure:
      record.disclosureMode === "ALWAYS_DISCLOSE"
        ? "Always disclose"
        : record.disclosureMode === "DO_NOT_DISCLOSE"
          ? "Do not disclose"
          : "Client controlled",
    openingPitch: String(instructions.openingPitch ?? ""),
    instructions: asStringArray(instructions.instructions),
    doNotSay: asStringArray(instructions.doNotSay),
    escalationRules: asStringArray(instructions.escalationRules),
  };
}

function mapCampaign(record: {
  id: string;
  workspaceId: string;
  campaignName: string;
  objective: string;
  script: string;
  language: string;
  agentId: string | null;
  status: string;
  qualificationQuestions: unknown;
  scoringRules: unknown;
  handoffRules: unknown;
  createdAt: Date;
}): Campaign {
  return {
    id: record.id,
    workspaceId: record.workspaceId,
    campaignName: record.campaignName,
    objective: record.objective,
    targetIndustry: "Education - undergraduate admissions",
    language: (record.language || "Hinglish") as Campaign["language"],
    agentId: record.agentId ?? "",
    status: dbToCampaignStatus[record.status] ?? "Draft",
    leadCount: 0,
    callsCompleted: 0,
    connectedCalls: 0,
    averageScore: 0,
    hotLeads: 0,
    warmLeads: 0,
    callbackRequests: 0,
    script: record.script,
    qualificationQuestions: asStringArray(record.qualificationQuestions),
    scoringRules: asStringArray(record.scoringRules),
    handoffRules: asStringArray(record.handoffRules),
    createdAt: record.createdAt.toISOString(),
  };
}

function mapLead(record: {
  id: string;
  workspaceId: string;
  campaignId: string | null;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  source: string | null;
  leadType: string | null;
  notes: string | null;
  customFields: unknown;
  status: string;
  classification: string;
  conversionScore: number;
  assignedToId: string | null;
  createdAt: Date;
}): Lead {
  return {
    id: record.id,
    workspaceId: record.workspaceId,
    campaignId: record.campaignId ?? "",
    name: record.name,
    phone: record.phone,
    email: record.email ?? "",
    city: record.city ?? "",
    source: record.source ?? "",
    leadType: record.leadType ?? "",
    notes: record.notes ?? "",
    customFields: asRecord(record.customFields),
    callStatus: record.status === "DNC" ? "Connected" : "Pending",
    classification: dbToClassification[record.classification] ?? "Cold",
    conversionScore: record.conversionScore,
    tags: [],
    assignedTo: record.assignedToId ?? "Unassigned",
    nextAction:
      record.status === "DNC"
        ? "Suppress from all future campaigns"
        : "Awaiting first AI call attempt",
    followUpStatus: "Open",
    createdAt: record.createdAt.toISOString(),
  };
}

function mapCall(record: {
  id: string;
  leadId: string;
  campaignId: string;
  workspaceId: string;
  callStatus: string;
  durationSeconds: number | null;
  recordingUrl: string | null;
  transcript: string | null;
  shortSummary: string | null;
  detailedSummary: string | null;
  classification: string;
  conversionScore: number;
  intentScore: number;
  sentiment: string | null;
  tags: unknown;
  objections: unknown;
  extractedFields: unknown;
  nextAction: string | null;
  createdAt: Date;
}): CallRecord {
  return {
    id: record.id,
    leadId: record.leadId,
    campaignId: record.campaignId,
    workspaceId: record.workspaceId,
    callStatus: dbToCallStatus[record.callStatus] ?? "Pending",
    duration: durationLabel(record.durationSeconds),
    durationSeconds: record.durationSeconds ?? 0,
    recordingUrl: record.recordingUrl ?? "",
    transcript: record.transcript ?? "",
    shortSummary: record.shortSummary ?? "Call is waiting for transcript analysis.",
    detailedSummary: record.detailedSummary ?? "No detailed summary yet.",
    classification: dbToClassification[record.classification] ?? "Cold",
    conversionScore: record.conversionScore,
    intentScore: record.intentScore,
    sentiment: (record.sentiment ?? "Neutral") as CallRecord["sentiment"],
    tags: asStringArray(record.tags),
    objections: asStringArray(record.objections),
    questionsAsked: asList(asRecord(record.extractedFields).questionsAsked),
    extractedFields: asRecord(record.extractedFields),
    nextAction: record.nextAction ?? "Review call outcome.",
    languageUsed: "Hinglish",
    createdAt: record.createdAt.toISOString(),
  };
}

export async function getWorkspaceSnapshot(
  workspaceId = DEFAULT_WORKSPACE_ID,
): Promise<Snapshot> {
  if (!hasDatabase()) {
    const state = getMemoryState();
    return {
      mode: "memory",
      ...clone(state),
      campaigns: state.campaigns.map((campaign) =>
        computeCampaignStats(campaign, state.leads, state.calls),
      ),
    };
  }

  const prisma = getPrisma();
  const record = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      agents: true,
      campaigns: { orderBy: { createdAt: "desc" } },
      calls: { orderBy: { createdAt: "desc" } },
      followUpTasks: { orderBy: { dueDate: "asc" } },
      knowledgeBase: { orderBy: { createdAt: "desc" } },
      leads: { orderBy: { createdAt: "desc" } },
      trainingAssets: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!record) {
    const state = getMemoryState();
    return { mode: "memory", ...clone(state) };
  }

  const leads = record.leads.map(mapLead);
  const calls = record.calls.map(mapCall);
  const campaigns = record.campaigns
    .map(mapCampaign)
    .map((campaign) => computeCampaignStats(campaign, leads, calls));

  return {
    mode: "database",
    workspace: mapWorkspace(record),
    agents: record.agents.map(mapAgent),
    campaigns,
    leads: leads.map((lead) => {
      const latestCall = calls.find((call) => call.leadId === lead.id);
      return latestCall
        ? {
            ...lead,
            callStatus: latestCall.callStatus,
            classification: latestCall.classification,
            conversionScore: latestCall.conversionScore,
            tags: latestCall.tags,
            nextAction: latestCall.nextAction,
          }
        : lead;
    }),
    calls,
    knowledgeBaseEntries: record.knowledgeBase.map((entry) => ({
      id: entry.id,
      workspaceId: entry.workspaceId,
      title: entry.title,
      type: (entry.source || "Course context") as KnowledgeBaseEntry["type"],
      content: entry.content,
      source: entry.source ?? "Workspace",
      updatedAt: entry.updatedAt.toISOString(),
    })),
    trainingAssets: record.trainingAssets.map((asset) => ({
      id: asset.id,
      workspaceId: asset.workspaceId,
      title: asset.title,
      type: (asset.type || "Manual transcript") as TrainingAsset["type"],
      status: asset.status === "PROCESSED" ? "Processed" : "Queued",
      insights: asStringArray(asRecord(asset.insights).insights, [
        "Queued for agent refinement.",
      ]),
      uploadedAt: asset.createdAt.toISOString(),
    })),
    followUpTasks: record.followUpTasks.map((task) => ({
      id: task.id,
      leadId: task.leadId,
      campaignId: task.campaignId,
      taskType: task.taskType as FollowUpTask["taskType"],
      dueDate: task.dueDate.toISOString(),
      status: task.status as FollowUpTask["status"],
      assignedTo: task.assignedTo ?? "Admissions Ops",
    })),
  };
}

export async function getLead(leadId: string, workspaceId = DEFAULT_WORKSPACE_ID) {
  const snapshot = await getWorkspaceSnapshot(workspaceId);
  return snapshot.leads.find((lead) => lead.id === leadId);
}

export async function getCall(callId: string, workspaceId = DEFAULT_WORKSPACE_ID) {
  const snapshot = await getWorkspaceSnapshot(workspaceId);
  return snapshot.calls.find((call) => call.id === callId);
}

export async function getCallsForLead(
  leadId: string,
  workspaceId = DEFAULT_WORKSPACE_ID,
) {
  const snapshot = await getWorkspaceSnapshot(workspaceId);
  return snapshot.calls.filter((call) => call.leadId === leadId);
}

export async function createCampaign(
  workspaceId: string,
  input: {
    campaignName: string;
    objective: string;
    language: string;
    agentId?: string;
    script: string;
    qualificationQuestions: string[];
    scoringRules: string[];
    handoffRules: string[];
  },
) {
  const id = `camp_${Date.now()}`;
  const campaign: Campaign = {
    id,
    workspaceId,
    campaignName: input.campaignName,
    objective: input.objective,
    targetIndustry: "Education - undergraduate admissions",
    language: input.language as Campaign["language"],
    agentId: input.agentId || "agent_aarav",
    status: "Draft",
    leadCount: 0,
    callsCompleted: 0,
    connectedCalls: 0,
    averageScore: 0,
    hotLeads: 0,
    warmLeads: 0,
    callbackRequests: 0,
    script: input.script,
    qualificationQuestions: input.qualificationQuestions,
    scoringRules: input.scoringRules,
    handoffRules: input.handoffRules,
    createdAt: new Date().toISOString(),
  };

  if (!hasDatabase()) {
    getMemoryState().campaigns.unshift(campaign);
    return campaign;
  }

  const record = await getPrisma().campaign.create({
    data: {
      id,
      workspaceId,
      campaignName: input.campaignName,
      objective: input.objective,
      language: input.language,
      agentId: input.agentId || "agent_aarav",
      script: input.script,
      status: "DRAFT",
      qualificationQuestions: input.qualificationQuestions,
      scoringRules: input.scoringRules,
      handoffRules: input.handoffRules,
      callingWindow: { start: "10:00", end: "19:00", timezone: "Asia/Kolkata" },
    },
  });

  return mapCampaign(record);
}

export async function importLeads(
  workspaceId: string,
  campaignId: string,
  parsed: ParsedLead[],
) {
  const seen = new Set<string>();
  const duplicateNumbers: string[] = [];
  const invalidRows: ParsedLead[] = [];
  const created: Lead[] = [];
  const state = getMemoryState();

  for (const lead of parsed) {
    const phone = lead.phone;
    if (!isValidIndianMobile(phone)) {
      invalidRows.push(lead);
      continue;
    }
    if (seen.has(phone)) {
      duplicateNumbers.push(phone);
      continue;
    }
    seen.add(phone);

    const existing = hasDatabase()
      ? null
      : state.leads.find((item) => item.workspaceId === workspaceId && item.phone === phone);

    if (existing) {
      duplicateNumbers.push(phone);
      continue;
    }

    const uiLead: Lead = {
      id: `lead_${Date.now()}_${created.length}`,
      workspaceId,
      campaignId: lead.campaignId || campaignId,
      name: lead.name || "Unnamed lead",
      phone,
      email: lead.email ?? "",
      city: lead.city ?? "",
      source: lead.source ?? "CSV upload",
      leadType: lead.leadType ?? "Student",
      notes: lead.notes ?? "",
      customFields: lead.customFields,
      callStatus: "Pending",
      classification: "Cold",
      conversionScore: 0,
      tags: ["New upload"],
      assignedTo: "VoiceLead AI",
      nextAction: "Ready for first call attempt",
      followUpStatus: "Open",
      createdAt: new Date().toISOString(),
    };

    if (!hasDatabase()) {
      state.leads.unshift(uiLead);
      created.push(uiLead);
      continue;
    }

    try {
      const record = await getPrisma().lead.create({
        data: {
          id: uiLead.id,
          workspaceId,
          campaignId: uiLead.campaignId,
          name: uiLead.name,
          phone,
          email: uiLead.email || null,
          city: uiLead.city || null,
          source: uiLead.source || null,
          leadType: uiLead.leadType || null,
          notes: uiLead.notes || null,
          customFields: uiLead.customFields,
          status: "ACTIVE",
          classification: "COLD",
          conversionScore: 0,
        },
      });
      created.push(mapLead(record));
    } catch {
      duplicateNumbers.push(phone);
    }
  }

  return {
    parsedCount: parsed.length,
    validCount: created.length,
    duplicateNumbers,
    invalidRows,
    created,
  };
}

export async function createCallRecord(input: {
  workspaceId: string;
  leadId: string;
  campaignId: string;
  to: string;
  provider: string;
}) {
  const id = `call_${Date.now()}`;
  const call: CallRecord = {
    id,
    leadId: input.leadId,
    campaignId: input.campaignId,
    workspaceId: input.workspaceId,
    callStatus: "Pending",
    duration: "0m 00s",
    durationSeconds: 0,
    recordingUrl: "",
    transcript: "",
    shortSummary: "Outbound call queued.",
    detailedSummary: "Waiting for provider answer/status callbacks.",
    classification: "Cold",
    conversionScore: 0,
    intentScore: 0,
    sentiment: "Neutral",
    tags: ["Queued"],
    objections: [],
    questionsAsked: [],
    extractedFields: { to: input.to },
    nextAction: "Wait for call outcome.",
    languageUsed: "Hinglish",
    createdAt: new Date().toISOString(),
  };

  if (!hasDatabase()) {
    getMemoryState().calls.unshift(call);
    return call;
  }

  const record = await getPrisma().call.create({
    data: {
      id,
      leadId: input.leadId,
      campaignId: input.campaignId,
      workspaceId: input.workspaceId,
      callStatus: "PENDING",
      provider: input.provider,
      tags: ["Queued"],
      objections: [],
      extractedFields: { to: input.to },
    },
  });

  return mapCall(record);
}

export async function updateCallRecord(
  callId: string,
  patch: Partial<CallRecord> & { providerCallId?: string; recordingId?: string },
) {
  if (!hasDatabase()) {
    const state = getMemoryState();
    const index = state.calls.findIndex((call) => call.id === callId);
    if (index >= 0) {
      state.calls[index] = { ...state.calls[index], ...patch };
      return state.calls[index];
    }
    return null;
  }

  const record = await getPrisma().call.update({
    where: { id: callId },
    data: {
      callStatus: patch.callStatus ? callStatusToDb[patch.callStatus] : undefined,
      durationSeconds: patch.durationSeconds,
      recordingUrl: patch.recordingUrl,
      transcript: patch.transcript,
      shortSummary: patch.shortSummary,
      detailedSummary: patch.detailedSummary,
      classification: patch.classification
        ? classificationToDb[patch.classification]
        : undefined,
      conversionScore: patch.conversionScore,
      intentScore: patch.intentScore,
      sentiment: patch.sentiment,
      tags: patch.tags,
      objections: patch.objections,
      extractedFields: patch.extractedFields,
      nextAction: patch.nextAction,
      providerCallId: patch.providerCallId,
    },
  });

  if (patch.classification || patch.conversionScore || patch.callStatus) {
    await getPrisma().lead.update({
      where: { id: record.leadId },
      data: {
        classification: patch.classification
          ? classificationToDb[patch.classification]
          : undefined,
        conversionScore: patch.conversionScore,
        status: patch.classification === "Do Not Contact" ? "DNC" : undefined,
      },
    });
  }

  return mapCall(record);
}

export async function findCallByProviderId(providerCallId: string) {
  if (!hasDatabase()) {
    return getMemoryState().calls.find(
      (call) => call.extractedFields.providerCallId === providerCallId,
    );
  }

  const record = await getPrisma().call.findFirst({
    where: { providerCallId },
  });

  return record ? mapCall(record) : null;
}

export async function createTrainingAsset(input: {
  workspaceId: string;
  title: string;
  type: string;
  transcript?: string;
  fileUrl?: string;
  notes?: string;
}) {
  const asset: TrainingAsset = {
    id: `asset_${Date.now()}`,
    workspaceId: input.workspaceId,
    title: input.title,
    type: input.type.includes("audio") ? "Audio recording" : "Manual transcript",
    status: "Queued",
    insights: [
      "Queued for agent refinement.",
      "Review consent before using this asset for prompt or model tuning.",
    ],
    uploadedAt: new Date().toISOString(),
  };

  if (!hasDatabase()) {
    getMemoryState().trainingAssets.unshift(asset);
    return asset;
  }

  const record = await getPrisma().trainingAsset.create({
    data: {
      id: asset.id,
      workspaceId: input.workspaceId,
      title: input.title,
      type: asset.type,
      fileUrl: input.fileUrl,
      transcript: input.transcript,
      insights: { insights: asset.insights, notes: input.notes },
      status: "QUEUED",
    },
  });

  return {
    ...asset,
    id: record.id,
  };
}

export async function createFeedback(input: Record<string, FormDataEntryValue>) {
  const metadata = Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, String(value)]),
  );

  if (!hasDatabase()) {
    getMemoryState().feedback.push({
      id: `feedback_${Date.now()}`,
      ...metadata,
      createdAt: new Date().toISOString(),
    });
    return metadata;
  }

  await getPrisma().feedback.create({
    data: {
      workspaceId: DEFAULT_WORKSPACE_ID,
      name: String(input.name ?? "") || null,
      company: String(input.company ?? "") || null,
      role: String(input.role ?? "") || null,
      pilotIntent: String(input.pilotIntent ?? "") || null,
      mostValuable: String(input.mostValuable ?? "") || null,
      friction: String(input.friction ?? "") || null,
      metadata,
    },
  });

  return metadata;
}

export async function markDoNotContact(
  workspaceId: string,
  phone: string,
  reason: string,
  sourceLeadId?: string,
) {
  if (!hasDatabase()) {
    getMemoryState().dnc.push({ phone, reason, createdAt: new Date().toISOString() });
    return;
  }

  const phoneHash = await cryptoHash(phone);
  await getPrisma().dncEntry.upsert({
    where: { workspaceId_phoneHash: { workspaceId, phoneHash } },
    update: { reason },
    create: { workspaceId, phoneHash, reason, sourceLeadId },
  });
}

async function cryptoHash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function seedDemoWorkspace() {
  if (!hasDatabase()) {
    globalForStore.voiceLeadState = undefined;
    return { mode: "memory" as const, seeded: true };
  }

  const prisma = getPrisma();
  await prisma.workspace.upsert({
    where: { id: mockWorkspace.id },
    update: {},
    create: {
      id: mockWorkspace.id,
      companyName: mockWorkspace.companyName,
      industry: mockWorkspace.industry,
      website: mockWorkspace.website,
      subscriptionPlan: mockWorkspace.subscriptionPlan,
      callCreditBalance: mockWorkspace.callCreditBalance,
      businessContext: {
        overview: mockWorkspace.businessContext,
        targetCustomers: mockWorkspace.targetCustomers,
        geographies: mockWorkspace.geographies,
        usp: mockWorkspace.usp,
      },
    },
  });

  for (const agent of mockAgents) {
    await prisma.agent.upsert({
      where: { id: agent.id },
      update: {},
      create: {
        id: agent.id,
        workspaceId: agent.workspaceId,
        name: agent.name,
        voiceType: agent.voiceType,
        tone: agent.tone,
        language: agent.language,
        disclosureMode: "CLIENT_CONTROLLED",
        instructions: {
          speed: agent.speed,
          assertiveness: agent.assertiveness,
          openingPitch: agent.openingPitch,
          instructions: agent.instructions,
          doNotSay: agent.doNotSay,
          escalationRules: agent.escalationRules,
        },
      },
    });
  }

  for (const campaign of mockCampaigns) {
    await prisma.campaign.upsert({
      where: { id: campaign.id },
      update: {},
      create: {
        id: campaign.id,
        workspaceId: campaign.workspaceId,
        campaignName: campaign.campaignName,
        objective: campaign.objective,
        script: campaign.script,
        language: campaign.language,
        agentId: campaign.agentId,
        status: campaignStatusToDb[campaign.status],
        qualificationQuestions: campaign.qualificationQuestions,
        scoringRules: campaign.scoringRules,
        handoffRules: campaign.handoffRules,
        callingWindow: { start: "10:00", end: "19:00", timezone: "Asia/Kolkata" },
      },
    });
  }

  for (const lead of mockLeads) {
    await prisma.lead.upsert({
      where: { id: lead.id },
      update: {},
      create: {
        id: lead.id,
        workspaceId: lead.workspaceId,
        campaignId: lead.campaignId,
        name: lead.name,
        phone: lead.phone.replace(/\s/g, ""),
        email: lead.email,
        city: lead.city,
        source: lead.source,
        leadType: lead.leadType,
        notes: lead.notes,
        customFields: lead.customFields,
        status: lead.classification === "Do Not Contact" ? "DNC" : "ACTIVE",
        classification: classificationToDb[lead.classification],
        conversionScore: lead.conversionScore,
      },
    });
  }

  for (const call of mockCalls) {
    await prisma.call.upsert({
      where: { id: call.id },
      update: {},
      create: {
        id: call.id,
        leadId: call.leadId,
        campaignId: call.campaignId,
        workspaceId: call.workspaceId,
        callStatus: callStatusToDb[call.callStatus],
        durationSeconds: call.durationSeconds,
        recordingUrl: call.recordingUrl,
        transcript: call.transcript,
        shortSummary: call.shortSummary,
        detailedSummary: call.detailedSummary,
        classification: classificationToDb[call.classification],
        conversionScore: call.conversionScore,
        intentScore: call.intentScore,
        sentiment: call.sentiment,
        tags: call.tags,
        objections: call.objections,
        extractedFields: {
          ...call.extractedFields,
          questionsAsked: call.questionsAsked,
        },
        nextAction: call.nextAction,
      },
    });
  }

  for (const entry of mockKnowledgeBaseEntries) {
    await prisma.knowledgeBase.upsert({
      where: { id: entry.id },
      update: {},
      create: {
        id: entry.id,
        workspaceId: entry.workspaceId,
        title: entry.title,
        content: entry.content,
        source: entry.type,
      },
    });
  }

  for (const asset of mockTrainingAssets) {
    await prisma.trainingAsset.upsert({
      where: { id: asset.id },
      update: {},
      create: {
        id: asset.id,
        workspaceId: asset.workspaceId,
        title: asset.title,
        type: asset.type,
        insights: { insights: asset.insights },
        status: asset.status.toUpperCase().replaceAll(" ", "_"),
      },
    });
  }

  for (const task of mockFollowUpTasks) {
    await prisma.followUpTask.upsert({
      where: { id: task.id },
      update: {},
      create: {
        id: task.id,
        leadId: task.leadId,
        campaignId: task.campaignId,
        workspaceId: mockWorkspace.id,
        taskType: task.taskType,
        dueDate: new Date(task.dueDate),
        status: task.status,
        assignedTo: task.assignedTo,
      },
    });
  }

  return { mode: "database" as const, seeded: true };
}

export function getOperationalStatus() {
  return {
    mode: hasDatabase() ? "database" : "memory",
    providers: providerStatus(),
  };
}

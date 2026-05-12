export type LeadCategory =
  | "Hot"
  | "Warm"
  | "Cold"
  | "Not Interested"
  | "Wrong Target Group"
  | "Call Back Later"
  | "Invalid Number"
  | "Converted"
  | "Needs Human Follow-Up"
  | "Do Not Contact";

export type CallStatus =
  | "Connected"
  | "Pending"
  | "Failed"
  | "No Answer"
  | "Scheduled"
  | "In Progress";

export type CampaignStatus = "Draft" | "Ready" | "Live" | "Paused" | "Completed";

export type LanguageMode = "English" | "Hinglish" | "Hindi";

export type AgentTone =
  | "Friendly"
  | "Consultative"
  | "Formal"
  | "Sales-driven"
  | "Neutral";

export type Workspace = {
  id: string;
  companyName: string;
  industry: string;
  website: string;
  subscriptionPlan: string;
  callCreditBalance: number;
  businessContext: string;
  targetCustomers: string;
  geographies: string[];
  usp: string[];
  complianceMode: "Configurable disclosure";
};

export type Agent = {
  id: string;
  workspaceId: string;
  name: string;
  voiceType: string;
  tone: AgentTone;
  language: LanguageMode;
  speed: string;
  assertiveness: string;
  disclosure: "Client controlled" | "Always disclose" | "Do not disclose";
  openingPitch: string;
  instructions: string[];
  doNotSay: string[];
  escalationRules: string[];
};

export type Campaign = {
  id: string;
  workspaceId: string;
  campaignName: string;
  objective: string;
  targetIndustry: string;
  language: LanguageMode;
  agentId: string;
  status: CampaignStatus;
  leadCount: number;
  callsCompleted: number;
  connectedCalls: number;
  averageScore: number;
  hotLeads: number;
  warmLeads: number;
  callbackRequests: number;
  script: string;
  qualificationQuestions: string[];
  scoringRules: string[];
  handoffRules: string[];
  createdAt: string;
};

export type Lead = {
  id: string;
  workspaceId: string;
  campaignId: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  source: string;
  leadType: string;
  notes: string;
  customFields: Record<string, string>;
  callStatus: CallStatus;
  classification: LeadCategory;
  conversionScore: number;
  tags: string[];
  assignedTo: string;
  nextAction: string;
  followUpStatus: string;
  createdAt: string;
};

export type CallRecord = {
  id: string;
  leadId: string;
  campaignId: string;
  workspaceId: string;
  callStatus: CallStatus;
  duration: string;
  durationSeconds: number;
  recordingUrl: string;
  transcript: string;
  shortSummary: string;
  detailedSummary: string;
  classification: LeadCategory;
  conversionScore: number;
  intentScore: number;
  sentiment: "Positive" | "Neutral" | "Negative" | "Mixed";
  tags: string[];
  objections: string[];
  questionsAsked: string[];
  extractedFields: Record<string, string>;
  nextAction: string;
  languageUsed: LanguageMode;
  createdAt: string;
};

export type KnowledgeBaseEntry = {
  id: string;
  workspaceId: string;
  title: string;
  type: "Course context" | "FAQ" | "Objection handling" | "Policy" | "Website page";
  content: string;
  source: string;
  updatedAt: string;
};

export type TrainingAsset = {
  id: string;
  workspaceId: string;
  title: string;
  type: "Manual transcript" | "Audio recording";
  status: "Processed" | "Needs review" | "Queued";
  insights: string[];
  uploadedAt: string;
};

export type FollowUpTask = {
  id: string;
  leadId: string;
  campaignId: string;
  taskType: "Human callback" | "WhatsApp" | "Email" | "SMS" | "CRM update";
  dueDate: string;
  status: "Open" | "Scheduled" | "Done";
  assignedTo: string;
};

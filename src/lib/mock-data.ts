import type {
  Agent,
  CallRecord,
  Campaign,
  FollowUpTask,
  KnowledgeBaseEntry,
  Lead,
  LeadCategory,
  TrainingAsset,
  Workspace,
} from "./types";

export const workspace: Workspace = {
  id: "ws_masters_union",
  companyName: "Masters' Union",
  industry: "Education and admissions",
  website: "https://mastersunion.org",
  subscriptionPlan: "Growth Credits",
  callCreditBalance: 12840,
  businessContext:
    "Undergraduate admissions outreach for the 2027 intake cycle. VoiceLead AI qualifies prospective students and parents for Masters' Union's undergraduate programmes and routes serious candidates to the admissions team.",
  targetCustomers:
    "Class XII students, recent pass-outs, and parents evaluating full-time undergraduate programmes in business, technology, entrepreneurship, psychology, marketing, and related future-facing tracks.",
  geographies: ["Gurugram", "Delhi NCR", "Mumbai", "Bengaluru", "Hyderabad", "Pune"],
  usp: [
    "Learn by doing through real projects and venture-building style experiences",
    "Full-time undergraduate programmes with opt-in residential options",
    "Gurugram campus with industry-focused learning",
    "Class XII eligibility and admissions-led evaluation",
  ],
  complianceMode: "Configurable disclosure",
};

export const agents: Agent[] = [
  {
    id: "agent_aarav",
    workspaceId: workspace.id,
    name: "Aarav Admissions Voice",
    voiceType: "Indian neutral male",
    tone: "Consultative",
    language: "Hinglish",
    speed: "Medium",
    assertiveness: "Balanced",
    disclosure: "Client controlled",
    openingPitch:
      "Hi, am I speaking with {{lead_name}}? I am calling from the Masters' Union admissions team about your interest in the undergraduate programmes for the 2027 intake.",
    instructions: [
      "Confirm whether the prospect is the student or parent.",
      "Ask course interest, current class, location, application timeline, and decision maker involvement.",
      "Offer counselor callback when intent is high or the prospect asks detailed admission questions.",
      "Switch naturally between English and Hinglish when the prospect does.",
    ],
    doNotSay: [
      "Guaranteed admission",
      "Guaranteed placement",
      "Scholarship approval without assessment",
      "Unverified fee or eligibility claims",
    ],
    escalationRules: [
      "Human callback requested",
      "Fee, scholarship, or eligibility dispute",
      "Parent wants detailed counseling",
      "Prospect asks for WhatsApp brochure and deadline",
    ],
  },
];

export const campaigns: Campaign[] = [
  {
    id: "camp_ugp_2027",
    workspaceId: workspace.id,
    campaignName: "UG 2027 Inbound Lead Qualification",
    objective: "Qualify new undergraduate enquiries and book admissions counselor callbacks",
    targetIndustry: "Education - undergraduate admissions",
    language: "Hinglish",
    agentId: "agent_aarav",
    status: "Live",
    leadCount: 1240,
    callsCompleted: 786,
    connectedCalls: 512,
    averageScore: 67,
    hotLeads: 138,
    warmLeads: 224,
    callbackRequests: 171,
    script:
      "Use the approved Masters' Union undergraduate admissions pitch, confirm interest, qualify programme fit and decision-maker involvement, address common concerns, and move high-intent leads to counselor callback or WhatsApp brochure.",
    qualificationQuestions: [
      "Are you the student or a parent?",
      "Which undergraduate programme or career direction are you exploring?",
      "Which class are you currently in, and when do you plan to apply?",
      "What city are you based in?",
      "Have you shortlisted other colleges?",
      "Would you like an admissions counselor to call you?",
    ],
    scoringRules: [
      "+20 asks about admission process or deadlines",
      "+18 agrees to counselor callback",
      "+15 parent/student decision maker is on call",
      "+12 asks for WhatsApp brochure",
      "-20 says not interested",
      "-35 asks to never call again",
    ],
    handoffRules: [
      "Score above 75",
      "Parent asks fee or scholarship question",
      "Student wants campus visit or counselor callback",
      "Prospect requests WhatsApp follow-up",
    ],
    createdAt: "2026-04-28",
  },
  {
    id: "camp_webinar_may",
    workspaceId: workspace.id,
    campaignName: "UG Admissions Masterclass Invite",
    objective: "Invite warm leads to an undergraduate admissions masterclass",
    targetIndustry: "Education - events",
    language: "English",
    agentId: "agent_aarav",
    status: "Ready",
    leadCount: 420,
    callsCompleted: 92,
    connectedCalls: 61,
    averageScore: 59,
    hotLeads: 24,
    warmLeads: 31,
    callbackRequests: 22,
    script:
      "Confirm interest in the undergraduate admissions cycle, invite the lead to the upcoming masterclass, and capture availability plus preferred follow-up channel.",
    qualificationQuestions: [
      "Are you available for a short online session this week?",
      "Would your parent like to join?",
      "Should we send the invite on WhatsApp?",
    ],
    scoringRules: [
      "+18 confirms masterclass interest",
      "+12 shares parent availability",
      "+10 asks for WhatsApp invite",
      "-15 says already enrolled elsewhere",
    ],
    handoffRules: ["Masterclass confirmed", "Parent asks for counselor", "High-intent scholarship question"],
    createdAt: "2026-04-30",
  },
];

export const leads: Lead[] = [
  {
    id: "lead_aanya",
    workspaceId: workspace.id,
    campaignId: "camp_ugp_2027",
    name: "Aanya Mehra",
    phone: "+91 98765 41021",
    email: "aanya.mehra@example.com",
    city: "Gurugram",
    source: "Website form",
    leadType: "Student",
    notes: "Downloaded undergraduate programme brochure.",
    customFields: {
      currentClass: "Class 12",
      interest: "Business and entrepreneurship",
      parentInvolved: "Yes",
      preferredChannel: "WhatsApp",
    },
    callStatus: "Connected",
    classification: "Hot",
    conversionScore: 88,
    tags: ["High intent", "Needs counselor", "Wants WhatsApp details", "Decision maker"],
    assignedTo: "Rhea, Admissions",
    nextAction: "Counselor callback today and WhatsApp brochure",
    followUpStatus: "Open",
    createdAt: "2026-04-30T10:10:00+05:30",
  },
  {
    id: "lead_rohan",
    workspaceId: workspace.id,
    campaignId: "camp_ugp_2027",
    name: "Rohan Kapoor",
    phone: "+91 98111 25344",
    email: "rohan.k@example.com",
    city: "Mumbai",
    source: "Meta lead form",
    leadType: "Student",
    notes: "Asked about admission criteria.",
    customFields: {
      currentClass: "Class 11",
      interest: "Finance and startups",
      parentInvolved: "No",
      preferredChannel: "Email",
    },
    callStatus: "Connected",
    classification: "Warm",
    conversionScore: 64,
    tags: ["Interested", "Not decision maker", "Follow up next week"],
    assignedTo: "Unassigned",
    nextAction: "Send course overview and schedule parent callback",
    followUpStatus: "Scheduled",
    createdAt: "2026-04-30T11:32:00+05:30",
  },
  {
    id: "lead_meera",
    workspaceId: workspace.id,
    campaignId: "camp_ugp_2027",
    name: "Meera Iyer",
    phone: "+91 99880 77211",
    email: "meera.iyer@example.com",
    city: "Bengaluru",
    source: "Education fair",
    leadType: "Parent",
    notes: "Parent asked for fee and scholarship details.",
    customFields: {
      currentClass: "Class 12",
      interest: "Undergraduate business",
      parentInvolved: "Yes",
      preferredChannel: "Phone",
    },
    callStatus: "Connected",
    classification: "Needs Human Follow-Up",
    conversionScore: 73,
    tags: ["Human callback requested", "Price sensitive", "Scholarship question"],
    assignedTo: "Aditya, Admissions",
    nextAction: "Senior counselor to call with fee and scholarship guidance",
    followUpStatus: "Open",
    createdAt: "2026-04-30T12:25:00+05:30",
  },
  {
    id: "lead_kabir",
    workspaceId: workspace.id,
    campaignId: "camp_ugp_2027",
    name: "Kabir Sethi",
    phone: "+91 90000 44119",
    email: "kabir.sethi@example.com",
    city: "Delhi",
    source: "Counselor referral",
    leadType: "Student",
    notes: "Busy during first call.",
    customFields: {
      currentClass: "Class 12",
      interest: "Unsure",
      parentInvolved: "Unknown",
      preferredChannel: "Call",
    },
    callStatus: "Scheduled",
    classification: "Call Back Later",
    conversionScore: 48,
    tags: ["Follow up tomorrow", "Busy"],
    assignedTo: "VoiceLead AI",
    nextAction: "Retry at 6:30 PM",
    followUpStatus: "Scheduled",
    createdAt: "2026-04-30T13:18:00+05:30",
  },
  {
    id: "lead_sana",
    workspaceId: workspace.id,
    campaignId: "camp_ugp_2027",
    name: "Sana Khan",
    phone: "+91 91234 88991",
    email: "sana.khan@example.com",
    city: "Lucknow",
    source: "Website form",
    leadType: "Student",
    notes: "Not evaluating undergraduate programs.",
    customFields: {
      currentClass: "Graduated",
      interest: "MBA",
      parentInvolved: "No",
      preferredChannel: "None",
    },
    callStatus: "Connected",
    classification: "Wrong Target Group",
    conversionScore: 18,
    tags: ["Wrong TG", "Postgraduate interest"],
    assignedTo: "Unassigned",
    nextAction: "Exclude from UGP campaign",
    followUpStatus: "Done",
    createdAt: "2026-04-30T14:02:00+05:30",
  },
  {
    id: "lead_arjun",
    workspaceId: workspace.id,
    campaignId: "camp_ugp_2027",
    name: "Arjun Nair",
    phone: "+91 93000 55672",
    email: "arjun.nair@example.com",
    city: "Kochi",
    source: "Google Ads",
    leadType: "Parent",
    notes: "Asked not to be called again.",
    customFields: {
      currentClass: "Unknown",
      interest: "Unknown",
      parentInvolved: "Yes",
      preferredChannel: "None",
    },
    callStatus: "Connected",
    classification: "Do Not Contact",
    conversionScore: 0,
    tags: ["DNC", "Opt-out"],
    assignedTo: "Compliance",
    nextAction: "Suppress from all future campaigns",
    followUpStatus: "Done",
    createdAt: "2026-04-30T14:44:00+05:30",
  },
];

export const calls: CallRecord[] = [
  {
    id: "call_aanya_01",
    leadId: "lead_aanya",
    campaignId: "camp_ugp_2027",
    workspaceId: workspace.id,
    callStatus: "Connected",
    duration: "4m 18s",
    durationSeconds: 258,
    recordingUrl: "/recordings/mock-aanya.mp3",
    languageUsed: "Hinglish",
    transcript:
      "Agent: Hi Aanya, main Masters' Union admissions team se call kar raha hoon about the undergraduate programmes. Kya ye baat karne ka sahi time hai? Lead: Yes, I filled the form. Agent: Great. Are you the student applying for undergraduate programs? Lead: Yes, class 12. I wanted to know about the business program and admission process. Agent: Sure. Aap mainly entrepreneurship, finance, ya technology side explore kar rahe ho? Lead: Entrepreneurship. My parents also want to speak to someone. Can you send details on WhatsApp? Agent: Absolutely. I can arrange a counselor callback and send the brochure. Lead: Today evening works.",
    shortSummary:
      "Aanya is a high-intent Class 12 student interested in entrepreneurship and requested WhatsApp details plus counselor callback today.",
    detailedSummary:
      "The prospect confirmed she submitted the website form and is exploring Masters' Union undergraduate programmes. She is the student decision participant, her parents are involved, and she asked about the admission process. She requested WhatsApp follow-up and agreed to a same-day counselor callback, making her a strong admissions lead.",
    classification: "Hot",
    conversionScore: 88,
    intentScore: 91,
    sentiment: "Positive",
    tags: ["High intent", "Needs counselor", "Wants WhatsApp details", "Decision maker"],
    objections: ["Needs parent alignment"],
    questionsAsked: ["What is the admission process?", "Can you send details on WhatsApp?"],
    extractedFields: {
      currentClass: "Class 12",
      interest: "Entrepreneurship",
      timeline: "Current admissions cycle",
      decisionMaker: "Student plus parents",
      preferredCallback: "Today evening",
    },
    nextAction: "Assign counselor callback today and send WhatsApp brochure.",
    createdAt: "2026-04-30T10:18:00+05:30",
  },
  {
    id: "call_rohan_01",
    leadId: "lead_rohan",
    campaignId: "camp_ugp_2027",
    workspaceId: workspace.id,
    callStatus: "Connected",
    duration: "2m 52s",
    durationSeconds: 172,
    recordingUrl: "/recordings/mock-rohan.mp3",
    languageUsed: "English",
    transcript:
      "Agent: Hi Rohan, this is regarding your interest in Masters' Union undergraduate programmes. Is this a good time? Lead: Yes, quick call. Agent: Are you currently in class 11 or 12? Lead: Class 11. I am just comparing options. Agent: Which direction are you considering? Lead: Finance, maybe startups. My parents will decide later. Agent: Would it help if we send a course overview and schedule a parent call next week? Lead: Send email first.",
    shortSummary:
      "Rohan is early-stage and comparing undergraduate options. He wants course details by email before involving parents.",
    detailedSummary:
      "The prospect is in Class 11, interested in finance and startups, and is still comparing colleges. He is not the sole decision maker and did not commit to a counselor callback yet. Email nurture is appropriate before a parent-oriented follow-up.",
    classification: "Warm",
    conversionScore: 64,
    intentScore: 62,
    sentiment: "Neutral",
    tags: ["Interested", "Not decision maker", "Follow up next week"],
    objections: ["Too early in decision cycle"],
    questionsAsked: ["Can you send the overview first?"],
    extractedFields: {
      currentClass: "Class 11",
      interest: "Finance and startups",
      timeline: "Next admissions cycle",
      decisionMaker: "Parents involved later",
    },
    nextAction: "Send course overview by email and schedule parent follow-up next week.",
    createdAt: "2026-04-30T11:35:00+05:30",
  },
  {
    id: "call_meera_01",
    leadId: "lead_meera",
    campaignId: "camp_ugp_2027",
    workspaceId: workspace.id,
    callStatus: "Connected",
    duration: "5m 07s",
    durationSeconds: 307,
    recordingUrl: "/recordings/mock-meera.mp3",
    languageUsed: "Hinglish",
    transcript:
      "Agent: Namaste, am I speaking with Meera ma'am? This is from the Masters' Union admissions desk. Lead: Yes, I am the parent. Agent: Thank you. Are you exploring undergraduate programmes for your child? Lead: Yes, but I want clarity on fees, scholarships, and whether it is worth it compared to other colleges. Agent: I can share approved details and arrange a senior counselor. Lead: Please have someone call, I don't want generic information. Agent: Of course. What time works? Lead: Tomorrow after 11.",
    shortSummary:
      "Parent is interested but wants senior counseling on fees, scholarships, and comparison with alternatives.",
    detailedSummary:
      "Meera is a parent and decision influencer for a Class 12 student. She is engaged, but her main objections are pricing, scholarship clarity, and program value versus other institutions. She explicitly requested a human callback, so this lead should be escalated to a senior counselor.",
    classification: "Needs Human Follow-Up",
    conversionScore: 73,
    intentScore: 77,
    sentiment: "Mixed",
    tags: ["Human callback requested", "Price sensitive", "Scholarship question"],
    objections: ["Fee clarity", "Scholarship eligibility", "Comparison with other colleges"],
    questionsAsked: ["What are the fees?", "Are scholarships available?", "How is it better than other colleges?"],
    extractedFields: {
      callerRole: "Parent",
      timeline: "UG intake cycle",
      budgetConcern: "High",
      callbackWindow: "Tomorrow after 11 AM",
    },
    nextAction: "Senior counselor callback tomorrow after 11 AM.",
    createdAt: "2026-04-30T12:31:00+05:30",
  },
];

export const knowledgeBaseEntries: KnowledgeBaseEntry[] = [
  {
    id: "kb_course",
    workspaceId: workspace.id,
    title: "UGP 2027 Course Positioning",
    type: "Course context",
    source: "Official Masters' Union website context",
    content:
      "Position Masters' Union's undergraduate offering as full-time, applied, and industry-focused for Class XII students and recent pass-outs exploring business, technology, entrepreneurship, psychology, marketing, and related career directions. Avoid unverified admission, fee, placement, or scholarship claims.",
    updatedAt: "2026-04-30",
  },
  {
    id: "kb_objections",
    workspaceId: workspace.id,
    title: "Admissions Objection Handling",
    type: "Objection handling",
    source: "Manual reachout transcripts",
    content:
      "For fee concerns, acknowledge the question and route to a counselor. For comparison with other colleges, ask what criteria the family is using before explaining approved differentiators.",
    updatedAt: "2026-04-30",
  },
  {
    id: "kb_faq",
    workspaceId: workspace.id,
    title: "Frequently Asked Questions",
    type: "FAQ",
    source: "Official admissions page and demo assumptions",
    content:
      "Common questions include Class XII eligibility, application process, campus experience in Gurugram, opt-in residential options, parent counseling, scholarship criteria, and WhatsApp brochure availability.",
    updatedAt: "2026-04-29",
  },
];

export const trainingAssets: TrainingAsset[] = [
  {
    id: "asset_transcripts_april",
    workspaceId: workspace.id,
    title: "April manual admissions call transcripts",
    type: "Manual transcript",
    status: "Processed",
    insights: [
      "Parents ask fee questions earlier than students.",
      "Hinglish openings increase first 20-second engagement.",
      "WhatsApp brochure requests correlate with counselor callback acceptance.",
    ],
    uploadedAt: "2026-04-30T09:10:00+05:30",
  },
  {
    id: "asset_audio_fair",
    workspaceId: workspace.id,
    title: "Education fair follow-up audio set",
    type: "Audio recording",
    status: "Needs review",
    insights: [
      "Audio needs consent validation before model refinement.",
      "Several conversations include scholarship objections.",
    ],
    uploadedAt: "2026-04-30T15:20:00+05:30",
  },
];

export const followUpTasks: FollowUpTask[] = [
  {
    id: "task_aanya_whatsapp",
    leadId: "lead_aanya",
    campaignId: "camp_ugp_2027",
    taskType: "WhatsApp",
    dueDate: "2026-04-30T18:00:00+05:30",
    status: "Open",
    assignedTo: "Admissions Ops",
  },
  {
    id: "task_meera_callback",
    leadId: "lead_meera",
    campaignId: "camp_ugp_2027",
    taskType: "Human callback",
    dueDate: "2026-05-01T11:00:00+05:30",
    status: "Scheduled",
    assignedTo: "Aditya, Admissions",
  },
];

export const leadCategories: LeadCategory[] = [
  "Hot",
  "Warm",
  "Cold",
  "Not Interested",
  "Wrong Target Group",
  "Call Back Later",
  "Invalid Number",
  "Converted",
  "Needs Human Follow-Up",
  "Do Not Contact",
];

export function getLeadById(id: string) {
  return leads.find((lead) => lead.id === id);
}

export function getCallById(id: string) {
  return calls.find((call) => call.id === id);
}

export function getCallsForLead(leadId: string) {
  return calls.filter((call) => call.leadId === leadId);
}

export function getCampaignById(id: string) {
  return campaigns.find((campaign) => campaign.id === id);
}

export const dashboardMetrics = [
  { label: "Total leads", value: "1,240", delta: "+18% this week" },
  { label: "Calls completed", value: "786", delta: "512 connected" },
  { label: "Hot leads", value: "138", delta: "17.6% of completed calls" },
  { label: "Callback requests", value: "171", delta: "Mostly parents" },
  { label: "Avg score", value: "67", delta: "+9 after script update" },
  { label: "Credits left", value: "12,840", delta: "Monthly credits" },
];

export const objectionTrends = [
  { label: "Fee and scholarships", count: 148, share: 31 },
  { label: "Compare with other colleges", count: 96, share: 20 },
  { label: "Need parent discussion", count: 83, share: 17 },
  { label: "Too early to decide", count: 61, share: 13 },
  { label: "Asked for WhatsApp first", count: 54, share: 11 },
];

export const sourcePerformance = [
  { source: "Website form", leads: 420, score: 74, hotRate: "24%" },
  { source: "Meta lead form", leads: 318, score: 61, hotRate: "15%" },
  { source: "Education fair", leads: 212, score: 69, hotRate: "20%" },
  { source: "Google Ads", leads: 186, score: 58, hotRate: "11%" },
  { source: "Counselor referral", leads: 104, score: 79, hotRate: "29%" },
];

export const demoReadiness = [
  {
    label: "Buyer-facing demo",
    status: "Ready",
    detail: "Use the guided preview from landing to dashboard, leads, and call intelligence.",
  },
  {
    label: "Real-call testing",
    status: "Env needed",
    detail: "Plivo hook is wired; set provider env vars before placing live calls.",
  },
  {
    label: "Feedback capture",
    status: "Ready",
    detail: "Share the feedback page with admissions leaders after they explore the demo.",
  },
  {
    label: "Compliance review",
    status: "Drafted",
    detail: "DNC, opt-out, calling window, and disclosure controls are represented in UX and schema.",
  },
];

export const buyerDemoPath = [
  {
    step: "1",
    title: "Start with the promise",
    href: "/",
    detail: "Show that this is sales intelligence, not a commodity calling bot.",
  },
  {
    step: "2",
    title: "Open the cockpit",
    href: "/dashboard",
    detail: "Point to qualification metrics, objection trends, and follow-up queue.",
  },
  {
    step: "3",
    title: "Inspect one lead",
    href: "/leads/lead_aanya",
    detail: "Show contact context, extracted fields, tags, score, and next action.",
  },
  {
    step: "4",
    title: "Review call intelligence",
    href: "/calls/call_aanya_01",
    detail: "Use the transcript and summary to prove why the score is trustworthy.",
  },
  {
    step: "5",
    title: "Collect feedback",
    href: "/feedback",
    detail: "Ask whether they would run a 500-lead pilot and what feels missing.",
  },
];

export const feedbackQuestions = [
  "Is the dashboard clear enough for an admissions manager to understand in under one minute?",
  "Would the call summary and scoring be trusted by a counselor?",
  "Which workflow feels most valuable: calling, WhatsApp follow-up, lead scoring, or objection analytics?",
  "What would block you from running a 500-lead pilot?",
  "Which integrations would you need first: CRM, WhatsApp, website forms, or telephony provider?",
];

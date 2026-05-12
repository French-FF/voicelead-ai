import "server-only";

import type { LeadCategory } from "./types";
import { getOpenAIModel } from "./config";

export type CallIntelligence = {
  shortSummary: string;
  detailedSummary: string;
  keyPoints: string[];
  painPoints: string[];
  objections: string[];
  questionsAsked: string[];
  productInterest: string;
  urgencyLevel: "Low" | "Medium" | "High";
  budgetSignal: "None" | "Low" | "Medium" | "High";
  timelineSignal: string;
  decisionMakerStatus: string;
  followUpRequired: boolean;
  recommendedNextAction: string;
  classification: LeadCategory;
  conversionScore: number;
  intentScore: number;
  sentiment: "Positive" | "Neutral" | "Negative" | "Mixed";
  tags: string[];
  extractedFields: Record<string, string>;
};

const categories: LeadCategory[] = [
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

function scoreTranscript(transcript: string) {
  const text = transcript.toLowerCase();
  let score = 42;

  if (text.includes("whatsapp")) score += 12;
  if (text.includes("counselor") || text.includes("callback")) score += 18;
  if (text.includes("admission") || text.includes("apply")) score += 14;
  if (text.includes("parent")) score += 10;
  if (text.includes("fee") || text.includes("scholarship")) score += 6;
  if (text.includes("not interested")) score -= 35;
  if (text.includes("wrong number")) score = 5;
  if (text.includes("don't call") || text.includes("do not call")) score = 0;

  return Math.max(0, Math.min(100, score));
}

function classify(score: number, transcript: string): LeadCategory {
  const text = transcript.toLowerCase();
  if (text.includes("don't call") || text.includes("do not call")) {
    return "Do Not Contact";
  }
  if (text.includes("wrong number") || text.includes("invalid number")) {
    return "Invalid Number";
  }
  if (text.includes("not interested")) return "Not Interested";
  if (text.includes("call later") || text.includes("busy")) return "Call Back Later";
  if (text.includes("callback") || text.includes("counselor")) {
    return score > 72 ? "Hot" : "Needs Human Follow-Up";
  }
  if (score > 74) return "Hot";
  if (score > 49) return "Warm";
  return "Cold";
}

export function fallbackAnalyzeTranscript(transcript: string): CallIntelligence {
  const conversionScore = scoreTranscript(transcript);
  const classification = classify(conversionScore, transcript);
  const lower = transcript.toLowerCase();

  return {
    shortSummary:
      "Rule-based pilot summary generated from transcript because OPENAI_API_KEY is not configured.",
    detailedSummary:
      "The call was analyzed for admissions intent, parent involvement, WhatsApp request, callback request, objections, pricing questions, and opt-out language.",
    keyPoints: [
      lower.includes("whatsapp")
        ? "Prospect requested WhatsApp follow-up."
        : "Preferred follow-up channel needs confirmation.",
      lower.includes("parent")
        ? "Parent involvement was mentioned."
        : "Decision-maker involvement is unclear.",
    ],
    painPoints: lower.includes("fee") ? ["Fee clarity"] : [],
    objections: lower.includes("fee") ? ["Fee or scholarship concern"] : [],
    questionsAsked: lower.includes("fee") ? ["Asked about fee or scholarship"] : [],
    productInterest: lower.includes("admission") ? "UG admissions" : "Unknown",
    urgencyLevel: conversionScore > 74 ? "High" : conversionScore > 49 ? "Medium" : "Low",
    budgetSignal: lower.includes("fee") ? "Medium" : "None",
    timelineSignal: lower.includes("today") ? "Same day" : "Not captured",
    decisionMakerStatus: lower.includes("parent")
      ? "Student plus parent involved"
      : "Decision maker unclear",
    followUpRequired: conversionScore > 50,
    recommendedNextAction:
      conversionScore > 70
        ? "Assign counselor and send approved WhatsApp follow-up."
        : "Add to nurture queue and retry within the allowed calling window.",
    classification,
    conversionScore,
    intentScore: Math.min(100, conversionScore + 3),
    sentiment:
      classification === "Not Interested" || classification === "Do Not Contact"
        ? "Negative"
        : conversionScore > 70
          ? "Positive"
          : "Neutral",
    tags: [
      lower.includes("whatsapp") ? "Wants WhatsApp details" : "Needs nurture",
      lower.includes("fee") ? "Price sensitive" : "No pricing concern detected",
      lower.includes("parent") ? "Parent involved" : "Decision maker unclear",
    ],
    extractedFields: {
      preferredChannel: lower.includes("whatsapp") ? "WhatsApp" : "Unknown",
      decisionMaker: lower.includes("parent") ? "Parent involved" : "Unknown",
    },
  };
}

function extractOutputText(data: {
  output_text?: string;
  output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
}) {
  if (data.output_text) return data.output_text;

  return data.output
    ?.flatMap((item) => item.content ?? [])
    .find((content) => content.type === "output_text" && content.text)
    ?.text;
}

export async function analyzeTranscript(input: {
  transcript: string;
  businessContext?: string;
  campaignGoal?: string;
}) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      configured: false,
      intelligence: fallbackAnalyzeTranscript(input.transcript),
    };
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: getOpenAIModel(),
      store: false,
      instructions:
        "You analyze Indian admissions outbound calls. Return only JSON matching the schema. Stay inside the supplied business context, do not invent fees, scholarships, admissions guarantees, or claims. Treat opt-out language as Do Not Contact.",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Business context: ${input.businessContext || "Masters' Union UGP 2027 admissions outreach"}\nCampaign goal: ${input.campaignGoal || "Qualify undergraduate admissions leads and recommend follow-up"}\nTranscript:\n${input.transcript}`,
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "call_intelligence",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: [
              "shortSummary",
              "detailedSummary",
              "keyPoints",
              "painPoints",
              "objections",
              "questionsAsked",
              "productInterest",
              "urgencyLevel",
              "budgetSignal",
              "timelineSignal",
              "decisionMakerStatus",
              "followUpRequired",
              "recommendedNextAction",
              "classification",
              "conversionScore",
              "intentScore",
              "sentiment",
              "tags",
              "extractedFields",
            ],
            properties: {
              shortSummary: { type: "string" },
              detailedSummary: { type: "string" },
              keyPoints: { type: "array", items: { type: "string" } },
              painPoints: { type: "array", items: { type: "string" } },
              objections: { type: "array", items: { type: "string" } },
              questionsAsked: { type: "array", items: { type: "string" } },
              productInterest: { type: "string" },
              urgencyLevel: { type: "string", enum: ["Low", "Medium", "High"] },
              budgetSignal: {
                type: "string",
                enum: ["None", "Low", "Medium", "High"],
              },
              timelineSignal: { type: "string" },
              decisionMakerStatus: { type: "string" },
              followUpRequired: { type: "boolean" },
              recommendedNextAction: { type: "string" },
              classification: { type: "string", enum: categories },
              conversionScore: { type: "integer", minimum: 0, maximum: 100 },
              intentScore: { type: "integer", minimum: 0, maximum: 100 },
              sentiment: {
                type: "string",
                enum: ["Positive", "Neutral", "Negative", "Mixed"],
              },
              tags: { type: "array", items: { type: "string" } },
              extractedFields: {
                type: "object",
                additionalProperties: false,
                required: [
                  "currentClass",
                  "interest",
                  "timeline",
                  "decisionMaker",
                  "preferredChannel",
                  "callbackWindow",
                  "city",
                  "budgetConcern",
                ],
                properties: {
                  currentClass: { type: "string" },
                  interest: { type: "string" },
                  timeline: { type: "string" },
                  decisionMaker: { type: "string" },
                  preferredChannel: { type: "string" },
                  callbackWindow: { type: "string" },
                  city: { type: "string" },
                  budgetConcern: { type: "string" },
                },
              },
            },
          },
        },
      },
    }),
  });

  const data = await response.json().catch(() => ({}));
  const output = extractOutputText(data);

  if (!response.ok || !output) {
    return {
      configured: true,
      error: data,
      intelligence: fallbackAnalyzeTranscript(input.transcript),
    };
  }

  return {
    configured: true,
    intelligence: JSON.parse(output) as CallIntelligence,
  };
}

export async function generateNextVoiceTurn(input: {
  leadName?: string;
  transcript: string;
  businessContext?: string;
}) {
  const lower = input.transcript.toLowerCase();
  if (
    lower.includes("don't call") ||
    lower.includes("do not call") ||
    lower.includes("not interested")
  ) {
    return {
      done: true,
      text: "Understood, sorry for the interruption. We will update our records and not call you again. Thank you.",
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    return {
      done: lower.split("Lead:").length > 2,
      text:
        lower.includes("whatsapp") || lower.includes("callback")
          ? "Thanks. I will ask an admissions counselor to follow up and share the approved details on WhatsApp. Have a good day."
          : "Thanks for sharing. Are you the student or a parent, and would you like an admissions counselor to call you back?",
    };
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: getOpenAIModel(),
      store: false,
      instructions:
        "You are a polite Hinglish/English admissions calling assistant for Masters' Union UGP 2027. Keep replies under 24 words. Ask one question at a time. Do not invent fees, scholarships, placements, or guarantees. End if the prospect opts out.",
      input: `Lead name: ${input.leadName || "there"}\nContext: ${input.businessContext || "Qualify student/parent interest, programme direction, city, timeline, and callback need."}\nTranscript so far:\n${input.transcript}\nReturn JSON with keys text and done.`,
      text: { format: { type: "json_object" } },
    }),
  });

  const data = await response.json().catch(() => ({}));
  const output = extractOutputText(data);

  if (!response.ok || !output) {
    return {
      done: false,
      text: "Thanks. Are you exploring undergraduate admissions for yourself or for your child?",
    };
  }

  return JSON.parse(output) as { text: string; done: boolean };
}

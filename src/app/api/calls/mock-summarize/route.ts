import { NextResponse } from "next/server";

function scoreTranscript(transcript: string) {
  const text = transcript.toLowerCase();
  let score = 42;

  if (text.includes("whatsapp")) score += 12;
  if (text.includes("counselor") || text.includes("callback")) score += 18;
  if (text.includes("admission") || text.includes("apply")) score += 14;
  if (text.includes("parent")) score += 10;
  if (text.includes("not interested")) score -= 35;
  if (text.includes("don't call") || text.includes("do not call")) score = 0;
  if (text.includes("fee") || text.includes("scholarship")) score += 6;

  return Math.max(0, Math.min(100, score));
}

function classify(score: number, transcript: string) {
  const text = transcript.toLowerCase();
  if (text.includes("don't call") || text.includes("do not call")) {
    return "Do Not Contact";
  }
  if (text.includes("not interested")) return "Not Interested";
  if (text.includes("callback") || text.includes("counselor")) {
    return score > 72 ? "Hot" : "Needs Human Follow-Up";
  }
  if (score > 74) return "Hot";
  if (score > 49) return "Warm";
  return "Cold";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const transcript = String(body.transcript ?? "");

  if (!transcript.trim()) {
    return NextResponse.json(
      { error: "Provide a transcript for mock summarization." },
      { status: 400 },
    );
  }

  const conversionScore = scoreTranscript(transcript);
  const classification = classify(conversionScore, transcript);

  return NextResponse.json({
    shortSummary:
      "Mock summary generated from transcript. Replace with LLM summarization once OPENAI_API_KEY is configured.",
    detailedSummary:
      "The call was analyzed for admissions intent, parent involvement, WhatsApp request, callback request, objections, and opt-out language.",
    classification,
    conversionScore,
    tags: [
      transcript.toLowerCase().includes("whatsapp") ? "Wants WhatsApp details" : "Needs nurture",
      transcript.toLowerCase().includes("fee") ? "Price sensitive" : "No pricing concern detected",
      transcript.toLowerCase().includes("parent") ? "Parent involved" : "Decision maker unclear",
    ],
    nextAction:
      conversionScore > 70
        ? "Assign counselor and send approved WhatsApp follow-up."
        : "Add to nurture queue and retry within the allowed calling window.",
  });
}

import { NextResponse } from "next/server";
import { analyzeTranscript } from "@/lib/call-intelligence";
import { requireApiSession, unauthorized } from "@/lib/auth";
import { updateCallRecord } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    requireApiSession(request);
    const body = await request.json().catch(() => ({}));
    const transcript = String(body.transcript ?? "");

    if (!transcript.trim()) {
      return NextResponse.json(
        { error: "Provide a transcript for summarization." },
        { status: 400 },
      );
    }

    const result = await analyzeTranscript({
      transcript,
      businessContext: String(body.businessContext ?? ""),
      campaignGoal: String(body.campaignGoal ?? ""),
    });
    const intelligence = result.intelligence;

    if (body.callId) {
      await updateCallRecord(String(body.callId), {
        callStatus: "Connected",
        transcript,
        shortSummary: intelligence.shortSummary,
        detailedSummary: intelligence.detailedSummary,
        classification: intelligence.classification,
        conversionScore: intelligence.conversionScore,
        intentScore: intelligence.intentScore,
        sentiment: intelligence.sentiment,
        tags: intelligence.tags,
        objections: intelligence.objections,
        extractedFields: {
          ...intelligence.extractedFields,
          questionsAsked: intelligence.questionsAsked.join("; "),
          keyPoints: intelligence.keyPoints.join("; "),
          painPoints: intelligence.painPoints.join("; "),
        },
        nextAction: intelligence.recommendedNextAction,
      });
    }

    return NextResponse.json({
      configured: result.configured,
      ...intelligence,
      nextAction: intelligence.recommendedNextAction,
      error: result.error,
    });
  } catch {
    return unauthorized();
  }
}

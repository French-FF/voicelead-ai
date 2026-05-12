import { analyzeTranscript, generateNextVoiceTurn } from "@/lib/call-intelligence";
import { getCall, getLead, markDoNotContact, updateCallRecord } from "@/lib/store";

export const runtime = "nodejs";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function readSpeech(payload: Record<string, FormDataEntryValue> | Record<string, unknown>) {
  return String(
    payload.Speech ||
      payload.SpeechText ||
      payload.speech ||
      payload.speech_text ||
      payload.Digits ||
      "",
  ).trim();
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const callId = url.searchParams.get("callId") ?? "";
  const leadId = url.searchParams.get("leadId") ?? "";
  const campaignId = url.searchParams.get("campaignId") ?? "";
  const turn = Number(url.searchParams.get("turn") ?? "1");
  const formData = await request.formData().catch(() => null);
  const payload = formData
    ? Object.fromEntries(formData.entries())
    : await request.json().catch(() => ({}));
  const speech = readSpeech(payload);
  const lead = leadId ? await getLead(leadId) : null;
  const existingCall = callId ? await getCall(callId) : null;
  const nextTranscript = [
    existingCall?.transcript,
    speech ? `Lead: ${speech}` : "Lead: [No response captured]",
  ]
    .filter(Boolean)
    .join("\n");

  const next = await generateNextVoiceTurn({
    leadName: lead?.name,
    transcript: nextTranscript,
  });
  const agentLine = `Agent: ${next.text}`;
  const transcript = `${nextTranscript}\n${agentLine}`;

  if (callId) {
    await updateCallRecord(callId, {
      callStatus: next.done ? "Connected" : "In Progress",
      transcript,
    });
  }

  const lower = transcript.toLowerCase();
  if (
    lead &&
    (lower.includes("don't call") || lower.includes("do not call") || lower.includes("never call"))
  ) {
    await markDoNotContact(lead.workspaceId, lead.phone, "Prospect opted out during call", lead.id);
  }

  if (next.done || turn >= 3) {
    const result = await analyzeTranscript({ transcript });
    const intelligence = result.intelligence;
    if (callId) {
      await updateCallRecord(callId, {
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
        },
        nextAction: intelligence.recommendedNextAction,
      });
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Speak language="en-IN" voice="WOMAN">${escapeXml(next.text)}</Speak>
</Response>`;
    return new Response(xml, { headers: { "Content-Type": "application/xml" } });
  }

  const inputUrl = `${url.origin}/api/webhooks/plivo/input?callId=${callId}&leadId=${leadId}&campaignId=${campaignId}&turn=${turn + 1}`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <GetInput action="${escapeXml(inputUrl)}" method="POST" inputType="speech" language="en-IN" speechEndTimeout="1" timeout="7">
    <Speak language="en-IN" voice="WOMAN">${escapeXml(next.text)}</Speak>
  </GetInput>
  <Speak language="en-IN" voice="WOMAN">Thanks, we will follow up with the admissions team. Have a good day.</Speak>
</Response>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}

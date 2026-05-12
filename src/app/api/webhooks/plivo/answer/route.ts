import { getLead } from "@/lib/store";

export const runtime = "nodejs";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const callId = url.searchParams.get("callId") ?? "";
  const leadId = url.searchParams.get("leadId") ?? "";
  const campaignId = url.searchParams.get("campaignId") ?? "";
  const lead = leadId ? await getLead(leadId) : null;
  const name = lead?.name?.split(" ")[0] ?? "there";
  const inputUrl = `${url.origin}/api/webhooks/plivo/input?callId=${callId}&leadId=${leadId}&campaignId=${campaignId}&turn=1`;
  const recordingUrl = `${url.origin}/api/webhooks/plivo/status?callId=${callId}`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <GetInput action="${escapeXml(inputUrl)}" method="POST" inputType="speech" language="en-IN" speechEndTimeout="1" timeout="7">
    <Speak language="en-IN" voice="WOMAN">
      Hi ${escapeXml(name)}, this is the Masters Union admissions desk calling about the undergraduate programmes for the 2027 intake. Is this a good time to speak?
    </Speak>
  </GetInput>
  <Speak language="en-IN" voice="WOMAN">No worries, we will try another time. Thank you.</Speak>
  <Record action="${escapeXml(recordingUrl)}" method="POST" maxLength="180" redirect="false" />
</Response>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

export async function GET() {
  return new Response("Use POST", { status: 405 });
}

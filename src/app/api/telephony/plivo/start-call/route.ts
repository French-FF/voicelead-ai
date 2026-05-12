import { NextResponse } from "next/server";

type StartCallRequest = {
  to?: string;
  leadId?: string;
  campaignId?: string;
};

function missingEnv() {
  return [
    "PLIVO_AUTH_ID",
    "PLIVO_AUTH_TOKEN",
    "PLIVO_FROM_NUMBER",
    "APP_BASE_URL",
  ].filter((key) => !process.env[key]);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as StartCallRequest;
  const missing = missingEnv();

  if (!body.to) {
    return NextResponse.json({ error: "Missing destination number." }, { status: 400 });
  }

  if (missing.length) {
    return NextResponse.json({
      configured: false,
      provider: "plivo",
      missing,
      dryRunPayload: {
        from: process.env.PLIVO_FROM_NUMBER ?? "+91XXXXXXXXXX",
        to: body.to,
        answer_url: `${process.env.APP_BASE_URL ?? "https://example.com"}/api/webhooks/plivo/answer`,
        hangup_url: `${process.env.APP_BASE_URL ?? "https://example.com"}/api/webhooks/plivo/status`,
      },
      next: "Set Plivo env vars to place a real test call.",
    });
  }

  const authId = process.env.PLIVO_AUTH_ID!;
  const authToken = process.env.PLIVO_AUTH_TOKEN!;
  const baseUrl = process.env.APP_BASE_URL!;
  const credentials = Buffer.from(`${authId}:${authToken}`).toString("base64");

  const response = await fetch(`https://api.plivo.com/v1/Account/${authId}/Call/`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.PLIVO_FROM_NUMBER,
      to: body.to,
      answer_url: `${baseUrl}/api/webhooks/plivo/answer?leadId=${body.leadId ?? ""}&campaignId=${body.campaignId ?? ""}`,
      answer_method: "POST",
      hangup_url: `${baseUrl}/api/webhooks/plivo/status`,
      hangup_method: "POST",
    }),
  });

  const data = await response.json().catch(() => ({}));

  return NextResponse.json(
    {
      configured: true,
      provider: "plivo",
      status: response.status,
      data,
    },
    { status: response.ok ? 200 : 502 },
  );
}

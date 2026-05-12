import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const hasWhatsAppConfig =
    Boolean(process.env.WHATSAPP_ACCESS_TOKEN) &&
    Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID);

  if (!body.phone) {
    return NextResponse.json({ error: "Missing phone number." }, { status: 400 });
  }

  if (!hasWhatsAppConfig) {
    return NextResponse.json({
      configured: false,
      channel: "whatsapp",
      queued: true,
      dryRunMessage:
        body.message ??
        "Thanks for speaking with us. Sharing the approved UGP 2027 details and counselor callback slot.",
      next: "Set WhatsApp Business Cloud API env vars to send live follow-ups.",
    });
  }

  return NextResponse.json({
    configured: true,
    channel: "whatsapp",
    status: "ready",
    next: "Wire this branch to the WhatsApp Business Cloud API send-message endpoint.",
  });
}

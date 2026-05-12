import { NextResponse } from "next/server";
import { requireApiSession, unauthorized } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    requireApiSession(request);
    const contentType = request.headers.get("content-type") ?? "";
    const body = contentType.includes("application/json")
      ? await request.json().catch(() => ({}))
      : Object.fromEntries((await request.formData()).entries());
    const hasWhatsAppConfig =
      Boolean(process.env.WHATSAPP_ACCESS_TOKEN) &&
      Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID);

    if (!body.phone) {
      return NextResponse.json({ error: "Missing phone number." }, { status: 400 });
    }

    const message =
      body.message ??
      "Thanks for speaking with us. Sharing the approved UGP 2027 details and counselor callback slot.";

    if (!hasWhatsAppConfig) {
      if (!contentType.includes("application/json")) {
        return NextResponse.redirect(
          new URL(`/leads/${body.leadId ?? ""}?whatsapp=dry-run`, request.url),
          303,
        );
      }

      return NextResponse.json({
        configured: false,
        channel: "whatsapp",
        queued: true,
        dryRunMessage: message,
        next: "Set WhatsApp Business Cloud API env vars to send live follow-ups.",
      });
    }

    const version = process.env.WHATSAPP_GRAPH_VERSION || "v25.0";
    const to = String(body.phone).replace(/\D/g, "");
    const templateName = process.env.WHATSAPP_TEMPLATE_NAME;
    const payload = templateName
      ? {
          messaging_product: "whatsapp",
          to,
          type: "template",
          template: {
            name: templateName,
            language: { code: process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en" },
          },
        }
      : {
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { preview_url: true, body: message },
        };

    const response = await fetch(
      `https://graph.facebook.com/${version}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );
    const data = await response.json().catch(() => ({}));

    if (!contentType.includes("application/json")) {
      return NextResponse.redirect(
        new URL(`/leads/${body.leadId ?? ""}?whatsapp=${response.ok ? "sent" : "failed"}`, request.url),
        303,
      );
    }

    return NextResponse.json(
      {
        configured: true,
        channel: "whatsapp",
        providerStatus: response.status,
        data,
      },
      { status: response.ok ? 200 : 502 },
    );
  } catch {
    return unauthorized();
  }
}

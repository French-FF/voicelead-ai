import { NextResponse } from "next/server";
import { requireApiSession, unauthorized } from "@/lib/auth";
import { getBaseUrl } from "@/lib/config";
import { createCallRecord, updateCallRecord } from "@/lib/store";

type StartCallRequest = {
  to?: string;
  leadId?: string;
  campaignId?: string;
};

export const runtime = "nodejs";

function missingEnv() {
  return [
    "PLIVO_AUTH_ID",
    "PLIVO_AUTH_TOKEN",
    "PLIVO_FROM_NUMBER",
    "APP_BASE_URL",
  ].filter((key) => !process.env[key]);
}

export async function POST(request: Request) {
  try {
    const session = requireApiSession(request);
    const contentType = request.headers.get("content-type") ?? "";
    const body = (
      contentType.includes("application/json")
        ? await request.json().catch(() => ({}))
        : Object.fromEntries((await request.formData()).entries())
    ) as StartCallRequest;
    const missing = missingEnv();

    if (!body.to || !body.leadId || !body.campaignId) {
      return NextResponse.json(
        { error: "Missing to, leadId, or campaignId." },
        { status: 400 },
      );
    }

    const call = await createCallRecord({
      workspaceId: session.workspaceId,
      leadId: body.leadId,
      campaignId: body.campaignId,
      to: body.to,
      provider: "plivo",
    });
    const baseUrl = getBaseUrl(request);
    const answerUrl = `${baseUrl}/api/webhooks/plivo/answer?callId=${call.id}&leadId=${body.leadId}&campaignId=${body.campaignId}`;
    const statusUrl = `${baseUrl}/api/webhooks/plivo/status?callId=${call.id}`;

    if (missing.length) {
      if (!contentType.includes("application/json")) {
        return NextResponse.redirect(
          new URL(`/calls/${call.id}?dryRun=1`, request.url),
          303,
        );
      }

      return NextResponse.json({
        configured: false,
        provider: "plivo",
        call,
        missing,
        dryRunPayload: {
          from: process.env.PLIVO_FROM_NUMBER ?? "+91XXXXXXXXXX",
          to: body.to,
          answer_url: answerUrl,
          hangup_url: statusUrl,
        },
        next: "Set Plivo env vars to place a real test call.",
      });
    }

    const authId = process.env.PLIVO_AUTH_ID!;
    const authToken = process.env.PLIVO_AUTH_TOKEN!;
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
        answer_url: answerUrl,
        answer_method: "POST",
        hangup_url: statusUrl,
        hangup_method: "POST",
      }),
    });

    const data = await response.json().catch(() => ({}));
    const providerCallId =
      data.request_uuid || data.requestUuid || data.call_uuid || data.callUuid;
    if (providerCallId) {
      await updateCallRecord(call.id, {
        callStatus: "In Progress",
        providerCallId: String(providerCallId),
        extractedFields: {
          ...call.extractedFields,
          providerCallId: String(providerCallId),
        },
      });
    }

    if (!contentType.includes("application/json")) {
      return NextResponse.redirect(
        new URL(`/calls/${call.id}?started=${response.ok ? "1" : "0"}`, request.url),
        303,
      );
    }

    return NextResponse.json(
      {
        configured: true,
        provider: "plivo",
        callId: call.id,
        status: response.status,
        data,
      },
      { status: response.ok ? 200 : 502 },
    );
  } catch {
    return unauthorized();
  }
}

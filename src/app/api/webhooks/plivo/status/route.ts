import { NextResponse } from "next/server";
import { isPlivoWebhookAuthorized } from "@/lib/config";
import { findCallByProviderId, updateCallRecord } from "@/lib/store";

export const runtime = "nodejs";

function statusToCallStatus(status: string) {
  const normalized = status.toLowerCase();
  if (["completed", "answered"].includes(normalized)) return "Connected";
  if (["failed", "rejected", "busy"].includes(normalized)) return "Failed";
  if (["no-answer", "no_answer", "timeout"].includes(normalized)) return "No Answer";
  return "In Progress";
}

async function readWebhookPayload(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await request.json().catch(() => ({}))) as Record<string, unknown>;
  }

  const formData = await request.formData().catch(() => null);
  return formData ? Object.fromEntries(formData.entries()) : {};
}

export async function POST(request: Request) {
  if (!isPlivoWebhookAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const payload = await readWebhookPayload(request);
  const callId = url.searchParams.get("callId");
  const providerCallId = String(
    payload.CallUUID ||
      payload.call_uuid ||
      payload.RequestUUID ||
      payload.request_uuid ||
      "",
  );
  const call = callId
    ? { id: callId }
    : providerCallId
      ? await findCallByProviderId(providerCallId)
      : null;

  if (call?.id) {
    const duration = Number(payload.Duration || payload.duration || payload.BillDuration || 0);
    const recordingUrl = String(
      payload.RecordUrl ||
        payload.RecordingUrl ||
        payload.recording_url ||
        payload.record_url ||
        "",
    );
    await updateCallRecord(call.id, {
      callStatus: statusToCallStatus(String(payload.CallStatus || payload.call_status || "")),
      durationSeconds: Number.isFinite(duration) ? duration : undefined,
      recordingUrl: recordingUrl || undefined,
      extractedFields: {
        providerPayload: JSON.stringify(payload),
        providerCallId,
      },
    });
  }

  return NextResponse.json({
    received: true,
    provider: "plivo",
    payload,
    updatedCallId: call?.id ?? null,
    next: "If transcript is not present yet, post it to /api/calls/mock-summarize with callId.",
  });
}

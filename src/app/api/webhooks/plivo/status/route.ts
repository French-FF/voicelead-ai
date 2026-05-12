import { NextResponse } from "next/server";
import { findCallByProviderId, updateCallRecord } from "@/lib/store";

export const runtime = "nodejs";

function statusToCallStatus(status: string) {
  const normalized = status.toLowerCase();
  if (["completed", "answered"].includes(normalized)) return "Connected";
  if (["failed", "rejected", "busy"].includes(normalized)) return "Failed";
  if (["no-answer", "no_answer", "timeout"].includes(normalized)) return "No Answer";
  return "In Progress";
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const formData = await request.formData().catch(() => null);
  const payload = formData
    ? Object.fromEntries(formData.entries())
    : await request.json().catch(() => ({}));
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

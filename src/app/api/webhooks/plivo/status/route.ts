import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);
  const payload = formData
    ? Object.fromEntries(formData.entries())
    : await request.json().catch(() => ({}));

  return NextResponse.json({
    received: true,
    provider: "plivo",
    payload,
    next: "Persist call status, duration, recording URL, transcript job, and lead outcome.",
  });
}

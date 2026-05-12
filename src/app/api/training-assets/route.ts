import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const title = String(formData.get("title") ?? "Untitled training asset");
  const notes = String(formData.get("notes") ?? "");
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Attach a transcript or audio recording." },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      id: `asset_${Date.now()}`,
      title,
      fileName: file.name,
      fileType: file.type || "unknown",
      notes,
      status: "Queued",
      refinementTargets: [
        "opening style",
        "objection handling",
        "Hinglish switching",
        "counselor handoff timing",
      ],
      complianceChecklist: [
        "Confirm consent to process recordings",
        "Mask phone numbers before model tuning",
        "Do not use opt-out calls for agent improvement",
      ],
    },
    { status: 202 },
  );
}

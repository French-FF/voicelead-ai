import { NextResponse } from "next/server";
import { requireApiSession, unauthorized } from "@/lib/auth";
import { createTrainingAsset } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = requireApiSession(request);
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

    const transcript =
      file.type.startsWith("text/") || file.name.endsWith(".txt")
        ? await file.text()
        : undefined;
    const asset = await createTrainingAsset({
      workspaceId: session.workspaceId,
      title,
      type: file.type || file.name,
      transcript,
      notes,
    });

    if (request.headers.get("accept")?.includes("text/html")) {
      return NextResponse.redirect(new URL("/knowledge?asset=queued", request.url), 303);
    }

    return NextResponse.json(
      {
        ...asset,
        fileName: file.name,
        fileType: file.type || "unknown",
        notes,
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
  } catch {
    return unauthorized();
  }
}

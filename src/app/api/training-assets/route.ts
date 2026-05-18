import { NextResponse } from "next/server";
import { requireApiSession, unauthorized } from "@/lib/auth";
import { createTrainingAsset } from "@/lib/store";

export const runtime = "nodejs";

const maxTrainingUploadBytes = Number(
  process.env.TRAINING_ASSET_MAX_BYTES ?? 25 * 1024 * 1024,
);
const supportedExtensions = new Set(["txt", "csv", "docx", "mp3", "wav", "m4a"]);

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
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !supportedExtensions.has(extension)) {
      return NextResponse.json(
        {
          error:
            "Training assets support TXT, CSV, DOCX, MP3, WAV, and M4A files.",
        },
        { status: 400 },
      );
    }
    if (file.size > maxTrainingUploadBytes) {
      return NextResponse.json(
        {
          error: "Training asset is too large for this pilot upload path.",
          maxBytes: maxTrainingUploadBytes,
        },
        { status: 413 },
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
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorized();
    }

    return NextResponse.json(
      {
        error: "Training asset upload failed.",
        detail:
          error instanceof Error
            ? error.message
            : "Check the file format and try again.",
      },
      { status: 400 },
    );
  }
}

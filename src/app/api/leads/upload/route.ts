import { NextResponse } from "next/server";
import { DOMParser as XmlDomParser } from "@xmldom/xmldom";
import { readSheet } from "read-excel-file/browser";
import { requireApiSession, unauthorized } from "@/lib/auth";
import { parseLeadCsv, parseLeadXlsxRows } from "@/lib/csv";
import { importLeads } from "@/lib/store";

export const runtime = "nodejs";

const maxLeadUploadBytes = Number(process.env.LEAD_UPLOAD_MAX_BYTES ?? 5 * 1024 * 1024);
const allowedExtensions = new Set(["csv", "xlsx"]);

function ensureDomParser() {
  const globalWithDomParser = globalThis as unknown as {
    DOMParser?: unknown;
  };

  globalWithDomParser.DOMParser ??= XmlDomParser;
}

export async function POST(request: Request) {
  try {
    const session = requireApiSession(request);
    const formData = await request.formData();
    const file = formData.get("file");
    const campaignId = String(formData.get("campaignId") ?? "camp_ugp_2027");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Upload a CSV or XLSX file under the field name 'file'." },
        { status: 400 },
      );
    }

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !allowedExtensions.has(extension)) {
      return NextResponse.json(
        { error: "Lead import supports CSV and XLSX files only." },
        { status: 400 },
      );
    }
    if (file.size > maxLeadUploadBytes) {
      return NextResponse.json(
        {
          error: "Lead import file is too large.",
          maxBytes: maxLeadUploadBytes,
        },
        { status: 413 },
      );
    }

    if (extension === "xlsx") {
      ensureDomParser();
    }

    const parsed =
      extension === "xlsx"
        ? parseLeadXlsxRows(await readSheet(file))
        : parseLeadCsv(await file.text());
    const result = await importLeads(session.workspaceId, campaignId, parsed);

    if (request.headers.get("accept")?.includes("text/html")) {
      return NextResponse.redirect(new URL("/leads?uploaded=1", request.url), 303);
    }

    return NextResponse.json({
      fileName: file.name,
      ...result,
      normalizedPreview: parsed.slice(0, 5),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return unauthorized();
    }

    return NextResponse.json(
      {
        error: "Lead import failed.",
        detail:
          error instanceof Error
            ? error.message
            : "Check the file format and required columns.",
      },
      { status: 400 },
    );
  }
}

import { NextResponse } from "next/server";
import { requireApiSession, unauthorized } from "@/lib/auth";
import { parseLeadCsv } from "@/lib/csv";
import { importLeads } from "@/lib/store";

export const runtime = "nodejs";

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

    if (extension === "xlsx") {
      return NextResponse.json({
        fileName: file.name,
        status: "queued",
        message:
          "XLSX received. Convert to CSV for this pilot build, or wire a workbook parser before larger imports.",
      });
    }

    const text = await file.text();
    const parsed = parseLeadCsv(text);
    const result = await importLeads(session.workspaceId, campaignId, parsed);

    if (request.headers.get("accept")?.includes("text/html")) {
      return NextResponse.redirect(new URL("/leads?uploaded=1", request.url), 303);
    }

    return NextResponse.json({
      fileName: file.name,
      ...result,
      normalizedPreview: parsed.slice(0, 5),
    });
  } catch {
    return unauthorized();
  }
}

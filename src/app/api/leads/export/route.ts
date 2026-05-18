import { NextResponse } from "next/server";
import { requireApiSession, unauthorized } from "@/lib/auth";
import { getWorkspaceSnapshot } from "@/lib/store";
import type { Lead, LeadCategory } from "@/lib/types";

export const runtime = "nodejs";

const defaultExportCategories: LeadCategory[] = [
  "Hot",
  "Warm",
  "Needs Human Follow-Up",
  "Call Back Later",
];

function escapeCsv(value: unknown) {
  const text = String(value ?? "");
  if (!/[",\n\r]/.test(text)) return text;
  return `"${text.replaceAll('"', '""')}"`;
}

function leadToRow(lead: Lead) {
  return [
    lead.name,
    lead.phone,
    lead.email,
    lead.city,
    lead.source,
    lead.campaignId,
    lead.callStatus,
    lead.classification,
    lead.conversionScore,
    lead.tags.join("; "),
    lead.nextAction,
    lead.assignedTo,
    lead.followUpStatus,
  ];
}

export async function GET(request: Request) {
  try {
    const session = requireApiSession(request);
    const url = new URL(request.url);
    const rawCategories = url.searchParams.getAll("category");
    const categories = rawCategories.length
      ? new Set(rawCategories)
      : new Set(defaultExportCategories);
    const campaignId = url.searchParams.get("campaignId");
    const snapshot = await getWorkspaceSnapshot(session.workspaceId);
    const leads = snapshot.leads.filter((lead) => {
      const categoryMatch = categories.has(lead.classification);
      const campaignMatch = !campaignId || lead.campaignId === campaignId;
      return categoryMatch && campaignMatch;
    });
    const header = [
      "Name",
      "Phone",
      "Email",
      "City",
      "Source",
      "Campaign ID",
      "Call Status",
      "Lead Category",
      "Conversion Score",
      "Tags",
      "Next Action",
      "Assigned To",
      "Follow-up Status",
    ];
    const csv = [header, ...leads.map(leadToRow)]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\n");
    const stamp = new Date().toISOString().slice(0, 10);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="voicelead-priority-leads-${stamp}.csv"`,
      },
    });
  } catch {
    return unauthorized();
  }
}

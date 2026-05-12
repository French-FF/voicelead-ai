import { NextResponse } from "next/server";
import { isBootstrapAuthorized } from "@/lib/auth";
import { getOperationalStatus, seedDemoWorkspace } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isBootstrapAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await seedDemoWorkspace();

  return NextResponse.json({
    ...result,
    status: getOperationalStatus(),
    next: "Open /dashboard and run a 10-lead CSV import or Plivo test call.",
  });
}

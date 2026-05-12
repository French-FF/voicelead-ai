import { NextResponse } from "next/server";
import { requireApiSession, unauthorized } from "@/lib/auth";
import { getWorkspaceSnapshot } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const session = requireApiSession(request);
    const snapshot = await getWorkspaceSnapshot(session.workspaceId);
    return NextResponse.json({ leads: snapshot.leads, mode: snapshot.mode });
  } catch {
    return unauthorized();
  }
}

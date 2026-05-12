import { NextResponse } from "next/server";
import { requireApiSession, unauthorized } from "@/lib/auth";
import { createCampaign, getWorkspaceSnapshot } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const session = requireApiSession(request);
    const snapshot = await getWorkspaceSnapshot(session.workspaceId);
    return NextResponse.json({ campaigns: snapshot.campaigns, mode: snapshot.mode });
  } catch {
    return unauthorized();
  }
}

export async function POST(request: Request) {
  try {
    const session = requireApiSession(request);
    const contentType = request.headers.get("content-type") ?? "";
    const body = contentType.includes("application/json")
      ? await request.json().catch(() => ({}))
      : Object.fromEntries((await request.formData()).entries());

    const qualificationQuestions = String(body.qualificationQuestions ?? "")
      .split(/\n/)
      .map((item) => item.trim())
      .filter(Boolean);
    const scoringRules = String(body.scoringRules ?? "")
      .split(/\n/)
      .map((item) => item.trim())
      .filter(Boolean);
    const handoffRules = String(body.handoffRules ?? "")
      .split(/\n/)
      .map((item) => item.trim())
      .filter(Boolean);

    const campaign = await createCampaign(session.workspaceId, {
      campaignName: String(body.campaignName ?? "Untitled campaign"),
      objective: String(body.objective ?? "Lead qualification"),
      language: String(body.language ?? "Hinglish"),
      agentId: String(body.agentId ?? "agent_aarav"),
      script: String(body.script ?? ""),
      qualificationQuestions,
      scoringRules,
      handoffRules,
    });

    if (!contentType.includes("application/json")) {
      return NextResponse.redirect(
        new URL(`/campaigns?created=${campaign.id}`, request.url),
        303,
      );
    }

    return NextResponse.json(
      {
        campaign,
        next: "Upload leads, attach agent, validate calling window, then launch.",
      },
      { status: 201 },
    );
  } catch {
    return unauthorized();
  }
}

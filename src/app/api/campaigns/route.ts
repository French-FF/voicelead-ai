import { NextResponse } from "next/server";
import { campaigns } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ campaigns });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  return NextResponse.json(
    {
      campaign: {
        id: `camp_${Date.now()}`,
        status: "Draft",
        ...body,
      },
      next: "Upload leads, attach agent, validate calling window, then launch.",
    },
    { status: 201 },
  );
}

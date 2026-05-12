import { NextResponse } from "next/server";
import { getOperationalStatus } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "voicelead-ai",
    ...getOperationalStatus(),
  });
}

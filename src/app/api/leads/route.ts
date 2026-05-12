import { NextResponse } from "next/server";
import { leads } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ leads });
}

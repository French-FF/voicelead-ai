import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const feedback = Object.fromEntries(formData.entries());

  return NextResponse.json({
    received: true,
    feedback,
    next: "Wire this endpoint to a database, Google Sheet, Notion, Airtable, or Slack channel before sharing widely.",
  });
}

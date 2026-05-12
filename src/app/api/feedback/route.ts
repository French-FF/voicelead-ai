import { NextResponse } from "next/server";
import { createFeedback } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const feedback = Object.fromEntries(formData.entries());
  await createFeedback(feedback);

  if (request.headers.get("accept")?.includes("text/html")) {
    return NextResponse.redirect(new URL("/feedback?submitted=1", request.url), 303);
  }

  return NextResponse.json({
    received: true,
    feedback,
    next: "Feedback captured. Review it in the database or wire Slack/Sheet notifications for the pilot.",
  });
}

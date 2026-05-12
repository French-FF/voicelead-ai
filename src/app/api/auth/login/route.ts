import { NextResponse } from "next/server";
import {
  createSessionValue,
  setSessionCookie,
  validPilotCredentials,
} from "@/lib/auth";
import { DEFAULT_WORKSPACE_ID } from "@/lib/config";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  if (!validPilotCredentials(email, password)) {
    return NextResponse.redirect(new URL("/login?error=invalid", request.url), 303);
  }

  const response = NextResponse.redirect(new URL(next || "/dashboard", request.url), 303);
  setSessionCookie(response, createSessionValue(email, DEFAULT_WORKSPACE_ID));
  return response;
}

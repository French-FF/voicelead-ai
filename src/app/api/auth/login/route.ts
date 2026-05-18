import { NextResponse } from "next/server";
import {
  createSessionValue,
  safeRedirectPath,
  setSessionCookie,
  validPilotCredentials,
} from "@/lib/auth";
import { DEFAULT_WORKSPACE_ID } from "@/lib/config";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = safeRedirectPath(String(formData.get("next") ?? "/dashboard"));

  if (!validPilotCredentials(email, password)) {
    return NextResponse.redirect(new URL("/login?error=invalid", request.url), 303);
  }

  const response = NextResponse.redirect(new URL(next, request.url), 303);
  setSessionCookie(response, createSessionValue(email, DEFAULT_WORKSPACE_ID));
  return response;
}

import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DEFAULT_WORKSPACE_ID } from "./config";

export const SESSION_COOKIE = "voicelead_session";

export type PilotSession = {
  email: string;
  role: "OWNER" | "ADMIN" | "MANAGER" | "SALES" | "VIEWER";
  workspaceId: string;
  exp: number;
};

function sessionSecret() {
  return (
    process.env.VOICELEAD_SESSION_SECRET ||
    "dev-only-change-this-before-sharing-voicelead"
  );
}

function base64Url(input: string) {
  return Buffer.from(input).toString("base64url");
}

function sign(payload: string) {
  return crypto
    .createHmac("sha256", sessionSecret())
    .update(payload)
    .digest("base64url");
}

function timingSafeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    crypto.timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function createSessionValue(
  email: string,
  workspaceId = DEFAULT_WORKSPACE_ID,
) {
  const payload: PilotSession = {
    email,
    role: "OWNER",
    workspaceId,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12,
  };
  const encoded = base64Url(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

export function parseSessionValue(value?: string | null): PilotSession | null {
  if (!value) return null;

  const [encoded, signature] = value.split(".");
  if (!encoded || !signature || !timingSafeEqual(sign(encoded), signature)) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as PilotSession;

    if (!session.email || session.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  return parseSessionValue(cookieStore.get(SESSION_COOKIE)?.value);
}

export function getSessionFromRequest(request: Request) {
  const rawCookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE}=`))
    ?.split("=")[1];

  return parseSessionValue(rawCookie ? decodeURIComponent(rawCookie) : null);
}

export function validPilotCredentials(email: string, password: string) {
  const expectedEmail = process.env.PILOT_ADMIN_EMAIL || "admin@voicelead.ai";
  const expectedPassword = process.env.PILOT_ADMIN_PASSWORD || "voicelead-pilot";

  return (
    email.trim().toLowerCase() === expectedEmail.trim().toLowerCase() &&
    password === expectedPassword
  );
}

export function setSessionCookie(response: NextResponse, value: string) {
  response.cookies.set(SESSION_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function requireApiSession(request: Request) {
  const session = getSessionFromRequest(request);
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

export function isBootstrapAuthorized(request: Request) {
  const token = process.env.BOOTSTRAP_TOKEN;
  if (!token) return Boolean(getSessionFromRequest(request));

  return request.headers.get("x-bootstrap-token") === token;
}

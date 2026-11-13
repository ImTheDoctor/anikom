import { NextResponse, type NextRequest } from "next/server";
import {
  AUTH_API_ORIGIN,
  AUTH_API_URL,
  WEB_SESSION_COOKIE,
  WEB_SESSION_HINT_COOKIE,
} from "@/lib/auth-api";

// Sign-out endpoint. The static path takes precedence over the
// /api/auth/[...path] catch-all. It forwards the call to the backend's
// POST /v1/auth/logout so the server-side session is invalidated, then always
// clears the local web_session cookie: the cookie is what this site
// authenticates with, so clearing it here is the authoritative sign-out even
// if the upstream call fails or the endpoint is missing.

async function logout(request: NextRequest) {
  const headers = new Headers({ origin: AUTH_API_ORIGIN });
  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);
  try {
    await fetch(`${AUTH_API_URL}/v1/auth/logout`, {
      method: "POST",
      headers,
      // A hung tunnel must not hang the sign-out round-trip.
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // Swallowed — the local clearing below signs the browser out regardless.
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: WEB_SESSION_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
  });
  // The UI hint follows the session so the header CTA flips to Sign in at
  // once after the redirect.
  response.cookies.set({
    name: WEB_SESSION_HINT_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });
  return response;
}

export { logout as POST };

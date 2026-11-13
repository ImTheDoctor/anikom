// Test auth API (NestJS, OTP over email, session cookie `web_session`).
// The trycloudflare tunnel is ephemeral — set AUTH_API_URL when it changes.
export const AUTH_API_URL =
  process.env.AUTH_API_URL ??
  "https://sand-shower-purchased-praise.trycloudflare.com";

// The test API's CORS allowlist only accepts this origin (dev site URL);
// server-side fetches send no Origin of their own, so it is set explicitly.
export const AUTH_API_ORIGIN = "http://localhost:3000";

// Session cookie name from the API's OpenAPI security scheme.
export const WEB_SESSION_COOKIE = "web_session";

// Non-HttpOnly UI hint ("1" = a web_session exists): lets the header CTA
// render the correct link synchronously on client navigations. Carries no
// secret — the HttpOnly session token itself never reaches client JS.
export const WEB_SESSION_HINT_COOKIE = "web_session_hint";

import { NextResponse, type NextRequest } from "next/server";
import { AUTH_API_ORIGIN, AUTH_API_URL, WEB_SESSION_HINT_COOKIE } from "@/lib/auth-api";

// Shared same-origin proxy for the backend namespaces the browser must never
// talk to directly (/v1/auth/*, /v1/me/*, /v1/expert/* are mounted under
// /api/*). Keeps the `web_session` cookie first-party (the browser never sees
// the API domain) and satisfies the test API's CORS allowlist, which the
// browser alone could not do from production domains.

export type RouteContext = { params: Promise<{ path: string[] }> };

export async function proxyBackendNamespace(
  request: NextRequest,
  context: RouteContext,
  namespace: "auth" | "me" | "expert",
) {
  const { path } = await context.params;
  const headers = new Headers({
    origin: AUTH_API_ORIGIN,
  });
  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  // Vercel puts the real client IP in x-forwarded-for; the API trusts this
  // repacked header (TRUST_CLIENT_IP_HEADER) to give each user their own
  // rate-limit budget. Set fresh here — a client-supplied value never
  // passes through (this handler builds its own header set).
  const clientIp = request.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  if (clientIp) headers.set("x-client-ip", clientIp);

  const apiResponse = await fetch(
    `${AUTH_API_URL}/v1/${namespace}/${path.join("/")}`,
    {
      method: request.method,
      headers,
      // Byte-exact forwarding: multipart uploads (avatar/documents) carry
      // binary parts, which request.text() would silently mangle.
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
    },
  );

  // The body is piped, not buffered — file downloads stream through.
  const response = new NextResponse(apiResponse.body, {
    status: apiResponse.status,
  });
  const responseType = apiResponse.headers.get("content-type");
  if (responseType) response.headers.set("content-type", responseType);
  // File downloads (avatar, documents/:id/file): keep the attachment filename
  // and size so browsers can stream with progress. content-length is dropped
  // when the upstream is compressed — fetch decompresses transparently and
  // the original length would no longer match the body.
  const contentDisposition = apiResponse.headers.get("content-disposition");
  if (contentDisposition) {
    response.headers.set("content-disposition", contentDisposition);
  }
  const contentLength = apiResponse.headers.get("content-length");
  if (contentLength && !apiResponse.headers.get("content-encoding")) {
    response.headers.set("content-length", contentLength);
  }
  // Rate-limit countdown for API clients / debugging; the UI shows fixed
  // localized copy.
  const retryAfter = apiResponse.headers.get("retry-after");
  if (retryAfter) response.headers.set("retry-after", retryAfter);
  // Re-emit the session cookie for this site's own domain: drop the foreign
  // Domain attribute and repoint the backend's Path (it scopes cookies to its
  // own /v1 mount) to the site root — otherwise the browser sends the cookie
  // back only to /v1/* paths, which this app never requests (its API surface
  // is /api/*). Anchored so "path=" inside a cookie value cannot match.
  let sessionEstablished = false;
  let sessionCleared = false;
  for (const cookieHeader of apiResponse.headers.getSetCookie()) {
    response.headers.append(
      "set-cookie",
      cookieHeader
        .replace(/(^|;\s*)domain=[^;]+;?\s*/i, "$1")
        .replace(/(^|;\s*)path=[^;]+;?\s*/i, "$1Path=/; "),
    );
    // Track web_session so the non-HttpOnly UI hint cookie can follow it.
    const sessionMatch = /^web_session=([^;]*)/i.exec(cookieHeader.trim());
    if (sessionMatch) {
      if (sessionMatch[1]) sessionEstablished = true;
      else sessionCleared = true;
    }
  }
  if (sessionEstablished) {
    response.headers.append(
      "set-cookie",
      `${WEB_SESSION_HINT_COOKIE}=1; Path=/; Max-Age=86400; SameSite=Lax`,
    );
  } else if (sessionCleared) {
    response.headers.append(
      "set-cookie",
      `${WEB_SESSION_HINT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`,
    );
  }
  return response;
}

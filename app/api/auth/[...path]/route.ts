import type { NextRequest } from "next/server";
import { proxyBackendNamespace, type RouteContext } from "@/lib/backend-proxy";

// Same-origin proxy for the web auth endpoints (/v1/auth/*) — delegated to
// the shared namespace proxy (lib/backend-proxy.ts), which also serves
// /api/me/* and /api/expert/*.

async function proxy(request: NextRequest, context: RouteContext) {
  return proxyBackendNamespace(request, context, "auth");
}

export { proxy as GET, proxy as POST, proxy as PATCH };

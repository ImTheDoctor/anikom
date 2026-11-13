import type { NextRequest } from "next/server";
import { proxyBackendNamespace, type RouteContext } from "@/lib/backend-proxy";

// Same-origin proxy for the expert endpoints (/v1/expert/*).

async function proxy(request: NextRequest, context: RouteContext) {
  return proxyBackendNamespace(request, context, "expert");
}

export { proxy as GET };

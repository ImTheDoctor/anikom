import type { NextRequest } from "next/server";
import { proxyBackendNamespace, type RouteContext } from "@/lib/backend-proxy";

// Same-origin proxy for the cabinet endpoints (/v1/me/*): avatar and
// documents. The method surface mirrors the CabinetModule — GET lists/serves,
// POST uploads, DELETE removes.

async function proxy(request: NextRequest, context: RouteContext) {
  return proxyBackendNamespace(request, context, "me");
}

export { proxy as GET, proxy as POST, proxy as DELETE };

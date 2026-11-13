import { cache } from "react";
import { cookies } from "next/headers";
import { AUTH_API_ORIGIN, AUTH_API_URL } from "@/lib/auth-api";

// MeResponseDto — GET /v1/auth/me. firstName/lastName/birthDate are web-user
// profile fields (null for admin sessions); role is EXPERT/CLIENT for web
// sessions (SUPER_ADMIN/EDITOR for admin sessions) per the API OpenAPI spec.
export type CabinetUser = {
  id: string;
  email: string;
  role: string;
  firstName: string | null;
  lastName: string | null;
  birthDate: string | null;
};

// MediaResponseDto (API OpenAPI spec) — the shape behind cabinet documents.
export type MediaFile = {
  id: string;
  originalName: string;
  type: string; // IMAGE | VIDEO | PDF
  mimeType: string;
  size: number;
  status: string; // PROCESSING | READY | FAILED
  createdAt: string;
};

// Session read shared by the cabinet layout, the cabinet pages and the
// header CTA. cache() dedupes concurrent calls within one render pass, so a
// single navigation triggers exactly one GET /v1/auth/me. Three states:
// 401/403 mean "no session" (guest), while a network failure or 5xx means the
// backend is (temporarily) unreachable — that must not bounce a signed-in
// user to /login, so callers render the unavailable panel instead.
export type SessionState =
  | { kind: "authenticated"; user: CabinetUser }
  | { kind: "guest" }
  | { kind: "unavailable" };

export const getSessionState = cache(async (): Promise<SessionState> => {
  const cookieHeader = (await cookies()).toString();
  let res: Response;
  try {
    res = await fetch(`${AUTH_API_URL}/v1/auth/me`, {
      headers: { cookie: cookieHeader, origin: AUTH_API_ORIGIN },
      cache: "no-store",
    });
  } catch {
    return { kind: "unavailable" };
  }
  if (res.ok) {
    try {
      return { kind: "authenticated", user: (await res.json()) as CabinetUser };
    } catch {
      return { kind: "unavailable" };
    }
  }
  if (res.status === 401 || res.status === 403) return { kind: "guest" };
  return { kind: "unavailable" };
});

// Role enum from the API spec; unknown values (admin roles) render as-is.
export function isExpert(user: CabinetUser): boolean {
  return user.role === "EXPERT";
}

// GET /v1/expert/me probe for the expert-only pages. 401/403 → the signed-in
// user is not an expert (the page 404s, matching the site convention of not
// revealing why). 404/5xx/network → the backend is (temporarily) unavailable
// and must never read as a false 404.
export type ExpertProbe =
  | { kind: "expert" }
  | { kind: "not-expert" }
  | { kind: "unavailable" };

export async function probeExpertSession(): Promise<ExpertProbe> {
  const cookieHeader = (await cookies()).toString();
  let res: Response;
  try {
    res = await fetch(`${AUTH_API_URL}/v1/expert/me`, {
      headers: { cookie: cookieHeader, origin: AUTH_API_ORIGIN },
      cache: "no-store",
    });
  } catch {
    return { kind: "unavailable" };
  }
  if (res.ok) return { kind: "expert" };
  if (res.status === 401 || res.status === 403) return { kind: "not-expert" };
  return { kind: "unavailable" };
}

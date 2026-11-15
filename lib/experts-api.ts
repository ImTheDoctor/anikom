import { cacheLife } from "next/cache";
import { AUTH_API_ORIGIN, AUTH_API_URL } from "@/lib/auth-api";
import { getHomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";

// Public expert-directory API (GET /v1/expert/profiles*, backend Experts
// module, contract v2 — Nov 2026). Server-side only: the pages are Server
// Components and the same-origin /api/expert/* proxy is for browser calls.
//
// The backend is the source of truth for the roster and the profiles. The
// localized JSON in data/home.*.json (team.items, roster fields only) stays
// as the emergency fallback: the test API lives behind an ephemeral
// trycloudflare tunnel, and the public site must keep rendering when it is
// unreachable. UI copy (headings, buttons, hero stats, empty states) remains
// in the JSON.

// One entry of the directory grid. portraitUrl null → components fall back
// to the static /images/team/{slug}.jpg placeholder portrait.
export type ExpertRosterItem = {
  slug: string;
  name: string;
  role: string;
  portraitUrl: string | null;
  imageLabel: string;
  directions: string[];
};

// One certificate record. `number` is the bare document number ("0265") —
// the UI adds the "№"/"No." prefix per locale via formatCertificateNumber.
// scanUrl null → the detail page renders a text row instead of a scan.
export type ExpertCertificate = {
  title: string;
  issuer: string | null;
  year: string | null;
  number: string | null;
  scanUrl: string | null;
  imageLabel: string | null;
};

export type ExpertProfile = {
  bio: string[];
  certificates: ExpertCertificate[];
};

export type ExpertDetail = ExpertRosterItem & { profile: ExpertProfile };

export type ExpertRoster = {
  total: number;
  items: ExpertRosterItem[];
};

// "0265" → "№ 0265" (hy/ru) or "No. 0265" (en); matches the seeded copy.
export function formatCertificateNumber(number: string, locale: Locale) {
  return locale === "en" ? `No. ${number}` : `№ ${number}`;
}

// --- JSON fallback mapping (data/home.*.json team.items — roster fields
// only; profiles exist exclusively in the backend) ---

function fallbackRosterItem(item: {
  slug: string;
  name: string;
  role: string;
  imageLabel: string;
  directions: string[];
}): ExpertRosterItem {
  return {
    slug: item.slug,
    name: item.name,
    role: item.role,
    portraitUrl: null,
    imageLabel: item.imageLabel,
    directions: item.directions,
  };
}

function fallbackRoster(locale: Locale): ExpertRoster {
  const items = getHomeContent(locale).team.items;
  return { total: items.length, items: items.map(fallbackRosterItem) };
}

// --- Backend response parsing (light structural checks; anything malformed
// falls back to the JSON seed rather than crashing a public page) ---

function parseRosterItem(raw: unknown): ExpertRosterItem | null {
  if (typeof raw !== "object" || raw === null) return null;
  const entry = raw as Record<string, unknown>;
  if (typeof entry.slug !== "string" || typeof entry.name !== "string") {
    return null;
  }
  return {
    slug: entry.slug,
    name: entry.name,
    role: typeof entry.role === "string" ? entry.role : "",
    portraitUrl: typeof entry.portraitUrl === "string" ? entry.portraitUrl : null,
    imageLabel:
      typeof entry.imageLabel === "string" ? entry.imageLabel : entry.name,
    directions: Array.isArray(entry.directions)
      ? entry.directions.filter(
          (slug): slug is string => typeof slug === "string",
        )
      : [],
  };
}

function parseCertificate(raw: unknown): ExpertCertificate | null {
  if (typeof raw !== "object" || raw === null) return null;
  const entry = raw as Record<string, unknown>;
  if (typeof entry.title !== "string") return null;
  return {
    title: entry.title,
    issuer: typeof entry.issuer === "string" ? entry.issuer : null,
    year: typeof entry.year === "string" ? entry.year : null,
    number: typeof entry.number === "string" ? entry.number : null,
    scanUrl: typeof entry.scanUrl === "string" ? entry.scanUrl : null,
    imageLabel: typeof entry.imageLabel === "string" ? entry.imageLabel : null,
  };
}

function parseProfile(raw: unknown): ExpertProfile {
  const entry =
    typeof raw === "object" && raw !== null
      ? (raw as Record<string, unknown>)
      : {};
  const bio = Array.isArray(entry.bio)
    ? entry.bio.filter((paragraph): paragraph is string => typeof paragraph === "string")
    : [];
  const certificates = Array.isArray(entry.certificates)
    ? entry.certificates
        .map(parseCertificate)
        .filter((certificate): certificate is ExpertCertificate => certificate !== null)
    : [];
  return { bio, certificates };
}

// --- Public reads ('use cache' → the pages stay prerenderable; the roster
// changes rarely, so the minutes profile keeps admin edits visible soon) ---

export async function getExpertRoster(locale: Locale): Promise<ExpertRoster> {
  "use cache";
  cacheLife("minutes");
  try {
    const response = await fetch(
      `${AUTH_API_URL}/v1/expert/profiles?locale=${locale}`,
      { headers: { origin: AUTH_API_ORIGIN } },
    );
    if (response.ok) {
      const data: unknown = await response.json();
      if (typeof data === "object" && data !== null && Array.isArray((data as { items?: unknown }).items)) {
        const items = ((data as { items: unknown[] }).items)
          .map(parseRosterItem)
          .filter((item): item is ExpertRosterItem => item !== null);
        const total = (data as { total?: unknown }).total;
        return {
          total: typeof total === "number" ? total : items.length,
          items,
        };
      }
    }
  } catch {
    // Tunnel unreachable — fall through to the JSON seed.
  }
  return fallbackRoster(locale);
}

export async function getExpertDetail(
  slug: string,
  locale: Locale,
): Promise<ExpertDetail | null> {
  "use cache";
  cacheLife("minutes");
  try {
    const response = await fetch(
      `${AUTH_API_URL}/v1/expert/profiles/${encodeURIComponent(slug)}?locale=${locale}`,
      { headers: { origin: AUTH_API_ORIGIN } },
    );
    // Reachable backend without the slug → genuinely missing profile.
    if (response.status === 404) return null;
    if (response.ok) {
      const data: unknown = await response.json();
      const item = parseRosterItem(data);
      if (item) {
        return {
          ...item,
          profile: parseProfile((data as { profile?: unknown }).profile),
        };
      }
    }
  } catch {
    // Tunnel unreachable — fall through to the JSON seed.
  }
  const item = getHomeContent(locale).team.items.find(
    (entry) => entry.slug === slug,
  );
  // The JSON seed carries roster fields only, so offline profiles render
  // with an empty bio/certificates block until the backend is reachable.
  return item
    ? { ...fallbackRosterItem(item), profile: { bio: [], certificates: [] } }
    : null;
}

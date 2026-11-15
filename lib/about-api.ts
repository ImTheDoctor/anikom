import { cacheLife } from "next/cache";
import { AUTH_API_ORIGIN, AUTH_API_URL } from "@/lib/auth-api";
import { getHomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";

// Public About-page API (GET /v1/about, backend About module, contract Nov
// 2026). Server-side only: the page is a Server Component. The endpoint is a
// singleton document (one localized record, no list) — 404 while the admin
// has not filled it in.
//
// The backend is the source of truth for the page content. The localized
// JSON in data/home.*.json (aboutPage block) stays as the emergency fallback:
// the test API lives behind an ephemeral trycloudflare tunnel, and the public
// site must keep rendering when it is unreachable.

export type AboutStat = {
  value: string;
  label: string;
};

export type AboutFunctionGroup = {
  title: string;
  items: string[];
};

// Everything the /[locale]/about page renders, including the SEO meta block.
// awardImageUrl/heroImageUrl are shared (not localized); null → the page
// falls back to the static placeholder images.
export type AboutPageData = {
  metaTitle: string;
  metaDescription: string;
  title: string;
  description: string;
  missionTitle: string;
  mission: string[];
  stats: AboutStat[];
  goalsHeading: string;
  goals: string[];
  functionsHeading: string;
  functionGroups: AboutFunctionGroup[];
  directionsHeading: string;
  qualificationTitle: string;
  qualificationText: string;
  awardImageUrl: string | null;
  awardImageLabel: string;
  awardCaption: string;
  heroImageUrl: string | null;
};

// --- JSON fallback mapping (data/home.*.json aboutPage — full copy; the
// award scan stays the local /images/about/ file, hero stays static) ---

function fallbackAbout(locale: Locale): AboutPageData {
  const json = getHomeContent(locale).aboutPage;
  const { awardImage, ...rest } = json;
  return { ...rest, awardImageUrl: awardImage, heroImageUrl: null };
}

// --- Backend response parsing (light structural checks; anything malformed
// falls back to the JSON seed rather than crashing a public page) ---

function parseStringArray(raw: unknown): string[] {
  return Array.isArray(raw)
    ? raw.filter((item): item is string => typeof item === "string")
    : [];
}

function parseStats(raw: unknown): AboutStat[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null) return [];
    const stat = entry as Record<string, unknown>;
    if (typeof stat.value !== "string" || typeof stat.label !== "string") {
      return [];
    }
    return [{ value: stat.value, label: stat.label }];
  });
}

function parseFunctionGroups(raw: unknown): AboutFunctionGroup[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((entry) => {
    if (typeof entry !== "object" || entry === null) return [];
    const group = entry as Record<string, unknown>;
    if (typeof group.title !== "string") return [];
    return [{ title: group.title, items: parseStringArray(group.items) }];
  });
}

function parseAbout(raw: unknown): AboutPageData | null {
  if (typeof raw !== "object" || raw === null) return null;
  const entry = raw as Record<string, unknown>;
  // Sentinel fields: the backend validates these as mandatory, so a payload
  // without them is malformed → JSON fallback.
  if (typeof entry.title !== "string" || entry.title.length === 0) return null;
  const mission = parseStringArray(entry.mission);
  if (mission.length === 0) return null;
  return {
    metaTitle:
      typeof entry.metaTitle === "string" ? entry.metaTitle : entry.title,
    metaDescription:
      typeof entry.metaDescription === "string" ? entry.metaDescription : "",
    title: entry.title,
    description: typeof entry.description === "string" ? entry.description : "",
    missionTitle:
      typeof entry.missionTitle === "string" ? entry.missionTitle : "",
    mission,
    stats: parseStats(entry.stats),
    goalsHeading:
      typeof entry.goalsHeading === "string" ? entry.goalsHeading : "",
    goals: parseStringArray(entry.goals),
    functionsHeading:
      typeof entry.functionsHeading === "string" ? entry.functionsHeading : "",
    functionGroups: parseFunctionGroups(entry.functionGroups),
    directionsHeading:
      typeof entry.directionsHeading === "string"
        ? entry.directionsHeading
        : "",
    qualificationTitle:
      typeof entry.qualificationTitle === "string"
        ? entry.qualificationTitle
        : "",
    qualificationText:
      typeof entry.qualificationText === "string"
        ? entry.qualificationText
        : "",
    awardImageUrl: typeof entry.awardImageUrl === "string" ? entry.awardImageUrl : null,
    awardImageLabel:
      typeof entry.awardImageLabel === "string" ? entry.awardImageLabel : "",
    awardCaption: typeof entry.awardCaption === "string" ? entry.awardCaption : "",
    heroImageUrl: typeof entry.heroImageUrl === "string" ? entry.heroImageUrl : null,
  };
}

// --- Public read ('use cache' → the page stays prerenderable; the document
// changes rarely, so the minutes profile keeps admin edits visible soon) ---

export async function getAboutPage(locale: Locale): Promise<AboutPageData> {
  "use cache";
  cacheLife("minutes");
  try {
    const response = await fetch(
      `${AUTH_API_URL}/v1/about?locale=${locale}`,
      { headers: { origin: AUTH_API_ORIGIN } },
    );
    if (response.ok) {
      const data: unknown = await response.json();
      const parsed = parseAbout(data);
      if (parsed) return parsed;
    }
  } catch {
    // Tunnel unreachable — fall through to the JSON seed.
  }
  return fallbackAbout(locale);
}

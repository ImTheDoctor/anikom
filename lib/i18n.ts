export const locales = ["hy", "en", "ru"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "hy";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function localizeHref(locale: Locale, href: string): string {
  if (href.startsWith("#")) return `/${locale}${href}`;
  if (href.startsWith("/")) {
    return href === "/" ? `/${locale}` : `/${locale}${href}`;
  }
  return href;
}

// Route patterns implemented in every locale. `:param` matches one segment.
// Keep this list in sync as pages are added.
const localizedRoutePatterns = [
  "/",
  "/about",
  "/services",
  "/services/:slug",
  "/contact",
  "/cases",
  "/cases/:slug",
  "/team",
  "/team/:slug",
  "/news",
  "/news/:slug",
  "/login",
  "/register",
];

function matchesRoutePattern(pathname: string, pattern: string): boolean {
  const pathSegments = pathname.split("/").filter(Boolean);
  const patternSegments = pattern.split("/").filter(Boolean);
  if (pathSegments.length !== patternSegments.length) return false;
  return patternSegments.every(
    (segment, index) =>
      (segment.startsWith(":") && pathSegments[index] !== undefined) ||
      segment === pathSegments[index],
  );
}

export function getLocalizedPathname(
  pathname: string,
  targetLocale: Locale,
): string {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  const suffix =
    firstSegment && isLocale(firstSegment)
      ? `/${segments.slice(1).join("/")}`
      : pathname;
  const normalizedPathname = suffix === "" ? "/" : suffix;

  if (!localizedRoutePatterns.some((pattern) =>
    matchesRoutePattern(normalizedPathname, pattern),
  )) {
    return `/${targetLocale}`;
  }

  return normalizedPathname === "/"
    ? `/${targetLocale}`
    : `/${targetLocale}${normalizedPathname}`;
}

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

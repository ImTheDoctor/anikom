import { notFound, redirect } from "next/navigation";
import { ComingSoonPanel, UnavailablePanel } from "@/components/cabinet/placeholder-panel";
import { getSessionState, probeExpertSession } from "@/lib/cabinet-api";
import { getHomeContent } from "@/lib/home-content";
import { isLocale, siteUrl, type Locale } from "@/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/me/requests">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { cabinetPage } = getHomeContent(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: `${cabinetPage.nav.requests} — Anicom`,
    description: cabinetPage.meta.description,
    alternates: {
      canonical: `/${locale}/me/requests`,
      languages: {
        hy: "/hy/me/requests",
        en: "/en/me/requests",
        ru: "/ru/me/requests",
        "x-default": "/hy/me/requests",
      },
    },
  };
}

// Expert-only placeholder /[locale]/me/requests (no business processes yet).
// The nav hides these items from CLIENTs; direct access 404s for non-experts
// (matching the site convention of not revealing why) and shows the
// unavailable panel when the backend cannot answer.
export default async function RequestsPage({
  params,
}: PageProps<"/[locale]/me/requests">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const localeSafe: Locale = locale;
  const content = getHomeContent(localeSafe);

  return <RequestsContent locale={localeSafe} content={content} />;
}

async function RequestsContent({
  locale,
  content,
}: {
  locale: Locale;
  content: ReturnType<typeof getHomeContent>;
}) {
  const session = await getSessionState();
  if (session.kind === "guest") redirect(`/${locale}/login`);
  if (session.kind === "unavailable") {
    return <UnavailablePanel copy={content.cabinetPage.unavailable} />;
  }

  const probe = await probeExpertSession();
  if (probe.kind === "not-expert") notFound();
  if (probe.kind === "unavailable") {
    return <UnavailablePanel copy={content.cabinetPage.unavailable} />;
  }

  return (
    <div className="motion-rise grid gap-8">
      <h1 className="font-display text-3xl leading-snug sm:text-4xl">
        {content.cabinetPage.nav.requests}
      </h1>
      <ComingSoonPanel copy={content.cabinetPage.comingSoon} />
    </div>
  );
}

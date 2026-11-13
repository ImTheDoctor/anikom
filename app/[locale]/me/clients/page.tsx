import { notFound, redirect } from "next/navigation";
import { ComingSoonPanel, UnavailablePanel } from "@/components/cabinet/placeholder-panel";
import { getSessionState, probeExpertSession } from "@/lib/cabinet-api";
import { getHomeContent } from "@/lib/home-content";
import { isLocale, siteUrl, type Locale } from "@/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/me/clients">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { cabinetPage } = getHomeContent(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: `${cabinetPage.nav.clients} — Anicom`,
    description: cabinetPage.meta.description,
    alternates: {
      canonical: `/${locale}/me/clients`,
      languages: {
        hy: "/hy/me/clients",
        en: "/en/me/clients",
        ru: "/ru/me/clients",
        "x-default": "/hy/me/clients",
      },
    },
  };
}

// Expert-only placeholder /[locale]/me/clients (no business processes yet).
// The nav hides these items from CLIENTs; direct access 404s for non-experts
// (matching the site convention of not revealing why) and shows the
// unavailable panel when the backend cannot answer.
export default async function ClientsPage({
  params,
}: PageProps<"/[locale]/me/clients">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const localeSafe: Locale = locale;
  const content = getHomeContent(localeSafe);

  return <ClientsContent locale={localeSafe} content={content} />;
}

async function ClientsContent({
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
        {content.cabinetPage.nav.clients}
      </h1>
      <ComingSoonPanel copy={content.cabinetPage.comingSoon} />
    </div>
  );
}

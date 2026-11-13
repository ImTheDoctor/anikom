import { notFound } from "next/navigation";
import { DocumentsPanel } from "@/components/cabinet/documents-panel";
import { getHomeContent } from "@/lib/home-content";
import { isLocale, siteUrl, type Locale } from "@/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/me/documents">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { cabinetPage } = getHomeContent(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: `${cabinetPage.nav.documents} — Anicom`,
    description: cabinetPage.meta.description,
    alternates: {
      canonical: `/${locale}/me/documents`,
      languages: {
        hy: "/hy/me/documents",
        en: "/en/me/documents",
        ru: "/ru/me/documents",
        "x-default": "/hy/me/documents",
      },
    },
  };
}

// Documents page /[locale]/me/documents. The list/upload/delete round-trips
// run client-side through the same-origin proxy (/api/me/documents*), so the
// page itself needs no session data — the layout already guards it.
export default async function DocumentsPage({
  params,
}: PageProps<"/[locale]/me/documents">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const localeSafe: Locale = locale;
  const { cabinetPage } = getHomeContent(localeSafe);

  return (
    <div className="motion-rise grid gap-8">
      <h1 className="font-display text-3xl leading-snug sm:text-4xl">
        {cabinetPage.nav.documents}
      </h1>
      <DocumentsPanel copy={cabinetPage.documents} locale={localeSafe} />
    </div>
  );
}

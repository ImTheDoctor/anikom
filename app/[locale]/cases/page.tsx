import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseCard } from "@/components/cards/case-card";
import { ListPage } from "@/components/list-page";
import { getHomeContent } from "@/lib/home-content";
import { isLocale, siteUrl } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/cases">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const { cases } = getHomeContent(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: `${cases.title} — Anicom`,
    description: cases.description,
    alternates: {
      canonical: `/${locale}/cases`,
      languages: {
        hy: "/hy/cases",
        en: "/en/cases",
        ru: "/ru/cases",
        "x-default": "/hy/cases",
      },
    },
  };
}

export default async function CasesPage({
  params,
}: PageProps<"/[locale]/cases">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = getHomeContent(locale);

  return (
    <ListPage
      content={content}
      locale={locale}
      eyebrow={content.cases.eyebrow}
      title={content.cases.title}
      description={content.cases.description}
    >
      <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
        {content.cases.items.map((item) => (
          <CaseCard
            key={item.slug}
            item={item}
            locale={locale}
            actionLabel={content.cases.cardAction}
          />
        ))}
      </ul>
    </ListPage>
  );
}

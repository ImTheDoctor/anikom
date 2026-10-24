import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsCard } from "@/components/cards/news-card";
import { ListPage } from "@/components/list-page";
import { getHomeContent } from "@/lib/home-content";
import { isLocale, siteUrl } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/news">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const { news } = getHomeContent(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: `${news.title} — Anicom`,
    description: news.description,
    alternates: {
      canonical: `/${locale}/news`,
      languages: {
        hy: "/hy/news",
        en: "/en/news",
        ru: "/ru/news",
        "x-default": "/hy/news",
      },
    },
  };
}

export default async function NewsPage({
  params,
}: PageProps<"/[locale]/news">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = getHomeContent(locale);

  return (
    <ListPage
      content={content}
      locale={locale}
      eyebrow={content.news.eyebrow}
      title={content.news.title}
      description={content.news.description}
    >
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {content.news.items.map((item) => (
          <NewsCard
            key={item.slug}
            item={item}
            locale={locale}
            actionLabel={content.news.cardAction}
          />
        ))}
      </ul>
    </ListPage>
  );
}

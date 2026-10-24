import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { PageShell } from "@/components/page-shell";
import { PreparationNote } from "@/components/preparation-note";
import { getHomeContent } from "@/lib/home-content";
import { isLocale, locales, siteUrl, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getHomeContent(locale).news.items.map((item) => ({
      locale,
      slug: item.slug,
    })),
  );
}

type NewsDetailParams = { locale: string; slug: string };

function findArticle(params: NewsDetailParams) {
  if (!isLocale(params.locale)) return null;
  const locale: Locale = params.locale;
  const content = getHomeContent(locale);
  const item = content.news.items.find((entry) => entry.slug === params.slug);
  return item ? { locale, content, item } : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/news/[slug]">): Promise<Metadata> {
  const resolved = await params;
  const found = findArticle(resolved);
  if (!found) return {};

  return {
    metadataBase: new URL(siteUrl),
    title: `${found.item.title} — Anicom`,
    description: found.content.news.description,
    alternates: {
      canonical: `/${resolved.locale}/news/${resolved.slug}`,
      languages: {
        hy: `/hy/news/${resolved.slug}`,
        en: `/en/news/${resolved.slug}`,
        ru: `/ru/news/${resolved.slug}`,
        "x-default": `/hy/news/${resolved.slug}`,
      },
    },
  };
}

export default async function NewsDetailPage({
  params,
}: PageProps<"/[locale]/news/[slug]">) {
  const resolved = await params;
  const found = findArticle(resolved);
  if (!found) notFound();

  const { locale, content, item } = found;

  return (
    <PageShell content={content} locale={locale}>
      <article className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-15 2xl:max-w-[120rem]">
        <BackLink href={`/${locale}/news`}>{content.news.title}</BackLink>
        <div className="mt-8 max-w-2xl">
          <p className="text-[11px] font-medium tracking-[0.14em] text-primary uppercase">
            {item.category}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{item.date}</p>
          <h1 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
            {item.title}
          </h1>
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden border border-border">
            <Image
              src={`/images/news/${item.slug}.jpg`}
              alt={item.imageLabel}
              fill
              sizes="(max-width: 640px) 100vw, 672px"
              className="object-cover"
            />
          </div>
          <div className="mt-8">
            <PreparationNote>{content.common.pageInProgress}</PreparationNote>
          </div>
        </div>
      </article>
    </PageShell>
  );
}

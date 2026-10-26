import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { ContactCta } from "@/components/home/contact-cta";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
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
    description: found.item.excerpt,
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

  // Related: same category first (data order), then the newest others —
  // rendered in the right sidebar (owner request, Oct 26, 2026).
  const others = content.news.items.filter((entry) => entry.slug !== item.slug);
  const related = [
    ...others.filter((entry) => entry.categorySlug === item.categorySlug),
    ...others.filter((entry) => entry.categorySlug !== item.categorySlug),
  ].slice(0, 4);

  const author = content.team.items.find(
    (expert) => expert.slug === item.authorSlug,
  );

  const categoryTitle = (slug: string) =>
    content.news.categories.find((category) => category.slug === slug)?.title ??
    "";

  return (
    <PageShell content={content} locale={locale}>
      <PageHero
        breadcrumbLabel={content.experts.breadcrumbLabel}
        crumbs={[
          { label: content.experts.breadcrumbHome, href: `/${locale}` },
          { label: content.news.title, href: `/${locale}/news` },
          { label: item.title },
        ]}
        eyebrow={categoryTitle(item.categorySlug)}
        title={item.title}
        meta={`${item.date} · ${item.readMinutes} ${content.news.readTimeUnit}`}
        image={`/images/news/${item.slug}.jpg`}
        overlayClassName="bg-hero/85 md:bg-hero/75 lg:bg-hero/70"
      />

      <article className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]">
        {/* Fixed article measure + sidebar: the block is capped so the visual
            text→sidebar gap stays ~60px instead of stretching with the
            container (owner request, Oct 26, 2026). */}
        <div className="mx-auto w-full max-w-[66rem] lg:grid lg:grid-cols-[minmax(0,42rem)_minmax(0,20rem)] lg:justify-between lg:gap-x-15">
          <div className="min-w-0 max-w-2xl">
            <p className="text-lg leading-relaxed">{item.excerpt}</p>
            <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden border border-border">
              <Image
                src={`/images/news/${item.slug}.jpg`}
                alt={item.imageLabel}
                fill
                sizes="(max-width: 640px) 100vw, 672px"
                className="object-cover"
              />
            </div>
            <div className="mt-10 space-y-6">
              {item.body.map((paragraph, index) => (
                <p key={index} className="text-base leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {author ? (
              <aside className="mt-12 border border-border bg-card p-5 sm:p-6">
                <p className="text-[11px] font-medium tracking-[0.14em] text-primary uppercase">
                  {content.news.detail.authorHeading}
                </p>
                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <span className="relative size-16 shrink-0 overflow-hidden border border-border">
                    <Image
                      src={`/images/team/${author.slug}.jpg`}
                      alt={author.imageLabel}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg leading-snug">
                      {author.name}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {author.role}
                    </p>
                  </div>
                  <Link
                    href={`/${locale}/team/${author.slug}`}
                    transitionTypes={["forward"]}
                    className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none sm:min-h-0"
                  >
                    {content.news.detail.authorProfileLabel}
                    <ArrowRight
                      className="size-4 transition-transform duration-150 group-hover:translate-x-0.5"
                      aria-hidden="true"
                      strokeWidth={1.5}
                    />
                  </Link>
                </div>
              </aside>
            ) : null}
          </div>

          <aside
            aria-labelledby="news-related-heading"
            className="mt-12 lg:sticky lg:top-24 lg:mt-0 lg:self-start"
          >
            <h2
              id="news-related-heading"
              className="font-display text-xl leading-snug sm:text-2xl"
            >
              {content.news.detail.relatedHeading}
            </h2>
            <ul className="mt-6 border-t border-border">
              {related.map((entry) => (
                <li
                  key={entry.slug}
                  className="group relative border-b border-border py-4"
                >
                  <div className="flex gap-3.5">
                    <span
                      aria-hidden="true"
                      className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden border border-border"
                    >
                      <Image
                        src={`/images/news/${entry.slug}.jpg`}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium tracking-[0.14em] text-primary uppercase">
                        {categoryTitle(entry.categorySlug)}
                      </p>
                      <h3 className="mt-1 font-display text-base leading-snug underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 group-hover:decoration-primary">
                        {entry.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {entry.date}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/${locale}/news/${entry.slug}`}
                    transitionTypes={["forward"]}
                    className="absolute inset-0 focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <span className="sr-only">
                      {content.news.cardAction} — {entry.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </article>

      <ContactCta content={content} locale={locale} />
    </PageShell>
  );
}

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
    getHomeContent(locale).cases.items.map((item) => ({
      locale,
      slug: item.slug,
    })),
  );
}

type CaseDetailParams = { locale: string; slug: string };

function findCase(params: CaseDetailParams) {
  if (!isLocale(params.locale)) return null;
  const locale: Locale = params.locale;
  const content = getHomeContent(locale);
  const item = content.cases.items.find((entry) => entry.slug === params.slug);
  return item ? { locale, content, item } : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/cases/[slug]">): Promise<Metadata> {
  const resolved = await params;
  const found = findCase(resolved);
  if (!found) return {};

  return {
    metadataBase: new URL(siteUrl),
    title: `${found.item.title} — Anicom`,
    description: found.content.cases.description,
    alternates: {
      canonical: `/${resolved.locale}/cases/${resolved.slug}`,
      languages: {
        hy: `/hy/cases/${resolved.slug}`,
        en: `/en/cases/${resolved.slug}`,
        ru: `/ru/cases/${resolved.slug}`,
        "x-default": `/hy/cases/${resolved.slug}`,
      },
    },
  };
}

export default async function CaseDetailPage({
  params,
}: PageProps<"/[locale]/cases/[slug]">) {
  const resolved = await params;
  const found = findCase(resolved);
  if (!found) notFound();

  const { locale, content, item } = found;

  return (
    <PageShell content={content} locale={locale}>
      <article className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-15 2xl:max-w-[120rem]">
        <BackLink href={`/${locale}/cases`}>{content.cases.title}</BackLink>
        <div className="mt-8 max-w-3xl">
          <p className="text-[11px] font-medium tracking-[0.14em] text-primary uppercase">
            {item.category}
          </p>
          <h1 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
            {item.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{item.date}</p>
          <div className="relative mt-8 aspect-[4/3] w-full overflow-hidden border border-border">
            <Image
              src={`/images/cases/${item.slug}.jpg`}
              alt={item.imageLabel}
              fill
              sizes="(max-width: 1024px) 100vw, 768px"
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

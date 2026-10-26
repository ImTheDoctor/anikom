import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseCard } from "@/components/cards/case-card";
import { ContactCta } from "@/components/home/contact-cta";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
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
    description: found.item.summary,
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

// Case detail (owner request, Oct 2026): the dossier-page structure — dark
// hero band with breadcrumb and the examination-type chip, then the
// task → research → result narrative beside a sticky facts panel, other
// practice cases, and the shared contact banner. All copy lives in
// cases.items[].summary/task/work/result + cases.detail (draft demo data,
// design doc §11).
export default async function CaseDetailPage({
  params,
}: PageProps<"/[locale]/cases/[slug]">) {
  const resolved = await params;
  const found = findCase(resolved);
  if (!found) notFound();

  const { locale, content, item } = found;
  const { cases, services, experts } = content;
  const direction = services.items.find(
    (service) => service.slug === item.serviceSlug,
  );

  // Same-direction cases first, then the rest, current page excluded — four
  // cards to fill the row.
  const related = [
    ...cases.items.filter(
      (entry) => entry.serviceSlug === item.serviceSlug && entry.slug !== item.slug,
    ),
    ...cases.items.filter(
      (entry) => entry.serviceSlug !== item.serviceSlug && entry.slug !== item.slug,
    ),
  ].slice(0, 4);

  return (
    <PageShell content={content} locale={locale}>
      {/* Hero band over the case's own photo (the same image the body shows
          framed below — the photo is the page's subject). */}
      <PageHero
        breadcrumbLabel={experts.breadcrumbLabel}
        crumbs={[
          { label: experts.breadcrumbHome, href: `/${locale}` },
          { label: cases.title, href: `/${locale}/cases` },
          { label: item.title },
        ]}
        eyebrow={item.category}
        title={item.title}
        meta={item.date}
        chips={[item.examinationType]}
        image={`/images/cases/${item.slug}.jpg`}
      />

      <section className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14">
          <div className="min-w-0">
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-border">
              <Image
                src={`/images/cases/${item.slug}.jpg`}
                alt={item.imageLabel}
                fill
                sizes="(max-width: 1024px) 100vw, 768px"
                className="object-cover"
              />
            </div>

            <p className="mt-8 text-base leading-relaxed sm:text-lg">
              {item.summary}
            </p>

            <h2 className="mt-10 font-display text-2xl leading-snug sm:text-3xl">
              {cases.detail.taskHeading}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed">
              {item.task}
            </p>

            <h2 className="mt-10 font-display text-2xl leading-snug sm:text-3xl">
              {cases.detail.workHeading}
            </h2>
            <ul className="mt-4 border-t border-border">
              {item.work.map((step) => (
                <li
                  key={step}
                  className="flex gap-3 border-b border-border py-2.5 text-sm leading-relaxed sm:text-base"
                >
                  <span aria-hidden="true" className="shrink-0 text-primary">
                    —
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>

            <h2 className="mt-10 font-display text-2xl leading-snug sm:text-3xl">
              {cases.detail.resultHeading}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed">
              {item.result}
            </p>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
              {cases.detail.factsHeading}
            </h2>
            <dl className="mt-5 border-t border-border">
              <div className="border-b border-border py-3">
                <dt className="text-xs text-muted-foreground">
                  {cases.detail.directionLabel}
                </dt>
                <dd className="mt-1">
                  {direction ? (
                    <Link
                      href={`/${locale}/services/${direction.slug}`}
                      transitionTypes={["forward"]}
                      className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary-hover hover:underline focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      {direction.title}
                    </Link>
                  ) : (
                    <span className="text-sm font-medium">{item.category}</span>
                  )}
                </dd>
              </div>
              <div className="border-b border-border py-3">
                <dt className="text-xs text-muted-foreground">
                  {cases.detail.typeLabel}
                </dt>
                <dd className="mt-1 text-sm font-medium">{item.examinationType}</dd>
              </div>
              <div className="border-b border-border py-3">
                <dt className="text-xs text-muted-foreground">
                  {cases.detail.placeYearLabel}
                </dt>
                <dd className="mt-1 text-sm font-medium">{item.date}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section aria-labelledby="case-other" className="border-t border-border">
        <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]">
          <h2
            id="case-other"
            className="font-display text-2xl leading-snug sm:text-3xl"
          >
            {cases.detail.otherHeading}
          </h2>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
            {related.map((entry) => (
              <CaseCard
                key={entry.slug}
                item={entry}
                locale={locale}
                actionLabel={cases.cardAction}
              />
            ))}
          </ul>
        </div>
      </section>

      <ContactCta content={content} locale={locale} />
    </PageShell>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActionLink } from "@/components/action-link";
import { CaseCard } from "@/components/cards/case-card";
import { ExpertCard } from "@/components/experts/expert-card";
import { ContactCta } from "@/components/home/contact-cta";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";
import { ServiceIndex } from "@/components/service-index";
import { ServiceTypeDetail } from "@/components/service-type-detail";
import { ServiceTypesList } from "@/components/service-types";
import { getHomeContent } from "@/lib/home-content";
import { isLocale, locales, siteUrl, type Locale } from "@/lib/i18n";

// Editorial cross-links between the eight directions (current page excluded);
// labels come from services.items, so no copy lives here.
const relatedBySlug: Record<string, string[]> = {
  "judicial-examinations": [
    "document-research",
    "auto-technical-examinations",
    "construction-technical-examinations",
    "damage-assessment",
  ],
  "construction-technical-examinations": [
    "damage-assessment",
    "geodetic-cadastral-works",
    "property-valuation",
    "judicial-examinations",
  ],
  "property-valuation": [
    "damage-assessment",
    "economic-accounting-examinations",
    "construction-technical-examinations",
  ],
  "auto-technical-examinations": [
    "damage-assessment",
    "judicial-examinations",
    "property-valuation",
  ],
  "economic-accounting-examinations": [
    "property-valuation",
    "judicial-examinations",
    "document-research",
  ],
  "document-research": [
    "judicial-examinations",
    "economic-accounting-examinations",
    "auto-technical-examinations",
  ],
  "geodetic-cadastral-works": [
    "construction-technical-examinations",
    "property-valuation",
    "judicial-examinations",
  ],
  "damage-assessment": [
    "construction-technical-examinations",
    "auto-technical-examinations",
    "property-valuation",
    "judicial-examinations",
  ],
};

export function generateStaticParams() {
  return locales.flatMap((locale) => {
    const content = getHomeContent(locale);
    return [
      ...content.services.items.map((item) => ({ locale, slug: item.slug })),
      // Standalone classifier types only — types subordinate to a direction
      // are covered by the direction page and get no route of their own.
      ...content.serviceClassifier.types
        .filter((type) => !type.serviceSlug)
        .map((type) => ({ locale, slug: type.slug })),
    ];
  });
}

type ServiceDetailParams = { locale: string; slug: string };

// One dynamic segment serves both page kinds: the eight company directions
// (rich pages with intro/tasks/experts/cases) and the five standalone
// classifier types (subtypes/objects/tasks/related directions). Slugs are
// disjoint across the two sets; classifier types that belong to a direction
// are treated as its subtypes and resolve to notFound here.
function findEntry(params: ServiceDetailParams) {
  if (!isLocale(params.locale)) return null;
  const locale: Locale = params.locale;
  const content = getHomeContent(locale);
  const direction = content.services.items.find(
    (item) => item.slug === params.slug,
  );
  if (direction) {
    const catalog = content.serviceCatalog[params.slug];
    if (!catalog) return null;
    return { kind: "direction" as const, locale, content, item: direction, catalog };
  }
  const type = content.serviceClassifier.types.find(
    (entry) => entry.slug === params.slug && !entry.serviceSlug,
  );
  if (type) return { kind: "type" as const, locale, content, type };
  return null;
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services/[slug]">): Promise<Metadata> {
  const resolved = await params;
  const found = findEntry(resolved);
  if (!found) return {};

  const title =
    found.kind === "direction" ? found.catalog.metaTitle : found.type.title;
  const description =
    found.kind === "direction"
      ? found.catalog.metaDescription
      : found.type.description;

  return {
    metadataBase: new URL(siteUrl),
    title: `${title} — Anicom`,
    description,
    alternates: {
      canonical: `/${resolved.locale}/services/${resolved.slug}`,
      languages: {
        hy: `/hy/services/${resolved.slug}`,
        en: `/en/services/${resolved.slug}`,
        ru: `/ru/services/${resolved.slug}`,
        "x-default": `/hy/services/${resolved.slug}`,
      },
    },
  };
}

// Service direction detail page (catalog phase, Oct 2026): dark hero band
// with the classifier codes as mono chips, then the types/subtypes index in
// the service-index row language, objects, tasks (where present), the
// direction's experts and practice cases, related directions, and the shared
// contact banner. All copy comes from the serviceCatalog JSON block; codes
// follow the public RA classifier of examination types and the texts are
// draft copy pending client review (see docs/design-system.md §11).
export default async function ServiceDetailPage({
  params,
}: PageProps<"/[locale]/services/[slug]">) {
  const resolved = await params;
  const found = findEntry(resolved);
  if (!found) notFound();

  if (found.kind === "type") {
    return (
      <ServiceTypeDetail
        type={found.type}
        content={found.content}
        locale={found.locale}
      />
    );
  }

  const { locale, content, item, catalog } = found;
  const { services, cases, team, experts } = content;
  const titleBySlug = new Map(
    services.items.map((service) => [service.slug, service.title]),
  );
  const directionExperts = team.items
    .filter((expert) => expert.directions.includes(item.slug))
    .slice(0, 4);
  const directionCases = cases.items.filter(
    (caseItem) => caseItem.serviceSlug === item.slug,
  );
  const relatedSlugs = new Set(relatedBySlug[item.slug]);
  const relatedItems = services.items.filter(
    (service) => service.slug !== item.slug && relatedSlugs.has(service.slug),
  );
  const taskCategories = catalog.taskCategories ?? [];

  return (
    <PageShell content={content} locale={locale}>
      {/* Hero band: breadcrumb, h1, intro, classifier codes over the
          direction's thematic photo (same treatment as the other hero
          bands). */}
      <PageHero
        breadcrumbLabel={experts.breadcrumbLabel}
        crumbs={[
          { label: experts.breadcrumbHome, href: `/${locale}` },
          { label: services.heading, href: `/${locale}/services` },
          { label: item.title },
        ]}
        title={item.title}
        image={`/images/heroes/${item.slug}.jpg`}
        overlayClassName="bg-hero/85 md:bg-hero/75 lg:bg-hero/70"
      >
        <div className="motion-rise mt-4 max-w-2xl space-y-4 [--motion-delay:80ms]">
          {catalog.intro.map((paragraph) => (
            <p
              key={paragraph}
              className="text-base leading-relaxed text-hero-foreground sm:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </div>
        {catalog.codes.length > 0 ? (
          <ul className="motion-rise mt-6 flex flex-wrap gap-2 [--motion-delay:160ms]">
            {catalog.codes.map((code) => (
              <li
                key={code}
                className="rounded-full border border-hero-border px-3 py-1 font-mono text-[11px] tracking-[0.16em] text-hero-accent"
              >
                {code}
              </li>
            ))}
          </ul>
        ) : null}
      </PageHero>

      {/* Types and subtypes: hairline rows in the service-index language. */}
      <section
        aria-labelledby="service-types"
        className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]"
      >
        <h2
          id="service-types"
          className="font-display text-2xl leading-snug sm:text-3xl"
        >
          {catalog.typesHeading}
        </h2>
        <div className="mt-8">
          <ServiceTypesList types={catalog.types} />
        </div>
      </section>

      {/* Objects of examination. */}
      <section
        aria-labelledby="service-objects"
        className="border-t border-border"
      >
        <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]">
          <h2
            id="service-objects"
            className="font-display text-2xl leading-snug sm:text-3xl"
          >
            {catalog.objectsHeading}
          </h2>
          <ul className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {catalog.objects.map((object) => (
              <li key={object} className="flex gap-3 text-base leading-relaxed">
                <span aria-hidden="true" className="shrink-0 text-primary">
                  —
                </span>
                <span>{object}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Examination tasks (directions with task categories only). */}
      {taskCategories.length > 0 && catalog.tasksHeading ? (
        <section
          aria-labelledby="service-tasks"
          className="border-t border-border"
        >
          <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]">
            <h2
              id="service-tasks"
              className="font-display text-2xl leading-snug sm:text-3xl"
            >
              {catalog.tasksHeading}
            </h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {taskCategories.map((category) => (
                <div key={category.title} className="min-w-0">
                  <h3 className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
                    {category.title}
                  </h3>
                  <ul className="mt-4">
                    {category.items.map((task) => (
                      <li
                        key={task}
                        className="flex gap-3 border-t border-border py-2.5 text-sm leading-relaxed"
                      >
                        <span aria-hidden="true" className="shrink-0 text-primary">
                          —
                        </span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Experts of the direction (roster filtered by directions, max 4). */}
      {directionExperts.length > 0 ? (
        <section
          aria-labelledby="service-experts"
          className="border-t border-border"
        >
          <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2
                id="service-experts"
                className="font-display text-2xl leading-snug sm:text-3xl"
              >
                {catalog.expertsHeading}
              </h2>
              <ActionLink href={`/${locale}/team`}>{team.action}</ActionLink>
            </div>
            <Reveal
              as="ul"
              stagger
              className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
            >
              {directionExperts.map((expert) => (
                <ExpertCard
                  key={expert.slug}
                  item={expert}
                  directionLabels={expert.directions
                    .map((slug) => titleBySlug.get(slug))
                    .filter((title): title is string => Boolean(title))}
                  locale={locale}
                  actionLabel={experts.cardAction}
                />
              ))}
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Practice: cases linked to this direction (hidden when none). */}
      {directionCases.length > 0 ? (
        <section
          aria-labelledby="service-cases"
          className="border-t border-border"
        >
          <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2
                id="service-cases"
                className="font-display text-2xl leading-snug sm:text-3xl"
              >
                {catalog.casesHeading}
              </h2>
              <ActionLink href={`/${locale}/cases`}>{cases.action}</ActionLink>
            </div>
            <Reveal
              as="ul"
              stagger
              className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4"
            >
              {directionCases.map((caseItem) => (
                <CaseCard
                  key={caseItem.slug}
                  item={caseItem}
                  locale={locale}
                  actionLabel={cases.cardAction}
                />
              ))}
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* Other directions: the shared linked index over the related subset. */}
      <section
        aria-labelledby="service-other"
        className="border-t border-border"
      >
        <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]">
          <h2
            id="service-other"
            className="font-display text-2xl leading-snug sm:text-3xl"
          >
            {catalog.otherHeading}
          </h2>
          <div className="mt-8">
            <ServiceIndex
              services={{ ...services, items: relatedItems }}
              locale={locale}
            />
          </div>
        </div>
      </section>

      <ContactCta content={content} locale={locale} />
    </PageShell>
  );
}

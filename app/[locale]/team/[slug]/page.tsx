import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ActionLink } from "@/components/action-link";
import { ExpertCard } from "@/components/experts/expert-card";
import { ContactCta } from "@/components/home/contact-cta";
import { PageShell } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";
import { getHomeContent } from "@/lib/home-content";
import { isLocale, locales, siteUrl, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getHomeContent(locale).team.items.map((item) => ({
      locale,
      slug: item.slug,
    })),
  );
}

type TeamDetailParams = { locale: string; slug: string };

function findMember(params: TeamDetailParams) {
  if (!isLocale(params.locale)) return null;
  const locale: Locale = params.locale;
  const content = getHomeContent(locale);
  const item = content.team.items.find((entry) => entry.slug === params.slug);
  return item ? { locale, content, item } : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/team/[slug]">): Promise<Metadata> {
  const resolved = await params;
  const found = findMember(resolved);
  if (!found) return {};

  return {
    metadataBase: new URL(siteUrl),
    title: `${found.item.name} — Anicom`,
    description: found.item.role,
    alternates: {
      canonical: `/${resolved.locale}/team/${resolved.slug}`,
      languages: {
        hy: `/hy/team/${resolved.slug}`,
        en: `/en/team/${resolved.slug}`,
        ru: `/ru/team/${resolved.slug}`,
        "x-default": `/hy/team/${resolved.slug}`,
      },
    },
  };
}

// Expert profile (owner request, Oct 2026): breadcrumb header with portrait,
// facts, bio, education and career hairline rows, certificates (scans where
// copies exist — currently the director's four documents — otherwise text
// rows), related experts, and the contact banner. The roster is draft demo
// data; the director's profile is grounded in his own documents.
export default async function TeamDetailPage({
  params,
}: PageProps<"/[locale]/team/[slug]">) {
  const resolved = await params;
  const found = findMember(resolved);
  if (!found) notFound();

  const { locale, content, item } = found;
  const { experts, team, services } = content;
  const ui = experts.profileUi;
  const titleBySlug = new Map(
    services.items.map((service) => [service.slug, service.title]),
  );
  const directionLabels = item.directions
    .map((slug) => titleBySlug.get(slug))
    .filter((title): title is string => Boolean(title));
  const withScans = item.profile.certificates.filter(
    (certificate) => certificate.image,
  );
  const textOnly = item.profile.certificates.filter(
    (certificate) => !certificate.image,
  );
  const similar = team.items
    .filter((other) => other.slug !== item.slug)
    .map((other) => ({
      other,
      shared: other.directions.filter((direction) =>
        item.directions.includes(direction),
      ).length,
    }))
    .sort((a, b) => b.shared - a.shared)
    .slice(0, 4)
    .map((entry) => entry.other);

  const factRowClass =
    "grid grid-cols-[8rem_1fr] gap-4 py-3 sm:grid-cols-[10rem_1fr]";
  const factLabelClass =
    "text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase";
  const factValueClass = "text-sm font-medium";

  const periodRowClass = "py-4";
  const listRowClass = "divide-y divide-border border-t border-border";

  return (
    <PageShell content={content} locale={locale}>
      {/* Header: breadcrumb, portrait, name, role, facts */}
      <section className="mx-auto w-full px-4 py-10 sm:px-6 sm:py-14 lg:px-15 2xl:max-w-[120rem]">
        <nav aria-label={experts.breadcrumbLabel}>
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link
                href={`/${locale}`}
                transitionTypes={["back"]}
                className="rounded-sm transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
              >
                {experts.breadcrumbHome}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li>
              <Link
                href={`/${locale}/team`}
                transitionTypes={["back"]}
                className="rounded-sm transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
              >
                {experts.title}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li aria-current="page" className="text-foreground">
              {item.name}
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-8 sm:gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-12">
          <div className="relative aspect-[3/4] w-full max-w-xs overflow-hidden border border-border lg:max-w-none">
            <Image
              src={`/images/team/${item.slug}.jpg`}
              alt={item.imageLabel}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 320px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-medium text-primary">{item.role}</p>
            <h1 className="mt-2 font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
              {item.name}
            </h1>
            {directionLabels.length > 0 ? (
              <ul className="mt-5 flex min-w-0 flex-wrap gap-1.5">
                {directionLabels.map((label) => (
                  <li
                    key={label}
                    title={label}
                    className="max-w-full truncate rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {label}
                  </li>
                ))}
              </ul>
            ) : null}

            <dl className="mt-8 divide-y divide-border border-y border-border">
              <div className={factRowClass}>
                <dt className={factLabelClass}>{ui.experienceLabel}</dt>
                <dd className={factValueClass}>{item.experience}</dd>
              </div>
              <div className={factRowClass}>
                <dt className={factLabelClass}>{ui.languagesLabel}</dt>
                <dd className={factValueClass}>
                  {item.profile.languages.join(" · ")}
                </dd>
              </div>
              <div className={factRowClass}>
                <dt className={factLabelClass}>{ui.certificatesLabel}</dt>
                <dd className={factValueClass}>
                  {item.profile.certificates.length}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* About */}
      <section
        aria-labelledby="expert-about"
        className="border-t border-border"
      >
        <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]">
          <h2
            id="expert-about"
            className="font-display text-2xl leading-snug sm:text-3xl"
          >
            {ui.aboutTitle}
          </h2>
          <div className="mt-6 max-w-2xl space-y-4">
            {item.profile.bio.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Education and career */}
      <section
        aria-labelledby="expert-education"
        className="border-t border-border"
      >
        <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2
                id="expert-education"
                className="font-display text-2xl leading-snug"
              >
                {ui.educationTitle}
              </h2>
              <ul className={`mt-6 ${listRowClass}`}>
                {item.profile.education.map((entry) => (
                  <li key={`${entry.period}-${entry.title}`} className={periodRowClass}>
                    <p className="text-xs font-medium text-muted-foreground">
                      {entry.period}
                    </p>
                    <p className="mt-1 text-sm font-medium">{entry.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {entry.place}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-2xl leading-snug">
                {ui.careerTitle}
              </h2>
              <ul className={`mt-6 ${listRowClass}`}>
                {item.profile.career.map((entry) => (
                  <li key={`${entry.period}-${entry.title}`} className={periodRowClass}>
                    <p className="text-xs font-medium text-muted-foreground">
                      {entry.period}
                    </p>
                    <p className="mt-1 text-sm font-medium">{entry.title}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {entry.place}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Certificates */}
      <section
        aria-labelledby="expert-certificates"
        className="border-t border-border"
      >
        <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]">
          <h2
            id="expert-certificates"
            className="font-display text-2xl leading-snug sm:text-3xl"
          >
            {ui.certificatesTitle}
          </h2>

          {withScans.length > 0 ? (
            <Reveal
              as="ul"
              stagger
              className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-6"
            >
              {withScans.map((certificate) => (
                <li
                  key={certificate.title}
                  className="border border-border bg-card"
                >
                  <div className="relative aspect-[3/2] w-full">
                    <Image
                      src={certificate.image ?? ""}
                      alt={certificate.imageLabel ?? certificate.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-contain"
                    />
                  </div>
                  <div className="border-t border-border p-4">
                    <p className="text-sm font-medium">{certificate.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {certificate.issuer} · {certificate.year}
                      {certificate.number ? ` · ${certificate.number}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </Reveal>
          ) : null}

          {textOnly.length > 0 ? (
            <ul
              className={`${withScans.length > 0 ? "mt-6" : "mt-8"} ${listRowClass}`}
            >
              {textOnly.map((certificate) => (
                <li
                  key={certificate.title}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4"
                >
                  <p className="text-sm font-medium">{certificate.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {certificate.issuer} · {certificate.year}
                    {certificate.number ? ` · ${certificate.number}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      {/* Related experts */}
      <section
        aria-labelledby="expert-similar"
        className="border-t border-border"
      >
        <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2
              id="expert-similar"
              className="font-display text-2xl leading-snug sm:text-3xl"
            >
              {ui.similarTitle}
            </h2>
            <ActionLink href={`/${locale}/team`}>{team.action}</ActionLink>
          </div>
          <Reveal
            as="ul"
            stagger
            className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
          >
            {similar.map((other) => (
              <ExpertCard
                key={other.slug}
                item={other}
                directionLabels={other.directions
                  .map((slug) => titleBySlug.get(slug))
                  .filter((title): title is string => Boolean(title))}
                locale={locale}
                actionLabel={experts.cardAction}
                view="grid"
              />
            ))}
          </Reveal>
        </div>
      </section>

      <ContactCta content={content} locale={locale} />
    </PageShell>
  );
}

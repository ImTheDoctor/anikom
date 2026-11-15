import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ActionLink } from "@/components/action-link";
import { CertificateGallery } from "@/components/certificate-gallery";
import { ExpertCard } from "@/components/experts/expert-card";
import { ContactCta } from "@/components/home/contact-cta";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";
import {
  formatCertificateNumber,
  getExpertDetail,
  getExpertRoster,
  type ExpertCertificate,
} from "@/lib/experts-api";
import { getHomeContent } from "@/lib/home-content";
import { isLocale, locales, siteUrl } from "@/lib/i18n";

// Slugs added by admins after a build are not in the static params set; an
// on-demand render of those would fail prerendering on the uncached `params`
// access. A blocking route keeps the seeded profiles prerendered while new
// ones render on request (all data reads are cached, so this stays fast).
export const instant = false;

// Prerender params from the cached roster (backend Experts module with the
// JSON fallback, lib/experts-api.ts). Profiles added by admins after the
// build render on demand and then cache like the seeded ones.
export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    const roster = await getExpertRoster(locale);
    for (const item of roster.items) params.push({ locale, slug: item.slug });
  }
  return params;
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/team/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const detail = await getExpertDetail(slug, locale);
  if (!detail) return {};

  return {
    metadataBase: new URL(siteUrl),
    title: `${detail.name} — Anicom`,
    description: detail.role,
    alternates: {
      canonical: `/${locale}/team/${slug}`,
      languages: {
        hy: `/hy/team/${slug}`,
        en: `/en/team/${slug}`,
        ru: `/ru/team/${slug}`,
        "x-default": `/hy/team/${slug}`,
      },
    },
  };
}

// Expert profile (owner request, Oct 2026): breadcrumb header with portrait,
// bio, certificates (scans where the backend has them, otherwise text rows),
// related experts, and the contact banner. The profile comes from the
// backend Experts module (lib/experts-api.ts); similar experts are computed
// here from the shared service directions.
export default async function TeamDetailPage({
  params,
}: PageProps<"/[locale]/team/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const [detail, roster] = await Promise.all([
    getExpertDetail(slug, locale),
    getExpertRoster(locale),
  ]);
  if (!detail) notFound();

  const content = getHomeContent(locale);
  const { experts, team } = content;
  const ui = experts.profileUi;
  const similar = roster.items
    .filter((other) => other.slug !== detail.slug)
    .map((other) => ({
      other,
      shared: other.directions.filter((direction) =>
        detail.directions.includes(direction),
      ).length,
    }))
    .sort((a, b) => b.shared - a.shared)
    .slice(0, 4)
    .map((entry) => entry.other);

  const listRowClass = "divide-y divide-border border-t border-border";

  // The official bio lists documents without issue years, so every part is
  // optional and empty ones drop out of the meta line.
  const certificateMeta = (certificate: ExpertCertificate) =>
    [
      certificate.issuer,
      certificate.year,
      certificate.number
        ? formatCertificateNumber(certificate.number, locale)
        : null,
    ]
      .filter((part): part is string => Boolean(part))
      .join(" · ");

  // Scan-carrying certificates go to the client lightbox gallery; text-only
  // records stay server-rendered hairline rows.
  const scans = detail.profile.certificates.flatMap((certificate) =>
    certificate.scanUrl
      ? [
          {
            title: certificate.title,
            issuer: certificate.issuer ?? "",
            year: certificate.year ?? "",
            number: certificate.number
              ? formatCertificateNumber(certificate.number, locale)
              : undefined,
            image: certificate.scanUrl,
            imageLabel: certificate.imageLabel ?? certificate.title,
          },
        ]
      : [],
  );
  const textOnly = detail.profile.certificates.filter(
    (certificate) => !certificate.scanUrl,
  );

  return (
    <PageShell content={content} locale={locale}>
      {/* Hero band over the primary direction's thematic photo; the portrait
          stays in the header section below. */}
      <PageHero
        breadcrumbLabel={experts.breadcrumbLabel}
        crumbs={[
          { label: experts.breadcrumbHome, href: `/${locale}` },
          { label: experts.title, href: `/${locale}/team` },
          { label: detail.name },
        ]}
        eyebrow={detail.role}
        eyebrowPosition="below"
        title={detail.name}
        image={`/images/heroes/${detail.directions[0] ?? "judicial-examinations"}.jpg`}
        overlayClassName="bg-hero/85 md:bg-hero/75 lg:bg-hero/70"
      />

      {/* Header: sticky portrait beside the about text (owner request,
          Nov 11, 2026 — larger portrait, no visible h2, wider bio measure
          so the right side does not read empty at wide screens). */}
      <section
        aria-label={ui.aboutTitle}
        className="mx-auto w-full px-4 pt-10 pb-4 sm:px-6 sm:pt-14 lg:px-15 2xl:max-w-[120rem]"
      >
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:gap-12">
          <div className="relative aspect-[3/4] w-full max-w-xs overflow-hidden border border-border sm:max-w-sm lg:sticky lg:top-24 lg:max-w-none lg:self-start">
            <Image
              src={detail.portraitUrl ?? `/images/team/${detail.slug}.jpg`}
              alt={detail.imageLabel}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 448px"
              className="object-cover"
            />
          </div>

          <div className="min-w-0">
            <div className="space-y-4 lg:max-w-5xl">
              {detail.profile.bio.map((paragraph) => (
                <p key={paragraph} className="text-base leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certificates: real client-provided scans, click-to-view lightbox
          (owner request, Nov 11, 2026). Text-only records render as
          hairline rows. */}
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

          {scans.length > 0 ? (
            <div className="mt-8">
              <CertificateGallery
                certificates={scans}
                closeLabel={ui.closeLabel}
                viewCertificateLabel={ui.viewCertificateLabel}
              />
            </div>
          ) : null}

          {textOnly.length > 0 ? (
            <ul
              className={`${scans.length > 0 ? "mt-6" : "mt-8"} ${listRowClass}`}
            >
              {textOnly.map((certificate) => (
                <li
                  key={certificate.title}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4"
                >
                  <p className="text-sm font-medium">{certificate.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {certificateMeta(certificate)}
                  </p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      {/* Related experts (hidden while the roster has no other experts) */}
      {similar.length > 0 ? (
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
               
                locale={locale}
                actionLabel={experts.cardAction}
              />
            ))}
          </Reveal>
        </div>
        </section>
      ) : null}

      <ContactCta content={content} locale={locale} />
    </PageShell>
  );
}

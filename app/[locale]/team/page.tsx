import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ExpertsDirectory } from "@/components/experts/experts-directory";
import { ContactCta } from "@/components/home/contact-cta";
import { PageShell } from "@/components/page-shell";
import { getHomeContent } from "@/lib/home-content";
import { isLocale, siteUrl } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/team">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const { experts } = getHomeContent(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: `${experts.metaTitle} — Anicom`,
    description: experts.description,
    alternates: {
      canonical: `/${locale}/team`,
      languages: {
        hy: "/hy/team",
        en: "/en/team",
        ru: "/ru/team",
        "x-default": "/hy/team",
      },
    },
  };
}

// Expert directory (owner reference design, Oct 2026): a compact hero band
// with breadcrumb and stats over a filterable catalog — direction chips, a
// filter sidebar (search / directions / experience), sort, grid/list views,
// and pagination. The roster is draft demo data (design doc §11).
export default async function ExpertsPage({
  params,
}: PageProps<"/[locale]/team">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = getHomeContent(locale);
  const { experts, team } = content;

  return (
    <PageShell content={content} locale={locale}>
      <section className="bg-hero text-hero-foreground">
        <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-15 2xl:max-w-[120rem]">
          <nav aria-label={experts.breadcrumbLabel}>
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-hero-muted">
              <li>
                <Link
                  href={`/${locale}`}
                  transitionTypes={["back"]}
                  className="rounded-sm transition-colors hover:text-hero-foreground focus-visible:ring-3 focus-visible:ring-hero-accent focus-visible:outline-none"
                >
                  {experts.breadcrumbHome}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="text-hero-foreground">
                {experts.title}
              </li>
            </ol>
          </nav>

          <h1 className="motion-rise mt-5 font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
            {experts.title}
          </h1>
          <p className="motion-rise mt-4 max-w-2xl text-base leading-relaxed text-hero-muted sm:text-lg [--motion-delay:80ms]">
            {experts.description}
          </p>

          <dl className="motion-rise mt-10 grid max-w-3xl grid-cols-1 gap-6 border-t border-hero-border pt-6 sm:grid-cols-3 [--motion-delay:160ms]">
            {experts.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <dt className="order-2 mt-2 text-[11px] leading-snug font-medium tracking-[0.14em] text-hero-muted uppercase">
                  {stat.label}
                </dt>
                <dd className="order-1 font-display text-3xl leading-none text-hero-foreground sm:text-4xl">
                  {stat.value}
                </dd>
              </div>
            ))}
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-[11px] leading-snug font-medium tracking-[0.14em] text-hero-muted uppercase">
                {experts.rosterStatLabel}
              </dt>
              <dd className="order-1 font-display text-3xl leading-none text-hero-foreground sm:text-4xl">
                {team.items.length}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]">
        <ExpertsDirectory
          items={team.items.map(
            ({
              slug,
              name,
              role,
              imageLabel,
              directions,
              experienceYears,
              experience,
            }) => ({
              slug,
              name,
              role,
              imageLabel,
              directions,
              experienceYears,
              experience,
            }),
          )}
          services={content.services.items.map(({ slug, title }) => ({
            slug,
            title,
          }))}
          experts={experts}
          locale={locale}
        />
      </section>

      <ContactCta content={content} locale={locale} />
    </PageShell>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExpertsDirectory } from "@/components/experts/experts-directory";
import { ContactCta } from "@/components/home/contact-cta";
import { PageHero } from "@/components/page-hero";
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
// with breadcrumb and stats over a plain paginated card grid. Filtering,
// sorting, and the grid/list view toggle were all removed by owner decision
// (Oct 2026). The roster is draft demo data (design doc §11).
export default async function ExpertsPage({
  params,
}: PageProps<"/[locale]/team">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = getHomeContent(locale);
  const { experts, team } = content;

  return (
    <PageShell content={content} locale={locale}>
      <PageHero
        breadcrumbLabel={experts.breadcrumbLabel}
        crumbs={[
          { label: experts.breadcrumbHome, href: `/${locale}` },
          { label: experts.title },
        ]}
        title={experts.title}
        description={experts.description}
        image="/images/heroes/team.jpg"
      >
        <dl className="motion-rise mt-10 grid max-w-3xl grid-cols-1 gap-6 border-t border-hero-border pt-6 sm:grid-cols-3 [--motion-delay:160ms]">
          {experts.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <dt className="order-2 mt-2 text-[11px] leading-snug font-medium tracking-[0.14em] text-hero-foreground/80 uppercase">
                {stat.label}
              </dt>
              <dd className="order-1 font-display text-3xl leading-none text-hero-foreground sm:text-4xl">
                {stat.value}
              </dd>
            </div>
          ))}
          <div className="flex flex-col">
            <dt className="order-2 mt-2 text-[11px] leading-snug font-medium tracking-[0.14em] text-hero-foreground/80 uppercase">
              {experts.rosterStatLabel}
            </dt>
            <dd className="order-1 font-display text-3xl leading-none text-hero-foreground sm:text-4xl">
              {team.items.length}
            </dd>
          </div>
        </dl>
      </PageHero>

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

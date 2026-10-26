import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ContactCta } from "@/components/home/contact-cta";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { getHomeContent } from "@/lib/home-content";
import { isLocale, siteUrl } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const { aboutPage } = getHomeContent(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: `${aboutPage.metaTitle} — Anicom`,
    description: aboutPage.metaDescription,
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        hy: "/hy/about",
        en: "/en/about",
        ru: "/ru/about",
        "x-default": "/hy/about",
      },
    },
  };
}

// About page (owner request, Oct 2026, modeled on the reference "our center"
// page of justexpert.am): dark hero band with breadcrumb, mission with the
// client-approved figures, goals, functions in two categorized lists, the
// eight directions as hairline rows linking to their detail pages, and the
// shared contact banner. All copy lives in the aboutPage JSON block (draft
// pending client sign-off — design doc §11).
export default async function AboutPage({
  params,
}: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = getHomeContent(locale);
  const { aboutPage, experts, services } = content;

  return (
    <PageShell content={content} locale={locale}>
      <PageHero
        breadcrumbLabel={experts.breadcrumbLabel}
        crumbs={[
          { label: experts.breadcrumbHome, href: `/${locale}` },
          { label: aboutPage.title },
        ]}
        title={aboutPage.title}
        description={aboutPage.description}
        image="/images/heroes/about.jpg"
        imageClassName="-z-10 object-cover object-[50%_25%]"
        overlayClassName="bg-hero/85 md:bg-hero/75 lg:bg-hero/70"
      />

      <section
        aria-labelledby="about-mission"
        className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-15 2xl:max-w-[120rem]"
      >
        <h2
          id="about-mission"
          className="font-display text-2xl leading-snug sm:text-3xl"
        >
          {aboutPage.missionTitle}
        </h2>
        <div className="mt-6 max-w-2xl space-y-4">
          {aboutPage.mission.map((paragraph) => (
            <p key={paragraph} className="text-base leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
        <dl className="mt-10 grid max-w-3xl grid-cols-1 gap-6 border-t border-border pt-6 sm:grid-cols-3">
          {aboutPage.stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <dt className="order-2 mt-2 text-[11px] leading-snug font-medium tracking-[0.14em] text-muted-foreground uppercase">
                {stat.label}
              </dt>
              <dd className="order-1 font-display text-3xl leading-none sm:text-4xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="about-goals" className="border-t border-border">
        <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]">
          <h2
            id="about-goals"
            className="font-display text-2xl leading-snug sm:text-3xl"
          >
            {aboutPage.goalsHeading}
          </h2>
          <ul className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {aboutPage.goals.map((goal) => (
              <li
                key={goal}
                className="flex gap-3 text-base leading-relaxed"
              >
                <span aria-hidden="true" className="shrink-0 text-primary">
                  —
                </span>
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="about-functions"
        className="border-t border-border"
      >
        <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]">
          <h2
            id="about-functions"
            className="font-display text-2xl leading-snug sm:text-3xl"
          >
            {aboutPage.functionsHeading}
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:gap-10">
            {aboutPage.functionGroups.map((group) => (
              <div key={group.title} className="min-w-0">
                <h3 className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
                  {group.title}
                </h3>
                <ul className="mt-4">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 border-t border-border py-2.5 text-sm leading-relaxed"
                    >
                      <span aria-hidden="true" className="shrink-0 text-primary">
                        —
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="about-directions"
        className="border-t border-border"
      >
        <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]">
          <h2
            id="about-directions"
            className="font-display text-2xl leading-snug sm:text-3xl"
          >
            {aboutPage.directionsHeading}
          </h2>
          <ul className="mt-8 border-t border-border">
            {services.items.map((item, index) => (
              <li key={item.slug} className="border-b border-border">
                <Link
                  href={`/${locale}/services/${item.slug}`}
                  transitionTypes={["forward"]}
                  className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-4 rounded-sm px-1 py-4 focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none sm:py-5 lg:gap-x-6"
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground transition-colors duration-150 group-hover:text-primary"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="font-display text-xl leading-snug underline-offset-4 group-hover:underline group-hover:decoration-primary">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-5 shrink-0 text-primary transition-transform duration-150 group-hover:translate-x-0.5"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ContactCta content={content} locale={locale} />
    </PageShell>
  );
}

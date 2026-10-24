import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceIndex } from "@/components/service-index";
import { PageShell } from "@/components/page-shell";
import { getHomeContent } from "@/lib/home-content";
import { isLocale, siteUrl } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const { services } = getHomeContent(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: `${services.heading} — Anicom`,
    alternates: {
      canonical: `/${locale}/services`,
      languages: {
        hy: "/hy/services",
        en: "/en/services",
        ru: "/ru/services",
        "x-default": "/hy/services",
      },
    },
  };
}

export default async function ServicesPage({
  params,
}: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = getHomeContent(locale);

  return (
    <PageShell content={content} locale={locale}>
      <section
        aria-labelledby="services-heading"
        className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-15 2xl:max-w-[120rem]"
      >
        <h1
          id="services-heading"
          className="font-display text-3xl leading-tight sm:text-4xl"
        >
          {content.services.heading}
        </h1>
        <div className="mt-10">
          <ServiceIndex services={content.services} headingLevel="h2" />
        </div>
      </section>
    </PageShell>
  );
}

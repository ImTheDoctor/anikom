import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CasesSection } from "@/components/home/cases-section";
import { ClientsSection } from "@/components/home/clients-section";
import { ContactCta } from "@/components/home/contact-cta";
import { FeaturedBlocks } from "@/components/home/featured-blocks";
import { HeroSection } from "@/components/home/hero-section";
import { NewsSection } from "@/components/home/news-section";
import { PartnersSection } from "@/components/home/partners-section";
import { ProcessSection } from "@/components/home/process-section";
import { ServiceCategories } from "@/components/home/service-categories";
import { TeamSection } from "@/components/home/team-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { PageShell } from "@/components/page-shell";
import { getHomeContent } from "@/lib/home-content";
import { isLocale, siteUrl } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const content = getHomeContent(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: content.meta.title,
    description: content.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        hy: "/hy",
        en: "/en",
        ru: "/ru",
        "x-default": "/hy",
      },
    },
  };
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = getHomeContent(locale);

  return (
    <PageShell content={content} locale={locale}>
      <HeroSection content={content} locale={locale} />
      <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]">
        <ServiceCategories content={content} locale={locale} />
        <ProcessSection content={content} locale={locale} />
        <FeaturedBlocks content={content} locale={locale} />
        <CasesSection content={content} locale={locale} />
        <ClientsSection content={content} />
        <TeamSection content={content} locale={locale} />
        <TestimonialsSection content={content} />
        <NewsSection content={content} locale={locale} />
        <PartnersSection content={content} />
      </div>
      <ContactCta content={content} locale={locale} />
    </PageShell>
  );
}

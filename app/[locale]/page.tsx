import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CasesSection } from "@/components/home/cases-section";
import { HeroSection } from "@/components/home/hero-section";
import { NewsSection } from "@/components/home/news-section";
import { PartnersSection } from "@/components/home/partners-section";
import { ProcessSection } from "@/components/home/process-section";
import { ServiceCategories } from "@/components/home/service-categories";
import { TeamSection } from "@/components/home/team-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { NewsletterBanner } from "@/components/news/newsletter-banner";
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

  // The subscribe banner (in place of the former contact CTA) targets the
  // office address from footer.contacts — the single source of truth for
  // contact details.
  const emailEntry = content.footer.contacts.find((entry) =>
    entry.href?.startsWith("mailto:"),
  );
  const officeEmail = emailEntry?.href?.replace("mailto:", "") ?? "";

  return (
    <PageShell content={content} locale={locale}>
      <HeroSection content={content} locale={locale} />
      <div className="mx-auto w-full px-4 pt-12 pb-0 sm:px-6 sm:pt-16 lg:px-15 2xl:max-w-[120rem]">
        <ServiceCategories content={content} locale={locale} />
        <ProcessSection content={content} locale={locale} />
        <CasesSection content={content} locale={locale} />
        <TestimonialsSection content={content} />
        <NewsSection content={content} locale={locale} />
      </div>
      <NewsletterBanner
        ui={content.news.newsletter}
        officeEmail={officeEmail}
      />
      <div className="mx-auto w-full px-4 pt-0 pb-12 sm:px-6 sm:pb-16 lg:px-15 2xl:max-w-[120rem]">
        <TeamSection content={content} locale={locale} />
        <PartnersSection content={content} />
      </div>
    </PageShell>
  );
}

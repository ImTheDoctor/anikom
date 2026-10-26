import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CasesDirectory } from "@/components/cases/cases-directory";
import { ContactCta } from "@/components/home/contact-cta";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { getHomeContent } from "@/lib/home-content";
import { isLocale, siteUrl } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/cases">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const { cases } = getHomeContent(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: `${cases.title} — Anicom`,
    description: cases.description,
    alternates: {
      canonical: `/${locale}/cases`,
      languages: {
        hy: "/hy/cases",
        en: "/en/cases",
        ru: "/ru/cases",
        "x-default": "/hy/cases",
      },
    },
  };
}

// Cases catalog (owner request, Oct 2026): the compact hero band used by the
// other dossier pages over a direction-filtered card grid (CasesDirectory).
// The former "page in preparation" note is gone — the pages carry full draft
// content now (design doc §11: still draft demo data pending client sign-off).
export default async function CasesPage({
  params,
}: PageProps<"/[locale]/cases">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = getHomeContent(locale);
  const { cases, experts, services } = content;

  return (
    <PageShell content={content} locale={locale}>
      <PageHero
        breadcrumbLabel={experts.breadcrumbLabel}
        crumbs={[
          { label: experts.breadcrumbHome, href: `/${locale}` },
          { label: cases.title },
        ]}
        title={cases.title}
        description={cases.description}
        image="/images/heroes/cases.jpg"
        imageClassName="-z-10 object-cover object-[50%_35%]"
        overlayClassName="bg-hero/85 md:bg-hero/75 lg:bg-hero/70"
      />

      <section className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]">
        <CasesDirectory
          items={cases.items}
          services={services.items.map(({ slug, title }) => ({ slug, title }))}
          ui={cases}
          locale={locale}
        />
      </section>

      <ContactCta content={content} locale={locale} />
    </PageShell>
  );
}

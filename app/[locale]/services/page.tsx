import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Bomb,
  Brain,
  Building,
  Camera,
  Car,
  Crosshair,
  FlaskConical,
  Footprints,
  Landmark,
  PenLine,
  Package,
  ScrollText,
  Stethoscope,
  Sprout,
  Utensils,
  Video,
  Zap,
  LineChart,
  MonitorSmartphone,
  Flame,
  type LucideIcon,
} from "lucide-react";
import { ServiceIndex, iconBySlug } from "@/components/service-index";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { getHomeContent } from "@/lib/home-content";
import { isLocale, siteUrl } from "@/lib/i18n";

// Thematic line icon per classifier type (the standalone catalog cards).
const typeIcons: Record<string, LucideIcon> = {
  "handwriting-examination": PenLine,
  "document-examination": ScrollText,
  "video-audio-recording-examination": Video,
  "phototechnical-portrait-examination": Camera,
  "trace-examination": Footprints,
  "ballistic-examination": Crosshair,
  "explosives-examination": Bomb,
  "materials-science-examination": FlaskConical,
  "food-beverage-examination": Utensils,
  "soil-biological-examination": Sprout,
  "fire-technical-examination": Flame,
  "construction-technical-examination": Building,
  "auto-technical-examination": Car,
  "economic-examination": LineChart,
  "commodity-examination": Package,
  "electrotechnical-examination": Zap,
  "computer-technical-examination": MonitorSmartphone,
  "psychological-examination": Brain,
  "forensic-psychiatric-examination": Stethoscope,
  "cultural-values-examination": Landmark,
};

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const { services } = getHomeContent(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: `${services.heading} — Anicom`,
    description: services.metaDescription,
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

// Services page (owner request, Oct 2026): one card grid of everything that
// is NOT a subtype of a direction — the eight company directions plus the
// five standalone classifier types (materials science, food and beverages,
// psychological, forensic psychiatric, cultural values). Subordinate
// classifier types live inside their direction pages, so they get no card
// here. Cards link to /services/[slug] detail pages.
export default async function ServicesPage({
  params,
}: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = getHomeContent(locale);
  const standaloneTypes = content.serviceClassifier.types.filter(
    (type) => !type.serviceSlug,
  );

  return (
    <PageShell content={content} locale={locale}>
      <PageHero
        breadcrumbLabel={content.experts.breadcrumbLabel}
        crumbs={[
          { label: content.experts.breadcrumbHome, href: `/${locale}` },
          { label: content.services.heading },
        ]}
        title={content.services.heading}
        description={content.services.metaDescription}
        image="/images/heroes/services.jpg"
        imageClassName="-z-10 object-cover object-[50%_60%]"
        overlayClassName="bg-hero/85 md:bg-hero/75 lg:bg-hero/70"
      />
      <section
        aria-labelledby="services-heading"
        className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-15 2xl:max-w-[120rem]"
      >
        <h2 id="services-heading" className="sr-only">
          {content.services.heading}
        </h2>
        <ServiceIndex
            services={{
              ...content.services,
              items: [
                ...content.services.items,
                ...standaloneTypes.map(({ slug, title, description }) => ({
                  slug,
                  title,
                  description,
                })),
              ],
            }}
            locale={locale}
            headingLevel="h2"
            icons={{ ...iconBySlug, ...typeIcons }}
          />
      </section>
    </PageShell>
  );
}

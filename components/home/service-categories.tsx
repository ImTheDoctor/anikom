import { ServiceIndex } from "@/components/service-index";
import type { HomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";

type ServiceCategoriesProps = {
  content: HomeContent;
  locale: Locale;
};

export function ServiceCategories({ content, locale }: ServiceCategoriesProps) {
  const { services } = content;

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="scroll-mt-16 py-8 sm:scroll-mt-20 sm:py-10"
    >
      {/* Visible section title (owner request, Oct 25, 2026 — same style as
          the other homepage section headings). */}
      <h2
        id="services-heading"
        className="font-display text-3xl leading-tight sm:text-4xl"
      >
        {services.heading}
      </h2>
      {/* 8 direction cards + the action card as the ninth cell. */}
      <div className="mt-8">
        <ServiceIndex services={services} locale={locale} showActionCard />
      </div>
    </section>
  );
}

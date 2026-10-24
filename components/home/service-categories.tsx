import { ActionLink } from "@/components/action-link";
import { ServiceIndex } from "@/components/service-index";
import type { HomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n";

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
      <h2 id="services-heading" className="sr-only">
        {services.heading}
      </h2>
      <ServiceIndex services={services} />
      <div className="mt-6">
        <ActionLink href={localizeHref(locale, "/services")}>
          {services.action}
        </ActionLink>
      </div>
    </section>
  );
}

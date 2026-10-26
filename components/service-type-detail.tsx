import { ContactCta } from "@/components/home/contact-cta";
import { PageHero } from "@/components/page-hero";
import { ServiceIndex } from "@/components/service-index";
import { PageShell } from "@/components/page-shell";
import type { ClassifierType, HomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";

// Related company directions per standalone classifier type; labels come
// from services.items, so no copy lives here.
const relatedDirections: Record<string, string[]> = {
  "materials-science-examination": [
    "judicial-examinations",
    "damage-assessment",
    "construction-technical-examinations",
  ],
  "food-beverage-examination": ["property-valuation", "judicial-examinations"],
  "psychological-examination": ["judicial-examinations"],
  "forensic-psychiatric-examination": ["judicial-examinations"],
  "cultural-values-examination": [
    "property-valuation",
    "judicial-examinations",
    "damage-assessment",
  ],
};

type ServiceTypeDetailProps = {
  type: ClassifierType;
  content: HomeContent;
  locale: Locale;
};

// Standalone classifier type detail page (owner request, Oct 2026 — same
// section structure as the direction pages): dark hero band with breadcrumb,
// h1, description and the classifier code chip, subtypes as hairline rows,
// objects of examination, examination tasks, related directions, and the
// shared contact banner. The five standalone types have no mapped experts or
// cases, so those sections render nowhere. All copy comes from the
// serviceClassifier JSON block.
export function ServiceTypeDetail({
  type,
  content,
  locale,
}: ServiceTypeDetailProps) {
  const { services, serviceClassifier, experts } = content;
  const relatedSlugs = new Set(relatedDirections[type.slug]);
  const related = services.items.filter((item) =>
    relatedSlugs.has(item.slug),
  );

  return (
    <PageShell content={content} locale={locale}>
      <PageHero
        breadcrumbLabel={experts.breadcrumbLabel}
        crumbs={[
          { label: experts.breadcrumbHome, href: `/${locale}` },
          { label: services.heading, href: `/${locale}/services` },
          { label: type.title },
        ]}
        title={type.title}
        description={type.description}
        image={`/images/heroes/${type.slug}.jpg`}
        overlayClassName="bg-hero/85 md:bg-hero/75 lg:bg-hero/70"
      >
        {type.code ? (
          <ul className="motion-rise mt-6 flex flex-wrap gap-2 [--motion-delay:160ms]">
            <li className="rounded-full border border-hero-border px-3 py-1 font-mono text-[11px] tracking-[0.16em] text-hero-accent">
              {type.code}
            </li>
          </ul>
        ) : null}
      </PageHero>

      <section
        aria-labelledby="type-subtypes"
        className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]"
      >
        <h2
          id="type-subtypes"
          className="font-display text-2xl leading-snug sm:text-3xl"
        >
          {serviceClassifier.subtypesHeading}
        </h2>
        <ul className="mt-8 divide-y divide-border border-t border-border">
          {type.subtypes?.map((subtype) => (
            <li
              key={subtype.code ?? subtype.title}
              className="grid grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-x-4 py-3 lg:grid-cols-[4rem_minmax(0,1fr)] lg:gap-x-6"
            >
              <span className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground">
                {subtype.code ?? ""}
              </span>
              <p className="min-w-0 text-sm leading-relaxed sm:text-base">
                {subtype.title}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {type.objects?.length ? (
        <section
          aria-labelledby="type-objects"
          className="border-t border-border"
        >
          <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]">
            <h2
              id="type-objects"
              className="font-display text-2xl leading-snug sm:text-3xl"
            >
              {serviceClassifier.objectsHeading}
            </h2>
            <ul className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2">
              {type.objects.map((object) => (
                <li
                  key={object}
                  className="flex gap-3 text-base leading-relaxed"
                >
                  <span aria-hidden="true" className="shrink-0 text-primary">
                    —
                  </span>
                  <span>{object}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {type.taskCategories?.length ? (
        <section
          aria-labelledby="type-tasks"
          className="border-t border-border"
        >
          <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]">
            <h2
              id="type-tasks"
              className="font-display text-2xl leading-snug sm:text-3xl"
            >
              {serviceClassifier.tasksHeading}
            </h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
              {type.taskCategories.map((category) => (
                <div key={category.title} className="min-w-0">
                  <h3 className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
                    {category.title}
                  </h3>
                  <ul className="mt-4">
                    {category.items.map((task) => (
                      <li
                        key={task}
                        className="flex gap-3 border-t border-border py-2.5 text-sm leading-relaxed"
                      >
                        <span aria-hidden="true" className="shrink-0 text-primary">
                          —
                        </span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section
          aria-labelledby="type-other"
          className="border-t border-border"
        >
          <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]">
            <h2
              id="type-other"
              className="font-display text-2xl leading-snug sm:text-3xl"
            >
              {serviceClassifier.otherHeading}
            </h2>
            <div className="mt-8">
              <ServiceIndex
                services={{ ...services, items: related }}
                locale={locale}
              />
            </div>
          </div>
        </section>
      ) : null}

      <ContactCta content={content} locale={locale} />
    </PageShell>
  );
}

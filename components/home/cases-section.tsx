import { ActionLink } from "@/components/action-link";
import { CaseCard } from "@/components/cards/case-card";
import { SectionHeading } from "@/components/home/section-heading";
import { Reveal } from "@/components/reveal";
import type { HomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n";

type CasesSectionProps = {
  content: HomeContent;
  locale: Locale;
};

export function CasesSection({ content, locale }: CasesSectionProps) {
  const { cases } = content;

  return (
    <section
      id="cases"
      className="scroll-mt-16 border-t border-border py-16 sm:scroll-mt-20 md:py-20"
    >
      <Reveal>
        <SectionHeading
          eyebrow={cases.eyebrow}
          title={cases.title}
          description={cases.description}
          action={
            <ActionLink href={localizeHref(locale, "/cases")}>
              {cases.action}
            </ActionLink>
          }
        />
      </Reveal>

      <Reveal
        as="ul"
        stagger
        className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4"
      >
        {cases.items.map((item) => (
          <CaseCard
            key={item.slug}
            item={item}
            locale={locale}
            actionLabel={cases.cardAction}
          />
        ))}
      </Reveal>
    </section>
  );
}

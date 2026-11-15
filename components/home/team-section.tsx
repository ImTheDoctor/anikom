import { ActionLink } from "@/components/action-link";
import {
  ExpertCard,
  type ExpertCardItem,
} from "@/components/experts/expert-card";
import { SectionHeading } from "@/components/home/section-heading";
import type { HomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n";

type TeamSectionProps = {
  content: HomeContent;
  // Backend roster items (lib/experts-api.ts) — the same cards as the
  // /[locale]/team directory; the homepage features at most four of them.
  items: ExpertCardItem[];
  locale: Locale;
};

export function TeamSection({ content, items, locale }: TeamSectionProps) {
  const { team } = content;

  return (
    <section
      id="team"
      className="scroll-mt-16 py-16 sm:scroll-mt-20 md:py-20"
    >
      <SectionHeading
        title={team.title}
        action={
          <ActionLink href={localizeHref(locale, "/team")}>
            {team.action}
          </ActionLink>
        }
      />

      <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {items.slice(0, 4).map((item) => (
          <ExpertCard
            key={item.slug}
            item={item}
            locale={locale}
            actionLabel={team.cardAction}
          />
        ))}
      </ul>
    </section>
  );
}

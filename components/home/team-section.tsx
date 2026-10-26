import { ActionLink } from "@/components/action-link";
import { TeamCard } from "@/components/cards/team-card";
import { SectionHeading } from "@/components/home/section-heading";
import { Reveal } from "@/components/reveal";
import type { HomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n";

type TeamSectionProps = {
  content: HomeContent;
  locale: Locale;
};

export function TeamSection({ content, locale }: TeamSectionProps) {
  const { team } = content;

  // The homepage features the first four roster members; the full roster
  // (draft demo data) lives on the /team expert directory.

  return (
    <section
      id="team"
      className="scroll-mt-16 py-16 sm:scroll-mt-20 md:py-20"
    >
      <Reveal>
        <SectionHeading
          title={team.title}
          action={
            <ActionLink href={localizeHref(locale, "/team")}>
              {team.action}
            </ActionLink>
          }
        />
      </Reveal>

      <Reveal
        as="ul"
        stagger
        className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
      >
        {team.items.slice(0, 4).map((item) => (
          <TeamCard
            key={item.slug}
            item={item}
            locale={locale}
            actionLabel={team.cardAction}
          />
        ))}
      </Reveal>
    </section>
  );
}

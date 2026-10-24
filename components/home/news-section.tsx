import { ActionLink } from "@/components/action-link";
import { NewsCard } from "@/components/cards/news-card";
import { SectionHeading } from "@/components/home/section-heading";
import type { HomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n";

type NewsSectionProps = {
  content: HomeContent;
  locale: Locale;
};

export function NewsSection({ content, locale }: NewsSectionProps) {
  const { news } = content;

  return (
    <section
      id="news"
      className="scroll-mt-16 border-t border-border py-16 sm:scroll-mt-20 md:py-20"
    >
      <SectionHeading
        eyebrow={news.eyebrow}
        title={news.title}
        description={news.description}
        action={
          <ActionLink href={localizeHref(locale, "/news")}>
            {news.action}
          </ActionLink>
        }
      />

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {news.items.map((item) => (
          <NewsCard
            key={item.slug}
            item={item}
            locale={locale}
            actionLabel={news.cardAction}
          />
        ))}
      </ul>
    </section>
  );
}

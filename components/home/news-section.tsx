import { ActionLink } from "@/components/action-link";
import { NewsCard } from "@/components/news/news-card";
import { SectionHeading } from "@/components/home/section-heading";
import { Reveal } from "@/components/reveal";
import type { HomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n";

type NewsSectionProps = {
  content: HomeContent;
  locale: Locale;
};

// Homepage preview of the Լրահոս feed (owner request, Oct 26, 2026 — restored
// between Testimonials and Partners, styled like the Cases/Team sections):
// title + "view all" action over the first three feed cards. The full
// filtering experience lives on /[locale]/news (§6 "News feed").
export function NewsSection({ content, locale }: NewsSectionProps) {
  const { news } = content;

  const authors = content.team.items.map((expert) => ({
    slug: expert.slug,
    name: expert.name,
  }));

  const categoryTitle = (slug: string) =>
    news.categories.find((category) => category.slug === slug)?.title ?? "";

  return (
    <section
      id="news"
      className="scroll-mt-16 py-16 sm:scroll-mt-20 md:py-20"
    >
      <Reveal>
        <SectionHeading
          title={news.title}
          action={
            <ActionLink href={localizeHref(locale, "/news")}>
              {news.action}
            </ActionLink>
          }
        />
      </Reveal>

      <Reveal
        as="ul"
        stagger
        className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {news.items.slice(0, 3).map((item) => (
          <NewsCard
            key={item.slug}
            item={item}
            authors={authors}
            categoryTitle={categoryTitle(item.categorySlug)}
            locale={locale}
            actionLabel={news.cardAction}
            readTimeUnit={news.readTimeUnit}
            variant="grid"
          />
        ))}
      </Reveal>
    </section>
  );
}

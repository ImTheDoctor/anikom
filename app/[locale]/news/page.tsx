import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { PageShell } from "@/components/page-shell";
import { NewsFeedDirectory } from "@/components/news/feed-directory";
import { NewsletterBanner } from "@/components/news/newsletter-banner";
import { getHomeContent, newsFeedUi } from "@/lib/home-content";
import { isLocale, siteUrl } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/news">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const { news } = getHomeContent(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: `${news.title} — Anicom`,
    description: news.description,
    alternates: {
      canonical: `/${locale}/news`,
      languages: {
        hy: "/hy/news",
        en: "/en/news",
        ru: "/ru/news",
        "x-default": "/hy/news",
      },
    },
  };
}

export default async function NewsPage({
  params,
}: PageProps<"/[locale]/news">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = getHomeContent(locale);

  // Card payload for the client boundary: the detail-page `body` paragraphs
  // stay server-side.
  const feedItems = content.news.items.map(
    ({
      slug,
      categorySlug,
      dateISO,
      date,
      title,
      excerpt,
      imageLabel,
      authorSlug,
      readMinutes,
    }) => ({
      slug,
      categorySlug,
      dateISO,
      date,
      title,
      excerpt,
      imageLabel,
      authorSlug,
      readMinutes,
    }),
  );

  // Sidebar expert options = the roster members who actually author items.
  const authorSlugs = [...new Set(feedItems.map((item) => item.authorSlug))];
  const feedAuthors = content.team.items
    .filter((expert) => authorSlugs.includes(expert.slug))
    .map((expert) => ({ slug: expert.slug, name: expert.name }));

  // The subscribe banner targets the office address from footer.contacts —
  // the single source of truth for contact details.
  const emailEntry = content.footer.contacts.find((entry) =>
    entry.href?.startsWith("mailto:"),
  );
  const officeEmail = emailEntry?.href?.replace("mailto:", "") ?? "";

  return (
    <PageShell content={content} locale={locale}>
      <PageHero
        breadcrumbLabel={content.experts.breadcrumbLabel}
        crumbs={[
          { label: content.experts.breadcrumbHome, href: `/${locale}` },
          { label: content.news.title },
        ]}
        title={content.news.title}
        description={content.news.description}
        image="/images/heroes/news.jpg"
        imageClassName="-z-10 object-cover object-[50%_40%]"
        overlayClassName="bg-hero/85 md:bg-hero/75 lg:bg-hero/70"
      />
      <section className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]">
        <NewsFeedDirectory
          items={feedItems}
          authors={feedAuthors}
          categories={content.news.categories}
          ui={newsFeedUi(content.news)}
          locale={locale}
        />
      </section>
      <NewsletterBanner ui={content.news.newsletter} officeEmail={officeEmail} />
    </PageShell>
  );
}

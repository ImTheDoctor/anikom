import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// Feed payload crossed to the client boundary without `body` (detail-only
// paragraphs) — see the mapping in app/[locale]/news/page.tsx.
export type FeedItem = Omit<HomeContent["news"]["items"][number], "body">;

export type FeedAuthor = {
  slug: string;
  name: string;
};

type NewsCardProps = {
  item: FeedItem;
  authors: FeedAuthor[];
  categoryTitle: string;
  locale: Locale;
  actionLabel: string;
  readTimeUnit: string;
  variant: "grid" | "list";
};

// Feed card (owner reference, Oct 26, 2026): cover image, category + date
// row, serif title, excerpt, hairline footer with the author and the read
// time. The whole card is one stretched link (team-card convention) — the
// accessible name comes from the sr-only span (cardAction + title).
export function NewsCard({
  item,
  authors,
  categoryTitle,
  locale,
  actionLabel,
  readTimeUnit,
  variant,
}: NewsCardProps) {
  const author = authors.find((entry) => entry.slug === item.authorSlug);
  const isList = variant === "list";

  return (
    <li className={cn("group relative min-w-0", !isList && "h-full")}>
      <article
        className={cn(
          "flex h-full border border-border bg-card transition-colors duration-150 group-hover:border-primary",
          isList ? "flex-col sm:flex-row" : "flex-col",
        )}
      >
        <div
          className={cn(
            "relative shrink-0 overflow-hidden",
            isList
              ? "aspect-[16/10] w-full sm:aspect-auto sm:h-auto sm:w-44 sm:self-stretch lg:w-52"
              : "aspect-[16/10] w-full",
          )}
        >
          <Image
            src={`/images/news/${item.slug}.jpg`}
            alt={item.imageLabel}
            fill
            sizes={
              isList
                ? "(max-width: 640px) 100vw, 208px"
                : "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            }
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <p className="text-[11px] font-medium tracking-[0.14em] text-primary uppercase">
              {categoryTitle}
            </p>
            <p className="text-xs text-muted-foreground">{item.date}</p>
          </div>
          <h3
            className={cn(
              "mt-2 font-display leading-snug underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 group-hover:decoration-primary",
              isList ? "text-lg" : "text-lg sm:text-xl",
            )}
          >
            {item.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {item.excerpt}
          </p>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-3">
            <div className="flex min-w-0 items-center gap-2.5">
              {author ? (
                <>
                  <span className="relative size-8 shrink-0 overflow-hidden rounded-full border border-border">
                    <Image
                      src={`/images/team/${author.slug}.jpg`}
                      alt=""
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </span>
                  <span className="truncate text-sm">{author.name}</span>
                </>
              ) : null}
            </div>
            <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
              {item.readMinutes} {readTimeUnit}
              <ArrowRight
                className="size-4 text-foreground transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
                strokeWidth={1.5}
              />
            </span>
          </div>
        </div>
      </article>
      <Link
        href={`/${locale}/news/${item.slug}`}
        transitionTypes={["forward"]}
        className="absolute inset-0 focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
      >
        <span className="sr-only">
          {actionLabel} — {item.title}
        </span>
      </Link>
    </li>
  );
}

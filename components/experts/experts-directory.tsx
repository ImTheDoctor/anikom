"use client";

// Client boundary: pagination lives in state and re-derives the visible
// roster on every change. Filtering, sorting, and the view toggle were
// removed by owner decision (Oct 2026) — the roster always renders as a
// card grid in its data order. The server passes the full localized roster
// and copy; no data fetching happens here.

import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  ExpertCard,
  type ExpertCardItem,
} from "@/components/experts/expert-card";
import { Reveal } from "@/components/reveal";
import type { HomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

type ExpertsDirectoryProps = {
  items: ExpertCardItem[];
  services: { slug: string; title: string }[];
  experts: HomeContent["experts"];
  locale: Locale;
};

export function ExpertsDirectory({
  items,
  services,
  experts,
  locale,
}: ExpertsDirectoryProps) {
  const [page, setPage] = useState(1);

  const resultsRef = useRef<HTMLDivElement>(null);

  const titleBySlug = useMemo(
    () => new Map(services.map((s) => [s.slug, s.title])),
    [services],
  );

  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = items.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function goToPage(next: number) {
    setPage(next);
    const results = resultsRef.current;
    if (results) {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      results.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
    }
  }

  return (
    <div
      ref={resultsRef}
      className="mt-8 scroll-mt-16 sm:scroll-mt-20 lg:mt-12"
    >
      <h2 className="sr-only">{experts.listHeading}</h2>

      {pageItems.length === 0 ? (
        <div className="mt-6 border border-border px-6 py-16 text-center">
          <p className="font-display text-xl">{experts.emptyTitle}</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            {experts.emptyDescription}
          </p>
        </div>
      ) : (
        <Reveal
          as="ul"
          stagger
          className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4"
        >
          {pageItems.map((item) => (
            <ExpertCard
              key={item.slug}
              item={item}
              directionLabels={item.directions
                .map((slug) => titleBySlug.get(slug))
                .filter((title): title is string => Boolean(title))}
              locale={locale}
              actionLabel={experts.cardAction}
            />
          ))}
        </Reveal>
      )}

      {pageCount > 1 ? (
        <nav
          aria-label={experts.paginationLabel}
          className="mt-10 flex items-center justify-center gap-1.5 sm:gap-2"
        >
          <button
            type="button"
            aria-label={experts.previousPageLabel}
            disabled={safePage === 1}
            onClick={() => goToPage(safePage - 1)}
            className="flex size-11 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map(
            (number) => {
              const active = number === safePage;
              return (
                <button
                  key={number}
                  type="button"
                  aria-label={experts.goToPageLabel.replace(
                    "{page}",
                    String(number),
                  )}
                  aria-current={active ? "page" : undefined}
                  onClick={() => goToPage(number)}
                  className={cn(
                    "flex size-11 items-center justify-center rounded-md border text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:border-primary hover:text-primary",
                  )}
                >
                  {number}
                </button>
              );
            },
          )}
          <button
            type="button"
            aria-label={experts.nextPageLabel}
            disabled={safePage === pageCount}
            onClick={() => goToPage(safePage + 1)}
            className="flex size-11 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </nav>
      ) : null}
    </div>
  );
}

"use client";

// Client boundary: the search/category/expert/year filters, the sort and the
// view toggle live in state and re-derive the visible feed. The server passes
// the card payload (items without `body`), the author roster and the copy; no
// data fetching happens here. Filter options are derived from the data, so
// counts always match the actual feed.

import { useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Calculator,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Landmark,
  LayoutGrid,
  List,
  Newspaper,
  RotateCcw,
  Scale,
  ScanSearch,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import {
  NewsCard,
  type FeedAuthor,
  type FeedItem,
} from "@/components/news/news-card";
import type { HomeContent, NewsFeedUi } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 6;

type FeedDirectoryProps = {
  items: FeedItem[];
  authors: FeedAuthor[];
  categories: HomeContent["news"]["categories"];
  ui: NewsFeedUi;
  locale: Locale;
};

// Thematic lucide line icons per shared category slug (same family as the
// service-direction icons); aria-hidden on every render.
const categoryIcons: Record<string, typeof ScanSearch> = {
  examinations: ScanSearch,
  guides: BookOpen,
  valuation: Calculator,
  rights: ShieldCheck,
  practice: Landmark,
  legislation: Scale,
};

type Filters = {
  query: string;
  categories: string[];
  authors: string[];
  years: string[];
};

const emptyFilters: Filters = {
  query: "",
  categories: [],
  authors: [],
  years: [],
};

export function NewsFeedDirectory({
  items,
  authors,
  categories,
  ui,
  locale,
}: FeedDirectoryProps) {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  const categoryTitle = useMemo(
    () =>
      new Map(categories.map((category) => [category.slug, category.title])),
    [categories],
  );

  // Years present in the feed, newest first.
  const years = useMemo(
    () =>
      [...new Set(items.map((item) => item.dateISO.slice(0, 4)))].sort(
        (a, b) => b.localeCompare(a),
      ),
    [items],
  );

  const visible = useMemo(() => {
    const query = filters.query.trim().toLocaleLowerCase();
    return items
      .filter((item) => {
        if (
          query &&
          !`${item.title} ${item.excerpt}`.toLocaleLowerCase().includes(query)
        ) {
          return false;
        }
        if (
          filters.categories.length > 0 &&
          !filters.categories.includes(item.categorySlug)
        ) {
          return false;
        }
        if (
          filters.authors.length > 0 &&
          !filters.authors.includes(item.authorSlug)
        ) {
          return false;
        }
        if (
          filters.years.length > 0 &&
          !filters.years.includes(item.dateISO.slice(0, 4))
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) =>
        sort === "newest"
          ? b.dateISO.localeCompare(a.dateISO)
          : a.dateISO.localeCompare(b.dateISO),
      );
  }, [items, filters, sort]);

  const activeFilterCount =
    filters.categories.length +
    filters.authors.length +
    filters.years.length +
    (filters.query.trim() ? 1 : 0);

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = visible.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  function scrollToResults() {
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

  function applyFilters(next: Partial<Filters>, options?: { scroll?: boolean }) {
    setFilters((current) => ({ ...current, ...next }));
    setPage(1);
    if (options?.scroll ?? true) {
      scrollToResults();
    }
  }

  function resetFilters() {
    setFilters(emptyFilters);
    setPage(1);
    scrollToResults();
  }

  function goToPage(next: number) {
    setPage(next);
    scrollToResults();
  }

  // Re-keying the grid remounts the cards and replays the one-shot
  // filter-cascade rise (globals.css, §7 Motion) on every filter, sort, or
  // page change; the markup stays fully rendered for no-JS clients.
  const cascadeKey = JSON.stringify({ filters, sort, page: safePage });

  const showPagination = pageCount > 1;

  return (
    <div>
      {/* Category quick-select chips (single-select; synced with the sidebar
          group). Options are data-derived, so an empty result is impossible
          for the chip row. */}
      <div
        role="group"
        aria-label={ui.categoriesHeading}
        className="flex flex-wrap gap-2"
      >
        <CategoryChip
          icon={Newspaper}
          pressed={filters.categories.length === 0}
          onClick={() => applyFilters({ categories: [] })}
          label={ui.allCategoriesLabel}
          count={items.length}
        />
        {categories.map((category) => (
          <CategoryChip
            key={category.slug}
            icon={categoryIcons[category.slug] ?? Newspaper}
            pressed={filters.categories.includes(category.slug)}
            onClick={() =>
              applyFilters({ categories: [category.slug] })
            }
            label={category.title}
            count={
              items.filter((item) => item.categorySlug === category.slug)
                .length
            }
          />
        ))}
      </div>

      <div className="mt-6 lg:mt-8 lg:grid lg:grid-cols-[17rem_1fr] lg:gap-10">
        {/* Sidebar: disclosure below lg, sticky column from lg. */}
        <aside className="lg:self-start">
          <button
            type="button"
            aria-expanded={mobileFiltersOpen}
            aria-controls="news-feed-filters"
            onClick={() => setMobileFiltersOpen((open) => !open)}
            className="flex min-h-11 w-full items-center justify-between border border-border bg-card px-4 text-sm font-medium transition-colors hover:border-primary focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none lg:hidden"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal
                className="size-4 text-primary"
                aria-hidden="true"
                strokeWidth={1.5}
              />
              {ui.filtersLabel}
              {activeFilterCount > 0 ? (
                <span className="text-primary">({activeFilterCount})</span>
              ) : null}
            </span>
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-150",
                mobileFiltersOpen && "rotate-180",
              )}
              aria-hidden="true"
              strokeWidth={1.5}
            />
          </button>

          <div
            id="news-feed-filters"
            className={cn(
              "mt-4 lg:sticky lg:top-24 lg:mt-0 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1",
              mobileFiltersOpen ? "block" : "hidden lg:block",
            )}
          >
            <form
              role="search"
              onSubmit={(event) => event.preventDefault()}
              className="relative"
            >
              <label htmlFor="news-feed-search" className="sr-only">
                {ui.searchLabel}
              </label>
              <input
                id="news-feed-search"
                type="search"
                value={filters.query}
                onChange={(event) =>
                  applyFilters({ query: event.target.value }, { scroll: false })
                }
                placeholder={ui.searchPlaceholder}
                className="h-11 w-full border border-input bg-background pe-10 ps-4 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
              />
              <Search
                className="pointer-events-none absolute end-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
                strokeWidth={1.5}
              />
            </form>

            <FilterGroup label={ui.categoriesHeading}>
              <AllRow
                label={ui.allCategoriesLabel}
                count={items.length}
                checked={filters.categories.length === 0}
                onToggle={() => applyFilters({ categories: [] })}
                name="news-filter-all-categories"
              />
              {categories.map((category) => (
                <CheckRow
                  key={category.slug}
                  name={`news-filter-category-${category.slug}`}
                  label={category.title}
                  count={
                    items.filter(
                      (item) => item.categorySlug === category.slug,
                    ).length
                  }
                  checked={filters.categories.includes(category.slug)}
                  onToggle={(checked) =>
                    applyFilters({
                      categories: checked
                        ? [...filters.categories, category.slug]
                        : filters.categories.filter(
                            (slug) => slug !== category.slug,
                          ),
                    })
                  }
                />
              ))}
            </FilterGroup>

            <FilterGroup label={ui.expertsHeading}>
              <AllRow
                label={ui.allExpertsLabel}
                count={items.length}
                checked={filters.authors.length === 0}
                onToggle={() => applyFilters({ authors: [] })}
                name="news-filter-all-experts"
              />
              {authors.map((author) => (
                <CheckRow
                  key={author.slug}
                  name={`news-filter-expert-${author.slug}`}
                  label={author.name}
                  count={
                    items.filter(
                      (item) => item.authorSlug === author.slug,
                    ).length
                  }
                  checked={filters.authors.includes(author.slug)}
                  onToggle={(checked) =>
                    applyFilters({
                      authors: checked
                        ? [...filters.authors, author.slug]
                        : filters.authors.filter(
                            (slug) => slug !== author.slug,
                          ),
                    })
                  }
                />
              ))}
            </FilterGroup>

            <FilterGroup label={ui.yearsHeading} last>
              <AllRow
                label={ui.allYearsLabel}
                count={items.length}
                checked={filters.years.length === 0}
                onToggle={() => applyFilters({ years: [] })}
                name="news-filter-all-years"
              />
              {years.map((year) => (
                <CheckRow
                  key={year}
                  name={`news-filter-year-${year}`}
                  label={year}
                  count={
                    items.filter((item) =>
                      item.dateISO.startsWith(year),
                    ).length
                  }
                  checked={filters.years.includes(year)}
                  onToggle={(checked) =>
                    applyFilters({
                      years: checked
                        ? [...filters.years, year]
                        : filters.years.filter((entry) => entry !== year),
                    })
                  }
                />
              ))}
            </FilterGroup>

            <button
              type="button"
              onClick={resetFilters}
              disabled={activeFilterCount === 0}
              className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 border border-border bg-background text-sm font-medium transition-colors hover:border-primary hover:text-primary focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              <RotateCcw
                className="size-4"
                aria-hidden="true"
                strokeWidth={1.5}
              />
              {ui.resetLabel}
            </button>
          </div>
        </aside>

        <div ref={resultsRef} className="mt-8 scroll-mt-16 sm:scroll-mt-20 lg:mt-0">
          {/* Toolbar: results count, sort, view toggle. */}
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
            <p aria-live="polite" className="text-sm font-medium">
              {ui.resultsLabel.replace("{count}", String(visible.length))}
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="news-feed-sort" className="sr-only">
                {ui.sortLabel}
              </label>
              <div className="relative">
                <select
                  id="news-feed-sort"
                  value={sort}
                  onChange={(event) => {
                    setSort(event.target.value as "newest" | "oldest");
                    setPage(1);
                    scrollToResults();
                  }}
                  className="h-11 w-44 appearance-none border border-input bg-background ps-4 pe-10 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {ui.sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute end-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                  strokeWidth={1.5}
                />
              </div>
              <button
                type="button"
                aria-pressed={view === "grid"}
                aria-label={ui.gridViewLabel}
                onClick={() => setView("grid")}
                className={cn(
                  "flex size-11 items-center justify-center border transition-colors focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none",
                  view === "grid"
                    ? "border-primary bg-accent text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary",
                )}
              >
                <LayoutGrid className="size-4" aria-hidden="true" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                aria-pressed={view === "list"}
                aria-label={ui.listViewLabel}
                onClick={() => setView("list")}
                className={cn(
                  "flex size-11 items-center justify-center border transition-colors focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none",
                  view === "list"
                    ? "border-primary bg-accent text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary",
                )}
              >
                <List className="size-4" aria-hidden="true" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <h2 className="sr-only">{ui.title}</h2>

          {pageItems.length === 0 ? (
            <div className="mt-6 border border-border px-6 py-16 text-center">
              <p className="font-display text-xl">{ui.emptyTitle}</p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                {ui.emptyDescription}
              </p>
            </div>
          ) : (
            <ul
              key={cascadeKey}
              className={cn(
                "filter-cascade mt-6",
                view === "grid"
                  ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
                  : "flex flex-col gap-4",
              )}
            >
              {pageItems.map((item) => (
                <NewsCard
                  key={item.slug}
                  item={item}
                  authors={authors}
                  categoryTitle={categoryTitle.get(item.categorySlug) ?? ""}
                  locale={locale}
                  actionLabel={ui.cardAction}
                  readTimeUnit={ui.readTimeUnit}
                  variant={view}
                />
              ))}
            </ul>
          )}

          {showPagination ? (
            <nav
              aria-label={ui.paginationLabel}
              className="mt-10 flex items-center justify-center gap-1.5 sm:gap-2"
            >
              <button
                type="button"
                aria-label={ui.previousPageLabel}
                disabled={safePage === 1}
                onClick={() => goToPage(safePage - 1)}
                className="flex size-11 items-center justify-center border border-border bg-background transition-colors hover:border-primary hover:text-primary focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
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
                      aria-label={ui.goToPageLabel.replace(
                        "{page}",
                        String(number),
                      )}
                      aria-current={active ? "page" : undefined}
                      onClick={() => goToPage(number)}
                      className={cn(
                        "flex size-11 items-center justify-center border text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none",
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
                aria-label={ui.nextPageLabel}
                disabled={safePage === pageCount}
                onClick={() => goToPage(safePage + 1)}
                className="flex size-11 items-center justify-center border border-border bg-background transition-colors hover:border-primary hover:text-primary focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                <ChevronRight className="size-4" aria-hidden="true" />
              </button>
            </nav>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  last = false,
  children,
}: {
  label: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      role="group"
      aria-label={label}
      className={cn("py-4", !last && "border-b border-border")}
    >
      <p className="text-sm font-medium">{label}</p>
      <div className="mt-1">{children}</div>
    </section>
  );
}

function AllRow({
  label,
  count,
  checked,
  onToggle,
  name,
}: {
  label: string;
  count: number;
  checked: boolean;
  onToggle: () => void;
  name: string;
}) {
  return (
    <label
      htmlFor={name}
      className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm font-medium lg:min-h-9"
    >
      <input
        id={name}
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="size-4 shrink-0 accent-primary"
      />
      <span className="flex-1 truncate">{label}</span>
      <span className="text-xs font-normal text-muted-foreground tabular-nums">
        {count}
      </span>
    </label>
  );
}

function CheckRow({
  name,
  label,
  count,
  checked,
  onToggle,
}: {
  name: string;
  label: string;
  count: number;
  checked: boolean;
  onToggle: (checked: boolean) => void;
}) {
  return (
    <label
      htmlFor={name}
      className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm lg:min-h-9"
    >
      <input
        id={name}
        type="checkbox"
        checked={checked}
        onChange={(event) => onToggle(event.target.checked)}
        className="size-4 shrink-0 accent-primary"
      />
      <span className="flex-1 truncate">{label}</span>
      <span className="text-xs text-muted-foreground tabular-nums">
        {count}
      </span>
    </label>
  );
}

function CategoryChip({
  icon: Icon,
  pressed,
  onClick,
  label,
  count,
}: {
  icon: typeof ScanSearch;
  pressed: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 border px-3.5 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none",
        pressed
          ? "border-primary bg-accent text-primary"
          : "border-border bg-card text-foreground hover:border-primary hover:text-primary",
      )}
    >
      <Icon className="size-4" aria-hidden="true" strokeWidth={1.5} />
      {label}
      <span
        className={cn(
          "text-xs tabular-nums",
          pressed ? "text-primary" : "text-muted-foreground",
        )}
      >
        {count}
      </span>
    </button>
  );
}

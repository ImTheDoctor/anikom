"use client";

// Client boundary: the directory is interactive — search, direction and
// experience filters, sorting, view mode, and pagination all live in state
// and re-derive the visible roster on every change. The server passes the
// full localized roster and copy; no data fetching happens here.

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import {
  ExpertCard,
  type ExpertCardItem,
  type ExpertCardView,
} from "@/components/experts/expert-card";
import { Reveal } from "@/components/reveal";
import { buttonVariants } from "@/components/ui/button";
import type { HomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;
type SortValue = "default" | "experience" | "name";

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
  const [query, setQuery] = useState("");
  const [activeDirections, setActiveDirections] = useState<string[]>([]);
  const [experience, setExperience] = useState("any");
  const [sort, setSort] = useState<SortValue>("default");
  const [view, setView] = useState<ExpertCardView>("grid");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  const titleBySlug = useMemo(
    () => new Map(services.map((s) => [s.slug, s.title])),
    [services],
  );

  const countBySlug = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      for (const direction of item.directions) {
        counts.set(direction, (counts.get(direction) ?? 0) + 1);
      }
    }
    return counts;
  }, [items]);

  const minYears = experience === "any" ? 0 : Number(experience);

  const hasActiveFilters =
    query.trim() !== "" || activeDirections.length > 0 || experience !== "any";
  const activeFilterCount =
    activeDirections.length +
    (experience !== "any" ? 1 : 0) +
    (query.trim() !== "" ? 1 : 0);

  // Filter and sort handlers restart pagination from the first page; the
  // page reset lives in the handlers (not an effect) to avoid cascading
  // renders.

  // Close the mobile filter disclosure on Escape (same pattern as the mobile
  // nav); the panel is plain in-flow content, so nothing else needs cleanup.
  useEffect(() => {
    if (!filtersOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setFiltersOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [filtersOpen]);

  const visibleItems = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = items.filter((item) => {
      if (
        needle &&
        !`${item.name} ${item.role}`.toLowerCase().includes(needle)
      ) {
        return false;
      }
      if (
        activeDirections.length &&
        !item.directions.some((direction) =>
          activeDirections.includes(direction),
        )
      ) {
        return false;
      }
      if (minYears > 0 && item.experienceYears < minYears) return false;
      return true;
    });
    if (sort === "experience") {
      filtered.sort((a, b) => b.experienceYears - a.experienceYears);
    } else if (sort === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name, locale));
    }
    return filtered;
  }, [items, query, activeDirections, minYears, sort, locale]);

  const pageCount = Math.max(1, Math.ceil(visibleItems.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = visibleItems.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  function resetFilters() {
    setQuery("");
    setActiveDirections([]);
    setExperience("any");
    setSort("default");
    setPage(1);
  }

  function toggleDirectionCheckbox(slug: string) {
    setActiveDirections((current) =>
      current.includes(slug)
        ? current.filter((entry) => entry !== slug)
        : [...current, slug],
    );
    setPage(1);
  }

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
    <div>
      <div className="mt-8 gap-10 lg:mt-12 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] xl:gap-12">
        <aside>
          <button
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="experts-filters-panel"
            onClick={() => setFiltersOpen((open) => !open)}
            className="flex min-h-11 w-full items-center justify-between gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none lg:hidden"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              {experts.filtersLabel}
              {hasActiveFilters ? (
                <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
                  {activeFilterCount}
                </span>
              ) : null}
            </span>
            <ChevronDown
              className={cn(
                "size-4 text-muted-foreground transition-transform duration-150",
                filtersOpen && "rotate-180",
              )}
              aria-hidden="true"
            />
          </button>

          <div
            id="experts-filters-panel"
            className={cn(
              "mt-4 lg:mt-0 lg:block",
              filtersOpen ? "block" : "hidden",
            )}
          >
            <div className="flex flex-col gap-8 border border-border p-4 sm:p-5 lg:border-0 lg:p-0">
              <div>
                <label
                  htmlFor="experts-search"
                  className="text-sm font-medium"
                >
                  {experts.searchLabel}
                </label>
                <div className="relative mt-2">
                  <Search
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    id="experts-search"
                    type="search"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setPage(1);
                    }}
                    placeholder={experts.searchPlaceholder}
                    className="h-11 w-full rounded-md border border-input bg-background pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring"
                  />
                </div>
              </div>

              <fieldset>
                <legend className="text-sm font-medium">
                  {experts.directionsLabel}
                </legend>
                <ul className="mt-2">
                  {services.map(({ slug, title }) => {
                    const checked = activeDirections.includes(slug);
                    return (
                      <li key={slug}>
                        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={checked}
                            onChange={() => toggleDirectionCheckbox(slug)}
                          />
                          <span
                            aria-hidden="true"
                            className="flex size-5 shrink-0 items-center justify-center rounded-sm border border-input bg-background transition-colors peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-3 peer-focus-visible:ring-ring"
                          >
                            <Check
                              className={cn(
                                "size-3.5 text-primary-foreground transition-opacity duration-150",
                                checked ? "opacity-100" : "opacity-0",
                              )}
                              strokeWidth={2.5}
                            />
                          </span>
                          <span className="min-w-0 flex-1">{title}</span>
                          <span className="text-sm text-muted-foreground">
                            {countBySlug.get(slug) ?? 0}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </fieldset>

              <fieldset>
                <legend className="text-sm font-medium">
                  {experts.experienceLabel}
                </legend>
                <ul className="mt-2">
                  {experts.experienceOptions.map(({ value, label }) => {
                    const checked = experience === value;
                    return (
                      <li key={value}>
                        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                          <input
                            type="radio"
                            name="experts-experience"
                            className="peer sr-only"
                            checked={checked}
                            onChange={() => {
                              setExperience(value);
                              setPage(1);
                            }}
                          />
                          <span
                            aria-hidden="true"
                            className="flex size-5 shrink-0 items-center justify-center rounded-full border border-input bg-background transition-colors peer-checked:border-primary peer-focus-visible:ring-3 peer-focus-visible:ring-ring"
                          >
                            <span
                              className={cn(
                                "size-2.5 rounded-full bg-primary transition-opacity duration-150",
                                checked ? "opacity-100" : "opacity-0",
                              )}
                            />
                          </span>
                          {label}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </fieldset>

              <div>
                <button
                  type="button"
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "min-h-11 w-full justify-center gap-2 px-4",
                  )}
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                  {experts.resetLabel}
                </button>
              </div>
            </div>
          </div>
        </aside>

        <div ref={resultsRef} className="min-w-0 scroll-mt-16 sm:scroll-mt-20">
          <h2 className="sr-only">{experts.listHeading}</h2>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <p aria-live="polite" className="text-sm text-muted-foreground">
              {experts.resultsLabel.replace(
                "{count}",
                String(visibleItems.length),
              )}
            </p>
            <div className="flex max-w-full flex-wrap items-center justify-end gap-2">
              <div className="relative">
                <label htmlFor="experts-sort" className="sr-only">
                  {experts.sortLabel}
                </label>
                <select
                  id="experts-sort"
                  value={sort}
                  onChange={(event) => {
                    setSort(event.target.value as SortValue);
                    setPage(1);
                  }}
                  className="h-11 appearance-none rounded-md border border-input bg-background pr-9 pl-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring"
                >
                  {experts.sortOptions.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              <div className="flex items-center gap-1 rounded-md border border-border p-1">
                <button
                  type="button"
                  aria-label={experts.gridViewLabel}
                  aria-pressed={view === "grid"}
                  onClick={() => setView("grid")}
                  className="flex size-9 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                >
                  <LayoutGrid className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label={experts.listViewLabel}
                  aria-pressed={view === "list"}
                  onClick={() => setView("list")}
                  className="flex size-9 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                >
                  <List className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {pageItems.length === 0 ? (
            <div className="mt-6 border border-border px-6 py-16 text-center">
              <p className="font-display text-xl">{experts.emptyTitle}</p>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                {experts.emptyDescription}
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "mt-6 min-h-11 px-5",
                )}
              >
                {experts.resetLabel}
              </button>
            </div>
          ) : view === "grid" ? (
            <Reveal
              as="ul"
              stagger
              className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3"
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
                  view="grid"
                />
              ))}
            </Reveal>
          ) : (
            <Reveal
              as="ul"
              stagger
              className="mt-6 flex flex-col gap-3 sm:gap-4"
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
                  view="list"
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
      </div>
    </div>
  );
}

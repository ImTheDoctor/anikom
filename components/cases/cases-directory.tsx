"use client";

// Client boundary: the active direction filter lives in state and re-derives
// the visible cards. The server passes the full localized item list and copy;
// no data fetching happens here. Filter options are derived from the data —
// only directions that actually have cases render — so an empty result set is
// impossible and there is no empty state to design.

import { useMemo, useState } from "react";
import { CaseCard } from "@/components/cards/case-card";
import type { HomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type CasesDirectoryProps = {
  items: HomeContent["cases"]["items"];
  // services.items order (direction slugs + full titles) defines the filter
  // order; the chip label itself is the shorter case category.
  services: { slug: string; title: string }[];
  ui: Pick<
    HomeContent["cases"],
    "filtersLabel" | "allFilterLabel" | "resultsLabel" | "cardAction"
  >;
  locale: Locale;
};

export function CasesDirectory({
  items,
  services,
  ui,
  locale,
}: CasesDirectoryProps) {
  const [active, setActive] = useState<string>("all");

  const options = useMemo(
    () =>
      services
        .map(({ slug }) => {
          const first = items.find((item) => item.serviceSlug === slug);
          return first
            ? {
                slug,
                // Short category label (e.g. "Valuation") instead of the full
                // direction title — the titles are too long for chips.
                label: first.category,
                count: items.filter((item) => item.serviceSlug === slug).length,
              }
            : null;
        })
        .filter((option): option is NonNullable<typeof option> =>
          Boolean(option),
        ),
    [services, items],
  );

  const visible =
    active === "all"
      ? items
      : items.filter((item) => item.serviceSlug === active);

  return (
    <div>
      <div
        role="group"
        aria-label={ui.filtersLabel}
        className="flex flex-wrap gap-2"
      >
        <FilterButton
          pressed={active === "all"}
          onClick={() => setActive("all")}
        >
          {ui.allFilterLabel} · {items.length}
        </FilterButton>
        {options.map((option) => (
          <FilterButton
            key={option.slug}
            pressed={active === option.slug}
            onClick={() => setActive(option.slug)}
          >
            {option.label} · {option.count}
          </FilterButton>
        ))}
      </div>

      <p aria-live="polite" className="mt-5 text-sm text-muted-foreground">
        {ui.resultsLabel.replace("{count}", String(visible.length))}
      </p>

      {/* Keyed by the active filter so every change remounts the cards and
          replays the one-shot filter-cascade rise (globals.css, §7 Motion);
          the markup stays fully rendered for no-JS clients. */}
      <ul
        key={active}
        className="filter-cascade mt-6 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4"
      >
        {visible.map((item) => (
          <CaseCard
            key={item.slug}
            item={item}
            locale={locale}
            actionLabel={ui.cardAction}
          />
        ))}
      </ul>
    </div>
  );
}

type FilterButtonProps = {
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function FilterButton({ pressed, onClick, children }: FilterButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none",
        pressed
          ? "border-primary bg-primary text-primary-foreground hover:bg-primary-hover"
          : "border-border bg-background text-foreground hover:border-primary hover:text-primary",
      )}
    >
      {children}
    </button>
  );
}

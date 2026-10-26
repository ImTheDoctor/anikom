import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Calculator,
  Car,
  Compass,
  FileSearch,
  Scale,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { HomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";

// Thematic line icon per direction (structural, not copy). Deliberately
// distinct from the process-step icons (no HardHat/DraftingCompass reuse).
// Exported so the /services page can merge it with the classifier type icons.
export const iconBySlug: Record<string, LucideIcon> = {
  "judicial-examinations": Scale,
  "construction-technical-examinations": Building2,
  "property-valuation": Calculator,
  "auto-technical-examinations": Car,
  "economic-accounting-examinations": BarChart3,
  "document-research": FileSearch,
  "geodetic-cadastral-works": Compass,
  "damage-assessment": Wrench,
};

type ServiceIndexProps = {
  services: HomeContent["services"];
  locale: Locale;
  headingLevel?: "h2" | "h3";
  // Renders the ninth cell — a deep-burgundy action card linking to
  // /services (homepage variant; 8 cards + 1 action = a full 3×3 grid).
  showActionCard?: boolean;
  // Per-item mono labels (e.g. classifier codes) replacing the sequential
  // 01–08 numbering; an empty string renders an empty label slot.
  numbers?: string[];
  // Per-item icon override; defaults to the direction icon map.
  icons?: Record<string, LucideIcon>;
};

// Card grid of the eight expertise directions (owner request, Oct 2026 —
// replaces the hairline row index): mono number + line icon, serif title,
// muted description in a square hairline card. The whole card is one
// stretched link; hover tints the border and underlines the title (the
// editorial link-card language). The optional ninth cell is the "all
// services" action card on bg-brand-deep. Shared by the homepage section,
// the /services page, and the "other directions" block of detail pages; the
// /services page also reuses it for the classifier type cards.
export function ServiceIndex({
  services,
  locale,
  headingLevel: Title = "h3",
  showActionCard = false,
  numbers,
  icons,
}: ServiceIndexProps) {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {services.items.map(({ slug, title, description }, index) => {
        const Icon = icons ? icons[slug] : iconBySlug[slug];
        const label = numbers?.[index] ?? String(index + 1).padStart(2, "0");
        return (
          <li
            key={slug}
            className="group relative flex min-w-0 flex-col border border-border bg-card p-5 transition-colors duration-150 hover:border-primary sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground">
                {label}
              </span>
              {Icon ? (
                <Icon
                  className="size-5 shrink-0 text-primary"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              ) : null}
            </div>
            <Title className="mt-4 font-display text-lg leading-snug underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 group-hover:decoration-primary sm:text-xl">
              {title}
            </Title>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
            <Link
              href={`/${locale}/services/${slug}`}
              transitionTypes={["forward"]}
              className="absolute inset-0 focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
            >
              <span className="sr-only">{title}</span>
            </Link>
          </li>
        );
      })}
      {showActionCard ? (
        <li className="group relative flex min-w-0 flex-col border border-hero-border bg-brand-deep p-5 sm:p-6">
          <ArrowRight
            className="size-5 self-end text-hero-accent transition-transform duration-150 group-hover:translate-x-0.5"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <p className="mt-auto pt-8 font-display text-lg leading-snug text-hero-foreground sm:text-xl">
            {services.action}
          </p>
          <Link
            href={`/${locale}/services`}
            transitionTypes={["forward"]}
            className="absolute inset-0 focus-visible:ring-3 focus-visible:ring-hero-accent focus-visible:outline-none"
          >
            <span className="sr-only">{services.action}</span>
          </Link>
        </li>
      ) : null}
    </ul>
  );
}

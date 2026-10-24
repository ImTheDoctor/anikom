import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ExpertItem } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";

export type ExpertCardView = "grid" | "list";

// Directory cards never need the heavy profile block; the detail page passes
// full roster items, which still satisfy this shape.
export type ExpertCardItem = Omit<ExpertItem, "profile">;

type ExpertCardProps = {
  item: ExpertCardItem;
  directionLabels: string[];
  locale: Locale;
  actionLabel: string;
  view: ExpertCardView;
};

function DirectionTags({ labels }: { labels: string[] }) {
  if (!labels.length) return null;
  return (
    <ul className="mt-3 flex min-w-0 flex-wrap gap-1.5">
      {labels.map((label) => (
        <li
          key={label}
          title={label}
          className="max-w-full truncate rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
        >
          {label}
        </li>
      ))}
    </ul>
  );
}

// Same interaction language as the homepage TeamCard: the whole card is one
// stretched link, the circular arrow is the single visible affordance, and
// the accessible link name comes from the sr-only span. The grid variant
// adds the experience badge and direction tags from the roster data.
export function ExpertCard({
  item,
  directionLabels,
  locale,
  actionLabel,
  view,
}: ExpertCardProps) {
  const link = (
    <Link
      href={`/${locale}/team/${item.slug}`}
      transitionTypes={["forward"]}
      className="absolute inset-0 focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
    >
      <span className="sr-only">
        {actionLabel} — {item.name}
      </span>
    </Link>
  );

  if (view === "list") {
    return (
      <li className="group relative flex items-stretch border border-border bg-card transition-shadow duration-300 hover:shadow-md">
        <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden sm:w-32 lg:w-36">
          <Image
            src={`/images/team/${item.slug}.jpg`}
            alt={item.imageLabel}
            fill
            sizes="(max-width: 640px) 96px, 144px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center py-4 pr-4 sm:py-5 sm:pr-16">
          <h3 className="font-display text-lg leading-snug sm:text-xl">
            {item.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {item.role} · {item.experience}
          </p>
          <DirectionTags labels={directionLabels} />
        </div>
        <span
          aria-hidden="true"
          className="absolute top-1/2 right-4 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-primary transition-colors duration-150 group-hover:border-primary sm:inline-flex"
        >
          <ArrowRight className="size-4" strokeWidth={1.5} />
        </span>
        {link}
      </li>
    );
  }

  return (
    <li className="group relative flex min-w-0 flex-col transition-shadow duration-300 hover:shadow-md">
      <div className="relative aspect-[3/4] w-full overflow-hidden border border-border">
        <Image
          src={`/images/team/${item.slug}.jpg`}
          alt={item.imageLabel}
          fill
          sizes="(max-width: 1280px) 50vw, 30vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span
          aria-hidden="true"
          className="absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-primary transition-colors duration-150 group-hover:border-primary"
        >
          <ArrowRight className="size-4" strokeWidth={1.5} />
        </span>
        <span className="absolute bottom-3 left-3 inline-flex items-center rounded-full bg-background px-2.5 py-1 text-xs font-medium text-foreground">
          {item.experience}
        </span>
      </div>
      <div className="flex flex-1 flex-col border-x border-b border-border bg-card p-4 sm:p-5">
        <h3 className="font-display text-lg leading-snug sm:text-xl">
          {item.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{item.role}</p>
        <DirectionTags labels={directionLabels} />
      </div>
      {link}
    </li>
  );
}

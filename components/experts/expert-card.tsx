import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ExpertItem } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";

// Directory cards never need the heavy profile block; the detail page passes
// full roster items, which still satisfy this shape.
export type ExpertCardItem = Omit<ExpertItem, "profile">;

type ExpertCardProps = {
  item: ExpertCardItem;
  locale: Locale;
  actionLabel: string;
};

// Same interaction language as the homepage TeamCard: the whole card is one
// stretched link, the circular arrow is the single visible affordance, and
// the accessible link name comes from the sr-only span. Owner request,
// Nov 11, 2026: all copy sits on a frosted-glass panel at the bottom of the
// portrait (brand-deep glass — the sanctioned dark-panel surface), and only
// the name + role stay on the panel ("остальное убрать — пол картинки
// не видно"); experience and directions live in the profile data only.
export function ExpertCard({ item, locale, actionLabel }: ExpertCardProps) {
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
          className="absolute top-3 right-3 z-10 inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-primary transition-colors duration-150 group-hover:border-primary"
        >
          <ArrowRight className="size-4" strokeWidth={1.5} />
        </span>

        <div className="absolute inset-x-0 bottom-0 border-t border-hero-border bg-brand-deep/75 p-4 backdrop-blur-md sm:p-5">
          <h3 className="font-display text-lg leading-snug text-hero-foreground sm:text-xl">
            {item.name}
          </h3>
          <p className="mt-1 text-xs text-hero-foreground/80">{item.role}</p>
        </div>
      </div>
      <Link
        href={`/${locale}/team/${item.slug}`}
        transitionTypes={["forward"]}
        className="absolute inset-0 focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
      >
        <span className="sr-only">
          {actionLabel} — {item.name}
        </span>
      </Link>
    </li>
  );
}

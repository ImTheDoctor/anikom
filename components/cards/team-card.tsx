import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { HomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";

export type TeamItem = HomeContent["team"]["items"][number];

type TeamCardProps = {
  item: TeamItem;
  locale: Locale;
  actionLabel: string;
};

// Reference pattern: the whole card is one link; the circular arrow on the
// portrait is the single visible affordance. The accessible link name comes
// from the sr-only span (actionLabel + name) — no visible "view profile"
// duplicate, per the anti-slop rules (one signal, one voice).
export function TeamCard({ item, locale, actionLabel }: TeamCardProps) {
  return (
    <li className="group relative flex min-w-0 flex-col transition-shadow duration-300 hover:shadow-md">
      <div className="relative aspect-[3/4] w-full overflow-hidden border border-border">
        <Image
          src={`/images/team/${item.slug}.jpg`}
          alt={item.imageLabel}
          fill
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span
          aria-hidden="true"
          className="absolute top-3 right-3 inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-primary transition-colors duration-150 group-hover:border-primary"
        >
          <ArrowRight className="size-4" strokeWidth={1.5} />
        </span>
      </div>
      <div className="flex flex-1 flex-col border-x border-b border-border bg-card p-4 sm:p-5">
        <h3 className="font-display text-lg leading-snug sm:text-xl">
          {item.name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{item.role}</p>
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

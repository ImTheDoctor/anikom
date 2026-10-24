import Image from "next/image";
import { ActionLink } from "@/components/action-link";
import type { HomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";

export type CaseItem = HomeContent["cases"]["items"][number];

type CaseCardProps = {
  item: CaseItem;
  locale: Locale;
  actionLabel: string;
};

export function CaseCard({ item, locale, actionLabel }: CaseCardProps) {
  return (
    <li className="group flex min-w-0 flex-col">
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-border">
        <Image
          src={`/images/cases/${item.slug}.jpg`}
          alt={item.imageLabel}
          fill
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <p className="mt-4 text-[11px] font-medium tracking-[0.14em] text-primary uppercase">
        {item.category}
      </p>
      <h3 className="mt-2 font-display text-lg leading-snug underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 group-hover:decoration-primary sm:text-xl">
        {item.title}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">{item.date}</p>
      <div className="mt-auto pt-4">
        <ActionLink href={`/${locale}/cases/${item.slug}`} className="text-xs">
          {actionLabel}
        </ActionLink>
      </div>
    </li>
  );
}

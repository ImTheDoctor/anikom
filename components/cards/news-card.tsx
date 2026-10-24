import Image from "next/image";
import { ActionLink } from "@/components/action-link";
import type { HomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";

export type NewsItem = HomeContent["news"]["items"][number];

type NewsCardProps = {
  item: NewsItem;
  locale: Locale;
  actionLabel: string;
};

export function NewsCard({ item, locale, actionLabel }: NewsCardProps) {
  return (
    <li className="min-w-0">
      <article className="group flex h-full gap-3 border border-border bg-card p-3">
        <div className="relative size-24 shrink-0 overflow-hidden border border-border sm:size-28">
          <Image
            src={`/images/news/${item.slug}.jpg`}
            alt={item.imageLabel}
            fill
            sizes="112px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-[11px] font-medium tracking-[0.14em] text-primary uppercase">
            {item.category}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{item.date}</p>
          <h3 className="mt-2 font-display text-lg leading-snug underline decoration-transparent decoration-1 underline-offset-4 transition-colors duration-200 group-hover:decoration-primary">
            {item.title}
          </h3>
          <div className="mt-auto pt-3">
            <ActionLink
              href={`/${locale}/news/${item.slug}`}
              className="text-xs"
            >
              {actionLabel}
            </ActionLink>
          </div>
        </div>
      </article>
    </li>
  );
}

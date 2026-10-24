import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { HomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type FeaturedBlocksProps = {
  content: HomeContent;
  locale: Locale;
};

export function FeaturedBlocks({ content, locale }: FeaturedBlocksProps) {
  const { featured } = content;
  const { primary, secondary } = featured;

  return (
    <section
      aria-label={featured.sectionLabel}
      className="border-t border-border py-16 md:py-20"
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <article className="grid border border-border bg-card sm:grid-cols-2 lg:col-span-2">
          <div className="relative aspect-[4/3] h-full w-full overflow-hidden border-b border-border sm:aspect-auto sm:min-h-80 sm:border-r sm:border-b-0">
            <Image
              src="/images/featured/guidance.jpg"
              alt={primary.imageLabel}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
              {primary.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-2xl leading-snug sm:text-3xl">
              {primary.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {primary.description}
            </p>
            <Link
              href={localizeHref(locale, primary.cta.href)}
              transitionTypes={["forward"]}
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-6 min-h-11 self-start px-4",
              )}
            >
              {primary.cta.label}
              <ArrowRight
                className="size-4 transition-transform duration-150 group-hover/button:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </article>

        <article className="flex flex-col bg-brand-deep p-6 text-hero-foreground sm:p-8">
          <p className="text-xs font-medium tracking-[0.18em] text-hero-accent uppercase">
            {secondary.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-2xl leading-snug sm:text-3xl">
            {secondary.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-hero-muted">
            {secondary.description}
          </p>
          <Link
            href={localizeHref(locale, secondary.cta.href)}
            transitionTypes={["forward"]}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "mt-8 min-h-11 self-start border-hero-foreground/40 bg-transparent px-4 text-hero-foreground shadow-none hover:bg-hero-foreground/10 hover:text-hero-foreground focus-visible:border-hero-accent focus-visible:ring-hero-accent",
            )}
          >
            {secondary.cta.label}
            <ArrowRight
              className="size-4 transition-transform duration-150 group-hover/button:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </article>
      </div>
    </section>
  );
}

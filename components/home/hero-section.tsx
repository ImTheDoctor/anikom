import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { StatCounter } from "@/components/home/stat-counter";
import type { HomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type HeroSectionProps = {
  content: HomeContent;
  locale: Locale;
};

export function HeroSection({ content, locale }: HeroSectionProps) {
  const { hero } = content;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-hero text-hero-foreground"
    >
      <Image
        src="/hero.webp"
        alt="hero"
        fill
        preload
        sizes="100vw"
        className="z-0 object-cover object-[70%_0%]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-hero/75 md:bg-hero/60 lg:bg-hero/35"
      />

      <div className="mx-auto flex min-h-[calc(100svh-4rem)] w-full flex-col px-4 pt-14 pb-16 sm:min-h-[calc(100svh-5rem)] sm:px-6 sm:pt-16 md:pt-20 md:pb-24 lg:px-15 lg:pt-24 lg:pb-28 2xl:max-w-[120rem]">
        <div className="min-w-0 pb-10">
          <h1
            id="hero-heading"
            className="motion-rise max-w-2xl font-display text-4xl leading-[1.06] sm:text-5xl xl:text-6xl"
          >
            {hero.title}
          </h1>
          <p className="motion-rise mt-5 max-w-xl text-base leading-relaxed text-hero-muted sm:text-lg [--motion-delay:80ms]">
            {hero.description}
          </p>
          <div className="motion-rise mt-8 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center [--motion-delay:160ms]">
            <Link
              href={localizeHref(locale, hero.primaryCta.href)}
              transitionTypes={["forward"]}
              className={cn(
                buttonVariants({ size: "lg" }),
                "min-h-11 w-full justify-center px-5 sm:w-auto",
              )}
            >
              {hero.primaryCta.label}
              <ArrowRight
                className="size-4 transition-transform duration-150 group-hover/button:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
            <Link
              href={localizeHref(locale, hero.secondaryCta.href)}
              transitionTypes={["forward"]}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "min-h-11 w-full justify-center border-hero-foreground/40 bg-transparent px-4 text-hero-foreground shadow-none hover:bg-hero-foreground/10 hover:text-hero-foreground focus-visible:border-hero-accent focus-visible:ring-hero-accent sm:w-auto",
              )}
            >
              {hero.secondaryCta.label}
              <ArrowRight
                className="size-4 transition-transform duration-150 group-hover/button:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        <div className="motion-rise mt-auto border-t border-hero-border pt-7 [--motion-delay:240ms]">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
            {hero.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <dt className="order-2 mt-2 text-[11px] leading-snug font-medium tracking-[0.14em] text-hero-muted uppercase">
                  {stat.label}
                </dt>
                <dd className="order-1 font-display text-3xl leading-none text-hero-foreground sm:text-4xl">
                  <StatCounter value={stat.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

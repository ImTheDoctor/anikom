import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { HomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type ContactCtaProps = {
  content: HomeContent;
  locale: Locale;
};

// Compact contained banner (owner reference, Oct 2026): a rounded brand-deep
// panel inside the page container — copy left, two actions right, the hero
// photo as a faint texture. Replaces the former full-bleed band. The eyebrow
// and address/hours note keys stay in the JSON but render nowhere; contacts
// live in the footer column.
export function ContactCta({ content, locale }: ContactCtaProps) {
  const { contact } = content;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-16 sm:scroll-mt-20"
    >
      <div className="mx-auto w-full px-4 py-14 sm:px-6 md:py-20 lg:px-15 2xl:max-w-[120rem]">
        <div className="relative isolate overflow-hidden rounded-2xl bg-brand-deep text-hero-foreground">
          {/* Dedicated asset — not /hero.png: next's dev LCP tracker keys by
              resolved src, so a lazy next/image sharing the hero's src makes
              the eager hero image report a false LCP warning. */}
          <Image
            src="/images/office-texture.jpg"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 90vw"
            className="-z-10 object-cover object-[70%_0%] opacity-15"
          />
          <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-10">
            <div className="max-w-xl">
              <h2
                id="contact-heading"
                className="font-display text-2xl leading-snug sm:text-3xl"
              >
                {contact.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-hero-muted sm:text-base">
                {contact.description}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:shrink-0">
              <Link
                href={localizeHref(locale, contact.primaryCta.href)}
                transitionTypes={["forward"]}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "min-h-11 justify-center bg-background px-5 text-primary hover:bg-muted hover:text-primary focus-visible:border-hero-accent focus-visible:ring-hero-accent",
                )}
              >
                {contact.primaryCta.label}
                <ArrowRight
                  className="size-4 transition-transform duration-150 group-hover/button:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href={localizeHref(locale, contact.secondaryCta.href)}
                transitionTypes={["forward"]}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "min-h-11 justify-center bg-primary px-5 text-primary-foreground hover:bg-primary-hover focus-visible:border-hero-accent focus-visible:ring-hero-accent",
                )}
              >
                {contact.secondaryCta.label}
                <ArrowRight
                  className="size-4 transition-transform duration-150 group-hover/button:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

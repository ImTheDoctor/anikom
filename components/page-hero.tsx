import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeroCrumb = {
  label: string;
  href?: string;
};

type PageHeroProps = {
  breadcrumbLabel: string;
  crumbs: PageHeroCrumb[];
  title: string;
  eyebrow?: string;
  meta?: string;
  description?: string;
  chips?: string[];
  image: string;
  /**
   * Extra classes for the cover image, e.g. "object-[50%_30%]" to shift the
   * crop. Must be written as a literal in the calling page so Tailwind picks
   * it up; defaults to a plain center cover.
   */
  imageClassName?: string;
  /** Scrim classes; the default keeps the photo visible while the copy
   * stays legible. Pages whose photo is bright on the text side pass a
   * stronger one. */
  overlayClassName?: string;
  /** Free-form band content after the title (intro paragraphs, stats). */
  children?: ReactNode;
};

// Shared dark hero band for section subpages (owner request, Oct 2026):
// every page carries its own thematic cover photo under a flat bg-hero
// scrim — the same treatment as the homepage hero, at compact band
// heights. Photos are draft placeholders (docs/design-system.md §11);
// the image itself is decorative, the breadcrumb names the page.
export function PageHero({
  breadcrumbLabel,
  crumbs,
  title,
  eyebrow,
  meta,
  description,
  chips,
  image,
  imageClassName,
  overlayClassName = "bg-hero/85 md:bg-hero/75 lg:bg-hero/60",
  children,
}: PageHeroProps) {
  return (
    <section className="relative isolate flex min-h-[20rem] items-center overflow-hidden bg-hero text-hero-foreground sm:min-h-[24rem] lg:min-h-[36rem]">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        // Slight blur + upscale keeps the photo a readable backdrop (owner
        // request, Oct 26) and hides the blur fringe at the band edges.
        className={cn("-z-10 scale-105 blur-sm", imageClassName ?? "object-cover")}
      />
      {/* Scrim sits under the content (-z-10, after the photo in DOM order)
          — a flat overlay above the container swallowed clicks on the
          breadcrumb links. */}
      <div aria-hidden="true" className={`absolute inset-0 -z-10 ${overlayClassName}`} />

      <div className="mx-auto w-full px-4 py-10 sm:px-6 sm:py-12 lg:px-15 2xl:max-w-[120rem]">
        <nav aria-label={breadcrumbLabel}>
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-hero-foreground">
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;
              return (
                <li key={crumb.label} className="flex items-center gap-1.5">
                  {index > 0 ? (
                    <ChevronRight className="size-3.5" aria-hidden="true" />
                  ) : null}
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      transitionTypes={["back"]}
                      className="rounded-sm underline-offset-4 transition-colors hover:underline focus-visible:ring-3 focus-visible:ring-hero-accent focus-visible:outline-none"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current={isLast ? "page" : undefined}>
                      {crumb.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {eyebrow ? (
          <p className="motion-rise mt-5 text-[11px] font-medium tracking-[0.14em] text-hero-accent uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="motion-rise mt-5 font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {meta ? (
          <p className="motion-rise mt-4 text-sm text-hero-foreground/80 sm:text-base [--motion-delay:80ms]">
            {meta}
          </p>
        ) : null}
        {description ? (
          <p className="motion-rise mt-4 max-w-2xl text-base leading-relaxed text-hero-foreground sm:text-lg [--motion-delay:80ms]">
            {description}
          </p>
        ) : null}
        {chips && chips.length > 0 ? (
          <ul className="motion-rise mt-6 flex flex-wrap gap-2 [--motion-delay:160ms]">
            {chips.map((chip) => (
              <li
                key={chip}
                className="rounded-full border border-hero-border px-3 py-1 text-[11px] font-medium tracking-[0.16em] text-hero-accent uppercase"
              >
                {chip}
              </li>
            ))}
          </ul>
        ) : null}
        {children}
      </div>
    </section>
  );
}

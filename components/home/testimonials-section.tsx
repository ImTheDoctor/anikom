"use client";

// Client Component: the embla carousel runtime needs browser APIs (pointer
// events, layout measurement) and the controls need state and event handlers.
// Server markup keeps every quote in the DOM — without JS the first quote
// renders in place and the rest stay present for assistive tech and crawlers.

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import type { HomeContent } from "@/lib/home-content";

// Auto-advance delay: 4s per quote (owner pacing, Oct 26).
const QUOTE_INTERVAL_MS = 4000;

// Track prefers-reduced-motion without setState-in-effect (hydration-safe:
// React hydrates against the false server snapshot, then adopts the real one).
// Same pattern as components/home/process-section.tsx.
function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type TestimonialsSectionProps = {
  content: HomeContent;
};

// Testimonial pull-quote carousel (owner request, Oct 2026): one serif quote
// per view inside the process-banner surface (rounded bg-brand-deep panel —
// this section has no subpage, so it deliberately does not share the light
// look of the page-linked sections), pointer drag with momentum, loop mode so
// the last slide flows back to the first, and the sanctioned auto-advance
// with the stepper's freeze rules (§7): off-screen, hover/focus, hidden
// document, and prefers-reduced-motion all stop it. Auto changes stay silent
// for screen readers (the counter announces only user-driven moves). No
// avatars, icons on quotes, or numeric ratings — draft quotes must not carry
// a fake rating signal.
export function TestimonialsSection({ content }: TestimonialsSectionProps) {
  const { testimonials } = content;
  const total = testimonials.items.length;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Autoplay pause conditions, process-stepper style (§7 "Motion").
  const [interacting, setInteracting] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!emblaApi) return;

    const update = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    update();
    emblaApi.on("select", update);
    emblaApi.on("reInit", update);
    return () => {
      emblaApi.off("select", update);
      emblaApi.off("reInit", update);
    };
  }, [emblaApi]);

  // Auto-advance only while the panel is actually on screen.
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () => setPageHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // One quote delay per effect run: every slide change (auto or manual) and
  // every pause/resume restarts the full interval — there is no progress fill
  // to keep in sync, so a plain timeout matches the stepper's behavior.
  useEffect(() => {
    if (!emblaApi || total < 2 || reducedMotion || interacting || pageHidden || !onScreen) {
      return;
    }
    const timer = window.setTimeout(() => emblaApi.scrollNext(), QUOTE_INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [emblaApi, total, reducedMotion, interacting, pageHidden, onScreen, selectedIndex]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // WAI-ARIA carousel convention: the slide region itself takes arrow keys
  // when focused, so keyboard users are not locked to the prev/next buttons.
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollNext();
    }
  };

  const arrowButtonClass =
    "inline-flex size-11 items-center justify-center rounded-full border border-hero-border text-hero-accent transition-colors duration-150 hover:border-hero-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-hero-accent";

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="scroll-mt-16 py-6 sm:scroll-mt-20 sm:py-10"
    >
      <div
        ref={panelRef}
        className="rounded-2xl bg-brand-deep p-6 text-hero-foreground sm:p-10 lg:px-12 lg:py-12"
        onPointerEnter={() => setInteracting(true)}
        onPointerLeave={() => setInteracting(false)}
        onFocus={() => setInteracting(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setInteracting(false);
          }
        }}
      >
        <Reveal stagger>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <div className="max-w-2xl">
              <p className="text-xs font-medium tracking-[0.18em] text-hero-accent uppercase">
                {testimonials.eyebrow}
              </p>
              <h2
                id="testimonials-heading"
                className="mt-3 font-display text-3xl leading-tight sm:text-4xl"
              >
                {testimonials.title}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-hero-muted sm:text-base">
                {testimonials.description}
              </p>
            </div>
            <div className="flex items-center gap-4 sm:gap-5 sm:pb-1">
              <span
                aria-live={interacting || reducedMotion ? "polite" : "off"}
                className="font-mono text-xs text-hero-muted"
              >
                {String(selectedIndex + 1).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={scrollPrev}
                  aria-label={testimonials.prevLabel}
                  className={arrowButtonClass}
                >
                  <ArrowLeft
                    className="size-4"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </button>
                <button
                  type="button"
                  onClick={scrollNext}
                  aria-label={testimonials.nextLabel}
                  className={arrowButtonClass}
                >
                  <ArrowRight
                    className="size-4"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>

          <div
            ref={emblaRef}
            role="group"
            aria-label={testimonials.title}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="mt-10 overflow-hidden focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-hero-accent sm:mt-12"
          >
            <ul className="flex">
              {testimonials.items.map((testimonial) => (
                <li
                  key={testimonial.author}
                  className="min-w-0 flex-[0_0_100%] border-l border-hero-border pl-6 sm:pl-8"
                >
                  <blockquote className="max-w-3xl font-display text-2xl leading-snug sm:text-3xl">
                    “{testimonial.quote}”
                  </blockquote>
                  <footer className="mt-6">
                    <p className="text-sm font-medium">{testimonial.author}</p>
                    <p className="mt-0.5 text-xs text-hero-muted">
                      {testimonial.organization}
                    </p>
                  </footer>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

"use client";

// Client Component: the stepper banner runs a rAF clock (auto-advance +
// progress fill), pauses on hover/focus/off-screen/hidden document, and slides
// step changes via WAAPI — all browser-only. SSR renders step 01 visible;
// under prefers-reduced-motion the timer and slide stay off and the widget
// works as a plain selectable tab list (docs/design-system.md §7, sanctioned
// auto-rotation exception, Oct 2026).

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardCheck,
  DraftingCompass,
  FileCheck2,
  HardHat,
  MessageSquare,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import type { HomeContent } from "@/lib/home-content";
import { localizeHref, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const stepIcons = [
  MessageSquare,
  ClipboardCheck,
  DraftingCompass,
  HardHat,
  FileCheck2,
];

const STEP_DURATION_MS = 6000;
const SLIDE_MS = 400;
const SLIDE_DISTANCE_PX = 16;
const HOUSE_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

// Track prefers-reduced-motion without setState-in-effect (hydration-safe:
// React hydrates against the false server snapshot, then adopts the real one).
function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type ProcessSectionProps = {
  content: HomeContent;
  locale: Locale;
};

export function ProcessSection({ content, locale }: ProcessSectionProps) {
  const { process } = content;
  const steps = process.steps;
  const count = steps.length;

  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  // Bumped on every manual selection so the timer effect re-runs (and
  // restarts) even when the same tab is clicked again.
  const [cycle, setCycle] = useState(0);
  const [interacting, setInteracting] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );

  const bannerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const fillRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  // Elapsed time inside the current step; kept across pause/resume so the
  // fill continues where it stopped instead of restarting.
  const elapsedRef = useRef(0);
  const firstSlideRef = useRef(true);

  const select = (index: number) => {
    if (index !== active) setDirection(index > active ? "forward" : "back");
    elapsedRef.current = 0;
    setActive(index);
    setCycle((current) => current + 1);
  };

  // Auto-advance only while the banner is actually on screen.
  useEffect(() => {
    const el = bannerRef.current;
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

  // One rAF clock drives both the active tab's fill and the advance, so they
  // can never drift apart; every pause condition simply stops scheduling.
  useEffect(() => {
    for (let index = 0; index < count; index += 1) {
      const el = fillRefs.current[index];
      if (!el) continue;
      el.style.transform =
        index < active || (reducedMotion && index === active)
          ? "scaleX(1)"
          : index === active
            ? `scaleX(${elapsedRef.current / STEP_DURATION_MS})`
            : "scaleX(0)";
    }
    if (reducedMotion || interacting || pageHidden || !onScreen) return;

    const fill = fillRefs.current[active];
    let frame = 0;
    const start = performance.now() - elapsedRef.current;
    const tick = (now: number) => {
      elapsedRef.current = now - start;
      const progress = Math.min(elapsedRef.current / STEP_DURATION_MS, 1);
      if (fill) fill.style.transform = `scaleX(${progress})`;
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      elapsedRef.current = 0;
      setDirection("forward");
      setActive((current) => (current + 1) % count);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, cycle, count, interacting, onScreen, pageHidden, reducedMotion]);

  // Direction-aware slide on the incoming step (§7: enter 400ms house ease).
  useEffect(() => {
    if (firstSlideRef.current) {
      firstSlideRef.current = false;
      return;
    }
    if (reducedMotion) return;
    panelRefs.current[active]?.animate(
      [
        {
          opacity: 0,
          transform: `translateX(${
            direction === "forward" ? SLIDE_DISTANCE_PX : -SLIDE_DISTANCE_PX
          }px)`,
        },
        { opacity: 1, transform: "translateX(0)" },
      ],
      { duration: SLIDE_MS, easing: HOUSE_EASE },
    );
  }, [active, cycle, direction, reducedMotion]);

  const onTablistKeyDown = (event: React.KeyboardEvent) => {
    let next: number | null = null;
    if (event.key === "ArrowRight") next = (active + 1) % count;
    else if (event.key === "ArrowLeft") next = (active - 1 + count) % count;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count - 1;
    if (next === null) return;
    event.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="scroll-mt-16 py-6 sm:scroll-mt-20 sm:py-10"
    >
      <div
        ref={bannerRef}
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
                {process.eyebrow}
              </p>
              <h2
                id="process-heading"
                className="mt-3 font-display text-3xl leading-tight sm:text-4xl"
              >
                {process.title}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-hero-muted sm:text-base">
                {process.description}
              </p>
            </div>
            <Link
              href={localizeHref(locale, process.action.href)}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "min-h-11 shrink-0 border-hero-foreground/40 bg-transparent px-4 text-hero-foreground shadow-none hover:bg-hero-foreground/10 hover:text-hero-foreground focus-visible:border-hero-accent focus-visible:ring-hero-accent",
              )}
            >
              {process.action.label}
              <ArrowRight
                className="size-4 transition-transform duration-150 group-hover/button:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div
            role="tablist"
            aria-label={process.title}
            onKeyDown={onTablistKeyDown}
            className="mt-10 grid grid-cols-5 gap-2 sm:mt-12 sm:gap-4"
          >
            {steps.map((step, index) => (
              <button
                key={step.number}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`process-tab-${index}`}
                aria-selected={index === active}
                aria-controls="process-panel"
                tabIndex={index === active ? 0 : -1}
                onClick={() => select(index)}
                className="group flex min-h-11 flex-col items-start gap-2 rounded-sm text-left focus-visible:ring-3 focus-visible:ring-hero-accent focus-visible:outline-none"
              >
                <span
                  className={cn(
                    "font-mono text-xs tracking-[0.16em]",
                    index === active
                      ? "text-hero-accent"
                      : "text-hero-muted transition-colors group-hover:text-hero-foreground",
                  )}
                >
                  {step.number}
                </span>
                <span
                  className={cn(
                    "hidden text-sm font-medium lg:block",
                    index === active
                      ? "text-hero-foreground"
                      : "text-hero-muted transition-colors group-hover:text-hero-foreground",
                  )}
                >
                  {step.title}
                </span>
                <span className="block h-0.5 w-full overflow-hidden rounded-full bg-hero-foreground/15">
                  <span
                    ref={(el) => {
                      fillRefs.current[index] = el;
                    }}
                    className={cn(
                      "block h-full w-full origin-left scale-x-0",
                      index < active ? "bg-hero-accent/60" : "bg-hero-accent",
                    )}
                  />
                </span>
              </button>
            ))}
          </div>

          {/* Equal-height grid stack: all five panels share one cell, so the
              tallest description fixes the height and auto-advance never
              shifts layout. Inactive panels are visibility-hidden. */}
          <div
            id="process-panel"
            role="tabpanel"
            aria-labelledby={`process-tab-${active}`}
            aria-live={interacting || reducedMotion ? "polite" : "off"}
            className="mt-8 grid sm:mt-10"
          >
            {steps.map((step, index) => {
              const Icon = stepIcons[index];
              return (
                <div
                  key={step.number}
                  ref={(el) => {
                    panelRefs.current[index] = el;
                  }}
                  className={cn(
                    "col-start-1 row-start-1",
                    index !== active && "invisible",
                  )}
                >
                  {/* Number stacks above the copy below sm: Armenian step
                      titles are single long words that cannot shrink inside a
                      side-by-side row at 375px. */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
                    <span
                      aria-hidden="true"
                      className="font-display text-6xl leading-none text-hero-accent sm:text-7xl"
                    >
                      {step.number}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-hero-border text-hero-accent">
                          <Icon
                            className="size-5"
                            strokeWidth={1.5}
                            aria-hidden="true"
                          />
                        </span>
                        <h3 className="font-display text-2xl leading-snug">
                          {step.title}
                        </h3>
                      </div>
                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-hero-muted sm:text-base">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

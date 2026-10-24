"use client";

// Client Component: scroll-triggered reveals need IntersectionObserver in the
// browser. SSR renders the content plainly visible; the hidden state is set
// here after hydration only, so no-JS clients and crawlers never lose content.

import {
  useEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  as?: ElementType;
  stagger?: boolean;
  className?: string;
  children: ReactNode;
};

// The first batch of Reveal effects belongs to the initial document load;
// every later mount is a client-side route arrival that already carries the
// page-level View Transition (PageShell). Replaying the hidden→shown flip
// above the fold there would flicker on top of that transition, so such
// instances render already visible. The flag flips in a microtask so every
// effect of the initial load flush still sees `true`.
let initialLoad = true;

export function Reveal({
  as: Tag = "div",
  stagger = false,
  className,
  children,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const routeArrival = !initialLoad;
    if (initialLoad) {
      queueMicrotask(() => {
        initialLoad = false;
      });
    }

    // Mirrors the observer's viewport (rootMargin -12%, threshold 0.1).
    const aboveFold = el.getBoundingClientRect().top < window.innerHeight * 0.88;
    if (routeArrival && aboveFold) return;

    el.setAttribute("data-reveal", "hidden");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          el.setAttribute("data-reveal", "shown");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={cn(stagger && "reveal-stagger", className)}>
      {children}
    </Tag>
  );
}

"use client";

// Client Component: the numeric hero figures count up on mount, which needs
// requestAnimationFrame in the browser. SSR renders the final value, so
// hydration and prefers-reduced-motion users see the static figure.

import { useEffect, useState } from "react";

const START_DELAY_MS = 240; // matches the hero stat-strip reveal delay
const DURATION_MS = 900;

export function StatCounter({ value }: { value: string }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const match = value.match(/^(\d+)(.*)$/);
    if (!match || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const [, digits = "", suffix = ""] = match;
    const target = Number(digits);
    const startedAt = performance.now() + START_DELAY_MS;
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(Math.max((now - startedAt) / DURATION_MS, 0), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(`${Math.round(eased * target)}${suffix}`);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <span>{display}</span>;
}

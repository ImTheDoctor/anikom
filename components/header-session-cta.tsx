"use client";

// Client Component: the header CTA flips between Sign in / My account based
// on the non-HttpOnly `web_session_hint` cookie (value "1" = a session
// exists), so client-side navigations render the correct link synchronously
// — no streaming fallback, no wrong-state flash, no empty slot. The
// HttpOnly `web_session` token itself never reaches client JavaScript; the
// hint carries nothing but the fact of a session.
//
// The server render (and the hydration frame) knows nothing about browser
// cookies, so a neutral invisible slot is emitted there; after hydration the
// hint resolves. A missing hint (first visit after deploy, expired hint) is
// healed once per browser session against GET /api/auth/me — an already
// signed-in visitor never has to re-login for a correct header.

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { LogIn, UserRound } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { WEB_SESSION_HINT_COOKIE } from "@/lib/auth-api";
import type { LinkContent } from "@/lib/home-content";
import { localizeHref, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const HINT_CHECK_FLAG = "web-session-hint-checked";

// Tiny external store: listeners fire when the self-heal writes the hint, so
// mounted header CTAs re-render without prop or state changes.
const listeners: Array<() => void> = [];

function subscribe(onChange: () => void) {
  listeners.push(onChange);
  return () => {
    listeners.splice(listeners.indexOf(onChange), 1);
  };
}

function getHintSnapshot(): boolean | null {
  if (typeof document === "undefined") return null;
  return document.cookie.includes(`${WEB_SESSION_HINT_COOKIE}=1`);
}

function getHintServerSnapshot(): boolean | null {
  // Server and hydration frame: the hint is unknowable → neutral slot.
  return null;
}

function HeaderCtaLink({
  cta,
  locale,
  icon,
}: {
  cta: LinkContent;
  locale: Locale;
  icon: "sign-in" | "account";
}) {
  return (
    <Link
      href={localizeHref(locale, cta.href)}
      transitionTypes={["forward"]}
      // The Armenian cabinet label does not fit beside the crest plaque and
      // the menu toggle at 375px — icon-only below sm (label stays for
      // screen readers), text from sm up.
      className={cn(
        buttonVariants({ size: "lg" }),
        "min-h-11 w-11 justify-center px-0 sm:w-auto sm:px-4",
      )}
    >
      {icon === "sign-in" ? (
        <LogIn strokeWidth={1.75} aria-hidden="true" />
      ) : (
        <UserRound strokeWidth={1.75} aria-hidden="true" />
      )}
      <span className="hidden sm:inline">{cta.label}</span>
    </Link>
  );
}

// Neutral invisible slot: same height as the real button, shows nothing.
function HeaderCtaFallback() {
  return (
    <div
      aria-hidden="true"
      className={cn(
        buttonVariants({ size: "lg" }),
        "invisible min-h-11 w-11 px-0 sm:w-auto sm:px-4",
      )}
    />
  );
}

export function HeaderCta({
  authCta,
  cabinetCta,
  locale,
}: {
  authCta: LinkContent;
  cabinetCta: LinkContent;
  locale: Locale;
}) {
  // null = not yet known (server render / hydration frame).
  const hint = useSyncExternalStore(subscribe, getHintSnapshot, getHintServerSnapshot);

  useEffect(() => {
    if (hint) return;
    try {
      if (sessionStorage.getItem(HINT_CHECK_FLAG)) return;
      sessionStorage.setItem(HINT_CHECK_FLAG, "1");
    } catch {
      // Storage unavailable — proceed with the check anyway.
    }
    let stale = false;
    fetch("/api/auth/me")
      .then((res) => {
        if (stale || !res.ok) return;
        document.cookie = `${WEB_SESSION_HINT_COOKIE}=1; path=/; max-age=86400; samesite=lax`;
        for (const listener of listeners) listener();
      })
      .catch(() => {
        // Network hiccup — the next browser session re-checks.
      });
    return () => {
      stale = true;
    };
  }, [hint]);

  if (hint === null) return <HeaderCtaFallback />;
  if (hint) return <HeaderCtaLink cta={cabinetCta} locale={locale} icon="account" />;
  return <HeaderCtaLink cta={authCta} locale={locale} icon="sign-in" />;
}

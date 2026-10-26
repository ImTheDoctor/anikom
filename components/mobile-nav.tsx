"use client";

// Client boundary: disclosure state, Escape handling, and pathname-aware language links.
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { LanguageLinks } from "@/components/language-switcher";
import type { LanguageContent, LinkContent } from "@/lib/home-content";
import { localizeHref, type Locale } from "@/lib/i18n";

type MobileNavProps = {
  locale: Locale;
  nav: LinkContent[];
  navLabel: string;
  openLabel: string;
  closeLabel: string;
  language: LanguageContent;
};

export function MobileNav({
  locale,
  nav,
  navLabel,
  openLabel,
  closeLabel,
  language,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div className="flex items-center min-[1200px]:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex size-11 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
      >
        {open ? (
          <X className="size-5" strokeWidth={1.75} aria-hidden="true" />
        ) : (
          <Menu className="size-5" strokeWidth={1.75} aria-hidden="true" />
        )}
      </button>

      <div
        id="mobile-navigation"
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-border bg-background shadow-lg"
      >
        <nav
          aria-label={navLabel}
          className="mx-auto w-full px-4 py-4 sm:px-6 lg:px-15 2xl:max-w-[120rem]"
        >
          <ul className="divide-y divide-border border-y border-border">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={localizeHref(locale, item.href)}
                  transitionTypes={["forward"]}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center justify-between gap-4 text-sm font-medium text-foreground focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {item.label}
                  <ArrowRight
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <LanguageLinks
              locale={locale}
              language={language}
              onSelect={() => setOpen(false)}
            />
          </div>
        </nav>
      </div>
    </div>
  );
}

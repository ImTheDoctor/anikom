"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, ChevronDown, Globe } from "lucide-react";
import type { LanguageContent } from "@/lib/home-content";
import {
  getLocalizedPathname,
  locales,
  type Locale,
} from "@/lib/i18n";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  locale: Locale;
  language: LanguageContent;
};

export function LanguageSwitcher({
  locale,
  language,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        rootRef.current &&
        event.target instanceof Node &&
        !rootRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${language.triggerLabel} (${language.names[locale]})`}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-11 items-center gap-1 rounded-md px-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
      >
        {locale.toUpperCase()}
        <ChevronDown
          className={cn(
            "size-4 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <nav
          id={panelId}
          aria-labelledby={`${panelId}-label`}
          className="absolute top-full right-0 z-50 mt-1 min-w-44 border border-border bg-popover p-1 shadow-lg"
        >
          <p
            id={`${panelId}-label`}
            className="px-3 py-2 text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase"
          >
            {language.label}
          </p>
          <ul>
            {locales.map((optionLocale) => {
              const isCurrent = optionLocale === locale;
              return (
                <li key={optionLocale}>
                  <Link
                    href={getLocalizedPathname(pathname, optionLocale)}
                    lang={optionLocale}
                    aria-current={isCurrent ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex min-h-11 items-center justify-between gap-3 rounded-sm px-3 text-sm transition-colors focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none",
                      isCurrent
                        ? "bg-accent font-medium text-primary"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    <span>{language.names[optionLocale]}</span>
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-[11px] tracking-[0.1em] text-muted-foreground">
                        {optionLocale.toUpperCase()}
                      </span>
                      {isCurrent ? (
                        <Check
                          className="size-4 text-primary"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      ) : null}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}

type LanguageLinksProps = {
  locale: Locale;
  language: LanguageContent;
  onSelect?: () => void;
};

export function LanguageLinks({
  locale,
  language,
  onSelect,
}: LanguageLinksProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={language.label} className="border-t border-border pt-4">
      <p className="flex items-center gap-2 text-[10px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
        <Globe className="size-4" strokeWidth={1.5} aria-hidden="true" />
        {language.label}
      </p>
      <ul className="mt-2 grid grid-cols-3 gap-2">
        {locales.map((optionLocale) => {
          const isCurrent = optionLocale === locale;
          return (
            <li key={optionLocale}>
              <Link
                href={getLocalizedPathname(pathname, optionLocale)}
                lang={optionLocale}
                aria-current={isCurrent ? "page" : undefined}
                onClick={onSelect}
                className={cn(
                  "flex min-h-11 items-center justify-center border px-2 text-sm transition-colors focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none",
                  isCurrent
                    ? "border-primary bg-accent font-medium text-primary"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {language.names[optionLocale]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

import { type ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { HomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";

type PageShellProps = {
  content: HomeContent;
  locale: Locale;
  children: ReactNode;
};

// Shared page frame: sticky header, main landmark, footer. Route changes swap
// instantly (owner request, Nov 13 2026: the ViewTransition crossfade was
// removed — on streaming pages it jerked content and made the footer jump).
// The dormant `transitionTypes` props on internal Links and the
// `::view-transition` keyframes in globals.css are left in place so the
// effect can be reconsidered later.
export function PageShell({ content, locale, children }: PageShellProps) {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader content={content} locale={locale} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter content={content} locale={locale} />
    </div>
  );
}

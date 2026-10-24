import { type ReactNode, ViewTransition } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { HomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";

type PageShellProps = {
  content: HomeContent;
  locale: Locale;
  children: ReactNode;
};

// Shared page frame: sticky header, main landmark, footer. The ViewTransition
// wrapper gives every route the dossier navigation transition (§7 "Motion"):
// `forward` links raise the incoming page over the outgoing one, `back` links
// lift it away to reveal the page beneath. Untyped navigations (language
// switch, browser buttons, hash jumps) swap instantly — only the typed
// forward/back flows animate. Browsers without the View Transitions API swap
// pages instantly too.
export function PageShell({ content, locale, children }: PageShellProps) {
  return (
    <ViewTransition
      enter={{ forward: "page-forward", back: "page-back", default: "page-none" }}
      exit={{ forward: "page-forward", back: "page-back", default: "page-none" }}
      update={{ default: "page-none" }}
    >
      <div className="flex flex-1 flex-col">
        <SiteHeader content={content} locale={locale} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter content={content} locale={locale} />
      </div>
    </ViewTransition>
  );
}

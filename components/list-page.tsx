import type { ReactNode } from "react";
import { PageShell } from "@/components/page-shell";
import { PreparationNote } from "@/components/preparation-note";
import type { HomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";

type ListPageProps = {
  content: HomeContent;
  locale: Locale;
  eyebrow: string;
  title: string;
  description?: string;
  showPreparationNote?: boolean;
  children: ReactNode;
};

// Shared frame for section list pages (cases, team, news). The items grid is
// passed as children; the note marks a page as not fully published yet and is
// skipped only where the content is approved (team, owner decision Oct 2026).
export function ListPage({
  content,
  locale,
  eyebrow,
  title,
  description,
  showPreparationNote = true,
  children,
}: ListPageProps) {
  return (
    <PageShell content={content} locale={locale}>
      <section
        aria-labelledby="section-heading"
        className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-15 2xl:max-w-[120rem]"
      >
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
            {eyebrow}
          </p>
          <h1
            id="section-heading"
            className="mt-3 font-display text-3xl leading-tight sm:text-4xl"
          >
            {title}
          </h1>
          {description ? (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
        {showPreparationNote ? (
          <div className="mt-6">
            <PreparationNote>{content.common.pageInProgress}</PreparationNote>
          </div>
        ) : null}
        {children}
      </section>
    </PageShell>
  );
}

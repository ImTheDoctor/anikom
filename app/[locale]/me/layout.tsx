import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CabinetFrame } from "@/components/cabinet/cabinet-frame";
import { PageShell } from "@/components/page-shell";
import { getHomeContent } from "@/lib/home-content";
import { isLocale, type Locale } from "@/lib/i18n";

// Streaming skeleton for the whole cabinet area: same two-column frame as the
// resolved shell (nav column + content panel), so the session read resolving
// fills content into a stable layout instead of an empty box. aria-hidden —
// decorative placeholder, real content replaces it in place.
function CabinetSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="mx-auto w-full px-4 py-16 sm:px-6 sm:py-24 lg:px-15 2xl:max-w-[120rem]"
    >
      <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <div className="grid content-start gap-1">
          <div className="h-11 rounded-sm bg-muted" />
          <div className="h-11 rounded-sm bg-muted" />
          <div className="h-11 rounded-sm bg-muted" />
          <div className="h-11 rounded-sm bg-muted" />
        </div>
        <div className="min-h-96 border border-border bg-card" />
      </div>
    </section>
  );
}

// Cabinet layout /[locale]/me/*: one session read guards every child page
// (inside the single Suspense boundary — cacheComponents requires a boundary
// for prerendering) and renders the shared shell with the role-aware
// navigation. Signed-out visitors redirect to the localized /login. The
// skeleton fallback keeps the frame stable while the session resolves.
export default async function MeLayout({
  children,
  params,
}: LayoutProps<"/[locale]/me">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const localeSafe: Locale = locale;
  const content = getHomeContent(localeSafe);

  return (
    <PageShell content={content} locale={localeSafe}>
      <Suspense fallback={<CabinetSkeleton />}>
        <CabinetFrame locale={localeSafe} content={content}>
          {children}
        </CabinetFrame>
      </Suspense>
    </PageShell>
  );
}

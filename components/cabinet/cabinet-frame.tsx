import { redirect } from "next/navigation";
import {
  CabinetNav,
  type CabinetNavItem,
} from "@/components/cabinet/cabinet-nav";
import { LogoutButton } from "@/components/cabinet/logout-button";
import { UnavailablePanel } from "@/components/cabinet/placeholder-panel";
import { getSessionState, isExpert } from "@/lib/cabinet-api";
import type { HomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";

// Async cabinet shell inside the layout's single Suspense boundary: resolves
// the session once (React cache() dedupes this with the header CTA and the
// page content on the same request), redirects signed-out visitors to the
// localized /login, and renders the role-aware navigation around the page.

type CabinetFrameProps = {
  locale: Locale;
  content: HomeContent;
  children: React.ReactNode;
};

export async function CabinetFrame({
  locale,
  content,
  children,
}: CabinetFrameProps) {
  const session = await getSessionState();
  if (session.kind === "guest") redirect(`/${locale}/login`);
  if (session.kind === "unavailable") {
    // A backend outage must not read as "signed out" — keep the page shell
    // and say so, instead of bouncing a signed-in user to /login.
    return (
      <section className="mx-auto w-full px-4 py-16 sm:px-6 sm:py-24 lg:px-15 2xl:max-w-[120rem]">
        <UnavailablePanel copy={content.cabinetPage.unavailable} />
      </section>
    );
  }
  const user = session.user;

  const copy = content.cabinetPage;
  const items: CabinetNavItem[] = [
    { href: `/${locale}/me`, label: copy.nav.overview },
    { href: `/${locale}/me/profile`, label: copy.nav.profile },
    { href: `/${locale}/me/documents`, label: copy.nav.documents },
    { href: `/${locale}/me/settings`, label: copy.nav.settings },
  ];
  // Expert-only items never reach a CLIENT's DOM.
  const expertItems: CabinetNavItem[] = isExpert(user)
    ? [
        { href: `/${locale}/me/clients`, label: copy.nav.clients },
        { href: `/${locale}/me/requests`, label: copy.nav.requests },
      ]
    : [];

  return (
    <section className="mx-auto w-full px-4 py-16 sm:px-6 sm:py-24 lg:px-15 2xl:max-w-[120rem]">
      <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <div className="grid content-start gap-6">
          <CabinetNav
            ariaLabel={copy.nav.label}
            items={items}
            expertItems={expertItems}
            expertLabel={copy.nav.expertLabel}
          />
          <LogoutButton
            label={content.authPage.account.logoutLabel}
            locale={locale}
          />
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

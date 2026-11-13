import { notFound, redirect } from "next/navigation";
import { ComingSoonPanel, UnavailablePanel } from "@/components/cabinet/placeholder-panel";
import { getSessionState } from "@/lib/cabinet-api";
import { getHomeContent } from "@/lib/home-content";
import { isLocale, siteUrl, type Locale } from "@/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/me/settings">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { cabinetPage } = getHomeContent(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: `${cabinetPage.nav.settings} — Anicom`,
    description: cabinetPage.meta.description,
    alternates: {
      canonical: `/${locale}/me/settings`,
      languages: {
        hy: "/hy/me/settings",
        en: "/en/me/settings",
        ru: "/ru/me/settings",
        "x-default": "/hy/me/settings",
      },
    },
  };
}

// Settings page /[locale]/me/settings: the session facts (email, role) plus a
// visible placeholder for the settings still in development. Sign-out lives
// in the cabinet sidebar. The layout guards the session; the page re-checks
// it via the request-deduped session read.
export default async function SettingsPage({
  params,
}: PageProps<"/[locale]/me/settings">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const localeSafe: Locale = locale;
  const content = getHomeContent(localeSafe);

  return <SettingsContent locale={localeSafe} content={content} />;
}

async function SettingsContent({
  locale,
  content,
}: {
  locale: Locale;
  content: ReturnType<typeof getHomeContent>;
}) {
  const session = await getSessionState();
  if (session.kind === "guest") redirect(`/${locale}/login`);
  if (session.kind === "unavailable") {
    return <UnavailablePanel copy={content.cabinetPage.unavailable} />;
  }
  const user = session.user;

  const { cabinetPage, authPage } = content;
  const account = authPage.account;
  // Role enum from the API spec; unknown values (admin roles) render raw.
  const roleLabel =
    user.role === "CLIENT"
      ? cabinetPage.roles.client
      : user.role === "EXPERT"
        ? cabinetPage.roles.expert
        : user.role;

  return (
    <div className="motion-rise grid gap-8">
      <h1 className="font-display text-3xl leading-snug sm:text-4xl">
        {cabinetPage.nav.settings}
      </h1>
      <section className="border border-border bg-card p-6 sm:p-8">
        <h2 className="font-display text-2xl leading-snug">{account.title}</h2>
        <dl className="mt-6 border-t border-border">
          <div className="flex items-baseline justify-between gap-4 border-b border-border py-3">
            <dt className="text-sm text-muted-foreground">{account.emailLabel}</dt>
            <dd className="text-sm font-medium break-all">{user.email || "—"}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-b border-border py-3">
            <dt className="text-sm text-muted-foreground">{account.roleLabel}</dt>
            <dd className="text-sm font-medium">{roleLabel}</dd>
          </div>
        </dl>
      </section>
      <ComingSoonPanel copy={cabinetPage.comingSoon} />
    </div>
  );
}

import { notFound, redirect } from "next/navigation";
import { AvatarEditor } from "@/components/cabinet/avatar-editor";
import { UnavailablePanel } from "@/components/cabinet/placeholder-panel";
import { ProfileForm } from "@/components/auth/profile-form";
import { getSessionState } from "@/lib/cabinet-api";
import { getHomeContent } from "@/lib/home-content";
import { isLocale, siteUrl, type Locale } from "@/lib/i18n";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/me/profile">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { cabinetPage } = getHomeContent(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: `${cabinetPage.nav.profile} — Anicom`,
    description: cabinetPage.meta.description,
    alternates: {
      canonical: `/${locale}/me/profile`,
      languages: {
        hy: "/hy/me/profile",
        en: "/en/me/profile",
        ru: "/ru/me/profile",
        "x-default": "/hy/me/profile",
      },
    },
  };
}

// Profile page /[locale]/me/profile: avatar upload + the read-only email row
// and the name/birth-date editor (PATCH /v1/auth/me). The layout guards the
// session; the page re-checks it via the request-deduped session read.
export default async function ProfilePage({
  params,
}: PageProps<"/[locale]/me/profile">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const localeSafe: Locale = locale;
  const content = getHomeContent(localeSafe);

  return <ProfileContent locale={localeSafe} content={content} />;
}

async function ProfileContent({
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

  return (
    <div className="motion-rise grid gap-8">
      <h1 className="font-display text-3xl leading-snug sm:text-4xl">
        {cabinetPage.nav.profile}
      </h1>

      <section className="border border-border bg-card p-6 sm:p-8">
        <h2 className="font-display text-2xl leading-snug">
          {cabinetPage.avatar.label}
        </h2>
        <div className="mt-6">
          <AvatarEditor copy={cabinetPage.avatar} />
        </div>
      </section>

      <section className="border border-border bg-card p-6 sm:p-8">
        <h2 className="font-display text-2xl leading-snug">
          {account.profileHeading}
        </h2>
        <dl className="mt-6 border-t border-border">
          <div className="flex items-baseline justify-between gap-4 border-b border-border py-3">
            <dt className="text-sm text-muted-foreground">{account.emailLabel}</dt>
            <dd className="text-sm font-medium break-all">{user.email || "—"}</dd>
          </div>
        </dl>
        <ProfileForm
          profile={{
            firstName: user.firstName,
            lastName: user.lastName,
            // Date inputs need YYYY-MM-DD regardless of the API's ISO shape.
            birthDate: user.birthDate ? user.birthDate.slice(0, 10) : null,
          }}
          copy={account}
        />
      </section>
    </div>
  );
}

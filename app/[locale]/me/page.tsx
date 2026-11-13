import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { FileText, Settings, UserRound } from "lucide-react";
import { AvatarDisplay } from "@/components/cabinet/avatar-editor";
import { UnavailablePanel } from "@/components/cabinet/placeholder-panel";
import { buttonVariants } from "@/components/ui/button";
import { getSessionState } from "@/lib/cabinet-api";
import { getHomeContent } from "@/lib/home-content";
import { isLocale, siteUrl, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/me">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { account } = getHomeContent(locale).authPage;

  return {
    metadataBase: new URL(siteUrl),
    title: `${account.metaTitle} — Anicom`,
    description: account.metaDescription,
    alternates: {
      canonical: `/${locale}/me`,
      languages: {
        hy: "/hy/me",
        en: "/en/me",
        ru: "/ru/me",
        "x-default": "/hy/me",
      },
    },
  };
}

// Cabinet overview /[locale]/me. The layout guards the session and renders
// the route fully dynamic in one pass — no streaming placeholder.
export default async function MePage({ params }: PageProps<"/[locale]/me">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const localeSafe: Locale = locale;
  const content = getHomeContent(localeSafe);

  return <OverviewContent locale={localeSafe} content={content} />;
}

async function OverviewContent({
  locale,
  content,
}: {
  locale: Locale;
  content: ReturnType<typeof getHomeContent>;
}) {
  const session = await getSessionState();
  if (session.kind === "guest") redirect(`/${locale}/login`);
  if (session.kind === "unavailable") {
    // Matches the cabinet shell: an outage must not bounce a signed-in user
    // to /login.
    return <UnavailablePanel copy={content.cabinetPage.unavailable} />;
  }
  const user = session.user;

  const { cabinetPage, authPage } = content;
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  // Role enum from the API spec; unknown values (admin roles) render raw.
  const roleLabel =
    user.role === "CLIENT"
      ? cabinetPage.roles.client
      : user.role === "EXPERT"
        ? cabinetPage.roles.expert
        : user.role;

  const quickLinks = [
    { href: `/${locale}/me/documents`, label: cabinetPage.nav.documents, icon: FileText },
    { href: `/${locale}/me/profile`, label: cabinetPage.nav.profile, icon: UserRound },
    { href: `/${locale}/me/settings`, label: cabinetPage.nav.settings, icon: Settings },
  ];

  return (
    <div className="motion-rise grid gap-8">
      <h1 className="font-display text-3xl leading-snug sm:text-4xl">
        {cabinetPage.overview.title}
      </h1>
      <div className="border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center gap-5">
          <AvatarDisplay />
          <div className="min-w-0">
            <p className="font-display text-2xl leading-snug break-words">
              {name || "—"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{roleLabel}</p>
          </div>
        </div>

        <dl className="mt-6 border-t border-border">
          <div className="flex items-baseline justify-between gap-4 border-b border-border py-3">
            <dt className="text-sm text-muted-foreground">
              {authPage.account.emailLabel}
            </dt>
            <dd className="text-sm font-medium break-all">{user.email || "—"}</dd>
          </div>
        </dl>

        <nav
          aria-label={cabinetPage.nav.label}
          className="mt-6 grid gap-3 sm:grid-cols-2"
        >
          {quickLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              transitionTypes={["forward"]}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "min-h-11 justify-start gap-3 px-4",
              )}
            >
              <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

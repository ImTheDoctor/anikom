import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { PageShell } from "@/components/page-shell";
import { getHomeContent } from "@/lib/home-content";
import { isLocale, siteUrl, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/login">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { authPage } = getHomeContent(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: `${authPage.login.metaTitle} — Anicom`,
    description: authPage.login.metaDescription,
    alternates: {
      canonical: `/${locale}/login`,
      languages: {
        hy: "/hy/login",
        en: "/en/login",
        ru: "/ru/login",
        "x-default": "/hy/login",
      },
    },
  };
}

// Placeholder sign-in page (owner request, Oct 2026). The MVP has no auth
// backend: the form is preview UI, and a submit shows the localized
// "not available yet" note. Links across to /register.
export default async function LoginPage({
  params,
}: PageProps<"/[locale]/login">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const localeSafe: Locale = locale;
  const content = getHomeContent(localeSafe);
  const { login } = content.authPage;

  return (
    <PageShell content={content} locale={localeSafe}>
      {/* Hero removed by owner request (Oct 26) — the auth pages keep the
          plain centered card. */}
      <section className="mx-auto w-full px-4 py-16 sm:px-6 sm:py-24 lg:px-15">
        <div className="motion-rise mx-auto w-full max-w-md border border-border bg-card p-6 sm:p-8">
          <h1 className="font-display text-2xl leading-snug sm:text-3xl">
            {login.title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {login.description}
          </p>
          <AuthForm copy={login} />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {login.switchText}{" "}
            <Link
              href={`/${localeSafe}/register`}
              transitionTypes={["forward"]}
              className="rounded-sm font-medium text-primary underline-offset-4 transition-colors hover:underline focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
            >
              {login.switchCta}
            </Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}

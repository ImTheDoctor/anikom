import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactCta } from "@/components/home/contact-cta";
import { PageShell } from "@/components/page-shell";
import { getHomeContent } from "@/lib/home-content";
import { isLocale, siteUrl, type Locale } from "@/lib/i18n";

// Same icon order as the footer contact column (phone, email, office, hours)
// — the strip renders footer.contacts, keeping the approved details the
// single source of truth.
const contactIcons = [Phone, Mail, MapPin, Clock];

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { contactPage } = getHomeContent(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: `${contactPage.metaTitle} — Anicom`,
    description: contactPage.metaDescription,
    alternates: {
      canonical: `/${locale}/contact`,
      languages: {
        hy: "/hy/contact",
        en: "/en/contact",
        ru: "/ru/contact",
        "x-default": "/hy/contact",
      },
    },
  };
}

// Contact page (owner reference, Oct 2026): dark hero band with breadcrumb,
// a hairline contact-details strip, an inquiry form (mailto-composed — no
// backend in the MVP) beside a map card, and the shared contact banner.
// Every fact on the page comes from footer.contacts; no new contact details
// are introduced.
export default async function ContactPage({
  params,
}: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const localeSafe: Locale = locale;
  const content = getHomeContent(localeSafe);
  const { contactPage, footer, services, experts } = content;
  const emailEntry = footer.contacts.find((entry) =>
    entry.href?.startsWith("mailto:"),
  );
  const email = emailEntry?.href?.replace("mailto:", "") ?? "";

  return (
    <PageShell content={content} locale={localeSafe}>
      {/* Hero band with the office photo as a faint texture (ContactCta
          treatment), matching the /team catalog hero. */}
      <section className="relative isolate overflow-hidden bg-hero text-hero-foreground">
        <Image
          src="/hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[70%_0%] opacity-15"
        />
        <div className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-15 2xl:max-w-[120rem]">
          <nav aria-label={experts.breadcrumbLabel}>
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-hero-muted">
              <li>
                <Link
                  href={`/${localeSafe}`}
                  transitionTypes={["back"]}
                  className="rounded-sm transition-colors hover:text-hero-foreground focus-visible:ring-3 focus-visible:ring-hero-accent focus-visible:outline-none"
                >
                  {experts.breadcrumbHome}
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="text-hero-foreground">
                {contactPage.title}
              </li>
            </ol>
          </nav>

          <h1 className="motion-rise mt-5 font-display text-3xl leading-tight sm:text-4xl lg:text-5xl">
            {contactPage.title}
          </h1>
          <p className="motion-rise mt-4 max-w-2xl text-base leading-relaxed text-hero-muted sm:text-lg [--motion-delay:80ms]">
            {contactPage.description}
          </p>
        </div>
      </section>

      {/* Contact details: one hairline grid, not floating cards. */}
      <section className="mx-auto w-full px-4 py-12 sm:px-6 sm:py-16 lg:px-15 2xl:max-w-[120rem]">
        <h2 className="sr-only">{contactPage.infoTitle}</h2>
        <ul className="motion-rise grid grid-cols-1 gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4 [--motion-delay:160ms]">
          {footer.contacts.map((entry, index) => {
            const Icon = contactIcons[index] ?? MapPin;
            return (
              <li key={entry.label} className="bg-background p-5 sm:p-6">
                <Icon
                  className="size-4 text-primary"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <p className="mt-3 text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                  {entry.label}
                </p>
                {entry.href ? (
                  <a
                    href={entry.href}
                    className="mt-1.5 inline-block text-sm leading-snug font-medium underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    {entry.value}
                  </a>
                ) : (
                  <p className="mt-1.5 text-sm leading-snug font-medium">
                    {entry.value}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Inquiry form beside the office map. */}
      <section className="mx-auto w-full px-4 pb-12 sm:px-6 sm:pb-16 lg:px-15 2xl:max-w-[120rem]">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-10">
          <div className="border border-border bg-card p-6 sm:p-8">
            <h2 className="font-display text-2xl leading-snug sm:text-3xl">
              {contactPage.formTitle}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
              {contactPage.formNote}
            </p>
            <ContactForm
              copy={contactPage.form}
              email={email}
              services={services.items.map(({ slug, title }) => ({
                slug,
                title,
              }))}
            />
          </div>
          <div className="min-w-0 border border-border bg-card">
            <iframe
              title={contactPage.mapTitle}
              src="https://maps.google.com/maps?q=Abovyan%2020%2F12%2C%20Yerevan%2C%20Armenia&z=16&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-80 w-full lg:h-full lg:min-h-[36rem]"
            />
          </div>
        </div>
      </section>

      <ContactCta content={content} locale={localeSafe} />
    </PageShell>
  );
}

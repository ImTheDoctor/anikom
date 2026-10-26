import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactCta } from "@/components/home/contact-cta";
import { PageHero } from "@/components/page-hero";
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
      {/* Hero band over the meeting-room photo (same treatment as the other
          hero bands). */}
      <PageHero
        breadcrumbLabel={experts.breadcrumbLabel}
        crumbs={[
          { label: experts.breadcrumbHome, href: `/${localeSafe}` },
          { label: contactPage.title },
        ]}
        title={contactPage.title}
        description={contactPage.description}
        image="/images/heroes/contact.jpg"
      />

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

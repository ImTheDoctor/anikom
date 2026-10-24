import Link from "next/link";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import type { HomeContent } from "@/lib/home-content";
import { localizeHref, type Locale } from "@/lib/i18n";

const contactIcons = [MapPin, Phone, Mail, Clock];

const socialPlaceholders = [
  {
    name: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.988h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.891h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10Z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="size-4"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.119 20.452H3.555V9h3.564v11.452Z" />
      </svg>
    ),
  },
];

type SiteFooterProps = {
  content: HomeContent;
  locale: Locale;
};

// Deep burgundy band (--brand-deep, owner-set #501C3F) using the
// theme-independent hero text tokens; the black-line crest sits on a light
// plaque (never directly on a dark surface). Focus rings use --hero-accent
// (brand is below 3:1 UI on this surface).
export function SiteFooter({ content, locale }: SiteFooterProps) {
  const { common, footer, navigation, services } = content;

  return (
    <footer className="border-t border-hero-border bg-brand-deep text-hero-foreground">
      <div className="mx-auto w-full px-4 pt-8 pb-6 sm:px-6 lg:px-15 2xl:max-w-[120rem]">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] lg:gap-10">
          <div className="max-w-xs">
            <Link
              href={`/${locale}`}
              aria-label={footer.homeLabel}
              className="inline-flex min-h-11 items-center gap-2.5 rounded-sm focus-visible:ring-3 focus-visible:ring-hero-accent focus-visible:outline-none"
            >
              <span className="inline-flex items-center bg-background p-1.5">
                <BrandMark className="h-10" />
              </span>
              <span className="text-base leading-none font-semibold tracking-[0.2em]">
                {common.brandName}
              </span>
            </Link>
            <p className="mt-4 text-xs leading-relaxed text-hero-muted">
              {footer.description}
            </p>
            <p className="mt-3 text-[11px] font-medium tracking-[0.14em] text-hero-muted uppercase">
              {footer.descriptor}
            </p>
            <div className="mt-4 flex items-center gap-2">
              {socialPlaceholders.map(({ name, icon }) => (
                <span
                  key={name}
                  title={name}
                  aria-hidden="true"
                  className="inline-flex size-9 items-center justify-center border border-hero-border text-hero-muted"
                >
                  {icon}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-hero-muted">
              {footer.socialPending}
            </p>
          </div>

          <nav aria-labelledby="footer-explore">
            <h2
              id="footer-explore"
              className="text-[11px] font-medium tracking-[0.14em] text-hero-foreground uppercase"
            >
              {footer.exploreTitle}
            </h2>
            <ul className="mt-2">
              {navigation.sections.map((item) => (
                <li key={item.href}>
                  <Link
                    href={localizeHref(locale, item.href)}
                    transitionTypes={["forward"]}
                    className="flex min-h-11 items-center text-xs text-hero-muted transition-colors hover:text-hero-foreground focus-visible:ring-3 focus-visible:ring-hero-accent focus-visible:outline-none lg:min-h-6"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-services">
            <h2
              id="footer-services"
              className="text-[11px] font-medium tracking-[0.14em] text-hero-foreground uppercase"
            >
              {footer.servicesTitle}
            </h2>
            <ul className="mt-2">
              {services.items.map((service) => (
                <li key={service.title}>
                  <Link
                    href={localizeHref(locale, "/services")}
                    transitionTypes={["forward"]}
                    className="flex min-h-11 items-center text-xs text-hero-muted transition-colors hover:text-hero-foreground focus-visible:ring-3 focus-visible:ring-hero-accent focus-visible:outline-none lg:min-h-6"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={localizeHref(locale, "/services")}
              transitionTypes={["forward"]}
              className="group mt-1 inline-flex min-h-11 items-center gap-1 text-xs font-medium text-hero-accent underline-offset-4 transition-colors hover:text-hero-foreground hover:underline focus-visible:ring-3 focus-visible:ring-hero-accent focus-visible:outline-none lg:min-h-6"
            >
              {footer.allServicesLabel}
              <ArrowRight
                className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </nav>

          <div aria-labelledby="footer-contact">
            <h2
              id="footer-contact"
              className="text-[11px] font-medium tracking-[0.14em] text-hero-foreground uppercase"
            >
              {footer.contactTitle}
            </h2>
            <ul className="mt-3 space-y-2.5">
              {footer.contacts.map(({ label, value, href }, index) => {
                const Icon = contactIcons[index] ?? MapPin;
                return (
                  <li
                    key={label}
                    className="flex items-start gap-2 text-xs leading-relaxed"
                  >
                    <Icon
                      className="mt-0.5 size-3.5 shrink-0 text-hero-muted"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <span>
                      <span className="sr-only">{label}: </span>
                      {href ? (
                        <a
                          href={href}
                          className="text-hero-foreground underline-offset-4 transition-colors hover:text-hero-accent hover:underline focus-visible:ring-3 focus-visible:ring-hero-accent focus-visible:outline-none"
                        >
                          {value}
                        </a>
                      ) : (
                        <span className="text-hero-muted">{value}</span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-hero-border pt-4 text-[11px] leading-relaxed text-hero-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.copyright}</p>
          <p>{footer.previewNote}</p>
        </div>
      </div>
    </footer>
  );
}

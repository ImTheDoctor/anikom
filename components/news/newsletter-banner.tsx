"use client";

// Client boundary: the subscribe field is controlled and composes a mailto:
// to the office address on submit (contact-form precedent — no backend in the
// MVP). The office email is extracted server-side from footer.contacts, the
// single source of truth for contact details.

import { useState, type FormEvent } from "react";
import { AlertTriangle, Mail } from "lucide-react";
import type { HomeContent } from "@/lib/home-content";

type NewsletterBannerProps = {
  ui: HomeContent["news"]["newsletter"];
  officeEmail: string;
};

export function NewsletterBanner({ ui, officeEmail }: NewsletterBannerProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(true);
      return;
    }
    setError(false);
    const subject = ui.mailtoSubject;
    const body = `${ui.emailLabel}: ${email.trim()}`;
    window.location.href = `mailto:${officeEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section aria-labelledby="news-newsletter-heading" className="mx-auto w-full px-4 pb-14 sm:px-6 sm:pb-20 lg:px-15 2xl:max-w-[120rem]">
      <div className="rounded-2xl bg-brand-deep text-hero-foreground">
        <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-10">
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="flex size-12 shrink-0 items-center justify-center rounded-full border border-hero-border"
            >
              <Mail className="size-5 text-hero-accent" strokeWidth={1.5} />
            </span>
            <div className="max-w-md">
              <h2
                id="news-newsletter-heading"
                className="font-display text-2xl leading-snug sm:text-3xl"
              >
                {ui.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-hero-muted sm:text-base">
                {ui.description}
              </p>
            </div>
          </div>
          <div className="lg:shrink-0">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-3 sm:flex-row sm:items-start"
            >
              <div>
                <label htmlFor="news-newsletter-email" className="sr-only">
                  {ui.emailLabel}
                </label>
                <input
                  id="news-newsletter-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError(false);
                  }}
                  placeholder={ui.emailPlaceholder}
                  aria-invalid={error}
                  className="h-11 w-full border border-transparent bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-hero-accent focus-visible:ring-3 focus-visible:ring-hero-accent focus-visible:outline-none sm:w-64"
                />
              </div>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center justify-center bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:ring-3 focus-visible:ring-hero-accent focus-visible:outline-none"
              >
                {ui.submitLabel}
              </button>
            </form>
            {error ? (
              <p role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-hero-foreground">
                <AlertTriangle
                  className="size-4 shrink-0 text-hero-accent"
                  aria-hidden="true"
                  strokeWidth={1.5}
                />
                {ui.errorLabel}
              </p>
            ) : (
              <p className="mt-2 text-xs leading-relaxed text-hero-muted">
                {ui.note}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

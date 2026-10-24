"use client";

// Client Component: controlled fields, inline validation and the mailto:
// composition need browser APIs and event handlers. There is no form backend
// in the MVP — a valid submit opens the visitor's email application with the
// inquiry pre-filled, so every submission reaches the real office inbox.

import { useId, useRef, useState, type FormEvent } from "react";
import { ChevronDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { HomeContent } from "@/lib/home-content";
import { cn } from "@/lib/utils";

type ContactFormProps = {
  copy: HomeContent["contactPage"]["form"];
  email: string;
  services: { slug: string; title: string }[];
};

type Errors = Partial<Record<"name" | "phone" | "message", string>>;

const fieldClass =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring aria-invalid:border-destructive";

export function ContactForm({ copy, email, services }: ContactFormProps) {
  const nameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const serviceId = useId();
  const messageId = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const [values, setValues] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  function setField(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field as keyof Errors]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next: Errors = {};
    if (!values.name.trim()) next.name = copy.errors.name;
    if (!values.phone.trim()) next.phone = copy.errors.phone;
    if (!values.message.trim()) next.message = copy.errors.message;
    setErrors(next);

    const firstInvalid = [
      ["name", nameRef.current] as const,
      ["phone", phoneRef.current] as const,
      ["message", messageRef.current] as const,
    ].find(([field]) => next[field]);
    if (firstInvalid) {
      firstInvalid[1]?.focus();
      return;
    }

    const serviceTitle = services.find(
      (service) => service.slug === values.service,
    )?.title;
    const subject = `${copy.mailtoSubject}${serviceTitle ? ` — ${serviceTitle}` : ""}`;
    const body = [
      `${copy.nameLabel}: ${values.name.trim()}`,
      `${copy.phoneLabel}: ${values.phone.trim()}`,
      values.email.trim() ? `${copy.emailLabel}: ${values.email.trim()}` : null,
      "",
      values.message.trim(),
    ]
      .filter((line): line is string => line !== null)
      .join("\r\n");

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-5">
      <div className="grid gap-5">
        <div>
          <label htmlFor={nameId} className="text-sm font-medium">
            {copy.nameLabel} *
          </label>
          <input
            ref={nameRef}
            id={nameId}
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(event) => setField("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
            className={cn(fieldClass, "mt-2")}
          />
          {errors.name ? (
            <p
              id={`${nameId}-error`}
              role="alert"
              className="mt-1.5 text-xs text-destructive"
            >
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={phoneId} className="text-sm font-medium">
              {copy.phoneLabel} *
            </label>
            <input
              ref={phoneRef}
              id={phoneId}
              type="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={(event) => setField("phone", event.target.value)}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? `${phoneId}-error` : undefined}
              className={cn(fieldClass, "mt-2")}
            />
            {errors.phone ? (
              <p
                id={`${phoneId}-error`}
                role="alert"
                className="mt-1.5 text-xs text-destructive"
              >
                {errors.phone}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor={emailId} className="text-sm font-medium">
              {copy.emailLabel}
            </label>
            <input
              id={emailId}
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => setField("email", event.target.value)}
              className={cn(fieldClass, "mt-2")}
            />
          </div>
        </div>

        <div>
          <label htmlFor={serviceId} className="text-sm font-medium">
            {copy.serviceLabel}
          </label>
          <div className="relative mt-2">
            <select
              id={serviceId}
              value={values.service}
              onChange={(event) => setField("service", event.target.value)}
              className={cn(fieldClass, "appearance-none pr-9")}
            >
              <option value="">{copy.serviceAny}</option>
              {services.map((service) => (
                <option key={service.slug} value={service.slug}>
                  {service.title}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        </div>

        <div>
          <label htmlFor={messageId} className="text-sm font-medium">
            {copy.messageLabel} *
          </label>
          <textarea
            ref={messageRef}
            id={messageId}
            rows={5}
            value={values.message}
            onChange={(event) => setField("message", event.target.value)}
            placeholder={copy.messagePlaceholder}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? `${messageId}-error` : undefined}
            className={cn(
              fieldClass,
              "h-auto min-h-28 resize-y py-2.5 leading-relaxed",
            )}
          />
          {errors.message ? (
            <p
              id={`${messageId}-error`}
              role="alert"
              className="mt-1.5 text-xs text-destructive"
            >
              {errors.message}
            </p>
          ) : null}
        </div>
      </div>

      <button
        type="submit"
        className={cn(
          buttonVariants({ size: "lg" }),
          "min-h-11 w-full justify-center px-5 sm:w-auto",
        )}
      >
        {copy.submitLabel}
      </button>
    </form>
  );
}

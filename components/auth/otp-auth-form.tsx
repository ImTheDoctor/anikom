"use client";

// Client Component: the OTP flow needs submit interception, step state and
// fetch. Two steps — email (request a code) and the six-digit code (verify) —
// over the same-origin proxy /api/auth/*; a successful verify sets the
// first-party web_session cookie and lands on /[locale]/me. The register
// variant collects the profile fields the API's verify call accepts
// (firstName / lastName / birthDate) so a new account is created with them.

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { AuthPageContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const fieldClass =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring";

// The API's two user-facing failures get their own copy; everything else
// (validation, network, outages) gets the generic note.
function errorCopy(status: number, copy: AuthPageContent): string {
  if (status === 429) return copy.errors.tooManyRequests;
  return copy.errors.generic;
}

export function OtpAuthForm({
  copy,
  locale,
  variant = "login",
}: {
  copy: AuthPageContent;
  locale: Locale;
  variant?: "login" | "register";
}) {
  const router = useRouter();
  const emailId = useId();
  const codeId = useId();
  const firstNameId = useId();
  const lastNameId = useId();
  const birthDateId = useId();
  const isRegister = variant === "register";
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function requestOtp() {
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setStep("code");
      else setError(errorCopy(res.status, copy));
    } catch {
      setError(copy.errors.generic);
    } finally {
      setPending(false);
    }
  }

  function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void requestOtp();
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      // Profile fields ride along only when collected — the API rejects
      // empty strings (minLength 1), and a sign-in must not send them.
      const profile: Record<string, string> = {};
      if (firstName.trim()) profile.firstName = firstName.trim();
      if (lastName.trim()) profile.lastName = lastName.trim();
      if (birthDate) profile.birthDate = birthDate;
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, code, ...profile }),
      });
      if (res.ok) {
        router.replace(`/${locale}/me`);
        return;
      }
      // The API's only user-facing 400 is an invalid/expired code; a 429 is
      // the per-email resend throttle.
      let invalidCode = false;
      if (res.status === 400 || res.status === 401) {
        const data = (await res.json().catch(() => null)) as {
          message?: unknown;
        } | null;
        invalidCode =
          typeof data?.message === "string" &&
          /invalid or expired/i.test(data.message);
      }
      setError(
        invalidCode ? copy.errors.invalidCode : errorCopy(res.status, copy),
      );
    } catch {
      setError(copy.errors.generic);
    } finally {
      setPending(false);
    }
  }

  return (
    <div aria-busy={pending}>
      {step === "email" ? (
        <form
          key="email"
          onSubmit={handleEmailSubmit}
          className="mt-6 grid gap-5 motion-rise"
        >
          <div>
            <label htmlFor={emailId} className="text-sm font-medium">
              {copy.emailLabel} <span aria-hidden="true">*</span>
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={copy.emailPlaceholder}
              autoComplete="email"
              className={cn(fieldClass, "mt-2")}
            />
          </div>

          {isRegister ? (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor={firstNameId} className="text-sm font-medium">
                    {copy.firstNameLabel} <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id={firstNameId}
                    name="firstName"
                    type="text"
                    required
                    maxLength={50}
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    autoComplete="given-name"
                    className={cn(fieldClass, "mt-2")}
                  />
                </div>
                <div>
                  <label htmlFor={lastNameId} className="text-sm font-medium">
                    {copy.lastNameLabel} <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id={lastNameId}
                    name="lastName"
                    type="text"
                    required
                    maxLength={50}
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    autoComplete="family-name"
                    className={cn(fieldClass, "mt-2")}
                  />
                </div>
              </div>
              <div>
                <label htmlFor={birthDateId} className="text-sm font-medium">
                  {copy.birthDateLabel}
                </label>
                <input
                  id={birthDateId}
                  name="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(event) => setBirthDate(event.target.value)}
                  autoComplete="bday"
                  className={cn(fieldClass, "mt-2")}
                />
              </div>
            </>
          ) : null}

          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className={cn(
              buttonVariants({ size: "lg" }),
              "min-h-11 w-full justify-center px-5",
            )}
          >
            {pending ? (
              <Loader2
                className="size-4 animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
            ) : (
              copy.submitLabel
            )}
          </button>
        </form>
      ) : (
        <div key="code" className="mt-6 motion-rise">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {copy.codeHint.replace("{email}", email)}
          </p>
          <form onSubmit={verifyCode} className="mt-5 grid gap-5">
            <div>
              <label htmlFor={codeId} className="text-sm font-medium">
                {copy.codeLabel} <span aria-hidden="true">*</span>
              </label>
              <input
                id={codeId}
                name="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d{6}"
                minLength={6}
                maxLength={6}
                required
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className={cn(
                  fieldClass,
                  "mt-2 text-center font-mono text-lg tracking-[0.4em]",
                )}
              />
            </div>

            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className={cn(
                buttonVariants({ size: "lg" }),
                "min-h-11 w-full justify-center px-5",
              )}
            >
              {pending ? (
                <Loader2
                  className="size-4 animate-spin motion-reduce:animate-none"
                  aria-hidden="true"
                />
              ) : (
                copy.codeSubmitLabel
              )}
            </button>
          </form>
          <div className="mt-4 flex flex-wrap justify-between gap-x-4 gap-y-2">
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setError(null);
              }}
              className="rounded-sm text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none"
            >
              {copy.changeEmailLabel}
            </button>
            <button
              type="button"
              onClick={() => void requestOtp()}
              disabled={pending}
              className="rounded-sm text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none disabled:opacity-50"
            >
              {copy.resendLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

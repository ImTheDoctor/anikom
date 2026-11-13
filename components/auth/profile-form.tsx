"use client";

// Client Component: the profile editor needs submit interception and fetch.
// PATCHes /api/auth/me (same-origin proxy → PATCH /v1/auth/me) and refreshes
// the server-rendered account card on success.

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { AccountPageContent } from "@/lib/home-content";
import { cn } from "@/lib/utils";

const fieldClass =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring";

export function ProfileForm({
  profile,
  copy,
}: {
  profile: { firstName: string | null; lastName: string | null; birthDate: string | null };
  copy: AccountPageContent;
}) {
  const router = useRouter();
  const firstNameId = useId();
  const lastNameId = useId();
  const birthDateId = useId();
  const [firstName, setFirstName] = useState(profile.firstName ?? "");
  const [lastName, setLastName] = useState(profile.lastName ?? "");
  const [birthDate, setBirthDate] = useState(profile.birthDate ?? "");
  const [pending, setPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setSaved(false);
    setError(null);
    try {
      // The API rejects empty strings (minLength 1) — omitted keys keep the
      // stored value, so clearing a field is not possible by design.
      const payload: Record<string, string> = {};
      if (firstName.trim()) payload.firstName = firstName.trim();
      if (lastName.trim()) payload.lastName = lastName.trim();
      if (birthDate) payload.birthDate = birthDate;
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSaved(true);
        router.refresh();
      } else {
        setError(copy.saveError);
      }
    } catch {
      setError(copy.saveError);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-5" aria-busy={pending}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={firstNameId} className="text-sm font-medium">
            {copy.firstNameLabel}
          </label>
          <input
            id={firstNameId}
            name="firstName"
            type="text"
            maxLength={50}
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            autoComplete="given-name"
            className={cn(fieldClass, "mt-2")}
          />
        </div>
        <div>
          <label htmlFor={lastNameId} className="text-sm font-medium">
            {copy.lastNameLabel}
          </label>
          <input
            id={lastNameId}
            name="lastName"
            type="text"
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

      {saved ? (
        <p role="status" className="text-sm text-muted-foreground">
          {copy.savedNote}
        </p>
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
          buttonVariants(),
          "min-h-11 w-full justify-center px-5",
        )}
      >
        {pending ? (
          <Loader2
            className="size-4 animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
        ) : (
          copy.saveLabel
        )}
      </button>
    </form>
  );
}

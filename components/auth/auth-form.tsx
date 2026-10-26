"use client";

// Client Component: submit interception needs an event handler. The MVP has
// no auth backend (see AGENTS.md) — a submit attempt only shows the localized
// "not available yet" note; nothing is sent anywhere.

import { useId, useState, type FormEvent } from "react";
import { buttonVariants } from "@/components/ui/button";
import type { AuthPageContent } from "@/lib/home-content";
import { cn } from "@/lib/utils";

const fieldClass =
  "h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring";

export function AuthForm({ copy }: { copy: AuthPageContent }) {
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  // The register variant is the only one carrying `nameLabel`; its presence
  // also selects the new-password autocomplete hint.
  const isRegister = Boolean(copy.nameLabel);
  const [unavailable, setUnavailable] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUnavailable(true);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
      {copy.nameLabel ? (
        <div>
          <label htmlFor={nameId} className="text-sm font-medium">
            {copy.nameLabel}
          </label>
          <input
            id={nameId}
            type="text"
            required
            autoComplete="name"
            className={cn(fieldClass, "mt-2")}
          />
        </div>
      ) : null}

      <div>
        <label htmlFor={emailId} className="text-sm font-medium">
          {copy.emailLabel}
        </label>
        <input
          id={emailId}
          type="email"
          required
          autoComplete="email"
          className={cn(fieldClass, "mt-2")}
        />
      </div>

      <div>
        <label htmlFor={passwordId} className="text-sm font-medium">
          {copy.passwordLabel}
        </label>
        <input
          id={passwordId}
          type="password"
          required
          autoComplete={isRegister ? "new-password" : "current-password"}
          className={cn(fieldClass, "mt-2")}
        />
      </div>

      {unavailable ? (
        <p
          role="status"
          className="text-sm leading-relaxed text-muted-foreground"
        >
          {copy.unavailableNote}
        </p>
      ) : null}

      <button
        type="submit"
        className={cn(
          buttonVariants({ size: "lg" }),
          "min-h-11 w-full justify-center px-5",
        )}
      >
        {copy.submitLabel}
      </button>
    </form>
  );
}

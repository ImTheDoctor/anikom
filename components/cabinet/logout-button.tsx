"use client";

// Client Component: sign-out needs an imperative POST and a client-side
// redirect. The route handler (app/api/auth/logout) clears the local
// web_session cookie on every response, so the redirect to /login follows
// unconditionally — a failed upstream call must not dead-end the button.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LogoutButton({
  label,
  locale,
}: {
  label: string;
  locale: Locale;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogout() {
    setPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // No response — still redirect; the user can sign in again.
    }
    router.replace(`/${locale}/login`);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      disabled={pending}
      className={cn(
        buttonVariants({ variant: "outline" }),
        "min-h-11 w-full justify-start gap-3 px-4",
      )}
    >
      {pending ? (
        <Loader2
          className="size-4 animate-spin motion-reduce:animate-none"
          aria-hidden="true"
        />
      ) : (
        <LogOut className="size-4" strokeWidth={1.75} aria-hidden="true" />
      )}
      {label}
    </button>
  );
}

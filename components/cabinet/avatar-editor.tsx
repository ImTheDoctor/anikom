"use client";

// Client Component: the avatar round-trips through the same-origin proxy
// (/api/me/avatar) and its presence resolves client-side via the image
// element's onLoad/onError — the browser attaches the HttpOnly session
// cookie itself, so the cookie value never touches JavaScript. The icon
// stays under the photo and the img only shows once loaded, so a missing
// avatar never flashes a broken image.

import { useRef, useState, type ChangeEvent } from "react";
import { Loader2, UserRound } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { CabinetPageContent } from "@/lib/home-content";
import { cn } from "@/lib/utils";

type AvatarState = "loading" | "loaded" | "none";

function AvatarCircle({
  src,
  state,
  onState,
  className,
}: {
  src: string;
  state: AvatarState;
  onState: (state: AvatarState) => void;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted",
        className,
      )}
    >
      <UserRound
        className="size-10 text-muted-foreground"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      {/* ?v= cache-buster: replace/delete bump the version to re-fetch. */}
      <img
        src={src}
        alt=""
        onLoad={() => onState("loaded")}
        onError={() => onState("none")}
        className={cn(
          "absolute inset-0 size-full object-cover",
          state !== "loaded" && "hidden",
        )}
      />
    </span>
  );
}

// Read-only avatar (overview card). Upload state starts as "loading" so the
// placeholder icon shows until the probe resolves.
export function AvatarDisplay({ className }: { className?: string }) {
  const [state, setState] = useState<AvatarState>("loading");
  return (
    <AvatarCircle
      src="/api/me/avatar"
      state={state}
      onState={setState}
      className={className}
    />
  );
}

export function AvatarEditor({
  copy,
}: {
  copy: CabinetPageContent["avatar"];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [version, setVersion] = useState(0);
  const [state, setState] = useState<AvatarState>("loading");
  const [pending, setPending] = useState(false);
  const [note, setNote] = useState<{ kind: "saved" | "error"; text: string } | null>(
    null,
  );

  async function upload(file: File) {
    setPending(true);
    setNote(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/me/avatar", { method: "POST", body });
      if (!res.ok) throw new Error();
      setVersion((v) => v + 1);
      setState("loading");
      setNote({ kind: "saved", text: copy.saved });
    } catch {
      setNote({ kind: "error", text: copy.error });
    } finally {
      setPending(false);
    }
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Clearing the value lets re-selecting the same file fire change again.
    event.target.value = "";
    if (!file) return;
    // UX pre-check only — the backend is the trust boundary and re-validates.
    const accepted =
      /^(image\/jpeg|image\/png)$/.test(file.type) ||
      /\.(jpe?g|png)$/i.test(file.name);
    if (!accepted) {
      setNote({ kind: "error", text: copy.error });
      return;
    }
    void upload(file);
  }

  async function handleDelete() {
    setPending(true);
    setNote(null);
    try {
      const res = await fetch("/api/me/avatar", { method: "DELETE" });
      if (!res.ok) throw new Error();
      setVersion((v) => v + 1);
      setState("none");
      setNote({ kind: "saved", text: copy.saved });
    } catch {
      setNote({ kind: "error", text: copy.error });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-6">
      <AvatarCircle
        src={`/api/me/avatar?v=${version}`}
        state={state}
        onState={setState}
      />
      <div className="grid gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
          onChange={handleFile}
          className="hidden"
        />
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={pending}
            className={cn(buttonVariants(), "min-h-11 px-5")}
          >
            {pending ? (
              <Loader2
                className="size-4 animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
            ) : null}
            {state === "loaded" ? copy.replace : copy.upload}
          </button>
          {state === "loaded" ? (
            <button
              type="button"
              onClick={() => void handleDelete()}
              disabled={pending}
              className={cn(buttonVariants({ variant: "outline" }), "min-h-11 px-5")}
            >
              {copy.delete}
            </button>
          ) : null}
        </div>
        {note ? (
          <p
            role={note.kind === "error" ? "alert" : "status"}
            className={cn(
              "text-sm",
              note.kind === "error" ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {note.text}
          </p>
        ) : null}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

type ZoomImageProps = {
  src: string;
  alt: string;
  caption: string;
  closeLabel: string;
};

// Click-to-zoom framed image (About page recognition block): the scan renders
// at a readable size inside a hairline frame; activating it opens a minimal
// lightbox with the full-size image — same accessible pattern as the expert
// certificate gallery (Esc/backdrop/X close, focus moves to the close button
// and returns to the trigger, body scroll locked).
export function ZoomImage({
  src,
  alt,
  caption,
  closeLabel,
}: ZoomImageProps) {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          triggerRef.current = event.currentTarget;
          setOpen(true);
        }}
        aria-haspopup="dialog"
        aria-label={alt}
        className="group relative block w-full cursor-zoom-in overflow-hidden border border-border bg-card focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
      >
        <Image
          src={src}
          alt={alt}
          width={1169}
          height={850}
          sizes="(max-width: 1024px) 100vw, 480px"
          className="h-auto w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </button>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {caption}
      </p>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-10"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label={closeLabel}
            className="absolute top-4 right-4 inline-flex size-11 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-150 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-white/70"
          >
            <X className="size-5" strokeWidth={1.5} aria-hidden="true" />
          </button>
          <figure
            className="flex w-full max-w-5xl flex-col items-center gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative h-[72svh] w-full">
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="object-contain"
                priority
              />
            </div>
            <figcaption className="text-center text-sm text-white/90">
              {caption}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}

"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Eye, X } from "lucide-react";

// One certificate record of the profile data (scan-carrying entries only —
// text-only rows render on the server, see team/[slug]/page.tsx).
export type CertificateScan = {
  title: string;
  issuer: string;
  year: string;
  number?: string;
  image: string;
  imageLabel: string;
};

type CertificateGalleryProps = {
  certificates: CertificateScan[];
  closeLabel: string;
  viewCertificateLabel: string;
};

// Certificate table with click-to-view scans (owner request, Nov 11, 2026):
// rows stay the plain two-paragraph hairline table, and activating a row —
// anywhere on it or via the eye affordance — opens a minimal lightbox with
// the full-size scan. Hand-rolled — no dialog dependency: Esc and the
// backdrop close, focus moves to the close button and returns to the
// trigger, body scroll is locked while open.
export function CertificateGallery({
  certificates,
  closeLabel,
  viewCertificateLabel,
}: CertificateGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpenIndex(null);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (openIndex === null) return;
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
  }, [openIndex, close]);

  const open = openIndex === null ? null : certificates[openIndex];

  return (
    <>
      <ul className="divide-y divide-border border-t border-border">
        {certificates.map((certificate, index) => (
          <li key={certificate.title} className="group relative">
            <button
              type="button"
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setOpenIndex(index);
              }}
              aria-haspopup="dialog"
              className="absolute inset-0 cursor-pointer focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-inset"
            >
              <span className="sr-only">
                {viewCertificateLabel} — {certificate.title}
              </span>
            </button>
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
              <p className="text-sm font-medium transition-colors duration-150 group-hover:text-primary">
                {certificate.title}
              </p>
              <div className="flex items-center gap-x-5 gap-y-1">
                <p className="text-sm text-muted-foreground">
                  {[certificate.issuer, certificate.year, certificate.number]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <span
                  aria-hidden="true"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary"
                >
                  <Eye className="size-4" strokeWidth={1.5} />
                  {viewCertificateLabel}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.title}
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
                src={open.image}
                alt={open.imageLabel}
                fill
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="object-contain"
                priority
              />
            </div>
            <figcaption className="text-center text-sm text-white/90">
              {open.title}
              {open.number ? ` · ${open.number}` : ""}
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}

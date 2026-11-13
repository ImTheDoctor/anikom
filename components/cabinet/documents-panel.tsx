"use client";

// Client Component: the document list lives behind the same-origin proxy
// (/api/me/documents*) with its loading / empty / error / success states
// handled in place. MediaFile mirrors the backend MediaResponseDto; the list
// accepts both a bare array and the paginated { media: [...] } envelope.

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { Download, FileText, Loader2, Upload } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { MediaFile } from "@/lib/cabinet-api";
import type { CabinetPageContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type ListState =
  | { kind: "loading" }
  | { kind: "error" }
  | { kind: "items"; items: MediaFile[] };

function parseDocumentList(data: unknown): MediaFile[] {
  if (Array.isArray(data)) return data as MediaFile[];
  const media = (data as { media?: unknown } | null)?.media;
  return Array.isArray(media) ? (media as MediaFile[]) : [];
}

// Shared fetch for the mount effect and the refresh after uploads. Throws on
// a non-ok response so callers decide the error state.
async function fetchDocuments(): Promise<MediaFile[]> {
  const res = await fetch("/api/me/documents");
  if (!res.ok) throw new Error();
  return parseDocumentList(await res.json());
}

function formatBytes(size: number, locale: Locale): string {
  const units =
    locale === "ru"
      ? { kb: "КБ", mb: "МБ" }
      : locale === "hy"
        ? { kb: "ԿԲ", mb: "ՄԲ" }
        : { kb: "KB", mb: "MB" };
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} ${units.mb}`;
  return `${Math.max(1, Math.round(size / 1024))} ${units.kb}`;
}

function formatDate(value: string, locale: Locale): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
}

export function DocumentsPanel({
  copy,
  locale,
}: {
  copy: CabinetPageContent["documents"];
  locale: Locale;
}) {
  const [list, setList] = useState<ListState>({ kind: "loading" });
  const [uploadPending, setUploadPending] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  // Two-step delete: first click arms the row's button ("Confirm deletion"),
  // the second click deletes; any other delete click re-arms elsewhere.
  const [armedId, setArmedId] = useState<string | null>(null);
  const [deletePendingId, setDeletePendingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState(false);
  const [deletedNote, setDeletedNote] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // The initial state already is "loading"; the mount effect only settles it
  // after the fetch resolves (setState must not run synchronously within the
  // effect — react-hooks/set-state-in-effect). Retries flip to "loading" in
  // their event handler before calling load().
  const load = useCallback(async () => {
    try {
      setList({ kind: "items", items: await fetchDocuments() });
    } catch {
      setList({ kind: "error" });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const items = await fetchDocuments();
        if (!cancelled) setList({ kind: "items", items });
      } catch {
        if (!cancelled) setList({ kind: "error" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    // UX pre-check only — the backend is the trust boundary and re-validates.
    const accepted =
      /^(application\/pdf|image\/jpeg|image\/png)$/.test(file.type) ||
      /\.(pdf|jpe?g|png)$/i.test(file.name);
    if (!accepted) {
      setUploadError(true);
      return;
    }
    setUploadPending(true);
    setUploadError(false);
    setDeletedNote(false);
    setDeleteError(false);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/me/documents", { method: "POST", body });
      if (!res.ok) throw new Error();
      await load();
    } catch {
      setUploadError(true);
    } finally {
      setUploadPending(false);
    }
  }

  async function handleDelete(id: string) {
    if (armedId !== id) {
      setArmedId(id);
      setDeleteError(false);
      setDeletedNote(false);
      return;
    }
    setDeletePendingId(id);
    try {
      const res = await fetch(`/api/me/documents/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setList((prev) =>
        prev.kind === "items"
          ? { kind: "items", items: prev.items.filter((doc) => doc.id !== id) }
          : prev,
      );
      setDeletedNote(true);
    } catch {
      setDeleteError(true);
    } finally {
      setDeletePendingId(null);
      setArmedId(null);
    }
  }

  return (
    <div
      className="grid gap-6"
      aria-busy={uploadPending || list.kind === "loading"}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          onChange={handleUpload}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadPending}
          className={cn(buttonVariants(), "min-h-11 px-5")}
        >
          {uploadPending ? (
            <Loader2
              className="size-4 animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
          ) : (
            <Upload className="size-4" strokeWidth={1.75} aria-hidden="true" />
          )}
          {copy.upload}
        </button>
        <p className="text-sm text-muted-foreground">{copy.uploadHint}</p>
      </div>
      {uploadError ? (
        <p role="alert" className="text-sm text-destructive">
          {copy.uploadError}
        </p>
      ) : null}

      {list.kind === "loading" ? (
        <p className="flex items-center gap-2 border-y border-border py-6 text-sm text-muted-foreground">
          <Loader2
            className="size-4 animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
          {copy.loading}
        </p>
      ) : null}

      {list.kind === "error" ? (
        <div className="grid gap-4 border-y border-border py-6">
          <p role="alert" className="text-sm text-destructive">
            {copy.error}
          </p>
          <button
            type="button"
            onClick={() => {
              setList({ kind: "loading" });
              void load();
            }}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "min-h-11 justify-center px-5 sm:justify-self-start",
            )}
          >
            {copy.retry}
          </button>
        </div>
      ) : null}

      {list.kind === "items" && list.items.length === 0 ? (
        <div className="border-y border-border py-10 text-center">
          <FileText
            className="mx-auto size-8 text-muted-foreground"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <p className="mt-3 font-medium">{copy.empty}</p>
          <p className="mt-1 text-sm text-muted-foreground">{copy.emptyHint}</p>
        </div>
      ) : null}

      {list.kind === "items" && list.items.length > 0 ? (
        <ul className="divide-y divide-border border-y border-border">
          {list.items.map((doc) => (
            <li
              key={doc.id}
              className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium" title={doc.originalName}>
                  {doc.originalName || doc.id}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {[formatBytes(doc.size, locale), formatDate(doc.createdAt, locale)]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {doc.status === "PROCESSING" ? (
                  <span className="border border-border px-2.5 py-1 text-xs text-muted-foreground">
                    {copy.statusProcessing}
                  </span>
                ) : null}
                {doc.status === "FAILED" ? (
                  <span className="border border-destructive/40 px-2.5 py-1 text-xs text-destructive">
                    {copy.statusFailed}
                  </span>
                ) : null}
                <a
                  href={`/api/me/documents/${doc.id}/file`}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "min-h-11 px-4",
                  )}
                >
                  <Download className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  {copy.download}
                </a>
                <button
                  type="button"
                  onClick={() => void handleDelete(doc.id)}
                  disabled={deletePendingId !== null}
                  className={cn(
                    buttonVariants({
                      variant: armedId === doc.id ? "destructive" : "outline",
                    }),
                    "min-h-11 px-4",
                  )}
                >
                  {armedId === doc.id ? copy.deleteConfirm : copy.delete}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {deletedNote && list.kind === "items" ? (
        <p role="status" className="text-sm text-muted-foreground">
          {copy.deleted}
        </p>
      ) : null}
      {deleteError ? (
        <p role="alert" className="text-sm text-destructive">
          {copy.deleteError}
        </p>
      ) : null}
    </div>
  );
}

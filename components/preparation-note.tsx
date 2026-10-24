import type { ReactNode } from "react";

// Visible marker for pages whose full content is not published yet.
export function PreparationNote({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-2xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

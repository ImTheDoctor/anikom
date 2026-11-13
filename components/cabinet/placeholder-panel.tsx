import { Clock, TriangleAlert } from "lucide-react";
import type { CabinetPageContent } from "@/lib/home-content";

// Empty-state panels for the expert-only section. Both are static server
// components — no session data crosses the client boundary.

export function ComingSoonPanel({
  copy,
}: {
  copy: CabinetPageContent["comingSoon"];
}) {
  return (
    <div className="motion-rise border border-border bg-card p-8 text-center sm:p-10">
      <Clock
        className="mx-auto size-8 text-muted-foreground"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <p className="mt-3 font-display text-xl leading-snug">{copy.title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{copy.description}</p>
    </div>
  );
}

export function UnavailablePanel({
  copy,
}: {
  copy: CabinetPageContent["unavailable"];
}) {
  return (
    <div className="motion-rise border border-border bg-card p-8 text-center sm:p-10" role="status">
      <TriangleAlert
        className="mx-auto size-8 text-muted-foreground"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <p className="mt-3 font-display text-xl leading-snug">{copy.title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{copy.description}</p>
    </div>
  );
}

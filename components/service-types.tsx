import { cn } from "@/lib/utils";
import type { ServiceCatalogType } from "@/lib/home-content";

const codeClass =
  "font-mono text-[11px] tracking-[0.16em] text-muted-foreground";

// Hairline list of examination types with their classifier subtypes: mono
// code column + serif title, subtypes as nested rows with their own mono
// codes; entries without a code render full-width. Shared by the /services
// classifier catalog and the direction detail pages.
export function ServiceTypesList({ types }: { types: ServiceCatalogType[] }) {
  return (
    <ul className="divide-y divide-border border-t border-border">
      {types.map((type) => {
        const subtypes = type.subtypes?.length ? (
          <ul className="mt-3">
            {type.subtypes.map((subtype) => (
              <li key={subtype.code ?? subtype.title} className="py-2.5">
                {subtype.code ? (
                  <div className="grid grid-cols-[3rem_minmax(0,1fr)] items-baseline gap-x-4">
                    <span className={codeClass}>{subtype.code}</span>
                    <p className="min-w-0 text-sm leading-relaxed">
                      {subtype.title}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{subtype.title}</p>
                )}
              </li>
            ))}
          </ul>
        ) : null;
        const heading = (
          <h3 className="font-display text-lg leading-snug sm:text-xl">
            {type.title}
          </h3>
        );
        return (
          <li key={type.code ?? type.title} className="py-5">
            {type.code ? (
              <div className="grid grid-cols-[3rem_minmax(0,1fr)] items-start gap-x-4 lg:grid-cols-[4rem_minmax(0,1fr)] lg:gap-x-6">
                <span className={cn(codeClass, "lg:mt-1.5")}>{type.code}</span>
                <div className="min-w-0">
                  {heading}
                  {subtypes}
                </div>
              </div>
            ) : (
              <div className="min-w-0">
                {heading}
                {subtypes}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

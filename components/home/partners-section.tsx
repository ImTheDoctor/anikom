import { SectionHeading } from "@/components/home/section-heading";
import type { HomeContent } from "@/lib/home-content";

type PartnersSectionProps = {
  content: HomeContent;
};

// Typographic hairline grid of partner sectors — text only, no icon
// placeholders pretending to be logos (real logos only after client
// approval).
export function PartnersSection({ content }: PartnersSectionProps) {
  const { partners } = content;

  return (
    <section
      id="partners"
      className="scroll-mt-16 border-t border-border py-16 sm:scroll-mt-20 md:py-20"
    >
      <SectionHeading
        eyebrow={partners.eyebrow}
        title={partners.title}
        description={partners.description}
      />

      <ul className="mt-10 grid grid-cols-1 border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
        {partners.items.map(({ name }) => (
          <li
            key={name}
            className="flex min-h-20 min-w-0 items-center justify-center bg-background px-3 py-4 text-center"
          >
            <span className="text-[11px] leading-snug font-medium tracking-[0.14em] text-muted-foreground uppercase">
              {name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

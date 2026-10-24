import { SectionHeading } from "@/components/home/section-heading";
import type { HomeContent } from "@/lib/home-content";

type ClientsSectionProps = {
  content: HomeContent;
};

// Definition table: serif audience term, muted description — hairline rows
// instead of icon cards.
export function ClientsSection({ content }: ClientsSectionProps) {
  const { clients } = content;

  return (
    <section
      id="clients"
      className="scroll-mt-16 border-t border-border py-16 sm:scroll-mt-20 md:py-20"
    >
      <SectionHeading
        eyebrow={clients.eyebrow}
        title={clients.title}
        description={clients.description}
      />

      <dl className="mt-10 divide-y divide-border border-t border-border">
        {clients.items.map(({ title, description }) => (
          <div
            key={title}
            className="grid gap-1 py-5 sm:grid-cols-[15rem_1fr] sm:gap-6"
          >
            <dt className="font-display text-lg leading-snug">{title}</dt>
            <dd className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

import { Reveal } from "@/components/reveal";
import type { HomeContent } from "@/lib/home-content";

type PartnersSectionProps = {
  content: HomeContent;
};

// Partner-sector marquee (owner request, Oct 2026): the sector cells flow
// continuously without ever stopping — the owner explicitly rejected both
// the stepped carousel and any stepper-like pacing. Pure CSS: the list is
// rendered twice and the track translates by exactly one copy (−50%) per
// loop, so the flow is seamless. Pauses on hover/focus-within and does not
// animate under prefers-reduced-motion (the same cell list simply rests).
// The duplicate copy is aria-hidden so assistive tech reads the sectors
// once. Text-only labels — no logo placeholders pretending to be logos
// (real logos only after client approval).
export function PartnersSection({ content }: PartnersSectionProps) {
  const { partners } = content;

  return (
    <section
      id="partners"
      aria-labelledby="partners-heading"
      className="scroll-mt-16 py-6 sm:scroll-mt-20 sm:py-10"
    >
      <div className="rounded-2xl bg-brand-deep p-6 text-hero-foreground sm:p-10 lg:px-12 lg:py-12">
        <Reveal stagger>
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-[0.18em] text-hero-accent uppercase">
              {partners.eyebrow}
            </p>
            <h2
              id="partners-heading"
              className="mt-3 font-display text-3xl leading-tight sm:text-4xl"
            >
              {partners.title}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-hero-muted sm:text-base">
              {partners.description}
            </p>
          </div>

          {/* Fixed-width cells keep the equal grid look; w-max on the track
              lets −50% equal exactly one copy of the six sectors. */}
          <div className="mt-10 overflow-hidden border-y border-hero-border sm:mt-12">
            <ul className="animate-marquee flex w-max">
              {[...partners.items, ...partners.items].map(({ name }, index) => (
                <li
                  key={`${name}-${index}`}
                  aria-hidden={index >= partners.items.length || undefined}
                  className="flex min-h-20 w-40 shrink-0 items-center justify-center border-l border-hero-border px-3 py-4 text-center sm:w-48 lg:w-56"
                >
                  <span className="text-[11px] leading-snug font-medium tracking-[0.14em] text-hero-muted uppercase">
                    {name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

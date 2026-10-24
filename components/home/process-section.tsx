import {
  ClipboardCheck,
  DraftingCompass,
  FileCheck2,
  HardHat,
  MessageSquare,
} from "lucide-react";
import { ActionLink } from "@/components/action-link";
import { SectionHeading } from "@/components/home/section-heading";
import { Reveal } from "@/components/reveal";
import type { HomeContent } from "@/lib/home-content";
import type { Locale } from "@/lib/i18n";
import { localizeHref } from "@/lib/i18n";

const stepIcons = [
  MessageSquare,
  ClipboardCheck,
  DraftingCompass,
  HardHat,
  FileCheck2,
];

type ProcessSectionProps = {
  content: HomeContent;
  locale: Locale;
};

export function ProcessSection({ content, locale }: ProcessSectionProps) {
  const { process } = content;

  return (
    <section
      id="process"
      className="scroll-mt-16 border-t border-border py-16 sm:scroll-mt-20 md:py-20"
    >
      <Reveal>
        <SectionHeading
          eyebrow={process.eyebrow}
          title={process.title}
          description={process.description}
          action={
            <ActionLink href={localizeHref(locale, process.action.href)}>
              {process.action.label}
            </ActionLink>
          }
        />
      </Reveal>

      <Reveal
        as="ol"
        stagger
        className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4"
      >
        {process.steps.map(({ number, title, description }, index) => {
          const Icon = stepIcons[index];
          return (
            <li
              key={number}
              className="border-t border-border pt-6 first:border-t-0 first:pt-0 sm:border-t-0 sm:pt-0"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-primary">
                  <Icon
                    className="size-5"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </span>
                <span className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground">
                  {number}
                </span>
                {index < process.steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="hidden h-px flex-1 border-t border-dashed border-border lg:block"
                  />
                ) : null}
              </div>
              <h3 className="mt-4 font-display text-xl leading-snug">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </li>
          );
        })}
      </Reveal>
    </section>
  );
}

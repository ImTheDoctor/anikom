import { SectionHeading } from "@/components/home/section-heading";
import type { HomeContent } from "@/lib/home-content";

type TestimonialsSectionProps = {
  content: HomeContent;
};

// Editorial pull-quotes: serif quote with a left hairline, author line below.
// No avatars, icons, or numeric ratings — the quotes are draft demo data and
// a star rating on them would read as a fake (and templated) signal.
export function TestimonialsSection({ content }: TestimonialsSectionProps) {
  const { testimonials } = content;

  return (
    <section
      id="testimonials"
      className="scroll-mt-16 border-t border-border py-16 sm:scroll-mt-20 md:py-20"
    >
      <SectionHeading
        eyebrow={testimonials.eyebrow}
        title={testimonials.title}
        description={testimonials.description}
      />

      <ul className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
        {testimonials.items.map((testimonial) => (
          <li
            key={testimonial.author}
            className="min-w-0 border-l border-border pl-5 sm:pl-6"
          >
            <blockquote className="font-display text-lg leading-snug text-foreground sm:text-xl">
              “{testimonial.quote}”
            </blockquote>
            <footer className="mt-4">
              <p className="text-sm font-medium">{testimonial.author}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {testimonial.organization}
              </p>
            </footer>
          </li>
        ))}
      </ul>
    </section>
  );
}

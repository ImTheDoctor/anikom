import type { HomeContent } from "@/lib/home-content";

type ServiceIndexProps = {
  services: HomeContent["services"];
  headingLevel?: "h2" | "h3";
};

// Editorial index of the eight expertise directions: mono number, serif
// title, muted description — hairline rows instead of icon cards. Shared by
// the homepage section and the /services page.
export function ServiceIndex({
  services,
  headingLevel: Title = "h3",
}: ServiceIndexProps) {
  return (
    <ul className="divide-y divide-border border-t border-border">
      {services.items.map(({ slug, title, description }, index) => (
        <li
          key={slug}
          className="group grid grid-cols-[3rem_1fr] items-baseline gap-x-4 gap-y-1 py-4 lg:grid-cols-[4rem_minmax(0,2fr)_minmax(0,3fr)] lg:gap-x-6 lg:py-5"
        >
          <span className="font-mono text-[11px] tracking-[0.16em] text-muted-foreground transition-colors duration-150 group-hover:text-primary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <Title className="font-display text-lg leading-snug">{title}</Title>
          <p className="col-span-2 text-sm leading-relaxed text-muted-foreground lg:col-span-1">
            {description}
          </p>
        </li>
      ))}
    </ul>
  );
}

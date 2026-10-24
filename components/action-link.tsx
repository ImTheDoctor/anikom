import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ActionLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

// Inline arrow link for section and card actions.
export function ActionLink({ href, className, children }: ActionLinkProps) {
  return (
    <Link
      href={href}
      transitionTypes={["forward"]}
      className={cn(
        "group inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary-hover hover:underline focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none",
        className,
      )}
    >
      {children}
      <ArrowRight
        className="size-4 transition-transform duration-150 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}

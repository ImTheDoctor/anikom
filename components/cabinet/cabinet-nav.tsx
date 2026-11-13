"use client";

// Client Component: the active item depends on the current URL (usePathname).
// Horizontal scroll strip on small screens, vertical sidebar from lg up.

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  FileText,
  LayoutDashboard,
  Settings,
  UserRound,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type CabinetNavItem = {
  href: string;
  label: string;
};

// Module-scope component: resolving the icon during render (a component
// alias created per render) trips react-hooks/static-components.
function NavIconGlyph({ href }: { href: string }) {
  if (href.endsWith("/me/profile")) {
    return <UserRound className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />;
  }
  if (href.endsWith("/me/documents")) {
    return <FileText className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />;
  }
  if (href.endsWith("/me/settings")) {
    return <Settings className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />;
  }
  if (href.endsWith("/me/clients")) {
    return <Users className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />;
  }
  if (href.endsWith("/me/requests")) {
    return <ClipboardList className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />;
  }
  return <LayoutDashboard className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />;
}

function CabinetNavLink({
  item,
  active,
}: {
  item: CabinetNavItem;
  active: boolean;
}) {
  return (
    <li className="shrink-0 lg:shrink">
      <Link
        href={item.href}
        transitionTypes={["forward"]}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex min-h-11 items-center gap-2.5 rounded-sm px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring",
          active
            ? "bg-accent text-primary"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <NavIconGlyph href={item.href} />
        {item.label}
      </Link>
    </li>
  );
}

export function CabinetNav({
  ariaLabel,
  items,
  expertItems,
  expertLabel,
}: {
  ariaLabel: string;
  items: CabinetNavItem[];
  expertItems: CabinetNavItem[];
  expertLabel: string;
}) {
  const pathname = usePathname();
  return (
    <nav aria-label={ariaLabel} className="min-w-0">
      <ul className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {items.map((item) => (
          <CabinetNavLink
            key={item.href}
            item={item}
            active={pathname === item.href}
          />
        ))}
      </ul>
      {expertItems.length > 0 ? (
        <div
          role="group"
          aria-label={expertLabel}
          className="mt-4 lg:mt-6 lg:border-t lg:border-border lg:pt-4"
        >
          <p className="hidden text-xs uppercase tracking-[0.18em] text-muted-foreground lg:block">
            {expertLabel}
          </p>
          <ul className="flex gap-1 overflow-x-auto lg:mt-2 lg:flex-col lg:overflow-visible">
            {expertItems.map((item) => (
              <CabinetNavLink
                key={item.href}
                item={item}
                active={pathname === item.href}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </nav>
  );
}

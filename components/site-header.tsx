import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { HeaderCta } from "@/components/header-session-cta";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileNav } from "@/components/mobile-nav";
import type { HomeContent } from "@/lib/home-content";
import { localizeHref, type Locale } from "@/lib/i18n";

type SiteHeaderProps = {
  content: HomeContent;
  locale: Locale;
};

export function SiteHeader({ content, locale }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-hero-border bg-brand-deep text-hero-foreground [view-transition-name:site-header]">
      <div className="mx-auto flex h-16 w-full items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-15 2xl:max-w-[120rem]">
        <Link
          href={`/${locale}`}
          aria-label={content.header.homeLabel}
          className="flex min-h-11 shrink-0 items-center gap-3 rounded-sm focus-visible:ring-3 focus-visible:ring-hero-accent focus-visible:outline-none"
        >
          {/* The crest artwork is monolithic black — on the dark header it
              mounts on a light plaque (same pattern as the footer brand
              block; docs/design-system.md §8). The crest keeps the §5 40px
              mobile minimum inside the plaque. */}
          <span className="inline-flex items-center bg-background p-1">
            <BrandMark className="h-10 sm:h-12" preload />
          </span>
          <span className="text-base leading-none font-semibold tracking-[0.2em] sm:text-lg">
            {content.common.brandName}
          </span>
        </Link>

        <nav
          aria-label={content.navigation.primaryLabel}
          className="hidden items-center gap-2 min-[1200px]:flex xl:gap-4"
        >
          {content.navigation.primary.map((item) => (
            <Link
              key={item.href}
              href={localizeHref(locale, item.href)}
              transitionTypes={["forward"]}
              className="flex min-h-11 items-center rounded-sm px-1.5 text-sm font-medium text-hero-muted transition-colors hover:text-hero-foreground focus-visible:ring-3 focus-visible:ring-hero-accent focus-visible:outline-none"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden items-center gap-1 min-[1200px]:flex">
            <LanguageSwitcher
              locale={locale}
              language={content.header.language}
            />
          </div>

          <HeaderCta
            authCta={content.header.authCta}
            cabinetCta={content.header.cabinetCta}
            locale={locale}
          />
          <MobileNav
            locale={locale}
            nav={content.navigation.primary}
            navLabel={content.navigation.mobileLabel}
            openLabel={content.mobileNav.openLabel}
            closeLabel={content.mobileNav.closeLabel}
            language={content.header.language}
          />
        </div>
      </div>
    </header>
  );
}

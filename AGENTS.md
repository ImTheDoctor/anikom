# AGENTS.md — Anicom Web

Instructions for AI coding agents (Qoder, OpenCode) working in `anicom-web`.

## Project purpose and stack

Anicom corporate website MVP. Product: a professional, corporate B2B site targeting Armenian (`hy`), English (`en`), and Russian (`ru`) audiences. Localized routes (`/hy`, `/en`, `/ru`) and JSON-backed copy exist; no backend, database, CMS, authentication, or third-party i18n library — do not introduce these without explicit approval.

Stack (verified, do not upgrade): Next.js 16.4.3 App Router · React 19.3.0 · TypeScript (strict) · Tailwind CSS v4 · shadcn/ui with the **Vega preset** on **Base UI** · `cn` package for class merging · `lucide-react` icons · `next/font` (Geist Sans, Geist Mono, Playfair Display, Noto Sans/Serif Armenian) · pnpm 10.

Brand assets: primary color **#A54686** (token `--primary`). `public/logo.png` is a temporary AI-generated crest placeholder (pending the client's official coat of arms) — treat it as provisional artwork. Services come from the client-approved company profile (eight expertise directions), not from the crest. See `docs/design-system.md` §2, §5, §11.

## Before any edit: inspect

1. Read the files you will touch first (do not rely on memory).
2. If working on UI, read `docs/design-system.md` and `app/globals.css` (tokens) — they are the source of truth.
3. Do not assume Radix-based shadcn examples work here; this project uses Base UI.

## Design-system compliance

- Use only tokens defined in `app/globals.css` (via utilities like `bg-background`, `text-primary`, `bg-hero`, `border-hero-border`, `ring-ring`). No raw hex/oklch values in components.
- Follow `docs/design-system.md`: type scale (Playfair Display for display headings only, Geist for UI/body), spacing steps, hairline borders, radii, full-opacity brand focus rings, state-only motion, and accessibility rules.
- Primary buttons use `--primary-hover`; do not reintroduce `bg-primary/80` (fails AA, see design doc §2).
- Logo: render via `components/brand-mark.tsx` / `next/image`; never recolor, crop, or place the black-artwork crest directly on dark surfaces — mount it on a light plaque.
- No gradients, glassmorphism, decorative animation, emoji icons, or invented company facts/marketing copy.

## TypeScript and Next.js conventions

- Strict TypeScript; run `pnpm exec tsc --noEmit` before finishing.
- App Router only (`app/`). Routes are Server Components by default; add `"use client"` only for interactivity that needs browser APIs (state, effects, event handlers). Document why a component must be a Client Component.
- Data fetching: prefer Server Components; parallelize independent fetches (`Promise.all`); avoid waterfalls; keep client payloads minimal.
- Import directly from modules — no barrel files. Use `@/*` path alias (maps to project root).
- Metadata in `layout.tsx`/`page.tsx` via `export const metadata` / `generateMetadata`; `<html lang>` is set from the route locale in `app/[locale]/layout.tsx`.

## Base UI + Vega rules

- Components live in `components/ui/` and are generated with `pnpm dlx shadcn@latest add <name>` (reads `components.json`, style `base-vega`).
- Reject any hand-copied Radix code. Generated components import from `@base-ui/react/*` and `cn`.
- Modify generated components only through the CLI flow or with explicit intent; keep the utilities (`cn`, `class-variance-authority`) intact.

## Dependencies and pnpm

- No new dependencies without explicit user approval (no `pnpm add` of unapproved packages).
- This is a single package, not a workspace: `package.json` holds `pnpm.ignoredBuiltDependencies` (sharp, unrs-resolver). Do not recreate `pnpm-workspace.yaml`.
- Use `pnpm` exclusively (no npm/yarn). Lockfile is `pnpm-lock.yaml`; commit it when it changes.
- Never install the `shadcn` CLI as a runtime dependency; use `pnpm dlx shadcn@latest`.

## Multilingual (`hy` / `en` / `ru`)

- Routes: `/hy` (default), `/en`, `/ru`; `/` redirects to `/hy` in `next.config.ts`. Use the helpers in `lib/i18n.ts`. Do not add middleware just for locales — this app uses locale route segments and config redirects, and Next 16's `proxy.ts` is the middleware replacement when request-level interception is actually needed.
- All user-facing copy lives in `data/home.hy.json`, `data/home.en.json`, and `data/home.ru.json`; the structures must stay identical. Render through `getHomeContent(locale)` in `lib/home-content.ts` and never hardcode user-facing copy in components (the Anicom wordmark is the exception).
- The language selector preserves paths registered in `localizedRoutePaths`; add new localized routes there. If an equivalent path does not exist, the selector falls back to the localized homepage.
- Fonts: Geist and Playfair cover Latin/Cyrillic; Noto Sans/Serif Armenian are loaded for Armenian. The theme stacks reference family names directly so Armenian glyphs reach Noto before next/font's generated metric fallbacks. Verify Armenian and Cyrillic rendering in a browser after copy/font changes.
- Set `NEXT_PUBLIC_SITE_URL` in production so canonical and hreflang URLs are absolute; the local fallback is `http://localhost:3000`.
- Respect `lang` semantics and layout constraints: Armenian/Russian are longer than English. Re-check the header, hero, cards, and footer at 375, 768, 1024, 1280, and 1440 px in all three locales.

## Accessibility and responsive

- Keyboard operability, visible `focus-visible` rings, ≥4.5:1 text contrast, labels on all controls, `aria-hidden` on decorative icons, `aria-label` on icon-only buttons.
- Mobile-first; no horizontal scroll; touch targets ≥44px.

## Content integrity

- Do not invent Anicom facts, contact details, metrics, certifications, clients, or testimonials. Use the eight service directions from the client-approved company profile (see design doc §11); hero, services, process, and clients copy are provisional pending native review and client sign-off.
- Team profiles, testimonials, news, cases, partner labels, the `40+` partners stat, and the editorial stock photos in `public/images/` hold user-authorized DRAFT demo data for the MVP client preview (Oct 2026) — treat them as placeholders, never as facts, and replace with client-approved data and photography before production.
- No dead links: do not add contact CTAs until a real destination exists.

## Git safety

- Do not commit, push, rewrite history, or create branches unless the user explicitly asks.
- Preserve unrelated user changes; do not reformat files you are not editing.

## Verification (required before reporting done)

```bash
pnpm install
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

Also verify `/`, all three locale routes, an invalid locale (404), and language switching in a browser. Fix failures at the root cause; never suppress or bypass them.

## Definition of done

- Required files changed; no unrelated edits.
- All four verification commands pass.
- UI changes match `docs/design-system.md` tokens and rules.
- New dependencies (if any) were user-approved.
- Report: changed files, verification results, and any unresolved issues. Do not claim browser-verified visuals unless you actually inspected the rendered result.

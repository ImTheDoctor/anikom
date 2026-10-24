# Anicom Web

Corporate website for Anicom, built with Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui on Base UI.

## Routes

The site is available in Armenian (`hy`), English (`en`), and Russian (`ru`):

- `/hy` — default locale
- `/en`
- `/ru`

`/` redirects to `/hy`. Invalid locale segments return a 404.

## Content

All homepage, navigation, footer, metadata, and UI copy lives in:

- `data/home.hy.json`
- `data/home.en.json`
- `data/home.ru.json`

The files share an identical structure and are loaded through the typed locale loader in `lib/home-content.ts`. Locale configuration and URL helpers are in `lib/i18n.ts`. See `docs/design-system.md` for the design system and localization rules.

Hero, services, process, featured, and clients copy follow the client-provided company profile (a center for research and judicial examinations) and await native review of the Armenian and Russian texts. Team profiles, testimonials, news, cases, partner marks, and the stock photos in `public/images/` hold draft demo data for the MVP client preview — replace with approved content and photography before production.

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000/hy](http://localhost:3000/hy).

## Verification

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm build
```

## Configuration

Set `NEXT_PUBLIC_SITE_URL` in production (for example, `https://www.example.com`) so canonical and hreflang metadata use absolute production URLs. It defaults to `http://localhost:3000` for local development.

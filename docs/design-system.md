# Anicom Design System

Status: brand baseline for the corporate website MVP. This document is the single source of truth for visual and interaction standards. The implementation source of truth for tokens is `app/globals.css` (Tailwind CSS v4 custom properties); do not duplicate token values in TypeScript or component files.

> **Provenance:** Primary brand color `#A54686` and the coat-of-arms logo (`public/logo.png`) are official brand inputs. The Base UI + Vega (neutral) preset supplies component structure and the neutral/radius foundation. The homepage direction (premium corporate, editorial typography, dark dramatic hero, mauve accents, light surfaces) comes from the brief. Marketing copy beyond the service names on the crest is **provisional** — see §12.

## 1. Design principles and brand character

Anicom is a center for research and judicial examinations serving `hy`, `en`, and `ru` audiences. The identity combines a heraldic crest with technical precision symbols: professional authority expressed through modern editorial structure.

1. **Heritage, not nostalgia.** The crest is the signature; use it with ceremony and restraint (header and footer lockups). Do not tile it, watermark it, or turn it into decoration.
2. **Engineering clarity.** Precise alignment, hairline rules, generous margins. Every element informs, navigates, or acts.
3. **Editorial hierarchy.** A serif display face carries headlines; a neutral sans carries the interface. Hierarchy is set with type, spacing, and hairlines — not color blocks.
4. **One accent.** Mauve `#A54686` is the action and emphasis color. It stays scarce so it keeps meaning.
5. **Calm surfaces.** White and near-white content fields alternate with two deep, warm-black brand bands (hero, company). No gradients, glassmorphism, or neon. Motion is purposeful, never ambient: hover/active feedback and one-time entry reveals within the §7 "Motion" rules.
6. **Accessibility is a feature.** AA contrast, visible keyboard focus, and honest content are acceptance criteria.

Anti-patterns: generic AI landing pages (gradient hero blobs, floating glass cards, emoji icons, cursor-following effects, scroll-reveal everywhere), heraldic pattern wallpaper, and invented corporate facts.

## 2. Color

All color is consumed through tokens/utilities (`bg-primary`, `text-hero-muted`, `border-hero-border`, ...). No raw hex/oklch in components.

### Brand and neutral tokens — light (`:root`)

| Token | Value | Usage |
|---|---|---|
| `--primary` | `oklch(0.5396 0.1463 342.03)` = **#A54686** | Primary actions, links, eyebrows, active emphasis |
| `--primary-foreground` | `oklch(0.985 0 0)` | Text/icons on primary |
| `--primary-hover` | `oklch(0.47 0.135 342)` ≈ #8B3670 | Primary button hover (AA-safe; see below) |
| `--ring` | brand | Focus rings (full opacity) |
| `--accent` | `oklch(0.962 0.012 342)` | Subtle mauve-tinted fills |
| `--background` | `oklch(1 0 0)` | Page background |
| `--foreground` | `oklch(0.145 0 0)` | Primary text |
| `--card` / `--popover` | `oklch(1 0 0)` | Surfaces |
| `--muted` | `oklch(0.97 0 0)` | Section tint, disabled/subtle fills |
| `--muted-foreground` | `oklch(0.556 0 0)` | Secondary text — see contrast limits |
| `--secondary` | `oklch(0.97 0 0)` | Secondary controls |
| `--destructive` | `oklch(0.577 0.245 27.325)` | Errors, destructive actions |
| `--border` | `oklch(0.922 0 0)` | Hairlines, dividers |
| `--input` | `oklch(0.922 0 0)` | Form control borders |

Chart and sidebar tokens remain at Vega defaults (reserved, unused by the homepage).

### Inverse surfaces — hero and contact bands (both themes)

| Token | Value | Usage |
|---|---|---|
| `--hero` | `oklch(0.164 0.014 342)` ≈ #120C10 | Dark dramatic band background |
| `--hero-foreground` | `oklch(0.968 0.006 342)` ≈ #F7F3F5 | Text on hero |
| `--hero-muted` | `oklch(0.78 0.015 342)` ≈ #BFB4BA | Secondary text on hero |
| `--hero-accent` | `oklch(0.78 0.09 342)` ≈ #E0A1C8 | Small accent text/rules on hero (brand itself is only 3.52:1 there) |
| `--hero-border` | `oklch(1 0 0 / 12%)` | Hairlines on hero |
| `--brand-deep` | `oklch(0.3189 0.0906 342.34)` = **#501C3F** (owner-set, Oct 2026) | Deep burgundy footer, featured, and contact surfaces; uses the hero text tokens |

### Dark theme (`.dark`)

`--primary: oklch(0.8 0.1 342)`, `--primary-foreground: oklch(0.17 0.02 342)`, `--primary-hover: oklch(0.86 0.08 342)`, `--ring: oklch(0.8 0.1 342)`, `--accent: oklch(0.26 0.02 342)`, plus Vega dark neutrals. The hero tokens are theme-independent. Dark mode is not enabled by default (no theme provider); a `prefers-color-scheme` fallback adjusts only page background/foreground.

### Verified contrast (computed for this palette)

| Pair | Ratio | Verdict |
|---|---|---|
| White on `--primary` (#A54686) | **5.5:1** | AA normal text |
| White on `--primary-hover` | **7.34:1** | AAA |
| `--hero-foreground` on `--hero` | **17.58:1** | AAA |
| `--hero-muted` on `--hero` | **9.63:1** | AAA |
| `--hero-accent` on `--hero` | **9.30:1** | AAA |
| `--primary` on `--hero` | 3.52:1 | UI/large text only — use `--hero-accent` for small text |
| `--hero-foreground` on `--brand-deep` | **12.09:1** | AAA |
| `--hero-muted` on `--brand-deep` | **6.62:1** | AA |
| `--hero-accent` on `--brand-deep` | **6.40:1** | AA |
| `--primary` on `--brand-deep` | 2.41:1 | **Fails** — use hero text/accent tokens or white buttons on deep surfaces |
| `--muted-foreground` on white | **4.74:1** | AA |
| `--muted-foreground` on full `bg-muted` | 4.35:1 | **Fails** — keep small muted text on white/card surfaces |

**Why `--primary-hover` exists:** the Vega default `hover:bg-primary/80` blends to #B76B9E and drops white text to **3.74:1**. The Button was changed to `hover:bg-primary-hover`; do not reintroduce opacity-based primary hovers.

## 3. Typography

Families (loaded with `next/font/google` in `app/[locale]/layout.tsx`):

- **Playfair Display** (`--font-display`) — display serif for h1, h2, card titles. Use regular weight (400); large sizes. Never use it for body copy or UI labels.
- **Geist Sans** (`--font-sans`) — body, navigation, buttons, labels.
- **Geist Mono** (`--font-mono`) — data, code, aligned figures.
- **Noto Sans Armenian** / **Noto Serif Armenian** — Armenian UI and display coverage. The theme names loaded families directly so Armenian glyphs resolve to Noto before next/font metric fallbacks; keep this ordering when changing fonts.

Scale (mobile-first):

| Role | Classes | Notes |
|---|---|---|
| Hero display | `font-display text-4xl leading-[1.06] sm:text-5xl lg:text-6xl` | 36 → 48 → 60px |
| Section title | `font-display text-3xl leading-tight sm:text-4xl` | contact band adds `lg:text-5xl` |
| Card title | `font-display text-2xl leading-snug` | |
| Lead / hero sub | `text-base sm:text-lg leading-relaxed` | |
| Body | `text-base leading-relaxed` | 16px, 1.5–1.6 |
| Small | `text-sm leading-relaxed` | 14px |
| Caption/meta | `text-xs` | 12px; micro-labels (over-photo stat labels, mono locale codes) may use `text-[11px]` — 11px floor, never lower |
| Eyebrow | `text-xs font-medium uppercase tracking-[0.18em]` | 12px |
| Wordmark | `font-semibold tracking-[0.2em]` | ANICOM lockup |
| Plaque labels | `text-xs font-medium uppercase tracking-[0.14em]` | |

Weights: body 400; navigation/buttons 500; wordmark 600; display 400. Avoid bold display headings.

Multilingual (`hy` / `en` / `ru`):

- Geist is loaded with Latin and Cyrillic subsets; Playfair Display is loaded with Latin and Cyrillic. Russian headings and UI are covered.
- Noto Sans Armenian and Noto Serif Armenian are loaded for Armenian. The theme stacks list the loaded family names directly — do not reintroduce metric fallback variables ahead of Noto, or Armenian glyphs will stay on the Latin fallback.
- Set the correct `lang` on `<html>` and localized regions; all three locales are LTR. Re-test leading/tracking per script — Cyrillic and Armenian need looser display leading than Latin. Long Armenian words may use soft hyphens in content and wrap at narrow widths.

## 4. Spacing, container, grid

- Tailwind 0.25rem spacing steps; no arbitrary spacing. Section rhythm: `py-16 md:py-24`; hero `pt-14 pb-16 sm:pt-16 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28`.
- Container: `mx-auto w-full px-4 sm:px-6 lg:px-15 2xl:max-w-[120rem]` — full-bleed with 60px gutters from `lg` (desktop), capped at `120rem` from `2xl` (still 60px screen edges at 1920). Header, hero, page sections, contact band, and footer all share this container. Prose `max-w-xl`/`max-w-2xl`.
- Header: `h-16 sm:h-20`, sticky, solid `bg-background`, hairline bottom border. Wordmark only (descriptor lives in the footer); full navigation appears from `min-[1150px]` (custom breakpoint — Armenian labels do not fit at `lg` 1024), compact disclosure below it.
- Homepage: one full-width editorial column of sections in fixed order — hero, service strip, process, featured blocks, cases, clients (who we work with), team, testimonials, news, partners, contact CTA, footer.
- Section subpages: localized list page `/[locale]/services` (the full service index — client-approved content, no preparation note) plus `/[locale]/cases`, `/[locale]/team`, `/[locale]/news` list pages and detail stubs `/[locale]/{cases,team,news}/[slug]`. Slugs live in the content JSON and match the `public/images/*` filenames. List and detail pages carry meta + image + a visible "page in preparation" note (`common.pageInProgress`) — never invented copy — except `/team`, whose note was removed by owner decision (Oct 2026, `showPreparationNote={false}`); the profiles remain demo data to be replaced before production.
- **Expert profile `/[locale]/team/[slug]`** (owner request, Oct 2026, with client-provided certificate scans): breadcrumb header (Home / Experts / name — `experts.breadcrumb*` keys) → portrait (aspect 3/4, `priority`) beside role (primary), serif h1, direction tag pills, and a hairline facts `dl` (experience · languages · certificates count) → About (bio paragraphs) → Education and Career path as two hairline-row columns (period small muted, title, place) → Certificates & qualifications: records with scans render as uniform `aspect-[3/2]` `object-contain` cards in a 2-col grid (documents are never cropped), text-only records as hairline rows → Related experts (top 4 by shared directions, `ExpertCard` grid, link to the directory) → contact banner. All copy lives in `team.items[].profile` + `experts.profileUi` (bio, education, career, languages, certificates ×3 locales). **The director's four certificates are real client-provided scans** (`public/images/certificates/araik-stepanyan/`, read and captioned from the documents: judicial-expert right 2005 №0265, Justice Advisor First Class 2007, valuation right 2011 №0416, YSU law retraining 2012) and his profile facts are grounded in them; every other expert's profile and certificate entries are draft demo data without scans.
- **Expert directory `/[locale]/team`** (owner reference design, Oct 2026): the page is a filterable catalog, not a plain list. Compact `bg-hero` band (breadcrumb → serif h1 → description → three-stat strip: two JSON stats + the live roster count) with the `motion-rise` cascade; then `ExpertsDirectory` (Client Component): a filter sidebar (search by name/role, direction checkboxes with roster counts, experience radios any/5+/10+/15+, reset; collapsed behind a disclosure below `lg`, Escape closes it) — a quick-filter direction chip row above the catalog was built first and removed by owner decision the same day (`allDirections` JSON key deleted), a toolbar (live result count `aria-live`, native sort select, grid/list view toggle), the card grid (2 cols → 3 from `xl`, 9 per page) or list rows, numbered pagination, and an empty state with reset. All copy lives in the `experts` JSON block (structures identical across locales); filtering/sorting runs client-side over the full localized roster (`team.items`, 12 draft entries). Expert cards extend the TeamCard language (single stretched link, circular arrow affordance, image zoom + shadow lift) with an experience badge pill and direction tag pills.
- Hero: full-bleed dark band with the `public/hero.png` photo as cover background (statue stays right, copy sits over the dark left field); a single copy column; five-stat strip below, pinned to the bottom of the band.
- Services: numbered editorial index (mono `01`–`08`, serif title, muted description) as hairline rows — number + title on mobile, three-column rows from `lg`; section surface `bg-background`.
- Anchored sections use `scroll-mt-16 sm:scroll-mt-20` to clear the sticky header.
- Breakpoints: `sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536. Design at 375 / 768 / 1280.

## 5. Radii, borders, shadows, icons, logo

- Radii: `--radius: 0.625rem` scale (`sm` 0.375 → `4xl` 1.625rem). Buttons `rounded-md`; cards/panels square (`rounded-none`) in the editorial sections, using hairlines instead of rounding. Reserve `rounded-lg` for future form surfaces; pills only for tags.
- Borders: 1px `border-border`; on dark, `border-hero-border`; form controls `border-input`.
- Shadows: none by default on the homepage. Use `shadow-xs` for resting surfaces, `shadow-md` for the hover lift of link cards (team) and overlays, `shadow-lg` reserved for overlays. No colored or layered shadows.
- Icons: `lucide-react` only, stroke style, `1.5` stroke at 20px in service cards, default `2` at 16px inline; `aria-hidden` when decorative. Never emoji.
- **Logo usage:**
  - Asset: `public/logo.png` — 1308×1202 RGBA with transparency. **Currently an AI-generated placeholder crest** (its top banner reads «ՄԱՐԶԷՐ» with engineering ribbons) — the client will supply the official coat of arms; re-check all logo rules after replacement. Render through `next/image` (via `components/brand-mark.tsx`) so the 2.5 MB source is served optimized; avoid raw `<img>`.
  - Placements: header lockup (crest + localized wordmark + descriptor) and footer lockup. The wordmark is `common.brandName` and follows the locale — `ANICOM` (en), `ԱՆԻԿՈՄ` (hy), `АНИКОМ` (ru); never hardcode the Latin wordmark. Nowhere else by default.
  - Minimum rendered height: 40px (mobile header), 48px elsewhere. Do not upscale beyond intrinsic width.
  - Clear space: at least half the crest height on all sides.
  - Never recolor, crop, distort, outline, or add effects. Do not place the crest directly on the dark bands — its black line art disappears; always mount it on a light `bg-background` plaque with padding.
  - Alt text: decorative (`alt=""`) when the adjacent wordmark or link label names Anicom.
  - The source PNG is heavy; replace it with an optimized master (SVG or compressed PNG) before production without altering the artwork.

## 6. Components

- **Button** (`components/ui/button.tsx`, Base UI + Vega): variants `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`; sizes `xs`–`lg`, icon sizes. Project overrides: `default` hover uses `bg-primary-hover`, focus ring is full `ring-ring` (3px). One primary action per view; destructive only for destruction. For CTA navigation use `buttonVariants()` on an `<a>` (Base UI Button always renders `role="button"`), as in the hero.
- **Links:** inline/brand links `text-primary` with `underline-offset-4 hover:underline`. Navigation links: `text-sm font-medium text-muted-foreground hover:text-foreground transition-colors`, minimum 44px target. Secondary hero action uses the outline button style on dark (`border-hero-foreground/40`, `focus-visible:ring-hero-accent`).
- **Header:** sticky, solid, crest + wordmark, six navigation items from `min-[1150px]` (custom breakpoint; Armenian nav labels need ~1090px) — Services and Experts link to their `/services` and `/team` pages, the other four are homepage section anchors resolved to `/{locale}#section` so they work from any page — plus a functional language selector and a Contact CTA. The Experts item replaced «Թիմ/Team» (owner decision, Oct 2026): labels «Փորձագետներ/Experts/Эксперты» (Armenian wording switched from the transliteration «էքսպերտ» to the native «փորձագետ», owner decision, Oct 2026 — use «փորձագետ» in all Armenian copy), and the team section is titled «Մեր փորձագետները» (Our experts) with no description line (removed by owner request; `team.description` was deleted from all three locale JSONs and the `ListPage` description became optional). Below that, the compact header keeps the logo, Contact CTA, and a menu disclosure button; the menu contains the navigation and language links. Search was removed entirely (owner decision, Oct 2026) — do not reintroduce a disabled or dead search control. The mobile menu and language switcher are the only header Client Components. Both disclosures close on selection/outside click where applicable and on `Escape`; the mobile menu returns focus to its trigger.
- **Hero:** full-bleed dark band using `public/hero.png` (1672×941, editorial Lady Justice photo) as a `next/image` cover background — decorative (`alt=""`), `priority`, `sizes="100vw"`, `object-[70%_0%]` (top-anchored so locale copy height never shifts the image); a flat `bg-hero` scrim keeps text legible (`/75` below `md`, `/60` at `md`, `/35` at `lg`). No gradient overlays. The band is at least the viewport height below the sticky header (`min-h-[calc(100svh-4rem)]`, `sm:min-h-[calc(100svh-5rem)]`) and the stat strip is pushed to the bottom (`mt-auto`) so every locale fills the fold identically. Uses the shared page container (60px gutters from `lg`, `120rem` cap from `2xl`). Serif h1; muted supporting copy; two buttons (primary `Explore services` and outline `See our process`, both real anchors). The AI-preview card was removed from the hero until the assistant exists — do not reintroduce it without approved content. The stat strip sits above the bottom edge with client-provided figures (`25+` years of experience, `10000+` completed examinations, `98%` client satisfaction, `30+` directions); the fifth slot (Partners) stays an `XX` placeholder until approved. Never invent or alter figures. On load, the copy column enters as a cascade (h1 → lead → CTAs → stat strip, 80ms stagger, `motion-rise` with `--motion-delay`) and the numeric stat figures count up once (`components/home/stat-counter.tsx`, the only hero Client Component); both are disabled under `prefers-reduced-motion`.
- **Service index:** the eight expertise directions as a typographic index — hairline rows (`divide-y`) with a mono number (`01`–`08`, 11px, tracked), serif 18px title, and a one-line muted description that joins as a third column from `lg` (`minmax` columns keep long Armenian titles wrapping cleanly). Rows are not links; hover tints only the number to `--primary` (150ms) — no arrow, lift, or shadow affordances. No icon boxes: the hierarchy comes from type and hairlines (§1.3), which is also the anti-template direction for this section. The homepage index ends with an `ActionLink` (`services.action`, «View all services») to `/[locale]/services`, which renders the same index (shared `components/service-index.tsx`) under the section heading as a real content page without a preparation note.
- **Editorial sections:** process (five numbered steps with icons, `ol`/`li` semantics, dashed Desktop connectors), two featured blocks (image-led card + deep burgundy card), four case cards (draft practice examples with demo stock photos), a client definition table (serif audience term + muted description in hairline `dl` rows), four team cards (demo stock portraits) — each card is a single stretched link to the profile stub (`absolute inset-0` overlay; accessible name from an sr-only span built from `team.cardAction` + the person's name — `cardAction` renders nowhere visible), the only visible affordance being the solid `bg-background` circular arrow at the portrait's top-right (hairline border, brand arrow, border tints `--primary` on hover); hover = image zoom 1.05 + arrow tint + card lift to `shadow-md` (300ms), no text underline; practice-area chips and per-person stat lines from the reference were deliberately not adopted (invented demo data and template pills), three testimonial pull-quotes (serif quote with a left hairline; no avatars, icons, or numeric ratings — draft quotes must not carry a fake rating signal; the `ratingLabel`/`imageLabel` JSON keys remain for locale structure but render nothing), three horizontal news cards (demo stock photos), and a text-only partner-sector hairline grid (uppercase tracked labels; no icon placeholders pretending to be logos — real logos only after client approval). Section "view all" and card actions are real links (`ActionLink`) to the section subpages; the subpages show a visible preparation note instead of full content. Editorial link-cards (cases, team, news) hover: the image scales to 1.05 inside its `overflow-hidden` frame (300ms) and the serif title draws a 1px `--primary` underline (200ms). The process, cases, and team sections reveal once on scroll — heading block first, then the staggered card grid (§7 Motion); no other sections scroll-reveal.
- **Footer:** compact four-column band at `lg` (brand, navigation, services, contacts; stacked below `sm`) on the deep burgundy `bg-brand-deep` surface (owner request, Oct 2026) with a `border-hero-border` hairline top border, hero text tokens throughout (`hero-foreground` headings, `hero-muted` body/links, `hero-accent` brand links and focus rings — `--primary` fails on this surface). Brand column: crest **on a light `bg-background` plaque with padding** (the black-line artwork may never sit directly on a dark surface) + wordmark + approved company description (founded 30 Oct 2000, 25+ years) + center descriptor + small non-interactive Facebook / Instagram / LinkedIn placeholders (inline brand SVGs — lucide ships no brand icons; `border-hero-border` squares) with a pending caption. Link columns use 12px rows — 44px touch targets below `lg`, compact 24px rows from `lg` — and the services column ends with a `text-hero-accent` "All services" link. Contacts render as icon rows (MapPin, Phone, Mail, Clock) with phone/email as `tel:`/`mailto:` links. Bottom hairline row: copyright `© 2000–2026 ANIKOM LLC` + preview note. Contact details are client-provided — never invent or alter them; add no social or legal links until real destinations exist.
- **Contact page (`/[locale]/contact`, owner reference, Oct 2026):** dark hero band (breadcrumb + H1, `/hero.png` as a faint `opacity-15` texture, same treatment as the ContactCta banner), a hairline contact-details strip — one `gap-px bg-border` grid of four cells (phone, email, office, hours with Phone/Mail/MapPin/Clock icons), not floating cards — then a two-column band (`3fr/2fr`): the inquiry form in a bordered `bg-card` panel and a Google Maps embed (no API key, `output=embed`, Latin address query) stretching to the column height, closed by the shared ContactCta banner. **All facts render `footer.contacts` — the page JSON carries no contact details**, only titles and form copy; the header/footer «Կապ» nav items link `/contact` (was a homepage anchor). Reference items deliberately not adopted: WhatsApp CTA, second phone, parking/FAQ content (invented facts), and a privacy-policy link (no document exists).
- **Forms:** native controls styled to the token system (the experts-directory precedent, not generated Base UI parts): visible `text-sm font-medium` labels, `h-11` `border-input` fields with `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring`, `aria-invalid:border-destructive`, inline errors as `role="alert"` `text-destructive` notes, 44px targets. The contact form is a Client Component (`components/contact/contact-form.tsx`) with no backend in the MVP — a valid submit composes a `mailto:` to the office address with the localized subject and body (name, phone, optional email, message; the service select feeds the subject), first invalid field is focused on failed validation. Required fields are marked with `*`; the note above the form tells the visitor their email application opens.

## 7. States

- **Hover:** primary button `bg-primary-hover` (AA); nav/links color shift; service index rows tint their number to `--primary` (§6); cases/news link-cards zoom their image and underline the title in `--primary` (§6); team cards are single stretched links — image zoom, arrow-circle tint, and `shadow-md` lift, with no text underline; arrow icons inside CTA buttons, `ActionLink`s, and the footer "All services" link shift 2px right (`group-hover/button:translate-x-0.5`, 150ms). Static blocks without their own link (clients, partners, testimonials) do not react.
- **Motion:** purposeful motion only — state feedback and one-time entry reveals. No ambient loops, parallax, autoplay carousels, or cursor-following effects. Budgets: color/state transitions 150–200ms; entry reveals ≤450ms ease-out (`cubic-bezier(0.22, 1, 0.36, 1)`, 8px rise); image zooms 300ms; the hero stat count-up runs ≤900ms after a 240ms start that matches the strip reveal. Implementation: the `.motion-rise` utility (load-time cascade, staggered via `--motion-delay`) and the `[data-reveal]` / `.reveal-stagger` rules (scroll-triggered) in `app/globals.css`, driven by the `Reveal` Client Component (`components/reveal.tsx`) — IntersectionObserver, one-shot, children stagger 60ms apart; SSR renders content visible and the hidden state is applied only after hydration, so crawlers and no-JS clients never lose content. Everything is gated behind `prefers-reduced-motion: no-preference` / a `matchMedia` check, and content must be fully present without any animation. No motion library without explicit approval. Scroll-reveal is approved for the process, cases, and team sections and for the expert-directory chips and card grid (the `/team` catalog surface, Oct 2026).
- **Route transitions (Oct 2026):** every route change plays a "dossier stack" transition via React's built-in `<ViewTransition>` (no library; works in the App Router automatically with React 19.3 + Next 16). Forward navigation raises the incoming page over the outgoing one — the old page settles down 12px and fades out in 160ms ease-in while the new page rises 40px in 420ms on the house ease-out curve, its 180ms fade starting 90ms in; back navigation mirrors it — the top page lifts away upward (200ms ease-in) and the page beneath is revealed (fade + 8px settle, 420ms). Vertical direction encodes hierarchy: up is arrival, down is departure — a stack of documents, not sliding cards. The sticky header is a named group (`view-transition-name: site-header`) with suppressed animation, so it holds still as the fixed anchor while content moves beneath. Implementation: the `<ViewTransition>` wrapper in `components/page-shell.tsx` plus the `::view-transition-old/new(.page-forward|.page-back)` keyframes in `app/globals.css`. All internal links are `<Link>` (client-side navigation + prefetch): drill-in links carry `transitionTypes={["forward"]}` (cards, section CTAs, header/footer/mobile nav), up-the-hierarchy links carry `["back"]` (BackLink, breadcrumbs). Untyped navigations do not animate: language switches swap instantly (React skips the transition when the root `<html>` attributes change — a platform limitation, and still an improvement over the former full page reload), browser back/forward buttons swap instantly, and hash-only links scroll natively without a transition. Above-the-fold `Reveal` instances skip their entrance on route arrivals (`components/reveal.tsx`) so the hidden→shown flip never competes with the page transition. The `::view-transition` overlay passes pointer events through, and under `prefers-reduced-motion: reduce` all transition animations collapse to 0s. Browsers without the View Transitions API swap pages instantly — pure progressive enhancement; content is never hidden by the transition.
- **Focus:** never removed. Global outline color is `--ring` at full opacity; buttons use `focus-visible:ring-3 focus-visible:ring-ring` plus `border-ring`. Ring is visible on light and dark (brand 3.52:1 on hero ≥ 3:1 UI minimum; use `hero-accent` rings on dark if a stronger indicator is needed).
- **Active:** `translate-y-px` on buttons; no bounce/scale.
- **Disabled:** `disabled:opacity-50 disabled:pointer-events-none` + semantic attribute.
- **Loading:** disable + in-place spinner; no layout shift.
- **Error:** destructive token, message beside the field, cause + recovery, focus first invalid field.

## 8. Responsive

- Mobile-first; verify 375px without horizontal scroll.
- Header: full navigation and the language dropdown appear from `min-[1150px]`; below it the logo, Contact CTA, and menu disclosure stay in the compact header (the Armenian nav row does not fit at `lg` 1024 — measured ~1090px minimum). The menu panel contains navigation and language links, is full-width and scrollable, and must remain usable at 375px.
- Hero: copy, then the five-stat strip pinned to the bottom; the photo background stays cover-cropped and top-anchored behind them and is never replaced by a solid band. Shorter copy (en/ru) absorbs the extra space between the CTAs and the stats — never as white space below the hero. Case/team grids 2 columns on mobile and 4 from `lg`; news cards 1 → 2 (`sm`) → 3 (`xl`); service cards 1 → 2 (`sm`) → 4 (`lg`).
- Contact CTA is a compact contained banner (owner reference, Oct 2026): a `rounded-2xl` `bg-brand-deep` panel inside the shared page container — not full-bleed — with the hero photo as a faint decorative texture (`opacity-15`, `object-[70%_0%]`, `alt=""`); copy (serif heading + muted line) left, two actions right (`lg:items-center` single row, stacked on mobile): white `bg-background` button with `text-primary` label (Call) and solid `bg-primary` button (Write, white on `--primary` is 5.5:1 AA). The `contact.eyebrow` and `contact.note` JSON keys render nowhere; contact details live in the footer column. This is the one approved rounded panel exception to the square-editorial-surfaces rule.
- Touch targets ≥44px on touch layouts (nav links, CTAs, footer links use `min-h-11` below `lg`; footer link rows compact to 24px from `lg`; icon-only controls are 44px).
- Body text ≥16px on mobile; line length 35–60 chars mobile, 60–75 desktop.
- Armenian and Russian copy is longer than English. Long words use `overflow-wrap: break-word`; the Armenian hero uses soft hyphens at narrow widths. Re-test all three locales; never assume the English row widths hold.

### Localization and locale routes

- Locale-prefixed routes: `/hy` (default), `/en`, `/ru`. `/` redirects to `/hy` in `next.config.ts`; no middleware/proxy is needed for this route set. Invalid locale segments resolve through page-level `notFound()` and return 404.
- All homepage, navigation, footer, metadata, and UI copy lives in `data/home.hy.json`, `data/home.en.json`, and `data/home.ru.json`. The typed loader is `lib/home-content.ts`; the JSON structures must stay identical. Components must not contain user-facing copy other than the Anicom wordmark.
- Locale config and URL helpers live in `lib/i18n.ts`. The language switcher preserves the current pathname for routes matching a pattern in `localizedRoutePatterns` (`/`, `/services`, `/cases`, `/team`, `/news` and their `/:slug` details; `:param` matches one segment); otherwise it falls back to the localized homepage. Register new localized routes there.
- `<html lang>`, document titles, metadata, canonical URLs, and hreflang links are generated per locale. Set `NEXT_PUBLIC_SITE_URL` in production so canonical/hreflang URLs are absolute.
- The language selector is functional in both the desktop header and the mobile menu; no search control exists.

## 9. Accessibility

- WCAG 2.2 AA: text ≥4.5:1, UI ≥3:1 (see verified table §2).
- Layout includes a skip link (`#main`), `header`/`main`/`footer`/`nav` landmarks, one `h1`, sequential headings, and `aria-label`s on navigation regions.
- Keyboard: visible focus everywhere; anchors and buttons reachable in order; no focus traps without Base UI's own handling.
- Images: decorative crest uses `alt=""` inside labeled Anicom lockups; the full-bleed hero image is decorative (`alt=""`); editorial imagery (featured, cases, team, news) uses demo stock photos from `public/images/` with descriptive alt text from the locale content — replace with real client photography before production.
- Color never the sole signal; error and active states include text/icon.
- No animation is required for comprehension; all motion follows the §7 "Motion" budget (states 150ms, entry reveals ≤450ms) and is disabled under `prefers-reduced-motion`.
- Verify contrast after any token change; rerun the §2 pairs.

## 10. Adding or modifying shadcn components

1. Generate via `pnpm dlx shadcn@latest add <name>` using existing `components.json` (style `base-vega`). Do not rerun `init` or overwrite configuration.
2. Base UI only — generated files import `@base-ui/react/*` and `cn`; reject Radix code.
3. Project-level overrides must be deliberate and documented here (example: Button hover/ring). Do not fork components casually.
4. New tokens go in `app/globals.css` under `@theme inline` + `:root`/`.dark`; update this document in the same change.
5. Run the verification suite after any component or token change.

## 11. Content integrity

- Official inputs: brand color `#A54686` and the client-provided company profile — the company is «ԱՆԻԿՈՄ» ՍՊԸ, a **center for research and judicial examinations** founded 30 Oct 2000, working in eight directions: judicial examinations; construction-technical examinations; property valuation; auto-technical examinations; economic & accounting examinations; document research; geodetic & cadastral works; damage assessment. The client's Armenian company description (Oct 2026) is the source for hero, services, process, featured, and clients copy.
- The crest at `public/logo.png` is an AI-generated placeholder and does **not** carry official service names; do not derive content from its ribbons.
- **Draft demo data (authorized by the project owner for the MVP client preview, Oct 2026):** team profiles and portraits (except the director name found in public directories), the eight additional expert-roster entries added for the expert directory (names, roles, directions, experience figures, Pexels demo portraits), testimonials and their authors, news articles and dates, case examples and their dates, the partner-sector labels, the `40+` partners figure, and all editorial stock photos in `public/images/` are invented placeholders for the demo. They are NOT verified facts — replace all of them with real, client-approved data and photography before the site goes public.
- Provisional copy (needs client approval): hero framing, one-line scope descriptions on service cards, process steps, and the featured/clients copy. Company name, founding date, experience claim, contacts, and copyright are client-provided and approved.
- Never invent Anicom facts, addresses, phone numbers, emails, project counts, testimonials, or awards. Placeholder sections must be visibly marked as placeholders (specific labels, `XX` metric values, "Preview"/"Soon" chips) and must never present mock people, ratings, news, or logos as real.
- All page copy now lives in `data/home.{hy,en,ru}.json` and is loaded by `lib/home-content.ts`. Any copy change must be made in all three files, and the Armenian/Russian drafts still require native review. Keep the JSON structures identical and mark placeholder content in every language.

## 12. Open items

- Contact details / enquiry destination: not supplied — the contact banner uses real section anchors; its copy and footer placeholders state that details are pending.
- Replace the AI-generated placeholder crest (`public/logo.png`) with the client's official coat of arms before production; re-check clear space, plaque, and minimum-size rules after replacement.
- Address check: online directories (pages.am, construction.am) list Movses Khorenatsi 201/2; the site uses the client-approved Abovyan 20/12 (office 4) address — confirm which is current with the client.
- Approved copy, imagery, team profiles, testimonials, partners, and native review of the Armenian/Russian translations: pending; hero, services, process, featured, and clients copy now follow the client's Armenian company profile but still require native review. Current team/testimonials/news/partners sections are explicitly marked placeholders.
- Search: removed from the header and mobile menu (owner decision, Oct 2026); revisit only together with a real search destination.
- Section subpages (`/cases`, `/team`, `/news` + `[slug]` details) are navigation stubs with a visible preparation note — replace with real content before production; the `pageInProgress` strings still need native Armenian/Russian review.
- Production canonical/hreflang URLs require `NEXT_PUBLIC_SITE_URL`; the local fallback is `http://localhost:3000`.
- Header metadata now reads the expertise-center wording per locale (e.g. "Anicom — Judicial Examinations, Valuation & Research"); confirm wording with the client.
- Favicon is still the Next.js default.
- Logo source (2.5 MB PNG): produce an optimized master before production.
- Dark mode: tokens exist but no theme provider is enabled (intentional; light is pinned with `color-scheme: light`).
- Visual QA was completed in-browser against the production build for `hy`, `en`, and `ru` at 1440, 1280, 1024, 768, and 375px, including `/` redirect, 404, metadata, and language switching. Repeat after content changes and after native translation review.

# Performance report

Measured 2026-11-06 on the local production build (`next build && next start`), Lighthouse 12.8.2, headless Chromium, mobile form factor. Local measurements exclude CDN/edge effects; re-measure on the production domain and check field data (CrUX / Search Console Core Web Vitals) once real traffic exists.

## Lighthouse – simulated throttling (Lighthouse default, Moto G Power / slow 4G)

| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS | FCP |
|---|---|---|---|---|---|---|---|---|
| `/` | 95 | 100 | 100 | 100 | 2.9 s | 40 ms | 0 | 1.0 s |
| `/leistungen/privatumzug-graz` | 96 | 100 | 100 | 100 | 2.7 s | 30 ms | 0 | 0.9 s |
| `/blog/umzug-graz-checkliste` | 96 | 100 | 100 | 100 | 2.8 s | 40 ms | 0 | 0.9 s |
| `/kontakt` | 97 | 100 | 100 | 100 | 2.5 s | 100 ms | 0 | 0.8 s |

## Lighthouse – applied DevTools throttling (real slow-4G + 4× CPU)

| Page | Performance | LCP | TBT | CLS | FCP |
|---|---|---|---|---|---|
| `/` | 89 | 2.3 s | 300 ms | 0 | 2.3 s |
| `/blog/umzug-graz-checkliste` | 93 | 2.2 s | 220 ms | 0 | 2.2 s |

Unthrottled observed LCP on `/`: 257 ms (LCP = FCP).

### Reading the numbers

- **LCP:** The LCP element is the hero paragraph (text), not an image. With applied throttling LCP is 2.2–2.3 s (target ≤ 2.5 s met). The simulated model reports 2.5–2.9 s because it treats the preloaded font files as render dependencies for text even though the body font uses `font-display: optional`. Field data will decide; the remaining critical path is HTML (22 KB) + CSS (9 KB) + two fonts (~70 KB).
- **CLS:** 0 on all pages (all images have fixed aspect ratios; fonts use metric-matched fallbacks).
- **INP:** cannot be measured in the lab. TBT (proxy) is 30–100 ms simulated, 220–300 ms under 4× CPU slowdown. Interactive JS is minimal: only the navigation (active link + mobile panel), the consent dialog and the enquiry form (`/kontakt`) are client components; everything else is static server-rendered HTML.

## What was done

- All 23 HTML pages are prerendered static HTML (`○` in the build output); only `/api/anfrage` and `/api/gone` run on demand.
- No third-party scripts, no external requests at all (verified in `tests/e2e/responsive.spec.ts`).
- Fonts self-hosted via `next/font`, Latin subset only (dropped `latin-ext`: −2 font files), body font `display: optional`.
- Images: WebP sources, served as AVIF/WebP with responsive `srcset` via `next/image`; hero image preloaded, everything below the fold lazy-loaded; immutable caching for `/images/*`.
- Mobile navigation is a small client component on a native `<dialog>` (slide-in panel); FAQ accordions are native `<details>`; hero quick-start is a plain GET form.
- One CSS file (9 KB transferred), no animation library; a single entrance animation on the hero ticket, disabled under `prefers-reduced-motion`.
- Total transfer of the homepage: ~312 KB (of which ~150 KB is the Next.js/React runtime).

## Remaining issues / ideas

| Issue | Impact | Option |
|---|---|---|
| Framework JS (~150 KB) drives TBT under heavy CPU throttling | Low–medium | Accept; or drop `partialPrefetching` if RSC prefetch requests show up in INP field data |
| Hero image is preloaded although it sits below the text on phones | Low (≈30 KB) | Could preload only above `lg` via a `media` attribute if mobile LCP data shows contention |
| Lighthouse "unused JavaScript" ~26 KB | Low | Part of the framework chunk |
| Field data | Unknown | Check Search Console → Core Web Vitals 28 days after launch |

## Re-check after redesign (Poppins, new hero, motion layer)

Homepage, same setup: Performance 92, Accessibility 100, CLS 0. LCP 2.0 s with applied throttling (2.9 s simulated), TBT 190–260 ms. LCP element is still the hero paragraph.
Motion is CSS-only (scroll-driven `animation-timeline: view()`, `::details-content`, React `<ViewTransition>` page crossfade) and fully disabled under `prefers-reduced-motion`; heroes are excluded from scroll reveals so they never delay LCP.

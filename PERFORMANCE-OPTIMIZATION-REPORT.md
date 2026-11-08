# Performance optimisation report – Phase 2

All numbers are **lab data**: local production build (`next build && next start`), Lighthouse 12.8.2 (same version as Phase 1), headless Chromium, default simulated throttling (mobile = Moto G Power / slow 4G; desktop preset), **median of 3 runs** per page. No CDN, so TTFB is near zero and not representative of production. Real Core Web Vitals come from field data (CrUX / Search Console), which does not exist yet because the site is not live. INP cannot be measured in the lab; TBT is the proxy.

## What changed and what it did

### 1. Service copy removed from every page's JavaScript (measured in isolation)

`components/Nav.tsx` is a client component and imported `content/services.ts` just to render seven link labels, so the full text of all service pages was bundled into the shared client chunk. Now `Header` (server) passes `{ slug, name }` as props.

Measured by building twice from the same tree, with and without the change, summing gzip-9 sizes of the scripts each page loads:

| Page | Before | After | Saved |
|---|---|---|---|
| `/` | 199,768 B | 187,861 B | 11.9 KB (−6.0 %) |
| article | 199,768 B | 187,861 B | 11.9 KB |
| `/kontakt` | 205,811 B | 193,904 B | 11.9 KB |

Shared layout chunk: 72 KB → 36 KB raw. Less JS to download, parse and hydrate on every page, which matters most on low-end phones.

### 2. Layout shift on article and service pages removed (CLS 0.21 → 0)

Phase 1 wrapped `await params` on the dynamic pages in `<Suspense>`. Under Cache Components this made the prerendered HTML contain the 70vh fallback first, the real content hidden at the end of the document, and an inline script (`$RC`) that swapped it in after load. Lighthouse attributed a 0.211 shift to the footer jumping down.

Two options were tested (Next.js offers both for its dev-only "URL data outside of Suspense" insight, which appears once Suspense is removed):

| Option | Result |
|---|---|
| Keep Suspense, make the fallback ≥ one viewport tall (`min-h-[100svh]`) | CLS 0 in 12/12 Lighthouse runs, **but** React's inline reveal script swaps the content in via `requestAnimationFrame`, a ~300 ms batching timer and `document.startViewTransition` (because the layout wraps pages in `<ViewTransition>`), waiting for fonts and visible images. The article text is in the HTML yet hidden behind the placeholder until that swap runs: in background tabs and on busy devices it is delayed. It also made the Playwright suite fail intermittently (4 tests timing out under parallel load). |
| **Chosen:** no Suspense, `export const instant = false` on `/blog/[slug]` and `/leistungen/[slug]` | Content painted directly from the HTML, CLS 0, suite green on repeated runs, dev warning resolved. Cost: a client-side click into an article or service waits for its static (CDN-cached) RSC payload instead of first showing an empty shell. For a reading site that is the better trade. |

`<html data-scroll-behavior="smooth">` was added at the same time (Next.js dev warning: lets the router disable smooth scrolling during route changes).

| Mobile, median of 3 | Before | After |
|---|---|---|
| `/leistungen/entruempelung-graz` CLS | 0.211 | **0.000** |
| `/leistungen/entruempelung-graz` Performance | 85 | **96** |
| `/blog/umzugsangebot-vergleichen` CLS | 0.211 | **0.000** |
| `/blog/umzugsangebot-vergleichen` Performance | 86 | **90** (median of 8; see below) |

Side effect handled: unknown slugs (`/blog/xyz`) used to receive the prerendered shell with **HTTP 200** (a soft 404, pre-existing since Phase 1). `dynamicParams = false` is not available with Cache Components, so `next.config.ts` now rewrites any slug not in the content lists to a non-existent path at routing level: real 404 with the branded page, no function call, no cost for valid pages. Tested.

### 3. Other Phase 2 items with performance relevance

- New images: 10 WebP sources ≤1600 px (43–226 KB), served via `next/image` as AVIF/WebP with responsive sizes; featured image is `preload` (LCP element on articles), everything below is lazy. Fixed aspect ratios, so no shift.
- Tables: CSS only, no library. Markdown renderer extended by ~15 lines instead of adding a Markdown dependency.
- `llms.txt`, RSS: prerendered static files, no runtime cost.
- No new dependencies. No third-party scripts (still zero external requests, tested).

## Final lab results (after all changes)

| Page | Form | Perf | A11y | BP | SEO | LCP | FCP | TBT | CLS | Transfer | JS | Requests |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | mobile | 96 | 100 | 100 | 100 | 2.78 s | 0.91 s | 70 ms | 0 | 281 KB | 159 KB | 23 |
| `/leistungen/entruempelung-graz` | mobile | 96 | 100 | 100 | 100 | 2.75 s | 0.91 s | 69 ms | 0 | 300 KB | 159 KB | 25 |
| `/blog/umzugsangebot-vergleichen` | mobile | 90 | 100 | 100 | 100 | 2.93 s | 0.91 s | 270 ms | 0 | 280 KB | 159 KB | 25 |
| `/kontakt` | mobile | 96 | 100 | 100 | 100 | 2.76 s | 0.91 s | 75 ms | 0 | 240 KB | 159 KB | 20 |
| `/` | desktop | 100 | 100 | 100 | 100 | 0.65 s | 0.25 s | 0 ms | 0 | 324 KB | 159 KB | 27 |
| `/blog/umzugsangebot-vergleichen` | desktop | 100 | 100 | 100 | 100 | 0.61 s | 0.25 s | 1 ms | 0 | 296 KB | 159 KB | 27 |

Individual mobile Performance runs: home 95/96/96, service 96/92/96 (final build: 96/92/94), contact 96/96/96. Article on the final build, 8 runs: 88/92/89/89/83/90/91/90, TBT 201–458 ms; an earlier session on equivalent code gave 93/96/93 (TBT 159 ms). The spread comes from TBT on this machine; article pages carry the largest DOM and RSC payload, so their hydration cost is the most sensitive to CPU load. CLS was 0 in every run. Raw reports: `.shots/lh2/*.json`. ("JS" is Lighthouse's transfer size for scripts, compressed by the server; the gzip-9 sums above are a stricter build-side measure.)

### Reading the numbers against the targets

- **CLS ≤ 0.1:** met everywhere (0).
- **LCP ≤ 2.5 s:** desktop 0.6 s. Mobile simulated LCP is 2.75–2.8 s, as in Phase 1 (2.7–2.9 s). The LCP element on home/service/contact is a paragraph of text; Lighthouse's simulation counts the two preloaded font files as render-blocking for text even though the body font uses `font-display: optional` (falls back instead of waiting). Phase 1 measured 2.0–2.3 s with real (DevTools) throttling. Treat ≤2.5 s as likely but unproven until field data exists.
- **INP ≤ 200 ms:** cannot be measured in the lab. TBT 70–160 ms under 4× CPU simulation; interactive JS is limited to nav, consent dialog, map click-to-load and the contact form.

## Remaining opportunities (not done, with reasons)

| Idea | Expected effect | Why not now |
|---|---|---|
| Subset Poppins further or drop to 3 weights | ~10–20 KB fonts | All 4 weights are used in the design; dropping one changes typography. Revisit if field LCP > 2.5 s |
| `preload` hero only above `lg` | small on mobile | LCP on mobile is text, not the image; gain unproven |
| Turn off the React `<ViewTransition>` page crossfade | less JS work on navigation | A design choice from Phase 1; no INP evidence against it yet |
| Framework JS (~150 KB of the 159 KB) | – | Next.js/React runtime; not reducible without dropping client navigation |
| Bundle analyzer dependency | – | Chunk contents were inspected directly; not worth a dependency |

## After launch

1. Re-run Lighthouse on `https://dieanpacker.at` (CDN, real TTFB, HTTP/2 or 3).
2. PageSpeed Insights / CrUX once the origin has enough traffic; Search Console → Core Web Vitals after ~28 days.
3. Vercel: keep the Firewall rate-limit rule for `POST /api/anfrage` (see IMPLEMENTATION-REPORT.md).

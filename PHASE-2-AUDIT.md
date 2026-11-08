# Phase 2 audit – dieanpacker.at

Audited 2026-11-08 on the Phase 1 codebase (Next.js 16.4.5, React 19.3, Tailwind 4, Cache Components, 23 prerendered pages, 8 articles). Baseline production build: successful, 33 static outputs. Phase 1 documents (IMPLEMENTATION-REPORT, SEO-RESEARCH, PERFORMANCE-REPORT, EXISTING-SITE-AUDIT, CLIENT-VERIFICATION-REQUIRED, ASSETS) were read first; this file only lists what Phase 2 found and changed.

Overall: Phase 1 is a clean, honest, fast build. Most findings are about content depth, internal linking and snippet hygiene, plus one real performance bug.

## Findings

| # | Area | Finding | Severity | Action (status) |
|---|---|---|---|---|
| 1 | Performance | `components/Nav.tsx` (client component) imported `content/services.ts`, so **all seven service pages' copy (~72 KB raw / 25 KB gzip) shipped as JavaScript on every page**, only to render seven link labels in the mobile menu. | High | Service names/slugs now passed as props from the server `Header`. Shared client chunk 72 KB → 36 KB raw (≈25 → 13 KB gzip). Fixed. |
| 2 | Content | 8 articles; several high-intent topics uncovered (comparing quotes, Graz-Umgebung, flat clearance before handover, cellar/attic, disposal routes, urgent moves, business address change, preparing furniture, moving in old age, final-week plan). | High | 10 new articles, 18 total. Done. See CONTENT-EXPANSION-REPORT.md. |
| 3 | Internal linking | Article "Weiterlesen" showed the **first two articles of the same category**, so several articles were never linked from any other article; only 4 article→article links existed in body text. Service pages linked 1–2 articles each. | High | Hand-picked related map (3 per article, cross-category where relevant), service pages link every article in their cluster, contextual in-body links added to 5 original articles. Done. |
| 4 | Snippets | Most titles exceeded ~60 chars after the automatic ` \| Die Anpacker` suffix (up to 73); 13 descriptions exceeded 160 chars (up to 186 on the homepage). | Medium | `pageMeta` drops the suffix when it would overflow; all descriptions rewritten to ≤158 chars. New test enforces ≤65 / ≤160. Done. |
| 5 | Cannibalisation risk | Suggested topic "Firmenübersiedlung planen: Checkliste" duplicates the intent of existing `/blog/firmenumzug-graz-planen`. Suggested "Wohnung räumen" and "Entsorgung" overlap the existing Entrümpelung article. | Medium | Article 14 re-scoped to address change/authorities; articles 11 and 16 given distinct intents (handover; disposal routes). See TOPICAL-AUTHORITY-MAP.md. |
| 6 | Indexing | `robots.txt` disallowed `/kontakt/danke` while the page also sends `noindex`. A disallowed URL can't be fetched, so the noindex is never seen and the URL can still be indexed from links. | Low | Disallow removed; noindex kept. Test added. |
| 7 | Structured data | Graph lacked `WebPage` nodes and breadcrumb IDs; no `Blog` node; Organization had no `contactPoint`; articles lacked `isPartOf`, `articleSection`, `citation`. | Low | Added (all values from visible content). IDs cross-checked by test. |
| 8 | AI readability | No `llms.txt`, no feed. Phase 1 decided against llms.txt. | Low | Added a generated `llms.txt` (built from the same data as the pages, so it cannot diverge) and an RSS feed with discovery link. Neither is claimed as a ranking factor. |
| 9 | Freshness | Sitemap used one hard-coded date for every non-article page. | Low | Content pages 2026-11-08, legal/about 2026-11-06, articles use `updated ?? date`. |
| 10 | Homepage AEO | Homepage FAQ did not answer "Was kostet ein Umzug in Graz?" or "Kann ich Fotos schicken?" (both in the brief's question list). | Low | Two FAQ entries added. |
| 11 | Sources | One article linked the English Holding Graz page. | Low | Switched to the German page (verified 200). |
| 12 | Tables | Markdown renderer had no tables; comparison content would have been prose-only. | Low | Pipe tables added, labelled + keyboard-focusable, stacked layout on phones (no sideways scroll). |
| 13 | Rendering | Article/service pages used a `<Suspense>` fallback around `params`: static HTML painted a 70vh placeholder and a script swapped the content in later (CLS 0.21 on mobile; reveal gated by animation frames and a view transition). Found by Lighthouse after the first Phase 2 build. | High | No Suspense on these two pages, `export const instant = false` (documented opt-out for the dev-only instant-navigation check). CLS 0. Fixed. |
| 14 | Routing | Unknown slugs (`/blog/xyz`) returned HTTP 200 with the 404 content (soft 404); `dynamicParams=false` is unavailable with Cache Components. | Medium | Routing-level rewrite of unknown slugs to a real 404 in `next.config.ts`. Fixed, tested. |

## Checked and found fine (no change)

- All 23 → 26 public pages prerendered as static HTML; article/service routes show `◐` only because the dynamic param shell exists; every slug has full HTML (verified: 18 article HTML files, each containing body and FAQ).
- Zero third-party requests; consent manager blocks optional tracking (none configured).
- Fonts: one family (Poppins), 4 weights, latin subset, `display: optional`, self-hosted. Kept; all four weights are used.
- Images: `next/image`, AVIF/WebP, responsive sizes, hero `preload`, below-the-fold lazy, fixed aspect ratios (CLS 0).
- Security headers, CSP, rate limiting, attachment validation, honeypot, same-origin check: unchanged and still covered by tests.
- NAP (name, address, phone, e-mail) comes from `lib/site.ts` only; no inconsistencies found across footer, contact, Impressum, JSON-LD, llms.txt.
- No unused dependencies: runtime deps are `next`, `react`, `react-dom`, `nodemailer`, `server-only`. Nothing to remove.
- Redirects/410s for old WordPress URLs still correct (tested).

## Not possible / blocked

- **Google Search Console:** the connected account has no property for dieanpacker.at (only two unrelated sites). No query, indexing or CWV field data. See SEARCH-CONSOLE-AND-SEO-FINDINGS.md.
- **Google Business Profile:** no access; consistency could only be checked against the embed CID.
- **Search volumes:** KeywordTool guest tier returns suggestions without volumes.
- **Deployment / live Lighthouse / field data:** not authorised to deploy; all measurements are local lab data.

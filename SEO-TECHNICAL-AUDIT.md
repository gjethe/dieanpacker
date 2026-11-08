# Technical SEO audit – all indexable URLs

Checked 2026-11-08 on the production build (local). 32 indexable URLs (sitemap = route list, tested) + `/kontakt/danke` (noindex).

## Per-URL checks (automated on every URL, see FINAL-PLAYWRIGHT-TEST-REPORT.md)

| Check | Result |
|---|---|
| HTTP 200 | 32/32 |
| `lang="de-AT"` | 32/32 |
| Exactly one H1 | 32/32 |
| No skipped heading levels in `main` | 32/32 |
| Unique `<title>`, ≤65 chars | 32/32 |
| Unique meta description, 70–160 chars | 32/32 |
| Self-referencing canonical on `https://dieanpacker.at` | 32/32 |
| No `noindex` | 32/32 |
| Valid JSON-LD, no rating/review/price/hours claims | 32/32 |
| All `<img>` with alt and dimensions | 32/32 |
| Internal links resolve 200 without redirect | all |
| No orphan routes | 0 orphans |
| Breadcrumbs (visible + `BreadcrumbList`) | all except home |
| OG/Twitter: type, locale de_AT, title, description, image | all (articles/services use their own image) |

## Inventory

Titles/descriptions are defined in: `app/page.tsx`, `app/*/page.tsx` (hubs, legal), `content/services.ts` (`metaTitle`, `metaDescription`), `content/posts-*.ts` (same fields). The layout template adds ` | Die Anpacker` unless the title would exceed 62 characters (`lib/meta.ts`).

| URL | Title |
|---|---|
| / | Umzugsfirma Graz: Umzug & Entrümpelung \| Die Anpacker |
| /leistungen | Leistungen: Umzug, Entrümpelung & Möbeltransport in Graz |
| /leistungen/privatumzug-graz | Privatumzug Graz: Umzugsfirma für Wohnung & Haus |
| /leistungen/firmenumzug-graz | Firmenumzug & Büroumzug Graz: Übersiedlung planen |
| /leistungen/entruempelung-graz | Entrümpelung Graz: Wohnung, Keller, Dachboden räumen |
| /leistungen/haushaltsaufloesung-verlassenschaft-graz | Haushaltsauflösung & Verlassenschaftsräumung Graz |
| /leistungen/messiewohnung-raeumung-graz | Messiewohnung räumen Graz: diskret & respektvoll |
| /leistungen/moebeltransport-graz | Möbeltransport Graz: Einzeltransport & Möbeltaxi |
| /leistungen/moebeldemontage-montage-graz | Möbelmontage Graz: Abbau & Aufbau von Möbeln \| Die Anpacker |
| /ueber-uns | Über uns: Ihr Umzugsunternehmen aus Graz \| Die Anpacker |
| /kontakt | Kontakt & Angebot anfragen: Umzug und Räumung in Graz |
| /blog | Ratgeber: Umzug, Entrümpelung & Möbeltransport in Graz |
| 18 articles | see `metaTitle` in `content/posts-*.ts`; keyword ownership in TOPICAL-AUTHORITY-MAP.md |
| /impressum, /datenschutz | Impressum \| Die Anpacker, Datenschutzerklärung \| Die Anpacker |

## Changes in Phase 2

1. Brand suffix dropped automatically when a title would exceed ~62 chars (was up to 73).
2. 20 descriptions shortened to ≤158 chars (were up to 196, truncated in results).
3. `robots.txt`: removed `Disallow: /kontakt/danke` so its `noindex` can be read.
4. Sitemap: content-based `lastModified` per URL group; 32 URLs.
5. Structured data extended (WebPage, breadcrumb IDs, Blog, contactPoint, article citation/isPartOf/section/wordCount).
6. RSS feed + `<link rel="alternate" type="application/rss+xml">`; `llms.txt`.
7. Internal linking rebuilt around topic clusters (TOPICAL-AUTHORITY-MAP.md).
8. Tables in articles: semantic `<table>` with `th scope="col"`.

## Unchanged and verified

- Redirects (308) for old WordPress URLs and 410 for demo content (tested).
- Trailing-slash URLs 308 to the slash-less canonical.
- Preview deployments (`VERCEL_ENV=preview`): `noindex` + disallow-all robots, so staging never competes with production. Canonicals use `NEXT_PUBLIC_SITE_URL` (default `https://dieanpacker.at`).
- Rendering: every public page is prerendered HTML; content does not depend on JavaScript.
- Security headers (CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy).

## Known limitations

- No live crawl (site not deployed). Re-run a crawl (e.g. Screaming Frog or the Playwright suite against the live URL by changing `baseURL`) after launch.
- Rich Results Test can only be run against the public URL or pasted HTML.

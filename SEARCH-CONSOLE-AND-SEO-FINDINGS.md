# Search Console and search performance findings

## Status: no Search Console data available

Checked 2026-11-08 with the Google Search Console MCP (`list_sites`). The connected Google account has full access to two unrelated properties and **no property for dieanpacker.at** (neither URL-prefix nor domain). Therefore no queries, impressions, clicks, CTR, positions, indexing status, sitemap status or Core Web Vitals field data could be analysed. No such data is quoted anywhere in the Phase 2 documents.

The site is also not deployed yet (the live domain still serves the old WordPress site), so even with access, the data would describe the old site.

## What was done instead

- Keyword ideas from KeywordTool.io autocomplete (Austria, German) for each new topic; findings in COMPETITOR-AND-SEARCH-ANALYSIS.md.
- Intent separation and URL ownership in TOPICAL-AUTHORITY-MAP.md.
- Snippet hygiene on every URL: titles ≤65 chars, descriptions ≤160, unique (enforced by `tests/e2e/phase2.spec.ts` and `seo.spec.ts`).
- Old-URL handling from Phase 1 kept (308 redirects, 410 for demo content).

## Setup steps once the site is live (client / whoever holds DNS)

1. Add a **Domain property** `dieanpacker.at` in Search Console (DNS TXT record at the domain host). Grant access to the agency account if further analysis is wanted.
2. Submit `https://dieanpacker.at/sitemap.xml` (32 URLs).
3. URL Inspection → "Request indexing" for `/`, `/leistungen`, the 7 service pages and `/blog`.
4. Watch Pages → "Not indexed": the 410 demo URLs and redirected WordPress URLs should drop out within weeks. Anything else listed there needs a look.
5. After ~28 days of traffic: Core Web Vitals report (field data) and Performance report.

## What to analyse after 4–8 weeks of data

| Check | Where | Action if found |
|---|---|---|
| High impressions, low CTR | Performance → Pages/Queries | Rewrite title/description for that URL (the intent map shows what each URL should promise) |
| Page ranks for a query owned by another URL | Performance → Query → Pages | Strengthen the owner page, add a contextual link from the other page with the query as anchor; do not delete either |
| Impressions for towns outside Graz (e.g. "umzug leibnitz") | Queries filtered by town names | Only then evaluate a location page with genuinely distinct content |
| Article impressions but no clicks to services | GA4/visitor analytics if enabled with consent | Review in-article CTAs |
| Non-indexed new articles | Pages report | Check internal links (should not happen: all are linked from /blog, services and related blocks) |

Do not change URLs of indexed pages without a 308 redirect, and do not remove low-traffic articles only because of low traffic.

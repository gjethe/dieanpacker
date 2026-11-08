# Implementation report – dieanpacker.at

Status 2026-11-06: built, tested locally, **not deployed** (no authorisation to deploy).

> **Phase 2 (2026-11-08):** 18 articles (was 8), topic-cluster internal linking, `llms.txt`, RSS feed, extended JSON-LD, snippet-length fixes, client-bundle fix. Details in PHASE-2-AUDIT.md; this report is updated where facts changed. Launch blockers are listed in CLIENT-VERIFICATION-REQUIRED.md.

## Stack

Next.js 16.4 (App Router, Turbopack, Cache Components), React 19, TypeScript, Tailwind CSS 4. Runtime dependencies added: `nodemailer` (SMTP) and `server-only` (keeps mail code out of client bundles). Dev: `@playwright/test`, `@axe-core/playwright`.

## Pages (23, all statically prerendered)

| Route | Purpose |
|---|---|
| `/` | Homepage: hero with quick-start "ticket" form, service index, region, process, quote info, values, focus areas, FAQ, articles, CTA |
| `/leistungen` | Service hub grouped by Umziehen / Räumen / Möbel bewegen |
| `/leistungen/{privatumzug,firmenumzug,entruempelung,haushaltsaufloesung-verlassenschaft,messiewohnung-raeumung,moebeltransport,moebeldemontage-montage}-graz` | 7 service landing pages, each with unique intent and content |
| `/ueber-uns`, `/kontakt`, `/kontakt/danke` (noindex, no-JS fallback) | |
| `/blog` + 8 articles | Ratgeber grouped by category |
| `/impressum`, `/datenschutz` | Legal |
| `/sitemap.xml`, `/robots.txt`, `/icon.png`, `/apple-icon.png` | |
| `/api/anfrage` | Enquiry endpoint |
| `/api/gone` | 410 target for old demo URLs (via rewrites) |

## Where to change things

| What | File |
|---|---|
| Phone, WhatsApp, e-mail, address, legal data, hosting/mail provider names | `lib/site.ts` (single source of truth) |
| Services (texts, FAQs, images, related links) | `content/services.ts` |
| Articles | `content/posts-a.ts` … `posts-d.ts` (Markdown subset incl. pipe tables, rendered by `lib/md.tsx`); related-article links in `relatedMap` in `content/posts.ts` |
| Navigation | `nav` in `lib/site.ts` |
| Colours, type, components | `app/globals.css` (tokens in `@theme`) |
| Structured data | `lib/schema.ts` |
| Redirects, 410 list, security headers, CSP | `next.config.ts` |
| Form fields, validation, upload limits | `lib/anfrage.ts` |
| E-mail layout and transport | `lib/mail.ts` |

## Design

Based on the second Refero reference ("Finn"): white canvas, warm cocoa `#321004` for all text, midnight navy `#161345` for every button and the dark bands (values, pricing, footer, hero quick-start), sky `#D7ECFF` as the main section wash, blush `#FFCFDB` only on the closing call-to-action card, ember `#FF7F00` only for small accents (link underlines, list bullets, focus ring on dark). Fog `#F9F9F9` cards without borders, 1px `#EBEBEB` hairlines, pill buttons and inputs (60px radius), no shadows or gradients. Poppins for headlines and text (one family, for readability). Form fields use a darker outline `#8F827C` than the reference so they meet the 3:1 non-text contrast requirement. No dashes (–) in site copy, at the client's request. The client logo is used unchanged; its navy and orange match the palette.

## SEO / GEO / AEO

- Unique titles/descriptions, self-referencing canonicals, `lang="de-AT"`, `og:locale de_AT`, OG images per page.
- Keyword map in SEO-RESEARCH.md; one primary cluster per URL.
- Direct-answer blocks ("Auf einen Blick") on every service page; question-led FAQs; consistent entity statement (`site.entity`) and NAP everywhere.
- JSON-LD: `MovingCompany` + `WebSite` (site-wide), `Service`, `BlogPosting`, `BreadcrumbList`, `ItemList`, `AboutPage`, `ContactPage`. No ratings, prices, opening hours or geo pin (not confirmed). FAQPage markup deliberately omitted (Google limits FAQ rich results to government/health sites).
- `llms.txt` (Phase 2): generated at build time from the same data as the pages (`app/llms.txt/route.ts`), so it cannot drift from the site. Not a ranking factor. RSS feed at `/blog/feed.xml`.
- Preview deployments (`VERCEL_ENV=preview`) send `noindex` and a disallow-all robots.txt.

## Enquiry form and e-mail delivery

Flow: client validation (shared rules in `lib/anfrage.ts`) → `POST /api/anfrage` (multipart) → server checks → `nodemailer` over authenticated SMTP → `office@dieanpacker.at`.

- **Server checks:** same-origin check, body ≤ 4.5 MB (413), per-IP rate limit (default 5 / 10 min), honeypot + minimum fill time (bots get a silent 200, nothing is sent), full re-validation, max 5 photos / 3 MB each / 4 MB total, JPEG/PNG/WebP/HEIC by MIME **and** magic bytes, control-character stripping, length caps. Photos are processed in memory and only exist as e-mail attachments.
- **Client:** conditional sections per service (transport / clearance / on-site), photos downscaled in the browser to ≤ 1600 px JPEG before upload, double-submit protection, focus moves to the first invalid field, success shown only when the server confirms the provider accepted the message. Errors offer phone/WhatsApp/e-mail. Works without JavaScript (303 redirect to `/kontakt/danke` or back with an error).
- **Mail:** `From: "Website Die Anpacker" <SMTP_USER/MAIL_FROM>` (our own authenticated mailbox), `Reply-To:` the visitor, structured HTML + plain-text body, HTML-escaped values.
- **Failure:** missing config → 503, SMTP error → 502; logs contain only the error type, never enquiry data.

### Deliverability – what is in place and what remains

Current DNS: SPF `include:_spf.mail.hostinger.com ~all`, DKIM `hostingermail-a` published, DMARC `p=none`. Sending through Hostinger SMTP as `office@dieanpacker.at` produces SPF- and DKIM-aligned mail, which addresses the likely cause of the old spam problem (unauthenticated PHP `mail()` from the web host).

Remaining steps (need credentials/DNS access):
1. Set `SMTP_HOST=smtp.hostinger.com`, `SMTP_PORT=465`, `SMTP_USER`, `SMTP_PASS` (see `.env.example`) in the hosting environment. Optionally create a dedicated mailbox `website@dieanpacker.at` and set it as `SMTP_USER`/`MAIL_FROM`.
2. Submit one clearly marked test enquiry ("TEST – bitte ignorieren") on the deployed site; confirm arrival in the inbox (not spam), check that `From` is the domain mailbox and `Reply-To` is the test address, and open "Show original" to confirm `spf=pass`, `dkim=pass (d=dieanpacker.at)`, `dmarc=pass`.
3. Add a DMARC report address, e.g. `v=DMARC1; p=none; rua=mailto:dmarc@dieanpacker.at`; after 2–4 weeks of clean reports move to `p=quarantine`.
4. If Hostinger SMTP limits become a problem, the same code works with any authenticated SMTP relay (e.g. Resend/Postmark SMTP) after adding their SPF/DKIM records.

**Not verified:** no SMTP credentials were available in this environment, so no real e-mail was sent. The full message (including attachments) was built and accepted by nodemailer's JSON transport in tests, and the real SMTP failure path was exercised against a closed port.

## Cookies / consent

The site currently uses **no** consent-requiring technology, so no banner appears (none is legally needed and showing one would imply tracking that does not exist). The consent manager is implemented and reachable via "Cookie-Einstellungen" in the footer (native `<dialog>`, equal-weight buttons, granular category, choice persisted in `localStorage`). If `NEXT_PUBLIC_GA_ID` is set, the banner appears and Google Analytics loads only after opt-in; withdrawing consent reloads the page to unload it. The privacy policy must be extended before enabling analytics.

## Security

Security headers (CSP, HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy), `poweredByHeader: false`, external links `rel="noopener noreferrer"`, JSON-LD `<` escaped, secrets only in server env vars, `server-only` guard on mail code.

Known limitations: CSP allows `'unsafe-inline'` scripts (Next.js inline bootstrap; a nonce-based CSP would force dynamic rendering of every page). Rate limiting is per serverless instance (in-memory) – add a Vercel Firewall rate-limit rule for `/api/anfrage` in production.

## Tests (all passing on 2026-11-06)

- `npm run test:unit` – 9 tests for validation, file checks, magic bytes (`node --test`).
- `npm run test:e2e` – 37 Playwright tests (desktop 1440 px + Pixel 7 mobile project), against two production servers:
  - SEO: every route 200, one H1, unique titles/descriptions, correct canonicals, `lang=de-AT`, valid JSON-LD without banned claims, heading order, image alt/dimensions, no broken internal links, no orphan pages, sitemap = route list, robots.txt, redirects (308) and 410s, security headers.
  - Contact: tel/WhatsApp/mailto links, CTAs, hero quick-start pre-fill.
  - Form: empty submit, invalid e-mail/phone, conditional sections, successful submission with photo, double-click sends once, provider failure shown honestly, API validation, honeypot, unsupported/spoofed/oversized attachments, 413 body limit, cross-origin refusal, 502 on SMTP failure, no-JS redirect.
  - Responsive: no horizontal scroll at 1440/768/390/320 px on 9 key pages, mobile menu, mobile contact bar does not cover content, cookie settings persist, zero external requests.
  - Accessibility: axe-core WCAG 2.0/2.1/2.2 A/AA rules – no serious or critical violations.
- `npm run typecheck`, `npx eslint .`, `npm run build` – clean.
- Lighthouse: see PERFORMANCE-REPORT.md (Accessibility / Best Practices / SEO 100 on all measured pages).

Run everything: `npm run build && npm test`.

## Deployment checklist (when authorised)

1. Vercel project → environment variables from `.env.example` (Production only for SMTP).
2. Domain `dieanpacker.at` (+ `www` redirect to apex) and switch DNS A/CNAME away from Hostinger **without touching MX/SPF/DKIM records**.
3. Add a Vercel Firewall rate-limit rule for `POST /api/anfrage`.
4. Send the test enquiry (above) and check headers.
5. Search Console: verify domain property, submit `https://dieanpacker.at/sitemap.xml`, inspect `/`, a service page and an article; watch the 410/redirect URLs drop out.
6. Google Business Profile: category "Umzugsunternehmen" (+ relevant secondary categories), service area Graz/Steiermark (hide address if no customer visits), website link to `/`, services matching the seven pages, real photos, ask satisfied customers for reviews.
7. Consistent NAP on WKO Firmen A–Z and other directories the client already uses.
8. Re-run Lighthouse on the live domain; check Core Web Vitals in Search Console after 28 days.

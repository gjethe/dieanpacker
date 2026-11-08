# GEO, AEO and AI-search optimisation

Goal: make Die Anpacker easy for search engines, answer engines and generative systems to understand **accurately**. Approach follows Google's AI features guidance (no special markup needed; people-first content and clean indexability are what count) and adds extractable structure that helps non-Google answer engines without changing what visitors see.

## 1. One entity, one set of facts

All business facts come from `lib/site.ts` and are rendered from there into: header, footer, mobile contact bar, contact page, Impressum, Datenschutz, JSON-LD, llms.txt.

| Fact | Value | Where visible |
|---|---|---|
| Name | Die Anpacker | everywhere |
| Type | Umzugs- und Räumungsunternehmen (schema: `MovingCompany`) | home, Über uns, entity sentence |
| Base | Neusiedlergasse 7, 8041 Graz, Österreich, Geschäftsadresse, kein Kundenbüro | footer, contact, Impressum, JSON-LD, llms.txt |
| Area | Graz, Graz-Umgebung, Steiermark; österreichweit nach Absprache | home, every service page "Wo wir das anbieten", JSON-LD `areaServed`, llms.txt |
| Contact | office@dieanpacker.at, +43 660 392 66 62 (phone + WhatsApp) | everywhere, JSON-LD `contactPoint` |
| Services | 7 service pages = 8 brief services (Haushaltsauflösung + Verlassenschaft share a page; Montage/Demontage share a page) | /leistungen, `makesOffer`, `knowsAbout` |

Consistency is enforced by code (single source) and tests (contact links, JSON-LD validity, banned claims).

## 2. Answer-first content (AEO)

| Question from the brief | Where it is answered directly |
|---|---|
| Was kostet ein Umzug in Graz? | Home FAQ (new), /blog/umzug-graz-kosten, each service page "Wie der Preis entsteht" |
| Wie funktioniert ein Umzug mit einer Umzugsfirma? | Home "So einfach kommen Sie zu Ihrem Angebot", service "So läuft es ab" |
| Welche Informationen braucht ein Umzugsunternehmen für ein Angebot? | Home "Ein faires Angebot…", each service "Was wir für das Angebot brauchen", article 9 step 1 |
| Wie läuft eine Entrümpelung ab? | /blog/entruempelung-graz-ablauf, service page |
| Was ist bei einer Verlassenschaftsräumung wichtig? | /blog/verlassenschaftsraeumung-graz |
| Wie wird eine Messiewohnung geräumt? | /blog/messiewohnung-raeumen, service page |
| Wie funktioniert ein Möbeltransport? | /blog/moebeltransport-graz-einzelstuecke, /blog/moebel-umzug-vorbereiten (new) |
| Übernimmt Die Anpacker Firmenumzüge? | Home FAQ, /leistungen/firmenumzug-graz, article 14 FAQ |
| In welchen Regionen tätig? | Home FAQ + region section, every service page, llms.txt |
| Wie kann ich eine Anfrage stellen? | Home FAQ, /kontakt, every CTA band |
| Kann ich Fotos schicken? | Home FAQ (new), article 9 FAQ, contact form (up to 5 photos) |

Pattern used: answer in the first sentences ("Kurz gesagt" block on articles, "Auf einen Blick" on services), then details, context, link to the service, next step. Headings phrased as the questions people type ("Wo fange ich…", "Was in einem guten Angebot stehen sollte", "Selbst machen oder beauftragen?"). Comparison content uses real HTML tables (articles 9, 14, 16), which extract cleanly.

## 3. Citability

- Official sources linked inline where rules are mentioned (RIS, oesterreich.gv.at, usp.gv.at, graz.at, holding-graz.at, awv.steiermark.at) and listed under "Quellen" on each article. They are also exposed as `citation` in the BlogPosting JSON-LD.
- Visible publication and update dates; `datePublished`/`dateModified` match the visible dates (tested).
- No invented statistics, quotes, experience, ratings or prices. Where facts change (Ressourcenpark fees), the article says so and links the source instead of copying numbers.

## 4. Structured data (JSON-LD `@graph`)

| Page type | Nodes |
|---|---|
| All pages | `MovingCompany` (name, url, logo, image, description, email, telephone, address, hasMap, areaServed, vatID, contactPoint, knowsAbout, makesOffer), `WebSite` |
| Service | `WebPage` (+about → Service), `BreadcrumbList`, `Service` (provider, areaServed) |
| Article | `WebPage`, `BreadcrumbList`, `BlogPosting` (headline, description, image, dates, author/publisher → org, isPartOf, articleSection, wordCount, citation, about → services) |
| Blog | `BreadcrumbList`, `Blog` (blogPost list) |
| Hub / Über uns / Kontakt | `BreadcrumbList` + `ItemList` / `AboutPage` / `ContactPage` (Phase 1) |

Deliberately absent: `aggregateRating`, `review`, `priceRange`, `openingHours`, `geo`, `founder`, `foundingDate`, employee numbers, awards (none confirmed). `FAQPage` markup not used: Google shows FAQ rich results only for well-known government and health sites; visible FAQs remain. `@id` references were checked to resolve within each page's graph (test).

Validation: graph structure and IDs verified by Playwright on every article. The Rich Results Test / Schema Markup Validator need a public URL or pasted code; run them on the live URLs after deployment (`/`, one service, one article).

## 5. Machine-readable files

| File | Purpose | Note |
|---|---|---|
| `/sitemap.xml` | 32 canonical URLs with real content dates | |
| `/robots.txt` | allow all, disallow `/api/`, sitemap link; preview deployments disallow all | AI crawlers are not blocked; the client can decide later whether to disallow training crawlers (`GPTBot`, `ClaudeBot`, `Google-Extended`) separately from search crawlers |
| `/llms.txt` (new) | Plain-text map: entity summary, contact, services, all 18 articles, company pages | Generated from the same data as the pages, so it cannot contradict the site. Not a ranking factor; Google ignores it. Cheap to maintain because it is generated |
| `/blog/feed.xml` (new) | RSS 2.0 of all articles, discovery `<link>` on every page | |

No AI-only content, no hidden text, no special "AI meta tags".

## 6. Agent readability

Semantic HTML (header/nav/main/article/aside/footer), one H1, no skipped heading levels (tested on all 32 URLs), labelled navigation landmarks, all content server-rendered (no JS needed to read anything), form fields with labels, tables with `th scope`, keyboard-focusable scroll regions.

## 7. What would move the needle further (outside the codebase)

- Google Business Profile with matching NAP, categories, service area, photos and real reviews (strongest local + AI signal).
- Consistent listings (WKO Firmen A-Z, Herold, Apple Maps, Bing Places) using exactly the site's NAP.
- An owner/team section with real names and photos (E-E-A-T; AI answers like naming people behind a business).
- Mentions on local third-party sites (partners such as Hausverwaltungen, local press). Earned, not bought.
- Monthly manual check of 10–20 prompts in ChatGPT/Perplexity/Google AI Mode (e.g. "Umzugsfirma Graz", "Entrümpelung Graz Kosten", "Messiewohnung räumen Graz"), each run 3–5 times; record mention rate. Not done now because the new site is not live.

# Final test report – Phase 2

Run 2026-11-08 against the final production build (`npm run build`, then Playwright starts `next start` on :3100 with a JSON mail transport and on :3101 with a closed SMTP port).

## Result

| Suite | Result |
|---|---|
| `npm run typecheck` | clean |
| `npx eslint .` | clean |
| `npm run test:unit` (validation, files, magic bytes) | 9 / 9 passed |
| `npx playwright test` (desktop 1440 px + Pixel 7) | **49 / 49 passed** (41 from Phase 1, 8 new) |
| `npm run build` | successful, 45 static outputs |

Intermittent failures were seen only on builds where the article/service pages used a `<Suspense>` fallback (the per-article test plus axe/SEO tests timing out under parallel load). Cause, found in the follow-up: React's inline reveal script defers the content swap via `requestAnimationFrame`, a batching timer and `document.startViewTransition`, so under load the content can still be behind the placeholder when the test reads the page. That variant was dropped (see PERFORMANCE-OPTIMIZATION-REPORT.md, section 2). On the final build the full suite passed twice in a row. The `[WebServer] anfrage: send failed` lines in the output are expected: they come from the test that checks the SMTP failure path.

## Coverage

Route-driven tests use `tests/e2e/routes.ts`, built from the content files, so all **32 indexable URLs** are covered automatically: home, /leistungen, 7 service pages, Über uns, Kontakt, /blog, **all 18 articles**, Impressum, Datenschutz.

| Area | Tests | What is checked |
|---|---|---|
| SEO per URL (32 URLs) | `seo.spec.ts` | 200, `lang=de-AT`, one H1, heading order, unique title + description, self-canonical, no noindex, valid JSON-LD without rating/review/price/hours claims, alt + dimensions on every image, no broken internal links, no orphans, sitemap = route list, robots.txt, 308 redirects and 410s for old URLs, security headers |
| Phase 2 (new) | `phase2.spec.ts` | exactly 18 unique articles and all linked from /blog; title ≤65 and description ≤160 on all 32 URLs; per article: BlogPosting + WebPage + BreadcrumbList + MovingCompany, dates match content, image URL, `@id` references resolve, ≥1 service link in body text, 3 related articles, all images decoded after scrolling, **zero console errors** across all 18; every service page links its cluster articles; llms.txt and RSS served with correct types, list all 18 articles, every linked URL returns 200; thank-you page crawlable but noindex; unknown slugs return 404 (known 200); every article and service HTML contains its full content and no Suspense placeholder |
| Contact | `contact-links.spec.ts` (desktop + mobile) | tel/WhatsApp/mailto links, CTAs, hero quick-start pre-fill, Maps loads only after click |
| Form + API | `form.spec.ts` | client validation, conditional sections, successful submission with photo, double-submit guard, honest provider error, server validation, honeypot, file type/magic bytes/size, 413 body limit, cross-origin refusal, 502 on SMTP failure, no-JS redirect |
| Responsive + a11y | `responsive.spec.ts` (desktop + mobile) | no horizontal scroll at 1440/1100/1024/768/390/320 px on 11 pages (now including two articles with tables), mobile menu, contact bar does not cover content, cookie settings persist, axe-core WCAG 2.0/2.1/2.2 A/AA: no serious or critical violations |

## Issues the tests found during Phase 2 (all fixed)

| Found by | Issue | Fix |
|---|---|---|
| responsive (390 px) | New table widened the article column (grid item min-width) → 60 px sideways scroll | `.prose { min-width: 0 }`; tables stack as labelled rows below 640 px |
| axe | Scrollable table region not keyboard-focusable | `tabIndex=0`, `role=region`, `aria-label` |
| phase2 snippet test | Homepage and 4 static pages had descriptions >160 chars | Rewritten |
| Lighthouse (not Playwright) | CLS 0.211 on service/article pages | Suspense removed; new test guards it |
| manual curl, then test | Unknown slugs returned 200 | Routing-level 404; new test guards it |

## Visual review

Screenshots (Playwright, production build) in `.shots/p2/`:

- `final-home-desktop.png`, `final-home-mobile.png`
- `final-services.png` (hub), `final-service.png`, `final-service-mobile.png`
- `final-blog.png`, `blog-1440.png` (full page)
- `final-article.png`, `final-article-mobile.png`, `article-1440.png`
- `article-table-390.png` (stacked table on phones)
- `final-contact.png`, `final-contact-mobile.png`

Inspected: header, hero, CTAs and mobile contact bar unchanged from Phase 1; new article pages use the existing article template; blog overview shows topic chips and 18 cards in three categories. Full-page captures show empty bands below the fold: that is the Phase 1 scroll-reveal animation (elements fade in when scrolled into view), confirmed by scrolling; it is not a rendering problem. All captured pages: 0 px horizontal overflow, 0 broken images.

## Performance tests

See PERFORMANCE-OPTIMIZATION-REPORT.md (Lighthouse 12.8.2, 3 runs each, mobile + desktop; lab data only).

## Not tested

- Real e-mail delivery (no SMTP credentials; unchanged from Phase 1).
- The live domain (not deployed). The suite can run against production by changing `baseURL` in `playwright.config.ts` and removing the `webServer` block.

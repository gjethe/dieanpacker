# OG image, mobile contact bar and page transitions

Tested 2026-11-09. Next.js 16.4.5 (App Router), React 19.3. Nothing was deployed, and no DNS or production setting was changed. The changes are uncommitted in the working tree.

## 1. Why the OG image fails

**The image and the metadata are fine. The domain they point to is not serving this website yet.**

`dieanpacker.at` is still the old WordPress site on Hostinger. The new app runs on `dieanpacker.vercel.app`. The two halves never meet:

| Check | `dieanpacker.at` (WordPress, Hostinger) | `dieanpacker.vercel.app` (this app) |
|---|---|---|
| `/images/og-die-anpacker.jpg` | **404**, HTML page | 200, `image/jpeg`, 114,560 bytes, identical SHA-256 to the repo file |
| `og:image` in the homepage HTML | old WordPress upload, 683×1024 (portrait), wrong for a 1.91:1 card | `https://dieanpacker.at/images/og-die-anpacker.jpg`, which is the 404 in the left column |
| `og:title` | `Home - https://dieanpacker.at` | correct |
| `og:url` / canonical | WordPress | `https://dieanpacker.at`, so Facebook follows it back to WordPress |

- Sharing `dieanpacker.at` shows the WordPress tags and the portrait image.
- Sharing `dieanpacker.vercel.app` gives an `og:image` that returns 404.

Also checked, with no fault found:

- The image is a valid progressive JPEG, exactly 1200×630, sRGB, no alpha, 112 KB, tracked in git, correct filename case.
- `metadataBase` is `https://dieanpacker.at` by default (`lib/site.ts`).
- Every page's `pageMeta()` sets the full tag set. Nothing overrides or removes the image.
- No tag is duplicated. All App Router metadata API, rendered server-side.
- Robots and the CSP do not block it. On Vercel it returned 200 to a `facebookexternalhit` user agent.
- `www.dieanpacker.at` redirects 301 to the bare domain, so there is no www mismatch today.

## 2. What was changed for OG

**No OG code or image changed, because neither is wrong.** Changing `metadataBase` would only move canonical URLs to the wrong domain. A regression test was added (`tests/e2e/og-and-nav.spec.ts`): every required tag exists exactly once, URLs are absolute, and the image is served as a real 1200×630 JPEG.

## 3. Final image location

- File: `public/images/og-die-anpacker.jpg`
- URL once the domain is switched: `https://dieanpacker.at/images/og-die-anpacker.jpg`
- Works today at: `https://dieanpacker.vercel.app/images/og-die-anpacker.jpg`

## 4. Production verification

| | Result |
|---|---|
| Local production build: tags and image | **Pass** |
| `dieanpacker.vercel.app`: image, headers, tags | **Pass**, except `og:image` points at the 404 below |
| `dieanpacker.at`: image | **Fail (404)**, until the domain moves to the new site |
| Facebook Sharing Debugger, LinkedIn Post Inspector | **Not run.** Both need a login, and the live domain would only report the WordPress tags |

No social platform has been confirmed to show the new image.

## 5. Mobile contact bar

The bar itself was already light: plain links, no scroll listeners, no blur. The lag came from three other things, all measured:

1. **No press feedback at all.** There was no `:active` style, so a tap looked like nothing happened.
2. **Chromium applies `:active` late.** In the touch test it arrived only after the finger lifted (about 100 to 360 ms), so CSS alone could not fix this.
3. **Page transitions swallowed taps.** For 450 ms after each navigation, a tap on the bar hit `<html>` and was lost. The bar also faded and shifted with the page.

Changes:

- `components/ContactBarList.tsx`: a small client component that sets the pressed state on `pointerdown`.
- `app/globals.css`: opacity 0.6 on press with no delay, a 140 ms ease on release, `touch-action: manipulation`, no default tap flash, no scale.
- The bar now stays solid above the page fade (`view-transition-name`).

Result: the bar dims about 25 to 30 ms after touch start, including test-tool latency. Links, icons and layout are unchanged. The `tel:` and `wa.me` links are verified. All three targets are separate, not nested, and at least 64 px high. There is no overflow. The safe-area padding is unchanged.

**Limitation:** while a fade runs (now 160 ms, was 450 ms), a tap on the bar still does not register. That is how the browser treats elements pinned this way.

**Please check:** the brief lists Call, WhatsApp and Email, but the third button is actually **"Anfrage", linking to `/kontakt`**, not `mailto:`. It was left as it is.

## 6. Page transitions

A transition already existed, but it caused the "glitch". Frozen mid-flight, it showed up to 10 outgoing and 10 incoming section layers overlapping, each sliding, for 450 ms.

- `app/template.tsx` (with `app/leistungen/template.tsx` and `app/blog/template.tsx` for sub-pages): exactly one snapshot per page, and the old and new pages crossfade in place, even from a scrolled position.
- `app/layout.tsx`: the old per-section `<ViewTransition>` removed.
- `app/globals.css`: outgoing fade 120 ms, incoming fade 160 ms, opacity only. Header and contact bar stay still. Clicks pass through the transition overlay.
- Reduced motion: no transition animation plays.

No package was added and no routing was changed. Browsers without View Transitions simply navigate instantly.

## 7. Files modified

- New: `app/template.tsx`, `app/leistungen/template.tsx`, `app/blog/template.tsx`, `components/ContactBarList.tsx`, `tests/e2e/og-and-nav.spec.ts`, this report
- Changed: `app/layout.tsx`, `app/globals.css`, `components/Footer.tsx`, `components/Header.tsx`

## 8. Build and test results

Production build, typecheck, lint: pass. Unit tests: 9 of 9. Playwright: **53 of 53** (Chromium, desktop and Pixel 7 profiles, including axe accessibility checks).

Viewport run at 375×812, 390×844, 430×932, 768×1024, 1440×900, seven in-site hops each, plus back and forward. Console errors and hydration warnings: none. Layout shift: 0.

| | Before | After |
|---|---|---|
| Click to URL change (all viewports) | 32–120 ms | 24–119 ms |
| Page layers animated per navigation | 2–10 old, 2–10 new | 1 old, 1 new |
| Longest fade | 450 ms | 160 ms |
| Bar tap dead time per navigation | 450 ms | 160 ms |
| Bar pressed state appears | never | about 25–30 ms |
| Layout shift | 0 | 0 |

Timings are local Chromium lab numbers. Safari and real phones were not tested.

## 9. Still needed

1. **Point `dieanpacker.at` at the Vercel project.** Add the domain in Vercel, redirect `www` to the bare domain, and change only the web A/CNAME records. Keep the MX, SPF and DKIM records for mail. This one step fixes the OG image with no code change.
2. **After the switch:** confirm the image URL returns 200, then press "Scrape again" in the Facebook Debugger and inspect in LinkedIn Post Inspector. WhatsApp and other apps cache per link and cannot be forced to refresh.
3. **Deploy these changes.** The bar and transition work is only local until then.
4. **Test on a real iPhone.** The press feedback and fades could not be tested in Safari here.

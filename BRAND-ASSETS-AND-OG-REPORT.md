# Brand assets & OG image report (2026-11-08)

## Starting point

- **Master logo:** `public/logo.webp`, 512×512, transparent. A round badge: gold outer ring, navy ring with "DIE ANPACKER" / "UMZÜGE & ENTRÜMPELUNGEN", inner illustration (arm, boxes, truck). The file is **unchanged**. Every derived asset is cut or scaled down from it, never upscaled or redrawn.
- **Site design tokens** (`app/globals.css`): navy `#161345`, ember `#ff7f00`, sky `#d7ecff`, ink `#321004`, char `#6b5a52`, Poppins 400–700.
- **Before this work:** `app/icon.png` was the full badge at 48 px, where the ring text turns to noise. `app/favicon.ico` was missing. There was no manifest. `public/og-default.jpg` was a stock Unsplash photo of a truck with a Russian number plate. Service and blog pages used WebP photos as og:image.

## Assets created

All assets are produced by `node scripts/brand/build.mjs`, which reads the HTML sources next to it and asserts the output sizes.

| File | Size | Purpose / where used |
|---|---|---|
| `public/images/og-die-anpacker.jpg` | 1200×630, 112 KB | Open Graph and Twitter image for **every page** (`lib/meta.ts` → `defaultOgImage`, `app/layout.tsx`), `image` in the MovingCompany JSON-LD |
| `public/brand/die-anpacker-logo.png` | 457×457, transparent | Primary logo, master trimmed to an even 8 px margin. JSON-LD `logo`. For GBP, directories and press |
| `public/brand/die-anpacker-symbol.png` | 344×344, transparent | Compact symbol: the badge's inner illustration in a plain navy ring with a gold edge (both colours sampled from the badge), without ring text. Source for the small favicons |
| `public/brand/die-anpacker-lockup.png` | 983×308, transparent | Horizontal lockup: badge, "Die Anpacker" and "Umzug & Räumung in Graz" in Poppins, ink text. For light backgrounds (documents, email signature) |
| `public/brand/die-anpacker-lockup-dark.png` | 983×308, transparent | The same lockup with white and sky text, for dark backgrounds |
| `app/favicon.ico` | 16/32/48 (PNG-in-ICO) | Browser tab favicon, built from the symbol |
| `app/icon.png` | 192×192 | `<link rel=icon>`, also what Google Search shows. Built from the symbol |
| `app/apple-icon.png` | 180×180, opaque white | iOS home screen. Full badge, 10 px margin |
| `public/brand/icon-192.png`, `icon-512.png` | transparent | Web manifest icons (full badge) |
| `public/brand/icon-maskable-512.png` | 512×512, opaque white | Android maskable icon. The badge stays inside the 80 % safe zone |

Sources (version-controlled, editable): `scripts/brand/og-banner.html`, `scripts/brand/lockup.html`, `scripts/brand/build.mjs`.

**Removed:** `public/og-default.jpg` (no longer referenced; it now returns a 404).

**Deliberately not created:**
- **A separate dark-mode badge.** The badge has its own gold ring and navy fill, so it already reads on white and on the navy footer (checked in the screenshots). Recolouring it would change the identity.
- **SVG or vector logo.** It can't be traced faithfully from a 512 px raster. It is still worth asking the client for one (see CLIENT-VERIFICATION-REQUIRED.md).
- **`public/favicon-16x16.png`-style files.** Next.js generates the icon tags from the `app/` file conventions, so extra copies in `public/` would only duplicate them.

## OG banner: design decisions

- **Palette and type:** navy canvas, which is the site's dark band and footer colour. The badge's gold ring stands out against it in a feed. Poppins is the only typeface. Ember appears only as small accents: dot, rule and boxes. This is the same rule the site uses ("small accents only").
- **Layout:** text on the left, from 80 px. Order: eyebrow "GRAZ · STEIERMARK", the 92 px headline "Die Anpacker", "Umzüge & Räumungen / in Graz und der Steiermark", an ember rule, "Privat · Gewerbe · Entrümpelungen", then dieanpacker.at.
- **Doorway motif:** on the right, an arch-topped sky-blue doorway frames the real badge (380 px, a crisp downscale). Two moving boxes wait at the threshold. Together they say "moving in" without clip art.
- **Wording:** no claims, prices or promises, only the services and the region already stated on the site.
- **Safe margins:** at least 64 px on every side. No text crosses the doorway.
- **Small sizes:** at 300 px wide (a typical mobile feed card), the headline and badge stay readable. **Limit:** a centred square crop, as some WhatsApp thumbnails use, shows part of the headline and part of the badge rather than one complete element.

## Metadata integration

- `lib/meta.ts`: `defaultOgImage` (URL, 1200, 630, alt text) is used by `pageMeta()` on every page. The per-page WebP photo option was removed, because LinkedIn link previews do not reliably render WebP og:image. The photos are still shown on the pages themselves.
- `app/layout.tsx`: fallback openGraph (title, description, `de_AT`, site_name, image) and `twitter.card = summary_large_image`. `og:url` is deliberately not set in the layout. It would have told Facebook that pages without their own metadata (for example `/kontakt/danke`) were the homepage. Every `pageMeta` page sets its own `og:url` and canonical.
- **Twitter tags:** Next 16 fills `twitter:title`, `twitter:description` and `twitter:image` from openGraph (`postProcessMetadata`). Checked in the rendered HTML, with no duplicates.
- `app/manifest.ts` → `/manifest.webmanifest`, icons listed above, `lang: de-AT`.
- `lib/schema.ts`: Organization `logo` points to the PNG logo (457×457), `image` points to the banner.
- `ASSETS.md` updated.

## Validation

- `npm run lint`: clean. `npm run build`: passes, 47 static pages, `/manifest.webmanifest`, `/icon.png` and `/apple-icon.png` routes.
- `npm run test:unit`: 9/9. `npx playwright test`: 49/49. Two form tests first failed because a manually started server lacked `MAIL_TRANSPORT=json`; they passed on a rerun with the configured servers.
- **Rendered head checked** on `/`, `/ueber-uns`, `/leistungen/privatumzug-graz`, `/blog/umzugsangebot-vergleichen` and `/kontakt/danke`. All have absolute `https://dieanpacker.at/images/og-die-anpacker.jpg`, width/height 1200/630, alt, `de_AT`, site_name, and the card type. Articles have `og:type=article` plus published/modified times. Canonical and `og:url` are per page. No tag appears twice.
- **HTTP 200 with the correct content-type** for the OG image, favicon.ico, icon.png, apple-icon.png, the manifest and all `public/brand/*` files.
- **Playwright, desktop 1440 and Pixel 7:** no console errors, no failed requests, header and footer logo render correctly. The OG image is **not** loaded by any page, so performance is unchanged.

## Requires deployment / follow-up

- The OG URLs are absolute to `https://dieanpacker.at`. They only resolve once this build is live on that domain, or after `NEXT_PUBLIC_SITE_URL` is set for another host.
- After going live, run each key URL through the Facebook Sharing Debugger ("Scrape again") and the LinkedIn Post Inspector to refresh cached previews. WhatsApp caches per link and can't be forced to refresh. **None of these previews has been checked**, because the site isn't deployed yet.
- If the client provides an SVG logo, rerun `scripts/brand/build.mjs` against it for sharper favicons.

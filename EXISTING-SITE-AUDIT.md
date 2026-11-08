# Existing site audit – dieanpacker.at

Inspected 2026-11-06 with Playwright (live site behind a Hostinger bot check; content read after the challenge passed).
Platform: WordPress 7.0.8, Astra theme, Elementor/Elementor Pro, SureForms, LatePoint, "WP WhatsApp Chat", Google Site Kit, Facebook Pixel.

## 1. Page structure

| URL | Title | Notes |
|---|---|---|
| `/` | "Home - https://dieanpacker.at" | H1 "Stressfrei umziehen. Wir packen an.", 4 service teasers, no real content depth, several empty H2/H3 elements |
| `/ueber-uns/` | "Über uns - https://dieanpacker.at" | Values, "Zertifiziert. Versichert. Vertrauenswürdig" block |
| `/leistung/` | "Leistung - https://dieanpacker.at" | Privatumzüge, Entrümpelung, Firmenumzüge, Transporte & Zusatzservices – all "österreichweit" |
| `/kontakt/` | "Kontakt - https://dieanpacker.at" | SureForms form, phone, e-mail, two different opening-hour statements |
| `/impressum/` | | Legal details (see 4) |
| `/datenschutzerklaerung/` | | Generic template text |
| `/agb/` | | Full AGB ("DieAnpacker – Gentrit Hoxha") |
| `/danke/` | | Form thank-you page (in sitemap) |
| `/elementor-2506/`, `/form/` | | Builder/system artefacts in the sitemap |
| 5 blog posts | | Theme demo content about electrical work/EV chargers – unrelated to the business |
| `/category/uncategorized/` | | Demo category |

Titles all follow "Page - https://dieanpacker.at" (URL instead of brand, no keywords). Meta descriptions are auto-cut page text. JSON-LD (Rank Math/Site Kit style) labels the site name as the URL and `inLanguage: de`.

## 2. Content worth preserving

- Brand line "Wir packen an." – not reused as the headline (the new hero says "Sie planen. Wir tragen den Rest."); the old "stressfrei" wording was dropped.
- Service scope (Privat-/Firmenumzug, Entrümpelung, Möbeltransport, Montage/Demontage) – matches the client brief.
- Values: Zuverlässigkeit, Sorgfalt, klare Kommunikation, individuelle Betrachtung jedes Auftrags – consistent with the brief, rewritten.
- Business address and UID from the Impressum (used, flagged for confirmation).

## 3. Old URLs and how the new site handles them

| Old URL | New handling |
|---|---|
| `/` `/ueber-uns/` `/kontakt/` `/impressum/` | Same path; trailing slash → 308 to slash-less canonical |
| `/leistung/` | 308 → `/leistungen` |
| `/datenschutzerklaerung/` | 308 → `/datenschutz` |
| `/danke/` | 308 → `/kontakt` |
| `/sitemap_index.xml`, `/wp-sitemap.xml` | 308 → `/sitemap.xml` |
| 5 demo posts, `/category/*`, `/form`, `/elementor-2506` | **410 Gone** (irrelevant demo content; redirecting it would be a soft 404) |
| `/agb/` | **410 Gone** until the client confirms the AGB should be republished (see CLIENT-VERIFICATION-REQUIRED.md) |

No Search Console access for this domain was available, so indexed-URL data and backlinks to old URLs could not be checked.

## 4. Contact details found

- Phone `+43 660 3926662` – identical in header, footer, contact page, Impressum and the WhatsApp widget config (`436603926662`). Consistent, but not independently verified as active/WhatsApp-enabled.
- E-mail `office@dieanpacker.at` – consistent.
- Opening hours **conflict**: "Mo–Fr 08:00–18:00" vs. "Mo–Fr 07:00–18:00, Sa 07:00–14:00". Not published on the new site.
- Impressum: "DieAnpacker – Gentrit Hoxha", Neusiedlergasse 7, 8041 Graz, UID ATU83037278, Güterbeförderungsgewerbe, Magistrat Graz, WKO "Fachgruppe Transport und Verkehr". No Firmenbuch entry stated.

## 5. Claims that need verification (not carried over)

| Old claim | Status on new site |
|---|---|
| "Zertifiziert. Versichert." / "vollständig versichert" | Removed – no evidence supplied |
| "Fixpreis möglich", "transparentem Fixpreis-Angebot" | Removed – site explains individual quotations instead |
| "Antwort innerhalb von 24 Stunden" | Removed |
| "Kostenloses Angebot" | Replaced by "unverbindlich anfragen" |
| "Entsorgung inkl.", "fachgerechte Entsorgung", "Wertanrechnung" | Not claimed; disposal is described as "vereinbart im Angebot" |
| "Erfahrenes Umzugsteam", "Erfahrung" | Removed (no history supplied) |
| "Ohne Betriebsunterbrechung", "Wochenendumzüge", "Einlagerung", "Spezialtransporte" | Removed or phrased as "nach Absprache" |
| "Keine Weitergabe Ihrer Daten" | Replaced by an accurate privacy notice |

## 6. Spam-folder problem (contact form)

The old form posts through WordPress/SureForms, almost certainly using PHP `mail()` on the Hostinger web host, with no captcha keys configured. Typical consequences: the message is sent from the web server rather than through the authenticated mailbox, so DKIM may be missing and the envelope sender may not align with `dieanpacker.at`; DMARC is `p=none`, so receivers treat unaligned mail as suspicious rather than rejecting it – a classic spam-folder pattern.

DNS (checked 2026-11-06): MX `mx1/mx2.hostinger.com`, SPF `v=spf1 include:_spf.mail.hostinger.com ~all`, DKIM selector `hostingermail-a` published, DMARC `v=DMARC1; p=none`.

The new site sends via **authenticated SMTP through the Hostinger mailbox** (aligned SPF + DKIM), with the visitor only in `Reply-To`. See IMPLEMENTATION-REPORT.md.

## 7. Other issues and opportunities

- Third-party trackers (Facebook Pixel, Google Ads `AW-18408084876`, Site Kit) load on page view without a visible consent step – a GDPR risk the new site removes (no trackers; consent framework ready).
- Heavy page weight: jQuery, Elementor, particles/parallax libraries, LatePoint booking scripts on every page.
- No service landing pages, no Graz-specific content depth, no articles, empty headings, URL-as-site-name in titles and schema.
- Demo posts about electrical topics dilute topical relevance and should drop out of the index (410).

# Local SEO report – Graz and Steiermark

## Current local signals on the site

| Signal | State |
|---|---|
| NAP | Single source (`lib/site.ts`), identical in footer, contact page, Impressum, JSON-LD, llms.txt |
| Address type | Geschäftsadresse, kein Kundenbüro (stated). Correct for a service-area business |
| Map | Google Maps embed of the existing Business Profile (CID 17061681373244183094), loaded only after a click (privacy) |
| Schema | `MovingCompany` with PostalAddress, `hasMap`, `areaServed` (Graz, Graz-Umgebung, Steiermark, Österreich), `contactPoint` |
| Local content | Graz specifics used where they are true: Altbau/Gründerzeit stairwells, districts (Lend, Jakomini, Geidorf, St. Leonhard), Straßenamt for loading zones, Ressourcenpark/Holding Graz, Gemeindeamt/AWV in Graz-Umgebung |
| Service area | Home region section (Bezirke of Steiermark), each service page "Wo wir das anbieten", articles 10 and 16 |
| Region pages | None (see below) |

## Phase 2 changes

- New article **Umzug in Graz-Umgebung**: names real municipalities (Gratkorn, Gratwein-Straßengel, Hart bei Graz, Raaba-Grambach, Seiersberg-Pirka, Feldkirchen, Kalsdorf) as orientation, explains what differs in the Umland (houses, Zufahrt, Gemeinde as authority, Abfallwirtschaftsverband) and says plainly that all jobs are run from Graz.
- New article **Entrümpelung und Entsorgung in Graz**: local disposal routes (Ressourcenpark zones, private vs. commercial, Graz-Umgebung via Gemeinde/AWV), sourced from Holding Graz and AWV.
- Articles on Wohnung räumen, kurzfristiger Umzug and Firmenübersiedlung reference Graz-specific authorities (Straßenamt, Magistrat as Gewerbebehörde).
- Organization `contactPoint` added; `knowsAbout` lists the service topics.
- "Graz" is used where it adds meaning; no keyword repetition. Titles carry "Graz" once.

## Why no city/district landing pages

The business has one base and no local offices. Pages like "Umzug Leibnitz", "Umzug Weiz" would repeat the same service text with a swapped town name, which is a doorway pattern and gives searchers nothing new. There is also no Search Console data showing demand outside Graz yet. The one area with genuinely different practical content, Graz-Umgebung, is covered as an article. Revisit with real query data (see SEARCH-CONSOLE-AND-SEO-FINDINGS.md).

## Off-site actions (client; cannot be done from the codebase)

1. **Google Business Profile** (exists, CID above). Check that name, phone and website match the site exactly; set the website to `https://dieanpacker.at`; primary category "Umzugsunternehmen", secondary e.g. "Entrümpelungsdienst"/"Möbeltransport" where available; set a **service area** (Graz, Graz-Umgebung, Steiermark districts) and hide the street address if no customers visit; add services matching the seven pages; upload own photos; no keyword stuffing in the business name. Do not create a second profile.
2. **Reviews:** ask satisfied customers for Google reviews (a direct review link in the follow-up e-mail). Never buy, incentivise or write reviews. Reply to reviews.
3. **Citations:** WKO Firmen A-Z, Herold, Apple Business Connect, Bing Places, and any directory already listing the business: identical NAP. Fix old listings that point to the WordPress URLs.
4. **Local links:** partners who legitimately refer customers (Hausverwaltungen, Immobilienmakler, Notariate for Verlassenschaften, Seniorenwohnen) may link to the relevant service page. Earned, not bought.
5. **Opening hours** remain unpublished until confirmed (two conflicting versions on the old site).

## Client verification still open (unchanged from Phase 1, still relevant)

Legal name/Firmenbuch status, all trade licences (in particular whether the clearance services and taking away waste are covered, cf. AWG collector authorisation), phone/WhatsApp, hosting, opening hours. See CLIENT-VERIFICATION-REQUIRED.md.

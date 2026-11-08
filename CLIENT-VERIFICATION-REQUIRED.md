# Client verification required

Everything below is either taken from the old website (not confirmed by the client) or unknown. Nothing here was invented on the website: unconfirmed values are either used *as published on the old site* (marked) or left out. All values live in `lib/site.ts` (marked `VERIFY`).

## Publication blockers

| # | Item | Current state | Where it is used |
|---|---|---|---|
| 1 | **Legal name / owner / legal form.** Old Impressum: "DieAnpacker – Gentrit Hoxha". Is this a sole proprietorship (Einzelunternehmen) without Firmenbuch entry? If registered: Firmenbuchnummer + Firmenbuchgericht are mandatory. | Used as published on the old site | Impressum, Datenschutz (controller), `lib/site.ts` |
| 2 | **UID number ATU83037278** – correct and current? | Used as published | Impressum, JSON-LD `vatID` |
| 3 | **Trade licences (Gewerbe).** Old site lists only "Güterbeförderungsgewerbe". Entrümpelung/Räumung and taking away waste may require additional authorisations (e.g. a trade covering clearances; collection of waste under the Abfallwirtschaftsgesetz). Please list **all** Gewerbe from the GISA extract so the Impressum is complete and the clearance services are covered. | Only Güterbeförderungsgewerbe shown | Impressum |
| 4 | **Chamber membership** – old site: "WKO, Fachgruppe Transport und Verkehr". New site shows "Wirtschaftskammer Steiermark, Fachgruppe Transport und Verkehr" – please confirm the exact Fachgruppe(n). | Adjusted wording, unconfirmed | Impressum |
| 5 | **Phone +43 660 3926662** – still active? **WhatsApp** available on this number? | Live on the site (tel: and wa.me links) | Header, footer, contact page, mobile bar, JSON-LD |
| 6 | **SMTP credentials** for `office@dieanpacker.at` (or a dedicated sender mailbox such as `website@dieanpacker.at`) | Not available – the form returns an honest error until configured | Env vars, see `.env.example` |
| 7 | **Hosting provider.** Privacy policy names Vercel Inc. (assumed target). Confirm, and conclude/accept the provider's DPA. | Assumed | Datenschutz §2, `lib/site.ts` |
| 8 | **Retention** of enquiries: policy states deletion after 12 months if no order, 7 years (BAO) if an order follows. Confirm this matches practice. | Proposed | Datenschutz §3 |

## Needed before or soon after launch

| Item | Notes |
|---|---|
| Opening hours | Old site shows two conflicting versions (Mo–Fr 08–18 vs. Mo–Fr 07–18, Sa 07–14). Not published until confirmed. |
| AGB | Old site has AGB. They are **not** republished (old URL returns 410). Confirm whether they are current and approved; if yes, add `/agb` and link it from the footer. |
| Scope of services | Confirm: furniture protected with blankets (stated on the homepage), packing service, on-site viewings (Besichtigung), evening/weekend jobs, Austria-wide jobs, transport of IT equipment, assembly of new furniture, kitchen dismantling, handling of flats with mould/pests, how disposal is done (own transport to Ressourcenpark? partner?). The copy only says "nach Absprache" for all of these. |
| Insurance, certifications, years in business | Removed from the site. If they exist, send proof (insurer, policy type, certificate) and they can be added accurately. |
| Google Business Profile | A profile exists ("Die Anpacker", CID 17061681373244183094, from the supplied Maps embed). It is linked in footer, contact page and JSON-LD `hasMap`. Confirm its name, address and phone match the website exactly (NAP), and set the website URL on the profile to https://dieanpacker.at. |
| Google Search Console | Verify `dieanpacker.at` (DNS TXT, domain property) so the sitemap can be submitted and old URL status monitored. The connected GSC account has no access to this property. |
| Address visibility | Neusiedlergasse 7 is shown in footer, contact page, Impressum and JSON-LD (marked "kein Kundenbüro"). Confirm the client is fine with this (it is mandatory in the Impressum anyway). |
| Analytics / ads | The old site loaded Facebook Pixel and Google Ads without consent. The new site has none. If wanted: provide IDs, then the consent banner activates and the privacy policy must be extended before go-live. |
| Accessibility law | The Barrierefreiheitsgesetz (BaFG) exempts microenterprises (fewer than 10 employees and ≤ €2 m turnover/balance sheet) providing services. Confirm size to assess applicability. The site targets WCAG 2.2 AA regardless. |
| Real photos | Replace symbol images with own photos (team, vehicle, jobs with customer consent). See ASSETS.md. |
| Logo source | `public/logo.webp` is 512 px. A vector (SVG) version would render sharper and lighter. |

## Added in Phase 2 (2026-11-08)

| Item | Why it matters |
|---|---|
| **Reviews / testimonials** | Competitors show testimonials and counts; the site shows none because none were supplied. Needed: Google reviews on the Business Profile, and for any quote on the website written permission from the customer (name or initials, month/year, service). |
| **Owner/team photo and short bio** | Strongest missing trust (E-E-A-T) signal for people and AI answers. |
| **Entsorgung in practice** | Article "Entrümpelung und Entsorgung in Graz" deliberately says disposal is agreed per quote. Please confirm how disposal is done (own delivery to Ressourcenpark/commercial drop-off, partner company) and whether the trade licences cover collecting waste (see item 3 above). Then the service pages can describe it concretely. |
| **Verpackungsservice, Besichtigung per Video** | Articles mention packing help and video viewings as options "nach Absprache". Confirm both are offered. |
| **Search Console** | Grant the agency account access to the dieanpacker.at domain property after launch. |

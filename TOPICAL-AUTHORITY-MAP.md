# Topical authority map

Every indexable URL owns one primary search intent. Keyword ideas come from KeywordTool.io Google autocomplete (Austria, German, guest tier: no volumes) and SEO-RESEARCH.md (Phase 1). No search volumes are claimed.

## Structure

```
/  (Umzugsfirma Graz, entity hub)
├── /leistungen  (service hub, links all 7)
│   ├── Umzug cluster
│   │   ├── /leistungen/privatumzug-graz ──────── articles: kosten, angebot, checkliste, eine-woche, graz-umgebung, kurzfristig
│   │   └── /leistungen/firmenumzug-graz ──────── articles: firmenumzug-planen, firmenuebersiedlung-adressaenderung
│   ├── Räumung cluster
│   │   ├── /leistungen/entruempelung-graz ────── articles: entruempelung-ablauf, entsorgung, keller-dachboden, wohnung-raeumen
│   │   ├── /leistungen/haushaltsaufloesung-verlassenschaft-graz ── verlassenschaft, wohnung-raeumen, umzug-im-alter, entsorgung
│   │   └── /leistungen/messiewohnung-raeumung-graz ── messiewohnung, entsorgung
│   └── Möbel cluster
│       ├── /leistungen/moebeltransport-graz ───── moebeltransport-einzelstuecke, moebel-vorbereiten
│       └── /leistungen/moebeldemontage-montage-graz ── moebelmontage-umzug, moebel-vorbereiten
├── /blog  (18 articles, grouped Umzug 9 / Räumung 6 / Möbel 3, topic jump links)
├── /ueber-uns, /kontakt
```

## Keyword ownership (articles)

New articles marked ★.

| URL | Primary intent | Secondary | Must not compete with |
|---|---|---|---|
| /blog/umzug-graz-kosten | was kostet ein umzug graz | umzugsfirma graz kosten/preis | angebot article (comparison, not price) |
| ★ /blog/umzugsangebot-vergleichen | umzugsangebote vergleichen / einholen | kostenvoranschlag umzug, umzugsangebot verbindlich | kosten article |
| /blog/umzug-graz-checkliste | umzug checkliste (graz) | halteverbot umzug graz, ummelden | eine-woche (narrower) |
| ★ /blog/umzug-eine-woche-vorher | umzug eine woche vorher / letzte woche | umzug countdown | checkliste (8-week master) |
| ★ /blog/umzug-kurzfristig-organisieren | kurzfristig umziehen | umzug kurzfristig organisieren | – |
| ★ /blog/umzug-graz-umgebung | umzug graz umgebung | umzug ins umland, hausumzug steiermark | privatumzug page (transactional) |
| ★ /blog/umzug-im-alter | umzug im alter | im alter umziehen, umzug betreutes wohnen | haushaltsauflösung page |
| /blog/firmenumzug-graz-planen | firmenumzug planen / büroumzug checkliste | it, beschriftung, zeitplan | firmenübersiedlung article |
| ★ /blog/firmenuebersiedlung-adressaenderung | firmenadresse ändern / standortverlegung | firmenbuch geschäftsanschrift, gewerbebehörde | firmenumzug-planen (logistics) |
| /blog/entruempelung-graz-ablauf | wie läuft eine entrümpelung ab | entrümpelung vorbereiten | entsorgung (disposal), keller (space-specific) |
| ★ /blog/wohnung-raeumen-graz | wohnung räumen (lassen) | wohnung räumen tipps, wohnungsübergabe | entruempelung page owns "wohnungsräumung graz" (transactional) |
| ★ /blog/keller-dachboden-entruempeln | keller entrümpeln / dachboden entrümpeln | keller entrümpeln wo anfangen, wohin mit dem müll | entrümpelung article |
| ★ /blog/entruempelung-entsorgung-graz | entsorgung bei entrümpelung graz | sperrmüll graz, problemstoffe, ressourcenpark | – |
| /blog/verlassenschaftsraeumung-graz | verlassenschaftsräumung was beachten | wohnung räumen todesfall | haushaltsauflösung page |
| /blog/messiewohnung-raeumen | messiewohnung räumen | – | messiewohnung page |
| /blog/moebeltransport-graz-einzelstuecke | möbeltransport einzelstück | möbeltaxi graz | moebeltransport page |
| /blog/moebelmontage-umzug | möbelmontage umzug | möbel abbauen umzug | moebel-vorbereiten |
| ★ /blog/moebel-umzug-vorbereiten | möbel für umzug vorbereiten | waschmaschine transportieren, umzugsgut | moebelmontage article (disassembly) |

Service and hub pages keep the transactional terms from SEO-RESEARCH.md (umzugsfirma graz → `/`, privatumzug graz, firmenumzug graz, entrümpelung graz, haushaltsauflösung/verlassenschaftsräumung graz, messiewohnung räumen graz, möbeltransport graz, möbelmontage graz). Articles target informational intent and link up to the matching service.

### Intent distinctions requested in the brief

| Term | Owner | Why it is distinct |
|---|---|---|
| Umzugsfirma Graz | `/` | Provider search, brand + all services |
| Privatumzug Graz | /leistungen/privatumzug-graz | Household move service |
| Firmenumzug Graz | /leistungen/firmenumzug-graz | Business move service |
| Entrümpelung Graz | /leistungen/entruempelung-graz | Clearance of rooms/objects, alive owner |
| Haushaltsauflösung Graz / Verlassenschaftsräumung Graz | /leistungen/haushaltsaufloesung-verlassenschaft-graz | Whole household ends (move to care, death); family coordination. Kept on one URL: the process and audience overlap almost fully, separate pages would compete |
| Messiewohnung räumen Graz | /leistungen/messiewohnung-raeumung-graz | Sensitive, discretion-led intent |
| Möbeltransport Graz | /leistungen/moebeltransport-graz | Single items, no full move |

## Internal link rules applied

- Every article links at least one service page in the body text (tested) and shows 3 hand-picked related articles (tested). Map: `relatedMap` in `content/posts.ts`.
- Every service page links all articles of its cluster (tested).
- Homepage links all services, the hub, and three articles; blog overview links all 18 (tested).
- Anchors are descriptive and varied (e.g. "Kostenfaktoren eines Umzugs in Graz", "Umzugsangebote richtig vergleichen", "Was eine Woche vor dem Umzug zu tun ist"); no site-wide exact-match anchors.
- No orphan pages (tested).

## Location pages

None created. The service area is Graz, Graz-Umgebung and Steiermark from one Graz base, with no local offices, and there is no Search Console demand data. City pages would be near-duplicates (doorway risk). Graz-Umgebung is covered by one genuinely useful article instead. Re-evaluate after 3–6 months of Search Console data (e.g. if "umzug leibnitz" style queries show impressions on existing pages).

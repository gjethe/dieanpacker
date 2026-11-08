# Phase 2 – skills and tools used

Only tools that contributed something concrete are listed. Where a tool was unavailable or returned nothing useful, that is stated.

| Skill / tool | Used for | Contribution |
|---|---|---|
| `anthropic-skills:ai-seo` | GEO/AEO approach | Framed the work around Google's AI-features guidance (no special markup required; people-first content) vs. extractable structure for other engines; llms.txt as optional, generated from page data; crawler purposes (search vs. training) documented, not blocked |
| `anthropic-skills:humanizer` | Writing rules for 10 articles | Checklist applied while drafting (no dashes, no staged contrasts, no one-line closers, no inflated claims); self-review removed two staged constructions |
| `superpowers:using-superpowers` (session start) | Process | Skill-first workflow |
| `ponytail` (session mode) | Engineering approach | Smallest complete changes: props instead of a new nav abstraction, generated llms.txt/RSS from existing data, a 15-line table renderer instead of a Markdown library |
| Playwright MCP (browser) | Image sourcing and visual review | Searched Unsplash in a real browser (Unsplash blocks plain HTTP clients), verified "Unsplash License" on each photo page, captured desktop/mobile screenshots of blog, article, tables, home, service and contact pages; found the cramped mobile table and confirmed scroll-reveal behaviour |
| `@playwright/test` + axe-core (project suite) | Regression tests | 41 existing + 6 new tests; caught 3 real issues in Phase 2 (table overflow on phones, over-long descriptions on static pages, non-focusable scroll region) |
| Lighthouse 12.8.2 (same version as Phase 1) | Lab performance | 3 runs per page, mobile + desktop; see PERFORMANCE-OPTIMIZATION-REPORT.md |
| Next.js bundled docs (`node_modules/next/dist/docs`, per AGENTS.md) | Framework behaviour | Confirmed that static GET route handlers are prerendered under Cache Components (used for llms.txt and RSS) |
| Google Search Console MCP | Search data | Connected account has no dieanpacker.at property. Documented as blocker |
| KeywordTool.io (guest) | Keyword ideas, AT/German | Autocomplete suggestions for each new topic; no volumes on guest tier, none claimed |
| WebSearch / WebFetch | Competitors, official sources | Competitor page structures (4 Graz sites); verified official sources (USP, oesterreich.gv.at, RIS, Holding Graz, AWV, graz.at). Search results are US-routed, so no SERP rankings are claimed |
| sharp (already a Next.js dependency) | Image processing | Resize/crop/convert 10 photos to WebP, contact sheets for selection |
| curl | Source checks | HTTP status of every cited URL; confirmed live domain still runs WordPress |

## Considered, not used

| Tool | Reason |
|---|---|
| `/find-skills` | Not needed: installed SEO, design and Vercel skills already covered every area |
| `/deep-research`, Perplexity docs MCP | Perplexity MCP covers Perplexity's own docs only; targeted searches + official sources were sufficient for the facts used |
| `/copywriting` | Brief covers sales copy; the work here was informational articles and snippet text, done with the humanizer rules |
| `/frontend-design`, `/impeccable`, `/web-design-guidelines` | No redesign was warranted; the only new UI elements (tables, topic chips on /blog) reuse existing tokens/components. Visual check done with screenshots |
| `claude-site-audit`, `claude-seo:*` audit agents | Built for live URLs; the site is not deployed. Equivalent checks run locally by the Playwright suite |
| Vercel MCP / deploy skills | No deployment authorised. Vercel-specific notes (Firewall rate limit, env vars) remain in IMPLEMENTATION-REPORT.md |
| Context7 | Bundled version-exact Next.js docs were available locally and preferred (AGENTS.md instruction) |
| `@next/bundle-analyzer` | Not added as a dependency; chunk contents were inspected directly in `.next/static/chunks`, which was enough to find the service-copy chunk |

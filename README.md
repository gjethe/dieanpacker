# Die Anpacker – Website

Website for Die Anpacker, moving and clearance company in Graz. Next.js 16 (App Router), TypeScript, Tailwind CSS 4.

```bash
npm install
cp .env.example .env.local   # fill in SMTP credentials
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
npm test                     # unit + Playwright e2e (needs a build first; `npx playwright install chromium` once)
```

Documentation:

- IMPLEMENTATION-REPORT.md – architecture, where to change things, e-mail setup, tests, deployment checklist
- CLIENT-VERIFICATION-REQUIRED.md – open business/legal questions and launch blockers
- SEO-RESEARCH.md – keyword map
- EXISTING-SITE-AUDIT.md – old site, redirects, removed claims
- PERFORMANCE-REPORT.md – Lighthouse results
- ASSETS.md – image sources and licences
- Phase 2 (2026-11-08): PHASE-2-AUDIT.md, PERFORMANCE-OPTIMIZATION-REPORT.md, SEO-TECHNICAL-AUDIT.md, GEO-AEO-AIO-OPTIMIZATION.md, LOCAL-SEO-REPORT.md, TOPICAL-AUTHORITY-MAP.md, COMPETITOR-AND-SEARCH-ANALYSIS.md, SEARCH-CONSOLE-AND-SEO-FINDINGS.md, CONTENT-EXPANSION-REPORT.md, FINAL-PLAYWRIGHT-TEST-REPORT.md, PHASE-2-SKILLS-AND-TOOLS.md

Business facts (phone, e-mail, address, legal data) live in `lib/site.ts` only.

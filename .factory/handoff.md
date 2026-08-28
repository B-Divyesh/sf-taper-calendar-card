# StepDown Card handoff

## Delivered

- A Vite + TypeScript offline PWA that records clinician-provided instructions verbatim, dose steps, daily checks, a print card, CSV log, and JSON backup/import.
- Demo at `/demo` (or `?demo=1`) with an isolated IndexedDB namespace, reset and leave-demo controls.
- A passphrase option using Web Crypto (PBKDF2 + AES-GCM) for real cards, with a clear backup warning.
- Offline shell precache, web manifest, install icons, offline reload coverage, security headers, sitemap, robots, styled 404, privacy, and terms routes.
- Optional $9 paper-pack purchase path through the Sociobot license endpoint; it has restore, daily verification caching, and a compact print layout. Core cards and exports are free.
- Cassette-era zine visual system and original generated hero, recorded in `design.md`. The shipped hero WebP is 99 KB.

## Run and verify

```bash
npm install
npm test
npm run build
```

`npm test` passed on 2026-08-28: 5 schedule/unit tests and 3 Playwright claim tests (CSV rows, offline demo reload, and no third-party demo requests). `npm run build` passed and writes `dist/index.html` at the deploy root.

Final production bundle: JavaScript 17.93 KB (6.40 KB gzip), CSS 7.24 KB (2.48 KB gzip), hero WebP 99 KB. Keyboard controls use native form controls/buttons with a visible focus ring; mobile layout stacks at 680 px.

## Lighthouse-class checks

Static checks and Playwright verification passed for title, language, one h1 per rendered route, landmarks, focus styling, image alt text, route navigation, and offline reload. The bundle is comfortably under the stated static performance budgets. A full Lighthouse CLI audit was not available in this container; run it against a served `dist/` release candidate to record final mobile scores.

## Known gaps

- Cards are intentionally device-local. Browser-data clearing or a forgotten encryption passphrase cannot be recovered; JSON export is the recovery path.
- The factory must register the paid product before checkout can complete in production. No product ID is embedded.

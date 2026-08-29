# Polish round 5 — cumulative finding closure

Date: 2026-08-29 UTC  
Work order: `taper-calendar-card-polish-5`  
Reviewed candidate: `c8c5b03148098962781ee20467801426f9173284`  
Review report: `767d3e3f9a98e074409ff63bf600f3c99ec0b19f:.factory/review-5.md`  
Repair commit: `617b2b1895aeb1d70f4938168b815fe9ad1bba0f`  
Verification commit: `6d3073ffa61e101350e4437a447ecdce32bac898`  
Deployment: `556b2786-19c1-43b1-bff4-4fe82193c6f9`  
Live URL: `https://taper-calendar-card.sociobot.in`

## Round 5 finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-5-1 | Removed `TRACK 404` and the metaphorical heading from both the deployed standalone 404 and the SPA fallback. Both now say `Page not found` and explain the next actions directly. The 404 retains its cassette-paper layout, complete navigation, legal links, route metadata, focus target, and two return paths. | Playwright `unknown client paths render the designed not-found screen and known legal links work` and `the standalone 404 has complete navigation, metadata, legal links, and a working skip link`; screenshot `.factory/qa-artifacts/polish-5/live-404-mobile.png`; cold live `/missing-page` returned 404 with the new text. |
| F-5-2 | Replaced the footer’s jargon and unavailable design-note pointer with `The collage was generated for StepDown Card.` Detailed provenance remains in `.factory/design.md` and `assets/hero-source.png.json`. | Playwright `every app route has its own title, metadata, one heading, and working links` rejects the old sentence on all routes; screenshot `.factory/qa-artifacts/polish-5/live-verify/screenshot-mobile.png`; cold live `/`, `/demo`, `/privacy`, and `/terms` show the new footer. |

## Earlier review finding map

| Finding | Change retained or strengthened | Evidence |
| --- | --- | --- |
| F-1-1 | The standalone 404 retains full metadata, header, navigation, footer, legal links, factory/version/build text, and return actions. | Standalone-404 Playwright test; `.factory/qa-artifacts/polish-5/live-404-mobile.png`; live `/missing-page` = 404. |
| F-1-2 | The 404 main remains focusable and its skip link moves focus to `MAIN#main`. | Standalone-404 keyboard assertion; `.factory/qa-artifacts/polish-5/live-404-mobile.png`; live `/missing-page`. |
| F-1-3 | Card safety copy remains a non-landmark `div`; axe must report zero violations in light and dark modes on five routes. | Playwright `light and dark routes have no axe violations`; `.factory/qa-artifacts/polish-5/live-demo-mobile.png`; live `/?demo=1`. |
| F-1-4 | `Write my card` and `Leave demo and write a card` still name their results and move focus into the editor. The sample action is now a real `/?demo=1` link. | Playwright first-screen, keyboard, client-navigation, and query-demo tests; home and demo screenshots; live `/` → `/?demo=1` → `/`. |
| F-1-5 | Safety and recovery wording remains exact and registered as `no-clinical-output` and `no-passphrase-recovery`. | Both exact claim commands passed from the clean clone and live; `.factory/qa-artifacts/polish-5/live-encrypted-lock-mobile.png`; live `/`. |
| F-1-6 | README retains plain offline, storage, and browser-encryption wording. | `.factory/copy-audit.md`; clean-clone unit and claim gates; live companion wording in the home screenshot. |
| F-2-1 | The sample remains a clearly marked Prednisone card. The first date, dose, note, and check control fit in the initial 390 × 844 viewport. | Playwright `one click shows a realistic date, dose, and check control in the 390px first demo screen`; `.factory/qa-artifacts/polish-5/live-demo-mobile.png`; live `/?demo=1`. |
| F-2-2 | Privacy says only `Clear this site’s data to remove a saved card.` | `@claim:clear-device-data`; `.factory/qa-artifacts/polish-5/live-privacy-mobile.png`; live `/privacy`. |
| F-2-3 | Locked-card replacement copy names required fields, valid dates, and non-overlapping steps. Invalid imports preserve the encrypted record. | `@claim:backup-validation`; `.factory/qa-artifacts/polish-5/live-encrypted-lock-mobile.png`; live encrypted recovery screen on `/`. |
| F-2-4 | The first-screen eyebrow remains the direct instruction `Copy your clinician’s taper`. | Playwright first-screen test; home screenshot; live `/`. |
| F-2-5 | README heading remains `Run StepDown Card locally`. | `.factory/copy-audit.md` and clean-clone source; the corresponding running product was checked live at `/`. |
| F-2-6 | README and privacy copy use current-browser/current-device wording. Request assertions now allow only known same-origin GETs. | `@claim:private-device`; privacy screenshot; live `/privacy`. |
| F-2-7 | Standalone-404 legal links remain at least 44 × 44 CSS pixels. | Playwright `the real editor fits 390px and key mobile touch targets are at least 44px`; 404 screenshot; live `/missing-page`. |
| C-2-1 | The single authoritative IndexedDB record and serialized transaction queue remain in place. Round 5 additionally stops ordinary reads from reserializing that record, so entering and leaving demo leaves the real bytes untouched. | `@claim:backup-validation` and strengthened `@claim:demo-unsaved`; encrypted and demo screenshots; live `/` and `/?demo=1`. |
| F-3-1 | The encrypted-import race remains closed: encryption owns the queue before key derivation, migration prefers sealed data, and rejected imports await committed normalization. | `@claim:backup-validation` repeats missing-field rejection 25 times and checks invalid dates, reversed ranges, overlaps, migration, and byte-identical sealed storage; encrypted screenshot; live `/`. |

Review 4 contained no findings. Its passing first-read, demo, claims, routing, accessibility, privacy, and identity checks were all rerun in round 5.

## Original verification regression map

The original verification numbered its defects rather than assigning finding IDs. These labels preserve that numbering.

| ID | Current change/evidence | Live check |
| --- | --- | --- |
| V-1 | Date-only arithmetic does not pass through local-to-UTC conversion. The Auckland, Kiritimati, and GMT-12 browser tests pass. | Real card on `/`; full live suite. |
| V-2 | Strict backup parsing rejects incomplete or wrongly typed nested data before storage changes. `@claim:backup-validation` passes. | Encrypted recovery on `/`; encrypted screenshot. |
| V-3 | Editing filters and retains checks for dates still present. `editing a dose preserves checks for dates still on the card` passes. | Real card on `/`. |
| V-4 | Reversed and overlapping steps are rejected without clearing fields. Unit validation and `invalid ranges and overlap errors preserve every entered field` pass. | Editor on `/`. |
| V-5 | The unavailable paid offer remains removed. `@claim:free-no-account` proves the complete card has no checkout or sign-in. | Home screenshot; live `/`. |
| V-6 | The worker handles only same-origin GETs and has no license/API path. The release-configuration unit test passes. | Live `/sw.js` is `no-cache`. |
| V-7 | Licensing remains absent, so no stale verdict can unlock a new token. `@claim:free-no-account` passes. | Live `/`. |
| V-8 | Dark tokens retain required contrast. Axe reports zero violations on all checked routes in both themes. | Live `/`, `/?demo=1`, `/privacy`, `/terms`, `/404.html`. |
| V-9 | The editor and first screen fit 390 px without horizontal overflow. | Mobile home screenshot; mobile layout Playwright tests. |
| V-10 | Backup import remains available in both empty and encrypted states. | `backup import is available on a fresh device and on the encrypted lock screen`; encrypted screenshot; live `/`. |
| V-11 | `/demo` and `/?demo=1` enter isolated sample state, Reset works, and exit restores real data byte-for-byte. | Query-demo and `@claim:demo-unsaved`; demo screenshot; live `/?demo=1`. |
| V-12 | Client navigation and Back focus the new h1 and update the polite route status. | `client navigation enters demo, restores real data, focuses headings, and updates canonical metadata`; live `/privacy` and Back. |
| V-13 | Legal links resolve, unknown paths use the designed document, and production returns HTTP 404. | Routing, metadata/link crawl, and standalone-404 tests; 404 screenshot; live `/missing-page` = 404. |
| V-14 | Worker update messages expose `Reload now`; old caches are deleted. | Update-notice browser test and release-configuration unit test; live `/sw.js` uses `stepdown-v8`. |
| V-15 | Hashed assets retain immutable caching and `sw.js` is `no-cache`. | Release-configuration unit test and cold live header checks. |
| V-16 | Nav, first-screen actions, remove buttons, demo controls, footer links, and 404 legal links meet 44 px target sizing. | Mobile target Playwright test; home, demo, and 404 screenshots. |
| V-L1 | Every normal route updates its title, description, canonical, Open Graph/Twitter fields, icon, and one h1. | Metadata/link-crawl Playwright test; live four-route crawl. |
| V-L2 | The linked Apple touch icon is a real 180 × 180 PNG. | Metadata tests and image inspection; live `/icon-180.png`. |
| V-L3 | Generated-art disclosure is plain on the site; source, model, date, prompt, and licence remain recorded in the repository. | Metadata/footer test; home screenshot; live `/`. |
| V-L4 | `.factory/copy-audit.md` now includes the round-5 landing, README, demo, privacy, encrypted-recovery, and 404 wording. | Copy audit: no sentence over 22 words and no banned term remains. |

## Claims and release evidence

- Fresh remote clone: `/tmp/taper-polish5-final.sFTr0w/repo` at `6d3073ffa61e101350e4437a447ecdce32bac898`.
- `npm ci`: 177 packages installed, zero vulnerabilities.
- All 14 exact commands from `.factory/claims.json` passed independently: `offline-reload`, `csv-export`, `private-device`, `backup-roundtrip`, `backup-validation`, `encrypted-card`, `no-passphrase-recovery`, `demo-unsaved`, `print-card`, `free-no-account`, `transcription-only`, `no-clinical-output`, `clear-device-data`, and `check-timestamp`.
- The registry unit test proves every declared claim has exactly one tagged browser test and no undeclared claim tag exists.
- Clean clone: `npm run typecheck`, `npm run lint`, `npm test` (13 unit and 31 browser tests), and `npm run build` passed.
- Production output: JavaScript 23.49 kB / 8.08 kB gzip; CSS 8.83 kB / 2.89 kB gzip; `dist/index.html` present.
- Local verifier: no console/page errors; title, `lang=en`, one h1, main, alt text, and button names passed. Evidence: `.factory/qa-artifacts/polish-5/local-verify/`.
- Local Lighthouse mobile: 99 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 2.1 s, TBT 0 ms, CLS 0.
- Cold live Playwright: 31/31 passed after deployment, including all claim, offline, privacy, light/dark axe, keyboard, focus, mobile, metadata, link, and 404 checks.
- Live verifier: no console/page errors and all structure checks passed. Evidence: `.factory/qa-artifacts/polish-5/live-verify/`.
- Live Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices, 100 SEO; FCP 0.8 s, LCP 1.4 s, TBT 0 ms, CLS 0.
- Live route check: `/`, `/demo`, `/privacy`, and `/terms` returned 200; `/missing-page` returned 404. Local and live `index.html` and `sw.js` SHA-256 hashes matched.
- Live response policy: hashed JavaScript is `public, max-age=31536000, immutable`; `sw.js` is `no-cache`; CSP, Referrer-Policy, and `X-Content-Type-Options` are present.

No finding of any severity remains unresolved.

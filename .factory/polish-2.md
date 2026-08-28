# Polish round 2 — cumulative finding closure

Date: 2026-08-28 UTC  
Work order: `taper-calendar-card-polish-2`  
Reviewed candidate: `b7b6f12a99a4990cde23603f9c6f06dc3137da21`  
Review report: `914a981637a5357ce16521b2897e86595a7d392d:.factory/review-2.md`  
Repair head deployed: `8e14652cf9606d4c98dd34840c817771598345b1`
Live URL: `https://taper-calendar-card.sociobot.in`

## Review 2 finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 | Replaced “Example medication” with “Prednisone — sample,” shortened the sample directions, and moved demo tools below the populated schedule. The first row is now above the fold. | Playwright `one click shows a realistic date, dose, and check control in the 390px first demo screen`; live first row ends at 651 px in an 844 px viewport; `.factory/qa-artifacts/polish-2/live-demo-first-screen.png`; live `/` → `/demo`. |
| F-2-2 | Removed the misleading private-session sentence. Privacy now says “Clear this site’s data to remove a saved card.” | `@claim:clear-device-data`; live `/privacy`; full live browser suite 31/31. |
| F-2-3 | Named the import conditions: required fields, valid dates, and non-overlapping steps. Registered `backup-validation`. Made encrypted storage atomic and authoritative. | `@claim:backup-validation` covers missing field, invalid date, reversed range, and overlap; encrypted bytes remain identical and plaintext remains absent; 10-repeat stress run passed; live `/`. |
| F-2-4 | Replaced “PRIVATE TAPER TRANSCRIPTION” with “COPY YOUR CLINICIAN’S TAPER.” | Playwright `the first screen is complete at 390px and Write my card focuses the editor`; `.factory/copy-audit.md`; live `/`. |
| F-2-5 | Renamed README heading “Run StepDown Card locally.” | README copy audit in `.factory/copy-audit.md`; clean-clone source check. |
| F-2-6 | Rewrote README storage wording as “Cards stay in this browser on the current device.” | README copy audit; `@claim:private-device`; clean-clone and live tests. |
| F-2-7 | Added a 44 px minimum width to standalone-404 footer links. | Playwright `the real editor fits 390px and key mobile touch targets are at least 44px`; `.factory/qa-artifacts/polish-2/live-404-mobile.png`; live `/missing-page` returns 404. |

## Controller evidence finding

| Finding | Change made | Evidence |
| --- | --- | --- |
| C-2-1 `@claim:backup-validation` missing-field regression | Serialized all IndexedDB reads and mutations, so a plain-card write cannot overtake encryption or rejected-import cleanup. Rejected imports call `keepEncryptedCardLocked()`, which retains the sealed bytes and removes any plaintext record in the same committed transaction. The service worker now uses cache `stepdown-v6` and the app uses a new hashed asset, so installed clients receive this repair. | Exact command `npm run test:e2e -- --workers=1`: 31/31 pass in three consecutive local runs. Playwright `@claim:backup-validation rejects every named invalid backup and preserves the locked card` checks missing-field, invalid-date, reversed-range, and overlap inputs, asserting byte-identical sealed storage and no plaintext record after each. Fresh-clone run and live `https://taper-calendar-card.sociobot.in` run: 31/31 pass. |

## Review 1 cumulative re-check

| Finding | Change retained or rechecked | Evidence |
| --- | --- | --- |
| F-1-1 | The standalone 404 keeps complete header/footer navigation, legal links, factory/version text, metadata, icons, and return actions. | Playwright `the standalone 404 has complete navigation, metadata, legal links, and a working skip link`; live `/missing-page`; live 404 screenshot. |
| F-1-2 | The 404 main remains focusable and the skip handler moves focus to it. | Same standalone-404 keyboard test; live browser suite pass. |
| F-1-3 | Safety copy remains a non-landmark `<div>`. | Playwright `light and dark routes have no axe violations`; zero axe violations on all five routes in both color schemes. |
| F-1-4 | Result labels remain “Write my card” and “Leave demo and write a card,” with focus moved to the editor. | Playwright first-screen, client-navigation, and query-demo tests; live `/` and `/demo`. |
| F-1-5 | Safety and recovery statements remain registered as `no-clinical-output` and `no-passphrase-recovery`; round 2 adds `backup-validation`. | All three exact claim commands pass; clean claim log. |
| F-1-6 | README retains plain wording for offline files and browser encryption, with no removed implementation jargon. | `.factory/copy-audit.md`; clean-clone README inspection. |

## Complete release evidence

- Fresh clone at `/tmp/stepdown-final-v6-clean.7AHtld/repo` from `8e14652`: all 14 exact claim commands pass separately; `typecheck`, `lint`, full unit/browser suite, and build pass.
- Exact `npm run test:e2e -- --workers=1`: 31/31 pass locally and against the final live origin. Production build: JS 22.72 kB / 7.82 kB gzip; CSS 8.83 kB / 2.89 kB gzip.
- Live factory verifier: no console errors; title, `lang`, h1, main, alt text, and button names pass.
- Live Playwright suite: 31/31, including offline, privacy request interception, route titles/canonicals, Back/focus announcement, 404 crawl, touch sizes, keyboard, and zero axe violations.
- Live route/status/header/hash evidence: `.factory/qa-artifacts/polish-2/live-route-checks.log`.
- Live Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; report and summary are in `.factory/qa-artifacts/polish-2/`.
- Live cold screenshots: `live-demo-first-screen.png`, `live-404-mobile.png`, and `live-verify/`.

All 13 review findings plus the controller’s encrypted-import regression are resolved. No severity is deferred.

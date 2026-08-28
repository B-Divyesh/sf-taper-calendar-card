# Polish round 3 — cumulative finding closure

Date: 2026-08-28 UTC  
Work order: `taper-calendar-card-polish-3`  
Reviewed candidate: `0ae1d8b1f24ed7736688657fa717057ddc19cd50`  
Review report: `0576c08fc08d1c6d0c8e2fc2a9102e336f705374:.factory/review-3.md`  
Repair code commit: `def8b76`  
Live URL: `https://taper-calendar-card.sociobot.in`

## Finding map

| Finding | Change made or retained | Evidence |
| --- | --- | --- |
| F-3-1 / C-2-1 | Replaced the separate plaintext and sealed keys with one versioned `stepdown:real:card` record. Saving, sealing, migration, and valid replacement now commit one state and delete both legacy keys in the same transaction. Encryption reserves the storage queue before key derivation, so an import cannot overtake its commit. Rejected imports await normalization before showing their result. | Clean clone: `npm test -- --grep @claim:backup-validation` passed. Playwright `@claim:backup-validation rejects every named invalid backup and preserves the locked card` starts an invalid import during encryption, recreates the former sealed-plus-plaintext conflict, verifies atomic migration, repeats the missing-field rejection 25 times, and checks invalid date, reversed range, and overlap cases. Live suite passed. Screenshot: `.factory/qa-artifacts/polish-3/live-encrypted-rejection-mobile.png`. Live check: `/` encrypted-card recovery flow. |
| F-1-1 | The complete cassette-zine 404 keeps route metadata, header navigation, legal links, factory/version text, and return actions. | Playwright `the standalone 404 has complete navigation, metadata, legal links, and a working skip link`; HTTP `/missing-page` = 404. Screenshot: `.factory/qa-artifacts/polish-3/live-404-mobile.png`. Live check: `https://taper-calendar-card.sociobot.in/missing-page`. |
| F-1-2 | The 404 main landmark remains programmatically focusable and the skip action focuses it. | Same standalone-404 keyboard test passed live. Screenshot: `.factory/qa-artifacts/polish-3/live-404-mobile.png`. Live check: `/missing-page`. |
| F-1-3 | The safety note remains a non-landmark element. The axe test requires zero violations on every route in both themes. | Playwright `light and dark routes have no axe violations` passed live. Screenshot: `.factory/qa-artifacts/polish-3/live-demo-mobile.png`. Live check: `/demo`. |
| F-1-4 | Result-naming controls remain `Write my card` and `Leave demo and write a card`; both move focus to the editor. | Playwright first-screen, client-navigation, and query-demo tests passed live. Screenshots: `.factory/qa-artifacts/polish-3/live-verify/screenshot-mobile.png`, `.factory/qa-artifacts/polish-3/live-demo-mobile.png`. Live checks: `/`, `/demo`. |
| F-1-5 | Safety and recovery statements remain precise and registered as `no-clinical-output` and `no-passphrase-recovery`. | Both exact claim commands passed from the clean clone and in the live suite. Screenshot: `.factory/qa-artifacts/polish-3/live-encrypted-rejection-mobile.png`. Live checks: `/`, encrypted recovery screen. |
| F-1-6 | README and product copy retain plain visitor-facing wording; the round-3 audit updates the release version. | `.factory/copy-audit.md` has no sentence over 22 words and no banned wording. Screenshot: `.factory/qa-artifacts/polish-3/live-verify/screenshot-mobile.png`. Live check: `/`. |
| F-2-1 | The populated Prednisone sample still places a date, exact dose, and check control inside the initial 390 × 844 screen. | Playwright `one click shows a realistic date, dose, and check control in the 390px first demo screen` passed live. Screenshot: `.factory/qa-artifacts/polish-3/live-demo-mobile.png`. Live check: `/demo`. |
| F-2-2 | Privacy retains the accurate removal instruction: clear this site's data to remove a saved card. | `@claim:clear-device-data` passed from the clean clone and live. Screenshot: `.factory/qa-artifacts/polish-3/live-privacy-mobile.png`. Live check: `/privacy`. |
| F-2-3 | Backup copy still names required fields, valid dates, and non-overlapping steps. Round 3 makes the underlying encrypted preservation deterministic. | Strengthened `@claim:backup-validation` passed clean and live. Screenshot: `.factory/qa-artifacts/polish-3/live-encrypted-rejection-mobile.png`. Live check: encrypted recovery screen on `/`. |
| F-2-4 | The first-screen eyebrow remains `Copy your clinician's taper`. | Playwright `the first screen is complete at 390px and Write my card focuses the editor`; copy audit. Screenshot: `.factory/qa-artifacts/polish-3/live-verify/screenshot-mobile.png`. Live check: `/`. |
| F-2-5 | README retains `Run StepDown Card locally`. | `.factory/copy-audit.md`; clean-clone source check. Screenshot: `.factory/qa-artifacts/polish-3/live-verify/screenshot-desktop.png`. Live check: `/`. |
| F-2-6 | README and site retain the concrete current-browser/current-device storage wording. | `@claim:private-device` passed clean and live with a same-origin request log. Screenshot: `.factory/qa-artifacts/polish-3/live-privacy-mobile.png`. Live check: `/privacy`. |
| F-2-7 | Standalone-404 footer links retain 44 px targets. | Playwright `the real editor fits 390px and key mobile touch targets are at least 44px` passed live. Screenshot: `.factory/qa-artifacts/polish-3/live-404-mobile.png`. Live check: `/missing-page`. |

## Earlier verification regressions rechecked

| Earlier defect | Round-3 evidence |
| --- | --- |
| Time-zone date shifts | Unit date arithmetic plus browser checks in Auckland, Kiritimati, and GMT-12 passed. |
| Malformed imports overwrite or brick data | Backup round-trip and strengthened validation claim passed; the sole encrypted record stayed byte-for-byte unchanged. |
| Editing clears checks | `editing a dose preserves checks for dates still on the card` passed live. |
| Reversed or overlapping steps are accepted | Unit validation, form-retention browser test, and backup-validation claim passed. |
| Broken paid or account flow | `@claim:free-no-account` passed; no checkout, license, sign-in, analytics, or external request exists. |
| Worker caches secrets or stale results | Worker configuration unit test passed; live `sw.js` is `no-cache`, cache `stepdown-v7`, and only handles same-origin GET requests. |
| Dark contrast and landmark failures | Zero axe violations on five routes in both light and dark schemes; live Lighthouse accessibility 100. |
| 390 px overflow or undersized targets | First-screen, demo-first-screen, and touch-target tests passed live. |
| Import absent in empty or locked states | `backup import is available on a fresh device and on the encrypted lock screen` passed live. |
| Demo leaks or fails to restore real data | Direct, linked, and `?demo=1` tests passed; `@claim:demo-unsaved` found no demo IndexedDB record. |
| Route focus, announcement, title, canonical, or dead-link failures | Navigation/Back, metadata, 404 crawl, and skip-focus tests passed live. `/`, `/demo`, `/privacy`, and `/terms` returned 200; an unknown route returned 404. |
| Missing update notice, cache retirement, or cache headers | Update-notice and worker unit tests passed. Live hashed JS is immutable; `sw.js` is `no-cache`. |
| Missing touch icon or art disclosure | Route metadata tests passed; the footer and design notes retain generated-art provenance. |

## Acceptance evidence

- Fresh clone `/tmp/stepdown-polish3-clean.BbI2lp/repo` at `def8b76`: `npm ci` completed with zero vulnerabilities. Every one of the 14 exact commands in `.factory/claims.json` passed independently.
- Clean clone: `npm run typecheck`, `npm run lint`, `npm test` (11 unit + 31 browser), and `npm run build` passed. Build output: JS 23.27 kB / 8.04 kB gzip; CSS 8.83 kB / 2.89 kB gzip.
- Local verifier: no console errors; correct title, `lang=en`, one h1, main, alt text, and button names. Report: `.factory/qa-artifacts/polish-3/local-verify/verify.json`.
- Local Lighthouse mobile: performance 99, accessibility 100, best practices 100, SEO 100; FCP 1.0 s, LCP 2.2 s, TBT 0 ms, CLS 0.
- Production deployment ID: `7da0cc81-48fc-4136-b2fd-b7bb29919ab9`.
- Cold live Playwright run: 31/31 passed against `https://taper-calendar-card.sociobot.in`.
- Live verifier: no console errors and all structural checks passed. Report: `.factory/qa-artifacts/polish-3/live-verify/verify.json`.
- Live Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices, 100 SEO; FCP 0.9 s, LCP 1.8 s, TBT 0 ms, CLS 0.

No finding of any severity remains unresolved.

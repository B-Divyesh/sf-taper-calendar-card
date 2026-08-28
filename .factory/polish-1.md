# Polish round 1 — finding closure

Date: 2026-08-28 UTC  
Work order: `taper-calendar-card-polish-1`  
Reviewed candidate: `b537d9bf2203bb0a5a39c66f4a9eb01c006fda6a`  
Review report: `95d1984f155918002f6627cb1fde52118b8666c5:.factory/review-1.md`  
Repair code commit: `1bcb290`

## Review finding map

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Rebuilt `404.html` as a complete cassette-zine route with the wordmark, Demo/Card/Privacy navigation, Privacy/Terms footer links, Param Factory credit, version, route description, canonical `/404`, Open Graph/Twitter fields, theme color, favicon, touch icon, and two useful return paths. | Playwright `the standalone 404 has complete navigation, metadata, legal links, and a working skip link`; live `/missing-page` returned HTTP 404; screenshot `.factory/qa-artifacts/polish-1/live-404-mobile.png`; live URL `https://taper-calendar-card.sociobot.in/missing-page`. |
| F-1-2 | Added `tabindex="-1"` to the standalone 404 main landmark and a CSP-safe external skip-link handler that focuses it. | The same standalone-404 test presses Enter and asserts `#main` is focused; 30-test suite passed locally and live. |
| F-1-3 | Changed the inline card safety note from an `<aside>` landmark to a styled `<div>`. Tightened the accessibility suite from serious/critical-only to zero axe violations across `/`, `/demo`, `/privacy`, `/terms`, and `/404.html`, in light and dark modes. | Playwright `light and dark routes have no axe violations`; 30-test suite passed locally and live; live Lighthouse accessibility 100. |
| F-1-4 | Renamed `Start your own card` to `Write my card` and `Start for real` to `Leave demo and write a card`. Both now open and focus the medication editor; leaving demo restores an existing real card into the editor without mixing storage. | Playwright `the first screen is complete at 390px and Write my card focuses the editor`, `client navigation enters demo, restores real data...`, and `the query demo path is isolated, resettable, and returns to real data`; screenshot `.factory/qa-artifacts/polish-1/live-demo-query-mobile.png`. |
| F-1-5 | Replaced the overbroad safety sentence with the precise statement `It does not calculate doses, recommend doses, or check interactions.` Added `no-clinical-output` and `no-passphrase-recovery` to `claims.json`, each with exactly one observable browser test. Kept the passphrase statement identical in the card, lock screen, README, and claim entry. | Clean-clone commands `npm test -- --grep @claim:no-clinical-output` and `npm test -- --grep @claim:no-passphrase-recovery` passed. The first asserts no clinical controls/results or outside request; the second proves a wrong passphrase leaves the card locked with backup import as the only recovery path. All 13 claim commands passed independently. |
| F-1-6 | Rewrote README copy to use `works after you first open it`, `saves the files it needs for offline use`, and `browser’s built-in encryption`. Removed the release-history aside and unexplained `offline-ready`, `precaches`, `built shell`, and `Web Crypto` wording. | `.factory/copy-audit.md` now covers every landing phrase and every README sentence; nothing exceeds 22 words or uses a banned marketing word. |

## Required acceptance work beyond the six findings

- First-screen copy: the headline remains the six-word job statement `Track your taper day by day`; audience, primary sample action, immediate result, and all three facts are visible at 390 × 844. Evidence: Playwright first-screen test and `.factory/qa-artifacts/polish-1/home-mobile.png`.
- One-click isolated sample: both `/demo` and `/?demo=1` load the populated 14-day sample with the persistent banner, Reset demo, and Leave demo action. The demo remains memory-only and restores real data on exit. Evidence: `@claim:demo-unsaved`, the query-demo test, and `.factory/demo.md`.
- Claims: `.factory/claims.json` contains 13 entries and exactly one tagged test per entry. Every exact command passed from fresh clone `/tmp/taper-polish-clean.BoAIX7` after `npm ci` with zero audit vulnerabilities.
- Routing and metadata: all four app routes have route-specific titles, descriptions, canonical and social metadata; client navigation and Back restore focus and route state. The standalone 404 has the same contract and a real 404 response through Static Web Apps.
- Mobile: the complete first screen and editor fit 390 px; tested controls remain at least 44 px. Visual identity remains the original cassette-era zine.
- Catalog: `.factory/catalog-description.txt` is verb-first and 81 characters.

## Cumulative historical regression check

The review report re-listed defects from the earlier verification records. They remain covered as follows:

| Earlier defect | Current evidence |
| --- | --- |
| Time-zone date shifts | Unit date-boundary test plus browser checks in Auckland, Kiritimati, and GMT-12. |
| Malformed imports overwrite data | `a malformed backup never replaces a valid card or bricks reload`. |
| Editing clears checks | `editing a dose preserves checks for dates still on the card`. |
| Reversed or overlapping steps are accepted | Unit validation and browser field-retention test. |
| Broken paid checkout/license flow | `@claim:free-no-account`; no checkout or license controls exist. |
| Worker caches secrets or stale license results | Worker is same-origin GET-only; unit configuration test confirms no Sociobot API handling. |
| Dark contrast failure | Zero axe violations in both color schemes; live Lighthouse accessibility 100. |
| 390 px overflow or undersized targets | Mobile width and 44 px target assertions pass. |
| Import absent in recovery states | Fresh and encrypted-lock import test passes. |
| Demo route state or real-card restore fails | Direct, linked, and query demo tests pass. |
| Route focus/announcement or dead links fail | Navigation, Back, metadata, 404 crawl, and skip-focus tests pass. |
| Missing update notice or stale-cache cleanup | Worker update-notice browser test and worker configuration unit test pass. |
| Cache headers missing | Live hashed JavaScript returns `Cache-Control: public, max-age=31536000, immutable`. |
| Canonical, touch icon, or art disclosure missing | Metadata tests and standalone-404 crawl pass; generated-art disclosure remains in the footer and design notes. |

## Final evidence

- Local: `npm run typecheck`, `npm run lint`, `npm test` (11 unit + 30 browser), and `npm run build` passed.
- Local URL verifier: zero console/page errors; title, `lang=en`, one h1, main landmark, alt text, and button labels passed. Report: `.factory/qa-artifacts/polish-1/verify-local/verify.json`.
- Local Lighthouse mobile: performance 99, accessibility 100, best practices 100, SEO 100; LCP 2.2 s, TBT 0 ms, CLS 0. Report: `.factory/qa-artifacts/polish-1/lighthouse-local-mobile.json`.
- Live: all 30 browser tests passed against `https://taper-calendar-card.sociobot.in` in a fresh run.
- Live URL verifier: zero console/page errors and all structural checks passed. Report: `.factory/qa-artifacts/polish-1/verify-live/verify.json`.
- Live Lighthouse mobile: performance 100, accessibility 100, best practices 100, SEO 100; FCP 0.8 s, LCP 1.4 s, TBT 10 ms, CLS 0. Report: `.factory/qa-artifacts/polish-1/lighthouse-live-mobile.json`.

No review finding of any severity remains open.

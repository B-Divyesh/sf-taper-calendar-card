# Repair handoff — taper-calendar-card-polish-2

## Outcome

All findings in `.factory/review-1.md` and `.factory/review-2.md`, plus the controller’s encryption regression, are closed. The repaired static PWA is live at `https://taper-calendar-card.sociobot.in` and the deployed JavaScript hash matches the local production build.

Implementation commits: `e3f0f47`, `c8ac848`, `5cd5758`, `bb65a67`, and `8e14652`. Azure Static Web Apps deployment ID: `6e6b642a-8fa6-427f-9845-b388256a8ab5`.

## What changed

- Replaced the generic demo with a clearly labelled 14-day Prednisone sample. A date, dose, and check control now appear in the first 390 × 844 screen.
- Kept the demo banner, Reset, exit, `/demo`, and `?demo=1` paths isolated from real IndexedDB data. Secondary tools now follow the first schedule rows.
- Rewrote the landing eyebrow, privacy removal instructions, encrypted-backup assurance, README heading, README storage wording, and catalog description in plain words.
- Added the `backup-validation` registry entry and claim test. It rejects missing fields, invalid dates, reversed ranges, and overlapping steps while preserving the encrypted record.
- Made encrypted storage transitions atomic and prevented stale plaintext writes whenever an encrypted record exists.
- Fixed the final encrypted-import regression: all IndexedDB reads and mutations now run in order. Invalid imports preserve byte-identical sealed bytes and remove any stale plaintext in one committed transaction before the app reports the rejection.
- Versioned the service-worker cache as `stepdown-v6` and emitted a new hashed app asset (`index-Cp8hDQrJ.js`) so existing offline clients pick up the storage repair instead of retaining an immutable prior script.
- Enlarged every standalone-404 footer link to at least 44 × 44 px and updated route version metadata.
- Retained the cassette-zine visual system, original generated collage, light/dark treatments, and offline static-PWA architecture.

## Verification

Final clean clone: `/tmp/stepdown-final-v6-clean.7AHtld/repo` at `8e14652cf9606d4c98dd34840c817771598345b1`.

- `npm ci`: pass; 177 packages; 0 vulnerabilities.
- Every one of the 14 exact commands in `.factory/claims.json`: pass individually from the final clean clone.
- `npm run typecheck`: pass.
- `npm run lint`: pass.
- `npm test`: pass; 11 unit tests and 31 Playwright tests.
- Exact mandated command `npm run test:e2e -- --workers=1`: pass; 31/31. This includes the four-case `@claim:backup-validation` test, which proves invalid backup inputs retain byte-identical sealed storage and no plaintext record.
- `npm run build`: pass; `dist/index.html` present. Initial JS 22.72 kB / 7.82 kB gzip; CSS 8.83 kB / 2.89 kB gzip.
- Accessibility: Playwright axe 4.10.2 reports zero violations on `/`, `/demo`, `/privacy`, `/terms`, and `/404.html` in light and dark modes.
- Privacy: claim tests and the live cold flow observed no third-party requests.
- Offline: `@claim:offline-reload` passed from the clean clone and against the live deployment.
- Factory URL verifier: pass live with one h1, `lang=en`, main landmark, complete alt text, labelled buttons, and no console errors.
- Live browser suite: 31/31 pass at `https://taper-calendar-card.sociobot.in`, including the sealed-card missing-field regression.
- Live routes: `/`, `/demo`, `/privacy`, and `/terms` return 200; `/missing-page` returns 404.
- Live 390 × 844 demo: first schedule row ends at 651 px; width is 390 px; no console errors or outside requests. Screenshot: `.factory/qa-artifacts/polish-2/live-demo-first-screen.png`.
- Live Lighthouse mobile: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.7 s, CLS 0, TBT 10 ms.
- Final live cold check: `/`, `/demo`, `/privacy`, and `/terms` return 200; `/missing-page` returns 404. `verify-url.sh` reports no console errors, one h1, `lang=en`, main, alt text, and labelled buttons. Evidence: `.factory/qa-artifacts/final-live/verify.json` and screenshots.
- Final live asset is `/assets/index-Cp8hDQrJ.js`; `sw.js` declares `stepdown-v6`. Live and local browser suites pass after this cache transition.
- Final live JavaScript SHA-256: `0bce0bcb542d9c40143f6e2e3388f98f60bb280a86d92480b111b6c72e37d0f4`, identical locally and live. Final service-worker SHA-256: `69fafdde2d1b4426f4a27d6c5675eefd6b65674ebfd0e16066f5c4ca67b7aa33`, identical locally and live.

Run locally with `npm ci && npm test && npm run build`. Serve `dist/` over HTTP when checking the service worker and offline reload.

## Known gaps and next steps

None. No review finding, failed claim, TODO, stub, console error, or known release gap remains.

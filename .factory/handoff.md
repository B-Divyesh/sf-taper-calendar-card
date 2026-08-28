# Repair handoff — taper-calendar-card-polish-2

## Outcome

All findings in `.factory/review-1.md` and `.factory/review-2.md` are closed. The repaired static PWA is live at `https://taper-calendar-card.sociobot.in` and the deployed JavaScript hash matches the local production build.

Implementation commits: `e3f0f47`, `c8ac848`, and `5cd5758`. Azure Static Web Apps deployment ID: `fe7442f8-5c38-4bab-b02d-f260fa21facd`.

## What changed

- Replaced the generic demo with a clearly labelled 14-day Prednisone sample. A date, dose, and check control now appear in the first 390 × 844 screen.
- Kept the demo banner, Reset, exit, `/demo`, and `?demo=1` paths isolated from real IndexedDB data. Secondary tools now follow the first schedule rows.
- Rewrote the landing eyebrow, privacy removal instructions, encrypted-backup assurance, README heading, README storage wording, and catalog description in plain words.
- Added the `backup-validation` registry entry and claim test. It rejects missing fields, invalid dates, reversed ranges, and overlapping steps while preserving the encrypted record.
- Made encrypted storage transitions atomic and prevented stale plaintext writes whenever an encrypted record exists.
- Enlarged every standalone-404 footer link to at least 44 × 44 px and updated route version metadata.
- Retained the cassette-zine visual system, original generated collage, light/dark treatments, and offline static-PWA architecture.

## Verification

Final clean clone: `/tmp/stepdown-polish-2-proof.heJgZj/repo` at `5cd5758686edfeedf7de8e54bda5a6783f8187c6`.

- `npm ci`: pass; 177 packages; 0 vulnerabilities.
- Every one of the 14 exact commands in `.factory/claims.json`: pass individually. Log: `.factory/qa-artifacts/polish-2/clean-claim-tests.log`.
- `npm run typecheck`: pass.
- `npm run lint`: pass.
- `npm test`: pass; 11 unit tests and 31 Playwright tests.
- `npm run build`: pass; `dist/index.html` present. Initial JS 22.19 kB / 7.67 kB gzip; CSS 8.83 kB / 2.89 kB gzip.
- Accessibility: Playwright axe 4.10.2 reports zero violations on `/`, `/demo`, `/privacy`, `/terms`, and `/404.html` in light and dark modes.
- Privacy: claim tests and the live cold flow observed no third-party requests.
- Offline: `@claim:offline-reload` passed from the clean clone and against the live deployment.
- Factory URL verifier: pass live with one h1, `lang=en`, main landmark, complete alt text, labelled buttons, and no console errors.
- Live browser suite: 31/31 pass at `https://taper-calendar-card.sociobot.in`.
- Live routes: `/`, `/demo`, `/privacy`, and `/terms` return 200; `/missing-page` returns 404.
- Live 390 × 844 demo: first schedule row ends at 651 px; width is 390 px; no console errors or outside requests. Screenshot: `.factory/qa-artifacts/polish-2/live-demo-first-screen.png`.
- Live Lighthouse mobile: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.7 s, CLS 0, TBT 10 ms.
- Live built JavaScript SHA-256: `fc3401b9a306c502b1f14808d13d3e06be766cc4208740941eef9e0fe0b23f01`, identical locally and live.

Run locally with `npm ci && npm test && npm run build`. Serve `dist/` over HTTP when checking the service worker and offline reload.

## Known gaps and next steps

None. No review finding, failed claim, TODO, stub, console error, or known release gap remains.

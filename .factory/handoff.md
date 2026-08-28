# StepDown Card repair handoff

## Independent verifier update — PASS

Candidate `b537d9bf2203bb0a5a39c66f4a9eb01c006fda6a` is accepted for release after a fresh independent verification of `https://taper-calendar-card.sociobot.in` on 2026-08-28 UTC. The live deployment matched local `dist/` byte-for-byte for all served product assets. All 11 exact claims commands, TypeScript, ESLint, full unit/browser tests, and the production build passed. Independent desktop/390 px mobile, keyboard, dark/light axe, offline service-worker reload, update notice, privacy traffic, headers, and route checks passed. Fresh mobile Lighthouse: Performance 99, Accessibility 100, Best Practices 100, SEO 100.

There are no release-blocking defects or known product gaps from this verification. Full evidence is in `.factory/verification-2.md`.

## Outcome

Release-blocking findings from verifier report `3be5529` against candidate `a4fdaf2` are repaired and deployed.

- Live URL: `https://taper-calendar-card.sociobot.in`
- Repair commit: `a7ee2bf` (code); final evidence commit follows this handoff update
- Azure Static Web Apps deployment: `8efc1fb4-9884-432a-865a-d9cb5263f75d`
- Artifact class remains `pwa-offline`; output remains `dist/`

## Repairs

- Replaced local-noon/ISO date conversion with calendar-date arithmetic. Dates and CSV now stay exact in UTC+12, UTC+13, and UTC+14 cases.
- Added strict nested backup validation and atomic real-card replacement. A malformed import leaves the current stored card unchanged and reload-safe.
- Preserved acknowledgements for dates retained during edits. Invalid ranges and overlapping steps now report an inline error without clearing input.
- Made backup import available from the empty editor and encrypted lock screen.
- Made demo state memory-only. `/demo` never reads real card data; leaving it restores an existing real card.
- Reworked client routing, canonical URLs, heading focus, route announcements, legal navigation, and server-side 404 handling.
- Limited service-worker handling to same-origin GETs, removed runtime response caching, deleted old caches, and added an update notice. License tokens and verification responses can no longer enter Cache Storage.
- Fixed night-theme contrast, focus contrast, 390px form width, date-field legibility, and all reported sub-44px targets.
- Added immutable caching for hashed assets and `no-cache` for `sw.js`.
- Added a real 180px Apple touch icon, corrected generated-art provenance, added footer disclosure, and expanded the full landing copy audit.
- Removed the unavailable paper-pack offer and all license code. The factory checkout was not registered, and repository policy forbids billing administration from this product repo. The complete card, printing, backup, encryption, and exports remain free.

## Regression coverage

`src/schedule.test.ts` covers calendar boundaries, overlap/reversal rejection, strict backup schemas, service-worker scope, old-cache deletion, immutable asset policy, and 404 policy.

`e2e/app.spec.ts` covers all user-visible claims plus:

- `Pacific/Auckland`, `Pacific/Kiritimati`, and `Etc/GMT+12` dates and CSV
- malformed import survival across reload
- acknowledgement-preserving dose edits
- non-destructive reversal and overlap errors
- recovery on empty and encrypted screens
- demo/history restoration and canonical metadata
- heading focus, route announcement support, keyboard-only operation
- light and dark axe scans on `/`, `/demo`, `/privacy`, and `/terms`
- service-worker update UI
- 390px overflow and 44px touch geometry

Every ID in `.factory/claims.json` appears in exactly one tagged Playwright test. All 11 exact claim commands passed independently.

## Verification evidence

Run from a clean dependency install on 2026-08-28 UTC:

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

- `npm ci`: 177 packages installed; 0 vulnerabilities.
- TypeScript: pass.
- ESLint: pass.
- Vitest: 11/11 pass.
- Playwright: 24/24 pass using pinned `@playwright/test` 1.58.2.
- Build: JS 20.68 KB / 7.33 KB gzip; CSS 8.37 KB / 2.79 KB gzip; hero 100,952 bytes.
- Local verifier: title, `lang`, one `h1`, `main`, alt text, labels, desktop/mobile rendering, and console checks pass; zero console errors.
- Live Playwright: 6/6 selected deployment checks pass for offline reload, real 404 route, update notice, keyboard, light/dark axe, and 390px mobile.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; FCP 0.8 s, LCP 1.8 s, TBT 10 ms, CLS 0.
- Live headers: CSP, HSTS, `nosniff`, and referrer policy present. Hashed JS returns `public, max-age=31536000, immutable`; `sw.js` returns `no-cache`; an unknown URL returns HTTP 404.
- Offline: controlled `/demo` reload passes with the browser network disabled.
- Privacy: real create/check/reload makes no third-party request; demo writes no demo record; no analytics, checkout, remote fonts, or third-party scripts are present.
- Live identity SHA-256 matches local `dist/`:
  - `index.html`: `e78d35e293b9fbd4ff1e3fea64cf8565c06e067f237e78722284cf06108e200b`
  - app JS: `88f7e795b69a5d1a92ea6575c3d800335ab5c2e90922794d6bbce05dff779491`
  - `sw.js`: `50c1f3cdfbc7d9d1a5025476cfdb55e9c54708aa098a2b999cc9aba6ad13d29e`

Evidence is under `.factory/qa-artifacts/repair-local/`, `.factory/qa-artifacts/repair-live/`, and the two `lighthouse-repair-*.json` files.

## Known gaps and next steps

No release-blocking product gap remains. A paid print pack can be reconsidered only after the factory registers and verifies a live Sociobot product; it must not be advertised before that endpoint exists.

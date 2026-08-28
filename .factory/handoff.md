# StepDown Card handoff

## Independent verification result: FAIL

- Candidate: `a4fdaf2b5f9c0791f270dbeee92d2396bcc79c86`
- Live URL: `https://taper-calendar-card.sociobot.in`
- Verified: 2026-08-28 UTC
- Full evidence and reproduction details: `.factory/verification.md`

Do not release this candidate. The live deployment is byte-for-byte consistent with the candidate, so these are current production defects rather than a stale-deploy mismatch.

## Release blockers

- Date-only schedules shift one day in UTC+13/+14 and UTC−12 time zones.
- Malformed JSON import can overwrite the valid local card and make the app blank on reload.
- Editing a card silently erases all acknowledgements; reversed dates erase entered form values; overlapping steps are accepted as duplicate same-day doses.
- The advertised $9 checkout returns HTTP 404.
- The service worker caches full license-token URLs and verification responses, allowing stale license verdicts despite the API's `no-store` response.
- Dark app screens have serious axe contrast failures.
- The 390 px real-card editor is 436 px wide and clips fields.
- The claims manifest has duplicate claim tags, incomplete/misaligned coverage, and an unlisted false “nothing is saved” statement.

Additional failures cover demo/history state, backup recovery access, route focus, dead Schedule fragments, unreachable 404 behavior, sub-44 px touch targets, absent update notification, and missing immutable caching. See the verification report.

## What passed

- `npm ci`, `npm test` (5 unit + 3 Playwright), `npx tsc -b --pretty false`, and `npm run build`.
- Mandatory first-read and one-click sample-data checks.
- Live deployment identity against local `dist/`.
- Normal create/check/reload, CSV/JSON export, print generation, and correct/wrong-passphrase flows.
- Live service-worker registration and offline reload for demo and privacy routes.
- Same-origin-only normal workflow; no analytics, remote fonts, or third-party scripts observed.
- License API rate limit: requests 1–30 returned 200; request 31 returned 429 with `Retry-After: 4`.
- Lighthouse mobile: Performance 97, Accessibility 100 for the light page, Best Practices 100, SEO 100; LCP 1.5 s and CLS 0.

## Re-run

```bash
npm ci
npm test
npx tsc -b --pretty false
npm run build
/opt/fleet/lib/verify-url.sh https://taper-calendar-card.sociobot.in .factory/qa-artifacts/verify-url
```

No lint script exists. Re-run axe in both light and dark color schemes and timezone cases including `Pacific/Auckland`, `Pacific/Kiritimati`, and `Etc/GMT+12` after repair.

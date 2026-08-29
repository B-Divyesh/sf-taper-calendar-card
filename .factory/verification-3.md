# Independent product verification — candidate `bf328f4`

## Verdict: PASS

- Candidate tested: `bf328f442e94871701e38259496b289812cd0db1`
- Live URL: `https://taper-calendar-card.sociobot.in`
- Verified: 2026-08-29 UTC
- Work order: `taper-calendar-card-verify-3`
- Scope: fresh-install claim gate; production build; independent live desktop and 390 px mobile use; privacy/network, response headers, PWA/offline and update behavior, keyboard, reduced motion, axe, caching, bundle size, deployment identity, and Lighthouse.

The live deployment is the production artifact built from this candidate. No release-blocking defect was found.

## Mandatory release gates

### First-read and demo sandbox: PASS

A cold, new-browser visit to `/` says all required things on the first screen in plain words:

- **What it does:** “Track your taper day by day.”
- **For whom:** “For people following clinician instructions who need each dose and checked day in one private card.”
- **What to click first:** “Try it with sample data,” immediately followed by “Opens a filled sample card. Nothing is saved.”

The action is visible and links to `/?demo=1`. At 390 × 844 it opens a realistic populated 14-day, three-step Prednisone sample, with a visible date/dose/check control and the persistent “Demo — sample data, nothing is saved” banner. Reset demo and Leave demo and write a card are available. The independent mobile run found no horizontal overflow.

### Claims gate: PASS

`.factory/claims.json` is present. From the clean candidate checkout, after `npm ci`, every listed command was invoked before the other quality work. All passed. The 13-unit-test suite also checks that every claim has exactly one matching `@claim:<id>` browser test.

| Claim ID | Exact command result |
| --- | --- |
| `offline-reload` | PASS |
| `csv-export` | PASS |
| `private-device` | PASS |
| `backup-roundtrip` | PASS |
| `backup-validation` | PASS |
| `encrypted-card` | PASS |
| `no-passphrase-recovery` | PASS |
| `demo-unsaved` | PASS |
| `print-card` | PASS |
| `free-no-account` | PASS |
| `transcription-only` | PASS |
| `no-clinical-output` | PASS |
| `clear-device-data` | PASS |
| `check-timestamp` | PASS |

### Clean-checkout quality gates: PASS

```text
npm ci                         PASS — 177 packages installed; 0 vulnerabilities
npm run typecheck              PASS
npm run lint                   PASS
npm test                       PASS — 13 Vitest tests; 31 Playwright tests
npm run build                  PASS — dist/ produced
```

The production build contains 23.49 kB JavaScript (8.08 kB gzip) and 8.83 kB CSS (2.89 kB gzip), within the static/PWA budgets. The 100,952-byte hero WebP is below the 300 kB mobile image budget.

## Independent live verification: PASS

- Running `PLAYWRIGHT_BASE_URL=https://taper-calendar-card.sociobot.in npm run test:e2e` passed **31/31** live tests. These cover normal card entry, boundary dates, invalid/reversed/overlapping entries and recovery, editing/acknowledgement persistence, CSV and JSON backup paths, encryption and wrong-passphrase recovery, demo isolation, print, legal routes, metadata, link crawl, desktop and 390 px behavior, keyboard, touch target size, and light/dark axe scans.
- A separate cold-live request log contained only same-origin GETs for the document, hashed JS/CSS, and hero image. The independently exercised landing-to-demo/offline flow also made only same-origin GETs; it had no console or page errors. There are no account, analytics, checkout, identity, remote font, or third-party requests.
- In a 390 px dark, `prefers-reduced-motion: reduce` context, the skip link was first in tab order, the first-read content was visible, the document did not overflow, the reduced-motion media query matched, and the transition duration was `0.00001s`. An independent axe scan of the demo found zero serious or critical violations.
- After service-worker control, browser networking was disabled and `/?demo=1` reloaded to the populated sample. The live service worker uses versioned cache `stepdown-v8`, `skipWaiting`, `clients.claim`, old-cache deletion, and an `UPDATE_AVAILABLE` message; the live suite confirmed the visible update notice and Reload now action.
- `/`, `/demo`, `/privacy`, and `/terms` returned 200; a missing path returned the designed 404 with HTTP 404. The live manifest is standalone with a versioned start URL and 192/512 maskable icons.

## Policy, headers, performance, and deployment identity: PASS

- Root headers: HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a restrictive same-origin CSP. `sw.js` is `Cache-Control: no-cache`; the hashed JS is `public, max-age=31536000, immutable`.
- Fresh live Lighthouse (`lighthouse@12.8.2`) reported: Performance **92**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.0 s, LCP 1.4 s, TBT 350 ms, CLS 0.
- The live HTML, JS, CSS, service worker, and manifest match this build. SHA-256 matches include `index.html` `35b3b4ea0534b90eacd049ccefecc5e4a624e1fc9c7be42433d337040ab47a62`, `sw.js` `a38c8f04aa6cb5242c280fc19e5df44a6e6c68973804db66b87b7b75aa4ba87d`, `manifest.webmanifest` `c5f97fed4c48ddbb12f165df1f17639ad62d5de3204eebe02826f3ee81114af2`, JS `b06a85b93e96f9913c8093ccfd16d1ddaf04bf0cef11a61040f18326c4788bbd`, and CSS `0d199917c151a4195ed6547f9234c2e2ca4c16b3e8ea51784539ecb2ead36a11`.
- The product is static/local-first and exposes no server-side or product-unlock API endpoint; documented request-allowance/429 testing is therefore not applicable. It has no sign-in, so Entra tenant verification is not applicable.

## Findings by severity

No critical, high, medium, low, or release-blocking findings.

# Independent product verification — candidate `b537d9b`

## Verdict: PASS

- Candidate tested: `b537d9bf2203bb0a5a39c66f4a9eb01c006fda6a`
- Live URL: `https://taper-calendar-card.sociobot.in`
- Verified: 2026-08-28 UTC
- Work order: `taper-calendar-card-verify-2`
- Scope: clean-install claims gate; local checks and production build; independent live desktop and 390 px mobile use; privacy/network, PWA, response headers, deployment identity, accessibility, keyboard, motion, and performance checks.

The live deployment is byte-for-byte the production artifact from the candidate (apart from `staticwebapp.config.json`, which is deployment configuration and correctly is not served). No release-blocking defects were found.

## Mandatory gates

### First-read and sample sandbox: PASS

A cold, new-browser visit to `/` has one plain-language first screen:

- **What it does:** “Track your taper day by day.”
- **For whom:** “For people following clinician instructions who need each dose and checked day in one private card.”
- **What to click first:** “Try it with sample data,” with the immediate result “Loads an example card. Nothing is saved.”

The first click opened the populated 14-day “Example medication” card and its persistent “Demo — sample data, nothing is saved” banner. Reset removed the acknowledgement made during the demo. This meets the one-click, isolated-sample requirement.

### Claims gate: PASS

`.factory/claims.json` is present and declares 11 claims. From a clean `npm ci` install, I invoked every command in that file, via the demo-capable browser entry point:

| Claim ID | Result |
| --- | --- |
| `offline-reload` | PASS |
| `csv-export` | PASS |
| `private-device` | PASS |
| `backup-roundtrip` | PASS |
| `encrypted-card` | PASS |
| `demo-unsaved` | PASS |
| `print-card` | PASS |
| `free-no-account` | PASS |
| `transcription-only` | PASS |
| `clear-device-data` | PASS |
| `check-timestamp` | PASS |

Each ID has exactly one `@claim:<id>` Playwright test. The subsequent full suite also passed all 11 claim tests.

## Clean-checkout quality gates: PASS

```text
npm ci                         PASS — 177 packages, 0 vulnerabilities
npm run typecheck              PASS
npm run lint                   PASS
npm test                       PASS — 11 Vitest + 24 Playwright tests
npm run build                  PASS — dist/ produced
```

The production bundle is 20,678 bytes JavaScript (7,367 bytes gzip) and 8,372 bytes CSS (2,798 bytes gzip), comfortably below the static/PWA initial-JS and CSS budgets. The 100,952-byte hero is below the 300 KB mobile budget.

## Independent functional checks: PASS

- Created a real Prednisone card with exact clinician text, the boundary dates `2026-12-31` through `2027-01-02`, and the exact dose wording `7.5 mg exactly`. The rendered and CSV dates remained exact, including the year boundary.
- Checked a day; the CSV included its local acknowledgement time. Editing the retained date/dose schedule preserved the acknowledgement.
- A reversed date range produced “A step cannot end before it starts” and retained all entered form data.
- The live sample contains 14 sequential days and Reset demo removes a check. The demo did not make a persistent demo record.
- The local regression suite also passed date-only tests in `Pacific/Auckland`, `Pacific/Kiritimati`, and `Etc/GMT+12`; malformed-backup recovery; overlap prevention; backup recovery from empty and encrypted screens; JSON backup round-trip; encryption/unlock; print; and real-card persistence.
- Privacy, terms, demo, card navigation, and the designed missing page all work. Live status codes were `/`, `/demo`, `/privacy`, `/terms` = 200 and `/missing-page` = 404.

## Accessibility and interaction: PASS

- `/opt/fleet/lib/verify-url.sh` on the live root: 200 response, title present, `lang=en`, exactly one `h1`, a `main`, no missing image alt text, no unlabeled buttons, and no load errors.
- Independent `@axe-core/playwright` scans found **zero serious or critical violations** on `/`, `/demo`, `/privacy`, and `/terms` in both light and dark color schemes.
- At 390 px dark-mode mobile, `scrollWidth` equalled `innerWidth` (390 px), and all inspected buttons and links were at least 44 px high/wide as applicable. The sample card remained legible and usable.
- Keyboard-only use reached the skip link first, moved it to `#main`, activated the sample action with Enter, and toggled a daily check with Space. Focus styling was visible.
- With `prefers-reduced-motion: reduce`, the checked-row animation and transition durations were `0.01ms`.
- Cold and exercised live flows had no console or page errors.

## Privacy, PWA, and browser policy: PASS

- Captured live page traffic was same-origin only: root HTML, hashed JS/CSS, hero image, and the demo route. No analytics, remote fonts, checkout, identity, or other third-party request was observed. The product has no sign-in.
- A real card, acknowledgement, and reload persisted locally; encrypted cards use browser Web Crypto. The app has no server-side product endpoint or product-unlock/billing call, so rate-limit testing is not applicable.
- The live manifest is valid for the standalone PWA and includes 192/512 maskable icons and a versioned start URL. The active `stepdown-v3` service worker precached the shell, app assets, legal/demo routes, and icons. After control was established, `/demo` reloaded with browser networking disabled and displayed the sample card without errors.
- An `UPDATE_AVAILABLE` service-worker message displayed “An update is available” and a working “Reload now” control.
- Live headers include HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a restrictive same-origin CSP. `sw.js` is `no-cache`; hashed JS is `public, max-age=31536000, immutable`.

## Performance: PASS

Fresh live mobile Lighthouse (`lighthouse@12.8.2`, Chrome 145) reported:

| Category | Score |
| --- | ---: |
| Performance | 99 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

FCP 1.7 s, LCP 1.7 s, TBT 0 ms, CLS 0, and total transfer 184 KiB.

## Deployment identity: PASS

Local `dist/` and live files matched SHA-256 for the HTML, service worker, manifest, 404 assets, favicon, all icons, hero/social images, robots/sitemap, and hashed JS/CSS. Representative hashes:

- `index.html`: `e78d35e293b9fbd4ff1e3fea64cf8565c06e067f237e78722284cf06108e200b`
- `assets/index-DRYw2-RC.js`: `88f7e795b69a5d1a92ea6575c3d800335ab5c2e90922794d6bbce05dff779491`
- `assets/index-DnrWqz1c.css`: `6f0edef3148b6a1f40c310979638338b3da9c41a032d6059a7fc49b799768b80`
- `sw.js`: `50c1f3cdfbc7d9d1a5025476cfdb55e9c54708aa098a2b999cc9aba6ad13d29e`

## Findings by severity

No critical, high, medium, or low release defects found.

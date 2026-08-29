# Repair handoff — taper-calendar-card-polish-5

## Outcome

Released the cumulative round-5 repair at `https://taper-calendar-card.sociobot.in`.

The visible 404 now says `Page not found` without product metaphor, and the footer now says `The collage was generated for StepDown Card.` The first-screen sample action is a real `/?demo=1` link with a clear result sentence. It opens the populated, isolated Prednisone sample in one click with its persistent banner, Reset action, and exit action.

Demo verification exposed and fixed one extra isolation edge: loading a current real card unnecessarily reserialized its IndexedDB record. Reads no longer rewrite the authoritative record, and the demo claim now proves the real bytes are unchanged before, during, and after sample use.

The cassette-era zine identity, static PWA architecture, original generated collage, local-first storage, exports, printing, and browser encryption are preserved. Version is `1.5.0`; worker cache is `stepdown-v8`.

## Commits and deployment

- Repair commit: `617b2b1895aeb1d70f4938168b815fe9ad1bba0f`.
- Verification-hardening commit: `6d3073ffa61e101350e4437a447ecdce32bac898`.
- Evidence bundle commit: `24fd5829e454c3e00dd1ccccf169472dd19a0212`.
- Both commits were pushed to `origin/main`.
- Azure Static Web Apps deployment ID: `556b2786-19c1-43b1-bff4-4fe82193c6f9`.
- Deployed URL: `https://taper-calendar-card.sociobot.in`.
- Local and live SHA-256: `index.html` = `35b3b4ea0534b90eacd049ccefecc5e4a624e1fc9c7be42433d337040ab47a62`; `sw.js` = `a38c8f04aa6cb5242c280fc19e5df44a6e6c68973804db66b87b7b75aa4ba87d`.

## Verification

- Fresh remote clone: `/tmp/taper-polish5-final.sFTr0w/repo` at `6d3073ffa61e101350e4437a447ecdce32bac898`.
- `npm ci`: pass; 177 packages, zero vulnerabilities.
- Every one of the 14 exact `.factory/claims.json` commands: pass independently.
- `npm run typecheck`: pass.
- `npm run lint`: pass.
- `npm test`: pass; 13 unit tests and 31 Playwright tests.
- `npm run build`: pass; `dist/index.html` present.
- Bundle: JS 23.49 kB / 8.08 kB gzip; CSS 8.83 kB / 2.89 kB gzip.
- Local URL verifier: pass with no console errors. Evidence: `.factory/qa-artifacts/polish-5/local-verify/`.
- Local Lighthouse mobile: 99 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 2.1 s, TBT 0 ms, CLS 0.
- Cold live Playwright after deployment: 31/31 pass. This includes every claim, offline reload, same-origin request allowlists, zero axe violations in light and dark, keyboard/focus, 390 px layout, 44 px targets, metadata, link crawl, and 404 status/copy.
- Live URL verifier: pass with no console errors. Evidence: `.factory/qa-artifacts/polish-5/live-verify/`.
- Live Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices, 100 SEO; FCP 0.8 s, LCP 1.4 s, TBT 0 ms, CLS 0.
- Live routes: `/`, `/demo`, `/privacy`, and `/terms` = 200; `/missing-page` = 404.
- Live headers: immutable hashed assets, no-cache service worker, same-origin CSP, Referrer-Policy, and `X-Content-Type-Options` all present.
- Screenshots: `.factory/qa-artifacts/polish-5/live-verify/screenshot-mobile.png`, `.factory/qa-artifacts/polish-5/live-demo-mobile.png`, `.factory/qa-artifacts/polish-5/live-404-mobile.png`, `.factory/qa-artifacts/polish-5/live-encrypted-lock-mobile.png`, and `.factory/qa-artifacts/polish-5/live-privacy-mobile.png`.

Run the gate with:

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

The exact per-claim commands are in `.factory/claims.json`. The complete finding-to-change-to-evidence map is in `.factory/polish-5.md`.

## Known gaps and next steps

None. Every finding in reviews 1–5, every controller regression, and every original verification defect was rechecked against source, a clean clone, and the deployed site.

## Independent verification 3 — PASS

On 2026-08-29 UTC, candidate `bf328f442e94871701e38259496b289812cd0db1` was independently verified at `https://taper-calendar-card.sociobot.in` and **PASSED** release. A fresh `npm ci` install, all 14 exact claim commands, typecheck, lint, the full local test suite (13 unit / 31 Playwright), and the exact production build passed. The independent live suite also passed 31/31; live JS, CSS, HTML, service worker, and manifest matched the candidate build by SHA-256.

The first screen communicates the job, intended user, and one-click “Try it with sample data” path. Desktop and 390 px mobile behavior, keyboard/focus, reduced motion, offline demo reload, service-worker update notice, same-origin-only traffic, headers/caching, and axe serious/critical checks passed. Fresh live Lighthouse was 92 performance / 100 accessibility / 100 best practices / 100 SEO (FCP 1.0 s, LCP 1.4 s, CLS 0). No critical, high, medium, or low defects remain. Full candidate-specific evidence is in `.factory/verification-3.md`.

# Repair handoff — taper-calendar-card-polish-1

## Outcome

Polish round 1 is complete. Every finding in `.factory/review-1.md` is fixed, every historical regression named there remains covered, and no severity is deferred. The cassette-era zine identity and static offline PWA deployment class are unchanged.

The repaired product is live at `https://taper-calendar-card.sociobot.in`. Azure Static Web Apps deployment `03f725e0-d19a-40f9-930f-19f326903c44` completed successfully on 2026-08-28 UTC.

## What changed

- Promoted the static 404 to a complete site route with metadata, navigation, legal/footer links, version, focusable main content, and keyboard skip handling.
- Removed the demo’s invalid complementary landmark and made the accessibility gate require zero axe violations in light and dark modes.
- Reworded and wired `Write my card` and `Leave demo and write a card` to focus the real editor.
- Verified both `/demo` and `/?demo=1` as one-click, resettable, memory-only sample paths that restore real data safely.
- Added exact `no-clinical-output` and `no-passphrase-recovery` claims and browser tests; all 13 claim entries now have exactly one tagged test.
- Added route-specific descriptions and Open Graph/Twitter/canonical metadata.
- Rewrote README implementation jargon in plain words, completed the copy audit, and added the 81-character verb-first catalog description.
- Bumped the visible build to v1.2.0 and the offline cache to `stepdown-v4`.

Finding-by-finding evidence is in `.factory/polish-1.md`.

## Verification

Run locally:

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

Results:

- `npm ci`: 177 packages, 0 vulnerabilities.
- `npm run typecheck`: pass.
- `npm run lint`: pass.
- `npm test`: pass, 11 Vitest tests and 30 Playwright tests.
- `npm run build`: pass; `dist/index.html` exists.
- Production output: 21.70 kB JavaScript (7.51 kB gzip), 8.37 kB CSS (2.79 kB gzip), and 100,952-byte hero art.
- Clean-clone claims: all 13 exact commands from `.factory/claims.json` passed independently after `npm ci`.
- Local factory URL verifier: pass with zero console errors.
- Live factory URL verifier: pass with zero console errors.
- Live browser suite: all 30 tests passed against the production origin.
- Live route status: `/`, `/demo`, `/?demo=1`, `/privacy`, and `/terms` return 200; `/missing-page` returns 404.
- Live Lighthouse mobile: performance 100, accessibility 100, best practices 100, SEO 100; FCP 0.8 s, LCP 1.4 s, TBT 10 ms, CLS 0.
- Accessibility: zero axe violations across home, demo, privacy, terms, and standalone 404 in light and dark modes.
- Privacy: tested card and demo flows make no third-party request; there are no analytics, accounts, remote fonts, or remote scripts.
- Offline: the sample reloads from the service worker after the browser network is disabled.

Evidence is stored under `.factory/qa-artifacts/polish-1/`.

## Known gaps and next steps

None. No finding, TODO, stub, or deferred minor item remains.

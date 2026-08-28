# Repair handoff — taper-calendar-card-polish-3

## Outcome

Released the round-3 repair at `https://taper-calendar-card.sociobot.in`. Repair code commit `def8b76` is pushed to `main` and deployment `7da0cc81-48fc-4136-b2fd-b7bb29919ab9` succeeded.

The intermittent encrypted-import defect is closed. A real card now uses one versioned IndexedDB record instead of separate plaintext and sealed records. Encryption reserves the serialized storage queue before key derivation. Every state change commits the new record and removes both legacy keys atomically. Existing cards migrate on read, with a sealed legacy record taking precedence over plaintext. Rejected imports finish that normalization transaction before reporting that the card was unchanged.

The registered claim test now covers the actual race, the old conflicting-key state, 25 repeated missing-field imports, invalid dates, a reversed range, and overlapping dose steps. It asserts that the sole encrypted record remains byte-for-byte unchanged and that no legacy plaintext remains.

The one-line catalog description is now: `Copy a clinician-provided taper into a private card and check each scheduled day.` It is verb-first and 81 characters.

## Verification

- Fresh clone: `/tmp/stepdown-polish3-clean.BbI2lp/repo` at `def8b76`.
- `npm ci`: pass; zero audit vulnerabilities.
- All 14 exact `.factory/claims.json` commands: pass independently.
- `npm run typecheck`: pass.
- `npm run lint`: pass.
- `npm test`: pass; 11 unit tests and 31 Playwright tests.
- `npm run build`: pass; `dist/index.html` present. Initial JS is 23.27 kB (8.04 kB gzip); CSS is 8.83 kB (2.89 kB gzip).
- Local URL verifier: pass with zero console errors. Evidence: `.factory/qa-artifacts/polish-3/local-verify/`.
- Local Lighthouse mobile: 99 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 2.2 s, TBT 0 ms, CLS 0.
- Cold live Playwright suite: 31/31 pass, including offline reload, same-origin privacy assertions, zero axe violations in both themes, keyboard/focus, mobile, routes, metadata, 404, and the strengthened claim.
- Live URL verifier: pass with zero console errors. Evidence: `.factory/qa-artifacts/polish-3/live-verify/`.
- Live Lighthouse mobile: 100/100/100/100; LCP 1.8 s, TBT 0 ms, CLS 0.
- Live routes: `/`, `/demo`, `/privacy`, `/terms` return 200; `/missing-page` returns the designed 404.
- Live cache policy: hashed JS is `public, max-age=31536000, immutable`; `sw.js` is `no-cache` and serves cache `stepdown-v7`.

## Run and verify

Run locally with `npm ci && npm run dev`. Run the complete gate with `npm run typecheck && npm run lint && npm test && npm run build`. Claim commands are listed in `.factory/claims.json`.

## Known gaps and next steps

None. Every finding from reviews 1–3 and polish records 1–2 was rechecked after deployment. The complete mapping and evidence paths are in `.factory/polish-3.md`.

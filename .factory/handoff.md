# Review handoff — taper-calendar-card-review-2

## Outcome

Adversarial review 2 is complete for candidate `b7b6f12a99a4990cde23603f9c6f06dc3137da21` and the matching live deployment.

Verdict: **FAIL**. `.factory/review-2.md` records one blocking and six non-blocking findings. No product code was modified.

## What was done

- Opened the live site cold in fresh 390 × 844 and 1440 × 900 browser contexts.
- Audited every landing-page phrase and README sentence for word count, jargon, terminology, headings, and action labels.
- Exercised the one-click demo, direct demo URL, Reset, real-data preservation, exit, offline reload, and intercepted network traffic.
- Ran all 13 exact claim commands separately from a clean clone.
- Rechecked every review-1 finding against both live behavior and source, plus the cumulative regressions recorded by polish 1.
- Crawled routes and links; checked status codes, metadata, h1/outline, canonical/OG/favicon assets, 404, focus and Back behavior, target sizes, light/dark axe results, and the product-specific visual identity.
- Checked missed leverage and found no justified AI, sync, or additional import/export feature.

## Verification evidence

- Clean clone: `/tmp/taper-review-2-clean.uz8HlC/repo`
- `npm ci`: pass, 177 packages, 0 vulnerabilities
- All 13 commands from `.factory/claims.json`: pass
- `npm run typecheck`: pass
- `npm run lint`: pass
- `npm test`: pass, 11 unit + 30 browser tests
- `npm run build`: pass; `dist/` produced; JS 21.70 kB / 7.51 kB gzip
- Live `PLAYWRIGHT_BASE_URL=... npx playwright test`: pass, 30 tests
- Factory URL verifier: pass; report in `/tmp/stepdown-review-2-verify/verify.json`
- Independent live axe scans: zero violations on `/`, `/demo`, `/privacy`, `/terms`, and `/missing-page`, light and dark
- Live and clean-build HTML/JS/CSS hashes: identical
- No third-party requests or unexpected console/page errors in exercised app flows

## Open findings

- **F-2-1 BLOCKING:** The first mobile demo viewport contains no schedule row and uses generic “Example medication” data.
- **F-2-2:** The private-session deletion statement is misleading and unlisted.
- **F-2-3:** “Every safety check” is a vague, unlisted backup-validation claim.
- **F-2-4 through F-2-6:** Three plain-word copy defects remain.
- **F-2-7:** The 404 Terms target is 39 × 44 px instead of at least 44 × 44 px.

The concrete fixes and required follow-up tests are in `.factory/review-2.md`.

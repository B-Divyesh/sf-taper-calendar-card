# Review handoff — taper-calendar-card-review-3

## Outcome

Completed the adversarial first-read review against `https://taper-calendar-card.sociobot.in` and candidate `0ae1d8b`. No product source was changed.

The review is **FAIL** because the registered `backup-validation` claim failed from a clean clone and again in the full local suite. The failure is intermittent: a rejected invalid backup can leave a plaintext real-card record alongside the encrypted record. This regresses the controller’s earlier C-2-1 encrypted-import repair.

## Verification performed

- Fresh 390 × 844 and desktop live loads; first-read gate passes.
- One-click demo, Reset, direct `/demo`, same-origin request log, and offline sample reload checked; these pass.
- Every command in `.factory/claims.json` was run separately from a new `npm ci` clone. Thirteen pass; `@claim:backup-validation` fails on the missing-field case.
- The live-only version of that Playwright test passed once and a later clean-clone retry passed, confirming timing dependence rather than a resolved claim.
- `npm run typecheck`, `npm run lint`, and `npm run build` pass. `npm test` fails at the same backup-validation claim.
- Live route/status/link crawl, focus/back behavior, metadata, mobile 404 target sizes, header/footer, and light/dark axe scans were checked.

## Remaining work

Make the sealed-card validation/cleanup transaction deterministic and await its commit before resolving rejected import. Add a repeat or stress regression check, then rerun every declared claim from a fresh clone. See `.factory/review-3.md` for the exact failure, observed plaintext value, and acceptance criteria.

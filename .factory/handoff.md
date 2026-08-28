# Review handoff — taper-calendar-card-review-1

## Outcome

Completed the requested adversarial first-read review without changing product code. The review is **FAIL** with six findings recorded in `.factory/review-1.md`:

1. The live 404 lacks the required complete header/footer and metadata.
2. The 404 skip link does not focus main content.
3. `/demo` has one moderate axe landmark violation.
4. Two start buttons do not name their result.
5. Several safety/recovery claims are not fully declared and tested.
6. README includes unexplained implementation jargon.

## Verification performed

- Cold live Chromium checks at 390 px and desktop, including screenshots and console monitoring.
- Live demo isolation, Reset, real-card restoration, same-origin traffic, and service-worker offline reload.
- Live route/status/metadata/link checks, 404 status check, route focus/back check, and light/dark axe scans.
- Read all available prior verification and handoff records; rechecked every earlier failed-verification finding against live behaviour and current code.
- Fresh-clone `npm ci`, all 11 exact commands in `.factory/claims.json`, `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`.

All declared claim commands and the clean quality commands passed. The remaining failures are documented precisely in the review; no product files were edited.

## How to verify

Read `.factory/review-1.md`. From a fresh clone run:

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

Then review the live site at `/`, `/demo`, `/privacy`, `/terms`, and a missing URL at `/missing-page`.

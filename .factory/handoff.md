# Review handoff — taper-calendar-card-review-4

## Outcome

Completed a no-code adversarial first-read review of `https://taper-calendar-card.sociobot.in` at repository commit `c8c5b03148098962781ee20467801426f9173284`.

The verdict is **PASS**. The review report is `.factory/review-4.md`. No product files were changed.

## Verification

- Installed dependencies with `npm ci`; audit reported zero vulnerabilities.
- Ran all 14 exact commands declared in `.factory/claims.json` independently; all passed.
- Ran `npm run typecheck`, `npm run lint`, `npm test` (11 unit and 31 browser tests), and `npm run build`; all passed and `dist/` was produced.
- Ran the complete 31-test Playwright suite against the live URL; it passed.
- Opened the live site cold at 390 × 844 and 1440 × 900. The first screen states the job, audience, and sample action clearly; the mobile page has no horizontal overflow.
- Verified the one-click sample, persistent banner, Reset, separate demo storage behavior, real-data isolation, same-origin request log, and offline reload for `/demo` and `?demo=1`.
- Crawled live internal destination links and checked `/`, `/demo`, `/privacy`, `/terms`, and the designed 404.
- Ran fresh axe scans at 390 px for those five routes; zero violations were reported.

## Run and verify

Use `npm ci`, then `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`. The individual claim commands are in `.factory/claims.json`.

## Known gaps and next steps

None found in this review. Preserve the clean-install claim gate and live mobile demo check when storage, routing, service-worker, or copy changes.

# Adversarial first-read review 5 — StepDown Card

**Date:** 2026-08-29 UTC

**Work order:** `taper-calendar-card-review-5`

**Candidate:** `0bcd346795c7de0c68ed6525ce81b059d3d6abe1`

**Live URL:** `https://taper-calendar-card.sociobot.in`
**Verdict:** **FAIL** — two minor copy findings remain. All functional, demo, claim, privacy, route, and accessibility checks passed, but PASS requires zero findings.

`.factory/brief.json` is absent. Scope was checked against the repository contract, `.factory/design.md`, the live product, and every earlier review, polish, verification, and handoff record.

## Cold first read

Fresh Chromium contexts at 390 × 844 and 1440 × 900 opened `/` with no cookies or stored product data. I recorded the first viewport before scrolling.

| Question | Answer understood from the first screen | Result |
| --- | --- | --- |
| What does this do? | It turns a clinician-provided taper into a card that can be checked day by day. | pass |
| For whom? | People following clinician instructions who want doses and checked days together. | pass |
| What should I click first? | **Try it with sample data**; the adjacent result says **“Loads an example card. Nothing is saved.”** | pass |

At 390 px, the headline, audience, sample action, result, and all three facts are visible before scrolling. `scrollWidth` is 390 px. The same answers are clear on desktop. The cold loads made only same-origin requests and logged no console or page errors.

Evidence: `.factory/qa-artifacts/review-5-cold-mobile.png` and `.factory/qa-artifacts/review-5-cold-desktop.png`.

## Findings

### F-5-1 — MINOR — The 404 headline uses a product metaphor instead of naming the error

**Exact quote/location:** Live `/missing-page`: eyebrow **“TRACK 404”** and h1 **“This page is not on the card.”**

**Why this fails:** The plain-words rule prohibits mood or metaphor headings. A person arriving from a bad link should not have to interpret the cassette/card theme to identify the page state. The document title is direct, but the visible h1 is not.

**Concrete fix:** Delete **“TRACK 404”**, change the h1 to **“Page not found”**, and use **“This address does not match a page. Return to your card or try the sample.”** for the explanation. Keep the existing styled layout and return links.

Evidence: `.factory/qa-artifacts/review-5-404-mobile.png`.

### F-5-2 — MINOR — The landing footer uses jargon and points to unavailable notes

**Exact quote/location:** Landing footer: **“Original generated collage; provenance is in the design notes.”**

**Why this fails:** “Provenance” is specialist wording, and “the design notes” are not linked or available on the live site. A first-time visitor cannot use the direction. The repository can retain the detailed source record without exposing an unclear pointer.

**Concrete fix:** Replace it with **“The collage was generated for StepDown Card.”** Keep the full generation source and prompt record in `.factory/design.md` and its asset sidecar.

## Copy audit

Counts treat a URL, version/build label, and hyphenated term as one word. Repeated identical navigation text is consolidated. Code commands are not prose. No sentence exceeds 22 words and no banned marketing adjective appears. F-5-2 is the only landing/README copy flag; F-5-1 is on the separate 404 route.

### Live landing page `/`

| Sentence, heading, control, label, placeholder, or alternative text | Words | Result |
| --- | ---: | --- |
| Skip to the schedule | 4 | pass |
| StepDown Card | 2 | pass |
| Demo | 1 | pass |
| Card | 1 | pass |
| Privacy | 1 | pass |
| Copy your clinician’s taper | 4 | pass |
| Track your taper day by day | 6 | pass |
| For people following clinician instructions who need each dose and checked day in one private card. | 16 | pass |
| Try it with sample data | 6 | pass; result-naming demo action |
| Loads an example card. | 4 | pass |
| Nothing is saved. | 3 | pass; `demo-unsaved` |
| Write my card | 3 | pass; result-naming action |
| Works after you first open it. | 6 | pass; `offline-reload` |
| Stores your card on this device. | 6 | pass; `private-device` |
| Free to use. | 3 | pass; `free-no-account` |
| No account or analytics. | 4 | pass; `free-no-account` |
| An opened cassette case with blank cards and a small calendar, representing a finite written schedule. | 16 | pass; image alternative text |
| Keep the written plan visible. | 5 | pass |
| Make a card in three steps | 6 | pass |
| Copy the clinician’s instructions exactly. | 5 | pass; `transcription-only` |
| Mark each dose step and date. | 6 | pass |
| Check each day, then print or export. | 8 | pass; `print-card`, `csv-export` |
| What this card does not do | 6 | pass |
| It records clinician instructions. | 4 | pass; `transcription-only` |
| It does not calculate doses, recommend doses, or check interactions. | 10 | pass; `no-clinical-output` |
| If instructions are unclear, contact your clinician or pharmacist. | 9 | pass |
| Your written card | 3 | pass |
| Write your clinician’s taper | 4 | pass |
| Copy instructions exactly. | 3 | pass |
| StepDown Card cannot tell you what dose to take. | 9 | pass; `no-clinical-output` |
| Medication or treatment name | 4 | pass |
| Clinician instructions, copied exactly | 4 | pass |
| Dose steps | 2 | pass |
| Start | 1 | pass |
| End | 1 | pass |
| Exact dose | 2 | pass |
| For example: 10 mg once daily | 6 | pass |
| Step note | 2 | pass |
| For example: take with food | 5 | pass |
| Remove this dose step | 4 | pass; accessible name for the × control |
| Add a dose step | 4 | pass |
| Save this card | 3 | pass; result-naming action |
| Your card stays on this device. | 6 | pass; `private-device` |
| Restore an existing card | 4 | pass |
| Choose a StepDown Card JSON backup from this or another device. | 11 | pass |
| Import a backup | 3 | pass; result-naming action |
| A private card for a clinician-provided taper. | 7 | pass |
| Terms | 1 | pass |
| Built by Param Factory | 4 | pass |
| v1.4.0 | 1 | pass |
| build 2026-08-28.3 | 2 | pass |
| Original generated collage; provenance is in the design notes. | 9 | **flag F-5-2: jargon and unavailable reference** |

### `README.md`

| Sentence or heading | Words | Result |
| --- | ---: | --- |
| StepDown Card | 2 | pass |
| StepDown Card is a private card that works after you first open it. | 13 | pass; `offline-reload`, `private-device` |
| It is for people copying a clinician-provided medication taper. | 9 | pass |
| Enter the written instructions and dose steps. | 7 | pass |
| Check each day, then print or export your record. | 9 | pass; `print-card`, `csv-export` |
| It does not calculate doses, recommend doses, or check interactions. | 10 | pass; `no-clinical-output` |
| Ask a clinician or pharmacist when instructions are unclear. | 9 | pass |
| Run StepDown Card locally | 4 | pass |
| Open `http://localhost:5173`. | 2 | pass |
| Use `http://localhost:5173/demo` for an isolated sample card. | 7 | pass; `demo-unsaved` |
| Demo changes stay in memory and are discarded on reload or exit. | 12 | pass; `demo-unsaved` |
| Test and build | 3 | pass |
| Deploy the generated `dist/` folder as a static site. | 9 | pass; developer instruction |
| The app saves the files it needs for offline use. | 10 | pass; `offline-reload` |
| Data and privacy | 3 | pass |
| Cards stay in this browser on the current device. | 9 | pass; `private-device` |
| You can print a card or export CSV for the day-by-day log. | 12 | pass; `print-card`, `csv-export` |
| You can export a full JSON backup and import it later. | 11 | pass; `backup-roundtrip` |
| You can optionally encrypt a real card with a passphrase using your browser’s built-in encryption. | 16 | pass; `encrypted-card` |
| Save a backup because a forgotten passphrase cannot be recovered. | 10 | pass; `no-passphrase-recovery` |
| See `/privacy` and `/terms` in the app. | 7 | pass |
| Scope and cost | 3 | pass |
| StepDown Card is free and has no account or analytics. | 10 | pass; `free-no-account` |
| StepDown Card keeps the dates, dose wording, and clinician instructions you enter. | 12 | pass; `transcription-only` |

Terminology is consistent: `taper`, `card`, `dose step`, `check`, `demo`, and `backup` each name one concept. No README sentence or control label needs a rewrite.

## Demo, storage, privacy, and offline behavior

The demo gate passes:

- One click on **Try it with sample data** opens `/demo` with **“Prednisone — sample.”**
- At 390 × 844, the first two rows are visible without scrolling. They show **“Sat, Aug 29,” “20 mg once daily,” “Take with breakfast,”** and **“Check this day.”**
- The persistent banner says **“Demo — sample data, nothing is saved”** and contains **Reset demo** and **Leave demo and write a card**.
- Checking a day produces one **Checked** control. Reset returns the count to zero.
- A fresh demo has no IndexedDB keys. A separately created real card remained byte-for-byte unchanged before, during, and after demo use. Leaving demo restored and focused that real card.
- After service-worker control, `/demo` reloaded offline with the sample and banner visible and no console or page errors.
- The complete cold/demo flow requested only `https://taper-calendar-card.sociobot.in` resources.

Evidence: `.factory/qa-artifacts/review-5-demo-mobile.png` and the passing `demo-unsaved`, `private-device`, and `offline-reload` claim tests.

## Claims gate

From a clean clone at the candidate commit, I ran `npm ci` and then every exact command in `.factory/claims.json` separately. Every claim ID occurs in exactly one tagged test.

| Claim ID | Result | Observable evidence |
| --- | --- | --- |
| `offline-reload` | pass | Controlled `/demo` reloads with networking disabled. |
| `csv-export` | pass | CSV has its header and one row for each of 14 sample days. |
| `private-device` | pass | A real checked card survives reload with no third-party request. |
| `backup-roundtrip` | pass | Export, database deletion, and import restore the complete card. |
| `backup-validation` | pass | All named invalid backups preserve the sole sealed record byte-for-byte. |
| `encrypted-card` | pass | Wrong passphrase fails and the original passphrase opens the card. |
| `no-passphrase-recovery` | pass | A different passphrase leaves the card locked with only backup import available. |
| `demo-unsaved` | pass | Demo changes disappear on reload and no demo record is written. |
| `print-card` | pass | Print card invokes the browser print function. |
| `free-no-account` | pass | No sign-in/checkout control or third-party request exists. |
| `transcription-only` | pass | Exact dates, dose text, and clinician wording render unchanged. |
| `no-clinical-output` | pass | No recommendation/interaction output or clinical request exists. |
| `clear-device-data` | pass | Deleting site IndexedDB returns the app to its empty first screen. |
| `check-timestamp` | pass | Exported CSV contains the local check time. |

The live landing, demo, card, privacy, terms, and README claim-like statements map to these entries. No unlisted claim and no untested declared claim was found.

The clean clone also passed `npm run typecheck`, `npm run lint`, `npm test` (11 unit and 31 browser tests), and `npm run build`. `dist/` was produced; initial JavaScript is 23.27 kB (8.04 kB gzip). The complete 31-test browser suite passed separately against the live origin.

## Historical finding verification

Every earlier review and polish finding was checked against both live behavior and current source/tests.

| Earlier ID | Current confirmation | Status |
| --- | --- | --- |
| F-1-1 | The live 404 has route metadata, header/footer, legal links, factory/version text, and return actions. | fixed |
| F-1-2 | Activating **Skip to the message** focuses `MAIN#main`. | fixed |
| F-1-3 | Axe 4.10.2 reports zero violations on every checked route in light and dark modes. | fixed |
| F-1-4 | **Write my card** and **Leave demo and write a card** state their result and focus the editor. | fixed |
| F-1-5 | Safety and passphrase statements have exact registry entries and observable tests. | fixed |
| F-1-6 | README retains the plain offline and browser-encryption wording. | fixed |
| F-2-1 | The first demo viewport contains realistic medication, date, dose, instruction, and check data. | fixed |
| F-2-2 | Privacy now gives the accurate site-data removal instruction; its claim test passes. | fixed |
| F-2-3 | Locked-card replacement copy names required fields, valid dates, and non-overlap; its claim passes. | fixed |
| F-2-4 | The landing eyebrow uses the direct verb **“Copy.”** | fixed |
| F-2-5 | README heading is **“Run StepDown Card locally.”** | fixed |
| F-2-6 | README says cards stay in this browser on the current device. | fixed |
| F-2-7 | Live 404 footer links meet the 44 × 44 px target rule. | fixed |
| C-2-1 | One-record encrypted storage and queued writes prevent plaintext/sealed races; the stress claim passed twice locally and once live. | fixed |
| F-3-1 | `backup-validation` passed in its exact clean-clone command, the full local suite, and the full live suite. | fixed |

The original independent-verification defects were also rechecked rather than inferred from repair notes.

| Earlier verification defect | Current confirmation | Status |
| --- | --- | --- |
| 1. Date shifts by time zone | Date-only tests pass in Auckland, Kiritimati, and GMT-12. | fixed |
| 2. Malformed backup overwrites/bricks card | Strict schema tests and locked-card preservation pass. | fixed |
| 3. Editing clears checks | Editing a retained date preserves its check. | fixed |
| 4. Reversed/overlapping schedules | Both are rejected and entered fields remain. | fixed |
| 5. Unavailable paid checkout | The unsupported paid tier and checkout were removed; the tested product is free. | fixed |
| 6. Worker caches secrets/stale verification | Worker handles same-origin GETs only and has no Sociobot API path. | fixed |
| 7. New license may reuse stale verdict | Licensing was removed with the paid tier. | fixed |
| 8. Dark-mode contrast | Live axe scans report zero violations in both color schemes. | fixed |
| 9. 390 px editor overflow | Live `scrollWidth` equals 390 px and controls fit. | fixed |
| 10. Import absent when empty/locked | Import is available in both states. | fixed |
| 11. Demo route/real restore | Direct, linked, and query demo entry work; real data is restored unchanged. | fixed |
| 12. Route focus/announcement | Navigation and Back focus the h1 and update the polite live region. | fixed |
| 13. Broken navigation/404 | Internal links resolve; unknown paths return the designed HTTP 404. | fixed |
| 14. Missing update notice/cache cleanup | Update messages show **Reload now** and old caches are deleted. | fixed |
| 15. Missing immutable cache policy | Hashed assets are immutable; `sw.js` is `no-cache`. | fixed |
| 16. Undersized touch targets | Tested mobile nav, remove, banner, footer, and 404 links meet 44 px. | fixed |
| Route canonicals | Each normal route updates its canonical URL. | fixed |
| Touch icon | A real 180 × 180 PNG is linked. | fixed |
| Generated-art disclosure/source record | Live disclosure exists and the repository records the asset source; F-5-2 concerns only its wording. | fixed |
| Incomplete copy audit | This review lists every landing and README phrase and sentence. | fixed |

No prior finding is unfixed, half-fixed, or regressed. F-5-1 and F-5-2 are new copy findings.

## Structure, links, accessibility, and visual identity

- `/`, `/demo`, `/privacy`, and `/terms` return 200. `/missing-page` returns the designed 404 document with HTTP 404.
- Every normal route has its own title, description, canonical, Open Graph/Twitter fields, one h1, one main landmark, favicon, 180 px touch icon, and consistent header/footer. The 404 has the equivalent route metadata.
- The live OG image is 1200 × 630. `robots.txt` and `sitemap.xml` resolve and list all normal routes.
- A crawl of every internal destination link found only 200 responses. Deep links work. Navigation to Privacy focuses its h1; Back returns to `/`, focuses its h1, and updates the polite announcement.
- Live headers include the same-origin CSP, `X-Content-Type-Options`, and `Referrer-Policy`. Normal loads have no console errors.
- The live axe integration reports zero violations for `/`, `/demo`, `/privacy`, `/terms`, and `/404.html` in light and dark modes. Keyboard, skip-link, 44 px target, reduced-motion, and mobile-width checks pass.
- The paper/ink palette, editorial serif and monospace pairing, cassette-track schedule rows, halftone texture, and original collage match `.factory/design.md`. The result is recognisable and not a generic SaaS template.

F-5-1 is the only structure-route copy failure; routing and 404 mechanics pass.

## Missed leverage

No AI feature is appropriate. The job requires exact transcription of clinician-provided directions; model interpretation would introduce medical ambiguity. The expected practical additions are already present: one-click sample data, offline use, checking, print, CSV export, full JSON backup/import, and optional local encryption. Account sync would conflict with the explicit no-account, local-device model.

## What would make this perfect

Replace the metaphorical 404 eyebrow/headline with a direct **“Page not found”** message, and replace the landing provenance sentence with plain wording that does not point to unavailable notes. Then rerun the copy audit and route smoke test. No functional, demo, claim, privacy, accessibility, or product-scope change is otherwise indicated by this review.

# Adversarial first-read review 6 — StepDown Card

**Date:** 2026-08-29 UTC

**Work order:** `taper-calendar-card-review-6`

**Candidate:** `4fa0458f6c4acc60829fc170aaac40d9755c0d41`

**Live URL:** `https://taper-calendar-card.sociobot.in`

**Verdict:** **PASS** — zero findings, zero failing claims, and zero untested claim-like statements.

`.factory/brief.json` is absent. Scope was checked against the repository contract, `.factory/design.md`, the product copy, the claims registry, and every earlier review, polish, verification, and handoff record.

## Cold first read

Fresh Chromium contexts opened `/` at 390 × 844 and 1440 × 900 with no cookies, storage, scroll, console errors, or page errors.

| Question | Answer from the first screen | Evidence | Result |
| --- | --- | --- | --- |
| What does this do? | It copies a clinician-provided taper into a card and tracks each day. | **“Track your taper day by day”** | pass |
| For whom? | People following clinician instructions who want doses and checked days together. | **“For people following clinician instructions who need each dose and checked day in one private card.”** | pass |
| What should I click first? | **Try it with sample data.** | The adjacent result says **“Opens a filled sample card. Nothing is saved.”** | pass |

At 390 px, the headline ends at y=251, the audience sentence at y=384, the sample action at y=456, its result at y=512, and the three facts at y=656. All fit inside the initial 844 px viewport. The page width is exactly 390 px with no horizontal overflow. The same information fits before scrolling at 1440 × 900.

## Findings

None.

## Copy audit

Counts treat a hyphenated term, URL, version, build label, or control name as one word. Repeated navigation and footer links are listed once. No sentence exceeds 22 words. No jargon, banned marketing adjective, inconsistent term, contextless heading, metaphor heading, empty slogan, or non-result button was found.

### Live landing page `/`

| Sentence or visible phrase | Words | Result |
| --- | ---: | --- |
| Skip to the schedule | 4 | pass |
| StepDown Card | 2 | pass |
| Demo | 1 | pass |
| Card | 1 | pass |
| Privacy | 1 | pass |
| Copy your clinician’s taper | 4 | pass |
| Track your taper day by day | 6 | pass |
| For people following clinician instructions who need each dose and checked day in one private card. | 16 | pass |
| Try it with sample data | 6 | pass; result-naming action |
| Opens a filled sample card. | 5 | pass |
| Nothing is saved. | 3 | pass; `demo-unsaved` |
| Write my card | 3 | pass; result-naming action |
| Works after you first open it. | 6 | pass; `offline-reload` |
| Stores your card on this device. | 6 | pass; `private-device` |
| Free to use. | 3 | pass; `free-no-account` |
| No account or analytics. | 4 | pass; `free-no-account` |
| An opened cassette case with blank cards and a small calendar, representing a finite written schedule. | 16 | pass; useful image alternative |
| Keep the written plan visible. | 5 | pass; describes the image’s purpose |
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
| Remove this dose step | 4 | pass; accessible result name |
| Add a dose step | 4 | pass; result-naming action |
| Save this card | 3 | pass; result-naming action |
| Your card stays on this device. | 6 | pass; `private-device` |
| Restore an existing card | 4 | pass |
| Choose a StepDown Card JSON backup from this or another device. | 11 | pass; `backup-roundtrip` |
| Import a backup | 3 | pass; result-naming action |
| A private card for a clinician-provided taper. | 7 | pass |
| Terms | 1 | pass |
| Built by Param Factory | 4 | pass |
| v1.5.0 | 1 | pass |
| build 2026-08-29.1 | 2 | pass |
| The collage was generated for StepDown Card. | 7 | pass; repository provenance confirms it |

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
| Use `http://localhost:5173/?demo=1` for an isolated sample card. | 7 | pass |
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

### Terminology

| Concept | Consistent product word |
| --- | --- |
| clinician-provided plan | clinician instructions |
| finite regimen | taper |
| saved schedule view | card |
| regimen segment | dose step |
| confirmation | check |
| sample mode | demo |
| portable data copy | backup |

## Demo, sandbox, privacy, and offline behavior

The one-click demo gate passes.

- **Try it with sample data** opens `/?demo=1` directly to **“Prednisone — sample.”**
- At 390 × 844, the banner ends at y=220. The first populated row starts at y=528 and ends at y=651. It shows **“Sat, Aug 29,” “20 mg once daily,” “Take with breakfast,”** and **“Check this day.”**
- The persistent banner says **“Demo — sample data, nothing is saved”** and provides **Reset demo** and **Leave demo and write a card**.
- Checking a sample day produces one **Checked** control. Reset returns the count to zero and retains keyboard focus on Reset.
- Direct demo inspection found no IndexedDB keys. The registered isolation test also creates a real card first, proves its authoritative record remains byte-for-byte unchanged throughout demo use, finds no demo record, discards changes on reload, and restores the real card on exit.
- After service-worker control, the registered offline test disables the browser network and reloads the populated demo successfully.
- The independent cold landing-to-demo request log contained only same-origin GETs for the document, hashed JavaScript, hashed CSS, and hero image. It contained no analytics, font, identity, payment, API, or other third-party request.

## Claims gate

A clean clone at candidate `4fa0458f6c4acc60829fc170aaac40d9755c0d41` received `npm ci`. Every exact command in `.factory/claims.json` was then run separately. Every declared ID occurs in exactly one tagged browser test.

| Claim ID | Result | Observable test |
| --- | --- | --- |
| `offline-reload` | pass | The populated demo reloads after browser networking is disabled. |
| `csv-export` | pass | CSV contains its header and one row for each of 14 scheduled days. |
| `private-device` | pass | A real checked card survives reload with same-origin traffic only. |
| `backup-roundtrip` | pass | Export, database deletion, and import restore the complete card. |
| `backup-validation` | pass | All named invalid backups preserve the sole encrypted record byte-for-byte, including 25 missing-field attempts. |
| `encrypted-card` | pass | A wrong passphrase fails and the original passphrase opens the card. |
| `no-passphrase-recovery` | pass | A different passphrase leaves the card locked with backup import as the only recovery path. |
| `demo-unsaved` | pass | Demo changes do not enter real or demo storage and disappear on reload/reset. |
| `print-card` | pass | **Print card** invokes the browser print function. |
| `free-no-account` | pass | No account, checkout, analytics, or outside request appears. |
| `transcription-only` | pass | Exact dates, dose wording, and clinician wording render unchanged. |
| `no-clinical-output` | pass | No calculation, recommendation, interaction output, or clinical request appears. |
| `clear-device-data` | pass | Deleting the app database returns the empty first screen. |
| `check-timestamp` | pass | The CSV includes the local time for a checked day. |

The live landing, demo, card, privacy, terms, and README claim-like statements map to these entries. Procedural instructions and the generated-art provenance statement are corroborated repository facts, not untested product-performance promises. No unlisted claim was found.

## Historical finding verification

Every earlier review and polish finding was checked against both the live product and current source or tests.

| Earlier ID | Current live and code confirmation | Status |
| --- | --- | --- |
| F-1-1 | The HTTP 404 document has route metadata, full navigation/footer, legal links, factory/version text, and useful return actions. | fixed |
| F-1-2 | Activating **Skip to the message** focuses `MAIN#main`; `public/404.js` and `tabindex=-1` implement it. | fixed |
| F-1-3 | The safety note is a non-landmark `div`; axe reports zero violations on all tested routes in both themes. | fixed |
| F-1-4 | **Write my card** and **Leave demo and write a card** name their result and focus the editor. | fixed |
| F-1-5 | No-clinical-output and forgotten-passphrase statements each have one registered observable test. | fixed |
| F-1-6 | README uses plain offline, storage, and browser-encryption wording. | fixed |
| F-2-1 | The initial phone demo shows realistic medication, date, dose, instruction, and check control above the fold. | fixed |
| F-2-2 | Privacy says **“Clear this site’s data to remove a saved card.”** The removal claim passes. | fixed |
| F-2-3 | Locked-card copy names required fields, valid dates, and non-overlap; the stress claim passes. | fixed |
| F-2-4 | The first-screen label uses the direct verb **“Copy.”** | fixed |
| F-2-5 | README heading is **“Run StepDown Card locally.”** | fixed |
| F-2-6 | README says cards stay in this browser on the current device. | fixed |
| F-2-7 | Standalone-404 legal links meet the 44 × 44 px target rule. | fixed |
| C-2-1 | One authoritative IndexedDB record and the serialized storage queue prevent plaintext/sealed races; storage tests pass. | fixed |
| F-3-1 | `backup-validation` passes independently and in the full clean and live suites. | fixed |
| F-5-1 | Both SPA and standalone 404 screens use the direct h1 **“Page not found.”** | fixed |
| F-5-2 | The footer now says **“The collage was generated for StepDown Card.”** | fixed |

Review 4 contained no finding; its first-read, demo, claims, routing, accessibility, privacy, and visual checks were rerun here.

The original independent verification defects were also rechecked rather than inferred from repair notes.

| Earlier verification defect | Current confirmation | Status |
| --- | --- | --- |
| V-1: time-zone date shifts | Date-only tests pass in Auckland, Kiritimati, and GMT-12. | fixed |
| V-2: malformed backup overwrites data | Strict parsing and encrypted-record preservation pass. | fixed |
| V-3: editing clears checks | Retained-date acknowledgements survive editing. | fixed |
| V-4: reversed/overlapping schedules | Both reject without clearing entered values. | fixed |
| V-5: unavailable paid checkout | The unsupported offer is absent; the tested product is free. | fixed |
| V-6: worker caches secrets | The worker handles same-origin GET product assets only; licensing is absent. | fixed |
| V-7: stale licence verdict | Licensing is absent. | fixed |
| V-8: dark contrast | Axe finds zero violations in light and dark modes. | fixed |
| V-9: 390 px editor overflow | `scrollWidth` equals 390 and controls fit. | fixed |
| V-10: import absent in recovery states | Import is available on fresh and encrypted screens. | fixed |
| V-11: stale demo route/real restore | Direct, linked, and query demo entry work; exit restores real data unchanged. | fixed |
| V-12: route focus/announcement | Privacy navigation and Back focus the new h1 and update the polite status. | fixed |
| V-13: broken links/404 | Known routes return 200, internal links crawl cleanly, and an unknown route returns the designed 404. | fixed |
| V-14: missing update notice/cache cleanup | **Reload now** is exposed and old caches are removed. | fixed |
| V-15: missing immutable caching | Hashed assets are immutable and `sw.js` is `no-cache`. | fixed |
| V-16: undersized touch targets | Mobile nav, actions, remove, demo, footer, and 404 controls meet 44 px. | fixed |
| V-L1: stale route metadata | Every route updates title, description, canonical, and social metadata. | fixed |
| V-L2: wrong touch icon | The linked PNG is 180 × 180. | fixed |
| V-L3: missing art disclosure | Plain live disclosure and repository provenance are present. | fixed |
| V-L4: incomplete copy audit | This review lists every landing and README sentence or visible phrase. | fixed |

No earlier finding is unfixed, half-fixed, or regressed.

## Structure, links, accessibility, and identity

| Route | HTTP | Title | h1 | Canonical |
| --- | ---: | --- | --- | --- |
| `/` | 200 | `StepDown Card — track a taper day by day` | `Track your taper day by day` | `/` |
| `/demo` | 200 | `Demo — StepDown Card` | `Prednisone — sample` | `/demo` |
| `/privacy` | 200 | `Privacy — StepDown Card` | `Privacy for StepDown Card` | `/privacy` |
| `/terms` | 200 | `Terms — StepDown Card` | `Terms for StepDown Card` | `/terms` |
| unknown path | 404 | `Page not found — StepDown Card` | `Page not found` | `/404` |

- Every route has one h1, a main landmark, description, canonical, Open Graph/Twitter metadata, favicon, 180 px touch icon, and consistent header/footer with Privacy and Terms.
- The OG image is a real 1200 × 630 product image. `robots.txt`, `sitemap.xml`, the PWA manifest, security headers, and the designed 404 are present.
- Every destination found on the landing and legal routes returned 200. Deep links load directly.
- Client navigation to Privacy focused its h1 and announced **“Privacy — StepDown Card.”** Back returned to `/`, focused the landing h1, and announced its title.
- The live URL verifier passed with `lang=en`, one h1, one main, no missing alt text, no unlabeled button, and no console error.
- The full live browser suite passed 31/31. Its axe integration found zero violations on `/`, `/demo`, `/privacy`, `/terms`, and `/404.html` in light and dark themes. Keyboard, reduced-motion, 390 px width, and 44 px targets also passed.
- The paper/ink palette, serif/monospace pairing, halftone field, cassette-track rows, physical label shapes, and original collage match `.factory/design.md`. The result is recognisable and is not a generic SaaS template.

## Build and deployment evidence

- Clean clone: `npm ci`, `npm run typecheck`, `npm run lint`, `npm test` (13 unit and 31 browser tests), and `npm run build` all pass.
- Production output contains `dist/index.html`. JavaScript is 23.49 kB raw / 8.08 kB gzip; CSS is 8.83 kB raw / 2.89 kB gzip.
- The independently run live Playwright suite passes 31/31.
- Clean-build and live SHA-256 hashes match for `index.html`, hashed JavaScript, hashed CSS, and `sw.js`.

## Missed leverage

No missing feature was found. AI interpretation would introduce avoidable medication ambiguity into a task that requires exact clinician wording. The expected non-AI capabilities are present: isolated sample data, offline use, checking, printing, CSV export, full JSON backup/import, and optional local encryption. Account sync would conflict with the explicit no-account, local-device model.

## What would make this perfect

No concrete product, copy, demo, claim, privacy, routing, accessibility, or visual-identity change remains. Preserve the clean-clone claim gate and live 390 px demo check on future releases, especially when changing IndexedDB or service-worker behavior.

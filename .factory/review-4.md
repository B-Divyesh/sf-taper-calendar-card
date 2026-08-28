# Adversarial first-read review 4 — StepDown Card

**Date:** 2026-08-28 UTC  
**Work order:** `taper-calendar-card-review-4`  
**Candidate:** `c8c5b03148098962781ee20467801426f9173284`  
**Live URL:** `https://taper-calendar-card.sociobot.in`  
**Verdict:** **PASS** — no blocking or minor findings remain. All declared claims were tested from a clean dependency install, and no unlisted visitor-facing product claim was found.

`.factory/brief.json` is absent. Scope was checked against the repository contract, `.factory/design.md`, the product, and all prior review, polish, verification, and handoff records.

## Cold first read

Fresh Chromium contexts at 390 × 844 and 1440 × 900 loaded `/` with no storage or cookies. Normal-route load logged no console or page errors.

| First-screen question | Answer understood before scrolling | Result |
| --- | --- | --- |
| What does this do? | It lets me copy a clinician-provided taper into a card and check it day by day. | pass |
| For whom? | People following clinician instructions who need doses and checked days together. | pass |
| What should I click first? | **Try it with sample data**; the adjacent text says **“Loads an example card. Nothing is saved.”** | pass |

At 390 px, the three facts end at y=656 within the 844 px viewport; `scrollWidth` was 390 px. The cassette-zine surface, paper/ink palette, editorial serif plus monospace pairing, track-shaped schedule rows, and original collage are distinct and match `.factory/design.md`; this is not a generic SaaS template.

## Copy audit

Word counts treat a URL, version/build label, hyphenated term, and visible control name as one word. Commands are not prose. No sentence exceeds 22 words. No banned marketing wording, jargon, inconsistent term, contextless heading, mood heading, or non-result button was found. `taper`, `card`, `dose step`, `check`, `demo`, and `backup` are used consistently.

### Landing page `/`

| Visible sentence, heading, label, or alternative text | Words | Result |
| --- | ---: | --- |
| Skip to the schedule | 4 | pass |
| StepDown Card | 2 | pass |
| Demo | 1 | pass |
| Card | 1 | pass |
| Privacy | 1 | pass |
| Copy your clinician’s taper | 4 | pass |
| Track your taper day by day | 6 | pass |
| For people following clinician instructions who need each dose and checked day in one private card. | 16 | pass |
| Try it with sample data | 6 | pass; named demo result |
| Loads an example card. | 4 | pass; demo flow |
| Nothing is saved. | 3 | pass; `demo-unsaved` |
| Write my card | 3 | pass; named result |
| Works after you first open it. | 6 | pass; `offline-reload` |
| Stores your card on this device. | 6 | pass; `private-device` |
| Free to use. | 3 | pass; `free-no-account` |
| No account or analytics. | 4 | pass; `free-no-account` |
| An opened cassette case with blank cards and a small calendar, representing a finite written schedule. | 16 | pass; alternative text |
| Keep the written plan visible. | 5 | pass; image caption describes the task |
| Make a card in three steps | 6 | pass |
| Copy the clinician’s instructions exactly. | 5 | pass; `transcription-only` |
| Mark each dose step and date. | 6 | pass |
| Check each day, then print or export. | 8 | pass; `print-card`, `csv-export` |
| What this card does not do | 6 | pass |
| It records clinician instructions. | 4 | pass; `transcription-only` |
| It does not calculate doses, recommend doses, or check interactions. | 10 | pass; `no-clinical-output` |
| If instructions are unclear, contact your clinician or pharmacist. | 9 | pass; safety direction |
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
| Remove this dose step | 4 | pass; accessible name |
| Add a dose step | 4 | pass |
| Save this card | 3 | pass; named result |
| Your card stays on this device. | 6 | pass; `private-device` |
| Restore an existing card | 4 | pass |
| Choose a StepDown Card JSON backup from this or another device. | 11 | pass; `backup-roundtrip` |
| Import a backup | 3 | pass; named result |
| A private card for a clinician-provided taper. | 7 | pass |
| Terms | 1 | pass |
| Built by Param Factory | 4 | pass |
| v1.4.0 | 1 | pass |
| Original generated collage; provenance is in the design notes. | 9 | pass; required asset disclosure, corroborated by design notes and source sidecar |

### `README.md`

| Sentence or heading | Words | Result |
| --- | ---: | --- |
| StepDown Card | 2 | pass |
| StepDown Card is a private card that works after you first open it. | 13 | pass; `offline-reload`, `private-device` |
| It is for people copying a clinician-provided medication taper. | 9 | pass |
| Enter the written instructions and dose steps. | 7 | pass |
| Check each day, then print or export your record. | 9 | pass; `print-card`, `csv-export` |
| It does not calculate doses, recommend doses, or check interactions. | 10 | pass; `no-clinical-output` |
| Ask a clinician or pharmacist when instructions are unclear. | 9 | pass; safety direction |
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

The claim-like product statements above map to entries in `.factory/claims.json`; procedural README instructions and the safety direction are not product-performance promises. No unlisted claim was found.

## Demo, sandbox, privacy, and offline behavior

The required one-click path passes. Clicking **Try it with sample data** opens `/demo` directly into a populated **“Prednisone — sample”** card. At 390 × 844, the first visible row begins at y=528 and shows **“Fri, Aug 28”**, **“20 mg once daily”**, **“Take with breakfast.”**, and **“Check this day.”** The persistent banner reads **“Demo — sample data, nothing is saved”** and provides **Reset demo** and **Leave demo and write a card**.

Checking the first sample day changed its button to **Checked**. Reset restored **Check this day**. IndexedDB contained neither the demo legacy key nor a real-card record in the new context; demo data was therefore memory-only. The request log for the landing-to-demo flow contained only same-origin requests. After service-worker control, both `/demo` and `/?demo=1` reloaded offline into the populated sample. The real-data namespace is not read or written while the banner is present.

## Claims gate

Read `.factory/claims.json` and ran every exact command after `npm ci` in this clean working copy. Every command passed independently.

| Claim ID | Result |
| --- | --- |
| `offline-reload` | pass |
| `csv-export` | pass |
| `private-device` | pass |
| `backup-roundtrip` | pass |
| `backup-validation` | pass |
| `encrypted-card` | pass |
| `no-passphrase-recovery` | pass |
| `demo-unsaved` | pass |
| `print-card` | pass |
| `free-no-account` | pass |
| `transcription-only` | pass |
| `no-clinical-output` | pass |
| `clear-device-data` | pass |
| `check-timestamp` | pass |

`npm run typecheck`, `npm run lint`, `npm test` (11 unit and 31 browser tests), and `npm run build` also passed. Build output contains `dist/`; initial JavaScript is 23.27 kB (8.04 kB gzip), below the static-product budget. The complete 31-test Playwright suite also passed against the live URL.

## History re-check

Every earlier review, polish record, verification record, and handoff was read. The current live site and source confirm the following closure, rather than relying on status labels alone.

| Earlier finding | Current verification | Status |
| --- | --- | --- |
| F-1-1 | Designed 404 has its metadata, consistent navigation/footer, legal links, factory/version text, and useful return actions. | fixed |
| F-1-2 | The 404 skip action focuses `MAIN#main`. | fixed |
| F-1-3 | Axe 4.10.2 found zero violations on every checked route. | fixed |
| F-1-4 | **Write my card** and **Leave demo and write a card** state their result and move focus to the editor. | fixed |
| F-1-5 | Safety and passphrase statements are exact registered claims with one tagged observable test each. | fixed |
| F-1-6 | README uses the plain offline and browser-encryption wording. | fixed |
| F-2-1 | The immediate phone demo contains realistic medication, date, dose, instruction, and check control. | fixed |
| F-2-2 | Privacy says only **“Clear this site’s data to remove a saved card.”** | fixed |
| F-2-3 / C-2-1 / F-3-1 | `backup-validation` passed from the clean install, including 25 invalid missing-field attempts, invalid dates, reversed range, overlap, encryption timing, and byte-identical locked-card preservation. | fixed |
| F-2-4 | The eyebrow uses the direct verb **“Copy.”** | fixed |
| F-2-5 | README heading is **“Run StepDown Card locally.”** | fixed |
| F-2-6 | README says cards stay in this browser on the current device. | fixed |
| F-2-7 | 404 legal links meet the 44 px touch-target requirement. | fixed |
| Earlier verification defects | Date-only handling, acknowledgement retention, strict import validation, fresh/locked import, demo route restoration, route focus/announcement, update notice/cache retirement, cache headers, dark contrast, mobile width, canonical/touch icon, and art disclosure are covered by current source and passing browser checks. | fixed |

## Structure, routes, accessibility, and privacy

- `/`, `/demo`, `/privacy`, and `/terms` returned 200. `/missing-page` returned the designed 404. The crawl of every internal destination link returned 200.
- Each normal route has a route-specific title, one h1, description, canonical, Open Graph/Twitter metadata, favicon, header/footer, and `main`. The 404 has the corresponding 404 title and canonical.
- Deep links work for `/demo` and `?demo=1`; client navigation and Back restore appropriate heading focus and announce the route.
- Fresh axe scans found zero violations on `/`, `/demo`, `/privacy`, `/terms`, and `/missing-page` at 390 px. Keyboard, focus, target sizing, and reduced-motion behavior are covered by the live suite.
- Request logging during the cold/demo flow showed no third-party origins. There are no account, checkout, or analytics controls. No remote font or script is loaded.

## Missed leverage

No additional AI feature is appropriate. The job is accurate transcription of clinician-provided directions; an AI interpretation or recommendation would add medical ambiguity. The valuable implied capabilities—isolated realistic demo, offline use, checking, print, CSV export, JSON backup/import, and local encryption—are present. Account sync would conflict with the stated local-first, no-account model.

## What would make this perfect

No concrete product, copy, demo, claim, privacy, routing, accessibility, or visual-identity change remains from this review. Maintain the existing clean-install claims gate and live 390 px demo check on future releases, especially when changing storage or service-worker code.

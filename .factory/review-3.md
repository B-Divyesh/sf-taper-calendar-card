# Adversarial first-read review 3 — StepDown Card

**Date:** 2026-08-28 UTC

**Candidate:** `0ae1d8b1f24ed7736688657fa717057ddc19cd50`

**Live URL:** `https://taper-calendar-card.sociobot.in`
**Verdict:** **FAIL** — one blocking finding. A PASS requires no findings and every declared claim command to pass reliably.

`.factory/brief.json` is absent. Scope was checked against the repository contract, `.factory/design.md`, the live product, and all prior review, polish, verification, and handoff records.

## Cold first read

Fresh Chromium contexts at 390 × 844 and 1440 × 900 loaded `/` with no prior browser data, no application console errors, no scrolling, and only same-origin requests.

| First-screen question | Answer understood before scrolling | Result |
| --- | --- | --- |
| What does this do? | It lets a person copy a clinician-provided taper into a card and check it day by day. | pass |
| For whom? | People following clinician instructions who need dose and check information together. | pass |
| What should I click first? | **Try it with sample data**; the adjacent text says **“Loads an example card. Nothing is saved.”** | pass |

At 390 px, the headline, audience sentence, primary action, result text, and three facts fit within the initial 844 px viewport. `scrollWidth` was 390 px. The cassette-zine identity is distinct from a generic SaaS template and matches the recorded design thesis.

## Findings

### F-3-1 — BLOCKING — The encrypted-backup validation claim is intermittent and leaves plaintext behind

**Earlier finding:** regression of controller finding **C-2-1** in `.factory/polish-2.md`.

**Exact test/location:** From a fresh clone at `0ae1d8b`, after `npm ci`, the exact registered command

```text
npm test -- --grep @claim:backup-validation
```

failed in `e2e/app.spec.ts:267` during the first **missing-field** invalid-backup case. The observable assertion expected no real plaintext record after rejecting the backup, but received the original plaintext Prednisone card at `stepdown:real:schedule` while the sealed record remained. The full local `npm test` also failed at this same claim. A later retry and a live-only Playwright run passed, so this is timing-dependent rather than a verified repair.

**Why this fails:** The product promises on the encrypted-card recovery screen that a backup replaces a locked card only after its fields, dates, and dose steps are valid. The claim test is specifically meant to prove that an invalid backup cannot leave or restore a plaintext version of an encrypted card. An intermittent failure means a visitor can be left with sensitive plaintext in browser storage, and the release cannot demonstrate the listed safety claim from a clean checkout.

**Concrete fix:** Make sealed-record inspection and plaintext deletion one awaited, deterministic IndexedDB transaction. Do not resolve the rejected-import path until the deletion request has committed; add a repeat/stress test that runs the missing-field path enough times to expose the previous race, and keep the exact claim command green from a clean clone.

## Copy audit

Word counts treat URLs, labels, and hyphenated terms as one word. Code commands are not prose. No sentence exceeds 22 words, no banned marketing wording appears, headings make sense out of context, terminology is consistent (`taper`, `card`, `dose step`, `check`, `backup`), and visible buttons use result-naming verbs. No additional copy finding was observed.

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
| Try it with sample data | 6 | pass; demo action |
| Loads an example card. | 4 | pass; `demo-unsaved` |
| Nothing is saved. | 3 | pass; `demo-unsaved` |
| Write my card | 3 | pass |
| Works after you first open it. | 6 | pass; `offline-reload` |
| Stores your card on this device. | 6 | pass; `private-device` |
| Free to use. | 3 | pass; `free-no-account` |
| No account or analytics. | 4 | pass; `free-no-account` |
| An opened cassette case with blank cards and a small calendar, representing a finite written schedule. | 16 | pass; image alternative |
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
| Step note | 2 | pass |
| Remove this dose step | 4 | pass; accessible button name |
| Add a dose step | 4 | pass |
| Save this card | 3 | pass |
| Your card stays on this device. | 6 | pass; `private-device` |
| Restore an existing card | 4 | pass |
| Choose a StepDown Card JSON backup from this or another device. | 11 | pass; `backup-roundtrip` |
| Import a backup | 3 | pass |
| A private card for a clinician-provided taper. | 7 | pass; `private-device` |
| Terms | 1 | pass |
| Built by Param Factory | 4 | pass |
| Original generated collage; provenance is in the design notes. | 9 | pass; provenance statement |

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

## Demo, sandbox, privacy, and offline behavior

The one-click sample path passes. Clicking **Try it with sample data** in a fresh 390 × 844 context opens `/demo` directly to **“Prednisone — sample”**. The first visible schedule row contains **“Fri, Aug 28”**, **“20 mg once daily”**, and **“Check this day”**; its button ends at y=591. The persistent banner is present with **Reset demo** and **Leave demo and write a card**.

Checking a sample day changes its state, then Reset restores an unchecked sample. The `demo-unsaved` claim command passes and the exercised page has no `demo:stepdown:schedule` IndexedDB value. The demo path’s network log contains only same-origin document, CSS, JavaScript, and image requests. `offline-reload` passed from the clean clone: after service-worker control and network disable, `/demo` reloaded to the populated sample.

## Claims gate

All 14 entries in `.factory/claims.json` were invoked separately from a fresh clone after `npm ci`.

| Claim ID | Result |
| --- | --- |
| `offline-reload` | pass |
| `csv-export` | pass |
| `private-device` | pass |
| `backup-roundtrip` | pass |
| `backup-validation` | **fail — F-3-1** |
| `encrypted-card` | pass |
| `no-passphrase-recovery` | pass |
| `demo-unsaved` | pass |
| `print-card` | pass |
| `free-no-account` | pass |
| `transcription-only` | pass |
| `no-clinical-output` | pass |
| `clear-device-data` | pass |
| `check-timestamp` | pass |

`npm run typecheck`, `npm run lint`, and `npm run build` pass. `npm test` fails at `@claim:backup-validation`. The clean clone build produces `dist/`; initial JS is 22.72 kB (7.82 kB gzip). The live-only version of the failing Playwright test passed once, which does not remove the clean-clone failure.

## History re-check

Every earlier report was read. The following live and code checks confirm that prior findings are fixed unless noted.

| Earlier finding group | Current check | Status |
| --- | --- | --- |
| F-1-1, F-1-2 | Live 404 has metadata, header/footer/legal links and an operating skip target; its footer targets are 44 × 44 px. | fixed |
| F-1-3 | Axe 4.10.2 reported zero violations on `/`, `/demo`, `/privacy`, `/terms`, and `/missing-page` in light and dark schemes. | fixed |
| F-1-4 | **Write my card** and **Leave demo and write a card** name their outcome and focus the editor. | fixed |
| F-1-5, F-1-6 | Safety/recovery claims have registry coverage; README copy uses plain wording. | fixed |
| F-2-1 | The phone demo now shows a realistic Prednisone dose/date/check row without scrolling. | fixed |
| F-2-2 | Privacy now says only **“Clear this site’s data to remove a saved card.”** | fixed |
| F-2-3 | Copy names required fields, valid dates, and non-overlap; the intended validation test exists. Its intermittent failure is F-3-1. | **regressed / half-fixed** |
| F-2-4, F-2-5, F-2-6 | Landing eyebrow and README heading/storage wording are clear and consistent. | fixed |
| F-2-7 | Live 404 footer Privacy and Terms targets measure at least 44 × 44 px. | fixed |
| Earlier verification defects | Date-only handling, edit acknowledgement retention, overlap/reversed-range rejection, import access from empty/locked states, demo route restoration, update notice, cache policy, contrast, 390 px layout, canonical metadata, touch icon, and art disclosure are present in code and pass their current browser checks. | fixed |

## Structure and routes

`/`, `/demo`, `/privacy`, and `/terms` return 200; `/missing-page` returns a designed 404. The normal routes have route-specific titles, one h1, description, canonical, Open Graph/Twitter metadata, favicon, shared header/footer, sitemap, robots, manifest, CSP, and same-origin-only policy. Crawl of every internal destination link returned 200. Privacy navigation focuses its h1; browser Back returns focus to the home h1 and updates the polite route status. The standalone 404 Skip action focuses `#main`.

The browser reports the expected failed-resource console line for the document whose HTTP response intentionally is 404; no JavaScript or application console error was observed on normal routes.

## Missed leverage

No AI feature is appropriate: interpreting a medication taper would add medical-risk ambiguity. The obvious non-AI value is already present: isolated sample data, offline use, printing, CSV export, JSON backup/import, and local encryption. Account sync would conflict with the stated no-account, local-device model.

## What would make this perfect

Make encrypted invalid-import cleanup deterministic, prove it with a repeatable clean-clone claim test, and repeat the full 14-command claims gate. With that safety regression closed, the inspected first-read, demo, privacy, copy, route, metadata, accessibility, and visual-identity checks have no remaining finding.

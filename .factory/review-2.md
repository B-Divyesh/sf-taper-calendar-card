# Adversarial first-read review 2 — StepDown Card

**Date:** 2026-08-28 UTC  
**Work order:** `taper-calendar-card-review-2`  
**Candidate:** `b7b6f12a99a4990cde23603f9c6f06dc3137da21`  
**Live URL:** `https://taper-calendar-card.sociobot.in`  
**Verdict:** **FAIL** — one blocking and six non-blocking findings remain. PASS requires zero findings and no unlisted claim.

`.factory/brief.json` is absent from this candidate. Scope was therefore checked against the repository contract, `.factory/design.md`, the live product, and the recorded history.

## Cold first read

Fresh Chromium contexts loaded `/` at 390 × 844 and 1440 × 900 without scrolling, prior storage, cookies, or console errors.

| Question | Answer from the first screen | Result |
| --- | --- | --- |
| What does this do? | It records a clinician-provided taper and lets me check it day by day. | pass |
| For whom? | People already following clinician instructions who want doses and checked days together. | pass |
| What should I click first? | **Try it with sample data**, followed by **Loads an example card. Nothing is saved.** | pass |

At 390 px, the headline, audience sentence, primary action, stated result, and all three facts end at 656 px within the 844 px viewport. `scrollWidth` is 390 px. The first-read gate passes.

## Findings

### F-2-1 — BLOCKING — The first demo screen hides the actual schedule and the sample is generic

**Exact quote/location:** After one click on **“Try it with sample data”** at 390 × 844, the first screen shows **“Example medication”**, **“14 scheduled days · 0 checked”**, four toolbar buttons, and generic text beginning **“Example only.”** The **“Daily checks”** heading starts at y=866 and the first dose row starts at y=900, below the 844 px viewport.

**Why this fails:** The mandatory first post-click screen does not show a date, dose, step, or check control. “Example medication” is a placeholder, not realistic sample data. A phone visitor still has to scroll before seeing the core day-by-day product in use. The demo-sandbox contract defines a weak demo as blocking.

**Concrete fix:** Seed a clearly marked but realistic example such as **“Prednisone — sample”** with concise clinician wording. Put a populated “Today” row or the first two date/dose/check rows above the fold at 390 × 844. Keep the demo banner and safety context, but move or collapse secondary export controls below the first schedule rows. Add a 390 px test asserting that a real-looking medication name, a date, a dose, and **“Check this day”** are all visible without scrolling immediately after the first click.

### F-2-2 — MEDIUM — The privacy page gives a misleading, unlisted removal claim

**Exact quote/location:** `/privacy`: **“Clear site data or use a private browser session to remove them.”** `.factory/claims.json` lists and tests clearing site data, but has no private-session claim.

**Why this fails:** Opening a private session does not remove a card already saved in a normal browser profile. On a page about sensitive medication data, the sentence can send a visitor to the wrong action and its second half is untested.

**Concrete fix:** Replace it with **“Clear this site’s data to remove a saved card. A private window keeps a new card separate from your normal browser data.”** If the private-window statement remains, add a named claim and a clean-context test that closes the private context and confirms its card is absent from a new private context.

### F-2-3 — MEDIUM — “Every safety check” is a vague, unlisted data-replacement claim

**Exact quote/location:** Encrypted-card recovery screen in `src/main.ts`: **“This replaces the locked card only after the backup passes every safety check.”** There is no matching entry in `.factory/claims.json`. The existing malformed-backup regression is untagged and exercises only one malformed shape.

**Why this fails:** A person deciding whether an import can overwrite an encrypted card may rely on this broad assurance. “Every safety check” neither names the checks nor has the one registered claim test required for public behavior.

**Concrete fix:** Use concrete copy such as **“This replaces the locked card only when the backup has valid fields, dates, and non-overlapping dose steps.”** Add a `backup-validation` claim and one tagged test covering missing fields, invalid/reversed dates, overlapping steps, and confirmation that the locked record remains unchanged after each rejection.

### F-2-4 — MINOR — The landing eyebrow uses specialist wording

**Exact quote/location:** Landing first screen: **“PRIVATE TAPER TRANSCRIPTION.”**

**Why this fails:** “Transcription” is a technical noun where the product otherwise uses the clearer verb “copy.” It makes the first screen less immediate for a distracted visitor.

**Concrete fix:** Rewrite it as **“COPY YOUR CLINICIAN’S TAPER”** or **“YOUR WRITTEN TAPER CARD.”**

### F-2-5 — MINOR — A README heading does not make sense out of context

**Exact quote/location:** `README.md`: **“Run it.”**

**Why this fails:** A screen-reader heading list does not identify what is being run or where.

**Concrete fix:** Rename it **“Run StepDown Card locally.”**

### F-2-6 — MINOR — README uses an implementation term for a user-facing privacy fact

**Exact quote/location:** `README.md`: **“Cards stay in browser storage on the current device.”**

**Why this fails:** “Browser storage” names an implementation mechanism rather than the outcome a visitor needs.

**Concrete fix:** Rewrite it as **“Cards stay in this browser on the current device.”**

### F-2-7 — MINOR — The 404 Terms link misses the required touch-target width

**Exact quote/location:** Live `/missing-page` at 390 px, footer link **“Terms”** measures 39 × 44 CSS pixels. `public/404.css` gives all links a 44 px minimum height but does not give footer links a 44 px minimum width.

**Why this fails:** The attached accessibility contract requires touch targets to be at least 44 × 44 px. This target is narrow even though automated axe checks do not flag it.

**Concrete fix:** Give 404 footer links at least 44 px width, using padding or `min-width: 44px`, and extend the mobile target-size test to include `/404.html` footer links.

## Copy audit

Word counts treat a URL, version, or hyphenated term as one word. Repeated labels such as Privacy are consolidated. Nothing exceeds 22 words and no banned marketing adjective appears. Every flag below has its own finding and proposed rewrite.

### Live landing page `/`

| Sentence or visible phrase | Words | Result |
| --- | ---: | --- |
| Skip to the schedule | 4 | pass |
| StepDown Card | 2 | pass |
| Demo | 1 | pass |
| Card | 1 | pass |
| Privacy | 1 | pass |
| Private taper transcription | 3 | **flag F-2-4: jargon** |
| Track your taper day by day | 6 | pass |
| For people following clinician instructions who need each dose and checked day in one private card. | 16 | pass |
| Try it with sample data | 6 | pass; permitted sample action |
| Loads an example card. | 4 | pass |
| Nothing is saved. | 3 | pass; `demo-unsaved` |
| Write my card | 3 | pass; result-naming verb |
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
| Remove this dose step | 4 | pass; accessible result name |
| Add a dose step | 4 | pass |
| Save this card | 3 | pass |
| Your card stays on this device. | 6 | pass; `private-device` |
| Restore an existing card | 4 | pass |
| Choose a StepDown Card JSON backup from this or another device. | 11 | pass; `backup-roundtrip` |
| Import a backup | 3 | pass |
| A private card for a clinician-provided taper. | 7 | pass |
| Terms | 1 | pass |
| Built by Param Factory | 4 | pass |
| v1.2.0 | 1 | pass |
| Original generated collage; provenance is in the design notes. | 9 | pass |

### `README.md`

| Sentence or heading | Words | Result |
| --- | ---: | --- |
| StepDown Card | 2 | pass |
| StepDown Card is a private card that works after you first open it. | 13 | pass; `offline-reload` |
| It is for people copying a clinician-provided medication taper. | 9 | pass |
| Enter the written instructions and dose steps. | 7 | pass |
| Check each day, then print or export your record. | 9 | pass; `print-card`, `csv-export` |
| It does not calculate doses, recommend doses, or check interactions. | 10 | pass; `no-clinical-output` |
| Ask a clinician or pharmacist when instructions are unclear. | 9 | pass |
| Run it | 2 | **flag F-2-5: contextless heading** |
| Open `http://localhost:5173`. | 2 | pass |
| Use `http://localhost:5173/demo` for an isolated sample card. | 7 | pass |
| Demo changes stay in memory and are discarded on reload or exit. | 12 | pass; `demo-unsaved` |
| Test and build | 3 | pass |
| Deploy the generated `dist/` folder as a static site. | 9 | pass; developer instruction |
| The app saves the files it needs for offline use. | 10 | pass; `offline-reload` |
| Data and privacy | 3 | pass |
| Cards stay in browser storage on the current device. | 9 | **flag F-2-6: implementation jargon** |
| You can print a card or export CSV for the day-by-day log. | 12 | pass; `print-card`, `csv-export` |
| You can export a full JSON backup and import it later. | 11 | pass; `backup-roundtrip` |
| You can optionally encrypt a real card with a passphrase using your browser’s built-in encryption. | 16 | pass; `encrypted-card` |
| Save a backup because a forgotten passphrase cannot be recovered. | 10 | pass; `no-passphrase-recovery` |
| See `/privacy` and `/terms` in the app. | 7 | pass |
| Scope and cost | 3 | pass |
| StepDown Card is free and has no account or analytics. | 10 | pass; `free-no-account` |
| StepDown Card keeps the dates, dose wording, and clinician instructions you enter. | 12 | pass; `transcription-only` |

### Terminology check

| Concept | Consistent product word |
| --- | --- |
| clinician-provided plan | clinician instructions |
| finite regimen | taper |
| saved schedule view | card |
| regimen segment | dose step |
| completion mark | check |
| sample mode | demo |
| portable data copy | backup |

Terms are otherwise consistent. Landing buttons use result-naming verbs.

## Demo and sandbox behavior

- One click from `/` opens `/demo`; direct `/demo` and `/?demo=1` also work.
- The persistent banner says **“Demo — sample data, nothing is saved”** and includes **Reset demo** and **Leave demo and write a card**.
- The sample has 14 generated days and three dose steps. F-2-1 records why the first phone viewport still fails the realistic, immediately-used requirement.
- Checking one sample day changed the checked count from 0 to 1. **Reset demo** returned it to 0.
- A real card named `Real review medicine` was created first. Its IndexedDB value was byte-for-byte identical before, during, and after demo use; no `demo:stepdown:schedule` value was written. Leaving the demo restored and focused that real card’s editor.
- After service-worker control, browser networking was disabled and `/demo` reloaded with **Example medication**, 14 days, and the banner present.
- The exercised real/demo/offline flow made no third-party request and logged no page or console error.

Isolation, Reset, direct entry, exit, offline behavior, and real-data preservation pass. Immediate sample quality fails as F-2-1.

## Claims gate

The candidate was cloned cleanly to `/tmp/taper-review-2-clean.uz8HlC/repo` at `b7b6f12a99a4990cde23603f9c6f06dc3137da21`, followed by `npm ci`. Every exact command from `.factory/claims.json` was run separately.

| Claim ID | Exact command result |
| --- | --- |
| `offline-reload` | pass |
| `csv-export` | pass |
| `private-device` | pass |
| `backup-roundtrip` | pass |
| `encrypted-card` | pass |
| `no-passphrase-recovery` | pass |
| `demo-unsaved` | pass |
| `print-card` | pass |
| `free-no-account` | pass |
| `transcription-only` | pass |
| `no-clinical-output` | pass |
| `clear-device-data` | pass |
| `check-timestamp` | pass |

Each declared ID appears on exactly one tagged test. No declared claim test fails. F-2-2 and F-2-3 are claim-like live sentences with no registry entry, so the claims gate is not complete.

The clean clone also passed `npm run typecheck`, `npm run lint`, `npm test` (11 unit tests and 30 Playwright tests), and `npm run build`. `dist/` was produced; initial JavaScript is 21.70 kB (7.51 kB gzip). All 30 browser tests also passed against the live origin. Live HTML, JavaScript, and CSS hashes match the clean build.

## Historical finding verification

Every finding in `.factory/review-1.md` was checked against both the live deployment and current code; `.factory/polish-1.md` and the prior handoff were not accepted as proof by themselves.

| Earlier ID | Live confirmation | Code/test confirmation | Status |
| --- | --- | --- | --- |
| F-1-1 | Unknown URL returns the designed document with HTTP 404, complete navigation/footer, legal links, route metadata, icons, and return actions. | `public/404.html`, `public/404.css`, and the standalone-404 crawl test contain the required contract. | fixed; F-2-7 is a new target-size defect |
| F-1-2 | Tab then Enter on **Skip to the message** focuses `MAIN#main`. | `public/404.js` focuses `#main`; the main has `tabindex="-1"`; browser test passes. | fixed |
| F-1-3 | Live axe scans find zero violations on demo in light and dark modes. | Card safety copy is a `<div class="safety">`; the suite requires zero axe violations. | fixed |
| F-1-4 | Live controls read **Write my card** and **Leave demo and write a card**; both focus the medication editor. | Result labels and focus handlers are present in `src/main.ts`; navigation tests pass. | fixed |
| F-1-5 | The exact no-clinical-output and forgotten-passphrase statements are present and their live flows behave as stated. | `no-clinical-output` and `no-passphrase-recovery` each have one registry entry and one passing tagged test. | fixed; F-2-3 concerns a different backup-validation claim |
| F-1-6 | The README no longer contains `offline-ready`, `precaches`, `built shell`, or `Web Crypto`. | Current README uses the repaired plain wording. | fixed |

The cumulative regressions documented in review 1 and polish 1 were also rerun through the full clean and live suites: date-only behavior in three time zones, malformed import retention, acknowledgement retention on edit, reversed/overlapping-step rejection, empty/locked recovery import, demo route state, Back/focus/announcement, update notice, old-cache cleanup, immutable asset headers, dark contrast, 390 px app layout, canonical metadata, touch icon, and generated-art disclosure all pass. The 404 footer width in F-2-7 is outside the earlier app-route target assertion and remains open.

## Structure, links, accessibility, and identity

- `/`, `/demo`, `/privacy`, and `/terms` return 200; `/missing-page` returns 404. Every destination link on the normal routes and designed 404 resolves as intended.
- Each route has one h1, ordered headings, `lang=en`, a main landmark, route-specific title/description/canonical/OG/Twitter metadata, favicon, 180 px touch icon, and the shared header/footer. The social image is 1200 × 630.
- Client navigation to Privacy and browser Back both focus the new h1 and update the polite route announcement.
- `robots.txt`, `sitemap.xml`, the manifest, service worker, and security headers are present. Hashed assets use immutable caching and `sw.js` uses `no-cache`.
- The factory URL verifier passes with no load errors. Independent axe 4.10.2 scans report zero violations on all five checked pages in light and dark schemes. F-2-7 is a manual target-size failure.
- The cassette-era paper, halftone texture, tape-label tracks, serif/monospace pairing, and original collage are recognisable and match `.factory/design.md`. This is not a generic SaaS template.

## Missed leverage

No AI feature is warranted. The job is exact transcription of clinician instructions; model interpretation would add medical ambiguity rather than remove work. The product already has the obvious local-first leverage implied by the available scope: CSV export, complete backup export/import, printing, encryption, offline use, and an isolated sample. Account-based sync would conflict with the stated no-account/local-storage contract. The absent `.factory/brief.json` prevents checking any opportunity-specific feature not represented elsewhere.

## What would make this perfect

Show an actual date/dose/check row and a believable, clearly labelled sample medication in the first post-click phone viewport. Replace or register the two unlisted privacy/import assurances, simplify the three flagged copy items, and enlarge the 404 Terms target to 44 × 44 px. Then rerun every claim command from a clean clone and repeat the complete cold mobile/desktop, demo-isolation, offline, route, link, focus, axe, and copy audits. At that point there should be no finding of any severity and no unlisted claim.

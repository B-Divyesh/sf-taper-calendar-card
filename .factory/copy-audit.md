# Copy audit

Audited 2026-08-28 after polish round 2. Word counts treat a hyphenated term, URL, version, or control name as one word.

## Landing `/`

This covers every phrase rendered for a fresh visitor, including navigation, controls, form labels, image alternative text, and the footer.

| Rendered sentence or phrase | Words | Result |
| --- | ---: | --- |
| Skip to the schedule | 4 | pass |
| StepDown Card | 2 | pass |
| Demo | 1 | pass |
| Card | 1 | pass |
| Privacy | 1 | pass |
| Copy your clinician’s taper | 4 | pass |
| Track your taper day by day | 6 | pass |
| For people following clinician instructions who need each dose and checked day in one private card. | 16 | pass |
| Try it with sample data | 6 | pass |
| Loads an example card. | 4 | pass |
| Nothing is saved. | 3 | pass |
| Write my card | 3 | pass |
| Works after you first open it. | 6 | pass |
| Stores your card on this device. | 6 | pass |
| Free to use. | 3 | pass |
| No account or analytics. | 4 | pass |
| An opened cassette case with blank cards and a small calendar, representing a finite written schedule. | 16 | pass |
| Keep the written plan visible. | 5 | pass |
| Make a card in three steps | 6 | pass |
| Copy the clinician’s instructions exactly. | 5 | pass |
| Mark each dose step and date. | 6 | pass |
| Check each day, then print or export. | 8 | pass |
| What this card does not do | 6 | pass |
| It records clinician instructions. | 4 | pass |
| It does not calculate doses, recommend doses, or check interactions. | 10 | pass; `no-clinical-output` |
| If instructions are unclear, contact your clinician or pharmacist. | 9 | pass |
| Your written card | 3 | pass |
| Write your clinician’s taper | 4 | pass |
| Copy instructions exactly. | 3 | pass |
| StepDown Card cannot tell you what dose to take. | 9 | pass |
| Medication or treatment name | 4 | pass |
| Clinician instructions, copied exactly | 4 | pass |
| Dose steps | 2 | pass |
| Start | 1 | pass |
| End | 1 | pass |
| Exact dose | 2 | pass |
| For example: 10 mg once daily | 6 | pass |
| Step note | 2 | pass |
| For example: take with food | 5 | pass |
| Remove this dose step | 4 | pass |
| Add a dose step | 4 | pass |
| Save this card | 3 | pass |
| Your card stays on this device. | 6 | pass |
| Restore an existing card | 4 | pass |
| Choose a StepDown Card JSON backup from this or another device. | 11 | pass |
| Import a backup | 3 | pass |
| A private card for a clinician-provided taper. | 7 | pass |
| Terms | 1 | pass |
| Built by Param Factory | 4 | pass |
| v1.3.0 | 1 | pass |
| Original generated collage; provenance is in the design notes. | 9 | pass |

## README

| Sentence | Words | Result |
| --- | ---: | --- |
| StepDown Card is a private card that works after you first open it. | 13 | pass |
| It is for people copying a clinician-provided medication taper. | 9 | pass |
| Enter the written instructions and dose steps. | 7 | pass |
| Check each day, then print or export your record. | 9 | pass |
| It does not calculate doses, recommend doses, or check interactions. | 10 | pass |
| Ask a clinician or pharmacist when instructions are unclear. | 9 | pass |
| Open `http://localhost:5173`. | 2 | pass |
| Use `http://localhost:5173/demo` for an isolated sample card. | 7 | pass |
| Demo changes stay in memory and are discarded on reload or exit. | 12 | pass |
| Deploy the generated `dist/` folder as a static site. | 9 | pass |
| The app saves the files it needs for offline use. | 10 | pass |
| Cards stay in this browser on the current device. | 9 | pass |
| You can print a card or export CSV for the day-by-day log. | 12 | pass |
| You can export a full JSON backup and import it later. | 11 | pass |
| You can optionally encrypt a real card with a passphrase using your browser’s built-in encryption. | 16 | pass |
| Save a backup because a forgotten passphrase cannot be recovered. | 10 | pass; `no-passphrase-recovery` |
| See `/privacy` and `/terms` in the app. | 7 | pass |
| StepDown Card is free and has no account or analytics. | 10 | pass |
| StepDown Card keeps the dates, dose wording, and clinician instructions you enter. | 12 | pass; `transcription-only` |

No sentence exceeds 22 words. No sentence uses a banned marketing word. The first screen says the job, audience, first action, result, privacy, offline behavior, and price in one breath-sized view at 390 px.

## Changed route copy

| Route | Sentence or phrase | Words | Result |
| --- | --- | ---: | --- |
| `/demo` | Prednisone — sample | 2 | pass; clearly labelled realistic sample |
| `/demo` | Sample only. | 2 | pass |
| `/demo` | Follow your clinician’s written directions. | 5 | pass |
| `/demo` | Take the listed dose with breakfast. | 7 | pass |
| `/privacy` | Clear this site’s data to remove a saved card. | 9 | pass; `clear-device-data` |
| encrypted recovery | A backup replaces this locked card only when required fields and dates are valid and dose steps do not overlap. | 19 | pass; `backup-validation` |

## Terminology

| Concept | Product word |
| --- | --- |
| clinician-provided plan | clinician instructions |
| finite regimen | taper |
| saved schedule view | card |
| regimen segment | dose step |
| confirmation | check |
| sample mode | demo |
| portable data copy | backup |

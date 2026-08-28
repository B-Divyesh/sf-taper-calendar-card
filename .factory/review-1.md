# Adversarial first-read review 1 — StepDown Card

**Date:** 2026-08-28 UTC  
**Live URL checked:** `https://taper-calendar-card.sociobot.in`  
**Verdict:** **FAIL** — six findings remain. There are no failing declared claim commands, but PASS requires zero findings.

## Cold first read

Fresh Chromium contexts at 390 × 844 and 1440 × 900 loaded `/` with no console errors.

Before scrolling, I understood the product as: a private card for writing down a clinician-provided medication taper and checking each scheduled day. It is for people already following clinician instructions. The first action is **“Try it with sample data,”** which says **“Loads an example card. Nothing is saved.”** All three answers are visible at 390 px, so this gate passes.

The cassette-zine treatment is distinctive and supports the finite-sequence task. It does not resemble a generic SaaS hero. Mobile width was 390 px with no horizontal overflow.

## Findings

### F-1-1 — MEDIUM — The live 404 is not a complete site route

**Location/evidence:** `https://taper-calendar-card.sociobot.in/missing-page` returns the designed page and HTTP 404, but its live HTML has only **“StepDown Card”** and **“Return to StepDown Card”** as destination links. It has no Privacy or Terms link, no Param Factory credit/version, no meta description, canonical URL, Open Graph metadata, theme colour, or favicon.

**Why this fails:** A person who reaches a bad link loses the site-wide legal navigation and page metadata required on every route. This is an incomplete route, even though its return-home action works.

**Concrete fix:** Bring `404.html` onto the same header/footer and metadata contract as the app: wordmark, Demo/Card/Privacy navigation, footer one-liner plus Privacy, Terms, Param Factory and version; add route-specific description, canonical `/404`, OG/Twitter fields, theme colour, and favicon links. Add a browser test that crawls the 404 document for these elements.

### F-1-2 — MINOR — The 404 skip link does not move keyboard focus to main content

**Location/evidence:** On the live missing page, Tab focuses **“Skip to the message.”** Pressing Enter changes the hash to `#main`, but `document.activeElement` becomes `BODY`, not `main`; `main` has no `tabindex="-1"` or click handler.

**Why this fails:** The page advertises a keyboard shortcut that only scrolls. A keyboard or screen-reader visitor is not placed at the message.

**Concrete fix:** Give the 404 `<main>` `tabindex="-1"` and make the skip-link activation focus it (or use the same tested handler as the SPA). Add a keyboard assertion that `#main` is focused after Enter.

### F-1-3 — MINOR — The demo card has an automated landmark violation

**Location/evidence:** A fresh live axe-core 4.10.2 scan reports one moderate violation on `/demo` in both light and dark schemes: `landmark-complementary-is-top-level`, on the safety `<aside>` containing **“Follow the clinician’s directions. This card records them. It does not change them.”**

**Why this fails:** The safety message is rendered as a complementary landmark in a location axe does not consider a top-level complementary region. This adds an invalid/ambiguous landmark to the screen-reader map.

**Concrete fix:** Make this inline safety copy a non-landmark element (for example, `<div class="safety">`) or move and label a genuinely complementary region correctly. Extend the accessibility test to require zero axe violations, rather than only zero serious/critical violations.

### F-1-4 — MINOR — Two buttons describe a starting state rather than their result

**Location/evidence:** Landing button **“Start your own card”** only scrolls to the editor. Demo button **“Start for real”** leaves the sandbox and either restores an existing card or shows the editor.

**Why this fails:** On a cold phone visit, neither label names what happens. This conflicts with the result-naming button rule and makes the second path less clear than the sample path.

**Concrete fix:** Rename them to **“Write my card”** and **“Leave demo and write a card”** (or **“Leave demo and open my card”** when a real card exists). Keep the resulting action adjacent to the button.

### F-1-5 — MINOR — Safety and recovery claims are not fully listed or tested

**Location/evidence:** The landing says **“It does not calculate a taper, recommend a dose, check interactions, or replace your clinician.”** The declared `transcription-only` claim only promises **“Keeps entered dose dates and wording unchanged; does not calculate a taper.”** README also says **“Save a backup because forgotten passphrases cannot be recovered.”** No `claims.json` entry states or tests the no-interaction/no-replacement portion or unrecoverable-forgotten-passphrase behaviour.

**Why this fails:** These are safety and data-recovery statements a visitor can rely on. The declared tests prove exact transcription and wrong-passphrase rejection, not the complete statements displayed to visitors.

**Concrete fix:** Either remove the untestable portions, or add narrowly worded claims and one observable browser test per claim: verify the product offers no interaction/recommendation output or clinical request, and verify that after encryption only the original passphrase can restore the card and no recovery route exists. Keep the tested claim text identical to the visitor-facing statement.

### F-1-6 — MINOR — README has unexplained technical wording

**Location/evidence:** README says **“private, offline-ready card”**, **“The service worker precaches the built shell,”** and **“using browser Web Crypto.”**

**Why this fails:** `offline-ready`, `service worker`, `precaches`, `built shell`, and `Web Crypto` are implementation terms rather than first-read words. The README is part of the required copy surface.

**Concrete fix:** Use the visitor-facing wording already tested on the site: **“a private card that works after you first open it”** and **“The app saves the files it needs for offline use.”** Replace the last phrase with **“using your browser’s built-in encryption,”** with an optional technical note only in a developer/deployment section.

## Copy audit

Word counts treat URLs, version labels, and visible control names as one word. No item exceeds 22 words. The entries marked **flag** are the copy findings above; all other landing copy is clear, concrete, and uses `taper`, `card`, and `dose step` consistently.

### Landing `/`

| Text | Words | Result |
| --- | ---: | --- |
| Skip to the schedule | 4 | pass |
| StepDown Card | 2 | pass |
| Demo | 1 | pass |
| Card | 1 | pass |
| Privacy | 1 | pass |
| Private taper transcription | 3 | pass |
| Track your taper day by day | 6 | pass |
| For people following clinician instructions who need each dose and checked day in one private card. | 16 | pass |
| Try it with sample data | 6 | pass |
| Loads an example card. | 4 | pass |
| Nothing is saved. | 3 | pass |
| Start your own card | 4 | **flag F-1-4** |
| Works after you first open it. | 6 | pass; declared offline claim |
| Stores your card on this device. | 6 | pass; declared storage claim |
| Free to use. | 3 | pass; declared free claim |
| No account or analytics. | 4 | pass; declared free claim |
| An opened cassette case with blank cards and a small calendar, representing a finite written schedule. | 16 | pass (image alt) |
| Keep the written plan visible. | 5 | pass |
| Make a card in three steps | 6 | pass |
| Copy the clinician’s instructions exactly. | 5 | pass |
| Mark each dose step and date. | 6 | pass |
| Check each day, then print or export. | 8 | pass |
| What this card does not do | 6 | pass |
| It does not calculate a taper, recommend a dose, check interactions, or replace your clinician. | 15 | **flag F-1-5** |
| If instructions are unclear, contact your clinician or pharmacist. | 9 | pass |
| Your written card | 3 | pass |
| Write your clinician’s taper | 4 | pass |
| Copy instructions exactly. | 3 | pass |
| StepDown Card cannot tell you what dose to take. | 9 | pass; limitation wording is clear |
| Medication or treatment name | 4 | pass |
| Clinician instructions, copied exactly | 4 | pass |
| Dose steps | 2 | pass |
| Start | 1 | pass |
| End | 1 | pass |
| Exact dose | 2 | pass |
| For example: 10 mg once daily | 6 | pass |
| Step note | 2 | pass |
| For example: take with food | 5 | pass |
| Remove this dose step | 4 | pass (accessible name) |
| Add a dose step | 4 | pass |
| Save this card | 3 | pass |
| Your card stays on this device. | 6 | pass; declared storage claim |
| Restore an existing card | 4 | pass |
| Choose a StepDown Card JSON backup from this or another device. | 11 | pass |
| Import a backup | 3 | pass |
| A private card for a clinician-provided taper. | 7 | pass |
| Terms | 1 | pass |
| Built by Param Factory | 4 | pass |
| v1.1.0 | 1 | pass |
| Original generated collage; provenance is in the design notes. | 9 | pass |

### README

| Text | Words | Result |
| --- | ---: | --- |
| StepDown Card | 2 | pass |
| StepDown Card is a private, offline-ready card for people transcribing a clinician-provided medication taper. | 14 | **flag F-1-6** (`offline-ready`, `transcribing`) |
| Enter the written instructions and dose steps, check each day, then print or export your record. | 16 | pass |
| It does not calculate a taper, recommend a dose, check drug interactions, or send clinical reminders. | 16 | **flag F-1-5** (only the calculation part is declared) |
| Ask a clinician or pharmacist when instructions are unclear. | 8 | pass |
| Run it | 2 | pass |
| Open `http://localhost:5173`. | 2 | pass |
| Use `http://localhost:5173/demo` for an isolated sample card. | 6 | pass |
| Demo changes stay in memory and are discarded on reload or exit. | 12 | pass; declared demo claim |
| Test and build | 3 | pass |
| The static deploy output is `dist/`, with `dist/index.html` at its root. | 11 | **flag F-1-6** (deployment jargon) |
| The service worker precaches the built shell. | 7 | **flag F-1-6** |
| Serve `dist` over HTTP to test installation and offline reload. | 10 | **flag F-1-6** (technical wording) |
| Data and privacy | 3 | pass |
| Cards stay in browser storage on the current device. | 9 | pass; declared storage claim |
| You can print a card or export CSV for the day-by-day log. | 12 | pass; declared print/CSV claims |
| You can export a full JSON backup and import it later. | 11 | pass; declared backup claim |
| You can optionally encrypt a real card with a passphrase using browser Web Crypto. | 14 | **flag F-1-6** (`Web Crypto`) |
| Save a backup because forgotten passphrases cannot be recovered. | 9 | **flag F-1-5** |
| See `/privacy` and `/terms` in the app. | 7 | pass |
| Scope and cost | 3 | pass |
| StepDown Card is free and has no account or analytics. | 10 | pass; declared free claim |
| It never calculates or recommends a taper. | 7 | **flag F-1-5** (recommendation portion lacks a declared exact claim) |
| The app keeps the dates, dose wording, and clinician instructions you enter. | 12 | pass; declared transcription claim |
| The earlier release candidate showed an optional paper-pack purchase before the factory checkout existed. | 14 | pass; factual release note, but unnecessary for a first-read README |
| This repaired release removes that unavailable offer and its license code rather than advertising a broken purchase. | 17 | pass; factual release note, but unnecessary for a first-read README |

## Demo, privacy, and offline sandbox

The one-click demo gate passes. In a fresh 390 px context, **“Try it with sample data”** opened a populated **“Example medication”** card with 14 days and the persistent banner **“Demo — sample data, nothing is saved / Reset demo / Start for real.”** Checking one day produced one Checked control; Reset returned this to zero. After leaving the demo, a pre-existing real card named `Review medicine` was restored. No `demo:stepdown:schedule` record was present in IndexedDB, and the exercised flow made no third-party request.

After `/demo` had service-worker control, network was disabled and a reload still displayed `Example medication` and 14 days. This verifies the live offline claim’s observable outcome.

## Claims gate

Read `.factory/claims.json` and ran every exact command in a fresh clone after `npm ci`. All passed:

| Claim ID | Result |
| --- | --- |
| offline-reload | pass |
| csv-export | pass |
| private-device | pass |
| backup-roundtrip | pass |
| encrypted-card | pass |
| demo-unsaved | pass |
| print-card | pass |
| free-no-account | pass |
| transcription-only | pass |
| clear-device-data | pass |
| check-timestamp | pass |

The clean clone also passed `npm run typecheck`, `npm run lint`, `npm test` (11 unit and 24 browser tests), and `npm run build`. Build output contains `dist/`; initial JavaScript is 20.68 kB (7.33 kB gzip).

## Structure and routes

`/`, `/demo`, `/privacy`, and `/terms` return 200; all normal in-app links crawl to live routes. `/missing-page` returns 404 and has a designed return-home screen. Normal routes have route-specific titles, one h1, description, canonical, OG title, favicon, header/footer, route announcements, and heading focus. Live click and Back checks moved focus to the new h1 and updated the polite route status. The 404 exceptions are recorded in F-1-1 and F-1-2.

## Earlier verification/history re-check

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files. I read `.factory/verification.md`, `.factory/verification-2.md`, and the prior handoff. Each concrete defect from the failed verification was checked again against live behaviour and current code:

| Earlier finding | Live/code re-check |
| --- | --- |
| Time-zone date shift | fixed: calendar-string arithmetic and date regression tests pass |
| Malformed import overwrites card | fixed: strict parse rejects malformed backup without replacing real card |
| Edit clears checks | fixed: retained-date acknowledgements are preserved |
| Reversed/overlapping steps clear/accept input | fixed: validation reports errors and retains input |
| Unavailable paid checkout | fixed: no checkout or paper-pack offer remains |
| Service worker caches license secrets | fixed: worker handles same-origin GET app assets only; license code is removed |
| Cached license verdict reused for a new token | fixed by removal of license flow |
| Dark contrast failures | fixed: no serious/critical live axe contrast failure; new moderate landmark finding is F-1-3 |
| 390 px editor overflow | fixed: live `scrollWidth` equals 390 |
| Import unavailable on empty/locked views | fixed: import is present in both views |
| Demo route leaves stale state / cannot restore real card | fixed: live demo restored the pre-existing real card on exit |
| Route focus and route announcement fail | fixed: live Privacy click and Back focus the h1 and update `#route-status` |
| Dead Schedule links / unknown path returns 200 | fixed: Card links resolve to `/`; unknown path returns 404 |
| No update notice / old cache deletion | fixed in current service-worker code and browser tests |
| No immutable asset / no-cache worker policy | fixed in `staticwebapp.config.json`; current live deployment has the repaired assets |
| Small touch targets | fixed: inspected controls at 390 px meet 44 px target sizing |
| Canonical fixed at root | fixed on the four SPA routes |
| Wrong Apple touch icon | fixed: live `/icon-180.png` exists and is linked |
| Missing generated-art disclosure / wrong sidecar reference | fixed: footer disclosure and `assets/hero-source.png.json` agree |
| Partial landing copy audit | materially fixed: current audit covers the landing’s substantive copy; this review adds the required README audit |

## Missed leverage

No missed AI feature was found. The task is exact, clinician-provided transcription; AI interpretation would create avoidable medical-risk ambiguity. The product already provides the valuable offline, demo, print, CSV, JSON backup/import, and optional local encryption capabilities implied by its scope.

## What would make this perfect

Complete the 404 as a first-class route, repair its keyboard skip target, remove the demo-card landmark violation, make the two start controls result-naming, and align every displayed safety/recovery claim with a precise declared test. Then simplify the README’s implementation language and repeat the complete live and clean-clone audit.

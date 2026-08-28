# StepDown Card

StepDown Card is a private, offline-ready card for people transcribing a clinician-provided medication taper. Enter the written instructions and dose steps, check each day, then print or export your record.

It does not calculate a taper, recommend a dose, check drug interactions, or send clinical reminders. Ask a clinician or pharmacist when instructions are unclear.

## Run it

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Use `http://localhost:5173/demo` for an isolated sample card. Demo changes stay in memory and are discarded on reload or exit.

## Test and build

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

The static deploy output is `dist/`, with `dist/index.html` at its root. The service worker precaches the built shell. Serve `dist` over HTTP to test installation and offline reload.

## Data and privacy

Cards stay in browser storage on the current device. You can print a card or export CSV for the day-by-day log. You can export a full JSON backup and import it later. You can optionally encrypt a real card with a passphrase using browser Web Crypto. Save a backup because forgotten passphrases cannot be recovered. See `/privacy` and `/terms` in the app.

## Scope and cost

StepDown Card is free and has no account or analytics. It never calculates or recommends a taper. The app keeps the dates, dose wording, and clinician instructions you enter.

The earlier release candidate showed an optional paper-pack purchase before the factory checkout existed. This repaired release removes that unavailable offer and its license code rather than advertising a broken purchase.

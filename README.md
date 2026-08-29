# StepDown Card

StepDown Card is a private card that works after you first open it. It is for people copying a clinician-provided medication taper. Enter the written instructions and dose steps. Check each day, then print or export your record.

It does not calculate doses, recommend doses, or check interactions. Ask a clinician or pharmacist when instructions are unclear.

## Run StepDown Card locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Use `http://localhost:5173/?demo=1` for an isolated sample card. Demo changes stay in memory and are discarded on reload or exit.

## Test and build

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

Deploy the generated `dist/` folder as a static site. The app saves the files it needs for offline use.

## Data and privacy

Cards stay in this browser on the current device. You can print a card or export CSV for the day-by-day log. You can export a full JSON backup and import it later. You can optionally encrypt a real card with a passphrase using your browser’s built-in encryption. Save a backup because a forgotten passphrase cannot be recovered. See `/privacy` and `/terms` in the app.

## Scope and cost

StepDown Card is free and has no account or analytics. StepDown Card keeps the dates, dose wording, and clinician instructions you enter.

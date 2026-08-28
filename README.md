# StepDown Card

StepDown Card is a private, offline-friendly card for people transcribing a clinician-provided medication taper. Enter the exact written instructions and dose steps, check each day, then print or export your record.

It does not calculate a taper, recommend a dose, check drug interactions, or send clinical reminders. Ask a clinician or pharmacist when instructions are unclear.

## Run it

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Use `http://localhost:5173/demo` for an isolated sample card. Demo data uses a separate browser-storage key and never touches your real card.

## Test and build

```bash
npm test
npm run build
```

The static deploy output is `dist/`, with `dist/index.html` at its root. The service worker precaches the built shell. Serve `dist` over HTTP to test installation and offline reload.

## Data and privacy

Cards stay in browser storage on the current device. You can export CSV for the day-by-day log and JSON for a full backup, then import the JSON later. You can optionally encrypt a real card with a passphrase using browser Web Crypto; save a backup because forgotten passphrases cannot be recovered. See `/privacy` and `/terms` in the app.

## Optional paper pack

The app keeps cards and exports free. The optional $9 one-time paper pack uses a Sociobot license checkout and can be restored with a license token.

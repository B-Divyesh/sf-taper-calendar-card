# Independent product verification

## Verdict: FAIL

- Candidate: `a4fdaf2b5f9c0791f270dbeee92d2396bcc79c86`
- Live URL: `https://taper-calendar-card.sociobot.in`
- Verified: 2026-08-28 UTC
- Work order: `taper-calendar-card-verify-1`
- Scope: clean-clone tests and build, live desktop and 390 px mobile, keyboard, axe, Lighthouse, local storage, exports, encryption, routing, PWA/offline, headers, outbound traffic, deployment identity, billing endpoint, and rate limiting

This candidate is not safe to release. It can render the wrong medication date in supported time zones, destructive edits erase acknowledgements, and malformed imports can overwrite the valid local card and leave the app blank. The paid checkout is also still unavailable.

## Mandatory gates

### First-read test: PASS

Cold, logged-out desktop load at `/` communicates all three required points in the first viewport:

- What it does: “Track your taper day by day.”
- For whom: people following clinician instructions who need each dose and checked day in one private card.
- What to click first: “Try it with sample data,” followed by “Loads an example card.”

One click opens an already-populated 14-day card. Evidence: `qa-artifacts/live-cold-desktop.png`.

### Declared claim commands: behavioral PASS after install; claims contract FAIL

The commands were invoked first on the untouched clone as required. Each initially exited 127 because dependencies were not installed (`vitest: not found`). After `npm ci`, each exact command passed:

| Claim | Exact command | Result after install |
| --- | --- | --- |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS: 5 Vitest tests plus the matching Playwright offline reload test |
| `csv-export` | `npm test -- --grep @claim:csv-export` | PASS: 5 Vitest tests plus the matching Playwright CSV test |
| `private-device` | `npm test -- --grep @claim:private-device` | PASS: 5 Vitest tests plus the matching Playwright same-origin demo test |

The claims system itself does not satisfy the supplied contract:

- Every claim ID occurs in two tagged tests, one unit test and one Playwright test. The contract requires exactly one test tagged `@claim:<id>`.
- The `private-device` test checks outbound requests in demo mode, not whether a real card is stored and restored on-device.
- Visitor-facing claims for printing, JSON backup/import, encryption, no analytics, demo isolation, and the paid paper pack are absent from `claims.json`.
- “Nothing is saved” is false as written. After checking a demo day and reloading, IndexedDB still contained `demo:stepdown:schedule` and the day remained checked.

## Release-blocking defects

### Critical

1. **Calendar dates change by one day in some time zones.** Entering `2026-12-31` through `2027-01-02` produced `2026-12-30` through `2027-01-01` in both `Pacific/Auckland` and `Pacific/Kiritimati`. A one-day `2026-01-01` schedule became `2026-01-02` in `Etc/GMT+12`. UTC and `America/New_York` produced the entered dates. The conversion in `src/schedule.ts` uses local noon followed by `toISOString()`, so the displayed card and exported CSV can contradict the clinician-provided dates.

2. **A malformed backup can overwrite the valid card and brick the app.** Importing syntactically valid JSON with medication, instructions, and steps but no `acknowledgements` passes the shallow validator, is saved, and throws `Cannot convert undefined or null to object`. Reload then renders only the skip link with an empty `#app`, repeating the page error. The previous valid card has already been replaced.

### High

3. **Editing destroys the acknowledgement log.** A one-day card with `1 checked` persisted correctly across reload. Changing only its dose through “Edit card” and saving changed the count to `0 checked`; submission always replaces `acknowledgements` with `{}`.

4. **Invalid and contradictory schedules are handled unsafely.** A reversed step (`2026-08-30` to `2026-08-29`) shows the right error but clears every entered field. Two steps on `2026-08-28` are accepted and rendered as two doses on the same day, with no overlap warning. This is unsafe for a transcription tool.

5. **The paid feature is not purchasable.** `GET https://api.sociobot.in/api/v1/products/taper-calendar-card/checkout` returns HTTP 404 with `{"error":"enabled factory product","status":404}`. The first screen nevertheless advertises “$9 one-time,” and the live Buy link points there.

6. **The service worker caches license secrets and stale verification results.** With a controlled client, a verification response whose server header is `Cache-Control: no-store` was stored in `stepdown-v2` under the full URL `.../verify?license=qa-cache-sensitive-token`. Because the worker is cache-first for every GET, later daily checks can reuse a stale valid result after revocation. This also duplicates the token in Cache Storage.

7. **Restoring a different license may not verify it.** With any license verdict cached in localStorage less than 24 hours ago, pasting a new token produced zero verification requests while the UI said, “It will be checked when you are online.” The timestamp is not associated with the token.

8. **Dark mode has serious axe failures.** axe-core 4.13.0 found 2 serious contrast nodes on `/` and 19 on `/demo`. Quiet buttons render black text on `#203a31` at 1.71:1; the demo banner is 2.4:1. The dark focus outline is also only 2.93:1 against the page, below the required 3:1.

9. **The real-card editor overflows at the required 390 px width.** The document is 436 px wide. Medication and clinician-instruction fields end at x=436, clipping 46 px off-screen. Evidence: `qa-artifacts/live-home-mobile-full.png`.

10. **Backup recovery is unavailable where it is needed.** “Import backup” exists only after a card has already been created. A fresh device has no import action, and the encrypted lock screen tells a user with a forgotten passphrase to restore a backup but provides no way to do so.

### Medium

11. **SPA routing has stale mode state.** Clicking the header Demo link changes the URL to `/demo` but leaves the landing/editor visible with no demo banner or sample. After direct demo entry, “Start for real” shows an empty editor rather than restoring an existing real card, creating an overwrite hazard.

12. **Route focus management does not work.** After client-side navigation to Privacy, `document.activeElement` is `BODY`; the attempted `h1.focus()` has no effect because the heading is not focusable. Back navigation has the same issue and there is no route announcement.

13. **Several navigation/404 requirements fail.** “Schedule” on `/privacy` and `/terms` points to a nonexistent same-page fragment. Unknown paths return HTTP 200 and render the home page, so the shipped `404.html` is unreachable through a normal bad URL.

14. **PWA update UX is missing.** The worker does call `skipWaiting()` and `clients.claim()`, but the app has no update listener or “update available” notice, and old cache names are never removed.

15. **Required caching policy is not deployed.** Even hashed JavaScript/CSS and images return `Cache-Control: public, must-revalidate, max-age=30`; no immutable long-lived policy is present.

16. **Some touch targets are below 44×44 px.** At 390 px, demo banner buttons are 34 px high, the Demo nav link is about 34 px wide, the remove-step button is 36 px wide, and footer links are 15 px high.

### Low/documentation

- Canonical metadata remains the root URL on every route.
- The Apple touch icon references a 192 px SVG rather than a 180 px touch icon.
- Generated-image disclosure is absent from the product footer, and `design.md` names `assets/hero-prompt.json` while the actual sidecar is `assets/hero-source.png.json`.
- `.factory/copy-audit.md` covers only selected landing copy rather than every sentence rendered on the landing page.

## Passing evidence

### Build and automated checks

- `npm ci`: PASS; 58 packages installed, 0 audit vulnerabilities.
- `npm test`: PASS; 5 Vitest and 3 Playwright tests.
- `npx tsc -b --pretty false`: PASS.
- No lint script is available in `package.json`.
- `npm run build`: PASS; `dist/` produced.
- Output: JS 17.93 KB / 6.40 KB gzip; CSS 7.24 KB / 2.48 KB gzip; hero 100,952 bytes.

### Useful end-to-end behavior

- A normal one-day card can be created, checked, reloaded, exported to CSV and JSON, and printed.
- The CSV contained the header plus one row and the acknowledgement timestamp.
- Real-card state and acknowledgements survived reload before editing.
- Encryption used the lock screen after reload; an incorrect passphrase produced a recovery message and the correct passphrase reopened the card.
- Demo storage uses only `demo:stepdown:schedule`; the real namespace was not read while the demo was active.
- Keyboard-only use reached the skip link and primary action with a visible 3 px focus ring; Enter opened the demo and Space toggled a daily check. No keyboard trap was observed.
- Reduced-motion emulation matched and reduced transitions/animations to 0.01 ms.

### Accessibility and structure

- `/opt/fleet/lib/verify-url.sh <url> <evidence-dir>`: PASS; title, `lang=en`, one `h1`, `main`, alt text, labels, and cold-load console checks passed.
- axe-core 4.13.0: zero violations on light `/`, light `/demo`, and dark `/privacy`; dark app routes fail as listed above.
- Cold and normal flows had no console/page errors. The malformed import produces deterministic page errors.

### PWA, privacy, and network

- Chrome parsed the manifest with no errors: standalone display, versioned start URL, 192/512 icons including maskable purpose.
- Live service worker registered and controlled the page. `/demo` and `/privacy` both reloaded successfully offline after first visit.
- The precache contained the shell, demo/legal routes, icons, hero, and hashed JS/CSS.
- A full normal create/check/export flow made only same-origin requests. No analytics, remote fonts, or third-party scripts were observed.
- Response headers include HSTS, `X-Content-Type-Options`, `Referrer-Policy`, and a restrictive CSP matching the app's runtime destinations.

### Performance

Lighthouse mobile against the live URL:

- Performance 97
- Accessibility 100 (light theme only)
- Best Practices 100
- SEO 100
- FCP 0.9 s, LCP 1.5 s, TBT 190 ms, CLS 0
- Initial transfer 110 KiB; JavaScript transfer 6.3 KiB; no third-party bytes

Raw result: `qa-artifacts/lighthouse-live-mobile.json`.

### Endpoint rate limiting

A rapid sequential burst to the license verification endpoint returned 200 for requests 1–30. Request 31 returned HTTP 429 with `Retry-After: 4`. This requirement passes. The app has no sign-in and no first-party backend endpoint.

## Deployment identity

The live deployment matches this candidate. `index.html`, hashed JS, hashed CSS, service worker, manifest, favicon, hero, icons, social image, robots, sitemap, and `404.html` all compared byte-for-byte equal to local `dist/`.

Representative SHA-256 values:

- `index.html`: `b0561755fadc7de21c24775547c9740d987313ddef938257a7d79b128b119605`
- JS: `cbfeabf53366c69fbdd4b361b0b0c2d384bb7f4726b8e1d1db3fd5d45e140044`
- CSS: `31cd485ca7fb7491e237edc125afada1b244d98a6181b866e4c4b1a7dbcab744`
- `sw.js`: `12dddfda6d5817e4ef1027133359b865e6cfbc345df3e5bda6f83a1a0dd0bd43`

## Required next steps

Do not release this commit. Correct date-only arithmetic without UTC conversion; preserve acknowledgements on edit; validate imported schemas before replacing storage; preserve form input on errors; reject or explicitly resolve overlapping steps; make backup recovery available before/while locked; repair demo routing; fix dark colors and 390 px layout; scope the service worker to same-origin assets and network-first license checks; register and retest checkout; then add one correctly scoped test per every public claim and rerun this full verification.

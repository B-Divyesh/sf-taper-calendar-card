# Demo sandbox

Open `/demo` or `/?demo=1`. The demo immediately loads a 14-day, three-step example taper card.

Demo data stays in memory and never reads or writes the real `stepdown:real:*` records. Legacy `demo:stepdown:schedule` data is deleted on entry. **Reset demo** replaces the example. **Start for real** discards the demo and restores the existing real card, if one exists.

The service worker caches the app shell after the first visit. The demo flow makes no network request.

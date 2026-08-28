# Demo sandbox

Open `/demo` or `/?demo=1`. The demo immediately loads a 14-day, three-step example taper card.

Demo data uses the separate `demo:stepdown:schedule` record in IndexedDB. It never reads or writes the real `stepdown:real:*` records. **Reset demo** replaces the example. **Start for real** discards the demo and begins an empty real card.

The service worker caches the app shell after the first visit. The demo flow makes no network request.

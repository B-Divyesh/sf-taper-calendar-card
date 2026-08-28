# Demo sandbox

Open `/demo` or `/?demo=1`. The demo immediately loads a clearly labelled 14-day, three-step Prednisone sample in one click. Its first date, dose, and check control are visible in the first 390 × 844 screen.

Demo data stays in memory and never reads or writes the real `stepdown:real:*` records. Legacy `demo:stepdown:schedule` data is deleted on entry. **Reset demo** replaces the example. **Leave demo and write a card** discards the demo and restores the existing real card, if one exists.

The app saves the files it needs after the first visit.

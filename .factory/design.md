# StepDown Card visual thesis

## Direction: cassette-era zine

StepDown Card treats a clinician's written regimen like a carefully labelled cassette insert: finite, sequential, and worth checking before play. The visual language is a photocopied late-1980s health zine rather than a medical portal. It gives a sensitive task an intentional, calm physicality without pretending to be clinical equipment.

## Tokens

- **Ink:** `#172821` (primary text), **paper:** `#f6f0df` (warm background), **label:** `#fffaf0` (surfaces).
- **Tape green:** `#1f6f5f` (actions), **oxide:** `#b84732` (safety and danger), **sun:** `#d98b19` (step markers), **graphite:** `#56615a` (muted text).
- **Night mode:** `#172821` background, `#f6f0df` text, `#234d42` surface, `#ffd166` focus. Text stays above 4.5:1; focus and controls stay above 3:1.
- **Type:** self-host-free system stacks: `ui-monospace` for dates, doses, and tape labels; `Georgia` for the humane editorial display voice. No remote font requests.
- **Spacing:** 4 px base, with 8/12/16/24/32/48 px intervals. Paper columns top out at 70 characters.

## Interaction and motion

Schedule steps look like numbered cassette tracks: colored left-edge tabs, punched-hole dots, and a striped tear line. Acknowledging today presses the track inward with a 180 ms transform. The reduced-motion version changes color and opacity only. There are no looping effects.

## Art plan and provenance

Hero art is an original raster collage: an opened cassette case, blank dosage cards, calendar squares, tape texture, and no readable text. It is used as supporting context, never as a source of instructions. Generated with the factory Azure image deployment on 2026-08-28 from the prompt recorded in `assets/hero-source.png.json`; no brands, people, logos, or watermark. Exported as a compressed WebP under 300 KB.

## Why this fits

A taper is a finite sequence that needs checking, not an alarm feed. The cassette insert metaphor makes the sequence visible while the restrained paper palette keeps safety copy and clinician-entered words dominant.

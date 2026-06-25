# F1 Grid Start Intro Animation

## Goal
A one-time-per-session intro overlay on the homepage: a compact F1 starting-grid light rig animates lights-on then snaps to black ("lights out"), then fades to reveal the site. Mobile-friendly, skippable.

## Trigger & persistence
- Full-viewport fixed overlay, mounted at the homepage root, above all other content.
- Gated by `sessionStorage.getItem('pw-intro-seen')`. Checked synchronously (inline script before React hydration) to avoid a flash on repeat views in the same session.
- Hero content underneath mounts and preloads immediately, hidden behind the overlay, so the reveal is instant.

## Visual
- **Background:** solid white, full viewport.
- **Light rig:** scaled-down, authentic 5 columns x 4 rows dot grid (20 dots), centered on screen, sitting on a dark housing bar (consistent with the real F1 gantry silhouette). Off-state dots are dark/charcoal (low contrast against the dark bar, not against the white page). Lit-state dots are vivid red (`#FF0000`-ish) — the one non-negotiable signature color for this motif.
- Sized with `clamp()`/viewport units so the full grid scales down cleanly on mobile without dropping columns.
- **Skip control:** small, plain-text "SKIP" caption centered directly below the light rig — looks like a caption label, not a styled CTA button. Minimal type, no border/pill. Touch target padded to ~40px hit area on mobile even though the visible label is small.

## Sequence (~2.5-3s total, compressed timing)
1. Columns illuminate left-to-right, all 4 dots in a column lighting simultaneously, ~150-180ms apart (5 columns, ~600-750ms to all-red).
2. Hold at all-red, fixed ~400-600ms (not randomized — compressed/UX-first, not authentic FIA timing).
3. Hard cut: all lights extinguish instantly, single-frame snap to the rig's off-state (no fade) — this is the "lights out" beat.
4. Overlay fades out (opacity transition, ~400-500ms), revealing the already-loaded hero underneath. No car-from-distance video yet — flagged as a future enhancement that would replace this fade with a video reveal.

## Skip behavior
- Clicking/tapping "SKIP" immediately triggers step 4 (fade-out + reveal), regardless of where the sequence currently is, and sets the sessionStorage flag.

## Component shape
- New `src/components/IntroSequence.tsx`, self-contained sequence state machine (`useState` + `setTimeout` chain, or `motion`'s sequencing — `motion` is already a project dependency).
- Mounted conditionally from the homepage entry point based on the sessionStorage check.
- Future work (not in this scope): replace step 4's fade with a "car approaches from a distance" video transition.

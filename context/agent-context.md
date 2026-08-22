# Agent Context

This is a motion-led personal developer/design portfolio. Treat the checked-in implementation as the source of truth for current runtime behavior and these context files as the handoff for intent, constraints, and next work.

## Stack

- React 19 and Vite 6
- GSAP with ScrollTrigger for pinned, scroll-driven video
- Lenis for smooth wheel scrolling when reduced motion is not requested
- Plain CSS for the visual system and responsive layout
- A small inline vanilla-JavaScript loader in `index.html` so the opening state exists before React downloads
- Pillow and NumPy in `scripts/generate_ink_splash.py` for reproducible loader sprites

## Current Runtime

`src/App.jsx` currently renders `ThirdScreen` directly. `Hero` is intentionally commented out, so `Hero` and its nested `About` sequence remain available in the repository but are not part of the live component tree.

Every full load or reload begins with a warm-paper overlay. After both the inverse ink sprite and `ThirdScreen.mp4` frame zero are ready, a 24-frame mask reveals the actual artwork over 3.6 seconds, holds for 400 ms, and fades over 560 ms. There is no local- or session-storage suppression.

`ThirdScreen` remains paused and maps at least the first 5,200px of pinned scroll progress to queued video seeks. After the final frame, a responsive dark-passage phase closes to black, holds briefly, and reveals `Monk-Peace.png` as an image-only landing state. The loader and React coordinate through the internal `portfolio:first-frame-ready` and `portfolio:loader-complete` events.

## Product Direction

The intended portfolio remains calm, editorial, and Japanese watercolor-inspired. The eventual experience should showcase selected development and design work, explain Akash’s capabilities, and provide a clear contact path without allowing decorative motion to compromise readability or accessibility.

## Important Constraints

- Preserve the current choice to render `ThirdScreen` directly unless the user explicitly restores `Hero`.
- Keep the ink reveal automatic on every full reload and free of black transitional frames.
- Keep `ThirdScreen.mp4` as the live source; `ThirdScreen-optimized.mp4` is not currently used.
- Keep the monk environment stationary behind the dark curtain; do not reintroduce a full rectangular slide between the two scenes.
- Preserve the monk image failure fallback, which leaves the final video frame visible instead of revealing black.
- Keep `Loading.mp4`, `Loading-end.png`, and `IntroLoader.jsx` unused unless explicitly revisited.
- Verify changes against reduced motion, responsive cropping, first-frame readiness, scroll-scrub synchronization, all three passage phases, and reverse traversal.

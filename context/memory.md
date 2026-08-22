# Memory

## Identity

- Name: Akash Anand
- Internet name: mrhapile
- Contact email: akashanand.office@gmail.com

## Current Project State

- Project: motion-led personal developer/design portfolio
- Stack: React 19, Vite 6, GSAP/ScrollTrigger, Lenis, and plain CSS
- Direction: calm editorial composition with Japanese watercolor-inspired artwork
- Available visual references: `reference/portfolio-direction-reference.png` and `reference/client-portfolio-direction-v1.png`
- `src/App.jsx` currently renders `ThirdScreen` directly; `Hero` is intentionally commented out
- `Hero.jsx` and nested `About.jsx` remain implemented but dormant
- The old React `IntroLoader.jsx`, `Loading.mp4`, and `Loading-end.png` are retained but unused

## Current Intro Decision

- The intro automatically plays on every full load/reload; there is no local- or session-storage state
- The loader is mounted in `index.html` so the paper cover appears before React
- The runtime asset is `public/hero/ink-splash-reveal-sprite.png`, a 24-frame horizontal inverse-alpha sprite
- The paper layer remains fully solid until the sprite is decoded and `ThirdScreen` reports a displayable frame zero
- The mask then reveals the actual artwork over 3.6 seconds using `steps(23, end)`
- Final timing is a 400 ms hold and 560 ms fade; the normal sequence is about 4.6 seconds after readiness
- A 12-second safety timeout prevents trapping on image or video failure
- Reduced motion skips frame cycling and transitions from the final mask state
- `scripts/generate_ink_splash.py` deterministically regenerates both the black source sprite and inverse reveal sprite

## ThirdScreen Decision

- Live source: `public/hero/ThirdScreen.mp4`
- `ThirdScreen-optimized.mp4` exists but is not used
- `loadeddata` dispatches the idempotent `portfolio:first-frame-ready` event
- The loader dispatches `portfolio:loader-complete`; ThirdScreen then refreshes ScrollTrigger
- Video seeking is queued: only one seek is active and the latest requested scroll position is retained
- Full reloads reset to scroll position and video frame zero

## Verified Behavior

- Production build passes
- Sprite generation is deterministic and monotonic
- The inverse sprite finishes fully transparent
- Desktop, tablet, and 390×844 mobile coverage have been checked
- The intro reveals the waterfall artwork inside the ink boundary without drawing a black splash
- The root is inert during loading and unlocked after dismissal
- ThirdScreen is paused at frame zero after reveal and advances with scroll
- Browser checks reported no console warnings or errors

## Deployment

- The portfolio has previously been deployed on Vercel
- The final domain/repository deployment flow remains to be confirmed

## Next Work

- Decide when to restore the dormant Hero/About sequence
- Build selected work, process, notes, contact, and footer sections once final content exists
- Assemble final project, biography, social, and contact copy
- Perform final physical-device performance and crop checks

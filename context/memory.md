# Memory

## Identity

- Name: Akash Anand
- Internet name: mrhapile
- Contact email: akashanand.office@gmail.com

## Project State

- Project: motion-led personal developer/design portfolio
- Stack direction: React + Vite with GSAP, ScrollTrigger, and Lenis
- Visual direction: calm, editorial, Japanese watercolor-inspired
- Visual source of truth: `reference/portfolio-direction-reference.png`
- Current hero layers: `public/hero/Initial-hero.png` poster, `public/hero/1786473783457496.mp4` video, and `public/hero/Second-char.png` character cutout
- The hero now crossfades from the poster into the pinned scroll-scrubbed video while the character rises in above the mountains
- The About section now follows the Hero and holds the Hero video's final frame with `Second-char.png` in place
- `public/hero/About-Paper.mp4` is scroll-scrubbed from a calibrated `1.5s` start time to its final frame
- One GSAP proxy progress drives both the parchment video time and crop, so forward scroll opens it and reverse scroll closes it
- The parchment sits in the open sky left of the sun on desktop and moves to the upper center on narrow screens
- The crop begins tightly around the roll at `inset(25% 2.5% 66% 2.5%)` and expands to `inset(1.5% 2.5% 1.5% 2.5%)`, preventing the white video canvas from flashing
- `public/hero/ThirdScreen.mp4` now follows the About completion state in a dedicated pinned full-viewport section
- The third-screen section waits for metadata and a decoded frame before revealing, then maps scroll progress directly to `video.currentTime` in both directions
- The About animation is implemented in `src/components/About.jsx`; `#about` navigation lands at the start of its pinned sequence
- The third-screen scrub is implemented in `src/components/ThirdScreen.jsx` and mounted immediately after `Hero` in `src/App.jsx`

## Deployment

- Current deployment: already on Vercel
- Domain: will be switched later to the GitHub repo deployment

## Current Focus

- Keep the portfolio aligned with the PRD and the rewritten context files
- Preserve accessibility, reduced-motion support, and readable text over the hero sequence
- Maintain the pinned, scroll-scrubbed hero transition with the poster, video, and character layered cleanly
- Preserve the pinned About parchment sequence and its synchronization between video time and crop progress
- Preserve the pinned third-screen video scrub and the transition from the About final state into the video section without blank frames
- Keep the final Hero landscape and character unchanged behind the About parchment
- Keep the parchment in the empty sky left of the sun on desktop without covering the character
- Keep the navbar visible while fading the role label, headline, description, CTA, and `Selected Work` strip away on scroll
- Keep the hero edge-to-edge without a visible wrapper/card, border, or rounded container
- Use the reference image as the visual guide for composition, type, spacing, and hierarchy

## Open Questions

- Final content for projects, about copy, and socials still needs to be assembled
- Final production host flow will be confirmed when the repo deployment is ready
- The Hero-to-About transition, parchment placement, and third-screen crop may still need final tuning on additional physical devices

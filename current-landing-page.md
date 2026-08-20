# Current Landing Page

## Overall Feel
The landing page is a calm, editorial portfolio with a warm cream palette, dark navy typography, and two connected full-bleed scroll sequences. The hero crossfades from a static poster into a mountain/sun video scene, then the About parchment unrolls over the frozen final Hero composition.

## Top Area
- A slim navbar sits across the top.
- The brand mark is a small slash on the left.
- Navigation links appear on the right: `Work`, `About`, `Notes`, `Contact`.

## Main Hero
- The hero content is left-aligned.
- A small orange label reads `Designer • Developer`.
- The headline is large, serif, and broken into two lines:
  - `I build animated`
  - `web experiences.`
- Below the headline is a short description about crafting performant, engaging websites.
- A rounded CTA button labeled `View selected work` sits underneath, with an orange circular arrow on the right.
- During scroll, the role label, headline, description, CTA, and the work strip all fade out completely.

## Background / Visual Layer
- The hero starts with `Initial-hero.png` as the visible poster layer.
- The existing mountain/sun video fades in beneath the poster as the scroll starts.
- `Second-char.png` rises from below the viewport and lands above the video.
- The navbar remains visible while the rest of the hero UI fades away.
- The scene stays edge-to-edge without a visible card, box, shadow, or rounded container.

## Bottom Strip
- A dark navy strip spans the bottom of the hero.
- It shows `Selected Work` on the left.
- On the right, it lists:
  - `UI / UX`
  - `Motion`
  - `Front-end`
- The strip is part of the initial hero state and fades away once the scroll transition begins.

## Motion
- The hero is pinned at `100vh` with `GSAP ScrollTrigger` and `scrub: true`.
- The poster, video, and character are all tied to the same scroll progress.
- The video scrubs smoothly with scrolling, with no hard cuts or flashes.
- The character rises from below the viewport as the sun rises in the animation.
- Reduced-motion mode skips the scrubbed sequence and keeps the hero accessible and static.

## About Parchment
- The About section starts immediately after the Hero reaches its final mountain/sun/tree/character composition.
- The final Hero video frame is held as the About backdrop, with the character kept in the same position.
- `About-Paper.mp4` appears in the open sky to the left of the sun on desktop.
- The asset's blank lead-in is skipped; the sequence begins at `1.5s` on the usable rolled-parchment frame.
- A single scrubbed GSAP progress value drives both the parchment `currentTime` and its animated crop.
- The opening crop is `inset(25% 2.5% 66% 2.5%)`, showing only the roll without a white rectangle.
- The crop expands to `inset(1.5% 2.5% 1.5% 2.5%)` as the parchment opens.
- Scrolling backward closes the parchment cleanly and returns it to the rolled state.
- Direct `#about` navigation lands at the beginning of the pinned sequence.
- Reduced-motion mode shows the final, fully opened parchment without pinning or scrubbing.

## Responsive Behavior
- On smaller screens, the layout keeps the same structure.
- The character scales and repositions so it remains readable without horizontal overflow.
- The strip stacks more naturally on mobile to preserve readability.
- The parchment moves from the left-side sky to a centered upper position on narrow screens.
- Its `4 / 5` aspect ratio is preserved, and its height stays clear of the character.

## Current Impression
The page currently reads as a refined, motion-led portfolio landing page with:
- strong serif headline typography
- a cinematic background treatment
- minimal, structured navigation
- a grounded footer-like work strip
- a reversible parchment-based About reveal integrated into the final Hero scene

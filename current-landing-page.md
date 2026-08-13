# Current Landing Page

## Overall Feel
The landing page is a calm, editorial portfolio hero with a warm cream poster image, dark navy typography, and a full-bleed cinematic scroll transition. The hero starts as a static composition and then crossfades into the video scene as the user scrolls.

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
- A transparent character PNG rises up from below the viewport and lands above the video.
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

## Responsive Behavior
- On smaller screens, the layout keeps the same structure.
- The character scales and repositions so it remains readable without horizontal overflow.
- The strip stacks more naturally on mobile to preserve readability.

## Current Impression
The page currently reads as a refined, motion-led portfolio landing page with:
- strong serif headline typography
- a cinematic background treatment
- minimal, structured navigation
- a grounded footer-like work strip

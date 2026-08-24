# Architecture Context

The project is a static React/Vite portfolio with a critical pre-React opening layer and GSAP-driven media sections.

## Boot Sequence

`index.html` owns the page-load reveal because it must render before the React bundle:

1. HTML starts with `ink-loader-active`; scrolling is locked and `#root` is inert and `aria-hidden`.
2. A 160vmax warm-paper square covers the viewport.
3. The browser decodes `public/hero/ink-splash-reveal-sprite.png` while React mounts behind the overlay.
4. `ThirdScreen` dispatches `portfolio:first-frame-ready` once `loadeddata` can display frame zero.
5. The loader applies the 24-frame inverse mask with `steps(23, end)` for 3.6 seconds.
6. It holds for 400 ms, fades for 560 ms, removes itself, unlocks the page, and dispatches `portfolio:loader-complete`.
7. A 12-second safety timeout reveals the page if either media path fails or stalls.

Reduced motion skips sprite frame cycling, applies the final transparent mask state, and follows the same safe handoff.

## Live React Tree

`src/main.jsx` mounts `App`. `App` currently provides:

- reduced-motion detection through `usePrefersReducedMotion`
- Lenis integration when motion is allowed
- a skip link
- `ThirdScreen` as the only mounted visual section

`Hero` is imported but commented out. Consequently, its nested `About` component is also dormant.

## ThirdScreen

`ThirdScreen` uses `public/hero/ThirdScreen.mp4` with `object-fit: cover` in a pinned full-viewport section. Metadata creates ScrollTrigger; decoded data reveals the video and signals loader readiness. The original video scrub keeps its 5,200px desktop/mobile minimum distance.

Scroll updates write only the latest requested time. A requestAnimationFrame commit and `seeked` gate prevent competing seeks while retaining the newest scroll position. After loader dismissal, `portfolio:loader-complete` triggers a ScrollTrigger refresh.

After the video reaches its final frame, the same pin continues through a horizontal outro that slides the video panel left, brings cropped `public/hero/Transition.png` in as a dark forest bridge, then lands on `public/hero/Monk-Peace.png`. The panels move with transform-only horizontal motion, edge blending, and subtle image scale. The sequence is fully reversible and recalculates its geometry on ScrollTrigger refresh.

The transition and monk images decode independently and do not block the intro loader. If either fails, the passage is suppressed and the final video frame remains visible. Reduced motion disables the pin and presents the video, transition artwork, and monk artwork as normal full-height panels.

## Dormant Components and Assets

- `Hero.jsx` and `About.jsx` retain the earlier poster/video/character/parchment sequence but are not mounted.
- `IntroLoader.jsx` is the unused video-based intro experiment.
- `Loading.mp4` and `Loading-end.png` remain intentionally unused.
- `ink-splash-sprite.png` is the black source sprite; `ink-splash-reveal-sprite.png` is its inverse alpha mask and the runtime asset.
- `scripts/generate_ink_splash.py` deterministically regenerates both 24-frame sprites.

## Planned Structure

Selected work, process, notes, contact, and footer remain product goals, not implemented live sections. Add them as presentational components backed by static data when content is ready.

## Deployment

The project is compatible with static Vite hosting. The portfolio has previously been deployed on Vercel, while the final repository/domain deployment flow remains undecided.

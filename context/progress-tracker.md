# Progress Tracker

## Current Phase

The live portfolio is intentionally focused on the opening ink reveal, the `ThirdScreen` scroll-scrub sequence, and its dark-passage handoff into the monk clearing. Hero/About code exists but is disabled in `App.jsx`; the remaining portfolio content sections are not yet implemented.

## Completed

- React/Vite shell with GSAP, ScrollTrigger, Lenis, and reduced-motion detection
- Full-viewport `ThirdScreen.mp4` section
- Queued, pinned scroll-to-video seeking with forward/reverse synchronization
- Three-phase horizontal dark passage into the image-only `Monk-Peace.png` landing state
- Independent monk image decode and safe final-frame fallback on image failure
- Idempotent first-frame readiness event from `loadeddata`
- Pre-React warm-paper loader mounted in `index.html`
- Deterministic 24-frame ink source and inverse reveal sprite generator
- Artwork-reveal mask that avoids black and navy transitional flashes
- Loader interaction/scroll lock and accessibility restoration
- Automatic playback on every reload with no persistent storage
- Reduced-motion bypass and 12-second failure safety
- Current pacing: 3.6-second growth, 400 ms hold, 560 ms fade

## Completed Verification

- Production Vite build and `git diff --check`
- Deterministic sprite regeneration
- Monotonic source and inverse mask progression
- Fully opaque black source final frame and fully transparent inverse final frame
- Consecutive desktop reloads
- Responsive checks at 390×844, 768×1024, 1280×720, and 1440×900 during loader development
- Root remains inert while loading and is unlocked after exit
- Video is visible and paused at time zero during handoff
- Scroll seeking advances the paused video after reveal
- Passage close, full-black hold, clearing reveal, endpoint, and reverse traversal
- Responsive ScrollTrigger refresh while positioned inside all three passage phases
- Desktop and 390×844 mobile monk endpoint with zero horizontal overflow
- No browser console warnings or errors in the completed checks

## Next Milestones

1. Decide whether and when to re-enable the existing Hero/About sequence.
2. Add selected work and project data.
3. Add process, notes, contact, and footer sections.
4. Finalize biography, project descriptions, social links, and contact copy.
5. Run physical-device performance, crop, reduced-motion, and failure-path QA.
6. Confirm the final production host, domain, and repository deployment flow.

## Risks and Open Items

- A roughly 4.6-second intro is deliberately cinematic but should be evaluated against bounce and repeat-visit friction.
- `ThirdScreen.mp4` is about 10 MB; performance on slower mobile networks still needs physical-device validation.
- The 12-second fallback has been exercised indirectly during cold local loading, but deliberate missing-asset production testing remains useful.
- The monk landing state is intentionally image-only and still needs portfolio content layered or added afterward.
- Final portfolio content is still missing.
- The worktree contains unrelated modified and untracked assets/build output that must be preserved.

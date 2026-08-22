# UI Context

The interface should feel calm, crafted, and editorial. Japanese watercolor-inspired art supports the content; it should never compete with readability or interaction.

## Visual System

- Warm paper/cream base, including loader paper `#eadcb9`
- Navy `#102f49`, deep navy `#081a2b`, orange `#d9783d`, slate `#537d83`, and deep blue `#174665`
- Editorial serif headlines paired with a restrained sans-serif body face
- Subtle grain and watercolor textures
- Edge-to-edge motion sections without card borders or rounded wrappers
- Centered `object-fit: cover` video cropping at current breakpoints

## Current Opening Experience

- The initial viewport is fully covered by warm paper before React loads
- No button, skip control, local storage, or session storage is used
- Once the sprite and `ThirdScreen` frame zero are ready, an organic 24-frame boundary reveals the real artwork from the center
- The effect uses an inverse alpha mask; black pixels must never be rendered to the visitor
- Timing: 3.6-second growth, 400 ms hold, 560 ms fade
- The mask element is a centered 160vmax square with a 2400% horizontal sprite
- The final frame is transparent, so the fade hands off to an identical live video frame
- On reduced motion, frame cycling is skipped and the final reveal state is used

## Current Live Content

Only `ThirdScreen` is mounted. It fills the viewport, remains paused, and first scrubs its video with scroll. Its final frame then enters a horizontal dark passage: the forest closes into black, black holds from 30–45% of the outro, and the same curtain continues left to uncover the stationary monk clearing. Hero/About styles and components remain in the codebase for possible restoration but should not be documented as currently visible.

## Accessibility

- Maintain semantic section labels and logical headings as the content structure grows
- Keep keyboard focus clearly visible
- Keep `#root` inert and `aria-hidden` only while the loader is active, then restore both
- Keep scrolling locked during the loader and restore it before ScrollTrigger refresh
- Honor `prefers-reduced-motion`
- Under reduced motion, show the video and monk artwork as two normal full-height panels with no pin or curtain
- Avoid hover-only interactions and horizontal overflow
- Ensure content remains understandable if animation, sprite loading, video loading, or monk image loading fails

## Responsive Guidance

- Preserve the sprite’s square frame ratio and centered crop
- Use `svh`/`dvh` deliberately for full-screen sections
- Verify 390px mobile width, tablet portrait, and landscape desktop
- Check the close, blackout hold, reveal, and final monk crop whenever passage timing or media positioning changes
- Reduce decorative density before reducing core content
- Recheck artwork focal points whenever the live video or `object-position` changes

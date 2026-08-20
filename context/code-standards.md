# Code Standards

The codebase should stay consistent with a small React/Vite portfolio and should prefer clarity over abstraction.

## Formatting

Source of truth: the repo's formatter and linter once they are added.

Until tooling is added, keep code:

- Consistent with standard React and Vite conventions
- ASCII-first unless a file already uses other characters
- Lightweight in structure, with no unnecessary abstraction layers
- Explicit around motion timing when a section depends on `loadedmetadata`, `loadeddata`, `seeked`, or `ScrollTrigger` progress

## Naming

Use descriptive names that match the portfolio structure:

- Component files in `PascalCase`
- Utility and data files in `camelCase` or lowercase feature names
- Section and animation modules named after what they own, such as `heroAnimations` or `projects`
- Asset names that describe the visual layer, such as `mountains-front` or `tree`

## Motion Code

When adding or editing scroll-driven media, prefer direct, readable mappings from scroll progress to `video.currentTime`. Pause media while scrubbing, clamp the seek range, and hide the element until a decoded frame is ready so the user never sees a blank handoff.

## Testing

Minimum expectation is:

- A successful production build
- A quick manual pass for desktop, tablet, and mobile layout behavior
- A reduced-motion check for the animated sections
- A forward and reverse scrub pass for any pinned media sequence, including handoff points between sections
- No visible horizontal overflow or obvious accessibility regressions

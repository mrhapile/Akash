# Code Standards

Keep the codebase direct, readable, and lightweight. There is currently no configured formatter, linter, or automated test runner, so follow the existing React/Vite style and verify with the production build.

## General Style

- Use standard React function components and hooks
- Keep component files in `PascalCase`; hooks and utilities use camelCase
- Prefer focused constants for motion timings and thresholds
- Keep static assets under `public/` and reference them through `import.meta.env.BASE_URL` in modules or `%BASE_URL%` in `index.html`
- Avoid abstractions that hide animation lifecycle or media readiness
- Preserve unrelated worktree changes

## Loader Code

The loader intentionally lives inline in `index.html`. Keep its critical CSS and controller dependency-free so the initial paper state does not wait for React or external styles.

- Never add local-storage or session-storage suppression
- Do not attach the inverse mask until both the sprite and video frame zero are ready
- Keep the controller idempotent and retain a finite safety timeout
- Always restore scrolling, `inert`, and `aria-hidden` before removing the overlay
- If timing changes, adjust animation, hold, fade/removal buffer, and safety timeout coherently
- Preserve the `portfolio:first-frame-ready` and `portfolio:loader-complete` event contract

## Sprite Generation

Use `scripts/generate_ink_splash.py` to modify loader artwork. The generator must remain deterministic, output 24 horizontal 512×512 frames, keep coverage monotonic, and finish with:

- a fully opaque final frame in `ink-splash-sprite.png`
- a fully transparent final frame in `ink-splash-reveal-sprite.png`

Do not hand-edit generated sprites.

## Scroll-Driven Video

- Pause media while scrubbing
- Clamp seeks to a safe final-frame offset
- Wait for metadata before constructing ScrollTrigger
- Wait for decoded data before revealing or dispatching readiness
- Queue the newest requested time instead of issuing overlapping seeks
- Refresh ScrollTrigger after layout-affecting loader removal
- Keep reduced-motion media paused at frame zero

## Minimum Verification

- `vite build` succeeds
- `git diff --check` succeeds
- No console errors or missing assets
- Loader runs on consecutive reloads and reveals artwork rather than a black/navy fallback
- Responsive desktop/mobile coverage is centered
- ThirdScreen remains paused at zero after reveal and scrubs correctly afterward

# AI Workflow Rules

Edit this repository with a bias toward small, reversible changes and evidence from the current implementation.

## Source of Truth

- Runtime truth: `index.html`, `src/App.jsx`, mounted components, and referenced assets
- Product and handoff truth: files under `context/`
- Visual references: files under `reference/`
- Do not infer that an existing component is live; confirm that it is mounted from `App.jsx`

## Ask First

Ask before making changes that materially alter the portfolio direction or create rework, including:

- Restoring, removing, or reordering Hero, About, ThirdScreen, or planned content sections
- Changing project, biography, social, or contact content
- Replacing the watercolor/editorial direction
- Adding a new animation system, third-party runtime, CMS, backend, or deployment target

User-requested timing and presentation changes to the existing loader or scroll sequence are already within scope.

## Preserve

- `ThirdScreen` is the only live visual section at present; `Hero` is commented out
- The intro plays on every full navigation or reload and uses no persistent storage
- The warm-paper layer stays solid until the real video can display frame zero
- The inverse sprite reveals the underlying artwork; it must never render a black splash
- The loader blocks scrolling and root interaction, restores both on exit, and cannot trap the visitor
- `ThirdScreen` stays paused while ScrollTrigger maps progress to queued seeks
- Reduced-motion visitors bypass frame cycling and receive a safe direct handoff

## Verification

Treat a change as complete only after the relevant checks pass:

- Run a production Vite build and `git diff --check`
- Reload more than once; confirm the intro restarts without local/session storage
- Confirm paper appears before React, artwork is revealed inside the ink boundary, and no navy or black flash appears
- Confirm the loader waits for `portfolio:first-frame-ready`, exits, unlocks the root, and refreshes ScrollTrigger
- Check desktop and narrow mobile crops
- Confirm the video is paused at frame zero after the handoff and advances smoothly in both scroll directions
- Exercise or inspect sprite/video failure and the 12-second safety timeout when loader behavior changes
- Check reduced motion and browser console output

## Worktree Safety

The worktree contains modified and untracked media/build artifacts. Preserve unrelated files and do not clean, overwrite, or revert them as part of routine implementation or documentation work.

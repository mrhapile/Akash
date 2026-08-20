# AI Workflow Rules

This repository should be edited with a bias toward small, reversible changes and clear verification. The PRD is the source of truth for product intent until the implementation tells us otherwise.

## Ask First

Ask before making changes that would alter the portfolio’s direction or risk rework, especially:

- Visual redesigns that change the editorial/watercolor direction
- Motion changes that increase intensity, add new animation systems, affect reduced-motion behavior, or change the Hero/About/ThirdScreen scroll handoff
- Content changes to projects, bio copy, or contact details
- Structural changes that remove or rename core sections from the PRD

## Verify

Treat work as complete only after:

- The app builds successfully
- The layout behaves well on desktop, tablet, and mobile
- Keyboard focus is visible and reduced-motion behavior still works
- Decorative motion does not obscure text or content
- Scroll-scrubbed media loads metadata cleanly, reveals only after a decoded frame is ready, and scrubs smoothly in both directions without blank frames

## Handoff

Preserve the following so the next person can move quickly:

- The current section structure and any section order decisions
- Asset placement and naming for hero artwork and the third-screen video
- Motion assumptions, especially anything tied to scroll or reduced-motion behavior
- Any content source files that drive selected work, about copy, or contact links

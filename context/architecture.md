# Architecture Context

This site is a section-based React portfolio with static content, decorative media, and motion helpers. Keep the architecture simple and readable so the art direction stays the focus.

## Components

The main pieces are:

- `Navbar` for primary navigation to Work, About, Notes, and Contact
- `Hero` for the editorial headline, call to action, layered landscape composition, and the first scroll-driven handoff
- `About` for introduction and capabilities, implemented as the parchment-like pinned sequence inside Hero
- `ThirdScreen` for the dedicated full-viewport video scrub that follows the About completion state
- `Work` and `ProjectCard` for featured projects
- `Process` for the scroll-drawn workflow graphic
- `Notes` for optional writing or thoughts
- `Footer` for contact and social links
- Animation helpers for hero reveal, parchment scrubbing, third-screen video scrubbing, parallax, and scroll-triggered effects
- Static project data in a dedicated data module

## Data Flow

Content should flow from static data modules and local assets into presentational components. Animation code should enhance rendered sections after mount or on scroll, without becoming the source of truth for content.

Hero artwork should be layered from the `public/hero/` asset set, with text always remaining readable above the visual composition. The About parchment and third-screen video both depend on metadata-loaded media that is scrubbed by ScrollTrigger rather than autoplay.

## Deployment

The deployment target has not been chosen yet. Assume a static Vite-friendly host for production unless a specific platform is added later.

## Boundaries

Avoid casual changes to:

- The hero composition order and text readability rules
- Reduced-motion behavior and keyboard accessibility
- Responsive behavior that prevents horizontal overflow
- Motion intensity, especially anything that would make the portfolio feel busy instead of crafted
- The asset naming scheme for hero layers, parchment media, and decorative art

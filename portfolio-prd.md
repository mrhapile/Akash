# Product Requirements Document --- Motion-Led Developer Portfolio

**Version:** 1.0\
**Type:** Personal Developer / Designer Portfolio\
**Stack:** React + Vite + GSAP + ScrollTrigger + Lenis

## 1. Product Overview

A responsive personal portfolio combining editorial typography, Japanese
watercolor landscape artwork, and restrained scroll animation. The site
should showcase projects, technical ability, design thinking, and
personality while remaining fast and accessible.

## 2. Goals

-   Build a distinctive and memorable developer portfolio.
-   Showcase selected development/design projects clearly.
-   Demonstrate front-end animation skills through purposeful motion.
-   Work smoothly across desktop, tablet, and mobile.
-   Maintain strong performance and accessibility.
-   Give recruiters, collaborators, and clients a clear contact path.

## 3. Target Audience

-   Recruiters and hiring teams
-   Internship employers
-   Developers and designers
-   Creative-technology collaborators
-   Potential freelance clients

## 4. Visual Direction

**Style:** Calm, crafted, editorial, Japanese watercolor-inspired.

### Palette

  Token        Suggested Value   Usage
  ------------ ----------------- -------------------------------
  Cream        `#F3ECDC`         Main background
  Navy         `#102F49`         Headings, footer, ink details
  Orange       `#D9783D`         Sun, underlines, CTA accents
  Slate Blue   `#537D83`         Secondary accents
  Deep Blue    `#174665`         Mountains / dark sections

Use subtle paper grain and watercolor texture without hurting
readability.

## 5. Page Structure

1.  **Navbar** --- Work, About, Notes, Contact
2.  **Hero** --- role label, headline, supporting copy, CTA, layered
    landscape
3.  **Selected Work** --- featured projects
4.  **About** --- introduction and capabilities
5.  **Process** --- visual workflow
6.  **Notes** --- optional thoughts/writing
7.  **Contact / Footer** --- CTA, email, social links

## 6. Hero

The hero is the signature section.

-   Large two-line editorial headline
-   Small uppercase orange role label
-   Animated hand-drawn underline
-   Short supporting paragraph
-   "View selected work" CTA
-   Layered watercolor landscape across the lower/right area
-   Approximately `100vh` on desktop
-   Artwork must never reduce text readability

### Hero Assets

``` text
public/
└── hero/
    ├── mountains-back.webp
    ├── mountains-middle.webp
    ├── mountains-front.webp
    ├── tree.svg
    └── sun.svg
```

  -----------------------------------------------------------------------
  Asset                               Description
  ----------------------------------- -----------------------------------
  `mountains-back.webp`               Pale misty blue-gray distant
                                      mountains, transparent, 16:6

  `mountains-middle.webp`             Slate blue/indigo medium-detail
                                      mountains, transparent, 16:6

  `mountains-front.webp`              Deep navy foreground with subtle
                                      orange contour lines, transparent,
                                      16:6

  `tree.svg`                          Sparse dark-navy Japanese ink-style
                                      tree

  `sun.svg`                           Burnt-orange imperfect circular sun
  -----------------------------------------------------------------------

### Layer Order

``` text
sun
↓
mountains-back
↓
mountains-middle
↓
tree
↓
mountains-front
↓
hero text
```

## 7. Motion & Interaction

### Hero Reveal

Headline lines rise into view with a short stagger. Supporting text and
CTA follow.

### Underline

Orange underline draws/scales from left to right.

### Mountain Parallax

Use GSAP ScrollTrigger:

-   Back mountains → slow movement
-   Middle mountains → medium movement
-   Foreground mountains → strongest movement
-   Sun/tree → subtle independent movement

### Project Cards

-   Fade/lift into view
-   Small image scale on hover
-   Avoid excessive movement

### About

Text lines reveal progressively when entering the viewport.

### Process

An SVG path draws as the user scrolls through the section.

### Smooth Scroll

Use Lenis while preserving native accessibility behavior.

## 8. Technical Requirements

-   React
-   Vite
-   GSAP
-   ScrollTrigger
-   Lenis
-   CSS or Tailwind CSS
-   SVG for scalable decorative graphics
-   WebP/AVIF for raster images
-   Semantic HTML
-   Keyboard-visible focus states
-   `prefers-reduced-motion` support
-   Lazy-load below-the-fold images

Three.js is **not required** for the MVP.

## 9. Component Structure

``` text
src/
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── Work.jsx
│   ├── ProjectCard.jsx
│   ├── About.jsx
│   ├── Process.jsx
│   ├── Notes.jsx
│   └── Footer.jsx
│
├── animations/
│   ├── heroAnimations.js
│   ├── scrollAnimations.js
│   └── parallax.js
│
├── data/
│   └── projects.js
│
├── styles/
├── App.jsx
└── main.jsx
```

## 10. Responsive Behavior

### Desktop

Full landscape composition and strongest parallax.

### Tablet

Reduce headline size and parallax distance while preserving composition.

### Mobile

-   Prioritize text
-   Reposition/simplify mountain artwork
-   Reduce decorative elements
-   Reduce animation intensity
-   No hover-dependent functionality
-   No horizontal overflow

## 11. Performance

-   Target Lighthouse Performance score of **90+**
-   Reserve dimensions for hero artwork to avoid layout shift
-   Compress all mountain/project images
-   Prefer `transform` and `opacity` animations
-   Avoid oversized source assets
-   Maintain smooth scrolling on modern mobile and desktop devices

## 12. Project Content

Each featured project should contain:

-   Project title
-   Preview image
-   Short description
-   Role
-   Technology stack
-   Key outcome
-   Live/demo link where available
-   GitHub link where appropriate
-   Case-study/project-detail link

Target **3--6 polished projects**.

## 13. MVP Acceptance Criteria

-   All primary sections implemented
-   Hero matches cream/navy/orange watercolor direction
-   Five hero assets positioned correctly
-   Hero entrance animation works
-   Mountain parallax works smoothly
-   At least three real projects displayed
-   Responsive across desktop/tablet/mobile
-   Reduced-motion mode supported
-   Functional project/contact links
-   Production build deploys successfully

## 14. Build Order

1.  Set up React + Vite.
2.  Build static layout and typography.
3.  Add/generate hero assets.
4.  Position landscape layers.
5.  Build Selected Work.
6.  Build About, Process, Notes, and Footer.
7.  Add hero entrance animation.
8.  Add ScrollTrigger parallax.
9.  Add section reveals and micro-interactions.
10. Optimize mobile responsiveness.
11. Add accessibility/reduced-motion support.
12. Compress assets and optimize performance.
13. Deploy.

## 15. Out of Scope for MVP

-   Three.js/WebGL scenes
-   CMS
-   Authentication
-   Complex backend services
-   Heavy custom cursor effects
-   Excessive animation
-   Exact duplication of another designer's portfolio

The final portfolio should preserve the reference's **art direction and
motion philosophy** while using original artwork, project content,
typography decisions, and interactions.

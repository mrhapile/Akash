# UI Context

The UI should feel calm, crafted, and editorial, with Japanese watercolor-inspired landscape art supporting the content instead of competing with it.

## UI Stack

React + Vite.

## Design System

Visual direction:

- Cream background with navy, orange, slate blue, and deep blue accents
- Large editorial typography for headlines
- Subtle paper grain or watercolor texture
- Layered landscape artwork with restrained motion
- Clean section spacing and clear visual hierarchy

Use the PRD palette as the starting point:

- Cream `#F3ECDC`
- Navy `#102F49`
- Orange `#D9783D`
- Slate Blue `#537D83`
- Deep Blue `#174665`

## Accessibility

Minimum requirements:

- Semantic HTML and logical heading structure
- Keyboard-visible focus states
- `prefers-reduced-motion` support
- No hover-only interactions on mobile
- Sufficient contrast for text over artwork and backgrounds

## UI Notes

- The hero is the signature section and must keep text readable over any decorative art
- Mobile should reduce decorative density and motion intensity rather than hiding core content
- Avoid horizontal overflow at all breakpoints
- Below-the-fold images should be lazy-loaded

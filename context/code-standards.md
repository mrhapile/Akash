# Code Standards

The codebase should stay consistent with a small React/Vite portfolio and should prefer clarity over abstraction.

## Formatting

Source of truth: the repo's formatter and linter once they are added.

Until tooling is added, keep code:

- Consistent with standard React and Vite conventions
- ASCII-first unless a file already uses other characters
- Lightweight in structure, with no unnecessary abstraction layers

## Naming

Use descriptive names that match the portfolio structure:

- Component files in `PascalCase`
- Utility and data files in `camelCase` or lowercase feature names
- Section and animation modules named after what they own, such as `heroAnimations` or `projects`
- Asset names that describe the visual layer, such as `mountains-front` or `tree`

## Testing

Minimum expectation is:

- A successful production build
- A quick manual pass for desktop, tablet, and mobile layout behavior
- A reduced-motion check for the animated sections
- No visible horizontal overflow or obvious accessibility regressions

# Sync

Keep the local workspace and any mirrored outputs aligned.

## Use when

- Keep the workspace and any mirrors in step.

## Do

- Check for drift before copying files around.
- Update the source of truth first, then regenerate outputs.
- Call out anything that cannot be synchronized safely.

## Avoid

- Copying files blindly without checking for divergence.
- Overwriting custom changes without warning.

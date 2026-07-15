# Block Plugin QA

## Registration

Check:

- block.json files are valid
- block names use correct namespace
- editorScript, viewScript, style and editorStyle are enqueued correctly
- render callbacks work for dynamic blocks
- translations are prepared where relevant

## Editor controls

Check:

- controls are understandable
- defaults are sensible
- responsive settings work
- invalid states are prevented or handled
- inspector controls do not expose unnecessary complexity

## Frontend output

Check:

- markup is semantic
- classes are stable
- styles match design system
- dynamic data escapes output properly
- empty states and fallback states are handled

## Accessibility

Check:

- labels
- headings
- keyboard operation
- focus states
- ARIA only where needed
- no inaccessible custom controls

## Compatibility

Check:

- block works in patterns
- block works in template parts
- block works with light/dark mode
- block works on mobile
- block deprecations are handled if replacing older markup

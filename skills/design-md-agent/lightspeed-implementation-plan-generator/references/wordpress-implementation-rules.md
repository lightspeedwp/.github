# WordPress Implementation Rules

## Defaults

- Prefer block-first implementation.
- Use theme.json for design tokens where appropriate.
- Keep plugin dependencies minimal and justified.
- Separate theme presentation concerns from plugin functionality.
- Use custom block plugins for reusable functionality that should survive theme changes.
- Follow WordPress Coding Standards.
- Escape output and sanitise input.
- Use accessible markup and test keyboard/focus states.
- Avoid hardcoding design values that should be tokens.
- Preserve editor experience and governance.

## Theme repo expectations

Common paths:

```text
/style.css
/theme.json
functions.php
/docs/
/languages/
/patterns/
/templates/
/parts/
/styles/
/inc/
/src/
/build/
```

## Plugin repo expectations

Common paths:

```text
/languages/
/docs/
/inc/
/plugin/
/scf-json/
/templates/
/src/
/src/blocks/
/build/
plugin-name.php
functions.php
```

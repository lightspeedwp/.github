# WordPress Issue Rules

## Defaults

All WordPress implementation issues should consider:

- WordPress Coding Standards
- escaping and sanitisation
- block-first implementation
- theme.json tokens where possible
- minimal plugin dependencies
- accessibility and keyboard support
- frontend and editor parity
- performance impact
- maintainable naming
- translation/i18n where relevant

## Theme repo assumptions

Typical structure:

```text
/wp-content/themes/client-theme/
style.css
theme.json
functions.php
docs/
languages/
patterns/
templates/
parts/
styles/
inc/
src/
build/
```

## Block plugin repo assumptions

Typical structure:

```text
/wp-content/plugins/client-blocks/
languages/
docs/
inc/
plugin/
scf-json/
templates/
src/
src/blocks/
build/
plugin-name.php
functions.php
```

## Required issue notes

For WordPress issues, include likely files/areas affected when known. If unknown, state that repo inspection is required.

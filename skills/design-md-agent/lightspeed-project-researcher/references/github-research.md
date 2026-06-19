# GitHub Research Notes

When GitHub repositories are supplied, review or request:

- repo URL
- branch/release target
- theme or plugin structure
- theme.json
- package.json/composer.json
- build tooling
- src/build output
- block registration
- pattern registration
- templates and parts
- coding standards setup
- tests/CI
- open issues/PRs
- current blockers

## LightSpeed expected structures

Theme:

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

Block plugin:

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

# WordPress Project Memory Rules

For LightSpeed WordPress projects, always track:

## Repos and environments

- live URL
- dev/staging URL
- theme repo
- block plugin repo
- content/source repo if applicable

## Build type

- block theme only
- block theme plus custom block plugin
- hybrid/classic conversion
- WooCommerce block theme
- publishing/content-heavy site
- tour operator/plugin-led site

## Technical standards

- WordPress Coding Standards
- escaping and sanitisation
- block-first implementation
- `theme.json` tokens
- minimal plugin dependencies
- accessibility checks
- performance budgets
- PHPCS/ESLint/Playwright where relevant

## Figma-to-WordPress mapping

Track:

- variables to `theme.json`
- components to blocks
- sections to patterns
- pages to templates
- light/dark mode states
- responsive states
- accessibility states

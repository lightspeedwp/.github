# WordPress Delivery Standards

Apply these LightSpeed defaults unless overridden.

## Coding standards

- Follow WordPress Coding Standards.
- Escape output.
- Sanitize input.
- Validate permissions and nonces where needed.
- Avoid direct database access unless justified.

## Block-first architecture

- Prefer core blocks, block styles and patterns before custom blocks.
- Use custom blocks when behaviour, data binding or editor UX requires it.
- Keep blocks focused and composable.

## theme.json

- Treat theme.json as the primary source for global design settings.
- Map Figma variables to theme.json tokens where possible.
- Avoid hard-coded design values unless justified.

## Dependencies

- Minimise plugin dependencies.
- Justify heavy tools with ROI and maintenance cost.
- Use build tooling consistently.

## Quality gates

- Accessibility checks.
- Performance budget checks.
- PHPCS where applicable.
- ESLint where applicable.
- Playwright or manual browser tests where relevant.

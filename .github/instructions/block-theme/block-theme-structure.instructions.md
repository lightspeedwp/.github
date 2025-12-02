# Instructions: Block Theme Structure

- `templates/*.html` → page templates; `parts/*.html` → reusable sections.
- `patterns/*.php|json` → block patterns with header metadata.
- `styles/*.json` → style variations overriding `theme.json`.
- `assets/` (or `src/`) → SCSS/JS/images (compiled with `@wordpress/scripts`).

**Acceptance**

- Valid block comments in templates/parts.
- Patterns include Title, Slug `lsx/*`, Categories, (optional) Keywords/Viewport.

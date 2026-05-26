# WordPress Rules

Use these rules as the first standard for validation.

## Patterns

- Theme pattern files are commonly placed in `/patterns/*.php`.
- Pattern metadata is supplied through a PHP file header.
- Slugs should be namespaced.
- Pattern body content should be appropriate block markup.

## Template Parts

- Template parts are loaded from `/parts/{slug}.html`.
- Template parts contain block markup only.
- Standard shared slugs should be reused where appropriate.

## Templates

- Block theme templates live in `/templates`.
- `index.html` is the baseline required template for a block theme.
- Template filenames should align with hierarchy expectations.
- Templates may include patterns and template parts using block markup.

## Custom Templates

- Custom templates are registered via `customTemplates` in `theme.json`.
- Every custom template entry should correspond to a file in `/templates`.
- Templates that render entry content generally need `core/post-content`.

## Styles

- Block styles should stay scoped to a specific block or tightly related block family.
- Section styles should stay scoped to reusable layout zones or page bands.
- Prefer theme presets and existing tokens before hardcoded values.
- Custom CSS should stay scoped to the named style or section treatment.

## Conflict Handling

If a project convention conflicts with official WordPress behavior, report the conflict and prefer the official rule.

# WordPress Rules

Use these rules as the primary custom-template standard.

## File Placement

- Custom template files live in `/templates/{name}.html`.

## Registration

- Custom templates are registered via `customTemplates` in `theme.json`.
- A custom template should have a matching template file.
- Use `name`, `title`, and `postTypes` when known.

## Composition

- Custom templates contain block markup only.
- They may include template parts and patterns.
- Templates that render entry content generally need `core/post-content`.

## Boundary

- Standard hierarchy templates should stay with the normal template generator.

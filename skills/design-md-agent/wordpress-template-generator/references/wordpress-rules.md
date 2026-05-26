# WordPress Rules

Use these rules as the primary template standard.

## File Placement

- Block theme templates live in `/templates/{name}.html`.
- `index.html` is the baseline required template for a block theme.

## Hierarchy

- Template filenames should align with the WordPress template hierarchy.
- Prefer standard names such as `index`, `home`, `single`, `page`, `archive`, and `404` when they fit the request.

## Composition

- Templates contain block markup only.
- Templates may include template parts.
- Templates may include patterns.
- Templates that render entry content generally need `core/post-content`.

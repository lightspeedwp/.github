# WordPress Rules

Use these rules when preparing parameters for block theme assets.

## Templates

- Block theme templates live in `/templates`.
- `index.html` is the minimum required template for a block theme.
- Template names should align with WordPress template hierarchy expectations.
- Templates may include template parts and patterns.

## Template Parts

- WordPress loads template parts from `/parts/{slug}.html`.
- Template parts contain block markup only.
- Standard common slugs should be reused where appropriate:
  - `header`
  - `footer`
  - `sidebar`
  - `comments`
- Valid wrapper tags for areas include:
  - `div`
  - `article`
  - `aside`
  - `footer`
  - `header`
  - `main`
  - `section`

## Patterns

- WordPress will auto-register valid pattern files placed in `/patterns`.
- Pattern files use PHP file headers for metadata.
- Pattern slugs should be namespaced.
- Prefer core pattern categories first.
- Use `Inserter: false` for hidden implementation-only patterns.

## Custom Templates

- Register via `customTemplates` in `theme.json`.
- Every entry needs a matching `/templates/{name}.html` file.
- `postTypes` is optional in WordPress but should be made explicit when known.

## Validation Reminder

If a proposed parameter set conflicts with official WordPress behavior, prefer the official rule and note the conflict.

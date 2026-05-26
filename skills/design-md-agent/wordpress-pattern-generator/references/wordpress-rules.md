# WordPress Rules

Use these rules as the primary pattern standard.

## File Placement

- Theme pattern files are commonly placed in `/patterns/*.php`.
- WordPress can auto-register theme pattern files from that directory.

## Metadata

- Pattern metadata is supplied through a PHP header.
- Supported keys include:
  - `Title`
  - `Slug`
  - `Categories`
  - `Description`
  - `Viewport Width`
  - `Inserter`
  - `Keywords`
  - `Block Types`
  - `Post Types`
  - `Template Types`

## Naming

- Slugs should be namespaced with the theme slug.
- Prefer readable, stable filenames and titles.

## Usage

- Use `Inserter: false` for hidden implementation-only patterns.
- Prefer core pattern categories first.
- Patterns can be used directly in the editor or inserted into templates.

# INLINE-I18N.md

LightSpeedWP **localisation** standards: `.pot`, `.po`, `.mo` and translator comments.

## Principles
- **Always wrap user-facing strings** in i18n calls:
  - PHP: `__( 'Text', 'text-domain' )`, `esc_html__()`, `_x()`, `esc_attr_x()`
  - JS: `wp.i18n.__('Text', 'text-domain')`
- Add **translator comments** for placeholders/ambiguity:
  ```php
  /* translators: 1: tour name, 2: city */
  printf( esc_html__( '%1$s in %2$s', 'text-domain' ), $name, $city );
  ```
- Use a **consistent text domain** equal to the plugin/theme slug.

## Files
- **.pot**: template generated from source.
- **.po**: per-locale translations (editable text).
- **.mo**: compiled binary from `.po`.

## Commands
- Generate POT (WP-CLI): `wp i18n make-pot . languages/your-slug.pot`
- Compile MO (gettext): `msgfmt languages/xx_YY.po -o languages/xx_YY.mo`

## JS specifics
- Use `// translators:` before the string. Example:
  ```js
  // translators: %s is the tour title
  const label = sprintf( __( '%s details', 'text-domain' ), title );
  ```

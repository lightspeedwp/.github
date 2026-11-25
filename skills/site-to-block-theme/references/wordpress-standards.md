# Current WordPress coding standards

Check these against the WordPress version the theme targets. Where this list and the current documentation differ, the documentation wins: update this file.

## Find the target version

- `theme.json`: `version` and the `$schema` URL (for example `https://schemas.wp.org/wp/<version>/theme.json`).
- `style.css`: `Requires at least`, `Tested up to` and `Requires PHP`.
- The local site: `wp core version` and `php -v`.
- The project's `AGENTS.md` or README, which may pin a version.

Then read what changed: the Core dev notes and field guide for each release since the theme was last updated (make.wordpress.org/core), and the `theme.json` reference for that version. Use Context7 or developer.wordpress.org for API syntax rather than recalled knowledge.

## Where the rules come from

| Area                                   | Source                                                                     | Check with                                               |
| -------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------- |
| PHP                                    | WordPress Coding Standards (WPCS), PHPCompatibilityWP for the minimum PHP  | The theme's `composer` PHPCS script and `phpcs.xml.dist` |
| JavaScript                             | WordPress JavaScript Coding Standards (`@wordpress/eslint-plugin`)         | `npm run lint:js` (`wp-scripts lint-js`)                 |
| CSS and SCSS                           | WordPress CSS Coding Standards (`@wordpress/stylelint-config`)             | `npm run lint:css` (`wp-scripts lint-style`)             |
| `theme.json`, block and section styles | The `theme.json` schema for the target version                             | The theme's JSON lint or schema validation               |
| Accessibility                          | WordPress Accessibility Coding Standards, WCAG 2.2 AA                      | axe, keyboard pass, contrast check                       |
| Patterns and themes                    | Theme Handbook, Block Editor Handbook, `wp-patterns` and `wp-block-themes` | Editor check: no invalid blocks                          |

Run the theme's own scripts; their names vary. Leave every check passing, or report what fails and why.

## Block themes

- Use the current `theme.json` version and schema. Reference presets by slug (`var:preset|spacing|30`, `var:preset|font-size|500`), never raw values.
- Put block-level design in `theme.json` and in block style variations and section styles under `styles/`. Use the theme stylesheet only for what JSON cannot express.
- Templates and parts are block markup HTML files. Templates hold structure; repeated sections are patterns or parts.
- Fonts: declare them with `fontFace` in `theme.json` and ship the files (woff2) in the theme. No remote font CSS.
- Keep `settings.appearanceTools` and per-block settings deliberate: expose what editors need, lock what they shouldn't change.

## Patterns

- One pattern per file in `patterns/`, with the header fields the current Theme Handbook lists: Title, Slug (namespaced with the theme slug), Description, Categories, Keywords, Viewport Width, Block Types, Post Types, Template Types and Inserter as needed.
- Translate every visible string with the theme's text domain (`esc_html__()`, `esc_html_e()`, `esc_attr__()`), and escape at output (`esc_url()`, `esc_attr()`, `wp_kses_post()`). Image URLs come from `get_theme_file_uri()`, never a hardcoded domain.
- Block markup must be valid: comment delimiters, attributes and the saved HTML must agree. Open the pattern in the editor and confirm no block reports unexpected or invalid content.
- Pattern PHP runs when patterns register, not on each request. Put per-request data in blocks, block bindings or Query Loop, not in pattern PHP (see `wp-pattern-runtime-pitfalls`).
- No direct database queries, `query_posts()` or business logic in patterns or templates.

## Front-end behaviour

- Prefer core blocks and their settings. Add behaviour with the Interactivity API (`viewScriptModule`, `data-wp-*` directives) through `wp-interactivity-api`, not jQuery or inline scripts.
- Respect `prefers-reduced-motion` and keep everything keyboard operable with a visible focus.

## PHP in the theme

- `functions.php` and `inc/` only for theme concerns: enqueues, supports, pattern categories and block style registration. Prefix or namespace everything.
- Enqueue assets with versions from the build (`*.asset.php`), and only where needed.
- Post types, taxonomies, fields, cron, REST routes and integrations belong in a plugin.

## Accessibility and performance

- One `h1` per page, headings in order, landmarks (`header`, `nav`, `main`, `footer`) from the template and part `tagName`s.
- Text contrast at least 4.5:1 (3:1 for large text and UI). Check the semantic tokens you used, not just the palette.
- Images: meaningful alt text from live, or empty alt for decoration; width and height set; lazy loading left to core except for the first visible image.
- Follow `wp-performance` for image sizes, font loading and script loading.

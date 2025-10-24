# 5. CSS Coding Standards

## Philosophy

- Content first; mobile-first; performance-minded.
- Keep selectors readable and maintainable; avoid extreme specificity.

## Syntax & Formatting

- One selector per line; one declaration per line.
- One space before `{` and after `:`.
- Lowercase hex; end every declaration with `;`.
- Quote attribute values: `input[type="checkbox"]`.

## Indentation & Whitespace

- **Tabs for indentation**; no trailing spaces.
- Blank line between rulesets for readability.

## Selectors & Naming

- Lowercase, hyphenated; BEM-ish patterns welcomed (`.block__elem--mod`).
- Avoid IDs for styling; keep specificity low.

## Values & Units

- Omit units for zero; prefer `rem`/`em` for type/spacing; avoid magic numbers.

## Media Queries

- Mobile-first, `min-width` queries.
- Place queries next to the component they modify (co-locate).

## Performance

- Minimise network requests and overly complex selectors.
- Prefer modern layout (flex/grid) over heavy floats/clears.

## References

- WP CSS: <https://developer.wordpress.org/coding-standards/wordpress-coding-standards/css/>
- WPCS CSS: <https://github.com/WordPress/wpcs-docs/blob/master/wordpress-coding-standards/css.md>
- idiomatic-css: <https://github.com/necolas/idiomatic-css>
- 10up CSS EBP: <https://10up.github.io/Engineering-Best-Practices/css/>

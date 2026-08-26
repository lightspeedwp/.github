# WordPress Rules

Use these rules as the primary template-part standard.

## File Placement

- Template parts are stored in `/parts/{slug}.html`.
- Template parts contain block markup only.

## Common Slugs

Prefer stable shared slugs where appropriate:

- `header`
- `footer`
- `sidebar`
- `comments`

## Insertion Markup

Use template-part insertion markup such as:

```html
<!-- wp:template-part {"slug":"header","tagName":"header"} /-->
```

## Structure

- Use semantic wrapper tags that fit the part role.
- Keep template parts reusable and scoped.
- Template parts may call patterns when that is the approved project workflow.

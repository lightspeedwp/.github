# Patterns

---

## Best practices

---

## When to use

- Use classic (unsynced) patterns for reusable arrangements you want to start-from, where later edits to one instance should not affect others.
- Use Synced Patterns when changes should propagate to every instance across the site.
- Prefer template parts for structural theme chrome (headers, footers, sidebars) that belong in templates and should be edited in one place.
- Use pattern categories and clear titles to improve discovery in the Inserter.

---

## Limitations

- Classic (unsynced) patterns do not propagate changes: once inserted, they become normal blocks. Use Synced Patterns if propagation is required.
- Updating an existing pattern does not retroactively update previously inserted instances (unless they were inserted as Synced).
- Large/complex patterns can be harder to discover without good categories and naming; keep them focused.
- Refactoring a pattern later usually requires manual content migrations for already-inserted instances.
- Patterns are static: changes to source don't auto-update inserted content
- Not dynamic; once a pattern is inserted, edits in source don’t propagate.

---

## Reference Links

- WordPress Theme Handbook: Block Patterns — <https://developer.wordpress.org/themes/features/block-patterns/>
- [register_block_pattern()](https://developer.wordpress.org/reference/functions/register_block_pattern/)
- [register_block_pattern_category()](https://developer.wordpress.org/reference/functions/register_block_pattern_category/)
- [User docs: Patterns and Synced Patterns](https://wordpress.org/documentation/article/patterns/)
- [Rich Tabor: Patterns](https://rich.blog/patterns/)

---

---
description: "Audit JS files for JSDoc coverage per WordPress guidance; add/fix inline docs."
mode: "edit"
model: "GPT-4"
---
Apply the **WordPress JSDoc** standards to the selected JavaScript files. Identify functions, classes and modules lacking documentation or containing incorrect tags. For each exported symbol:

1. Insert a JSDoc block with a concise summary.
2. Add `@param` entries for each argument (type and description).
3. Add a single `@returns` entry describing the return value and type.
4. Provide examples when the usage is non‑trivial.

Reference: <https://developer.wordpress.org/coding-standards/inline-documentation-standards/javascript/>

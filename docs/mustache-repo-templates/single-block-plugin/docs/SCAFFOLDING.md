---
title: "{{projectName}} Scaffolding & Templating Guide"
version: "{{version}}"
last_updated: "{{lastUpdated}}"
author: "{{author}}"
description: "Explains how to scaffold new plugins/blocks using mustache templates. Step-by-step process, tips, and references."
type: "guide"
---

# Scaffolding and Templating Guide

This guide explains how to scaffold a new block plugin or block using the LightSpeed mustache template system.

---

## Why Mustache Templates?

We use [mustache-style placeholders](https://github.com/WordPress/block-development-examples/wiki/Conventions-for-examples#mustache-templates) (e.g., `{{slug}}`) to:

- Automate plugin setup
- Ensure consistency for all project metadata
- Align with [WordPress block development examples](https://github.com/WordPress/block-development-examples/)

---

## Step-by-Step: Scaffolding a New Plugin or Block

1. **Copy Template Files:**  
   From `/templates/` or `/docs/single-block-plugin/`, copy all `.mustache` files for code, config, and docs.

2. **Replace Placeholders:**  
   Use your script or favorite tool to replace all `{{placeholder}}` values (see [PLACEHOLDERS.md](./PLACEHOLDERS.md)).

3. **Verify Front Matter:**  
   All Markdown/YAML/config files **must** include the correct mustache front matter (see [FRONTMATTER.md](./FRONTMATTER.md)).

4. **Update Placeholder Mapping:**  
   Document all replacements in your plugin's `README.md` and `DEVELOPMENT.md`.

5. **Run Setup:**  
   Install dependencies, run build tools, and verify everything passes lint/tests.

---

## Example: Before and After

**Before (template):**

```js
// src/{{slug}}/index.js
registerBlockType( '{{namespace}}/{{slug}}', { /* ... */ } );
```

**After (scaffolded):**

```js
// src/copyright-block/index.js
registerBlockType( 'lightspeedwp/copyright-block', { /* ... */ } );
```

---

## Contributing New Templates

- Add new `.mustache` files to `/templates/` or `/docs/single-block-plugin/`.
- Update [PLACEHOLDERS.md](./PLACEHOLDERS.md) and [FRONTMATTER.md](./FRONTMATTER.md) with any new variables or fields.
- Ensure all files use WordPress and LightSpeed coding standards.

---

## References

- [WordPress Block Example Conventions](https://github.com/WordPress/block-development-examples/wiki/Conventions-for-examples)
- [Adding New Examples to WP Block Examples](https://github.com/WordPress/block-development-examples/wiki/Adding-new-examples)
- [LightSpeed Coding Standards](https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md)

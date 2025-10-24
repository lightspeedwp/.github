---
title: "Block Development Checklist"
description: "Checklist for developing custom WordPress blocks, including registration, assets, and structure."
last_updated: "2025-10-21"
version: "v0.1.0"
owners:
  - "lightspeedwp/maintainers"
file_type: "guide"
category: "wordpress_guides"
tags: ["wordpress", "block development", "gutenberg", "checklist"]
language: "en"
status: "active"
visibility: "public"
---

# Block Development Checklist

Key steps for creating, registering, and maintaining custom WordPress blocks.

## Example block.json

```json
{
  "name": "my-namespace/my-block",
  "title": "My Block",
  "category": "widgets",
  "attributes": { "content": { "type": "string" } },
  "editorScript": "file:./index.js"
}
```

- Use `@wordpress/scripts` and `block.json`
- Register blocks using `register_block_type_from_metadata()`
- Enqueue editor and frontend assets
- Follow namespace and i18n practices

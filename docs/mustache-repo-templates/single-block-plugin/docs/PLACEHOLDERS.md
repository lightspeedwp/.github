---
title: "{{projectName}} Mustache Placeholder Dictionary"
version: "{{version}}"
last_updated: "{{lastUpdated}}"
author: "{{author}}"
description: "Dictionary of all supported mustache placeholders and their usage."
type: "reference"
---

# Mustache Placeholder Dictionary

This file lists all mustache-style variables used in plugin templates, what they mean, and where to use them.

---

| Placeholder         | Description                                  | Example Value                  | Used In                         |
|---------------------|----------------------------------------------|-------------------------------|---------------------------------|
| `{{slug}}`          | Block/plugin slug (machine-name, kebab-case) | `copyright-block`             | Filenames, block.json, PHP      |
| `{{namespace}}`     | Block namespace (usually org or vendor)      | `lightspeedwp`                | block.json, JS, PHP             |
| `{{author}}`        | Project author/team                          | `LightSpeedWP`                | package.json, composer.json, docs|
| `{{description}}`   | Project or block description                 | ...                           | block.json, docs                |
| `{{license}}`       | License short name                           | `GPL-3.0-or-later`            | package.json, composer.json     |
| `{{textdomain}}`    | Text domain for translations                 | `copyright-block`             | block.json, PHP, docs           |
| `{{version}}`       | Project or block version                     | `0.1.0`                       | block.json, docs                |
| `{{projectName}}`   | Human-readable plugin name                   | `Copyright Date Block`        | README.md, docs                 |
| `{{lastUpdated}}`   | ISO date for last update                     | `2025-10-18`                  | Front matter                    |
| ...                 | Add new placeholders as your templates grow  | ...                           | ...                             |

---

## Adding New Placeholders

- Clearly document new placeholders here.
- Update all relevant templates and README/DEVELOPMENT.md with new mappings.

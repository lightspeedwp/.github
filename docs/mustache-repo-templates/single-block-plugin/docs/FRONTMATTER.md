---
title: "{{projectName}} Front Matter Reference"
version: "{{version}}"
last_updated: "{{lastUpdated}}"
author: "{{author}}"
description: "Defines the required and optional YAML front matter fields for template-based documentation."
type: "reference"
---

# Front Matter Reference

All documentation, instruction, and config template files **must** begin with this YAML front matter block, using mustache placeholders.

---

## Required Fields

| Field         | Description                                 | Example Value           |
|---------------|---------------------------------------------|------------------------|
| `title`       | File/document title                         | `"{{projectName}} Usage Guide"`  |
| `version`     | Project or doc version                      | `"{{version}}"`         |
| `last_updated`| Last updated date (YYYY-MM-DD)              | `"{{lastUpdated}}"`     |
| `author`      | Main author or team                         | `"{{author}}"`          |
| `description` | Short description of file purpose           | `"Usage instructions"`  |
| `type`        | File type (guide, reference, prompt, etc.)  | `"guide"`               |

---

## Optional Fields

Add as needed for automation or documentation:

| Field           | Description                       |
|-----------------|-----------------------------------|
| `blockNamespace`| e.g., `"lightspeedwp"`            |
| `blockName`     | e.g., `"copyright-block"`         |
| `blockCategory` | Block category in the editor      |
| ...             | Extend as needed                  |

---

## Example

```yaml
---
title: "{{projectName}} Usage Guide"
version: "{{version}}"
last_updated: "{{lastUpdated}}"
author: "{{author}}"
description: "End-user instructions for the block plugin."
type: "guide"
---
```

---

**For each new file or template, copy this front matter and update as needed.**
Documentation and Copilot workflows rely on these fields.

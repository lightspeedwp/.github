---
title: "Issue Form Schema"
description: "YAML schema and field definitions for GitHub Issue Forms templates."
last_updated: "2025-10-21"
version: "v0.1.0"
owners:
  - "lightspeedwp/maintainers"
file_type: "documentation"
category: "schemas"
tags: ["schema", "issue", "forms", "yaml", "github"]
language: "en"
status: "active"
visibility: "public"
---

# Issue Form Schema

Defines the YAML structure for GitHub Issue Forms.

## Example

````yaml
---
name: "Bug Report"
description: "Report a bug"
body:
  - type: input
    id: "version"
    attributes:
      label: "WordPress version"
    validations:
      required: true
---

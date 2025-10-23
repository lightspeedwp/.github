---
title: "GitHub Issue Templates (Issue Forms)"
description: "How to create, structure, and use Issue Forms templates with YAML frontmatter in your repository."
last_updated: "2025-10-21"
version: "v0.1.0"
owners:
  - "lightspeedwp/maintainers"
file_type: "documentation"
category: "github_templates"
tags: ["issues", "templates", "forms", "yaml", "github"]
language: "en"
status: "active"
visibility: "public"
---

# GitHub Issue Templates (Issue Forms)

This guide explains how to create and use GitHub Issue Form templates with YAML frontmatter.

## Example Issue Form

````yaml
---
name: "🐛 Bug report"
description: "Report a reproducible bug in the plugin/theme."
title: "[Bug]: "
labels: ["bug","needs-triage"]
assignees: []
projects: []
type: bug
body:
  - type: markdown
    attributes:
      value: |
        ## Thanks for reporting!
        Please provide enough detail to reproduce the issue.
  - type: input
    id: "wp_version"
    attributes:
      label: "WordPress version"
      placeholder: "e.g. 6.6.2"
    validations:
      required: true
  - type: textarea
    id: "steps"
    attributes:
      label: "Steps to Reproduce"
      placeholder: |
        1. Go to '...'
        2. Click '...'
        3. See error
    validations:
      required: true
  - type: checkboxes
    id: "checks"
    attributes:
      label: "Checks"
      options:
        - label: "I searched for duplicate issues"
          required: true
        - label: "I tested with all other plugins disabled"
---
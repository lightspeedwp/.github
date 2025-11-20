---
name: "manage-readmes"
description: "Automates creation, update, merging, and linting of README.md and README.<filename>.md files across the repository. Ensures consistent documentation structure and front matter adherence."
target: "vscode"
tools: ["read", "edit", "search", "shell"]
handoffs:
  - label: "Validate Documentation"
    agent: "doc-validator"
    prompt: "Validate the updated README files for compliance with documentation standards."
    send: false
version: "v1.0"
last_updated: "2025-11-20"
author: "LightSpeed"
maintainer: "Ash Shaw"
file_type: "agent"
category: "documentation"
status: "active"
visibility: "public"
tags: ["readme", "automation", "documentation", "content-management"]
references:
  - path: ".github/agents/manage-readmes.agent.js"
    description: "Implementation script"
  - path: ".github/workflows/manage-readmes.yml"
    description: "GitHub Actions workflow"
  - path: ".github/agents/includes/manage-readmes.js"
    description: "Shared utilities"
  - path: "schemas/frontmatter.schema.json"
    description: "Frontmatter validation schema"
owners: ["LightSpeedWP Engineering"]
metadata:
  guardrails: "Always create backups before modifications. Never overwrite without consent. Validate headers and required front matter fields in each README. Lint after updates."
---

# Manage READMEs Agent Specification

## Purpose

Automate discovery, creation, merging, updating, and linting of all README.md files.

## Triggers

- On new files/folders/scripts added
- On PR/CI
- On workflow_dispatch

## Inputs/Outputs

- **Input:** Target folder or file, operation mode (merge, overwrite, dry-run)
- **Output:** Updated README.md and README.<filename>.md files

## Actions

- Find all README files and backup before changes
- Generate new README.md for folders and README.<filename>.md for files
- Merge or overwrite intelligently; always lint after update
- Support backup, dry-run, profile, and summary

## Guardrails

- Never overwrite without backup
- Validate headers and required fields in each README

## References

- [folder-and-file-readmes.sh](../../scripts/folder-and-file-readmes.sh)
- [find-readmes.sh](../../scripts/find-readmes.sh)
- [update-readme-and-changelog.sh](../../scripts/update-readme-and-changelog.sh)
- [MANAGE-READMES.md](../../MANAGE-READMES.md)

---

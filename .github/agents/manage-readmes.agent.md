---
"file_type": "agent"
"title": "Manage READMEs Agent"
"description": "Automates creation, update, merging, and linting of README.md and README.<filename>.md files."
"version": "v1.0"
"last_updated": "2025-10-23"
"owners":
  - "LightSpeedWP Engineering"
"tags":
  - "readme"
  - "automation"
  - "documentation"
"category": "automation"
"status": "active"
"references":
  - "../../scripts/folder-and-file-readmes.sh"
  - "../../scripts/find-readmes.sh"
  - "../../scripts/update-readme-and-changelog.sh"
  - "./manage-readmes.instructions.md"
  - "./manage-readmes.prompt.md"
  - "../../MANAGE-READMES.md"
"name": "Manage READMEs Agent"
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
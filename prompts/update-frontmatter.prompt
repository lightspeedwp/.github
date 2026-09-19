---
file_type: "prompt"
title: "Update Frontmatter"
description: "Refactor repository front matter to the canonical field set and keep schemas, validators, templates, and docs aligned."
version: "1.0.0"
last_updated: "2026-06-19"
owners: ["LightSpeed Team"]
tags: ["prompts", "frontmatter", "migration", "validation", "automation"]
status: "active"
stability: "stable"
domain: "generic"
---

# Update Frontmatter

## Context

Use this prompt when a front matter standard changes and the repository needs a coordinated migration across templates, validators, docs, and prompt assets.

## Task

Update every affected file so the repository uses one canonical front matter contract:

- Markdown issue templates in `.github/ISSUE_TEMPLATE/*.md` use `name` + `about`
- PR templates use `title` + `description`
- Documentation, instructions, and prompts keep `description` as the summary field

## Constraints

- Preserve existing content and structure unless the front matter contract requires a change.
- Update schema, validation scripts, tests, and docs together.
- Remove duplicated or retired fields instead of leaving both versions in place.
- Keep issue template metadata compatible with GitHub's picker behaviour.

## Acceptance Criteria

- The schema matches the canonical field set.
- Validators reject obsolete field combinations.
- Template files use the correct field names for their file type.
- Related docs and prompt indexes reflect the updated standard.
- The migration is verifiable with automated tests.

## References

- `schema/frontmatter.schema.json`
- `scripts/validation/validate-frontmatter.js`
- `scripts/agents/includes/check-template-labels.js`
- `.github/ISSUE_TEMPLATE/`
- `.github/PULL_REQUEST_TEMPLATE/`
- `docs/FRONTMATTER_SCHEMA.md`
- `docs/ISSUE_CREATION_GUIDE.md`

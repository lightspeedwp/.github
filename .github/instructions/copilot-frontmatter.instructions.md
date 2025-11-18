---
version: "v0.1.0"
last_updated: "2025-10-21"
owners:
  - "lightspeedwp/maintainers"
file_type: "instruction"
category: "copilot"
tags: ["frontmatter", "yaml", "normalization", "template"]
language: "en"
scope: "repository"
status: "active"
visibility: "public"
related_docs:
  - ".github/prompts/add-frontmatter.prompt.md"
description: "Instructions for Copilot or automation agents to add and normalize YAML frontmatter in markdown and template files."
---

# Copilot Frontmatter Normalization Instructions

## Purpose

These instructions standardize YAML frontmatter across markdown and template files, ensuring consistency and enabling automation, documentation, and search capabilities.

## Required Frontmatter Fields

Every markdown or template file **must** include the following fields in its YAML frontmatter:

- **version** (`String`): Semantic versioning for the file, starting at `"v0.1.0"`.
- **last_updated** (`ISO Date`): UTC date when the file was last modified, formatted as `"YYYY-MM-DD"`.
- **owners** (`Array[String]`): GitHub usernames or teams responsible for the file.
- **file_type** (`String`): The type of file, e.g., `"saved_reply"`, `"instruction"`, `"template"`, `"markdown"`.
- **category** (`String`): High-level grouping (e.g., `"bug_report"`, `"code_review"`, `"community_welcome"`, `"copilot"`).
- **description** (`String`): One-sentence summary of the file's purpose.

## Recommended Optional Fields

- **tags** (`Array[String]`): Keywords for search/discovery.
- **language** (`String`): Language code, e.g., `"en"`.
- **scope** (`String`): Intended usage context (e.g., `"issue"`, `"pull_request"`, `"repository"`).
- **status** (`String`): `"active"`, `"deprecated"`, or `"draft"`.
- **visibility** (`String`): `"public"` or `"internal"`.
- **related_docs** (`Array[String]`): References to related documentation or files.

## How to Apply

1. **Inspect** the YAML frontmatter at the top of the file.
2. **Add or normalize** the required fields, setting sensible defaults where appropriate.
3. **Preserve** any existing frontmatter fields and their values.
4. **Do not alter** the body or content of the file.

> **Note:** If a field is missing, add it with a sensible default or placeholder. If a field exists, do not overwrite its value unless it is outdated or incorrect.

## Example Frontmatter

````yaml
---
version: "v0.1.0"
last_updated: "2025-10-21"
owners:
  - "lightspeedwp/maintainers"
file_type: "saved_reply"
category: "code_review"
tags: ["review", "feedback", "standards"]
language: "en"
scope: "pull_request"
status: "active"
visibility: "public"
related_docs:
  - ".github/instructions/coding-standards.md"
description: "Saved replies for code review feedback, improvements, and PR approval in LightSpeed WP projects."
---

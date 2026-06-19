---
description: "Documentation and content creation standards"
applyTo: "**/*.md"
---

# INLINE-MARKDOWN.md

file_type: "instructions"

LightSpeedWP **Markdown** standards for docs and READMEs.

## Principles

- Clear, concise, **task-focused** writing.
- Use H1 once per file; start with a short summary.
- Prefer lists, tables, and code blocks over paragraphs for steps.

## Formatting

- Wrap long lines naturally; Prettier/markdownlint will format.
- Use fenced code blocks with language hints: `js,`php, ```bash.
- Prefer **relative links** within the repo.

## Frontmatter (if site generator uses it)

```yaml
---
title: Getting Started
description: Quick start for Tour Operator
---

# Local Agent Workflow Guide

Use this guide when creating skills intended to be attached to local agents or repo-based assistants.

## Local vs upload-ready skills

Local skills can include richer helper files, tests, rollout notes, and repo-specific validation. Upload-ready skills must still respect platform packaging rules, required frontmatter, and size limits.

## Local skill expectations

A local agent skill should:

- Make its trigger conditions obvious in frontmatter.
- Keep `SKILL.md` lean.
- Prefer shallow folders.
- Use references for domain rules.
- Use templates for repeatable outputs.
- Use memory for durable context only.
- Use validators when multiple files must stay aligned.
- Include rollout notes when other teammates or agents will maintain it.

## Repo-safe behaviour

When generating local skill files:

- Do not assume write access unless the user asks for files.
- Avoid destructive edits.
- Preserve existing files unless replacing them is explicitly part of the task.
- Report changed, added, and removed files.
- Keep generated scripts simple and dependency-light.

---
name: markdown-output-formatter
description: The Markdown Output Formatter skill helps you create consistent, scannable, and reusable outputs for skill drafts, audits, and onboarding results. Use this skill when you need to organize complex information clearly, ensuring that your documents are well-structured and easy to read, but avoid it for short replies or when a different format is requested.
---

# Markdown Output Formatter

## Purpose

Make substantial skill-factory outputs consistent, scannable, and easy to reuse.

Use this skill for skill drafts, audits, packaging recommendations, onboarding results, and other structured workflow artefacts.

Do not use it for very short replies or when the user explicitly asks for a different format.

## Output goal

Prefer predictable structure, clear headings, concise bullets, and copy-paste-ready blocks.

When the output includes a skill package or file set:

- keep the complete downloadable `skill.zip` when available; and
- also present important files as separate copyable Markdown blocks.

When the destination only supports one text field, also provide one combined Markdown package with explicit file boundary markers.

## Standard section order

Use this order when it fits the task:

1. `## Skill Summary`
2. `## Recommended Folder Structure`
3. `## Core Instructions`
4. `## Supporting References`
5. `## Validation and QA`
6. `## Boundary Cases`
7. `## Test Prompts`
8. `## Copy-Paste Sections`
9. `## Assumptions and Follow-up`

For audits or narrower tasks, use only the relevant sections while keeping the same heading logic.

For audits specifically, prefer:

- `## What is working`
- `## Issues`
- `## Highest-priority fixes`
- `## Risks and assumptions`

## Formatting rules

- Use sentence-case Markdown headings.
- Keep headings short and functional.
- Prefer bullets for rules, checks, assumptions, and deliverables.
- Prefer numbered lists for workflows or sequences.
- Keep paragraphs short.
- Use backticks for filenames, paths, field names, entity names, and literal values.
- Use fenced code blocks for reusable files, YAML, shell commands, schemas, and templates.
- Label code blocks with the most useful language when possible.
- Keep copy-paste blocks directly usable without cleanup.
- Avoid large prose walls when the same content can be clearer as sections or bullets.

## Copy-paste conventions

When including reusable artefacts:

- introduce each block with one short line saying what it is;
- group related files under `## Copy-Paste Sections`;
- put complete file contents in separate fenced blocks;
- preserve exact indentation and filenames;
- label partial blocks clearly as snippets; and
- do not merge multiple files into one code block unless the user needs a single-field destination.

## Single-field destination format

Use a combined block when the content must fit into one field, one description box, one Markdown prompt, or another single text field.

In that case:

- keep the normal summary and package references;
- add `## Single-field Markdown Package`;
- put the entire reusable file set into one fenced Markdown block;
- start the block with a short package header that includes the skill name and version when known;
- mark each new file with `--- FILE: path/to/file ---`;
- add one `Purpose: ...` line directly beneath each file marker;
- include the full file contents immediately after that line; and
- keep the combined block self-contained and directly reusable.

## Skill-conversion formatting

When rewriting an existing skill from another environment into a ChatGPT or Linear-native skill:

- describe the result in terms of what the rewritten skill now does;
- avoid foregrounding legacy environment details unless the user explicitly wants a migration comparison; and
- prefer clean replacement wording over mixed old and new terminology.

## Safety

Formatting should improve clarity, not hide uncertainty.

Do not make content sound more certain, more validated, or more complete than it really is.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

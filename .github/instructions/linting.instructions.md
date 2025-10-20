---
title: "LightSpeed Copilot Prompts Index"
version: "v1.1"
last_updated: "2025-10-20"
author: "LightSpeedWP Team"
maintainer: "Ash Shaw"
description: "Master prompt index for all Copilot Chat and automation prompts in the LightSpeed organisation. Lists and cross-references all prompt files and related instructions."
tags: ["lightspeed", "copilot", "prompts", "automation", "review", "workflow"]
type: "prompt"
---

# LightSpeed Copilot Prompt Library

This folder contains reusable prompts for common development and review tasks in any LightSpeed WordPress project.  
Prompts are designed for Copilot Chat, GitHub Actions, and automation workflows.

To run a prompt, open the file or use `/filename` in Copilot Chat.

---

## Dynamic Reference

All prompt files in this directory:
- [`*.prompt.md`](./) — All Markdown files ending with `.prompt.md` are considered reusable prompts for Copilot Chat, GitHub Actions, and agent workflows.

> **When adding a new prompt file, ensure it has clear YAML frontmatter, follows project conventions, and is listed below.**

---

## Explicit Prompt File Index

Below are all prompt files available in this folder. Each file is reusable for Copilot Chat, review automation, or workflow scripting.

| File                                                    | Description                                               |
| ------------------------------------------------------- | --------------------------------------------------------- |
| [accessibility-review.prompt.md](./accessibility-review.prompt.md)         | Accessibility review checklist and automation for any LightSpeed WordPress project. |
| [add-frontmatter.prompt.md](./add-frontmatter.prompt.md)                 | Insert or normalise YAML frontmatter in docs and instructions. |
| [audit-jsdoc.prompt.md](./audit-jsdoc.prompt.md)                         | Audit JS files for JSDoc coverage per WordPress guidance; add/fix inline docs. |
| [audit-phpdoc.prompt.md](./audit-phpdoc.prompt.md)                       | Audit PHP files for WordPress DocBlocks and fix missing/incorrect tags. |
| [author-json-schema.prompt.md](./author-json-schema.prompt.md)            | Draft a JSON Schema from sample data and business rules. |
| [build-agent-and-tests.prompt.md](./build-agent-and-tests.prompt.md)      | Create a minimal agent (capabilities, tools, guardrails) and tests. |
| [dev-code-review.prompt.md](./dev-code-review.prompt.md)                  | Guidelines for providing feedback to junior developers in any LightSpeed WordPress project. |
| [fix-javascript-lint.prompt.md](./fix-javascript-lint.prompt.md)          | Fix ESLint/Prettier issues; align with WordPress JS style. |
| [fix-php-lint.prompt.md](./fix-php-lint.prompt.md)                        | Run PHPCS cleanup for WordPress PHP style; safe auto-fixes only. |
| [generate-gh-workflow.prompt.md](./generate-gh-workflow.prompt.md)        | Generate a secure, cache-efficient GitHub Actions workflow for this repo. |
| [increase-test-coverage.prompt.md](./increase-test-coverage.prompt.md)    | Expand test coverage focusing on risk and critical paths. |
| [inline-documentation.prompt.md](./inline-documentation.prompt.md)        | Add comprehensive inline documentation to PHP/JS code (WordPress standards). |
| [label-issues.prompt.md](./label-issues.prompt.md)                        | Apply org label rules to a PR via GitHub Action (not issues). |
| [pattern-generation.prompt.md](./pattern-generation.prompt.md)            | Template for creating new WordPress block patterns in any LightSpeed project. |
| [refactor-theme-types.prompt.md](./refactor-theme-types.prompt.md)        | Refactor the typography section in theme.json for any LightSpeed WordPress project. |
| [validate-json.prompt.md](./validate-json.prompt.md)                      | Validate JSON files against schemas and report exact errors. |

> _This list must be updated if any prompt files are added, removed, or renamed._

---

## How to Use

1. Copy the content of the relevant prompt.
2. Paste it into GitHub Copilot Chat.
3. Customize the prompt with your specific requirements.
4. Use the generated response as a starting point.

---

## Creating New Prompts

When creating new prompts for this directory, please follow these guidelines:

1. Use clear, descriptive filenames with the `.prompt.md` extension for agent mode prompts.
2. Include a YAML frontmatter with `mode` and `description` fields.
3. Structure the prompt with clear instructions.
4. Update this index to include the new prompt.

---

## Maintaining Prompts

Prompts should evolve as our project standards and requirements change. When updating:

1. Ensure changes align with our project guidelines and instructions.
2. Test the updated prompt with GitHub Copilot before committing.
3. Consider backward compatibility with existing code.
4. Document significant changes in the commit message.

---

## Related Guidance

- [Custom Instructions (Org-wide)](../custom-instructions.md)
- [Global AI Rules (AGENTS.md)](../../AGENTS.md)
- [Agent Index](../agents/agent.md)
- [Chat Modes](../chatmodes/chatmodes.md)
- [Instructions Directory](../instructions/)

## License

These prompt files are part of the LightSpeed organization's community health files, licensed under the GNU General Public License v3.0.

---
name: agent-skill-builder
description: create, update, audit, and package local agent skill folders for lightspeed workflows. use when the user wants a reusable local skill, agent-attached workflow, skill folder structure, memory pack, validation pack, references, templates, schemas, helper scripts, starter prompts, or a maintainable skill-generation system. decide whether the target skill should be minimal, standard, or advanced, and avoid unnecessary folders unless they improve reliability, reuse, validation, or team handoff.
---

# Agent Skill Builder

Use this skill to design, create, update, validate, or package local agent skills. Treat it as a local companion to the platform skill creator, not a replacement for official upload validation.

## Core rules

- Start small and add folders only when they reduce real drift, repeated work, validation risk, or handoff cost.
- Keep `SKILL.md` as the control plane. Move detailed rules into `references/` and load only the file needed for the current step.
- Separate local-agent workflow folders from upload-ready ChatGPT skill bundles.
- Preserve existing user intent, files, naming, and conventions when updating an existing skill.
- Return a complete folder or ZIP when the user expects a usable skill, not a partial patch.
- Use UK English for LightSpeed-facing examples and output unless the user asks otherwise.

## Skill tier selector

Choose one tier before creating files.

| Tier | Use when | Default folders |
| --- | --- | --- |
| Minimal | Small text-only workflow, one output format, no durable context | `SKILL.md`, `agents/` |
| Standard | Reusable workflow with references, templates, or examples | minimal + `references/`, `templates/`, `examples/` |
| Advanced | Shared, connector-aware, business-critical, or drift-prone workflow | standard + `memory/`, `schemas/`, `scripts/`, `tests/`, `rollout/` |

Avoid `assets/` unless the skill needs output assets such as document templates, logos, images, starter archives, or boilerplate files.

## Build workflow

1. Confirm enough context exists to proceed. If the target workflow is unclear, ask only for the smallest missing detail: expected input, expected output, or required tools/connectors.
2. Select the skill tier and explain any folders intentionally omitted.
3. Draft or update `SKILL.md` with concise frontmatter and operational instructions.
4. Add references only for non-obvious rules, domain context, source priority, or workflow variants.
5. Add templates only when the output shape should be reused.
6. Add examples only when they prove the workflow or prevent ambiguity.
7. Add a memory pack only when durable project, user, routing, or workflow context will improve future runs.
8. Add a validation pack only when drift is likely across instructions, references, templates, examples, schemas, memory, or rollout notes.
9. Run validation scripts when available. Fix blocking errors before packaging or handoff.
10. Package the whole skill when the user asks for a distributable bundle.

## Reference loading map

Load these files only when relevant:

- Folder decisions: `references/folder-structure-guide.md`
- Memory pack design: `references/memory-pack-guide.md`
- Validation pack design: `references/validation-pack-guide.md`
- Source priority and conflict handling: `references/source-priority-guide.md`
- Schema, template, and example drift: `references/schema-template-alignment-guide.md`
- Local agent conventions: `references/local-agent-workflow-guide.md`
- Reference inventory: `references/reference-register.md`
- Starter prompts: `references/starter-prompt-quality-guide.md`
- Rollout and release: `references/rollout-guide.md`
- LightSpeed defaults: `references/business-context.md`

## Source priority

Use this default order unless the user gives a stronger project-specific order:

1. Current user request.
2. Current conversation context and attached files.
3. Existing skill files being edited.
4. Target skill `SKILL.md`.
5. Target skill `references/business-context.md` or domain context.
6. Target skill memory defaults.
7. Other target skill memory files.
8. Other reference guides.
9. Templates.
10. Examples.
11. Prior assumptions.

Never let stored memory or business context override the current user request.

## Memory pack policy

Include a memory pack only for durable information that changes how future runs should behave. Good memory includes stable preferences, project defaults, approved decisions, terminology, active open loops, and reusable routing rules. Bad memory includes one-off notes, temporary tasks, sensitive data, stale completed todos, and unapproved assumptions.

Use `templates/memory-pack/` when scaffolding memory-enabled skills.

## Validation pack policy

Include a validation pack for mature or shared skills that need drift control. Prioritise:

1. Memory hygiene.
2. Source-priority consistency.
3. Schema-to-template alignment.
4. Link/reference checks.
5. Markdown structure checks.
6. Business context completeness.
7. Starter prompt quality.

Use `templates/validation-pack/` and the scripts in `scripts/` when scaffolding validation-enabled skills.

## Output expectations

For planning requests, return a folder recommendation, tier, omitted folders, required references, memory decision, validation decision, and next action.

For creation requests, produce the files or packaged ZIP the user asked for. Include a short handoff summary with validation status and known limitations.

For audits, report blocking errors first, then warnings, then maintainability improvements.

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

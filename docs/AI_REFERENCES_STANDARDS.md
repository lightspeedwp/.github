---
file_type: documentation
title: AI Reference Standards
description: Canonical AI reference layout, sourced platform facts, maintenance and governance.
version: '2.0.0'
last_updated: '2026-11-27'
---

# AI Reference Standards

The `ai/` folder holds canonical platform references, runner inventories and audit evidence. It is a documentation source, not an agent or skill loader. Every volatile platform fact needs an official source and a check date. Rules are marked **enforced** only where a named check rejects a violation. Sources were checked on 2026-11-27.

## Canonical layout

```text
ai/
├── README.md                        # Canonical reference index
├── Claude.md                        # Claude platform reference
├── Gemini.md                        # Gemini platform reference
├── RUNNERS.md                       # Runner and execution-context inventory
├── agents.md                        # Agent implementation map
├── AUDIT-SUMMARY.md                 # Audit evidence
├── audit-planner-reviewer-agents.md
└── improvement-plan-planner-reviewer.md
```

Use the filenames that exist in the repository. Do not create model-specific files or decision logs merely because an older template showed them.

## Rules and enforcement

| ID    | Rule                                                                                                                                 | Source                | Checked    | Enforcement                                                               |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------- | ---------- | ------------------------------------------------------------------------- |
| R-01  | Store canonical references and audit evidence under `ai/`, with `ai/README.md` as the index.                                         | [R-AI]                | 2026-11-27 | **guidance** — no AI-reference structure validator exists.                |
| R-02  | Use repository documentation frontmatter with `file_type: documentation`, title, description, version and date.                      | [R-F], [R-AI]         | 2026-11-27 | **enforced** — local `validate-frontmatter.js`; no active CI job runs it. |
| R-03  | Give every platform rule an official source link, a check date and an **enforced** or **guidance** mark.                             | [R-AI], [R-SPEC]      | 2026-11-27 | **guidance** — no content checker enforces this metadata.                 |
| R-04  | Separate official platform behaviour from LightSpeed repository policy.                                                              | [CC-S], [GH-A], [R-A] | 2026-11-27 | **guidance** — editorial review.                                          |
| R-05  | Date volatile claims such as model aliases, limits, preview status, pricing and loader support; re-check them before reuse.          | [CC-S], [GH-A], [AS]  | 2026-11-27 | **guidance** — no freshness gate covers these references by default.      |
| R-06  | Do not set a mandatory default model in repository policy; use the platform's optional `model` field when a choice is needed.        | [CC-S], [GH-A]        | 2026-11-27 | **guidance** — no repository check validates model policy.                |
| R-07  | Record deprecation and replacement history without presenting retired filenames or fields as current standards.                      | [R-D], [R-AI]         | 2026-11-27 | **guidance** — editorial review.                                          |
| R-08  | Keep secrets and environment values out of references; use placeholders.                                                             | [R-A], [R-D]          | 2026-11-27 | **guidance** — no AI-reference-specific secret gate.                      |
| R-09  | Validate changed AI-reference frontmatter before review.                                                                             | [R-V]                 | 2026-11-27 | **enforced** — local `validate-frontmatter.js`; no active CI job runs it. |
| R-09a | Check local links in changed AI references.                                                                                          | [R-L]                 | 2026-11-27 | **guidance** — `validate-links.js` does not cover `ai/`.                  |
| R-10  | Do not claim that `ai/*.md` is automatically loaded; reference it from `AGENTS.md`, `CLAUDE.md`, a skill or another explicit loader. | [CC-M], [R-AI]        | 2026-11-27 | **guidance** — platform loading fact.                                     |
| R-11  | Review references on a stated cadence and after a relevant platform change.                                                          | [R-D], [R-AI]         | 2026-11-27 | **guidance** — no scheduled content check exists.                         |

## Validated frontmatter example

This example passed `.schemas/frontmatter.schema.json` on 2026-11-27.

`ai/Sample.md`:

```markdown
---
file_type: documentation
title: Sample AI Reference
description: Sample platform reference used for frontmatter schema validation.
version: '1.0.0'
last_updated: '2026-11-27'
---

# Sample AI Reference

## Scope

This sample records one platform fact.

## Verified rule

| Rule                    | Source                                                             | Checked    | Status   |
| ----------------------- | ------------------------------------------------------------------ | ---------- | -------- |
| Record the source date. | [Agent Skills specification](https://agentskills.io/specification) | 2026-11-27 | guidance |
```

## Validation procedure

```bash
node scripts/validation/validate-frontmatter.js --base origin/develop --head HEAD
node scripts/validation/validate-links.js
```

Use a scoped local-link check for changed AI references. Official external links should be fetched again when a fact is refreshed; a local file-existence check does not prove the linked page still says the same thing.

## Known gaps and open decisions

- No AI-reference schema, model-fact checker, freshness gate or review scheduler exists.
- The current `ai/` index lists `Claude.md`, `Gemini.md`, `RUNNERS.md` and `agents.md`; older templates name files that are absent.
- Model IDs, prices and capability rankings are intentionally omitted from this standard because they change quickly.
- Whether GIT-1157, GIT-33, GIT-1140 and GIT-405 are superseded remains an open maintainer decision.
- Root `AGENTS.md` still describes folder-based agent code/spec pairs; that conflict is not resolved by this reference standard.

## Related standards

- [Agent Standards](./AGENT_STANDARDS.md)
- [Skill Standards](./SKILLS_STANDARDS.md)
- [Prompt Standards](./PROMPTS_STANDARDS.md)
- [Workflow Standards](./WORKFLOWS_STANDARDS.md)
- [Canonical AI References](../ai/README.md)

[AS]: https://agentskills.io/specification
[CC-M]: https://code.claude.com/docs/en/memory
[CC-S]: https://code.claude.com/docs/en/sub-agents
[GH-A]: https://docs.github.com/en/copilot/reference/custom-agents-configuration
[R-A]: ../AGENTS.md
[R-AI]: ../ai/README.md
[R-D]: ../instructions/documentation-formats.instructions.md
[R-F]: ../.schemas/frontmatter.schema.json
[R-L]: ../scripts/validation/validate-links.js
[R-SPEC]: ../.github/specs/028-agent-skill-standards-docs/spec.md
[R-V]: ../scripts/validation/validate-frontmatter.js

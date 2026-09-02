---
applyTo: "**"
description: "Canonical file organisation rules for GitHub-native governance files, portable AI assets, project artefacts, reports, and temporary outputs."
status: "active"
---

# File And Folder Organisation Instructions (UK)

You are a repository layout steward. Place files by ownership and reuse intent:
GitHub-native governance assets stay under `.github`, portable AI assets live
in the top-level source folders, and temporary work is cleaned up or promoted.

## Overview

These instructions apply to Copilot, Codex, and agent-generated files in this
repository. They define where to create reports, project artefacts, repo-local
instructions, portable AI assets, and temporary outputs during the portable AI
plugin restructure.

Use this rule first:

```text
GitHub-native or repo-governance asset -> .github/
Portable AI source asset              -> top-level source folder
Permanent human documentation          -> docs/
Short-lived scratch output             -> .github/tmp/
```

## Core Principles

- Keep `.github` as the control plane for this repository's GitHub governance,
  community-health files, repo-local automation, reports, and active projects.
- Use top-level source folders for portable AI assets that should be installable
  or reusable outside this `.github` repository.
- Keep permanent human-facing architecture, policy, setup, and reference
  documentation in `docs/`.
- Use `.github/tmp/` only for short-lived working files; promote useful outputs
  to the correct folder or delete them before finishing.
- Do not move production assets as part of documentation-only issues.
- Record source and target paths in the migration map before moving existing
  agents, instructions, prompts, schemas, or runner scripts.

## Decision Tree

1. Is the file GitHub-native, community-health, or repo governance content?
   Place it under `.github/`.
2. Is the file a report, audit, baseline, metrics output, or project tracker for
   this repository?
   Place it under `.github/reports/` or `.github/projects/`.
3. Is the file a reusable AI asset intended for installation or cross-tool use?
   Place it in the matching top-level source folder.
4. Is the file durable documentation for humans rather than a report or task?
   Place it under `docs/`.
5. Is the file temporary scratch output?
   Place it under `.github/tmp/`, then clean it up before finishing.

## GitHub-Native Repo Assets

Use `.github/` for assets that only make sense in this repository's GitHub
control-plane role.

| Path | Use For | Notes |
| --- | --- | --- |
| `.github/ISSUE_TEMPLATE/` | Issue templates surfaced by GitHub. | Keep GitHub-native. |
| `.github/PULL_REQUEST_TEMPLATE.md` and `.github/PULL_REQUEST_TEMPLATE/` | Pull request templates. | Keep GitHub-native. |
| `.github/DISCUSSION_TEMPLATE/` | Discussion templates. | Keep GitHub-native. |
| `.github/SAVED_REPLIES/` | Maintainer replies and triage guidance. | Keep unless converted into cookbook examples. |
| `.github/workflows/` | GitHub Actions workflows for this repo or reusable Actions. | Do not confuse with top-level `/workflows`. |
| `.github/labels.yml`, `.github/labeler.yml`, `.github/issue-types.yml` | Label, labeler, and issue type governance. | Repo-scoped control-plane files. |
| `.github/agents/` | Repo-only agent specs and legacy agent files. | Move reusable specs to `/agents` only through migration issues. |
| `.github/instructions/` | Repo-local instructions for maintaining this repository. | Portable instructions belong in `/instructions`. |
| `.github/prompts/` | Legacy prompt library during migration. | Convert durable workflows to `/skills` or `/cookbook`; do not add new permanent prompts by default. |
| `.github/schemas/` | Repo-governance schemas during migration. | Portable schemas belong in `/.schemas` once validators consume them. |
| `.github/reports/` | Reports, audits, metrics, validation output, and analysis. | Never place reports in repo root. |
| `.github/projects/` | Project plans, issue drafts, ADRs, and active project artefacts. | Keep in-flight work under `active/`. |

## Portable AI Source Folders

Use these top-level folders for assets that should travel across tools,
projects, or plugin bundles.

| Path | Use For | Notes |
| --- | --- | --- |
| `.schemas/` | Portable JSON, YAML, and frontmatter schemas. | Start small; include only schemas actively validated. |
| `agents/` | Portable agent specifications. | Specs only until runtime code is deliberately rewritten. |
| `cookbook/` | Recipes, examples, playbooks, and implementation guides. | Use for teaching material that is not a skill. |
| `hooks/` | Portable hooks, guardrails, and adapters. | Prefer dry-run behaviour and tool-neutral contracts. |
| `instructions/` | Portable instruction files. | Remove `.github` assumptions before migration. |
| `plugins/` | Installable plugin bundles. | Each plugin owns its README and manifest. |
| `skills/` | Self-contained skills. | Each skill uses `SKILL.md`; assets stay inside the skill folder. |
| `workflows/` | Portable agentic workflows. | GitHub Actions stay in `.github/workflows/`. |

## Repository Scripts Location (CRITICAL)

**ALL scripts belong in `scripts/` at the root, NOT in `.github/scripts/`.**

| Script Type | Correct Location | WRONG Location |
| --- | --- | --- |
| Repository automation scripts | `scripts/automation/` | ❌ `.github/scripts/automation/` |
| Metrics collection scripts | `scripts/metrics/` | ❌ `.github/scripts/metrics/` |
| Telemetry scripts | `scripts/telemetry/` | ❌ `.github/scripts/telemetry/` |
| Release scripts | `scripts/release/` | ❌ `.github/scripts/release/` |
| Validation scripts | `scripts/validation/` | ❌ `.github/scripts/validation/` |
| Badge generation scripts | `scripts/badges/` | ❌ `.github/scripts/badges/` |
| Workflow orchestration scripts | `scripts/workflows/` | ❌ `.github/scripts/workflows/` |
| **ONLY EXCEPTION:** Website browser scripts | `.github/website/src/scripts/` | ✅ Correct location for browser-specific code |
| **GitHub-native agentic workflows** | `.github/agentic-workflows/` | ✅ Agent specs that manage repository governance (e.g., release.agent.js) |

**Rules:**

- `.github/` is for GitHub-native governance files only (templates, workflows, configs)
- All executable scripts belong in `scripts/` with appropriate subfolders
- **Exceptions:**
  - `.github/website/src/scripts/` for website browser code
  - `.github/agentic-workflows/` for agent specs that manage repository governance (e.g., release.agent.js)
- When in doubt, check existing script locations in `scripts/` directory
- Never create new scripts under `.github/scripts/` - this path should not exist

## File Type Mapping

| File Type | Canonical Location | Rule |
| --- | --- | --- |
| **Repository scripts** | `scripts/{category}/` | **ALWAYS root `scripts/`, never `.github/scripts/`** |
| Repo GitHub workflow | `.github/workflows/` | Keep executable GitHub Actions here. |
| Portable agentic workflow | `workflows/` | Use for tool-neutral AI processes. |
| Repo community-health file | `.github/` | Keep issue, PR, support, security, and governance files in place. |
| Repo-only agent spec | `.github/agents/` | Use only for maintaining this repo. |
| Portable agent spec | `agents/` | Move after frontmatter and references are updated. |
| Repo-local instruction | `.github/instructions/` | Use for maintaining this repository. |
| Portable instruction | `instructions/` | Use for reusable domains and remove `.github` assumptions. |
| Legacy prompt | `.github/prompts/` during migration | Convert, archive, or delete through migration issues. |
| Repeatable prompt workflow | `skills/<skill-id>/SKILL.md` | Convert when it has clear steps, inputs, and outputs. |
| Prompt example or playbook | `cookbook/` | Use when it teaches a pattern but is not a skill. |
| Repo schema | `.github/schemas/` | Keep while used by existing repo validators. |
| Portable schema | `.schemas/` | Use only when active portable validators consume it. |
| Agent runner script | Existing legacy path until rewritten | Do not bulk move; rewrite as hook, workflow, or skill-local script. |
| Audit or validation report | `.github/reports/{category}/` | Keep reports out of root and `docs/`. |
| Active project artefact | `.github/projects/active/{project-slug}/` | Archive completed work under `.github/projects/completed/`. |
| Permanent human documentation | `docs/` | Use for stable architecture, policy, setup, and reference docs. |
| Temporary scratch output | `.github/tmp/` | Delete or promote before finishing. |

## Reports And Analysis Outputs

- **Location:** `.github/reports/{category}/`
- **Naming:** `{type}-{subject}-{date-or-run-id}.{ext}`
- **Categories:** `analysis`, `audits`, `implementation`, `migration`,
  `validation`, `agents`, `coverage`, `frontmatter`, `issue-metrics`,
  `labeling`, `linting`, `meta`, `metrics`, `optimisation`, `tech-debt`
- **Rule:** Reports, logs, and metrics belong under `.github/reports/`, never in
  repo root or `docs/`.

## Active Project Work

- **Location:** `.github/projects/active/{project-slug}/`
- **Use for:** issue drafts, project plans, task lists, ADRs, context packs,
  baseline reports, migration maps, and project-only working documents.
- **Naming:** `{project-slug}-{purpose}-{date}.{ext}` where dates help
  traceability.
- **Completion:** move finished project artefacts to
  `.github/projects/completed/` only after acceptance criteria are met and any
  durable summaries have been promoted to `.github/reports/` or `docs/`.

## Permanent Documentation

Use `docs/` for stable human-facing documentation such as architecture,
governance, setup, plugin authoring, migration guides, policies, and reference
material. Do not put reports, task trackers, or transient project artefacts in
`docs/`.

## Examples

- **Good:** Create a restructure audit at
  `.github/reports/migration/portable-ai-asset-audit-2026-05-19.md`.
- **Good:** Create a portable review skill at
  `skills/lightspeed-pr-review/SKILL.md`.
- **Good:** Keep a GitHub Actions workflow at `.github/workflows/labeling.yml`.
- **Good:** Document a portable agentic release process at
  `workflows/release-prep/README.md`.
- **Avoid:** Adding new reusable WordPress project instructions under
  `.github/instructions/`.
- **Avoid:** Moving `.github/prompts/` wholesale without classification.
- **Avoid:** Leaving scratch logs or generated inventories in the repo root.

## Validation

- Check new paths against this mapping before creating or moving files.
- Run targeted Markdown linting for changed docs.
- Avoid known mutating validation commands when the task is documentation-only.
- Confirm `.github/tmp/` does not retain scratch files after the final output is
  promoted.
- Use `git status --short` before finishing to spot unrelated or accidental
  changes.

## Decision Checklist

- [ ] Identify whether the file is GitHub-native, portable AI source,
      permanent documentation, project work, report output, or temporary output.
- [ ] Place it in the canonical folder above.
- [ ] Use kebab-case names and dates where they improve traceability.
- [ ] Add frontmatter where required.
- [ ] Update related README or index files when the asset is permanent.
- [ ] Record source and target paths before moving existing assets.
- [ ] For README content, follow `readme.instructions.md`; for diagrams, follow
      `mermaid.instructions.md`.

## Deprecated Path

`file-output-organization.instructions.md` is superseded by this file. Update
references to use the UK English spelling:
`file-organisation.instructions.md`.

## References

- [Portable AI plugin restructure PRD](../projects/active/portable-ai-plugin-restructure/portable-ai-plugin-restructure-prd-2026-05-14.md)
- [instructions.instructions.md](instructions.instructions.md)
- [readme.instructions.md](readme.instructions.md)
- [reporting.instructions.md](reporting.instructions.md)

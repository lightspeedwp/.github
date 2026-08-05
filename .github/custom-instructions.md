---
file_type: custom-instructions
title: Repo-local Copilot Instructions
description: Repo-local Copilot and agent instructions for maintaining the LightSpeed .github control-plane repository.
mode: agent
version: v1.5
last_updated: '2026-08-05'
owners:
  - LightSpeed Team
tags:
  - copilot
  - agent
  - governance
  - instructions
  - phase-1-restructuring
status: active
stability: stable
domain: governance
language: en
---

# Repo-local Copilot Instructions

## Scope

These instructions apply to work performed inside the LightSpeed `.github` control-plane repository.

## Phase 1 Restructuring (Completed 2026-08-05)

**Phase 1 audits are complete.** Comprehensive audit reports document the current repository structure:

- **Phase 1A Audit** — 58 instruction files (27 portable, 17 repo-local, 15 archived); 502+ references mapped
  - Report: [INSTRUCTION_FILES_AUDIT_2026-08-05.md](./projects/active/repo-restructuring-2026-07-25/INSTRUCTION_FILES_AUDIT_2026-08-05.md)
  - Portable instructions belong in root `instructions/` directory
  - Repo-local instructions stay in `.github/instructions/` or `.github/custom-instructions.md`
  
- **Phase 1B Audit** — 25 core schema files across 3 locations; consolidation plan documented
  - Report: [SCHEMA_AUDIT_REPORT.md](./projects/active/repo-restructuring-2026-07-25/SCHEMA_AUDIT_REPORT.md)
  - Canonical location: `.schemas/` (hidden folder at root)
  - Current duplication: `schema/`, `schemas/`, `.schemas/` all maintained during migration
  
- **Phase 1C Audit** — 35 agents (19 spec-based, 16 multi-file); 788+ references mapped
  - Report: [AGENT-AUDIT-COMPREHENSIVE.md](./projects/active/repo-restructuring-2026-07-25/AGENT-AUDIT-COMPREHENSIVE.md)
  - Portable multi-file agents: `agents/` (root)
  - Spec-based control-plane agents: `.github/agents/`

**Key Principles:**

- **Portable assets** (instructions, agents, skills, etc.) go to root-level directories
- **Control-plane specific assets** (governance, workflows, local scripts) stay in `.github/`
- **No assumptions about other repositories** in portable code/docs
- See [CLAUDE.md](../CLAUDE.md#repository-boundaries) for complete boundary rules

## Documentation Standards for AI Infrastructure

All agents, skills, instructions, workflows, plugins, and related AI components must comply with the 9 comprehensive standards documented in `docs/`. When creating or modifying AI infrastructure:

- **Creating an agent?** → Reference [docs/AGENT_STANDARDS.md](../docs/AGENT_STANDARDS.md)
- **Building a skill?** → Reference [docs/SKILLS_STANDARDS.md](../docs/SKILLS_STANDARDS.md)
- **Writing instructions?** → Reference [docs/INSTRUCTIONS_STANDARDS.md](../docs/INSTRUCTIONS_STANDARDS.md)
- **Designing a workflow?** → Reference [docs/WORKFLOWS_STANDARDS.md](../docs/WORKFLOWS_STANDARDS.md)
- **Creating a cookbook?** → Reference [docs/COOKBOOKS_STANDARDS.md](../docs/COOKBOOKS_STANDARDS.md)
- **Building prompts?** → Reference [docs/PROMPTS_STANDARDS.md](../docs/PROMPTS_STANDARDS.md)
- **Developing a plugin?** → Reference [docs/PLUGINS_STANDARDS.md](../docs/PLUGINS_STANDARDS.md)
- **Creating hooks?** → Reference [docs/HOOKS_STANDARDS.md](../docs/HOOKS_STANDARDS.md)
- **Maintaining AI references?** → Reference [docs/AI_REFERENCES_STANDARDS.md](../docs/AI_REFERENCES_STANDARDS.md)

See [AGENTS.md](../AGENTS.md#documentation-standards) for the complete quick reference guide and standards overview.

## Branch Protocol

1. Before the first edit, confirm the current branch is in scope for the requested task.
2. If the task is unrelated to the current branch, create a new branch from `develop` before editing files.
3. The branch name must follow [docs/BRANCHING_STRATEGY.md](../docs/BRANCHING_STRATEGY.md) (for example `fix/nl-postcode-validation` or `release/v1.6.0`).
4. Do not continue unrelated work on `claude/*`, issue-specific, or other in-flight branches.
5. If the working tree is already dirty with unrelated changes, stop editing that checkout and use a clean worktree or separate branch.
6. **Branch reuse is forbidden.** If a branch name has previously been merged, create a new branch with a unique slug. The validation script detects reused names automatically.
7. **Run the validation script before the first edit:** `npm run validate:branch-name -- --branch <branch>`. If it fails, fix the branch name before proceeding.

## Validation

- Run `npm run validate:branch-name -- --branch <branch>` for local checks (naming, base-branch policy, and reuse prevention).
- Pull requests targeting `develop` must pass the `Validation` job, which now includes branch-name enforcement.

## LightSpeed .github Custom Instructions

## Issue Creation Protocol (AI Agents)

Use this protocol whenever you create a GitHub issue in this repository.

### 1. Classify intent first

Map the request to a canonical issue type before selecting a template.

- If the request is a defect, use Bug intent.
- If it is net-new capability, use Feature intent.
- If it is bounded execution work, use Task intent.
- If it is UX or design direction, use Design intent.
- If none fit exactly, choose the closest available numbered template and state the intended canonical type in the issue body.

### 2. Select the correct numbered template

Pick from `.github/ISSUE_TEMPLATE/01-*.md` to `.github/ISSUE_TEMPLATE/25-*.md`.

Current parity note:

- Canonical issue types = 25 (aligned with `.github/issue-types.yml`).
- Numbered templates = 25 (one per canonical type).
- Label-only types without dedicated templates: `type:question`, `type:support`.

For label-only types, use the nearest template (Task or Improvement) and explicitly state the target type in the opening section.

### 3. Fill structured sections completely

Always complete:

- summary/context
- acceptance criteria
- definition of ready/done checklists
- dependencies/blockers
- links to related issues/PRs

Do not submit partially completed issue templates unless the issue is explicitly marked as a draft planning item.

### 4. Use the canonical creation path for automation

When an LLM or workflow is creating an issue, do not call the GitHub issue API with a blank body and patch it later.

- Select the canonical template first.
- Render the template body before the issue exists.
- Prefer `.github/workflows/issue-create-from-template.yml` for automation-driven issue creation.
- If the template has no dedicated type, use the nearest template and state the intended canonical type in the body.

### 5. Set labels and metadata explicitly

Issue template files currently do not pre-populate labels. Add labels manually on creation/edit:

- exactly one `type:*`
- exactly one `status:*`
- exactly one `priority:*`
- at least one `area:*` where confidently known

Use canonical values from:

- `.github/labels.yml`
- `.github/issue-types.yml`

### 6. Understand automation trigger behaviour

Automation path for issues:

1. issue is created/edited
2. `.github/workflows/labeling.yml` runs on `issues` events
3. `scripts/agents/labeling.agent.js` applies rules/defaults and content heuristics

Important:

- `.github/labeler.yml` is PR-signal heavy (branch/files) and less deterministic for issues.
- Issue outcomes rely more on content and canonical enforcement logic today.

### 6. Validate before submit

Before submitting an issue, confirm:

- template matches intent
- required sections are complete
- labels are canonical and one-hot families are respected
- links/references are valid

## Issue Body Examples

### Bug

- Intent: reproducible defect
- Template: `02-bug.md`
- Type label: `type:bug`
- Include: repro steps, expected vs actual, environment, logs/screenshots

### Feature

- Intent: new capability
- Template: `03-feature.md`
- Type label: `type:feature`
- Include: user value, scope, acceptance criteria, out-of-scope

### Task

- Intent: bounded implementation work
- Template: `01-task.md`
- Type label: `type:task`
- Include: checklist, dependencies, completion criteria

## Troubleshooting

### Labels look wrong after creation

- Verify canonical labels exist in `.github/labels.yml`.
- Ensure only one `type:*`, one `status:*`, and one `priority:*` are present.
- Re-open/edit issue to re-trigger labeling workflow if needed.

### Expected automation did not apply

- Confirm event type is covered in `.github/workflows/labeling.yml` `issues` triggers.
- Check if requested outcome depends on PR-only signals (branch/files) from `.github/labeler.yml`.
- Add explicit labels manually and document intent in issue body.

### Ambiguous template choice

- Prefer the closest numbered template.
- Add a one-line declaration at the top of the issue body: `Intended canonical type: type:<value>`.

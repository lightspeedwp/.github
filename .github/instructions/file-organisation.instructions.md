---
applyTo: "**"
description: "Canonical instructions for repo and file organisation (UK English): where Copilot/agents must place files, folders, and temporary outputs."
status: "active"
---

# File & Folder Organisation Instructions (UK)

You are a repository layout steward. Follow our file and folder organisation rules to place Copilot outputs and artefacts correctly. Avoid creating new paths or leaving temporary files outside the `.github` hierarchy unless explicitly requested.

## Overview

Applies to all Copilot/agent-generated files and operational artefacts. Defines canonical locations, naming, and lifecycle for reports, projects, prompts, instructions, and temporary work. Excludes permanent product docs (see `docs/`).

## General Rules

- Keep operational artefacts under `.github/`; do not use repo root or `docs/` unless explicitly requested.
- Use kebab-case naming and include dates where helpful.
- Store temporary work in `.github/tmp/` and promote or delete promptly.
- Follow placement guidance before creating new files or folders.

## Detailed Guidance

## Mission

Ensure all Copilot- and agent-generated files live in predictable, correct locations. Prevent repository drift by keeping reports, project artefacts, and temporary outputs in their designated `.github/` subfolders.

## Core Principles

- **Never** place reports, project files, or instructions in the repository root or `docs/` unless explicitly requested.
- Use the `.github/` hierarchy for operational artefacts; keep `docs/` for permanent, user-facing reference documentation.
- Temporary work belongs in `.github/tmp/` and should be promoted or deleted promptly.

## Folder Overview (Operational)

- `.github/reports/` — all reports, audits, metrics, and analysis (see categories below)
- `.github/projects/` — task tracking, project plans, ADRs
- `.github/agents/` — agent specs, implementations, utilities, tests
- `.github/instructions/` — Copilot/agent instructions (this file is the canonical placement guide; see `readme.instructions.md` for README content structure)
- `.github/prompts/` — reusable prompt files and prompt indexes
- `.github/tmp/` — short-lived working files; keep `.gitkeep`, delete the rest after use

## File Type → Location Mapping

### 📊 Reports & Analysis Outputs

- **Location:** `.github/reports/{category}/`
- **Naming:** `{type}-{subject}-{timestamp?}.{ext}`
- **Categories:** analysis, audits, implementation, migration, validation, agents, coverage, frontmatter, issue-metrics, labeling, linting, meta, metrics, optimisation, tech-debt
- **Rule:** All reports, logs, and metrics belong under `.github/reports/` (never root or `docs/`).

### 🚧 Active Project Work (tasks, docs, Copilot outputs)

- **Location:** `.github/projects/active/{project-slug}/` for in-flight work; move completed items to `.github/projects/completed/` when done.
- **Use for:** Project-specific instructions, work-in-progress notes, task lists, ADRs, context packs for Copilot/agents, and any project-only docs that are not yet permanent reference material.
- **Naming:** `{project-slug}-{purpose}-{date}.{ext}` (e.g., `checkout-refactor-tasks-2025-12-11.md`, `checkout-refactor-context-pack.md`).
- **Temporary Copilot logs or scratch files:** use `.github/tmp/` with clear names (e.g., `checkout-refactor-processing-2025-12-11.md`) and delete after promotion; do not leave them in repo root.
- **When to move to `completed/`:** All acceptance criteria met, stakeholders sign off, and no open TODOs or blockers remain. Add a short completion note/date at the top before moving. If the outcome needs wider visibility, promote a summary to `.github/reports/{category}/` or `docs/`.
- **Project outputs ready for visibility:** place analyses in `.github/reports/{category}/`, and long-lived documentation in `docs/` once stable.

### 📋 Task Tracking & Planning

- **Location:** `.github/projects/`
- **Naming:** `{project-name}-{type}.md` (e.g., `context-reduction-tasks.md`, `phase6-planning.md`)
- **Subfolders:** `active/`, `completed/`, `planning/`, `ADR/`
- **Root rule:** keep only indexes/README files at `.github/projects/`; place live artefacts under `active/` and archive finished items under `completed/` to avoid drift.

### 📚 Permanent Documentation

- **Location:** `docs/`
- **Use for:** Architecture, governance, policies, user guides, reference docs that must persist.
- **Not for:** Reports, tasks, or transient artefacts.

### 🔧 Agents & Utilities

- **Location:** `.github/agents/`
- **Use for:** Agent specs (`*.agent.md`), implementations (`*.agent.js`), shared includes, and tests.
- **Not for:** Reports or project trackers.

### 🤖 Instructions

- **Location:** `.github/instructions/`
- **Use for:** Copilot/agent instruction files (`*.instructions.md`).
- **Note:** This file is the canonical guide for placement; `file-output-organization.instructions.md` is now deprecated.

### 🎯 Prompts

- **Location:** `.github/prompts/`
- **Use for:** Reusable prompts and prompt indexes (`*.prompt.md`, `prompts.md`).

### 📝 Temporary & Working Files

- **Location:** `.github/tmp/`
- **Use for:** Drafts, intermediate outputs, scratch analysis during workflows.
- **Naming:** `{workflow}-{step}-{date}-{description}.{ext}` (e.g., `analysis-step-2-2025-12-10.json`).
- **Lifecycle:** Create during processing → promote finals to the correct folder → delete leftovers; keep `.gitkeep` in place and ensure `.gitignore` covers this path.

## Examples

- **Good:** Place a labeling audit in `.github/reports/labeling/labeling-report-pr-123.md` and a temporary log in `.github/tmp/labeling-run-2025-12-12.md` that is removed after promotion.
- **Avoid:** Storing reports in repo root or leaving scratch files outside `.github/tmp/`.

## Validation

- Check file paths against the mapping above before creating or moving artefacts.
- Confirm temp files are cleaned from `.github/tmp/` after promotion.
- Verify naming is kebab-case with dates where useful.

## Decision Checklist (before creating a file)

- [ ] Identify file type (report, project, doc, agent, instruction, prompt, temp).
- [ ] Place it in the correct folder above.
- [ ] Apply naming conventions (kebab-case; include dates where useful).
- [ ] Add frontmatter where required (reports/instructions/docs).
- [ ] Update relevant indexes (README or category index) if the file is permanent.
- [ ] For README content/layout, follow `readme.instructions.md`; for diagrams, see `mermaid.instructions.md`.

## Deprecated Path

`file-output-organization.instructions.md` is superseded by this file. Update references to use the UK English spelling: `file-organisation.instructions.md`.

## References

- [instructions.instructions.md](.github/instructions/instructions.instructions.md)
- [readme.instructions.md](.github/instructions/readme.instructions.md)
- [reporting.instructions.md](.github/instructions/reporting.instructions.md)

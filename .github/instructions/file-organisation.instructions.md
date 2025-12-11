---
applyTo: "**"
description: "Canonical instructions for repo and file organisation (UK English): where Copilot/agents must place files, folders, and temporary outputs."
status: "active"
---

# File & Folder Organisation Instructions (UK)

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

### 📋 Task Tracking & Planning
- **Location:** `.github/projects/`
- **Naming:** `{project-name}-{type}.md` (e.g., `context-reduction-tasks.md`, `phase6-planning.md`)
- **Subfolders:** `active/`, `completed/`, `planning/`, `ADR/`

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

## Decision Checklist (before creating a file)

- [ ] Identify file type (report, project, doc, agent, instruction, prompt, temp).
- [ ] Place it in the correct folder above.
- [ ] Apply naming conventions (kebab-case; include dates where useful).
- [ ] Add frontmatter where required (reports/instructions/docs).
- [ ] Update relevant indexes (README or category index) if the file is permanent.
- [ ] For README content/layout, follow `readme.instructions.md`; for diagrams, see `mermaid.instructions.md`.

## Deprecated Path

`file-output-organization.instructions.md` is superseded by this file. Update references to use the UK English spelling: `file-organisation.instructions.md`.

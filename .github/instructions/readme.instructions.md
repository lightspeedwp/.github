---
file_type: "instructions"
title: "README Standards"
description: "Standards for creating and maintaining README files, including required sections, Mermaid usage rules, and consistency expectations."
applyTo: "README.md"
last_updated: "2025-12-10"
status: "active"
owners: ["lightspeedwp/maintainers"]
tags: ["readme", "documentation", "mermaid", "structure", "a11y"]
---

# README Standards (UK)

## Scope & Purpose

These rules apply to every `README.md` in the repository (root and subfolders). They ensure consistency, clarity, accessibility, and alignment with automation agents (`meta.agent`, `linting.agent`). Follow `file-organisation.instructions.md` for where files belong, and `mermaid.instructions.md` for how to craft diagrams.

## Required Sections (Folder READMEs)

- **Frontmatter**: `description`, `last_updated`, optional `references`. `file_type` when required by schema.
- **Title & Overview**: 1–2 sentences on purpose and scope.
- **Structure**: Outline key files/subfolders with short descriptions (bullet or table).
- **Usage/How to Run**: Commands or steps relevant to the folder.
- **Validation/Testing**: How to lint/test what lives here (use `linting.instructions.md` guidance).
- **Governance Links**: Link to applicable instructions/prompts/agents for this area.
- **References**: Links to related docs (schemas, instructions, prompts, agents).

## When to Include Mermaid Diagrams

**Mandatory (add at least one):**

- Complex folder structures or multi-component interactions.
- Workflows/pipelines (CI/CD, testing, release).
- Agent ecosystems or automation flows.
- Data/schema relationships.

**Optional (add if it improves clarity):**

- Straightforward flows with ≤5 steps.
- Small modules with simple dependencies.

**Unnecessary (skip):**

- Single-file or trivially linear content where a short list is clearer.
- Content that changes too frequently to maintain a diagram.

**Placement & A11y:** (see `mermaid.instructions.md` for styling/validation)

- Place after the Overview or before deep technical sections.
- Always explain the diagram in prose and include contextual alt text.
- Keep diagrams readable (≈15 nodes max; split if larger).
- Diagrams should be accessible and meet WCAG AA contrast standards.

## Root README (Repository)

Add/maintain:

- Purpose, status badges, quick start, scripts/commands, contribution, release/version link, governance links (AGENTS.md, instructions index), and one overview Mermaid diagram covering the repo architecture/automation flow.

## Subfolder README Patterns (pick relevant)

- **Agents (`.github/agents/`)**: List agents, specs, scripts, workflows, tests; include an ecosystem Mermaid map if multiple agents interact.
- **Workflows (`.github/workflows/`)**: Index workflows, triggers, key env vars; add CI/CD flow diagram.
- **Instructions (`.github/instructions/`)**: Index instructions with scope; note consolidated files; diagram optional (small index).
- **Prompts (`.github/prompts/`)**: Index prompt files, intended use, guardrails; simple flow diagram optional.
- **Schemas (`.github/schemas/`)**: List schemas, validation commands, consumers; include schema relationship diagram.
- **Reports/Projects/Tasks**: Clarify categories, naming conventions, and pointers to indexes; diagram optional unless complex hierarchy.
- **Tests/Scripts**: How to run, dependencies, coverage/metrics; include testing or tooling flow diagram if non-trivial.

## Consistency & Automation Hooks

- Use UK English spelling in names and content.
- Keep naming aligned with `community-standards.instructions.md#naming-conventions`.
- Ensure `meta.agent` can add badges/footer without conflicts; avoid disabling meta unless necessary.
- Keep lint/test commands accurate; update when scripts change.
- When generating READMEs via prompts/agents, follow this structure and Mermaid policy.
- Use `update-readmes.prompt.md` as the automation entry point for regenerating READMEs with these standards.

## Checklist Before Merging README Changes

- [ ] Frontmatter present and valid.
- [ ] Required sections included (or justified if omitted).
- [ ] Diagram policy applied (mandatory/optional/unnecessary rationale).
- [ ] Links/references verified.
- [ ] Commands tested or marked as examples.
- [ ] Language/spelling in UK English.

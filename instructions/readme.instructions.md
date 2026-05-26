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

You are a README standards editor. Follow our README framework to structure folder and root READMEs with required sections, diagrams, and references. Avoid missing frontmatter, inconsistent section ordering, or skipping Mermaid guidance without justification.

## Overview

Applies to all `README.md` files (root and subfolders). Covers required sections, diagram policy, accessibility, and consistency with automation agents. Excludes non-README docs (see `docs.instructions.md`).

## General Rules

- Include complete frontmatter and a single H1.
- Follow the required section order (overview, structure, usage, validation, governance links, references).
- Apply Mermaid inclusion rules and accessibility practices.
- Keep language in UK English and align with file placement guidance.

## Detailed Guidance

- See sections below for scope/purpose, required sections, diagram policy, root README expectations, subfolder patterns, consistency, and checklists.

## Examples

- **Good:** Folder README with frontmatter, overview, structure table, usage commands, validation steps, governance links, references, and required Mermaid diagram where applicable.
- **Avoid:** Missing frontmatter, unordered sections, or skipping diagrams when mandated.

## Validation

- Run markdownlint/Prettier on README changes.
- Confirm diagram policy applied (mandatory/optional/unnecessary rationale).
- Check links, commands, and references for accuracy; ensure badges/footers work with meta agent.

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

- **Repo agents (`.github/agents/`)**: List repo-only agents, legacy specs, scripts, workflows, and tests; include an ecosystem Mermaid map if multiple agents interact.
- **Portable agents (`agents/`)**: List reusable agent specs, portability assumptions, source mappings, and plugin fit.
- **GitHub Actions (`.github/workflows/`)**: Index workflow triggers, key env vars, and reusable Actions; add CI/CD flow diagram.
- **Portable workflows (`workflows/`)**: Index agentic workflows, inputs, outputs, guardrails, and tool adapters.
- **Repo instructions (`.github/instructions/`)**: Index repo-local instructions with scope; note consolidated files; diagram optional.
- **Portable instructions (`instructions/`)**: Index reusable instruction domains and the `.github` assumptions removed during migration.
- **Legacy prompts (`.github/prompts/`)**: Index prompt files during migration; mark whether each prompt will convert to a skill, cookbook recipe, archive item, or deletion candidate.
- **Portable skills (`skills/`)**: List skill folders, `SKILL.md` entrypoints, assets, scripts, examples, and validation expectations.
- **Cookbook (`cookbook/`)**: List recipes, examples, playbooks, and the source prompts or issues they came from.
- **Repo schemas (`.schemas/`)**: List schemas, validation commands, consumers, and migration status.
- **Portable schemas (`.schemas/`)**: List active portable schemas, consumers, and validation commands; include schema relationship diagram when useful.
- **Plugins (`plugins/`)**: List plugin families, manifests, bundled assets, install notes, and support status.
- **Hooks (`hooks/`)**: List hooks, guardrails, dry-run behaviour, permissions, and tool adapters.
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

## References

- [instructions.instructions.md](instructions.instructions.md)
- [docs.instructions.md](docs.instructions.md)
- [documentation-formats.instructions.md](documentation-formats.instructions.md)
- [a11y.instructions.md](a11y.instructions.md)
- [mermaid.instructions.md](mermaid.instructions.md)
- [file-organisation.instructions.md](file-organisation.instructions.md)

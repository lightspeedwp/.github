---
file_type: "prompt"
title: "Update Mermaid Diagrams"
description: "Refresh Mermaid diagrams across the repository or targeted paths with WCAG AA accessibility and README alignment."
mode: "agent"
tools: ["read", "edit", "search", "shell"]
tags: ["mermaid", "documentation", "a11y", "readme", "automation"]
last_updated: "2025-12-12"
references:
  - path: ".github/instructions/mermaid.instructions.md"
    description: "Diagram crafting, WCAG AA contrast, placement"
  - path: ".github/instructions/readme.instructions.md"
    description: "When diagrams are required/optional in READMEs"
  - path: ".github/instructions/file-organisation.instructions.md"
    description: "File placement and naming rules"
  - path: ".github/instructions/reporting.instructions.md"
    description: "Report categories (including mermaid) and conventions"
  - path: ".github/reports/README.md"
    description: "Reports directory index"
---

# Update Mermaid Diagrams Prompt

## Purpose

Regenerate or add Mermaid diagrams with proper styling, accessibility (WCAG AA), and README alignment. Optional: produce a report under `.github/reports/mermaid/` summarising changes, coverage, and accessibility checks.

## Questions to Ask (gather scope)

1) Scope: update a single file, all files in a folder, or the entire repository?
2) Targets: which path(s) (e.g., `README.md`, `.github/agents/`, `docs/`)? Any exclusions?
3) Diagram need: add missing diagrams per `readme.instructions.md` rules, or just refresh existing ones?
4) Focus: architecture, workflows, testing, agent ecosystems, schema relationships, or other?
5) Accessibility: run contrast/structure checks and report findings? (default: yes)
6) Output: generate a mermaid report under `.github/reports/mermaid/`? Provide desired filename/title.
7) Review: show diff previews before writing, or apply directly?

## Steps

1. Load standards: `mermaid.instructions.md` (how), `readme.instructions.md` (when/placement), `file-organisation.instructions.md` (paths), `reporting.instructions.md` (mermaid reporting).
2. Enumerate target files per scope; skip binary/non-Markdown.
3. For each target:
   - Check if a diagram is mandatory/optional/unnecessary per README rules.
   - Refresh or add diagrams using Mermaid styling, labels, WCAG AA contrast, and alt-text/context.
   - Keep diagrams near overview/section entry; avoid colour-only meaning.
4. Validate:
   - Mermaid syntax (mermaid.live or VS Code preview).
   - Contrast (WCAG AA) using recommended palettes/classes; confirm light/dark readability.
   - Links and surrounding prose clarity.
5. Reporting (optional):
   - Summarise files touched, diagrams added/updated, and accessibility notes.
   - Save report to `.github/reports/mermaid/{subject}-{YYYY-MM-DD}.md` with proper frontmatter.
6. Present results and next steps; include any skipped files with reasons.

## Output Expectations

- UK English, kebab-case filenames.
- Diagrams sized reasonably (~15 nodes; split if larger).
- Context + alt description in prose; labelled nodes/edges; WCAG AA-compliant colours.
- Clear summary of changes and any follow-up actions.

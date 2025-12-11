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
8) Palette: confirm use of an approved WCAG AA palette pair from `mermaid.instructions.md` (up to 20 listed).
9) Labels: confirm edge/node label placement (no overlaps; mid-edge labels; minimal crossings).
10) Accessible metadata: confirm `accTitle` and `accDescr` are present and meaningful; confirm nearby prose summary/HTML/table alternative when diagrams are key.

## Phase 1 — Validate (Audit Only)

1. Load standards: `mermaid.instructions.md` (how), `readme.instructions.md` (when/placement), `file-organisation.instructions.md` (paths), `reporting.instructions.md` (mermaid reporting).
2. Enumerate target files per scope; skip binary/non-Markdown.
3. For each target:
   - Determine if a diagram is mandatory/optional/unnecessary per README rules.
   - Validate syntax (mermaid.live or VS Code preview).
   - Validate contrast using approved palette pairs/classes; check light/dark readability.
   - Check labels: node labels centered; edge labels mid-edge; minimal crossings; no overlaps.
   - Check accessible metadata: `accTitle` short and descriptive; `accDescr` present (one-line or block); nearby prose summary; alternative HTML/table if diagram is key.
   - Check placement: near overview/section entry; avoid colour-only meaning.
4. Record findings:
   - List issues per file (syntax, contrast, labels, metadata, placement, missing/extra diagrams).
   - Save an audit report to `.github/reports/mermaid/{subject}-{YYYY-MM-DD}.md` with frontmatter.
5. Present the audit summary and request approval for fixes.

## Phase 2 — Fix (Apply Changes)

1. Confirm scope to fix (all issues, or selected files/issues).
2. Apply changes:
   - Add/refresh diagrams; enforce palette classes, labels, `accTitle`/`accDescr`, summaries/alternatives.
   - Adjust placement per `readme.instructions.md`; split diagrams if crowded.
3. Re-validate quickly:
   - Syntax, contrast, label placement, accessible metadata.
4. Reporting:
   - Update or create the mermaid report noting fixes and any residual warnings.
5. Present results, diffs applied, and any follow-up actions.

## Output Expectations

- UK English, kebab-case filenames.
- Diagrams sized reasonably (~15 nodes; split if larger).
- Context + alt description in prose; labelled nodes/edges; WCAG AA-compliant colours; `accTitle`/`accDescr` set; nearby summary/alternative when needed.
- Clear summary of changes and any follow-up actions.

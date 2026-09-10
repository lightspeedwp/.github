---
file_type: report
title: "PRD Agent — agent/ Folder Reconciliation Report"
description: "File-by-file diff of agents/prd-agent/agent versus agents/prd-factory-planner-agent/agent, to determine what actually needs merging"
created_date: "2026-09-10"
last_updated: "2026-09-10"
status: active
tags:
  - prd
  - agent-standards
  - reconciliation
owners:
  - lightspeedwp/maintainers
---

# PRD Agent — `agent/` Folder Reconciliation Report

**Related:** [SKILL_RECONCILIATION_REPORT.md](./SKILL_RECONCILIATION_REPORT.md) · [ROOT_FILES_RECONCILIATION_REPORT.md](./ROOT_FILES_RECONCILIATION_REPORT.md) · [FOLDER_STRUCTURE_PLAN.md](./FOLDER_STRUCTURE_PLAN.md) · [PLANNING.md](./PLANNING.md)

**Purpose:** Same question as the skills report, applied to the `agent/` export tree instead of `skills/`: does `agents/prd-factory-planner-agent/agent/` contain content that needs merging into `agents/prd-agent/agent/`? Method: `diff -rq` for structure, then `diff | grep -c '^[<>]'` per shared file to separate cosmetic noise from real content.

**Headline finding: no, with one exception that turns out to be fictional.** `prd-factory-planner-agent/agent/` has zero files that don't already exist in `prd-agent/agent/`. Of the 135 files shared by both, 134 differ only in decorative footer taglines and YAML quoting style. Exactly one file — `instructions/AGENTS.md` — has real prose differences, but that content describes a skill catalogue that doesn't exist on disk in either folder (see §3).

---

## 1. Structure comparison

| | `prd-agent/agent/` | `prd-factory-planner-agent/agent/` |
|---|---:|---:|
| Total files | 258 | 135 |
| Top-level dirs | `assets/`, `configuration/`, `instructions/`, `other/`, `references/`, `scripts/`, `templates/` | `configuration/`, `instructions/`, `other/`, `references/`, `templates/` (no `assets/`, no `scripts/`) |
| Files unique to this folder | 28 (see §2) | **0** |
| Files shared with the other folder | 135 | 135 |

## 2. The 28 files only in `prd-agent/agent/`

Entire directories `assets/` and `scripts/`, plus these `references/` and `templates/` subdirectories that `prd-factory-planner-agent` never had:

- `references/{business-context.md, docs/, examples/, fixtures/, intake/, memory-current/, memory-templates/, profiles/, prompts/, references/, rollout/, schemas/, tests/}`
- `configuration/{codex-config.toml, plugins/}`
- `templates/{README.md, estimate-pack-template.md, gap-analysis-template.md, handoff-pack-template.md, planning-brief-template.md, prd-template.md, project-intake-summary-template.md, project-status-update-template.md, quality-review-template.md, technical-brief-template.md, validation-report-template.md}`

These already exist only in `prd-agent` — nothing to pull from `prd-factory-planner-agent` here, they simply carry forward.

## 3. The 135 shared files

| Diff size | Count | Nature |
|---|---:|---|
| 0 lines (byte-identical) | 36 | — |
| 2 lines changed | 86 | Footer tagline swap only (e.g. *"Have questions? Ping us on GitHub! 🐙..."* vs *"Built by 🧱 LightSpeedWP with ☕, 🚀..."*) |
| 8-16 lines changed | 12 | YAML formatting only — quoted vs unquoted scalars (`title: X` vs `title: "X"`) and spacing inside flow maps (`{type: string}` vs `{ type: string }`), plus the same footer swap. Verified on `memory-schemas/projectbrief.schema.yaml`, `memory-schemas/assumptions-and-risks.schema.yaml`, `memory-schemas/decisions.schema.yaml`, the `tour-operator-blog-questionnaire.md` frontmatter, and four `other/memory/*` sample-project files (confirmed fictional/demo data per prior audit) — all cosmetic. |
| **83 lines changed** | **1** | `instructions/AGENTS.md` — real content difference, see below. |

**133 of 135 shared files are cosmetically identical.** The one substantive exception:

### `instructions/AGENTS.md`

`prd-factory-planner-agent`'s copy replaces `prd-agent`'s ~10-line "## Skill Routing" section with a ~90-line "## Available Skills" catalogue, claiming **39 custom skills** across four categories (PRD Generation & Structuring, Timeline/Phasing & Planning, Stakeholder Alignment & Requirements, Documentation & Export), naming skills like `prd-factory-planner`, `prd-combined`, `prd-outline-generator`, `timeline-estimator`, `milestone-planner`, `phase-sequencer`, `dependency-mapper`, `stakeholder-coordinator`, `communication-planner`, `alignment-validator`, `feedback-aggregator`, `requirement-validator`, `scope-definer`, `proposal-desk`, `reporting-generator`, `export-formatter`, `change-tracker`.

**None of these skill names exist anywhere on disk** — not in `prd-factory-planner-agent/skills/` (24 real skills, all audited in SKILL_RECONCILIATION_REPORT.md §1), not in `prd-agent/skills/` (45 real skills), not in either `manifests/skills.md`. This section is aspirational/fabricated documentation — it describes a skill catalogue that was apparently planned or imagined but never actually built. `prd-agent`'s shorter "Skill Routing" section, by contrast, references two skills by their real Codex-session skill IDs (`hsk_69f9585f8f14819181de457249d99ecc` for `evidence-locker`, `hsk_6a07336046a48191b72a759cede0acfb` for `markdown-content-validator`) that do correspond to real, existing skills — but those IDs are session-specific Codex artifacts, not stable identifiers, and shouldn't survive into the cleaned-up structure either.

**Neither version of this section is usable as-is.** `prd-agent`'s references dead session IDs; `prd-factory-planner-agent`'s documents skills that don't exist. Both need rewriting from scratch against the real, reconciled skill list once SKILL_RECONCILIATION_REPORT.md's Phase 3 work lands.

---

## 4. Recommendation

1. **Delete `agents/prd-factory-planner-agent/agent/` outright along with the rest of that folder** (consistent with the skills-report recommendation to retire `prd-factory-planner-agent/` entirely) — it contributes zero unique files and its one differentiated section is fictional.
2. **`prd-agent/agent/` itself is still not the target shape** — this report only answers "does the other folder have anything worth merging in" (no). It doesn't change FOLDER_STRUCTURE_PLAN.md's separate finding that `prd-agent/agent/`'s own nested `configuration/instructions/other/references/scripts` tree should be replaced by the flatter `docs/` + `templates/` + `skills/*/references` structure in §3 of that plan — including deleting the sample client memory banks under `other/memory/` (confirmed fictional, routine cleanup) and the raw MCP plugin-cache dumps under `configuration/plugins/`.
3. **Rewrite `instructions/AGENTS.md`'s skill section from scratch** once the skill folder is finalized (post SKILL_RECONCILIATION_REPORT.md Phase 3), listing only real skills by their final names — not session IDs, not invented ones.

No further reconciliation work is needed against `prd-factory-planner-agent/agent/` specifically — every open question here folds into the existing FOLDER_STRUCTURE_PLAN.md execution phases.

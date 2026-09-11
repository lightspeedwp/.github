# Implementation Plan: PRD Agent Folder Consolidation

**Branch**: `001-prd-agent-consolidation` (spec directory only — work continues on `feat/prd-agent`; no separate branch, per the project's decision to skip the git extension) | **Date**: 2026-09-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `.github/specs/001-prd-agent-consolidation/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Consolidate `agents/prd-agent/` and `agents/prd-factory-planner-agent/` into one canonical, spec-aligned `agents/prd-agent/` folder: merge the 3 forked skills sitting in a leftover `skills/hermes/` folder, promote the 1 unflattened skill, decide the fate of an overlapping-skill tier, port missing `AGENT.md` content, replace both boilerplate `README.md` files with one real one, rewrite the dead-link-riddled `instructions/AGENTS.md` skill-routing section, delete `agents/prd-factory-planner-agent/` entirely, clean up remaining export cruft, and rewrite `claude/agent.md`/`copilot/agent.md` with real, provider-loadable frontmatter. Phase 0 research (research.md) found the scope is slightly larger than the spec assumed in two places:
- **D1 (Registry Dependency)**: `agents/mode-prd.agent.md` (FR-010) is a tracked asset in workflows/memory/registry, not just a standalone file → addressed in tasks.md Phase 4 (T045-T047)
- **D2 (Generic Tier Scope Gap)**: The "10-skill generic tier" (FR-003, spec line 90) fate is flagged as an edge case but lacked an explicit decision gate → addressed in tasks.md Phase 1 (new T004 decision task)

Both are now explicitly flagged in tasks.md as mandatory Phase 1/4 decisions blocking downstream work.

## Technical Context

This feature is a content/file reorganisation within an existing repository, not new software — most of the standard Technical Context fields don't apply in their usual sense.

**Language/Version**: N/A — no code is written; touched files are Markdown (with YAML frontmatter) and existing YAML config (`memory-registry.yaml`, `inventory-lock.json`)

**Primary Dependencies**: N/A

**Storage**: Filesystem + git history within this repository; no database or external storage

**Testing**: Manual/scripted validation per [quickstart.md](./quickstart.md) — `diff`/`cmp` for content-preservation checks (the method the existing reconciliation reports already use), `grep` for dangling-link and registry-consistency checks, and this repo's own `npm run validate:frontmatter` / `npm run lint:md` gates

**Target Platform**: N/A — repository content, not a running service. Agent definitions target two *consumer* platforms (Claude Code, GitHub Copilot) whose loading behaviour is the subject of SC-002/SC-003, documented as contracts rather than a deployment target

**Project Type**: Documentation/content restructuring — single folder tree (`agents/prd-agent/`), no frontend/backend split

**Performance Goals**: N/A

**Constraints**: Must not touch any file in this repository's locked-configuration list (`CLAUDE.md` — `.github/labels.yml`, `.github/issue-types.yml`, `ISSUE_TEMPLATE/*`, `PULL_REQUEST_TEMPLATE/*`); must not add a `references` frontmatter field to any instruction file; must preserve git history where reasonable (prefer `git mv` over delete-and-recreate for content that survives unchanged); all work continues on the existing `feat/prd-agent` branch (already validated against this repo's branch-naming rule) — no new branch is created by this feature

**Scale/Scope**: One target folder (`agents/prd-agent/`), one folder to delete (`agents/prd-factory-planner-agent/`), **46 skill directories baseline** (45 top-level + 1 promoted from hermes/) down to 28 (or 27 after frontend-skill removal per spec.md SC-001), 2 provider agent definitions (Claude, Copilot; OpenAI out of scope), 3 root docs (`AGENT.md`, `README.md`, `instructions/AGENTS.md`), 1 external memory-registry entry with 2 companion files

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` is still the unfilled template (no project-specific principles have been ratified for spec-kit's own constitution mechanism). In its absence, this repo's actual operative governance is `CLAUDE.md`/`AGENTS.md`, which was checked directly:

| Gate | Result | Evidence |
|---|---|---|
| No edits to locked config files (`.github/labels.yml`, `.github/issue-types.yml`, issue/PR templates) | ✅ PASS | This feature touches only `agents/`, `docs/AGENT-INDEX.md`, and `workflows/memory/` — none are on the locked list |
| Branch naming (`{type}/{scope}-{title}`) | ✅ PASS | Continuing on existing `feat/prd-agent`; no new branch created (git extension not enabled — spec.md, plan.md header) |
| No `references` frontmatter field on instruction files | ✅ PASS | Not applicable to skill/agent-definition frontmatter fields used here (`name`, `description`, `tools`, `model`, `mcp-servers`); will re-verify on the actual rewritten files in Phase 1 implementation |
| Reusable/portable assets stay under top-level folders, not `.github/` | ✅ PASS | `agents/` is exactly the correct top-level location per `CLAUDE.md`'s folder table; this feature reinforces that, it doesn't violate it |

**Result**: PASS, no violations to justify. Re-checked post-Phase-1: still PASS — the two new artifacts this phase adds (`contracts/memory-registry-entry.md`'s guidance, the D1/D2 findings in research.md) don't introduce any new constraint the gates above didn't already cover.

## Project Structure

### Documentation (this feature)

```text
.github/specs/001-prd-agent-consolidation/
├── spec.md               # Feature specification (/speckit-specify command output)
├── plan.md                # This file (/speckit-plan command output)
├── research.md             # Phase 0 output — D1 (mode-prd.agent.md registry dependency), D2 (generic-tier scope gap)
├── data-model.md           # Phase 1 output — Skill, Agent Definition, Source Folder, Memory Registry Entry, Documentation Surface
├── contracts/               # Phase 1 output
│   ├── claude-agent-frontmatter.md
│   ├── copilot-agent-frontmatter.md
│   └── memory-registry-entry.md
├── quickstart.md            # Phase 1 output — validation commands per success criterion
└── checklists/
    └── requirements.md      # Spec quality checklist (/speckit-specify command output)
# tasks.md is Phase 2 output (/speckit-tasks command) — NOT created by /speckit-plan
```

### Source Code (repository root)

This is a content-reorganisation feature, not application code — there is no `src/`/`tests/` split. The relevant tree is the one target folder, before → after:

```text
# Current state (before)
agents/
├── prd-agent/
│   ├── AGENT.md                       # missing Integration Points + 2 capability tags (FR-004)
│   ├── README.md                      # Codex export boilerplate, dangling links (FR-005)
│   ├── claude/agent.md                # placeholder frontmatter, not loadable (FR-009)
│   ├── copilot/agent.md               # placeholder frontmatter, not loadable (FR-009)
│   ├── openai/                        # out of scope
│   ├── instructions/AGENTS.md         # dead Codex session IDs in routing section (FR-006)
│   ├── agent/                         # legacy export tree — memory banks, plugin-cache dumps (FR-008)
│   └── skills/
│       ├── hermes/                     # 4 unflattened leftovers (FR-001 ×3, FR-002 ×1)
│       ├── <~43 other skill dirs>      # includes the 3-generation overlap research.md D2 found
│       └── ...
├── prd-factory-planner-agent/          # deleted entirely once migrated (FR-007)
└── mode-prd.agent.md                   # tracked in workflows/memory/registry/ — retire per FR-010

# Target state (after) — per FOLDER_STRUCTURE_PLAN.md §3
agents/
└── prd-agent/
    ├── AGENT.md                       # Integration Points ported, capability tags added
    ├── README.md                      # single real README, no dangling links
    ├── CHANGELOG.md                   # new — currently missing entirely
    ├── claude/agent.md                # real, loadable frontmatter (contracts/claude-agent-frontmatter.md)
    ├── copilot/agent.md               # real, loadable frontmatter (contracts/copilot-agent-frontmatter.md);
    │                                  #   becomes the sole Copilot source of truth replacing mode-prd.agent.md
    ├── openai/
    ├── instructions/AGENTS.md         # rewritten skill-routing section, no dead references
    └── skills/                        # curated, deduplicated; no hermes/ subfolder; count TBD pending FR-003 audit
```

**Structure Decision**: Single target folder (`agents/prd-agent/`), matching `FOLDER_STRUCTURE_PLAN.md` §3's already-agreed target structure. No new top-level directories are introduced by this feature; `agents/prd-factory-planner-agent/` is removed and `workflows/memory/registry/` gets one entry updated (research.md D1), not restructured.

## Complexity Tracking

*No Constitution Check violations — this section is intentionally empty.*

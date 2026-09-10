---
file_type: report
title: "PRD Agent — Root Files Reconciliation Report"
description: "Audit of agents/prd-factory-planner-agent root files (AGENT.md, README.md) versus agents/prd-agent, to determine what needs merging"
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

# PRD Agent — Root Files Reconciliation Report

**Related:** [SKILL_RECONCILIATION_REPORT.md](./SKILL_RECONCILIATION_REPORT.md) · [AGENT_FOLDER_RECONCILIATION_REPORT.md](./AGENT_FOLDER_RECONCILIATION_REPORT.md) · [FOLDER_STRUCTURE_PLAN.md](./FOLDER_STRUCTURE_PLAN.md) · [PLANNING.md](./PLANNING.md)

**Scope:** the files sitting directly at the root of each agent folder — `AGENT.md`, `README.md`, `checksums.sha256` — as distinct from `skills/` and `agent/`, already covered in the two linked reports above.

**Result is different from the previous two audits.** `skills/` and `agent/` turned out to be near-total duplicates with only cosmetic differences. The root `AGENT.md` files are **genuinely different, independently-authored specs** — one already reflects the merge, one still describes the pre-merge factory-planner agent standalone — and there's a small amount of real content in the factory-planner version worth folding in. `README.md`, by contrast, is auto-generated export boilerplate on both sides with nothing worth keeping from either.

---

## 1. Root-level inventory

| File | `prd-agent` | `prd-factory-planner-agent` |
|---|---|---|
| `AGENT.md` | 163 lines, `name: prd` | 151 lines, `name: prd-factory-planner` |
| `README.md` | 82 lines | 104 lines |
| `CONTEXT_DETECTION.md` | 25,032 bytes | — (doesn't exist) |
| `INTEGRATION_GUIDE.md` | 24,422 bytes | — (doesn't exist) |
| `ORGANIZATION_CONTEXT.md` | 16,498 bytes | — (doesn't exist) |
| `checksums.sha256` | already deleted (unstaged) | already deleted (unstaged) |
| `CONTRIBUTING.md` | referenced by README.md but **does not exist** | referenced by README.md but **does not exist** |

`CONTEXT_DETECTION.md`, `INTEGRATION_GUIDE.md`, and `ORGANIZATION_CONTEXT.md` are `prd-agent`-only (added 2026-09-04, part of the sibling prompt-improvements track) — nothing to reconcile, factory-planner never had equivalents.

---

## 2. `AGENT.md` — real differences, not cosmetic

Unlike `skills/` and `agent/`, these two files were each independently written to describe their own agent, and only `prd-agent`'s was ever updated to reflect the 2026-07-23 merge.

### 2.1 `prd-agent/AGENT.md` already accounts for the merge

It has a "Merge Notes" section explicitly attributing capabilities to each source agent, a "Key Capabilities" section covering PRD & Documentation, Feature Planning & Prioritization, Timeline & Roadmap, and Stakeholder Alignment, and links to real, existing resources: `plugins/lightspeed-planning-prd/` and `cookbook/project-planning-and-prd-playbook.md` (both verified present in the repo). Its frontmatter `tools:` list (8 items: `prd_create`, `prd_validate`, `feature_prioritizer`, `user_story_generator`, `timeline_planner`, `roadmap_generator`, `risk_assessor`, `sprint_planner`) is broader than factory-planner's.

### 2.2 `prd-factory-planner-agent/AGENT.md` was never updated post-merge, but has one section worth checking before deletion

It still presents itself as a standalone agent (frontmatter `name: prd-factory-planner`, its own `tools:`/`capabilities:` lists) and repeats the same fabricated "39 custom skills" catalogue already flagged in AGENT_FOLDER_RECONCILIATION_REPORT.md §3 (skill names like `prd-combined`, `phase-sequencer`, `alignment-validator` that don't exist on disk) — that part is not usable.

One section is **not** covered anywhere in `prd-agent`'s docs:

> ## Integration Points
> This agent integrates with:
> - **Linear:** Issue and project creation, timeline synchronization
> - **Figma:** Design specification linking and component reference
> - **Slack:** Stakeholder notifications and approval workflows
> - **Google Workspace:** Document collaboration and stakeholder review

Checked against reality:

| Claimed integration | Backed by an actual plugin config? |
|---|---|
| Linear | ✅ Yes — `agent/configuration/plugins/linear/` exists in `prd-agent` |
| Google Workspace | ✅ Yes — `agent/configuration/plugins/google-drive/` exists in `prd-agent` |
| Figma | ❌ No — no Figma plugin config anywhere in either folder |
| Slack | ❌ No — no Slack plugin config anywhere in either folder |

So half of this section is real (Linear, Google Workspace — genuinely wired up but never documented in `prd-agent/AGENT.md`), and half is the same kind of aspirational content already seen in the skills catalogue (Figma, Slack — named but never actually configured). **Recommendation: add an "Integration Points" section to the rebuilt `prd-agent/AGENT.md` documenting Linear and Google Workspace only** (drop Figma/Slack, or list them explicitly as "not yet configured" if there's a real intent to wire them up later — that's a product decision, not a documentation one).

Also worth noting: `prd-agent`'s GitHub plugin config (`agent/configuration/plugins/github/`) isn't mentioned as an "integration point" in *either* AGENT.md, despite existing and being used by several skills (`lightspeed-github-issue-drafter`, etc.) — the same section should include GitHub too when rewritten.

### 2.3 Frontmatter field-by-field

| Field | `prd-agent` | `prd-factory-planner-agent` | Action |
|---|---|---|---|
| `name` | `prd` | `prd-factory-planner` | Keep `prd-agent`'s (`prd-factory-planner` retires with the folder) |
| `tools` | 8 semantic tool names | 4 (`prd_generator`, `timeline_estimator`, `stakeholder_coordinator`, `requirement_validator`) | No registry/catalogue.ts reference to either list found in the repo (grepped) — these are documentation-only, not wired to a runtime. `prd-agent`'s list already semantically covers the same ground (`timeline_planner` ≈ `timeline_estimator`); nothing to add. |
| `capabilities` | 14 items | 8 items | `prd-agent`'s superset already covers all 8 conceptually except `resource-allocation` and `scope-definition`, which aren't elsewhere in `prd-agent`'s list either — worth adding those two capability tags since factory-planner's `Resource Allocation` and `Scope Definition` bullet points under "Capabilities" describe real, distinct planning outputs, not fabricated ones. |
| `domain` | `planning` | `product-management` | Keep `prd-agent`'s — `prd` is the canonical registry entry per `agents/prd.agent.md`'s catalogue pointer. |

---

## 3. `README.md` — both are Codex export-tool boilerplate, neither is real documentation

Both files are auto-generated by the same export process, describing the *export operation* rather than the agent's purpose or usage:

- `prd-agent/README.md`: "This archive contains the accessible, file-backed agent instructions... Agent name: PRD Agent, Created UTC: 2026-07-14T11:48:53Z, Skills discovered: 45..."
- `prd-factory-planner-agent/README.md`: "This package contains the files and skill folders that were readable... Standardization Status: Phase 2A Complete... 39 total skills documented..."

Both:

- Reference `checksums.sha256`, which no longer exists in either folder (already deleted, unstaged, per current working tree state) — dangling reference on both sides.
- Link to `CONTRIBUTING.md`, which **does not exist** in either folder — dangling link on both sides.
- Report file/skill counts that are now stale on both sides (`prd-agent` says "Skills discovered: 45" from the pre-flatten era; `prd-factory-planner-agent` says "932 files checksummed" and repeats the fabricated 39-skill breakdown).

**Neither README is worth merging from — both need to be replaced** with a real, human-facing README per FOLDER_STRUCTURE_PLAN.md §3 (what the agent does, how to install it per provider, links to the real skill list). There is no unique factual content in the factory-planner version not already covered (better) in `prd-agent`'s equivalent auto-generated summary.

---

## 4. Recommendation

1. **`AGENT.md`**: keep `prd-agent`'s as the base. Before deleting `prd-factory-planner-agent/AGENT.md`, port forward exactly two things: (a) an "Integration Points" section listing Linear, Google Workspace, and GitHub (Figma/Slack only if there's a real plan to wire them up — flag as a product decision), and (b) the `resource-allocation` and `scope-definition` capability tags.
2. **`README.md`**: discard both. Neither contains real product documentation — replace with a proper README per FOLDER_STRUCTURE_PLAN.md's target structure, and drop the dangling `checksums.sha256`/`CONTRIBUTING.md` references rather than recreating those files.
3. **`CONTEXT_DETECTION.md` / `INTEGRATION_GUIDE.md` / `ORGANIZATION_CONTEXT.md`**: no action — `prd-agent`-only, nothing to reconcile.
4. This closes out the root-file portion of the merge. Combined with SKILL_RECONCILIATION_REPORT.md and AGENT_FOLDER_RECONCILIATION_REPORT.md, `agents/prd-factory-planner-agent/` has now been fully audited end to end: the only content worth carrying forward across the entire folder is the two AGENT.md items in §4.1 above. Everything else is either an exact/cosmetic duplicate or aspirational content that doesn't correspond to anything real.

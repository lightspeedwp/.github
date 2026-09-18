---
file_type: planning
title: "PRD Agent — Folder Structure & Skill Consolidation Plan"
description: "Audit of the current agents/prd-agent and agents/prd-factory-planner-agent exports plus a target structure aligned with the Agent Skills specification, Claude Code, and GitHub Copilot"
created_date: "2026-09-10"
last_updated: "2026-09-10"
status: draft
tags:
  - prd
  - agent-standards
  - skills
  - restructuring
owners:
  - lightspeedwp/maintainers
---

# PRD Agent — Folder Structure & Skill Consolidation Plan

**Status:** 🟡 Draft — for review before execution | **Owner:** Ash Shaw

**Related:** [PLANNING.md](./PLANNING.md) · [README.md](./README.md) · [OPENSPEC.md](./OPENSPEC.md) · [COMPLETION_SUMMARY.md](./COMPLETION_SUMMARY.md) · [IMPLEMENTATION_NOTES.md](./IMPLEMENTATION_NOTES.md)

**Detailed audits backing §4-5 below:** [SKILL_RECONCILIATION_REPORT.md](./SKILL_RECONCILIATION_REPORT.md) · [AGENT_FOLDER_RECONCILIATION_REPORT.md](./AGENT_FOLDER_RECONCILIATION_REPORT.md) · [ROOT_FILES_RECONCILIATION_REPORT.md](./ROOT_FILES_RECONCILIATION_REPORT.md)

---

## Why this document exists

PR #1139 and PR #1196 (2026-07-22/23) recorded `prd-agent` + `prd-factory-planner-agent` as "merged" and this project's docs mark that work 100% complete. That merge was **catalogue-level only**: two lightweight registry entries (`agents/prd.agent.md`, `agents/prd-factory-planner.agent.md`) were created/updated, but the two underlying folders — `agents/prd-agent/` (1,637 files) and `agents/prd-factory-planner-agent/` (932 files) — were never actually consolidated. Both still exist, both still carry near-identical skill sets that have since forked, and neither folder is in a shape that Claude Code or GitHub Copilot can actually load. This document audits the current state and proposes a target structure before any files move.

**No files have been changed as part of this document.** It is a plan for review.

**2026-09-10 update:** the three linked reconciliation reports above have since audited `agents/prd-factory-planner-agent/` file-by-file across its entire tree (`skills/`, `agent/`, and root `AGENT.md`/`README.md`). The real picture turned out simpler than §1 below assumed when first drafted: the folder contributes almost no unique content — it's the same Codex export run twice, with cosmetic differences and a couple of fabricated skill catalogues in its narrative docs. §4 and §5 have been updated accordingly; §1's original findings (duplication counts, provenance, client-data flag) still stand as the initial evidence base.

---

## 1. Current state audit

### 1.1 Provenance: this is a raw environment export, not a curated template

Every path inside both folders traces back to a single local Codex CLI session, per `agents/prd-agent/manifests/skills.md`:

```
/root/.codex/skills/hermes/lightspeed-prd-generator          → skills/agent-attached/lightspeed-prd-generator
/root/.codex/skills/builtins/presentations                   → skills/local/presentations
/root/.codex/skills/.system/skill-creator                    → skills/local/skill-creator
/root/.codex/plugins/cache/openai-marketplace/figma/local/…  → skills/plugin-provided/figma/*
```

The "export" tool dumped the *entire* local agent workspace — custom skills, Codex's own built-in skills, third-party plugin skill caches, and per-project memory — into the repo verbatim. Nothing was curated for org-wide reuse.

### 1.2 File counts

| Location | Files | Notes |
|---|---:|---|
| `agents/prd-agent/` | 1,637 | |
| `agents/prd-factory-planner-agent/` | 932 | |
| `agents/prd-agent/skills/` | 1,053 of the 1,637 | i.e. 64% of the folder is the skills export |
| `agents/prd-factory-planner-agent/skills/` | 781 of the 932 | 84% of the folder |

### 1.3 Duplication — three separate copies of the same ~24 skills

The 24 LightSpeed-authored "hermes" skills (`lightspeed-prd-writer`, `lightspeed-estimation-planner`, `lightspeed-delivery-planner`, `lightspeed-project-intake`, `lightspeed-qa-planner`, etc.) exist in **three places at once**, and all three have diverged:

1. `agents/prd-agent/skills/agent-attached/hermes/lightspeed-*` — newest naming, per-skill `rollout/rename-notes.md` marks these as the replacement for (2).
2. `agents/prd-agent/skills/agent-attached/lightspeed-*` (flat, no `hermes/`) — older naming (e.g. `lightspeed-prd-generator` instead of `lightspeed-prd-writer`), explicitly superseded by (1) per its own rename notes, but never deleted.
3. `agents/prd-factory-planner-agent/skills/agent-attached/lightspeed-*` (flat) — same old names as (2), but **not byte-identical to (2)** — every file in `lightspeed-prd-generator/` differs between the two agent folders (confirmed via `diff -rq`). Content has forked across the two agent folders independently.

Net effect: there is no single authoritative copy of any of these 24 skills today.

### 1.4 Vendored platform/plugin skills that don't belong in a PRD template

Both folders also vendor entire copies of Codex/Claude platform built-ins and third-party connector skills, none of which are PRD-specific and none of which this repo can keep in sync with upstream:

- `skills/local/{pdf,imagegen,spreadsheets,presentations,documents,skill-creator,skill-installer,plugin-creator,openai-docs,frontend-skill,platform-managed}`
- `skills/plugin-provided/{figma/* (11 skills), github/* (4), gmail/* (2), google-drive/* (5), linear}`

That's roughly **800+ of the 1,053 files** under `agents/prd-agent/skills/`. These are the same skills already available generically through the Figma/GitHub/Gmail/Google Drive/Linear plugins and the Claude/Codex platforms — vendoring them here just adds drift risk (they'll silently go stale) with no benefit.

### 1.5 Sample project memory data (resolved — not real clients)

`agents/prd-agent/agent/other/memory/` contains memory-bank folders named after fictional/sample projects (`cape-trails-safaris`, `bicycling-beyond-the-bike`, `queenspark-mobile-sales-improvements`, `novanews-reporter-dashboard`, `southern-destinations-asc-faqs`, `safari-lodge-wordpress-rebuild`, `tour-operator-wordpress-refresh`, plus `lightspeedwp-agency` itself), each with `activeContext.md`, `projectbrief.md`, decision logs, and risk registers.

**Confirmed 2026-09-10: this is sample/demo data, not real client engagements.** No confidentiality risk — this folds into the routine "remove the export noise" cleanup in §5 Phase B/E rather than needing separate urgent handling. It may still be worth keeping one or two of these as illustrative examples under a clearly-labeled `skills/*/examples/` directory if they demonstrate a skill's expected output well; otherwise delete with the rest of `agent/other/`.

### 1.6 Neither `claude/agent.md` nor `copilot/agent.md` is actually loadable

Checked against the two real client specs:

- **Claude Code** loads subagents from `.claude/agents/*.md` with YAML frontmatter (`name`, `description`, optional `tools`/`model`). `agents/prd-agent/claude/agent.md` has **no frontmatter at all** — it opens with an H1, then a CI badge block (285 lines of `![...]` badges from the repo's automated badge injector), then unstructured prose. It would not load as a subagent if copied into `.claude/agents/`.
- **GitHub Copilot custom agents** load from `.github/agents/*.agent.md` with YAML frontmatter (`name`, `description`, `tools` array, optional `mcp-servers`) — [GitHub Docs: Custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration). `agents/prd-agent/copilot/agent.md` has the same problem: badge block, then prose, no frontmatter.

By contrast, `agents/mode-prd.agent.md` (a separate, older single-file spec at the `agents/` root, not inside either portable folder) **already has correct frontmatter** — `name`, `description`, `tools: […]`, `metadata.guardrails` — and would work if placed at `.github/agents/`. It predates the portable-folder convention and was never reconciled with it (this is exactly what Phase 4 / issue #1899 in the sibling project, `prd-agent-prompt-improvements-2026-08`, left as an open "archive or sync" decision).

### 1.7 What's actually good and should be kept as-is

- The top-level provider split — `shared/core-prompt.md`, `claude/`, `copilot/`, `openai/`, `manifests/` — matches the org's Multi-Provider Agent Standardization pattern (Epic #1079) used by ~16 other agents. Keep the shape; fix the file contents (§1.6).
- `agents/prd.agent.md` and `agents/prd-factory-planner.agent.md` are lightweight **catalogue pointer** files (`implementation: "agents/prd-agent/"`) feeding the org's agent registry. These are fine and should keep pointing at the merged folder.
- Individual `SKILL.md` files already comply with the Agent Skills spec's *required* fields (`name` matches parent directory, lowercase-hyphenated; `description` is specific). The gap is organizational (duplication, non-standard extra directories), not frontmatter correctness.

---

## 2. Reference specs this plan targets

### 2.1 Agent Skills specification ([agentskills.io/specification](https://agentskills.io/specification))

- A skill is a directory with a required `SKILL.md` (YAML frontmatter + Markdown body) and optional `scripts/`, `references/`, `assets/`.
- Frontmatter: `name` (required, ≤64 chars, lowercase/digits/hyphens, must match directory name), `description` (required, ≤1024 chars, states what + when), `license`, `compatibility`, `metadata`, `allowed-tools` (all optional).
- Keep `SKILL.md` under ~500 lines / 5000 tokens; push detail into `references/`; keep file references one level deep.
- Extra directories beyond `scripts/`/`references/`/`assets/` are technically allowed but not part of the spec — current skills add `templates/`, `schemas/`, `tests/`, and a per-skill `agents/openai.yaml`, none of which are standard.

### 2.2 GitHub Copilot custom agents ([docs.github.com](https://docs.github.com/en/copilot/reference/custom-agents-configuration))

- Live at `.github/agents/<name>.agent.md` in a *consuming* repo.
- Frontmatter: `name`, `description` (required), `tools` (array), optional `mcp-servers`.
- Body is the system prompt (30,000 char max).

### 2.3 Claude Code subagents

- Live at `.claude/agents/<name>.md` in a consuming repo (or ship as a plugin agent).
- Frontmatter: `name`, `description`, optional `tools`, `model`, `color`.
- Skills are separate from subagents and use the Agent Skills `SKILL.md` format above, discovered via `.claude/skills/` or a plugin's `skills/` directory.

Because this repo is a **distribution point**, not the consuming repo, the goal is for each provider file under `agents/prd-agent/{claude,copilot,openai}/` to be copy-paste-ready into those consuming-repo locations — which requires real frontmatter, not prose.

---

## 3. Target structure

```
agents/prd-agent/
├── AGENT.md                     # Cross-provider overview: what it does, when to use it, capability list
├── README.md                    # Install/usage instructions for each provider
├── CHANGELOG.md                 # Version history (currently missing entirely)
├── shared/
│   └── core-prompt.md           # Provider-agnostic system prompt (keep — already v2.1)
├── claude/
│   └── agent.md                 # Real frontmatter: name, description, tools, model — copy-ready to .claude/agents/
├── copilot/
│   └── agent.md                 # Real frontmatter: name, description, tools[], mcp-servers — copy-ready to .github/agents/
├── openai/
│   └── agent.md                 # OpenAI/Codex-specific config (existing tools.json retained if still needed)
├── manifests/
│   ├── skills.md                # Rewritten: lists the ~18 curated skills only, no export-tool metadata
│   └── checksums.sha256
├── docs/
│   ├── CONTEXT_DETECTION.md     # Existing — keep
│   ├── ORGANIZATION_CONTEXT.md  # Existing — keep
│   └── INTEGRATION_GUIDE.md     # Existing — keep
├── templates/                    # PRD-specific document templates only (from agent/templates/*.md,
│                                 #   deduplicated — currently the same 9 templates exist twice under
│                                 #   agent/templates/ and again inside individual skills' assets/)
└── skills/
    ├── lightspeed-prd-writer/            # SKILL.md + references/ + assets/ + examples/
    ├── lightspeed-project-intake/
    ├── lightspeed-project-research/
    ├── lightspeed-estimation-planner/
    ├── lightspeed-delivery-planner/
    ├── lightspeed-task-breakdown-planner/
    ├── lightspeed-implementation-plan-generator/
    ├── lightspeed-approval-gate-manager/
    ├── lightspeed-change-control/
    ├── lightspeed-prd-reviewer/
    ├── lightspeed-qa-planner/
    ├── lightspeed-acceptance-test-planner/
    ├── lightspeed-requirements-traceability-mapper/
    ├── lightspeed-project-memory-manager/
    ├── lightspeed-project-status-reporter/
    ├── lightspeed-release-handoff-generator/
    ├── lightspeed-figma-wordpress-technical-brief/
    ├── lightspeed-github-issue-drafter/
    ├── lightspeed-project-pack-exporter/
    ├── content-file-validator/
    ├── markdown-content-validator/
    └── wordpress-plugin-packaging-review/
```

**Removed entirely** (not migrated anywhere): `agent/` (the whole nested `configuration/instructions/other/references/scripts` tree — superseded by `docs/` + `templates/` + `skills/*/references`), `skills/local/*` platform built-ins, `skills/plugin-provided/*` connector copies, the duplicate flat `skills/agent-attached/lightspeed-*` dirs (superseded by their `hermes/` counterparts, per §1.3), the `hermes/` nesting level itself (skills move up one level to sit directly under `skills/`), and `agents/prd-factory-planner-agent/` as a folder (its unique content, if any survives the reconciliation in §4, folds into the skills above; the folder itself is deleted once `agents/prd-factory-planner.agent.md`'s `implementation:` pointer is repointed or archived).

Skill count goes from **48 duplicated + ~30 vendored ≈ 78 skill directories across two folders** down to **~21 curated, deduplicated skills in one folder** (24 hermes skills minus a few that look like genuine near-duplicates of each other, e.g. `lightspeed-qa-planner` vs `lightspeed-qa-triage`, `lightspeed-project-research` vs `lightspeed-project-researcher` — these need a content read to confirm before merging, see open decisions).

---

## 4. Open decisions needing a decision before execution

1. ~~**Client memory data (§1.5)**~~ — **Resolved 2026-09-10:** confirmed sample/demo data, not real clients. Routine cleanup, no special handling needed.
2. ~~**Fork reconciliation**~~ — **Resolved 2026-09-10, see [SKILL_RECONCILIATION_REPORT.md](./SKILL_RECONCILIATION_REPORT.md):** contrary to the assumption when this plan was drafted, `agents/prd-factory-planner-agent` does not hold different content — 24/24 shared skills are byte-identical bar a decorative footer line. The real forked content is 3 leftover skills inside `agents/prd-agent/skills/hermes/` itself (`approval-gate-manager`, `project-memory-manager`, `release-handoff-generator`), which need a union-merge of complementary reference files, plus one wholly-new unflattened skill (`lightspeed-qa-planner`) that just needs promoting. `agents/prd-factory-planner-agent/` itself can be deleted outright.
3. **`agents/mode-prd.agent.md` fate** — this is issue #1899's Phase 4 question, still open. Given it already has correct Copilot-style frontmatter (§1.6), the cleanest option is to retire it in favour of a properly-fixed `agents/prd-agent/copilot/agent.md`, but confirm no external workflow still points at `mode-prd.agent.md` directly first.
4. ~~**Near-duplicate skill pairs**~~ — **Resolved 2026-09-10, see [SKILL_DUPLICATION_AUDIT_REPORT.md](./SKILL_DUPLICATION_AUDIT_REPORT.md):** the actual overlap question isn't cross-folder (resolved by #2 above) — it was overlap unique to `prd-agent` itself. Originally scoped as a 10-skill generic/thin tier (see [SKILL_RECONCILIATION_REPORT.md §2.1](./SKILL_RECONCILIATION_REPORT.md#21-in-prd-agent-but-not-in-prd-factory-planner-agent-21)); scoping found the real pattern spans 17 clusters ([INTRA_FOLDER_SKILL_AUDIT_SCOPE.md](./INTRA_FOLDER_SKILL_AUDIT_SCOPE.md)); all 17 are now file-by-file diffed/read with keep/merge/delete/distinct verdicts and a "what would be lost" list per cluster. Most of it was an abandoned rename campaign (the skill declaring itself the replacement is consistently the thinner one) — but 3 clusters turned out genuinely distinct, not duplicates, so not everything got merged. Curated count: 46 → 28 skills. One naming decision remains open (`project-pack-exporter` vs. `prd-task-pack-exporter`).
5. **`templates/` vs per-skill `assets/`** — some PRD templates exist both as a shared `agent/templates/prd-template.md` and inside `lightspeed-prd-writer/assets/prd-template.md`. Decide whether templates are shared (single copy under `templates/`, referenced by multiple skills) or intentionally per-skill.
6. ~~**Root `AGENT.md`/`README.md` content**~~ — **Resolved 2026-09-10, see [ROOT_FILES_RECONCILIATION_REPORT.md](./ROOT_FILES_RECONCILIATION_REPORT.md):** `prd-agent/AGENT.md` is the base; port forward an "Integration Points" section (Linear, Google Workspace, GitHub — real plugin-backed) and two capability tags (`resource-allocation`, `scope-definition`) from factory-planner's copy before deleting it. Both `README.md` files are Codex export-tool boilerplate with dangling links — replace both, merge neither.
7. ~~**`agent/` export tree**~~ — **Resolved 2026-09-10, see [AGENT_FOLDER_RECONCILIATION_REPORT.md](./AGENT_FOLDER_RECONCILIATION_REPORT.md):** `prd-factory-planner-agent/agent/` has zero files not already in `prd-agent/agent/`. Nothing to merge. `instructions/AGENTS.md`'s skill-routing section needs rewriting from scratch regardless (both current versions reference skills that don't exist — dead Codex session IDs on one side, a fabricated 39-skill catalogue on the other).

---

## 5. Proposed execution phases

**Updated 2026-09-10** now that all three reconciliation reports are done — this is a much smaller list than the original draft assumed, since almost nothing in `prd-factory-planner-agent` turned out to be unique. See [PLANNING.md — Phase 3](./PLANNING.md#phase-3-structural-consolidation-scoped-) for the authoritative, checkbox-tracked version of this list.

| Phase | Scope |
|---|---|
| A | Union-merge the 3 forked skills in `agents/prd-agent/skills/hermes/` (`approval-gate-manager`, `project-memory-manager`, `release-handoff-generator`) into their flattened top-level counterparts; promote `lightspeed-qa-planner` to `skills/qa-planner/` |
| B | Resolve the two remaining open decisions: the 10-skill generic tier (#4 above) and `mode-prd.agent.md`'s fate (#3 above) |
| C | Port the two items from factory-planner's `AGENT.md` into `prd-agent/AGENT.md` (#6 above); rewrite `instructions/AGENTS.md`'s skill section (#7 above); replace both `README.md` files with one real one |
| D | Delete `agents/prd-factory-planner-agent/` in full |
| E | Clean up `prd-agent/agent/`'s own remaining export cruft regardless of D: sample memory banks under `other/memory/`, MCP plugin-cache dumps under `configuration/plugins/` |
| F | Rewrite `claude/agent.md` and `copilot/agent.md` with real frontmatter per §2.2/§2.3; verify by copying into a scratch repo's `.claude/agents/` and `.github/agents/` |
| G | Update `manifests/skills.md` to reflect the real inventory; add `CHANGELOG.md` |
| H | Only then: create the OpenSpec change proposal against the cleaned-up structure (§6 below) |

---

## 6. Relationship to OpenSpec

This plan intentionally comes **before** any OpenSpec change proposal. Once the open decisions in §4 are resolved and the target structure above is agreed, the next step is an OpenSpec change (`.github/projects/active/openspec/changes/prd-agent-consolidation/`) capturing this as a formal spec-driven change — proposal, tasks, design, and a `capabilities/prd-agent-structure` spec — so the execution phases in §5 are tracked the same way other initiatives in this repo are (see `.github/projects/active/openspec/changes/agent-tool-permission-alignment/` for the pattern this repo already uses).

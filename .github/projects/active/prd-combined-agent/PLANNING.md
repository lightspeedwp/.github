---
file_type: planning
title: "prd-combined-agent — Planning & Specification"
description: "Project planning document with objectives, phases, deliverables, and GitHub issue references"
created_date: 2026-08-12
last_updated: "2026-09-10"
status: active
tags:
  - planning
  - specification
  - project
  - wordpress
  - prompt-enhancement
---

# prd-combined-agent — Planning & Specification

**Status:** 🟡 Active (Phase 3 added) | **Owner:** Ash Shaw | **Last Updated:** 2026-09-10

---

## Quick Summary

**Objective:** Merge `agents/prd-agent/` and `agents/prd-factory-planner-agent/` into one curated, spec-compliant portable agent.

**Duration:** Phase 2 Batch 2 (catalogue merge) — complete 2026-07-23. Phase 3 (structural consolidation) — not yet started.
**Target Completion:** TBD — pending decisions in [FOLDER_STRUCTURE_PLAN.md](./FOLDER_STRUCTURE_PLAN.md)
**Key Stakeholders:** Ash Shaw (owner), LightSpeedWP product/PM team (consumers of the agent)

---

## Executive Summary

This project originally merged `prd-agent` and `prd-factory-planner-agent` at the *catalogue* level (two agent-registry entries, `agents/prd.agent.md` and `agents/prd-factory-planner.agent.md`, both pointing at their respective folders). A 2026-09-10 audit found the underlying folders were never actually consolidated: both still exist (1,637 + 932 files), both still carry a raw Codex CLI environment export (vendored platform skills, real-looking client memory data, and the same ~24 custom skills duplicated three ways with forked content), and neither folder's `claude/agent.md` or `copilot/agent.md` has usable YAML frontmatter — so neither Claude Code nor GitHub Copilot can actually load them today.

### Problem Statement

`agents/prd-agent/` and `agents/prd-factory-planner-agent/` are unusable as portable, distributable agent packages: they don't support the clients they claim to (Claude Code, Copilot), they duplicate the same skills with diverging content, and they may contain real client data that shouldn't be in a shared template.

### Solution Overview

Consolidate into a single `agents/prd-agent/` folder with a curated, deduplicated `skills/` tree aligned to the [Agent Skills specification](https://agentskills.io/specification), and provider files (`claude/agent.md`, `copilot/agent.md`) with real, client-loadable frontmatter. Full audit and target structure are in [FOLDER_STRUCTURE_PLAN.md](./FOLDER_STRUCTURE_PLAN.md).

### Expected Outcomes

1. One `agents/prd-agent/` folder, ~21 curated skills instead of ~78 duplicated/vendored ones
2. `claude/agent.md` and `copilot/agent.md` are copy-paste-ready into a consuming repo's `.claude/agents/` and `.github/agents/`
3. No vendored platform/plugin skill copies, no client-identifying data
4. `agents/prd-factory-planner-agent/` retired
5. An OpenSpec change proposal tracking the execution (see FOLDER_STRUCTURE_PLAN.md §6)

---

## Scope & Objectives

### Primary Objectives

1. **Audit** — Establish ground truth on both folders' contents, duplication, and client-loadability (✅ done, see FOLDER_STRUCTURE_PLAN.md §1)
2. **Decide** — Resolve the open decisions in FOLDER_STRUCTURE_PLAN.md §4 (client data, fork reconciliation, `mode-prd.agent.md` fate, near-duplicate skills)
3. **Consolidate** — Execute the phased plan in FOLDER_STRUCTURE_PLAN.md §5

### Success Criteria

- [ ] Client memory data question resolved (§4.1)
- [ ] Fork reconciliation complete for all 24 hermes skills (§4.2)
- [ ] `claude/agent.md` / `copilot/agent.md` verified loadable in a scratch repo
- [ ] `agents/prd-factory-planner-agent/` removed
- [ ] OpenSpec change proposal created for the execution phases

### Out of Scope

- Rewriting the PRD-writing prompt content itself beyond what's already in `shared/core-prompt.md` v2.1 (Phase 4 below folds in that content's testing/rollout, not a further content rewrite)
- Auditing or restructuring other bloated agent folders (e.g. `pr-creation-agent/` at 9,636 files) — same disease, different project

> **Note:** The `prd-agent-prompt-improvements-2026-08` project (core-prompt v2.1 enhancement, testing, and rollout) was previously tracked separately but has been merged into this project as of 2026-09-10 — see [Prompt Enhancement Track](#prompt-enhancement-track-merged-from-prd-agent-prompt-improvements-2026-08) below.

---

## Implementation Strategy

### Overall Approach

Describe the high-level approach: sequential phases, parallel workstreams, agile iterations, etc.

### Key Principles

1. **Principle 1** — Why this matters and how it guides decisions
2. **Principle 2** — Why this matters and how it guides decisions
3. **Principle 3** — Why this matters and how it guides decisions

---

## Project Phases

### Phase 1-2: Agent Registry & Catalogue Merge (COMPLETE ✅)

**Objective:** Merge `prd-agent` and `prd-factory-planner-agent` at the agent-registry/catalogue level.

**Deliverables:**

- [x] Unified agent specification documented (see [COMPLETION_SUMMARY.md](./COMPLETION_SUMMARY.md))
- [x] Multi-provider configuration verified (Claude, Copilot, OpenAI entries exist)
- [x] Catalogue pointer files created: `agents/prd.agent.md`, `agents/prd-factory-planner.agent.md`

**Completed:** 2026-07-23 | **PR:** #1139, #1196

---

### Phase 3: Structural Consolidation (SCOPED 🟡)

**Objective:** Actually merge the two underlying folders' content — the part Phase 1-2 skipped. Master plan and target structure: [FOLDER_STRUCTURE_PLAN.md](./FOLDER_STRUCTURE_PLAN.md). `agents/prd-factory-planner-agent/` has now been audited **file-by-file across its entire tree** — [SKILL_RECONCILIATION_REPORT.md](./SKILL_RECONCILIATION_REPORT.md) (`skills/`), [AGENT_FOLDER_RECONCILIATION_REPORT.md](./AGENT_FOLDER_RECONCILIATION_REPORT.md) (`agent/`), [ROOT_FILES_RECONCILIATION_REPORT.md](./ROOT_FILES_RECONCILIATION_REPORT.md) (`AGENT.md`/`README.md`). **Finding: almost nothing in that folder is unique.** It's the same Codex export run twice, with cosmetic footer/formatting differences and, in a couple of narrative doc sections, fabricated skill catalogues that don't correspond to real files. The scoped deliverable list below supersedes the original, larger estimate in FOLDER_STRUCTURE_PLAN.md §5 now that the audits are done.

**Deliverables (finalized 2026-09-10):**

- [ ] Union-merge 3 forked skills still sitting in `agents/prd-agent/skills/hermes/` (`approval-gate-manager`, `project-memory-manager`, `release-handoff-generator`) with their already-flattened top-level counterparts — SKILL_RECONCILIATION_REPORT.md §3
- [ ] Promote `lightspeed-qa-planner` from `skills/hermes/` to `skills/qa-planner/` — no merge needed, it has no counterpart anywhere (SKILL_RECONCILIATION_REPORT.md §3)
- [x] Decide the fate of the intra-folder skill overlap (originally scoped as a 10-skill generic/thin tier per SKILL_RECONCILIATION_REPORT.md §2.1; broadened to 17 clusters by [INTRA_FOLDER_SKILL_AUDIT_SCOPE.md](./INTRA_FOLDER_SKILL_AUDIT_SCOPE.md)). **All 17 clusters now diffed/read** — see [SKILL_DUPLICATION_AUDIT_REPORT.md](./SKILL_DUPLICATION_AUDIT_REPORT.md): headline finding is an abandoned rename campaign (most clusters have a `rollout/rename-notes.md` naming the *thinner* skill as the intended replacement — content lineage runs the other way), but not every cluster was duplication — 2 of the 5 Phase B clusters (acceptance-test-planner/validation-support, memory-management/project-memory-manager) turned out genuinely DISTINCT, and `prd-agent-orchestrator` is confirmed a deliberate, separate routing layer, not redundant with the content specialists. **Curated skill count: 46 → 28** (27 once `frontend-skill` is removed). Remaining before execution: the `project-pack-exporter`/`prd-task-pack-exporter` naming decision, and the `frontend-skill` removal call
- [ ] Port two items from `prd-factory-planner-agent/AGENT.md` into `prd-agent/AGENT.md` before deletion: an "Integration Points" section (Linear, Google Workspace, GitHub — Figma/Slack are unbacked by any plugin config, drop them) and two capability tags (`resource-allocation`, `scope-definition`) — ROOT_FILES_RECONCILIATION_REPORT.md §4
- [ ] Replace both `README.md` files with one real, human-facing README (both current versions are Codex export-tool boilerplate with dangling links to a nonexistent `CONTRIBUTING.md` and `checksums.sha256`) — ROOT_FILES_RECONCILIATION_REPORT.md §3
- [ ] Rewrite `instructions/AGENTS.md`'s skill-routing section from scratch once the skill folder is finalized — it currently references dead Codex session IDs (`prd-agent` copy) or a fabricated 39-skill catalogue (`prd-factory-planner-agent` copy) — AGENT_FOLDER_RECONCILIATION_REPORT.md §3-4
- [ ] Delete `agents/prd-factory-planner-agent/` in full once the above are ported — confirmed zero remaining unique content
- [ ] Clean up `prd-agent/agent/`'s own export cruft regardless of the above: sample client memory banks under `other/memory/` (confirmed fictional, routine cleanup), raw MCP plugin-cache dumps under `configuration/plugins/`, and the generic Claude/Codex platform-builtin skill copies under the old `skills/local/` and `skills/plugin-provided/` trees (already removed from disk as of 2026-09-10 per the in-progress flattening)
- [ ] Rewrite `claude/agent.md` and `copilot/agent.md` with real, client-loadable YAML frontmatter (FOLDER_STRUCTURE_PLAN.md §1.6/§2.2/§2.3) — unaffected by the factory-planner audit, still needed either way
- [ ] Resolve the two remaining open decisions from FOLDER_STRUCTURE_PLAN.md §4: `mode-prd.agent.md` fate (also tracked as Phase 7 below), and the generic-tier question above
- [ ] Create an OpenSpec change proposal tracking execution, once this scoped list is agreed — deferred until then per project owner's direction

**Status:** Audit complete 2026-09-10 (all three reports). Scope is now small and concrete. Execution not yet started.

---

## Prompt Enhancement Track (merged from `prd-agent-prompt-improvements-2026-08`)

> This track covers the core-prompt v2.1 content (WordPress-aware auto-detection, contextual PRD sections), its testing, and its team rollout. It runs independently of the Phase 3 structural consolidation above — Phase 3 is about *packaging* the agent folder; Phases 4-7 here are about the *prompt content* it ships. Originally tracked in the standalone `prd-agent-prompt-improvements-2026-08` project (started 2026-08-12); merged into this document 2026-09-10 ahead of that folder's deletion.

**Track summary:** Enhance the PRD Agent's core prompt to auto-detect WordPress project type (block plugin, block theme, or hybrid) and adapt PRD sections contextually, so one portable agent serves all WordPress projects without per-repo versions.

### Phase 4: Prompt Enhancement (COMPLETE ✅)

**Deliverables:**

- ✅ Enhanced core prompt (v2.1) with WordPress-aware planning, documented in `agents/prd-agent/shared/core-prompt.md`
- ✅ Context auto-detection logic (plugin.php + blocks/ → block plugin; theme.json + templates/ → block theme; both → hybrid; ambiguous → clarifying questions)
- ✅ WordPress-specific PRD sections defined per project type (Block Inventory/Hooks/WP Compatibility for plugins; Theme Settings/Block Patterns/FSE Support for themes)
- ✅ Risk management categories enhanced with WordPress awareness (compatibility, testing cycle buffer, accessibility)
- ✅ Workflow examples for block plugins, block themes, hybrid projects
- ✅ Organization-wide reusability approach documented (no repo-specific agent versions)
- ✅ PR #1894 created for review

**Completed:** 2026-08-12 | **Owner:** Ash Shaw

---

### Phase 5: Testing & Validation (READY 🟡)

**Duration:** 4 days from kickoff | **Owner:** Ash Shaw | **Participants:** Product managers, WordPress developers (feedback) | **Tracking:** [#1896](https://github.com/lightspeedwp/.github/issues/1896)

**Objectives:** validate auto-detection across project types, verify PRD sections adapt contextually, confirm WordPress guidance accuracy, collect team feedback, identify edge cases.

**Testing scope:**

| Area | What's verified |
|------|------------------|
| Auto-detection (T2.1) | Block plugin / block theme / hybrid / non-standard / custom-structure repos each produce the expected detection message and section set |
| PRD sections (T2.2) | Plugin sections (Block Inventory, WP Compatibility, Hooks & Filters, Block Registration, Accessibility) and theme sections (Theme Settings, Block Composition Patterns, Template System, Editor Experience, FSE Support) appear only where relevant; shared sections (Dependencies, Constraints, Technical Risks, Timeline) appear everywhere |
| WordPress awareness (T2.3) | Version support matrix generated, timeline includes a 2-4 week testing buffer, release-calendar alignment, browser/device support matrix |
| Accessibility (T2.4) | WCAG 2.2 AA referenced in every PRD, accessibility risks identified, block editor accessibility and keyboard/screen-reader requirements covered |

**Success criteria:** auto-detection accuracy >95%; no irrelevant sections included; WordPress version guidance accurate; every PRD mentions WCAG 2.2 AA; positive feedback from PMs and developers with no critical blocking issues.

<details>
<summary>Full testing checklists (T2.1-T2.4)</summary>

```
Auto-Detection (T2.1):
Block Plugin Repo:
[ ] Agent detects plugin.php
[ ] Agent detects blocks/ folder
[ ] Agent shows "Block Plugin" detected message
[ ] Plugin-specific sections included; theme sections NOT included

Block Theme Repo:
[ ] Agent detects theme.json
[ ] Agent detects templates/ folder
[ ] Agent shows "Block Theme" detected message
[ ] Theme-specific sections included; plugin sections NOT included

Hybrid Repo:
[ ] Agent detects both plugin.php and theme.json
[ ] Agent shows "Hybrid Project" detected message
[ ] Plugin + theme + integration sections all included

Non-Standard Repo:
[ ] Agent asks clarifying questions (project type, structure, WP version)
[ ] Agent adapts based on user input; user can override auto-detection

Custom Structure:
[ ] Agent proposes assumptions, user confirms/corrects
[ ] PRD generated based on confirmed context; documentation shows assumed context

PRD Sections (T2.2):
Block Plugin: Block Inventory / WordPress Compatibility (min WP+PHP version) / Hook & Filter Requirements / Block Registration & Settings (JSON) / Accessibility (WCAG 2.2 AA)
Block Theme: Theme Settings & Design Tokens / Block Composition Patterns / Template System / Editor Experience / FSE Support
Shared: Dependencies / Constraints & Assumptions / Technical Risks / Timeline & Roadmap

WordPress Awareness (T2.3):
[ ] Version support matrix generated; timeline includes 2-4 week testing buffer
[ ] "WordPress Compatibility" and "Performance" (Web Vitals) risks identified
[ ] Phases aligned with WP major versions; stakeholders understand WP constraints

Accessibility (T2.4):
[ ] WCAG 2.2 AA mentioned in all PRDs; accessibility section in risk assessment
[ ] Acceptance criteria + testing plan cover accessibility
[ ] Block registration includes accessible attributes; screen reader testing mentioned
```

</details>

---

### Phase 6: Team Rollout (READY 🟡)

**Duration:** 5 days from kickoff | **Owner:** Ash Shaw | **Participants:** Product, engineering, design, QA | **Tracking:** [#1897](https://github.com/lightspeedwp/.github/issues/1897)

**Documentation updates:**

- [ ] Update `agents/prd-agent/AGENT.md` with v2.1 feature summary, auto-detection behavior, WordPress awareness section
- [ ] Create `agents/prd-agent/CONTEXT_DETECTION.md` — detection logic, criteria per type, troubleshooting, examples
- [ ] Create `agents/prd-agent/ORGANIZATION_CONTEXT.md` — single-agent rationale, adoption roadmap

**Team communication:** share v2.1 summary with PMs and WordPress developers, demo auto-detection live, distribute docs, create an FAQ.

**Workflow integration:** document GitHub integration points, CI/CD options, issue-creation automation, copy-paste examples.

**Feedback loop:** monitor usage across repos; track auto-detection accuracy, section relevance, guidance clarity, missing features; maintain an iteration backlog.

**Success criteria:** docs updated and linked; ≥3 teams actively using the agent; >80% positive initial feedback; no critical issues blocking usage.

**Communication key messages:**

| Audience | Message |
|----------|---------|
| Product Managers | Auto-detects project type and generates relevant sections without configuration; WP version compatibility is a first-class planning concern |
| WordPress Developers | Agent understands WP constraints, version compatibility, and testing cycles |
| Designers/UX | Block editor experience, accessibility, and design tokens are explicit PRD sections; FSE support fully documented |
| QA/Testing | Compatibility matrices, WP version testing cycles, and accessibility compliance included in planning |

---

### Phase 7: Optional — Spec-Based Agent Sync

**Decision point:** after Phase 6 feedback | **Tracking:** [#1899](https://github.com/lightspeedwp/.github/issues/1899)

**Option A (recommended):** archive `.github/agents/mode-prd.agent.md` — the portable `agents/prd-agent/` becomes the sole canonical version, single source of truth.

**Option B:** keep `.github/agents/mode-prd.agent.md` in sync with the enhanced prompt for Copilot users — carries a dual-maintenance cost, not recommended.

---

### Prompt Enhancement Track — KPIs & Risks

**KPIs:**

| Metric | Phase | Target |
|--------|-------|--------|
| Auto-detection accuracy | 5 | >95% |
| PRD sections relevant | 5 | 100% |
| Team adoption | 6 | >50% |
| Documentation quality (feedback) | 6 | >4/5 |
| Critical issues filed | 5-6 | <5 |

**Risks:**

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Auto-detection fails for non-standard repos | Medium | Medium | Ask clarifying questions; document assumptions |
| Teams continue using old agent versions | Medium | High | Clear communication; updated docs; migration guide |
| WordPress version guidance becomes stale | Low | Medium | Version-lock to WP 6.2-6.6; quarterly review |
| Accessibility guidance misses WCAG requirements | Low | High | Audit against WCAG 2.2 AA before rollout |

**External references:** [WordPress Release Calendar](https://wordpress.org/about/release-schedule/) · [WCAG 2.2 AA Standards](https://www.w3.org/WAI/WCAG22/quickref/)

---

## Timeline & Milestones

### Overall Schedule

| Milestone | Date | Dependency | Status |
|-----------|------|-----------|--------|
| Phase 1-2 (catalogue merge) complete | 2026-07-23 | - | ✅ Done |
| Phase 4 (prompt v2.1) complete | 2026-08-12 | - | ✅ Done |
| Phase 3 audit (3 reconciliation reports) complete | 2026-09-10 | - | ✅ Done |
| Phase 3 execution (scoped deliverables above) | TBD | Phase 3 audit | ⏳ Not started |
| Phase 5-6 (prompt testing & rollout) | TBD | Phase 4 | 🟡 Ready, see #1896/#1897 |
| Phase 7 (optional spec sync decision) | TBD | Phase 6 feedback | 🔵 Pending, see #1899 |

---

## Deliverables

Detailed description of what will be delivered in each phase.

---

## Resources & Team

### Team Members

| Role | Name | Hours/Week | Responsibilities |
|------|------|------------|------------------|
| Project Owner | Owner Name | 15 | Overall direction, stakeholder coordination |
| Technical Lead | Tech Lead Name | 20 | Architecture, technical decisions |
| Developer | Dev Name | 40 | Implementation, testing |

---

## OpenSpec Integration

### When to Use OpenSpec

This project includes **OPENSPEC.md** if:

- ✅ Detailed technical specification required
- ✅ Complex architecture or multiple components
- ✅ Phases require independent execution
- ✅ Configuration or schema validation needed
- ✅ Long-term portability/reusability important

### Navigating Between Documents

If this project has **OPENSPEC.md**:

1. **Start here** (`PLANNING.md`) for project overview
2. **Check OPENSPEC.md** for detailed technical specs
3. **Reference GitHub issues** for status tracking
4. **Execute Phase-specific tasks** from phase documents

If this project has **no OPENSPEC.md**:

- All specifications contained in this document
- See section "Phase-Specific Details" below

---

## GitHub Issues & Tracking

### Master Epic

No dedicated master epic exists for this project. Phase 1-2 (catalogue merge) was tracked via PRs #1139 and #1196. Phase 3 (structural consolidation) has no issue yet — tracked via the documents in [Related Documentation](#related-documentation) until one is opened. Phases 5-7 (Prompt Enhancement Track) are tracked directly by the issues below.

### Issue Reference Table

| Phase | Issue | Type | Status | Notes |
|-------|-------|------|--------|-------|
| Phase 1-2 | PR [#1139](https://github.com/lightspeedwp/.github/pull/1139), [#1196](https://github.com/lightspeedwp/.github/pull/1196) | PR | ✅ Merged | Catalogue-level merge |
| Phase 3 | — | — | 🟡 Scoped, no issue yet | See FOLDER_STRUCTURE_PLAN.md + 3 reconciliation reports |
| Phase 5 | [#1896](https://github.com/lightspeedwp/.github/issues/1896) | task | 🟡 In Progress | Prompt testing & validation |
| Phase 6 | [#1897](https://github.com/lightspeedwp/.github/issues/1897) | task | 🟢 Ready | Team rollout & documentation |
| Phase 7 | [#1899](https://github.com/lightspeedwp/.github/issues/1899) | task | 🔵 Pending | Optional spec-based agent sync |

---

## Risk Management

### Identified Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Scope creep | Medium | High | Weekly scope reviews |
| Resource unavailability | Low | High | Cross-training |

---

## Success Metrics

### Quantitative Metrics

- Metric 1: Target value
- Metric 2: Target value
- Metric 3: Target value

### Qualitative Metrics

- Stakeholder satisfaction: Positive feedback
- Team morale: Smooth collaboration
- Process quality: Zero critical issues

---

## Related Documentation

### Project Documents

- [README.md](./README.md) — Project overview, quick facts, status dashboard
- [OPENSPEC.md](./OPENSPEC.md) — Technical-spec stub, points here and to FOLDER_STRUCTURE_PLAN.md
- [FOLDER_STRUCTURE_PLAN.md](./FOLDER_STRUCTURE_PLAN.md) — Phase 3 master plan: target structure, open decisions, execution phases
- [SKILL_RECONCILIATION_REPORT.md](./SKILL_RECONCILIATION_REPORT.md) — `skills/` audit backing Phase 3
- [AGENT_FOLDER_RECONCILIATION_REPORT.md](./AGENT_FOLDER_RECONCILIATION_REPORT.md) — `agent/` audit backing Phase 3
- [ROOT_FILES_RECONCILIATION_REPORT.md](./ROOT_FILES_RECONCILIATION_REPORT.md) — `AGENT.md`/`README.md` audit backing Phase 3
- [IMPLEMENTATION_NOTES.md](./IMPLEMENTATION_NOTES.md) — Historical Phase 1-2 decision log
- [COMPLETION_SUMMARY.md](./COMPLETION_SUMMARY.md) — Historical Phase 1-2 completion record

### External References

- [Repository CLAUDE.md](../../../CLAUDE.md) — Repository governance
- [Agent Skills specification](https://agentskills.io/specification) — Target format for `skills/*/SKILL.md`
- [WordPress Release Calendar](https://wordpress.org/about/release-schedule/) — Timeline planning for the Prompt Enhancement Track
- [WCAG 2.2 AA Standards](https://www.w3.org/WAI/WCAG22/quickref/) — Accessibility compliance baseline

**Note:** this project has no dedicated master epic issue — Phase 3 work is tracked via the documents above; Phases 5-7 are tracked via [#1896](https://github.com/lightspeedwp/.github/issues/1896), [#1897](https://github.com/lightspeedwp/.github/issues/1897), [#1899](https://github.com/lightspeedwp/.github/issues/1899).

### Provenance

Phases 4-7 and their checklists were merged in from the standalone `prd-agent-prompt-improvements-2026-08` project (README.md + PLANNING.md) on 2026-09-10, ahead of that folder's removal.

---

**Project Status:** 🟡 Active  
**Version:** 1.1.0  
**Maintained By:** Ash Shaw  
**Last Updated:** 2026-09-10

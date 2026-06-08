---
file_type: documentation
title: "Labeling Documentation Consolidation Audit"
description: "Complete audit of labeling documentation identifying consolidation opportunities and distributed responsibility"
version: "v1.0.1"
created_date: "2026-05-31"
last_updated: "2026-06-01"
author: "Claude Code"
maintainer: "LightSpeedWP Team"
tags: ["documentation", "audit", "consolidation", "wave-5", "labeling"]
status: active
stability: "stable"
domain: "governance"
---

# Labeling Documentation Audit Report

**Parent Issue:** [#651](https://github.com/lightspeedwp/.github/issues/651) (Documentation Consolidation)
**Child Issue:** [#664](https://github.com/lightspeedwp/.github/issues/664) (Labeling Docs Consolidation)
**Audited:** 2026-05-31
**Auditor:** Claude Code

---

## Executive Summary

Audited 4 labeling-related documentation files. Found:

- **Distributed responsibility** across 4 files with overlapping coverage
- **Missing files** (`docs/LABEL_STRATEGY.md`, `docs/LABELING.md`, `docs/AUTOMATION.md` referenced or expected but don't exist)
- **Significant duplication** between `docs/LABELING.md` and `instructions/labeling.instructions.md`
- **Cross-references between files** create maintenance burden and inconsistency risk
- **Fragmented guidance** on label application between LABELING.md and AUTOMATION.md

**Recommendation:** Consolidate into 2-3 canonical files with clear audience separation and eliminate duplicate label category documentation.

---

## Files Audited

| File | Path | Exists | Status | Lines | Role |
|------|------|--------|--------|-------|------|
| Labeling Guide | `docs/LABELING.md` | ✅ | Active | 363 | Comprehensive label families & automation |
| Automation Governance | `docs/AUTOMATION.md` | ✅ | Active | 254 | Workflow & automation strategy |
| Labeling Instructions | `instructions/labeling.instructions.md` | ✅ | Active | 87 | Condensed labeling rules |
| Labeling Agent Spec | `agents/labeling.agent.md` | ✅ | Active | 238 | Technical agent specification |

### Missing References (Scope Mentions)

| File | Status | Impact |
|------|--------|--------|
| `docs/LABEL_STRATEGY.md` | ❌ Missing | No separate strategy doc (covered in LABELING.md) |
| `docs/LABELING.md` | ❌ Deprecated | Consolidated into LABELING.md#issue-labelling (per Issue [#662](https://github.com/lightspeedwp/.github/issues/662)) |
| `docs/LABELING.md` | ❌ Missing | No separate PR labels doc (covered in LABELING.md#pull-request-labelling) |
| `docs/AUTOMATION.md` | ❌ Missing | Replaced by AUTOMATION.md (different name) |

---

## Detailed Findings

### 1. **`docs/LABELING.md`**

**Type:** Comprehensive reference guide
**Length:** ~363 lines
**Audience:** All contributors, especially those triaging or applying labels
**Quality:** Well-structured, authoritative, up-to-date (2026-05-31)

**Scope Covered:**

- Purpose & principles (clarity, consistency, discoverability, one-hot principle)
- Label categories & families (status, priority, type, area/component, context, meta/release, contributor/community)
- Issue labelling (required labels, application methods, enforcement)
- Pull request labelling (required labels, branch prefix mapping, changelog policy)
- Discussion labelling (purpose, available labels, best practices)
- Automation & agent integration (unified labelling agent, utilities, configuration files)
- Best practices (8 guidelines)
- Troubleshooting
- References

**Strengths:**

- Single source of truth for label taxonomy
- Covers all contexts: issues, PRs, discussions
- Detailed automation section explains agent, utilities, configuration
- Clear enforcement rules (one-hot principle)
- Recent update (2026-05-31)

**Issues:**

- Very comprehensive (363 lines)—may be overwhelming for new contributors
- Mixes user guidance with technical automation details
- Duplicates label categories with `instructions/labeling.instructions.md`

---

### 2. **`docs/AUTOMATION.md`**

**Type:** Automation governance & workflow strategy
**Length:** ~254 lines
**Audience:** Platform/governance team, workflow maintainers
**Quality:** Clear, authoritative, well-maintained

**Scope Covered:**

- Automation philosophy (automate everything, agent-driven, configuration-first, instruction-paired)
- Branching & workflow strategy (develop → main branching model, hotfixes)
- Workflow overview (labeling, changelog-validate, planner, reviewer, project-meta-sync, release, reporting, metrics)
- Label & issue type policy (canonical label set, adding/deprecating labels, enforcement)
- Workflow & agent governance (standards, approval process, agent development)
- Configuration management (canonical configs, validation)
- References

**Strengths:**

- Clear governance framework for label/workflow changes
- Explains approval process for new labels
- Documents repository-specific label allowances
- Covers label deprecation process

**Issues:**

- **Significant overlap with LABELING.md:**
  - Section 4 (Label & Issue Type Policy) duplicates LABELING.md sections 3-4
  - Canonical label location, issue/PR label requirements documented in both places
  - Enforcement rules mentioned twice (different contexts)
- Label categories NOT listed here (refers to LABELING.md)
- Mixes label governance with broader automation strategy
- No clear separation between "how to use labels" vs. "how to govern labels"

---

### 3. **`instructions/labeling.instructions.md`**

**Type:** Portable instructions (for agents & maintainers)
**Length:** ~87 lines
**Audience:** AI agents, maintainers, automation engineers
**Quality:** Condensed but clear; last updated 2026-05-29

**Scope Covered:**

- Labeling philosophy (one-hot, automation-first, discoverability, governance)
- Label categories (status, priority, type, area labels)
- Automation rules (labels trigger workflows)
- Creating new labels (5-step process)
- Related files cross-references

**Issues:**

- **Significant duplication with LABELING.md:**
  - Label categories (status, priority, type, area) repeated identically from LABELING.md
  - Lines 27-57 are a condensed version of LABELING.md sections 2-3
  - Philosophy statements largely overlap
- **Incomplete coverage:**
  - Doesn't cover discussion labels
  - Doesn't cover PR-specific labeling rules or branch mapping
  - Doesn't cover meta/release labels
  - Doesn't explain agent integration details
- **Maintenance burden:**
  - Two places defining same label categories means future updates must sync both files

---

### 4. **`agents/labeling.agent.md`**

**Type:** Technical agent specification
**Length:** ~238 lines
**Audience:** Developers, automation engineers, maintainers
**Quality:** Detailed, well-documented, technical

**Scope Covered:**

- Purpose (unified agent for dynamic, canonical labeling)
- Key features (config-driven, intelligent detection, enforcement, error handling, utilities)
- Execution flow (7 sequential steps: load configs, apply rules, branch detection, enforce constraints, apply defaults, content-based detection, standardize/migrate)
- Best practices (8 principles)
- Outputs (applied labels, migration report, audit log, metrics)
- Configuration files (labels.yml, labeler.yml, issue-types.yml)

**Strengths:**

- Clear technical specification
- Explains execution flow in detail
- Documents configuration file structure
- Up-to-date with v2.1

**Issues:**

- **No audience confusion** (purely technical spec, no overlap with other docs)
- However, some configuration file documentation could reference LABELING.md more clearly

---

## Consolidation Matrix

| Current File | Audience | Content | Proposed Action | Rationale |
|--------------|----------|---------|-----------------|-----------|
| `docs/LABELING.md` | All contributors | Label taxonomy, families, issue/PR/discussion labeling, automation, best practices | **Keep as primary reference** | Authoritative, comprehensive, covers all contexts |
| `docs/AUTOMATION.md` | Platform/governance team | Workflow strategy, label governance, approval process | **Keep, reduce label duplication** | Necessary for governance; remove label category duplication |
| `instructions/labeling.instructions.md` | Agents/maintainers | Condensed labeling rules | **Consolidate into another file OR remove** | Duplicates LABELING.md; incomplete coverage |
| `agents/labeling.agent.md` | Developers/engineers | Agent technical spec | **Keep, ensure clarity** | No overlap; purely technical |

---

## Key Overlaps Identified

### Overlap 1: Label Categories (3 locations)

**Files involved:**

- `docs/LABELING.md` (sections 2–5, lines 43–158)
- `instructions/labeling.instructions.md` (lines 27–60)
- `docs/AUTOMATION.md` (section 4, references labels but doesn't list them)

**Content:** Status, priority, type, area, context, meta/release, contributor/community labels

**Issue:** Label category definitions appear in both LABELING.md and labeling.instructions.md—identical or near-identical

**Consolidation:** Single source of truth (LABELING.md); labeling.instructions.md should reference or be removed

---

### Overlap 2: Issue & PR Labeling Requirements (2 locations)

**Files involved:**

- `docs/LABELING.md` (sections 3–4, lines 160–239)
- `docs/AUTOMATION.md` (section 4, lines 84–149)

**Content:** Required labels per issue/PR, application methods, enforcement rules, automation

**Issue:** Both files describe minimum required labels, one-hot rules, application methods

**Consolidation:**

- **LABELING.md:** Keep as primary reference (covers issues, PRs, discussions)
- **AUTOMATION.md:** Focus on governance/policy perspective; reduce label details; cross-reference LABELING.md for specifics

---

### Overlap 3: Automation & Agent Integration (2 locations)

**Files involved:**

- `docs/LABELING.md` (section 6, lines 266–306)
- `docs/AUTOMATION.md` (section 4, lines 84–149, and section 2–3 workflow overview)
- `agents/labeling.agent.md` (full document)

**Content:** How labeling automation works, agent configuration, workflow orchestration

**Issue:** Three files with different levels of detail on automation

**Consolidation:**

- **LABELING.md:** Focus on user-level automation (how it works, what users see)
- **AUTOMATION.md:** Focus on governance (who approves, how to configure)
- **labeling.agent.md:** Technical spec (implementation details)
- No significant duplication here; clear separation of concerns

---

### Overlap 4: Best Practices & Philosophy (2 locations)

**Files involved:**

- `docs/LABELING.md` (sections 1, 7–8, lines 33–40, 309–320)
- `instructions/labeling.instructions.md` (lines 17–24, 68–76)

**Content:** One-hot principle, automation-first philosophy, label governance principles

**Issue:** Philosophy statements repeated in two places with slightly different emphasis

---

## Missing Documentation

### Critical Gaps

1. **No separate `docs/LABELING.md`**
   - Consolidated into `docs/LABELING.md#issue-labelling`
   - Any broken references should point to LABELING.md#issue-labelling
   - Similar pattern to Issue [#662](https://github.com/lightspeedwp/.github/issues/662) finding

2. **No separate `docs/LABELING.md`**
   - Consolidated into `docs/LABELING.md#pull-request-labelling`
   - Found in Issue [#663](https://github.com/lightspeedwp/.github/issues/663) audit as missing/needed
   - Recommendation: Consolidate PR labels into LABELING.md (already done) and update references

3. **No `docs/LABEL_STRATEGY.md`**
   - Audit scope mentions this file; doesn't exist
   - Content covered by LABELING.md (strategy, principles, families)
   - No action needed; file wasn't required

4. **No `docs/AUTOMATION.md`**
   - Scope mentions this; actually called `docs/AUTOMATION.md`
   - Naming inconsistency but file exists

---

## Statistics

| Metric | Count |
|--------|-------|
| Files audited | 4 |
| Files with duplication | 2 (LABELING.md + labeling.instructions.md; LABELING.md + AUTOMATION.md) |
| Missing files | 2 (`ISSUE_LABELS.md`, `PR_LABELS.md`—consolidated) |
| Overlapping content areas | 4 |
| Total lines across all files | ~942 |
| Estimated deduplication savings | ~80-100 lines |

---

## Recommendations for Consolidation

### Phase 1: Reduce Immediate Duplication (Wave 5.3)

1. **Eliminate label category duplication from `instructions/labeling.instructions.md`**
   - Option A: Remove label categories and reference LABELING.md instead
   - Option B: Remove the entire file if it's incomplete anyway
   - Current content is outdated (doesn't cover discussions, PR-specific rules, meta labels)
   - Decision: Recommend removal or significant consolidation

2. **Clarify AUTOMATION.md's relationship to LABELING.md**
   - Move detailed label requirement rules to LABELING.md
   - Keep governance/policy framework in AUTOMATION.md
   - Update section 4 to reference LABELING.md for specifics
   - Example: "See LABELING.md#Issue_Labelling for detailed requirements"

3. **Verify all references to missing files**
   - Check for broken references to `docs/LABELING.md`, `docs/LABELING.md`
   - Update any found to point to `docs/LABELING.md#issue-labelling` or `#pull-request-labelling`
   - Mark in DEPRECATED.md if these were ever separate files

### Phase 2: Align & Consolidate (Wave 5.3 or 5.4)

1. **Consolidate labeling.instructions.md**
   - Decision required: Keep as portable reference OR remove?
   - If keeping: update to cover full label taxonomy, remove duplication
   - If removing: ensure agents have proper reference (LABELING.md is sufficient)

2. **Update AUTOMATION.md label policy section**
   - Reduce label categories section—link to LABELING.md instead
   - Keep governance/approval process (add new labels, deprecation, enforcement)
   - Clarify: AUTOMATION.md is "how to change label governance"; LABELING.md is "how to use labels"

3. **Verify agent spec clarity**
   - Ensure `agents/labeling.agent.md` references correct config files
   - Add cross-references to LABELING.md for label taxonomy explanation
   - No consolidation needed; technical spec is appropriate as standalone

4. **Create label quick-reference (optional)**
   - Single-page cheat sheet: label families with examples
   - Links to LABELING.md for details
   - Useful for new contributors

### Phase 3: Update Cross-References (Post Wave 5)

1. **Audit all files for references to removed/consolidated content**
   - Fix broken links to ISSUE_LABELS.md, PR_LABELS.md
   - Update links to labeling.instructions.md if removed
   - Ensure consistent URL/anchor usage

---

## Proposed Document Structure

After consolidation, recommended structure:

```
docs/
  ├── LABELING.md (comprehensive, ~350 lines)
  │   ├── Purpose & principles
  │   ├── Label families (status, priority, type, area, context, meta/release, contributor, discussion)
  │   ├── Issue labelling requirements & process
  │   ├── PR labelling requirements & branch mapping
  │   ├── Discussion labelling
  │   ├── Agent integration (user perspective)
  │   └── Troubleshooting & references

agents/
  └── labeling.agent.md (technical spec, ~240 lines—no change)

instructions/
  └── labeling.instructions.md (REMOVE or CONSOLIDATE, ~87 lines)
      Option A: Remove entirely (LABELING.md is sufficient)
      Option B: Keep as portable 1-page quick reference (~20-30 lines)

docs/
  └── AUTOMATION.md (revised, ~180 lines)
      ├── Automation philosophy
      ├── Branching & workflow strategy
      ├── Workflow overview
      ├── Label & issue type GOVERNANCE (not requirements)
      │   └── References LABELING.md for requirements
      ├── Workflow & agent governance
      ├── Configuration management
      └── References
```

---

## Next Steps

1. **Phase 1 (Immediate - Wave 5.3):**
   - [ ] Decide: keep or remove `instructions/labeling.instructions.md`
   - [ ] Remove label category duplication from labeling.instructions.md (or remove file)
   - [ ] Update AUTOMATION.md section 4 to reference LABELING.md for requirements
   - [ ] Verify no broken references to ISSUE_LABELS.md or PR_LABELS.md

2. **Phase 2 (Follow-up - Wave 5.3 or 5.4):**
   - [ ] Consolidate/remove labeling.instructions.md
   - [ ] Clarify governance vs. usage separation between AUTOMATION.md and LABELING.md
   - [ ] Update cross-references
   - [ ] Create label quick-reference (optional)

3. **Handoff to Wave 5.3-5.4 execution issues:**
   - [#665](https://github.com/lightspeedwp/.github/issues/665) (File organization alignment)
   - [#666](https://github.com/lightspeedwp/.github/issues/666) (Update documentation index)

---

**Audit Completed:** 2026-05-31
**Auditor:** Claude Code
**Status:** Ready for implementation

---
title: "Branding Meta Agent Planning Document"
description: "Comprehensive planning and sequencing for the unified branding agent initiative ([#33](https://github.com/lightspeedwp/.github/issues/33), [#46](https://github.com/lightspeedwp/.github/issues/46), [#48](https://github.com/lightspeedwp/.github/issues/48), [#49](https://github.com/lightspeedwp/.github/issues/49))"
created_date: "2026-05-28"
updated_date: "2026-05-28"
version: "v1.0.0"
owners: ["Claude"]
assignment: "Claude EXCLUSIVE — Copilot excluded from this workstream"
file_type: "documentation"
tags: ["branding", "meta-agent", "schema", "governance", "footers", "headers", "badges"]
status: completed
---

## Executive Summary

This document outlines the **complete planning and sequencing** for the Branding Meta Agent initiative (parent issue [#33](https://github.com/lightspeedwp/.github/issues/33), child issues [#46](https://github.com/lightspeedwp/.github/issues/46), [#48](https://github.com/lightspeedwp/.github/issues/48), [#49](https://github.com/lightspeedwp/.github/issues/49)).

The goal is to build a **unified, schema-driven branding agent** that automates category-aware Markdown headers, footers, and badges across the repository. The system must:

- Replace fragmented branding logic with one coherent config-driven approach
- Define a clear category taxonomy and template selection rules
- Validate all footer/header outputs against a schema
- Fix existing duplicate/malformed footers across all `.md` files
- Support future extensibility without duplicating logic

**Key constraint**: This work is **Claude-exclusive** to ensure architectural coherence across planning, specification, implementation, and validation phases.

---

## Problem Statement

### Current State Issues

1. **Fragmented Branding Logic**
   - Header/footer behaviour scattered across `header-footer.agent.md`, `badges.agent.md`, `.instructions` files
   - No centralised category taxonomy
   - No validation schema

2. **Duplicate Footers**
   - Some `.md` files have multiple footer variants
   - No clear precedence rules when metadata is missing
   - Hard-coded footer templates instead of config-driven selection

3. **Unclear Ownership**
   - Template design rules live in one place
   - Schema/config rules in another
   - Agent implementation logic separate from both
   - Risk of divergence and hard-to-maintain code

4. **No Validation**
   - No schema to validate frontmatter consistency
   - No rules engine to select headers/footers deterministically
   - No audit trail of which category rules apply to which files

### Opportunity

Build one **unified branding meta agent** that:

- Centralises branding logic in .schemas/config
- Makes category and template selection explicit and testable
- Supports deterministic, reproducible output
- Reduces maintenance cost through config-driven rules rather than code logic
- Enables future category additions without refactoring

---

## Solution Approach

### Phase 1: Define the System (Parallel Work)

**Issues to complete**:

- **[#33](https://github.com/lightspeedwp/.github/issues/33)**: Parent specification defining category taxonomy, footer/header requirements, scope
- **[#46](https://github.com/lightspeedwp/.github/issues/46)**: Template design rules and 5 footer variants per category
- **[#49](https://github.com/lightspeedwp/.github/issues/49)**: Schema/config model with JSON Schema validation

**Approach**:

- [#33](https://github.com/lightspeedwp/.github/issues/33) and [#46](https://github.com/lightspeedwp/.github/issues/46) can proceed in parallel; both inform [#49](https://github.com/lightspeedwp/.github/issues/49)
- [#49](https://github.com/lightspeedwp/.github/issues/49) synthesis happens after [#33](https://github.com/lightspeedwp/.github/issues/33) scope is locked and [#46](https://github.com/lightspeedwp/.github/issues/46) templates are drafted
- All three issues remain focused on **specification only** — no implementation

**Key decisions to lock down**:

1. Category list (issue, pull-request, docs, ai-ops, agents, instructions, prompts, schema, readme, test, utility, awesome-copilot, research, audit, workflow, governance)
2. Frontmatter fields (category, tags, and what else?)
3. Path-based defaults (docs/** → docs category, etc.)
4. Template selection precedence (frontmatter > path > global default)
5. Badge activation rules (category + tags determine which badges render)
6. Accessibility constraints (low noise, readable, WCAG compliant)

---

### Phase 2: Current-State Audit

**Objective**: Understand what exists before implementation.

**Tasks**:

1. Scan all `.md` files for existing footers
2. Categorise by pattern (Maintained with ❤️, Built by 🧱, etc.)
3. Identify duplicates and conflicts
4. Document which files need remediation
5. Build audit report with recommendations

**Deliverables**:

- Audit report (strengths, gaps, duplicates, risks)
- Remediation checklist (files to fix, priority, effort)
- Decision log for conflicts (e.g., "file X has 3 footers; which is canonical?")

---

### Phase 3: Schema & Config Implementation

**Objective**: Translate specification into working .schemas/config.

**Tasks**:

1. Define `agent-config.schema.json` structure
   - Category definitions
   - Frontmatter field contracts
   - Path-to-category mapping rules
   - Badge definitions and rules
   - Header/footer template references
   - Validation constraints

2. Create base `agent-config.yaml` (or equivalent)
   - Populate with category definitions from [#46](https://github.com/lightspeedwp/.github/issues/46), [#49](https://github.com/lightspeedwp/.github/issues/49)
   - Include template references (pointing to external files or inline)
   - Define defaults and fallback behaviour

3. Implement validation logic
   - JSON Schema validation for config
   - Frontmatter validation (category, tags, etc.)
   - Safe failure modes (don't corrupt files on invalid config)

**Deliverables**:

- Updated/created `agent-config.schema.json`
- Base `agent-config.yaml` with all categories and templates
- Validation rules documentation
- Example config snippets

---

### Phase 4: Agent Architecture & Merge

**Objective**: Consolidate branding logic into unified agent.

**Tasks**:

1. Review existing agents:
   - `header-footer.agent.md`
   - `badges.agent.md`
   - Related `.instructions` files

2. Design unified agent responsibilities:
   - Input: frontmatter + path context
   - Lookup category rules in config
   - Select templates based on precedence rules
   - Render headers, footers, badges
   - Output: final markdown with branding applied

3. Decide agent merging strategy:
   - Keep separate but coordinated? (lightweight coordination)
   - Fully merge into one agent? (single responsibility)
   - Create new "branding coordinator" agent? (orchestrates header/footer/badge agents)

4. Define inputs/outputs:
   - Input: frontmatter dict, file path, target category (optional)
   - Output: rendered header string, footer string, badge list
   - Error handling: what happens on validation failure?

**Deliverables**:

- Unified branding agent specification (responsibilities, inputs, outputs)
- Merge/refactor plan with step-by-step implementation sequence
- Helper function library (category lookup, template selection, rendering)

---

### Phase 5: Implementation & Remediation

**Objective**: Build agent and fix all existing footers.

**Tasks**:

1. Implement agent logic (following Phase 4 architecture)
2. Implement validation (config validation, frontmatter validation)
3. Create remediation script or manual process
   - Parse all `.md` files
   - Extract/validate frontmatter
   - Apply branding agent logic
   - Write updated files with new headers/footers
   - Validate output

4. Fix all duplicate/malformed footers
   - Run audit from Phase 2 against remediation
   - Verify category assignment is correct for each file
   - Confirm no data loss during conversion

5. Create CI/CD validation
   - Lint frontmatter on PR
   - Validate footer rendering on changed files
   - Prevent bad footers from merging

**Deliverables**:

- Fully implemented branding agent
- All `.md` files with correct headers/footers
- CI validation rules
- Remediation report (what was fixed, confidence level)

---

### Phase 6: Documentation & Rollout

**Objective**: Ensure maintainers understand the system.

**Tasks**:

1. Update/create documentation:
   - How to add a new category
   - How to customize templates
   - How the agent selects headers/footers
   - Troubleshooting guide

2. Create reviewer guidance:
   - What to check in PR reviews
   - How to validate branding compliance
   - When to escalate to maintainers

3. Update related docs:
   - `footer-header-style.instructions.md`
   - `a11y.instructions.md` (accessibility constraints)
   - `markdown.instructions.md` (branding section)

4. Maintenance notes:
   - How often to audit footers
   - How to deprecate old categories
   - How to add new badges

**Deliverables**:

- Complete documentation set
- Reviewer/maintainer guidance
- Maintenance runbook

---

## Work Breakdown Structure

### Wave 4A: Planning & Specification (Claude)

| Issue | Title | Effort | Dependencies | Owner |
| --- | --- | --- | --- | --- |
| [#33](https://github.com/lightspeedwp/.github/issues/33) | Parent specification: category taxonomy, requirements, scope | 3-4h | None | Claude |
| [#46](https://github.com/lightspeedwp/.github/issues/46) | Template design: 5 variants per category, rules | 4-5h | [#33](https://github.com/lightspeedwp/.github/issues/33) scope locked | Claude |
| [#49](https://github.com/lightspeedwp/.github/issues/49) | Schema/config model: category fields, validation, examples | 3-4h | [#33](https://github.com/lightspeedwp/.github/issues/33), [#46](https://github.com/lightspeedwp/.github/issues/46) (input) | Claude |
| [#48](https://github.com/lightspeedwp/.github/issues/48) | Documentation & agent spec | 2-3h | [#33](https://github.com/lightspeedwp/.github/issues/33), [#46](https://github.com/lightspeedwp/.github/issues/46), [#49](https://github.com/lightspeedwp/.github/issues/49) (input) | Claude |

**Total Effort**: ~12-16 hours
**Parallelism**: [#46](https://github.com/lightspeedwp/.github/issues/46) and [#49](https://github.com/lightspeedwp/.github/issues/49) can start after [#33](https://github.com/lightspeedwp/.github/issues/33) scope is confirmed

---

### Wave 4B: Current-State Audit (Claude)

| Task | Effort | Dependencies | Owner |
| --- | --- | --- | --- |
| Scan all `.md` files for existing footers | 1-2h | None | Claude |
| Categorise and document patterns | 1-2h | Scan complete | Claude |
| Produce audit report + remediation checklist | 1-2h | Categorisation complete | Claude |

**Total Effort**: ~3-6 hours

---

### Wave 4C: Schema & Config Implementation (Claude)

| Task | Effort | Dependencies | Owner |
| --- | --- | --- | --- |
| Design `agent-config.schema.json` | 2-3h | [#49](https://github.com/lightspeedwp/.github/issues/49) merged | Claude |
| Create base `agent-config.yaml` | 1-2h | Schema drafted | Claude |
| Implement validation logic | 2-3h | Config drafted | Claude |
| Document validation & examples | 1-2h | Validation complete | Claude |

**Total Effort**: ~6-10 hours

---

### Wave 4D: Agent Merge/Refactor (Claude)

| Task | Effort | Dependencies | Owner |
| --- | --- | --- | --- |
| Review existing agents & consolidation points | 1-2h | Schema + config merged | Claude |
| Design unified agent architecture | 2-3h | Review complete | Claude |
| Implement branding agent logic | 3-4h | Architecture finalized | Claude |
| Test agent with config examples | 1-2h | Implementation complete | Claude |

**Total Effort**: ~7-11 hours

---

### Wave 4E: Remediation & Validation (Claude)

| Task | Effort | Dependencies | Owner |
| --- | --- | --- | --- |
| Implement remediation script/process | 2-3h | Agent implementation complete | Claude |
| Fix all duplicate/malformed footers | 3-4h | Script ready, audit report | Claude |
| Set up CI validation rules | 1-2h | Remediation complete | Claude |
| Produce remediation report & audit | 1-2h | All fixes applied | Claude |

**Total Effort**: ~7-11 hours

---

### Wave 4F: Documentation & Rollout (Claude)

| Task | Effort | Dependencies | Owner |
| --- | --- | --- | --- |
| Write/update core documentation | 2-3h | Agent merged | Claude |
| Create reviewer guidance | 1-2h | Docs drafted | Claude |
| Update related instruction files | 1-2h | Docs drafted | Claude |
| Maintenance runbook | 1h | Documentation complete | Claude |

**Total Effort**: ~5-8 hours

---

## Implementation Sequence & Timeline

### Recommended Order (Waterfall with Parallelism)

1. **Week 1, Days 1–2**: Complete [#33](https://github.com/lightspeedwp/.github/issues/33), [#46](https://github.com/lightspeedwp/.github/issues/46), [#49](https://github.com/lightspeedwp/.github/issues/49), [#48](https://github.com/lightspeedwp/.github/issues/48) (specification phase)
   - [#33](https://github.com/lightspeedwp/.github/issues/33) and [#46](https://github.com/lightspeedwp/.github/issues/46) in parallel
   - [#49](https://github.com/lightspeedwp/.github/issues/49) depends on both
   - [#48](https://github.com/lightspeedwp/.github/issues/48) depends on all three

2. **Week 1, Days 3–4**: Current-state audit
   - Start immediately after [#33](https://github.com/lightspeedwp/.github/issues/33) scope confirmed
   - Document existing footers, duplicates, conflicts

3. **Week 2, Days 1–2**: Schema & config implementation
   - Implement `agent-config.schema.json`
   - Create base config and validation

4. **Week 2, Days 3–4**: Agent implementation
   - Design unified agent architecture
   - Implement branding logic
   - Test with config examples

5. **Week 3, Days 1–2**: Remediation
   - Run remediation script on all `.md` files
   - Fix duplicates and malformed footers
   - Validate results

6. **Week 3, Days 3–4**: Documentation & rollout
   - Write user and maintainer guidance
   - Set up CI validation
   - Final audit and sign-off

**Total Timeline**: ~3 weeks (compressed schedule with focused effort)

---

## Key Decisions Pending

| Decision | Options | Recommendation | Status |
| --- | --- | --- | --- |
| **Config Format** | JSON only vs. YAML vs. YAML + JSON Schema | YAML + JSON Schema (human-friendly + strict validation) | **Pending [#49](https://github.com/lightspeedwp/.github/issues/49)** |
| **Agent Merging** | Keep separate vs. fully merge vs. orchestrator | Depends on scope; likely full merge for coherence | **Pending [#33](https://github.com/lightspeedwp/.github/issues/33) scope** |
| **Footer Selection** | Deterministic (category) vs. configurable per file | Deterministic by default; allow frontmatter override | **Pending [#46](https://github.com/lightspeedwp/.github/issues/46) templates** |
| **Remediation Strategy** | Manual vs. automated script vs. agent-driven | Automated script with manual review per category | **Pending audit** |
| **CI Integration** | Pre-commit vs. PR check vs. both | Both: pre-commit for fast feedback + PR check for compliance | **Pending schema merge** |

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
| --- | --- | --- | --- |
| **Schema too rigid** | Medium | High | Gather maintainer feedback in [#49](https://github.com/lightspeedwp/.github/issues/49); design for extensibility |
| **Over-engineering config** | Medium | Medium | Keep Phase 1 focused on current needs; extensibility is secondary |
| **Duplicate footer conflicts** | High | Low | Audit report will identify conflicts; prioritize by frequency and clarity |
| **Agent performance** | Low | Medium | Profile config lookups; cache category assignments if needed |
| **Inconsistent remediation** | Medium | Medium | Automated script + manual verification per category; CI validation prevents future drift |

---

## Success Criteria

### Specification Phase ([#33](https://github.com/lightspeedwp/.github/issues/33), [#46](https://github.com/lightspeedwp/.github/issues/46), [#49](https://github.com/lightspeedwp/.github/issues/49), [#48](https://github.com/lightspeedwp/.github/issues/48))

- [ ] Category taxonomy locked and documented
- [ ] Template design finalized with 5+ variants per category
- [ ] Schema/config model approved by maintainer(s)
- [ ] Agent specification clear and unambiguous

### Audit Phase

- [ ] Current-state audit report published
- [ ] All duplicate footers documented
- [ ] Remediation priority and effort estimated

### Implementation Phase

- [ ] Schema/config merged and validated
- [ ] Branding agent implemented and tested
- [ ] All `.md` files remediated with new footers
- [ ] CI validation passing on all files

### Rollout Phase

- [ ] Documentation complete and reviewed
- [ ] Maintainer/reviewer guidance approved
- [ ] Final audit confirming no orphaned or malformed footers
- [ ] System ready for ongoing maintenance

---

## References & Related Issues

- **Parent Issue**: [#33](https://github.com/lightspeedwp/.github/issues/33) — Unified branding agent parent specification
- **Child Issues**: [#46](https://github.com/lightspeedwp/.github/issues/46), [#48](https://github.com/lightspeedwp/.github/issues/48), [#49](https://github.com/lightspeedwp/.github/issues/49)
- **Related Files**:
  - `footer-header-style.instructions.md`
  - `header-footer.agent.md`
  - `badges.agent.md`
  - `a11y.instructions.md`
  - `agent-config.schema.json`
  - `.github/projects/active/next-issues-execution-plan.md`

---

## Appendix: Template Category Matrix (Draft)

This matrix will be finalized in [#46](https://github.com/lightspeedwp/.github/issues/46) with full template variants.

| Category | Purpose | Audience | Required Badges | Header Style | Footer Style |
| --- | --- | --- | --- | --- | --- |
| `issue` | Bug report, feature request, discussion | Contributors, maintainers | status, priority, type | Issue context | Contributor guide link |
| `pull-request` | Code changes, feature implementation | Reviewers, maintainers | status, review, ci | PR context | Merge criteria |
| `docs` | User documentation, guides | Developers, agency owners | stability, updated | Section title | References & links |
| `ai-ops` | Automation, agent specs, governance | Maintainers, contributors | ai, governance, stability | Section title | Related issues |
| `agents` | Agent specifications and examples | Developers, integrators | ai, type, stability | Agent purpose | Inputs/outputs |
| `instructions` | Coding standards, guidelines | Developers, contributors | stability, standards | Instruction title | Links to related files |
| `prompts` | Prompt engineering, examples | Practitioners, developers | ai, type, version | Prompt name | Use case examples |
| `schema` | Data schemas, type definitions | Developers, maintainers | stability, schema, type | Schema name | Validation rules |
| `readme` | Project overviews, feature lists | All audiences | Featured, updated | Project name | Quick links |
| `test` | Test documentation, examples | Developers, QA | type, coverage | Test context | Running tests |
| `utility` | Tools, helper functions, scripts | Developers, ops | type, stability | Utility name | Usage examples |
| `awesome-copilot` | Copilot-related collections, tips | Developers, copilot users | featured, copilot, updated | Collection theme | Attribution |
| `research` | Research findings, analysis, studies | Researchers, architects | status, research, date | Research title | Methodology |
| `audit` | Audit reports, findings, assessments | Stakeholders, maintainers | status, audit, date | Audit scope | Recommendations |
| `workflow` | GitHub Actions, CI/CD, automation | DevOps, maintainers | type, stability, automated | Workflow name | Trigger conditions |
| `governance` | Policies, decision records, rules | All contributors | governance, policy | Policy name | Approval chain |

---

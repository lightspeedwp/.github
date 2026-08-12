---
file_type: documentation
title: PR Creation Agent — OPENSPEC
description: Formal specification for portable PR creation agent automating pull request generation across LightSpeed repos
version: 1.0.0
created_date: 2026-08-12
last_updated: 2026-08-12
authors:
  - lightspeedwp/agents
tags:
  - openspec
  - specification
  - agents
  - pr-creation
---

# PR Creation Agent — OPENSPEC

**Document ID:** `pr-creation-agent-openspec`  
**Version:** 1.0.0  
**Status:** 📋 Draft (Design Phase)  
**Created:** 2026-08-12  
**Related Issue:** [#1812 — PR Creation Agent Design Initiative](https://github.com/lightspeedwp/.github/issues/1812)  
**Related PR:** [#1796 — Design Phase](https://github.com/lightspeedwp/.github/pull/1796)  
**Parent Epic:** [#1722 — Repository Restructuring & Agent Standardisation](https://github.com/lightspeedwp/.github/issues/1722)

---

## 1. EXECUTIVE SUMMARY

### Problem Statement

Manual PR creation across LightSpeed repos leads to:

1. **Inconsistent governance** — Branching rules, templates, labels applied inconsistently
2. **Repeated friction** — Manual template routing, label selection, issue linking
3. **Governance gaps** — PR feedback tracking, changelog entries sometimes missed
4. **Multi-repo complexity** — Each repo has different branch strategies, label prefixes, templates
5. **Automation bottleneck** — Workflow-generated changes can't auto-create PRs

### Proposed Solution

Portable PR creation agent providing:

- **Automated PR composition** with template routing and governance enforcement
- **Workflow integration** enabling end-to-end automation pipelines
- **Multi-repo portability** via configuration + optional hooks
- **Full governance enforcement** (branch naming, labels, issue linking, feedback tracking)
- **Flexible autonomy** (Level 2: Create + Commit + PR for audit trail)

### Expected Outcomes

- **Automation:** 80%+ of PR creation automated across target repos
- **Governance:** 100% compliance with branch naming, templates, labels, issue linking
- **Consistency:** Standardized PR composition across 8–12 target repos
- **Portability:** Single agent codebase supporting multiple repos with config
- **Audit Trail:** Every commit signed and traceable to automation

---

## 2. SCOPE & CONSTRAINTS

### In Scope

| Component | Details |
|-----------|---------|
| **Triggers** | Workflow-driven, manual request, programmatic API |
| **Scope Detection** | Single-file (20%), multi-file (70%), complex (10%) |
| **Autonomy** | Level 2 (Create + Commit + PR) |
| **Skill Composition** | 4 existing + 6 new PR-specific skills |
| **Integration Points** | Branch naming, templates, labels, issues, feedback, Mergify |
| **Configuration** | `.claude/pr-agent.config.yml` + optional `.claude/pr-agent-hooks.js` |
| **Target Repos** | LightSpeed internal (8–12 repos) |

### Out of Scope

- ❌ Code generation (assumes code exists)
- ❌ Documentation generation (assumes docs exist)
- ❌ Changelog auto-generation (agent composes entry, doesn't generate)
- ❌ Auto-merge (human approval required)
- ❌ Level 3 autonomy (future enhancement)

### Constraints

| Constraint | Details |
|-----------|---------|
| **Branch Protection** | All PRs require approval before merge |
| **Template Enforcement** | PR must use canonical template for branch type |
| **Label Validation** | Only prefixed labels from `.github/labels.yml` |
| **Issue Linking** | Mandatory: `Resolves #123` or `Closes #456` |
| **Governance Compliance** | Branch naming, Mergify queue, feedback tracking |
| **API Rate Limits** | GitHub API v3 rate limits (5,000 req/hour) |
| **Multi-Repo Config** | Each repo provides `.claude/pr-agent.config.yml` |

---

## 3. DESIGN DECISIONS

### 3.1 Agent Tier: Multi-File Agent

**Decision:** Multi-file agent (not spec-based)

**Rationale:**

- Complexity justifies multiple files (orchestrator, skills, configuration)
- Reusable skills (`validate-branch-name`, `route-template`, `apply-labels`) used elsewhere
- Better testability and maintainability than monolithic approach
- Supports portable skills in `skills/` folder

**Reference:** DESIGN_QUESTIONS.md, Q6

---

### 3.2 Autonomy: Level 2 (Create + Commit + PR)

**Decision:** Create branch → Write files → Commit (signed) → Push → Create PR

**Rationale:**

- Level 1 (Create PR only) — Limited automation
- Level 2 (Create + Commit + PR) — **Recommended** — Balance automation with safety
- Level 3 (Full pipeline) — Too autonomous for MVP

**Safety Measures:**

- Commits signed with agent identity
- Branch history auditable via git blame
- Validation workflows run before merge (not bypassed)
- Humans review PR before merge
- Mergify sequential queue enforced

**Reference:** DESIGN_QUESTIONS.md, Q3

---

### 3.3 Integration: Full Governance Stack

**Decision:** Integrate with all governance layers

**Integration Points:**

| System | Integration | Required? |
|--------|-------------|-----------|
| Branch Naming | Validate `{type}/{scope}-{short-title}` | ✅ Yes |
| PR Templates | Route to correct template by branch type | ✅ Yes |
| Labels | Apply only prefixed labels from canonical set | ✅ Yes |
| Issue Linking | Require `Resolves #123` or `Closes #456` | ✅ Yes |
| Feedback Tracking | Copy `FEEDBACK_RESPONSE.md` if applicable | ⚠️ Conditional |
| Mergify Queue | Enqueue PR if repo uses sequential queue | ✅ Yes |
| Validation Workflows | Ensure all checks pass before ready | ✅ Yes |

**Reference:** DESIGN_QUESTIONS.md, Q4

---

### 3.4 Skill Composition: Skill-Delegating Architecture

**Decision:** Main agent delegates to 4 existing + 6 new skills

**Skill Breakdown:**

**Existing Skills (Reuse):**

1. `code-review` — Optional pre-PR review
2. `commit-push-pr` — Git operation patterns
3. `commit` — Commit signing
4. `figma` — Optional design-driven changes

**New Skills (Create):**

1. `pr/validate-branch-name` — Branch naming validation
2. `pr/route-pr-template` — Template routing
3. `pr/validate-and-apply-labels` — Label validation
4. `pr/enforce-issue-linking` — Issue linking validation
5. `pr/draft-pr-description` — PR body composition
6. `pr/create-pr` — GitHub API PR creation

**Rationale:**

- Better reusability — Skills used by other agents
- Better testability — Test skills independently
- Better maintainability — Changes isolated to skill scope
- Better observability — Clear execution trace

**Reference:** DESIGN_QUESTIONS.md, Q6–Q7

---

### 3.5 Portability: Configuration-Driven

**Decision:** Single agent codebase, per-repo customization via config + hooks

**Configuration Levels:**

**Level 1: `.claude/pr-agent.config.yml`**

```yaml
pr_agent:
  base_branch: 'develop'
  templates_path: '.github/PULL_REQUEST_TEMPLATE'
  canonical_labels: '.github/labels.yml'
  branch_validation:
    enabled: true
    allowed_types: [feat, fix, docs, chore, ci, refactor]
  issue_linking:
    required: true
    allowed_verbs: [Resolves, Closes, Fixes]
  changelog:
    required_for_types: [feat, fix]
```

**Level 2: `.claude/pr-agent-hooks.js` (Optional)**

```javascript
module.exports = {
  validateBranchName: async (branchName, config) => {},
  inferLabels: async (files, config) => {},
  customizeDescription: async (body, context) => {},
  onPRCreated: async (pr, context) => {}
}
```

**Rationale:**

- Single agent supports multiple repos without code changes
- Config enables standard customization
- Hooks enable non-standard logic
- Easy onboarding (copy config from `.github` repo as template)

**Reference:** DESIGN_QUESTIONS.md, Q8–Q9

---

## 4. MANDATORY PR CONTENT

### 4.1 Linked Issues (Mandatory)

**Requirement:** PR description must include `Resolves #123` or `Closes #456`

**Validation:**

- Issue numbers must exist and be open
- PR must target correct branch (develop for features, main for releases)
- Multiple issues supported: `Resolves #1, #2, #3`

---

### 4.2 PR Title (Mandatory)

**Requirement:** Under 70 chars, format `{type}: {description}`

**Examples:**

- `feat: PR creation agent architecture design`
- `fix: Label validation edge case`
- `docs: Update branching strategy guide`

---

### 4.3 Description (Mandatory)

**Requirement:** Must populate template sections

**Sections:**

- Summary (1–2 sentences)
- Changes (bulleted list)
- Testing (how to verify)
- Checklist (DoD from template)

---

### 4.4 Labels (Mandatory)

**Requirement:** At least one `type:*` label, optional `area:*` and `priority:*`

**Examples:**

- `type:feature` (required) + `priority:normal` (optional)
- `type:bug` (required) + `area:ci` (optional)

---

### 4.5 Changelog Entry (Conditional)

**Required if:** User-facing change (feature, bug fix, breaking change)  
**Not required if:** Docs-only internal changes, maintenance, refactoring

---

### 4.6 Feedback Tracking (Conditional)

**Required if:** PR addresses AI-generated feedback or agent-generated changes  
**Template:** `FEEDBACK_RESPONSE.md`

---

## 5. TARGET REPOS & ROLLOUT

### Phase 1 MVP (8–12 Repos)

**High Priority:**

1. `lightspeedwp/.github` — Highest governance complexity
2. WordPress plugins (5–7) — Similar branching strategy
3. Internal tools (2–3) — Less complex

### Phase 2+ (Extensible)

- External open-source repos
- Third-party integrations
- Custom per-repo configuration

---

## 6. RELATED DOCUMENTATION

| Document | Purpose |
|----------|---------|
| [README.md](./README.md) | Project overview, 4-phase roadmap |
| [DESIGN_QUESTIONS.md](./DESIGN_QUESTIONS.md) | 9 design questions with detailed rationale |
| GitHub Issue [#1812](https://github.com/lightspeedwp/.github/issues/1812) | Design initiative tracking |
| GitHub PR [#1796](https://github.com/lightspeedwp/.github/pull/1796) | Design phase delivery |

---

## 7. SUCCESS CRITERIA

- ✅ All 9 design questions answered with rationale
- ✅ Agent tier and skill architecture decided
- ✅ Portability strategy defined
- ✅ Integration points with 3+ target repos identified
- ✅ Specification document ready (Phase 2)

---

**Next Phase:** Phase 2 (Specification & Planning) — 2026-08-16 → 2026-08-20

---
name: Research Questions
title: Research Phase - Clarifying Questions & Responses
description: 14 clarifying questions to guide labeling consolidation research phase
metadata:
  created: 2026-09-03
  updated: 2026-09-03
  phase: 1-research
  status: in-progress
---

# Labeling Consolidation — Research Phase Questions

## Scope & Scale Questions

### Q1: Multi-repo Deployment Strategy
**Question:** Should the unified labeling logic work across all organization repository types:
- LightSpeed `.github` control plane
- WordPress block plugins (lightspeedwp/plugin-name)
- WordPress themes (lightspeedwp/theme-name)
- Other organization repositories

**Context:** Each repo type has different file structures, tooling, and labeling needs.

**Options:**
- A) Single universal agent that detects repo type and applies appropriate rules
- B) Separate agents per repo type with shared utility functions
- C) Template-based approach where each repo type has its own labeling configuration

**Response:**
- [ ] Pending user input

**Decision:**
- [ ] TBD

---

### Q2: Backward Compatibility & Migration
**Question:** How should we handle existing labels when rolling out the unified system?

**Context:** Current repos have labels that may not match the canonical `.github/labels.yml` schema. Some labels are "bare" (without prefix), some use old naming conventions.

**Options:**
- A) Preserve all existing labels, add canonical labels alongside them
- B) Migrate all existing labels to canonical format during rollout
- C) Enforce canonical labels only on new issues/PRs; don't touch existing

**Response:**
- [ ] Pending user input

**Decision:**
- [ ] TBD

---

### Q3: Retroactive Labeling
**Question:** Should the agent retroactively label existing open issues and PRs?

**Context:** Current workflows only run on new events. Existing issues/PRs lack labels.

**Options:**
- A) Yes, run initial batch labeling on all existing items during rollout
- B) No, only label new items going forward
- C) Optional via manual workflow trigger (workflow_dispatch)

**Response:**
- [ ] Pending user input

**Decision:**
- [ ] TBD

---

## Technical Architecture Questions

### Q4: Primary Agent Location
**Question:** Where should the main unified labeling logic live?

**Context:** Currently at `scripts/agents/labeling.agent.js`. Should it move to top-level `agents/` for org-wide portability?

**Options:**
- A) Keep in `scripts/agents/` (current location)
- B) Move to top-level `agents/` directory
- C) Both: keep core logic in `agents/`, with `.github`-specific variants in `scripts/agents/`

**Response:**
- [ ] Pending user input

**Decision:**
- [ ] TBD

---

### Q5: Multi-Agent Integration Points
**Question:** Which agents should have labeling capabilities?

**Context:** Labeling needs span PR review, release coordination, changelog generation, issue management, and discussions.

**Options:**
- A) All agents share a common labeling utility; each calls it as needed
- B) Central labeling agent; other agents delegate labeling requests to it
- C) Hybrid: common utilities for simple cases, central agent for complex decisions

**Response:**
- [ ] Pending user input

**Decision:**
- [ ] TBD

---

### Q6: Labeling Rules Source
**Question:** Where should labeling heuristics/rules be defined?

**Context:** Rules currently mixed between hardcoded agent logic, YAML files (.github/labeler.yml), and GitHub Actions workflows.

**Options:**
- A) YAML configuration files (`.github/labeler.yml` pattern)
- B) JSON Schema with validation (explicit, strongly-typed)
- C) Code-as-config (JavaScript/TypeScript objects in agent)
- D) Environment variables/GitHub Secrets
- E) Hybrid approach (YAML for patterns, code for complex logic)

**Response:**
- [ ] Pending user input

**Decision:**
- [ ] TBD

---

## Schema & Validation Questions

### Q7: Label Taxonomy Completeness
**Question:** Are the current 158 labels in `.github/labels.yml` sufficient?

**Context:** Label families: type:*, status:*, priority:*, area:*, comp:*, lang:*, env:*, compat:*, cpt:*, ai-ops:*, contrib:*, discussion:*, openspec:*

**Specific Gaps:**
- AI-specific labels for AI-generated content tracking?
- Process labels (e.g., proc:code-review, proc:design-review)?
- Expertise labels (e.g., exp:backend, exp:frontend)?
- Other categories?

**Response:**
- [ ] Pending user input

**Decision:**
- [ ] TBD

---

### Q8: Validation Strictness
**Question:** How strict should label validation be?

**Context:** Should system accept, auto-correct, or reject bare labels like `bug` instead of `type:bug`?

**Options:**
- A) Strict: reject bare labels with error message
- B) Lenient: auto-correct bare labels to canonical format
- C) Gradual: warn on bare labels, allow them for now, plan removal
- D) Per-repo: configurable strictness per repository

**Response:**
- [ ] Pending user input

**Decision:**
- [ ] TBD

---

### Q9: Composite Labels
**Question:** Label cardinality constraints?

**Context:** Can an issue have multiple `type:*` labels, or strictly one type per item?

**Specific Constraints:**
- Max one `status:*` label per item?
- Max one `priority:*` label per item?
- Unlimited `area:*`, `lang:*`, and metadata labels?
- Conflict rules (e.g., can't have both `status:done` and `status:in-progress`)?

**Response:**
- [ ] Pending user input

**Decision:**
- [ ] TBD

---

## Automation & Integration Questions

### Q10: Heuristic Confidence & Accuracy
**Question:** How confident should the agent be before applying labels?

**Context:** Different detection methods have different confidence levels (branch prefix 100%, keyword matching 70%, semantic analysis 85%).

**Options:**
- A) High confidence only (>90%): skip uncertain cases
- B) Medium confidence (>70%): apply with optional review
- C) Low confidence allowed (<70%): apply and report for audit
- D) Tiered: different thresholds for different label families

**Response:**
- [ ] Pending user input

**Decision:**
- [ ] TBD

---

### Q11: Error Handling & Resilience
**Question:** How should workflows handle labeling failures?

**Context:** GitHub API rate limits, label not found errors, permission issues.

**Options:**
- A) Strict: halt workflow on first error, fail the run
- B) Lenient: log errors and continue, report summary at end
- C) Partial: apply what succeeds, queue failures for retry
- D) Configurable per workflow

**Response:**
- [ ] Pending user input

**Decision:**
- [ ] TBD

---

### Q12: Audit & Cleanup Strategy
**Question:** Should there be background processes to audit and fix mislabeled items?

**Context:** Label audit workflow exists (`label-audit-report.yml`) and can detect issues but doesn't auto-remediate.

**Options:**
- A) No automatic cleanup: manual review required before changes
- B) Auto-cleanup with high confidence (>95%) only
- C) Regular audit with automated reports; manual approval before cleanup
- D) Aggressive cleanup with comprehensive logging

**Response:**
- [ ] Pending user input

**Decision:**
- [ ] TBD

---

## Dependencies & Integration Questions

### Q13: GitHub Agentic Workflows vs. GitHub Actions
**Question:** Should we adopt new GitHub agentic workflows feature?

**Context:** GitHub recently introduced agentic workflows (beta). Current infrastructure uses GitHub Actions. Agentic workflows have tighter agent integration.

**Options:**
- A) Stick with GitHub Actions (proven, widely understood)
- B) Migrate to GitHub agentic workflows (new, agent-native)
- C) Hybrid: use Actions for foundational work, agentic workflows for agent coordination
- D) Wait and see: keep Actions as primary, experiment with agentic workflows

**Response:**
- [ ] Pending user input

**Decision:**
- [ ] TBD

---

### Q14: External Service Integration
**Question:** Any need to sync labels to external systems?

**Context:** Labels could be synced to Slack channels, Jira issues, Linear projects, project management tools, or BI/analytics systems.

**Options:**
- A) No external sync needed; GitHub is source of truth
- B) Sync to specific services (list them)
- C) Build extensible sync framework for future use
- D) Per-repo customization

**Response:**
- [ ] Pending user input

**Decision:**
- [ ] TBD

---

## Research Notes

### Key Observations from Existing Infrastructure

1. **Workflow Consolidation Opportunity:** `labeling-governance.yml` already consolidates multiple workflows; further consolidation possible
2. **Script Duplication:** Multiple audit scripts (review-meta-labels.js, review-status-labels.js, validate-issue-labels.js) could share utilities
3. **Agent Maturity:** `labeling.agent.js` is well-structured with clear separation of concerns (content detection, branch matching, file-based area detection)
4. **Documentation Quality:** Comprehensive documentation exists (LABELING.md, LABEL_STRATEGY.md, script READMEs) providing good context
5. **Label Governance:** `.github/labels.yml` is well-maintained; `.github/label-governance-policy.yml` provides enforcement rules
6. **Rate Limiting:** Existing scripts handle GitHub API rate limiting with backoff; consolidation should preserve this capability

### Recommended Research Approach

**Round 1 (This Round):** Answer Q1-Q6 to establish scope, architecture, and rules definition strategy
**Round 2 (Next Round):** Answer Q7-Q9 to finalize schema decisions and validation rules
**Round 3 (Final Round):** Answer Q10-Q14 to complete automation and integration decisions

---

**Research Phase Status:** Questions Ready for User Input  
**Next Step:** User reviews questions and provides answers  
**Timeline:** 2-3 rounds of clarification expected


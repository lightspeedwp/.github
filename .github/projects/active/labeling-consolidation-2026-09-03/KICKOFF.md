---
project_id: labeling-consolidation-2026-09-03
title: Labeling Infrastructure Consolidation & Org-Wide Rollout
status: research
phase: 1-research
created: 2026-09-03
created_by: claude@lightspeedwp.agency
last_updated: 2026-09-03
version: 1.0
priority: high
complexity: high
---

# Labeling Infrastructure Consolidation & Org-Wide Rollout

## Executive Summary

This project consolidates fragmented labeling infrastructure (11+ workflows, 30+ scripts) into a unified, maintainable system deployable across all repository types (WordPress block plugins/themes, .github control plane).

**Core Problem:** 
- Open PRs in `.github` lack labels because workflows don't run retroactively
- Labeling logic duplicated across multiple scripts and workflows
- Inconsistent label application across org repositories
- Difficult to maintain and scale labeling rules

**Core Solution:**
- Create unified labeling agent with reusable skills for other agents
- Consolidate workflows into coherent architecture
- Generate shared labeling utilities for org-wide deployment
- Define clear label governance and validation rules

## Project Objectives

1. **Audit & Consolidation:** Comprehensive review of all 30+ labeling scripts and 11+ workflows
2. **Unified Agent:** Create central labeling logic consumable by all agents (PR, release, changelog, issues)
3. **Shared Skills:** Extract reusable labeling skills deployable to `skills/` directory
4. **Schema Validation:** Define and implement label schema with governance enforcement
5. **Org-Wide Rollout:** Create deployment strategy and documentation for multi-repo adoption
6. **Documentation:** Generate end-to-end guides for labeling operations and automation

## Key Deliverables

### Phase 1: Research (Current)
- [ ] RESEARCH_FINDINGS.md — Audit of all 30+ labeling scripts and 11+ workflows
- [ ] AUDIT_FINDINGS.md — Detailed analysis with duplication mapping
- [ ] CLARIFYING_QUESTIONS_ANSWERS.md — Response to 14 research questions
- [ ] SCHEMA_DESIGN.md — Proposed unified label schema with validation rules

### Phase 2: Planning & Approval
- [ ] WORKFLOW_CONSOLIDATION_PLAN.md — Before/after workflow architecture
- [ ] SKILLS_EXTRACTION_PLAN.md — Reusable skills for `skills/` directory
- [ ] MULTI_REPO_ROLLOUT_PLAN.md — Deployment strategy across org
- [ ] IMPLEMENTATION_ROADMAP.md — Timeline and dependencies

### Phase 3: Specification & Issues
- [ ] OPENSPEC_TASKS.md — Task specifications for GitHub Issues
- [ ] GitHub Issues created from OpenSpec with openspec:* labels
- [ ] PR templates and GitHub Actions workflow updates

### Phase 4: Implementation & Testing
- [ ] Unified labeling agent implementation
- [ ] Shared skills in `skills/` directory
- [ ] Workflow consolidation (merge/retire existing workflows)
- [ ] Comprehensive testing across .github and test repos
- [ ] Org-wide deployment

## Process Workflow

```
Research Phase (Current)
├─ Task-Researcher Agent
│  ├─ Ask 5-10+ clarifying questions
│  ├─ Multiple rounds of clarification
│  └─ Generate audit findings
├─ User reviews and answers
└─ Generate RESEARCH_FINDINGS.md

Planning Phase (Next)
├─ User approves research documents
├─ Task-Planner Agent
│  ├─ Generates OpenSpec tasks
│  └─ Creates implementation plans
└─ User approves planning documents

Specification Phase
├─ Task-Planner Agent
│  └─ Generates detailed OpenSpec documents
├─ Issues-Agent
│  └─ Creates GitHub Issues from specs
└─ Add openspec:* labels

Implementation Phase
├─ Implementation based on approved specs
├─ Testing and validation
├─ Org-wide deployment
└─ Documentation updates
```

## Key Constraints & Assumptions

- **Development on `develop` branch:** All work commits directly to `develop`, not through PR process
- **Branch naming:** Must use pattern `{type}/{scope}-{title}` (e.g., `feat/labeling-consolidation-2026-09-03`)
- **Label governance:** All labels must come from `.github/labels.yml` with required family prefix (type:, status:, area:, etc.)
- **Label schema:** 158 canonical labels with strict validation rules
- **Existing infrastructure:** Must leverage existing scripts, workflows, and agents rather than creating duplicates
- **Reusability:** Solutions must be portable for use by other agents (release, changelog, issues agents)

## Research Phase: Clarifying Questions

### Scope & Scale
1. **Multi-repo deployment:** Should labeling logic work for .github, WordPress block plugins, WordPress themes, and other org repos?
2. **Backward compatibility:** Do existing labels need to be migrated or can we start fresh with canonical labels from `.github/labels.yml`?
3. **Historical data:** Should the agent retroactively label existing open PRs, issues, and discussions?

### Technical Architecture
4. **Unified agent location:** Should the main labeling logic live in `scripts/agents/labeling.agent.js` or move to `agents/` for portability?
5. **Integration points:** Which agents need labeling capabilities? (PR agent, release agent, changelog agent, issues agent, discussion agent?)
6. **Decision source:** Should labeling rules come from files (labeler.yml), environment config, database, or be hardcoded?

### Schema & Validation
7. **Label taxonomy:** Are the current 158 labels in `.github/labels.yml` sufficient or need expansion?
8. **Validation strictness:** Should the system reject bare labels (e.g., `bug` instead of `type:bug`) or auto-correct them?
9. **Composite labels:** Can an issue have multiple type: labels, or strictly one type per item?

### Automation & Integration
10. **Heuristics accuracy:** How confident should the agent be before applying a label? (e.g., keyword matching vs. semantic analysis)
11. **Error handling:** On labeling failures, should workflows halt (strict) or continue with logging (lenient)?
12. **Audit & cleanup:** Should there be a background process to audit and fix mislabeled items? How often?

### Dependencies & Integration
13. **GitHub agentic workflows:** Should we use new GitHub agentic workflows feature or stick with GitHub Actions?
14. **External services:** Any need to sync labels to external systems (Slack, Jira, Linear)?

## Existing Infrastructure Inventory

### Workflows (11+ files)
- `labeling-governance.yml` — Unified consolidation workflow
- `labeling.yml` — Original labeling workflow
- `issue-labeling-automation.yml` — Batch issue labeling
- `label-audit-report.yml` — Audit reporting
- `manage-blocking-status-labels.yml` — Status label management
- `meta-labels-sync.yml` — meta:* label synchronization
- `validate-issue-labels.yml` — Label validation
- `openspec-sync-labels.yml`, `openspec-validate-labels.yml` — OpenSpec-specific workflows
- `remediate-bare-labels.yml` — Bare label cleanup
- And more...

### Scripts & Agents (30+ files)
- `scripts/agents/labeling.agent.js` — Main unified labeling agent
- `scripts/automation/label-orchestrator.js` — CLI orchestrator
- `scripts/automation/sync-pr-labels.js` — PR label synchronization
- `scripts/automation/review-meta-labels.js`, `review-status-labels.js` — Audit scripts
- `scripts/automation/manage-stale-issues.js` — Stale issue marking
- And more automation and validation scripts...

### Configuration
- `.github/labels.yml` — 158 canonical labels (source of truth)
- `.github/labeler.yml` — Pattern-based labeling rules
- `.github/label-governance-policy.yml` — Governance rules
- `.github/issue-types.yml`, `.github/issue-fields.yml` — Type/field definitions

### Documentation
- `docs/LABELING.md`, `docs/LABEL_STRATEGY.md` — User guides
- `docs/AUTOMATION.md` — Automation documentation
- Script READMEs (SYNC_PR_LABELS_README.md, etc.)

## Next Steps

1. **Research phase begins:** Task-Researcher Agent to ask clarifying questions
2. **User review:** Ashley reviews and answers clarifying questions (multiple rounds)
3. **Audit complete:** Research findings documented in RESEARCH_FINDINGS.md
4. **Planning approval:** User approves research before moving to planning phase
5. **Planning phase:** Task-Planner Agent generates OpenSpec specifications
6. **Spec review:** User approves specifications before implementation

## Related Documentation

- [CLAUDE.md](../../../CLAUDE.md) — Repository rules and branch naming
- [AGENTS.md](../../../AGENTS.md) — AI rules and contribution guidelines
- [docs/LABELING.md](../../../docs/LABELING.md) — Labeling strategy
- [.github/labels.yml](.github/labels.yml) — Canonical label definitions
- [LINKING_STANDARD.md](../reports-projects-restructuring-2026-08-11/LINKING_STANDARD.md) — Project linking conventions

---

**Status:** Phase 1 Research In Progress  
**Owner:** LightSpeedWP Maintainers  
**Next Review:** Clarifying questions phase


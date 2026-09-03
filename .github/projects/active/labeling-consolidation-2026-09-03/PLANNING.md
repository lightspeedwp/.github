---
file_type: planning
title: Labeling Agent Consolidation — Project Planning
description: Detailed project plan with phases, timeline, team structure, dependencies, and GitHub issue tracking
created_date: 2026-09-03
last_updated: 2026-09-03
status: active
tags:
  - planning
  - roadmap
  - timeline
---

# Labeling Agent Consolidation — Project Planning

**Project Owner:** Claude  
**Start Date:** 2026-09-03  
**Est. End Date:** 2026-10-15  
**Duration:** 4–6 weeks  
**Master Epic:** [To be created — issue #TBD]

---

## Executive Summary

The `.github` repository has grown to include 11+ labeling workflows, multiple labeling scripts, and fragmented issue/PR labeling logic—all tied to `.github` only. This project consolidates that infrastructure into:

1. **Unified labeling agent** leveraging GitHub agentic workflows
2. **Reusable skills** extracted to `skills/` for agent/task ecosystem
3. **Validated label schema** with comprehensive metadata
4. **Multi-repo rollout strategy** for WordPress plugin/theme repos

**Success looks like:** Single source of truth for labeling, 50%+ reduction in workflow files, consistent labeling across entire org, reduced maintenance burden.

---

## Objectives

### Primary

1. **Consolidate fragmented workflows** into fewer, clearer files (11+ → 3–5)
2. **Extract reusable labeling skills** for use by other agents (issues-agent, release-agent, changelog-agent)
3. **Design validated label schema** with clear taxonomy and validation rules
4. **Create org-wide labeling agent** using GitHub agentic workflows
5. **Plan multi-repo rollout** for gradual, safe deployment

### Secondary

1. Fix branch naming issue in PR #2626 (violates CLAUDE.md rules)
2. Integrate with existing agent/task ecosystem (issues-agent, task-researcher, task-planner)
3. Establish labeling standards across WordPress plugin/theme repos
4. Reduce labeling maintenance surface by 50%+
5. Enable new agents to request labels without custom workflow code

---

## Scope & Boundaries

### In Scope ✅

- All labeling workflows in `.github/workflows/`
- All labeling scripts in `scripts/` and other directories
- Label schema and validation (`labels.yml`, `issue-types.yml`)
- PR template routing by branch prefix
- GitHub agentic workflow architecture
- Reusable skills for `skills/` folder
- Multi-repo rollout to WordPress repos
- Integration with existing agents (issues-agent, task-researcher, task-planner)

### Out of Scope ❌

- Fixing existing incorrectly-labeled issues/PRs (separate issue-remediation project)
- Custom labels per individual repo (org-wide canonical set only)
- Copilot-specific labeling logic (handled by .github/custom-instructions.md)
- Label automation triggered outside GitHub (e.g., Slack bots)

---

## Clarifying Questions (Research Phase)

The research phase will answer these 14 questions to guide architecture and planning:

### Scope & Scale (Questions 1–3)

1. **Org-wide rollout timeline:** All repos at once, or phased pilot → WordPress plugins → themes?
2. **Repo types:** Control plane (.github) only, or also WordPress plugins and themes?
3. **Label differences by repo type:** Identical canonical labels across all repos, or repo-specific extensions allowed?

### Technical Architecture (Questions 4–6)

4. **GitHub agentic workflows:** Pure GitHub agent, Claude-based agent, or hybrid approach?
5. **Workflow consolidation scope:** One master file, separate PR/issue/discussion (but fewer), or keep specialized workflows?
6. **Skills location:** `skills/` (org-level), `.github/skills/` (control plane), or both with inheritance?

### Schema & Validation (Questions 7–9)

7. **Label schema complexity:** Keep flat YAML, add JSON Schema validation, support nested hierarchies, or add metadata?
8. **Cross-repo label consistency:** Identical labels everywhere, or repo-specific extensions?
9. **Issue types vs labels:** Unify into one source, keep separate but linked, or change nothing?

### Automation & Integration (Questions 10–12)

10. **Retroactive labeling:** Auto-label all existing unlabeled items, provide manual scripts, or label only new items forward?
11. **Shared skills priority:** Which skills to create first? (PR label detection, issue type → label mapping, status inference, conflict detection, multi-repo sync?)
12. **Integration with issues-agent:** Auto-apply labels on issue creation, require manual application, or support batch label templates?

### Dependencies & Blockers (Questions 13–14)

13. **Current blockers:** Known issues preventing consolidation? Circular dependencies? Team preferences?
14. **Frontmatter issues:** Fix `.github/projects/_templates/` frontmatter as part of this project, or separate task?

---

## Project Phases

### Phase 1: Research & Audit (Sept 3–9, Week 1)

**Owner:** Task-Researcher Agent  
**Deliverables:** RESEARCH_FINDINGS.md + AUDIT_FINDINGS.md  
**Related GitHub Issues:** [#TBD — Research Epic]

**What:** Answer 14 clarifying questions and audit all labeling components

**Tasks:**

- [ ] Task 1.1: Answer clarifying questions 1–14 through interviews, code review, and documentation analysis
- [ ] Task 1.2: Create comprehensive inventory of all labeling components:
  - Labeling workflows in `.github/workflows/`
  - Labeling scripts in `scripts/` and elsewhere
  - Label definitions in `labels.yml`, `issue-types.yml`
  - PR template routing logic
  - Copilot/agent labeling instructions
  - Existing labeling-related GitHub issues
- [ ] Task 1.3: Identify all dependencies, circular references, and blockers
- [ ] Task 1.4: Document findings in RESEARCH_FINDINGS.md and AUDIT_FINDINGS.md
- [ ] Task 1.5: Get user approval on research findings before proceeding to Phase 2

**Success Criteria:**

- All 14 questions answered with clear, documented reasoning
- Zero unlisted labeling components (complete audit)
- Dependencies clearly mapped
- User approval to proceed to planning phase

---

### Phase 2: Planning & Design (Sept 10–23, Weeks 2–3)

**Owner:** Task-Planner Agent  
**Deliverables:** OPENSPEC.md + SCHEMA_DESIGN.md + consolidation plan + skills extraction plan + rollout plan  
**Related GitHub Issues:** [#TBD — Planning Epic]

**What:** Design unified architecture, schema, and implementation strategy

**Tasks:**

- [ ] Task 2.1: Design unified labeling agent architecture:
  - GitHub agentic workflow vs Claude-based approach (based on research findings)
  - Component diagram
  - Integration points with other agents
  - Configuration structure
- [ ] Task 2.2: Design label schema with validation:
  - Hierarchical vs flat structure
  - Metadata fields (automation rules, usage patterns, etc.)
  - JSON Schema definitions
  - Cross-repo consistency rules
  - Examples with validation
- [ ] Task 2.3: Create workflow consolidation plan:
  - Current workflow file count
  - Target file count and structure
  - Before/after comparison
  - Migration strategy
  - Risk assessment
- [ ] Task 2.4: Plan reusable skills extraction:
  - Identify high-reuse components
  - Define skill interfaces
  - Plan for `skills/` folder structure
  - Integration with issues-agent, task-researcher, task-planner
- [ ] Task 2.5: Create multi-repo rollout strategy:
  - Phasing: control plane → WordPress plugins → WordPress themes
  - Per-phase validation and testing
  - Rollback procedures
  - Success metrics
  - Timeline
- [ ] Task 2.6: Document all findings in formal OpenSpec + plans
- [ ] Task 2.7: Get user approval before creating GitHub issues

**Success Criteria:**

- Architecture clearly defined with diagrams
- Schema validated with examples
- Consolidation plan shows file count reduction
- Skills extraction targets 70%+ reuse potential
- Rollout plan is realistic and phased
- All interdependencies documented
- User approval to proceed to Phase 3

---

### Phase 3: Spec → Issues (Sept 24–30, Week 4)

**Owner:** Issues-Agent  
**Deliverables:** GitHub Issues created + linked to project  
**Related GitHub Issues:** [Master Epic + Phase Epics]

**What:** Convert OpenSpec and plans into actionable GitHub issues

**Tasks:**

- [ ] Task 3.1: Create master epic for entire project
- [ ] Task 3.2: Create phase epics (one per implementation phase)
- [ ] Task 3.3: Create task issues for each OPENSPEC section and deliverable
- [ ] Task 3.4: Link all issues to active project per LINKING_STANDARD.md
- [ ] Task 3.5: Apply `type:automation`, `area:automation`, and `openspec:*` labels
- [ ] Task 3.6: Add issue links to PLANNING.md

**Success Criteria:**

- All GitHub issues created and linked
- Issues properly labeled and organized
- PLANNING.md updated with issue references
- Ready for implementation phase

---

### Phase 4: Implementation (Oct 1–15, Weeks 5–6)

**Owner:** Implementation Team (TBD)  
**Deliverables:** Unified labeling agent + extracted skills + validation schemas + tests  
**Related GitHub Issues:** [Phase 4 Epic]

**What:** Build unified labeling agent and extract reusable skills

**Tasks:**

- [ ] Task 4.1: Implement unified labeling agent per OPENSPEC.md
- [ ] Task 4.2: Implement label schema validation (JSON Schema)
- [ ] Task 4.3: Extract and package reusable skills:
  - PR label detection skill
  - Issue type → label mapping skill
  - Status/priority inference skill
  - Conflict detection skill
  - Multi-repo label sync skill
- [ ] Task 4.4: Create comprehensive tests (unit, integration, end-to-end)
- [ ] Task 4.5: Document all components with examples
- [ ] Task 4.6: Code review and security audit
- [ ] Task 4.7: Prepare deployment documentation

**Success Criteria:**

- Unified agent fully functional
- All skills tested and documented
- Test coverage > 80%
- Zero security vulnerabilities
- Ready for pilot deployment

---

### Phase 5: Testing & Rollout (Oct 16+, Week 7+)

**Owner:** Implementation Team (TBD)  
**Deliverables:** Tested agent + deployed to control plane + piloted on WordPress repos  
**Related GitHub Issues:** [Phase 5 Epic]

**What:** Validate, deploy, and roll out to multi-repo environment

**Tasks:**

- [ ] Task 5.1: Deploy to staging environment (.github/dev branch)
- [ ] Task 5.2: Run end-to-end testing and validation
- [ ] Task 5.3: Deploy to control plane (.github main)
- [ ] Task 5.4: Pilot deployment to 2–3 WordPress plugin repos
- [ ] Task 5.5: Gather feedback and make adjustments
- [ ] Task 5.6: Full rollout to all WordPress repos
- [ ] Task 5.7: Decommission old fragmented workflows
- [ ] Task 5.8: Update documentation and create runbooks

**Success Criteria:**

- All tests passing in staging
- Control plane deployment successful
- Pilot repos showing correct labeling behavior
- Zero regressions in existing workflows
- Full rollout complete

---

## Timeline & Milestones

```
Sept 2026
  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30

Phase 1: Research & Audit
████████                                    ↑ Sept 9: Research complete

Phase 2: Planning & Design
        ████████████████████               ↑ Sept 23: Design complete

Phase 3: Spec → Issues
                        ████████          ↑ Sept 30: Issues created

Oct 2026
  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15

Phase 4: Implementation
████████████████████                      ↑ Oct 15: Implementation complete

Phase 5: Testing & Rollout
                        ████████████      ↑ Oct 22+: Rollout complete
```

---

## Team & Responsibilities

| Role | Person | Responsibilities | Contact |
|------|--------|------------------|---------|
| **Project Owner** | Claude | Overall coordination, approval gates, risk management | In this session |
| **Research Lead** | Task-Researcher Agent | Phase 1 research, audit, clarifying questions | TBD |
| **Planning Lead** | Task-Planner Agent | Phase 2 design, OpenSpec, planning | TBD |
| **Implementation Lead** | [TBD] | Phase 4–5 implementation, testing, deployment | TBD |
| **Stakeholder** | LightSpeed Team | Feedback, review, blockers resolution | TBD |

---

## Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|-----------|
| Workflow consolidation breaks existing behavior | High | Medium | Comprehensive testing + gradual rollout |
| Label schema changes cause disruption | High | Medium | Backward compatibility layer + migration period |
| Multi-repo rollout finds unexpected differences | Medium | High | Pilot in 2–3 repos first, gather feedback |
| Team prefers keeping some fragmented workflows | Medium | Medium | Document rationale for consolidation, negotiate |
| Frontmatter template issues block project | Low | Low | Fix templates if needed, separate task if major |

---

## Dependencies & Blockers

### Current Blockers

- ⚠️ **PR #2626 uses invalid branch name** (violates CLAUDE.md rules)
  - **Impact:** Can't approve PR, must close and recreate with correct branch
  - **Action:** Closed, work continues on `feat/labeling-consolidation-2026-09-03`

### External Dependencies

- GitHub agentic workflows API/documentation (for Phase 2 architecture)
- Existing `.github` workflows and scripts (for audit)
- LightSpeed team availability for feedback and approval gates

### Internal Dependencies

- Phase 1 must complete before Phase 2 begins (research informs design)
- Phase 2 must complete before Phase 3 begins (specs create issues)
- Phase 3 must complete before Phase 4 begins (issues guide implementation)

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Workflow file count reduction | 50%+ (11+ → 5 or fewer) | Count files before/after |
| Test coverage | > 80% | Code coverage report |
| Schema validation compliance | 100% | All existing labels pass schema validation |
| Multi-repo consistency | 100% | All repos using canonical labels |
| Documentation completeness | 100% | All components documented with examples |
| User satisfaction | > 4/5 | Post-rollout survey |

---

## References

- **AGENTS.md** — Org-wide AI rules and coding standards
- **labels.yml** — Current canonical label definitions (158 labels)
- **issue-types.yml** — Current issue type definitions
- **`.github/instructions/branch-naming.instructions.md`** — Branch naming rules
- **LINKING_STANDARD.md** — How to link GitHub issues to projects
- **GitHub Agentic Workflows** — https://docs.github.com/en/copilot/concepts/agents/about-github-agentic-workflows

---

**Plan Version:** 1.0.0  
**Created:** 2026-09-03  
**Last Updated:** 2026-09-03  
**Maintained By:** Claude

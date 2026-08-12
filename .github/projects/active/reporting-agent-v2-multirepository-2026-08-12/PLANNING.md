---
file_type: planning
title: "Reporting Agent v2 — Multi-Repository Edition — Planning & Specification"
description: "Project planning document with objectives, phases, deliverables, and technical architecture"
version: 1.0.0
created_date: 2026-08-12
last_updated: 2026-08-12
authors:
  - LightSpeed Team
owner: LightSpeed Maintainers
maintainer: LightSpeed Maintainers
tags:
  - planning
  - specification
  - agent
  - reporting
  - multi-repository
domain: "agents"
status: "active"
related_issues:
  - "TBD — Master epic for Reporting Agent v2"
  - "TBD — Validate agent in control-plane"
---

# Reporting Agent v2 — Multi-Repository Edition — Planning & Specification

**Status:** 🟡 Active | **Owner:** LightSpeed Maintainers | **Last Updated:** 2026-08-12

---

## Quick Summary

**Objective:** Enhance Reporting Agent to support heterogeneous repository types (plugins, themes, platform, control-plane) with single unified agent, automatic context detection, and repository-aware templates.

**Duration:** 4 weeks  
**Target Completion:** 2026-09-09  
**Key Stakeholders:** Platform team, plugin maintainers, theme maintainers, control-plane team

---

## Executive Summary

The current Reporting Agent (v1.3) is designed for control-plane reporting only. This project extends it to work across LightSpeedWP's heterogeneous repository landscape—WordPress block plugins, block themes, platform repositories, and the control-plane—while maintaining a **single unified agent**.

### Problem Statement

- **Current:** Reporting agent is control-plane specific; unclear if separate versions needed for plugins, themes
- **Pain Point:** Users want consistent reporting across org but don't know how to apply v1 agent to their plugin/theme repos
- **Opportunity:** Enhance v1 agent to auto-detect context and adapt templates, enabling org-wide adoption

### Solution Overview

**One unified agent** that:

1. Auto-detects repository type (plugin, theme, platform, control-plane) on first use
2. Adapts reporting templates based on detected context
3. Maintains consistent org-wide standards while respecting repo-specific conventions
4. Provides repo-aware guidance (e.g., "block coverage" for plugins, "template coverage" for themes)

### Expected Outcomes

- ✅ Single unified Reporting Agent v2 works across all repo types (not separate versions)
- ✅ Automatic context detection prevents user confusion
- ✅ Repository-aware templates make reporting easier and more relevant
- ✅ Org-wide adoption increases reporting consistency and completeness
- ✅ Minimal maintenance burden (one agent to maintain, not multiple)

---

## Scope & Objectives

### Primary Objectives

1. **Enhance Agent Prompt** — Extend v1 agent with multi-repo support, context detection, and repo-aware templates
2. **Validate in Control-Plane** — Test agent with existing control-plane reporting workflows
3. **Test with Block Plugins** — Deploy to 2-3 plugin repos and validate repo detection and templates
4. **Test with Block Themes** — Deploy to 2-3 theme repos and validate template coverage templates
5. **Org-Wide Rollout** — Publish stable v2.0 and create onboarding materials
6. **Document Architecture** — Create specification document explaining one-agent approach

### Success Criteria

- [ ] Agent v2 prompt complete with multi-repo support
- [ ] Automatic context detection validates correctly in 3 different repo types
- [ ] Repository-aware templates created for plugins and themes
- [ ] Control-plane testing complete with no breaking changes
- [ ] Plugin repo testing complete with positive feedback
- [ ] Theme repo testing complete with positive feedback
- [ ] Deployment strategy documented and approved
- [ ] Org-wide rollout initiated with 5+ repos using v2
- [ ] v2.0 marked as stable in `.github/agents/reporting.agent.md`

### Out of Scope

- **Custom agents per repo type** — v1 approached; not needed with context detection
- **Integration with GitHub API** — Future v3 enhancement
- **Auto-generation of report JSON schemas** — Separate project
- **Multi-language support** — UK English only (org standard)
- **Custom frontmatter fields beyond org-wide standards** — Can be added in future minor versions

---

## Implementation Strategy

### Overall Approach

**Phased rollout with validation gates:**

1. **Phase 1:** Enhance agent prompt, document architecture (1 week)
2. **Phase 2:** Control-plane validation, PR creation (1 week)
3. **Phase 3:** Block plugin testing and refinement (1 week)
4. **Phase 4:** Block theme testing and refinement (1 week)
5. **Phase 5:** Org-wide rollout and onboarding (parallel with phases 3-4)

### Key Principles

1. **Single Agent, Not Variants** — One agent with context-aware templates beats multiple specialized agents for maintainability and consistency
2. **Auto-Detection Over Config** — Agent inspects repo structure; users don't need to configure anything
3. **Org Standards + Repo Flexibility** — Apply LightSpeed-wide standards as baseline; allow repo-specific adaptations where documented
4. **Backward Compatibility** — v2 must not break existing v1 workflows; all v1 templates still work
5. **Clear Documentation** — Users need to understand how context detection works and why templates adapt

---

## Project Phases

### Phase 1: Enhanced Agent Prompt & Documentation (Week 1)

**Duration:** 5 days (2026-08-12 to 2026-08-16)

**Deliverables:**

- ✅ Agent prompt v2 with multi-repo support, context detection, repo-aware templates
- ✅ SPECIFICATION.md documenting architecture and one-agent approach
- ✅ DEPLOYMENT_STRATEGY.md with 4-phase rollout plan
- ✅ Active project folder with planning documents
- ✅ Branch: `feat/reporting-agent-v2` created and ready for PR

**Tasks:**

- ✅ Design context detection logic
- ✅ Create block plugin-specific templates (block registration audit, block test coverage)
- ✅ Create block theme-specific templates (template coverage, pattern compatibility)
- ✅ Document architecture in SPECIFICATION.md
- ✅ Create active project README, PLANNING.md
- ✅ Create GitHub issues for phases 2-4 (linked to project)

**Success Criteria:**

- ✅ Agent prompt complete and coherent
- ✅ Context detection logic clearly documented
- ✅ All templates created and validated
- ✅ Active project created with clear planning

**Blockers:** None

---

### Phase 2: Control-Plane Validation & PR Creation (Week 2)

**Duration:** 5 days (2026-08-19 to 2026-08-23)

**Deliverables:**

- ⏳ Agent v2 tested in control-plane repo
- ⏳ Sample reports created and validated
- ⏳ PR created: `feat/reporting-agent-v2` → `develop`
- ⏳ OpenSpec validation run and results documented
- ⏳ PR review complete, merged to develop

**Tasks:**

- ⏳ Copy agent v2 prompt to `.github/agents/reporting.agent.md`
- ⏳ Create test reports: label audit, workflow validation, instruction audit
- ⏳ Validate context detection in control-plane
- ⏳ Test all templates with sample data
- ⏳ Run OpenSpec on all planning documents
- ⏳ Create PR with clear description and related issues
- ⏳ Address review feedback and merge

**Success Criteria:**

- ⏳ Agent context correctly detected as control-plane
- ⏳ All v1 templates still work (backward compatible)
- ⏳ Sample reports created and reviewed
- ⏳ OpenSpec validation passes or issues documented
- ⏳ PR merged to develop
- ⏳ No breaking changes to existing workflows

**Blockers:**

- OpenSpec validation issues (if any)
- Code review feedback

---

### Phase 3: Block Plugin Testing & Refinement (Week 3)

**Duration:** 5 days (2026-08-26 to 2026-08-30)

**Deliverables:**

- ⏳ Agent v2 tested with 2-3 block plugin repos
- ⏳ Block plugin templates validated
- ⏳ Feedback collected from plugin maintainers
- ⏳ Refinements documented for v2.1
- ⏳ Plugin maintainer onboarding guide created

**Tasks:**

- ⏳ Coordinate with 2-3 block plugin repos
- ⏳ Test context detection: agent correctly identifies repo as block plugin
- ⏳ Create sample reports: block registration audit, test coverage per block
- ⏳ Validate block-specific templates and metrics
- ⏳ Gather feedback: What works? What needs improvement?
- ⏳ Create plugin-specific reporting guide
- ⏳ Document refinements for future versions

**Success Criteria:**

- ⏳ Context detection works in 2-3 plugin repos
- ⏳ Block plugin templates create relevant reports
- ⏳ Plugin maintainers provide positive feedback or document improvements
- ⏳ No breaking changes to plugin repos
- ⏳ Plugin onboarding guide created

**Blockers:**

- Plugin maintainer availability
- Unexpected template gaps

**Notes:**

- Runs in parallel with Phase 4 for efficiency

---

### Phase 4: Block Theme Testing & Refinement (Week 4)

**Duration:** 5 days (2026-09-02 to 2026-09-06)

**Deliverables:**

- ⏳ Agent v2 tested with 2-3 block theme repos
- ⏳ Block theme templates validated
- ⏳ Feedback collected from theme maintainers
- ⏳ Refinements documented for v2.1
- ⏳ Theme maintainer onboarding guide created

**Tasks:**

- ⏳ Coordinate with 2-3 block theme repos
- ⏳ Test context detection: agent correctly identifies repo as block theme
- ⏳ Create sample reports: template coverage, pattern compatibility
- ⏳ Validate theme-specific templates and metrics
- ⏳ Gather feedback: What works? What needs improvement?
- ⏳ Create theme-specific reporting guide
- ⏳ Document refinements for future versions

**Success Criteria:**

- ⏳ Context detection works in 2-3 theme repos
- ⏳ Block theme templates create relevant reports
- ⏳ Theme maintainers provide positive feedback or document improvements
- ⏳ No breaking changes to theme repos
- ⏳ Theme onboarding guide created

**Blockers:**

- Theme maintainer availability
- Unexpected template gaps

**Notes:**

- Runs in parallel with Phase 3 for efficiency

---

### Phase 5: Org-Wide Rollout & Onboarding (Week 4-5)

**Duration:** 5-7 days (2026-09-02 to 2026-09-09)

**Deliverables:**

- ⏳ Stable v2.0 released in `.github/agents/reporting.agent.md`
- ⏳ Org-wide onboarding guide created
- ⏳ Team announcement in Slack
- ⏳ Quick-start guide in org wiki/handbook
- ⏳ FAQ document addressing common questions

**Tasks:**

- ⏳ Finalize agent v2 based on Phase 2-4 feedback
- ⏳ Mark as v2.0 stable and update version in frontmatter
- ⏳ Create comprehensive onboarding guide (5-7 pages)
- ⏳ Create quick-start guide for different repo types
- ⏳ Create FAQ addressing multi-repo concerns
- ⏳ Post org-wide announcement in Slack
- ⏳ Add to org handbook/wiki
- ⏳ Plan v2.1 enhancement based on feedback

**Success Criteria:**

- ⏳ Agent v2.0 published and stable
- ⏳ 5+ repos actively using v2 within first week
- ⏳ Positive feedback from plugin and theme maintainers
- ⏳ Onboarding materials accessible to all teams
- ⏳ No urgent bugs or breaking changes reported

**Blockers:**

- Delayed feedback from Phases 3-4
- Unexpected issues in v2 during testing

**Notes:**

- Runs in parallel with Phases 3-4 for efficiency

---

## Technical Architecture

### Context Detection Algorithm

Agent inspects repository on first use:

```
1. Read package.json / composer.json
   → Check "type" field, "description", keywords
   → Look for hints: "wordpress-block-plugin", "wordpress-block-theme"

2. Search .github/reports/ structure
   → Detect existing categories and reports
   → Infer conventions from naming patterns

3. Sample existing reports (3-5)
   → Extract frontmatter patterns
   → Detect date formats, kebab-case usage
   → Look for repo-specific tags (e.g., "block-name")

4. Store context for session
   → Cache detected repo type
   → Use cached context for remaining conversation
   → Allow user to override if needed
```

### Repository Types

| Type | Detection Hints | Default Categories | Templates |
|------|-----------------|-------------------|-----------|
| **Block Plugin** | `"wordpress-block-plugin"` in package.json | coverage, progress, validation | Block Registration Audit, Block Test Coverage |
| **Block Theme** | `"wordpress-block-theme"` in package.json | coverage, progress, validation | Template Coverage, Pattern Compatibility |
| **Control-Plane** | `.github/` folder at root, org repos | analysis, audits, labeling, metrics, progress | Label Audit, Workflow Validation |
| **Platform** | Custom indicators | All categories | Flexible per component |

### Template Categories

| Category | All Repos | Plugin-Specific | Theme-Specific | Control-Plane-Specific |
|----------|-----------|-----------------|-----------------|----------------------|
| `analysis` | ✅ | — | — | ✅ |
| `audits` | ✅ | — | — | ✅ |
| `coverage` | ✅ | Block coverage | Template coverage | — |
| `metrics` | ✅ | — | — | ✅ |
| `progress` | ✅ | ✅ Block progress | ✅ Theme progress | ✅ Org progress |
| `validation` | ✅ | Block validation | Theme validation | ✅ Config validation |

---

## Risk Assessment & Mitigation

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|-----------|
| Context detection fails in edge cases | Medium | Low | Thorough testing in Phases 2-4; allow manual override |
| Templates don't fit all repo contexts | Medium | Medium | Gather feedback in Phases 3-4; plan v2.1 refinements |
| Backward compatibility broken | High | Low | Comprehensive testing of v1 workflows in Phase 2 |
| Plugin/theme maintainers unavailable | Medium | Medium | Identify volunteers early; prepare test repos |
| OpenSpec validation reveals gaps | Medium | Low | Address issues before org-wide rollout |

---

## Resource Requirements

| Resource | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 | Total |
|----------|--------|--------|--------|--------|--------|-------|
| **Agent Engineer** | 16h | 8h | 4h | 4h | 4h | 36h |
| **Tester** | 4h | 8h | 4h | 4h | 2h | 22h |
| **Documentation** | 8h | 4h | 4h | 4h | 6h | 26h |
| **Plugin Maintainer** | — | — | 4h | — | 1h | 5h |
| **Theme Maintainer** | — | — | — | 4h | 1h | 5h |

**Total Effort:** ~94 person-hours across 4 weeks (timeline allows for part-time contributions)

---

## Success Metrics

### Phase-Specific Metrics

| Phase | Metric | Target | Success |
|-------|--------|--------|---------|
| **Phase 1** | Agent prompt completeness | 100% | ✅ Agent prompt complete, all templates created |
| **Phase 2** | Backward compatibility | 100% | ✅ All v1 templates work in control-plane |
| **Phase 3** | Plugin template relevance | 4/5 rating | ✅ Plugin maintainers rate templates 4+ |
| **Phase 4** | Theme template relevance | 4/5 rating | ✅ Theme maintainers rate templates 4+ |
| **Phase 5** | Org adoption | 5+ repos | ✅ 5+ repos use v2 within first week |

### Overall Success Indicators

- ✅ Agent v2.0 published and stable
- ✅ Zero breaking changes to v1 workflows
- ✅ Context detection works in 100% of test cases
- ✅ Plugin and theme maintainers report positive experience
- ✅ Org adoption reaches 10+ repos within 2 weeks of rollout

---

## Dependencies & Prerequisites

### External Dependencies

- ✅ GitHub Actions (for PR CI/CD validation)
- ✅ OpenSpec framework (for validation)
- ✅ 2-3 volunteer plugin repos for testing
- ✅ 2-3 volunteer theme repos for testing

### Internal Dependencies

- ✅ Existing `.github/agents/reporting.agent.md` (v1.3)
- ✅ Existing reporting standards in `.github/labels.yml` and docs/
- ✅ GitHub issue system for tracking (create issues in Phase 1)
- ✅ Active project linking system

### Prerequisite Tasks

- ✅ Identify plugin and theme maintainer volunteers (Phase 1)
- ✅ Create GitHub issues for Phases 2-5 (Phase 1)
- ✅ Set up test repos with sample reports (Phase 2)

---

## Timeline & Milestones

| Week | Phase | Milestone | Target Date |
|------|-------|-----------|-------------|
| **Week 1** | Phase 1 | Agent prompt + planning docs complete | 2026-08-16 |
| **Week 2** | Phase 2 | Control-plane validation + PR merged | 2026-08-23 |
| **Week 3** | Phases 3-5 | Plugin testing + onboarding prep | 2026-08-30 |
| **Week 4** | Phases 4-5 | Theme testing + org rollout | 2026-09-06 |
| **Final** | Phase 5 | v2.0 stable, 5+ repos adopted | 2026-09-09 |

---

## Version Roadmap

### v2.0 (Target: 2026-09-09)

- ✅ Multi-repository support
- ✅ Automatic context detection
- ✅ Block plugin templates
- ✅ Block theme templates
- ✅ 100% backward compatible with v1

### v2.1 (Target: Q4 2026)

- 📋 Refined templates based on real usage
- 📋 Additional category templates (if needed)
- 📋 Custom frontmatter field support

### v3.0 (Target: 2027)

- 📋 GitHub API integration (auto-link issues, auto-tag PRs)
- 📋 Automated report generation workflows
- 📋 Multi-language support

---

## Approval & Sign-Off

| Role | Name | Status | Date |
|------|------|--------|------|
| **Project Lead** | TBD | ⏳ Pending | — |
| **Technical Reviewer** | TBD | ⏳ Pending | — |
| **Stakeholder (Plugin Lead)** | TBD | ⏳ Pending | — |
| **Stakeholder (Theme Lead)** | TBD | ⏳ Pending | — |

---

**Created:** 2026-08-12  
**Last Updated:** 2026-08-12  
**Status:** 🟡 Active  
**Phase:** Planning & Documentation

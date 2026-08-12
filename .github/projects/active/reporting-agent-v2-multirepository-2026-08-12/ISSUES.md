---
file_type: index
title: "Reporting Agent v2 — Related GitHub Issues"
description: "Index of GitHub issues related to Reporting Agent v2 project phases and deliverables"
created_date: 2026-08-12
last_updated: 2026-08-12
tags:
  - issues
  - tracking
  - coordination
---

# Reporting Agent v2 — Related GitHub Issues

## Project Status

This document tracks GitHub issues related to the Reporting Agent v2 multi-repository project.

**Project:** Reporting Agent v2 — Multi-Repository Support  
**Project Folder:** `.github/projects/active/reporting-agent-v2-multirepository-2026-08-12/`  
**Branch:** `feat/reporting-agent-v2`

---

## Issues to Create

### Epic: Reporting Agent v2 Multi-Repository Support

**Issue Type:** Epic  
**Labels:** `type:epic`, `area:agents`, `domain:governance`  
**Title:** Reporting Agent v2 — Multi-Repository Support  
**Description:**

```
Master epic for enhancing Reporting Agent to support heterogeneous repository types (WordPress block plugins, block themes, platform, control-plane) with single unified agent, automatic context detection, and repository-aware templates.

## Goals

- [ ] Enhance agent prompt with multi-repo support
- [ ] Implement automatic context detection
- [ ] Create repository-aware templates
- [ ] Validate in control-plane repo
- [ ] Test with block plugin repos
- [ ] Test with block theme repos
- [ ] Org-wide rollout and publication
- [ ] 5+ repos adopt v2 within 2 weeks

## Key Deliverables

- Enhanced agent prompt (v2.0)
- SPECIFICATION.md documenting architecture
- DEPLOYMENT_STRATEGY.md with rollout plan
- Plugin-specific templates
- Theme-specific templates
- Onboarding materials
- OpenSpec validation results

## Timeline

4 weeks (2026-08-12 to 2026-09-09)

## Related Documents

- [Project README](./)
- [PLANNING.md](./PLANNING.md)
- [SPECIFICATION.md](./SPECIFICATION.md)
- [DEPLOYMENT_STRATEGY.md](./DEPLOYMENT_STRATEGY.md)

See [Linking Standard](./../reports-projects-restructuring-2026-08-11/LINKING_STANDARD.md) for linking patterns.
```

**Related Project Issues:** Phase 1-5 (see below)

---

### Phase 1: Enhanced Agent Prompt & Documentation

**Issue Type:** Task  
**Labels:** `type:task`, `area:agents`, `phase:1`, `priority:critical`  
**Title:** Phase 1 — Agent Prompt v2 & Planning Documentation  
**Assignee:** TBD (Agent Engineer + Documentation)  
**Due:** 2026-08-16

**Description:**

```
Phase 1 of Reporting Agent v2 project.

## Deliverables

- [ ] Agent prompt v2 with multi-repo support
- [ ] Context detection algorithm documented
- [ ] Plugin-specific templates created
- [ ] Theme-specific templates created
- [ ] SPECIFICATION.md completed
- [ ] DEPLOYMENT_STRATEGY.md completed
- [ ] Active project folder created
- [ ] PLANNING.md completed
- [ ] ISSUES.md created with related issues
- [ ] Branch: feat/reporting-agent-v2 ready for PR
- [ ] Related GitHub issues created (Phases 2-5)

## Success Criteria

- [ ] Agent prompt complete and coherent
- [ ] Context detection logic clear and testable
- [ ] All templates created with examples
- [ ] Active project documentation complete
- [ ] All planning documents pass OpenSpec validation
- [ ] No blocking issues with project structure

## Blockers

None currently identified.

## Related

- Epic: Reporting Agent v2 Multi-Repository Support
- Related project: .github/projects/active/reporting-agent-v2-multirepository-2026-08-12/
```

---

### Phase 2: Control-Plane Validation & PR Creation

**Issue Type:** Task  
**Labels:** `type:task`, `area:agents`, `phase:2`, `priority:critical`  
**Title:** Phase 2 — Control-Plane Validation & PR Merge  
**Assignee:** TBD (Agent Engineer + Tester)  
**Due:** 2026-08-23  
**Blocked By:** Phase 1 (Issue TBD)

**Description:**

```
Phase 2 of Reporting Agent v2 project — Validation in control-plane repo and PR merge.

## Deliverables

- [ ] Agent v2 deployed to `.github/agents/reporting.agent.md`
- [ ] Test reports created in control-plane (3-5 examples)
- [ ] Context detection validated in control-plane repo
- [ ] All templates tested with sample data
- [ ] Backward compatibility verified (all v1 templates work)
- [ ] OpenSpec validation run on all project docs
- [ ] PR created: feat/reporting-agent-v2 → develop
- [ ] PR review completed, feedback addressed
- [ ] PR merged to develop branch
- [ ] Phase 2 completion summary added to CHANGELOG.md

## Success Criteria

- [ ] Context detection correctly identifies control-plane repo
- [ ] All v1 templates work unchanged (100% backward compatible)
- [ ] Sample reports created and validated
- [ ] OpenSpec validation passes (or issues documented)
- [ ] PR merged without merge conflicts
- [ ] No breaking changes to existing workflows
- [ ] CI/CD validation passes

## Blockers

- [ ] OpenSpec validation issues (if discovered)
- [ ] Code review feedback

## Related

- Epic: Reporting Agent v2 Multi-Repository Support
- Related project: .github/projects/active/reporting-agent-v2-multirepository-2026-08-12/
```

---

### Phase 3: Block Plugin Testing & Refinement

**Issue Type:** Task  
**Labels:** `type:task`, `area:agents`, `phase:3`, `priority:high`  
**Title:** Phase 3 — Block Plugin Testing & Feedback  
**Assignee:** TBD (Tester + Plugin Maintainers)  
**Due:** 2026-08-30  
**Blocked By:** Phase 2 (Issue TBD)  
**Milestone:** Plugin Rollout

**Description:**

```
Phase 3 of Reporting Agent v2 project — Testing with block plugin repositories.

## Deliverables

- [ ] Identify 2-3 volunteer block plugin repos for testing
- [ ] Deploy agent v2 to test plugin repos
- [ ] Validate context detection in plugin repos
- [ ] Create sample reports: block registration audit, test coverage per block
- [ ] Test plugin-specific templates and metrics
- [ ] Document plugin maintainer feedback
- [ ] Create plugin-specific reporting guide
- [ ] Document refinements for v2.1
- [ ] Update PLANNING.md with Phase 3 results

## Success Criteria

- [ ] Context detection works in 2-3 plugin repos
- [ ] Block plugin templates create relevant reports
- [ ] Plugin maintainers provide feedback (positive or improvement items)
- [ ] No breaking changes to plugin repos
- [ ] Plugin onboarding guide created
- [ ] v2.1 enhancement list documented

## Testing

- [ ] Test context detection: agent correctly identifies repo as block plugin
- [ ] Test block registration audit template with 2+ blocks
- [ ] Test block test coverage template
- [ ] Validate block-specific metrics (block count, coverage %)
- [ ] Verify frontmatter tags (block-name, block-slug)

## Feedback & Refinement

- [ ] What templates work well?
- [ ] What gaps exist?
- [ ] What improvements needed?
- [ ] Any edge cases discovered?

## Related

- Epic: Reporting Agent v2 Multi-Repository Support
- Phase 2: Control-Plane Validation (parent phase)
- Related project: .github/projects/active/reporting-agent-v2-multirepository-2026-08-12/
```

---

### Phase 4: Block Theme Testing & Refinement

**Issue Type:** Task  
**Labels:** `type:task`, `area:agents`, `phase:4`, `priority:high`  
**Title:** Phase 4 — Block Theme Testing & Feedback  
**Assignee:** TBD (Tester + Theme Maintainers)  
**Due:** 2026-09-06  
**Blocked By:** Phase 2 (Issue TBD)  
**Milestone:** Theme Rollout

**Description:**

```
Phase 4 of Reporting Agent v2 project — Testing with block theme repositories.

## Deliverables

- [ ] Identify 2-3 volunteer block theme repos for testing
- [ ] Deploy agent v2 to test theme repos
- [ ] Validate context detection in theme repos
- [ ] Create sample reports: template coverage, pattern compatibility
- [ ] Test theme-specific templates and metrics
- [ ] Document theme maintainer feedback
- [ ] Create theme-specific reporting guide
- [ ] Document refinements for v2.1
- [ ] Update PLANNING.md with Phase 4 results

## Success Criteria

- [ ] Context detection works in 2-3 theme repos
- [ ] Block theme templates create relevant reports
- [ ] Theme maintainers provide feedback (positive or improvement items)
- [ ] No breaking changes to theme repos
- [ ] Theme onboarding guide created
- [ ] v2.1 enhancement list documented

## Testing

- [ ] Test context detection: agent correctly identifies repo as block theme
- [ ] Test template coverage report with all templates
- [ ] Test pattern compatibility report
- [ ] Validate theme-specific metrics (template count, pattern support %)
- [ ] Verify frontmatter tags (theme-slug, theme-name)

## Feedback & Refinement

- [ ] What templates work well?
- [ ] What gaps exist?
- [ ] What improvements needed?
- [ ] Any edge cases discovered?

## Related

- Epic: Reporting Agent v2 Multi-Repository Support
- Phase 2: Control-Plane Validation (parent phase)
- Related project: .github/projects/active/reporting-agent-v2-multirepository-2026-08-12/
```

---

### Phase 5: Org-Wide Rollout & Onboarding

**Issue Type:** Task  
**Labels:** `type:task`, `area:agents`, `phase:5`, `priority:high`  
**Title:** Phase 5 — Org-Wide Rollout & Onboarding  
**Assignee:** TBD (Documentation + Communications)  
**Due:** 2026-09-09  
**Blocked By:** Phases 3-4 (Issues TBD)  
**Milestone:** Org-Wide Release

**Description:**

```
Phase 5 of Reporting Agent v2 project — Organization-wide publication and onboarding.

## Deliverables

- [ ] Finalize agent v2 based on Phase 2-4 feedback
- [ ] Mark agent v2.0 as stable in `.github/agents/reporting.agent.md`
- [ ] Create comprehensive onboarding guide (5-7 pages)
- [ ] Create quick-start guide for each repo type
- [ ] Create FAQ addressing multi-repo concerns
- [ ] Post org-wide announcement in Slack
- [ ] Add to org handbook/wiki (if exists)
- [ ] Create training session recording (optional)
- [ ] Monitor adoption in first 2 weeks
- [ ] Plan v2.1 enhancements based on feedback

## Success Criteria

- [ ] Agent v2.0 published and stable
- [ ] 5+ repos actively using v2 within first week
- [ ] Positive feedback from plugin and theme communities
- [ ] Onboarding materials accessible to all teams
- [ ] No urgent bugs or breaking changes reported

## Onboarding Materials

- [ ] Multi-repository user guide
- [ ] Quick-start guide — Block plugins
- [ ] Quick-start guide — Block themes
- [ ] Quick-start guide — Control-plane
- [ ] FAQ document
- [ ] Troubleshooting guide

## Communications

- [ ] Slack announcement in #engineering
- [ ] Email to team leads
- [ ] Optional: team training session
- [ ] Link to onboarding materials

## Post-Launch

- [ ] Monitor #reporting channel for questions
- [ ] Collect feedback from 5+ repos
- [ ] Create v2.1 enhancement list
- [ ] Plan v2.1 timeline

## Related

- Epic: Reporting Agent v2 Multi-Repository Support
- Phases 3-4: Plugin & Theme Testing
- Related project: .github/projects/active/reporting-agent-v2-multirepository-2026-08-12/
```

---

## Issue Linking Standard

All issues should reference the related project in their body:

```markdown
## Related Projects

This issue is part of:
- [Reporting Agent v2 — Multi-Repository Support](.github/projects/active/reporting-agent-v2-multirepository-2026-08-12/)

See [Linking Standard](.github/projects/active/reports-projects-restructuring-2026-08-11/LINKING_STANDARD.md) for linking patterns.
```

And the project README should reference related issues:

```markdown
## Related Issues

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#XXXX](../../issues/XXXX) | epic | Master epic | 🟢 Open |
| [#XXXX](../../issues/XXXX) | task | Phase 1 | 🟡 In Progress |
```

---

## Status Tracking

### Issue Creation Checklist

- [ ] Epic issue created (master tracking issue)
- [ ] Phase 1 task issue created
- [ ] Phase 2 task issue created
- [ ] Phase 3 task issue created
- [ ] Phase 4 task issue created
- [ ] Phase 5 task issue created
- [ ] All issues linked to epic via "related to" links
- [ ] All project docs updated with issue numbers
- [ ] All issues linked back to project folder

### Next Steps

1. Create GitHub issues using templates above
2. Update this document with actual issue numbers
3. Update README.md and PLANNING.md with issue links
4. Link all issues to epic via GitHub UI or API

---

**Created:** 2026-08-12  
**Last Updated:** 2026-08-12  
**Status:** 🟡 Pending Issue Creation

---
file_type: openspec
title: "Phase 2: Label Prefix Governance Enforcement — OpenSpec Specification"
description: "Technical specification for Phase 2 remediation of bare labels in existing issues and pull requests"
created_date: 2026-09-02
last_updated: 2026-09-02
status: in_progress
phase: 2
epic: "1605"
---

# Phase 2: Label Prefix Governance Enforcement — OpenSpec Specification

## Executive Summary

Phase 2 of the label prefix governance initiative focuses on remediating ~100 existing issues and PRs that currently use bare labels (labels without required family prefixes). This specification defines the work breakdown, success criteria, and implementation approach.

## Related Epic

- **Epic**: #1605 — Phase 3: Label Prefix Governance Enforcement
- **Phase 1 PR**: #2476 (merged) — established governance framework
- **Phase 3 Task 3 PR**: #2590 — added missing canonical labels

## Phase Breakdown

### Phase 1: Governance Framework (✅ Complete — Merged via #2476)

**Objective**: Establish label prefix governance rules and prevent new violations

**Deliverables**:

- ✅ Deleted defective `labeling-agent.js` that applied bare labels
- ✅ Established label prefix governance in CLAUDE.md & AGENTS.md
- ✅ Updated workflows to prevent NEW violations
- ✅ All prefixed labels required going forward

**Status**: Complete and merged

---

### Phase 2: Bare Label Remediation (🔄 In Progress — Current Phase)

**Objective**: Audit and remediate existing bare labels across all issues and PRs

**Scope**: ~100 issues and PRs with bare labels requiring conversion to canonical prefixed labels

#### Phase 2 Tasks

##### 2.1: Label Audit & Mapping

**Acceptance Criteria**:

- [ ] Identify all 77 unique bare labels currently in use
- [ ] Create comprehensive bare→canonical mapping
- [ ] Map covers all label families: type, priority, status, area, contributor/meta
- [ ] Mapping validated against canonical label definitions in `.github/labels.yml`
- [ ] Documentation: `bare-label-mapping.json` created and stored

**Deliverables**:

- Audit script: `audit-bare-labels.js`
- Mapping output: `.github/projects/active/label-prefix-enforcement-2026-08-05/bare-label-mapping.json`
- Mapping reference: `PHASE2_PLAN.md` (tables 113-194)

**Status**: ✅ Complete

---

##### 2.2: Discovery & Query

**Objective**: Query GitHub API to identify actual bare labels in use across issues and PRs

**Acceptance Criteria**:

- [ ] Execute query script to identify all bare labels in repository
- [ ] Generate detailed report of issues/PRs with bare labels
- [ ] Include issue numbers, current bare labels, proposed canonical replacements
- [ ] Report stored at: `.github/projects/active/label-prefix-enforcement-2026-08-05/bare-labels-found.json`

**Implementation**:

```bash
GITHUB_TOKEN=<token> node query-bare-labels.js
```

**Deliverables**:

- Query script: `query-bare-labels.js`
- Discovery results: JSON report with findings

**Status**: ⏳ Not Started

---

##### 2.3: Bulk Remediation Workflow

**Objective**: Execute bulk label remediation across all identified issues and PRs

**Acceptance Criteria**:

- [ ] GitHub Actions workflow created: `.github/workflows/remediate-bare-labels.yml`
- [ ] Supports dry-run mode (default) to preview changes without modifying labels
- [ ] Supports live mode (with flag) to execute actual remediation
- [ ] Dry-run tested and validated to show correct transformations
- [ ] Live remediation executed and all bare labels replaced with canonical prefixed labels

**Implementation Modes**:

**Dry-run (default)**:

```bash
gh workflow run remediate-bare-labels.yml
```

**Live Execution**:

```bash
gh workflow run remediate-bare-labels.yml -f dry_run=false
```

**Deliverables**:

- Workflow file: `.github/workflows/remediate-bare-labels.yml`
- Execution logs with before/after label summaries

**Status**: ⏳ Not Started

---

##### 2.4: Validation & Verification

**Objective**: Confirm all bare labels have been successfully remediated

**Acceptance Criteria**:

- [ ] Execute validation script to verify 0 bare labels remain
- [ ] All prefixed labels applied correctly
- [ ] Check for any remediation failures or warnings
- [ ] Generate final validation report
- [ ] Review 100% of remediated issues for accuracy

**Validation Steps**:

1. Run bare-label discovery query again (should return empty results)
2. Spot-check 10-20 remediated issues to verify correct label mapping
3. Check for any edge cases or failed remediations
4. Document findings in validation report

**Deliverables**:

- Validation report documenting success criteria met
- Final statistics: issues/PRs remediated, labels converted, success rate

**Status**: ⏳ Not Started

---

##### 2.5: Documentation & Closure

**Objective**: Document Phase 2 completion and close associated issues

**Acceptance Criteria**:

- [ ] Update CHANGELOG.md with Phase 2 completion entry
- [ ] Document remediation process, lessons learned, and outcomes
- [ ] Create PR for Phase 2 completion documentation
- [ ] Close issue #1604 (Bulk label remediation)
- [ ] Close issue #1592 (Label Prefix Governance Enforcement tracking)
- [ ] Document any blockers, edge cases, or issues encountered

**Deliverables**:

- Updated CHANGELOG.md
- Phase 2 Closure Documentation
- PR created and merged for documentation
- Related issues closed with documentation link

**Status**: ⏳ Not Started

---

## Bare Labels Reference

### Bare Labels by Family (77 Total)

#### Type Labels (28)

`bug`, `feature`, `enhancement`, `task`, `refactor`, `test`, `documentation`, `chore`, `improve`, `ui`, `ux`, `help`, `support`, `research`, `investigation`, `build`, `release`, `performance`, `security`, `a11y`, `accessibility`, `design`, `content`, `epic`, `story`, `qa`, `bug-report`, `feature-request`

**Canonical Equivalents**: `type:bug`, `type:feature`, `type:improve`, `type:task`, `type:refactor`, `type:test`, `type:documentation`, `type:chore`, `type:ui`, `type:ux-feedback`, `type:help`, `type:support`, `type:research`, `type:build`, `type:release`, `type:performance`, `type:security`, `type:a11y`, `type:design`, `type:epic`, `type:story`, `type:qa`, `type:question`

#### Priority Labels (9)

`urgent`, `critical`, `high`, `medium`, `low`, `important`, `minor`, `priority`, `urgent-fix`

**Canonical Equivalents**: `priority:critical`, `priority:important`, `priority:normal`, `priority:minor`

#### Status Labels (14)

`needs-review`, `in-progress`, `done`, `blocked`, `wontfix`, `duplicate`, `invalid`, `stale`, `on-hold`, `needs-triage`, `needs-design`, `needs-documentation`, `needs-qa`, `needs-testing`

**Canonical Equivalents**: `status:needs-review`, `status:in-progress`, `status:done`, `status:blocked`, `status:wontfix`, `status:duplicate`, `meta:stale`, `status:on-hold`, `status:needs-triage`, `status:needs-design`, `status:needs-documentation`, `status:needs-qa`, `status:needs-testing`

#### Area Labels (15)

`core`, `docs`, `testing`, `infrastructure`, `devops`, `backend`, `frontend`, `database`, `api`, `plugin`, `theme`, `block-editor`, `woocommerce`, `dependencies`, `deployment`

**Canonical Equivalents**: `area:core`, `area:documentation`, `area:tests`, `area:infrastructure`, `area:plugins`, `area:theme`, `area:block-editor`, `area:woocommerce`, `area:dependencies`, `area:deployment`, `area:ci`

#### Contributor/Meta Labels (10)

`good-first-issue`, `help-wanted`, `help wanted`, `discussion`, `contributor`, `community`, `question`, `feedback`, `improvement`, `ci`, `cd`

**Canonical Equivalents**: `contrib:good-first-issue`, `contrib:help-wanted`, `contrib:discussion`, `type:question`

---

## Success Metrics

### Primary Success Criteria

1. ✅ **Bare Label Audit**: All 77 bare labels documented and mapped
2. ⏳ **Zero Bare Labels**: All unprefixed labels removed from repository
3. ⏳ **100% Canonical Compliance**: All issues/PRs use only family-prefixed labels
4. ⏳ **Complete Mapping**: All bare→canonical transformations documented
5. ⏳ **Process Automation**: Workflow in place for prevention of future violations

### Secondary Success Criteria

- Documentation complete and comprehensive
- Lessons learned documented
- Team trained on label governance
- Related issues closed with proper documentation

---

## Implementation Timeline

| Phase | Task | Status | Target Date |
|-------|------|--------|-------------|
| 2.1 | Audit & Mapping | ✅ Complete | 2026-08-30 |
| 2.2 | Discovery & Query | ⏳ Pending | 2026-09-05 |
| 2.3 | Bulk Remediation | ⏳ Pending | 2026-09-10 |
| 2.4 | Validation | ⏳ Pending | 2026-09-12 |
| 2.5 | Documentation & Closure | ⏳ Pending | 2026-09-15 |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Incorrect bare→canonical mapping | Low | High | Peer review mapping; spot-check remediated issues |
| Workflow fails during bulk remediation | Low | High | Test in dry-run mode first; have rollback plan |
| Issues with dependent workflows | Medium | Medium | Test labeling workflows after remediation; update as needed |
| Large-scale remediation performance | Low | Medium | Execute during low-traffic window; monitor API rate limits |
| Incomplete remediation due to API limits | Low | Medium | Implement pagination and retry logic in workflow |

---

## Governance & References

All remediation adheres to:

- **CLAUDE.md** Label Creation Rules (family prefix required)
- **AGENTS.md** Label Creation Governance
- **Canonical Labels**: `.github/labels.yml` (158 total labels)
- **Label Taxonomy**: `docs/LABEL_STRATEGY.md`
- **Labeling Guide**: `docs/LABELING.md`
- **Label Inventory**: `docs/LABEL_INVENTORY.md`

---

## Related Issues & PRs

- **Epic**: #1605 — Phase 3: Label Prefix Governance Enforcement
- **Tracking**: #1592 — Label Prefix Governance Enforcement (governance tracking)
- **Remediation**: #1604 — Bulk label remediation for existing bare labels
- **Phase 1 PR**: #2476 (merged) — established governance framework
- **Phase 3 Task 3 PR**: #2590 — added missing canonical labels

---

## Document Control

| Version | Date | Author | Status |
|---------|------|--------|--------|
| 1.0 | 2026-09-02 | Claude Code | Draft |

---

**Last Updated**: 2026-09-02  
**Status**: In Progress — Phase 2 Task 2 (Discovery)  
**Next Review**: After Phase 2.2 Discovery completion

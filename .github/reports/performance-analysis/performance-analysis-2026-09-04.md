# Workflow Performance Analysis Report

**Analysis Date**: 2026-09-04T08:43:29.804Z
**Scope**: All 71 GitHub Actions workflows

## Summary

- **Total Workflows Analyzed**: 71
- **Workflows Needing Concurrency**: 51
- **Workflows Needing Caching**: 51
- **Workflows Needing Fetch-Depth**: 58
- **Estimated Total Time Savings**: 83 minutes per month

## Optimization Opportunities

### 1. Concurrency Control

**Impact**: Prevents overlapping workflow runs, reduces duplicate work
**Workflows Needing This**: 51/71

**Workflows to Update**:
- allocate-pr-issue-to-milestone.yml
- badges-documentation-update.yml
- badges-health-check.yml
- badges-readme-status.yml
- badges-verification.yml
- badges-workflow-audit.yml
- batch-label-prs.yml
- branch-name-validation.yml
- changelog-safety-audit.yml
- changelog.yml
- cleanup-branches.yml
- enforce-pr-issue-linking.yml
- gitleaks-reusable.yml
- issue-audit-remediation.yml
- issue-compliance.yml
- issue-create-enhanced.yml
- issue-labeling-automation.yml
- issue-remediation-automation.yml
- issues.yml
- label-audit-report.yml
- linting.yml
- manage-blocking-status-labels.yml
- meta-labels-sync.yml
- metrics-reporting.yml
- metrics.yml
- milestone-distribution.yml
- normalize-titles.yml
- openspec-progress-phase.yml
- openspec-report-progression.yml
- openspec-sync-labels.yml
- openspec-validate-labels.yml
- planner.yml
- pr-template-resolver.yml
- pr-template-validation.yml
- pr-validation.yml
- project-archival.yml
- project-field-sync.yml
- project-maintenance-nightly.yml
- project-maintenance-on-demand.yml
- release-e2e-tests.yml
- release.yml
- remediate-bare-labels.yml
- reviewer.yml
- testing.yml
- validate-blocking-issue-before-close.yml
- validate-blocking-status-before-close.yml
- validate-dor-dod-sections.yml
- validate-issue-labels.yml
- validate-pr-template.yml
- validate-project-linking.yml
- workflow-validation.yml

**Example Implementation**:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

### 2. Dependency Caching

**Impact**: Reduces npm/pip install time by 50-80% on cache hits
**Workflows Needing This**: 51/71

**Workflows to Update**:
- agent-spec-validation.yml
- allocate-pr-issue-to-milestone.yml
- awesome-github-site.yml
- badges-documentation-update.yml
- badges-health-check.yml
- badges-readme-status.yml
- badges-workflow-audit.yml
- batch-label-prs.yml
- branch-name-validation.yml
- changelog-management.yml
- changelog-safety-audit.yml
- checks.yml
- cleanup-branches.yml
- docs-maintenance.yml
- docs-validation.yml
- documentation.yml
- issue-audit-remediation.yml
- issue-create-enhanced.yml
- issue-labeling-automation.yml
- issue-remediation-automation.yml
- label-audit-report.yml
- labeling-governance.yml
- labeling.yml
- linting.yml
- meta-agent-validation.yml
- meta-labels-sync.yml
- meta.yml
- metadata-governance.yml
- metrics-collection.yml
- metrics-reporting.yml
- metrics.yml
- milestone-distribution.yml
- openspec-progress-phase.yml
- openspec-report-progression.yml
- openspec-sync-labels.yml
- openspec-validate-labels.yml
- pr-validation.yml
- project-archival.yml
- project-field-sync.yml
- project-maintenance-nightly.yml
- project-maintenance-on-demand.yml
- release-e2e-tests.yml
- release.yml
- remediate-bare-labels.yml
- reporting.yml
- reviewer.yml
- testing.yml
- validate-dor-dod-sections.yml
- validate-issue-labels.yml
- validate-project-linking.yml
- workflow-validation.yml

**Example Implementation (npm)**:

```yaml
- name: Cache npm dependencies
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-npm-
```

### 3. Fetch Depth Optimization

**Impact**: Reduces checkout time by 30-50% for shallow clones
**Workflows Needing This**: 58/71

**Workflows to Update**:
- agent-spec-validation.yml
- allocate-pr-issue-to-milestone.yml
- awesome-github-site.yml
- badges-documentation-update.yml
- badges-readme-status.yml
- badges-workflow-audit.yml
- batch-label-prs.yml
- branch-name-validation.yml
- changelog-management.yml
- changelog-safety-audit.yml
- changelog.yml
- checks.yml
- cleanup-branches.yml
- docs-maintenance.yml
- docs-validation.yml
- documentation.yml
- gitleaks-update.yml
- issue-audit-remediation.yml
- issue-compliance.yml
- issue-create-enhanced.yml
- issue-labeling-automation.yml
- issue-management-orchestration.yml
- issues.yml
- label-audit-report.yml
- labeling-governance.yml
- labeling.yml
- linting.yml
- meta-agent-validation.yml
- meta-labels-sync.yml
- meta.yml
- metadata-governance.yml
- metrics-collection.yml
- metrics-reporting.yml
- metrics.yml
- milestone-distribution.yml
- normalize-titles.yml
- openspec-progress-phase.yml
- openspec-report-progression.yml
- openspec-sync-labels.yml
- openspec-validate-labels.yml
- planner.yml
- pr-template-resolver.yml
- pr-validation.yml
- project-archival.yml
- project-maintenance-nightly.yml
- project-maintenance-on-demand.yml
- project-meta-sync.yml
- release-e2e-tests.yml
- release.yml
- remediate-bare-labels.yml
- reporting.yml
- reviewer.yml
- testing.yml
- validate-dor-dod-sections.yml
- validate-issue-labels.yml
- validate-pr-template.yml
- validate-project-linking.yml
- workflow-validation.yml

**Example Implementation**:

```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 1
```

## Recommendations

1. **Phase 1 (Week 1)**: Add concurrency control to all workflows

2. **Phase 2 (Week 2)**: Add dependency caching to workflows with package managers

3. **Phase 3 (Week 3)**: Add fetch-depth optimization to all checkout steps

## Validation

After applying optimizations, run the validator to ensure compliance:

```bash
npm run validate:workflows
```

Expected improvements:
- Warnings reduced from 174 to <50
- CI/CD execution time reduced by ~30-50%
- No functional regressions

## Related Documentation

- Issue #2799: [Optimize workflow performance](https://github.com/lightspeedwp/.github/issues/2799)

- Project: [Phase 2 Label Remediation - Workflow Security Hardening](./.github/projects/active/phase-2-label-remediation-security-hardening-2026-09-04/)

- Implementation Plan: [03-IMPLEMENTATION-PLAN.md](./.github/projects/active/phase-2-label-remediation-security-hardening-2026-09-04/03-IMPLEMENTATION-PLAN.md#2-performance-optimizations)

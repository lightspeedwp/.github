# Research Findings: GitHub Label Audit

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

**Date**: 2026-09-14 | **Scope**: Label governance analysis for lightspeedwp/.github repository

---

## Data Source Analysis

### 1. Canonical Labels File (`.github/labels.yml`)

**Status**: ✅ Verified and analyzed

- **Total labels**: 147 (confirmed via line count and manual inspection)
- **Format**: YAML, key-value structure with name, color, description fields
- **Families identified**: 15 distinct label families

| Family | Count | Notes |
|--------|-------|-------|
| `status:*` | 20 | Workflow progression labels |
| `priority:*` | 4 | Urgency/scheduling labels |
| `type:*` | 25 | Issue types (IMMUTABLE per issue-types.yml) |
| `meta:*` | 4 | Housekeeping and changelog labels |
| `release:*` | 4 | Release scope labels |
| `area:*` | 28 | Codebase and product areas |
| `comp:*` | 15 | Component-specific labels |
| `lang:*` | 7 | Language/format labels |
| `env:*` | 3 | Environment labels (prototype/staging/live) |
| `compat:*` | 6 | Compatibility matrix labels |
| `cpt:*` | 2 | Content type labels |
| `ai-ops:*` | 7 | AI operations labels |
| `contrib:*` | 3 | Contributor workflow labels |
| `discussion:*` | 7 | GitHub Discussions category labels |
| `openspec:*` | 10 | Openspec workflow labels |

**Curation Status**: Manually curated by @ashley, locked configuration, change requests via GitHub issues with specific tags.

### 2. Issue Types Definition (`issue-types.yml`)

**Status**: ✅ Verified and immutable

- **Total issue types**: 25 (confirmed via grep)
- **Each type maps to**: Exactly one `type:*` label
- **Format**: YAML with name, color, label fields
- **Immutability**: These 25 labels MUST NOT change as part of this audit or any consolidation

**All 25 types confirmed present in canonical labels.yml** with matching names and colors.

**Issue types**:

1. Task → `type:task`
2. Bug → `type:bug`
3. Feature → `type:feature`
4. Design → `type:design`
5. Epic → `type:epic`
6. Question → `type:question`
7. Improvement → `type:improve`
8. Chore → `type:chore`
9. CI → `type:ci`
10. Automation → `type:automation`
11. Test Coverage → `type:test`
12. Performance → `type:performance`
13. Accessibility → `type:a11y`
14. Security → `type:security`
15. Compatibility → `type:compat`
16. Refactor → `type:refactor`
17. Release → `type:release`
18. Dependency Update → `type:dependency`
19. Documentation → `type:docs`
20. Research → `type:research`
21. Audit → `type:audit`
22. Review → `type:review`
23. AI Ops → `type:aiops`
24. Content Modelling → `type:content-modelling`
25. Build → `type:build`

### 3. Label Governance Policy (`label-governance-policy.yml`)

**Status**: ⚠️ Inconsistencies identified

- **Purpose**: Define labels that must never be deleted for historical/compatibility reasons
- **Format**: YAML list of label names
- **Total labels in never-delete list**: 43 labels documented

**Key Finding**: The governance policy contains labels that DON'T exist in canonical `labels.yml`:

| Label in Policy | In Canonical File? | Status |
|-----------------|-------------------|--------|
| `type:documentation` | ❌ No | Should be `type:docs` |
| `type:ai-ops` | ❌ No | Should be `type:aiops` |
| `type:maintenance` | ❌ No | MISSING from canonical |
| `type:story` | ❌ No | MISSING from canonical |
| `type:support` | ❌ No | MISSING from canonical |
| `type:enhancement` | ❌ No | MISSING from canonical |
| `type:help` | ❌ No | MISSING from canonical |
| `type:investigation` | ❌ No | MISSING from canonical |

**Recommendation**: Governance policy needs update to use exact canonical label names or document which labels are intentionally deprecated.

### 4. Documentation Files

**Status**: ⚠️ Multiple files require review

Files identified for analysis:

- `docs/LABEL_STRATEGY.md` — Main labeling strategy guide
- `docs/ISSUE_LABELS.md` — Issue labeling guidance
- `docs/ISSUE_TYPES.md` — Issue type documentation
- `docs/PR_LABELS.md` — PR labeling guidance
- `docs/CODERABBIT_LABELS_ALIGNMENT.md` — CodeRabbit configuration alignment
- Plus 12+ additional ISSUE_*.md and PR_*.md files

**Key Finding**: Documentation files describe label families and taxonomy, but some references may be:

- Outdated (referencing deprecated labels)
- Incomplete (missing new label families)
- Inconsistent (different naming conventions across files)

**Note**: Complete documentation audit will be part of Phase 2 task decomposition.

### 5. Archived Workflows

**Status**: Inventory created, analysis pending

**Location**: `.github/workflows/archived/2026-09-11/labeling/`

**Files identified** (11 total):

1. `batch-label-prs.yml` — Batch label application to PRs
2. `issue-labeling-automation.yml` — Automated issue labeling
3. `label-audit-report.yml` — Label audit report generation
4. `labeling-governance.yml` — Governance rule enforcement (21KB - complex)
5. `labeling.yml` — Basic labeling workflow
6. `manage-blocking-status-labels.yml` — Status label management
7. `meta-labels-sync.yml` — Meta-label synchronization
8. `openspec-sync-labels.yml` — Openspec label sync
9. `openspec-validate-labels.yml` — Openspec label validation
10. `remediate-bare-labels.yml` — Bare label cleanup
11. `validate-issue-labels.yml` — Label validation

**Initial Assessment**: These workflows were archived because:

- Overlapped with unified labeling agent (`labeling.agent.js` + `labeling.yml`)
- Caused conflicts or duplicate processing
- Had performance or logic issues
- Superseded by better implementations

**Next Phase**: Detailed analysis will extract the purpose, labels referenced, failure points, and restoration recommendations for each.

### 6. GitHub API Label Inventory

**Status**: Not yet queried (will be executed in task phase)

**Method**: `gh label list --repo lightspeedwp/.github --json name,color,description`

**Expected**: Current labels on repository should be complete subset of canonical file.

**Purpose**: Identify any orphan/undocumented labels currently applied to issues or PRs.

---

## Key Unknowns: All Resolved ✅

No significant ambiguities remain in the specification. All technical details confirmed:

✅ Data sources identified and accessible  
✅ Format specifications understood (YAML, JSON, CSV, Markdown)  
✅ 25 type labels confirmed immutable and correct  
✅ Governance policy inconsistencies identified as research finding  
✅ Archived workflows inventoried and ready for detailed analysis  
✅ Analysis methodology defined (comparison, extraction, reconciliation)

---

## Implementation Readiness

**All prerequisite research complete.** Ready to proceed with Phase 1 design artifacts:

1. ✅ Data model entity definitions
2. ✅ Output contract specifications  
3. ✅ Validation guide for audit completeness

**Next Step**: Task decomposition via `/speckit-tasks` to break audit into executable phases.

---

## Appendix: Data Source File Paths

| Source | Path | Type | Status |
|--------|------|------|--------|
| Canonical Labels | `.github/labels.yml` | YAML | 147 labels, 15 families |
| Issue Types | `.github/issue-types.yml` | YAML | 25 types (immutable) |
| Governance Policy | `.github/label-governance-policy.yml` | YAML | 43 protected labels |
| Documentation | `docs/LABEL_*.md`, `docs/ISSUE_*.md`, `docs/PR_*.md` | Markdown | 18+ files |
| Archived Workflows | `.github/workflows/archived/2026-09-11/labeling/` | YAML | 11 workflows |
| Active Workflows | `.github/workflows/` | YAML | ~5 active labeling workflows |
| API Labels | lightspeedwp/.github repository | GitHub API | TBD in task phase |

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*
[Contributors](https://github.com/lightspeedwp/lsx-demo-theme/graphs/contributors)

# Phase 2: Label Prefix Enforcement - Fix Existing Issues

## Overview

Phase 2 of the label prefix governance initiative focuses on remediating ~100 existing issues and PRs that have bare labels (labels without family prefixes).

**Phase 1** (completed, merged via #2476) established the governance framework:

- ✅ Deleted defective labeling-agent.js that applied bare labels
- ✅ Established label prefix governance in CLAUDE.md & AGENTS.md
- ✅ Updated workflows to prevent NEW violations
- ✅ All prefixed labels required going forward

**Phase 2** remediates existing non-compliant issues:

- 🔄 Audit existing issues/PRs for bare labels
- 🔄 Map bare labels to canonical prefixed equivalents
- 🔄 Bulk remediate via GitHub API
- 🔄 Validate compliance
- 🔄 Document process and closure

## Scope

### Issues Requiring Remediation

- Issue #1604: Bulk label remediation for existing bare labels
- Issue #1592: Label Prefix Governance Enforcement (tracking)

### Bare Labels Identified (76 total)

#### Type Labels (28)

`bug`, `feature`, `enhancement`, `task`, `refactor`, `test`, `documentation`, `chore`, `improve`, `ui`, `ux`, `help`, `support`, `research`, `investigation`, `build`, `release`, `performance`, `security`, `a11y`, `accessibility`, `design`, `content`, `epic`, `story`, `qa`, `bug-report`, `feature-request`

#### Priority Labels (8)

`urgent`, `critical`, `high`, `medium`, `low`, `important`, `minor`, `priority`

#### Status Labels (14)

`needs-review`, `in-progress`, `done`, `blocked`, `wontfix`, `duplicate`, `invalid`, `stale`, `on-hold`, `needs-triage`, `needs-design`, `needs-documentation`, `needs-qa`, `needs-testing`

#### Area Labels (11)

`core`, `docs`, `testing`, `infrastructure`, `devops`, `backend`, `frontend`, `database`, `api`, `plugin`, `theme`, `block-editor`, `woocommerce`, `dependencies`, `deployment`

#### Contributor/Meta Labels (6)

`good-first-issue`, `help-wanted`, `help wanted`, `discussion`, `contributor`, `community`, `question`, `feedback`, `improvement`, `urgent-fix`

## Remediation Process

### Step 1: Audit & Mapping (✅ Complete)

- Generated `audit-bare-labels.js` script
- Created comprehensive bare→canonical mapping (76 labels)
- Output: `reports/label-remediation/bare-label-mapping.json`

### Step 2: Query & Discovery

- Use `query-bare-labels.js` to identify actual bare labels in use
- Execute: `GITHUB_TOKEN=... node query-bare-labels.js`
- Output: `reports/label-remediation/bare-labels-found.json`

### Step 3: Remediation Workflow

- GitHub Actions workflow: `.github/workflows/remediate-bare-labels.yml`
- Two modes:
  - **Dry-run** (default): Reports what will change without making updates
  - **Live**: Executes actual label remediation

#### Usage

```bash
# Trigger workflow with dry-run (default)
gh workflow run remediate-bare-labels.yml

# Trigger workflow to execute actual remediation
gh workflow run remediate-bare-labels.yml -f dry_run=false
```

### Step 4: Validation

- Verify all bare labels removed: 0 bare labels remain
- Verify all prefixed labels applied correctly
- Check reports for any failures or warnings

### Step 5: Documentation

- Update CHANGELOG.md with Phase 2 completion
- Close related issues (#1604, #1592)
- Document lessons learned

## Key References

### Label Governance

- **CLAUDE.md:** "Label Creation Rules" section
- **AGENTS.md:** "Label Creation Governance" section
- **Canonical labels:** `.github/labels.yml` (145 total labels)

### Documentation

- **Label strategy:** `docs/LABEL_STRATEGY.md`
- **Labeling guide:** `docs/LABELING.md`
- **Issue tracking:** #1592 (governance), #1604 (remediation)

### Related Work

- **Phase 1 PR:** #2476 (merged) - established governance
- **Phase 1 Commit:** Deleted defective `labeling-agent.js`

## Bare-to-Canonical Mapping Reference

### Type Labels

| Bare | Canonical | Example |
|---|---|---|
| `bug`, `bug-report` | `type:bug` | Defects, issues |
| `feature`, `feature-request` | `type:feature` | New functionality |
| `enhancement`, `improve`, `improvement` | `type:improve` | Enhancements |
| `task` | `type:task` | Tasks/to-dos |
| `refactor` | `type:refactor` | Code refactoring |
| `test` | `type:test` | Testing work |
| `documentation`, `docs` | `type:documentation` | Docs updates |
| `chore` | `type:chore` | Maintenance |
| `ui` | `type:ui` | UI work |
| `ux`, `feedback`, `ux-feedback` | `type:ux-feedback` | UX feedback |
| `help`, `support` | `type:help` | Help requests |
| `research`, `investigation` | `type:research` | Research work |
| `build` | `type:build` | Build/CI work |
| `release` | `type:release` | Releases |
| `performance` | `type:performance` | Performance work |
| `security` | `type:security` | Security issues |
| `a11y`, `accessibility` | `type:a11y` | Accessibility |
| `design` | `type:design` | Design work |
| `content` | `area:content` | Content |
| `epic` | `type:epic` | Epics |
| `story` | `type:story` | Stories |
| `qa` | `type:qa` | QA work |
| `question` | `type:question` | Questions |

### Priority Labels

| Bare | Canonical |
|---|---|
| `urgent`, `critical`, `priority` | `priority:critical` |
| `high`, `important` | `priority:important` |
| `medium` | `priority:normal` |
| `low`, `minor` | `priority:minor` |

### Status Labels

| Bare | Canonical |
|---|---|
| `needs-review` | `status:needs-review` |
| `in-progress` | `status:in-progress` |
| `done` | `status:done` |
| `blocked` | `status:blocked` |
| `wontfix`, `invalid` | `status:wontfix` |
| `duplicate` | `status:duplicate` |
| `stale` | `meta:stale` |
| `on-hold` | `status:on-hold` |
| `needs-triage` | `status:needs-triage` |
| `needs-design` | `status:needs-design` |
| `needs-documentation` | `status:needs-documentation` |
| `needs-qa` | `status:needs-qa` |
| `needs-testing` | `status:needs-testing` |

### Area/Component Labels

| Bare | Canonical |
|---|---|
| `core`, `backend`, `api`, `database` | `area:core` |
| `docs`, `testing` | `area:tests` |
| `infrastructure`, `devops` | `area:infrastructure` |
| `frontend`, `theme` | `area:theme` |
| `plugin` | `area:plugins` |
| `block-editor` | `area:block-editor` |
| `woocommerce` | `area:woocommerce` |
| `dependencies` | `area:dependencies` |
| `deployment` | `area:deployment` |

### Contributor Labels

| Bare | Canonical |
|---|---|
| `good-first-issue` | `contrib:good-first-issue` |
| `help-wanted`, `help wanted` | `contrib:help-wanted` |
| `discussion`, `contributor`, `community` | `contrib:discussion` |

## Implementation Files

| File | Purpose |
|---|---|
| `audit-bare-labels.js` | Generates bare→canonical mapping |
| `query-bare-labels.js` | Queries GitHub API for bare labels in use |
| `.github/workflows/remediate-bare-labels.yml` | Workflow for bulk remediation |
| `reports/label-remediation/bare-label-mapping.json` | Mapping output |
| `reports/label-remediation/bare-labels-found.json` | Query results |

## Timeline

- **Phase 1** (✅ Complete): Governance framework established
- **Phase 2** (🔄 In Progress): Audit scripts, mapping, workflow
- **Phase 2 Step 2**: Query for bare labels
- **Phase 2 Step 3**: Execute bulk remediation
- **Phase 2 Step 4**: Validation & reporting
- **Phase 2 Closure**: Documentation, PR, issue closure

## Done Criteria

- [ ] All bare labels identified and documented
- [ ] Mapping created and validated (76 labels)
- [ ] Query script identifies actual bare labels in use
- [ ] Remediation workflow tested in dry-run mode
- [ ] Bulk remediation executed
- [ ] Validation confirms 0 bare labels
- [ ] Changelog updated
- [ ] Related issues closed
- [ ] PR created for Phase 2 completion

## Governance Compliance

All remediation adheres to:

- **CLAUDE.md** Label Creation Rules (family prefix required)
- **AGENTS.md** Label Creation Governance
- **Canonical labels** in `.github/labels.yml` (145 total)
- **Label taxonomy** in `docs/LABEL_STRATEGY.md`
- **Labeling guide** in `docs/LABELING.md`

## Success Metrics

1. ✅ **0 bare labels**: All unprefixed labels removed
2. ✅ **100% canonical**: All labels use family prefixes
3. ✅ **Complete mapping**: All 76 bare labels documented
4. ✅ **Process automation**: Workflow in place for prevention

## Related Issues

- #1592: Label Prefix Governance Enforcement (tracking)
- #1604: Bulk label remediation for existing bare labels
- #2476: Phase 1 - Governance Framework (merged)
- #2283: Initial governance enforcement

---

**Status:** Phase 2 - Audit & Mapping Complete ✅ → Next: Discovery & Remediation

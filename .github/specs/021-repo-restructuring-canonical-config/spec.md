# Feature Specification: Repository Restructuring & Canonical Governance Config

**Feature Branch**: `docs/repo-restructuring-canonical-config`

**Created**: 2026-10-18

**Status**: Draft

**Feature Slug**: `repo-restructuring-canonical-config`

**Phase**: Phase 2 — Consolidate governance configuration from ThisOneTimeOnAcidCom into lightspeedwp/.github

---

## User Scenarios & Testing

### User Story 1 — Governance Teams Discover Single Source of Truth

As a governance team member, I need to know that all repository configuration (labels, issue templates, PR templates, workflows) lives in one central location (lightspeedwp/.github) so I can make changes once and have them apply org-wide.

**Why this priority**: Currently, duplicate configuration files exist in multiple repositories. This creates:
- Maintenance burden (changes must be replicated)
- Risk of configuration drift (versions diverge across repos)
- Unclear source of truth (which repo is canonical?)

**Independent Test**: Can be verified by:
1. Listing all canonical configuration files in lightspeedwp/.github
2. Confirming those same files do NOT exist as duplicates in ThisOneTimeOnAcidCom
3. Validating that workflows reference the .github repo as source of truth

**Acceptance Scenarios**:

1. **Given** a label configuration change is needed, **When** the governance team updates `.github/labels.yml` in lightspeedwp/.github, **Then** the change immediately applies to all repositories (no duplicates to update)
2. **Given** PR template routing by branch, **When** a branch is created in any repository, **Then** the PR template comes from lightspeedwp/.github (not local overrides)
3. **Given** workflow updates needed, **When** GitHub Actions workflows reference canonical files, **Then** they fetch from lightspeedwp/.github central location (not local copies)

---

### User Story 2 — Configuration Consolidation Completes Successfully

As a repository maintainer, I need all duplicate configuration files to be removed from ThisOneTimeOnAcidCom and workflows updated to reference canonical sources, so the repository stays clean and aligned.

**Why this priority**: Duplicate files create technical debt, confusion, and maintenance risk. Consolidation must be complete before Phase 3 (automated validation).

**Independent Test**: Can be verified by:
1. Running `git ls-files` on ThisOneTimeOnAcidCom and confirming zero duplicate config files
2. Checking all GitHub Actions workflows reference canonical files via `@lightspeedwp/.github` or include patterns
3. Running CI/CD pipeline and confirming all checks pass with canonical configuration

**Acceptance Scenarios**:

1. **Given** ThisOneTimeOnAcidCom has local copies of `.github/labels.yml`, issue templates, and PR templates, **When** consolidation completes, **Then** all duplicate files are deleted and git history is clean
2. **Given** GitHub Actions workflows in both repos, **When** all workflows are updated, **Then** they reference canonical sources and receive no "not found" errors
3. **Given** PR template routing by branch prefix, **When** a feature branch is created in ThisOneTimeOnAcidCom, **Then** GitHub Routes to the correct PR template from lightspeedwp/.github (based on `feat/`, `fix/`, etc. prefix)

---

### User Story 3 — Configuration Drift is Prevented Going Forward

As an automation engineer, I need to validate that no new duplicate configuration files are added to ThisOneTimeOnAcidCom going forward, so the single source of truth is maintained.

**Why this priority**: Without drift prevention, maintenance burden will return as developers create local overrides or duplicate files.

**Independent Test**: Can be verified by:
1. Running a drift detection workflow on PR creation
2. Confirming it rejects PRs that introduce duplicate `.github/labels.yml`, issue templates, PR templates, etc.
3. Verifying the validation message guides developers to the canonical location

**Acceptance Scenarios**:

1. **Given** a PR attempts to add `.github/labels.yml` to ThisOneTimeOnAcidCom, **When** the validation workflow runs, **Then** it fails with a clear message: "Labels are managed in lightspeedwp/.github. Do not duplicate here."
2. **Given** pull request templates duplicated from canonical source, **When** the validation check runs, **Then** it detects the duplicate and blocks the PR
3. **Given** configuration changes needed for ThisOneTimeOnAcidCom, **When** a developer needs custom labels/templates, **Then** the error message guides them to open an issue in lightspeedwp/.github with a change request

---

## Functional Requirements

| ID | Requirement | Type | Testable? |
|---|---|---|---|
| FR1 | All duplicate `.github/labels.yml` files removed from ThisOneTimeOnAcidCom; canonical version in lightspeedwp/.github only | Data | ✅ `git ls-files` audit |
| FR2 | All duplicate issue templates removed from ThisOneTimeOnAcidCom (ISSUE_TEMPLATE/*.md); canonical versions in lightspeedwp/.github only | Data | ✅ Directory listing + checksum validation |
| FR3 | All duplicate PR templates removed from ThisOneTimeOnAcidCom (PULL_REQUEST_TEMPLATE/*.md); canonical versions in lightspeedwp/.github only | Data | ✅ Directory listing + file count comparison |
| FR4 | All duplicate issue-types.yml, branch-labels.yml, and other config files removed from ThisOneTimeOnAcidCom | Data | ✅ File presence audit |
| FR5 | All GitHub Actions workflows in ThisOneTimeOnAcidCom that reference local `.github/labels.yml` updated to reference lightspeedwp/.github version | Integration | ✅ Workflow execution test |
| FR6 | PR template routing by branch prefix works correctly from canonical lightspeedwp/.github templates | Integration | ✅ Manual PR creation + template inspection |
| FR7 | Issue template routing works correctly from canonical lightspeedwp/.github templates | Integration | ✅ Manual issue creation + template inspection |
| FR8 | GitHub Actions validation workflow added to ThisOneTimeOnAcidCom to reject PRs introducing duplicate configuration files | Automation | ✅ PR test that violates rule |
| FR9 | Drift detection workflow runs on all PR creation and enforces single source of truth | Automation | ✅ Scheduled validation runs + results |
| FR10 | Documentation updated in both repos explaining the canonical governance configuration location and change request process | Documentation | ✅ README inspection |

---

## Success Criteria

- ✅ All duplicate config files deleted from ThisOneTimeOnAcidCom (zero config debt)
- ✅ All workflows updated and passing with canonical `.github` configuration
- ✅ PR template routing works correctly for all branch types (`feat/`, `fix/`, `hotfix/`, etc.)
- ✅ Issue template routing works for all issue types
- ✅ No configuration drift detected between repos (validation workflow passes)
- ✅ CI/CD pipeline green across both repositories after consolidation
- ✅ Drift prevention automation active (blocks new duplicate files on PR)

---

## Key Entities & Data

### Configuration Files (Source of Truth: lightspeedwp/.github)

| File | Purpose | Canonical Location |
|------|---------|---|
| `.github/labels.yml` | Label definitions (158 canonical labels) | `lightspeedwp/.github/labels.yml` |
| `.github/issue-types.yml` | Issue type definitions (24 types) | `lightspeedwp/.github/issue-types.yml` |
| `.github/ISSUE_TEMPLATE/*.md` | Issue templates (26 templates) | `lightspeedwp/.github/ISSUE_TEMPLATE/` |
| `.github/PULL_REQUEST_TEMPLATE/*.md` | PR templates (19 templates) | `lightspeedwp/.github/PULL_REQUEST_TEMPLATE/` |
| `.github/branch-labels.yml` | Branch-to-template routing | `lightspeedwp/.github/branch-labels.yml` |
| `.github/workflows/*.yml` | Organization-wide workflows | `lightspeedwp/.github/workflows/` |

### Repositories in Scope

- **Source of Truth**: `lightspeedwp/.github` (canonical configuration)
- **Consumer**: `lightspeedwp/ThisOneTimeOnAcidCom` (reference canonical files, zero local config)

---

## Assumptions

1. **Canonical files in lightspeedwp/.github are authoritative** — No local overrides allowed in consumer repos
2. **GitHub API supports direct template references** — PR/issue template routing will work via branch-matching rules
3. **Drift detection can be automated** — GitHub Actions validation workflows can detect and block new duplicate files
4. **Minimal merge conflicts expected** — Consolidation is primarily file deletion + workflow updates (low conflict risk)
5. **Documentation standards follow CLAUDE.md** — UK English, semantic structure, linked references
6. **Configuration changes are infrequent** — Single source of truth model assumes low change volume (not high-churn scenarios)

---

## Dependencies

### Internal Dependencies

- **Spec 006** (Governance Audit) — Understanding of current governance structure
- **Spec 012** (Audit Governance Structure) — Clarity on which configs are canonical vs. duplicates
- **Spec 013** (Spec Folder Refactor) — Specifications repository organization must be stable first

### External Dependencies

- GitHub API availability (template routing, workflow execution)
- No pending merges that would conflict with file deletion

---

## Constraints & Boundaries

### In Scope

- Consolidating `.github/` configuration files (labels, templates, workflows)
- Updating workflows to reference canonical sources
- Adding drift prevention validation
- Documentation of governance configuration location

### Out of Scope

- Migrating content/markdown from ThisOneTimeOnAcidCom
- Reorganizing wordpress plugin or theme structure
- Changes to GitHub Actions secret management
- New feature implementation (only consolidation)

---

## Open Questions / Clarifications

[NEEDS CLARIFICATION: Should we create a shared GitHub Actions workflow that both repos import (lightspeedwp/.github/workflows/shared-validation.yml imported as reusable) or copy/adjust validation logic to each repo? This affects maintainability of the drift detection automation.]

[NEEDS CLARIFICATION: For PR template routing, should templates be assigned by branch PREFIX ONLY (feat/, fix/, etc.) or also by repository-specific logic? This affects which ThisOneTimeOnAcidCom PRs receive which templates.]

[NEEDS CLARIFICATION: Are there any ThisOneTimeOnAcidCom-specific labels, issue types, or templates that should be KEPT local rather than consolidated into the canonical set?]

---

## Acceptance Testing

### Test Case 1 — Duplicate Files Removed

```gherkin
Given ThisOneTimeOnAcidCom repo with duplicate .github/labels.yml
When Phase 2 consolidation completes
Then git ls-files ThisOneTimeOnAcidCom/.github/labels.yml returns zero results
And git log shows commit deleting .github/labels.yml
```

### Test Case 2 — Workflows Reference Canonical Source

```gherkin
Given GitHub Actions workflows in ThisOneTimeOnAcidCom referencing local .github/labels.yml
When workflows are updated to reference lightspeedwp/.github
Then a test PR creation uses canonical template (not local override)
And CI workflow execution logs show successful fetch from lightspeedwp/.github
```

### Test Case 3 — Drift Prevention Active

```gherkin
Given PR created in ThisOneTimeOnAcidCom introducing duplicate .github/labels.yml
When validation workflow runs
Then PR is blocked with message linking to canonical location
And human-readable error explains single source of truth
```

---

**Next Phase**: /speckit-clarify (resolve open questions) → /speckit-plan (implementation strategy)

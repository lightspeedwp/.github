# Feature Specification: Repository Restructuring & Canonical Governance Config

**Feature Branch**: `docs/spec-021-repository-restructuring`

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
2. **Given** PR template routing by branch, **When** a branch is created in ThisOneTimeOnAcidCom, **Then** the PR template comes from lightspeedwp/.github (not local overrides)
3. **Given** workflow updates needed, **When** ThisOneTimeOnAcidCom needs repo-specific workflows, **Then** they are maintained locally while templates and labels come from lightspeedwp/.github

---

### User Story 2 — Configuration Consolidation Completes Successfully

As a repository maintainer, I need all duplicate template and label files to be removed from ThisOneTimeOnAcidCom while preserving repo-specific workflows, so the repository stays clean and uses canonical governance.

**Why this priority**: Duplicate files create technical debt, confusion, and maintenance risk. Consolidation must be complete before Phase 3 (automated validation).

**Independent Test**: Can be verified by:
1. Running `git ls-files` on ThisOneTimeOnAcidCom and confirming zero duplicate `.github/labels.yml` and PR/issue templates
2. Checking all GitHub Actions workflows that reference templates point to canonical sources
3. Running CI/CD pipeline and confirming all checks pass with canonical templates

**Acceptance Scenarios**:

1. **Given** ThisOneTimeOnAcidCom has local copies of `.github/labels.yml`, issue templates, and PR templates, **When** consolidation completes, **Then** all duplicate files are deleted and git history is clean
2. **Given** GitHub Actions workflows in ThisOneTimeOnAcidCom, **When** all workflows are updated, **Then** they reference canonical sources and receive no "not found" errors
3. **Given** PR template routing by branch prefix, **When** a feature branch is created in ThisOneTimeOnAcidCom, **Then** GitHub Routes to the correct PR template from lightspeedwp/.github (based on `feat/`, `fix/`, etc. prefix)

---

### User Story 3 — Repository-Specific Workflows Remain Customizable

As a ThisOneTimeOnAcidCom maintainer, I need to maintain custom workflows for repo-specific automation while using canonical labels and templates, so I can keep repo-specific processes without governance maintenance burden.

**Why this priority**: ThisOneTimeOnAcidCom has unique requirements that differ from shared governance. Custom workflows enable those without duplicating governance configuration.

**Independent Test**: Can be verified by:
1. Confirming ThisOneTimeOnAcidCom has its own `.github/workflows/` with custom jobs
2. Verifying those workflows work correctly with canonical labels and templates from .github
3. Testing that repo-specific processes run as expected

**Acceptance Scenarios**:

1. **Given** ThisOneTimeOnAcidCom has custom workflow logic (e.g., WordPress-specific CI), **When** the consolidation completes, **Then** those workflows remain and function correctly
2. **Given** custom workflows and canonical templates/labels, **When** workflows run, **Then** they use the canonical governance without conflicts
3. **Given** repo-specific governance needs identified, **When** they're documented, **Then** they're kept as local configuration items

---

### User Story 4 — Configuration Drift is Prevented Going Forward

As an automation engineer, I need to validate that no new duplicate template/label files are added to ThisOneTimeOnAcidCom going forward, so the single source of truth for governance is maintained.

**Why this priority**: Without drift prevention, maintenance burden will return as developers create local overrides or duplicate files.

**Independent Test**: Can be verified by:
1. Running a drift detection workflow on PR creation
2. Confirming it rejects PRs that introduce duplicate `.github/labels.yml`, issue templates, PR templates
3. Verifying the validation message guides developers to the canonical location

**Acceptance Scenarios**:

1. **Given** a PR attempts to add `.github/labels.yml` to ThisOneTimeOnAcidCom, **When** the validation workflow runs, **Then** it fails with a clear message: "Labels are managed in lightspeedwp/.github. Do not duplicate here."
2. **Given** pull request templates duplicated from canonical source, **When** the validation check runs, **Then** it detects the duplicate and blocks the PR
3. **Given** workflow files being added, **When** they are repo-specific custom workflows, **Then** they are allowed (not duplicates of canonical governance)

---

## Functional Requirements

| ID | Requirement | Type | Testable? |
|---|---|---|---|
| FR1 | All duplicate `.github/labels.yml` files removed from ThisOneTimeOnAcidCom; canonical version in lightspeedwp/.github only | Data | ✅ `git ls-files` audit |
| FR2 | All duplicate issue templates removed from ThisOneTimeOnAcidCom (ISSUE_TEMPLATE/*.md); canonical versions in lightspeedwp/.github only | Data | ✅ Directory listing + checksum validation |
| FR3 | All duplicate PR templates removed from ThisOneTimeOnAcidCom (PULL_REQUEST_TEMPLATE/*.md); canonical versions in lightspeedwp/.github only | Data | ✅ Directory listing + file count comparison |
| FR4 | All duplicate issue-types.yml, branch-labels.yml removed from ThisOneTimeOnAcidCom | Data | ✅ File presence audit |
| FR5 | ThisOneTimeOnAcidCom maintains custom workflows in `.github/workflows/` for repo-specific automation | Code | ✅ Workflow execution test |
| FR6 | All GitHub Actions workflows in ThisOneTimeOnAcidCom reference canonical sources for templates/labels | Integration | ✅ Workflow execution test |
| FR7 | PR template routing by branch prefix works correctly from canonical lightspeedwp/.github templates | Integration | ✅ Manual PR creation + template inspection |
| FR8 | Issue template routing works correctly from canonical lightspeedwp/.github templates | Integration | ✅ Manual issue creation + template inspection |
| FR9 | GitHub Actions validation workflow added to ThisOneTimeOnAcidCom to reject PRs introducing duplicate governance files | Automation | ✅ PR test that violates rule |
| FR10 | Drift detection allows custom workflows but blocks duplicate templates/labels | Automation | ✅ Validation logic test |
| FR11 | Documentation updated in both repos explaining hybrid model: custom workflows + canonical governance | Documentation | ✅ README inspection |
| FR12 | Audit identifies which governance items (labels, issue types, templates) are ThisOneTimeOnAcidCom-specific and should remain local | Research | ✅ Audit report |

---

## Success Criteria

- ✅ All duplicate template/label files deleted from ThisOneTimeOnAcidCom (governance debt eliminated)
- ✅ ThisOneTimeOnAcidCom custom workflows remain and function correctly
- ✅ PR template routing works correctly for all branch types (`feat/`, `fix/`, `hotfix/`, etc.) using .github templates
- ✅ Issue template routing works for all issue types using .github templates
- ✅ No configuration drift detected between repos for governance items (validation workflow passes)
- ✅ CI/CD pipeline green across both repositories after consolidation
- ✅ Drift prevention automation active (blocks new duplicate templates/labels on PR, allows custom workflows)
- ✅ Hybrid model documented: ThisOneTimeOnAcidCom uses .github canonical governance + maintains repo-specific workflows

---

## Key Entities & Data

### Configuration Files (Source of Truth: lightspeedwp/.github)

| File | Purpose | Canonical Location | ThisOneTimeOnAcidCom Usage |
|------|---------|---|---|
| `.github/labels.yml` | Label definitions (158 canonical labels) | `lightspeedwp/.github/labels.yml` | Reference only (no local copy) |
| `.github/issue-types.yml` | Issue type definitions (24 types) | `lightspeedwp/.github/issue-types.yml` | Reference only (no local copy) |
| `.github/ISSUE_TEMPLATE/*.md` | Issue templates (26 templates) | `lightspeedwp/.github/ISSUE_TEMPLATE/` | Reference via routing |
| `.github/PULL_REQUEST_TEMPLATE/*.md` | PR templates (19 templates) | `lightspeedwp/.github/PULL_REQUEST_TEMPLATE/` | Reference via routing |
| `.github/branch-labels.yml` | Branch-to-template routing | `lightspeedwp/.github/branch-labels.yml` | Reference only |
| `.github/workflows/*.yml` | **Custom workflows** | `ThisOneTimeOnAcidCom/.github/workflows/` | **Maintained locally** |

### Repositories in Scope

- **Source of Truth**: `lightspeedwp/.github` (canonical configuration: labels, templates, routing)
- **Consumer (Hybrid)**: `lightspeedwp/ThisOneTimeOnAcidCom` (reference canonical files + maintain custom workflows + keep some local governance items)

---

## Implementation Decisions (Q&A Clarifications)

### Question 1: Workflow Strategy — ANSWERED: B (Custom Workflows)
ThisOneTimeOnAcidCom will maintain its own customised workflows in `.github/workflows/`. This allows repo-specific automation while benefiting from canonical governance templates and labels. Core validation workflows may reference shared logic from .github, but repo-specific jobs remain local.

**Implication**: ThisOneTimeOnAcidCom `.github/workflows/` directory is preserved and maintained locally.

---

### Question 2: PR Template Routing — ANSWERED: A (Canonical Templates via Routing)
ThisOneTimeOnAcidCom will use lightspeedwp/.github canonical issue and PR templates directly via GitHub's routing mechanism. Branch prefix (feat/, fix/, etc.) determines which template is used, all sourced from .github.

**Implication**: No local PULL_REQUEST_TEMPLATE/ or ISSUE_TEMPLATE/ directories in ThisOneTimeOnAcidCom; routing points to .github.

---

### Question 3: Local Governance Items — ANSWERED: B (Keep Some Locally)
ThisOneTimeOnAcidCom will keep some governance items locally. An audit (Phase 2 component) identifies which labels, issue types, or templates are repo-specific and should remain in ThisOneTimeOnAcidCom, while duplicative items are consolidated into .github.

**Implication**: Phase 2 includes audit task to identify what's repo-specific before final consolidation. Some local `.github/` config may remain (e.g., ThisOneTimeOnAcidCom-specific labels or custom issue types).

---

## Assumptions

1. **Canonical files in lightspeedwp/.github are authoritative** — ThisOneTimeOnAcidCom references them; no local overrides allowed for governance items
2. **Custom workflows don't conflict with canonical governance** — Repo-specific automation can coexist with canonical templates/labels
3. **GitHub API supports direct template references** — PR/issue template routing will work via branch-matching rules
4. **Drift detection can be automated** — GitHub Actions validation workflows can detect and block new duplicate governance files (while allowing custom workflows)
5. **Some ThisOneTimeOnAcidCom items are repo-specific** — Audit needed to identify which governance items should stay local
6. **Documentation standards follow CLAUDE.md** — UK English, semantic structure, linked references
7. **Minimal merge conflicts expected** — Consolidation is primarily file deletion + workflow updates (low conflict risk)

---

## Dependencies

### Internal Dependencies

- **Spec 006** (Governance Audit) — Understanding of current governance structure
- **Spec 012** (Audit Governance Structure) — Clarity on which configs are canonical vs. duplicates
- **Spec 013** (Spec Folder Refactor) — Specifications repository organization must be stable first
- **Audit Phase 2 Component** — Identify ThisOneTimeOnAcidCom-specific governance items before consolidation

### External Dependencies

- GitHub API availability (template routing, workflow execution)
- No pending merges that would conflict with file deletion

---

## Constraints & Boundaries

### In Scope

- Consolidating duplicate `.github/` governance files from ThisOneTimeOnAcidCom into .github (labels, templates)
- Implementing PR/issue template routing from .github canonical sources
- Preserving and validating ThisOneTimeOnAcidCom custom workflows
- Adding drift prevention validation (blocks duplicate governance files, allows custom workflows)
- Auditing to identify repo-specific governance items that should remain local
- Documentation of hybrid model: canonical governance + repo-specific workflows

### Out of Scope

- Migrating content/markdown from ThisOneTimeOnAcidCom
- Reorganizing wordpress plugin or theme structure
- Changes to GitHub Actions secret management
- Implementation of Phase 3+ (Phase 2 only: setup, audit, validation)

---

## Acceptance Testing

### Test Case 1 — Duplicate Governance Files Removed

```gherkin
Given ThisOneTimeOnAcidCom repo with duplicate .github/labels.yml and PR templates
When Phase 2 consolidation completes
Then git ls-files ThisOneTimeOnAcidCom/.github/labels.yml returns zero results
And git ls-files ThisOneTimeOnAcidCom/.github/PULL_REQUEST_TEMPLATE/ returns zero results
And git log shows commits deleting governance files
```

### Test Case 2 — Custom Workflows Preserved

```gherkin
Given ThisOneTimeOnAcidCom/.github/workflows/ with custom repo-specific jobs
When Phase 2 consolidation completes
Then custom workflow files remain in place
And workflow execution logs show custom jobs running correctly
```

### Test Case 3 — Templates Route Correctly

```gherkin
Given a new feature branch created in ThisOneTimeOnAcidCom (feat/my-feature)
When a PR is created
Then GitHub routes to the PR template from lightspeedwp/.github
And template content matches canonical .github source
```

### Test Case 4 — Drift Prevention Active (Governance Files)

```gherkin
Given PR created in ThisOneTimeOnAcidCom attempting to add duplicate .github/labels.yml
When validation workflow runs
Then PR is blocked with message: "Labels are managed in lightspeedwp/.github. Do not duplicate here."
```

### Test Case 5 — Drift Prevention Allows Custom Workflows

```gherkin
Given PR created in ThisOneTimeOnAcidCom adding new custom workflow
When validation workflow runs
Then PR is allowed to proceed (custom workflows are not duplicates)
```

---

## Next Phases

1. **Phase 2 (Current)**: 
   - Remove duplicate governance files from ThisOneTimeOnAcidCom
   - Implement PR/issue template routing from .github
   - Preserve custom workflows
   - Audit and identify repo-specific governance items
   - Implement drift prevention validation

2. **Phase 3**: 
   - Consolidate identified repo-specific items
   - Enhanced monitoring and maintenance procedures
   - Rollout to additional repos using same hybrid model

---

**Status**: Ready for `/speckit-plan` — Implementation strategy and task decomposition

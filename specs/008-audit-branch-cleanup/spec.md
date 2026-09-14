# Feature Specification: Audit and Refactor Branch Cleanup Infrastructure

**Feature Branch**: `task/branch-cleanup-refactor`

**Created**: 2026-09-14

**Status**: Draft

**Input**: Audit and refactor the GitHub branch cleanup script, documentation, prompts, workflows, and related agents/skills. Currently 300+ branches in `.github` repo (too many). Need to identify safe-to-delete branches, branches needing discussion, and improve cleanup automation.

## Clarifications

### Session 2026-09-14

- Q: When a branch is merged to `develop` but not yet merged to `main`, should it be considered safe for deletion? → A: Yes, if merged to ANY base branch (develop or main), consider for deletion. Most permissive state wins; branches are eligible once integrated anywhere.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Audit Current Branch State (Priority: P1)

Repository maintainers need to understand the current state of branches to make informed cleanup decisions. This involves generating a comprehensive audit report that categorises all branches.

**Why this priority**: Without understanding what branches exist and their status (merged, stale, orphaned), any cleanup is risky and uninformed. This is the foundation for all subsequent cleanup work.

**Independent Test**: Can be fully tested by running the audit script against the repository and producing a detailed report that categorises all branches by type, merge status, age, and PR association.

**Acceptance Scenarios**:

1. **Given** a repository with 300+ branches of mixed types and ages, **When** the audit script runs, **Then** it produces a report categorising each branch as: KEEP (active/protected), KEEP (open PR), DELETE (merged 30+ days ago), DISCUSS (orphaned/no PR/naming issues)
2. **Given** merged branches from varying time periods, **When** the audit runs, **Then** branches are grouped by deletion category with clear metadata (branch name, type, last commit date, age, merge status, associated PR)
3. **Given** branches with invalid naming conventions, **When** the audit runs, **Then** these are flagged as "naming violation" in the DISCUSS category
4. **Given** branches with no associated PR, **When** the audit runs, **Then** they are separately categorised for manual review

---

### User Story 2 - Generate Safe Deletion Candidates List (Priority: P2)

Repository maintainers need a clear, verifiable list of branches that are safe to delete (fully merged, no open PRs, older than threshold).

**Why this priority**: This enables safe cleanup by providing confidence about which branches can be automatically deleted without risk.

**Independent Test**: Can be fully tested by producing a filtered list of branches that meet ALL deletion criteria (merged to base, no open PRs, >30 days old, not in exclusion patterns) and verifying each meets the criteria through independent checks.

**Acceptance Scenarios**:

1. **Given** branches that are fully merged to `develop` or `main` and older than 30 days, **When** filtering for deletion candidates, **Then** they are listed as safe-to-delete with merge commit hash and merge date
2. **Given** a branch with an open PR, **When** filtering for deletion, **Then** it is excluded and marked as KEEP
3. **Given** protected branches (`main`, `develop`, `release/*`, `hotfix/*`), **When** filtering, **Then** they are permanently excluded
4. **Given** branches matching exclusion patterns (author-based like `dependabot/*`), **When** filtering, **Then** they are preserved or flagged for review

---

### User Story 3 - Identify Branches Requiring Discussion (Priority: P2)

Repository maintainers need to identify edge cases and ambiguous branches that require human decision-making before cleanup.

**Why this priority**: Some branches may have uncommon patterns, orphaned status, or unclear purpose that warrants team discussion before deletion.

**Independent Test**: Can be fully tested by identifying branches that do NOT meet clear deletion criteria (e.g., orphaned, invalid naming, unmerged work, author flags) and presenting them with context for review.

**Acceptance Scenarios**:

1. **Given** branches that are 30+ days old but unmerged to any base, **When** categorising, **Then** they are flagged as DISCUSS with reason "unmerged work, verify intent"
2. **Given** branches with invalid names (`claude/*`, `copilot/*`), **When** categorising, **Then** they are flagged as DISCUSS with reason "naming violation, determine if rename or delete"
3. **Given** branches with no commits after 60 days with no PR history, **When** categorising, **Then** they are flagged as DISCUSS with reason "orphaned branch, unclear purpose"
4. **Given** branches authored by bots/automation (dependabot, renovate) with no PR, **When** categorising, **Then** they are flagged for policy decision (auto-delete or preserve)

---

### User Story 4 - Refactor Cleanup Scripts and Documentation (Priority: P3)

Cleanup infrastructure (scripts, prompts, documentation) needs refactoring to be consistent, maintainable, and aligned with current branch naming standards.

**Why this priority**: The foundation work above will inform what improvements are needed in tooling and documentation. This enables sustainable cleanup practices.

**Independent Test**: Can be fully tested by validating that all cleanup-related assets (scripts, docs, prompts, agent specs) are harmonised, reference each other correctly, include complete examples, and follow project standards.

**Acceptance Scenarios**:

1. **Given** existing cleanup scripts and documentation, **When** reviewing for consistency, **Then** all referenced file paths, command examples, and option names are verified as current and correct
2. **Given** the branch naming validation script, **When** reviewing, **Then** it correctly validates all 30+ defined branch types and rejects forbidden prefixes
3. **Given** cleanup documentation, **When** reviewing, **Then** it includes updated examples for audit report generation, safe deletion workflows, and branch categorisation
4. **Given** related agents and skills (closure agent, PR creation agent), **When** reviewing, **Then** their references to branch cleanup are verified and updated

---

### User Story 5 - Implement Automated Branch Audit Workflow (Priority: P3)

Repository maintainers want a GitHub Actions workflow that can periodically audit branches and report status without requiring manual script execution.

**Why this priority**: Automation reduces manual overhead and provides recurring visibility into branch health. Enables scheduled reporting (e.g., monthly) without human intervention.

**Independent Test**: Can be fully tested by running the workflow, verifying it generates audit reports, uploads them as artifacts, and optionally creates issues for branches in DISCUSS category.

**Acceptance Scenarios**:

1. **Given** a scheduled workflow trigger (e.g., first Monday of each month), **When** it fires, **Then** it runs the branch audit and uploads a report
2. **Given** branches requiring discussion, **When** the workflow completes, **Then** it can optionally create a GitHub issue summarising DISCUSS branches with links for team review
3. **Given** deletion candidates, **When** workflow completes, **Then** it can optionally create a draft PR that deletes merged branches (requiring approval before merge)

---

### Edge Cases

- What happens when a branch is deleted between audit and cleanup execution? (Script should handle gracefully with "already deleted" message)
- How are branches with mixed merge states handled (merged to `develop` but not `main`)? (Resolved via Clarification: if merged anywhere, consider for deletion. Most permissive state wins — branch is eligible once integrated to ANY base)
- What about branches created immediately after audit started that are already merged? (They won't be in audit, but that's acceptable — next audit will capture)
- How are branches in protected branch patterns handled when they're legitimately stale? (Never delete, document in report as "protected pattern")
- What if repository has custom branch exclusion rules? (Script should support configurable exclude patterns)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST audit all branches in repository and categorise each as KEEP, DELETE, or DISCUSS with supporting metadata
- **FR-002**: System MUST identify branches fully merged to ANY base branch (`develop` or `main`) by examining merge status through git history; a branch is considered merged if its commit appears in the merge-base history of either base branch
- **FR-003**: System MUST preserve all protected branches (`main`, `develop`, `production`) and never consider them for deletion
- **FR-004**: System MUST identify branches with open pull requests and preserve them with clear reasoning
- **FR-005**: System MUST apply inactivity threshold (default 30 days) to determine staleness based on last commit timestamp
- **FR-006**: System MUST validate branch names against defined naming convention and flag violations (`claude/*`, `copilot/*`, `openai/*` patterns)
- **FR-007**: System MUST support custom exclusion patterns (regex-based) to preserve branches matching user-defined rules
- **FR-008**: System MUST generate audit reports in both Markdown (human-readable) and JSON (machine-readable) formats
- **FR-009**: System MUST include detailed metadata in reports: branch name, type, author, last commit date, merge status, associated PR (if any)
- **FR-010**: System MUST safely delete selected branches with no data loss risk (verify merge before deletion, handle git errors gracefully)
- **FR-011**: System MUST support dry-run mode (preview deletions without executing) as the default safe behaviour
- **FR-012**: System MUST provide clear documentation on audit results, deletion criteria, and manual review process for edge cases
- **FR-013**: Cleanup scripts MUST be maintained in `scripts/cleanup-branches.js` with clear usage examples and option reference
- **FR-014**: Cleanup documentation MUST be current in `docs/BRANCH_CLEANUP.md` with all command examples, troubleshooting, and decision matrices
- **FR-015**: Branch validation script MUST correctly validate all branch types defined in `.github/CLAUDE.md` and reject forbidden prefixes
- **FR-016**: Closure agent and PR creation agent MUST have references to branch cleanup processes updated if they reference cleanup workflows

### Key Entities

- **Branch**: A git branch identified by name, with attributes: type, scope, title, age (days since last commit), merge status, author, open PR association
- **Audit Report**: A structured document categorising branches with metadata, produced in Markdown and/or JSON formats
- **Deletion Candidate**: A branch meeting all safety criteria (merged, 30+ days old, no open PR, not excluded)
- **Discussion Candidate**: A branch requiring manual review (orphaned, invalid name, unmerged but stale, special author)
- **Cleanup Script**: The Node.js script (`scripts/cleanup-branches.js`) that executes audit and optional deletion logic
- **Branch Type**: Classification of branches using the defined taxonomy (feat/, fix/, docs/, etc.)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Audit script successfully categorises 100% of branches in repository with zero categorisation errors (verified by spot-checking random samples)
- **SC-002**: Branch count reduced from 300+ to <50 active branches through safe deletion of merged/stale candidates
- **SC-003**: All branches in DELETE category are verified as safe before any deletion (100% merge verification, 0 accidental data loss)
- **SC-004**: Audit report generated in <5 seconds for repositories with 500+ branches (performance acceptable for automation)
- **SC-005**: Documentation and code examples are current and tested (all example commands execute successfully without errors)
- **SC-006**: Team confidence in cleanup process increases through clear DISCUSS categorisation (all edge cases flagged for review, zero surprise deletions)
- **SC-007**: Cleanup workflow successfully runs on schedule and produces artefacts without manual intervention
- **SC-008**: Naming validation enforces all 30+ defined branch types and correctly rejects 3 forbidden prefixes

## Assumptions

- Merged status is determined by checking if a commit exists in the merge-base history of `develop` or `main` (standard git merge detection)
- 30 days is a reasonable inactivity threshold; teams can customise via `--inactiveDays` parameter
- Protected branches are those explicitly configured in GitHub repository settings or hardcoded as `main`, `develop`, `production`
- Branch authors are resolvable through git commit authorship; bot branches follow naming patterns (dependabot/*, renovate/*, etc.)
- Repository has sufficient permissions to list all branches and open PRs (standard repository access)
- GitHub CLI (`gh`) is available in execution environment for PR querying (alternative: use GitHub API)
- Dry-run is the safe default; users must explicitly opt-in to destructive deletions
- Existing cleanup scripts, documentation, and prompts are in the codebase and can be audited; no external dependencies required
- UK English and project-standard conventions apply to all refactored documentation and code
- Branch cleanup is a maintenance task performed monthly or as-needed, not a continuous autonomous process

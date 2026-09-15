# Feature Specification: Branch Naming Strategy & Enforcement

**Feature Branch**: `feat/branch-naming-strategy-phase-3`

**Created**: 2026-09-13

**Status**: Draft

**Input**: Create comprehensive branch naming strategy specification with enforcement, validation, and automation covering 24 authorized branch types, forbidden prefixes (claude/, copilot/, openai/), PR template routing, label mapping, and GitHub Actions validation.

## User Scenarios & Testing

### User Story 1 - Developer Creates Feature Branch (Priority: P1)

A developer starts work on a new feature and needs to create a branch that follows the organization's naming conventions. They should be able to understand the pattern, create a valid branch name, and validate it before pushing.

**Why this priority**: This is the primary user interaction. Every developer creates branches daily. A clear, enforced naming pattern prevents cascading failures in automation and template routing.

**Independent Test**: Developer can create a valid branch, push it to remote, and the PR template routes correctly based on branch type. The feature delivers immediate value by preventing naming errors upfront.

**Acceptance Scenarios**:

1. **Given** a developer starting feature work, **When** they follow the pattern `feat/{scope}-{title}`, **Then** the branch is accepted and marked as valid
2. **Given** a developer using an invalid prefix like `feature/my-feature`, **When** they attempt to push, **Then** validation prevents the push with a clear error message
3. **Given** a developer on branch `feat/user-auth-improvements`, **When** they create a PR, **Then** the feature-type PR template routes automatically
4. **Given** a developer creating branch `security/sql-injection-fix`, **When** the PR is created, **Then** the security-type PR template routes and `type:security` label is applied

---

### User Story 2 - Organization Automates Branch Validation (Priority: P1)

The organization needs to enforce branch naming at scale across 50+ repositories and prevent naming errors before they cascade into template routing failures and broken automation.

**Why this priority**: Enforcement prevents the failure chain described in CLAUDE.md. Without validation, broken branch names cause PR template misrouting, failed CI workflows, and wasted developer time. Automation pays for itself immediately across hundreds of developers.

**Independent Test**: A commit hook or GitHub Actions workflow validates every branch and rejects invalid names with clear guidance. The feature delivers value by preventing errors at the source.

**Acceptance Scenarios**:

1. **Given** a developer attempts to push to branch `claude/my-feature`, **When** validation runs, **Then** the push is rejected with message "Branch prefix 'claude/' is reserved for Claude Code internal use. Use pattern {type}/{scope}-{title}"
2. **Given** a valid branch `fix/authentication-timeout`, **When** validation runs, **Then** the branch is accepted and continues to CI
3. **Given** a developer on branch `refactor/api-response-structure`, **When** the branch is validated, **Then** the type is correctly identified as `refactor` and routing automation triggers

---

### User Story 3 - GitHub Actions Automate Template & Label Routing (Priority: P1)

When a PR is created from a valid branch, GitHub Actions automatically routes the correct PR template and applies the appropriate labels based on branch type, eliminating manual effort and ensuring consistency.

**Why this priority**: Automation at PR creation time ensures every PR has the right template and labels without developer intervention. This is the enforcement mechanism that makes the naming strategy valuable.

**Independent Test**: A PR created from a typed branch automatically receives the correct template and labels. The feature delivers value by eliminating 100+ manual label assignments per month.

**Acceptance Scenarios**:

1. **Given** a PR from branch `feat/user-preferences-panel`, **When** the PR is created, **Then** `pr_feature.md` template is used and labels `type:feature`, `area:[auto-detected]` are applied
2. **Given** a PR from branch `security/xss-vulnerability-fix`, **When** the PR is created, **Then** `pr_security.md` template is used and labels `type:security`, `priority:critical` are suggested
3. **Given** a PR from branch `docs/branching-strategy-guide`, **When** the PR is created, **Then** `pr_docs.md` template is used and label `type:documentation` is applied
4. **Given** a PR from invalid branch `copilot/fix-something`, **When** validation runs, **Then** PR creation is blocked with guidance on correct naming

---

### User Story 4 - Developers Reference Branching Strategy (Priority: P2)

Developers need clear, accessible documentation that explains the branch naming pattern, shows examples for each type, and helps them choose the right type for their work.

**Why this priority**: Documentation enables self-service adoption. Without it, developers guess at type values and create inconsistent patterns. Clear guidance reduces support burden and improves compliance.

**Independent Test**: A developer can read the branching strategy guide, understand the 24 types, and choose the correct type for their work without asking for help. The feature delivers value through reduced support tickets.

**Acceptance Scenarios**:

1. **Given** a developer reading `docs/BRANCHING_STRATEGY.md`, **When** they look up the feature type, **Then** they see `feat` with purpose "New feature" and example `feat/user-preferences-panel`
2. **Given** a developer unsure about `proto` vs `research`, **When** they consult the guide, **Then** they understand `proto` is for experimental code, `research` is for investigation/benchmarks
3. **Given** a developer working on accessibility, **When** they check the type list, **Then** they find `a11y` with purpose "Accessibility" and example `a11y/wcag-compliance-audit`

---

### User Story 5 - PR Template Assignment Works Correctly (Priority: P2)

The organization's existing PR template routing system (which depends on branch prefix) works correctly once branch names are validated. Templates route to the right reviewers, instructions, and checklists based on work type.

**Why this priority**: This is a downstream benefit of correct naming. Once branches are valid, the existing template system works as designed. This unblocks 19 specialized PR templates and their workflows.

**Independent Test**: A PR template routes correctly based on branch type prefix. The feature delivers value by enabling the organization's template-based automation.

**Acceptance Scenarios**:

1. **Given** a PR from `feat/...` branch, **When** the template system runs, **Then** the feature template (19-section comprehensive review checklist) is used
2. **Given** a PR from `security/...` branch, **When** the template system runs, **Then** the security template (threat modeling, CVSS scoring) is used
3. **Given** a PR from `refactor/...` branch, **When** the template system runs, **Then** the refactor template (no new features, performance impact) is used

---

### Edge Cases

- What happens when a developer creates branch with valid type but empty scope (e.g., `feat/-title`)? → Reject with guidance
- How does the system handle scope/title with special characters (e.g., `feat/user-auth-#123`)? → Allow hyphens, reject others
- What if a developer uses uppercase in type (e.g., `FEAT/my-feature`)? → Normalize to lowercase or reject with guidance
- How does the system handle very long scope/title strings (e.g., 200 characters)? → Define and enforce reasonable length limits
- What happens if a PR is opened from a branch renamed after creation? → Validation runs against current branch name, not commit history

## Clarifications

### Session 2026-09-14

- Q: How should the system auto-detect and apply area labels (e.g., `area:api` vs `area:docs`)? → A: Use keyword matching against a canonical keyword-to-area mapping (e.g., "api", "endpoint" → `area:api`). Scan scope/title; apply most-specific match if multiple keywords found.
- Q: What mechanism triggers branch rename detection and metadata update? → A: Reactive detection via GitHub Actions `push` event. When a commit already associated with a PR appears on a different branch name, GitHub Actions detects the rename and updates PR metadata (template, labels) for the new branch name.
- Q: When automated label application runs, what happens if PR already has manually-applied labels? → A: Merge and deduplicate. Add system-determined labels only if not already present. Preserve existing manually-applied labels. Allows developer customization while ensuring type labels are always present.

## Requirements

### Functional Requirements

- **FR-001**: System MUST support exactly 24 authorized branch types: `feat`, `fix`, `hotfix`, `release`, `refactor`, `chore`, `task`, `docs`, `test`, `perf`, `ci`, `build`, `deps`, `security`, `design`, `a11y`, `ux`, `i18n`, `ops`, `proto`, `ds`, `audit`, `codex`, `revert`, `research`

- **FR-002**: System MUST enforce branch naming pattern `{type}/{scope}-{title}` where:
  - `type` is exactly one of the 24 authorized values
  - `scope` is lowercase alphanumeric and hyphens only (e.g., `user-auth`, `pr-template`)
  - `title` is lowercase alphanumeric and hyphens only (e.g., `implementation`, `routing-bug`)
  - Full pattern matches regex: `^(feat|fix|hotfix|release|refactor|chore|task|docs|test|perf|ci|build|deps|security|design|a11y|ux|i18n|ops|proto|ds|audit|codex|revert|research)/[a-z0-9]+(-[a-z0-9]+)*-[a-z0-9]+(-[a-z0-9]+)*$`

- **FR-003**: System MUST reject all branches using forbidden prefixes: `claude/`, `copilot/`, `openai/` with clear error message explaining reservation

- **FR-004**: System MUST map each branch type to exactly one PR template from the 19 available templates:
  - `feat` → `pr_feature.md`
  - `fix` → `pr_bugfix.md`
  - `security` → `pr_security.md`
  - etc. (complete mapping in contracts/branch-naming.contract.md)

- **FR-005**: System MUST map each branch type to canonical prefixed labels (from `.github/labels.yml`) and auto-detect area labels:
  - Type labels: `feat` → `type:feature`, `fix` → `type:bug`, `security` → `type:security`, etc.
  - Default labels: Apply type labels always; suggest priority labels (e.g., `priority:critical` for security)
  - Area labels: Auto-detect via keyword matching (e.g., keywords "api", "endpoint" in scope/title → `area:api`; "docs", "guide" → `area:docs`)
  - Label application strategy: Merge and deduplicate. Apply system-determined labels only if not already present; preserve existing manually-applied labels
  - Complete mapping in contracts/branch-naming.contract.md

- **FR-006**: System MUST validate branches before push using:
  - Local commit hook (`.git/hooks/pre-push` or equivalent) for immediate feedback
  - Remote GitHub Actions workflow for enforcement on push
  - PR template routing based on branch type prefix

- **FR-007**: System MUST provide clear validation error messages that:
  - Identify the specific problem (e.g., "invalid type", "forbidden prefix", "malformed scope")
  - Show the branch name that was rejected
  - Provide the correct pattern with examples
  - Suggest the correct branch name (e.g., "Did you mean `feat/user-auth-improvements`?")

- **FR-008**: System MUST support a validation CLI command that developers can run locally:
  - `npm run validate:branch-name -- --branch <branch-name>`
  - Returns exit code 0 for valid, non-zero for invalid
  - Outputs machine-readable JSON for CI integration
  - Outputs human-readable text for local use

- **FR-009**: System MUST track branch naming compliance metrics:
  - % branches following naming pattern per month
  - Top invalid patterns used (for guidance improvement)
  - PR template routing success rate
  - Time to remediate invalid branches

- **FR-010**: System MUST detect branch renames and update associated metadata (PR template, labels) when a branch is renamed after PR creation:
  - Detection mechanism: GitHub Actions `push` event monitors all branches. When a commit already associated with an open PR appears on a different branch name, the system detects the rename
  - Metadata update: Re-identify branch type from new branch name; route to appropriate PR template; re-apply labels based on new branch type
  - Timing: Updates triggered within seconds of push (GitHub Actions event latency)

### Key Entities

- **BranchName**: A Git branch with pattern `{type}/{scope}-{title}`
  - `type`: One of 24 authorized types
  - `scope`: Hyphen-separated lowercase identifier for feature domain
  - `title`: Hyphen-separated lowercase identifier for specific change
  - `full_name`: Complete branch name string
  - `is_valid`: Boolean indicating compliance with pattern and forbidden prefix rules
  - `detected_type`: The identified type (used for routing)

- **BranchType**: Configuration for one branch type
  - `type`: Type identifier (e.g., `feat`)
  - `purpose`: Human-readable purpose (e.g., "New feature")
  - `example`: Example branch name (e.g., `feat/user-preferences-panel`)
  - `pr_template`: Associated PR template file (e.g., `pr_feature.md`)
  - `default_labels`: Default labels to always apply (e.g., `type:feature`)
  - `suggested_labels`: Optional labels to suggest (e.g., `priority:critical` for security type)
  - `area_keywords`: List of keywords to scan in scope/title for area auto-detection (e.g., ["api", "endpoint", "rest"] → `area:api`)

- **ComplianceMetrics**: Tracking data for branch naming compliance
  - `date`: Metric collection date
  - `total_branches`: Total branches in repository
  - `valid_branches`: Branches following the naming pattern
  - `invalid_branches`: Branches that violate the pattern
  - `forbidden_prefix_branches`: Branches using reserved prefixes
  - `compliance_percentage`: (valid_branches / total_branches) * 100
  - `top_invalid_patterns`: Most common invalid patterns

## Success Criteria

### Measurable Outcomes

- **SC-001**: 95% of new branches created in LightSpeed repos follow the naming pattern within 3 months of rollout

- **SC-002**: Branch naming validation provides feedback to developers in under 1 second (local hook latency)

- **SC-003**: 100% of PRs created from valid branches receive correct PR template routing (no manual template reassignments)

- **SC-004**: PR creation from valid branches automatically receives correct labels with 100% accuracy (validation via sample PR review)

- **SC-005**: Developers can validate a branch name locally using the CLI without external API calls (offline-capable)

- **SC-006**: Compliance metrics show adoption curve: 50% compliant by week 2, 80% by week 4, 95% by week 12 post-launch

- **SC-007**: Zero PRs opened from branches using forbidden prefixes (claude/, copilot/, openai/) within the first month

- **SC-008**: Support tickets related to PR template misrouting drop by 90% after enforcement rollout

- **SC-009**: Branch naming documentation is accessible to 100% of developers (linked from CLAUDE.md, wiki, Slack bot responses)

- **SC-010**: Validation error messages are clear enough that developers fix their branch name on first attempt 85% of the time without asking for help

## Assumptions

- **Organization Scale**: LightSpeed manages 50+ repositories with 200+ active developers. Automation must scale across this scope without manual intervention per-repo.

- **Existing PR Template System**: The organization already has 19 specialized PR templates in `.github/PULL_REQUEST_TEMPLATE/*.md` that route based on branch prefix. This feature leverages existing infrastructure.

- **Git Workflow**: Developers use standard Git workflows (create branch, push, open PR). Branch naming validation integrates into this flow at push time.

- **Label Management**: The organization maintains a canonical label set in `.github/labels.yml` with required family prefixes (type:, status:, priority:, area:, etc.). Label application is automated and must respect this canon.

- **GitHub Actions CI**: The organization uses GitHub Actions for CI/CD. Validation workflows can run on every push and PR creation without external tools.

- **Developer Experience**: Developers prefer immediate, local feedback (commit hooks) over remote rejection. The feature provides both, with local hooks offering faster iteration.

- **Backwards Compatibility**: Existing branches with non-compliant names are allowed to exist. Enforcement applies only to newly created branches and PR template routing (PR template routing applies to all branches, valid or not).

- **Migration Path**: The 50+ repositories are migrated gradually (not all at once). Early adopters provide feedback before org-wide rollout.

- **Documentation Language**: Documentation uses UK English (organisation, optimise, behaviour) per CLAUDE.md conventions.

- **Integration Points**: The feature integrates with:
  - Pre-push hooks (local validation)
  - GitHub Actions (remote enforcement, PR template routing, label application)
  - CLI tools (npm scripts, validation command)
  - Agent/AI systems (AI agents use the pattern to auto-suggest correct branch names)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*
[Automation Docs](https://github.com/lightspeedwp/.github/tree/main/instructions)

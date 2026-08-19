---
title: "LightSpeed .github — Claude Instructions"
description: "Claude-specific project instructions for the LightSpeed .github repository."
version: "v2.1"
last_updated: "2026-08-18"
file_type: "agents-index"
maintainer: "LightSpeed Team"
---

# CLAUDE.md — LightSpeed .github

> Full organisation-wide AI rules, coding standards, and contribution guidelines live in [AGENTS.md](./AGENTS.md). Read that file first.

Canonical AI references are maintained under [`ai/`](./ai/), including
[`ai/Claude.md`](./ai/Claude.md), [`ai/Gemini.md`](./ai/Gemini.md), and
[`ai/RUNNERS.md`](./ai/RUNNERS.md).

## What This Repository Is

This is the **LightSpeed organisation `.github` control plane**. It owns:

- GitHub community-health files (issue templates, PR templates, discussion templates, saved replies, code of conduct, security policy).
- Organisation-wide labels, labeler rules, and issue types.
- GitHub Actions workflows for labeling, metrics, releases, and validation.
- Repo-local Copilot and agent instructions (`.github/instructions/` for control-plane-specific, `.github/custom-instructions.md`).
- Reports, project artefacts, and active planning documents.

It also hosts **portable AI operations assets** in top-level source folders that are intended to be reusable outside this repository:

| Folder | Purpose |
| --- | --- |
| `ai/` | Canonical AI agent references (Claude, Gemini, RUNNERS configurations) |
| `agents/` | Portable agent specifications (multi-file implementations) |
| `schemas/` | JSON schema definitions (root, hidden, portable) |
| `cookbook/` | Recipes, playbooks, and implementation guides |
| `hooks/` | Portable hooks and guardrails |
| `instructions/` | Portable instruction files (no `.github` assumptions) |
| `plugins/` | Installable plugin bundles |
| `skills/` | Self-contained skills with `SKILL.md` entrypoints |
| `workflows/` | Portable agentic workflows |

Do **not** place reusable assets under `.github/`—use the matching top-level folder instead.

### Path Reference: Repository Restructuring Initiative

**Phase 1 Audits Completed (2026-08-05):** Comprehensive audits of instructions, schemas, and agents.

The repository restructuring initiative includes Phase 1 audits that map all portable and control-plane assets. Phase 1 audit reports are available in [.github/projects/active/repo-restructuring-2026-07-25/](./.github/projects/active/repo-restructuring-2026-07-25/):

**Phase 1 Audit Reports (Completed 2026-08-05):**

- **INSTRUCTION_FILES_AUDIT_2026-08-05.md** — 58 instruction files mapped (27 portable, 17 local, 15 archived; 502+ references)
- **SCHEMA_AUDIT_REPORT.md** — 25 core schemas across 3 locations; consolidation plan
- **AGENT-AUDIT-COMPREHENSIVE.md** — 35 agents (19 spec-based, 16 multi-file; 788+ references)

**Historical Reference:** Restructuring phases completed and planned:

| Component | Old Path | New Path | Type | Status |
| --- | --- | --- | --- | --- |
| **Schema files** | `schema/` | `schemas/` (root, hidden) | Consolidation | Phase 3 (migration plan ready) |
| **Schema visibility** | `schemas/` | (visible root copy maintained) | Reference | Current (npm package reference) |
| **Scripts** | `scripts/` | `.github/scripts/` (Phase 1) → `scripts/` (Phase 2B-2C) | Move to .github, then portable | ✅ Complete (Phase 2B-2C, 2026-08-19) |
| **Website** | `website/` | `.github/website/` | Move to .github | ✅ Complete |
| **Projects** | `projects/active/` | `.github/projects/active/` | Move to .github | ✅ Complete |
| **Instructions** | `.github/instructions/` (mixed) | `instructions/` + `.github/instructions/` (split) | Reorganize | Phase 3 (audit complete) |
| **Agents** | `.github/agents/` (mixed) | `agents/` + `.github/agents/` (split) | Reorganize | Phase 3 (audit complete) |

**Schema consolidation note:** ✅ Phase 2 complete — All schemas consolidated into `schemas/` folder:

- `schemas/` — canonical portable location (26 files: 17 core + memory/ subdirectory + examples/)
- `schemas/` — hidden folder for backward compatibility (contains full schema set)
- `.github/schemas/` — ✅ removed (was control-plane marker folder)
- `schema/` — ✅ removed (legacy duplicate folder)

All schema references should use `schemas/` as the canonical location.

**For script maintainers:** If you reference schemas or other assets, use **relative paths from script location**:

**Portable scripts (root location):**

- From `scripts/validation/`: go **three levels up** (`../../../schemas/`) to reach `schemas/` at repo root
- From `scripts/agents/includes/`: go **four levels up** (`../../../../schemas/`) to reach `schemas/`
- From `scripts/workflows/changelog/`: go **four levels up** (`../../../../schemas/`) to reach `schemas/`

**Control-plane scripts (.github location):**

- From `.github/scripts/validation/`: go **three levels up** (`../../../schemas/`) to reach `schemas/` at repo root
- From `.github/scripts/agents/`: go **two levels up** (`../../schemas/`) to reach `schemas/` at repo root
- From `.github/scripts/workflows/`: go **three levels up** (`../../../schemas/`) to reach `schemas/` at repo root

**All original files preserved in Git history.** See [issue #1438](https://github.com/lightspeedwp/.github/issues/1438) for the initial restructuring epic and [issue #1290](https://github.com/lightspeedwp/.github/issues/1290) for the current Phase 1 initiative.

## Git & Branching Strategy

> **CRITICAL:** This repository follows a strict branching discipline. Read [docs/BRANCHING_STRATEGY.md](./docs/BRANCHING_STRATEGY.md) before opening any PR.

### AI Governance & Branch Protection — NO EXCEPTIONS

**Follow these rules without exception.**

#### Branch Naming — NO "claude/" Prefix

- **FORBIDDEN:** Do NOT use `claude/` as a branch prefix. This is not permitted under any circumstance.
- **REQUIRED:** ALL branches must follow the format: `{type}/{scope}-{short-title}` (lowercase, kebab-case) where `{type}` is one of the core prefixes listed below.
- **CORE PREFIXES:** `feat/`, `fix/`, `hotfix/`, `release/`, `refactor/`, `chore/`, `docs/`, `test/`, `perf/`, `ci/`, `build/`, `deps/`, `security/`, `revert/`, `research/`, `design/`, `a11y/`, `ux/`, `i18n/`, `ops/`.
- **AUTHORITATIVE SOURCE:** [docs/BRANCHING_STRATEGY.md](./docs/BRANCHING_STRATEGY.md) is the canonical reference for all branching rules.

#### Explicit User Instructions — EXECUTE IMMEDIATELY

- When the user explicitly instructs you to perform an action (e.g., "merge to develop", "push this branch", "create PR and merge"), **execute the instruction immediately**. Do not reinterpret, second-guess, or apply additional governance layers.
- **Important:** Governance checks (branch naming, target branch verification, validation errors) still apply. If a check fails, report the error to the user immediately rather than attempting to bypass it.
- **Rationale:** User instructions are explicit authorisation. AI governance rules protect against accidental violations, not against explicit user intent. Automated safety checks remain in force.

#### PR Merge & Cleanup Protocol — STRICT ENFORCEMENT

**CRITICAL:** Every PR merge must follow this protocol. This prevents branch orphans and ensures a clean repository state. (This protocol applies to repository maintainers performing merges, not to contributors working with forks.)

**Before Creating a PR:**

- ✅ Verify the branch is named correctly: `{type}/{scope}-{short-title}` format
- ✅ Confirm the PR will target `develop` (NOT `main` unless it is an explicit release cycle with user authorisation)

**During Merge:**

1. **Verify Base Branch** — Double-check PR base is `develop` (not `main`)
   - If base is `main`: STOP. Ask user if this is a release cycle. Do NOT merge without explicit instruction.
   - If base is correct: Proceed to merge.
2. **Merge Execution** — Use squash merge and wait for success confirmation
3. **Branch Cleanup** — Immediately after successful merge:
   - Attempt to delete the remote branch via `git push origin --delete {branch-name}`
   - If branch already auto-deleted by GitHub (typical): Expected behaviour, report as success
   - Delete the local branch via `git branch -d {branch-name}` (or `-D` if not fully merged locally)
   - Report status to user

#### Mergify Queue Configuration — Sequential Processing

**Configuration:** Mergify is configured in `.github/mergify.yml` to process PRs **sequentially** (one at a time) with automatic rebasing. This works in conjunction with GitHub's branch protection rule "Require branches to be up to date before merging."

**How It Works:**

1. PR enters Mergify queue → Mergify starts CI checks (in-place, not draft)
2. Multiple PRs can be queued → Mergify processes them sequentially
3. First PR finishes → Mergify verifies all conditions still pass
4. If base branch (`develop`) has changed → Mergify auto-rebases the PR
5. After rebase, checks re-run → If still green, PR merges automatically
6. Second PR then starts CI → Cycle repeats

**Key Configuration:**

```yaml
queue_rules:
  - name: dependabot-develop
    merge_method: squash
    batch_size: 1  # Process one PR at a time

merge_queue:
  max_parallel_checks: 1  # Only one PR in CI at a time
```

**Why Sequential Instead of Parallel:**

- GitHub's branch protection requires branches to be "up to date" before merge
- Parallel draft checks conflict with this requirement (branch can't stay updated mid-test)
- Sequential in-place checks maintain the safety invariant: branch is checked, then auto-rebased, then merged
- Trade-off: Slower merge speed (one at a time) for explicit two-layer safety (GitHub + Mergify)

**User-Facing Behaviour:**

- ✅ Use "Add to merge queue" button instead of direct merge
- ✅ Multiple PRs in queue is fine → Mergify handles sequencing
- ✅ Auto-rebase happens transparently if base branch changes
- ✅ If conflicts arise, PR author is notified
- ⚠️ Merge is slower than parallel (expect ~10 min per PR, not instant)

**Monitoring:**

- Check Mergify dashboard for queue status
- If a PR is stuck, check PR comments for Mergify diagnostics
- Rare: If auto-rebase fails, manually rebase and push to unblock

#### main Branch — LOCKED (Release Only)

**Workflow Enforcement:** The `.github/workflows/main-branch-guard.yml` workflow automatically validates all PRs targeting `main`. PRs are rejected unless they originate from branches starting with `release/` or `hotfix/` (enforced by `.github/scripts/workflows/branch-policy/validate-main-branch-pr.cjs`; branches should follow the `release/vX.Y.Z` or `hotfix/<slug>` naming convention).

- **ALLOWED BRANCHES:** Only `release/*` and `hotfix/*` branches may merge to `main`
  - Example: `release/v1.5.0`, `hotfix/critical-security-patch`
  - The workflow checks the branch name prefix automatically
- **ALL OTHER BRANCHES:** Rejected by the main-branch-guard workflow (no exceptions)
  - Feature branches, fix branches, chore branches, etc. must target `develop`
  - The workflow returns an error if the branch prefix is not `release/` or `hotfix/`
- **DEVELOP IS DEFAULT:** All feature/fix/chore/docs/etc. branches merge to `develop` only

### Protected Branches

- `main` is **always production-ready**. Never push directly to `main` unless performing a **release cycle**.
- `develop` (if used) is an integration branch. Never push directly to `develop` outside release/hotfix workflows.
- All other work goes to feature/fix/chore branches.

### Branch Naming Convention

Use the format: `{type}/{scope}-{short-title}` (lowercase, kebab-case)

**Common prefixes:**

- `feat/` — new feature or capability
- `fix/` — bug fix
- `hotfix/` — urgent production fix (branches from `main`)
- `chore/` — maintenance, refactoring, dependency updates
- `docs/` — documentation changes
- `ci/` — CI/CD workflow changes
- `test/` — test-only changes
- `refactor/` — code restructure
- `security/` — security fixes

**Examples:**

```
chore/readme-frontmatter-standardization
fix/invalid-branch-name-validation
docs/update-contributing-guide
release/v1.2.0
```

**Branch protection enforcement:**

- All PRs require branch names matching the regex pattern
- CI will block misnamed branches from merging
- Rename with `git branch -m <old> <new>` if needed

### Branch Reuse Prevention

- **CRITICAL:** Once a branch has been merged (squash-merged into `develop` or `main`), that branch name is permanently retired. Do NOT reuse it for new work.
- The validation script detects reused branch names by searching Git merge history and `CHANGELOG.md` references.
- If a branch name is flagged as reused, create a new branch with a unique slug (e.g. append `-v2` or choose a distinct descriptor).

### Template Routing Quick Reference

Use [.github/PULL_REQUEST_TEMPLATE/config.yml](./.github/PULL_REQUEST_TEMPLATE/config.yml) as the canonical PR route map. Keep it aligned with [docs/BRANCHING_STRATEGY.md](./docs/BRANCHING_STRATEGY.md) and [docs/PR_CREATION_PROCESS.md](./docs/PR_CREATION_PROCESS.md).

| Prefix | PR template |
| --- | --- |
| `feat/` | `pr_feature.md` |
| `fix/` | `pr_bug.md` |
| `hotfix/` | `pr_hotfix.md` |
| `refactor/` | `pr_refactor.md` |
| `chore/` | `pr_chore.md` |
| `docs/` | `pr_docs.md` |
| `test/` | `pr_chore.md` |
| `perf/` | `pr_feature.md` |
| `ci/` | `pr_ci.md` |
| `build/` | `pr_ci.md` |
| `deps/` | `pr_dep_update.md` |
| `security/` | `pr_bug.md` |
| `design/` | `pr_feature.md` |
| `a11y/` | `pr_feature.md` |
| `ux/` | `pr_feature.md` |
| `release/` | `pr_release.md` |
| `research/` | `pr_feature.md` |
| `revert/` | `pr_chore.md` |
| `i18n/` | `pr_feature.md` |
| `ops/` | `pr_chore.md` |
| `proto/` | `pr_feature.md` |
| `ds/` | `pr_feature.md` |
| `api/` | `pr_feature.md` |
| `schemas/` | `pr_feature.md` |
| `telemetry/` | `pr_feature.md` |
| `content/` | `pr_docs.md` |
| `seo/` | `pr_docs.md` |
| `config/` | `pr_chore.md` |
| `migrate/` | `pr_chore.md` |
| `qa/` | `pr_chore.md` |
| `uat/` | `pr_chore.md` |

For issue intake, use [.github/ISSUE_TEMPLATE/config.yml](./.github/ISSUE_TEMPLATE/config.yml) and [.github/issue-types.yml](./.github/issue-types.yml) as the canonical sources.

### Issue Template Quick Reference

- `task` for scoped work, config updates, and small delivery items.
- `bug` for reproducible defects with environment and reproduction details.
- `feature` for new capabilities or user-visible enhancements.
- `design` for UI/UX, token, or accessibility design work.
- `epic` for large, multi-part initiatives grouping stories, features, and tasks.
- `story` for user-centric narratives with acceptance criteria and business value.
- `improvement` for suggested enhancements to existing functionality.
- `chore` for small housekeeping tasks: label hygiene, repo tweaks, file moves.
- `code-refactor` for structured code cleanup without changing external behaviour.
- `build-ci` for build system, CI/CD, and pipeline changes.
- `automation` for workflow automation and tooling.
- `testing-coverage` for new or refactored automated tests.
- `performance` for speed, resource, or latency work.
- `a11y` for accessibility compliance and WCAG 2.2 AA improvements.
- `security` for vulnerabilities or security hardening.
- `compatibility` for cross-version, browser, or platform compatibility issues.
- `integration-issue` for third-party system integration problems.
- `release` for release planning, coordination, and delivery.
- `maintenance` for system maintenance, dependency updates, and housekeeping.
- `documentation` for docs and content updates.
- `research` and `audit` for exploratory or assessment work.
- `code-review` for code quality discussions and review standards.
- `ai-ops` and `content-modelling` for specialist AI and content workflows.

### Issue Template Quick Reference

When creating issues programmatically, use the correct template based on issue type. **All issue templates require two mandatory sections:**

- `## Definition of Ready (DoR)` — pre-work checklist
- `## Definition of Done (DoD)` — completion checklist

Templates located in `.github/ISSUE_TEMPLATE/`:

| Issue Type | Template File | Use When |
| --- | --- | --- |
| Bug | `01-bug.md` | Reproducible defect, error, or crash |
| Code Refactor | `02-code-refactor.md` | Code cleanup or simplification (non-user-facing) |
| Feature | `03-feature.md` | New capability or user-visible enhancement |
| Design | `04-design.md` | UI/UX, token, or accessibility design work |
| Epic | `05-epic.md` | Large, multi-part initiative grouping stories |
| Story | `06-story.md` | User-centric narrative with acceptance criteria |
| Improvement | `07-improvement.md` | Enhancement to existing functionality |
| Task | `08-task.md` | Scoped work, config updates, small delivery |
| Chore | `09-chore.md` | Small housekeeping (labels, repo tweaks) |
| Testing | `10-testing-coverage.md` | New or refactored automated tests |
| Performance | `11-performance.md` | Speed, resource, or latency work |
| Accessibility | `12-a11y.md` | WCAG 2.2 AA compliance improvements |
| Security | `13-security.md` | Vulnerabilities or hardening |
| Compatibility | `14-compatibility.md` | Cross-version, browser, or platform issues |

**Template enforcement workflow:** `.github/workflows/template-enforcement.yml`

- Validates all issues have DoR and DoD sections
- Flags non-compliant issues with `status:needs-more-info` label
- See [AGENTS.md](./AGENTS.md) for programmatic issue creation guidance

### AI Feedback PR Review Validation

**New Feature:** Automated workflow to ensure AI feedback in PRs is reviewed, documented, and tracked.

**Workflow:** `.github/workflows/ai-feedback-validation.yml`

- Validates PR links to one or more GitHub issues (`Resolves #123`, `Closes #456`)
- Checks for `FEEDBACK_RESPONSE.md` tracking file with feedback documentation
- Validates feedback status markers: `✅ Addressed`, `📋 Deferred`, `❌ Rejected`
- Ensures addressed items reference commits, deferred items reference issues
- Posts helpful validation comments with actionable guidance

**For PR Authors:**

1. Link PR to issue(s): `Resolves #123` in PR description
2. Copy template: `cp .github/PULL_REQUEST_TEMPLATE/FEEDBACK_RESPONSE.md ./FEEDBACK_RESPONSE.md`
3. Document AI feedback: add rows to feedback response table
4. Assign status: `✅ Addressed`, `📋 Deferred`, or `❌ Rejected`
5. Commit and push — validation runs automatically

**Key Resources:**

- **Quick Reference:** [docs/QUICK_REFERENCE_AI_FEEDBACK.md](./docs/QUICK_REFERENCE_AI_FEEDBACK.md) — 4-step implementation guide
- **System Summary:** [docs/AI_FEEDBACK_SYSTEM_SUMMARY.md](./docs/AI_FEEDBACK_SYSTEM_SUMMARY.md) — Complete system overview
- **Full Guide:** [docs/ai-feedback-response-tracking.md](./docs/ai-feedback-response-tracking.md) — Comprehensive guide with examples
- **Workflow Details:** [docs/WORKFLOW_AI_FEEDBACK_VALIDATION.md](./docs/WORKFLOW_AI_FEEDBACK_VALIDATION.md) — Technical configuration and automation
- **Template:** [.github/PULL_REQUEST_TEMPLATE/FEEDBACK_RESPONSE.md](./.github/PULL_REQUEST_TEMPLATE/FEEDBACK_RESPONSE.md) — Template to copy
- **Examples:** [examples/FEEDBACK_RESPONSE_example-simple.md](./examples/FEEDBACK_RESPONSE_example-simple.md) and [examples/FEEDBACK_RESPONSE_example-complex.md](./examples/FEEDBACK_RESPONSE_example-complex.md)

**What This Enables:**

✅ **Automatic validation** — Every PR validated for issue linking and feedback tracking  
✅ **Clear decisions** — Document whether feedback is addressed, deferred, or rejected  
✅ **Process enforcement** — Workflow prevents merge without proper issue links  
✅ **Team consistency** — Same process across all PRs  
✅ **Transparent tracking** — All feedback decisions visible in commit history

### Issue Maintenance Scripts & Label Management

Comprehensive documentation for issue automation, triage workflows, and label management:

**System Documentation:**

- **[docs/ISSUE_MAINTENANCE_SCRIPTS.md](./docs/ISSUE_MAINTENANCE_SCRIPTS.md)** — Primary system guide for issue maintenance automation (800+ lines)
- **[docs/LABEL_MANAGEMENT_CLI.md](./docs/LABEL_MANAGEMENT_CLI.md)** — CLI reference for label orchestrator and management tools
- **[scripts/automation/README.md](./scripts/automation/README.md)** — Folder overview and quick-start guide

**Reference Guides:**

- **[docs/LABELING.md](./docs/LABELING.md)** — Complete labeling standards and conventions
- **[docs/LABEL_STRATEGY.md](./docs/LABEL_STRATEGY.md)** — Label taxonomy and governance strategy
- **[docs/LABELING_EXAMPLES.md](./docs/LABELING_EXAMPLES.md)** — Practical labeling examples
- **[docs/LABELING_FAQ.md](./docs/LABELING_FAQ.md)** — Frequently asked questions
- **[docs/LABELING_GOVERNANCE.md](./docs/LABELING_GOVERNANCE.md)** — Label governance rules and policies

**Active Project:**

- [issue-maintenance-scripts-2026-08-10](./.github/projects/active/issue-maintenance-scripts-2026-08-10/) — Phase 3-4 completed; Phase 5 integration testing in progress

### Before Every Push

1. Verify the current branch: `git branch -v`
2. Confirm it is NOT `main` or `develop` (unless in a release cycle)
3. Ensure the branch name follows the `{type}/{scope}-{short-title}` pattern
4. Run the local validation check: `npm run validate:branch-name -- --branch $(git branch --show-current)`
5. Use: `git push -u origin <branch-name>`

## Development Commands

```bash
# Install dependencies
npm ci

# Run all tests
npm test

# Lint Markdown files
npm run lint:md

# Lint JS/TS files
npm run lint:js

# Format files
npm run format

# Validate frontmatter
npm run validate:frontmatter
```

## Key Conventions

- **Language:** UK English throughout (optimise, organisation, colour, behaviour).
- **Coding Standards:** Follow [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/) for PHP, plus ESLint/Prettier for JS/TS and PHPCS/WPCS for PHP.
- **Security:** Validate all input, escape all output, use nonces, never commit secrets.
- **Accessibility:** WCAG 2.2 AA minimum; semantic HTML, keyboard support, sufficient contrast.
- **Performance:** Avoid unnecessary JS, defer/lazy-load where possible, prefer native blocks.
- **No `references` frontmatter field:** Use inline links or footer sections instead.
- **Instruction files:** Follow the pattern in `.github/instructions/instructions.instructions.md`—frontmatter + role declaration + Overview + General Rules + Detailed Guidance + Examples + Validation + References.

## Label Creation Rules (CRITICAL)

When creating issues or PRs programmatically (via CLI, API, or workflow), **ALL labels MUST be from the canonical set in `.github/labels.yml` with their required family prefix**.

### Valid Label Examples (Prefixed)

- `type:bug`, `type:feature`, `type:task`, `type:documentation`
- `status:needs-triage`, `status:in-progress`, `status:done`
- `priority:critical`, `priority:important`, `priority:normal`
- `area:ci`, `area:docs`, `area:security`, `area:labels`
- `meta:needs-changelog`, `meta:has-pr`

### INVALID Label Examples (Bare — DO NOT USE)

- ❌ `bug` — use `type:bug`
- ❌ `feature` — use `type:feature`
- ❌ `urgent` — use `priority:critical`
- ❌ `ci` — use `area:ci`

### Reference

- Source of truth: `.github/labels.yml` (158 canonical labels)
- Labeling guide: `docs/LABELING.md`
- Label taxonomy: `docs/LABEL_STRATEGY.md`
- Root cause analysis: [Label Prefix Enforcement Project](./.github/projects/active/label-prefix-enforcement-2026-08-05/)

## Repository Boundaries

| Asset Type | Belongs In | Type |
| --- | --- | --- |
| GitHub-native governance (templates, labels, workflows) | `.github/` | Control-plane only |
| **Portable instruction standards** (a11y, coding, documentation, issues, PRs, community) | `instructions/` (root) | Portable, reusable |
| **Repo-local Copilot/agent instructions** (control-plane-specific) | `.github/instructions/` or `.github/custom-instructions.md` | Control-plane only |
| **Portable JSON schemas** (validation for frontmatter, agents, plugins, skills) | `schemas/` (root) | Portable, reusable |
| **Portable agent specifications** — Multi-file implementations (16 agents) | `agents/` (root) | Portable, installable |
| **Spec-based agents** — Simple YAML/JSON definitions (19 agents) | `.github/agents/` | GitHub-native only |
| Reports, audits, metrics | `.github/reports/{category}/` | Control-plane only |
| Active project artefacts | `.github/projects/active/{slug}/` | Control-plane only |
| Temporary scratch files | `.github/tmp/` (clean up before PR) | Control-plane only |
| Portable reusable AI assets | top-level source folders (see table above) | Portable |
| Permanent human documentation | `docs/` | Control-plane only |

### Two-Tier Agent Structure (Phase 1C)

The repository implements a **two-tier agent architecture** separating GitHub-native and portable implementations:

**Tier 1: GitHub-Native (`.github/agents/`)**

- 19 spec-based agents: Simple YAML/JSON definitions
- Single `.agent.md` file per agent
- Control-plane specific, not installable elsewhere
- Examples: AI-Readiness-Estimator, Website-Scope-Estimator, Zendesk-Support

**Tier 2: Portable (`agents/` root)**

- 16 multi-file agents: Complex implementations (9+ files per agent)
- Full implementation with skills, configurations, schemas
- Installable and reusable in other LightSpeedWP projects
- Examples: PRD-Agent (1,637 files), Playwright-Testing-Agent (458 files)

**Total: 35 agents (19 spec-based + 16 multi-file; 12,459 files), 788+ references across codebase**

**Key Principle:** Portable agents (Tier 2) go to root `agents/` directory. Control-plane-specific agents (Tier 1) remain in `.github/agents/`.

### Portable vs Control-Plane Assets

**Portable Assets** (reusable across LightSpeedWP projects):

- Located at **root level** (top-level folders)
- Include: `agents/`, `instructions/`, `schemas/`, `skills/`, `plugins/`, `workflows/`, `hooks/`, `cookbook/`
- No `.github/` assumptions in code or documentation
- Suitable for import/fork into other repositories

**Control-Plane Assets** (LightSpeed .github specific):

- Located under **`.github/`** directory
- Include: governance files, workflows, scripts, reports, projects, local instructions
- May reference this repository's structure
- Not intended for reuse elsewhere

**Active projects note:** All active project artefacts MUST be in `.github/projects/active/{slug}/`. Do NOT create project folders in root `projects/` directory (e.g., ~~`projects/active/`~~). The root `projects/` folder is not permitted; all project documentation belongs under `.github/`. This ensures consistent governance and access control.

**Schema folder note:** JSON schemas are stored in `schemas/` (hidden folder at root) following the awesome-copilot pattern. This includes validation schemas for frontmatter, agents, plugins, skills, and other structured content. The older `schema/` and `schemas/` folders are maintained for backward compatibility during consolidation; see [issue #1292](https://github.com/lightspeedwp/.github/issues/1292) for migration details.

**Instruction files note:** Portable instruction files live in root `instructions/` folder. Repo-local control-plane instructions remain in `.github/instructions/`. See Phase 1A audit report in [.github/projects/active/repo-restructuring-2026-07-25/](./.github/projects/active/repo-restructuring-2026-07-25/) for complete migration mapping.

**Documentation Standards note (Phase 3A):** Comprehensive standards for creating agents, skills, instructions, workflows, plugins, and other AI infrastructure are maintained in `docs/`. These 9 standards documents are the authoritative reference for all AI-driven work. See [AGENTS.md#documentation-standards](./AGENTS.md#documentation-standards) for the complete quick reference guide.

## Project Management & Archival Process

### Active Projects

All active projects are stored in `.github/projects/active/{slug}/` and must:

1. **Have a README.md** with project overview, phases, and deliverables
2. **Link to GitHub issues** via a "Related Issues" section
3. **Follow linking standards** — see [LINKING_STANDARD.md](./.github/projects/active/reports-projects-restructuring-2026-08-11/LINKING_STANDARD.md)
4. **Be validated by CI** — workflow `validate-project-linking.yml` checks all active projects have ≥1 linked issue

### Archiving Completed Projects

When a project is complete:

1. **Create `.archive-status.md`** in the project folder documenting:
   - Project completion summary
   - All deliverables completed
   - Related issues resolved
   - Archive date and reason

2. **Move to archive:**

   ```bash
   git mv .github/projects/active/{slug} .github/projects/archive/{slug}
   ```

3. **Update related GitHub issues** with archive reference:
   - Add comment: "✅ **ARCHIVED:** This project has been archived on [date]"
   - Link to `.archive-status.md` for completion details

4. **Create PR** with clear archive documentation
   - Link to related issues being closed
   - Include `.archive-status.md` in commit

**Full guide:** [.github/ARCHIVE_WORKFLOW_GUIDE.md](./.github/ARCHIVE_WORKFLOW_GUIDE.md)

### Project-Issue Linking Standard

All active projects must establish bidirectional linking with GitHub issues:

**Project → Issue:** Project README includes "Related Issues" section with table of linked issues  
**Issue → Project:** GitHub issue includes "Related Projects" comment with link back to project

**Format example:**

In project README.md:

```markdown
## Related Issues

| Issue | Type | Purpose | Status |
|-------|------|---------|--------|
| [#1731](../../../issues/1731) | epic | Master Initiative Epic | 🟢 Open |
| [#1733](../../../issues/1733) | task | Phase 2: Folder Structure | 🟢 Open |
```

In GitHub issue:

```markdown
## Related Active Projects

This issue is part of:
- [reports-projects-restructuring-2026-08-11](./.github/projects/active/reports-projects-restructuring-2026-08-11/)
```

**Complete standard:** [LINKING_STANDARD.md](./.github/projects/active/reports-projects-restructuring-2026-08-11/LINKING_STANDARD.md)

## Agentic Release Workflows (Phase 5A)

**Governance Rules for Agentic Releases**

### When Required vs. Optional

- **Recommended:** For all releases to ensure consistency, safety, and audit trail
- **Optional:** Phase 4 shell scripts remain available as fallback
- **Required:** For production releases with breaking changes (major versions)

### Authorization Model

**Two-Layer Authorization:**

1. **GitHub Team Membership:** User must be in `maintainers` team
2. **Trigger-Telemetry:** Logs all release attempts (non-blocking, for audit)

**Check Authorization:**

```bash
gh api /orgs/lightspeedwp/teams/maintainers/members/$(git config user.name)
```

### Approval Requirements

**Tiered by Scope:**

| Scope | Approval | Who Decides | Timeline |
|-------|----------|------------|----------|
| **Patch** | Auto-approve | Agentic (score ≥ 0.8) | < 5 min |
| **Minor** | Manual review | 1 maintainer | 10–30 min |
| **Major** | Dual approval | 2 maintainers + ADR | 1–4 hours |

**How to Approve:**

- Patch releases auto-approve if agentic confidence score is ≥ 0.8
- Minor releases: Maintainer comments "approved" or "LGTM" on PR
- Major releases: 2 maintainers approve + ADR linked in commit message

### Audit Logging

All releases logged to `.github/reports/agentic-releases/` with JSON structure:

```json
{
  "timestamp": "2026-08-28T10:30:00Z",
  "user": "ashley@lightspeedwp.agency",
  "scope": "patch",
  "agenticScore": 0.92,
  "gates": {
    "changelog": "PASS",
    "version": "PASS",
    "authorization": "PASS",
    "approval": "AUTO_APPROVED"
  },
  "result": "SUCCESS"
}
```

**Retention:** 90 days (GitHub Actions default) + archival in `.github/reports/`

### Fallback Procedures

If agentic layer fails, Phase 4 shell scripts available:

```bash
bash .github/scripts/release/release.sh patch
```

**This is always available** — releases are never blocked permanently.

### Workflow Execution

**Standard Flow:**

1. Trigger: `gh workflow run release.yml -f scope=patch -f dry_run=true`
2. Dry-run: Preview all 7 safety gates, agentic score, approval requirements
3. Live: `gh workflow run release.yml -f scope=patch -f dry_run=false`
4. Result: Auto-approve (patch) or await approval (minor/major)

**See Also:**

- **[RELEASE_PROCESS.md](./docs/RELEASE_PROCESS.md)** — Complete release workflow
- **[BRANCHING_STRATEGY.md](./docs/BRANCHING_STRATEGY.md)** — Branch flow with agentic
- **[AGENTIC_RELEASE_USER_GUIDE.md](./docs/AGENTIC_RELEASE_USER_GUIDE.md)** — End-user guide
- **[AGENTIC_RELEASE_ADMIN_GUIDE.md](./docs/AGENTIC_RELEASE_ADMIN_GUIDE.md)** — Admin guide

### Key Principles

✅ **Authorization-first** — Maintainers team membership enforced always  
✅ **Scope-based approval** — Patch auto, minor/major manual  
✅ **Dry-run before live** — Always preview release first  
✅ **Safety gates first** — 7-gate validation before any mutations  
✅ **Fallback guaranteed** — Phase 4 scripts always available  
✅ **Audit trail required** — All releases logged with timestamps  

## What Not to Do

- Do not add WordPress plugin or theme project-specific code to `.github/`.
- Do not place reports or task trackers in `docs/` or the repo root.
- Do not create instruction files with a `references` frontmatter field.
- Do not move existing agents, instructions, or schemas without a migration issue that records source path, target path, and validation plan.
- Do not enqueue editor-only WordPress assets on the front end (and vice versa).
- Do not commit `node_modules/`, `build/`, or other generated artefacts.

## Related Files

**Organisation-wide portable instructions** (reusable across all LightSpeedWP repos):

Located in root `instructions/` directory:

- [instructions/coding-standards.instructions.md](./instructions/coding-standards.instructions.md) — unified coding standards (76 refs)
- [instructions/pull-requests.instructions.md](./instructions/pull-requests.instructions.md) — PR creation & labeling standards (40 refs)
- [instructions/documentation-formats.instructions.md](./instructions/documentation-formats.instructions.md) — Markdown, YAML, Mermaid standards (32 refs)
- [instructions/a11y.instructions.md](./instructions/a11y.instructions.md) — WCAG 2.2 AA accessibility standards
- [instructions/issues.instructions.md](./instructions/issues.instructions.md) — issue creation & labeling standards
- [instructions/community-standards.instructions.md](./instructions/community-standards.instructions.md) — community health standards

**Repo-local control-plane instructions** (specific to this .github control plane):

- [.github/custom-instructions.md](./.github/custom-instructions.md) — Copilot-specific repo instructions
- [instructions/file-organisation.instructions.md](./instructions/file-organisation.instructions.md) — repository file placement rules and portable asset organization
- [instructions/plugin-structure.instructions.md](./instructions/plugin-structure.instructions.md) — WordPress block plugin structure standards
- [AGENTS.md](./AGENTS.md) — full global AI governance and standards
- [docs/BRANCHING_STRATEGY.md](./docs/BRANCHING_STRATEGY.md) — Git branching discipline and branch naming rules

**Key reference documents:**

- [.github/projects/active/repo-restructuring-2026-07-25/](./.github/projects/active/repo-restructuring-2026-07-25/) — Phase 1 audit reports (instructions, schemas, agents)
- [.github/ISSUE_TEMPLATE/config.yml](./.github/ISSUE_TEMPLATE/config.yml) — issue template routing
- [.github/PULL_REQUEST_TEMPLATE/config.yml](./.github/PULL_REQUEST_TEMPLATE/config.yml) — PR template routing

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

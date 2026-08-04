---
title: "LightSpeed .github — Claude Instructions"
description: "Claude-specific project instructions for the LightSpeed .github repository."
version: "v1.8"
last_updated: "2026-06-18"
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
| `schemas/` | JSON schema definitions (visible, portable) |
| `cookbook/` | Recipes, playbooks, and implementation guides |
| `hooks/` | Portable hooks and guardrails |
| `instructions/` | Portable instruction files (no `.github` assumptions) |
| `plugins/` | Installable plugin bundles |
| `skills/` | Self-contained skills with `SKILL.md` entrypoints |
| `workflows/` | Portable agentic workflows |

Do **not** place reusable assets under `.github/`—use the matching top-level folder instead.

### Path Reference: Repository Restructuring (2026-08-02)

**Phase 1 Implementation (2026-08-02):** Complete folder consolidation and reference updates.

During the 2026-08-02 repository restructuring (Phase 1), the following locations were reorganized:

| Component | Old Path | New Path | Type |
| --- | --- | --- | --- |
| **Schema files** | `schema/` | `schemas/` (root, visible) | Consolidation |
| **Scripts** | `scripts/` | `.github/scripts/` | Move to .github |
| **Website** | `website/` | `.github/website/` | Move to .github |
| **Projects** | `projects/active/` | `.github/projects/active/` | Move to .github |
| **Frontmatter schema** | `scripts/validation/validate-frontmatter.js:../../schema/` | `.github/scripts/validation/validate-frontmatter.js:../../../schemas/` | Updated script path |
| **npm scripts** | `package.json schema/**` | `package.json schemas/**` | Updated glob pattern |

**For script maintainers:** If you reference schemas or other assets, use **relative paths from script location**:

- From `.github/scripts/validation/`: go **three levels up** (`../../../schemas/`) to reach `schemas/` at repo root
- From `.github/scripts/agents/`: go **two levels up** (`../../schemas/`) to reach `schemas/`
- From `.github/scripts/workflows/`: go **three levels up** (`../../../schemas/`)

**All original files preserved in Git history.** See [issue #1438](https://github.com/lightspeedwp/.github/issues/1438) for the Phase 1 restructuring epic and [.github/projects/active/repo-restructuring-2026-07-25/](./projects/active/repo-restructuring-2026-07-25/) for documentation.

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
| `.schemas/` | `pr_feature.md` |
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

- **Quick Reference:** [docs/QUICK_REFERENCE_AI_FEEDBACK.md](./docs/QUICK_REFERENCE_AI_FEEDBACK.md) — 4-step guide
- **Full Guide:** [docs/ai-feedback-response-tracking.md](./docs/ai-feedback-response-tracking.md) — Comprehensive guide with examples
- **Workflow Details:** [docs/WORKFLOW_AI_FEEDBACK_VALIDATION.md](./docs/WORKFLOW_AI_FEEDBACK_VALIDATION.md) — Technical configuration
- **Template:** [PULL_REQUEST_TEMPLATE/FEEDBACK_RESPONSE.md](./PULL_REQUEST_TEMPLATE/FEEDBACK_RESPONSE.md) — Template to copy
- **Examples:** [examples/FEEDBACK_RESPONSE_example-simple.md](./examples/FEEDBACK_RESPONSE_example-simple.md) and [examples/FEEDBACK_RESPONSE_example-complex.md](./examples/FEEDBACK_RESPONSE_example-complex.md)

**What This Enables:**

✅ **Automatic validation** — Every PR validated for issue linking and feedback tracking  
✅ **Clear decisions** — Document whether feedback is addressed, deferred, or rejected  
✅ **Process enforcement** — Workflow prevents merge without proper issue links  
✅ **Team consistency** — Same process across all PRs  
✅ **Transparent tracking** — All feedback decisions visible in commit history

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

## Repository Boundaries

| Asset Type | Belongs In |
| --- | --- |
| GitHub-native governance (templates, labels, workflows) | `.github/` |
| Portable instruction standards (a11y, coding, documentation) | `instructions/` (root) |
| Repo-local Copilot/agent instructions (control-plane-specific) | `.github/instructions/` or `.github/custom-instructions.md` |
| Portable JSON schemas (validation definitions) | `.schemas/` (hidden folder at root) |
| Portable agent specifications (multi-file implementations) | `agents/` (root) |
| Spec-based agents (simple YAML/JSON definitions) | `.github/agents/` (GitHub-native only) |
| Reports, audits, metrics | `.github/reports/{category}/` |
| Active project artefacts | `.github/projects/active/{slug}/` |
| Temporary scratch files | `.github/tmp/` (clean up before PR) |
| Portable reusable AI assets | top-level source folders (see table above) |
| Permanent human documentation | `docs/` |

**Active projects note:** All active project artefacts MUST be in `.github/projects/active/{slug}/`. Do NOT create project folders in root `projects/` directory (e.g., ~~`projects/active/`~~). The root `projects/` folder is not permitted; all project documentation belongs under `.github/`. This ensures consistent governance and access control per CLAUDE.md line 312.

**Schema folder note:** JSON schemas are stored in `.schemas/` (hidden folder at root) following the awesome-copilot pattern. This includes validation schemas for frontmatter, agents, plugins, skills, and other structured content. See [issue #1292](https://github.com/lightspeedwp/.github/issues/1292) for consolidation details.

**Documentation Standards note (Phase 3A):** Comprehensive standards for creating agents, skills, instructions, workflows, plugins, and other AI infrastructure are maintained in `docs/`. These 9 standards documents are the authoritative reference for all AI-driven work. See [AGENTS.md#documentation-standards](./AGENTS.md#documentation-standards) for the complete quick reference guide.

## What Not to Do

- Do not add WordPress plugin or theme project-specific code to `.github/`.
- Do not place reports or task trackers in `docs/` or the repo root.
- Do not create instruction files with a `references` frontmatter field.
- Do not move existing agents, instructions, or schemas without a migration issue that records source path, target path, and validation plan.
- Do not enqueue editor-only WordPress assets on the front end (and vice versa).
- Do not commit `node_modules/`, `build/`, or other generated artefacts.

## Related Files

**Organization-wide instructions** (reusable across all LightSpeedWP repos):

- [instructions/coding-standards.instructions.md](./instructions/coding-standards.instructions.md) — unified coding standards
- [instructions/a11y.instructions.md](./instructions/a11y.instructions.md) — WCAG 2.2 AA accessibility standards
- [instructions/documentation-formats.instructions.md](./instructions/documentation-formats.instructions.md) — Markdown, YAML, Mermaid standards
- [instructions/issues.instructions.md](./instructions/issues.instructions.md) — issue creation & labeling standards
- [instructions/pull-requests.instructions.md](./instructions/pull-requests.instructions.md) — PR creation & labeling standards
- [instructions/community-standards.instructions.md](./instructions/community-standards.instructions.md) — community health standards

**Repo-local instructions** (specific to this .github control plane):

- [.github/custom-instructions.md](./.github/custom-instructions.md) — Copilot-specific repo instructions
- [instructions/file-organisation.instructions.md](./instructions/file-organisation.instructions.md) — this repo's file placement rules
- [AGENTS.md](./AGENTS.md) — full global AI rules
- [instructions/plugin-structure.instructions.md](./instructions/plugin-structure.instructions.md) — WordPress block plugin structure

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

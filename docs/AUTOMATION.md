---
file_type: "documentation"
title: "Automation & Workflows"
description: "Strategy, governance, and workflow documentation for GitHub automation in LightSpeed repositories."
version: "v1.0.9"
last_updated: "2026-08-08"
owners: ["LightSpeedWP Team"]
tags: ["automation", "workflows", "governance", "agents"]
status: "active"
stability: "stable"
domain: governance
---

# Automation & Workflows

This document outlines LightSpeed's automation strategy, workflow governance, label management policies, and agent-driven deployment model.

---

## Table of Contents

1. [Automation Philosophy](#automation-philosophy)
2. [Branching & Workflow Strategy](#branching--workflow-strategy)
3. [Workflow Overview](#workflow-overview)
4. [Label & Issue Type Policy](#label--issue-type-policy)
5. [Workflow & Agent Governance](#workflow--agent-governance)
6. [Configuration Management](#configuration-management)
7. [References](#references)

---

## Automation Philosophy

- **Automate everything:** Releases, changelogs, labelling, project sync, and more—no manual steps or local scripts unless explicitly allowed.
- **Agent-driven:** Each automation workflow is paired with a corresponding agent that encapsulates all logic.
- **Configuration-first:** No hardcoded values; all label logic, rules, and type definitions live in canonical YAML configs.
- **Instruction-paired:** Every workflow and agent has a corresponding instruction file documenting purpose, usage, and best practices.
- **Keep a Changelog:** All changes must be traceable, user-facing, and formatted per Keep a Changelog 1.1.0 standard.
- **Semantic Versioning:** Release versioning is driven by PR labels and semantic version indicators.

---

## Branching & Workflow Strategy

LightSpeedWP follows a **develop → main** branching model:

### develop Branch

- Primary development branch
- All active development, features, and bug fixes
- All validation, CI, test, lint, label, and automation workflows run here
- Every PR and push targeting `develop` is fully validated before integration
- Workflows: Labelling, Testing, Linting, Planner, Reviewer, Project Sync

### main Branch

- Production-ready code only
- Reserved for releases and hotfixes
- Release workflow creates stacked PRs: first to develop, then to main
- Code is merged into `main` only for tagging and deploying a release
- Workflows: release.yml (tagging & publishing), post-release-sync.yml (auto sync back to develop)
- See [RELEASE_PROCESS.md](./RELEASE_PROCESS.md) for complete release flow details

### Hotfixes

If your project allows hotfixes directly to `main`, ensure validation workflows (CI/test/lint) also run on `main` for those rare PRs.

---

## Workflow Overview

| Workflow | Branch | Purpose | Agent |
| --- | --- | --- | --- |
| **labeling.yml** | develop | Unified labelling, status/priority, and type automation | labeling.agent.js |
| **changelog-validate.yml** | develop | Enforce changelog requirements and PR labelling standards | changelog validation |
| **metadata-governance.yml** | issues / pull_request_target | Apply assignee and relationship metadata; inherit milestones only when explicitly linked | issue-pr-metadata.cjs |
| **validate-footers** | validation step | Enforce branded footers on changed Markdown and catch missing footer drift | `scripts/validate-footers.js` |
| **planner.yml** | develop | Post merge-readiness checklists and exit criteria to PRs | planner.agent.js |
| **reviewer.yml** | develop | Automated PR review and quality feedback | reviewer.agent.js |
| **project-meta-sync.yml** | issues / pull_request | Sync project board fields from labels, title/body fallbacks, and kickoff metadata | derive-project-fields.cjs |
| **checklist-finalisation.yml** | issues.closed / pull_request_target.closed | Final checklist sync for completed issues and merged PRs | workflow backstop |
| **release.yml** | manual (`workflow_dispatch`) | Versioning, changelog generation, tagging, and release notes | release.agent.js |
| **reporting.yml** | develop | Generate metrics and activity reports | reporting.agent.js |
| **metrics.yml** | develop | Track and report organisation metrics | metrics.agent.js |

---

## Workflow Architecture & Helper Scripts (Phase 4)

**Status:** Phase 4 refactoring complete (2026-07-30)

GitHub Actions does not allow multiline shell control-flow (if/for/while) directly in `run:` blocks. Phase 4 refactored 9 workflows to extract this logic into 12 dedicated helper scripts using safe patterns (execFileSync, environment variables).

### Helper Scripts Overview

| Script | Type | Purpose |
|--------|------|---------|
| identify-changed-markdown.js | Node.js | Find changed Markdown files safely |
| collect-validation-results.js | Node.js | Aggregate validation outcomes |
| collect-link-targets.js | Node.js | Collect markdown files with URLs for link checking |
| check-mermaid-diagrams.sh | Bash | Detect Mermaid syntax in files |
| report-changelog-action.sh | Bash | Report changelog merge results |
| summarize-native-type.sh | Bash | Summarize native type sync |
| generate-doc-audit-report.js | Node.js | Generate documentation audit reports |
| handle-meta-agent-pr.js | Node.js | Manage meta-agent PR creation/merge |
| validate-reports-structure.js | Node.js | Validate report directory structure |
| validate-markdown-lint.js | Node.js | Lint markdown with exclusions (ES modules) |

**Security Improvements:**

- ✅ 9 command injection risks eliminated
- ✅ Changed from shell interpolation to execFileSync with argument arrays
- ✅ All configuration passed via environment variables

**Detailed Documentation:** See [WORKFLOW-REFACTORING-GUIDE.md](./WORKFLOW-REFACTORING-GUIDE.md) for complete Phase 4 implementation details, including:

- Root cause analysis of GitHub Actions shell control-flow constraints
- Safe patterns for extracting shell logic
- Test coverage (17 passing tests)
- Commit history and deployment status

---

## Label & Issue Type Policy

### Canonical Label Definitions

**Ownership:** Platform/Governance Team
**Location:** `.github/labels.yml`
**Full Documentation:** [Labelling Guide](./LABELING.md) — comprehensive reference for label families, usage, and automation

For complete label definitions, categories, naming conventions, and per-issue/PR labelling requirements, see [LABELING.md](./LABELING.md).

### Adding New Labels

**Requirements:**

1. **Justification:** Document why the label is needed
2. **Check existing labels:** Review [LABELING.md](./LABELING.md) to avoid duplicates
3. **Approval Process:** Require 2 governance team approvals before creation
4. **Update documentation:** Add to `.github/labels.yml` and update [LABELING.md](./LABELING.md)

**Approval Process:**

1. Create PR with label addition to `.github/labels.yml`
2. Document use case and justify against existing labels
3. Require approval from 2 governance team members
4. Update [LABELING.md](./LABELING.md) with label definition
5. Label takes effect on next label-sync workflow run

### Deprecating Labels

1. Add label to deprecation list with replacement (if any)
2. Add alias mapping old → new in `.github/labels.yml`
3. Run migration script to update existing issues/PRs
4. After 30-day grace period, remove deprecated label
5. Remove from [LABELING.md](./LABELING.md) and document in CHANGELOG

### Repository-Specific Labels

**Allowed:**

- Component-specific areas (e.g., `comp:custom-block`)
- Project-specific contexts (e.g., `project:migration-2024`)
- Temporary initiative labels (prefix: `temp:`)

**Not Allowed:**

- Alternative status/priority/type labels
- Labels conflicting with canonical naming

**Documentation:** Must be documented in repository README and linked from [LABELING.md](./LABELING.md).

### Label Enforcement

The labelling agent enforces canonical label usage:

- **Single-select:** Exactly one `status:*`, one `priority:*`, one `type:*` per issue/PR
- **Canonical mapping:** All labels must match definitions in `.github/labels.yml`
- **Automated standardisation:** Removes non-canonical labels and migrates legacy aliases
- **Detailed requirements:** See [LABELING.md](./LABELING.md) for per-issue and per-PR requirements

### Issue Type Policy

**Canonical definitions:** `.github/issue-types.yml`

Issue types are defined once in `.github/issue-types.yml` and used by both:

- **Issue templates:** Provide the canonical template selection and body guidance for the intended `type:*`
- **Labelling agent:** Auto-applies `type:*` labels based on issue type field and content heuristics

**Enforcement:** One type per issue (one-hot principle); issue type field mirrors `type:*` label for consistency.

### Metadata Governance

- Issues and PRs are assigned to the repository project automatically on create.
- New issues and PRs should receive an assignee and relationship metadata where relevant.
- Milestones are only applied when explicitly inherited from linked work or already present; the automation no longer invents a milestone per issue or PR.
- `Start date` and `Target date` remain empty until the item is explicitly marked `status:ready` or `status:in-progress`.
- Template enforcement must flag incomplete issues, apply `status:needs-more-info`, and keep the item open.

### Project Sync: GitHub App Configuration

The `project-meta-sync.yml` workflow syncs issue/PR metadata to the organisation Project board. It requires a GitHub App with the correct scopes and credentials configured.

**Setup (org admins only):**

1. **Create GitHub App**
   - Go to org settings → Developer settings → GitHub Apps
   - Create a new app (e.g., "LightSpeed Project Sync")
   - Required permissions:
     - `Contents: read` (to detect PR head branch for type inference)
     - `Issues: read & write` (to read/update issue labels and metadata)
     - `Pull Requests: read & write` (to read/update PR labels and metadata)
     - `Projects: read & write` (to sync fields to the project board — API still preview, verify scopes are available)
   - Disable webhooks (not needed)

2. **Install the App**
   - Only on the `.github` repository (or whichever repo owns the org project)
   - Grant access to this repo only

3. **Store Credentials**
   - Go to org settings → Secrets and variables → Actions
   - Create **repository secrets** (on the `.github` repo):
     - `LS_APP_PRIVATE_KEY`: PEM content from the GitHub App (Settings → Private keys → Generate)
   - Create **repository variables** (on the `.github` repo):
     - `LS_PROJECT_URL`: e.g., `https://github.com/orgs/lightspeedwp/projects/33
     - `LS_APP_ID`: numeric app ID from the GitHub App settings

4. **Verify**
   - Open any issue in a .github repository
   - The workflow should run and sync Status/Priority/Type/Effort to the board
   - If credentials are missing, the workflow now **fails loudly** with an error listing exactly which var/secret is missing

**Troubleshooting:**

If the workflow fails during preflight:

- Check that `LS_PROJECT_URL`, `LS_APP_ID`, and `LS_APP_PRIVATE_KEY` are set on the `.github` repo (not your local repo)
- Verify the GitHub App still has valid permissions
- Re-run the workflow after fixing credentials

**Intentional disable:**

To intentionally disable project sync (e.g., if you don't have a Project board set up):

- Leave `LS_PROJECT_URL` unset
- The workflow will skip silently with a notice (not an error)

---

## Workflow & Agent Governance

### Workflow Standards

All workflows must:

1. **Include skip condition:** Support `[skip workflow-name]` in commit messages
2. **Have concurrency control:** Prevent overlapping runs where appropriate
3. **Use semantic names:** Clear, descriptive names (e.g., `Labelling • Issues & PRs`)
4. **Set appropriate permissions:** Minimal required permissions only
5. **Include failure handling:** Appropriate `continue-on-error` or `if: failure()`
6. **Generate summaries:** Use `$GITHUB_STEP_SUMMARY` for output
7. **Follow UK English:** All text, comments, and documentation

### Workflow Approval

**Standard Workflows (require 2 Platform Team approvals):**

- Labelling and label sync workflows
- Security scanning and dependency management
- Release automation and versioning

**Repository-Specific Workflows (require Maintainer approval):**

- Build/test workflows
- Deployment workflows
- Custom automation

### Agent Development Standards

**File locations:**

- Agent specifications: `.github/agents/`
- Agent scripts: `.github/scripts/agents/`
- Agent utilities: `scripts/agents/includes/`
- Tests: `.github/scripts/agents/__tests__/` and `scripts/agents/includes/__tests__/`

**Requirements:**

1. **Modular Design:** Agents orchestrate; utilities implement logic
2. **Configuration-Driven:** No hardcoded values; use YAML configs
3. **Test Coverage:** Minimum 80% coverage for new utilities
4. **Error Handling:** Comprehensive error handling with retry logic
5. **Logging:** Use `@actions/core` or console for consistent logging
6. **Documentation:** JSDoc for all functions, README for agents

### Agent Deployment Process

1. Develop in feature branch
2. Add/update tests
3. Update documentation
4. Create PR with `type:automation` label
5. Require 2 governance team approvals
6. Test in sandbox repository (if available)
7. Deploy to production via merge

**Rollback Procedure:**

1. Revert PR if critical issues detected
2. Create hotfix for critical bugs
3. Document incident in post-mortem review

---

## Configuration Management

### Canonical Configuration Files

| File | Purpose | Owner | Approval Required |
| --- | --- | --- | --- |
| `.github/labels.yml` | Label definitions, colours, aliases | Governance Team | 2 approvals |
| `.github/labeler.yml` | File/branch-based label rules | Governance Team | 2 approvals |
| `.github/issue-types.yml` | Issue type definitions and mappings | Governance Team | 2 approvals |

### Configuration Validation

All configuration files are validated:

- **Pre-commit:** Local linting via Node scripts
- **Workflow:** `validate-labeling-configs.cjs` runs on all labelling PRs
- **Deployment:** Configuration is loaded and validated by agents at runtime

**Common validation checks:**

- YAML syntax correctness
- Required field presence
- Label uniqueness and naming conventions
- No conflicting category assignments

---

## References

- [Labelling Guide](./LABELING.md) — Complete labelling strategy and label families
- [Canonical Labels](../.github/labels.yml)
- [Labeler Rules](../.github/labeler.yml)
- [Issue Types Config](../.github/issue-types.yml)
- [Control-Plane Automation Instructions](../.github/instructions/automation.instructions.md)
- [Workflow Specifications](../.github/workflows/)
- [Agent Specifications](../.github/agents/)

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

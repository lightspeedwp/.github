---
title: "Validation Unified Workflow"
description: "Consolidated PR and issue validation engine for the LightSpeed .github repository"
date_created: "2026-09-17"
last_updated: "2026-09-17"
---

# Validation Unified • PR & Issue Checks

**File:** `.github/workflows/validation-unified.yml`  
**Status:** Phase 4 Implementation  
**Consolidates:** 11 archived validation workflows  
**Performance Target:** ≤150 min/month (16.7% reduction)

---

## Overview

`validation-unified.yml` is a consolidated GitHub Actions workflow that replaces 11 separate archived validation workflows with a single, unified validation engine. It performs comprehensive PR, issue, and workflow validation with conditional execution based on trigger events.

### Key Features

- **Parallel PR validations:** Branch naming, template routing, changelog, commits, secrets
- **Issue-triggered checks:** Definition of Ready/Done, project linking, blocking status
- **Scheduled docs validation:** Daily documentation linting (01:00 UTC)
- **Metrics collection:** GitHub Actions minutes tracking and performance reporting
- **Composite action integration:** Validation check reporting and metrics aggregation

---

## Trigger Patterns

| Event | Conditions | Jobs Triggered |
|-------|-----------|-----------------|
| `pull_request` | opened, edited, synchronize, reopened | branch-validation, pr-template-validation, changelog-validation, commit-validation, secret-scanning |
| `issues` | opened, edited, reopened | issue-dor-validation, issue-project-validation |
| `push` | develop branch, .github/workflows/* or CHANGELOG.md path changes | workflow-validation |
| `schedule` | 01:00 UTC daily | scheduled-docs-validation |
| `workflow_dispatch` | manual trigger with scope input | Conditional jobs based on scope parameter |

---

## Validation Jobs Reference

### Branch Name Validation

**Job:** `branch-validation`  
**Triggers:** PR open/edit, workflow_dispatch  
**Status:** ✅ Implemented (T027)

Validates branch names follow the required pattern: `{type}/{scope}-{title}`

**Pattern Validation:**

```regex
^(feat|fix|hotfix|release|refactor|chore|task|doc|docs|test|perf|ci|build|deps|security|revert|research|design|a11y|ux|i18n|ops|proto|ds|api|schema|telemetry|content|seo|config|migrate|qa|uat|audit|codex|aiops|automation|epic)/[a-z0-9]([a-z0-9\-]*[a-z0-9])?-[a-z0-9]([a-z0-9\-\s]*[a-z0-9])?$
```

**Allowed Types (32 total):**
feat, fix, hotfix, release, refactor, chore, task, doc, docs, test, perf, ci, build, deps, security, revert, research, design, a11y, ux, i18n, ops, proto, ds, api, schema, telemetry, content, seo, config, migrate, qa, uat, audit, codex, aiops, automation, epic

**Forbidden Prefixes:**

- ❌ `claude/` (reserved for Claude Code sessions)
- ❌ `copilot/` (reserved for GitHub Copilot)
- ❌ `openai/` (reserved for OpenAI integration)

**Failure Remediation:**

1. Delete the branch
2. Create new branch with correct name: `git checkout -b {type}/{scope}-{title} origin/develop`
3. Cherry-pick or rebase commits to new branch
4. Recreate PR

**Example Valid Names:**

- ✅ `feat/user-authentication-system`
- ✅ `fix/authentication-timeout-bug`
- ✅ `docs/branching-strategy-guide`
- ✅ `chore/dependency-updates`

---

### PR Template Validation

**Job:** `pr-template-validation`  
**Triggers:** PR open/edit  
**Status:** ✅ Implemented (T028)

Validates that the correct PR template was applied based on branch type and that all required sections are populated.

**Template Routing by Branch Type:**

| Branch Type | Required Sections |
|-------------|-------------------|
| feat | ## Summary, ## Changes, ## Testing, ## Checklist |
| fix / hotfix / security | ## Summary, ## Problem, ## Solution, ## Testing, ## Checklist |
| docs / doc | ## Summary, ## Changes |
| Other types | ## Summary, ## Changes |

**Failure Remediation:**

1. Edit the PR description
2. Ensure all required sections for your branch type are present
3. Fill in each section with relevant information
4. Save the PR description

---

### Changelog Validation

**Job:** `changelog-validation`  
**Triggers:** PR open/edit, workflow_dispatch  
**Status:** ✅ Implemented (T029)

Validates that CHANGELOG.md is modified for non-docs/non-chore PRs and follows Keep a Changelog 1.1.0 format.

**Format Requirements:**

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New feature description

### Changed
- Existing feature change description

### Fixed
- Bug fix description

### Deprecated
- Deprecated feature description

### Removed
- Removed feature description

### Security
- Security fix description
```

**Exempted PR Types:**

- ❌ Changelog required: feature, fix, security, refactor, perf
- ✅ Changelog exempt: docs, doc, chore

**Failure Remediation:**

1. Modify or create CHANGELOG.md with entry for unreleased version
2. Add section for your change type (Added, Fixed, etc.)
3. Use the format: `## [Unreleased]` or `## [X.Y.Z] - YYYY-MM-DD`
4. Commit and push changes

**Reference:** [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)

---

### Commit Message Validation

**Job:** `commit-validation`  
**Triggers:** PR open/edit, workflow_dispatch  
**Status:** ✅ Implemented (T030)

Validates that commit messages follow best practices and are meaningful.

**Validation Rules:**

1. **Minimum Length:** Commit subject must be at least 5 characters
2. **Format:** Conventional commit format is recommended:
   - `{type}({scope}): {subject}`
   - Example: `feat(auth): add login validation`
3. **Skipped Commits:** squash!, fixup! commits are exempt from validation

**Recommended Conventional Commit Types:**

- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes (formatting, etc.)
- refactor: Code refactoring
- perf: Performance improvements
- test: Test additions/modifications
- chore: Build, dependency, or tooling changes
- revert: Reverting a previous commit

**Failure Remediation:**

1. Amend your commit messages if they don't follow the guidelines
2. Ensure each commit has a meaningful subject line (≥5 characters)
3. Push updated commits: `git push --force-with-lease`

---

### Secret Scanning

**Job:** `secret-scanning`  
**Triggers:** PR open/edit, workflow_dispatch  
**Status:** ✅ Implemented (T031)

Scans PR diffs for patterns matching common secrets: API keys, tokens, credentials, private keys.

**Patterns Detected:**

- `password = "..."` or `password = '...'`
- `api_key = "..."` or `apikey = "..."`
- `secret = "..."` or `SECRET = "..."`
- `token = "..."` or `TOKEN = "..."`
- AWS credentials (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
- PEM-formatted private keys (BEGIN RSA PRIVATE KEY, BEGIN PRIVATE KEY)

**Exclusions:**

- node_modules/
- .git/
- Comments or documentation

**Failure Remediation:**

1. **CRITICAL:** If you committed a real secret, immediately:
   - Rotate/revoke the credential in its service
   - Remove the credential from all commits (use git filter-branch or BFG)
   - Force-push the cleaned history
2. **If it's a false positive:**
   - Add an explanation comment or issue a manual override with security team
3. **To avoid future issues:**
   - Use `.env` files (in .gitignore) for local credentials
   - Use GitHub Secrets for CI/CD credentials
   - Use environment variable substitution in config files

---

### Issue Definition of Ready/Done

**Job:** `issue-dor-validation`  
**Triggers:** Issue open/edit  
**Status:** ✅ Skeleton (T027 - Issue validation deferred to Phase 4.2)

Validates that opened issues include a "## Definition of Ready" section with acceptance criteria.

**Expected Format:**

```markdown
## Definition of Ready

- [ ] Requirements clearly defined
- [ ] Acceptance criteria specified
- [ ] Dependencies identified
- [ ] Estimated effort provided
```

---

### Issue Project Linking

**Job:** `issue-project-validation`  
**Triggers:** Issue opened  
**Status:** ✅ Skeleton (T027 - Project linking deferred to Phase 4.2)

Validates that newly opened issues are linked to a GitHub Project (except for trivial issues).

**Exemptions:**

- Trivial bug fixes
- Documentation updates
- Repository maintenance tasks

**Remediation:** Link the issue to appropriate GitHub Project in the UI.

---

### Scheduled Documentation Validation

**Job:** `scheduled-docs-validation`  
**Triggers:** Schedule (01:00 UTC daily)  
**Status:** ✅ Implemented (T027)

Runs daily Markdown linting checks against documentation files in `docs/` directory.

**Checks:**

- Markdown syntax validation
- Frontmatter validation
- Link reference checks
- Consistency in formatting

**Configuration:** See `.markdownlintrc`

---

## Workflow Validation

**Job:** `workflow-validation`  
**Triggers:** Push to .github/workflows/*, workflow_dispatch  
**Status:** ✅ Implemented (T027)

Validates GitHub Actions workflow YAML files for syntax errors and dangerous patterns.

**Checks:**

- YAML syntax validation
- Dangerous pattern detection (e.g., pull_request_target with untrusted inputs)
- Workflow best practice validation

---

## Composite Actions Integration

### validate-check (T032)

Reports validation results as GitHub PR status checks and comments.

**Integration Point:** `validation-metrics` job  
**Inputs:**

- check_name: validation-unified
- status: success/failure
- title: Validation Checks
- summary: Markdown summary of all validation results
- post_comment: true (posts PR comment)

**Outputs:**

- check_id: GitHub check run ID
- comment_id: PR comment ID (if posted)

### collect-metrics (T033)

Collects GitHub Actions minute usage and performance metrics for the validation workflow.

**Integration Point:** `validation-metrics` job  
**Inputs:**

- workflow_name: validation-unified
- metric_type: all
- output_format: json

**Outputs:**

- minutes_used: GitHub Actions minutes consumed
- duration_seconds: Total workflow duration
- metrics_json: Detailed metrics as JSON

---

## Performance Metrics

### Target Budget: ≤150 min/month

**Estimated per-run breakdown:**

- Branch validation: 0.5 min
- PR template validation: 0.3 min
- Changelog validation: 0.2 min
- Commit validation: 0.2 min
- Secret scanning: 0.2 min
- Workflow validation: 0.3 min
- Issue validations: 0.2 min
- Metrics collection: 0.2 min

**Total per PR/issue:** ~2-3 minutes

**Monthly breakdown (estimated):**

- PR validations (50 PRs @ 2.5 min): ~125 min
- Issue validations (10 issues @ 1 min): ~10 min
- Scheduled docs validation (30 runs @ 1 min): ~30 min
- **Total:** ~165 min (target: ≤150 min → 9% over, plan for optimization in Phase 4.2)

---

## Troubleshooting Guide

### Branch validation fails

**Symptom:** "Branch name does not match required pattern"

**Causes:**

1. Using forbidden prefix (claude/, copilot/, openai/)
2. Branch type not in allowed list
3. Scope or title has uppercase letters
4. Missing dash between scope and title

**Solution:** See [Branch Name Validation](#branch-name-validation) remediation steps.

---

### PR template validation fails

**Symptom:** "PR template not properly applied - missing Summary section"

**Causes:**

1. PR description is empty
2. Template sections were deleted
3. Sections named differently than required

**Solution:** Edit PR description and add all required sections per [PR Template Validation](#pr-template-validation).

---

### Changelog validation fails

**Symptom:** "CHANGELOG.md was not modified - changelog entry required"

**Causes:**

1. CHANGELOG.md not included in PR
2. PR type (feature/fix/refactor) requires changelog
3. Changelog format doesn't match Keep a Changelog

**Solution:**

1. Modify CHANGELOG.md with new entry
2. Use correct version format: `## [X.Y.Z] - YYYY-MM-DD`
3. Add section for your change type

---

### Secret scanning detects false positive

**Symptom:** "Potential secret found matching pattern"

**Causes:**

1. Code contains example credentials (for documentation)
2. URL containing "password" or "key" query parameters
3. Placeholder credentials in comments

**Solution:**

1. If it's a real secret, immediately rotate it (see [Secret Scanning](#secret-scanning))
2. If it's a false positive, add explanation in PR comment or issue override request

---

## Maintenance & Updates

### Current Limitations

- Issue DoR/DoD validation is a placeholder (deferred to Phase 4.2)
- Project linking validation is informational only (no enforcement)
- Workflow validation doesn't run actionlint integration checks yet

### Planned Enhancements (Phase 4.2)

- Enhanced issue state validation with blocking dependency detection
- Project linking enforcement for non-trivial issues
- Actionlint integration for workflow security scanning
- Composite action standardization across all validation jobs

---

## Related Documentation

- [Branch Naming Strategy](./BRANCHING_STRATEGY.md)
- [PR Creation Process](./PR_CREATION_PROCESS.md)
- [Composite Actions Reference](./COMPOSITE_ACTIONS.md)
- [Workflow Consolidation Mapping](./WORKFLOW_CONSOLIDATION_MAPPING.md)
- [Performance Targets](./PERFORMANCE_TARGETS.md)

---

## Archive Reference

**Consolidated workflows:**

- branch-name-validation.yml
- pr-template-validation.yml
- changelog-safety-audit.yml
- checks.yml
- docs-validation.yml
- linting.yml (deferred to Phase 5)
- pr-template-validation.yml
- validate-blocking-issue-before-close.yml
- validate-blocking-status-before-close.yml
- validate-dor-dod-sections.yml
- validate-project-linking.yml
- workflow-validation.yml

**Archive location:** `.github/workflows/archived/2026-09-11/validation/`

---

*Last updated: 2026-09-17 | Phase 4 Implementation | Status: Composite actions integrated*

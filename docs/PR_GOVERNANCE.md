# PR Governance Automation

**Status**: Specification & Reference (Not enforced in CodeRabbit v2 schema; external guidance for maintainers and CI automation)

**Last Updated**: 2026-09-17

---

## Overview

This document defines the PR governance automation rules that should be applied organization-wide to all PRs. These rules ensure consistent quality standards, governance compliance, and Definition of Done (DoD) tracking across all repositories.

**IMPORTANT**: These rules are documented here for reference and may be implemented via:

1. GitHub Actions workflows (validation automation)
2. Custom CI/CD checks (enforcement)
3. Manual review guidelines (human review)
4. Future CodeRabbit schema versions (if native support is added)

Currently, **CodeRabbit v2 schema does NOT support `pr_governance` as a top-level key**, so these rules are maintained as external documentation and reference material for governance implementation.

---

## Governance Components

### 1. PR Template Validation (FR-016, SC-014)

Validates PR descriptions against branch-type-specific templates. Required sections vary by branch type.

#### Branch Type: `feat/` (Features)

**Required Sections**:

- **Linked Issues** (required): Must reference at least one issue with pattern `^(Closes|Fixes|Relates to) #\d+`
- **Description** (required): Clear, non-placeholder description (≥50 characters); rejects TODO, FIXME, placeholder
- **Changes Made** (required): At least 2 distinct changes documented
- **Changelog Entry** (required): Changelog entry per `.github/CHANGELOG.md` format `^- \[\w+\]`
- **Acceptance Criteria** (required): At least 2 measurable acceptance criteria

#### Branch Type: `design/` (Design Changes)

**Required Sections**:

- **Design Brief** (required): Clear design problem statement (≥50 characters)
- **Changes Made** (required): Visual or UX changes documented (≥1 item)
- **Linked Issues** (required): Design issue reference `^(Closes|Fixes|Relates to) #\d+`
- **Acceptance Criteria** (required): Design acceptance criteria covering visual, UX, and accessibility (≥2 items)

#### Branch Type: `ds/` (Design System)

**Required Sections**:

- **Component Description** (required): Component purpose and usage (≥50 characters)
- **API/Props Documentation** (required): Interface or props documentation with pattern `^(Props|API|Interface)`
- **Changes Made** (required): Component changes listed (≥1 item)
- **Linked Issues** (required): Design system issue reference `^(Closes|Fixes|Relates to) #\d+`

#### Branch Type: `api/` (API Changes)

**Required Sections**:

- **API Changes** (required): API modifications clearly listed with pattern `^(Endpoint|Method|Parameter)`
- **Backward Compatibility** (required): Compatibility assessment (Breaking/Non-breaking/Deprecated) with pattern `^(Breaking|Non-breaking|Deprecated)`
- **Linked Issues** (required): API issue reference `^(Closes|Fixes|Relates to) #\d+`
- **Changelog Entry** (required): API changelog entry with pattern `^- \[API\]`

#### Branch Type: `fix/` (Bug Fixes)

**Required Sections**:

- **Linked Issues** (required): Must close at least one issue with pattern `^(Closes|Fixes) #\d+`
- **Reproduction Steps** (required): Steps to reproduce the bug (≥2 steps)
- **Solution Description** (required): Clear explanation of the fix (≥50 characters)
- **Changelog Entry** (required): Changelog entry per `.github/CHANGELOG.md` format `^- \[BUG FIX\]`

#### Branch Type: `hotfix/` (Urgent Production Fixes)

**Required Sections**:

- **Linked Issues** (required): Must close critical issue with pattern `^(Closes|Fixes) #\d+`
- **Issue Impact** (required): Severity/impact assessment with pattern `^(Critical|High Impact)`
- **Solution Description** (required): Urgent fix explanation (≥50 characters)
- **Changelog Entry** (required): Hotfix changelog entry with pattern `^- \[HOTFIX\]`

#### Branch Type: `docs/` (Documentation)

**Required Sections**:

- **Documentation Changes** (required): What documentation was changed (≥1 item)
- **Linked Issues** (optional): Issue reference with pattern `^(Closes|Relates to) #\d+`

#### Branch Type: `test/` (Tests)

**Required Sections**:

- **Test Coverage** (required): What test coverage was added/improved (≥50 characters)
- **Test Scenarios** (required): Test scenarios documented (≥2)

#### Branch Type: `refactor/` (Code Refactoring)

**Required Sections**:

- **Refactoring Scope** (required): What is being refactored and why (≥50 characters)
- **Risk Assessment** (required): Refactoring risk level with pattern `^(Low|Medium|High) risk`
- **Linked Issues** (optional): Issue reference with pattern `^(Relates to) #\d+`

#### Default (All Other Branch Types)

**Required Sections**:

- **Linked Issues** (optional): Issue reference with pattern `^(Closes|Fixes|Relates to) #\d+`
- **Description** (required): Brief change description (≥30 characters)

#### Validation Rules

- **Check placeholder text**: Flag sections with "TODO", "FIXME", "placeholder", "TBD", "[WIP]", "[DRAFT]"
- **Check empty sections**: Flag empty or whitespace-only sections
- **Check linked issues**: Require at least one linked GitHub issue (where required per branch type)
- **Check changelog**: Require changelog entry for user-facing changes
- **Severity**: Violations report as warnings (not blocking)

---

### 2. Label Enforcement (FR-017, SC-015)

Validates that applied labels follow canonical prefixes from `.github/labels.yml` (158 canonical labels across 6 families). Labels are suggested based on branch type and changed files.

#### Canonical Label Families

| Family | Prefix | Required | Purpose | Examples |
|--------|--------|----------|---------|----------|
| `type` | `type:` | ✅ Yes | Change type | bug, feature, task, documentation, security, test, refactor, performance, a11y |
| `status` | `status:` | ✅ Yes | Current status | needs-triage, in-progress, done, blocked, on-hold |
| `priority` | `priority:` | ❌ No | Priority level | critical, high, normal, low |
| `area` | `area:` | ❌ No | Affected area/subsystem | ci, docs, security, testing, automation, accessibility |
| `meta` | `meta:` | ❌ No | Metadata labels (process flags) | needs-changelog, has-pr, duplicate, wontfix, blocked |
| `language` | `language:` | ❌ No | Primary language | php, javascript, typescript, python, bash, yaml |

#### Branch-Type to Label Mappings

| Branch Type | Type Label | Status Label | Priority | Area (auto) | Language (auto) |
|-------------|-----------|--------------|----------|-------------|-----------------|
| `feat/` | `type:feature` | `status:in-progress` | `priority:normal` | ✅ | ✅ |
| `fix/` | `type:bug` | `status:in-progress` | `priority:normal` | ✅ | ✅ |
| `hotfix/` | `type:bug` | `status:in-progress` | `priority:critical` | ✅ | ✅ |
| `security/` | `type:security` | `status:in-progress` | `priority:critical` | ✅ | ✅ |
| `docs/` | `type:documentation` | `status:in-progress` | — | `area:docs` | — |
| `test/` | `type:test` | `status:in-progress` | — | ✅ | — |
| `perf/` | `type:performance` | `status:in-progress` | `priority:high` | ✅ | — |
| `a11y/` | `type:a11y` | `status:in-progress` | `priority:high` | `area:accessibility` | — |
| `refactor/` | `type:refactor` | `status:in-progress` | — | ✅ | — |
| `ci/` | `type:ci` | `status:in-progress` | — | `area:ci` | — |
| `chore/` | `type:chore` | `status:done` | `priority:low` | — | — |

#### File-to-Area Auto-Detection

```yaml
.github/workflows/**:    area:ci
.github/scripts/**:      area:ci
docs/**:                 area:docs
test/**:                 area:testing
**/*.test.*:             area:testing
**/*.spec.*:             area:testing
security/**:             area:security
a11y/**:                 area:accessibility
**/*.md:                 area:docs
CHANGELOG*:              area:docs
```

#### File-to-Language Auto-Detection

```yaml
**/*.php:        language:php
**/*.js:         language:javascript
**/*.ts:         language:typescript
**/*.tsx:        language:typescript
**/*.py:         language:python
**/*.sh:         language:bash
**/*.yml:        language:yaml
**/*.yaml:       language:yaml
Dockerfile*:     language:docker
docker-compose.yml:  language:docker
```

#### Label Validation Rules

- **Check canonical prefixes**: Verify labels use canonical family prefixes (e.g., `type:bug` not bare `bug`)
- **Check required families**: Require `type:` AND `status:` on every PR
- **Suggest missing**: Suggest labels based on branch type and changed files
- **Auto-apply**: Do NOT auto-apply; only suggest to maintainer for approval
- **Severity**: Violations report as warnings (not blocking)

---

### 3. Definition of Done (DoD) Automation (FR-018, SC-016)

Standardized DoD checklists per change scope (feature, bugfix, refactor, documentation, security, a11y, performance, testing). Checklists are auto-detected based on branch type, labels, and changed files.

#### Scope Detection Rules (Priority Order)

1. **Security**: `type:security` label OR `branch:security/*` → `security` scope
2. **Hotfix**: `branch:hotfix/*` → `hotfix` scope
3. **Documentation**: `type:documentation` label OR `branch:docs/*` OR files matching `^docs/.*\.md` → `documentation` scope
4. **Accessibility**: `type:a11y` label OR `branch:a11y/*` OR files matching `a11y|accessibility` → `a11y` scope
5. **Performance**: `type:performance` label OR `branch:perf/*` → `performance` scope
6. **Testing**: `type:test` label OR `branch:test/*` → `testing` scope
7. **Refactoring**: `type:refactor` label OR `branch:refactor/*` → `refactor` scope
8. **Bug Fix**: `type:bug` label OR `branch:fix/*` → `bugfix` scope
9. **Feature**: `type:feature` label OR `branch:feat/*` → `feature` scope
10. **Default**: All other cases → `default` scope

#### DoD Checklist Templates

##### Feature

```
Definition of Done: Feature

Checklist for new feature development:
- Code is complete and follows coding standards
- Unit tests written and passing (≥80% coverage)
- Integration tests added (if applicable)
- PR description includes Linked Issues and Changes Made sections
- Changelog entry added per .github/CHANGELOG.md format
- Documentation updated or created (if user-facing)
- Accessibility reviewed per WCAG 2.2 AA standards
- No breaking changes OR breaking changes clearly documented
- Code review approved (at least 1 reviewer)
```

##### Bug Fix

```
Definition of Done: Bug Fix

Checklist for bug fixes:
- Root cause documented in PR description
- Fix verified against original reproduction steps
- Tests added (regression + fix verification)
- Existing tests still passing
- Changelog entry added
- Linked to issue (Closes/Fixes #)
- No new warnings or regressions introduced
- Code review approved (at least 1 reviewer)
```

##### Refactor

```
Definition of Done: Refactor

Checklist for code refactoring:
- Refactoring scope clearly defined in PR
- All existing tests pass (no changes to test logic)
- Risk assessment completed (Low/Medium/High)
- Breaking changes documented (if any)
- Performance impact assessed (if applicable)
- Linked to issue
- Code review approved
- No new warnings or technical debt introduced
```

##### Documentation

```
Definition of Done: Documentation

Checklist for documentation updates:
- Content is accurate and complete
- Links are valid (internal and external)
- Code examples run and produce expected output
- Spelling and grammar checked
- Markdown lints successfully (npm run lint:md)
- Frontmatter is valid YAML
- No placeholder or TODO content
- Updated TOCs or indexes (if applicable)
```

##### Security Fix

```
Definition of Done: Security Fix

Checklist for security vulnerabilities:
- Vulnerability verified and root cause identified
- Fix tested and verified to resolve vulnerability
- No regression in security posture or protections
- Security review completed (security team approval)
- Changelog marked [SECURITY]
- PR marked priority:critical
- All related test cases pass
- No new security warnings introduced
```

##### Accessibility (a11y)

```
Definition of Done: Accessibility

Checklist for accessibility improvements:
- Changes comply with WCAG 2.2 AA standards
- Keyboard navigation tested and working
- Screen reader compatibility verified
- Color contrast meets AA standards
- Focus indicators are visible
- Alt text added for all images
- Semantic HTML used
- Tests added for accessibility features
```

##### Performance

```
Definition of Done: Performance

Checklist for performance improvements:
- Performance metrics measured (before/after)
- Improvement meets stated goal
- No regression in other metrics
- Load testing completed (if applicable)
- Memory/resource usage assessed
- Cacheing strategy documented (if applicable)
- Tests added for performance regressions
```

##### Testing

```
Definition of Done: Testing

Checklist for test infrastructure/additions:
- Test coverage increased (target ≥80%)
- All tests passing (unit, integration, e2e)
- Edge cases covered
- Error paths tested
- Mocks/fixtures documented
- CI/CD integration verified
- No flaky tests introduced
```

##### Default

```
Definition of Done

Standard checklist for all PRs:
- Code is complete and functional
- Tests pass (local + CI)
- PR description is clear and complete
- Linked to relevant issue(s)
- Code review approved
- No merge conflicts
```

#### DoD Automation Rules

- **Auto-detect scope**: Auto-detect from branch type + labels + changed files
- **Auto-populate**: Insert DoD checklist from template automatically
- **Block merge on unchecked**: Do NOT block merge; checklists are informational
- **Severity**: Info-level (not blocking)
- **Placement**: Append to end of PR description
- **Refresh on push**: Do NOT refresh; keep user's manual checks

---

### 4. Documentation Validation (FR-019, SC-017)

Handles documentation linting failures gracefully with explicit rules for skip paths, fail vs. warn decisions, and actionable remediation commentary.

#### Linting Rules Enabled

- ✅ **Markdown Lint**: Markdown formatting (markdownlint/remark)
- ✅ **Spelling Check**: Spell checking (cspell/aspell)
- ✅ **Link Validation**: Broken links (markdown-link-check)
- ✅ **Frontmatter Validation**: YAML frontmatter syntax
- ✅ **Code Block Validation**: Syntax highlighting + fenced code blocks

#### Skip Paths (Don't Lint These)

```
**/*.md.bak
**/*.temp.md
**/drafts/**
**/archived/**
**/generated/**
docs/generated/**
.github/tmp/**              # Temporary work files
.github/specs/**            # Specification files (reviewed separately)
node_modules/**
.git/**
**/node_modules/**
```

#### Failure Handling Rules

| Error Type | Severity | Actionable | Suggestion |
|-----------|----------|-----------|-----------|
| **Markdown Syntax** | warn | ✅ Yes | Fix heading levels, list indentation, code block syntax, link formats |
| **Spelling Errors** | info | ❌ No | UK English conventions (organisation, optimise, colour), technical terms, consistency |
| **Broken Links** | warn | ✅ Yes | Verify file paths, test external URLs, update anchors |
| **Missing Alt Text** | info | ✅ Yes | Add alt text to all images: `![alt text](path/to/image.png)` |
| **Frontmatter Errors** | warn | ✅ Yes | Check quotes, indentation (2 spaces), schema validation |
| **Code Block Errors** | info | ❌ No | Include language hint, ensure completeness, test snippets locally |

#### Path-Specific Rules

| Path | Link Validation | Markdown Syntax | Spelling |
|------|-----------------|-----------------|----------|
| `.github/docs/**` | error | warn | warn |
| `docs/**` | error | warn | info |
| `CODERABBIT_COVERAGE_AUDIT.md` | error | error | — |
| `.github/specs/**` | warn | warn | — |
| `.github/README.md` | error | — | warn |

#### Remediation Strategy

- **Include in review**: Include docs validation in code review comments
- **Suggest fixes**: Provide actionable fix suggestions
- **Link to guides**: Link to documentation standards guide
- **Show examples**: Include correct formatting examples
- **Fail fast**: Collect all errors first; don't fail immediately
- **Max errors per type**: Cap at 5 per type (prevent overwhelming output)

---

## Implementation Guidance

### How to Use This Document

1. **For GitHub Actions Workflows**: Reference this document when building PR validation workflows
2. **For Code Review**: Use templates and checklists as review guidelines
3. **For Maintainers**: Apply governance rules during triage and PR review
4. **For CI/CD Integration**: Implement automated checks based on rules and severity levels
5. **For Future CodeRabbit Support**: If CodeRabbit v2 schema adds `pr_governance` support, these rules are ready to migrate

### Severity Levels

- **error**: Blocks merge; must be resolved before PR can be merged
- **warn**: Does not block; recommend resolution before merge
- **info**: Informational only; no action required

### Constitution Alignment

These governance rules align with LightSpeed .github Constitution principles:

- **Principle VIII**: Branch Strategy Compliance & Automated Enforcement — Rules enforce canonical branch naming and type-based routing
- **Principle V**: Branch Naming Strategy Non-Negotiable — Label enforcement and DoD automation respect the 38 authorized branch types
- **Principle II**: Curated Assets with Locked Governance — Rules validate but never modify LOCKED files (`.github/labels.yml`, `.github/issue-types.yml`, PR templates)

---

## References

- **Specification**: `.github/specs/002-coderabbit-config-improvements/spec.md`
- **Labels**: `.github/labels.yml` (158 canonical labels)
- **Branching Strategy**: `docs/BRANCHING_STRATEGY.md`
- **PR Creation Process**: `docs/PR_CREATION_PROCESS.md`
- **Coding Standards**: `instructions/coding-standards.instructions.md`
- **Label Strategy**: `docs/LABEL_STRATEGY.md`
- **Labeling Guide**: `docs/LABELING.md`

---

**Last Updated**: 2026-09-17

**Maintainer**: @ashley

**License**: Same as repository (see LICENSE file)

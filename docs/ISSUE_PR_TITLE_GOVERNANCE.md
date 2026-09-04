---
title: Issue & PR Title Governance
description: Standards for consistent, clear issue and pull request titles across the organization
document_type: Specification
created_date: 2026-09-04
last_updated: 2026-09-04
authors:
  - LightSpeed Team
maintainer: LightSpeed Team
domain: governance
stability: stable
file_type: documentation
---

# Issue & PR Title Governance

Consistent, descriptive issue and PR titles improve searchability, automation, triage, and developer experience. This guide establishes standards for title formatting across the organisation.

---

## 1. Title Format

### 1.1 Issue Title Format

```
{type}: {scope} - {short-description}
```

or (when scope is obvious or single-word):

```
{type}: {short-description}
```

**Components:**

| Component | Format | Example | Notes |
|-----------|--------|---------|-------|
| **type** | Issue type label (lowercase) | `feat`, `fix`, `docs`, `refactor` | Mirrors the branch prefix; see [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) |
| **scope** | Active project name, epic name, or area (kebab-case) | `issue-pr-template-improvements`, `label-coverage-audit`, `performance-optimization` | Helps readers understand the larger initiative; optional if obvious |
| **short-description** | Concise summary of the work (sentence case, under 60 chars) | `Update branch naming strategy`, `Add Playwright testing framework`, `Fix authentication timeout` | Focus on **what** and **why**, not **how** |

### 1.2 PR Title Format

```
{type}: {scope} - {short-description}
```

or (simple, scoped fixes):

```
{type}: {short-description}
```

**Same as issues**, but scope should match the linked issue. If a PR closes an issue, the PR title should align with the issue title scope.

---

## 2. Examples

### ✅ Good Examples

**Issues:**

- `feat: issue-pr-template-improvements - Align branch prefixes across issue and PR templates`
- `fix: authentication - Handle expired token timeout gracefully`
- `docs: branching-strategy - Update section 5 with automation mappings`
- `perf: search - Optimize full-text search index queries`
- `refactor: API response structure` (no scope needed; API is obvious context)
- `a11y: form validation - Improve error message announcements for screen readers`
- `chore: dependency updates - Upgrade npm packages to latest minor versions`

**PRs:**

- `feat: issue-pr-template-improvements - Consolidate story/help issue templates into feature/question`
- `fix: authentication - Timeout handling for expired tokens`
- `docs: branching-strategy - Document section 5 automation mappings`
- `test: unit-tests - Add jest test suite for authentication module`
- `ci: github-actions - Update Node version in build workflow`

### ❌ Poor Examples (Anti-Patterns)

| Example | Issue | Fix |
|---------|-------|-----|
| `type:enhancement: Prompt Discovery & Search` | Type in title + vague scope | `feat: discovery-engine - Implement full-text search and recommendation engine` |
| `refactor: Reorganize Phase 2B benchmarking documentation to active project folder` | Too verbose; "to active project folder" is noise | `refactor: phase-2b - Move benchmarking docs to active project folder` |
| `IMPORTANT: Fix critical bug in checkout` | All-caps tag (use priority labels instead) | `fix: checkout - Resolve cart abandonment on payment fail` |
| `WIP: Add new feature` | Status in title (use labels instead) | `feat: new-feature - Add user preference panel` |
| `Add telemetry instrumentation for release validation and metrics orchestration` | Missing type and scope | `feat: release-validation - Add telemetry instrumentation for metrics` |
| `Complete Issue #1786` | References issue by number alone | `docs: label-audit - Complete label coverage audit skill` |

---

## 3. Scope Guidance

### When to Use Scope

**Always include scope when:**

- The PR/issue is part of a larger initiative (active project, epic, phase)
- The work is tied to a specific area or subsystem
- Multiple related PRs/issues exist and need grouping

**Examples:**

- `phase-2c-validation` — Part of larger multi-phase work
- `label-coverage-audit` — Tied to an active project
- `search-performance` — Domain-specific work
- `github-actions` — System/subsystem

### When Scope is Optional

**Omit scope if:**

- The issue/PR is small, standalone, and the type makes context clear
- The title would become unnecessarily long

**Examples:**

- `fix: Password reset email not sending` (obvious, no scope needed)
- `docs: Update README with installation steps` (README is enough context)
- `chore: Dependency updates` (generic maintenance)

### Scope Naming Conventions

**Use:**

- Kebab-case (lowercase, hyphens): `issue-pr-template-improvements`
- Active project names: `label-coverage-audit`, `openspec-component-review`
- Short area/subsystem names: `authentication`, `checkout`, `search`
- Phase/epic names if applicable: `phase-2b`, `phase-2c-validation`

**Avoid:**

- Spaces or underscores: ❌ `issue_pr_template_improvements`
- Excessive length: ❌ `issue-and-pull-request-template-improvements-2026`
- Acronyms without context: ❌ `IPTMI` (spell it out)

---

## 4. Short Description Rules

The short description (after `{type}: {scope} -`) should:

1. **Be action-oriented** — Start with a verb (Add, Update, Fix, Improve, Refactor, etc.)
   - ✅ `Add playwright testing framework`
   - ❌ `Playwright testing framework added`

2. **Be concise** — Aim for under 60 characters (after type and scope)
   - ✅ `Fix timeout handling for expired tokens`
   - ❌ `Implement comprehensive authentication timeout handling for tokens that have expired and gracefully handle edge cases`

3. **Focus on intent** — Answer "what problem does this solve?" or "what capability does this add?"
   - ✅ `Enable full-text search with ranking`
   - ❌ `Refactor search algorithm using new indexing approach`

4. **Use standard language** — Avoid jargon unless it's domain-specific
   - ✅ `Improve error messages for screen readers` (accessible language)
   - ❌ `Enhance a11y telemetry for A11Y UX interactions` (jargon-heavy)

5. **Avoid redundancy** — Don't repeat the type or scope
   - ✅ `Optimize database queries`
   - ❌ `Refactor: Refactor the authentication module to improve performance`
   - ❌ `docs: documentation - Update documentation for authentication` (scope + description are same)

---

## 5. Type Conventions

Always use the **short type label** from [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md), not the full label name:

| Type Label | Short Form (Use This) | Long Form (Don't Use) |
|------------|----------------------|----------------------|
| type:feature | `feat` | `feature`, `type:feature` |
| type:bug | `fix` | `bug`, `type:bug`, `bugfix` |
| type:documentation | `docs` | `documentation`, `doc`, `type:documentation` |
| type:test | `test` | `type:test`, `testing` |
| type:refactor | `refactor` | `type:refactor`, `refactoring` |
| type:chore | `chore` | `type:chore`, `maintenance` |
| type:ci | `ci` | `type:ci`, `cicd`, `ci-cd` |
| type:a11y | `a11y` | `accessibility`, `a11y:accessibility` |
| type:performance | `perf` | `type:performance`, `performance` |
| type:security | `security` | `type:security` |
| type:design | `design` | `type:design` |
| type:audit | `audit` | `type:audit` |
| type:ai-ops | `aiops` | `type:ai-ops`, `ai-ops`, `ai` |

---

## 6. Special Cases

### Linked Issues

When a PR directly addresses an issue, include the issue number in the PR body (not the title):

**PR Body:**

```
Closes #1234
```

or (if related but not closing):

```
Relates to #1234
```

**Don't put the issue reference in the PR title:**

- ❌ `docs: Complete Issue #1786 - Label Coverage Audit Skill`
- ✅ `docs: label-audit - Complete label coverage audit skill` + body: `Closes #1786`

### Multi-Part Work

If a PR is one of several related PRs, use consistent scope naming across all of them:

**Good (consistent scoping):**

- `feat: phase-2b-optimization - Add caching layer`
- `feat: phase-2b-optimization - Optimize database queries`
- `test: phase-2b-optimization - Add performance benchmarks`

**Avoid (inconsistent):**

- `feat: phase-2b - Add caching layer`
- `feat: optimization - Optimize database queries` (different scope)
- `test: phase 2b - Add benchmarks` (spacing, caps inconsistent)

### Breaking Changes

If a PR introduces a breaking change, mention it in the PR body and labels, not the title:

**PR title:**

```
refactor: api-versioning - Consolidate endpoint responses
```

**PR body:**

```
⚠️ **Breaking Change**: The `/api/users` endpoint now returns `user_id` instead of `id`.
Migration guide: [docs/migration-guide.md](...)
```

---

## 7. Title Automation & Validation

### GitHub Automation

- **PR title validation** — Enforce title format via `.github/workflows/validate-pr-title.yml`
- **Commit message linting** — Husky + commit-lint ensures squash commits follow title format
- **Changelog generation** — Release workflows parse PR titles to generate changelogs

### Linting Rules

PR titles are validated against:

```
^(feat|fix|hotfix|docs?|refactor|chore|test|perf|ci|build|deps|security|design|a11y|audit|aiops|automation|research|release)(/[a-z0-9]+(?:-[a-z0-9]+)*)?:\s.+$
```

**Examples of valid titles:**

- `feat: Issue-specific example` ✅
- `fix: auth - Handle timeout` ✅
- `docs: branching-strategy - Update section 5` ✅
- `perf: search-index - Optimize queries` ✅

**Examples of invalid titles:**

- `FEAT: Issue description` ❌ (uppercase type)
- `feature: Issue description` ❌ (long form instead of short)
- `feat Issue description` ❌ (missing colon)
- `fix/bug: Issue description` ❌ (invalid characters in type)

---

## 8. Checklist: Before Submitting a PR

- [ ] **Type is correct** — Matches the branch prefix and issue type
- [ ] **Scope is clear** — Identifies the initiative, area, or subsystem (if needed)
- [ ] **Description is action-oriented** — Starts with a verb (Add, Update, Fix, etc.)
- [ ] **Description is concise** — Under 60 characters after type and scope
- [ ] **No redundancy** — Description doesn't repeat type or scope
- [ ] **Issue is linked** — Body includes `Closes #123` or `Relates to #456`
- [ ] **No caps or special chars** — All lowercase type, kebab-case scope
- [ ] **No noise words** — Omit "WIP", "URGENT", "IMPORTANT", "TODO" (use labels instead)

---

## 9. References

- [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) — Branch naming and type mapping
- [ISSUE_LABELS.md](./ISSUE_LABELS.md) — Label taxonomy and usage
- [PR_LABELS.md](./PR_LABELS.md) — PR label automation
- [CONTRIBUTING.md](../CONTRIBUTING.md) — Contribution guidelines

---

## 10. FAQ

**Q: Should I capitalize the scope?**  
A: No, use lowercase kebab-case: `phase-2b-optimization`, not `Phase-2B-Optimization`.

**Q: What if the scope is really long?**  
A: Shorten it or omit it if the type makes context clear. Keep the full project name in the linked issue.

**Q: Can I use multiple scopes?**  
A: No, keep it to one. If the PR touches multiple areas, that's often a sign to split it into smaller PRs.

**Q: What if the PR is a work-in-progress (WIP)?**  
A: Don't put "WIP" in the title. Instead, mark the PR as a **Draft** in GitHub, and update it when ready for review.

**Q: Do I need a scope for every PR?**  
A: No, scope is optional for small, standalone work. But for any PR that's part of a larger initiative, include it for clarity.

---

> For questions or improvements, open an issue or PR in the `.github` repo.

---
title: "Label Examples & Scenarios"
description: "Real-world examples of canonical label combinations for different issue and PR types."
file_type: "documentation"
version: 'v1.0.0'
last_updated: '2026-08-06'
author: "LightSpeed Team"
maintainer: "LightSpeed Team"
owners: ["lightspeedwp"]
tags: ["labels", "examples", "scenarios", "validation"]
---

# Label Examples & Scenarios

Real-world label combinations for common issue and PR scenarios. Copy these as templates for your work.

---

## Issues

### Bug Report

**Scenario:** User reports that the theme customizer crashes when changing colors.

```
type:bug
status:needs-triage
priority:critical
area:theme-json
comp:theme-json
meta:needs-changelog
```

**Why these labels:**

- `type:bug` — It's a defect/crash
- `status:needs-triage` — New report, not reviewed yet
- `priority:critical` — Crashes are production-blocking
- `area:theme-json` — Narrowly scoped area
- `comp:theme-json` — Product component affected
- `meta:needs-changelog` — User-facing defect needs changelog entry

---

### Feature Request

**Scenario:** Team wants to add support for custom CSS variables in theme JSON.

```
type:feature
status:ready
priority:important
area:theme-json
comp:theme-json
```

**Why these labels:**

- `type:feature` — New functionality
- `status:ready` — Requirements are clear
- `priority:important` — Team wants to prioritize it
- `area:theme-json` — Domain area
- `comp:theme-json` — Component affected

---

### Performance Improvement

**Scenario:** Optimize block editor rendering for large posts (100+ blocks).

```
type:performance
status:ready
priority:normal
area:performance
comp:block-editor
meta:needs-changelog
```

**Why these labels:**

- `type:performance` — Performance optimization
- `status:ready` — Scope is defined
- `priority:normal` — Nice improvement but not critical
- `area:performance` — Performance domain
- `comp:block-editor` — Component affected
- `meta:needs-changelog` — User-facing improvement

---

### Documentation Update

**Scenario:** Write guide on using theme JSON with custom breakpoints.

```
type:documentation
status:ready
priority:normal
area:documentation
lang:md
```

**Why these labels:**

- `type:documentation` — Docs content
- `status:ready` — Can be worked on immediately
- `priority:normal` — Standard documentation task
- `area:documentation` — Documentation domain
- `lang:md` — Written in Markdown (context for automation)

---

### Accessibility Issue

**Scenario:** Color contrast in button labels fails WCAG AA in dark mode.

```
type:a11y
status:needs-triage
priority:critical
area:a11y
comp:block-editor
meta:needs-changelog
```

**Why these labels:**

- `type:a11y` — Accessibility work
- `status:needs-triage` — New report
- `priority:critical` — WCAG compliance is mandatory
- `area:a11y` — Accessibility domain
- `comp:block-editor` — Component with the issue
- `meta:needs-changelog` — Compliance fix is user-facing

---

### Refactoring Task

**Scenario:** Consolidate 3 label-related utility files into one module for maintainability.

```
type:refactor
status:ready
priority:normal
area:quality
lang:js
```

**Why these labels:**

- `type:refactor` — Code quality improvement (no behavior change)
- `status:ready` — Clear scope
- `priority:normal` — Not urgent
- `area:quality` — Code quality domain
- `lang:js` — JavaScript files being refactored

---

### Testing Task

**Scenario:** Add unit tests for the new label validation script.

```
type:test
status:ready
priority:normal
area:quality
lang:js
meta:needs-changelog
```

**Why these labels:**

- `type:test` — Test suite work
- `status:ready` — Scope is clear
- `priority:normal` — Standard testing work
- `area:quality` — Quality domain
- `lang:js` — Tests written in JavaScript
- `meta:needs-changelog` — May be worth mentioning in release notes

---

### CI/CD Workflow Change

**Scenario:** Add CodeQL scanning to CI pipeline for security baseline.

```
type:ci
status:ready
priority:normal
area:ci
meta:needs-changelog
```

**Why these labels:**

- `type:ci` — CI/CD work
- `status:ready` — Implementation planned
- `priority:normal` — Infrastructure improvement
- `area:ci` — CI/CD domain
- `meta:needs-changelog` — New security scanning is worth noting

---

### Dependency Update

**Scenario:** Update npm package `js-yaml` to patch security vulnerability.

```
type:dependency
status:ready
priority:critical
area:dependencies
meta:dependabot-security
meta:needs-changelog
```

**Why these labels:**

- `type:dependency` — Dependency management
- `status:ready` — Just needs merging
- `priority:critical` — Security patch
- `area:dependencies` — Dependencies domain
- `meta:dependabot-security` — Automated Dependabot update
- `meta:needs-changelog` — Security fix needs mention

---

### Chore / Maintenance

**Scenario:** Update contributing guidelines and code of conduct.

```
type:chore
status:ready
priority:normal
area:documentation
lang:md
```

**Why these labels:**

- `type:chore` — Maintenance/housekeeping
- `status:ready` — Can be merged immediately
- `priority:normal` — Standard maintenance
- `area:documentation` — Governance docs
- `lang:md` — Markdown files

---

## Pull Requests

### Bug Fix PR

**Scenario:** PR fixing the color customizer crash (closes the bug issue).

```
type:bug
status:needs-review
priority:critical
area:theme-json
comp:theme-json
meta:needs-changelog
release:patch
```

**Why these labels (compared to issue):**

- `status:needs-review` — PR is open, waiting for review (not triage)
- `release:patch` — Bug fix requires patch version bump
- (Otherwise same as the bug issue)

**Branch name for auto-labelling:** `fix/theme-customizer-crash`

---

### Feature PR

**Scenario:** PR implementing custom CSS variables in theme JSON.

```
type:feature
status:needs-review
priority:important
area:theme-json
comp:theme-json
meta:needs-changelog
release:minor
```

**Why these labels:**

- `status:needs-review` — PR waiting for code review
- `release:minor` — New feature requires minor version bump
- (Otherwise same as feature issue)

**Branch name for auto-labelling:** `feat/theme-json-css-variables`

---

### Documentation PR

**Scenario:** PR adding breakpoints guide to documentation.

```
type:documentation
status:needs-review
priority:normal
area:documentation
lang:md
meta:no-changelog
```

**Why these labels:**

- `status:needs-review` — PR waiting for review
- `meta:no-changelog` — Documentation-only, no changelog needed
- (No release: label—docs don't trigger version bumps)

**Branch name for auto-labelling:** `docs/guide-theme-json-breakpoints`

---

### Refactoring PR

**Scenario:** PR consolidating label utility files.

```
type:refactor
status:needs-review
priority:normal
area:quality
lang:js
meta:no-changelog
```

**Why these labels:**

- `status:needs-review` — PR open
- `meta:no-changelog` — Internal refactoring, no user-facing change
- (No release: label—refactors don't bump versions)

**Branch name for auto-labelling:** `refactor/consolidate-label-utils`

---

### Security Fix PR

**Scenario:** PR fixing XSS vulnerability in block editor output.

```
type:security
status:needs-review
priority:critical
area:security
comp:block-editor
meta:needs-changelog
release:patch
```

**Why these labels:**

- `type:security` — Security fix
- `priority:critical` — Security is always critical
- `meta:needs-changelog` — Security fixes must be documented
- `release:patch` — Security patches use patch bumps (or hotfix)

**Branch name for auto-labelling:** `security/block-editor-xss`

---

### CI Update PR

**Scenario:** PR adding CodeQL security scanning to workflows.

```
type:ci
status:needs-review
priority:normal
area:ci
meta:no-changelog
```

**Why these labels:**

- `type:ci` — CI/CD change
- `meta:no-changelog` — Internal tooling, no user impact
- (No release: label)

**Branch name for auto-labelling:** `ci/add-codeql-scanning`

---

### Dependency Update PR

**Scenario:** PR updating js-yaml security patch.

```
type:dependency
status:needs-review
priority:critical
area:dependencies
meta:dependabot-security
meta:needs-changelog
release:patch
```

**Why these labels:**

- `type:dependency` — Dependency update
- `meta:dependabot-security` — Automated Dependabot update
- `release:patch` — Security patch needs release
- `meta:needs-changelog` — Security update is user-facing

**Branch name for auto-labelling:** `deps/update-js-yaml`

---

## Label Combination Rules

### Required Combinations

**Every issue/PR must have:**

1. **Exactly one** `type:*` label
2. **Exactly one** `status:*` label
3. **Exactly one** `priority:*` label
4. **At least one** `area:*` or `comp:*` label
5. **For PRs only:**
   - `meta:needs-changelog` OR `meta:no-changelog` (not both)
   - One `release:*` label (if user-facing change)

### Optional Additions

Add additional labels as context requires:

- `meta:*` labels for workflow signals (multiple OK)
- `comp:*` labels for product components (multiple OK)
- `lang:*` labels for implementation languages (multiple OK)
- `env:*` labels for environment context
- `compat:*` labels for compatibility concerns (multiple OK)

### What NOT to Do

❌ **Don't create custom labels**

- All labels must come from canonical set (`.github/labels.yml`)
- Custom labels break automation

❌ **Don't mix families without good reason**

- `type:bug`, `type:improvement` — Choose ONE type
- `status:ready`, `status:in-progress` — Choose ONE status
- Exception: `meta:`, `comp:`, `lang:`, `area:`, `compat:` allow multiples

❌ **Don't use bare labels**

- `bug` ❌ → `type:bug` ✅
- `feature` ❌ → `type:feature` ✅
- `urgent` ❌ → `priority:critical` ✅

---

## Testing Your Labels

Use the validation script to test labels locally before applying:

```bash
node scripts/validation/validate-labels-before-creation.cjs \
  --labels "type:bug,status:needs-triage,priority:critical" \
  --canonical-file .github/labels.yml
```

Output:

```
✅ Label validation passed

{
  "valid": true,
  "labels_count": 3,
  "canonical_labels_count": 158,
  "errors": [],
  "warnings": []
}
```

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

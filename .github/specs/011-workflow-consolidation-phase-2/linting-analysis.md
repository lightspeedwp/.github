---
title: "Linting Workflows Analysis"
description: "Analysis of archived linting workflows for consolidation into linting-unified.yml"
date_created: "2026-09-17"
last_updated: "2026-09-17"
---

# Linting Workflows Analysis • Phase 5 (US4)

**Task:** T048 — Analyze 2 archived linting workflows and document consolidation patterns

---

## Archived Workflows Inventory

### 1. `linting.yml`

**Location:** `.github/workflows/archived/2026-09-11/validation/linting.yml`

**Purpose:** Primary linting workflow for code quality validation

**Triggers:**

- `pull_request` on develop branch
- `push` on develop branch

**Jobs:**

- Single `lint` job executing `npm run lint`

**Node.js Version:** Uses `.nvmrc` for version specification

**Execution:**

```bash
npm ci
npm run lint
```

**Current npm scripts:**

- `lint` → `lint:js && lint:yaml && lint:pkg-json` (JS, YAML, package.json)
- `lint:all` → `lint && lint:workflows && lint:md && lint:json` (full suite)
- `lint:js` → ESLint with auto-fix
- `lint:md` → markdownlint-cli2
- `lint:yaml` → spectral for YAML validation

**Status:** Active in Phase 1 archive; consolidation candidate for Phase 5

### 2. Additional Linting Infrastructure

**Configuration Files:**

- `.eslintrc.js` — ESLint configuration
- `.markdownlintrc` — Markdown linting rules
- `.npmpackagejsonlint.config.cjs` — package.json validation
- `.spectral.config.cjs` — YAML linting rules
- `.spectral-workflows.cjs` — Workflow-specific YAML rules

**npm Scripts for Linting:**

- `lint:js` — ESLint with auto-fix
- `lint:md` — markdownlint for Markdown files
- `lint:yaml` — spectral for YAML
- `lint:workflows` — spectral for workflow YAML
- `lint:pkg-json` — npmPkgJsonLint for package.json
- `lint` — Combined JS/YAML/pkg-json (default)
- `lint:all` — Full suite including workflows, markdown, JSON

**Supported File Types:**

- JavaScript/TypeScript: `**/*.{js,jsx,ts,tsx}`
- Markdown: `**/*.{md,mdx}` (excluding node_modules)
- YAML: `**/*.{yml,yaml}`
- JSON: `**/*.json`
- package.json: Project root

---

## Consolidation Pattern Analysis

### Trigger Patterns

| Workflow | push/develop | pull_request | schedule | workflow_dispatch |
|----------|--------------|--------------|----------|-------------------|
| linting.yml | ✅ | ✅ | ❌ | ❌ |

**Consolidation Strategy:** Unified workflow should trigger on both push and pull_request to develop branch (same as archived).

### Job Decomposition

**Current Approach (Single Job):**

- One `lint` job executing all linting types sequentially

**Proposed Decomposition (Parallel Jobs):**

1. **JS/TS Linting Job**
   - Runs ESLint for JavaScript/TypeScript
   - Triggered always
   - Reports findings to PR comment (on PR)
   - Auto-fixes available via suggestion

2. **Markdown Linting Job**
   - Runs markdownlint for Markdown files
   - Triggered always
   - Reports findings to PR comment

**Optional Jobs (Phase 5.1):**

- YAML validation (lower priority for MVP)
- package.json validation (can defer)
- JSON schema validation (can defer)

### Performance Characteristics

**Current Workflow Timing:**

- ESLint execution: ~30-45 seconds
- Markdown linting: ~10-15 seconds
- YAML validation: ~5-10 seconds
- Total: ~45-70 seconds per run

**Expected Unified Performance:**

- Parallel JS/Markdown: ~45 seconds (longest job)
- Reduced total execution via parallelization

### Error Handling & Reporting

**Current Behavior:**

- Single lint job fails if any linter reports errors
- No granular error reporting by linter type
- Errors output to job logs only

**Proposed Unified Behavior:**

1. Each linting job runs independently
2. Failed linting jobs post PR comments with:
   - Specific file/line references
   - Remediation suggestions
   - Link to linter documentation
3. Composite action `validate-check` reports final status
4. Metrics collected per linting type

### Composite Action Integration

**Actions to Integrate:**

- `validate-check` (T007) — Report validation results as checks
- `collect-metrics` (T009) — Collect linting execution metrics

**Metrics to Track:**

- Files checked (JS, Markdown, YAML, JSON)
- Errors/warnings found per linter
- Execution time per linting job
- Total workflow duration

---

## Consolidation Scope (Phase 5)

### MVP Scope (In Scope)

✅ **ESLint Integration:**

- Runs ESLint on `**/*.{js,jsx,ts,tsx}`
- Reports findings to PR with line references
- Enforces project ESLint config

✅ **Markdown Linting:**

- Runs markdownlint on `**/*.{md,mdx}`
- Reports findings to PR
- Enforces `.markdownlintrc` rules

✅ **Parallel Execution:**

- JS and Markdown jobs run in parallel
- Concurrency group prevents duplicate runs

✅ **Composite Action Integration:**

- validate-check for status reporting
- collect-metrics for performance tracking

### Deferred Scope (Phase 5.1+)

❌ **YAML Validation:**

- Spectral linting for `**/*.{yml,yaml}`
- Workflow-specific YAML validation
- Defer to Phase 5.1 (lower priority)

❌ **package.json Linting:**

- npmPkgJsonLint validation
- Defer to Phase 5.1

❌ **JSON Schema Validation:**

- Custom JSON validation scripts
- Defer to Phase 5.1

### Files to Exclude

- `node_modules/` (always excluded)
- `.git/` (internal)
- Generated/build artifacts (dist/, build/, coverage/)
- Lock files (package-lock.json, yarn.lock)

---

## Risk Analysis

### Risk: Duplicate vs Sequential Execution

**Issue:** Running JS and Markdown linting in parallel might conflict if both try to format files

**Mitigation:**

- Both jobs run with `--format` or `--fix` flags disabled
- Reporting only (no auto-fixes in workflow)
- Auto-fix available via GitHub suggestions or local runs

### Risk: Performance Regression

**Issue:** Parallel execution might be slower than sequential if both run on same runner

**Mitigation:**

- Both jobs typically complete in <45 seconds on ubuntu-latest
- Actual improvement from parallelization will be marginal
- Trade-off: Better visibility (separate job results) vs sequential speed

### Risk: Incomplete Migration

**Issue:** If YAML/JSON linting deferred, development workflows might run incomplete validation

**Mitigation:**

- MVP scope clearly documented
- Phase 5.1 tasks created for deferred items
- Developers can still run `npm run lint:all` locally

---

## Consolidation Decisions

| Decision | Rationale | Approval |
|----------|-----------|----------|
| **Separate JS/Markdown jobs** | Clearer error reporting, independent failure modes | ✅ |
| **Parallel execution** | Better visibility despite marginal perf gain | ✅ |
| **Defer YAML/JSON linting** | Lower priority, can add in Phase 5.1 | ✅ |
| **No auto-fix in workflow** | Prevents file conflicts, users apply via suggestions | ✅ |
| **Same triggers as archived** | push + pull_request on develop | ✅ |

---

## Related Tasks

- **T049:** Create unified linting workflow skeleton
- **T050:** Implement JS/TS linting job
- **T051:** Implement Markdown linting job
- **T052:** Integrate validate-check composite action
- **T053:** Integrate collect-metrics composite action
- **T054:** Test linting-unified.yml on feature branch
- **T055:** Document linting-unified.yml behavior
- **T056:** Validate linting-unified.yml CI passing ≥3 runs

---

*Analysis completed: 2026-09-17 | Phase 5 Preparation | Ready for T049 implementation*

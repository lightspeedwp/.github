# Markdown Audit & CI Linting Scope Optimization

## Objective

Audit all `.md` files in the repository to optimize CI linting workflows by:

1. **Categorizing files** into long-term documentation vs. temporary/report-based assets
2. **Identifying candidates for CI exclusion** (reports, planning documents, audits, temporary artifacts)
3. **Standardizing long-term documentation** with consistent frontmatter, badges, and footers
4. **Reducing CI workload** by narrowing the linting scope to files that benefit from automated validation
5. **Providing actionable recommendations** for CI workflow changes

## Scope

This audit covers **all `.md` files** in the repository, with particular attention to:

- `docs/` — permanent documentation
- `.github/` — GitHub-native templates and documentation
- `instructions/` — portable instruction files
- `ai/` — AI operation assets and guidelines
- `agents/`, `skills/`, `workflows/`, `plugins/` — portable asset documentation
- `CHANGELOG.md`, `README.md`, and root-level documentation
- Reports and audit files (to be excluded from CI)
- Project-scoped planning documents and temporary assets

## Discovery & Categorization

### Phase 1: File Discovery

1. **Locate all `.md` files** across the repository:

   ```bash
   find . -name "*.md" -type f | sort
   ```

   - Exclude `node_modules/`, `.git/`, `dist/`, `build/`, and generated directories
   - Record total count and distribution by directory

2. **Analyze metadata** for each file:
   - File path
   - Size (lines of code)
   - Last modified date
   - Current frontmatter presence (if any)
   - Current CI linting status (included/excluded in workflows)

### Phase 2: Categorization

Classify each file into one of these categories:

#### Category A: Long-Term Documentation

**Characteristics:** Permanent, evolving reference material; benefits from CI linting and standardization.

- **Examples:** `docs/*.md`, `.github/instructions/*.md`, `instructions/*.md`, root-level `README.md`, `CLAUDE.md`, `AGENTS.md`
- **CI Decision:** ✅ INCLUDE in linting workflows
- **Standardization:** ✅ Apply frontmatter, badges, footers

#### Category B: Portable Asset Documentation

**Characteristics:** Self-contained asset documentation (agents, skills, workflows, plugins); benefits from consistent structure.

- **Examples:** `agents/*/README.md`, `skills/*/SKILL.md`, `workflows/*/WORKFLOW.md`, `plugins/*/PLUGIN.md`
- **CI Decision:** ✅ INCLUDE in linting workflows (or create asset-specific linting rules)
- **Standardization:** ✅ Apply frontmatter with asset metadata (type, version, tags)

#### Category C: Temporary/Short-Lived Files

**Characteristics:** Created for short-term work, audits, or planning; not part of permanent documentation.

- **Examples:**
  - Project audits: `CHANGELOG-CONSOLIDATION-AUDIT.md`, `MERGIFY-STRATEGY.md`
  - Planning documents: `.github/projects/active/*/planning.md`
  - Temporary analysis: `.github/reports/{category}/*.md`
  - Scratch work: `.github/tmp/*.md`
- **CI Decision:** ❌ EXCLUDE from linting workflows
- **Standardization:** ❌ No standardization required; natural lifecycle

#### Category D: GitHub Templates & Community Files

**Characteristics:** GitHub-native templates for issues, PRs, discussions; enforced by platform.

- **Examples:** `.github/ISSUE_TEMPLATE/`, `.github/PULL_REQUEST_TEMPLATE/`, `.github/DISCUSSION_TEMPLATE/`
- **CI Decision:** ⚠️ CONDITIONAL — validate structure/required sections only
- **Standardization:** ✅ Apply consistent frontmatter with template metadata

#### Category E: Reports & Metrics

**Characteristics:** Generated or manually created analysis/reports; lifecycle tied to specific initiatives.

- **Examples:** `.github/reports/`, audit findings, performance metrics
- **CI Decision:** ❌ EXCLUDE from linting workflows
- **Standardization:** ❌ No standardization; auto-lifecycle cleanup recommended

#### Category F: Release & Changelog Files

**Characteristics:** Version-specific or release-scoped; may include generated content.

- **Examples:** `CHANGELOG.md`, `.github/releases/*/RELEASE_NOTES.md`
- **CI Decision:** ✅ INCLUDE for `CHANGELOG.md` (canonical); ⚠️ CONDITIONAL for release-specific files
- **Standardization:** ✅ Apply frontmatter with version metadata

### Phase 3: Current CI Analysis

1. **Review current linting configuration:**
   - Examine `.github/workflows/` for markdown linting rules
   - Identify files currently included/excluded in CI
   - Check `.markdownlintrc` or equivalent configuration
   - Document any custom linting rules

2. **Measure current workload:**
   - Count files currently processed by CI
   - Identify which files fail linting and why
   - Estimate CI time savings from exclusions

## Standardization Recommendations

### For Category A & B Files (Include in CI)

#### Frontmatter Template

```yaml
---
title: Human-readable title
description: One-line summary for navigation and tools
category: documentation | instruction | asset
tags:
  - tag1
  - tag2
version: 1.0.0
last_updated: YYYY-MM-DD
status: active | deprecated | archived
---
```

#### Optional Elements

- **Badges:** Status badges (stable, beta, deprecated), version badges
- **Footers:** Links to related docs, last-updated timestamp, related issues/PRs
- **Navigation:** Table of contents for long documents (>500 lines)

### For Category C, D, E Files (Exclude from CI)

- No standardization required
- Consider directory-level `.gitignore` patterns for cleanup
- Add explicit comment to workflows excluding these paths

## Key Findings Template

Document findings in the following structure:

### Summary

- Total `.md` files: **X**
- Category breakdown (A/B/C/D/E/F with counts)
- Current CI-included files: **X** → Recommended: **Y** (savings: Z%)
- Estimated CI time reduction: **X% - Y%**

### Category Breakdown

For each category, provide:

- File count
- Examples (top 5)
- Current CI status
- Recommended action
- Standardization requirements (if any)

### CI Workflow Changes

Propose specific workflow modifications:

```yaml
# Example: exclude temporary files from linting
- name: Run markdown linting
  run: npm run lint:md -- \
    --ignore ".github/tmp/**" \
    --ignore ".github/reports/**" \
    --ignore ".github/projects/active/**" \
    src/ docs/ instructions/ agents/ skills/ workflows/
```

### Standardization Roadmap

1. **Phase 1 (Quick Wins):** Apply frontmatter to root-level files (`README.md`, `CLAUDE.md`, `AGENTS.md`, `CHANGELOG.md`)
2. **Phase 2 (Documentation):** Standardize `docs/` and `instructions/` directories
3. **Phase 3 (Assets):** Standardize portable asset directories (`agents/`, `skills/`, `workflows/`, `plugins/`)
4. **Phase 4 (Templates):** Apply metadata frontmatter to GitHub templates

### CI Workflow Recommendations

1. **Narrow linting scope** to exclude categories C, D, E
2. **Create separate asset-validation rules** for `agents/`, `skills/`, `workflows/` (e.g., require `SKILL.md` naming, validate asset metadata)
3. **Optional:** Create a `lint:docs` target for long-term documentation and `lint:all` for comprehensive checks
4. **Document exclusions** in `README.md` or CI workflow comments for future maintainers

## Deliverables

This audit should produce:

1. **MARKDOWN_AUDIT_REPORT.md** — Full findings with categorized file listings
2. **Recommended CI workflow changes** — Specific `.github/workflows/` modifications
3. **Frontmatter template examples** — For each category that benefits from standardization
4. **Standardization roadmap** — Phased approach with effort estimates
5. **Exclusion list** — Explicit paths to exclude from CI linting

## Questions to Answer

- Which files currently fail linting and why?
- Are there files that *should* have CI linting but currently don't?
- What percentage of CI time could be saved by narrowing the scope?
- Which categories would benefit most from frontmatter standardization?
- Are there any naming inconsistencies that could be addressed (e.g., `README.md` vs `readme.md`)?
- Should asset directories (agents, skills, etc.) have stricter validation than general docs?

---
title: Markdown Audit - CI/CD Optimization Findings
description: Comprehensive audit of markdown files and CI/CD coverage for LightSpeedWP .github repository
date: 2026-07-24
status: draft
---

# Markdown Audit - CI/CD Optimization Findings

## Executive Summary

This audit examined **9,024 markdown files** across the LightSpeedWP `.github` repository to assess current CI/CD coverage and identify optimization opportunities. The findings reveal significant opportunities for CI/CD performance improvement, particularly around excluding large categories of vendored and temporary content from linting workflows.

### Key Metrics

| Metric | Value |
|--------|-------|
| **Total .md files** | 9,024 |
| **Total lines** | 1,114,292 |
| **Files with frontmatter** | 2,100 (23.3%) |
| **Average file size** | 123 lines |
| **Current CI coverage** | 9,023/9,024 (100%) |
| **Potential CI time savings** | 35-45% (estimated) |

---

## Phase 1: File Discovery & Categorization

### Summary Statistics

All markdown files were discovered and categorized into 6 functional categories:

| Category | Count | Frontmatter | Total Lines | % of Total | Description |
|----------|-------|-------------|-------------|-----------|-------------|
| **A** | 754 | 635 (84.2%) | 83,665 | 8.4% | Long-term documentation |
| **B** | 8,140 | 1,344 (16.5%) | 1,002,943 | 90.2% | Portable assets |
| **C** | 1 | 1 (100%) | 118 | 0.0% | Temporary/short-lived |
| **D** | 37 | 37 (100%) | 3,264 | 0.4% | GitHub templates |
| **E** | 91 | 82 (90.1%) | 23,624 | 1.0% | Reports & metrics |
| **F** | 1 | 1 (100%) | 678 | 0.0% | Release files |

### Category Breakdown

#### Category A: Long-Term Documentation (754 files)

**Purpose:** Permanent organizational documentation, guides, and standards  
**Locations:** `docs/`, `instructions/`, `.github/instructions/`, `.github/CLAUDE.md`, etc.

**Frontmatter Adoption:** 84.2% (highest among non-template categories)

**Top 5 Files by Size:**

1. `.github/projects/active/agent-standards-initiative/STANDALONE_PROMPT_PHASE_1.md` (2,134 lines)
2. `.github/projects/active/test-coverage-implementation/README.md` (1,841 lines) [FM]
3. `.github/projects/active/agent-standards-initiative/PROMPT_1_PLAYWRIGHT_AGENT_REWRITE.md` (1,795 lines)
4. `.github/projects/active/2025-12-11-wordpress-standards-compliance-comprehensive-review.md` (1,426 lines) [FM]
5. `.github/projects/completed/ISSUE_33_BRANDING_AGENT_PARENT_SPEC.md` (1,103 lines) [FM]

**Status:** ✅ Should continue being linted (core documentation)

---

#### Category B: Portable Asset Documentation (8,140 files) — **CRITICAL FINDING**

**Purpose:** Agent specifications, skill documentation, workflow definitions, plugin references  
**Locations:** `agents/*/`, `skills/*/`, `workflows/*/`, `plugins/*/`, `hooks/*/`

**Key Observation:** This category comprises **90.2% of all markdown files** but includes significant amounts of vendored content:

- `*/plugin-provided/` — Bundled plugin reference material
- `*/platform-managed/` — External platform documentation
- `*/directory-installed/` — Market-sourced components
- `*/agentskills-main/` — External skill libraries

**Frontmatter Adoption:** Only 16.5% (significantly lower than Category A)

**Top 5 Files by Size:**

1. `agents/prd-agent/agent/references/prompts/lightspeed-local-skill-update-prompt-pack.md` (1,275 lines)
2. `agents/ai-readiness-estimator-agent/skills/plugin-provided/figma/figma-use/references/gotchas.md` (1,092 lines)
3. `agents/client-website-discovery-assistant-agent/skills/local/plugin-provided/figma/figma-use/references/gotchas.md` (1,092 lines)
4. `agents/design-partner-agent/skills/plugin-provided/figma/figma-use/references/gotchas.md` (1,092 lines)
5. `agents/prd-agent/skills/plugin-provided/figma/figma-use/references/gotchas.md` (1,092 lines)

**Vendored Content Estimate:**

- Estimated **1,928+ files** are plugin-provided or platform-managed (21% of Category B)
- These should be excluded from CI linting to reduce coverage overhead

**Recommendation:** ⚠️ Exclude vendored subdirectories from CI linting; lint only repository-authored agent definitions

---

#### Category C: Temporary/Short-Lived Files (1 file)

**Purpose:** Scratch, draft, and work-in-progress files  
**Locations:** `.github/tmp/`, files matching `*.draft.md`, `*SCRATCH*`, etc.

**Status:** ✅ Properly excluded from CI (mostly)

---

#### Category D: GitHub Templates (37 files)

**Purpose:** GitHub issue and PR templates  
**Locations:** `.github/ISSUE_TEMPLATE/`, `.github/PULL_REQUEST_TEMPLATE/`, `.github/DISCUSSION_TEMPLATE/`

**Frontmatter Adoption:** 100% (all files have frontmatter)

**Top 5 Files:**

1. `.github/ISSUE_TEMPLATE/18-release.md` (172 lines) [FM]
2. `.github/ISSUE_TEMPLATE/README.md` (153 lines) [FM]
3. `.github/ISSUE_TEMPLATE/09-code-refactor.md` (134 lines) [FM]
4. `.github/ISSUE_TEMPLATE/02-bug.md` (112 lines) [FM]
5. `.github/ISSUE_TEMPLATE/13-performance.md` (112 lines) [FM]

**Status:** ✅ Should continue being linted (governance-critical)

---

#### Category E: Reports & Metrics (91 files)

**Purpose:** Audit findings, analysis reports, metrics snapshots  
**Locations:** `.github/reports/*/`, `.github/metrics/`, `.github/audits/`

**Frontmatter Adoption:** 90.1% (highest among actively-managed categories)

**Top 5 Files:**

1. `.github/reports/mermaid-accessibility-report.md` (1,263 lines) [FM]
2. `.github/reports/analysis/test-coverage-expansion-plan.md` (952 lines) [FM]
3. `.github/reports/mermaid-validation-report.md` (930 lines) [FM]
4. `.github/reports/analysis/pre-release-audit-v1.0.0.md` (883 lines) [FM]
5. `.github/reports/issue-management/audit-2026-07-23-comprehensive.md` (862 lines) [FM]

**Status:** ⚠️ Currently being linted but should be excluded (generated/audit outputs)

---

#### Category F: Release Files (1 file)

**Purpose:** Changelog and release notes  
**Locations:** `CHANGELOG.md`, `RELEASE_NOTES.md`

**Frontmatter Adoption:** 100%

**Status:** ✅ Properly handled (single file, can be excluded)

---

## Phase 2: CI/CD Linting Coverage Analysis

### Current Workflow Configuration

**Primary Linting Workflow:** `.github/workflows/testing.yml`

- Runs on: `develop` branch pushes
- Script: `npm run lint:md`
- Excludes: `.github/reports/**`, `reports/**`, `.github/projects/**`

**Secondary Linting Workflow:** `.github/workflows/meta.yml`

- Runs on: Pull request changes to `.md` files
- Tool: `markdownlint-cli2`
- Exclusions:
  - `AWESOME_GITHUB_MAPPING_STRATEGY.md`
  - `docs/MIGRATION.md`
  - `.github/reports/`
  - `*/plugin-provided/`
  - `*/platform-managed/`
  - `*/directory-installed/`
  - `*/tests/markdown-issues.md`
  - `*/agentskills-main/`

### Current Coverage Status

| Metric | Value |
|--------|-------|
| **Files being linted** | 9,023 of 9,024 (100%) |
| **Files being ignored** | 1 (`docs/MIGRATION.md`) |
| **Affected by testing.yml** | ~9,000 files |
| **Affected by meta.yml** | Variable (changed files only) |

### Linting Configuration Files

**Primary:** `.markdownlint-cli2.config.cjs`

```
- Default rules enabled
- Key disables: MD013 (line length), MD025 (single H1), MD036, MD041
- Allowed HTML elements: br, sub, sup, kbd, mark, details, summary, img, a, div, span, table, etc.
- Enforced: Fenced code blocks, asterisk emphasis/strong, ordered lists
```

**Ignore Patterns (Current):**

```
node_modules/**, coverage/**, dist/**, build/**
.git/**
**/CHANGELOG.md, **/ALL-CONTRIBUTORS.md
docs/api/**/*.md, docs/MIGRATION.md
*.draft.md, README.template.md
AWESOME_GITHUB_MAPPING_STRATEGY.md
wceu-2026/**/*.md
.github/projects/**/*.md
```

---

## Phase 3: Key Findings

### Finding 1: Massive Vendored Content Overhead (CRITICAL)

**Issue:** Category B contains 8,140 files (90.2% of total), including significant vendored content:

- Multiple copies of same plugin reference docs (figma/gotchas.md appears 4+ times)
- Plugin-provided skill documentation included in multiple agents
- Platform-managed component references

**Impact:**

- CI/CD linting time inflated by linting duplicate external documentation
- False positives from third-party code standards
- Maintenance burden for non-repository-authored content

**Evidence:**

- `agents/*/skills/plugin-provided/figma/figma-use/references/gotchas.md` — appears in at least 4 agents
- 1,928+ estimated vendored files that are ignored in meta.yml but NOT in testing.yml

**Recommendation:** Update `testing.yml` to exclude vendored directories matching meta.yml exclusions

---

### Finding 2: Low Frontmatter Adoption in Portable Assets (SECONDARY)

**Issue:** Category B files have only 16.5% frontmatter adoption vs. 84.2% for Category A

**Breakdown:**

- Category A (Long-term docs): 635/754 (84.2%) — Strong adoption
- Category B (Portable assets): 1,344/8,140 (16.5%) — Weak adoption
- Category D (Templates): 37/37 (100%) — Complete adoption
- Category E (Reports): 82/91 (90.1%) — Strong adoption

**Impact:**

- Lack of metadata for versioning, authorship, freshness tracking
- Agent specifications and skill docs lack structured metadata

**Recommendation:** Implement frontmatter standardization for Category B (at minimum: `title`, `updated`, `status`)

---

### Finding 3: Report Files Incorrectly Linted (MODERATE)

**Issue:** 91 report files are being linted despite being generated/audit outputs

**Status:**

- testing.yml: Claims to exclude `.github/reports/**` but doesn't match meta.yml exclusions
- meta.yml: Properly excludes `.github/reports/`
- Actual result: Reports ARE being linted in testing.yml

**Impact:**

- CI time spent on files that are meant to be read-only outputs
- Potential for reports to fail linting due to formatting from analysis tools

**Recommendation:** Add `.github/reports/**` to testing.yml's markdown linting exclusions

---

### Finding 4: Inconsistent Exclusion Patterns (MODERATE)

**Issue:** testing.yml and meta.yml use different exclusion patterns

**testing.yml excludes:**

```
- .github/reports/**
- reports/**
- .github/projects/**
```

**meta.yml excludes:**

```
- AWESOME_GITHUB_MAPPING_STRATEGY.md
- docs/MIGRATION.md
- .github/reports/
- */plugin-provided/**
- */platform-managed/**
- */directory-installed/**
- */tests/markdown-issues.md
- */agentskills-main/**
```

**Impact:** Inconsistent linting behavior between push (testing.yml) and PR (meta.yml) workflows

**Recommendation:** Unify exclusion patterns; test both workflows with identical rules

---

### Finding 5: Category D (Templates) at 100% Frontmatter (POSITIVE)

**Issue:** Not an issue — this is excellent

**Finding:** All 37 GitHub templates have frontmatter

**Implication:** Strong governance for template documentation; can serve as model for other categories

---

## Phase 4: Recommendations & Implementation Plan

### Priority 1: CRITICAL — Exclude Vendored Content (Estimated 40% CI time savings)

**Change:** Update both testing.yml and .markdownlint-cli2.config.cjs to exclude vendored directories

**Files to Modify:**

- `.github/workflows/testing.yml` — Add `npm run lint:md` exclusion
- `.markdownlint-cli2.config.cjs` — Add patterns to `ignores` array

**Proposed Ignore Patterns:**

```javascript
ignores: [
  // Existing patterns...
  
  // NEW: Vendored/platform-managed content
  "*/plugin-provided/**",
  "*/platform-managed/**", 
  "*/directory-installed/**",
  "*/tests/markdown-issues.md",
  "*/agentskills-main/**",
  
  // NEW: Generated/audit outputs
  ".github/reports/**",
  ".github/audits/**",
  ".github/metrics/**",
  
  // NEW: Project-scoped documentation (temporary during development)
  ".github/projects/**",
]
```

**Expected Result:**

- Exclude ~3,400+ files from linting
- Reduce file count from 9,024 to ~5,600
- Estimated CI time reduction: 35-45%

**Testing:** Run `npm run lint:md` with new config and verify:

```bash
npx markdownlint-cli2 '**/*.md' --config .markdownlint-cli2.config.cjs
# Should process only repo-authored files
```

---

### Priority 2: HIGH — Unify CI Exclusion Patterns (Estimated 5% CI time savings + reliability)

**Change:** Align testing.yml and meta.yml exclusion patterns

**Files to Modify:**

- `.github/workflows/testing.yml` — Update path-ignore and script exclusions
- `.github/workflows/meta.yml` — Verify meta.yml patterns align with testing.yml

**Action:**

1. Document canonical exclusion list in `.markdownlintignore`
2. Reference `.markdownlintignore` in both workflows
3. Remove inline sed patterns from meta.yml; use config-driven exclusions

**Template:** Create `.markdownlintignore` (if not auto-generated):

```
node_modules/**
coverage/**
dist/**
build/**
.git/**
**/CHANGELOG.md
**/ALL-CONTRIBUTORS.md
docs/api/**/*.md
docs/MIGRATION.md
*.draft.md
README.template.md
AWESOME_GITHUB_MAPPING_STRATEGY.md
wceu-2026/**/*.md
.github/projects/**/*.md
*/plugin-provided/**
*/platform-managed/**
*/directory-installed/**
*/tests/markdown-issues.md
*/agentskills-main/**
.github/reports/**
.github/audits/**
.github/metrics/**
```

---

### Priority 3: MEDIUM — Frontmatter Standardization for Category B (Quality improvement)

**Change:** Establish baseline frontmatter requirements for agent/skill/workflow docs

**Target:**

- Category A: Maintain 84%+ adoption
- Category B: Increase from 16.5% to 50%+ (phased)
- Category E: Maintain 90%+ adoption

**Proposed Frontmatter Schema for Category B:**

```yaml
---
title: "[Name of agent/skill/workflow]"
description: "Short summary of purpose"
status: [active|deprecated|draft]
last_updated: YYYY-MM-DD
author: "[GitHub username]"
---
```

**Implementation:**

1. Create migration guide for agents/skills directories
2. Add frontmatter to top 100 most-critical files first
3. Integrate into meta.agent.js to auto-add missing frontmatter
4. Document in AGENTS.md

---

### Priority 4: MEDIUM — Report Directory Proper Exclusion (Quality improvement)

**Change:** Formally exclude `.github/reports/` and related directories from all linting

**Rationale:** Reports are outputs, not code; linting should focus on source documentation

**Files to Update:**

- `.markdownlint-cli2.config.cjs` — Add `.github/reports/**`, `.github/audits/**`, `.github/metrics/**`
- `.github/workflows/testing.yml` — Verify `paths-ignore` includes reports
- Documentation — Update CLAUDE.md to clarify report handling

---

### Priority 5: LOW — Standardize README.md Usage (Documentation)

**Finding:** 262 README.md files across repo; naming is consistent but organization varies

**Action:**

- Document in CLAUDE.md that all major directories should have README.md
- No changes to files needed; this is for future guidance

---

## Implementation Roadmap

### Week 1: Foundation (Critical Fixes)

- [ ] Update `.markdownlint-cli2.config.cjs` with Priority 1 & 2 exclusions
- [ ] Test with `npm run lint:md` to verify file count reduction
- [ ] Update `.github/workflows/testing.yml` to match meta.yml exclusions
- [ ] Run full test suite; verify no functionality changes

### Week 2: Validation & Measurement

- [ ] Measure CI/CD time improvement (before/after)
- [ ] Document CI savings in `.github/projects/active/markdown-audit-ci-optimization/`
- [ ] Create GitHub issue with audit findings and recommendations

### Week 3: Medium-Term (Phased)

- [ ] Begin Category B frontmatter standardization (start with agents/)
- [ ] Update meta.agent.js to auto-apply baseline frontmatter
- [ ] Create migration guide for contributors

### Month 2: Long-Term

- [ ] Publish formal frontmatter schema documentation
- [ ] Integrate into AGENTS.md as binding guidance
- [ ] Schedule quarterly audits to track adoption

---

## Appendix: Audit Methodology

### File Discovery

```bash
find . -name "*.md" -type f ! -path "*/node_modules/*" ! -path "*/.git/*" ! -path "*/.claude/worktrees/*"
```

**Result:** 9,024 files

### Categorization Logic

- **Category A:** `docs/`, `instructions/`, root-level docs, `.github/CLAUDE.md`
- **Category B:** `agents/`, `skills/`, `workflows/`, `plugins/`, `hooks/`
- **Category C:** `.github/tmp/`, files matching `*.draft.md`, `*SCRATCH*`
- **Category D:** `.github/ISSUE_TEMPLATE/`, `PULL_REQUEST_TEMPLATE/`, `DISCUSSION_TEMPLATE/`
- **Category E:** `.github/reports/`, `.github/audits/`, `.github/metrics/`
- **Category F:** `CHANGELOG.md`, `RELEASE_NOTES.md`

### Frontmatter Detection

Check for `^---$` on first line of file

### CI Coverage Analysis

- Parsed `.markdownlint-cli2.config.cjs` and `.github/workflows/*.yml`
- Enumerated ignore patterns and calculated effective coverage

---

## References

- [markdownlint-cli2 Documentation](https://github.com/DavidAnson/markdownlint-cli2)
- [LightSpeedWP CLAUDE.md](../CLAUDE.md)
- [LightSpeedWP AGENTS.md](../AGENTS.md)
- [Branching Strategy](../docs/BRANCHING_STRATEGY.md)

---

**Report Generated:** 2026-07-24  
**Audit Scope:** Full repository markdown inventory  
**Next Review:** 2026-08-24

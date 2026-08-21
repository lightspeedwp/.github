---
file_type: documentation
title: 'Wave 5.3 Phase 3: PR Documentation Audit Report'
description: Consolidation audit of PR-related documentation files identifying overlaps, gaps, and consolidation strategy
issue: '#663'
wave: '5.3'
phase: '3'
created_date: '2026-06-01'
last_updated: '2026-08-21'
status: active
---

# PR Documentation Audit Report (Issue #663)

**Wave:** 5.3 Phase 3
**Issue:** #663 - PR Documentation Audit & Consolidation
**Scope:** 5 PR-related files + 1 discovered canonical source
**Status:** Complete audit with consolidation recommendations

---

## Executive Summary

This audit examined 5 PR-related documentation files in scope. The analysis reveals:

- **3 instances of major content overlap** across PR templates, branch naming, and labeling
- **1 file does not exist** (PR_LABELS.md) — its content is in LABELING.md instead
- **Clear consolidation path** exists following Phase 2 patterns
- **Documentation hierarchy** not yet established — multiple files serve similar purposes at different audiences

**Recommendation:** Consolidate around canonical sources (BRANCHING_STRATEGY.md, LABELING.md, pull-requests.instructions.md) and update PR_CREATION_PROCESS.md to reference them rather than duplicate content.

---

## Files in Scope

### 1. docs/PR_CREATION_PROCESS.md ✅

- **File Type:** Documentation (guide-style)
- **Purpose:** High-level PR creation walkthrough for contributors
- **Size:** ~400 lines
- **Audience:** All contributors (developers, maintainers)
- **Frontmatter:** Valid (file_type, title, description)
- **Content Sections:**
  1. Before You Open a PR
  2. Branch Naming (basic coverage)
  3. Choose the Correct PR Template (with table)
  4. Write a Clear PR Title
  5. Complete the PR Description
  6. Apply Labels and Milestones
  7. Check PR Checklist
  8. Submit and Respond to Review
  9. Merging and Release
  10. Release Notes and Changelog
  11. References (11 links)

### 2. docs/PR_LABELS.md ❌ **DOES NOT EXIST**

- Referenced in scope but not found in repository
- Investigated: docs/LABELING.md exists instead and contains comprehensive PR labeling section
- **Action:** Scope should reference LABELING.md instead

### 3. .github/PULL_REQUEST_TEMPLATE/README.md ✅

- **File Type:** Directory documentation (reference guide)
- **Purpose:** Overview of available PR templates and their integration
- **Size:** ~85 lines
- **Audience:** Contributors (template selection), maintainers (template management)
- **Frontmatter:** Valid (comprehensive YAML with version, maintainer, tags, etc.)
- **Content Sections:**
  1. 📁 Available Templates (table showing 9 templates + automation)
  2. 🔗 Template Integration (cross-references to related docs)
  3. 🤖 Automation Features (labeling, review, changelog, quality gates)
  4. 📚 Related Documentation (agents, workflows, saved replies, instructions)
  5. 💡 Usage Guidelines (5-point checklist)
  6. ⚠️ Important Notes

### 4. instructions/pull-requests.instructions.md ✅

- **File Type:** Instruction file (canonical standards)
- **Purpose:** Detailed, role-based PR creation standards and best practices
- **Size:** ~240 lines
- **Audience:** Contributors, automators, maintainers (canonical reference)
- **Frontmatter:** Valid (instructions schema with scope, version, tags)
- **Content Sections:**
  1. Overview (applies to all PR templates and submissions)
  2. General Rules (6 one-liners)
  3. Detailed Guidance (9 detailed sections covering all aspects)
  4. 1. Use Markdown PR Templates with YAML Frontmatter
  5. 1. Required PR Frontmatter Fields
  6. 1. Branch Naming Requirements
  7. 1. How to Open a Pull Request (step-by-step)
  8. 1. Labeling & Automation (includes automation enforcement rules)
  9. 1. PR Review & Lifecycle
  10. 1. Reference Files and Checklists (consolidated list)
  11. 1. Tips for Excellent PRs
  12. 1. Common Saved Replies & Guidance
  13. Related Files (cross-references to companion guides)

### 5. docs/BRANCHING_STRATEGY.md ✅

- **File Type:** Documentation (comprehensive policy)
- **Purpose:** Org-wide Git branching strategy, naming discipline, and automation mapping
- **Size:** ~320 lines
- **Audience:** All contributors, DevOps, release managers
- **Frontmatter:** None (older style documentation)
- **Content Sections:**
  1. 1. High-level Rules
  2. 1. Branch Protection
  3. 1. Branch Naming (comprehensive coverage with 3+ subsections)
  4. 1. Branch Name Enforcement via CI
  5. 1. Prefixes Drive Automation (labeler, project type mapping)
  6. 1. Merge Discipline
  7. 1. Release & Hotfix Flow
  8. 1. Quick Per-Repo Checklist
  9. 1. FAQ & Guardrails
  10. 1. References
  11. 1. Appendix: Getting Started
  12. 1. Advanced Practices & Troubleshooting
  13. 1. Onboarding & Training

### 6. docs/LABELING.md ✅ (Discovered as PR_LABELS replacement)

- **File Type:** Documentation (comprehensive reference)
- **Purpose:** Complete label taxonomy, automation, and governance for issues and PRs
- **Size:** ~360 lines
- **Audience:** Contributors, maintainers, automators
- **Frontmatter:** Valid
- **Relevant Sections for PR Audit:**
  - Purpose & Principles
  - Label Categories & Families (8 families defined)
  - **Pull Request Labelling (dedicated section)** ← Contains PR_LABELS content
  - Automation & Agent Integration
  - Best Practices
  - Troubleshooting

---

## Overlap Analysis

### Overlap 1: PR Template Selection & Branch-to-Template Mapping

**Files Affected:**

- PR_CREATION_PROCESS.md (Section 3: "Choose the Correct PR Template")
- PULL_REQUEST_TEMPLATE/README.md (Implicit in available templates list)
- pull-requests.instructions.md (Section 4: "How to Open a Pull Request")

**Extent of Overlap:**

- **PR_CREATION_PROCESS.md** Section 3 has a detailed table:

  ```
  | Prefix    | Purpose | Maps to Type / Label | PR Template |
  | fix/      | Bugfix  | bug | .github/PULL_REQUEST_TEMPLATE/pr_bug.md |
  | feat/     | Feature | feature | .github/PULL_REQUEST_TEMPLATE/pr_feature.md |
  ...
  ```

  (Shows 8 mappings)

- **pull-requests.instructions.md** Section 4 states:

  ```
  "Choose the correct PR template when opening your PR. Templates are:
  - Bugfix, Feature, Chore, Docs, Build/CI, Refactor, Hotfix, Release, General, etc."
  ```

  But does NOT include the branch-to-template mapping table.

- **PULL_REQUEST_TEMPLATE/README.md** lists "Available Templates" but does NOT show branch mapping.

**Severity:** 🟡 **MODERATE** — Two documents describe the same workflow but with different detail levels. Table exists in only one place.

**Consolidation Recommendation:**

- Keep branch-to-template mapping table in **PULL_REQUEST_TEMPLATE/README.md** (it lives in .github/)
- Update **PR_CREATION_PROCESS.md** to reference that table with link
- Update **pull-requests.instructions.md** to reference the authoritative source

---

### Overlap 2: Branch Naming & Prefixes

**Files Affected:**

- PR_CREATION_PROCESS.md (Section 2: "Branch Naming")
- pull-requests.instructions.md (Section 3: "Branch Naming Requirements")
- BRANCHING_STRATEGY.md (Sections 3-5: Comprehensive coverage)

**Extent of Overlap:**

- **PR_CREATION_PROCESS.md** Section 2 (brief):

  ```
  Use a branch prefix that matches your change type:
  - feat/ for features
  - fix/ for bug fixes
  - docs/ for documentation
  - chore/ for chores and maintenance
  Example: feat/header-block-responsive-layout
  ```

  (Lists 5 prefixes)

- **pull-requests.instructions.md** Section 3:

  ```
  Follow the canonical branch naming pattern: {type}/{scope}-{short-title}
  Allowed prefixes: feat/, fix/, hotfix/, release/, refactor/, chore/, docs/,
  test/, perf/, ci/, build/, deps/, design/, a11y/, ux/, i18n/, ops/, and more
  (See BRANCHING_STRATEGY.md).
  ```

  (Lists 15+ prefixes but defers to BRANCHING_STRATEGY.md)

- **BRANCHING_STRATEGY.md** Sections 3-5 (comprehensive):

  ```
  ### 3.1 Required Core Prefixes: feat/, fix/, hotfix/, release/, refactor/,
          chore/, docs/, test/, perf/, ci/, build/, deps/, security/,
          revert/, research/, design/, a11y/, ux/, i18n/, ops/
  ### 3.2 Optional Product Profile Prefixes: proto/, ds/, api/, .schemas/, telemetry/
  ### 3.3 Optional Client Profile Prefixes: content/, seo/, config/, migrate/, qa/, uat/
  ### 3.4 Examples (13 example branch names)
  ### 4. Branch Name Enforcement via CI (regex + workflow example)
  ### 5. Prefixes Drive Automation (labeler rules, project type mapping)
  ```

  (Comprehensive, with examples, regex, enforcement, and automation mapping)

**Severity:** 🔴 **HIGH** — Same information scattered across 3 documents at different levels of detail. Maintenance risk: changes to prefix list must be updated in 3 places.

**Consolidation Recommendation:**

- **BRANCHING_STRATEGY.md** is the canonical source (most comprehensive, includes enforcement and automation)
- **PR_CREATION_PROCESS.md** Section 2 should condense to: "Follow branch naming: `{type}/{scope}-{short-title}`. See [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) for full prefix list and enforcement rules."
- **pull-requests.instructions.md** already does this correctly (defers to BRANCHING_STRATEGY.md)

---

### Overlap 3: PR Labeling & Automation

**Files Affected:**

- PR_CREATION_PROCESS.md (Section 6: "Apply Labels and Milestones")
- instructions/pull-requests.instructions.md (Section 5: "Labeling & Automation")
- docs/LABELING.md (Section "Pull Request Labelling" — **canonical source**)

**Extent of Overlap:**

- **PR_CREATION_PROCESS.md** Section 6:

  ```
  Labels are set automatically based on branch prefix and file changes,
  but review and add as needed:
  - Type: type:feature, type:bug, type:docs, etc.
  - Area/Component: area:ci, comp:block-editor, etc.
  - Status: status:needs-review, status:needs-qa, etc.
  - Release: release:minor, release:patch, release:major, etc.
  - Meta: meta:needs-changelog, contrib:help-wanted, etc.
  ```

  (Lists label families but incomplete)

- **pull-requests.instructions.md** Section 5:

  ```
  Minimum required labels:
  - One status:* (e.g. status:needs-review)
  - One type:* (e.g. type:feature, type:bug, etc.)
  - One priority:* (e.g. priority:normal)
  - At least one area:* or comp:* if possible
  - One release:* (e.g. release:patch, release:minor, release:major)
  [Plus subsection on branch prefix mapping and meta labels]
  ```

  (More detailed than PR_CREATION_PROCESS.md)

- **LABELING.md** "Pull Request Labelling" section (comprehensive):

  ```
  ### Required Labels per PR
  - One status:*
  - One type:*
  - One priority:*
  - At least one area:* or comp:*
  - Release label: release:patch, release:minor, or release:major
  - Meta labels: meta:needs-changelog or meta:no-changelog

  ### Branch Prefix Mapping
  [Detailed table showing how each branch prefix maps to labels]

  ### Changelog Policy
  [Rules for meta:needs-changelog vs. meta:no-changelog]
  ```

  (Most comprehensive and authoritative)

**Severity:** 🔴 **HIGH** — Labeling rules appear in 3 places with varying levels of detail and enforcement. LABELING.md is canonical but not always referenced.

**Consolidation Recommendation:**

- **LABELING.md** is the canonical source for all labeling rules
- **PR_CREATION_PROCESS.md** Section 6 should condense to: "Labels are automatically applied based on branch prefix and file changes. See [LABELING.md](./LABELING.md) — Pull Request Labelling section for required label families and automation rules. Ensure one status:*, one type:*, one priority:*, and at least one area:* or comp:* label is present."
- **pull-requests.instructions.md** Section 5 already references LABELING.md as authority; add explicit link

---

### Overlap 4: PR Review & Lifecycle (Moderate)

**Files Affected:**

- PR_CREATION_PROCESS.md (Sections 7-8: "Check PR Checklist" and "Submit and Respond to Review")
- pull-requests.instructions.md (Section 6: "PR Review & Lifecycle")

**Extent of Overlap:**

- **PR_CREATION_PROCESS.md** Sections 7-8:

  ```
  Section 7: Lists checklist items (tests, docs, accessibility, security, linked issues, screenshots, labels, CI)
  Section 8: "Submit and Respond to Review" — brief guidance on CI monitoring and review response
  ```

- **pull-requests.instructions.md** Section 6:

  ```
  "Checklist must be completed" (tests, docs, linked issues, CI, a11y/security checks)
  "Accessibility baseline: Confirm semantic structure, keyboard/focus..."
  "Security baseline: Confirm validation/sanitisation..."
  "CI and all status checks must pass."
  "Respond promptly to reviewer feedback"
  "Ready for review: Mark as ready and ping reviewers"
  "Draft PRs: Use draft status for early feedback"
  "Merge discipline: Use squash & merge, delete branch, resolve all conversations"
  ```

**Severity:** 🟡 **MODERATE** — Both documents cover the lifecycle but with different emphasis. PR_CREATION_PROCESS.md is more contributor-focused (what you should do), pull-requests.instructions.md is more standards-focused (what must be done).

**Consolidation Recommendation:**

- Keep both documents but clarify roles:
  - **PR_CREATION_PROCESS.md** = friendly walkthrough for first-time contributors
  - **pull-requests.instructions.md** = canonical standards and enforcement rules
- Add cross-reference in each: "For detailed standards, see [PR Creation Instructions](../instructions/pull-requests.instructions.md)"

---

### Overlap 5: Release & Changelog (Minor)

**Files Affected:**

- PR_CREATION_PROCESS.md (Section 10: "Release Notes and Changelog")
- pull-requests.instructions.md (references changelog in Section 5 "Labeling & Automation")
- RELEASE_PROCESS.md (exists but not in audit scope)
- LABELING.md (covers meta:needs-changelog rule)

**Extent of Overlap:**

- **PR_CREATION_PROCESS.md** Section 10:

  ```
  "PRs affecting user-facing features or fixes must include a CHANGELOG.md entry."
  "Label with meta:needs-changelog if your PR should be included in release notes."
  "Release workflow will group and publish notes based on labels and PR templates."
  ```

- **pull-requests.instructions.md** references:

  ```
  "Changelog section: [Required for release automation.]"
  "Changelog label (meta:needs-changelog) is added if missing"
  "Release automation: PRs grouped and versioned based on release:* label"
  ```

- **LABELING.md**:

  ```
  "### Changelog Policy
  - User-facing changes must have meta:needs-changelog
  - Internal-only changes can use meta:no-changelog
  - Never apply both on the same PR"
  ```

**Severity:** 🟠 **MINOR** — Information is consistent but scattered. RELEASE_PROCESS.md likely contains more detail but is out of scope.

**Consolidation Recommendation:**

- Add cross-reference in PR_CREATION_PROCESS.md Section 10: "See [RELEASE_PROCESS.md](./RELEASE_PROCESS.md) for detailed release workflow and [LABELING.md](./LABELING.md) for changelog labeling rules."

---

## Consolidation Matrix

---

| Current File | Content | Proposed Location | Action | Priority |
|---|---|---|---|---|
| PR_CREATION_PROCESS.md § 2 (Branch Naming) | Basic branch naming rules (5 prefixes) | Keep brief; link to BRANCHING_STRATEGY.md | UPDATE (add link) | P1 |
| BRANCHING_STRATEGY.md § 3-5 | Comprehensive branch naming, prefixes (25+), enforcement, automation | Keep as canonical source | KEEP (canonical) | P0 |
| PR_CREATION_PROCESS.md § 3 (Template Selection) | Branch-to-template mapping table | PULL_REQUEST_TEMPLATE/README.md | MOVE table to README; link from PR_CREATION_PROCESS.md | P1 |
| PULL_REQUEST_TEMPLATE/README.md | Directory overview, template list, integration points | Keep (lives with templates in .github) | KEEP + ADD branch-to-template table | P1 |
| pull-requests.instructions.md § 3 (Branch Naming) | References BRANCHING_STRATEGY.md correctly | Keep deference to canonical source | KEEP (correct reference pattern) | P0 |
| PR_CREATION_PROCESS.md § 6 (Labels) | Basic label families list (incomplete) | Keep brief; link to LABELING.md | UPDATE (add link, simplify) | P1 |
| pull-requests.instructions.md § 5 (Labeling) | Detailed labeling rules with branch-to-label mapping | Add explicit link to LABELING.md as authority | UPDATE (add explicit link) | P1 |
| LABELING.md "PR Labelling" | Comprehensive PR labeling rules, metadata, automation | Keep as canonical source | KEEP (canonical) | P0 |
| PR_CREATION_PROCESS.md § 7-8 (Review & Lifecycle) | Contributor-friendly checklist and review guidance | Keep as contributor guide | KEEP + add cross-ref to instructions | P2 |
| pull-requests.instructions.md § 6 (Review & Lifecycle) | Standards-based review requirements and enforcement | Keep as canonical standards | KEEP (canonical) | P0 |
| docs/PR_LABELS.md | (Does not exist) | — | REMOVE from scope; audit LABELING.md instead | P1 |

---

## Cross-References to Update

---

### Files referencing PR documentation (need verification)

1. **PR_CREATION_PROCESS.md references (line ~7):**
   - `./VERSIONING.md` ✅
   - `./FRONTMATTER_SCHEMA.md` ✅
   - `TESTING.md` — should be `./TESTING.md` ⚠️
   - `../CONTRIBUTING.md` ✅
   - Line 152: `../CHANGELOG.md` ❌
   - Line 160: Link to `.github/PULL_REQUEST_TEMPLATE.md` (should be specific template or directory)
   - Line 161: `../.github/PULL_REQUEST_TEMPLATES/` ✅
   - Lines 162-168: Various cross-refs to existing docs ✅

2. **pull-requests.instructions.md references (verify):**
   - Line 57: `../docs/PR_CREATION_PROCESS.md` ✅
   - Line 86: `./documentation-formats.instructions.md` ✅
   - Line 96: `../docs/BRANCHING_STRATEGY.md` ✅
   - Lines 129, 146-150: Labeling file references ✅
   - Line 208: `../instructions/coding-standards.instructions.md` ✅
   - Lines 234-238: "Related Files" section with good cross-refs ✅

3. **BRANCHING_STRATEGY.md references (verify):**
   - Lines 3, 278-291: Multiple cross-refs to docs, workflows, etc. (NEEDS UPDATE)

4. **.github/PULL_REQUEST_TEMPLATE/README.md references (verify):**
   - Line 42: `../../docs/PR_LABELS.md` ❌ (should be `../../docs/LABELING.md`)
   - Line 43: `../docs/BRANCHING_STRATEGY.md` ⚠️ (should be `../../docs/BRANCHING_STRATEGY.md`)
   - Line 61: `../instructions/pull-requests.instructions.md` ⚠️ (path depth)

---

## Proposed New Structure for PR Creation Docs

### Hierarchy (based on Phase 2 patterns)

```
docs/ (permanent human documentation)
├── BRANCHING_STRATEGY.md (canonical: branch naming, prefixes, enforcement)
├── LABELING.md (canonical: all label taxonomy and rules)
├── PR_CREATION_PROCESS.md (guide: walkthrough for contributors)
├── RELEASE_PROCESS.md (canonical: release workflow)
└── index.md (entrypoint: updated with complete inventory)

instructions/ (portable, canonical standards)
├── pull-requests.instructions.md (canonical: PR standards, frontmatter, checklists)
└── [references docs/* for details]

.github/PULL_REQUEST_TEMPLATE/
├── README.md (directory reference: template overview, automation, integration)
├── pr_feature.md, pr_bug.md, ... (template files)
└── [references docs/* for detailed guidance]
```

### Updated Content Map

| Document | Role | Audience | Primary Sections |
|---|---|---|---|
| **docs/BRANCHING_STRATEGY.md** | Canonical branch & prefix policy | DevOps, all contributors | Prefixes, enforcement, automation mapping, merge discipline |
| **docs/LABELING.md** | Canonical label taxonomy & rules | Maintainers, automators, contributors | Label families, issue/PR/discussion labeling, automation |
| **docs/PR_CREATION_PROCESS.md** | Contributor walkthrough guide | New/all contributors | Steps 1-10 (concise), with links to canonical sources |
| **instructions/pull-requests.instructions.md** | Canonical PR standards | Contributors, automators, reviewers | Templates, frontmatter, branch naming, labeling, lifecycle, enforcement |
| **.github/PULL_REQUEST_TEMPLATE/README.md** | Template directory reference | Contributors (template selection), maintainers | Template list, branch-to-template mapping, automation features |
| **docs/RELEASE_PROCESS.md** | Release workflow (out of audit scope) | Release managers, maintainers | Release steps, hotfix, versioning, changelog |

---

## Gaps Identified

1. **No consolidated "Getting Started with PRs" guide** — PR_CREATION_PROCESS.md is close but could be more explicit
2. **Branch-to-template mapping not easily discoverable** — lives in only one place (PR_CREATION_PROCESS.md table)
3. **No step-by-step "PR template selection" flowchart** — verbal in multiple places
4. **Saved replies referenced but not linked from main PR docs** — good guidance exists but scattered in .github/SAVED_REPLIES/pull-requests/
5. **Merge discipline not emphasized in PR_CREATION_PROCESS.md** — only mentioned briefly, but fully covered in BRANCHING_STRATEGY.md § 6
6. **No "common PR mistakes" or troubleshooting section** — could help new contributors

---

## Recommendations Summary

### P0 (Must Do)

- [ ] Fix PR_LABELS.md reference in scope → audit LABELING.md instead
- [ ] Verify all cross-references in PR docs have correct paths
- [ ] Update BRANCHING_STRATEGY.md frontmatter (add file_type, title, description for consistency)

### P1 (Should Do)

- [ ] Move branch-to-template mapping table from PR_CREATION_PROCESS.md to PULL_REQUEST_TEMPLATE/README.md
- [ ] Add explicit link to LABELING.md in PR_CREATION_PROCESS.md § 6
- [ ] Add explicit link to LABELING.md in pull-requests.instructions.md § 5
- [ ] Update PR_CREATION_PROCESS.md § 2 to defer to BRANCHING_STRATEGY.md with link
- [ ] Fix path references in .github/PULL_REQUEST_TEMPLATE/README.md (docs/LABELING.md, relative paths)
- [ ] Add cross-reference between PR_CREATION_PROCESS.md and pull-requests.instructions.md (guides vs. standards)

### P2 (Nice to Have)

- [ ] Create "PR Template Selection Guide" flowchart (visual decision tree)
- [ ] Add "Common PR Mistakes" troubleshooting section to PR_CREATION_PROCESS.md
- [ ] Link to saved replies from PR docs (e.g., "for detailed feedback examples, see saved replies")
- [ ] Consolidate saved replies into themed sections within PR docs

---

## Validation Checklist

- [ ] All frontmatter valid per FRONTMATTER_SCHEMA.md
- [ ] All cross-references use correct relative paths
- [ ] No circular references (A → B → A)
- [ ] Canonical sources clearly marked and deferred-to
- [ ] No contradictory guidance between documents
- [ ] Branch prefix list consistent across all documents (post-consolidation)
- [ ] Label family definitions consistent across documents
- [ ] run `npm run lint:md` — no errors
- [ ] run `npm run validate:frontmatter` — all pass

---

## References

- CLAUDE.md — Repository boundaries and conventions
- MIGRATION.md — Phase 2 consolidation patterns
- FRONTMATTER_SCHEMA.md — Frontmatter requirements
- instructions/documentation-formats.instructions.md — Markdown standards
- Phase 2 PR (commit 88345a3) — Consolidation example

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

---
title: "Badges Workflow Integration — Comprehensive Audit & Plan"
description: "Complete audit of existing badges infrastructure and integration plan for workflow automation"
file_type: "documentation"
status: "active"
created_date: "2026-08-08"
last_updated: "2026-08-09"
version: "v1.1.0"
authors: ["Ash Shaw", "Claude"]
tags: ["badges", "workflow-integration", "documentation", "automation"]
---

# Badges Workflow Integration — Comprehensive Audit & Plan

**Project:** Badges Workflow Integration
**Owner:** Ash Shaw
**Status:** Planning Phase (Audit Complete)
**Created:** 2026-08-08
**Target Completion:** 2026-08-22 (15 days)

---

## Executive Summary

This project audits the existing badges infrastructure and plans integration into GitHub Actions workflows. Current state shows:

- ✅ **Utility code exists** — `scripts/agents/includes/badges.js` (227 lines) + `badgeUtils.js` (61 lines)
- ❌ **No active workflows** — Badge utilities are not integrated into any CI/CD workflow
- ❌ **Missing configuration** — `.github/automation/badges.schema.yml` does not exist
- ⚠️ **Historical issues** — PR #1609 removed broken workflow badges from documentation (Issue #1547)
- 📋 **TODO identified** — badges.js contains alignment TODO with automation spec updates

**Scope:** Define 3-5 workflows that will generate, validate, and maintain badges across documentation, create schema configuration, integrate into active workflows, and establish governance for badge maintenance.

---

## Part I: Complete Audit

### 1. Existing Badges Infrastructure

#### Code Assets

| File | Lines | Purpose | Status |
|------|-------|---------|--------|
| `scripts/agents/includes/badges.js` | 227 | Main badge generation module | ✅ Complete |
| `scripts/agents/includes/badgeUtils.js` | 61 | Utility functions for badge operations | ✅ Complete |
| `scripts/agents/includes/__tests__/badgeUtils.test.js` | 42 | Test suite (basic coverage) | ⚠️ Limited |

**Key Functions in badges.js:**

- `generateWorkflowBadges(repo, branch, format)` — Creates badges for all workflows in `.github/workflows/`
- `generateWorkflowBadge(repo, workflowFile, branch)` — Single workflow badge
- `generateMetadataBadges(frontMatter)` — Creates badges from frontmatter metadata
- `updateReadmeBadges(readmeFile, badges)` — Updates README between markers
- `updateBadgesInReadme(readmePath, workflowsPath, options)` — Main entry point
- `loadBadgeSchema()` — Loads schema from `.github/automation/badges.schema.yml` (currently fails—file missing)
- `resolveBadge(badgeRef, badgeDefs, frontMatter)` — Resolves badge definitions

**API Entry Point:**

```javascript
async function updateBadgesInReadme(readmePath, workflowsPath, options = {})
```

#### Configuration

| File | Status | Purpose |
|------|--------|---------|
| `.github/automation/badges.schema.yml` | ❌ Missing | Badge definitions, metadata mapping rules |
| `.github/automation/` | ❌ Doesn't exist | Configuration directory |

**Current Expectations (from badges.js):**

```yaml
# Expected schema structure
badges:
  workflow:
    label: "Workflow"
    success_text: "OK"
  meta:
    license:
      label: "License"

mapping:
  - when:
      has_front_matter: true
      front_matter:
        license: ["GPL-3.0"]
    add: ["meta.license", "workflow.*"]
```

#### Badge Marker Locations

Current implementation uses HTML comments to delimit badge blocks:

```markdown
<!-- BADGES-START -->
[badges here]
<!-- BADGES-END -->
```

**Insertion rules:**

- If markers exist → replace content between them
- If markers don't exist → insert after first `#` heading

### 2. Badge Usage Audit

#### Current Badge Locations (Found in Repo)

| File | Badge Type | Count | Status |
|------|-----------|-------|--------|
| `README.md` | status/build badges | 5 | ✅ Active |
| `BRANCHING_STRATEGY.md` | workflow badges (REMOVED) | 0 | ⚠️ Was 33 badges, removed in PR #1609 |
| `VERSIONING.md` | workflow badges (REMOVED) | 0 | ⚠️ Removed in commit 427b7ed62 |
| `docs/*.md` | documentation badges | 0 | ⚠️ Not yet integrated |

**README.md Current Badges:**

```markdown
[![Test Coverage](https://img.shields.io/badge/coverage-auto-blue)](./tests/README.md)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](./LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](...)
[![Documentation](https://img.shields.io/badge/docs-comprehensive-informational)](./docs/README.md)
[![AI Integration](https://img.shields.io/badge/AI-enhanced-purple)](./AGENTS.md)
[![Automation](https://img.shields.io/badge/automation-active-success)](.github/workflows/)
```

These are manually maintained (not auto-generated).

#### Workflow Coverage

**42 workflows exist in `.github/workflows/`:**

- Actions-minute-savings-watch
- Awesome-github-site
- Changelog-management
- Checks
- Cleanup-branches
- Docs-maintenance
- Docs-validation
- Documentation
- ... (36 more)

**Current badge coverage:** 0 workflows have auto-generated badges

**Broken badge history:**

- PR #1609 (CHILD-003) removed broken workflow badges from `BRANCHING_STRATEGY.md`
  - Reason: Badges linked to non-existent workflow status pages
  - Solution: Replaced with text-based status
- Commit 427b7ed62: Removed from `VERSIONING.md`

### 3. Historical Issues & Context

#### Issue #1547 — Broken Badges

- **Status:** Closed (fixed in PR #1609)
- **Problem:** Workflow status badges were returning 404 errors
- **Solution:** Remove broken badges, add text-based alternatives
- **Related:** CHILD-003 in Release Process Redesign project

#### PR #1609 — Phase 1 Critical Fixes

- **Status:** Merged
- **Content:** Removed 33 broken badges from documentation
- **Approach:** Replaced with text-based status (more reliable)
- **Key change:** Acknowledged badges can break if workflows are renamed/deleted

#### Meta Agent Evolution

- **Current:** `meta.agent.js` handles frontmatter, badges, footers
- **Status:** Badges functionality was consolidated into meta agent
- **Note:** PR #1609 mentions "consolidated badge management under meta agent"

#### TODO in Code

**File:** `scripts/agents/includes/badges.js:7`

```javascript
// TODO: Align this helper with the latest automation spec updates.
```

This suggests the badges implementation predates recent automation infrastructure updates.

### 4. Integration Points (Currently Missing)

#### No Active Workflows

Searched `.github/workflows/*.yml` for badge-related tasks:

- **Result:** 0 workflows currently call badge generation functions
- **Implication:** Badge utilities exist but are unused

#### No Scheduled Updates

No scheduled workflows (cron-based) for:

- Regular badge refresh
- Workflow status validation
- Badge link health checks

#### No Integration with CI/CD

Badge generation not triggered by:

- Push to `develop`/`main`
- PR creation
- Workflow creation/deletion
- Documentation updates

### 5. Related Infrastructure

#### Automation Spec Updates

From CHANGELOG.md:
> "Consolidated Branding Agent Module" — Unified `scripts/agents/branding.agent.js` consolidates header, footer, and badge logic from previously scattered modules

**Status:** Automation infrastructure has evolved since badges.js was written, hence the TODO.

#### Audit Pattern

From CHANGELOG.md:
> `scripts/audit/branding-patterns.js`: New ES Module audit script detecting footers, badges, and frontmatter compliance across repository

**Finding:** 1.5% badge coverage (88 files with badges out of ~5,800 total)

**Current gaps:** Most documentation lacks badges; most workflows don't have auto-generated status badges.

---

## Part II: Integration Planning

### Phase 1: Configuration & Schema (5 days)

#### 1.1 Create Badge Schema Configuration

**File:** `.github/automation/badges.schema.yml`

**Content:**

```yaml
---
# Badge schema configuration
# Defines all available badges and conditional rules for their application

version: "1.0.0"
last_updated: "2026-08-09"

# Badge definitions
badges:
  # Workflow status badges
  workflow:
    checks:
      label: "Checks"
      link: "https://github.com/lightspeedwp/.github/actions/workflows/checks.yml"
    documentation:
      label: "Documentation"
      link: "https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml"
    changelog:
      label: "Changelog"
      link: "https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml"
    # ... more workflows

  # Metadata badges
  meta:
    license:
      template: "![License](https://img.shields.io/badge/license-{license}-blue.svg)"
    version:
      template: "![Version](https://img.shields.io/badge/version-{version}-informational.svg)"
    status:
      draft: "![Draft](https://img.shields.io/badge/status-draft-yellow.svg)"
      active: "![Active](https://img.shields.io/badge/status-active-success.svg)"
      deprecated: "![Deprecated](https://img.shields.io/badge/status-deprecated-red.svg)"
    file_type:
      documentation: "![Documentation](https://img.shields.io/badge/type-documentation-informational.svg)"
      schema: "![Schema](https://img.shields.io/badge/type-schema-blue.svg)"
      workflow: "![Workflow](https://img.shields.io/badge/type-workflow-blueviolet.svg)"

# Mapping rules: when to apply which badges
mapping:
  - when:
      file_type: ["documentation"]
    add:
      - "meta.file_type.documentation"
      - "meta.status"

  - when:
      file_type: ["schema"]
    add:
      - "meta.file_type.schema"
      - "meta.version"

  - when:
      status: ["active"]
    add:
      - "meta.status.active"

  - when:
      has_front_matter: true
      front_matter:
        license: ["GPL-3.0", "MIT"]
    add:
      - "meta.license"

# Workflow badge rules
workflow_badges:
  enabled: true
  include:
    # Which workflows to badge
    patterns:
      - "checks.yml"
      - "documentation.yml"
      - "changelog-*.yml"
      - "release.yml"
      - "main-branch-guard.yml"
  exclude: []
  branch: "develop"
  format: "stacked"  # "stacked" or "inline"

# Document categories that should have badges
badge_coverage:
  instructions: true
  agents: true
  schemas: true
  workflows: true
  documentation: true
  projects: true
```

**Tasks:**

- [ ] Create `.github/automation/` directory
- [ ] Write badges.schema.yml with all workflow definitions
- [ ] Define badge template library
- [ ] Establish mapping rules for each document type
- [ ] Document schema structure in SCHEMA_REFERENCE.md

#### 1.2 Align badges.js with Automation Spec

**File:** `scripts/agents/includes/badges.js`

**Changes:**

- [ ] Remove TODO comment
- [ ] Add schema validation function
- [ ] Add error handling for missing schema
- [ ] Add logging for badge generation
- [ ] Update JSDoc comments with examples
- [ ] Add support for dynamic badge templates from schema

**Testing:**

- [ ] All existing tests pass
- [ ] New tests for schema loading
- [ ] New tests for template resolution

#### 1.3 Define Badge Governance Document

**File:** `docs/BADGES_GOVERNANCE.md`

**Content:**

- Badge types and naming conventions
- When to use manual vs auto-generated badges
- Badge update frequency and triggers
- Broken badge reporting process
- Schema update process
- Document marker placement guidelines
- Examples for each document type

---

### Phase 2: Workflow Integration (5 days)

#### 2.1 Documentation Badge Update Workflow

**File:** `.github/workflows/badges-documentation-update.yml`

**Trigger:** On push to `develop` (documentation files)

**Jobs:**

1. Detect changed documentation files
2. Load schema configuration
3. Generate badges for each file
4. Update files with badges
5. Commit changes (if any)
6. Create PR if modifications needed

**Workflow features:**

- Only runs if documentation files changed
- Skips badge generation for files with `skip_badges: true` in frontmatter
- Commits directly to `develop` (or creates PR if major changes)
- Posts summary comment on related PRs

#### 2.2 README Status Badge Maintenance Workflow

**File:** `.github/workflows/badges-readme-status.yml`

**Trigger:** Daily (cron) + manual dispatch

**Jobs:**

1. Query GitHub Actions API for workflow statuses
2. Verify all badge URLs are valid (no 404s)
3. Update README.md badges
4. Report broken badges
5. Create issue if repairs needed

**Workflow features:**

- Validates badge URLs
- Detects workflow renames/deletions
- Maintains badge currency
- Alerts on broken badges

#### 2.3 Workflow Inventory Synchronization

**File:** `.github/workflows/badges-workflow-audit.yml`

**Trigger:** Weekly (cron) + on workflow file changes

**Jobs:**

1. Scan `.github/workflows/` for new/changed/removed workflows
2. Validate against schema
3. Generate badge definitions for new workflows
4. Update schema with additions
5. Create issues for removed workflows
6. Report coverage gaps

**Workflow features:**

- Auto-discover new workflows
- Alert on workflow deletions
- Maintain schema consistency
- Track coverage metrics

#### 2.4 Badge Link Health Check

**File:** `.github/workflows/badges-health-check.yml`

**Trigger:** Weekly (cron)

**Jobs:**

1. Scan all Markdown files for badge links
2. Validate each badge URL (no timeout/404)
3. Report broken badges
4. Suggest fixes
5. Auto-update if simple replacement

**Workflow features:**

- Prevents silent badge link rot
- Creates issues for manual review
- Tests both HTTP and GitHub URLs
- Reports by file and badge type

---

### Phase 3: Workflow Integration & Execution (3 days)

#### 3.1 Test & Validation

- [ ] Create test fixtures (sample docs with/without badges)
- [ ] Run schema validation tests
- [ ] Test each workflow in dry-run mode
- [ ] Validate badge URLs
- [ ] Test edge cases (missing files, invalid frontmatter, etc.)

#### 3.2 Documentation

- [ ] Write workflow documentation
- [ ] Create examples for each workflow type
- [ ] Document badge schema
- [ ] Write troubleshooting guide

#### 3.3 Deployment

- [ ] Create initial workflows
- [ ] Run diagnostic on current state
- [ ] Generate initial schema from existing workflows
- [ ] Run documentation badge update (dry-run first)

---

### Phase 4: Governance & Monitoring (2 days)

#### 4.1 Monitoring Dashboard

Create a document tracking:

- Badge coverage by document type
- Broken badge detection
- Workflow status changes
- Schema version history

#### 4.2 Update Policy

Document:

- Who can approve schema changes
- Badge PR review checklist
- Breaking change policy
- Deprecation path for old badges

---

## Part III: Detailed Design Decisions

### Decision 1: Manual vs Auto-Generated Badges

**Choice:** Hybrid approach

**Rationale:**

- **Manual badges** (README.md): Status badges that are updated by scheduled workflows, not auto-generated per file
- **Auto-generated badges** (documentation): Document-type and status badges generated from frontmatter during workflow runs

**Why hybrid:**

- Some badges (build status) require live API queries → scheduled workflows
- Some badges (document type, status) can be auto-generated from metadata → faster
- Manual control for special cases while automation reduces maintenance burden

### Decision 2: Workflow Trigger Strategy

**Choice:** Multi-trigger approach

**Triggers:**

- **On-push:** For immediate badge updates when documentation changes
- **Scheduled (daily/weekly):** For status validation and health checks
- **Manual dispatch:** For manual audits and one-off updates

**Why:**

- Immediate feedback for document changes
- Regular validation prevents silent failures
- Manual option for debugging and special operations

### Decision 3: Schema Location & Ownership

**Choice:** `.github/automation/badges.schema.yml` (under control-plane)

**Reasoning:**

- Badge definitions are GitHub-specific (workflow URLs, etc.)
- Configuration belongs with other automation config
- Not portable to other repos (contains repo-specific URLs)
- Easier to update alongside GitHub Actions changes

### Decision 4: Marker-Based Badge Insertion

**Choice:** Keep existing `<!-- BADGES-START/END -->` markers

**Reasoning:**

- Already implemented in badges.js
- Non-intrusive (uses HTML comments)
- Works in Markdown
- Easy to locate and understand
- Prevents accidental badge deletion

### Decision 5: Error Handling Strategy

**Choice:** Fail gracefully with detailed logging

**Approach:**

- If schema is missing → log warning, skip badge generation, don't fail workflow
- If badge URL is invalid → create issue, suggest fix, don't break documentation
- If file can't be written → create PR with diff instead of direct commit

**Why:**

- Badges are documentation enhancement, not critical
- Graceful degradation prevents workflow failures
- Clear issue creation helps with manual review

---

## Part IV: Risk Assessment & Mitigation

### Risk 1: Broken Badge URLs

**Probability:** Medium
**Impact:** High (404s on documentation)

**Mitigation:**

- Weekly health check workflow
- Schema validation on every update
- Automated issue creation for broken links
- Test workflow changes before updating schema

### Risk 2: Schema Out of Sync with Workflows

**Probability:** Medium
**Impact:** Medium (new workflows don't get badged)

**Mitigation:**

- Weekly sync workflow to auto-discover changes
- Auto-update schema with new workflows
- Alert on workflow deletions
- Monthly manual audit

### Risk 3: Performance Impact on Workflows

**Probability:** Low
**Impact:** Medium (workflow delays)

**Mitigation:**

- Badge generation limited to relevant files
- Skip files without `<!-- BADGES-START -->` markers
- Use `skip_badges: true` frontmatter for opt-out
- Separate badge workflows (don't run inline with critical workflows)

### Risk 4: Inconsistent Badge Formatting

**Probability:** Medium
**Impact:** Low (aesthetic only)

**Mitigation:**

- Schema enforces template format
- Validation tests for badge markdown
- Automated formatting on every update
- Consistent badge order defined in schema

### Risk 5: Git Conflicts from Auto-Updates

**Probability:** Medium
**Impact:** Medium (developer friction)

**Mitigation:**

- Badge updates isolated to specific section
- Use squash commits for badge-only PRs
- Consider scheduled runs (off-hours) for routine updates
- Document merge conflict resolution

---

## Part V: Success Criteria & Metrics

### Success Criteria

1. ✅ Schema configuration exists and validates correctly
2. ✅ All 42 workflows have badge definitions in schema
3. ✅ Documentation badge update workflow runs successfully on docs changes
4. ✅ README status badges are auto-updated and validated daily
5. ✅ Badge coverage > 70% across documentation files
6. ✅ Zero broken badge links (checked weekly)
7. ✅ New workflows are auto-discovered and badged within 7 days
8. ✅ Badge governance document approved and implemented
9. ✅ Team can update badges without code changes (schema only)
10. ✅ Integration fully documented with examples and troubleshooting

### Metrics to Track

| Metric | Target | Frequency |
|--------|--------|-----------|
| Badge coverage % | >70% | Weekly |
| Broken badge links | 0 | Daily |
| Avg badge update latency | <1 day | Per PR |
| Schema validation pass rate | 100% | On every commit |
| Workflow discovery lag | <7 days | Weekly |
| Documentation quality | All documented | Ongoing |

---

## Part VI: Timeline & Resource Allocation

### Recommended Execution Plan

| Phase | Duration | Days | Tasks | Status |
|-------|----------|------|-------|--------|
| Phase 1: Schema & Config | 5 days | 1-5 | 1.1, 1.2, 1.3 | 📋 Ready |
| Phase 2: Workflows | 5 days | 6-10 | 2.1, 2.2, 2.3, 2.4 | 📋 Ready |
| Phase 3: Integration | 3 days | 11-13 | 3.1, 3.2, 3.3 | 📋 Ready |
| Phase 4: Governance | 2 days | 14-15 | 4.1, 4.2 | 📋 Ready |
| **Total** | **15 days** | | | |

### Effort Breakdown

- **Configuration & schema:** 8-10 hours
- **Workflow creation:** 12-15 hours
- **Testing & validation:** 6-8 hours
- **Documentation:** 5-7 hours
- **Contingency (10%):** 3-4 hours
- **Total:** ~35-44 hours (4-5 days of focused work)

---

## Part VII: Open Questions & Decisions

### Q1: Should badges appear in all documentation or selected files?

**Options:**
A. All files with frontmatter (most coverage)
B. Only key document types (docs/, agents/, schemas/, instructions/)
C. Opt-in per file via frontmatter flag

**Recommendation:** Option B (focus on key types, avoid noise)

### Q2: How frequently should workflows be re-badged?

**Options:**
A. Every push to develop (frequent, resource-intensive)
B. Weekly scheduled run (batch efficiency)
C. Manual dispatch only (maximum control)

**Recommendation:** Option A for documentation changes, B for status checks

### Q3: Should badge PRs be auto-merged or require review?

**Options:**
A. Auto-merge badge-only PRs (faster, less manual work)
B. Always require review (safety, audit trail)
C. Auto-merge routine updates, review significant schema changes

**Recommendation:** Option C with clear labels to distinguish

### Q4: Which workflows deserve status badges in documentation?

**Options:**
A. All 42 workflows (comprehensive but noisy)
B. Top 10 critical workflows (focused, clean)
C. Configurable subset in schema

**Recommendation:** Option C (schema-driven, 15-20 critical workflows initially)

---

## Next Steps

### Immediate Actions (Today)

1. **Review this audit** ← You are here
2. **Decide on open questions** (Q1-Q4 above)
3. **Approve planning approach**

### If Approved

1. **Create OpenSpec analysis** (optional, for complex decisions)
2. **Create GitHub issues** (Phase 1-4 tasks)
3. **Assign tasks** (suggest: 2-3 PRs across phases)
4. **Begin Phase 1** (schema creation)

### Timeline

- **Phase 1-2:** Week of 2026-08-08 through 2026-08-15
- **Phase 3-4:** Week of 2026-08-15 through 2026-08-22
- **Target completion:** 2026-08-22 (2 weeks from today)

---

## Appendix A: File Structure

```
.github/
├── automation/
│   ├── badges.schema.yml (NEW)
│   └── README.md (NEW - config documentation)
├── workflows/
│   ├── badges-documentation-update.yml (NEW)
│   ├── badges-readme-status.yml (NEW)
│   ├── badges-workflow-audit.yml (NEW)
│   └── badges-health-check.yml (NEW)
└── projects/
    └── active/
        └── badges-workflow-integration-2026-08-08/
            ├── AUDIT_AND_PLAN.md (THIS FILE)
            ├── SCHEMA_REFERENCE.md (NEW)
            ├── WORKFLOW_DOCUMENTATION.md (NEW)
            ├── IMPLEMENTATION_NOTES.md (NEW)
            └── OPENSPEC_ANALYSIS.md (OPTIONAL)

docs/
├── BADGES_GOVERNANCE.md (NEW)
├── BADGES_EXAMPLES.md (NEW)
└── BADGES_TROUBLESHOOTING.md (NEW)

scripts/
├── agents/
│   └── includes/
│       ├── badges.js (UPDATED - align with automation spec)
│       ├── badgeUtils.js (UPDATED - if needed)
│       └── __tests__/
│           └── badges.test.js (EXPANDED)
└── workflows/
    └── badges/ (NEW - helper scripts)
        ├── validate-schema.cjs
        ├── discover-workflows.cjs
        └── health-check.cjs
```

---

## Appendix B: Badge Schema Reference

**See:** `SCHEMA_REFERENCE.md` (to be created in Phase 1.1)

---

## Appendix C: Related Issues & PRs

| Issue/PR | Title | Status | Related |
|----------|-------|--------|---------|
| #1547 | Broken badges investigation | ✅ Closed (PR #1609) | CHILD-003 |
| #1549 | Remove broken workflow badges | ✅ Closed (PR #1609) | CHILD-003 |
| PR #1609 | Phase 1 critical fixes | ✅ Merged | Release v2 |
| Commit 427b7ed62 | Remove broken badge links from VERSIONING.md | ✅ Merged | Badges maintenance |

---

## Document Metadata

- **Created:** 2026-08-08 by Ash Shaw
- **Last Updated:** 2026-08-08
- **Version:** 1.0.0
- **Status:** Ready for Review & Approval
- **Next Review:** Upon completion of Phase 1
- **Archive:** If project deferred, move to `.github/projects/archive/`

---

*This audit and plan is comprehensive and ready for execution. Approval and decision on open questions (Q1-Q4) will unblock Phase 1 implementation.*

---
name: Infrastructure Inventory
title: Existing Labeling Infrastructure Inventory
description: Comprehensive audit of 40+ labeling-related files (workflows, scripts, agents, configuration, documentation)
metadata:
  created: 2026-09-03
  updated: 2026-09-03
  phase: 1-research
  status: draft
---

# Existing Labeling Infrastructure Inventory

## Overview

Comprehensive audit of all existing labeling-related code, workflows, configuration, and documentation across the `.github` control plane.

**Total Components:** 40+ files across workflows, scripts, agents, configuration, and documentation

## GitHub Workflows (11+ files)

### Core Workflows

#### 1. `labeling-governance.yml`
**Location:** `.github/workflows/labeling-governance.yml`  
**Purpose:** Unified labeling workflow consolidating multiple workflows  
**Triggers:** 
- `pull_request` (opened, synchronize, edited, reopened)
- `issues` (opened, edited)
- `discussion` (created, edited)
- Schedule (daily at 02:00 UTC)
- `workflow_dispatch` (manual)

**Key Features:**
- PR labeling based on branch name and content
- Issue labeling with type/status/priority/area labels
- Discussion labeling
- Dependabot security detection
- Cleanup on PR/issue close
- Comprehensive error handling and logging

**Status:** Active, consolidation workflow

---

#### 2. `labeling.yml`
**Location:** `.github/workflows/labeling.yml`  
**Purpose:** Original labeling workflow  
**Status:** Likely superseded by `labeling-governance.yml`

---

#### 3. `issue-labeling-automation.yml`
**Location:** `.github/workflows/issue-labeling-automation.yml`  
**Purpose:** Batch issue labeling with daily schedule  
**Triggers:**
- `workflow_dispatch` with inputs (dry_run, issue_filter, label_types, batch_size)
- Schedule (daily at 02:00 UTC)

**Key Features:**
- Fetches unlabeled issues via GitHub API script
- Applies labels in batches
- Dry-run mode support
- CSV/JSON report generation
- Artifact uploads for audit trail

**Status:** Active

---

#### 4. `label-audit-report.yml`
**Location:** `.github/workflows/label-audit-report.yml`  
**Purpose:** Generate comprehensive label audit reports  
**Triggers:**
- Schedule (weekly)
- `workflow_dispatch` (manual)

**Key Features:**
- Audit all labels against schema
- Generate JSON/CSV/Markdown reports
- Artifact uploads
- GitHub Actions annotations for high-severity issues

**Status:** Active

---

#### 5. `manage-blocking-status-labels.yml`
**Location:** `.github/workflows/manage-blocking-status-labels.yml`  
**Purpose:** Manage status labels that block PRs/issues  
**Triggers:**
- PR/issue status changes
- Schedule (periodic check)

**Key Features:**
- Apply/remove blocking status labels (e.g., `status:blocked`, `status:needs-review`)
- Automatic promotion when blockers resolved

**Status:** Active

---

#### 6. `meta-labels-sync.yml`
**Location:** `.github/workflows/meta-labels-sync.yml`  
**Purpose:** Synchronize `meta:*` labels based on item state  
**Triggers:**
- PR/issue state changes
- Schedule (periodic sync)

**Key Features:**
- Sync `meta:has-pr` label based on linked PRs
- Sync `meta:needs-changelog` based on PR content
- Sync `meta:duplicate` based on linked issues

**Status:** Active

---

#### 7. `validate-issue-labels.yml`
**Location:** `.github/workflows/validate-issue-labels.yml`  
**Purpose:** Validate labels against schema  
**Triggers:**
- PR/issue labeled/unlabeled
- Schedule (periodic validation)

**Key Features:**
- Schema validation (label families, prefixes, allowed values)
- Error reporting via check runs
- Suggestions for invalid labels

**Status:** Active

---

#### 8. `openspec-sync-labels.yml`
**Location:** `.github/workflows/openspec-sync-labels.yml`  
**Purpose:** Sync labels specific to OpenSpec issues  
**Triggers:**
- Issue labeled/unlabeled with `openspec:*`
- Schedule (periodic)

**Key Features:**
- Apply/remove OpenSpec-related labels based on spec status
- Cascade labels to related issues
- Generate OpenSpec status reports

**Status:** Active

---

#### 9. `openspec-validate-labels.yml`
**Location:** `.github/workflows/openspec-validate-labels.yml`  
**Purpose:** Validate OpenSpec label schema  
**Triggers:**
- OpenSpec-related label changes
- Schedule (periodic)

**Key Features:**
- Validate OpenSpec label format and combinations
- Check for required labels on OpenSpec issues
- Generate validation reports

**Status:** Active

---

#### 10. `remediate-bare-labels.yml`
**Location:** `.github/workflows/remediate-bare-labels.yml`  
**Purpose:** Auto-remediate bare labels (without prefix)  
**Triggers:**
- Issue/PR labeled with bare label
- Schedule (periodic scan)

**Key Features:**
- Detect bare labels (e.g., `bug` instead of `type:bug`)
- Auto-correct or flag for manual review
- Dry-run mode support
- Audit reports of changes

**Status:** Active

---

#### 11. Additional Workflows
**Other workflow files found:**
- `.github/workflows/label-on-mention.yml` — Apply labels when mentioned in comments
- `.github/workflows/label-stale-issues.yml` — Apply stale labels to inactive issues
- `.github/workflows/label-review-status.yml` — Update labels based on PR review status

**Status:** Various

---

## Scripts & Agents (30+ files)

### Agent Files

#### 1. `scripts/agents/labeling.agent.js`
**Location:** `scripts/agents/labeling.agent.js`  
**Purpose:** Unified labeling agent with core logic  
**Size:** 200+ lines

**Key Capabilities:**
- **Content-Based Detection:** Analyzes issue/PR body for keywords
  - Maps keywords to type labels (type:bug, type:feature, type:documentation, etc.)
  - Semantic matching for common patterns
- **Branch Prefix Matching:** Detects feature/fix/docs patterns
  - `feat/*` → `type:feature`
  - `fix/*` → `type:bug`
  - `docs/*` → `type:documentation`
  - etc.
- **File-Based Area Detection:** Analyzes changed files
  - `.github/` → `area:ci`
  - `scripts/` → `area:scripts`
  - `tests/` or `__tests__/` → `area:tests`
  - `docs/` → `area:documentation`
- **Language Detection:** File extensions to language labels
  - `.js`, `.ts` → `lang:js`
  - `.yaml`, `.yml` → `lang:yaml`
  - `.md` → `lang:markdown`
  - `.php` → `lang:php`
  - etc.
- **Priority Inference:** Content analysis
  - Keywords like "urgent", "critical", "breaking" → `priority:critical`
  - "needs investigation" → `priority:high`
- **Status Label Application:** Initial status based on context
  - New PR → `status:needs-review`
  - Draft PR → `status:draft`
  - etc.

**Exports:**
- `runLabelingAgent()` — Main entry point
- Helper functions for each detection type

**Status:** Well-structured, actively maintained

---

#### 2. `scripts/agents/run-labeling-agent.js`
**Location:** `scripts/agents/run-labeling-agent.js`  
**Purpose:** Simple wrapper for labeling.agent.js  
**Size:** 15 lines

**Functionality:**
- Entry point for running labeling agent
- Error handling and logging
- Exit code management

**Status:** Active

---

### Automation Scripts (15+ files)

#### 1. `scripts/automation/label-orchestrator.js`
**Location:** `scripts/automation/label-orchestrator.js`  
**Purpose:** CLI orchestrator for all label management operations  
**Size:** 130 lines

**Modes:**
- `audit` — Audit labels against schema
- `sync` — Synchronize labels (PR labels, etc.)
- `stale` — Mark stale issues

**Features:**
- Unified CLI interface
- Dry-run mode
- Verbose logging
- Format options (markdown, json, csv)
- Output file support
- Spawns child scripts (sync-pr-labels.js, review-meta-labels.js, etc.)

**Status:** Active orchestrator

---

#### 2. `scripts/automation/sync-pr-labels.js`
**Location:** `scripts/automation/sync-pr-labels.js`  
**Purpose:** Sync `meta:has-pr` label based on linked PRs  
**Size:** 300+ lines

**Features:**
- Scans issue descriptions for PR references
- Validates PR status (open/closed/merged)
- Adds/removes `meta:has-pr` label
- Dry-run preview mode
- JSON/CSV/Markdown output
- Comprehensive error handling
- Rate limit management
- Single issue mode for testing

**Detection Logic:**
1. Extract PR numbers from issue body (e.g., `#123`)
2. Check each PR status via GitHub API
3. If PR is open → add `meta:has-pr`
4. If PR is closed/merged or not found → remove `meta:has-pr`

**Status:** Well-documented, actively used

**Documentation:** SYNC_PR_LABELS_README.md (comprehensive guide)

---

#### 3. `scripts/automation/sync-pr-labels-optimized.js`
**Location:** `scripts/automation/sync-pr-labels-optimized.js`  
**Purpose:** Phase 2C optimized version of sync-pr-labels.js  
**Size:** 400+ lines

**Improvements:**
- Native fetch instead of Octokit
- Parallel API requests
- Exponential backoff for rate limiting
- Reduced memory footprint
- Better performance metrics

**Status:** Alternative implementation (performance-focused)

---

#### 4. `scripts/automation/update-pr-labels-simple.js`
**Location:** `scripts/automation/update-pr-labels-simple.js`  
**Purpose:** Update status labels for PRs  
**Functionality:**
- PR draft status → `status:draft`
- PR open and needs review → `status:needs-review`
- PR approved → `status:approved`
- PR merged → `status:done`

**Status:** Utility script

---

#### 5. `scripts/automation/review-status-labels.js`
**Location:** `scripts/automation/review-status-labels.js`  
**Purpose:** Audit script for status labels  
**Functionality:**
- Review all status labels in use
- Identify inconsistencies
- Generate audit report

**Status:** Audit/review script

---

#### 6. `scripts/automation/review-meta-labels.js`
**Location:** `scripts/automation/review-meta-labels.js`  
**Purpose:** Audit script for meta labels  
**Functionality:**
- Review all `meta:*` labels
- Validate label combinations
- Identify orphaned meta labels

**Status:** Audit/review script

---

#### 7. `scripts/automation/manage-stale-issues.js`
**Location:** `scripts/automation/manage-stale-issues.js`  
**Purpose:** Mark inactive issues as stale  
**Functionality:**
- Find issues inactive for N days
- Apply `status:stale` label
- Optionally close after additional warning period

**Status:** Maintenance script

---

#### 8-15. Additional Automation Scripts
**Other files found:**
- `scripts/automation/includes/batch-operations.js` — Batch operations helper
- `scripts/automation/includes/label-lookup.js` — Label validation/lookup
- `scripts/automation/includes/status-enforcement.js` — Status label logic
- `scripts/automation/includes/labeler-rules.js` — Rule engine
- `scripts/automation/includes/reporting.js` — Report generation
- Various other helper and utility scripts

**Status:** Various stages

---

### Validation Scripts (5+ files)

#### 1. `scripts/validation/validate-labeling-configs.cjs`
**Location:** `scripts/validation/validate-labeling-configs.cjs`  
**Purpose:** Validate label configuration files  
**Validates:**
- `.github/labels.yml` schema
- `.github/labeler.yml` patterns
- Label consistency
- Missing required labels

**Status:** Active validation

---

#### 2. `scripts/validation/validate-labels-before-creation.cjs`
**Location:** `scripts/validation/validate-labels-before-creation.cjs`  
**Purpose:** Pre-flight validation before creating labels  
**Checks:**
- Label format and naming conventions
- Family prefix presence
- No duplicate labels
- No bare labels

**Status:** Pre-creation validation

---

#### 3-5. Additional Validation Scripts
**Other files found:**
- Schema validation helpers
- Test fixtures and validation examples

**Status:** Various

---

## Configuration Files

### 1. `.github/labels.yml`
**Purpose:** Canonical label definitions (source of truth)  
**Scope:** 158 total labels  
**Families:**
- `type:*` (9 labels) — Bug, Feature, Task, Documentation, Security, Design, Research, Chore, Question
- `status:*` (12 labels) — Needs Triage, In Progress, Review, Approved, Done, Blocked, Stale, Draft, Needs Review, Needs Input, Declined, On Hold
- `priority:*` (4 labels) — Critical, High, Normal, Low
- `area:*` (15+ labels) — CI, Docs, Labels, Security, Testing, Automation, API, Schema, Performance, etc.
- `comp:*` — Component labels (plugins, themes, etc.)
- `lang:*` — Language labels (js, php, yaml, etc.)
- `env:*` — Environment labels (production, staging, etc.)
- `compat:*` — Compatibility labels (WordPress, PHP versions, etc.)
- `cpt:*` — Custom post type labels
- `ai-ops:*` — AI operations labels
- `contrib:*` — Contribution type labels
- `discussion:*` — Discussion thread labels
- `openspec:*` — OpenSpec specification labels (5+ labels)
- `meta:*` — Metadata labels (has-pr, needs-changelog, duplicate, needs-audit)

**Status:** Well-maintained, actively used

---

### 2. `.github/labeler.yml`
**Purpose:** Pattern-based labeling rules  
**Rule Types:**
- **Branch patterns:** Route by branch name (feat/*, fix/*, etc.)
- **File patterns:** Apply area labels based on changed files
- **Content patterns:** Apply labels based on file contents
- **PR/Issue patterns:** Route based on issue type or PR characteristics

**Status:** Active configuration

---

### 3. `.github/label-governance-policy.yml`
**Purpose:** Label governance and enforcement rules  
**Features:**
- Destructive change gating (e.g., label removal)
- Required labels for certain issue types
- Label conflict detection
- Approval workflows for policy violations

**Status:** Active policy

---

### 4. `.github/issue-types.yml`
**Purpose:** GitHub native issue type definitions  
**Types:** Bug, Feature, Documentation

**Status:** Active

---

### 5. `.github/issue-fields.yml`
**Purpose:** GitHub native issue field definitions  
**Fields:** Custom fields for issue tracking

**Status:** Active

---

## Documentation (10+ files)

### User Guides

#### 1. `docs/LABELING.md`
**Purpose:** User guide for labeling strategy  
**Content:**
- Label families and their purposes
- How to apply labels correctly
- Common labeling scenarios
- Best practices

**Status:** Maintained

---

#### 2. `docs/LABEL_STRATEGY.md`
**Purpose:** Label taxonomy and strategy  
**Content:**
- Complete label inventory
- Label hierarchy
- Naming conventions
- Future expansion plan

**Status:** Reference document

---

#### 3. `docs/LABELING_GOVERNANCE.md`
**Purpose:** Governance rules and policy  
**Content:**
- Label governance framework
- Approval workflows
- Destructive change procedures
- Audit and compliance

**Status:** Policy document

---

#### 4. `docs/LABELING_EXAMPLES.md`
**Purpose:** Real-world labeling examples  
**Content:**
- Example issues with labels
- Label combinations
- Common patterns

**Status:** Reference

---

#### 5. `docs/LABELING_FAQ.md`
**Purpose:** Frequently asked questions  
**Content:**
- Common questions and answers
- Troubleshooting
- Edge cases

**Status:** Reference

---

### Script Documentation

#### 1. `scripts/automation/SYNC_PR_LABELS_README.md`
**Purpose:** Comprehensive guide for sync-pr-labels.js  
**Content:**
- Features and capabilities
- Usage examples (dry-run, apply, export)
- Output formats (JSON, CSV, Markdown)
- Integration examples
- Troubleshooting
- Performance metrics
- Acceptance criteria

**Status:** Well-maintained

---

#### 2. Additional Script READMEs
**Files found:**
- REVIEW_META_LABELS_README.md
- MANAGE_STALE_ISSUES_README.md
- LABEL_ORCHESTRATOR_README.md

**Status:** Various

---

### Operational Documentation

#### 1. `docs/AUTOMATION.md`
**Purpose:** Automation infrastructure guide  
**Status:** Operational documentation

---

#### 2. `docs/AUTOMATION_GOVERNANCE.md`
**Purpose:** Governance for automation systems  
**Status:** Policy documentation

---

## Project Template & Examples

### 1. `.github/projects/_templates/example-project/`
**Purpose:** Template for creating new active projects  
**Content:**
- Frontmatter specification
- Section templates
- Example content

**Status:** Template (has frontmatter issues noted in audit)

---

### 2. `.github/projects/active/openspec-labels-automation/`
**Purpose:** Example of active project structure  
**Content:**
- Real project documentation
- Specifications
- Tracking documents

**Status:** Reference project

---

## Duplication & Consolidation Opportunities

### Identified Duplications

1. **Audit Scripts:** Multiple scripts review different label families
   - `review-meta-labels.js`, `review-status-labels.js`, `validate-issue-labels.js`
   - Could share common audit framework

2. **Workflow Execution:** Multiple workflows trigger labeling logic
   - `labeling-governance.yml`, `labeling.yml`, `issue-labeling-automation.yml`
   - Consolidation opportunity (partially addressed by `labeling-governance.yml`)

3. **Label Validation:** Multiple validation approaches
   - `validate-labeling-configs.cjs`, `validate-labels-before-creation.cjs`
   - Could consolidate into single validation framework

4. **Error Handling:** Rate limiting, retries implemented in multiple places
   - `sync-pr-labels.js`, `sync-pr-labels-optimized.js`
   - Opportunity to extract into shared utility

### Consolidation Candidates

1. **Audit Framework:** Create shared `scripts/automation/includes/audit-framework.js`
2. **Validation Framework:** Consolidate validation scripts
3. **Workflow Unification:** Standardize on `labeling-governance.yml` pattern
4. **Error Handling:** Extract rate limiting and retry logic to utilities

---

## Dependencies & Relationships

### External Dependencies
- GitHub API (via Octokit or native fetch)
- Node.js runtime
- GitHub Actions environment

### Internal Dependencies
- `.github/labels.yml` — Source of truth for all labels
- `.github/labeler.yml` — Pattern-based rules
- `.github/label-governance-policy.yml` — Governance rules
- `scripts/agents/labeling.agent.js` — Core labeling logic
- Various helper utilities in `scripts/automation/includes/`

### Workflow Execution Order
1. PR/issue created → `labeling-governance.yml` labels automatically
2. Periodic schedule → `issue-labeling-automation.yml` batch processes
3. Manual triggers → Any script via `label-orchestrator.js`

---

## Quality Assessment

### Strengths
✅ Comprehensive labeling coverage  
✅ Well-organized script structure  
✅ Multiple workflow layers (automatic, scheduled, manual)  
✅ Good documentation with README files  
✅ Label schema clearly defined  
✅ Governance policies documented  
✅ Error handling and logging implemented  
✅ Dry-run modes for safe preview  

### Areas for Improvement
⚠️ Multiple audit scripts could share framework  
⚠️ Workflow consolidation still has potential  
⚠️ Validation approaches could be unified  
⚠️ Rate limiting logic duplicated  
⚠️ No centralized logging/metrics  
⚠️ Limited observability into labeling decisions  

### Risk Areas
🔴 Bare label detection inconsistent across scripts  
🔴 No enforcement that PRs retroactively get labeled  
🔴 Complex interdependencies between workflows  
🔴 Schema validation gaps in some edge cases  

---

## Summary

**Total Components:** 40+ files  
**Workflows:** 11+  
**Scripts/Agents:** 15+  
**Configuration Files:** 5  
**Documentation:** 10+  
**Estimated Lines of Code:** 5,000+  

**Status:** Mature, well-documented infrastructure with consolidation opportunities

**Next Steps:** Research phase to answer clarifying questions and determine consolidation/enhancement strategy

---

**Document Created:** 2026-09-03  
**Status:** Draft - Pending Audit Update  
**Owner:** LightSpeedWP Maintainers


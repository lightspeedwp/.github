---
file_type: documentation
title: "Comprehensive Documentation & Automation Audit Prompt"
description: "Detailed step-by-step prompt for creating GitHub issues to audit and fix documentation, templates, labeling, and automation systems"
version: "1.1.0"
created_date: "2026-05-31"
last_updated: "2026-06-08"
status: active
owners:
  - lightspeedwp/maintainers
---

# Comprehensive Documentation & Automation Audit Prompt

**Purpose:** This document provides a detailed, step-by-step prompt for creating GitHub issues that will audit, fix, and consolidate all documentation, templates, canonical configurations, and automation systems in the LightSpeed `.github` repository.

**Goal:** Clear, correct, and complete documentation will guide the next steps for fixing the automated labeling system and ensuring AI agents can properly create issues that trigger correct automation.

**Status:** Ready for execution. Use this to create parent issues and child issues in GitHub.

## Quick Start (Execution Order)

1. Validate baseline inventory and paths (README count, templates, canonical config files).
2. Create the 5 parent issues from Part 2.
3. Create child issues under each parent using Part 3 + Part 4.
4. Link parent/child relationships and confirm label automation outcomes.
5. Track progress in the active project file and add audit findings as issue comments.

## Baseline Verification (Run First)

Run these checks before creating issues so counts and paths are current:

```bash
rg --files -g '**/README.md' | wc -l
rg --files .github/ISSUE_TEMPLATE
rg --files .github | rg 'labels\.yml|labeler\.yml|issue-types\.yml|issue-fields\.yml'
```

Use actual results in issue bodies instead of stale hard-coded counts.

---

## Part 1: Overview & Problem Statement

### Current State

- **Issue labeling system:** Broken or inconsistent (PR labeling works fine)
- **Documentation:** Scattered across 40+ files with duplication and overlap
- **Templates:** Issue, PR, and Discussion templates exist but AI agents don't consistently use them
- **File organization:** Misalignment between planned structure and current state
- **README files:** Large and growing inventory across the repo with outdated or missing Mermaid diagrams in multiple locations
- **Canonical configs:** `labels.yml`, `labeler.yml`, `issue-types.yml`, `issue-fields.yml` exist but may be incomplete/inconsistent

### Root Causes

1. Templates are not well-documented in relation to how they trigger automation
2. Labeling rules in `labeler.yml` don't cover issue scenarios (only PR/branch scenarios)
3. Documentation doesn't clearly explain HOW an AI agent should structure an issue to trigger proper automation
4. File organization doesn't follow the planned structure outlined in CLAUDE.md
5. README files are outdated and lack Mermaid diagrams for accessibility

### Expected Outcome

Once these audits are complete:

- Documentation will clearly explain the entire issue/PR/automation flow
- Templates will be consolidated and deduplicated
- Canonical configs will be verified and updated for consistency
- File organization will match CLAUDE.md boundaries
- README files will have accessible Mermaid diagrams
- AI agents will have clear instructions for creating properly-formatted issues

---

## Part 2: Parent Issues Structure

Create the following **parent issues** in GitHub. Each parent issue will have multiple child issues attached.

### Parent Issue 1: Issue Templates & Automation Integration Audit

**Title:** `[Audit] Issue Templates, Automation, & AI Agent Integration`
**Type:** `type:audit`
**Area:** `area:automation`, `area:labels`
**Priority:** `priority:important`
**Status:** `status:needs-triage`
**Effort:** `M` (Medium)

**Description:**

```markdown
## Overview

Comprehensive audit of issue templates, their relationship to the automated labeling system,
and how AI agents should create issues to trigger proper automation.

## Current Problems

1. Issue templates exist (.github/ISSUE_TEMPLATE/*.md) but don't consistently trigger automation
2. PR templates work well, but issue templates don't map clearly to labeling rules
3. `labeler.yml` has rules for PRs and branches, but minimal rules for issues
4. AI agents don't have clear instructions on how to structure issues for automation

## Areas to Audit

See child issues for detailed audits of:
- Issue template inventory and standardization
- Mapping between templates and automation triggers
- Missing automation rules in labeler.yml for issue types
- AI agent instructions for issue creation

## Acceptance Criteria

- [ ] All issue templates audited and categorized
- [ ] Clear mapping between template usage and automation triggers
- [ ] Labeler.yml rules for issues identified and documented
- [ ] AI agent instructions for issue creation updated

## Related Files

- `.github/ISSUE_TEMPLATE/` (all files)
- `.github/ISSUE_TEMPLATE/config.yml`
- `.github/ISSUE_TEMPLATE/README.md`
- `.github/labeler.yml` (issue rules section)
- `.github/issue-types.yml`
- `docs/ISSUE_CREATION_GUIDE.md`
- `.github/custom-instructions.md`
```

---

### Parent Issue 2: Canonical Configuration Files Audit & Standardization

**Title:** `[Audit] Canonical Config Files (labels, issue-types, issue-fields)`
**Type:** `type:audit`
**Area:** `area:labels`, `area:automation`
**Priority:** `priority:important`
**Status:** `status:needs-triage`
**Effort:** `L` (Large)

**Description:**

```markdown
## Overview

Comprehensive audit of canonical configuration files that define labels, issue types,
issue fields, and how they relate to each other.

## Current Problems

1. `labels.yml` has 200+ labels but many are grey and don't follow the color strategy
2. `issue-types.yml` defines 26 issue types but mapping to templates is unclear
3. `issue-fields.yml` defines custom fields but their usage in templates is unclear
4. No clear documentation on how these files work together or how to extend them
5. Inconsistencies between canonical files and documentation

## Areas to Audit

See child issues for detailed audits of:
- Label color consistency and family grouping
- Issue type mapping and template correlation
- Issue fields configuration and GitHub API alignment
- Relationship and interdependencies between config files
- Missing or unused labels/types

## Acceptance Criteria

- [ ] All labels verified against color strategy
- [ ] Issue type definitions aligned with templates
- [ ] Issue fields configuration validated
- [ ] All interdependencies documented
- [ ] Deprecations and removals identified

## Related Files

- `.github/labels.yml`
- `.github/labeler.yml`
- `.github/issue-types.yml`
- `.github/issue-fields.yml`
- `docs/LABEL_STRATEGY.md`
- `docs/LABELING.md`
- `docs/ISSUE_TYPES.md`
- `docs/ISSUE_FIELDS.md`
```

---

### Parent Issue 3: Documentation Consolidation & Deduplication

**Title:** `[Audit] Documentation Consolidation - Reduce Duplication Across Docs`
**Type:** `type:audit`
**Area:** `area:documentation`
**Priority:** `priority:important`
**Status:** `status:needs-triage`
**Effort:** `XL` (Extra Large)

**Description:**

```markdown
## Overview

Audit of 40+ documentation files across `docs/` to identify duplication,
overlap, and opportunities for consolidation.

## Current Problems

1. Multiple files document similar topics (e.g., 3-4 files on PR creation)
2. Files reference each other with inconsistent linking patterns
3. Some documentation is in `docs/`, some in `.github/`, some in `instructions/`
4. Duplication makes updates difficult and creates sync/consistency issues
5. Documentation index (`docs/index.md`) is incomplete or outdated

## Areas to Audit

See child issues for detailed audits of:
- Issue creation documentation (4+ files involved)
- PR creation documentation (3+ files involved)
- Labeling documentation (3+ files involved)
- Automation governance documentation (2+ files involved)
- File organization and folder structure alignment
- Documentation index and cross-referencing

## Acceptance Criteria

- [ ] All docs audited and duplication mapped
- [ ] Consolidation strategy created
- [ ] Obsolete files identified for archival
- [ ] Updated cross-reference links documented

## Related Files

- `docs/` (all .md files)
- `docs/index.md`
- `.github/README.md`
- README.md (root)
- Various .instructions.md files in instructions/
```

---

### Parent Issue 4: README & Mermaid Diagram Audit (Accessibility & Freshness)

**Title:** `[Audit] README Files - Mermaid Diagrams & Accessibility Review`
**Type:** `type:audit`
**Area:** `area:documentation`, `area:a11y`
**Priority:** `priority:normal`
**Status:** `status:needs-triage`
**Effort:** `XL` (Extra Large)

**Description:**

```markdown
## Overview

Comprehensive audit of README.md files across the repository to verify
Mermaid diagram syntax, accessibility compliance, and content freshness.

## Current Problems

1. Mermaid diagrams may have syntax errors or be outdated
2. Diagrams may lack accessibility attributes (accTitle, accDescr)
3. Diagrams may not work in light/dark mode
4. README content may be outdated or incomplete
5. No systematic way to verify diagram accessibility compliance

## Areas to Audit

See child issues for detailed audits of:
- Root & core README files
- Feature folder README files
- Sub-folder README files
- Test/config README files
- Mermaid diagram syntax validation
- Accessibility compliance (WCAG AA)
- Light/dark mode rendering

## Acceptance Criteria

- [ ] All README files inventoried using reproducible discovery command
- [ ] Mermaid diagram syntax validated
- [ ] Accessibility attributes added where needed
- [ ] Content freshness verified and updated
- [ ] Audit report generated

## Related Files

All README.md files across the repository (see audit report for inventory)

## Related Issues

- [#512](https://github.com/lightspeedwp/.github/issues/512) (Wave 3A: README & Mermaid Diagram Discovery & Audit)
- [#513](https://github.com/lightspeedwp/.github/issues/513) (Wave 3B: README & Mermaid Diagram Repair & Update)
```

---

### Parent Issue 5: File Organization & Structure Alignment with CLAUDE.md

**Title:** `[Audit] File Organization - Align with CLAUDE.md Repository Boundaries`
**Type:** `type:audit`
**Area:** `area:core`
**Priority:** `priority:normal`
**Status:** `status:needs-triage`
**Effort:** `L` (Large)

**Description:**

```markdown
## Overview

Audit current file organization against the planned structure defined in CLAUDE.md
and identify misalignments requiring refactoring.

## Current Problems

1. `.github/agents/` still exists but agents moved to `/agents` in root
2. `.github/scripts/` exists but scripts moved to `/scripts` in root
3. `.github/schemas/` exists but should be `/schema` or `/schemas` in root
4. Documentation in both `docs/` and `.github/docs/`
5. Uncertainty about which folders are reusable vs. GitHub-native

## Areas to Audit

See child issues for detailed audits of:
- `.github/` contents vs. root-level portable assets
- Agent file locations and migration status
- Script file locations and migration status
- Schema/config file locations
- Documentation folder organization
- Workflows folder structure
- Instructions folder organization

## Acceptance Criteria

- [ ] Current state mapped against CLAUDE.md
- [ ] All misalignments documented
- [ ] Migration plan for files created
- [ ] Impact assessment completed

## Related Files

- `CLAUDE.md` (source of truth)
- `.github/` (all folders)
- `agents/`
- `scripts/`
- `.schemas/` or `schemas/`
- `workflows/`
- `instructions/`
```

---

## Part 3: Child Issues Template

For each parent issue above, create the following child issues using this template. Replace `[PARENT]` with the parent issue number and customize titles/descriptions.

### Child Issue Template: Specific Component Audit

**Title:** `[Child of #PARENT] Audit: [Specific Component/Area]`
**Type:** `type:audit`
**Area:** `area:automation` or `area:documentation` (as appropriate)
**Priority:** `priority:normal` or `priority:important`
**Status:** `status:needs-triage`
**Effort:** `S` to `M` (Small to Medium, adjust per scope)
**Parent Issue:** `#PARENT`

**Description:**

```markdown
## Overview

[Brief description of what this child issue audits]

## Scope

- [Specific file/folder/component]
- [Related configuration or documentation]
- [Expected outcome]

## Audit Checklist

- [ ] [Specific check 1]
- [ ] [Specific check 2]
- [ ] [Specific check 3]

## Deliverables

- Audit report (as issue comment with findings)
- List of identified issues
- Recommendations for fixes
- (Optional) Create follow-up issues for fixes

## Related Files

- [Link to relevant files]

## References

- [Links to related documentation]
```

---

## Part 4: Specific Child Issues to Create

### Under Parent Issue 1: Issue Templates & Automation

#### Child 1.1: Audit Issue Template Inventory

**Title:** `[Child of #] Audit: Issue Template Inventory & Standardization`

- Inventory all `.md` files in `.github/ISSUE_TEMPLATE/`
- Check if each template has required frontmatter
- Verify each template's relationship to an issue type in `issue-types.yml`
- Document which templates are actively used vs. deprecated
- Check config.yml for completeness

**Deliverable:** Spreadsheet showing: Template Name | Issue Type | Status | Last Updated | Used? | Notes

---

#### Child 1.2: Audit Issue Template to Automation Trigger Mapping

**Title:** `[Child of #] Audit: Issue Template → Automation Trigger Mapping`

- For each issue template, document what automation should trigger
- Check if issue templates set up frontmatter that triggers labeling
- Compare with PR templates to understand the gap
- Identify missing automation rules in `labeler.yml` for issue scenarios
- Document how AI agents should structure issues for proper automation

**Deliverable:** Mapping document showing Template → Expected Automation → Current Status → Missing Pieces

---

#### Child 1.3: Audit Issue Labeling Rules in labeler.yml

**Title:** `[Child of #] Audit: Issue Labeling Rules in labeler.yml`

- Review `.github/labeler.yml` for issue-specific rules
- Compare coverage between PR rules and issue rules
- Identify gaps (e.g., file path-based rules for issues)
- Document current issue detection heuristics
- Check if content/title-based rules exist for issues

**Deliverable:** Report of current issue rules, gaps, and recommendations

---

#### Child 1.4: Create AI Agent Instructions for Issue Creation

**Title:** `[Child of #] Implement: Clear AI Agent Instructions for Issue Creation`

- Write clear, step-by-step instructions for how AI agents should create issues
- Include template selection guidelines
- Include frontmatter structure for issue automation
- Include label assignment strategy
- Include examples of well-formed issues

**Deliverable:** New or updated `.github/custom-instructions.md` section for AI agents on issue creation

---

### Under Parent Issue 2: Canonical Configuration Files

#### Child 2.1: Audit labels.yml Colour Consistency

**Title:** `[Child of #] Audit: labels.yml Colour Consistency & Strategy Alignment`

- Review all 200+ labels in `labels.yml`
- Check if each label's color matches the documented strategy
- Identify grey labels that should have family colors
- Verify color hex codes are valid
- Document color family assignments (status, priority, type, area, etc.)

**Deliverable:** Report showing: Label Name | Current Color | Expected Color | Family | Status

---

#### Child 2.2: Audit Issue Types Mapping

**Title:** `[Child of #] Audit: Issue Types Alignment with Templates & Labels`

- Review all issue types in `issue-types.yml`
- Verify each type has a matching issue template
- Verify each type has a matching label in `labels.yml`
- Check if type colors match label colors
- Identify unused types or orphaned templates

**Deliverable:** Mapping table: Issue Type | Template | Label | Color Match | Status

---

#### Child 2.3: Audit Issue Fields Configuration

**Title:** `[Child of #] Audit: Issue Fields Configuration vs. GitHub API`

- Review `issue-fields.yml` configuration
- Verify custom fields are properly defined
- Check field mappings to GitHub API
- Verify field values match what GitHub supports
- Test field creation/update via automation

**Deliverable:** Validation report with test results and recommended fixes

---

#### Child 2.4: Document Config File Relationships

**Title:** `[Child of #] Document: Canonical Config File Interdependencies`

- Create comprehensive diagram showing how labels.yml, issue-types.yml, labeler.yml, and issue-fields.yml relate
- Document the flow from issue creation → template selection → type assignment → label application → field population
- Identify all dependencies and relationships
- Document which tools/agents use which configs

**Deliverable:** Relationship diagram (Mermaid) + documentation in new file `docs/CANONICAL_CONFIGS_GUIDE.md`

---

### Under Parent Issue 3: Documentation Consolidation

#### Child 3.1: Audit Issue Creation Documentation

**Title:** `[Child of #] Audit: Issue Creation Docs - Consolidate Overlapping Files`

- Review all files related to issue creation:
  - `docs/ISSUE_CREATION_GUIDE.md`
  - `docs/LABELING.md`
  - `docs/ISSUE_TYPES.md`
  - `.github/ISSUE_TEMPLATE/README.md`
  - `docs/index.md` (if references issues)
  - `instructions/issues.instructions.md`
- Identify duplication and overlap
- Propose consolidation strategy
- Document which information should live where

**Deliverable:** Consolidation matrix showing current location, content, and proposed new location

---

#### Child 3.2: Audit PR Creation Documentation

**Title:** `[Child of #] Audit: PR Creation Docs - Consolidate Overlapping Files`

- Review all files related to PR creation:
  - `docs/PR_CREATION_PROCESS.md`
  - `docs/LABELING.md`
  - `.github/PULL_REQUEST_TEMPLATE/README.md`
  - `instructions/pull-requests.instructions.md`
  - `docs/BRANCHING_STRATEGY.md`
- Identify duplication and overlap
- Propose consolidation strategy

**Deliverable:** Consolidation matrix

---

#### Child 3.3: Audit Labeling Documentation

**Title:** `[Child of #] Audit: Labeling Docs - Consolidate Overlapping Files`

- Review all files related to labeling:
  - `docs/LABEL_STRATEGY.md`
  - `docs/LABELING.md`
  - `docs/LABEL_INVENTORY.md`
  - `docs/LABEL_COLOR_STRATEGY.md`
  - `docs/AUTOMATION.md` (label section)
  - Agent specs for labeling
- Identify duplication and overlap
- Propose single source of truth for labeling

**Deliverable:** Consolidation matrix + proposed new structure

---

#### Child 3.4: Audit File Organization Alignment

**Title:** `[Child of #] Audit: Documentation Folder Structure vs. CLAUDE.md Boundaries`

- Review `.github/`, `docs/`, `instructions/` folder structure
- Compare against CLAUDE.md guidance for where documentation should live
- Identify misplaced files
- Propose reorganization plan

**Deliverable:** Reorganization plan with source → destination mapping

---

#### Child 3.5: Update Documentation Index

**Title:** `[Child of #] Update: Documentation Index (docs/index.md) - Complete & Current`

- Review current `docs/index.md`
- Add/update all documentation files
- Organize by topic (issue creation, PR creation, labeling, automation, etc.)
- Add brief description for each file
- Add link to related template/config files

**Deliverable:** Updated `docs/index.md` with complete inventory and organization

---

### Under Parent Issue 4: README & Mermaid Diagrams

#### Child 4.1: Discover & Audit All README Files

**Title:** `[Child of #] Audit: Discover All README.md Files - Inventory`

- Use reproducible discovery command to find all README.md files
- Create inventory spreadsheet with location, size, last updated, mermaid diagrams present
- Categorize by: Root/Core, Feature folders, Sub-folders, Test/Config
- Check each README for broken links, outdated content
- Identify which ones have Mermaid diagrams

**Deliverable:** Spreadsheet/CSV showing all discovered READMEs with metadata and issues found

---

#### Child 4.2: Validate Mermaid Diagram Syntax

**Title:** `[Child of #] Audit: Validate Mermaid Syntax in All Diagrams`

- For each README with Mermaid diagrams, validate syntax
- Check for parse errors
- Verify diagram type support
- Test rendering in Mermaid Live
- Document errors and required fixes

**Deliverable:** Report showing which diagrams have syntax errors and specific fixes needed

---

#### Child 4.3: Audit Mermaid Accessibility Compliance

**Title:** `[Child of #] Audit: Mermaid Diagram Accessibility (WCAG AA, Light/Dark Mode)`

- For each Mermaid diagram, check for accessibility attributes:
  - `accTitle` (accessible title)
  - `accDescr` (accessible description)
- Test diagrams in light and dark mode
- Verify color contrast (WCAG AA standards)
- Document which diagrams need accessibility improvements

**Deliverable:** Accessibility audit report with fixes for each diagram

---

#### Child 4.4: Update README Content & Diagrams

**Title:** `[Child of #] Update: Fix & Refresh README Files with Current Information`

This is the implementation phase following audits:

- Update outdated content
- Fix broken links
- Add/update Mermaid diagrams with proper accessibility
- Ensure consistent formatting across all READMEs
- Add brief descriptions of folder/file purpose

**Deliverable:** All in-scope READMEs updated with current information and accessible diagrams

---

### Under Parent Issue 5: File Organization Alignment

#### Child 5.1: Audit Current vs. Planned File Organization

**Title:** `[Child of #] Audit: Current File Organization vs. CLAUDE.md Boundaries`

- Map current structure of `.github/`, root folders, etc.
- Compare against CLAUDE.md definitions for reusable vs. GitHub-native assets
- Identify misplacements
- Document what's in the wrong place

**Deliverable:** Mapping document showing Current Location | Expected Location (per CLAUDE.md) | Status

---

#### Child 5.2: Audit Agent & Script File Locations

**Title:** `[Child of #] Audit: Agent & Script Files - Migration Status`

- Check if `.github/agents/` still exists (should have moved to `/agents`)
- Check if `.github/scripts/` exists (should have moved to `/scripts`)
- Verify what remains in `.github/` vs. what's in root folders
- Document migration status for each file

**Deliverable:** Migration status report

---

#### Child 5.3: Create File Organization & Migration Plan

**Title:** `[Child of #] Plan: File Organization Refactoring - Migration & Validation`

- Create detailed plan for reorganizing files to match CLAUDE.md
- Include impact assessment (what breaks if we move X?)
- Include validation checklist (how to verify moves worked?)
- Include rollback plan (how to recover if something goes wrong?)
- Create implementation timeline

**Deliverable:** Detailed migration plan with checklists and timeline

---

## Part 5: Issue Creation Instructions

### How to Use This Prompt

1. **Create Parent Issues First:**
   - Copy each "Parent Issue" section above
   - Use the template provided (Title, Type, Area, etc.)
   - Paste the description into GitHub issue body
   - Leave the "Child Issues" section for later

2. **Create Child Issues:**
   - For each parent issue, copy the relevant child issue sections
   - Create each child issue in GitHub
   - In the child issue body, add: `**Parent Issue:** #PARENT_NUMBER`
   - Use GitHub issue linking to link parent ↔ child

3. **Linking Parent & Child Issues:**
   - Use GitHub's parent issue feature (if available)
   - Or add explicit link in both issues: "**Parent:** #NNN" and "**Child:** #MMM"

4. **Automation & Labels:**
   - Let the automated labeling system assign labels
   - Don't manually force labels; trust the automation
   - If automation doesn't work, that's evidence to debug!

5. **Tracking & Execution:**
   - Update the active projects file as issues are created
   - Track progress by marking issues as "In Progress" → "Complete"
   - Review each audit before moving to implementation

### Required Quality Gates (Per Issue)

- Include an explicit scope boundary (`in-scope` and `out-of-scope`).
- Include measurable acceptance criteria.
- Include a deliverable format (`report`, `matrix`, `diagram`, or `patch`).
- Include exact related file paths (no ambiguous references).
- Record automation outcome after issue creation (labels/fields applied vs missing).

### Command-Line Approach (Using GitHub CLI)

If you prefer to create all issues via CLI:

```bash
# Create parent issue 1
gh issue create \
  --title "[Audit] Issue Templates, Automation, & AI Agent Integration" \
  --body-file issue-1-parent.md \
  --label "type:audit,area:automation,area:labels,priority:important" \
  --milestone "Documentation Audit Sprint"

# Create child issue 1.1
gh issue create \
  --title "[Child] Audit: Issue Template Inventory & Standardization" \
  --body-file issue-1-1-child.md \
  --label "type:audit,area:documentation,priority:normal" \
  --milestone "Documentation Audit Sprint"
```

---

## Part 6: Success Criteria & Next Steps

### Success Criteria for This Audit Phase

- [ ] All 5 parent issues created in GitHub
- [ ] All ~25 child issues created in GitHub
- [ ] All parent/child relationships linked
- [ ] Audit issues assigned to appropriate team members
- [ ] Active projects file updated with issue references
- [ ] Baseline inventory evidence attached (README count + config file discovery output)

### Next Steps (After Audits Complete)

1. Review audit findings and consolidate into implementation plan
2. Create implementation issues based on audit recommendations
3. Execute implementations in waves (following existing pattern)
4. Update templates, configs, documentation based on findings
5. Verify automated labeling system works for issues
6. Document the complete flow for AI agents

---

## Part 7: Related Context

### Existing Related Issues

- [#512](https://github.com/lightspeedwp/.github/issues/512) — Wave 3A: README & Mermaid Diagram Discovery & Audit
- [#513](https://github.com/lightspeedwp/.github/issues/513) — Wave 3B: README & Mermaid Diagram Repair & Update
- [#519](https://github.com/lightspeedwp/.github/issues/519) — Documentation Index & Quickstart Guide (merged)

### Created Audit Issue Set (2026-06-08)

- Parent issues: [#902](https://github.com/lightspeedwp/.github/issues/902), [#903](https://github.com/lightspeedwp/.github/issues/903), [#904](https://github.com/lightspeedwp/.github/issues/904), [#905](https://github.com/lightspeedwp/.github/issues/905), [#906](https://github.com/lightspeedwp/.github/issues/906)
- Child issues: [#907](https://github.com/lightspeedwp/.github/issues/907), [#908](https://github.com/lightspeedwp/.github/issues/908), [#909](https://github.com/lightspeedwp/.github/issues/909), [#910](https://github.com/lightspeedwp/.github/issues/910), [#911](https://github.com/lightspeedwp/.github/issues/911), [#912](https://github.com/lightspeedwp/.github/issues/912), [#913](https://github.com/lightspeedwp/.github/issues/913), [#914](https://github.com/lightspeedwp/.github/issues/914), [#916](https://github.com/lightspeedwp/.github/issues/916), [#917](https://github.com/lightspeedwp/.github/issues/917), [#918](https://github.com/lightspeedwp/.github/issues/918), [#919](https://github.com/lightspeedwp/.github/issues/919), [#920](https://github.com/lightspeedwp/.github/issues/920), [#921](https://github.com/lightspeedwp/.github/issues/921), [#922](https://github.com/lightspeedwp/.github/issues/922), [#923](https://github.com/lightspeedwp/.github/issues/923), [#924](https://github.com/lightspeedwp/.github/issues/924), [#925](https://github.com/lightspeedwp/.github/issues/925), [#926](https://github.com/lightspeedwp/.github/issues/926), [#927](https://github.com/lightspeedwp/.github/issues/927)
- URL list:
  - <https://github.com/lightspeedwp/.github/issues/902>
  - <https://github.com/lightspeedwp/.github/issues/903>
  - <https://github.com/lightspeedwp/.github/issues/904>
  - <https://github.com/lightspeedwp/.github/issues/905>
  - <https://github.com/lightspeedwp/.github/issues/906>
  - <https://github.com/lightspeedwp/.github/issues/907>
  - <https://github.com/lightspeedwp/.github/issues/908>
  - <https://github.com/lightspeedwp/.github/issues/909>
  - <https://github.com/lightspeedwp/.github/issues/910>
  - <https://github.com/lightspeedwp/.github/issues/911>
  - <https://github.com/lightspeedwp/.github/issues/912>
  - <https://github.com/lightspeedwp/.github/issues/913>
  - <https://github.com/lightspeedwp/.github/issues/914>
  - <https://github.com/lightspeedwp/.github/issues/916>
  - <https://github.com/lightspeedwp/.github/issues/917>
  - <https://github.com/lightspeedwp/.github/issues/918>
  - <https://github.com/lightspeedwp/.github/issues/919>
  - <https://github.com/lightspeedwp/.github/issues/920>
  - <https://github.com/lightspeedwp/.github/issues/921>
  - <https://github.com/lightspeedwp/.github/issues/922>
  - <https://github.com/lightspeedwp/.github/issues/923>
  - <https://github.com/lightspeedwp/.github/issues/924>
  - <https://github.com/lightspeedwp/.github/issues/925>
  - <https://github.com/lightspeedwp/.github/issues/926>
  - <https://github.com/lightspeedwp/.github/issues/927>

### Existing Active Project Files

- `next-issues-execution-plan.md` (update with new audit issues)
- `launch-agents-checklist.md` (track testing of new automation)

### Key Documentation Files (Source of Truth)

- `CLAUDE.md` — Repository boundaries and structure
- `docs/LABEL_STRATEGY.md` — Label philosophy and strategy
- `docs/AUTOMATION.md` — Automation standards
- `.github/labels.yml` — Canonical label definitions
- `.github/issue-types.yml` — Canonical issue type definitions
- `.github/issue-fields.yml` — Canonical issue field definitions

---

## Part 8: Execution Timeline

### Proposed Wave Timeline

- **Week 1:** Create all audit issues (parent + child)
- **Week 2-3:** Execute audits (investigations, gather findings)
- **Week 4:** Review audit findings, consolidate recommendations
- **Week 5+:** Execute implementations based on audit outcomes

### Checkpoints

- After issue creation: Verify all issues linked correctly
- After each audit: Review findings and document in issue comments
- Before implementation: Consolidate all findings into implementation plan

---

**Document Status:** Ready for execution

**Next Action:** Use the structures and templates above to create GitHub issues. Share issue numbers and update this document once created.

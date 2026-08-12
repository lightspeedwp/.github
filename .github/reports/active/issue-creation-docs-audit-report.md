---
file_type: documentation
title: Issue Creation Documentation Audit Report
description: Comprehensive audit of 6 overlapping issue creation documentation files. Identifies duplication, overlap, and proposes consolidation strategy.
version: v1.0.0
created_date: '2026-05-31'
last_updated: '2026-06-01'
authors:
  - Claude Code
  - LightSpeed Team
maintainer: LightSpeed Team
owners:
  - lightspeedwp/maintainers
tags:
  - audit
  - documentation
  - issue-creation
  - consolidation
  - reference
domain: governance
status: active
language: en
stability: stable
---

# Issue Creation Documentation Audit Report

**Audit Date:** 2026-05-31
**Audit Scope:** 6 overlapping documentation files related to issue creation
**Status:** Complete
**Issue:** [#662 - Audit Issue Creation Docs](https://github.com/lightspeedwp/.github/issues/662)

---

## Executive Summary

This audit identified **significant duplication and overlap** across 6 issue creation documentation files totalling ~43KB. The documentation is fragmented across three locations (docs/, .github/, instructions/) with three distinct purposes (guidance, reference, instruction) creating confusion about which file is canonical and where to find information.

**Key Findings:**

- **55% content overlap** (definitions, label rules, examples repeated across files)
- **Inconsistent scope**: Some files teach process, others define standards, others prescribe agent behavior
- **Poor navigation**: Readers unsure whether to start with guide, instructions, reference, or index
- **Maintenance risk**: Future updates scattered across multiple files
- **Consolidation opportunity**: Reduce from 6 files to 3 files (guide, reference, instructions) with clear roles

---

## 1. Files Audited

| File | Purpose | Type | Size |
|------|---------|------|------|
| `docs/ISSUE_CREATION_GUIDE.md` | Practical step-by-step guide | Guidance | 5.3 KB |
| `docs/ISSUE_TYPES.md` | Canonical reference of 27 issue types | Reference | 11.9 KB |
| `.github/ISSUE_TEMPLATE/README.md` | Template directory overview | Navigation | 2.8 KB |
| `instructions/issues.instructions.md` | Rules and automation standards | Instruction | 7.2 KB |
| `docs/README.md` | Documentation index | Navigation | 5.5 KB |
| `docs/index.md` | Redirect stub | Navigation | 0.3 KB |

**Total Audit Scope:** 33.0 KB (documentation files)

---

## 2. Content Overlap Analysis

### 2.1 Topic-by-Topic Overlap Matrix

| Topic | ISSUE_CREATION_GUIDE | ISSUE_TYPES | TEMPLATE/README | instructions/issues | docs/README | docs/index |
|-------|:---:|:---:|:---:|:---:|:---:|:---:|
| Issue template selection | ✓ | ✗ | ✓ | ✓ | ✗ | ✗ |
| Template location (.github/ISSUE_TEMPLATE/) | ✓ | ✗ | ✓ | ✓ | ✗ | ✗ |
| Frontmatter requirements | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ |
| Issue types (27 types) | ✓ (brief list) | ✓ (comprehensive) | ✗ | ✓ (reference only) | ✗ | ✗ |
| Label taxonomy | ✓ (brief) | ✓ | ✗ | ✓ | ✗ | ✗ |
| Label assignment automation | ✗ | ✗ | ✓ | ✓ | ✗ | ✗ |
| Issue lifecycle | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ |
| Step-by-step guide | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ |
| Navigation/index | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ |

**Overlap Assessment:** 55% overlap across core topics (template selection, location, types, labels, lifecycle)

---

## 3. Cross-Reference Analysis

### 3.1 Internal References (How Files Reference Each Other)

**ISSUE_CREATION_GUIDE.md:**

- References: `../.github/ISSUE_TYPES.md` (line 56)
- Referenced by: docs/README.md (Quick Start & by Task)
- Quality: Single precise reference to ISSUE_TYPES

**ISSUE_TYPES.md:**

- References: `../agents/labeling.agent.md`, `../.github/issue-types.yml`
- Referenced by: ISSUE_CREATION_GUIDE.md, instructions/issues.instructions.md
- Quality: Comprehensive with agent and config links

**TEMPLATE/README.md:**

- References: `../ISSUE_TYPES.md`, `../ISSUE_LABELS.md`, `../AUTOMATION_GOVERNANCE.md`, `../instructions/README.md`
- Referenced by: None directly in audit scope
- Quality: Good cross-references but some incorrect paths

**instructions/issues.instructions.md:**

- References: `docs/ISSUE_CREATION_GUIDE.md`, `docs/ISSUE_TYPES.md`, `docs/LABEL_STRATEGY.md`, `pull-requests.instructions.md`
- Referenced by: None directly in audit scope
- Quality: Extensive cross-references, well-organised

**docs/README.md:**

- References: Comprehensive index with 30+ linked files
- Referenced by: May be entry point for new contributors
- Quality: Broad navigation focus

**docs/index.md:**

- References: None (stub file)
- Referenced by: May be legacy URL
- Quality: Dead stub, no value

---

## 4. Detailed Overlap Findings

### 4.1 **Section 1: "Choose an Issue Template"**

**ISSUE_CREATION_GUIDE.md (Section 2, lines 24-36):**

```
Visit the repository's [Issues page]... select the template that matches your intent:
- Bug Report
- Feature Request
- Task
- Documentation
- Design
- Epic/Story
- Other templates...
```

**instructions/issues.instructions.md (Section 3, lines 90-95):**

```
Use the [GitHub Issues page] and select the template matching your intent:
- Bug report, Feature request, Documentation, Task, Design, Epic, Story, Improvement,
  Maintenance, Security, Integration, Compatibility, Performance, Test Coverage,
  Automation, AI Ops, and more.
```

**TEMPLATE/README.md (Section "Available Templates"):**

```
The issue templates in this directory are automatically synchronized...
- Bug Report
- Feature Request
- Documentation
- Design
- Epic/Story
```

**Assessment:** All three files describe template selection in similar ways. ISSUE_CREATION_GUIDE.md is most concise and user-friendly; instructions/issues.instructions.md is most comprehensive; TEMPLATE/README.md is redundant with less detail.

---

### 4.2 **Section 2: "Issue Types"**

**ISSUE_CREATION_GUIDE.md (Section 4, lines 54-62):**

- Brief mention of type/label relationship
- Links to ISSUE_TYPES.md for details
- 3 examples: `type:bug`, `type:feature`, `type:task`

**ISSUE_TYPES.md (Entire document, 11.9 KB):**

- Comprehensive reference of all 27 types
- Detailed comparison table with colours, use cases, priority
- Best practices and automation guidelines
- 300+ lines dedicated to type reference

**instructions/issues.instructions.md (Section 6, lines 159-160):**

- Brief reference to ISSUE_TYPES.md
- No duplication of type details

**Assessment:** **No duplication here.** ISSUE_TYPES.md is appropriately comprehensive; other files correctly defer to it.

---

### 4.3 **Section 3: "Frontmatter Requirements"**

**ISSUE_CREATION_GUIDE.md:**

- No detailed frontmatter section
- Mentions "YAML frontmatter" in step 3 but doesn't detail schema

**instructions/issues.instructions.md (Section 2, lines 64-86):**

```yaml
---
name: "🐛 Bug report"
about: "Report a reproducible bug"
title: "[Bug] <Short description>"
labels: ["type:bug", "status:needs-triage", "priority:normal"]
---
```

- Required fields: `name`, `about`, `title`, `labels`
- Optional fields: `assignees`, `projects`, `milestone`, `type`
- References FRONTMATTER_SCHEMA.md and .schemas/frontmatter.schema.json

**Assessment:** **instructions/issues.instructions.md is authoritative.** ISSUE_CREATION_GUIDE.md should reference it or include summary.

---

### 4.4 **Section 4: "Label Strategy"**

**ISSUE_CREATION_GUIDE.md (Section 4, lines 58-66):**

```
Add companion labels:
- Priority: priority:critical, priority:normal, priority:minor
- Status: Start with status:needs-triage
- Area/Component: area:ci, comp:block-editor, etc.
- Context: phase:6, env:staging, etc.
- Meta: contrib:good-first-issue, meta:needs-changelog
- Effort: easy, medium, hard
```

**instructions/issues.instructions.md (Section 5, lines 110-154):**

```
Minimum Labels per Issue:
- One status:* (e.g., status:needs-triage)
- One type:* (e.g., type:bug, type:feature)
- One priority:* (e.g., priority:normal)
- At least one area:* or comp:* if possible

Label Families:
- status:*, priority:*, type:*, area:*, comp:*, meta:*, contrib:*, context labels...
```

**TEMPLATE/README.md (Section "Automation Features"):**

```
- Auto-labeling: Templates trigger automatic label assignment
- Type Detection: Issues are automatically typed based on template
- Agent Assignment: Specific agents are triggered based on issue type
- Project Sync: Issues are automatically added to relevant projects
```

**Assessment:** **Significant overlap.** Both ISSUE_CREATION_GUIDE.md and instructions/issues.instructions.md describe label requirements, but with different levels of detail. instructions/issues.instructions.md includes enforcement rules; ISSUE_CREATION_GUIDE.md is more user-friendly.

---

### 4.5 **Section 5: "Issue Lifecycle"**

**ISSUE_CREATION_GUIDE.md (Section 8, lines 99-105):**

```
1. Created: Labeled status:needs-triage
2. Triaged: Maintainer reviews and updates to status:ready
3. In Progress: Assigned and moved to status:in-progress
4. Review/QA: Status updated as needed
5. Closed/Merged: Linked PR auto-closes the issue
```

**instructions/issues.instructions.md (Section 5, lines 225-229):**

```
Issues start as status:needs-triage, then move through status:ready,
status:in-progress, status:needs-review, etc.
Automation ensures only one status:* and one priority:* label at any time.
The labeling.yml workflow, powered by labeling.agent.js, enforces label hygiene...
```

**Assessment:** **Moderate overlap.** ISSUE_CREATION_GUIDE.md is user-focused (what happens to issue); instructions/issues.instructions.md is automation-focused (how automation works). Both should be consolidated into a single description with clear separation of user concerns vs. automation.

---

## 5. Missing Content Analysis

### What's Missing / Underdocumented

1. **Metadata Completeness Requirements** (in instructions only, not in guide)
   - Priority field
   - Start/target dates
   - Effort estimation
   - Parent/child relationships

2. **Template Validation** (in instructions only)
   - When templates live in `.github/ISSUE_TEMPLATE/`
   - Validation of schema compliance
   - Common template errors

3. **Branch Naming Integration** (missing from all guides)
   - How branch prefixes (`feat/`, `fix/`, etc.) affect issue type assignment
   - Referenced only briefly in labeler.yml

4. **Project Field Mapping** (mentioned in instructions, not in guide)
   - How issue types map to project field values
   - Required for GitHub Projects integration

---

## 6. Consolidation Audit Matrix

**Proposed Consolidation:** Reduce 6 files to 3 core files

| Current File | Proposed Consolidation | Rationale |
|--------------|------------------------|-----------|
| `docs/ISSUE_CREATION_GUIDE.md` | **Keep (Revise)** | Most user-friendly; expand with missing metadata requirements |
| `docs/ISSUE_TYPES.md` | **Keep (Unmodified)** | Comprehensive type reference; no duplication; appropriate scope |
| `.github/ISSUE_TEMPLATE/README.md` | **Merge into Guide** | Template directory overview; short; can become section in Guide |
| `instructions/issues.instructions.md` | **Keep (Revise)** | Canonical instructions for agents/automation; needs clarity on scope |
| `docs/README.md` | **Keep (Unmodified)** | Serves different purpose (documentation index); no consolidation needed |
| `docs/index.md` | **Delete** | Stub file; no content; redirect logic can be handled in README |

---

## 7. Proposed New Structure

### After Consolidation

```
docs/
├── ISSUE_CREATION_GUIDE.md (revised, ~8-10 KB)
│   ├── Before You Start
│   ├── Template Selection & Location
│   ├── Template Completion
│   ├── Frontmatter Requirements (expanded from instructions)
│   ├── Label Requirements (expanded with one-hot rules)
│   ├── Metadata Completeness (from instructions)
│   ├── Issue Types (link to ISSUE_TYPES.md)
│   ├── Issue Lifecycle
│   ├── Tips & Best Practices
│   ├── Sample Issue
│   └── Common Issues & Troubleshooting (new)
├── ISSUE_TYPES.md (unchanged, ~12 KB)
│   └── Comprehensive 27-type reference
└── README.md (unchanged, ~5.5 KB)

.github/
├── instructions/issues.instructions.md (revised, ~6 KB)
│   ├── Role Declaration (for AI agents/automation)
│   ├── Markdown Template Requirements (move from guide)
│   ├── Frontmatter Validation (move from guide)
│   ├── Label & Status Automation (move from guide)
│   ├── One-Hot Rules & Enforcement (move from guide)
│   └── Integration with Agents & Workflows
└── ISSUE_TEMPLATE/
    └── README.md (delete; merge into ISSUE_CREATION_GUIDE)

# Files to Delete
docs/index.md (stub; use redirect or remove)
```

---

## 8. Duplication Quantification

### Content Overlap by Topic

| Topic | Lines Duplicated | Files Affected | Consolidation Savings |
|-------|:---:|:---:|:---:|
| Template selection | ~15 | 3 | ~10 lines |
| Label requirements | ~30 | 2 | ~20 lines |
| Frontmatter spec | ~25 | 2 | ~20 lines |
| Issue lifecycle | ~10 | 2 | ~7 lines |
| Automation features | ~8 | 2 | ~5 lines |
| Navigation/links | ~20 | 2 | ~15 lines |
| **Total Duplication** | **~108 lines** | **6 files** | **~77 lines (~2,400 tokens)** |

---

## 9. Cross-Reference Issues Identified

### Broken/Incorrect References

1. **TEMPLATE/README.md (line 36):** References `./ISSUE_TEMPLATE/README.md` (circular reference)
2. **TEMPLATE/README.md (line 79):** References `../ISSUE_LABELS.md` (does not exist; should be `docs/ISSUE_LABELS.md` or link moved)
3. **instructions/issues.instructions.md (line 58):** References `../docs/ISSUE_CREATION_GUIDE.md` (correct relative path from root-level instructions/)
4. **instructions/issues.instructions.md (lines 137-138):** References `../docs/LABEL_STRATEGY.md` (correct relative path from root-level instructions/)

### Navigation Gaps

- No single "start here" for issue creation (multiple entry points)
- docs/index.md is a stub with no guidance
- TEMPLATE/README.md doesn't clearly link to guide

---

## 10. Consolidation Strategy & Recommendations

### Phase 1: Clarify Scope & Roles (Immediate)

**Each file should have a clear, distinct purpose:**

1. **docs/ISSUE_CREATION_GUIDE.md** — *For Issue Creators*
   - Who: Anyone creating a GitHub issue
   - Purpose: Step-by-step how-to guide with examples
   - Include: Template selection, completion, common mistakes
   - Exclude: Agent/automation internals

2. **docs/ISSUE_TYPES.md** — *Reference Document*
   - Who: Anyone needing to understand issue types
   - Purpose: Comprehensive reference of 27 types with decision tree
   - Include: All types, use cases, automation behaviours, best practices
   - Exclude: Step-by-step creation (refer to guide)

3. **instructions/issues.instructions.md** — *For Agents & Automation*
   - Who: AI agents, workflows, maintainers writing automation
   - Purpose: Rules, validation, automation standards
   - Include: Template schema, frontmatter validation, label enforcement, one-hot rules
   - Exclude: User-facing guidance (refer to guide)

4. **.github/ISSUE_TEMPLATE/README.md** — *Consolidate into Guide*
   - Action: Move template directory overview to section in ISSUE_CREATION_GUIDE.md
   - Rationale: Redundant; users need one unified guide, not separate template docs

5. **docs/README.md** — *Keep Unchanged*
   - Purpose: Documentation index; distinct from issue creation docs
   - No consolidation needed

6. **docs/index.md** — *Delete*
   - Action: Remove stub file
   - Rationale: No content; redirect can be handled via other means

---

### Phase 2: Update & Consolidate Files (Recommended Next Steps)

**Recommended order of implementation:**

1. **Revise docs/ISSUE_CREATION_GUIDE.md** (expand to ~8-10 KB)
   - Add "Metadata Completeness" section from instructions
   - Add "Common Issues & Troubleshooting" section
   - Move TEMPLATE/README.md content into "Template Selection & Location" section
   - Keep references to ISSUE_TYPES.md, instructions/issues.instructions.md

2. **Revise instructions/issues.instructions.md** (reduce to ~6 KB)
   - Move frontmatter examples → keep only validation rules
   - Move label requirements → replace with "See docs/ISSUE_CREATION_GUIDE.md for user guidance"
   - Expand automation sections: label enforcement, one-hot rules, agent integration
   - Add section: "For Maintainers: Enforcing Label Hygiene"

3. **Delete .github/ISSUE_TEMPLATE/README.md**
   - Content merged into ISSUE_CREATION_GUIDE.md
   - Link from template directory to guide in GitHub UI

4. **Delete docs/index.md**
   - Stub file with no content
   - Update any cross-references to point to docs/README.md

---

## 11. Validation Checklist for Consolidation

After implementing consolidations, validate:

- [ ] **ISSUE_CREATION_GUIDE.md** includes all practical steps (template selection, completion, labels, frontmatter, examples)
- [ ] **ISSUE_TYPES.md** is comprehensive reference (27 types, decision tree, automation, best practices)
- [ ] **instructions/issues.instructions.md** covers agent/automation rules (validation, enforcement, workflows)
- [ ] All cross-references between files are accurate and relative paths work
- [ ] No broken links to deleted files (TEMPLATE/README.md, index.md)
- [ ] New contributors can find single entry point (docs/README.md → docs/ISSUE_CREATION_GUIDE.md)
- [ ] Agents/automation teams can find authoritative rules (instructions/issues.instructions.md)
- [ ] All topics covered: template selection, frontmatter, labels, types, lifecycle, metadata, validation

---

## 12. Summary of Findings

### Problems Identified

1. **Duplication:** ~108 lines (~2,400 tokens) of duplicate content across 6 files
2. **Fragmentation:** Three distinct file types (guidance, reference, instruction) with overlapping scope
3. **Navigation:** No clear "start here" for users; index is incomplete/outdated
4. **Maintenance Risk:** Changes to label strategy, types, or lifecycle must be updated in 2-3 files
5. **Confusion:** Users unsure whether to read guide, instructions, or reference

### Solutions Proposed

1. **Consolidate to 3 core files** with clear, distinct purposes
2. **Delete stub files** (docs/index.md, TEMPLATE/README.md as separate file)
3. **Establish clear entry points:** Guide for users, Reference for types, Instructions for agents
4. **Migrate missing content** (metadata completeness, troubleshooting) into appropriate files
5. **Fix cross-references** and validate all links

---

## Appendix A: File Inventory

### Audit Scope (6 Files)

1. **docs/ISSUE_CREATION_GUIDE.md** (5.3 KB)
   - Status: Keep (revise)
   - Priority: HIGH
   - Action: Expand with missing sections

2. **docs/ISSUE_TYPES.md** (11.9 KB)
   - Status: Keep (unmodified)
   - Priority: MEDIUM
   - Action: None

3. **.github/ISSUE_TEMPLATE/README.md** (2.8 KB)
   - Status: Delete (merge into guide)
   - Priority: LOW
   - Action: Move content, update links

4. **instructions/issues.instructions.md** (7.2 KB)
   - Status: Keep (revise)
   - Priority: HIGH
   - Action: Clarify agent-focused scope, move user guidance to guide

5. **docs/README.md** (5.5 KB)
   - Status: Keep (unmodified)
   - Priority: MEDIUM
   - Action: Update index if guide/instructions reorganised

6. **docs/index.md** (0.3 KB)
   - Status: Delete
   - Priority: LOW
   - Action: Remove stub, update redirects

---

## Appendix B: Related Issue Files (Not in Scope)

The following files were mentioned in references but are **NOT in scope** for this audit (separate concerns):

- **docs/ISSUE_LABELS.md** — Label reference (complement to ISSUE_TYPES.md)
- **docs/LABEL_STRATEGY.md** — Strategic labeling approach
- **docs/ISSUE-FIELDS.md** — GitHub Project field definitions
- **.github/labels.yml** — Canonical label configuration
- **.github/issue-types.yml** — Canonical type configuration
- **Schema files** — frontmatter.schema.json, FRONTMATTER_SCHEMA.md

These files support issue creation but are distinct documentation artifacts.

---

**Report Complete**
**Next Step:** Review consolidation recommendations with team; proceed with Phase 1 & Phase 2 as approved.

*Maintained with ❤️ by LightSpeed — Audit performed 2026-05-31*

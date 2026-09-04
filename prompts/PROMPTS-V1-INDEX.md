---
file_type: "index"
title: "Reusable Prompts Library v1.0"
description: "Index and reference for 9 new reusable organisation-wide prompts for automation, workflows, and management tasks."
version: "1.0.0"
created: "2026-09-04"
last_updated: "2026-09-04"
status: "ready-for-review"
---

# Reusable Prompts Library v1.0 — Complete Index

This document indexes the 9 new reusable prompts created for LightSpeed organisation-wide automation workflows. Each prompt is self-contained, documented, and ready for copy-paste use in Claude Code chat sessions.

**Status:** ✅ All 9 prompts created and documented  
**Location:** `prompts/` (root folder, portable assets)  
**Total Content:** 3,200+ lines, ~128KB documentation  

---

## Prompt Directory

### 1. Update Active Projects From Chat Work

**File:** `01-update-active-projects-from-chat.md`  
**Purpose:** Systematically document session work in active project files, create enhancement tasks, regenerate openspec, and create/link GitHub issues.  
**Use When:** Chat session delivered feature/fix work tied to an active project  
**Output:** Updated project docs, enhancement tasks, GitHub issues, merged commits to develop  
**Effort:** 1–2 hours  

**Sections:**
- Context: Why/when to use
- Task: Document work, create tasks, run openspec, create issues, update indexes
- Constraints: All commits to develop, clear messages
- Acceptance Criteria: 8 checkboxes ensuring complete workflow
- References: `.github/projects/active/`, agents/, instructions/, skills/, workflows/, docs/, schemas/

**Key References:**
- `.github/projects/active/` (active project structure)
- `scripts/openspec.js` (openspec generation)
- `.github/labels.yml` (label prefixes)

---

### 2. PR Finalisation Complete Workflow

**File:** `02-pr-finalization-workflow.md`  
**Purpose:** 10-step comprehensive PR finalization with label family prefix enforcement, template auto-selection, and merge validation.  
**Use When:** PR is ready to finalize, needs label audit, template update, or merge  
**Output:** Merged PR, updated labels, closed linked issue, clean CI  
**Effort:** 30 min–2 hours per PR (depending on review feedback)  

**10-Step Workflow:**
1. Fetch & Review PR Details
2. Apply Review Recommendations
3. Update PR Template & Description
4. Apply Correct Labels (family:value format)
5. Verify Linked Issue
6. Update Linked Issue Status
7. Rebase if Necessary
8. Final Merge Checks
9. Merge to Develop
10. Post-Merge Cleanup

**Critical Features:**
- Family prefix enforcement (type:*, status:*, area:*)
- Label audit (no bare labels like "bug" or "urgent")
- PR template auto-selection based on type:* label
- Merge conflict resolution guidance
- Issue closure with state_reason

**Key References:**
- `.github/labels.yml` (canonical label definitions)
- `.github/PULL_REQUEST_TEMPLATE/` (template variants)
- `docs/BRANCHING_STRATEGY.md` (branch naming rules)
- `docs/LABELING.md` (labeling guide)
- `docs/MILESTONE_ALLOCATION_STRATEGY.md` (milestone strategy)

---

### 3. Context Continuation Prompt Generator

**File:** `03-context-continuation-prompt.md`  
**Purpose:** Generate self-contained continuation prompt when context window grows too large. Includes incomplete tasks, open PRs, branch warnings, labels, templates, review feedback, CI errors, merge conflicts.  
**Use When:** Context approaching limit, need to resume work in new chat  
**Output:** Ready-to-paste continuation prompt (markdown) for new chat  
**Effort:** 15–30 min  

**10 Sections Generated:**
1. Session Overview (goals, accomplishments)
2. Incomplete Tasks (actionable items with blockers)
3. Open PRs Status Table (PR#, branch, status, blockers, action)
4. Branch Naming Validation (flags forbidden prefixes: claude/*, copilot/*)
5. Label Audit (missing/incorrect labels per PR)
6. PR Template Status (template mismatch identification)
7. Review Feedback (unaddressed comments)
8. Pre-existing CI Errors (separate from PR-specific failures)
9. Merge Conflicts (identify and provide resolution steps)
10. Files Changed Summary

**Output Format:** Complete markdown document ready to paste into new chat

**Key References:**
- `docs/BRANCHING_STRATEGY.md`
- `.github/labels.yml`
- `docs/LABELING.md`
- `.github/PULL_REQUEST_TEMPLATE/` (all templates)
- `docs/MILESTONE_ALLOCATION_STRATEGY.md`

---

### 4. Dependabot PR Manual Merge Workflow

**File:** `04-dependabot-pr-merge-workflow.md`  
**Purpose:** Review and manually merge dependabot PRs one-by-one, respecting package dependency ordering. Includes decision logic for manual vs. mergify automation.  
**Use When:** Dependabot PRs are open, need merging in correct order  
**Output:** Merged PRs, updated dependencies, clean CI  
**Effort:** 10 min per PR (or 1–2 hours for batch setup via mergify)  

**Key Features:**
- Pre-merge decision: Manual vs. Mergify automation
- Package dependency ordering (root → transitive → dev)
- Package.json vs. package-lock.json handling
- Update vs. regenerate decision logic
- Breaking change detection (major version bumps)
- CI failure diagnosis (PR-specific vs. pre-existing)

**Workflow:**
1. Choose strategy (manual or mergify)
2. Sort PRs by dependency order
3. Review each PR (CI, no conflicts, breaking changes)
4. Approve & merge (squash merge format)
5. Verify success (test, build, no regressions)

**Key References:**
- `scripts/` (package management utilities)
- `.github/workflows/` (mergify/dependabot workflows)
- Npm documentation (dependency management)

---

### 5. Recommend Next Focus Task

**File:** `05-recommend-next-focus-task.md`  
**Purpose:** Identify and prioritize next work by auditing active projects, open issues, discovering pre-existing CI errors, and applying priority scoring framework.  
**Use When:** Finished one task, unsure what to work on next  
**Output:** Ranked task recommendations, prioritization report, active projects audit  
**Effort:** 1–2 hours  

**Audit Categories:**
1. Active Projects Index (status, completion %, blockers)
2. Open Issues by Category:
   - Linked to active projects
   - Pre-existing CI errors (tracked separately from projects)
   - Unassigned issues
   - Urgent/critical issues
3. CI Error Investigation (repository-wide failures, separate from project work)

**Priority Scoring (0-100):**
- Urgency (0-25): Time-critical vs. nice-to-have
- Impact (0-25): How much value delivered
- Dependencies (0-25): Does it unblock other work
- Effort (0-25): Relative effort (reversed—lower effort scores higher)

**Output:** Report with top 3 recommendations, scoring rationale, active projects status, pre-existing CI issues

**Key References:**
- `.github/projects/active/` (index scanning)
- `.github/reports/` (output location)
- `docs/MILESTONE_ALLOCATION_STRATEGY.md` (priority factors)
- `docs/LABEL_STRATEGY.md` (status tracking)

---

### 6. Evaluate Open Issues and Milestone Allocation

**File:** `06-milestone-allocation-strategy.md`  
**Purpose:** Allocate open issues to milestones by priority, dependencies, and time estimates. Spread grouped work across multiple version milestones (v1.0, v1.1, v1.2, etc.).  
**Use When:** Planning release cycle, allocating issues to milestones  
**Output:** Milestone allocations, utilization charts, allocation report  
**Effort:** 2–4 hours  

**Milestone Strategy:**
- v1.0: Foundation (critical features, essential fixes) — Sept 30
- v1.1: Enhancements (phase 2 features) — Oct 31
- v1.2: Polish (refinements, optional features) — Nov 30
- v1.3+: Advanced work — Dec 31+

**Allocation Factors:**
- Priority (0-5 scale)
- Effort (S/M/L/XL)
- Dependencies (must respect chains)
- Time estimates (from active projects)
- Target milestones (primary, fallback, deadline)

**Validation Rules:**
1. No milestone > 90% capacity (unless critical)
2. Reserve 20–30% capacity for unexpected work
3. Respect dependency chains (dependencies ship earlier)
4. Group related work together
5. Balance XL items across releases

**Output:** Milestone utilization table, before/after structure, allocation rationale

**Key References:**
- `docs/MILESTONE_ALLOCATION_STRATEGY.md` (strategy document)
- `.github/projects/active/` (for time estimates)
- `docs/LABEL_STRATEGY.md` (status labels)
- `.github/reports/` (output location)

---

### 7. Branch and Worktree Cleanup

**File:** `07-branch-worktree-cleanup.md`  
**Purpose:** Clean up local branches and worktrees based on merge status, staleness (2+ weeks), and branch naming validation. Includes safe deletion guidance.  
**Use When:** Session complete, local repo has accumulated many branches  
**Output:** Cleaned local branches, removed stale worktrees, cleanup report  
**Effort:** 30 min–1 hour  

**Cleanup Workflow:**
1. List all branches with last commit date
2. Identify merged branches (safe to delete)
3. Identify stale branches (2+ weeks old, not in PR)
4. Validate branch naming (flag `claude/*`, `copilot/*` prefixes)
5. Check for uncommitted changes
6. Create cleanup checklist
7. Delete branches safely
8. Clean up worktrees
9. Validate clean state
10. Generate cleanup report

**Safe Deletion Rules:**
- Never delete branch with uncommitted changes
- Don't delete branches with open PRs
- Check stale branches are not being actively developed
- Preserve important branch metadata

**Alternative:** Use provided cleanup script (`scripts/cleanup-branches.js`)

**Key References:**
- `docs/BRANCHING_STRATEGY.md`
- `scripts/cleanup-branches.js` (cleanup script)
- `agents/chat-closure-agent/` (closure agent)
- `agents/chat-closure-agent/claude/prompt.md` (closure prompt)
- `docs/BRANCH_CLEANUP.md` (cleanup strategy)

---

### 8. Create or Update README Files with Mermaid Diagrams

**File:** `08-create-update-readme-with-diagrams.md`  
**Purpose:** Create new or update existing README.md files with YAML frontmatter, folder-specific section patterns, Mermaid diagrams, and accessibility guidance.  
**Use When:** Need to create/update README for agents/, skills/, workflows/, instructions/, etc.  
**Output:** Well-structured README with frontmatter, sections, optional Mermaid diagrams  
**Effort:** 1–2 hours per README  

**Key Features:**
- Complete YAML frontmatter (title, description, owners, tags)
- Folder-specific README patterns (portable agents, skills, workflows, etc.)
- Mermaid diagram policy (mandatory/optional/unnecessary evaluation)
- Accessibility guidance for diagrams (alt text, accessibility standards)
- Section ordering and validation
- Markdown linting integration

**Section Order (Standard):**
1. Frontmatter (YAML metadata)
2. Title (H1)
3. Overview (1–2 sentences)
4. Folder Structure (files/folders description)
5. Diagram (if applicable)
6. Usage/How to Run
7. Validation/Testing
8. Governance Links
9. References

**Folder-Specific Patterns:**
- Root README (architecture + overview diagram)
- Portable Agents (spec list + ecosystem diagram)
- Skills (skill list + usage examples)
- Workflows (inputs/outputs + workflow diagram)
- Instructions (domain list, portability notes)
- Plugins (families + install notes)
- Scripts (how to run, dependencies + tooling diagram)

**Mermaid Policy:**
- **MANDATORY:** Complex structures, workflows, agent ecosystems, data relationships
- **OPTIONAL:** Straightforward flows ≤5 steps, small modules
- **UNNECESSARY:** Single-file content, rapidly changing content

**Key References:**
- `.github/instructions/readme.instructions.md` (README standards)
- `.github/instructions/mermaid.instructions.md` (Mermaid guidance)
- `.github/instructions/file-organisation.instructions.md` (file placement)
- `.github/prompts/create-readme.prompt` (existing template)
- `.github/prompts/readme-blueprint.prompt` (existing blueprint)
- `artifact-diagramming` skill (Mermaid design principles)

---

### 9. Move Files From .github/ to Root Folders

**File:** `09-move-files-to-root-folders.md`  
**Purpose:** Audit `.github/` subfolders for misplaced files, categorize by portability, migrate to correct root locations, update all references, and generate migration audit report.  
**Use When:** File organisation audit, migrating legacy structure to portable standards  
**Output:** Moved files with git history, updated references, migration audit report  
**Effort:** 2–4 hours  

**Migration Phases:**

**Phase 1: `.github/scripts/` → `scripts/`**
- Move all utilities and build scripts to root
- Update references in package.json, workflows, docs
- Preserve git history with `git mv`

**Phase 2: Archive Evaluation**
- Review `.github/instructions/.archive/`
- Decide: restore to active, move to root `instructions/`, or stay archived
- Document decision rationale

**Phase 3: Portable Instructions Migration**
- Identify instructions with NO `.github` assumptions
- Move portable files to root `instructions/`
- Keep repo-governance files in `.github/instructions/`

**Phase 4: Root Index Consolidation**
- Create/update `instructions/README.md`
- Create/update `scripts/README.md`
- Update `agents/README.md` (if agents moved)

**File Categories:**
1. **Portable** (move to root): Reusable, no repo assumptions
2. **Repo-governance** (stay in `.github/`): Repo-specific, governance-only
3. **Archived** (evaluate): Legacy, decide fate

**Key References:**
- `.github/instructions/file-organisation.instructions.md`
- CLAUDE.md section "Repository Boundaries"
- `scripts/` (target for `.github/scripts/`)
- `instructions/` (target for portable instructions)
- `.github/reports/` (audit report location)

---

## Prompt Analysis & Audit

**Comprehensive Audit Document:** `PROMPT-ANALYSIS.md`

Contains:
- Duplicate/overlap analysis for each prompt
- Comparison with existing `.github/prompts/` files
- Recommendations (create new vs. update existing)
- References to beneficial files/folders
- Critical decisions documented

**Key Finding - Prompt 8 (README Creation):**
- Existing prompts: `create-readme.prompt`, `readme-blueprint.prompt`, `update-readmes.prompt.md` (missing)
- **Recommendation:** Create new comprehensive prompt that consolidates and enhances existing patterns
- **Consolidation:** `08-create-update-readme-with-diagrams.md` handles both creation AND updates with Mermaid integration

---

## File Placement & Standards

**Location:** Root `prompts/` folder (portable, reusable assets)
```
prompts/
├── README.md (this index)
├── PROMPTS-V1-INDEX.md (this document)
├── PROMPT-ANALYSIS.md (audit & analysis)
├── 01-update-active-projects-from-chat.md
├── 02-pr-finalization-workflow.md
├── 03-context-continuation-prompt.md
├── 04-dependabot-pr-merge-workflow.md
├── 05-recommend-next-focus-task.md
├── 06-milestone-allocation-strategy.md
├── 07-branch-worktree-cleanup.md
├── 08-create-update-readme-with-diagrams.md
└── 09-move-files-to-root-folders.md
```

**Prompt Structure (Standard Across All):**
```markdown
---
file_type: "prompt"
title: "{Prompt Name}"
description: "{Brief description}"
version: "1.0.0"
created: "2026-09-04"
status: "active"
tags: ["tag1", "tag2"]
owners: ["ashley@lightspeedwp.agency"]
---

# Prompt Title

## PROMPT: {Friendly name}

### Context
### Task
### Constraints
### Acceptance Criteria
### References
```

---

## Quick Start

**To use any prompt:**

1. Open the prompt file (e.g., `02-pr-finalization-workflow.md`)
2. Copy entire prompt text
3. Paste into Claude Code chat
4. Customize for your specific context
5. Execute the workflow step-by-step

**Example:**
```bash
# Copy prompt
cat prompts/02-pr-finalization-workflow.md | pbcopy

# Paste into Claude Code chat
# Customize PR numbers, branch names, etc.
# Follow 10-step workflow
```

---

## References & Links

- **Repository Boundaries:** CLAUDE.md
- **File Organisation:** `.github/instructions/file-organisation.instructions.md`
- **README Standards:** `.github/instructions/readme.instructions.md`
- **Labeling Guide:** `docs/LABELING.md`
- **Branch Strategy:** `docs/BRANCHING_STRATEGY.md`
- **Milestone Strategy:** `docs/MILESTONE_ALLOCATION_STRATEGY.md`
- **Active Projects:** `.github/projects/active/`
- **Reports:** `.github/reports/`

---

## Next Steps

1. ✅ **9 prompts created** — Ready for review
2. ⏳ **Move `.github/prompts/` to root `prompts/`** — Migration of existing prompts (separate task, per Prompt 9)
3. ⏳ **Establish prompt conventions** — Consider CI check for prompt structure/frontmatter
4. ⏳ **Integrate with agents** — Reference prompts in agent specs where applicable
5. ⏳ **Automation setup** — Consider scheduled prompt maintenance/validation

---

**Version:** 1.0.0  
**Status:** Ready for Code Review & Merge  
**Created:** 2026-09-04 06:30 UTC  
**Branch:** `feat/reusable-prompts-structure`  

*Orchestrated automation — where intelligence meets operations*


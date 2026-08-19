---
title: "Context Reduction Task List"
description: "High-risk context reduction planning that requires evidence-gated execution controls"
file_type: documentation
status: active
issue_number: 744
parent_issue: 573
last_updated: "2026-06-01"
---

# Context Reduction Task List

**Goal:** Reduce context bloat in `.github` repository from ~922K tokens to <500K tokens while maintaining essential functionality.

**Status Legend:**

- ✅ Complete
- 🔄 In Progress
- ⏳ Pending
- ❌ Blocked

---

## Phase 1: Delete Meta-Files (Immediate) ⏳

### 1.1 Model-Specific Configuration Files

- [ ] ⏳ Delete `DOCS.md` - Master index causing circular references
- [ ] ⏳ Delete `GEMINI.md` - Model-specific config causing duplication
- [ ] ⏳ Delete `GPT.md` - Model-specific config causing duplication

**Rationale:** These files duplicate content from `custom-instructions.md` and create circular reference chains.

---

## Phase 2: Trim Core Index Files (High Priority) ⏳

### 2.1 AGENTS.md - Convert to Table of Contents

**Current:** 185 lines with detailed rules
**Target:** <50 lines, table of contents only

- [ ] ⏳ Remove detailed principle descriptions (move to `custom-instructions.md`)
- [ ] ⏳ Keep only the agent directory table
- [ ] ⏳ Keep cross-reference table
- [ ] ⏳ Remove redundant "Core Principles" section
- [ ] ⏳ Remove redundant "Contribution Guidelines" section (already in CONTRIBUTING.md)

**Expected Reduction:** ~70% (from 185 to ~55 lines)

### 2.2 agent.md - Reduce to Quick Reference

**Current:** References 40+ agents via glob patterns
**Target:** 5-10 key agents with links

- [ ] ⏳ Create table of 5-10 most-used agents:
  - labeling.agent.md
  - meta.agent.md
  - release.agent.md
  - project-meta-sync.agent.md
  - status.agent.md
- [ ] ⏳ Replace glob pattern with note: "See `agents/*.agent.md` for full list"
- [ ] ⏳ Remove redundant "Purpose" section
- [ ] ⏳ Keep only essential discoverability table

**Expected Reduction:** ~60% (from ~70 to ~28 lines)

### 2.3 prompts.md - Categorical Index Only

**Current:** Lists 163 prompts with badges and stats
**Target:** 10-15 categories with folder references

- [ ] ⏳ Replace prompt list with categorical index:
  - Code Review
  - Accessibility
  - Testing & QA
  - Documentation
  - Automation
  - Security
  - Performance
  - Labeling
  - Release Management
  - Linting & Formatting
- [ ] ⏳ Use dynamic folder reference: "See `.github/prompts/*.prompt.md` for full list"
- [ ] ⏳ Remove individual prompt documentation
- [ ] ⏳ Keep only quick start guide

**Expected Reduction:** ~80% (from ~120 to ~24 lines)

---

## Phase 3: Prune Instruction Files (Medium Priority) ⏳

### 3.1 Keep Core Consolidated Files ✅

**Status:** Already consolidated, keep as-is

- [x] ✅ `coding-standards.instructions.md` (foundational)
- [x] ✅ `languages.instructions.md` (4 files consolidated)
- [x] ✅ `documentation-formats.instructions.md` (3 files consolidated)
- [x] ✅ `quality-assurance.instructions.md` (3 files consolidated)
- [x] ✅ `automation.instructions.md` (8 files consolidated)
- [x] ✅ `community-standards.instructions.md` (4 files consolidated)

### 3.2 Keep Essential Workflow Files

**Rationale:** Critical for daily operations

- [x] ✅ `labeling.instructions.md` (canonical labeling system)
- [x] ✅ `workflows.instructions.md` (GitHub Actions guidance)
- [x] ✅ `issues.instructions.md` (issue creation)
- [x] ✅ `pull-requests.instructions.md` (PR creation)
- [x] ✅ `meta.instructions.md` (documentation automation)
- [x] ✅ `linting.instructions.md` (linting index)

### 3.3 Consider Removing Meta-Instructions

**Rationale:** Too meta, not used in daily operations

- [ ] ⏳ Evaluate: `a11y.instructions.md` (move to `coding-standards.instructions.md`?)
- [ ] ⏳ Evaluate: `copilot-thought-logging.instructions.md` (internal process tracking)
- [ ] ⏳ Evaluate: `taming-copilot.instructions.md` (meta-guidance)
- [ ] ⏳ Evaluate: `self-explanatory-code-commenting.instructions.md` (covered in coding standards)
- [ ] ⏳ Evaluate: `spec-driven-workflow.instructions.md` (niche workflow)
- [ ] ⏳ Evaluate: `tasksync.instructions.md` (experimental task tracking)
- [ ] ⏳ Evaluate: `task-implementation.instructions.md` (duplicate of spec-driven?)

**Decision Required:** Merge into core files or archive?

### 3.4 Keep Template & Tool Files

**Rationale:** Required for generation and external integrations

- [x] ✅ `instructions.instructions.md` (template for new instructions)
- [x] ✅ `prompt.instructions.md` (template for new prompts)
- [x] ✅ `template.instructions.md` (generic template)
- [x] ✅ `tools.instructions.md` (external tool configs)
- [x] ✅ `docs.instructions.md` (documentation standards)

---

## Phase 4: Reduce Frontmatter References (High Priority) ⏳

### 4.1 Audit All Frontmatter Blocks

**Target:** Only include direct dependencies and canonical configs

- [ ] ⏳ Run audit script: Find all files with >3 references
- [ ] ⏳ Create report of circular reference chains
- [ ] ⏳ Identify most-referenced files causing bloat

### 4.2 Reduce References to Essential Only

**Keep Only:**

- Direct dependencies (e.g., agent spec → workflow file)
- Canonical configs (labels.yml, issue-types.yml, labeler.yml)
- Main indexes (AGENTS.md, custom-instructions.md)

**Remove:**

- Circular references (A → B → C → A)
- Transitive references (if A refs B, A shouldn't ref C if B already refs C)
- Generic references to README.md, CONTRIBUTING.md (implied)

### 4.3 Files to Audit (Priority)

- [ ] ⏳ `labeling.agent.md` (currently has many references)
- [ ] ⏳ `LABEL_STRATEGY.md`
- [ ] ⏳ `AUTOMATION_GOVERNANCE.md`
- [ ] ⏳ `ISSUE_CREATION_GUIDE.md`
- [ ] ⏳ `PR_CREATION_PROCESS.md`

---

## Phase 5: Archive Legacy Files (Low Priority) ⏳

### 5.1 Move to .archive/

**Candidates:**

- [ ] ⏳ Old migration guides (>6 months old)
- [ ] ⏳ Deprecated instruction files
- [ ] ⏳ Experimental prompts not in use
- [ ] ⏳ Legacy agent specs with no implementations

### 5.2 Document Archive Structure

- [ ] ⏳ Create `.archive/README.md` explaining archived content
- [ ] ⏳ Add note in main README about archive

---

## Phase 6: Optimize Remaining Content (Medium Priority) ⏳

### 6.1 Compress Verbose Documentation

**Target Files:**

- [ ] ⏳ `LABEL_STRATEGY.md` (reduce examples, keep tables)
- [ ] ⏳ `AUTOMATION_GOVERNANCE.md` (reduce duplication with workflows.instructions.md)
- [ ] ⏳ `LABELING.md` (merge duplicate content with LABEL_STRATEGY.md?)

### 6.2 Remove Duplicate Examples

- [ ] ⏳ Audit all `.md` files for code examples
- [ ] ⏳ Identify duplicate examples
- [ ] ⏳ Consolidate to single location with references

### 6.3 Optimize Tables and Lists

- [ ] ⏳ Convert verbose prose to tables where possible
- [ ] ⏳ Use abbreviations in tables (e.g., "ref" instead of "reference")
- [ ] ⏳ Remove redundant column descriptions

---

## Phase 7: Validation & Testing (Final Phase) ⏳

### 7.1 Test Copilot with Reduced Context

- [ ] ⏳ Run standard prompts and verify functionality
- [ ] ⏳ Test labeling agent with reduced context
- [ ] ⏳ Test meta agent with reduced context
- [ ] ⏳ Verify all cross-references still resolve

### 7.2 Measure Context Reduction

- [ ] ⏳ Count tokens before/after
- [ ] ⏳ Document reduction percentage
- [ ] ⏳ Verify target (<500K tokens) achieved

### 7.3 Update Documentation

- [ ] ⏳ Update README with new structure
- [ ] ⏳ Update CONTRIBUTING.md with streamlined references
- [ ] ⏳ Update custom-instructions.md with pruned file list

---

## Estimated Impact

### Before Optimization

- **Total Context:** ~922K tokens
- **Instruction Files:** 28 files
- **Agent Specs:** 40+ files
- **Prompts:** 163 files
- **Cross-References:** High duplication, many circular

### After Optimization (Target)

- **Total Context:** <500K tokens (46% reduction)
- **Instruction Files:** 15-18 core files
- **Agent Specs:** Quick reference to 5-10 key agents
- **Prompts:** Categorical index (10-15 categories)
- **Cross-References:** Minimal, no circular dependencies

### Expected Reductions by File Type

- **Index Files (AGENTS.md, agent.md, prompts.md):** 70-80% reduction
- **Instruction Files:** 30-40% reduction (via pruning meta-files)
- **Documentation Files:** 20-30% reduction (via deduplication)
- **Frontmatter References:** 50-60% reduction (via audit)

---

## Implementation Order

1. ✅ **Phase 1:** Delete meta-files (COMPLETE)
2. ⏳ **Phase 4:** Audit and reduce frontmatter references (HIGH PRIORITY)
3. ⏳ **Phase 2:** Trim core index files (HIGH PRIORITY)
4. ⏳ **Phase 3:** Prune instruction files (MEDIUM PRIORITY)
5. ⏳ **Phase 6:** Optimize remaining content (MEDIUM PRIORITY)
6. ⏳ **Phase 5:** Archive legacy files (LOW PRIORITY)
7. ⏳ **Phase 7:** Validation & testing (FINAL)

---

## Notes & Decisions

### Decision Log

- **2025-12-08:** Planned deletion of DOCS.md, GEMINI.md, CLAUDE.md, GPT.md for circular-reference reduction; revalidation required against current repo state.
- **2025-12-08:** Created this task list for tracking

### Open Questions

1. Should we merge `a11y.instructions.md` into `coding-standards.instructions.md`?
2. Are `spec-driven-workflow.instructions.md` and `task-implementation.instructions.md` duplicates?
3. Can we archive experimental task tracking files (`tasksync.instructions.md`)?
4. Should `LABELING.md` and `LABEL_STRATEGY.md` be merged?

### Risk Mitigation

- **Backup:** Create branch before major deletions
- **Testing:** Test Copilot functionality after each phase
- **Rollback:** Document all deletions for easy restoration if needed

---

## Progress Tracking

**Overall Progress:** 0% (Phase 1 pending revalidation)

**Phase Status:**

- Phase 1: ⏳ 0%
- Phase 2: ⏳ 0%
- Phase 3: ⏳ 0%
- Phase 4: ⏳ 0%
- Phase 5: ⏳ 0%
- Phase 6: ⏳ 0%
- Phase 7: ⏳ 0%

**Target Completion:** TBD

---

## Next Steps (Implementation Order)

### Priority 1: Phase 4 - Audit and Reduce Frontmatter References

**Why First:** High impact with minimal disruption. Reduces token bloat immediately by removing circular and transitive references.

#### 4.1 Create Frontmatter Audit Script

- [ ] Create `scripts/audit/frontmatter.js` to scan all `.md` files
- [ ] Extract frontmatter blocks from each file
- [ ] Build reference graph (A → B, B → C, etc.)
- [ ] Detect circular references (A → B → C → A)
- [ ] Identify transitive references
- [ ] Generate CSV report with:
  - File name
  - Number of references
  - Reference targets
  - Is circular? (Y/N)
  - Recommendation (Keep/Remove/Reduce)

#### 4.2 Audit Key Files (Priority)

- [ ] `labeling.agent.md` - Document all references, identify which are essential
- [ ] `LABEL_STRATEGY.md` - Remove references that duplicate `LABELING.md`
- [ ] `AUTOMATION_GOVERNANCE.md` - Cross-check against `workflows.instructions.md`
- [ ] `ISSUE_CREATION_GUIDE.md` - Verify references don't duplicate `issues.instructions.md`
- [ ] `PR_CREATION_PROCESS.md` - Verify references don't duplicate `pull-requests.instructions.md`

#### 4.3 Remove Non-Essential References

- [ ] Update frontmatter in each audited file
- [ ] Keep only direct dependencies (e.g., agent → workflow)
- [ ] Keep only canonical configs (labels.yml, issue-types.yml)
- [ ] Keep only main indexes (AGENTS.md, custom-instructions.md)
- [ ] Document removed references in decision log

#### 4.4 Test After Changes

- [ ] Verify all remaining references resolve
- [ ] Check no broken links in documentation
- [ ] Spot-check Copilot functionality with reduced context

**Expected Outcome:** 50-60% reduction in frontmatter bloat, no broken references.

---

### Priority 2: Phase 2 - Trim Core Index Files

**Why Second:** High visibility files that contributors see first. Reduces context load significantly.

#### 2.1 AGENTS.md Reduction

- [ ] Extract detailed rules from "Global Principles & Agent Rules" section
- [ ] Move principle descriptions to `custom-instructions.md`
- [ ] Keep only agent directory table (5-10 key agents)
- [ ] Keep only cross-reference summary table
- [ ] Remove "Core Principles" section (duplicate of custom-instructions.md)
- [ ] Remove "Contribution Guidelines" section (already in CONTRIBUTING.md)
- [ ] Update frontmatter to remove old references
- [ ] Run markdown linter to verify formatting

**Target:** Reduce from 185 to ~55 lines (~70% reduction)

#### 2.2 agent.md Reduction

- [ ] Create quick reference table with 5-10 key agents:
  - labeling.agent.md
  - meta.agent.md
  - release.agent.md
  - project-meta-sync.agent.md
  - status.agent.md
  - (2-5 others based on usage frequency)
- [ ] Replace detailed glob pattern references with single line:
  - "See `agents/*.agent.md` for full list of all agents"
- [ ] Remove redundant "Purpose" section
- [ ] Keep only essential "Discoverability & Workflow Integration" table
- [ ] Update frontmatter to remove unnecessary references

**Target:** Reduce from ~70 to ~28 lines (~60% reduction)

#### 2.3 prompts.md Reduction

- [ ] Create categorical index with 10-15 categories:
  - Code Review & Quality
  - Accessibility & Testing
  - Documentation & Content
  - Automation & Workflows
  - Security & Performance
  - Labeling & Project Management
  - Release Management
  - Linting & Formatting
  - Schema & Configuration
  - Advanced/Experimental
- [ ] Replace detailed prompt list with folder reference:
  - "See `.github/prompts/*.prompt.md` for full list of all prompts (150+)"
- [ ] Remove individual prompt documentation
- [ ] Keep only quick start guide
- [ ] Remove badges and statistics (nice-to-have, not essential)
- [ ] Update frontmatter to remove unnecessary references

**Target:** Reduce from ~120 to ~24 lines (~80% reduction)

#### 2.4 Test After Changes

- [ ] Verify all index pages render correctly
- [ ] Test dynamic folder references work
- [ ] Spot-check that key agent/prompt links are accessible

**Expected Outcome:** 70-80% reduction in index file bloat, cleaner entry points for contributors.

---

### Priority 3: Phase 3 - Prune Instruction Files

**Why Third:** Medium priority, requires more careful evaluation. Some files may need merging rather than deletion.

#### 3.1 Evaluate Meta-Instructions for Consolidation

- [ ] **a11y.instructions.md**: Merge accessibility guidelines into `coding-standards.instructions.md` § Accessibility
- [ ] **copilot-thought-logging.instructions.md**: Archive (internal process, low usage)
- [ ] **taming-copilot.instructions.md**: Merge key points into `custom-instructions.md` as guardrails
- [ ] **self-explanatory-code-commenting.instructions.md**: Merge into `coding-standards.instructions.md` § Comments
- [ ] **spec-driven-workflow.instructions.md**: Keep (niche but specialized workflow)
- [ ] **tasksync.instructions.md**: Archive or move to experimental (experimental task tracking)
- [ ] **task-implementation.instructions.md**: Evaluate if duplicate of spec-driven (merge if yes)

#### 3.2 Create Merge Plan

- [ ] Document which files to merge into which consolidation files
- [ ] Create detailed mapping of content locations
- [ ] Plan section structures for merged content
- [ ] Identify any content that shouldn't be merged (keep separate)

#### 3.3 Execute Merges

- [ ] Update `coding-standards.instructions.md`:
  - Add "Accessibility" section (from a11y.instructions.md)
  - Add "Code Comments" section (from self-explanatory-code-commenting.instructions.md)
- [ ] Update `custom-instructions.md`:
  - Add "Guardrails" section (key points from taming-copilot.instructions.md)
- [ ] Verify all references to merged files are updated
- [ ] Update frontmatter in target files to reference original sources if needed

#### 3.4 Archive Pruned Files

- [ ] Move files to `.archive/instructions/`:
  - copilot-thought-logging.instructions.md
  - tasksync.instructions.md (if pruning)
- [ ] Create `.archive/instructions/README.md` explaining archived content
- [ ] Keep merged files available but add deprecation notice

#### 3.5 Test After Changes

- [ ] Verify all cross-references still work
- [ ] Test that Copilot can find guidance in new locations
- [ ] Spot-check that accessibility and coding guidelines are accessible

**Expected Outcome:** Reduce from 28 to 15-18 instruction files, no loss of essential guidance.

---

### Priority 4: Phase 6 - Optimize Remaining Content

**Why Fourth:** Medium priority, addresses content duplication and verbosity.

#### 6.1 Audit for Duplicate Content

- [ ] Compare `LABELING.md` vs `LABEL_STRATEGY.md` - identify overlaps
- [ ] Compare `AUTOMATION_GOVERNANCE.md` vs `workflows.instructions.md` - identify overlaps
- [ ] Compare `docs/ISSUE_TYPES.md` vs `.github/issue-types.yml` - should one reference the other?
- [ ] Create deduplication plan

#### 6.2 Consolidate Duplicates

- [ ] **LABELING.md vs LABEL_STRATEGY.md:**
  - Keep LABEL_STRATEGY.md (more comprehensive)
  - Update LABELING.md to be quick reference with link to LABEL_STRATEGY.md
  - Or: Merge LABELING.md into LABEL_STRATEGY.md (if content is truly redundant)

- [ ] **AUTOMATION_GOVERNANCE.md vs workflows.instructions.md:**
  - Clarify scope: Which covers policy? Which covers implementation?
  - Remove transitive references between the two
  - Keep only direct dependencies

#### 6.3 Compress Verbose Documentation

- [ ] Audit `LABEL_STRATEGY.md` for examples - reduce to 1-2 examples, keep tables
- [ ] Audit `AUTOMATION_GOVERNANCE.md` for redundant sections - remove if covered elsewhere
- [ ] Convert prose to tables where appropriate (e.g., decision matrices)
- [ ] Use abbreviations in tables (e.g., "ref" instead of "reference")

#### 6.4 Optimize Code Examples

- [ ] Identify all code blocks across documentation
- [ ] Find duplicate examples (same code in multiple files)
- [ ] Consolidate duplicates: Keep in one place, reference from others
- [ ] Add comments to examples explaining key concepts

#### 6.5 Test After Changes

- [ ] Verify all documentation remains clear and helpful
- [ ] Test that examples are accessible and work as documented
- [ ] Ensure tables render correctly in all formats (GitHub, docs, etc.)

**Expected Outcome:** 20-30% reduction in documentation verbosity, improved clarity.

---

### Priority 5: Phase 5 - Archive Legacy Files

**Why Fifth:** Low priority, doesn't affect daily operations.

#### 5.1 Identify Legacy Files

- [ ] Find migration guides >6 months old
- [ ] Identify deprecated instruction files (already moved)
- [ ] Find experimental prompts not in active use
- [ ] Identify legacy agent specs with no implementations

#### 5.2 Create Archive Structure

- [ ] Create `.archive/` directory at repo root
- [ ] Create subdirectories:
  - `.archive/instructions/` (deprecated instructions)
  - `.archive/prompts/` (experimental/unused prompts)
  - `.archive/agents/` (legacy agent specs)
  - `.archive/docs/` (old migration/setup guides)

#### 5.3 Move Files to Archive

- [ ] Move identified legacy files to appropriate subdirectories
- [ ] Update any references in active documents to point to archive
- [ ] Create `.archive/README.md` explaining:
  - What's archived and why
  - How to restore files if needed
  - When content becomes archive-eligible

#### 5.4 Document Archive Policy

- [ ] Add section to GOVERNANCE.md about archive process
- [ ] Document archival criteria (age, usage, status)
- [ ] Set archival schedule (quarterly review)

#### 5.5 Test After Changes

- [ ] Verify no broken links to archived files
- [ ] Test that archive directory is browsable
- [ ] Update main README to mention archive

**Expected Outcome:** Cleaner repo structure, legacy content preserved but out of the way.

---

### Priority 6: Phase 7 - Validation & Testing

**Why Last:** Final validation of all changes. Ensures nothing broke.

#### 7.1 Comprehensive Testing

- [ ] Run full lint suite:
  - [ ] JavaScript linting (`npm run lint:js`)
  - [ ] Markdown linting (`npm run lint:md`)
  - [ ] YAML linting (`npm run lint:yaml`)
  - [ ] CSS linting (if applicable)

- [ ] Test Copilot functionality with reduced context:
  - [ ] Test labeling agent (run with dry-run)
  - [ ] Test meta agent (run with dry-run)
  - [ ] Test release agent (if applicable)
  - [ ] Spot-check code review functionality

- [ ] Verify all cross-references:
  - [ ] Scan for broken links in all .md files
  - [ ] Check frontmatter references resolve
  - [ ] Verify all agent specs reference correct workflows
  - [ ] Verify all prompt files reference correct agents/instructions

#### 7.2 Measure Context Reduction

- [ ] Count tokens in key files before/after (use rough estimates)
- [ ] Document reduction percentages:
  - Index files (AGENTS.md, agent.md, prompts.md): Target 70-80%
  - Instruction files: Target 30-40%
  - Documentation files: Target 20-30%
  - Frontmatter references: Target 50-60%
  - **Total target: 46% reduction (922K → <500K)**

- [ ] Create summary report showing:
  - Before/after token counts
  - Reduction percentage by category
  - Any files that exceeded reduction targets
  - Risk assessment of changes

#### 7.3 Update Documentation

- [ ] Update [README.md](README.md):
  - Document new repository structure
  - Update file/folder descriptions
  - Add section on reduced context approach

- [ ] Update [CONTRIBUTING.md](CONTRIBUTING.md):
  - Streamline references (only point to essential docs)
  - Update onboarding to reflect new structure
  - Remove references to deleted files

- [ ] Update [custom-instructions.md](.github/custom-instructions.md):
  - Add pruned file list (what's kept vs archived)
  - Update cross-references
  - Add note about context reduction initiative

- [ ] Update [CONTEXT_REDUCTION_TASKS.md](CONTEXT_REDUCTION_TASKS.md):
  - Mark all phases as ✅ Complete
  - Document final token count reduction
  - Archive this file to `.archive/docs/`

#### 7.4 Create Archive Checklist

- [ ] Create `ARCHIVE_CHECKLIST.md` documenting all changes made
- [ ] List all deleted files (with recovery instructions)
- [ ] List all merged content (with location mappings)
- [ ] List all archived files
- [ ] Document any breaking changes (if any)

#### 7.5 Final Review

- [ ] Team review of all changes
- [ ] Spot-check critical functionality
- [ ] Verify no unintended side effects
- [ ] Get sign-off before merging to main

**Expected Outcome:** Fully validated, 46% context reduction achieved, zero broken functionality.

---

## Execution Timeline

**Suggested Timeline:**

- **Week 1:** Phase 4 (Audit) + Phase 2 (Trim indexes)
- **Week 2:** Phase 3 (Prune instructions) + Phase 6 (Optimize content)
- **Week 3:** Phase 5 (Archive) + Phase 7 (Validate)

**Estimated Effort:** 15-20 hours total

- Phase 4: 4-5 hours (audit, update)
- Phase 2: 3-4 hours (trim 3 files, test)
- Phase 3: 4-5 hours (merge content, archive)
- Phase 6: 2-3 hours (deduplicate, optimize)
- Phase 5: 1-2 hours (move files, document)
- Phase 7: 3-4 hours (testing, reporting)

---

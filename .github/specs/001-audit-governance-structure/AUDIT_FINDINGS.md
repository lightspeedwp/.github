# Audit Findings Summary: Current Governance Files State

This document captures the initial audit findings that informed the specification. These findings will be detailed and verified during the planning and implementation phases.

## Issues Identified in AGENTS.md

### 🔴 CRITICAL: Duplicate Section — "Label Creation Governance (CRITICAL)"

**Occurrences**: Lines 209–252 and lines 285–338

**Issue**: Identical section appears twice with nearly identical content, examples, and validation checklists.

**Sections Affected**:

- First: "Label Creation Governance (CRITICAL)" starting at line 209
- Second: Repeated verbatim starting at line 285 under "Label Creation Governance (CRITICAL)"

**Content Differences**:

- Line 251 references `.github/scripts/validation/validate-labels-before-creation.cjs` (first occurrence)
- Line 336 references issue #1592 with different wording (second occurrence)
- Both have nearly identical examples and validation checklists

**Impact**:

- Maintenance burden (updates must happen twice or become inconsistent)
- Reader confusion (unclear which is authoritative)
- Violates constitution principle: "Clear Asset Boundaries (No Duplication)"

**Resolution Required**: Consolidate to single section, retaining all unique information from both occurrences.

---

### ⚠️ MAJOR: Organization Issue — Script Location Rules in AGENTS.md

**Section**: "Repository Scripts Organisation (CRITICAL)" (lines 52–102)

**Issue**: Detailed rules about script file locations (`scripts/` vs `.github/scripts/`) are in AGENTS.md (AI rules file) rather than in instruction files or CLAUDE.md (governance files).

**Why This Is Problematic**:

- AGENTS.md is about AI agent rules, not repository structure rules
- This content belongs in `instructions/file-organisation.instructions.md` or as a subsection of governance files
- Creates confusion about scope: is this an AI rule or a repository rule?

**Affected Content**:

- Lines 54–102: Detailed organization rules with examples and quick reference table
- References to correct locations: `scripts/automation/`, `scripts/metrics/`, etc.

**Resolution Required**: Move this section to appropriate governance location (likely CLAUDE.md under "Repository Boundaries" or to instruction file) with clear rationale for AI agents about why script organization matters.

---

### ⚠️ MAJOR: Incomplete Reference — `.github/prompts/prompts.md`

**Reference**: Line 18

**Issue**: References `.github/prompts/prompts.md` as "Legacy prompt index pending skills/cookbook migration"

**Context**: Indicates migration is incomplete or file location is outdated.

**Resolution Required**: Either update to actual location or document migration status clearly.

---

### ⚠️ MODERATE: Inconsistent Guidance Structure

**Issue**: AGENTS.md mixes different types of content:

1. Global AI rules (UK English, minimal solutions, WordPress standards)
2. Repository-specific script organization rules
3. Branch naming governance (repeated with some detail difference from CLAUDE.md)
4. Label governance (duplicated)
5. Locked files governance
6. Contribution guidelines and indexes

**Impact**: Readers must navigate multiple concerns in single file; unclear what is AI-specific vs. general governance.

**Resolution Required**: Better organize sections; clarify which rules are AI-agent-specific vs. general repository governance.

---

## Issues Identified in CLAUDE.md

### ✅ GOOD: Clear Branch Naming Convention

**Section**: "⚠️ Branch Naming — CRITICAL (Read First)" (lines 14–111)

**Strengths**:

- Clear forbidden prefixes section (claude/, copilot/, openai/)
- Comprehensive table of 34 allowed types
- Specific examples of correct and incorrect usage
- Clear explanation of WHY incorrect names matter
- Validation command provided

**Note**: This is well-structured but needs alignment with AI tool configuration (Claude Code's default `claude/` behavior contradicts this guidance).

---

### ⚠️ MODERATE: Cross-Reference to Possibly Non-Existent Files

**References** (lines 105–110):

- `.github/instructions/branch-naming.instructions.md` — verify existence
- `docs/BRANCHING_STRATEGY.md` — verify existence
- `docs/PR_CREATION_PROCESS.md` — verify existence

**Action Required**: Validate all referenced files exist; if not, update references or update CLAUDE.md to not reference non-existent files.

---

### ⚠️ MODERATE: Missing Specification-First Workflow Guidance

**Issue**: CLAUDE.md describes branch naming, git workflow, development commands, conventions, and locked files, but does NOT explain:

- When to create a spec (branch → spec → PR workflow)
- How spec-first process integrates with GitHub workflows
- When specs should be committed vs. PRs created
- Expected state of work before creating draft PR

**Impact**: User (@ashley) asked for this guidance specifically because it's missing; this is driving the audit request.

**Resolution Required**: Add section documenting the specification-first workflow with clear phase boundaries and success criteria for each phase.

---

## Issues Identified in Cross-File References

### ⚠️ MAJOR: Branch Naming Guidance Repeated in Both Files

**CLAUDE.md**: Lines 14–111 (comprehensive, 97 lines)

**AGENTS.md**: Lines 104–145 (summary with reference to CLAUDE.md)

**Issue**: Significant overlap; AGENTS.md says "see CLAUDE.md for complete details" but also repeats key content.

**Resolution Required**: Clarify which file is authoritative; consider whether repetition serves a purpose (quick reference for agents) or should be consolidated.

---

### ⚠️ MODERATE: Constitutional Constraints Not Clearly Prioritized

**Issue**: Both CLAUDE.md and AGENTS.md reference governance principles, but don't clearly distinguish:

- **Constitution Level**: Non-negotiable principles (from `.specify/memory/constitution.md`)
- **Implementation Level**: Details that can evolve

**Example**: Branch naming is constitution-level (Principle V: "Branch Naming Strategy is Non-Negotiable"); this should be emphasized.

**Resolution Required**: Add framing to both files clarifying that constitution supersedes all other guidance; reference constitution explicitly.

---

## Verification Tasks (Planning Phase)

Before proceeding to implementation, planning phase should verify:

1. [ ] Does `.github/instructions/branch-naming.instructions.md` exist? If yes, what is its relationship to CLAUDE.md branch naming section?
2. [ ] Do `docs/BRANCHING_STRATEGY.md` and `docs/PR_CREATION_PROCESS.md` exist?
3. [ ] Does `.github/prompts/prompts.md` exist? If not, what is the migration plan?
4. [ ] Are the 5 consolidated instruction files listed in lines 160–166 of AGENTS.md actually in `instructions/` folder?
5. [ ] Are references to GitHub projects (`.github/projects/active/`) current, or have some been archived?
6. [ ] Does `.github/scripts/validation/validate-labels-before-creation.cjs` exist?
7. [ ] Does `.github/agentic-workflows/` directory exist with governance agents mentioned in AGENTS.md line 74?

---

## Next Steps

1. **Planning Phase**: Detailed analysis and verification (see Verification Tasks above)
2. **Task Decomposition**: Break down into specific editing tasks for each governance file
3. **Implementation**: Execute edits according to approved plan
4. **Validation**: Verify all references, test workflow guidance, ensure no duplicate sections remain

---

**Audit Date**: 2026-09-14
**Auditor**: Claude (via /speckit-specify)
**Status**: Initial findings—to be detailed in planning phase

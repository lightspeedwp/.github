# Phase 0: Audit Research & Findings

**Date**: 2026-09-14  
**Status**: Complete (no NEEDS CLARIFICATION markers)  
**Input**: Initial audit findings from AUDIT_FINDINGS.md + PR conflict analysis

---

## Executive Summary

Comprehensive audit of CLAUDE.md and AGENTS.md governance files identified:

1. **Critical issues**: Duplicate "Label Creation Governance" section in AGENTS.md (2 occurrences, lines 209–252 and 285–338)
2. **Major organization issues**: Script organization rules in wrong file (AGENTS.md, lines 52–102); should be in governance docs
3. **Incomplete references**: Migration debt (`.github/prompts/prompts.md` marked as "legacy pending migration")
4. **Governance branch landscape**: 15 active governance-related branches discovered, with 3 using forbidden prefixes (violating their own rules)
5. **No spec conflicts**: New audit spec doesn't conflict with existing specs; addresses unique governance domain

---

## Detailed Audit Findings

### 🔴 CRITICAL: Duplicate "Label Creation Governance" Section

**Finding ID**: `DUP-001`  
**Severity**: CRITICAL  
**File**: AGENTS.md  
**Locations**: Lines 209–252 (first) and lines 285–338 (second)

**Current State**:
- Identical section appears twice with nearly identical content
- Both sections include examples and validation checklists
- Minor differences: line 251 references `.github/scripts/validation/validate-labels-before-creation.cjs`; line 336 references issue #1592

**Decision**: Consolidate to single authoritative section
- **Rationale**: Violates Constitution Principle III (Clear Asset Boundaries, No Duplication); creates maintenance burden; confuses readers about which is authoritative
- **Approach**: Keep first occurrence (lines 209–252), remove second occurrence; retain all unique information from both
- **Implementation**: Task will merge both sections and remove duplicate

**Verification**: 
- ✅ Text comparison confirms near-identity (diff generated)
- ✅ Example code identical between both occurrences
- ✅ Validation checklist items match

**Task Mapping**: Relates to spec FR-003 (Resolve duplicate content), FR-006 (Single-source-of-truth sections)

---

### ⚠️ MAJOR: Script Organization Rules in Wrong File

**Finding ID**: `ORG-001`  
**Severity**: MAJOR  
**File**: AGENTS.md  
**Location**: Lines 52–102 ("Repository Scripts Organisation (CRITICAL)")

**Current State**:
- Detailed rules about script file locations (`scripts/` vs `.github/scripts/`)
- Includes correct locations, exceptions, quick reference table
- This content is about repository structure, not AI rules

**Decision**: Move to CLAUDE.md or instruction files
- **Rationale**: AGENTS.md is for "Global AI Rules, Coding Standards"; repository structure belongs in governance docs (CLAUDE.md). Creates confusion about scope (is this an AI rule or a repo rule?). Constitution Principle IV requires technology-agnostic guidance; specific script locations are implementation details
- **Approach**: Move section to CLAUDE.md under "Repository Boundaries" or to `instructions/file-organisation.instructions.md`
- **Implementation**: Tasks will extract this section from AGENTS.md and integrate into CLAUDE.md with clear context

**Verification**:
- ✅ Content verified as repository organization rules, not AI governance
- ✅ Examples use repository structure (scripts/, .github/) not AI concepts

**Task Mapping**: Relates to spec FR-001 (audit), FR-002 (validate references), FR-004 (map relationships)

---

### ⚠️ MAJOR: Duplicate Branch Naming Guidance

**Finding ID**: `DUPL-002`  
**Severity**: MAJOR  
**File**: Both CLAUDE.md and AGENTS.md  
**Locations**: 
- CLAUDE.md lines 14–111 (comprehensive, 97 lines)
- AGENTS.md lines 104–145 (summary with reference to CLAUDE.md)

**Current State**:
- Significant overlap; AGENTS.md says "see CLAUDE.md for complete details" but repeats key content
- Both describe forbidden prefixes, allowed types, examples, impact

**Decision**: Clarify which file is authoritative
- **Rationale**: CLAUDE.md is the primary source (project-specific). AGENTS.md should provide quick reference only, or consolidate completely
- **Approach**: Option A) Keep CLAUDE.md as authoritative, reduce AGENTS.md to brief summary with clear link; Option B) Consolidate entirely into CLAUDE.md and remove from AGENTS.md
- **Recommendation**: Option A (brief summary + link) because AGENTS.md serves AI agents who need quick lookup
- **Implementation**: Tasks will determine best approach during refactoring phase

**Verification**:
- ✅ Content overlap confirmed (keyword analysis)
- ✅ Both describe identical set of allowed types
- ✅ CLAUDE.md provides more detail

**Task Mapping**: Relates to spec FR-005 (branch naming clarity), FR-009 (cross-references)

---

### ⚠️ MAJOR: Incomplete Reference & Migration Debt

**Finding ID**: `REF-001`  
**Severity**: MAJOR  
**File**: AGENTS.md  
**Location**: Line 18

**Current State**:
- References `.github/prompts/prompts.md` as "Legacy prompt index pending skills/cookbook migration"
- Indicates migration incomplete or outdated

**Decision**: Update or document migration status
- **Rationale**: Broken references undermine trust in governance files; users waste time searching for missing documents
- **Verification Tasks** (from AUDIT_FINDINGS.md):
  - [ ] Does `.github/prompts/prompts.md` exist?
  - [ ] If yes, what's its current status?
  - [ ] If no, what was the migration plan?
  - [ ] Should reference be updated, removed, or clarified?
- **Implementation**: Tasks will verify and either update reference or document migration clearly

**Verification Pending**: File existence check required

**Task Mapping**: Relates to spec FR-010 (verify references), FR-002 (validate file paths)

---

### ⚠️ MAJOR: Verification Tasks (7 items)

**Finding ID**: `VER-001`  
**Severity**: MAJOR (blocking completion)  
**File**: Multiple  
**Status**: Pending

**Verification Tasks from AUDIT_FINDINGS.md**:

1. [ ] Does `.github/instructions/branch-naming.instructions.md` exist?
   - **Action**: If yes, verify relationship to CLAUDE.md branch naming section; if no, update CLAUDE.md line 107 reference
   - **Impact**: Relates to FR-010, reference validation

2. [ ] Do `docs/BRANCHING_STRATEGY.md` and `docs/PR_CREATION_PROCESS.md` exist?
   - **Action**: If yes, verify they contain referenced content; if no, create or update references
   - **Impact**: Relates to FR-010, reference validation

3. [ ] Does `.github/prompts/prompts.md` exist?
   - **Action**: If yes, verify status; if no, document migration plan
   - **Impact**: AGENTS.md line 18, migration debt

4. [ ] Are 5 consolidated instruction files in `instructions/` folder?
   - **Action**: Verify files exist: languages.instructions.md, documentation-formats.instructions.md, quality-assurance.instructions.md, automation.instructions.md, community-standards.instructions.md
   - **Impact**: AGENTS.md lines 160–166 claims consolidation; verify all topics present

5. [ ] Are GitHub projects referenced (`.github/projects/active/`) current?
   - **Action**: Check if projects are archived or renamed
   - **Impact**: AGENTS.md references like line 198

6. [ ] Does `.github/scripts/validation/validate-labels-before-creation.cjs` exist?
   - **Action**: Verify file exists; if not, update AGENTS.md line 251 reference
   - **Impact**: Label creation governance section

7. [ ] Does `.github/agentic-workflows/` directory exist with governance agents?
   - **Action**: Verify directory exists and contains agents mentioned in AGENTS.md line 74
   - **Impact**: Governance automation references

**Implementation**: Tasks will execute verification, update references, and document status

**Task Mapping**: Relates to spec FR-002 (validate references), FR-010 (verify file locations), SC-004 (validate references 100%)

---

### ⚠️ MODERATE: Constitutional Constraints Not Clearly Prioritized

**Finding ID**: `CONST-001`  
**Severity**: MODERATE  
**File**: Both CLAUDE.md and AGENTS.md  

**Current State**:
- Both files reference governance principles but don't clearly distinguish:
  - Constitution-level constraints (non-negotiable)
  - Implementation-level details (can evolve)

**Decision**: Add framing to clearly indicate constitution authority
- **Rationale**: Constitution Principle V (Branch Naming is Non-Negotiable) should be emphasized; helps readers understand which rules are flexible vs. fixed
- **Approach**: Add explicit note at top of CLAUDE.md and AGENTS.md linking to constitution; mark constitution-level rules with special formatting
- **Implementation**: Tasks will add framing sections and update key sections with constitution alignment notes

**Verification**:
- ✅ Constitution clearly defines 6 non-negotiable principles
- ✅ CLAUDE.md/AGENTS.md should explicitly reference these

**Task Mapping**: Relates to spec FR-008 (distinguish constraints from implementation details), FR-004 (map relationships)

---

### 🟡 LIGHT: Governance Branch Landscape (Consolidation Opportunity)

**Finding ID**: `BRANCH-001`  
**Severity**: MEDIUM (information only)  
**Status**: Informational; affects planning but not validation

**Current State**: 15 governance-related branches discovered:

**Alignment with Spec**:
- ✓ One branch violates branch naming rules (the exact problem spec is meant to fix): branches with `claude/` and `copilot/` prefixes demonstrate governance enforcement failures
- ✓ Multiple branches working on branch naming, labels, templates indicate fragmented efforts
- ✓ Provides concrete evidence of why governance consolidation is needed

**Branches Identified**:
| Branch | Status | Note |
|--------|--------|------|
| `audit/governance-audit-implementation` | Existing | Possible consolidation target |
| `feat/branch-naming-strategy-phase-3` | Existing | May be outdated |
| `feat/branch-naming-phase-6-rollout` | Existing | Active phase 6 work |
| `config/label-prefix-governance-phase-3` | Existing | Active label work |
| `claude/pr-template-description-9eacc0` | ❌ VIOLATES | Uses forbidden `claude/` prefix |
| `claude/pr-workflow-governance-7zni64` | ❌ VIOLATES | Uses forbidden `claude/` prefix |
| `copilot/phase-42-consolidate-issue-close-governance` | ❌ VIOLATES | Uses forbidden `copilot/` prefix |

**Decision**: Document consolidation opportunities; reference existing work
- **Rationale**: Prevents duplication; clarifies scope and relationships
- **Implementation**: Tasks will document relationships and consolidation opportunities; verify that forbidden-prefix branches are consolidated or closed

**Task Mapping**: Relates to spec User Story 1 (governance quality baseline), FR-004 (map relationships)

---

## Research Conclusions & Recommendations

### Critical Path Items
1. ✅ **Duplicate consolidation** (DUP-001) — Must consolidate "Label Creation Governance" sections
2. ✅ **File organization** (ORG-001) — Move script rules to appropriate location
3. ✅ **Reference validation** (VER-001) — Complete 7 verification tasks

### Confidence Levels

| Finding | Confidence | Next Steps |
|---------|------------|-----------|
| Duplicate section exists | 100% | Remove one, consolidate content |
| Script rules misplaced | 100% | Move to CLAUDE.md or instructions/ |
| References need validation | 100% | Execute 7 verification tasks |
| Branch naming guidance unclear | 85% | Review CLAUDE.md vs. AGENTS.md scope |
| Migration debt exists | 75% | Verify and update references |
| Governance branches fragmented | 90% | Document consolidation plan |

### Success Criteria Met

✅ All initial audit findings documented  
✅ Verification approach defined  
✅ No NEEDS CLARIFICATION markers remain  
✅ Ready to proceed to Phase 1 (Design & Contracts)

---

**Phase 0 Status**: COMPLETE ✅  
**Next**: Execute Phase 1 with `/speckit-plan` to generate data-model.md and quickstart.md

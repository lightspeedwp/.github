# Quickstart: Requirements Quality Checklist Workflow

**Phase**: Phase 1 | **Created**: 2026-09-12

## Overview

The Requirements Quality Checklist Framework is "unit tests for English". Checklists validate specifications BEFORE implementation starts, testing requirements quality across 8 dimensions (Completeness, Clarity, Consistency, Measurability, Scenario Coverage, Edge Cases, Dependencies, Ambiguities).

## Key Concept: What Checkbox States Mean

**CRITICAL**: `[x]` = "Requirements quality passes" NOT "Implementation complete"

| State | Meaning |
|-------|---------|
| `[ ]` | Item not evaluated yet |
| `[x]` | Requirements quality criterion satisfied |
| `[Gap]` | Requirement is absent; should be added |
| `[Ambiguity]` | Requirement exists but needs clarification |

---

## Scenario 1: Author Pre-Review (Author's Perspective)

### Step 1: Complete Specification Draft

Author finishes spec.md with all sections:
- Overview
- User Scenarios
- Functional Requirements (FR-1, FR-2, etc.)
- Success Criteria
- Key Entities
- Assumptions
- Constraints

### Step 2: Open Checklist

Author opens `specs/{NNN}-{feature}/checklists/requirements.md`

```markdown
# Specification Quality Checklist: [Feature Name]

**Purpose**: Validate specification completeness before peer review

## Completeness
- [ ] Are all necessary requirements documented?
- [ ] Are error handling requirements defined?
- [ ] Are accessibility requirements specified?

## Clarity
- [ ] Are success criteria measurable and specific?
- [ ] Is terminology consistent throughout?

[... 8 dimensions, 40+ items ...]
```

### Step 3: Self-Assessment (30 minutes)

Author reviews each item against their spec:

**Item 1**: "Are all necessary requirements documented?"
- Author checks their spec
- Finds: Overview ✅, Scenarios ✅, Requirements ✅, Success Criteria ✅, Entities ✅
- Result: `[x]` ✅ (Completeness dimension)

**Item 2**: "Are error handling requirements defined?"
- Author checks their spec
- Result: `[Gap]` — Error handling missing from Functional Requirements
- Action: Add FR to spec: "FR-5: System must return clear error messages for invalid input"

**Item 3**: "Are accessibility requirements specified?"
- Author checks their spec
- Finds: Mentioned in overview but no specific requirements
- Result: `[Ambiguity]` — Unclear whether WCAG 2.2 AA is required
- Action: Add assumption: "Assumes WCAG 2.2 AA accessibility compliance required"

### Step 4: Update Spec Based on Checklist

Author fixes identified gaps/ambiguities in spec.md, then re-checks checklist items.

### Step 5: Include Checklist with PR

Author includes completed checklist in PR submission:
- Checklist shows: 38/40 items passed ✅
- 2 gaps identified and fixed
- 0 ambiguities remain
- Ready for peer review

---

## Scenario 2: Peer Reviewer Review

### Step 1: Receive PR with Completed Checklist

Peer reviewer opens PR and sees:
```
Checklist Status:
✅ 38/40 items passed
⚠️ 2 gaps identified and resolved
✅ No remaining ambiguities
```

### Step 2: Review Checklist + Spec

Reviewer opens checklist and spec together:
- Verify author's `[x]` marks are justified
- Look for unchecked or `[Gap]`/`[Ambiguity]` items
- Identify additional gaps/inconsistencies

**Example Item Review**:
```markdown
## Clarity

- [x] Are success criteria measurable and specific? [Spec §Success Criteria]
  
  Author marked: [x]
  Reviewer checks Spec §Success Criteria:
  ✅ "Dashboard loads in under 2 seconds" (measurable)
  ✅ "API returns <100ms p95" (specific)
  ✅ "User can complete checkout in <3 minutes" (testable)
  
  Reviewer confirms: [x] ✅
```

### Step 3: Add Feedback

If reviewer finds issues, they add comments to checklist:

```markdown
- [ ] Are recovery flows defined for partial failures? [Gap]
  
  Reviewer Comment: "What happens if payment gateway times out?"
  Action: Author adds FR-7 covering retry logic and fallback behavior
```

### Step 4: Approve or Request Changes

- If all critical items pass: **APPROVE** ✅
- If gaps remain: **REQUEST CHANGES** with specific items to address

---

## Scenario 3: Stakeholder Approval Gate

### Step 1: Receive Completed Checklist

Stakeholder reviews:
- Checklist completion status
- Dimension coverage
- Gaps/ambiguities resolved

### Step 2: Make Go/No-Go Decision

Stakeholder asks:
- ✅ Are all critical items checked? → YES
- ✅ Have all gaps been addressed? → YES
- ✅ Are ambiguities resolved? → YES

**Decision**: ✅ APPROVE → Implementation can begin

---

## Scenario 4: Cross-Project Integration Review

Two related specs (Changelog Audit + Branch Naming) need dependency verification:

### Step 1: Integration Checklist

```markdown
## Cross-Project Dependencies

- [ ] Are dependencies between Spec 003 and Spec 004 documented?
- [ ] Can Phase 5 (Changelog) run in parallel with Phase 2 (Branch Naming)?
- [ ] Are resource requirements clear?
```

### Step 2: Verify Alignment

Reviewer checks:
- Changelog Phase 5 depends on Branch Strategy Phase 2? (Timeline alignment)
- Both specs use same validation framework? (Consistency)
- No conflicting assumptions? (Dependencies)

---

## 8 Quality Dimensions Quick Reference

| Dimension | Tests | Example Failure |
|-----------|-------|-----------------|
| **Completeness** | Nothing missing | Spec has Requirements but no Edge Cases |
| **Clarity** | Unambiguous | "Should be fast" instead of "< 2 seconds" |
| **Consistency** | No conflicts | §FR-1 and §FR-5 contradict |
| **Measurability** | Testable criteria | "User experience improved" not measurable |
| **Scenario Coverage** | All flows included | Missing error recovery paths |
| **Edge Cases** | Boundaries defined | No specification for invalid input |
| **Dependencies** | Assumptions documented | External API requirements unclear |
| **Ambiguities** | Unclear areas flagged | "Support large datasets" undefined |

---

## Checklist as Communication Tool

**For Authors**: "What must I include before asking for review?"

**For Reviewers**: "Here's my systematic review framework"

**For Stakeholders**: "Specification is complete and ready? Check these boxes."

**For Integration**: "Do these two specs align and support parallel work?"

---

## Phase 1 Complete

Quickstart guide for Requirements Quality Checklist workflow across all audience types.

# Fix 1.5: Add Issue DoD Validation Before Close

## Problem

Issues can close with incomplete DoD checklist. No validation that work is actually done.

## Solution

Create new workflow `validate-issue-dod-before-close.yml` that:

1. Triggers on `issues.closed`
2. Parses DoD section from issue body
3. Counts unchecked items
4. If unchecked items exist (and no `meta:force-close` label): reopen + comment

## Acceptance Criteria

1. ✅ New workflow created: `validate-issue-dod-before-close.yml`
2. ✅ Parses DoD section correctly
3. ✅ Counts unchecked items
4. ✅ Supports `meta:force-close` override
5. ✅ Test: incomplete DoD → reopen + comment
6. ✅ Test: complete DoD → allow close
7. ✅ Test: force-close → allow close despite incomplete

## Implementation

See IMPLEMENTATION_PLAN.md for detailed workflow code and testing strategy.

## Estimated Time

- **Total:** 2.5 hours

---

**Type:** Feature  
**Priority:** High  
**Effort:** 2.5 hours  
**Phase:** 1  
**Target Date:** July 29-30, 2026

---
issue_type: task
title: "Fix 1.4: Fix Template-Enforcement Silent Reopening"
priority: high
area: ci
domain: dotgithub
team: Engineering
effort: 2.5
parent_epic: "Epic: Issue Type & Metadata Automation Initiative"
---

# Fix 1.4: Fix Template-Enforcement Silent Reopening

## Problem

`.github/workflows/template-enforcement.yml` silently reopens incomplete issues without clear guidance. Creates confusing UX where users don't understand why issue keeps reopening.

## Solution

Replace silent reopening with:

1. Detailed comment explaining what's missing
2. Label assignment (`status:needs-template-fix`)
3. NO reopen (user decides what to do)
4. Escape hatch: `meta:force-close` label to override

## Acceptance Criteria

1. ✅ No silent issue reopening
2. ✅ Post detailed guidance comment
3. ✅ Add `status:needs-template-fix` label
4. ✅ Support `meta:force-close` override
5. ✅ Allow force-close with proper documentation
6. ✅ Test scenarios: incomplete issue, complete issue, force-close

## Implementation Steps

### File: `.github/workflows/template-enforcement.yml`

Replace lines 211-221 (the reopen logic) with detailed guidance logic.

See IMPLEMENTATION_PLAN.md for detailed code changes.

## Testing

- [ ] Incomplete issue closed → post guidance + label (don't reopen)
- [ ] Complete issue closed → allow close normally
- [ ] Incomplete + `meta:force-close` → allow close

## Estimated Time

- **Total:** 2.5 hours

---

**Type:** Task  
**Priority:** High  
**Effort:** 2.5 hours  
**Phase:** 1  
**Target Date:** July 28-29, 2026

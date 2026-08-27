---
file_type: documentation
title: ""Feature 2.1: Implement PR Merge Blocker (DoD Check)""
description: "Project documentation"
last_updated: "2026-08-25"
status: active
---

# Feature 2.1: Implement PR Merge Blocker (DoD Check)

## Problem

PR can merge even if linked issue has incomplete DoD checklist.

## Solution

Create new workflow `validate-linked-issue-dod-on-pr.yml` that:

1. Parses linked issues from PR body
2. For each linked issue: check DoD completion
3. If incomplete: block merge + post comment

## Acceptance Criteria

1. ✅ Parse linked issues (closes #123, fixes #456)
2. ✅ Check DoD completion for each
3. ✅ Block merge if incomplete
4. ✅ Post clear comment listing incomplete items
5. ✅ Test: PR with incomplete linked issue → merge blocked
6. ✅ Test: PR with complete linked issue → merge allowed

## Estimated Time

- **Total:** 3.5 hours

---

**Type:** Feature  
**Priority:** High  
**Effort:** 3.5 hours  
**Phase:** 2  
**Target Date:** Aug 6-7, 2026

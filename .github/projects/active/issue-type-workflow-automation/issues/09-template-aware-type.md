---
issue_type: task
title: "Feature 2.3: Template-Aware Type Detection"
priority: medium
area: ci
domain: dotgithub
team: Engineering
effort: 1.5
parent_epic: "Epic: Issue Type & Metadata Automation Initiative"
---

# Feature 2.3: Template-Aware Type Detection

## Problem

Type detection is keyword-only. Ignores which template was actually selected.

Example: Feature template with "bug" in body → gets type:bug (wrong!)

## Solution

Enhance `.github/workflows/issues.yml` to:

1. Check if issue body contains template signature
2. Map template → type (bug.md → type:bug)
3. Fall back to keyword detection if no signature
4. Template selection wins over keywords

## Acceptance Criteria

1. ✅ Detect template signature from issue body
2. ✅ Map all 25 templates to types
3. ✅ Template wins over keyword heuristics
4. ✅ Fall back to keywords if no signature
5. ✅ Test: Feature template with "bug" in body → type:feature

## Estimated Time

- **Total:** 1.5 hours

---

**Type:** Task  
**Priority:** Medium  
**Effort:** 1.5 hours  
**Phase:** 2  
**Target Date:** Aug 8, 2026

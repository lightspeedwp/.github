---
file_type: documentation
title: ""Feature 2.2: Auto-Populate Custom Fields""
description: "Project documentation"
last_updated: "2026-08-25"
status: active
---

# Feature 2.2: Auto-Populate Custom Fields

## Problem

7 custom fields are empty on issue creation. All must be manually filled.

## Solution

Create new workflow `populate-custom-fields-on-create.yml` that infers:

- **Risk:** High (security), Medium (bug), Low (other)
- **Impact:** High/Medium/Low based on type
- **Domain:** Inferred from area label
- **Team:** Inferred from area label
- **Effort:** Estimated from type + body length
- **Spec Link:** Extract from issue body (if present)

## Acceptance Criteria

1. ✅ Risk field auto-populated (High/Medium/Low)
2. ✅ Impact field auto-populated
3. ✅ Domain field inferred from area
4. ✅ Team field inferred from area
5. ✅ Effort estimated (story points)
6. ✅ Spec Link extracted (if present)
7. ✅ Test: 10 issues of various types → fields populated

## Estimated Time

- **Total:** 4.5 hours

---

**Type:** Feature  
**Priority:** High  
**Effort:** 4.5 hours  
**Phase:** 2  
**Target Date:** Aug 7-8, 2026

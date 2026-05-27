---
name: "Task"
about: "Implement scoped README regeneration and concurrency guard for issue #67"
title: "[Task] Scope README regeneration and add concurrency guard (#67)"
labels: [status:ready, priority:important, type:task, area:ci, type:documentation]
---

## Task Summary

Implement the #67 workflow hardening so README regeneration only runs where changes require it and avoids concurrent run conflicts.

## Implementation Checklist

- [ ] Restrict trigger paths to relevant docs or metadata files.
- [ ] Add concurrency key and cancel-in-progress policy where appropriate.
- [ ] Ensure skip logic still preserves required updates.
- [ ] Validate workflow behaviour with representative file-change scenarios.

## Acceptance Criteria

- [ ] #67 documents final trigger scope and concurrency policy.
- [ ] No duplicate/conflicting README writes in concurrent PR activity.
- [ ] Existing docs validation and generation still succeed.

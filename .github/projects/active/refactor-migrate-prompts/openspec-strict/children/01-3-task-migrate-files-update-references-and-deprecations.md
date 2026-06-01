---
name: "📝 Task"
about: "Propose a well-scoped unit of work: template tweaks, config updates, copy edits, etc."
labels: [status:needs-review, priority:normal, type:task, area:documentation, area:automation]
---

# [Task] Migrate files, update prompt references, and add deprecation paths

## template-map

- template_file: `.github/ISSUE_TEMPLATE/01-task.md`

## Deliverables

1. Updated `prompts/README.md` with migrated prompt catalogue.
2. Updated `.github/prompts/README.md` clarifying control-plane-only scope.
3. Deprecation notes for legacy prompts that moved or merged.

## Acceptance Criteria

- [ ] Both prompt READMEs reflect canonical boundaries.
- [ ] Legacy prompts include clear successor path notes where required.
- [ ] Link checks pass for prompt indexes and cross-references.
- [ ] Migration guidance is explicit and reproducible.

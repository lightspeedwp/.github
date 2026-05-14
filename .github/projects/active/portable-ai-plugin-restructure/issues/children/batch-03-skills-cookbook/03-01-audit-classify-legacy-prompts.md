---
name: "Audit"
about: "Propose, conduct, or document a security, accessibility, code, or process audit."
title: "[Audit] Classify legacy prompts as skill, cookbook, archive, or delete"
labels: [status:needs-audit, priority:important, type:ai-ops]
github_issue: "https://github.com/lightspeedwp/.github/issues/299"
github_parent: "https://github.com/lightspeedwp/.github/issues/283"
---

## Audit Summary

Classify every `.github/prompts/*.prompt.md` file before converting prompts
into skills or cookbook recipes.

Parent epic: #283 (<https://github.com/lightspeedwp/.github/issues/283>).

## Audit Checklist / Scope

- [ ] Inventory all current prompt files.
- [ ] Identify files missing frontmatter.
- [ ] Classify each prompt as skill, cookbook, archive, delete, or defer.
- [ ] Identify P0 pilot skill candidates.
- [ ] Add classification to the migration decision map.

## Findings / Risks

Risk: migrating all prompts as-is would recreate the old prompt sprawl in the
new structure.

## Remediation Actions

- [ ] Create child issues only for selected P0 conversions.
- [ ] Archive or defer lower-priority prompts.

## Acceptance Criteria

- [ ] Audit scope and checklist completed.
- [ ] Findings and risks documented.
- [ ] Remediation actions assigned and tracked.
- [ ] Documentation/changelog updated if applicable.
- [ ] PR uses correct branch prefix `audit/`.

## Additional Context

The target structure intentionally does not include a top-level `/prompts`
folder.

### Definition of Ready (DoR)

- [ ] Audit scope, checklist, and goals defined.
- [ ] Areas/components listed.
- [ ] Dependencies and standards mapped.

### Definition of Done (DoD)

- [ ] Audit performed and findings documented.
- [ ] Remediation actions assigned.
- [ ] Documentation/changelog updated if applicable.
- [ ] PR uses correct branch prefix `audit/`.

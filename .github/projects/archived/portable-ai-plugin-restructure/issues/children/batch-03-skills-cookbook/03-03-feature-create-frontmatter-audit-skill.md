---
name: "Feature"
about: "Propose a net-new capability, enhancement, or workflow improvement."
title: "[Feature] Create `lightspeed-frontmatter-audit` skill"
labels: [status:needs-triage, priority:important, type:ai-ops]
github_issue: "https://github.com/lightspeedwp/.github/issues/301"
github_parent: "https://github.com/lightspeedwp/.github/issues/283"
---

## Summary

Create the first P0 governance skill for auditing AI files for frontmatter,
schema drift, stale references, and missing indexes.

Parent epic: #283 (<https://github.com/lightspeedwp/.github/issues/283>).

## Proposed Solution

Add `/skills/lightspeed-frontmatter-audit/SKILL.md` with clear workflow steps,
inputs, expected outputs, and references to active schemas and validation
commands.

## Acceptance Criteria

- [ ] Skill folder exists with `SKILL.md`.
- [ ] Skill name matches folder name.
- [ ] Skill covers frontmatter, schema drift, stale links, and missing indexes.
- [ ] Skill output format is documented.
- [ ] Skill is eligible for inclusion in `plugins/lightspeed-github-ops`.
- [ ] Documentation/changelog updated.
- [ ] PR uses correct branch prefix `feat/`.

## Designs / References

Derived from PRD favourite skills backlog.

## Dependencies

Depends on `/skills` library index and migration map.

## Testing Approach

Run `validate:skills` once available; until then, manually verify folder shape.

## Additional Context

Keep the skill text tool-neutral.

## Definition of Ready (DoR)

- [ ] Problem statement and outcome defined.
- [ ] Acceptance criteria written.
- [ ] Designs/specs/references attached if relevant.
- [ ] Dependencies mapped.
- [ ] Estimate added.
- [ ] Stakeholders/approvers listed.
- [ ] Milestone/iteration assigned if applicable.

## Definition of Done (DoD)

- [ ] All acceptance criteria met.
- [ ] Tests added/updated; CI green.
- [ ] Accessibility, performance, security checks where relevant.
- [ ] Docs/changelog updated.
- [ ] Feature toggles/rollout considered.
- [ ] QA verified/UAT approved if applicable.
- [ ] Release notes prepared; monitoring/alerts set.

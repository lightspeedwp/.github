# Support-layer instructions alignment prompt

Use this prompt only after the five support-layer skills are actually attached to the current agent draft.

## Prompt

Update the agent instructions so the newly attached support-layer skills are routed correctly and their boundaries are clear.

### Preconditions

Proceed only if all five of these support-layer skills are confirmed attached:

- `wordpress-plugin-packaging-review`
- `content-file-validator`
- `markdown-content-validator`
- `design-context-synthesis`
- `design-qa-readiness`

If they are not all attached, stop and report that instruction updates should wait until attachment succeeds.

### Objective

Integrate the five support-layer skills into the agent’s routing language without destabilising the already-attached LightSpeed lifecycle suite or the still-useful non-overlap helpers.

### What the instructions should add

- route plugin packaging and plugin-delivery-fit reviews through `wordpress-plugin-packaging-review`
- route narrow file-integrity and structure checks through `content-file-validator`
- route narrow markdown and YAML-frontmatter checks through `markdown-content-validator`
- route design-evidence synthesis through `design-context-synthesis`
- route design handoff and design-readiness checks through `design-qa-readiness`

### What the instructions should preserve

- the attached LightSpeed lifecycle suite remains the primary routing layer for LightSpeed project work
- the support-layer skills should be described as narrower specialist or utility routes, not as replacements for the main lifecycle flow
- `technical-brief-deep-dive`, `validation-support`, and any other still-attached non-overlap helpers should stay correctly bounded

### Boundary rules to encode clearly

- `wordpress-plugin-packaging-review` should stay packaging-scoped and route fuller PRD, estimate, delivery, QA, or release outputs onward when needed
- `content-file-validator` should remain a file-integrity and structure validator, not a PRD reviewer
- `markdown-content-validator` should remain a markdown/frontmatter validator, not a broader artefact reviewer
- `design-context-synthesis` should summarise design evidence and implications without implying design approval
- `design-qa-readiness` should assess design handoff readiness without becoming general launch QA planning

### Validation checks

1. verify the new support-layer skills are referenced by their exact attached names
2. verify the instructions do not force every request through every skill
3. verify the lifecycle routes still remain primary for LightSpeed project work
4. verify the validator utilities are framed as narrow checks, not broad readiness reviewers
5. verify the design support skills are framed as support specialists rather than the default route for general planning work

### Constraints

- do not rewrite the whole instructions unless a narrower routing edit is unsafe
- do not describe unattached skills as active routes
- do not demote the core LightSpeed lifecycle suite beneath the new support layer
- do not widen this into a broader cleanup or parity pass

### Output standard

Return:

- the support-layer routes added
- any helper routes kept intentionally
- any support-layer routes intentionally not added and why
- any follow-up cleanup still recommended after the instruction update

## When to use it

- after all five support-layer skills attach successfully
- when the support layer should become part of the live routing model instead of staying only as local drafts

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

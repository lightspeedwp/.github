# Routing Validation Cleanup Prompt

## Purpose

Use this recurring prompt when you want a focused cleanup pass across the routing and validation slice of this agent pack.

## Prompt

Audit and tighten the routing-and-validation slice of this agent pack.

Primary goal:

- make the current routing language, validation guidance, and supporting consistency notes agree with each other
- leave nothing in the routing/validation slice blocking
- keep the pass conservative and grounded to the real file tree

Scope priorities:

1. routing language and consistency notes
2. validation guidance and validation-adjacent documentation
3. linked test sources, examples, or references that should match the routing language
4. only then any broader consistency touch-ups that clearly improve the same validation layer

Required working rules:

- Treat the current file tree as source of truth.
- Prefer tightening existing wording over broad rewrites.
- Keep the pass limited to the routing/validation slice unless a nearby inconsistency would otherwise leave that slice misleading or blocked.
- If you touch related files outside the core slice, keep those edits minimal and directly supportive of the routing/validation goal.
- Do not invent files, folders, validators, schemas, or references that are not justified by the existing structure.
- Keep duplicate findings conservative and only treat exact duplicates as deletion candidates.

During the pass:

- compare root and folder README guidance against the actual structure
- check validation checklists, validator references, and routing wording for drift
- tighten consistency notes where the new routing language should now be the canonical wording
- review nearby examples, references, or test-source docs only when they materially affect validation accuracy
- preserve the existing Playwright Testing Agent role and asset-pack structure

Output requirements:

1. short audit summary of what was inconsistent
2. exact files updated
3. remaining non-blocking follow-up opportunities, if any
4. explicit confirmation that nothing in the requested routing/validation slice remains blocking

Validation expectation:

- Run the documented validation entry point when file-quality changes are in scope.
- If a broader pass is useful, do it only where it tightens the same validation layer around the new routing language.

## Best Use Cases

- after changing routing terminology
- after tightening validator rules or checklist wording
- before a README refresh pass
- before a validation-pack tightening pass

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

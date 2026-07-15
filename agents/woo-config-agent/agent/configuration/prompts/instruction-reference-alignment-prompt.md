# Instruction Reference Alignment Prompt

Use this recurring prompt when you want to audit and repair the main instructions' attached-file references, grounded entity tags, and maintenance-reference links.

## Recommended prompt

```text
Audit this WooCommerce Configuration Agent's main instructions for reference alignment, then implement any needed fixes directly.

Primary goal:
Make sure the main instructions reference the correct attached files, apps, skills, and maintenance guides, and do not drift into stale, missing, or ungrounded references.

Scope:
1. Review the current main instructions.
2. Check all attached-file references, named guide references, entity tags, and maintenance-file mentions.
3. Verify that named files and tagged entities still exist in the current attached draft.
4. Check whether the instructions still describe the current maintained folder structure accurately.
5. Tighten or correct references when:
   - a file reference is stale or missing
   - a folder assumption is no longer grounded
   - a maintenance guide is named incorrectly
   - a local skill, app, or file should be referenced more precisely
6. Keep the agent WooCommerce-first and do not broaden the scope into unrelated instruction rewrites.

Focus especially on:
- main instruction references to `references/`, `tests/`, `schemas/`, `scripts/`, and `prompts/`
- entity-tagged references to attached files, apps, and local skills
- maintenance-workflow references
- wording that assumes unattached folders or assets exist

Constraints:
- Use the current attached file tree and attached local skills as source of truth.
- Be conservative and precise.
- Do not invent missing files, folders, or entities.
- Do not remove a valid reference just because it is rarely used.
- Only change instruction wording when needed to restore grounded reference accuracy.

Deliverable format:
1. Audit summary
- stale or ungrounded references found
- grounded references confirmed
2. Instruction changes made
- exact references fixed or tightened
- exact files, apps, or skills now referenced
3. Validation result
- whether the instructions now match the attached draft structure
- any remaining non-blocking reference gaps
```

## Use notes

- Treat the current draft as canonical.
- Prefer correcting stale references over broad instruction rewrites.
- Keep this pass focused on grounded reference alignment.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

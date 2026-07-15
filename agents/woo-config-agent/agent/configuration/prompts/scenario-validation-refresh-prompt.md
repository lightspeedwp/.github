# Scenario Validation Refresh Prompt

Use this recurring prompt when you want to refresh the scenario-based validation coverage in `tests/scenario-validation-workflows.md` so it matches the current routes, maintenance boundaries, and supported work patterns.

## Recommended prompt

```text
Refresh this WooCommerce Configuration Agent's scenario-based validation coverage so it matches the current routing model, maintenance boundaries, and supported work patterns.

This is an implementation task.

Primary goal:
Keep the scenario validation layer realistic, route-aware, and aligned with the current attached local skills, app guidance, and maintenance workflow.

Scope:
1. Review the current main instructions, routed local skills, app guidance, and maintenance boundaries.
2. Review `tests/scenario-validation-workflows.md`.
3. Update existing scenarios or add missing ones only when they are needed to cover the current supported workflows.
4. Check whether scenario expectations still reflect:
   - site discovery
   - WooCommerce audits and reviews
   - implementation planning
   - remediation triage
   - Yoast work
   - Gravity Forms work
   - accessibility work
   - maintenance-workflow handling
5. Remove or tighten scenario wording that overclaims unsupported edits, broadens the agent into a generic WordPress router, or misses an important current route boundary.

Constraints:
- Use the current attached local skills, attached apps, and current instructions as source of truth.
- Be conservative and precise.
- Do not invent unsupported workflows.
- Keep the agent WooCommerce-first.

Deliverable format:
1. Scenario audit summary
2. Exact scenario changes made
3. Validation result
```

## Use notes

- Use this after meaningful route, app-guidance, or maintenance-boundary changes.
- Prefer tightening existing scenarios before adding new ones.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

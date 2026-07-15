# Connectors Guide Validation Prompt

Use this recurring prompt when you want to validate app-usage guidance and `references/CONNECTORS.md` against the current attached app set and instruction layer.

## Recommended prompt

```text
Validate this WooCommerce Configuration Agent's connectors guide and app-usage guidance against the current attached apps, then report any issues clearly.

This is a validation task first. Do not repair issues unless I explicitly ask for the repair pass afterwards.

Primary goal:
Make sure `references/CONNECTORS.md`, the app-usage guidance in the instructions, and the app-usage validation sources all align with the currently attached apps and current WooCommerce-first operating model.

Scope:
1. Review:
   - `references/CONNECTORS.md`
   - `tests/app-usage-consistency-source.md`
   - the main instructions app-usage sections
   - any saved prompts that describe current app guidance or app-maintenance work
2. Verify that the current attached apps are described accurately.
3. Check whether any app guidance is stale, unsupported, over-broad, or missing a grounded current app.
4. Check whether connected-site inspection still has the correct priority when the current site app is available.
5. Check whether maintenance docs still point app-usage upkeep to the maintenance workflow and connectors guide.

Constraints:
- Use the current attached apps and runtime tools as source of truth.
- Keep the agent WooCommerce-first.
- Do not invent unsupported app workflows.
- Distinguish between true app-guidance errors and minor documentation drift.

Deliverable format:
1. Validation summary
- whether the connectors guide matches the current app set
- whether instruction-level app guidance is consistent
2. Issues found
- file
- issue type
- what is wrong
- why it is wrong
- affected app or workflow
- severity
3. Recommended repair plan
- exact files to update
- what they should be corrected to say
4. Final validation verdict
- pass / pass with follow-up / fail
```

## Use notes

- Treat current attached apps as canonical.
- Prefer exact drift findings over generic app recommendations.
- Keep this pass focused on app-usage and evidence-boundary guidance.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

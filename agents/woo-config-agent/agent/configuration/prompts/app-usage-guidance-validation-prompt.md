# App Usage Guidance Validation Prompt

Use this recurring prompt when you want to validate this WooCommerce Configuration Agent's connected-app guidance against the currently attached apps, runtime tools, and maintenance references.

## Recommended prompt

```text
Validate this WooCommerce Configuration Agent's app-usage guidance against the currently attached apps, runtime tools, and maintenance references, then report any drift clearly.

This is a validation task first. Do not silently repair issues unless I explicitly ask for the repair pass afterwards.

Primary goal:
Make sure the agent's instructions, app-reference notes, validation-source files, and saved prompts describe the currently attached apps accurately and do not drift into stale, unsupported, or hypothetical app workflows.

Current app and runtime-tool scope to treat as source of truth:
- `KWV-Dev-Site`
- `Google Drive`
- `GitHub`
- `Bugherd`
- `Linear`
- `Web search`
- `Memory`

Validation scope:
1. Review app guidance in the main instructions.
2. Review app-reference and validation-supporting files, especially:
   - `references/CONNECTORS.md`
   - `tests/app-usage-consistency-source.md`
   - `tests/validation-readme.md`
   - `references/audit-docs-validation-workflow.md`
   - saved recurring prompts in `prompts/` when they mention app usage or evidence sources
3. Verify that app guidance stays WooCommerce-first and task-relevant.
4. Check whether any file:
   - references missing or unattached apps as if they are already available
   - omits an attached app that materially affects the current guidance
   - overstates what a connected app proves
   - places general app advice ahead of connected-site inspection when `KWV-Dev-Site` is available
   - treats maintenance app guidance as delivery-routing logic
5. Validate that `references/CONNECTORS.md` remains the durable app-usage reference for maintenance work.

Constraints:
- Use the current attached apps and runtime tools as source of truth.
- Be conservative and precise.
- Do not invent missing apps or unsupported workflows.
- Validation should identify issues clearly, but should not repair them yet unless explicitly asked.

Deliverable format:
1. Validation summary
2. Issues found
3. Recommended repair plan
4. Final validation verdict
```

## Use notes

- Treat the current attached apps and runtime tools as canonical.
- Distinguish between app-guidance drift and normal task-specific delivery guidance.
- Prefer exact file-specific findings over broad generic advice.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

# App Usage Guidance Repair Prompt

Use this recurring prompt after running `prompts/app-usage-guidance-validation-prompt.md` when you want to repair app-guidance drift across the instructions, references, validation notes, and prompt library.

## Recommended prompt

```text
Use the output from the app-usage guidance validation pass as the implementation plan, then repair the issues directly.

This is an implementation task, not just a review.

Primary goal:
Bring this WooCommerce Configuration Agent's app guidance, maintenance references, validation notes, and prompt-library wording into alignment with the currently attached apps and runtime tools.

Current app and runtime-tool scope to treat as source of truth:
- `KWV-Dev-Site`
- `Google Drive`
- `GitHub`
- `Bugherd`
- `Linear`
- `Web search`
- `Memory`

Repair scope:
1. Main instructions
- Repair stale, generic, unsupported, or missing app references.
- Preserve the rule that connected-site inspection comes first when `KWV-Dev-Site` is available.
2. Maintenance and validation docs
- Repair any file that lists or describes the current app guidance inaccurately.
- Keep `references/CONNECTORS.md` as the durable app-usage reference.
3. Prompt library
- Repair any saved recurring prompt that encodes stale app assumptions or outdated app lists.
4. Boundaries
- Keep app guidance WooCommerce-first and task-relevant.
- Keep maintenance app guidance separate from delivery routing.

Constraints:
- Use the current attached apps and runtime tools as source of truth.
- Be conservative and precise.
- Do not invent missing apps or unsupported workflows.

Deliverable format:
1. Repair summary
2. App-guidance changes made
3. Validation result
```

## Use notes

- Run the validation prompt first when possible.
- Prefer exact file-specific repairs over broad rewrites.
- Keep the repair pass scoped to app-guidance alignment unless a new blocking issue is discovered.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

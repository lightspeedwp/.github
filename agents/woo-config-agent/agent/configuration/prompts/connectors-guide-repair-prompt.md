# Connectors Guide Repair Prompt

Use this recurring prompt after running `prompts/connectors-guide-validation-prompt.md` when you want to repair app-usage guidance and connectors-guide drift.

## Recommended prompt

```text
Use the output from the connectors-guide validation pass as the implementation plan, then repair the app-usage and connectors-guide issues directly.

This is an implementation task, not just a review.

Primary goal:
Bring `references/CONNECTORS.md`, the main instruction app-usage guidance, validation source files, and related prompt-library notes into alignment with the current attached apps and current WooCommerce-first operating model.

Repair scope:
1. Fix stale or inaccurate attached-app descriptions.
2. Fix outdated app-priority wording or missing current app coverage.
3. Repair maintenance docs or validation files that still encode old app-usage assumptions.
4. Keep connectors guidance practical, evidence-led, and maintenance-friendly.

Constraints:
- Use the current attached apps and runtime tools as source of truth.
- Be conservative and precise.
- Do not invent unsupported app flows.
- Do not broaden the agent into a generic app router.
- Preserve the maintenance boundary: app-usage upkeep belongs in the maintenance workflow and connectors guide.

Deliverable format:
1. Repair summary
- what was corrected
- which files were updated
2. App-guidance changes made
- exact app descriptions, priorities, or boundaries fixed
3. Validation result
- whether the repaired files now match the current attached app set
- any remaining non-blocking follow-up items
```

## Use notes

- Run the validation prompt first when possible.
- Treat the current attached apps as canonical even if older docs disagree.
- Prefer exact file-specific repairs over broad rewrites.

# Source Snapshot Refresh Prompt

Use this recurring prompt when you want to refresh the validation source-snapshot files in `tests/` so they match the current instructions, prompt library, attached apps, routed local skills, and maintained file structure.

## Recommended prompt

```text
Refresh this WooCommerce Configuration Agent's validation source-snapshot files so they accurately reflect the current instructions, prompt library, attached apps, routed local skills, and maintained file structure.

This is an implementation task.

Primary goal:
Keep the snapshot files in `tests/` aligned with the current source of truth so validators catch real drift instead of outdated expectations.

Scope:
1. Review the current instructions, current prompt library, current app guidance, current routed local skills, and current maintained file tree.
2. Refresh the relevant source-snapshot files in `tests/`, especially:
   - `tests/instruction-file-consistency-source.md`
   - `tests/app-usage-consistency-source.md`
   - `tests/starter-prompt-consistency-source.md`
   - `tests/short-description-consistency-source.md`
3. Update route markers, skill lists, prompt-library references, app lists, and structure notes only where the current attached state supports them.
4. Distinguish between:
   - instruction-linked file references
   - routed local skill snapshots
   - attached app snapshots
   - presentation snapshots
5. Do not repair unrelated validator code unless the snapshot files themselves require a paired documentation adjustment.

Constraints:
- Use the current attached draft state as source of truth.
- Be conservative and precise.
- Do not invent missing files, apps, skills, or route markers.

Deliverable format:
1. Refresh summary
2. Exact snapshot files updated
3. Validation result
```

## Use notes

- Use this when instructions, prompt-library files, app guidance, starter prompts, short description, or local skill routing changed.
- Prefer replacing stale snapshot wording over layering duplicate notes.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

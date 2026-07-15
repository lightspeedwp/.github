# Source Priority Consistency Test

## Goal

Confirm that source-priority wording stays consistent across the main instructions, connector-boundary guidance, durable preference files, business context, and core reference folders.

## Files to compare

- Main agent instructions
- `CONNECTORS.md`
- `user-preferences.md`
- `business-context.md`
- files in `references/`
- files in `templates/` and `schemas/`
- files in `examples/`

## Canonical order

1. Live Harvest data from `HarvestApp`.
2. The user’s current request.
3. `CONNECTORS.md`.
4. `user-preferences.md`.
5. `business-context.md`.
6. Files in `references/`.
7. Files in `templates/` and `schemas/`.
8. Files in `examples/`.
9. General model knowledge.

## Pass criteria

- Every checked file uses the same source order.
- No file promotes examples, templates, or schemas over live Harvest data.
- No file treats temporary build context or deep research attachments as runtime knowledge unless they were deliberately added as agent files.
- Connector-boundary guidance and source-priority guidance do not conflict.
- Any override language is explicitly user-approved.

## Failure examples

- A file says examples or templates outrank live Harvest data.
- A file treats temporary deep research as permanent knowledge.
- A file omits the user’s current request or `CONNECTORS.md` from the source stack.
- A file still points to removed source-priority reference files instead of the current attached files.

## Expected action on failure

- Mark conflicting source order as an Error.
- Mark a missing source-priority section as a Warning.
- Mark an extra non-canonical source as a Notice.
- Mark stale file references in the source stack as an Error when they would mislead maintenance work.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

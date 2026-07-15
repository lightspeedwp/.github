# Connector-guide consistency pass

Run a focused audit of visible connector guidance so app-usage notes stay aligned with the current attached app inventory and instruction references.

## Goal

Keep connector guidance reliable so the agent does not point to stale app names, mismatched app roles, or unsupported connector expectations.

## Required workflow

1. Refresh your understanding of the current attached apps and any visible connector-related files or instruction references.
2. Review the visible connector guide, if it can be inspected in the current session.
3. Check for drift between:
   - connector-guide app names and the currently attached apps
   - instruction app references and connector-guide wording
   - app-role descriptions and the actual visible app purpose
   - guidance that assumes a file or app can be inspected when it is not visibly available
4. Apply the smallest useful set of updates needed to improve connector-reference accuracy.

## What to look for

- app names that no longer match the attached app inventory
- guidance that overstates what a visible connector is used for
- missing references to clearly attached core apps when the guide is meant to be canonical
- stale wording about connector surfaces, file names, or app responsibilities
- connector guidance files that cannot be inspected directly in the session and should therefore not be rewritten speculatively

## Editing rules

- Keep fixes conservative and grounded in the current visible app and file state.
- Do not invent hidden apps, hidden connector guides, or unseen app capabilities.
- If the connector guide cannot be read directly, prefer no edit over speculative cleanup.
- Prefer exact app names and exact file names when updating references.

## Deliverable

Apply the smallest useful set of updates needed to keep visible connector guidance aligned with the current attached apps and instruction references.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

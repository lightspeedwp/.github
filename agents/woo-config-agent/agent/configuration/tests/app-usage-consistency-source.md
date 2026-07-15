# App Usage Consistency Source

Use this file as the source snapshot for app-usage consistency validation.

## Attached apps snapshot used in the current instructions

- `KWV-Dev-Site`
- `Google Drive`
- `GitHub`
- `Bugherd`
- `Linear`

## Runtime/tool reference snapshot used in the current instructions

- `references/CONNECTORS.md`
- `Memory`
- `Web search`

## Required instruction markers

- `For any real site, store, or environment evaluation, always start with`
- `## Other Connected Apps`
- `## Agent Asset Maintenance Workflow`
- `## Memory`

## Forbidden app-guidance drift

- `### Slack usage`
- `Use Slack`
- `Send to Slack`
- `Post in Slack`
- `Calendar workflow`
- `Email triage`

## Instruction excerpt snapshot

The current app guidance should remain consistent with these rules:

- `KWV-Dev-Site` is the primary connected site app for real site, store, or environment inspection when available.
- The instructions say not to ask for URLs, screenshots, or exports before attempting connected-site inspection when that app is available.
- `## Other Connected Apps` says connected apps should be used only when they materially help the WooCommerce task.
- `Google Drive` is for project docs and deliverables.
- `GitHub` is for repo inspection or technical verification tied to store implementation.
- `Bugherd` is for QA items and bug tracking tied to WooCommerce fixes.
- `Linear` is for project tracking and follow-up tasks.
- `references/CONNECTORS.md` is the maintenance guide for app usage, evidence boundaries, and when files or Memory should take priority.
- The instructions should not suggest unsupported app workflows that are not currently attached unless the user explicitly asks to add them.

## Consistency rules

- App guidance must stay WooCommerce-first and task-relevant.
- Connected site evidence should stay ahead of generic advice when the site app is available.
- Maintenance guidance about apps belongs in the maintenance workflow and in `references/CONNECTORS.md`, not in ad hoc app-routing notes.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

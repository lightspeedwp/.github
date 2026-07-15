# Internal vs Client-Facing Rules

Use this file to filter outputs before presenting them to a client.

## Internal only

- routing logic
- scoring
- commercial notes
- disqualifier logic
- approval mechanics
- internal validation commentary

---

## Client-facing

- recommendation
- scope
- assumptions
- missing values that matter to the next decision
- risks that affect route or confidence
- next steps

---

## Formatting rule

When the final deliverable is client-facing Markdown:

- keep section headings explicit
- prefer bullets over dense prose
- use **bold** for labels and key decisions
- use *italics* only for light qualifiers such as *provisional*
- frontmatter must appear above the main heading when the deliverable is a document-style output
- remove raw JSON, wrapper objects, workspace paths, and machine-formatted payloads
- keep divider lines between every main section and one final divider at the bottom

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

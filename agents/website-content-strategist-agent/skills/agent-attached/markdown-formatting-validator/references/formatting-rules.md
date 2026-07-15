# Formatting rules by output type

## Global default

- YAML frontmatter above the main heading when the output is substantial enough to benefit from metadata
- One `#` main heading immediately after frontmatter
- `##` for main sections
- `###` only for true subsections
- A divider line `---` before every main section after the first
- A final divider line `---` at the bottom of the document

## Review or audit output

- YAML frontmatter
- One `#` main heading
- `## Confirmed context`
- `## Missing intake` or `## Missing strategic inputs`
- `## Working defaults for now`
- `## Recommended workflow`
- `## Approval and readiness state`
- `## Save to Memory if confirmed` when relevant
- `## Best next step`

### Intake-style review specifics

- Do not insert extra peer `##` sections before `## Approval and readiness state`
- Put added detail under `###` subsections inside the required parent section
- In `## Missing intake`, every material gap must use this exact bullet pattern:
  - `- <gap name> — blocking`
  - `- <gap name> — confirm now`
  - `- <gap name> — proceed with labelled gap`
  - `- <gap name> — safe default for now`
- In `## Approval and readiness state`, use this exact wording:
  - `Current state: planning-ready`
  - `Current state: review-ready`
  - `Current state: approval-ready`
  - `Current state: approved-for-use`
  - `Current state: blocked-from-approval`
- Add exactly one `Limit: <brief constraint or approval boundary>` line when needed
- If the draft uses custom readiness wording such as `routed and partially prefilled`, `still intake-stage`, `ready to proceed`, or similar phrases, rewrite the `Current state:` line to the closest allowed value and move the custom nuance to the `Limit:` line
- Insert a divider line `---` before every required `##` section after the first, even if the specialist draft omitted it
- Insert one final divider line `---` at the bottom if it is missing
- Do not expose internal runtime paths, workspace paths, or memory file paths in final user-facing review copy

## Page draft

- YAML frontmatter
- One `#` main heading
- `## Hero`
- `## Main sections`
- `## FAQs` when relevant
- `## Final CTA`

## Newsletter

- YAML frontmatter
- One `#` main heading
- `## Objective`
- `## Audience`
- `## Subject line options`
- `## Preview text options`
- `## Email body`
- `## CTA`

## Claim register

- YAML frontmatter
- One `#` main heading
- `## Claim register`
- `## High-risk claims`
- `## Missing evidence or approvals`
- `## Recommended next step`

## Form specification

- YAML frontmatter
- One `#` main heading
- `## Form purpose`
- `## Field structure`
- `## Validation rules`
- `## Admin notification`
- `## User autoresponder`

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

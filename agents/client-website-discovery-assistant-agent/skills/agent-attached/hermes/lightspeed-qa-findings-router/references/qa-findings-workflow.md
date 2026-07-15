# QA Findings Workflow

Use this reference when converting mixed QA evidence into a consistent LightSpeed findings register.

## 1. Source inventory

Start by listing the evidence reviewed:

- source name or link
- source type: test script, screenshot, Figma note, GitHub issue, Asana task, stakeholder feedback, audit report, launch checklist, PRD or implementation note
- source status: Approved Source, Observed Evidence, Stakeholder Reported, Unconfirmed, Assumption or Out of Scope
- date or version if supplied
- gaps or missing context

Do not rely on a finding if the source is unclear. Mark it as `Needs Reproduction` or `Unconfirmed`.

## 2. Normalise each finding

Convert each raw finding into this structure:

| Field | Guidance |
|---|---|
| Finding ID | Use stable IDs such as `QA-001`. |
| Summary | Short action-oriented description. |
| Source | File, issue, screenshot, tester, audit or note. |
| Evidence quality | Reproducible, Observed Evidence, Partial Evidence, Stakeholder Reported, Needs Reproduction, Duplicate, Invalid or Out of Scope. |
| Affected area | URL, page, template, pattern, block, component, form, flow or viewport. |
| Expected result | What should happen. |
| Actual result | What happened. |
| Reproduction steps | Exact steps if known; otherwise state what is missing. |
| Severity | Critical, High, Medium, Low or Improvement. |
| Launch status | Launch Blocker, Must Fix Before Launch, Can Launch With Follow-up, Post-launch Improvement, Needs Reproduction, Duplicate or Out of Scope. |
| Workstream | Use the workstream taxonomy below. |
| Owner role | Accountable LightSpeed role, not a named person unless provided. |
| Specialist route | Most specific related LightSpeed skill for follow-on work. |
| Next action | Fix, reproduce, route, defer, close as duplicate, or escalate. |
| Retest steps | Clear checks required after fix. |

## 3. Workstream taxonomy

Use these workstreams consistently:

- Design parity
- Design handoff
- Block theme
- Block plugin
- Pattern/template
- Content/copy
- Claim/proof
- Accessibility
- Responsive/mobile
- Forms/conversion
- Analytics/tagging
- Redirects/SEO
- Technical SEO
- Schema/AI discoverability
- Performance
- Policy/governance
- Chatbot/source governance
- Launch operations
- Release/handoff
- Post-launch optimisation

## 4. Duplicate handling

When multiple findings point to the same root fix:

1. Keep the clearest finding as canonical.
2. Preserve all affected URLs and evidence in the canonical row.
3. Mark duplicates with the canonical ID.
4. Do not create separate implementation issues unless fixes are independently testable.

## 5. Minimal follow-up questions

Ask follow-up questions only when the answer changes routing or launch status. Good questions are specific:

- Which URL or template shows this issue?
- Is the screenshot from production, staging or Figma?
- Which viewport/browser was used?
- Is this within the approved launch scope?
- Has this already been fixed in a PR or issue?

## 6. Output generation

Always separate:

- launch blockers
- must-fix items
- accepted-risk items
- post-launch items
- needs reproduction
- invalid/duplicate/out-of-scope items
- GitHub-ready issue drafts
- retest checklist
- client-facing summary
- internal LightSpeed notes

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

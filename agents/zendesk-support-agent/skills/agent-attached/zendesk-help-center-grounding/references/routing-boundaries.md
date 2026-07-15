# Routing Boundaries

## Use this skill when

Use `zendesk-help-center-grounding` when the core question is: "What do the approved docs say, and can we safely rely on them for this reply or guidance?"

Good triggers:

- a support reply depends on Help Center wording, policy wording, article consistency, or approved documentation
- a draft may overstate policy, product behaviour, refund rights, SLAs, guarantees, or availability
- the user asks whether a reply should cite, match, defer to, or avoid citing a document
- several docs appear inconsistent, stale, unclear, or incomplete
- the support team needs a compact internal brief before drafting or review

## Do not use this skill when

Route away when the primary task is not documentation grounding:

- routine customer reply drafting with no documentation dependency → `zendesk-draft-response`
- customer/account/history research → `zendesk-customer-research`
- escalation packaging or cross-functional ask → `zendesk-customer-escalation`
- final evidence/risk review of an already drafted artefact → `zendesk-evidence-quality-review`
- first-pass queue, severity, owner, label, or status triage → `zendesk-ticket-triage` if present, otherwise the workspace's Zendesk triage skill
- refund entitlement, refund exception, commercial credit, or money-back policy assessment → `zendesk-refund-assessment` if present
- duplicate, incident, or repeated-pattern classification → use the workspace duplicate/pattern workflow if available
- deep root-cause investigation or technical proof → use the workspace evidence collection or case investigation workflow if available

## Adjacent skill boundaries

### `zendesk-draft-response`

Use after this skill when the documented position is clear enough to write a customer-facing reply. This skill should supply documented constraints, citation posture, and unsafe wording to avoid; `zendesk-draft-response` should produce the actual reply.

### `zendesk-customer-research`

Use when the missing evidence is customer-specific: account plan, prior commitments, account history, previous exceptions, commercial relationship, or recent support context. Documentation grounding may still be useful afterward, but it should not replace account research.

### `zendesk-customer-escalation`

Use when documentation reveals a policy conflict, high-risk exception, customer-impacting gap, security/privacy concern, or ownership problem that needs engineering, product, legal/compliance, leadership, or specialist support intervention.

### `zendesk-evidence-quality-review`

Use for final review of an artefact that already exists. This skill checks documentation alignment; `zendesk-evidence-quality-review` checks broader evidence quality, unsupported claims, tone, risk, missing next steps, and shareability.

### `zendesk-ticket-triage` if present

Use triage when the first need is classification, urgency, queue, status, owner, or duplicate-risk direction. Use this skill only after triage if the response depends on official documented guidance.

### `zendesk-refund-assessment` if present

Use refund assessment when the core issue is refund eligibility, exception handling, charge reversal, credit, cancellation, plan entitlement, or commercial policy application. Use this skill first only when the refund reply depends on locating and comparing approved refund-policy documentation.

## Clean hand-off format

When handing off, include:

- documented position
- source list and citation posture
- unsupported or risky claims
- recommended safe wording limits
- recommended next skill
- smallest missing evidence item, if any

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

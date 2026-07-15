# Routing Boundaries

## Use `zendesk-ticket-triage` when

- The user explicitly asks for a compact internal triage package.
- A legacy prompt or saved workflow specifically names this skill.
- The required output is this package's facts/inference/missing-evidence/next-workflow format.
- The work starts from a Zendesk ticket ID, URL, pasted ticket thread, support summary, or mixed support notes and the user does not need the canonical embedded triage output from `zendesk-triage-router`.

## Do not use it as the primary workflow when

- The request is first-pass classification, severity, priority, queue/status, owner/team recommendation, or duplicate-risk assessment. Use `zendesk-triage-router`.
- The request is broad workflow routing. Use `zendesk-router-skill`.
- Evidence is weak, partial, or missing and must be collected first. Use `zendesk-evidence-collector`.
- The user asks whether evidence is sufficient for a reply, escalation, handoff, knowledge draft, or downstream package. Use `zendesk-case-readiness-check`.
- The user asks for a finished customer-facing reply and the ticket has enough context. Use `zendesk-draft-response`.
- The user asks for a formal escalation brief or the case clearly requires cross-functional action. Use `zendesk-customer-escalation`.
- The task is support-first internal handoff, not triage packaging. Use `zendesk-handoff-prep`.
- The user asks to review whether a draft reply, escalation, handoff, or report is evidence-backed. Use `zendesk-evidence-quality-review`.
- The task is mainly account history, recent support activity, prior commitments, or customer health context. Use `zendesk-customer-research`.
- The task is duplicate, related-case, repeated-pain, or incident-pattern review. Use `zendesk-duplicate-pattern-review`.
- The task is documentation-worthiness review. Use `zendesk-knowledge-candidate-review`.
- The task is knowledge article or internal documentation drafting after documentation-worthiness is clear. Use `zendesk-create-knowledge`.
- The task is clearly refund, credit, compensation, billing adjustment, goodwill gesture, or policy exception assessment. Use `zendesk-refund-assessment` if attached; otherwise use a plain-language fallback.
- The user already requests an engineering-ready bug handoff and the case has reproduction details. Use `zendesk-bug-report-package` if attached; otherwise use `zendesk-evidence-collector` or `zendesk-customer-escalation` depending on the immediate need.

## Adjacent skill handoff rules

### `zendesk-triage-router`

Route here when the user wants first-pass classification, severity, priority, queue/status, owner/team guidance, or duplicate-risk assessment.

### `zendesk-router-skill`

Route here when the next Zendesk-first workflow is unclear or the user asks what should happen next without requesting this package format.

### `zendesk-evidence-collector`

Route here when missing evidence, proof, timeline reconstruction, reproduction context, or diagnostic investigation is the immediate blocker.

### `zendesk-draft-response`

Route here when the next deliverable is customer-facing wording. Hand off confirmed facts, missing information to ask for, tone/risk notes, and boundaries on what not to promise.

### `zendesk-customer-research`

Route here when the blocker is account history, prior commitments, account value, recurring support pattern, or recent customer activity.

### `zendesk-customer-escalation`

Route here when credible customer impact needs engineering, product, security, leadership, or specialist intervention. Hand off impact, evidence, blocker/ask, urgency rationale, and proof gaps.

### `zendesk-evidence-quality-review`

Route here when there is already a drafted response, escalation, handoff, report, or other support artefact that needs checking for unsupported claims, unsafe wording, weak evidence, or missing risk.

## Avoid overlap

This skill produces an internal package. It does not replace the central router, first-pass triage router, evidence collector, draft-response skill, escalation workflow, handoff workflow, duplicate-pattern review, or knowledge workflows.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

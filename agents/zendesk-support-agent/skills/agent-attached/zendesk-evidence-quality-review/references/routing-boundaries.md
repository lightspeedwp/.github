# Routing Boundaries

Use this reference when this specialist must decide whether to continue reviewing, route to one obvious upstream workflow, or return to `zendesk-router-skill`.

## Operating rule

`zendesk-router-skill` owns knowledge of the full Zendesk skill network. This specialist owns only:

1. Its own after-output QA boundary.
2. Common upstream or adjacent handoffs needed when a QA request is not ready.
3. The point where an unclear request should return to `zendesk-router-skill`.

Do not turn this skill into a second router. Do not sequence complex Zendesk workflows. Do not perform upstream work that this skill is meant to review.

## Stay in this skill when

Continue with `zendesk-evidence-quality-review` only when all are true:

- A reviewable support artefact already exists.
- The user wants the artefact checked, pressure-tested, QA reviewed, or safely improved before sharing.
- Enough evidence is present to judge the draft without inventing case facts.
- The requested output is a QA review, targeted fix list, or evidence-safe edit pass.

Reviewable artefacts include:

- customer replies
- investigations
- escalation briefs
- internal handoffs
- backlog reports
- trend summaries
- knowledge drafts

## Route away before reviewing

If no reviewable artefact exists, do not create it inside this skill. Route to the smallest upstream workflow that creates or prepares the artefact. If the correct route is unclear, return to `zendesk-router-skill`.

Use these canonical route-away targets when the next step is obvious:

- `zendesk-triage-router`: first-pass classification, severity, priority, queue/status, owner/team, or workflow selection.
- `zendesk-evidence-collector`: missing ticket evidence, timeline reconstruction, proof, investigation, or case facts.
- `zendesk-case-readiness-check`: deciding whether the case is ready for a reply, escalation, handoff, knowledge draft, or report.
- `zendesk-draft-response`: creating a new customer-facing reply.
- `zendesk-customer-escalation`: creating a new escalation brief.
- `zendesk-handoff-prep`: creating a new internal handoff.
- `zendesk-create-knowledge`: creating a knowledge article or reusable knowledge draft.
- `zendesk-knowledge-candidate-review`: deciding whether a case, workaround, known issue, or repeated answer should become documentation.
- `zendesk-duplicate-pattern-review`: duplicate, related-case, repeated-pain, or incident-pattern classification.
- `zendesk-backlog-trend-analysis`: backlog, queue-health, SLA, ageing-risk, repeated-issue, or trend reports.
- `zendesk-customer-research`: customer/account context before replying, escalating, or assessing support risk.

Keep the handoff short: state why this skill should stop, name the one best upstream or adjacent workflow when obvious, and identify the smallest missing artefact or evidence needed.

## Return to the router when

Return to `zendesk-router-skill` when:

- The request is ambiguous and more than one workflow could own it.
- The user asks which Zendesk skill or workflow should handle something.
- The request combines triage, investigation, drafting, escalation, reporting, knowledge, duplicate review, customer research, or backlog analysis in a way that needs sequencing.
- The case starts from only a ticket ID, ticket URL, customer name, account name, issue summary, or pasted thread and no reviewable artefact exists.
- The agent is unsure whether the task is QA or another support operation.
- The needed workflow is outside this specialist's direct QA boundary and the next step is not obvious.

When returning to the router, do not guess the full chain. Say that the request should go back to `zendesk-router-skill` for workflow selection, and provide the short reason plus the smallest missing artefact or evidence needed.

## Interoperability note

Clear QA requests may invoke this skill directly. Unclear Zendesk-first intake should route through `zendesk-router-skill`. This skill should not perform the upstream work it is reviewing.

## Do not do this

- Do not maintain a full map of every Zendesk specialist skill inside this skill.
- Do not recommend multiple downstream skills unless the user explicitly asks for options and the handoff remains simple.
- Do not sequence complex workflows such as evidence collection -> escalation -> customer reply -> knowledge creation.
- Do not override `zendesk-router-skill` when the correct owner is unclear.
- Do not continue reviewing when the safer answer is to pause for evidence, artefact creation, or router selection.

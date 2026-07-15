# Shared-agent defaults

Use these defaults when this skill runs in a shared LightSpeed support agent and the user has not supplied a more specific instruction.

These defaults are stable workflow guidance, not case evidence. Never treat them as proof about a customer, ticket, bug, incident, account, or commitment.

## Default evidence posture

- Keep Zendesk as the first source for support case state, chronology, customer wording, ticket ownership, status, priority, tags, and support commitments.
- Use pasted evidence only when Zendesk is unavailable, incomplete, or the user explicitly wants analysis of pasted material.
- Use secondary systems only to close a specific evidence gap, not as a broad research sweep.
- State connector limitations plainly when the logged-in user cannot access Zendesk or another requested source.
- Do not imply that Zendesk, Slack, Gmail, Google Drive, GitHub, Asana, BugHerd, logs, or Help Centre content was checked unless it actually was.

## Default routing language

Use these canonical companion names exactly when recommending a route away from `zendesk-evidence-collector`:

- `zendesk-triage-router` for first-pass severity, priority, owner, status, queue, or duplicate-risk routing.
For RCA, proof, timeline reconstruction, reproduction context, known-issue checks, event-time evidence, or diagnostic investigation, continue inside `zendesk-evidence-collector` investigation mode rather than routing away.
- `zendesk-draft-response` for customer-facing replies once the evidence is sufficient.
- `zendesk-customer-escalation` for engineering, product, security, operations, leadership, or specialist escalation.
- `zendesk-handoff-prep` for internal support handoff packaging when problem, impact, blocker, owner, and ask are known.
- `zendesk-case-readiness-check` when evidence sufficiency is the main question before the next deliverable.
- `zendesk-duplicate-pattern-review` for suspected duplicates, related cases, repeated pain, or possible incident patterns.
- `zendesk-knowledge-candidate-review` when deciding whether the case should become documentation.
- `zendesk-create-knowledge` only after documentation suitability is clear and the user wants a draft article or internal note.
- `zendesk-backlog-trend-analysis` for queue health, period reports, ageing, SLA risk, or recurring-theme analysis.
- `zendesk-customer-research` for customer/account support-history synthesis across multiple related tickets.
- `zendesk-evidence-quality-review` for reviewing a drafted support artefact for unsupported claims, weak evidence, unclear next steps, or unsafe wording.

Do not route to Linear, GitHub, Asana, product planning, roadmap, or implementation workflows unless the user explicitly asks or Zendesk evidence clearly supports that downstream route.

## Readiness labels

Use only these readiness labels in evidence pack mode:

- `ready`: enough support evidence exists for the recommended next workflow.
- `partially ready`: one or two specific missing items would materially improve confidence, but the next workflow can still proceed with caveats.
- `not ready`: the evidence is too thin, contradictory, or access-limited to proceed safely.

Use only these disposition labels in investigation mode:

- RCA: `Confirmed root cause`, `Likely cause`, `Inconclusive`, `Blocked`.
- Proof: `Proven`, `Disproven`, `Inconclusive`, `Blocked`.
- Lookup: `Lookup answered`, `Inconclusive`, `Blocked`.

## Default uncertainty wording

Prefer clear uncertainty over overconfident support language:

- Say `Zendesk evidence confirms...` only when Zendesk actually supports the statement.
- Say `The current evidence suggests...` for informed inferences.
- Say `This remains unconfirmed because...` when a branch is unresolved.
- Say `I could not verify this from the available evidence...` when connector access or source coverage is limited.
- Say `This is blocked on...` only when a specific missing source, identifier, permission, or time window prevents a reliable answer.

Do not use vague phrases such as `it looks like a bug` or `probably fixed` unless the supporting evidence and uncertainty are stated directly.

## Customer-safe boundaries

Before drafting or recommending a customer-facing response, avoid:

- unsupported root cause claims;
- blame assignment;
- internal team or tool speculation;
- exact ETAs unless already committed in Zendesk or an approved source;
- promises of refunds, credits, engineering fixes, escalations, policy exceptions, or priority handling unless confirmed;
- sharing internal tags, private comments, logs, account identifiers, or other sensitive operational details.

Prefer customer-safe language that states what was checked, what is known, what is still being verified, and the next concrete support step.

## Shared-agent memory boundary

- Treat this skill package as the durable source of workflow defaults.
- Do not depend on Ash-specific ChatGPT memory for support workflow behaviour.
- Do not save ticket-specific facts, customer details, or case outcomes to durable memory from inside this workflow.
- If a stable process decision should become reusable, propose updating this skill or another shared team reference rather than relying on a single user's memory.

## Recommended output discipline

- Recommend one primary next workflow.
- Add at most one supporting workflow when it materially improves the result.
- Keep evidence pack mode compact.
- Keep investigation mode branch-led and focused on one active issue.
- End with one concrete immediate next action.

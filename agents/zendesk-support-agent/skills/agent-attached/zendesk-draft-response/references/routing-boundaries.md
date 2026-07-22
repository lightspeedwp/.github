# Routing Boundaries

Use this reference to keep `zendesk-draft-response` as a specialist reply-drafting skill, not a second Zendesk router.

## Network Ownership Rule

- `zendesk-router-skill` owns the full Zendesk skill network, cross-skill route selection, and ambiguous support workflow decisions.
- `zendesk-draft-response` owns only customer-facing reply drafting from sufficiently confirmed evidence.
- This skill should know its own boundaries, common adjacent handoffs, and when to return to `zendesk-router-skill`.
- This skill must not maintain or present a complete map of the Zendesk skill network.
- When the next workflow is not obvious, return to `zendesk-router-skill` instead of choosing from the wider network.

## This Skill Owns

Use `zendesk-draft-response` when the user needs:

- a first customer reply
- a follow-up customer reply
- an apology, delay, limitation, or bad-news message
- a tone rewrite of a support reply
- localisation or translation of a customer-facing support message
- a support-ready reply using the bundled customer reply template

Proceed only when the reply can be grounded in confirmed ticket, thread, research, or investigation evidence.

## Common Adjacent Handoffs

Name one of these handoffs only when the trigger is clear and directly blocks or improves the reply task:

- `zendesk-evidence-collector`: missing or fragmented Zendesk evidence blocks a safe reply.
- `zendesk-case-readiness-check`: evidence exists but readiness is uncertain, stale, contradictory, or too thin.
- `zendesk-customer-research`: account context, relationship risk, prior commitments, or escalation history materially affects tone or next steps.
- `zendesk-customer-escalation`: internal owner approval or specialist intervention is needed before replying.
- `zendesk-evidence-quality-review`: a drafted reply needs evidence QA before sending.
- `zendesk-create-knowledge`: the requested deliverable is reusable documentation rather than a customer reply.

Do not turn this list into a full Zendesk skill map. If more than one handoff seems plausible, or the request is not primarily reply drafting, return to `zendesk-router-skill`.

## Return to Router When

Return to `zendesk-router-skill` when:

- the user asks which Zendesk workflow or skill should handle the case
- the request combines triage, investigation, escalation, duplicate review, backlog analysis, knowledge creation, and reply drafting
- severity, priority, status, queue, owner, SLA, duplicate, incident, or backlog decisions are central
- the available context is only a broad issue summary and not clearly ready for reply drafting
- multiple specialist handoffs could be reasonable and the safest next owner is unclear

## Handoff Output Pattern

When handing off to an adjacent specialist, keep the response short:

```md
This is not ready for `zendesk-draft-response` yet.

Recommended next step: `<skill-name>`

Reason: <one sentence explaining the blocker or boundary>

Smallest useful input to collect next: <one concrete evidence request or action>
```

When returning to the router:

```md
This needs `zendesk-router-skill` rather than direct reply drafting.

Reason: <one sentence explaining the routing uncertainty or broader workflow need>
```

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

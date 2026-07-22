# Routing boundaries

Use this reference when a request risks turning `zendesk-triage-router` into a second full network router.

## Network ownership rule

`zendesk-router-skill` owns the full Zendesk skill network.

This means `zendesk-router-skill` should know the broad map of Zendesk-first specialist skills, compare multiple possible downstream workflows, and decide which specialist should own unclear, cross-cutting, or multi-deliverable support requests.

`zendesk-triage-router` must stay narrower. It owns embedded first-pass support triage and a small set of immediate, common handoffs that naturally follow triage. It should not try to maintain a complete Zendesk skill graph.

## What zendesk-triage-router owns

Use `zendesk-triage-router` for:

- first-pass classification of one support case or pasted ticket;
- severity, priority, owner/team, queue/status, and duplicate-risk assessment;
- deciding whether the immediate next step is still triage or one obvious support handoff;
- naming one supporting workflow only when it directly improves the immediate deliverable.

## Common handoffs this skill may name

This skill may name a common handoff when the next deliverable is already clear:

- `zendesk-evidence-collector` for proof, root-cause, reproduction, timeline, or diagnostic evidence;
- `zendesk-case-readiness-check` when evidence sufficiency is the main blocker before reply, escalation, knowledge, or handoff;
- `zendesk-draft-response` for a clearly requested customer-facing reply;
- `zendesk-customer-escalation` for a clearly requested impact-led escalation;
- `zendesk-handoff-prep` for a support-first internal handoff;
- `zendesk-duplicate-pattern-review` for duplicate, related-ticket, or incident-pattern ambiguity;
- `zendesk-knowledge-candidate-review` when the immediate question is whether support knowledge should be created;
- `zendesk-create-knowledge` only when the documentation decision is already made;
- `zendesk-backlog-trend-analysis` when the immediate request is queue health, repeated issues, or trend reporting.

Keep this list as common handoffs, not a complete network map. When the parent agent's attached skills or newer Zendesk specialist options create uncertainty, return to `zendesk-router-skill`.

## Return to zendesk-router-skill when

Route back to `zendesk-router-skill` when:

- the user asks which Zendesk skill in the wider network should handle the request;
- the request spans multiple support deliverables and no single immediate next action is clear;
- the request involves a specialist workflow outside the common handoffs above;
- the available attached skills differ from the common handoff list and choosing among them requires network awareness;
- a specialist skill finishes its own work and the next support workflow is unclear;
- the request has moved from triage into broader orchestration, sequencing, or cross-skill workflow design.

## Specialist boundary rule

Each Zendesk specialist skill should know only:

1. its own ownership boundary;
2. the few common handoffs adjacent to that boundary;
3. when to return to `zendesk-router-skill` for broader network routing.

Do not copy the full Zendesk skill network into specialist skills.

## Output pattern for returning to the router

```md
## Recommended route

- Primary workflow: `zendesk-router-skill`
- Optional supporting workflow: `none`

## Why this route fits

The request needs broader Zendesk skill-network routing rather than first-pass triage or one obvious common handoff.

## Next deliverable

Select the correct Zendesk specialist workflow and sequence from the wider support skill network.
```

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

# Routing boundaries

Use this reference to keep `zendesk-handoff-prep` as a specialist handoff skill, not as a second Zendesk router.

## Principle

`zendesk-router-skill` owns the full Zendesk skill network.

This skill owns only:

- support-first internal handoff preparation;
- evidence packaging for another internal teammate;
- handoff readiness signals that affect the handoff quality;
- common immediate handoff boundaries;
- returning to the router when the next workflow is unclear or outside this skill.

Do not maintain a full map of every Zendesk specialist skill here. Keep broad workflow selection in `zendesk-router-skill`.

## Stay in this skill when

Stay in `zendesk-handoff-prep` when the user needs:

- a Zendesk-first internal handoff;
- a Zendesk private-note summary for another teammate;
- a Slack-ready internal support handoff;
- a specialist, engineering, product, operations, security, account-owner, or support-manager handoff brief;
- a support-first brief that may later be converted into another tool, but is not yet a downstream artefact.

## Common direct handoffs

Use only these common boundaries when the next step is explicit and obvious from the user request or handoff evidence. Do not expand this into a full Zendesk skill map.

- Customer reply needed: hand off to `zendesk-draft-response`.
- More reliable evidence, reproduction, proof, or root-cause context needed before handoff: hand off to `zendesk-evidence-collector`.
- First-pass classification, priority, queue, status, category, or ownership needed before handoff: hand off to `zendesk-triage-router`.
- Formal escalation needed because urgency, impact, cross-functional intervention, or decision ownership is explicit: hand off to `zendesk-customer-escalation`.
- Duplicate, related-ticket, repeated-pain, or incident-pattern judgement needed: hand off to `zendesk-duplicate-pattern-review`.
- Knowledge-base or reusable support documentation requested: hand off to `zendesk-create-knowledge`.
- Broad queue, SLA, trend, or backlog reporting requested: hand off to `zendesk-backlog-trend-analysis`.
- Explicit Linear, GitHub, Asana, BugHerd, or project artefact requested: finish or confirm the Zendesk-first support handoff first, then return to the router unless the downstream target is explicitly specified and supported by current evidence.

## Interoperability note

Clear handoff requests may invoke `zendesk-handoff-prep` directly. Unclear intake should route through `zendesk-router-skill`. Downstream artefact conversion to Linear, GitHub, Asana, BugHerd, or project tools must only happen when the user explicitly requests that downstream artefact.

## Return to the router when

Return to `zendesk-router-skill` when:

- the user asks what support workflow should be used next;
- multiple downstream workflows seem plausible;
- the request is not mainly an internal support handoff;
- the next owner or specialist workflow is unclear;
- the case crosses `zendesk-draft-response`, `zendesk-customer-escalation`, `zendesk-evidence-collector`, `zendesk-duplicate-pattern-review`, `zendesk-create-knowledge`, `zendesk-backlog-trend-analysis`, and downstream tooling in one request;
- the handoff reveals a new task that is outside this skill's immediate boundary;
- workspace connector access is incomplete and choosing the next workflow depends on available tools.

## Avoid router-like behaviour

Do not:

- list or rank the entire Zendesk skill network;
- make this skill the central dispatcher for all Zendesk requests;
- keep detailed routing rules for every specialist skill;
- route to Linear, GitHub, Asana, BugHerd, product planning, or roadmap workflows by default;
- select between multiple possible specialist workflows when the user has not asked for a handoff and the right workflow is not obvious;
- skip the router for complex or ambiguous Zendesk workflow selection.

## Recommended wording

When this skill should not continue and the next step is not obvious, use wording like:

> This is no longer primarily an internal handoff. Return to `zendesk-router-skill` to choose the next Zendesk workflow.

When the next step is obvious and local to the handoff, use wording like:

> This handoff is partially ready, but the smallest missing evidence is [specific item]. Collect that before sending it to [target].


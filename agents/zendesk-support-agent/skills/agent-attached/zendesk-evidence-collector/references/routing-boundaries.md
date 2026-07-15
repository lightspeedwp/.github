# Routing boundaries

Use this reference when `zendesk-evidence-collector` needs to recommend a next step without becoming a second Zendesk router.

## Network rule

`zendesk-router-skill` owns the Zendesk skill network.

This specialist owns only:

- evidence collection before another support workflow;
- embedded single-case investigation when triage is not enough;
- direct handoff to a small set of common next workflows when the evidence clearly supports that route;
- return to `zendesk-router-skill` when the next workflow is unclear, contested, multi-path, or outside this specialist's boundaries.

Do not maintain a full map of all Zendesk skills here. Do not decide between every possible downstream support workflow. Do not route to product, Linear, GitHub, Asana, roadmap, or project-planning workflows unless the user explicitly asks and the support evidence is already complete.

## This skill's boundary

Stay inside this skill when the main job is to:

- gather minimum reliable Zendesk context;
- reconstruct a compact support chronology;
- separate confirmed facts, informed inferences, and missing evidence;
- diagnose one support case with a branch ledger;
- answer a proof, RCA, lookup, timeline, reproduction-context, or known-issue question for one case;
- decide whether evidence is ready, partially ready, or not ready for the next support deliverable.

Leave this skill when the main job has become the deliverable itself rather than evidence or investigation.

## Common direct handoffs

Use a direct handoff only when the evidence clearly supports it. Use these canonical companion names exactly when routing away:

- `zendesk-triage-router`: first-pass classification, severity, priority, owner, queue status, or duplicate-risk assessment.
- `zendesk-draft-response`: customer-facing reply or follow-up when the facts are sufficiently explained.
- `zendesk-customer-escalation`: engineering, product, security, leadership, or specialist escalation when impact and ask are clear.
- `zendesk-handoff-prep`: internal support handoff when ownership, blocker, ask, and evidence need packaging.
- `zendesk-case-readiness-check`: evidence sufficiency is the main question before a reply, escalation, knowledge draft, or handoff.
- `zendesk-duplicate-pattern-review`: duplicate, related-case, repeated-theme, or incident-pattern uncertainty blocks the next move.
- `zendesk-knowledge-candidate-review`: the main question is whether a resolved or repeated issue should become reusable documentation.

Keep each handoff short. Name one primary next workflow and, only when clearly helpful, one supporting workflow.

## Return to the router

Return to `zendesk-router-skill` when:

- the user asks which Zendesk workflow or specialist should handle the case;
- the request spans multiple specialist deliverables;
- more than one downstream route is plausible and none is clearly dominant;
- the case is no longer mainly evidence collection or investigation;
- the user asks for broad support operations, backlog, knowledge, escalation, reply, account research, or pattern work and the best specialist is not obvious;
- the evidence is too thin to decide a safe next step beyond asking for the smallest missing identifier;
- a shared-agent user lacks the connector access needed to confirm the route.

Use wording like:

> Return to `zendesk-router-skill` because the case is no longer mainly evidence collection or investigation, and the next specialist route is not clear from the current evidence.

## Output rule

In this skill's outputs, avoid long routing menus. The `Best next move` or `Recommended next action` section should contain:

- one immediate next action;
- one primary workflow when clear;
- one supporting workflow at most;
- or a clear return to `zendesk-router-skill` when routing needs network-level judgement.

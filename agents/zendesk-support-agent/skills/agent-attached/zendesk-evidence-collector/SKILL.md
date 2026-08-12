---
name: zendesk-evidence-collector
description: zendesk-first evidence collection and embedded investigation for lightspeed support cases. use when a support request starts from a zendesk ticket id, ticket url, pasted thread, customer/account name, or issue summary and the agent must collect minimum reliable zendesk evidence before triage, reply drafting, escalation, duplicate review, knowledge review, backlog analysis, or readiness checks. also use for single-case rca, proof, lookup, timeline reconstruction, reproduction context, known-issue checking, or diagnostic investigation in the canonical zendesk-first support workflow.
---

# Zendesk Evidence Collector

Use this skill to build a compact, evidence-first support context pack or to investigate one Zendesk-centred support case when triage is not enough.

This skill has two modes:

1. `Evidence pack mode` for minimum reliable Zendesk context before another support workflow.
2. `Investigation mode` for single-case RCA, proof, lookup, timeline reconstruction, reproduction context, or diagnostic investigation.

Do not route to `case-investigation`. Treat that name as deprecated context only; the canonical Zendesk-first skill for evidence collection and embedded single-case investigation is `zendesk-evidence-collector`.

## Shared-agent compatibility

When this skill runs inside a shared workspace agent, treat the skill package as the stable source of workflow truth and the logged-in user's connector permissions as variable runtime context.

Consult `references/shared-agent-compatibility.md` whenever connector availability, user-specific access, workspace sharing, durable memory, bundled examples, or team-safe defaults could affect the result.

When a shared agent needs stable team defaults for routing language, readiness labels, uncertainty wording, customer-safe boundaries, or memory boundaries, consult `references/shared-agent-defaults.md`.

## Output templates

Use the inline output contracts below for normal operation. When formatting consistency matters, when the user asks for a reusable pack, or when another workflow will consume the output, consult `templates/evidence-pack.md` for evidence pack mode or `templates/investigation-report.md` for investigation mode. Do not load both templates unless the case genuinely needs both modes.

## Structured schemas

Use the markdown output contracts for normal human-readable responses. When the user asks for structured data, a machine-readable export, downstream automation, QA validation, or a handoff that may be consumed by another system, consult `schemas/evidence-pack.schema.json` for evidence pack mode or `schemas/investigation.schema.json` for investigation mode. Do not expose schema fields that are unsupported by the evidence.

## Synthetic examples

Use the inline examples at the end of this file for trigger recognition only. When a teammate needs a concrete behavioural pattern, especially during onboarding, edge-case handling, or shared-agent QA, consult the fictional examples in `examples/`. Never treat bundled example names, ticket numbers, domains, timestamps, or symptoms as real evidence.

## Source-precedence examples

Use the source precedence rules below for normal operation. When sources disagree, evidence depends on event-time truth, or a teammate needs examples of safe contradiction handling, consult `references/source-precedence-examples.md`.

## Routing boundaries

This skill is not the Zendesk skill-network router. It owns minimum reliable Zendesk evidence collection before downstream triage, reply drafting, escalation, duplicate review, knowledge review, backlog analysis, readiness checks, or handoff prep. When selecting a next step, use only this skill's boundaries and common handoffs. If the route is unclear, multi-path, or outside evidence collection and single-case investigation, return to `zendesk-router-skill`. Consult `references/routing-boundaries.md` when handoff scope could affect the result.

## Primary source

Treat Zendesk as the primary source for case state, customer wording, ticket history, status, priority, owner, group, tags, requester, organisation, attachments, side conversations, SLA or ageing signals, linked tickets, and support commitments.

Use pasted evidence only as a fallback or supplement when Zendesk is unavailable or incomplete.

Use secondary systems only when Zendesk leaves a material gap for the selected mode, when the user explicitly asks for cross-system context, or when a branch cannot be resolved from Zendesk alone.

Secondary evidence can include Help Centre articles, internal notes, macros, Slack, Gmail, Google Drive, GitHub, Asana, BugHerd, runtime logs, exports, screenshots, or supplied artefacts.

## Mode selection

Use `Evidence pack mode` when:

- the request starts from a Zendesk ticket ID or ticket URL;
- the user gives a customer, account, or merchant name and needs support context;
- the user pastes only part of a thread and Zendesk context would materially improve the answer;
- the task is likely to become `zendesk-triage-router`, `zendesk-draft-response`, `zendesk-customer-escalation`, `zendesk-handoff-prep`, `zendesk-duplicate-pattern-review`, `zendesk-knowledge-candidate-review`, `zendesk-backlog-trend-analysis`, or `zendesk-case-readiness-check` work, but the minimum support evidence has not been assembled yet;
- the current support draft has weak sourcing, missing chronology, or unclear ticket state.

Use `Investigation mode` when:

- triage or evidence collection is not enough and the case needs deeper diagnosis;
- the user asks for proof, root cause, reproduction, timeline reconstruction, known-issue checking, or confirmation of what happened;
- the issue depends on runtime behaviour, implementation details, configuration, account state, attachments, logs, or cross-system evidence;
- support needs a durable investigation checkpoint before replying, escalating, documenting, or handing off.

Do not use this skill for:

- final customer reply drafting when the pasted evidence is already sufficient; use `zendesk-draft-response`;
- internal escalation brief writing when the escalation ask and impact are already clear; use `zendesk-customer-escalation`;
- reusable article, macro, or knowledge article drafting when documentation suitability is already clear; use `zendesk-create-knowledge`;
- broad backlog or trend reporting when reporting evidence is already available; use `zendesk-backlog-trend-analysis`;
- broad customer health synthesis across many unrelated tickets; use `zendesk-customer-research`;
- downstream GitHub, Linear, Asana, product, or project artefacts when the support evidence pack is already complete.

## Evidence pack mode workflow

1. Identify the strongest starting identifier.
   - Prefer ticket ID or ticket URL.
   - If the request only includes a customer or account name, search for the most relevant open or recent ticket set first.
   - If multiple plausible tickets exist, keep the shortlist tight and ask for clarification only if you cannot safely infer the right one.

2. Collect the minimum Zendesk evidence.
   - Pull ticket metadata.
   - Pull the ticket conversation when chronology or customer wording matters.
   - Note ticket status, priority, assignee, group, tags, form, requester, brand, and obvious SLA or ageing signals when available.
   - Do not fan out into secondary systems unless Zendesk leaves a material gap for the next workflow.

3. Normalise the case.
   - State the likely primary job using plain-language intent, and name a downstream workflow only with canonical `zendesk-` prefixed names when routing is actually recommended.
   - State the object of work: one ticket, one customer, one repeated issue, or one backlog slice.
   - State the requested or inferred deliverable.

4. Build a compact chronology.
   - Capture the most important recent events only.
   - Prefer customer statements, agent actions, status changes, notable tags, and the latest unresolved blocker.
   - Do not retell the full thread if a short chronology is enough.

5. Separate certainty levels.
   - Put confirmed facts in one group.
   - Put informed inferences in a second group.
   - Put open unknowns or missing evidence in a third group.
   - Never blur a ticket fact with a guess.

6. Decide readiness.
   - If the evidence is already enough for the likely next workflow, say the case is ready.
   - If one or two specific pieces of evidence are still missing, say the case is partially ready and name the exact missing items.
   - If the evidence is too thin to proceed safely, say the case is not ready and ask for or fetch the smallest missing identifier.

7. Recommend the next support move without becoming a router.
   - Use canonical `zendesk-` prefixed companion names when naming a downstream workflow route.
   - End with one immediate next action and one primary workflow only when the evidence clearly supports it.
   - Optionally name one supporting workflow only when it clearly improves the deliverable.
   - Return to `zendesk-router-skill` when the route is unclear, multi-path, or outside evidence collection and single-case investigation.
   - Do not recommend downstream product or project workflows by default.

## Investigation mode workflow

1. Choose exactly one investigation goal before concluding.
   - `RCA`: explain why the behaviour happened.
   - `Proof`: prove or disprove a specific claim.
   - `Lookup`: find a specific fact, timeline, owner, status, or identifier.

2. Normalise the case.
   - Capture the issue summary.
   - Separate expected behaviour from actual behaviour.
   - Capture stable identifiers such as ticket ID, case ID, user ID, site, account, organisation, email, request ID, order ID, URL, or attachment name.
   - Capture channel or surface, such as product UI, API, billing flow, email thread, import/export, SSO, checkout, WordPress admin, or plugin workflow.
   - Capture the relevant time window when event-time evidence matters.

3. Build a branch ledger before broad searching.
   - List the explanations or decision points that could change the answer.
   - Map each branch to the smallest authoritative source category.
   - Every critical branch must end as `verified`, `disproven`, `blocked`, or `unknown`.

4. Gather evidence in source order.
   - Zendesk ticket details and conversation first.
   - Runtime logs, request traces, screenshots, exports, or supplied artefacts when behaviour must be proven.
   - GitHub, implementation notes, plugin/theme config, or admin settings when code or configuration explains behaviour.
   - Help Centre, macros, internal docs, Slack, Asana, Google Drive, Gmail, or prior tickets only when they materially change the answer.

5. Resolve or narrow each critical branch.
   - Mark branches as verified, disproven, blocked, or unknown.
   - If a branch is blocked, record the exact evidence needed to unblock it.
   - Do not treat absence of evidence as evidence of absence.

6. Check known-issue or reusable-pattern coverage.
   - Look for prior tickets, known issue notes, macros, troubleshooting docs, Help Centre articles, or active internal work that changes the answer.
   - Distinguish an exact known issue from an adjacent repeated pain pattern.

7. Separate current-state from event-time truth.
   - Current state is best for present configuration, ownership, ticket status, and account settings.
   - Event-time evidence is needed to prove what happened during a specific incident or workflow failure.
   - If the case depends on event-time truth and the time window is missing, mark the branch blocked instead of inventing a conclusion.

8. Form the disposition.
   - For `RCA`, use `Confirmed root cause`, `Likely cause`, `Inconclusive`, or `Blocked`.
   - For `Proof`, use `Proven`, `Disproven`, `Inconclusive`, or `Blocked`.
   - For `Lookup`, answer the requested fact directly and include source/time context when available.

9. Hand off cleanly without becoming a router.
   - Recommend one next action inside this skill's common handoffs, or return to `zendesk-router-skill` when the route needs network-level judgement.
   - Do not draft the separate deliverable unless the user explicitly asks for it.

## Branch ledger format

Use this compact table in investigation mode:

```md
| branch | question | source category | status | evidence |
| --- | --- | --- | --- | --- |
| <branch> | <question> | <Zendesk / logs / GitHub / Help Centre / supplied evidence> | <verified / disproven / blocked / unknown> | <evidence or blocker> |
```

## Source precedence

When sources disagree:

1. confirm they refer to the same customer, issue, and time window;
2. prefer the most authoritative source for that branch;
3. prefer the freshest source when the branch is time-sensitive;
4. call out the contradiction directly instead of smoothing it over.

Examples:

- Ticket comments can outrank Slack speculation about what was promised.
- Runtime logs can outrank a human summary of whether a request failed.
- Current account settings can be authoritative for present state, while historical exports may be better for incident-time truth.

## Output contract: evidence pack mode

Return this structure when the request is about one case and the task is evidence collection rather than investigation:

```md
# Zendesk Evidence Pack

## Case

- Ticket: <ticket id or best available identifier>
- Customer / account: <name if known>
- Current state: <status, owner, priority, urgency, or "unknown">
- Likely workflow: <plain-language intent or canonical `zendesk-` workflow when recommending a route>
- Deliverable: <requested or inferred deliverable>

## Confirmed facts

- <fact>

## Key chronology

- <short timeline bullet>

## Informed inferences

- <inference, clearly labelled as inference>

## Missing or uncertain evidence

- <gap or uncertainty>

## Readiness

- <ready | partially ready | not ready>
- Reason: <short reason>

## Best next move

- Primary workflow: <canonical `zendesk-` workflow, continue in this skill, or return to `zendesk-router-skill`>
- Supporting workflow: <canonical `zendesk-` workflow or "none">
- Immediate next action: <one concrete next action>
```

If the request is a customer or account search rather than one confirmed ticket, replace `## Key chronology` with `## Most relevant tickets` and list only the top candidates with one-line reasons.

## Output contract: investigation mode

Return this structure when the request needs diagnosis, proof, lookup, or timeline reconstruction:

```md
# Zendesk Case Investigation

## Case

- Ticket: <ticket id or best available identifier>
- Customer / account: <name if known>
- Investigation goal: <RCA | Proof | Lookup>
- Current disposition: <Confirmed root cause | Likely cause | Proven | Disproven | Inconclusive | Blocked | Lookup answered>

## Issue being investigated

<short summary of the active issue, expected behaviour, and actual behaviour>

## Confirmed facts

- <fact>

## Branch ledger

| branch | question | source category | status | evidence |
| --- | --- | --- | --- | --- |
| <branch> | <question> | <source category> | <status> | <evidence or blocker> |

## Conclusion

<best-supported answer. Use cautious language when evidence is partial.>

## Missing or uncertain evidence

- <gap or uncertainty>

## Recommended next action

- <one concrete support next step>

## Sources checked

- <source category and what it was used for>
```

## Handoff rules

Do not make this skill a second Zendesk router. `zendesk-router-skill` owns the full Zendesk skill network. This specialist only knows its own boundaries, common handoffs, and when to return to the router.

Consult `references/routing-boundaries.md` when the next step is unclear, contested, multi-path, or at risk of becoming network-level routing.

Common direct handoffs are allowed only when the evidence clearly supports them. Use these canonical companion names exactly when naming a route away from this skill:

- Use `zendesk-triage-router` for first-pass classification, severity, priority, owner, queue status, or duplicate-risk assessment.
- Use `zendesk-draft-response` when the facts are sufficiently explained and the main need is a customer-facing reply.
- Use `zendesk-customer-escalation` when confirmed or likely impact needs engineering, product, security, leadership, or specialist follow-through.
- Use `zendesk-handoff-prep` when the next need is an internal support handoff with problem, impact, evidence, blocker, owner, and ask.
- Use `zendesk-case-readiness-check` when evidence sufficiency is the main question before a reply, escalation, knowledge draft, or handoff.
- Use `zendesk-duplicate-pattern-review` when duplicate, related-case, repeated-theme, or incident-pattern uncertainty blocks the next move.
- Use `zendesk-knowledge-candidate-review` when the question is whether the case should become documentation.

Return to `zendesk-router-skill` when the user asks which specialist should handle the work, when more than one route is plausible, when the request spans multiple deliverables, or when the case is no longer mainly evidence collection or single-case investigation.

Do not route to Linear, GitHub, Asana, product planning, roadmap, or project workflows by default.

## Replacement note

In the LightSpeed Support Desk agent, do not route to `case-investigation`. That name is retained only as deprecated context and must not be presented as an active skill route. `zendesk-evidence-collector` owns embedded single-case support investigation for RCA, proof, lookup, reproduction context, timeline reconstruction, branch-ledger analysis, known-issue checking, and evidence-backed diagnostic conclusions.

## Quality bar

- Keep evidence pack mode compact and operational.
- Keep investigation mode focused on one active issue.
- Prefer the fastest falsification step over broad exploration.
- State whether the task is evidence collection or investigation before concluding.
- Keep confirmed facts, informed inferences, assumptions, and unknowns separate.
- Do not invent request IDs, account impact, root cause, reproduction steps, ETA, or ownership.
- Do not force a product bug explanation when the case is really policy, usage, data, access, billing, or configuration.
- If Zendesk is unavailable, say so clearly and work from supplied evidence without pretending a Zendesk fetch happened.
- Stop once the next support workflow is well supported.

## Example triggers

Evidence pack mode:

- "Look up ticket 18432 and tell me what we know before I reply."
- "Pull together the Zendesk context for this merchant issue before triage."
- "I only have this pasted thread. Gather the missing Zendesk evidence and tell me if this is escalation-ready."

Investigation mode:

- "Find the root cause from this ticket history."
- "Prove whether this checkout failure happened at the time the customer reported."
- "Reconstruct the timeline before we escalate."
- "Check whether this is already a known issue or a new failure pattern."
- "Look up the current status and owner from the case evidence."

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

---
name: zendesk-handoff-prep
description: zendesk-first internal handoff preparation for lightspeed support cases. use when a zendesk ticket, support case, customer thread, specialist review, engineering review, product review, security-sensitive concern, operations issue, or internal support summary needs a clean evidence-backed handoff without assuming linear, github, asana, or product planning by default. prepares concise support-first briefs with problem, impact, evidence, attempted steps, blockers, target owner, exact ask, urgency, and risk. route to downstream artefact skills only when explicitly requested after the support handoff is solid.
---

# Zendesk Handoff Prep

## What this skill does

Use this skill to prepare a clean internal handoff from Zendesk-first support evidence.

This skill:

- transforms support evidence into a clean internal handoff;
- keeps the handoff scoped and operational;
- clarifies what action or decision is needed;
- produces a handoff that can later be adapted to another system if needed;
- prevents weak FYI handoffs that do not tell the receiving person what to do next.

The default output is a support-first internal brief. It may support specialist support, engineering, product, security, or operations review, but it does not assume Linear, GitHub, Asana, Bugherd, or project-planning tooling by default.

## When to use this skill

Use this skill when the main output is an internal handoff.

Good triggers include:

- a case needs specialist support review;
- a case needs engineering, product, security, or operations attention;
- the user wants a concise support-first summary for internal use;
- the deliverable should be more structured than an ordinary escalation note, but not yet a product-planning artefact;
- Zendesk evidence needs to be packaged so another teammate can continue without restarting discovery;
- support needs a private note, Slack-ready internal brief, manager handoff, technical review note, or downstream-ready support summary.

## Do not use this skill for

Do not use this skill when the primary deliverable is not an internal support handoff.

Return to `zendesk-router-skill` or the clearly requested canonical specialist workflow instead when the primary deliverable is:

- a customer-facing reply -> `zendesk-draft-response`;
- reliable case evidence, investigation, proof, reproduction, or timeline reconstruction -> `zendesk-evidence-collector`;
- ordinary first-pass classification, priority, queue, status, category, or ownership -> `zendesk-triage-router`;
- a formal escalation brief -> `zendesk-customer-escalation` only when urgency, impact, cross-functional intervention, or decision ownership is explicit;
- evidence sufficiency checking as the main deliverable rather than a quick handoff-readiness check -> `zendesk-case-readiness-check`;
- duplicate, related case, repeated pain, or incident-pattern judgement -> `zendesk-duplicate-pattern-review`;
- broad support reporting, trend reporting, queue health, or backlog analysis -> `zendesk-backlog-trend-analysis`;
- a knowledge-base article, macro, or internal documentation draft -> `zendesk-create-knowledge`;
- documentation-worthiness review -> `zendesk-knowledge-candidate-review`;
- Linear issue creation, GitHub issue drafting, Asana task planning, BugHerd task creation, product planning, or project planning, unless the user explicitly asks for that downstream artefact after the support-first handoff is clear.

## Default frame

Use this default frame for every handoff:

- support-first;
- internal handoff before tooling-specific handoff;
- evidence-backed;
- next-action oriented;
- no product-planning sprawl;
- no Linear, GitHub, Asana, or project-management default.

The receiving teammate should understand the problem, impact, evidence, attempted steps, blockers, owner or target team, exact ask, and urgency without reading the whole ticket from scratch.

A support handoff is not automatically an escalation, issue draft, roadmap input, or engineering ticket. Prepare the support-first brief first; convert it only when the user explicitly requests a downstream artefact.

## Primary source order

Use sources in this order:

1. Zendesk ticket and conversation evidence: ticket ID, subject, requester, organisation, brand, form, fields, tags, status, priority, group, assignee, timestamps, public replies, internal notes, side conversations, attachments, screenshots, ticket events, linked tickets, duplicate indicators, and support commitments.
2. Help Centre and support context: public articles, internal articles, macros, troubleshooting guides, known issue notes, policy pages, documented support processes, and documentation gaps.
3. Pasted internal notes: user-provided summaries, private notes, meeting notes, screenshots, manually copied ticket content, support observations, or prepared investigation notes.
4. Secondary systems only when they materially improve the internal handoff: Slack, Gmail, Google Drive, GitHub, Linear, Asana, BugHerd, logs, analytics, repo notes, incident notes, security notes, billing/admin systems, or other tools.

Use secondary systems only when Zendesk and supplied evidence are insufficient, when the user explicitly asks for cross-system context, or when the receiving target cannot act without that evidence.

If Zendesk is unavailable, prepare the handoff from supplied evidence and name any Zendesk detail that would materially improve it.

## Shared-agent portability

When this skill is installed in a shared workspace agent, use [references/shared-agent-setup.md](references/shared-agent-setup.md) if connector access, logged-in user context, workspace memory, or portability could affect the handoff.

Default to portable behaviour:

- do not depend on any individual teammate's personal account, memory, saved searches, labels, private connector access, or user-specific defaults;
- treat the current user's connector permissions as the only available permissions;
- continue from supplied evidence if Zendesk is unavailable or partial, and clearly mark missing Zendesk fields;
- use team conventions only when they are included in the skill package, supplied by the user, or retrieved from an approved connected source in the current run;
- do not persist case-specific facts as durable memory unless the user explicitly asks and the fact is stable, non-sensitive, and reusable.

## Evidence readiness

Use [references/evidence-minimums.md](references/evidence-minimums.md) when the available evidence may be too thin, the target team is unclear, the ask is vague, or the handoff could become a weak FYI. Use it to decide whether the case is ready, partially ready with labelled gaps, or not ready and should return to `zendesk-router-skill`, `zendesk-evidence-collector`, or `zendesk-case-readiness-check` before handoff preparation continues.

## Sensitivity and redaction

Use [references/sensitivity-redaction.md](references/sensitivity-redaction.md) when the handoff contains, may contain, or links to sensitive evidence such as credentials, tokens, logs, screenshots, billing details, personal data, security concerns, access issues, private URLs, or information that may be unsafe for Slack, downstream issue trackers, broad internal channels, or customer-facing replies. Prefer concise summaries and secure evidence links over copying raw sensitive material into the handoff.

## Routing boundaries

Use [references/routing-boundaries.md](references/routing-boundaries.md) when the next step may be outside internal handoff preparation, when multiple Zendesk workflows seem plausible, or when the skill risks becoming a general Zendesk router. Keep `zendesk-router-skill` responsible for knowing the full Zendesk skill network. This skill should know only its own boundaries, common immediate handoffs, and when to return to the router.

## Workflow

Follow this workflow in order:

1. Identify the handoff target.
   - Choose the likely recipient: specialist support, engineering, product, operations, security, account/customer owner, support manager, or general internal support.
   - If the target is unclear, choose the safest support-first target and state the assumption.

2. Summarise the problem.
   - State the customer-facing issue in plain language.
   - Separate observed behaviour from suspected cause.
   - Avoid product or implementation framing unless it is confirmed and useful to the receiving team.

3. Summarise impact.
   - Capture who is affected, what is blocked, urgency, SLA/customer risk, business impact, operational impact, and whether the impact is known or unknown.
   - Do not inflate impact beyond the evidence.

4. Capture confirmed evidence.
   - Pull out the facts the receiving teammate can trust: ticket data, exact customer wording, screenshots, timestamps, IDs, links, error messages, prior support notes, relevant Help Centre content, and related ticket references.
   - Mark assumptions clearly.

5. Capture attempted steps.
   - List what support has already checked, asked, replied, tested, ruled out, or tried.
   - Include workarounds offered and any customer response to those steps.

6. Capture blockers and risks.
   - Identify what prevents resolution, what decision is needed, what evidence is missing, and what risk exists if the handoff is ignored or delayed.

7. State the exact action or decision needed.
   - Convert the handoff into a concrete ask: investigate X, confirm Y, approve Z, advise on next reply, check account state, validate security exposure, review logs, confirm expected behaviour, or decide whether to escalate.
   - Avoid weak FYI handoffs with no owner action.

8. Produce a concise handoff brief.
   - Keep it short enough to work as a Zendesk private note or Slack/internal message.
   - Include enough evidence for the recipient to act without re-reading the whole ticket.

## Decision rules

### Specialist support handoff

Use when another support teammate or senior support specialist needs to continue the case.

Focus on:

- current customer ask;
- ticket state and latest support promise;
- what has already been tried;
- what not to ask again;
- the next safe customer-facing step;
- any internal notes the next support owner must know.

Recommended handling: keep the handoff in Zendesk or a support channel. Do not turn it into Linear or GitHub unless explicitly requested.

### Engineering handoff

Use when technical review is needed for a defect, integration issue, logs, deployment behaviour, data state, environment-specific behaviour, or reproduction question.

Focus on:

- observed versus expected behaviour;
- affected site, account, environment, product area, plugin, workflow, or integration;
- reproduction status and conditions;
- screenshots, logs, IDs, timestamps, errors, and related tickets;
- support actions already attempted;
- exact engineering ask.

Clarification: not every engineering handoff should become a Linear issue or GitHub issue. This skill prepares the support-first brief before any downstream system-specific conversion.

### Product handoff

Use when the case needs product judgement about expected behaviour, UX friction, policy, roadmap trade-off, feature fit, repeated customer pain, or documentation/product boundary.

Focus on:

- customer problem and business context;
- support evidence and frequency if known;
- current workaround or limitation;
- expected versus actual experience;
- exact product decision needed.

Clarification: product handoff is not product planning. Do not frame as roadmap work unless the user explicitly asks.

### Operations handoff

Use when the case needs support operations, billing/admin, account administration, SLA/process review, fulfilment, access, configuration, hosting, domain, email, payment, or workflow ownership.

Focus on:

- operational process or owner needed;
- customer/account affected;
- current state and blockers;
- support promises and timing risk;
- exact operational action required.

### Security-sensitive handoff

Use when the case may involve access control, exposed data, suspicious activity, credential risk, privacy concerns, permission changes, account takeover, malware, logs containing sensitive data, or any security-sensitive support evidence.

Focus on:

- confirmed security-relevant facts only;
- customer/account/system affected;
- immediate containment or access-control concern;
- evidence location without overexposing sensitive details;
- exact security review ask;
- who should and should not receive the details.

Guardrail: minimise sensitive data in the handoff. Do not include secrets, credentials, unnecessary personal data, or raw logs beyond what the recipient needs. Use [references/sensitivity-redaction.md](references/sensitivity-redaction.md) before sharing or adapting security-sensitive evidence.

## Output format

Use [references/handoff-templates.md](references/handoff-templates.md) when the user asks for a target-specific handoff, Slack-ready message, Zendesk private note, security-sensitive variant, or when the default format needs a more specific structure for the recipient. Do not load it for simple ordinary handoffs where the default structure is enough.

Use [references/handoff-schema.md](references/handoff-schema.md) and `schemas/zendesk-handoff.schema.json` only when the user asks for JSON, validation, automation-friendly output, downstream conversion support, or another agent or workflow needs a predictable structured handoff. Keep ordinary human handoffs in readable markdown by default.

Use this structure by default:

```markdown id="handoff-prep-default"
## Internal handoff

- Problem: [concise support-first problem statement]
- Impact: [who/what is affected, urgency, customer or business risk]
- Owner or target team: [specialist support | engineering | product | operations | security | account owner | support manager | unknown]
- Exact ask: [specific action or decision needed]
- Urgency/risk: [low | medium | high | urgent | unknown] - [brief reason]

## Evidence

- [confirmed Zendesk, Help Centre, or supplied evidence]
- [confirmed evidence]

## Attempted steps

- [what support/customer/internal team has already tried]
- [what has been ruled out or answered]

## Blockers

- [missing evidence, decision, access, owner, or risk blocking progress]

## Handoff brief

[Concise internal-ready summary that can be pasted into Zendesk, Slack, or an internal note. Keep confirmed facts separate from assumptions.]
```

For security-sensitive handoffs, add:

```markdown id="handoff-prep-security"
## Sensitivity notes

- Sensitive details omitted: [yes | no]
- Share with: [approved internal audience]
- Do not share with: [audience or channel if relevant]
```

For downstream-adaptable handoffs, add only when explicitly requested:

```markdown id="handoff-prep-downstream"
## Downstream adaptation note

[What would need to change before converting this into Linear, GitHub, Asana, BugHerd, or another system-specific artefact.]
```

## Handoff boundaries

Use [references/routing-boundaries.md](references/routing-boundaries.md) when the case may need another workflow. Do not turn this section into a complete Zendesk routing map. `zendesk-router-skill` owns broad workflow selection and the full Zendesk skill network.

Stay in this skill when the user clearly needs an internal handoff, private note, Slack-ready handoff, or support-first brief for another teammate.

Use only these common direct handoffs when the next step is explicit and obvious from the evidence:

- customer reply needed -> `zendesk-draft-response`;
- more reliable evidence, reproduction, proof, or root-cause context needed -> `zendesk-evidence-collector`;
- first-pass support classification, priority, queue, status, category, or ownership needed -> `zendesk-triage-router`;
- formal escalation needed because urgency, impact, cross-functional intervention, or decision ownership is explicit -> `zendesk-customer-escalation`;
- duplicate, related-ticket, repeated-theme, or incident-pattern judgement needed -> `zendesk-duplicate-pattern-review`;
- reusable support documentation requested -> `zendesk-create-knowledge`;
- broad queue, SLA, trend, or backlog reporting requested -> `zendesk-backlog-trend-analysis`.

Return to `zendesk-router-skill` when the next workflow is unclear, multiple workflows are plausible, the user asks what should happen next, or the request is no longer primarily an internal handoff.

Do not route to Linear, GitHub, Asana, BugHerd, product planning, or project planning by default. Prepare the support-first handoff first, then return to the router unless the user explicitly requested a specific downstream artefact.

## Quality bar / guardrails

A good handoff is:

- crisp;
- actionable;
- support-first;
- evidence-backed;
- clear about confirmed facts versus assumptions;
- clear about the owner or target team;
- explicit about the exact ask;
- usable as a Zendesk private note, Slack handoff, or internal support document.

Avoid:

- weak FYI handoffs with no clear ask;
- premature product framing;
- forcing every technical case into Linear or GitHub;
- overloading the recipient with full ticket history;
- burying the latest customer ask;
- omitting what support already tried;
- mixing customer-safe facts with internal-only notes without labelling them;
- including sensitive data that the recipient does not need;
- asking for broad investigation when one specific action or decision is enough.

## Example library

Use the anonymised files in `examples/` only when the user asks for an example, the agent needs a style calibration pattern, a shared-agent test case is useful, or a handoff type is ambiguous and a concrete model would reduce risk. Do not load examples for ordinary handoffs when the current evidence is enough.

Available examples:

- `examples/engineering-handoff.md` - technical review without premature Linear or GitHub conversion;
- `examples/product-handoff.md` - product judgement without roadmap promises;
- `examples/ops-handoff.md` - billing, access, fulfilment, or account-state continuation;
- `examples/security-handoff.md` - sensitive access-control concern with redaction boundaries;
- `examples/insufficient-evidence.md` - not-ready case that should collect evidence before handoff.

Treat all example content as fictional. Never reuse example customer names, ticket IDs, URLs, timestamps, or facts as if they were real evidence.

## Practical examples

Owned by this skill:

- "Prepare a support-first internal handoff for this Zendesk case."
- "Package this for technical support review without creating a GitHub issue yet."
- "Summarise the problem, evidence, attempted steps, blocker, and exact ask for ops."
- "Create an internal handoff that engineering could later use, but keep it Zendesk-first."

Routed away or returned to `zendesk-router-skill` by this skill:

- "Write the customer reply" -> `zendesk-draft-response`.
- "Investigate the root cause first" -> `zendesk-evidence-collector`.
- "Classify and prioritise this ticket first" -> `zendesk-triage-router`.
- "Create the escalation brief" -> `zendesk-customer-escalation` only when urgency, impact, cross-functional intervention, or decision ownership is explicit.
- "Create a Linear issue from this" -> finish or confirm the support-first handoff first, then return to the router or the explicitly requested downstream workflow.
- "Draft the GitHub issue" -> finish or confirm the support-first handoff first, then return to the router or the explicitly requested downstream workflow.
- "Write the help article" -> `zendesk-create-knowledge`.
- "Check whether these tickets are duplicates or an incident pattern" -> `zendesk-duplicate-pattern-review`.
- "Report on all similar support tickets" -> `zendesk-backlog-trend-analysis`.
- "What should happen next?" -> return to `zendesk-router-skill`.

## Interoperability note

Clear internal handoff requests may invoke `zendesk-handoff-prep` directly. Unclear intake, multi-path support requests, or requests asking what should happen next should route through `zendesk-router-skill` so the router can choose the correct Zendesk workflow. Downstream artefact conversion to Linear, GitHub, Asana, BugHerd, product planning, or project tools must only happen when the user explicitly requests that downstream artefact.

## Router relationship note

This specialist skill should not replace `zendesk-router-skill`. Use this skill for support-first internal handoff preparation only. If the next step is not an internal handoff or one obvious local boundary, return to `zendesk-router-skill` so the router can choose the correct Zendesk workflow.

Do not assume Linear, GitHub, Asana, BugHerd, product planning, or roadmap work. If a downstream artefact is explicitly requested, prepare or confirm the Zendesk-first handoff evidence first, then return to the router unless the downstream target is already specified and the current evidence is sufficient.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

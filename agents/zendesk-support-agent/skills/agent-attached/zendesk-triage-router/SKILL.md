---
name: zendesk-triage-router
description: zendesk-first routing and embedded first-pass triage for lightspeed support desk. use when a support request, zendesk ticket, customer thread, help centre issue, duplicate concern, repeated pattern, escalation question, reply request, investigation need, knowledge candidate, reporting ask, or classification request needs the next support workflow selected or a compact triage result. handles severity, priority, owner/team, queue/status guidance, and duplicate-risk assessment as the canonical first-pass Zendesk triage entry point. keeps support work centred on zendesk and avoids product, project, linear, github, or asana workflows unless explicitly requested.
---

# Zendesk Triage Router

## What this skill does

Use this skill to decide which Zendesk-first workflow should own a support request next, or to perform first-pass Zendesk ticket triage when classification is the requested deliverable.

This skill:

- identifies the primary support job;
- identifies the object of work;
- identifies the requested deliverable;
- recommends the single best primary Zendesk-first workflow;
- recommends one supporting skill only when it materially improves the deliverable;
- performs embedded first-pass Zendesk ticket triage for classification, severity, priority, owner/team recommendation, queue/status guidance, and duplicate-risk assessment;
- keeps routing and triage narrow, deterministic, and support-operational.

This skill owns Zendesk-first routing and embedded first-pass triage. It does not investigate the case, draft the customer reply, write the escalation brief, create the knowledge article, or prepare a product/project artefact.

## Legacy alias

`ticket-triage` is deprecated.

Use `zendesk-triage-router` for:

- first-pass Zendesk ticket classification
- severity assessment
- priority recommendation
- owner/team recommendation
- queue/status guidance
- duplicate-risk assessment
- support workflow routing

Any legacy references to `ticket-triage` should be interpreted as requests for `zendesk-triage-router`, not as permission to call or recommend a separate workflow. For migration details, see `references/legacy-aliases.md` only when deprecated names or archived prompts are involved.
Do not route to `ticket-triage`; first-pass ticket classification is embedded in this skill.

## Reference loading

Keep `SKILL.md` as the control plane. Load these references only when the current request needs them:

- `references/shared-agent-portability.md` when the skill runs in a shared workspace agent, connector access is unclear, or the output must be portable across teammates.
- `references/access-and-permissions.md` when Zendesk or another connector is unavailable, when teammate permissions differ, or when supplied evidence must be used as a fallback.
- `references/parent-agent-routing.md` when a canonical Zendesk-prefixed companion workflow may be unavailable and the route needs a plain-language fallback.
- `references/routing-boundaries.md` when the request may require the broader Zendesk skill network, when this skill risks becoming a second router, or when a specialist should return to `zendesk-router-skill`.
- `references/zendesk-field-map.md` when ticket fields, tags, queues, statuses, priorities, SLA signals, account details, or custom fields materially affect triage or routing.
- `references/routing-output-quality-checklist.md` when reviewing a route or embedded triage output before sharing it, especially in shared agents or ambiguous cases.
- `references/router-output-lint-examples.md` when testing `scripts/lint_router_output.py` or checking sample valid and invalid router outputs.
- `references/parent-agent-installation-checklist.md` when adding the router to a shared agent, reviewing attached companion skills, or smoke-testing setup.
- `references/workflow-namespace-map.yaml` when checking the canonical Zendesk-prefixed companion workflow names.
- `references/attached-skill-manifest.yaml` when checking what the parent agent should attach, or when a route may not be available at runtime.
- `references/routing-decision-matrix.yaml` when the request matches multiple possible support workflows and the immediate next owner is ambiguous.
- `references/triage-output-schema.yaml` when producing embedded first-pass triage and enum consistency matters.
- `references/minimum-zendesk-evidence-checklist.md` when evidence is thin or the smallest missing Zendesk field needs to be named.
- `references/synthetic-test-scenarios.md` when manually testing, validating, or tuning this router.
- `references/router-regression-cases.json` when maintaining deterministic routing coverage or updating `scripts/run_router_regression_tests.py`.
- `scripts/lint_router_output.py` when maintainers need to lint a saved route or embedded triage response for required sections, enum values, and unsafe primary routes.

## When to use this skill

Use this skill when the request is a messy or ambiguous support request and the next Zendesk-first workflow is unclear.

Good triggers include:

- a Zendesk-centred case where the user asks what should happen next;
- a support request that could plausibly be triage, investigation, reply drafting, escalation, duplicate review, reporting, or knowledge work;
- a pasted ticket, ticket summary, or customer thread with no clear next owner;
- a user asking whether a case should become a reply, escalation, investigation, duplicate review, knowledge candidate, trend report, or support handoff;
- a request to choose between attached support workflows without doing the underlying work yet;
- a request to classify one Zendesk ticket, assign severity or priority, recommend owner/team, suggest queue/status, or assess duplicate risk.

## Do not use this skill for

Do not use this skill to do the work that another attached support skill should own, except for embedded first-pass Zendesk ticket triage.

Route away instead:

- proof gathering, root-cause analysis, reproduction, timeline reconstruction, or diagnostic investigation -> `zendesk-evidence-collector` (investigation mode is embedded there for the LightSpeed support desk);
- customer-facing reply or customer update drafting -> `zendesk-draft-response`;
- internal escalation brief writing -> `zendesk-customer-escalation`;
- reusable article, macro, or internal knowledge drafting -> `zendesk-create-knowledge`;
- support backlog, volume, theme, or trend reporting -> `zendesk-backlog-trend-analysis`;
- evidence sufficiency checks before a reply, escalation, knowledge draft, or downstream handoff -> `zendesk-case-readiness-check`;
- duplicate, related issue, repeated theme, or incident-pattern analysis beyond first-pass duplicate-risk assessment -> `zendesk-duplicate-pattern-review`;
- support-first internal handoff preparation -> `zendesk-handoff-prep`;
- documentation-worthiness review before creating knowledge -> `zendesk-knowledge-candidate-review`.

Do not use this skill for broad project routing outside support, product planning, GitHub issue drafting, Linear issue drafting, Asana task planning, or delivery workflow selection unless the user explicitly requests a downstream artefact.

## Default frame

Use this default frame for every routing or triage decision:

- Zendesk-first;
- support workflow first;
- one primary skill first when routing;
- one supporting skill at most when routing;
- embedded triage when the requested deliverable is first-pass classification, severity, priority, owner/team, queue/status, or duplicate-risk assessment;
- support-handling beats downstream planning unless the user explicitly requests a downstream artefact.

The default destination is a support-operational workflow, not Linear, GitHub, Asana, or a project-management workflow.

## Router boundary

`zendesk-router-skill` owns the full Zendesk skill network. This skill must not become a second network router. Use `references/routing-boundaries.md` when a request spans multiple support workflows, needs broader Zendesk skill-network awareness, or should return to the central router after a specialist boundary is reached.

Keep this skill focused on embedded first-pass triage and obvious immediate handoffs. Do not expand its instructions into a complete map of every Zendesk specialist.

## Interoperability with zendesk-router-skill

Unclear Zendesk-first intake may come through `zendesk-router-skill`, which owns the broader Zendesk skill network. Clear first-pass classification, severity, priority, queue/status, owner/team recommendation, or duplicate-risk requests may invoke `zendesk-triage-router` directly. Downstream deliverables should use canonical `zendesk-` companion skill names.

## Shared-agent workflow resolution

Use canonical Zendesk-prefixed companion workflow names for downstream deliverables. Use `references/workflow-namespace-map.yaml` to verify canonical names, and use `references/parent-agent-routing.md` when a canonical workflow may be unavailable and the route needs a plain-language fallback.

If a canonical companion workflow is not attached, describe the needed support action in plain language instead of inventing a skill name or falling back to a legacy non-prefixed route.

Do not let this skill's internal route suggestions override the parent agent's actual attached skill directory. Do not assume all LightSpeed teammates have the same Zendesk, Gmail, Drive, Slack, Linear, GitHub, or Asana access. Apply `references/access-and-permissions.md` when connector access is unavailable or uncertain.

When installing or reviewing this skill in a shared agent, use `references/parent-agent-installation-checklist.md` to verify companion skills, connector assumptions, fallback behaviour, smoke-test prompts, and maintenance checks.

Before finalising a higher-risk route or embedded triage output, apply `references/routing-output-quality-checklist.md` to catch unsupported claims, missing workflow availability notes, premature downstream routes, and severity/priority confusion. For package maintenance or manual QA of saved responses, run `scripts/lint_router_output.py` against the output text and compare with `references/router-output-lint-examples.md`.

## Zendesk field interpretation

Consult `references/zendesk-field-map.md` when ticket fields, tags, queues, statuses, priorities, SLA signals, account details, or custom fields materially affect triage or routing. Use it to normalise Zendesk evidence into this skill's issue type, severity, priority, owner/team, and duplicate-risk outputs without relying on personal context or undocumented workspace assumptions.

Treat fields and tags as evidence signals, not automatic decisions. If a field value is unfamiliar or unsupported by ticket content, put it in `Unknowns` rather than inventing impact, cause, ownership, or duplicate status.

## Primary source order

Use sources in this order:

1. Zendesk: ticket history, public replies, internal notes, requester, organisation, status, priority, form, fields, tags, group, assignee, SLA state, side conversations, attachments, related tickets, linked problem tickets, customer history, macros used, ticket events, Help Centre links, and reporting context.
2. Pasted ticket or user-provided evidence: ticket excerpts, screenshots, summaries, customer messages, internal notes, copied Zendesk fields, exports, or user context.
3. Help Centre context: public articles, internal notes, macros, known issue content, and documentation gaps relevant to routing or first-pass triage.
4. Secondary systems only if needed to resolve routing ambiguity: Slack, Gmail, Google Drive, GitHub, Linear, Asana, BugHerd, or other systems.

Use secondary systems only when Zendesk and supplied evidence do not contain enough context to choose the route, when the user explicitly asks for cross-system context, or when the requested deliverable explicitly requires a downstream artefact.

If Zendesk is unavailable, route or triage from the supplied evidence, state that Zendesk evidence was not available in the current run, and name the smallest Zendesk field or context item that would make the result more certain. When supplied field names or tags are ambiguous, normalise them through `references/zendesk-field-map.md` and keep unsupported values in `Unknowns`.

## Workflow

Follow this workflow in order:

1. Identify the main job.
   - Decide whether the immediate support job is embedded triage, investigation, reply drafting, escalation, readiness checking, duplicate or pattern review, handoff preparation, knowledge-candidate review, knowledge drafting, or backlog/trend analysis.
   - Do not treat bug mentions, feature requests, or implementation details as automatic product-routing signals.

2. Identify the object of work.
   - Name what is being routed or triaged: one ticket, one case/thread, one customer or organisation history, a group of related tickets, a repeated theme, a possible incident, a Help Centre gap, a resolved case, or a support handoff.

3. Identify the requested deliverable.
   - Separate the deliverable the user asked for from the evidence available.
   - Common deliverables include route recommendation, triage outcome, investigation summary, customer reply, escalation brief, support handoff, duplicate/pattern judgement, knowledge suitability decision, knowledge draft, or trend report.

4. Choose embedded triage or routing.
   - Use embedded Zendesk ticket triage mode when the user needs first-pass classification, severity, priority, ticket type, support queue, status, owner/team recommendation, or duplicate-risk assessment.
   - Otherwise pick exactly one primary workflow from the attached support skills listed in the decision rules, using canonical Zendesk-prefixed names from `references/workflow-namespace-map.yaml` and plain-language fallback rules from `references/parent-agent-routing.md` when necessary.
   - Choose the workflow that owns the immediate next action, not a later possible action.

5. Choose an optional supporting skill only if useful.
   - Recommend no supporting skill unless a second step materially improves the final deliverable.
   - A supporting skill must have a clear sequence, for example readiness check before reply drafting, or knowledge-candidate review before article drafting.

6. Explain the route or triage result briefly and concretely.
   - For routing, give the route, the reason, and the next deliverable.
   - For embedded triage, give the triage classification, evidence, unknowns, and recommended next step.
   - Mention one premature route only when it prevents likely misrouting.

## Decision rules

Use these deterministic routing rules:

- One ticket + classification question -> handle inside this skill using embedded Zendesk ticket triage mode.
  - Use when the user needs severity, priority, type, category, support queue, status, owner/team, or first-pass duplicate-risk assessment.

- One ticket + proof/root-cause question -> `zendesk-evidence-collector`.
  - Use when the user needs evidence, diagnosis, reproduction, event sequence, suspected cause, account context, confirmation of what happened, or investigation-mode handling embedded in the evidence collector.

- One case + customer message needed -> `zendesk-draft-response`.
  - Use when the user needs a customer-facing reply, update, apology, clarification request, workaround wording, or closure note.

- One case + internal escalation needed -> `zendesk-customer-escalation`.
  - Use when the user needs an impact-led escalation brief, cross-functional decision request, urgent owner attention, or escalation-ready summary.

- One case + support-first internal handoff needed, but not necessarily escalation -> `zendesk-handoff-prep`.
  - Use when the user needs a clean support/ops handoff, implementation handoff, support manager note, account handoff, or downstream-ready case summary without assuming Linear.

- Repeated-theme or reporting request -> `zendesk-backlog-trend-analysis`.
  - Use when the user provides multiple tickets, a Zendesk export, backlog data, volume patterns, queue health questions, theme reporting, or support trend analysis requests.

- Duplicate ambiguity beyond first-pass duplicate-risk assessment -> `zendesk-duplicate-pattern-review`.
  - Use when the user asks whether tickets are duplicates, related issues, repeated customer pain, linked cases, or part of a broader incident pattern.

- Unresolved readiness -> `zendesk-case-readiness-check`.
  - Use when it is unclear whether there is enough evidence for a customer reply, escalation, knowledge draft, support handoff, or explicitly requested downstream engineering/product handoff.

- Documentation-worthiness question -> `zendesk-knowledge-candidate-review`.
  - Use when the user asks whether a resolved case or repeated issue should become a new article, update an existing article, remain internal-only, or wait because the evidence is unstable.

- Documentation decision already made + article or internal note requested -> `zendesk-create-knowledge`.
  - Use when the user has already decided documentation should be created or updated and wants the actual draft.

When two rules seem to apply, choose the one closest to the user's requested deliverable:

- embedded triage beats routing when the user explicitly asks for classification, severity, priority, owner/team, queue/status, or duplicate-risk assessment;
- route recommendation beats execution;
- readiness check beats drafting when evidence sufficiency is uncertain;
- duplicate/pattern review beats backlog reporting when the immediate question is whether items are the same issue;
- backlog/trend analysis beats duplicate review when the immediate question is volume, queue health, recurring themes, or operational reporting;
- escalation beats general handoff when urgency, customer impact, decision need, or cross-functional intervention is explicit;
- support handoff beats Linear/GitHub drafting unless the downstream artefact is explicitly requested.

## Embedded Zendesk ticket triage mode

Use this mode when the user asks for first-pass support classification, severity, priority, ticket type, owner/team recommendation, queue/status guidance, or duplicate-risk assessment.

Do not route to a separate triage workflow. First-pass ticket classification is embedded here for the LightSpeed Support Desk agent.

Before triaging, read for:

- failure mode: broken behaviour, confusing behaviour, missing capability, policy question, billing problem, or access problem;
- scope: single user, small team, major account, or broad customer pattern;
- urgency signal: blocked workflow, deadline pressure, outage language, executive pressure, or SLA risk;
- customer state: calm, frustrated, repeated follow-up, or overt escalation;
- evidence quality: direct symptoms and timestamps versus vague summaries or secondhand notes;
- Zendesk field signals: status, priority, group, assignee, SLA state, tags, custom fields, organisation, and related-ticket links; normalise through `references/zendesk-field-map.md` when values are unclear.

If any dimension is missing, call it out in `Unknowns` instead of guessing.

Use one primary issue type and one optional secondary issue type.

Primary issue types:

- `Bug`
- `How-to / Configuration`
- `Feature request`
- `Billing / Contract`
- `Account / Access`
- `Integration / API`
- `Security / Privacy / Compliance`
- `Data / Import / Export`
- `Performance / Reliability`

Keep severity and priority separate.

Severity:

- `Critical`: product or core workflow unavailable for many users, severe data integrity risk, security exposure, or no viable workaround for a major outage.
- `High`: major workflow broken for an important customer or team, substantial business impact, or severe issue with weak or no workaround.
- `Medium`: real issue with contained scope, partial workaround, or moderate business impact.
- `Low`: limited inconvenience, cosmetic issue, routine request, or clearly minor impact.
- `Unknown`: evidence is too thin or contradictory to score safely.

Recommended priority:

- `Urgent`: active outage, security concern, hard deadline, executive escalation, or repeated same-day pattern.
- `High`: meaningful customer pain or blocking issue that should move quickly even if it is not a full emergency.
- `Normal`: needs action and ownership, but not immediate interruption.
- `Low`: can proceed in normal queue flow without time pressure.
- `Unknown`: insufficient evidence to set a response pace responsibly.

Owner/team categories:

- `Frontline support`
- `Senior / technical support`
- `Engineering`
- `Product`
- `Security / compliance`
- `Billing / finance / operations`

Check duplicate and pattern risk separately:

- `duplicate risk`: meaningful chance this should be merged into or linked as the same underlying issue.
- `related issue`: adjacent but not identical.
- `pattern / emerging incident risk`: similar reports suggest a broader reliability issue even if no exact duplicate exists.

Lack of evidence is not proof of low duplicate risk.

## Embedded triage output format

Use this format for embedded triage mode:

```md
## Triage

**Issue type:** <type>
**Severity:** <Critical | High | Medium | Low | Unknown>
**Recommended priority:** <Urgent | High | Normal | Low | Unknown>
**Recommended owner/team:** <team category or role>
**Duplicate risk:** <High | Medium | Low | Not completed>

### Summary
<2-4 sentence triage summary>

### Evidence
- <confirmed fact>
- <confirmed fact>

### Unknowns
- <missing field or ambiguity>

### Recommended next step
- <best next move>
```

## Routing output format

Use this structure by default when the request is routing rather than embedded triage:

```markdown
## Recommended route

- Primary workflow: `[skill name]`
- Optional supporting workflow: `[skill name]` or `none`

## Why this route fits

[1-3 concrete sentences explaining the support job, object of work, and requested deliverable. Ground the reason in Zendesk evidence or supplied ticket context where available.]

## Next deliverable

[The specific output the primary workflow should produce next.]
```

For higher-risk or ambiguous routing, add this short section:

```markdown
## Not recommended yet

- `[workflow or destination]`: [why it would be premature or not support-first]
```

For very quick requests, compress the answer but still include the primary workflow, optional supporting workflow, why the route fits, and the next deliverable.

## Handoff rules

Keep handoffs narrow so this skill does not become a second Zendesk network router.

- Recommend one primary workflow first when routing.
- Recommend one supporting workflow at most when routing.
- Use common, adjacent handoffs only when the next deliverable is already clear.
- Return to `zendesk-router-skill` when the request needs broader Zendesk skill-network selection, cross-skill sequencing, or a specialist outside this skill's common handoffs.
- Consult `references/routing-boundaries.md` before adding new handoff rules or routing destinations.
- Never chain loosely.
- Never recommend multiple equivalent next skills.
- Do not route to unattached or hypothetical skills.
- Do not route to a separate triage workflow.
- Do not route to Linear by default.
- Do not route to GitHub, Asana, Linear, product planning, delivery planning, or project workflows unless the user explicitly asks for a downstream artefact.
- If the user explicitly asks for a downstream artefact from Zendesk evidence, prefer `zendesk-handoff-prep` first unless the downstream issue, ticket, or task format is already fully specified.
- Do not let internal route suggestions override the parent agent's actual attached skill directory.
- If the needed workflow is not attached to the parent agent, describe the needed next action in plain language instead of inventing a skill name.
- Prefer canonical Zendesk-prefixed workflow names in shared agents; if the canonical workflow is unavailable, describe the needed support action in plain language rather than using a legacy non-prefixed route.

## Maintenance test harness

When updating this skill, preserve the synthetic routing coverage in `references/router-regression-cases.json` and run `scripts/run_router_regression_tests.py` together with `scripts/validate_router_package.py` before packaging. The regression harness checks that canonical Zendesk-prefixed routes, plain-language fallback behaviour, field-map reference coverage, and anti-Linear/GitHub defaults remain aligned. Use `scripts/lint_router_output.py` plus `references/routing-output-quality-checklist.md` for manual output QA, and use `references/parent-agent-installation-checklist.md` after packaging to smoke-test shared-agent setup.

## Quality bar / guardrails

A good route or triage result is:

- deterministic;
- narrow;
- Zendesk-first;
- support-operational;
- based on the immediate next deliverable;
- limited to one primary workflow and, at most, one supporting workflow when routing;
- explicit about confirmed facts, unknowns, and assumptions.

Avoid:

- workflow sprawl;
- vague route maps;
- premature Linear or GitHub framing;
- routing to product/project workflows because a ticket mentions a bug;
- recommending adjacent skills without a clear sequence;
- reopening discovery when Zendesk already contains enough evidence for the next support action;
- using repeated customer pain as duplicate evidence without checking whether the underlying cause is actually the same;
- guessing missing impact, ownership, priority, or duplicate status.

## Practical examples

Owned by this skill:

- "This Zendesk ticket is messy. Should it be triage, investigation, escalation, or reply drafting?"
- "Which support workflow should own this case next?"
- "Classify this ticket and assign severity."
- "What priority and owner/team should this support case get?"
- "Does this look like a duplicate risk or just a related issue?"
- "Is this repeated complaint a duplicate review, backlog trend, or knowledge-candidate review?"
- "The user pasted a Zendesk thread and wants to know what should happen next."

Routed away by this skill:

- "Find the root cause from the ticket history" -> `zendesk-evidence-collector`.
- "Write the reply to the customer" -> `zendesk-draft-response`.
- "Create the escalation brief" -> `zendesk-customer-escalation`.
- "Turn this resolved issue into a help article" -> `zendesk-create-knowledge`, or `zendesk-knowledge-candidate-review` first if suitability is unclear.
- "Are these tickets duplicates or a broader pattern?" -> `zendesk-duplicate-pattern-review`.
- "Summarise the last month of Zendesk backlog trends" -> `zendesk-backlog-trend-analysis`.
- "Prepare a support handoff from this case" -> `zendesk-handoff-prep`.

## Replacement note

In the LightSpeed Support Desk agent, use this skill as the canonical owner for embedded first-pass Zendesk ticket triage covering classification, severity, priority, owner/team recommendation, queue/status guidance, and duplicate-risk assessment.

## Replacement and demotion note

This skill should replace or reduce reliance on these Linear-oriented skills for support routing:

- `linear-triage-router` for routing Zendesk-centred support work;
- `linear-gap-analyzer` when the question is support evidence readiness rather than Linear issue readiness;
- `linear-the-architect` when the immediate need is support workflow selection rather than issue drafting;
- `linear-duplicate-management-playbook` when the question starts from Zendesk duplicate, related-ticket, or repeated-pattern ambiguity;
- `linear-voice-of-customer` when the immediate need is support routing rather than product insight synthesis.

Use Linear-oriented skills only when the user explicitly asks for a Linear-centred artefact or the parent agent has already completed the Zendesk-first support route and a downstream artefact is now required.

## Recommended parent-agent routing note

For Zendesk-centred support requests, use `zendesk-triage-router` when the next workflow is unclear or when first-pass triage is requested. The router may either return an embedded triage result or recommend exactly one primary attached support skill and at most one supporting skill. Do not route to any separate first-pass ticket triage workflow. Do not let Linear, GitHub, Asana, or project workflows become the default destination for support tickets. Use downstream artefact skills only when the user explicitly asks for that artefact or after a Zendesk-first support handoff confirms it is needed.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

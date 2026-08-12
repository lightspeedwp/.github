---
name: zendesk-duplicate-pattern-review
description: zendesk-first duplicate and pattern review for lightspeed support cases. use when zendesk tickets, customer threads, related cases, repeated complaints, similar symptoms, suspected duplicates, recurring customer pain, or possible incident patterns need support-operational classification. determines whether cases are likely duplicates, related but distinct, repeated pain patterns, broader incident patterns, or inconclusive. keeps duplicate logic separate from broader pattern logic and avoids defaulting to linear, github, product issue deduplication, or canonical issue management outside support.
---

# Zendesk Duplicate Pattern Review

## What this skill does

Use this skill to decide how similar Zendesk-centred support cases relate to each other.

This skill:

- evaluates duplicate likelihood;
- evaluates related-issue likelihood;
- evaluates repeated-theme likelihood;
- evaluates broader incident-pattern likelihood;
- helps support avoid collapsing every repeated issue into "duplicate";
- recommends the support handling next step for the compared tickets or pattern.

This skill separates duplicate logic from broader pattern logic. A repeated complaint, recurring workflow pain, or cluster of similar customer language is not automatically a duplicate.

## Do not use this skill for

Do not use this skill for work outside Zendesk-first duplicate and pattern review.

Route away instead:

- ordinary support classification, severity, priority, queue, status, category, or first-pass ownership -> `zendesk-triage-router`;
- proof gathering, root-cause analysis, reproduction, timeline reconstruction, or diagnostic investigation -> `zendesk-evidence-collector`;
- queue-level reporting, volume, trend, ageing, SLA-risk analysis, or backlog health reporting -> `zendesk-backlog-trend-analysis`;
- customer-facing reply drafting -> `zendesk-draft-response`;
- internal escalation brief drafting -> `zendesk-customer-escalation`;
- readiness checking before reply, escalation, knowledge, or downstream handoff -> `zendesk-case-readiness-check`;
- support-first handoff preparation after the relationship is clear -> `zendesk-handoff-prep`;
- documentation-worthiness review -> `zendesk-knowledge-candidate-review`;
- article, macro, or internal knowledge drafting -> `zendesk-create-knowledge`;
- product duplicate handling in Linear, GitHub issue deduplication, product canonical issue management, roadmap synthesis, or project planning unless the user explicitly asks for that downstream artefact.

## Default frame

Use this default frame for every review:

- Zendesk-first duplicate review;
- support operations first;
- do not assume product issue deduplication;
- repeated pain is not automatically a duplicate;
- preserve customer-specific context unless there is enough evidence to collapse handling;
- classify the relationship for support handling before suggesting downstream artefacts.

The goal is not to prove product root cause. The goal is to decide how support should handle the relationship between cases using available support evidence.

## Shared-agent portability

When this skill runs inside a shared workspace agent, follow `references/shared-agent-usage.md` before making access-dependent claims or recommendations.

Also consult `references/shared-agent-connector-matrix.md` whenever:

- the current user's Zendesk or secondary connector access is unknown;
- live Zendesk lookup is unavailable, partial, declined, or ambiguous;
- the evidence comes from pasted ticket text rather than live Zendesk lookup;
- the review depends on Memory, private user context, or cross-system data;
- the recommendation could trigger merging, escalation, incident handling, or reporting.

Do not assume the logged-in user is the ticket owner, assignee, original support agent, or Ash. Do not rely on private Memory or user-specific connector access for core behaviour. If Zendesk access is unavailable or partial, classify from supplied evidence, lower confidence where appropriate, and name the smallest missing Zendesk detail needed before merging, escalating, or reporting.

For shared-agent use, include an `Access context` line in the review when access is limited, unclear, or materially affects confidence.

## Primary source order

Use sources in this order:

1. Zendesk ticket search and conversation evidence: ticket history, requester, organisation, public replies, internal notes, side conversations, related tickets, linked problem tickets, ticket events, attachments, macros used, prior resolutions, and search results for similar tickets.
2. Ticket themes and visible metadata: tags, form, fields, product area, component, status, priority, group, assignee, customer segment, affected site/account, timestamps, SLA state, and known issue indicators.
3. User-provided pasted ticket comparisons: copied ticket text, screenshots, summaries, exports, customer messages, internal notes, or manually grouped ticket lists.
4. Secondary systems only if they materially clarify the pattern: Slack, Gmail, Google Drive, GitHub, Linear, Asana, Bugherd, logs, analytics, repo notes, incident notes, or other systems.

Use secondary systems only when Zendesk and supplied evidence cannot distinguish the relationship, when the user explicitly asks for cross-system context, or when the final deliverable explicitly requires downstream confirmation.

If Zendesk is unavailable, classify from supplied evidence and name the smallest Zendesk search, ticket field, or conversation detail that would improve confidence.

## Evidence checklist

Before recommending merge, escalation, incident handling, or reporting, consult `references/zendesk-evidence-checklist.md` when the available ticket evidence is thin, the review is high risk, or the relationship classification depends on timing, scope, customer context, likely cause, or prior resolution path.

Use the checklist to identify evidence gaps and to name the smallest missing Zendesk detail. Do not block useful low-risk classification just because every checklist item is unavailable.

## Routing boundaries

Use `references/routing-boundaries.md` before recommending a downstream workflow when the next step is not an obvious local handoff from the duplicate/pattern classification. `zendesk-router-skill` owns the Zendesk skill network; this skill owns only duplicate/pattern classification, local boundaries, common handoffs, and when to return to the router.

Do not independently choose across the full `zendesk-` prefixed skill catalogue. If the next workflow choice is broader than this review, route back through `zendesk-router-skill`.

## Interoperability note

Clear duplicate or pattern review requests may invoke this skill directly. Unclear support intake should route through `zendesk-router-skill` before selecting a specialist workflow. Product, Linear, GitHub, roadmap, or canonical issue deduplication must not be assumed unless the user explicitly requests that downstream artefact.

## Workflow

Follow this workflow in order:

1. Define the comparison set.
   - Identify which tickets, cases, customers, organisations, time window, product area, workflow, or symptoms are being compared.
   - If the comparison set is unclear, infer the smallest sensible set from the user request and state the assumption.

2. Determine access context.
   - Use `references/shared-agent-connector-matrix.md` when connector access is unknown, limited, or variable across teammates.
   - Classify whether the review is based on full Zendesk access, partial Zendesk access, supplied evidence only, secondary connectors, or unknown access.
   - Lower confidence when important ticket history, internal notes, timing, linked tickets, requester context, or prior resolution path is not visible.

3. Compare symptoms, scope, timing, customers, and likely cause.
   - Symptoms: what the customer observed or reported.
   - Scope: one user, one account, one site, one workflow, one customer segment, or many customers.
   - Timing: isolated, recurring over time, clustered in the same window, or ongoing.
   - Customer context: same customer/organisation, different customers with similar setup, or broad customer spread.
   - Likely cause: same root problem, related support area, unclear cause, or different likely causes.

4. Decide the relationship classification.
   - Choose one: likely duplicate, related but distinct, repeated pain pattern, broader incident pattern, or inconclusive.
   - Do not choose duplicate only because wording or symptoms are similar.

5. Explain the reasoning.
   - State the evidence that supports the classification.
   - State the uncertainty if evidence is thin or cause is not confirmed.

6. Recommend the support handling next step.
   - Say whether tickets should be linked, merged, kept separate, escalated, investigated, included in reporting, or monitored as a pattern.
   - Keep recommendations support-first unless the user explicitly asked for product or engineering artefacts.

## Decision rules

### Likely duplicate

Classify as likely duplicate when the compared tickets show the same symptom, same root problem, and same resolution path.

Use this when:

- the customer report describes effectively the same failure or request;
- the affected workflow, product area, account/site, and conditions align;
- timing and ticket history support one shared support case or one shared resolution path;
- handling separately would create redundant support work without preserving meaningful customer nuance.

Recommended handling:

- link or merge tickets according to Zendesk/support policy;
- preserve any unique customer-impact details before merging;
- keep one clear support owner or canonical support thread if appropriate;
- avoid product/Linear duplicate framing unless explicitly requested.

### Related but distinct

Classify as related but distinct when symptoms are similar but customer context, conditions, impact, expected behaviour, or likely cause differs.

Use this when:

- cases belong to the same product area or workflow but are not the same support problem;
- one customer has multiple similar pains with different causes or contexts;
- different customers describe similar symptoms that could stem from different setups;
- separate handling is needed to avoid losing context.

Recommended handling:

- link tickets as related if useful;
- keep tickets separate;
- add a shared tag, internal note, or support view reference where appropriate;
- route to `zendesk-evidence-collector` if deeper proof is needed to confirm cause.

### Repeated pain pattern

Classify as repeated pain pattern when multiple tickets reveal recurring customer friction, confusion, failed expectations, unclear documentation, UX pain, onboarding gaps, policy confusion, or support burden without proving one shared root defect.

Use this when:

- complaints repeat across tickets but do not collapse into one duplicate issue;
- the pattern is about customer experience or support friction rather than a single incident;
- customer pain should be tracked, reported, documented, or improved but not merged as duplicates.

Recommended handling:

- keep cases separate unless individual duplicates exist;
- group using Zendesk tags, views, article gaps, or reporting notes;
- route to `zendesk-backlog-trend-analysis` only when the user needs queue-level reporting, volume, trend, ageing, SLA-risk analysis, or backlog health reporting;
- route to `zendesk-knowledge-candidate-review` if repeated confusion may be solved through documentation.

### Broader incident pattern

Classify as broader incident pattern when there is widespread or concurrent impact that may require coordinated operational response.

Use this when:

- similar tickets cluster in the same time window;
- multiple customers or accounts report the same failure or degradation;
- support evidence suggests a shared service, integration, deployment, configuration, payment, email, hosting, or infrastructure problem;
- impact appears larger than ordinary duplicate handling.

Recommended handling:

- do not merge everything by default;
- link cases to an incident/support problem record if that is the Zendesk practice;
- preserve customer-level tickets for communication and impact tracking;
- route to `zendesk-customer-escalation` if operational risk, urgency, or cross-functional intervention is needed;
- route to `zendesk-evidence-collector` if incident status depends on proof not yet available.

### Inconclusive

Classify as inconclusive when evidence is too thin to responsibly label the relationship.

Use this when:

- symptoms are similar but key context is missing;
- timing, affected workflow, customer context, or likely cause is unclear;
- tickets may be duplicates, related cases, or a pattern but the evidence does not support a confident call.

Recommended handling:

- do not merge yet;
- identify the smallest missing comparison evidence;
- route to `zendesk-evidence-collector` if material proof is needed;
- route to `zendesk-triage-router` if the tickets still lack ordinary support classification.

## Classification calibration examples

When a review is borderline, when a teammate is using this skill for the first time, or when the distinction between duplicate, related, repeated pain, broader incident, and inconclusive is unclear, consult `examples/anonymised-ticket-comparisons.md`.

Use those examples only as calibration patterns. They are synthetic and must not be treated as real Zendesk evidence, customer history, incident records, or source-of-truth data. Actual Zendesk evidence and supplied ticket details always override the examples.

## Structured handoff schema

When the user asks for JSON, a machine-readable result, an automation-friendly handoff, or output that will be pasted into another system, use `schemas/duplicate-pattern-review.schema.json`.

Use the schema to keep classification, confidence, access context, evidence, handling recommendations, missing evidence, limitations, and next workflow consistent across shared agents. Do not use structured JSON as the default customer-facing response unless the user asks for it or a downstream workflow clearly needs it.

Keep schema values support-operational. Do not invent ticket IDs, hidden Zendesk history, customer details, or connector evidence to satisfy required fields. If a required detail is unavailable, use the visible reference, `unknown`, or a plain limitation instead of guessing.

## Output format

Use this structure by default:

```markdown
## Duplicate / pattern review

- Relationship classification: `[likely duplicate | related but distinct | repeated pain pattern | broader incident pattern | inconclusive]`
- Confidence: `[high | medium | low]`
- Access context: `[full Zendesk access | partial Zendesk access | supplied evidence only | secondary connector evidence | unknown]` only when relevant

## Evidence used

- [Zendesk ticket, conversation, metadata, or supplied comparison evidence]
- [Evidence point]

## Reasoning

[Briefly explain how symptoms, scope, timing, customers, and likely cause support the classification. Name uncertainty directly. If access is limited, say what could not be confirmed.]

## Support handling next step

- Link tickets: `[yes | no | maybe]` - [reason]
- Treat separately: `[yes | no]` - [reason]
- Escalate: `[yes | no | not yet]` - [reason]
- Include in reporting: `[yes | no | maybe]` - [reason]
- Next workflow: `[zendesk-triage-router | zendesk-evidence-collector | zendesk-backlog-trend-analysis | zendesk-customer-escalation | zendesk-case-readiness-check | zendesk-draft-response | zendesk-knowledge-candidate-review | zendesk-create-knowledge | zendesk-handoff-prep | zendesk-router-skill | none]`
```

For quick reviews, compress the response but still include relationship classification, confidence, evidence used, and what should happen next.

For high-risk or low-confidence reviews, add:

```markdown
## Smallest missing evidence

[The one comparison detail needed before merging, linking, escalating, or reporting.]
```

## Handoff rules

Use these as local exit ramps after the relationship classification. Consult `references/routing-boundaries.md` when the next step is not obvious.

- Route to `zendesk-triage-router` only if ordinary support classification is still missing.
- Route to `zendesk-evidence-collector` only if the relationship depends on deeper proof, root-cause confirmation, reproduction, logs, or timeline evidence.
- Route to `zendesk-backlog-trend-analysis` only if the requested deliverable is queue-level reporting, volume, trend, ageing, SLA-risk analysis, or backlog health analysis.
- Route to `zendesk-customer-escalation` only if the pattern implies larger operational risk, urgent customer impact, SLA risk, or cross-functional intervention.
- Route to `zendesk-case-readiness-check` only if evidence sufficiency is unclear before a reply, escalation, knowledge draft, or downstream handoff.
- Route to `zendesk-draft-response` only when the relationship is clear and the user asks for customer-facing wording.
- Route to `zendesk-knowledge-candidate-review` only if the pattern suggests a documentation opportunity but suitability is unclear.
- Route to `zendesk-create-knowledge` only when documentation suitability is already clear and the user wants the article, macro, or internal note drafted.
- Route to `zendesk-handoff-prep` only when the relationship is clear and the user needs a support-first handoff prepared.

If the next workflow choice is broader than these local outcomes, return to `zendesk-router-skill` instead of trying to route across the full Zendesk skill network. Do not route to Linear, GitHub, Asana, product planning, project planning, or canonical product issue management by default. Use downstream artefact workflows only when the user explicitly asks for that artefact or after a support-first handoff confirms it is needed.

## Quality bar / guardrails

A good duplicate and pattern review is:

- Zendesk-first;
- support-operational;
- explicit about evidence, access context, and uncertainty;
- careful about customer-specific context;
- clear about whether tickets should be linked, merged, separated, escalated, or reported;
- disciplined about the difference between duplicate, related issue, repeated pain, and incident pattern.

Avoid:

- over-collapsing distinct cases;
- calling every repeated issue a duplicate;
- treating similar wording as proof of same cause;
- losing unique customer impact during merge/link recommendations;
- using product/Linear duplicate logic before support duplicate logic;
- escalating ordinary repeated pain as an incident without timing, scope, or impact evidence;
- producing broad backlog analysis when the immediate need is relationship classification;
- hiding uncertainty behind confident labels;
- implying all Zendesk history, internal notes, or related tickets were checked when shared-agent access was incomplete.

## Practical examples

Owned by this skill:

- "Are these Zendesk tickets duplicates or just related?"
- "This customer keeps reporting similar pain. Should these be merged, linked, or kept separate?"
- "Several tickets mention the same problem today. Is this an incident pattern?"
- "Should these cases be tracked together for support reporting?"

Routed away by this skill:

- "Classify this ticket and set priority" -> `zendesk-triage-router`.
- "Find the root cause and prove whether these cases share one defect" -> `zendesk-evidence-collector`.
- "Summarise this month of repeated Zendesk themes" -> `zendesk-backlog-trend-analysis`.
- "Write the customer update for all affected users" -> `zendesk-draft-response`.
- "Create an escalation brief for this incident" -> `zendesk-customer-escalation`.
- "Create or deduplicate Linear issues" -> only if explicitly requested after support-first review.

## Replacement and demotion note

This skill should replace or reduce reliance on these Linear-oriented skills for Zendesk-centred duplicate and pattern decisions:

- `linear-duplicate-management-playbook` when the comparison starts from support tickets rather than product issues;
- `linear-triage-router` when the immediate need is support relationship classification rather than product/project routing;
- `linear-gap-analyzer` when the missing context is Zendesk comparison evidence rather than Linear issue readiness;
- `linear-voice-of-customer` when repeated customer pain first needs support pattern classification before product insight synthesis.

Use Linear-oriented duplicate or product-planning workflows only when the user explicitly asks for a Linear-centred artefact or after Zendesk-first support review confirms that a downstream product issue should be prepared.

## Recommended parent-agent routing note

For Zendesk-centred tickets that appear similar, repeated, or connected, use `zendesk-duplicate-pattern-review` before merging, linking, escalating, reporting, or preparing downstream product artefacts. Treat duplicate, related issue, repeated pain, and incident pattern as separate classifications. Do not route to Linear duplicate handling by default.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

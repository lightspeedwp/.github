---
name: zendesk-customer-research
description: build cited zendesk-first customer and account research briefs for support, delivery, escalation, or reply-prep workflows. use when a request starts from a customer name, zendesk ticket, support thread, account context, prior commitments, escalation signals, recent support activity, or a question about what the team should know before the next customer action. keep the output internal, evidence-backed, source-aware, and focused on support-operational context rather than sales scoring, product planning, deep diagnosis, backlog reporting, or customer-facing wording.
---

# Zendesk Customer Research

Use this skill to assemble a compact, cited, Zendesk-first customer or account research brief for the LightSpeed support team.

The brief should help a support, delivery, escalation, or account owner understand what has recently happened, what still matters, and what context should be carried into the next reply or handoff. It is an internal support-research artefact, not a customer-facing message.

Keep this skill focused on customer/account support context. Do not turn it into case investigation, reply drafting, backlog reporting, knowledge drafting, or product planning.

## Team-Ready Inputs

Accept any of these inputs:

- customer or account name
- email address, domain, Zendesk ticket ID, Zendesk ticket URL, project name, or support thread
- pasted Zendesk exports, customer threads, Gmail threads, Slack snippets, Zendesk notes, Google Drive docs, Asana notes, Linear notes, or GitHub issue context
- a time window such as `today`, `this week`, `recent`, `last 30 days`, or an explicit date range
- a research mode such as `support pulse`, `issue background`, `prior commitments`, `escalation signals`, or `pattern check`

If the input is vague, use `references/input-normalisation-schema.md` to resolve the safest likely scope and state it clearly. Ask a follow-up only when the customer cannot be identified at all or when there are multiple plausible customers with materially different meanings.

## Default Frame

- Optimise for support and account-context understanding, not commercial account scoring.
- Default to the past 7 days unless the user asks for a different window.
- If the user says `today`, `recent`, or `latest`, default to the past 24 hours.
- Include still-open issues just before the window when they materially affect the current support picture.
- Record the exact time window using absolute dates.
- Keep support-operational health separate from commercial relationship health.
- Treat Zendesk as the source of truth for customer-facing support facts whenever Zendesk evidence is available.

## Shared-Agent Behaviour

When this skill runs inside a shared workspace agent, do not assume the logged-in user has the same personal connector access, private memory, saved searches, or workspace permissions as any other teammate. Use `references/shared-agent-access-model.md` whenever connector availability affects source coverage, confidence, or wording. Use `references/source-permission-matrix.md` when deciding what each source can prove, whether a source should be checked, and how unavailable permissions should affect the ledger. Use `references/citation-ledger-schema.md` when assigning source handles or checking whether evidence supports the brief. Use `references/examples.md` when the request is ambiguous, connector access is incomplete, or the brief risks overclaiming. Mark unavailable sources as unavailable rather than as no-result searches, and do not infer customer support health from non-Zendesk sources when live Zendesk evidence is unavailable.

## Zendesk-First Source Routing

Search sources from most operationally authoritative to least. Use `references/source-permission-matrix.md` to decide what each source can prove and how to record connector availability. Use `references/citation-ledger-schema.md` to assign handles and tie claims back to evidence. Record every source checked in the source coverage ledger, including no-result, not-relevant, unavailable, and intentionally skipped searches.

1. **Zendesk**
   - Use first for ticket timelines, case state, severity, priority, owner, queue, customer messages, SLA pressure, internal notes, public replies, tags, linked problems, and explicit support commitments.
   - When a Zendesk ticket ID or URL is supplied, start from that ticket, then expand to the customer/account's recent and still-open related tickets.
   - If Zendesk is unavailable, apply `references/shared-agent-access-model.md`: use pasted ticket exports, Zendesk thread excerpts, or user-provided support notes where available; label the evidence base as narrower; downgrade confidence when current status cannot be verified; and do not treat unavailable Zendesk access as proof that no tickets exist.
2. **Gmail**
   - Use when support activity, sales follow-up, escalation, or prior commitments happened in email.
   - Prefer full thread reads over snippets when reply context or commitments matter.
3. **Google Drive**
   - Use for project briefs, handover notes, SOPs, support playbooks, implementation notes, client docs, or governance decisions.
   - Treat docs as supporting context unless they directly contain the support record.
4. **Slack or chat**
   - Use for recent internal discussion, ownership signals, escalation context, or operational colour.
   - Treat chat as useful but less authoritative than Zendesk for customer-facing facts.
5. **Asana, Linear, GitHub, or project tools**
   - Use only when the user refers to delivery work, bugs, implementation status, project tasks, or engineering handoff.
   - Do not turn project task status into support-health unless it directly affects the customer reply.
6. **Pasted notes or exports**
   - Use when connected sources are unavailable or the user supplies a bounded evidence set.
   - Be explicit that the evidence base is narrower than a live Zendesk-backed brief.

When sources disagree, weigh authority, recency, and directness. Surface contradictions instead of smoothing them into a false single story.

## Routing Boundaries and Handoffs

Use `references/routing-boundaries.md` before recommending another skill. This specialist skill should not act as the full Zendesk skill-network router. Keep handoffs limited to the common next step that follows directly from the customer-research evidence, or return to `zendesk-router-skill` when the next workflow is unclear, broad, or outside this skill's own boundaries.

Own this work when the user needs customer/account context, recent support activity, prior commitments, support-health background, or escalation signals before deciding what to say or do next.

Common direct handoffs from this skill:

| Evidence-backed next need | Handoff |
|---|---|
| Customer-facing wording is now needed from the research brief | `zendesk-draft-response` |
| The evidence shows high-severity unresolved impact, rising customer pressure, or unclear ownership requiring intervention | `zendesk-customer-escalation` |
| The evidence is too thin or contradictory to support a brief, reply, or escalation | `zendesk-case-readiness-check` or `zendesk-evidence-collector` |
| A support, specialist, engineering, product, security, or operations handoff is needed from the research findings | `zendesk-handoff-prep` |
| The user asks for routing beyond these common handoffs, or the request spans multiple Zendesk workflows | `zendesk-router-skill` |

Do not maintain a complete map of all Zendesk specialist skills here. `zendesk-router-skill` owns the wider Zendesk skill network and should be used when a broad routing decision is needed.

## Workflow

1. **Resolve the customer and time window**
   - Use `references/input-normalisation-schema.md` when the request includes messy, partial, or mixed identifiers.
   - Normalise the customer, account, domain, contact, Zendesk organisation, or Zendesk ticket identifier.
   - Resolve the requested window into absolute dates and infer the research mode.
   - Keep the normalised input record internal unless ambiguity, source limits, or connector availability affect confidence. If the scenario resembles a known edge case, consult `references/examples.md` before researching or drafting.
2. **Build the Zendesk backbone first**
   - Find recent relevant Zendesk tickets plus still-open older tickets that affect the current support picture.
   - Capture ticket ID, status, priority or severity, owner or queue, last meaningful update, current blocker, and the current support takeaway.
   - Include public replies and internal notes only at the level needed to support the brief.
3. **Expand into supporting context**
   - Before expansion, account for shared-agent connector availability using `references/shared-agent-access-model.md` when permissions may differ by teammate or agent session.
   - Search email, docs, chat, and project tools only where they are likely to add evidence.
   - Keep source-specific facts separate until synthesis.
4. **Maintain a source coverage ledger**
   - Use `references/citation-ledger-schema.md` when assigning handles or recording coverage.
   - Mark each intended source as relevant, no result, not relevant, unavailable, or intentionally not checked.
   - Include why the source mattered, did not matter, could not be accessed, or was skipped.
   - Record which brief claims or sections each relevant source supports.
5. **Assign citation handles while researching**
   - Use `[Z1]`, `[E1]`, `[S1]`, `[D1]`, `[P1]`, and `[O1]` style tags for Zendesk, email, Slack/chat, docs, project tools, and other sources.
   - Do not use a handle in synthesis unless the source appears in the final ledger.
6. **Synthesize the support picture**
   - Identify repeated themes, unresolved issues, ownership churn, escalation signals, recovery signals, contradictions, and evidence gaps.
   - Use `references/health-rubric.md` for one conservative overall support-health signal.
7. **Produce the brief**
   - Use `references/output-template.md` as the default structure.
   - Keep the brief compact, cited, and actionable.
   - Add a handoff recommendation only when it follows directly from the evidence; otherwise return broad routing decisions to `zendesk-router-skill`.

## Research Modes

Adjust the search pattern to the kind of brief needed.

- **Support pulse**
  - Summarise what has happened recently and how healthy support looks right now.
- **Issue background**
  - Summarise what is already known about a repeated problem, workaround, or open support escalation without performing deep root-cause investigation.
- **Prior commitments**
  - Identify what support, delivery, or another team already told this customer.
- **Escalation signals**
  - Identify support-risk indicators, ownership gaps, customer pressure, SLA pressure, or unresolved blockers that may require `zendesk-customer-escalation`.
- **Pattern check**
  - Decide whether the customer's experience looks isolated, repeated for that customer, or outside this skill's common handoffs and therefore worth returning to `zendesk-router-skill`.

If the user does not specify a mode, infer the closest mode and state the chosen scope in the brief.

## Freshness and Confidence

Treat freshness as part of confidence.

- `High` confidence: recent Zendesk evidence and at least one relevant supporting source line up cleanly.
- `Medium` confidence: the picture is directionally clear, but source coverage is partial, stale, or informal.
- `Low` confidence: evidence is thin, contradictory, missing live Zendesk confirmation, or old enough that the current state may have changed.

If the freshest strong source is old relative to the question, lower confidence even if the evidence is otherwise clean.

## Health Signal Rules

Use `references/health-rubric.md`.

Allowed values:

- `Stable`
- `Watch`
- `At Risk`
- `Unknown`

Never infer `Stable` from quietness alone. Use `Unknown` when source coverage is too thin to score responsibly.

## Synthesis Guidance

Strong synthesis includes:

- repeated problem themes across Zendesk tickets
- unresolved or newly reopened tickets that affect the next reply
- ownership churn or unclear next steps
- escalation, trust, privacy, data-loss, SLA, or severe workflow signals
- recovery signals that genuinely reduce concern
- contradictions and evidence gaps that the team should not ignore

Weak synthesis includes:

- count-only summaries without interpretation
- urgency based only on ticket volume
- unsupported statements about customer sentiment
- mixing commercial account value with support-operational health
- replacing Zendesk evidence with informal chat or project-tool assumptions when Zendesk is available

## Non-Guessing Rules

- Do not invent severity, priority, owner, queue, status, SLA state, account importance, or customer sentiment.
- Do not turn absence of evidence into a positive health signal.
- Distinguish clearly between Zendesk tickets found, sources checked with no results, and sources checked that were not relevant.
- Do not ship uncited synthesis.
- Do not include customer-facing wording unless the user explicitly asks for a reply draft; route that to `zendesk-draft-response`.
- Do not perform deep root-cause investigation; route proof, timeline reconstruction, and diagnostic investigation to `zendesk-evidence-collector`.
- Do not draft knowledge-base articles, choose documentation workflows, or directly route documentation decisions; return documentation-routing questions to `zendesk-router-skill`.
- Do not produce multi-customer queue or backlog reports, choose backlog-analysis workflows, or directly route backlog decisions; return broad reporting-routing questions to `zendesk-router-skill`.
- Do not directly route documentation, backlog, duplicate, or pattern decisions outside this skill's common handoffs; return broader routing decisions to `zendesk-router-skill`.
- Do not expose internal uncertainty as a polished conclusion; label it as a gap or question.

## Output Requirements

Always produce a compact brief with:

- `Customer`
- `Window`
- `Current support state`
- `Weekly view` for 7-day windows unless the user asked for daily detail
- `Recent Zendesk activity`
- `Key themes and trendlines`
- `Open risks or escalation signals`
- `Recommended reply context`
- `Recommended handoff`
- `Further questions / next checks`
- `Source coverage and citation key`

## LightSpeed Usage Examples

Use examples like these to make the skill easy for the team to invoke:

- `Use zendesk-customer-research for Media24 over the last 7 days before I reply.`
- `Give me a Zendesk support pulse for The Safari Partners from recent tickets and email.`
- `Research this Zendesk organisation and tell me whether it needs escalation context or a normal reply path.`
- `Check prior support commitments for VKB Europe before I send the next update.`

## Quality Gate Before Final Answer

Before returning the brief, check that:

- the customer and date window are explicit
- Zendesk evidence was checked first or its absence is clearly stated
- every synthesis claim has citation handles
- every citation handle used in the brief appears in the source coverage ledger
- relevant ledger entries support at least one brief claim or are removed
- unresolved contradictions are surfaced
- source coverage includes no-result searches where relevant
- the health signal follows the rubric
- the recommended handoff is limited to this skill's common handoffs or returns to `zendesk-router-skill` for broader routing
- the output is internal and actionable for a support or delivery teammate

## References

- Output template: `references/output-template.md`
- Health rubric: `references/health-rubric.md`
- Shared-agent access model: `references/shared-agent-access-model.md`
- Source permission matrix: `references/source-permission-matrix.md`
- Input normalisation schema: `references/input-normalisation-schema.md`
- Citation ledger schema: `references/citation-ledger-schema.md`
- Routing boundaries: `references/routing-boundaries.md`
- Anonymised workflow examples: `references/examples.md`

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

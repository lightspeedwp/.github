---
name: customer-research
description: create evidence-backed customer, prospect, company, and contact research briefs for a sales assistant agent. use when a request starts from a customer name, prospect name, company domain, email address, sales lead, meeting, proposal, estimate, crm note, website, linkedin profile, gmail thread, calendar event, asana task, slack thread, google drive doc, or asks what to know before outreach, discovery, follow-up, proposal, renewal, upsell, reactivation, or account handoff. keep the output internal, cited, source-aware, and focused on sales readiness rather than customer-facing copy or unsupported scoring.
---

# Customer Research

Use this skill to help a sales assistant produce a concise, evidence-backed research brief before outreach, discovery calls, proposals, follow-ups, renewals, upsells, reactivation, or internal account handoff.

The skill should answer: who is this customer or prospect, what do we already know, what opportunity or risk matters, what should the next sales action be, and what evidence supports that view.

## Default Behaviour

- Keep the output internal unless the user explicitly asks for customer-facing wording.
- Default to the last 90 days for sales relationship context unless the user gives a different window.
- Include older context when it materially affects trust, commitments, account history, or proposal fit.
- Use absolute dates for time windows and recent interactions.
- Separate confirmed facts, reasonable inferences, and unknowns.
- Cite every material claim using source handles such as `[G1]`, `[D1]`, `[W1]`, `[A1]`, `[S1]`, `[L1]`, or `[O1]`.
- Do not infer budget, urgency, authority, sentiment, or commercial value without evidence.
- Do not treat a lack of recent messages as proof that the relationship is healthy or inactive.
- Do not perform deep support diagnosis, technical investigation, or legal/privacy assessment; route those needs to a specialist workflow.

## Accepted Inputs

Accept any combination of:

- customer, prospect, organisation, brand, or account name
- contact name, email address, company domain, website URL, LinkedIn profile, or meeting title
- Gmail thread, calendar event, Slack thread, Google Drive doc, Asana task, Linear issue, Zendesk ticket, proposal note, estimate, or pasted transcript
- research mode such as `pre-call brief`, `outreach prep`, `proposal context`, `follow-up context`, `account history`, `renewal prep`, `upsell signal`, `reactivation`, or `handoff`
- time window such as `recent`, `this month`, `last quarter`, or explicit dates

If the input identifies multiple plausible customers or people with materially different meanings, ask one clarifying question. Otherwise, proceed using the safest bounded interpretation and state the assumed scope.

## Source Order

Use the most authoritative available source first. Record unavailable or skipped sources in the source coverage section.

1. **User-provided material**
   - Treat pasted notes, uploaded files, and direct instructions as the immediate scope anchor.
   - Do not expand beyond the supplied material when the user asks for a bounded review.
2. **Gmail**
   - Use for relationship history, outreach, follow-ups, proposals, promises, objections, pricing discussion, meeting outcomes, and last-touch context.
   - Prefer reading full threads when commitments, tone, or next steps matter.
3. **Google Calendar**
   - Use for upcoming or recent meetings, attendees, timing, and meeting cadence.
   - Do not infer meeting outcomes from calendar titles alone.
4. **Google Drive**
   - Use for proposals, estimates, discovery notes, contracts, project briefs, strategy docs, sales packs, case studies, and handoff documents.
5. **Asana, Linear, GitHub, or project tools**
   - Use for delivery status, blockers, prior scope, implementation progress, issue history, or open operational commitments.
   - Do not convert task existence into sales opportunity without supporting evidence.
6. **Slack or internal chat**
   - Use for recent internal context, ownership, informal blockers, or relationship colour.
   - Treat chat as supporting context, not the primary source for customer-facing facts.
7. **Zendesk or support records**
   - Use only when support health, unresolved issues, recent complaints, or escalation risk affects sales readiness.
   - Keep support facts separate from commercial interpretation.
8. **Web and public sources**
   - Use for current company facts, website positioning, leadership, products, news, funding, hiring, technology stack, market context, or public claims.
   - Browse when facts may have changed, when checking a public website, or when citations are needed.
9. **LinkedIn or professional profiles**
   - Use for role, company, location, and professional context when available.
   - Avoid speculative personal profiling.

## Workflow

1. **Resolve the research target**
   - Identify the account, company, contact, domain, project, or thread.
   - Resolve the research mode and time window.
   - State the interpreted scope in the brief.
2. **Build the relationship backbone**
   - Find recent and relevant customer interactions.
   - Capture last touch, open promises, objections, blockers, proposal status, owner, and next expected action.
3. **Add account and opportunity context**
   - Review current website/public information, previous work, proposals, sales notes, and project context.
   - Identify fit signals, problem signals, timing signals, expansion signals, and reasons not to push.
4. **Check risk before recommending action**
   - Look for unresolved support issues, delivery concerns, pricing sensitivity, stakeholder confusion, privacy/security concerns, and broken commitments.
   - Do not recommend aggressive outreach when trust or delivery risk is unresolved.
5. **Synthesize conservatively**
   - Separate confirmed evidence from inferred sales implications.
   - Highlight contradictions and stale sources instead of smoothing them over.
   - Use `references/output-template.md` unless the user asks for a different format.
6. **Recommend the smallest useful next action**
   - Choose one primary next sales action and optional supporting actions.
   - Recommend a different workflow only when the evidence clearly shows the sales assistant should not continue directly.

## Research Modes

- **Pre-call brief**: prepare the salesperson for an upcoming call with account history, likely agenda, risks, and useful questions.
- **Outreach prep**: identify why outreach is relevant now, what angle is safe, and which facts support it.
- **Proposal context**: summarise requirements, constraints, buyer priorities, open questions, and proposal risks.
- **Follow-up context**: identify last touch, promised next steps, outstanding objections, and a suitable follow-up angle.
- **Account history**: summarise prior relationship, previous projects, active commitments, and decision history.
- **Renewal or upsell prep**: identify usage, delivery health, support concerns, expansion signals, and reasons to wait.
- **Reactivation**: identify why the account went quiet, what has changed, and whether outreach is justified.
- **Handoff**: prepare internal context for another team member without losing evidence or commitments.

## Evidence and Citation Rules

Use short source handles in the final brief:

- `[G1]` Gmail or email
- `[C1]` Calendar
- `[D1]` Google Drive or docs
- `[A1]` Asana
- `[L1]` Linear
- `[H1]` GitHub
- `[S1]` Slack or chat
- `[Z1]` Zendesk or support
- `[W1]` Website or public web
- `[P1]` LinkedIn or public profile
- `[O1]` Other user-provided or uploaded source

Every handle used in the synthesis must appear in `Source coverage`. Do not cite a source that was only searched but did not support the claim.

## Output

Use `references/output-template.md` as the default structure. Keep the brief compact enough for a salesperson to read before acting.

Always include:

- `Customer / prospect`
- `Research scope`
- `3-bullet sales summary`
- `Relationship context`
- `Opportunity and fit signals`
- `Risks, blockers, or reasons to slow down`
- `Recommended next action`
- `Suggested follow-up angle`
- `Open questions`
- `Source coverage`
- `Confidence`

## Routing Boundaries

- Draft customer-facing emails only if the user explicitly asks for wording after the research brief.
- Route support-heavy unresolved issues to a support investigation, Zendesk, or escalation skill instead of forcing a sales recommendation.
- Route deep technical discovery to an implementation, engineering, SEO, performance, WordPress, or design specialist skill.
- Route proposal pricing or estimate creation to the relevant estimating or proposal workflow.
- Route broad market research, competitor analysis, or public company research beyond the target account to a separate research workflow.

## Quality Gate

Before returning the brief, check that:

- the target and time window are explicit
- important source limitations are visible
- material claims have citation handles
- unsupported sales assumptions are labelled as assumptions or removed
- the recommendation is safe given relationship, delivery, and support evidence

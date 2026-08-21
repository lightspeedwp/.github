---
name: zendesk-customer-escalation
description: create zendesk-first escalation briefs for support issues requiring engineering, product, security, leadership, or specialist support intervention. use when a customer case has confirmed or likely impact, repeated failure, unclear ownership, blocked progress, relationship risk, compliance/security concern, or needs a clear cross-functional ask. route away when the user only needs routine handoff, first-pass triage, customer reply drafting, knowledge drafting, or broad backlog reporting.
---

# Zendesk Customer Escalation

Use this skill to create Zendesk-first escalation briefs for support cases that need cross-functional attention, urgency handling, risk ownership, or a clear decision from another team.

For shared agents, resolve connector names through the agent-level `CONNECTORS.md` file. Do not depend on personal connector IDs, personal memory, or user-specific account access. If a connector is unavailable, continue with Zendesk-grounded evidence and list the missing context as an evidence gap.

Use `references/CONNECTORS.example.md` as the default connector-map pattern when configuring a shared workspace agent. Use `references/shared-agent-portability.md` when connector access, user permissions, memory boundaries, or shared-agent setup need to be checked. Use `references/escalation-record-schema.md` when a structured escalation record is useful for QA, automation, or consistent copy-paste into another system. Use `references/routing-boundaries.md` when this specialist skill risks becoming a second Zendesk router.

## Escalation vs Handoff

Use `zendesk-customer-escalation` when the issue needs one or more of these outcomes:

- cross-functional attention from engineering, product, security, leadership, or a senior specialist
- urgent risk handling, customer-impact assessment, or relationship protection
- a decision, exception, prioritisation call, policy answer, or owner commitment
- action beyond normal support continuity or routine transfer of ownership

Use `zendesk-handoff-prep` instead when the work is lower-pressure internal support transfer, continuity notes, specialist review, operational context sharing, or ordinary owner handoff without a clear escalation risk or decision need.

Use `zendesk-case-readiness-check` before escalation when evidence sufficiency is unclear. Use `zendesk-evidence-collector` when the case evidence is weak, incomplete, or not yet Zendesk-grounded. Use `zendesk-evidence-quality-review` after drafting when the escalation brief needs QA for supportability, evidence strength, risk wording, or unsupported claims. Return to `zendesk-router-skill` when the user needs network-wide routing, a multi-specialist workflow decision, or a next-step recommendation outside this skill's common handoffs.

## What This Skill Does

- gathers support, account, issue, and impact context from Zendesk-first evidence
- distinguishes escalation from routine handoff or first-pass triage
- assesses customer, operational, relationship, compliance, and security risk
- identifies the clearest escalation lane and exact cross-functional ask
- structures reproduction steps or evidence when the issue is bug-like
- produces a concise escalation brief that can be pasted into Zendesk, Slack, Linear, GitHub, email, or another destination
- keeps customer-facing replies, knowledge drafting, and backlog reporting as separate deliverables

## Workflow

1. Anchor the case in Zendesk.
   - Identify the ticket, customer, issue, current status, and most recent customer-facing commitment.
   - Confirm what is broken, blocked, risky, or unresolved.
   - Separate confirmed facts from assumptions, likely causes, and missing evidence.
2. Decide whether this is escalation, a common adjacent handoff, or a router return.
   - Escalate only when cross-functional attention, urgency, risk handling, or a decision is needed.
   - Route to `zendesk-handoff-prep` when the case only needs continuity notes, specialist review, or transfer of ownership.
   - Route to `zendesk-triage-router` only when the user clearly needs first-pass classification, queue/status guidance, priority, or owner direction rather than an escalation brief.
   - Use `references/routing-boundaries.md` when multiple Zendesk specialist routes are plausible or the skill starts acting like a network-wide router.
   - Return to `zendesk-router-skill` when the request needs broader Zendesk skill-network routing instead of an escalation-specific decision.
3. Gather context from available shared-agent connector categories.
   - When this skill runs inside a shared workspace agent, consult `references/shared-agent-portability.md` if connector availability, user permissions, or memory boundaries affect the case.
   - `zendesk` for ticket history, customer messages, internal notes, status, tags, SLA context, and troubleshooting attempts. Treat this as the primary source of truth.
   - `crm` for account, plan, renewal, commercial, or relationship context when available.
   - `slack` for team discussion, incident context, or similar reports when available.
   - `asana` for related bugs, requests, delivery blockers, or operational follow-through when available.
   - `support_docs` for known issues, policy notes, previous decisions, documented workarounds, or support playbooks when available.
   - If a supporting connector is missing, do not guess. Continue with Zendesk evidence and mark the unavailable source as an evidence gap.
4. Assess impact and urgency.
   - Breadth: how many customers, users, teams, sites, or workflows are affected.
   - Depth: whether the issue is a full block, major degradation, repeat failure, or contained inconvenience.
   - Duration: how long it has been active, whether it is worsening, and whether support has stalled.
   - Business pressure: launch timing, renewal, revenue, SLA, contractual, executive, or public-visibility pressure.
   - Risk: relationship, compliance, security, data integrity, privacy, operational, or reputational exposure.
5. Choose the escalation lane.
   - Use `references/escalation-lanes.md` when ownership is ambiguous, multi-lane, or risk-sensitive.
   - Engineering for confirmed or likely defects, reliability issues, integrations, data integrity, infrastructure behaviour, or code-level remediation.
   - Product for feature gaps, policy choices, workflow mismatch, roadmap/prioritisation decisions, or UX/product behaviour ambiguity.
   - Security for data exposure, unauthorised access, vulnerability reports, privacy concerns, compliance risk, or suspicious account activity.
   - Leadership for major relationship risk, contractual exposure, executive visibility, cross-functional deadlock, or exception requests.
   - Support specialist for senior support intervention when frontline support is blocked but engineering/product/security/leadership escalation is not yet justified.
6. Draft the escalation brief.
   - Keep the ask specific, decision-oriented, and owned.
   - Include reproduction steps, evidence, screenshots, logs, or tracker links when useful.
   - State uncertainty explicitly instead of overstating confidence.
   - Draft only. Do not post, send, or change tickets unless the user explicitly asks.

## Escalate or Keep in Support

Keep the issue in normal support handling or route to handoff when:

- there is a documented answer or workaround that resolves the case
- the customer needs guidance, configuration help, or expectation-setting more than cross-functional intervention
- the issue has a clear support owner and is progressing without risk escalation
- the task is continuity, specialist review, transfer of ownership, or ordinary internal context sharing

Escalate when one or more of these are true:

- a bug, outage, integration failure, data issue, or systems problem likely needs code, infrastructure, or specialist remediation
- support cannot progress without a product, policy, security, commercial, or leadership decision
- there is meaningful trust, relationship, retention, compliance, security, privacy, data integrity, or reputational risk
- multiple customers are affected by the same underlying problem or repeated failure
- the case has stalled beyond its expected response path and needs ownership or urgency intervention
- the customer-facing commitment requires a clear internal answer, deadline, or decision owner

## Evidence Package Guidance

For bug-like or risk-heavy issues, the escalation should include enough detail for the target owner to act without restarting discovery.

Best evidence includes:

- exact customer-facing symptom, error wording, ticket quote, or screenshot description
- timestamps, time window, affected account/site/user, environment, plan, version, or integration details where relevant
- current ticket status, last customer update, and any promised next step
- attempted troubleshooting steps and what changed after each step
- reproduction steps with expected versus actual behaviour
- logs, screenshots, linked tickets, similar cases, or known-issue references
- explicit evidence gaps that may affect confidence

If evidence is thin, route to `zendesk-evidence-collector` or mark the escalation as evidence-limited. Do not present weak evidence as confirmed root cause.

## Severity Guidance

Use `references/severity-matrix.md` when impact, urgency, or confidence is unclear. Apply these default levels:

- `Critical`
  - severe outage, broad severe customer impact, material security/privacy/compliance risk, major data integrity concern, or high-trust relationship exposure
- `High`
  - major blocker, repeated failure, strong business pressure, meaningful customer impact, or credible escalation risk requiring timely owner action
- `Medium`
  - real issue needing escalation, but without confirmed emergency pressure, broad impact, or severe risk

Severity should reflect the problem being escalated, not just the customer's tone. If business context is unknown, say so instead of implying the risk is low. Treat missing evidence as an evidence gap, not as proof of low risk.

## Default Output Template

Use `templates/escalation-template.md` as the default final structure unless the user explicitly asks for a different destination format.

Template rules:

- preserve the template's heading order when it fits the case
- make `Summary` and `Decision or action needed` specific, concrete, and actionable
- keep `Customer impact`, `Severity and urgency`, `Evidence gathered`, and `Attempted steps` strong enough for the receiving team to act without restarting discovery
- use `Recommended owner` to name the best escalation lane or named team when known
- include `Evidence gaps / open questions` when confidence is limited
- include source availability when optional connectors were expected, checked, denied, or unavailable in a shared-agent run
- use `references/escalation-record-schema.md` when a structured version of the brief is needed alongside or before the narrative template
- omit empty sections instead of leaving placeholders

## Shared-Agent Portability Rules

- Keep the escalation workflow inside this skill and keep environment-specific mappings in the shared agent.
- Use `references/shared-agent-portability.md` to check shared-agent setup, source availability wording, memory boundaries, and permission-safe fallbacks.
- Do not hardcode connector IDs, workspace URLs, user names, Slack channels, Asana project IDs, Zendesk group IDs, or CRM object names in the skill.
- Do not assume the logged-in user has the same connector permissions as the skill author.
- Do not rely on personal memory for customer-specific context. Retrieve case-specific facts from Zendesk or approved shared connectors.
- If a connector, file, or workspace mapping is unavailable, state the gap plainly and continue with the safest Zendesk-first output.

## Output Boundaries

Keep this specialist skill narrow. `zendesk-router-skill` owns the full Zendesk skill network. This skill should know only its own escalation boundary, common adjacent handoffs, and when to return to the router.

Use `references/routing-boundaries.md` when the request may require network-wide Zendesk routing or when multiple specialist outputs are plausible.

Common direct handoffs from this skill:

- use `zendesk-evidence-collector` when case evidence is weak, incomplete, not Zendesk-grounded, or diagnostic facts are missing before escalation
- use `zendesk-case-readiness-check` when it is unclear whether the case has enough evidence for escalation or another concrete deliverable
- use `zendesk-handoff-prep` when the case needs lower-pressure internal transfer, continuity notes, or specialist review rather than cross-functional escalation
- use `zendesk-draft-response` when the customer also needs an interim update, apology, expectation-setting reply, translated/localised support response, or follow-up alongside the internal escalation
- use `zendesk-customer-research` when the escalation would benefit from broader customer history, support health, prior commitments, or account context
- use `zendesk-evidence-quality-review` after drafting when the brief needs QA before posting, sending, or escalating

Return to `zendesk-router-skill` instead of choosing a specialist when the user asks what Zendesk workflow should handle the case, when the primary deliverable is unclear, when the request spans unrelated support outputs, or when the next step depends on duplicate review, pattern review, knowledge creation, backlog reporting, broad triage, or other network-level routing.

Do not fold customer replies, knowledge-base article drafts, broad backlog reporting, duplicate review, or routine handoff notes into the escalation brief unless the user explicitly asks for a combined pack. If a combined pack needs routing across multiple Zendesk specialists, return to `zendesk-router-skill` with the known facts and why escalation may or may not be one part of the workflow.

## Follow-Through Expectations

Escalation does not end ownership of the customer relationship.

After drafting or sending an escalation:

- track what the customer was told most recently
- make the next internal checkpoint explicit
- state when the escalation should be revisited if no answer arrives
- prepare a matching customer-facing update through `zendesk-draft-response` when the user wants one

## Quality Checks Before Returning

Before returning the brief, check that:

- the escalation is justified rather than a routine support handoff
- the ask is specific, actionable, and assigned to the correct lane
- the target owner matches the actual decision, risk, or work required
- the impact, urgency, and severity are evidence-backed
- reproduction or diagnostic evidence is as concrete as the case allows
- assumptions, uncertainty, and evidence gaps are labelled clearly
- the brief can be pasted into another system without extra explanation

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

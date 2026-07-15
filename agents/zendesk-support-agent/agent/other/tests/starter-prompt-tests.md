# Starter prompt tests

Use these tests to verify that each starter prompt maps cleanly to a supported Zendesk-first workflow.

## Pass criteria

- each starter prompt matches a real supported workflow
- the prompt wording is consistent with the current agent instructions
- the prompt does not imply unsupported writes or unsupported app behavior
- the prompt does not collapse multiple distinct workflows into one unclear request

## Test cases

### 1. Triage a ticket

**Starter prompt:** "Triage this Zendesk ticket. Classify the issue, assess severity and business impact, flag missing details, note duplicate risk, and recommend the safest next action."

- Expected workflow: first-pass triage
- Expected primary skill: `zendesk-triage-router`
- Should produce: issue classification, severity, business impact, missing details, duplicate risk, next action

### 2. Investigate a case

**Starter prompt:** "Investigate this Zendesk case. Separate confirmed facts from inferences, identify what is still unclear, and recommend the strongest justified next step."

- Expected workflow: evidence-backed investigation
- Expected primary skill: `zendesk-evidence-collector`
- Should produce: confirmed facts, inferences, unknowns, recommended next step

### 3. Draft a reply

**Starter prompt:** "Draft a customer-facing reply for this Zendesk case. Use only confirmed facts, keep the tone clear and empathetic, and include realistic next steps only when they are actually known."

- Expected workflow: grounded customer reply drafting
- Expected primary skill: `zendesk-draft-response`
- Should produce: a customer-facing reply using confirmed facts only

### 4. Prepare handoff

**Starter prompt:** "Prepare an internal handoff for this Zendesk case. Summarize the problem, customer impact, evidence checked, attempted steps, blockers, target owner, exact ask, and urgency or risk."

- Expected workflow: internal support handoff
- Expected primary skill: `zendesk-handoff-prep`
- Should produce: internal brief with owner, blocker, ask, and urgency

### 5. Analyze backlog

**Starter prompt:** "Analyze the current Zendesk backlog. Summarize backlog health, issue themes, SLA risk, escalation-ready cases, and the top 5 next actions."

- Expected workflow: backlog and trend reporting
- Expected primary skill: `zendesk-backlog-trend-analysis`
- Should produce: backlog health, themes, SLA risk, escalation-ready cases, next actions

### 6. Review docs candidate

**Starter prompt:** "Review this Zendesk case or repeated issue and decide whether it should become reusable documentation. Tell me whether to create a new article, update an existing one, keep it internal-only, or wait because the evidence is still unstable."

- Expected workflow: documentation-worthiness review
- Expected primary skill: `zendesk-knowledge-candidate-review`
- Acceptable supporting skill: `zendesk-help-center-grounding`
- Should produce: create/update/internal-only/wait recommendation with reason

## Failure patterns to flag

- a starter prompt routes to a skill that does not match its user-facing promise
- a starter prompt implies a write or post action that the agent does not actually support by default
- a starter prompt is redundant with another prompt and does not demonstrate a distinct workflow
- a starter prompt skips Zendesk-first grounding for a workflow that should begin in Zendesk

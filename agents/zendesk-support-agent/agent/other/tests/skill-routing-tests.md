# Skill routing tests

Use these tests to verify that common Zendesk requests route to the expected primary skill or workflow.

## Pass criteria

- pick one primary skill by default
- add a supporting skill only when it materially improves safety, evidence quality, or workflow order
- keep Zendesk-first routing intact
- do not collapse distinct deliverables into the same workflow without a clear reason

## Test cases

### 1. Unclear intake

**Prompt:** "Here’s a Zendesk ticket URL. What should happen next?"

- Expected primary skill: `zendesk-router-skill`
- Acceptable supporting skill: none

### 2. First-pass triage

**Prompt:** "Triage this Zendesk ticket and tell me the safest next action."

- Expected primary skill: `zendesk-triage-router`
- Acceptable supporting skill: none

### 3. Evidence gathering

**Prompt:** "Investigate this Zendesk case and tell me what is confirmed versus still unclear."

- Expected primary skill: `zendesk-evidence-collector`
- Acceptable supporting skill: `zendesk-case-readiness-check`

### 4. Reply drafting

**Prompt:** "Draft a customer-facing reply for this Zendesk case."

- Expected primary skill: `zendesk-draft-response`
- Acceptable supporting skill: `zendesk-evidence-collector`

### 5. Internal handoff

**Prompt:** "Prepare an internal handoff for this Zendesk issue."

- Expected primary skill: `zendesk-handoff-prep`
- Acceptable supporting skill: `zendesk-evidence-collector`

### 6. Escalation brief

**Prompt:** "Create an escalation brief for this repeated high-impact support issue."

- Expected primary skill: `zendesk-customer-escalation`
- Acceptable supporting skill: `zendesk-evidence-collector`

### 7. Backlog analysis

**Prompt:** "Analyze the current Zendesk backlog and summarize SLA risk and next actions."

- Expected primary skill: `zendesk-backlog-trend-analysis`
- Acceptable supporting skill: none

### 8. Duplicate or pattern review

**Prompt:** "Check whether these Zendesk cases are duplicates or part of a broader pattern."

- Expected primary skill: `zendesk-duplicate-pattern-review`
- Acceptable supporting skill: `zendesk-evidence-collector`

### 9. Knowledge-worthiness review

**Prompt:** "Should this repeated support issue become documentation?"

- Expected primary skill: `zendesk-knowledge-candidate-review`
- Acceptable supporting skill: `zendesk-help-center-grounding`

### 10. Knowledge drafting

**Prompt:** "Draft a Help Center article from this resolved Zendesk issue."

- Expected primary skill: `zendesk-create-knowledge`
- Acceptable supporting skill: `zendesk-help-center-grounding`

### 11. Refund decision support

**Prompt:** "Assess whether this customer should receive a refund or goodwill credit."

- Expected primary skill: `zendesk-refund-assessment`
- Acceptable supporting skill: `zendesk-help-center-grounding`

### 12. Bug package

**Prompt:** "Turn this Zendesk support issue into an engineering-ready bug report package."

- Expected primary skill: `zendesk-bug-report-package`
- Acceptable supporting skill: `zendesk-evidence-collector`

### 13. Customer context research

**Prompt:** "Before we reply, summarize what support should know about this customer account."

- Expected primary skill: `zendesk-customer-research`
- Acceptable supporting skill: none

### 14. Help Center grounding

**Prompt:** "Check whether this proposed support answer matches the Help Center and policy guidance."

- Expected primary skill: `zendesk-help-center-grounding`
- Acceptable supporting skill: none

### 15. Readiness check

**Prompt:** "Do we have enough evidence to send a reply or should we investigate more first?"

- Expected primary skill: `zendesk-case-readiness-check`
- Acceptable supporting skill: `zendesk-evidence-collector`

## Failure patterns to flag

- choosing `zendesk-draft-response` for a task that is really an escalation or handoff
- choosing `zendesk-customer-escalation` for a normal internal handoff
- choosing `zendesk-create-knowledge` before documentation-worthiness is established
- routing backlog analysis through triage or case-level investigation skills
- skipping Zendesk-first routing when the request is still unclear

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

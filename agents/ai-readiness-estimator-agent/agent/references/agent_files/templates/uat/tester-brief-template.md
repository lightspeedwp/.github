---
version: 1.0.1
title: Tester Brief
audience: internal
document_type: uat-brief
status: template
language: en-GB
---

# Tester Brief

Use this brief when assigning pilot testing of the LightSpeed AI Readiness Estimator to an internal tester.

## Tester Details

- **Tester name:** [Insert name]
- **Role:** [Insert role]
- **Pilot owner:** [Insert owner]
- **Test window:** [Insert dates]
- **Assigned scenarios:** [Insert scenario IDs]

---

## Purpose

You are testing whether the LightSpeed AI Readiness Estimator can produce grounded, commercially careful, reusable outputs for internal AI-readiness work.

Focus on whether the agent can:

- choose the correct base package before add-ons
- stay audit-first when evidence is incomplete
- separate verified facts, assumptions, risks, and missing values clearly
- produce usable Markdown-source outputs without path leaks or unusable wrappers
- avoid unnecessary choice menus when a safe default deliverable is already obvious
- give practical next steps rather than vague advice

---

## How To Test

1. Use the assigned scenarios from `templates/uat/pilot-test-scenarios.tsv`.
2. Run each scenario as realistically as possible.
3. Record the result in `templates/uat/pilot-test-results.tsv`.
4. If you hit a serious failure, flag it for the high-severity log.

---

## What To Look For

Mark issues when the agent:

- invents details or overstates evidence
- chooses the wrong base package
- recommends add-ons too early
- overclaims fixed-fee confidence
- leaks local paths or fake links
- produces non-compliant Markdown output
- asks for avoidable choices instead of drafting a sensible default output
- gives next steps that are too vague to act on

---

## Recording Guidance

For each scenario, capture:

- what you asked
- what you expected
- what the agent actually did
- whether it passed or failed
- the severity if it failed
- the smallest useful recommended fix

---

## Escalation Rule

Escalate an issue immediately if it affects:

- commercial safety
- package routing
- evidence integrity
- local-path leakage
- reusable Markdown-output compliance
- trust in the agent’s recommendation quality

---

## Completion Checklist

Before closing your testing pass, make sure you have:

- completed every assigned scenario
- recorded each result in the shared TSV
- flagged any high-severity failures
- added concise recommended fixes where relevant

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

---
file_type: documentation
title: "Pilot Assignment Sheet"
description: "Project documentation"
last_updated: "2026-08-25"
status: active
---

# Pilot Assignment Sheet

Use this as a copy-ready message to assign pilot testing of the LightSpeed AI Readiness Estimator to internal team members.

## Copy-Ready Assignment

Hi team,

We’re running a focused internal pilot of the **LightSpeed AI Readiness Estimator**.

The goal is to test whether the agent can:

- choose the right base package before discussing add-ons
- stay audit-first and commercially careful when evidence is incomplete
- separate verified facts, assumptions, risks, and missing values clearly
- produce reusable Markdown outputs without local-path leaks or unusable wrappers
- avoid unnecessary choice menus when a safe default deliverable is already obvious
- give practical next steps that a LightSpeed teammate could act on

### What I need from you

Please complete your assigned scenarios from:

- `templates/uat/pilot-test-scenarios.tsv`

Then record each result in:

- `templates/uat/pilot-test-results.tsv`

If you hit a serious failure, also log it in:

- `templates/uat/high-severity-fixes-log.md`

### What to look out for

Please flag any response where the agent:

- invents facts or overstates confidence
- chooses the wrong base package
- recommends add-ons before the base package is chosen
- overclaims fixed-fee confidence or scope certainty
- leaks local paths or fake file links
- produces non-compliant Markdown-source output
- asks you to choose a deliverable when a useful default is already obvious
- gives vague or non-actionable next steps

### What to record for each scenario

Please capture:

- the scenario ID
- the prompt you used
- what you expected
- what the agent actually did
- whether it passed or failed
- severity if it failed
- your recommended fix

### Pilot expectation

Please complete at least **5 scenarios each** if possible, using realistic prompting and normal working assumptions.

### Escalate immediately if you see

- a trust or evidence-integrity problem
- a commercial-safety problem
- a package-routing failure
- a local-path leak or unusable link
- a reusable Markdown-output compliance failure

Thanks — once results are in, we’ll review the failures, tighten the setup, and rerun the highest-severity cases before wider rollout.

---

## Assignment Tracker

- **Pilot owner:** [Insert name]
- **Test window:** [Insert dates]
- **Assigned testers:** [Insert names]
- **Scenario allocation:** [Insert scenario IDs per tester]
- **Minimum scenarios per tester:** 5

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

---
version: 1.1.1
title: 'Team Testing Guide: LightSpeed AI Readiness Estimator'
audience: internal
document_type: team-testing-guide
status: active
language: en-GB
agent_name: LightSpeed AI Readiness Estimator
---

# Team Testing Guide: LightSpeed AI Readiness Estimator

Use this guide to run a focused pilot of the LightSpeed AI Readiness Estimator with internal testers from strategy, delivery, content, technical SEO, and project leadership roles.

## What this agent is for

This agent helps the LightSpeed team assess website AI readiness, recommend the right package path, identify follow-on scope, and produce practical internal estimate outputs. It should stay evidence-led, commercially careful, and audit-first when source material is incomplete.

## What to test

Test whether the agent can:

- choose a sensible base package before discussing add-ons
- default to **AI Readiness Foundation** when the evidence supports a baseline route
- separate verified facts, assumptions, open questions, and risks clearly
- identify when commercial confidence should remain provisional
- produce reusable internal outputs that a LightSpeed teammate could actually use
- handle Markdown-source output rules without leaking local paths or fake file links
- avoid stopping for unnecessary choice menus when a safe default deliverable is already clear
- give practical next steps for intake, audit, or internal review

## Tester roles

Include 3 to 5 testers across roles such as:

- strategist or sales lead
- project manager or account lead
- technical SEO or implementation lead
- content or chatbot planner
- delivery or operations lead

## How to prompt it

Use this structure:

1. State the task clearly.
2. Give the client, website, or project context.
3. Attach or paste the source material, if available.
4. Name the output format you want.
5. Mention any commercial, approval, or audience constraint.

## Good prompt example

Review this website AI-readiness opportunity for GreenTrail Travel. We have a content-heavy WordPress site and want to know the best LightSpeed package path. Based on the notes below, create an internal estimate, show what is verified versus assumed, and tell me what still needs to be confirmed before we commit to scope.

## Poor prompt example

Tell me what to do for this project.

## What good output looks like

Good output should be:

- clear
- source-aware
- honest about gaps
- practical
- commercially careful
- specific enough to act on
- explicit about what remains provisional
- safe around hidden settings, rollout status, app access, and approval-sensitive claims

## What to flag

Flag any response where the agent:

- invents facts or project details
- recommends add-ons before choosing the base package
- ignores evidence gaps or commercial uncertainty
- claims access, rollout state, or hidden configuration it cannot verify
- asks the tester to choose a deliverable when a useful default is already obvious
- leaks local paths or unusable file links
- produces non-compliant Markdown-source output for a Markdown-source request
- gives vague or non-actionable next steps

## How to record feedback

Use the UAT TSV files and complete:

- tester
- role
- scenario_id
- prompt
- expected_result
- actual_result
- pass_fail
- severity
- comments
- recommended_fix

## Pilot decision rule

Move from owner testing to broader team pilot only when:

- the agent consistently chooses a sensible base package
- it clearly separates verified facts from assumptions
- it handles missing evidence safely
- it avoids path leaks and unusable Markdown output wrappers
- it does not overclaim commercial certainty, app access, or rollout state
- the team understands how to prompt it and how to record failures

## Next steps

- Assign 3 to 5 testers from different roles.
- Ask each tester to complete at least 5 scenarios from the shared TSV.
- Review failures, tighten the instructions or files, and rerun the highest-severity cases before wider rollout.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

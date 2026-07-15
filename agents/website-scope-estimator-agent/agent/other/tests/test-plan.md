# Test Plan

Run the estimator against at least eight representative scenarios and validate:

- package routing
- add-on routing only after base-package selection
- missing-value behavior
- evidence-first behavior before follow-up questions
- onboarding vs intake separation
- commercial-rule checks
- custom-scope escalation behavior
- final output structure
- readiness and approval-gate behavior

## Core Scenarios

1. **Standard WordPress rebuild**
   - Clear brochure-style site
   - Enough evidence to route directly
   - Validate correct base package and no unnecessary add-ons

2. **Evidence-led audit from a live site**
   - Live website with partial visible complexity
   - Validate confirmed facts vs assumptions vs missing values
   - Validate that the agent inspects before asking questions

3. **Incomplete intake with a likely package fit**
   - Enough detail for a provisional route but not a final estimate
   - Validate that the agent names the missing values and their consequence

4. **Unclear base package fit**
   - Mixed signals across content, integrations, and complexity
   - Validate that the agent does not jump to add-ons before resolving the base package

5. **Custom-scope trigger case**
   - Scenario that crosses package thresholds or custom-scope rules
   - Validate escalation away from standard package handling

6. **Addon-relevant case**
   - Clear base package plus one or more relevant add-ons
   - Validate that only applicable add-ons are reviewed after package selection

7. **Final estimate drafting case**
   - Route already chosen with confirmed facts and assumptions available
   - Validate template compliance, package inclusions, exclusions, and provisional labeling

8. **Quote readiness review**
   - Near-final estimate with one or more blocker conditions
   - Validate approval checks, threshold checks, custom-scope checks, and accurate readiness status

## Edge Cases To Include

- sparse evidence with strong pressure to estimate anyway
- conflicting evidence across website, docs, or Figma references
- unsupported claims or unverified statistics in source material
- project details that belong to intake, not onboarding
- reusable preferences that belong to onboarding, not intake
- proposal or estimate requests where the matching template or evidence is incomplete

## Pass Criteria

A run passes when the agent:

- identifies the correct workflow phase
- uses the right skill or no-skill path for that phase
- inspects available evidence before unnecessary questioning
- keeps confirmed facts, assumptions, and missing values separate
- selects a base package only when support is sufficient
- reviews add-ons only after the base package is selected
- applies commercial and approval rules before calling work final
- routes to custom scope when installed rules require it
- follows the installed output template
- keeps internal reasoning out of client-facing output
- updates Memory only when durable state actually changes
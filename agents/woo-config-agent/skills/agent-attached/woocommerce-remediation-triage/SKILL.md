---
name: woocommerce-remediation-triage
description: Turn WooCommerce audit findings, implementation blockers, site-discovery signals, and scoped review notes into a prioritised remediation plan with dependency mapping, delivery sequencing, validation steps, and handoff-ready fix guidance. Use when the user wants to know what to fix first, how to phase the work, which issues are blockers versus follow-up items, or how to convert evidence-backed findings into an implementation-ready action plan.
---

# WooCommerce Remediation Triage

## Overview

Use this skill when the agent already has findings, evidence, or scoped problem notes and needs to convert them into a practical remediation plan.

Use it to improve actionability, not to replace evidence gathering. If the request still lacks meaningful findings or environment signals, gather or confirm those first.

## Use This Skill When

Use `$woocommerce-remediation-triage` when the user asks for any of the following:

- prioritise WooCommerce fixes
- turn audit findings into an action plan
- identify blockers vs later improvements
- phase remediation work across immediate, short-term, and later steps
- map dependencies, risks, and validation requirements for store fixes
- produce a developer-ready or client-ready remediation summary from existing findings

Typical trigger shapes:

- "Turn this audit into a remediation plan"
- "Which WooCommerce issues should we fix first?"
- "Group these findings into blockers, launch-critical fixes, and follow-up work"
- "Create a phased plan from these checkout, shipping, tax, or catalogue issues"

## Do Not Use This Skill For

Do not use this skill as the main workflow when the user is asking for:

- a first-pass site inspection with little or no current evidence
- a fresh audit that still needs store discovery
- direct implementation through tools
- generic WordPress work that is not materially tied to WooCommerce outcomes

In those cases, use the normal discovery, audit, or implementation route first.

## Inputs You Should Prefer

Prioritise grounded evidence in this order when available:

1. connected-site findings or inspected store state
2. confirmed audit findings and validated configuration notes
3. scoped implementation constraints and known blockers
4. remembered user or project defaults as target-state preferences
5. clearly labelled working assumptions only when needed

Keep current-state evidence separate from target-state recommendations.

## Workflow

1. Identify the exact WooCommerce outcome at risk.
2. Extract only the findings that materially affect that outcome.
3. Group each finding into one of these remediation classes:
   - restoration blocker
   - launch-critical fix
   - conversion or trust risk
   - operational risk
   - quality or maintainability improvement
4. For each item, determine:
   - why it matters
   - what dependency or prerequisite affects it
   - whether the issue is configuration, content, data, process, integration, or validation related
   - whether it needs manual confirmation before implementation
5. Sequence the work so prerequisites happen before dependent fixes.
6. Separate quick wins from items that need coordinated implementation.
7. Add validation steps for each meaningful fix area.
8. End with a concise next-step plan that makes the execution order obvious.

## Prioritisation Rules

Use these rules unless the user gives a different priority model:

1. restoration of missing or broken WooCommerce foundations comes first
2. checkout, payment, tax, shipping, and trust issues outrank merchandising polish
3. issues that block validation outrank issues that only improve presentation
4. cross-cutting dependencies outrank isolated page-level tweaks
5. launch-risk items outrank backlog improvements

When two items look similar, prioritise the item with the larger effect on:

- ability to trade
- customer trust
- fulfilment accuracy
- legal or tax risk
- ability to test safely

## Output Contract

Default to this structure unless the user asked for a different format:

### Remediation Goal

State the business or store outcome the plan is protecting.

### Evidence Base

List the evidence sources used and the main limitations.

### Priority Triage

For each item, include:

- issue
- why it matters
- priority level
- dependency or prerequisite
- recommended action
- validation needed

### Phased Delivery Plan

Use these phases when they help:

- Phase 1: restore or unblock
- Phase 2: launch-critical fixes
- Phase 3: conversion, trust, and operational improvements
- Phase 4: follow-up optimisation

### Risks and Assumptions

Call out anything that remains unverified or depends on business decisions.

### Immediate Next Steps

End with the shortest sensible ordered next actions.

## Style Rules

- stay WooCommerce-first
- keep recommendations evidence-backed and delivery-ready
- prefer short, practical bullets over long narrative sections
- do not overstate live behaviour when the evidence only shows stored settings or partial configuration
- clearly label assumptions, especially when sequencing depends on an unconfirmed business model or launch timeline
- use UK English

## Example

### Input

- checkout page not confirmed in current store flow
- payment gateway settings exist but live transaction behaviour not verified
- shipping zones are partially configured
- tax settings appear legacy and need review
- product categories exist but attribute structure is inconsistent

### Output Shape

**Remediation Goal**
Stabilise the store for reliable launch-readiness validation by restoring the core purchase path and resolving the highest-risk operational gaps first.

**Evidence Base**

- Connected site inspection
- Stored WooCommerce configuration
- Product and shipping configuration review
- Limitation: end-to-end checkout behaviour was not directly validated

**Priority Triage**

- Restore and confirm the checkout path
  - Why it matters: launch readiness cannot be assessed without a working purchase flow
  - Priority: restoration blocker
  - Dependency: core store pages and gateway routing must be confirmed
  - Recommended action: verify assigned WooCommerce pages, checkout accessibility, and checkout path integrity before wider optimisation work
  - Validation needed: manual cart-to-checkout path test
- Review payment configuration against intended trading mode
  - Why it matters: stored settings alone do not confirm live payment readiness
  - Priority: launch-critical fix
  - Dependency: checkout path must first be working and testable
  - Recommended action: confirm intended gateway, mode, callback behaviour, and test process
  - Validation needed: controlled gateway test transaction
- Repair shipping-zone coverage
  - Why it matters: incomplete shipping logic can block fulfilment accuracy and checkout completion
  - Priority: launch-critical fix
  - Dependency: confirm selling regions and fulfilment model
  - Recommended action: align zones, methods, and rate logic to the target delivery model
  - Validation needed: shipping-rate test by region

**Immediate Next Steps**

1. Restore and confirm the checkout path.
2. Validate payment behaviour in a safe test flow.
3. Align shipping-zone logic to selling regions.
4. Review tax posture once the purchase path is testable.
5. Standardise product attributes after launch-blocking issues are cleared.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

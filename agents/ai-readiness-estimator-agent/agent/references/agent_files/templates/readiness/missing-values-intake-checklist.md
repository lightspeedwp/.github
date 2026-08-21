---
version: 1.0.1
title: Missing Values Intake Checklist
audience: internal
document_type: intake-checklist
status: template
language: en-GB
---

# Missing Values Intake Checklist

Use this checklist when an AI-readiness estimate is still blocked by missing information that materially affects package routing, scope confidence, or commercial confidence.

## Core Rule

Only treat an item as blocking if it materially changes:

- the base package choice
- whether the recommendation should remain provisional
- whether add-ons can be considered
- whether the work should move to custom scope
- whether fixed-fee confidence can be treated as commercially dependable

---

## Minimum Blocking Values

Check these first before asking for anything broader:

- [ ] Website URL
- [ ] Platform / CMS
- [ ] Project goal
- [ ] Delivery type
- [ ] Timeline if it materially affects scope
- [ ] Named owner or decision-maker if internal approval is blocked

---

## Technical or Platform Values

Check these when they materially affect package fit or custom-scope risk:

- [ ] WooCommerce or ecommerce status
- [ ] Staging URL, if relevant
- [ ] Key plugins or technical dependencies
- [ ] Major integrations such as CRM, booking, ERP, marketplace, or helpdesk systems
- [ ] Multilingual or multi-brand complexity
- [ ] Replatforming or migration plans

---

## Evidence Quality Checks

Use this section to decide whether the evidence itself is still too weak:

- [ ] Live website not yet reviewed
- [ ] Discovery notes are partial or stale
- [ ] Prior audit or proposal not available
- [ ] Supporting documents are contradictory
- [ ] Claims are present but not evidence-backed
- [ ] Commercial or scope statements appear ahead of the actual evidence

---

## Governance or Risk Values

Check these when they could affect package selection, exclusions, or custom-scope handling:

- [ ] Sensitive or regulated use case
- [ ] Privacy, governance, or approval constraints
- [ ] Restricted data or source-handling constraints
- [ ] Escalation, support, or review obligations not yet understood

---

## Decision Guidance

### If only minor values are missing

- keep the estimate moving
- label the recommendation as provisional where needed
- ask only for the missing blocker values

### If core routing values are missing

- default to an audit-first and provisional recommendation
- do not overstate fixed-fee confidence
- do not recommend add-ons yet

### If the missing values hide likely complexity

- call out the custom-scope risk explicitly
- avoid forcing a standard package path too early

---

## Recommended Prompting Pattern

When asking for missing values, prefer:

- the shortest possible list
- only values that materially affect the recommendation
- plain language
- no long intake questionnaire unless the user explicitly wants one

Example:

> To make this estimate reliable, I still need the website URL, the platform, and whether the immediate goal is audit-only or implementation planning.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

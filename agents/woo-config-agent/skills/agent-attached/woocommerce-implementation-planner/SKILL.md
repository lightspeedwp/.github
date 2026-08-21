---
name: woocommerce-implementation-planner
description: Use when the user wants to turn WooCommerce audit findings, site-discovery outputs, launch-readiness notes, or advisory recommendations into a scoped implementation plan, validation checklist, risk notes, phased delivery steps, or a client- and developer-ready handoff summary, once the relevant project context is known.
---

# WooCommerce Implementation Planner

Use this skill to convert already-grounded WooCommerce findings into an implementation-ready plan.

This skill is for the step after discovery, audit, or advisory work. It should not replace evidence gathering. Start from confirmed findings, clearly labelled assumptions, and the current store goal.

## Use This Skill When

Trigger this skill when the user asks for any of the following:

- an implementation plan based on an audit or advisory pass
- a scoped action plan for WooCommerce fixes or improvements
- delivery phases, task groupings, or workstream sequencing
- validation steps before or after implementation
- risk notes, dependencies, blockers, or rollout cautions
- a developer handoff, QA handoff, or client-ready implementation summary

Common request shapes:

- "Turn this audit into an implementation plan."
- "Create a delivery-ready handoff from these WooCommerce findings."
- "Plan the work needed to implement these recommendations and explain how to validate it."

## Do Not Use This Skill For

Do not use this skill as the primary workflow for:

- unnamed-project planning or remediation requests where the relevant store, client, or project is still unclear; use {{label:woocommerce-project-onboarding,id:hsk_6a49117561f8819197401bf8a7b38be0,type:skill}} first
- initial site discovery with {{label:woocommerce-site-discovery,id:hsk_6a452969b7248191b6c38ef7ff3d3253,type:skill}}
- full WooCommerce audits with {{label:woocommerce-audit-orchestrator,id:hsk_6a461014d1908191a6e1d05416f7e159,type:skill}}
- Gravity Forms-specific planning or validation with {{label:gravity-forms-configuration,id:hsk_6a47abdaf43481918f3867d38b2cf5f2,type:skill}}
- Yoast-specific planning or validation with {{label:yoast-configuration,id:hsk_6a47ab930f388191abd705b96e1795aa,type:skill}}
- unsupported implementation claims when no confirmed evidence exists

If the evidence is weak or stale, say so and produce a constrained plan with explicit assumptions instead of pretending the audit is complete.

## Preflight Gate

Before planning, check whether the request clearly identifies the relevant store, client, or project.

- If project context is missing and there is no saved default available, stop and use {{label:woocommerce-project-onboarding,id:hsk_6a49117561f8819197401bf8a7b38be0,type:skill}} first.
- Do not treat connected-site availability by itself as permission to guess the project context.
- Use connected-site evidence only after project context is provided by the request or recovered from Memory.

## Inputs To Gather

Before planning, identify:

1. the target outcome
2. the confirmed findings or recommendations to work from
3. the store area affected
4. any known environment constraints, blockers, or legacy conditions
5. whether the user needs an internal work plan, a client-facing summary, or both

Preferred evidence sources, in order:

1. current run findings grounded in connected tools or attached files
2. outputs from {{label:woocommerce-site-discovery,id:hsk_6a452969b7248191b6c38ef7ff3d3253,type:skill}} or {{label:woocommerce-audit-orchestrator,id:hsk_6a461014d1908191a6e1d05416f7e159,type:skill}}
3. attached WooCommerce standards and QA references
4. clearly labelled assumptions when the user wants planning before full verification

If the user gives only broad goals after project context is known, derive the strongest useful first-pass plan you can, but separate confirmed requirements from assumptions.

## Planning Workflow

1. Restate the implementation objective in one sentence.
2. Extract only the findings that materially affect delivery scope.
3. Group the work into logical workstreams such as catalogue, checkout, payments, shipping, tax, UX, forms, SEO, accessibility, or launch QA.
4. For each workstream, define the exact change objective, key tasks, dependencies, and success checks.
5. Sequence the work in a sensible delivery order:
   - prerequisites first
   - structural or configuration work next
   - content, UX, and enhancement work after that
   - validation and launch checks last
6. Flag where the plan depends on unverified behaviour, unknown business rules, or unavailable access.
7. Add explicit validation steps for each material area, especially where configuration alone does not prove live behaviour.
8. Add risk notes for anything that could affect trading, trust, data integrity, fulfilment, SEO, accessibility, or launch timing.
9. End with a delivery-ready handoff summary that another team member can action.

## Scope Rules

- Keep the plan WooCommerce-first.
- Treat generic WordPress work as in scope only when it directly affects WooCommerce outcomes.
- Do not expand a narrow request into a full rebuild plan unless the evidence clearly requires it.
- Avoid speculative tasks. If a task exists only because something is unverified, label it as validation or discovery, not confirmed remediation.
- Distinguish between:
  - confirmed implementation work
  - recommended but optional improvements
  - validation-only steps
  - blocked or dependent work

## Output Contract

Use this structure unless the user explicitly asks for a different format:

### Implementation Objective

- one short paragraph describing the business or delivery goal

### Scope Basis

- confirmed inputs used
- assumptions or gaps that affect planning

### Delivery Plan

For each workstream include:

- workstream name
- objective
- tasks
- dependencies or prerequisites
- validation steps
- risks or cautions

### Sequencing Notes

- recommended order of work
- what can run in parallel
- what should wait for validation or approval

### Delivery-Ready Handoff Summary

- concise summary of what the team should do next
- the highest-priority checks after implementation
- blockers, approvals, or missing evidence still needed

## Quality Bar

A strong response should:

- turn findings into actionable implementation work rather than repeating the audit
- stay tightly scoped to the requested outcome
- be explicit about what is confirmed versus assumed
- include validation steps that match the type of change
- include risk notes that are operationally useful, not generic warnings
- produce a handoff summary another delivery teammate can use immediately

## Validation Guidance

Validation steps should be specific to the change type. For example:

- checkout or payment changes: confirm front-end behaviour, order flow, and transactional consequences
- shipping or tax changes: confirm rule behaviour with representative scenarios
- catalogue changes: verify variation logic, merchandising, filters, and product-data consistency
- form changes: validate submissions, notifications, confirmations, and stored entries
- SEO changes: verify rendered metadata, schema output, archive behaviour, and crawl/index controls
- accessibility changes: verify the affected customer path rather than only listing guidelines

Do not let stored settings read like live validation.

## Supporting Files

- {{label:implementation-summary-template.md,id:6a43fb7171408191a7a156f4dbfcee5a,type:file}} — use when the user wants the output shaped like a concise implementation handoff.
- {{label:master-qa-checklist.md,id:6a43bf0456208191a148cb1c19a722fc,type:file}} — use to strengthen cross-store validation coverage when the plan affects multiple areas.
- {{label:pre-launch-qa-checklist.md,id:6a43bf0458fc81918ccb998fa22d5560,type:file}} — use when the implementation work is tied to launch or release readiness.
- {{label:woocommerce-store-standard.md,id:6a43bf045878819189265bbfe9b9e2cb,type:file}} — use as the baseline for target-state WooCommerce expectations.
- `references/implementation-plan-template.md` — use this internal template when the user needs a fuller structured delivery plan rather than a short summary.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

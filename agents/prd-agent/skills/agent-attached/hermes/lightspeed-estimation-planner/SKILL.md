---
name: lightspeed-estimation-planner
description: Use when a LightSpeed project needs a grounded estimate, confidence range, workstream breakdown, delivery phases, risk buffer, or change-impact sizing from a PRD, research brief, task plan, or approved scope update.
---

# LS Estimation Planner

## Purpose

Estimate project effort, confidence, workstreams, delivery phases, dependencies, and risk buffer from the strongest available planning evidence. This skill should produce a transparent estimate, not a fixed commercial quote.

## Shared LightSpeed lifecycle contract

Use the current user request as the highest-priority source. Then use current conversation context, attached files, existing project-state records, existing skill files, references, templates, examples, and memory defaults in that order.

Do not invent team capacity, deadlines, or approved commercial commitments. Mark assumptions explicitly and warn when evidence is weak.

## Request shapes

Use this skill for requests like:

- "Estimate this project from the PRD and current technical notes."
- "What is the likely delivery effort and confidence range for this change?"
- "Break this scope into workstreams and show the risk buffer."

Success means returning a usable estimate summary with confidence, assumptions, exclusions, and the main factors that could materially move the estimate.

## Workflow

1. Read `references/estimation-model.md` first.
2. Read `references/complexity-factors.md` and `references/risk-buffer-rules.md` before sizing.
3. Review `references/source-priority.md` so weak evidence is handled as assumptions instead of confirmed sizing inputs.
4. Pull in the closest relevant profile files from `profiles/` when the project clearly matches them.
5. Separate:
   - estimate basis
   - included scope
   - excluded scope
   - assumptions
   - dependencies
   - risk buffer
6. Use ranges when evidence is incomplete.
7. State confidence as high, medium, or low.
8. Separate discovery, design, development, QA, launch, and post-launch effort where that adds clarity.
9. Use `templates/estimate.md` for standard estimates and `templates/estimate-change-impact.md` for change-driven sizing.

## Output contract

Return:

1. estimate summary
2. confidence level
3. workstream breakdown
4. assumptions
5. exclusions
6. dependencies
7. risk buffer
8. optional phasing
9. decision points
10. recommended next skill

## Boundaries

Do not:

- present estimates as fixed quotes
- invent team capacity or deadlines
- hide assumptions
- estimate from weak evidence without confidence warnings
- override approved commercial pricing
- create implementation tasks unless routed to `lightspeed-delivery-planner`

## Supporting Files

- `references/estimation-model.md` — sizing method and confidence handling.
- `references/complexity-factors.md` — common complexity drivers.
- `references/risk-buffer-rules.md` — how to justify risk buffer.
- `references/source-priority.md` — evidence handling for estimate inputs.
- `references/cross-skill-routing.md` — when to route to review, PRD updates, or delivery planning.
- `profiles/wordpress-block-theme.md` — WordPress block-theme factors.
- `profiles/woocommerce.md` — WooCommerce-specific factors.
- `profiles/publishing.md` — publishing workflow considerations.
- `profiles/tourism.md` — tourism-site considerations.
- `profiles/plugin-product.md` — plugin-product considerations.
- `profiles/ai-readiness.md` — AI-readiness or AI-assisted delivery factors.
- `templates/estimate.md` — standard estimate structure.
- `templates/estimate-change-impact.md` — change-impact structure.
- `schemas/estimate.schema.json` — estimate output shape.
- `schemas/estimate-line-item.schema.json` — line-item shape.
- `examples/estimate-basic.md` — standard estimate example.
- `examples/estimate-high-risk.md` — high-risk example.
- `tests/fixtures/estimate-cases.md` — manual validation cases.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

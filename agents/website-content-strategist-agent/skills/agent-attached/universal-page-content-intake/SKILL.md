---
name: universal-page-content-intake
description: Collect reusable intake for any website page or structured content type, including single pages, sections, newsletters, forms, responder emails, policy pages, chatbot-intake pages, and similar content tasks. Use when missing strategic context would weaken the next specialist workflow.
---

# Universal Page Content Intake

## When to use this skill

Use this skill only when a page or structured content request is missing key context that should be captured once and reused across later related work.

Do not use this skill when the current request already contains enough strategic and page-level context to proceed reliably.

## Memory state

Use Memory to store only durable intake defaults that will matter again for the same related work.

Save:

- content type or page type
- template family
- business goal
- primary audience
- user intent
- page goal or conversion role
- CTA destination or routing model
- approval or legal review sensitivity when it is confirmed
- FAQ themes that recur across the project
- stats or proof sensitivity when it is confirmed
- form routing or responder style when it is confirmed
- chatbot intake flow purpose and escalation model when it is confirmed

Do not save:

- raw source copy
- temporary draft variants
- one-off brainstorming notes
- unapproved claims
- unsupported stats
- private personal data collected through a form unless it is explicitly appropriate to retain

Use a compact Memory state file such as `page-content-intake.yaml` for reusable intake defaults.

## Workflow

1. Identify the requested content scope: full page, single section, form flow, newsletter, responder email, policy page, intake page, or another structured content asset.
2. Read the matching intake fields from `references/max-intake-fields.md`.
3. Capture only the missing fields needed to proceed reliably.
4. Prefer one concise question at a time.
5. If the request is for a website page, account for:
   - page purpose
   - audience and intent
   - CTA route
   - conversion role
   - FAQ need
   - stats or proof need
6. If the page clearly needs real visitor-question handling, hand off to FAQ intake before final drafting.
7. If the page clearly depends on quantified proof or trust numbers, hand off to stats intake before final drafting.
8. Persist only durable defaults that should be reused for later related work.
9. Once the minimum required intake is present, hand off immediately to the next specialist workflow.

## Output

Confirm only the intake values that matter for the current task, then continue or hand off.

## Supporting Files

- `references/max-intake-fields.md` — maximum field set and value options for page and content intake.
- `references/routing-handoff-rules.md` — how to hand off to the next specialist workflow after intake.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

# Skill Routing Guide

Use this file to choose the best attached skill for the current task.

This file is for skill selection and handoffs. Use `docs/app-usage-guide.md` for source, app, and permission routing.

## Attached skills

### proposal-intake

Use `proposal-intake` when the task begins with a new RFP, questionnaire, proposal brief, security questionnaire, procurement form, or diligence request and the first job is to understand the request.

Best fit:

- analyse a newly supplied artefact
- extract submission requirements, deadlines, deliverables, sections, blockers, and risks
- produce a concise intake handoff before drafting
- classify what is grounded, missing, high risk, or review-sensitive

Do not use it as the default drafting skill once intake is clear.

### rfp-response

Use `rfp-response` when intake is clear enough and the task is to draft or assemble response artefacts.

Best fit:

- draft first-pass proposal content
- assemble response packs
- structure section-by-section answers
- turn grounded intake and evidence into review-ready outputs

Prefer this after `proposal-intake` when the user wants draft content rather than only an intake summary.

### evidence-claims-check

Use `evidence-claims-check` when the task is about support quality rather than drafting speed.

Best fit:

- gather proof points
- verify proposal statements against evidence
- classify support strength
- flag stale, weak, unsupported, or risky claims
- compare candidate wording against available evidence

Use it before or alongside drafting when claim quality is the main concern.

### proposal-defaults-onboarding

Use `proposal-defaults-onboarding` only when the task depends on missing reusable user defaults that should be remembered for future runs.

Best fit:

- missing evidence-lookup defaults
- missing output-routing defaults
- missing intake-handling defaults
- small reusable preference capture before resuming the original task

Do not use it for one-off facts that belong in the current request.

### markdown-format-validator

Use `markdown-format-validator` near the end of substantial Markdown deliverables.

Best fit:

- validate a substantial Markdown document before finalising it
- repair heading structure, spacing, dividers, or wrapper quality
- standardise a Markdown deliverable against the agent's formatting rules
- check file-link handoff text around a Markdown output

Do not use it as the main drafting skill.

### wordpress-plugin-packaging-review

Use `wordpress-plugin-packaging-review` when plugin assessment is the primary job.

Best fit:

- plugin packaging reviews
- plugin due diligence
- tiering and upsell analysis
- delivery-risk and governance review
- evaluating plugin fit for agency, MSP, ecommerce, AI, chatbot, automation, or commercial delivery use cases

Do not use it for general proposal drafting.

## Routing priorities

- Choose the skill that best matches the user's primary requested outcome.
- If the task starts with a new artefact, use `proposal-intake` first.
- If the task is mainly about evidence quality, use `evidence-claims-check` before `rfp-response`.
- If the task is mainly a final Markdown quality pass, use `markdown-format-validator` at the end.
- If plugin evaluation is the core job, prefer `wordpress-plugin-packaging-review` over the proposal workflow skills.
- Use `proposal-defaults-onboarding` only when missing reusable defaults would otherwise block good execution.

## Common handoffs

- `proposal-intake` -> `rfp-response` when the request is understood and drafting should begin
- `proposal-intake` -> `evidence-claims-check` when support quality must be established before drafting
- `evidence-claims-check` -> `rfp-response` when evidence has been gathered and the next job is drafting
- `rfp-response` -> `markdown-format-validator` when a substantial Markdown artefact is nearly final
- `proposal-defaults-onboarding` -> resume original task as soon as the minimum reusable defaults are captured

If more than one skill seems relevant, choose the one that best matches the primary outcome and add a second skill only when it clearly improves the result.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

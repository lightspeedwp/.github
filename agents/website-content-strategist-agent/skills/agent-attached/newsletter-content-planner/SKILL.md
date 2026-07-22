---
name: newsletter-content-planner
description: Draft newsletter content for campaigns, updates, launches, education sequences, and one-off sends. Use when a user needs newsletter planning, subject lines, preview text, body copy, section structure, CTA options, or campaign variants.
---

# Newsletter Content Planner

## When to use this skill

Use this skill for newsletter strategy and copy, whether the deliverable is a one-off email, a recurring newsletter, or a small email content block.

Do not treat newsletter planning as copy-only work when audience, CTA logic, offer framing, or funnel role is still unclear.

If those strategic inputs are weak, this workflow should pause, ask focused intake questions, present compact options, and define working defaults before drafting.

## Core rule

Do not jump straight from a vague request to full newsletter copy.

Before drafting, make sure there is enough clarity on:

- audience
- campaign role in the wider journey
- primary conversion action
- fallback action if the reader is not ready yet
- offer framing or value angle
- main friction or hesitation

Use smart defaults to reduce friction, but do not silently decide critical campaign strategy on the user's behalf.

## Guided intake workflow

1. Identify the newsletter type: announcement, educational, sales, nurture, event, launch, digest, or follow-up.
2. Check whether the strategic baseline is already clear enough:
   - audience
   - campaign goal
   - primary CTA
   - fallback action
   - main friction or hesitation
   - voice or tone direction if materially relevant
3. If any of those are unclear, present compact option sets instead of open-ended questions where possible.
4. Recommend the strongest working default based on the project context, but clearly mark it as a working default until confirmed.
5. Choose the smallest useful structure: single email, campaign outline, or content block.
6. Draft subject lines, preview text, body sections, CTA, and optional segmentation notes.
7. Keep tone and CTA aligned with the audience, campaign stage, and overall site objective.

## Smart defaults and option-led guidance

When the user is unsure, present 2 to 5 concise options from `references/newsletter-options.md` and recommend the closest working default.

Useful option groups include:

- newsletter type
- campaign role in journey
- primary CTA
- fallback CTA
- friction type
- offer angle

Use `references/newsletter-scenario-defaults.md` for common starting points by scenario.

When recommending a default, use explicit language such as:

- `Working default for now`
- `Needs confirmation before final send logic`
- `Safe fallback if no stronger answer is available yet`

Use these exact labels in the workflow when they help the user make decisions:

- `Confirmed context`
- `Missing strategic inputs`
- `Compact options`
- `Working defaults for now`
- `Must confirm now`
- `Save to Memory if confirmed`

## Must-confirm vs safe defaults

Treat these as **must confirm now** if they would materially change the email:

- primary audience
- primary CTA
- campaign objective
- whether the email is nurture, sales, launch, or follow-up

Treat these as **safe working defaults for now** when no better answer exists:

- a lower-friction fallback action
- a cautious trust-building angle
- one reasonable segmentation assumption
- one moderate tone direction

## Memory use

When newsletter defaults are confirmed and likely to recur, store only reusable project-level values such as:

- audience segment
- campaign type
- primary CTA model
- fallback CTA model
- recurring friction themes
- recurring tone guidance

Do not store one-off subject lines, preview text, or temporary campaign hooks as durable Memory.

## Decision framing

When intake is incomplete, present unresolved items in this order:

1. **Confirmed context** — what is already clear enough to guide planning
2. **Missing strategic inputs** — only the missing answers that materially change the campaign
3. **Compact options** — concise choices for unresolved decisions
4. **Working defaults for now** — safe defaults that let the workflow move forward without pretending they are final
5. **Must confirm now** — decisions that materially change the CTA logic, campaign role, audience fit, or send strategy
6. **Save to Memory if confirmed** — reusable newsletter defaults that should persist across related work once accepted

For `Save to Memory if confirmed`, prioritise:

- campaign type
- audience segment
- primary CTA model
- fallback CTA model
- recurring friction theme
- recurring tone guidance

## Completion threshold

Do not treat newsletter intake as complete until you have enough to define:

- audience
- campaign objective
- primary CTA
- fallback action
- the role of this email in the wider journey

If those are unclear, ask another focused question or present another compact option set before drafting.

## Output

When intake was incomplete at the start, use this output order:

1. `Confirmed context`
2. `Missing strategic inputs`
3. `Compact options`
4. `Working defaults for now`
5. `Must confirm now`
6. `Newsletter plan` or deliverable
7. `Save to Memory if confirmed`
8. `Best next step`

When intake was already strong enough, you may shorten the response, but still explicitly label any working defaults that are not yet confirmed.

Return:

- Missing strategic inputs
- Working defaults
- Campaign objective
- Audience
- Subject line options
- Preview text options
- Email structure
- Draft email body
- CTA options
- Optional follow-up variant or A/B test note

## Supporting Files

- `references/newsletter-types.md`
- `references/newsletter-template.md`
- `references/newsletter-options.md`
- `references/newsletter-scenario-defaults.md`

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

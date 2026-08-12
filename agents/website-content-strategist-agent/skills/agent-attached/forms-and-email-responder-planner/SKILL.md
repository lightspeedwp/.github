---
name: forms-and-email-responder-planner
description: Define form structure, input fields, validation rules, admin notification emails, and user autoresponder emails. Use when a user needs a website form, newsletter signup flow, lead form, enquiry flow, or responder-email content.
---

# Forms and Email Responder Planner

## When to use this skill

Use this skill when the user needs a form specification and the follow-up email behaviour around it.

Do not treat this as field-list work only. If the submission goal, routing model, qualification logic, or response expectations are unclear, this workflow should do strategic intake first.

## Core rule

Do not jump from a vague form request to a final field set.

Before defining the form, make sure there is enough clarity on:

- form purpose
- submission outcome
- who the form is for
- what counts as a qualified or useful submission
- where the submission should route
- what the user should expect next

Use smart defaults to reduce friction, but do not silently decide the final business logic on the user's behalf.

## Guided intake workflow

1. Identify the form type and the submission goal.
2. Check whether the strategic baseline is already clear enough:
   - audience
   - submission outcome
   - qualification threshold
   - routing destination
   - admin owner
   - user expectation after submission
3. If any of those are unclear, present compact option sets instead of broad open-ended questioning where possible.
4. Recommend the strongest working default based on the project context, but clearly mark it as a working default until confirmed.
5. Define the minimum useful input set.
6. Separate required fields from optional fields.
7. Note validation rules, field dependencies, and friction-reduction choices.
8. Draft the admin notification email.
9. Draft the user autoresponder email.
10. Flag integration, privacy, routing, or response assumptions that still need confirmation.

Use this deterministic sequence whenever intake is incomplete:

1. state the confirmed context already known
2. list only the missing inputs that materially change the workflow
3. present compact options for the unresolved decisions
4. recommend one `Working default for now` for each unresolved decision
5. state the `Must confirm now` items before implementation
6. state the `Save to Memory if confirmed` items that should persist across related work
7. only then present the final workflow and deliverables

## Form types

- contact or enquiry form
- consultation booking request form
- lead magnet download form
- newsletter signup form
- support request form
- application or intake form
- event registration form

## Smart defaults and option-led guidance

When the user is unsure, present 2 to 5 concise options from `references/form-intake-options.md` and recommend the closest working default.

Useful option groups include:

- form purpose
- submission routing model
- qualification model
- fallback path for poor-fit or unclear submissions
- response expectation style
- friction level

Use `references/form-scenario-defaults.md` for common starting points by scenario.

When recommending a default, use explicit language such as:

- `Working default for now`
- `Needs confirmation before implementation`
- `Low-friction fallback if no stronger answer is available yet`

## Must-confirm vs safe defaults

Treat these as **must confirm now** if they materially change the form:

- form purpose
- routing destination
- qualification model
- primary response expectation
- privacy or consent requirement

Treat these as **safe working defaults for now** when no better answer exists:

- omit phone number on first contact
- use a short free-text outcomes field instead of a long discovery field
- use manual review before booking when fit is unclear
- include a fallback route for poor-fit or uncertain submissions

Use these exact labels in the workflow when they help the user make decisions:

- `Must confirm now`
- `Working default for now`
- `Save to Memory if confirmed`

## Memory use

When form and responder defaults are confirmed and likely to recur, store only reusable project-level values such as:

- form purpose
- routing model
- qualification rules
- responder style
- response expectation wording
- fallback path model

Do not store one-off submission examples, temporary subject lines, or transient routing notes as durable Memory.

## Decision framing

When intake is incomplete, present unresolved items in this order:

1. **Must confirm now** — decisions that materially change the form purpose, routing, qualification logic, privacy handling, or promised next step
2. **Working defaults for now** — safe temporary defaults that let the workflow move forward without pretending they are final
3. **Save to Memory if confirmed** — reusable defaults that should persist across future related form or responder work once the user accepts them

For `Save to Memory if confirmed`, prioritise:

- form purpose
- routing model
- qualification threshold
- responder style
- response expectation wording
- fallback path model

## Completion threshold

Do not treat form intake as complete until you have enough to define:

- form purpose
- submission outcome
- routing destination
- minimum qualification logic
- user expectation after submission

If those are unclear, ask another focused question or present another compact option set before finalising the form logic.

## Output

When intake was incomplete at the start, use this output order:

1. `Confirmed context`
2. `Missing intake`
3. `Compact options`
4. `Working defaults for now`
5. `Must confirm now`
6. `Save to Memory if confirmed`
7. final workflow and deliverables

When intake was already strong enough, you may shorten the response, but still explicitly label any working defaults that are not yet confirmed.

Return:

- Missing strategic inputs
- Working defaults
- Form purpose
- Field structure table
- Validation rules
- Submission states
- Admin notification email
- User autoresponder email
- Recommended next step

## Supporting Files

- `references/form-field-patterns.md`
- `references/form-output-template.md`
- `references/form-intake-options.md`
- `references/form-scenario-defaults.md`

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

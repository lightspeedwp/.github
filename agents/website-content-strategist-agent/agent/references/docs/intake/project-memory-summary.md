# Project memory summary

## Purpose

This file is the current-state human-readable summary format for reusable project context that is safe to carry forward beyond the current run.

Use it after intake, routing, review, claim handling, approval, or handoff work when the workflow has identified project details that are:

- confirmed
- stable enough to help future related work
- safe to reuse
- worth keeping separate from temporary working assumptions

This summary is not the place for rough notes, questionnaire defaults, unsupported claims, or provisional routing guesses.

---

## Core rules

- Only include context that is actually reusable across future related work.
- Do not mix confirmed reusable context with temporary current-run assumptions.
- Do not save questionnaire-derived values here unless they were later confirmed by the user or by an approved source.
- Do not store unsupported claims, unresolved proof, or risky defaults here.
- Keep the summary compact, operational, and easy for later workflows to scan.
- If approval or scope limits apply, state them directly.

---

## What belongs here

Good candidates for the project memory summary include:

- confirmed project or task type
- confirmed project scope
- confirmed primary goal
- confirmed audience
- confirmed offer, service, or product framing
- confirmed conversion direction
- confirmed approved sources or source-of-truth references
- confirmed exclusions or must-not-do rules
- confirmed approval owner or review route when stable
- confirmed reusable voice and tone defaults
- confirmed reusable technical or integration constraints
- confirmed launch or handoff requirements when they persist across future related work

---

## What does not belong here

Do not include:

- inferred or defaulted questionnaire answers
- temporary routing decisions
- one-off drafting choices that are unlikely to matter later
- unsupported or pending-review claims
- source references that are not approved for reuse
- unresolved blockers that belong only to the active run
- private review notes that are not reusable project context
- temporary CTA experiments unless they became a confirmed standing default

---

## Summary structure

Every project memory summary should separate four kinds of information:

1. confirmed reusable context
2. approved source anchors
3. durable boundaries and exclusions
4. explicit non-memory notes for anything still provisional

---

## Recommended Markdown template

```md
# Project memory summary

## Confirmed reusable context

- Project type: <confirmed value>
- Scope: <confirmed value>
- Primary goal: <confirmed value>
- Audience: <confirmed value>
- Offer or service focus: <confirmed value>
- Conversion direction: <confirmed value>
- Voice and tone defaults: <confirmed value>
- Technical or integration constraints: <confirmed value>

---

## Approved source anchors

- <approved source label> — <what it is safe to use for>
- <approved source label> — <what it is safe to use for>

---

## Durable boundaries and exclusions

- <confirmed must-not-do rule>
- <confirmed scope boundary>
- <confirmed approval limit>

---

## Reuse notes

- <how later workflows should apply this context>
- <what still requires fresh confirmation each time>

---

## Do not save yet

- <provisional item>
- <pending-review item>
- <unsupported claim or default>

---
```

---

## Required sections

### 1. Confirmed reusable context

Include only values that are:

- confirmed
- stable
- useful across future related requests

Typical fields:

- project type
- scope
- primary goal
- audience
- offer or service framing
- conversion direction
- reusable tone defaults
- reusable technical constraints

### 2. Approved source anchors

List the sources that later workflows may safely rely on.

For each source, briefly state:

- what it is
- what it is safe to use for
- whether any limits still apply

Keep this short. The source approval register holds the deeper record.

### 3. Durable boundaries and exclusions

List confirmed boundaries that later work should preserve.

Examples:

- do not use unsupported proof claims
- do not widen scope beyond the approved page family
- do not imply legal certainty without review
- use only approved source documents for public facts

### 4. Reuse notes

Explain how future workflows should apply the stored context.

Examples:

- use this audience and goal pairing as the default for future service-page drafting in this project
- reuse this tone system for newsletters and forms unless a campaign-specific brief overrides it
- treat these approved sources as the default source-of-truth set for future page planning

### 5. Do not save yet

This section keeps the Memory boundary explicit.

Include items that were visible during the run but are not safe for durable reuse, such as:

- provisional CTA choices
- inferred brand tone
- pending claim approvals
- unapproved source interpretations
- unresolved blockers that still need review

---

## Memory decision rules

### Save into confirmed reusable project memory when

- the value is confirmed
- the value has clear future-use benefit
- the value is stable enough to reuse
- the value does not depend on unresolved review

### Keep out of confirmed reusable project memory when

- the value is inferred or defaulted only
- the value is claim-sensitive and unresolved
- the value comes only from a questionnaire or public source without confirmation
- the value is likely to change from one downstream task to the next

### Use the summary as a bridge when

- the current workflow needs a human-readable carry-forward layer
- the next workflow needs context without rereading the whole intake pack
- the stored Memory values should stay explainable and auditable

---

## Example summary

# Project memory summary

## Confirmed reusable context

- Project type: brochure website
- Scope: core service pages plus trust and contact flows
- Primary goal: generate qualified consultation enquiries
- Audience: operations leaders at growing service businesses
- Offer or service focus: strategy-led website design and delivery
- Conversion direction: consultation-first primary CTA with lower-friction educational secondary routes
- Voice and tone defaults: clear, expert, and restrained; avoid hype-heavy language
- Technical or integration constraints: WordPress block-theme delivery with pattern-first implementation

---

## Approved source anchors

- Strategy brief v3 — safe for goals, audience direction, offer framing, and messaging priorities
- Approved sitemap — safe for page scope, page family structure, and navigation intent

---

## Durable boundaries and exclusions

- Do not use unsupported ranking, guarantee, or quantified proof claims
- Do not treat questionnaire defaults as confirmed project truth
- Do not imply legal or compliance certainty without review where relevant

---

## Reuse notes

- Use this audience, goal, and tone combination as the default for future service-page and About-page planning in this project.
- Recheck CTA wording when a page has a more specific funnel role.
- Keep proof-sensitive sections under claim review when new evidence appears.

---

## Do not save yet

- Two visible trust claims still pending review
- Secondary CTA wording still provisional
- Public homepage copy used for orientation only, not as approved truth

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

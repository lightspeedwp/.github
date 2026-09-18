---
name: ticket-triage
description: Use the ticket-triage skill when you need to quickly classify and prioritize support tickets from various sources like Zendesk or Gmail. This skill streamlines the triage process by converting issues into a standard format, assessing severity, and recommending the appropriate team, helping you efficiently manage customer inquiries and resolve them effectively.
---

# Ticket Triage

> If placeholders such as `[[example_placeholder]]` are still unresolved, use
> the shared agent file `CONNECTORS.md` to map them to the connected tools for
> this agent.

Use this skill for first-pass support triage.

## What This Skill Does

- accepts ticket context from {{label:Zendesk MCP Server,id:asdk_app_69f8a7e1dbb881919b56c4b21f3a3fa1,type:app}}, `[[crm]]`, {{label:Gmail,id:connector_2128aebfecb84f64a069897515042a44,type:app}}, or pasted issue summary
- normalizes the issue into a connector-neutral shape before reasoning
- classifies the issue and assigns severity conservatively
- recommends the next owner or team type
- assesses duplicate and repeat-issue risk when evidence exists
- can produce a concise downstream handoff when requested

## Workflow

1. Determine the input mode.
   - Prefer {{label:Zendesk MCP Server,id:asdk_app_69f8a7e1dbb881919b56c4b21f3a3fa1,type:app}} when available.
   - If no connector is available, use pasted ticket text, screenshots, or an {{label:Gmail,id:connector_2128aebfecb84f64a069897515042a44,type:app}} thread.
2. Gather enough context to triage safely.
   - Capture the customer-reported issue, current status, recent timeline, and any visible owner, queue, or account context.
   - If key context is missing, ask for only the minimum blocking detail.
3. Normalize the case before reasoning.
   - Use a connector-neutral shape such as:
     - issue summary
     - current status
     - visible severity
     - owner or team
     - latest customer ask
     - known account or business impact
4. Classify and prioritize.
   - Identify the issue type.
   - Recommend severity conservatively.
   - Recommend priority separately from severity.
   - Suggest the next owner or team category rather than inventing a named queue.
5. Assess linkage risk.
   - Separate `duplicate risk` from `related issue` risk.
   - Repeated customer pain or a likely parent incident is not automatically a duplicate.
6. Produce the triage result.
   - Return one best recommendation unless confidence is low.
   - Only generate a formal handoff brief when the user explicitly asks for it.

## Intake Dimensions

Before classifying the issue, explicitly read for:

- failure mode
  - broken behavior, confusing behavior, missing capability, policy question, billing problem, or access problem
- scope
  - single user, small team, major account, or broad customer pattern
- urgency signal
  - blocked workflow, deadline pressure, outage language, executive pressure, or SLA risk
- customer state
  - calm, frustrated, repeated follow-up, or overt escalation
- evidence quality
  - direct symptoms and timestamps versus vague summaries or secondhand notes

If one of these dimensions is missing, call it out in `Unknowns` instead of guessing.

## Issue Classification Framework

Use one primary issue type and one optional secondary issue type.

Primary issue types:

- `Bug`
  - Something that should work is failing, regressing, or behaving unexpectedly.
- `How-to / Configuration`
  - The customer likely needs setup, guidance, or clarification rather than a product fix.
- `Feature request`
  - The customer wants a capability that is absent or intentionally limited.
- `Billing / Contract`
  - Payment, invoice, subscription, credit, or entitlement questions.
- `Account / Access`
  - Login, permissions, SSO, identity, or user-management issues.
- `Integration / API`
  - Webhooks, third-party systems, API behavior, auth flows, or developer integrations.
- `Security / Privacy / Compliance`
  - Unauthorized access, data handling, vulnerability, legal, or trust questions.
- `Data / Import / Export`
  - Missing data, incorrect data, migrations, imports, exports, or sync quality.
- `Performance / Reliability`
  - Slowness, intermittent failure, timeouts, degraded availability, or scale limits.

Use the root cause driver, not the surface wording, whenever the distinction is clear. For example, an SSO callback failure caused by a regression is still primarily a `Bug`, even though it affects account access.

## Severity and Priority Guidance

Keep severity and priority separate.

- `Severity` answers: how bad is the underlying issue if the report is true?
- `Recommended priority` answers: how quickly should the team act next?

### Severity

- `Critical`
  - Product or core workflow unavailable for many users, severe data integrity risk, security exposure, or no viable workaround for a major outage.
- `High`
  - Major workflow broken for an important customer or team, substantial business impact, or a severe issue with weak or no workaround.
- `Medium`
  - Real issue with contained scope, partial workaround, or moderate business impact.
- `Low`
  - Limited inconvenience, cosmetic issue, routine request, or clearly minor impact.
- `Unknown`
  - Evidence is too thin or contradictory to score safely.

### Recommended Priority

- `Urgent`
  - Active outage, security concern, hard deadline, executive escalation, or repeated same-day pattern.
- `High`
  - Meaningful customer pain or blocking issue that should move quickly even if it is not a full emergency.
- `Normal`
  - Needs action and ownership, but not immediate interruption.
- `Low`
  - Can proceed in normal queue flow without time pressure.
- `Unknown`
  - Insufficient evidence to set a response pace responsibly.

Automatic priority-up signals:

- multiple independent reports with the same failure signature
- the issue is worsening or the workaround stopped working
- the customer has already waited beyond a promised follow-up window
- the issue affects a launch, renewal, executive review, or contractual milestone

## Routing Guidance

Recommend an owner or team category based on what is needed next.

- `Frontline support`
  - Best for straightforward how-to, known workaround, simple billing, or documented configuration issues.
- `Senior / technical support`
  - Best for deeper troubleshooting, ambiguous bugs, integration debugging, or cases that need synthesis across multiple sources.
- `Engineering`
  - Best for confirmed product defects, infrastructure behavior, scaling issues, broken integrations that require code or systems work, or severe reliability questions.
- `Product`
  - Best for feature gaps, policy decisions, workflow mismatches, or customer asks that require prioritization rather than troubleshooting.
- `Security / compliance`
  - Best for privacy, trust, vulnerability, data exposure, or formal compliance reviews.
- `Billing / finance / operations`
  - Best for credits, invoices, contract interpretation, refunds, or account administration questions.

Prefer the next resolver, not merely the current owner.

## Duplicate and Pattern Review

Check for four different linkage modes:

- same customer, same symptoms, same unresolved thread
- same product area and same failure signature across different customers
- same account with multiple tickets that should probably be merged or linked
- known issue or tracked bug that changes the best next step

Use these labels carefully:

- `duplicate risk`
  - There is a meaningful chance this should be merged into or linked as the same underlying issue.
- `related issue`
  - The issue seems adjacent but not identical.
- `pattern / emerging incident risk`
  - Similar reports suggest a broader reliability problem even if no exact duplicate exists.

Lack of evidence is not proof of low duplicate risk.

## Quality Checks Before Returning

Before finalizing triage, verify:

- the recommendation matches the strongest evidence rather than the loudest wording
- severity and priority are not accidentally being used as synonyms
- the routing recommendation names a resolver category, not a vague placeholder
- `Unknowns` contains any missing context that would materially change the next move
- the summary distinguishes observed facts from interpretation

## Suggested Next Steps

When the triage is complete, suggest follow-on work only if it is genuinely useful. Good next-step prompts include:

- `draft-response`
  - when the user likely needs a customer-facing reply next
- `customer-escalation`
  - when the issue needs cross-functional attention beyond normal support
- `customer-research`
  - when the current ticket needs broader customer or account context before the next action
- deeper duplicate or known-issue checking
  - when the case looks like part of a broader pattern but the evidence is still incomplete

## Language

For non-English user requests or source material, preserve the output structure and field meanings, but localize user-facing headings and wording unless the user asks for English or exact literal terms must be preserved.

## Output Shape

Use this compact structure by default:

```md
## Triage

**Issue type:** <type>
**Severity:** <Critical | High | Medium | Low | Unknown>
**Recommended priority:** <Urgent | High | Normal | Low | Unknown>
**Recommended owner/team:** <team category or role>
**Duplicate risk:** <High | Medium | Low | Not completed>

### Summary
<2-4 sentence triage summary>

### Evidence
- <fact>
- <fact>

### Unknowns
- <missing field or ambiguity>

### Recommended next step
- <best next move>
```

## Non-Guessing Rules

- Do not invent business impact, account tier, ETA, or ownership.
- Do not convert missing duplicate work into `low duplicate risk`.
- Keep confirmed evidence separate from interpretation.
- If the source uses generic phrases like `specialist team`, prefer the most concrete owner or routing evidence available.
- If there is not enough evidence to assign severity confidently, say so and explain what is missing.
- Do not ask the user to restate details that are already present in the ticket, email, or pasted source material.

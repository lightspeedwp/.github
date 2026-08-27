---
name: website-package-routing
description: Use when the current phase is routing and the agent has enough website evidence or intake detail to choose the best-fit base package, evaluate only the applicable add-ons, check commercial thresholds and custom-scope triggers, and produce a concise routing handoff with the shared phase language.
---

# Website Package Routing

## Purpose

Use this skill after evidence gathering and project intake, but before final estimate drafting or quote-readiness review.

This skill turns confirmed project facts into a routing decision that is safe to draft from. It must:

1. select the best-fit base package
2. evaluate only the add-ons that are relevant to that selected package
3. check commercial and custom-scope triggers before treating the route as fixed-fee safe
4. produce a concise routing handoff that the main estimate workflow can turn into downstream estimate work

## When To Use

Use this skill when one or more of the following are true:

- the user asks for a recommended website package
- the user asks which add-ons apply to a scoped website project
- the agent has already gathered evidence or intake details and now needs to route the job
- the agent needs to decide whether the project still fits a standard package or must move to Custom Website Solution
- the agent needs an estimate-ready internal summary before drafting the estimate itself

Do not use this skill for first-pass evidence gathering, reusable user onboarding, or final quote-readiness validation.

## Required Inputs

Before using this skill, gather as many of these as possible from the live website, uploaded references, connected apps, and prior confirmed context:

- website type and business model
- current platform or implementation signals
- project goal and delivery intent
- page and template complexity signals
- ecommerce, booking, multilingual, migration, portal, membership, or integration signals
- any confirmed constraints that affect fixed-fee eligibility

If critical routing values are still missing, do not guess. Route as far as the evidence safely allows and list the missing values that block confidence.

## File Authority

Use the installed agent files as the authority. Follow this order while routing:

1. `/packages/assessment-values.md`
2. `/packages/package-index.md`
3. the selected package file in `/packages`
4. `/package-addons/addon-index.md`
5. the relevant add-on files in `/package-addons`
6. `/commercial-rules/pricing-rules.md`
7. `/commercial-rules/package-thresholds.md`
8. `/commercial-rules/addon-rules.md`
9. `/commercial-rules/custom-scope-triggers.md`
10. `/commercial-rules/approval-rules.md`
11. `/templates/package-cover-sheet-template.md` only when a package-summary structure is needed

If any other instruction conflicts with those files, follow the installed files.

## Workflow

### 1. Confirm routing readiness

First separate inputs into three buckets:

- confirmed facts
- assumptions
- still-missing values

Only use confirmed facts to make high-risk routing decisions. Keep assumptions visible as caveats, not as settled scope.

### 2. Select the base package

Read `/packages/package-index.md` and compare the confirmed facts against the candidate package families.

Then read the single most likely package file, or more than one only when the route is genuinely ambiguous.

For the chosen package, explicitly check:

- use-when fit
- included scope
- excluded scope
- values that still must be gathered
- fixed-fee eligibility rules
- custom-scope triggers already named in the package spec

If the confirmed facts do not responsibly fit a standard package, or if a named disqualifier is present, route to `Custom Website Solution`.

### 3. Evaluate add-ons only after package selection

Read `/package-addons/addon-index.md` only after the base package is selected.

For each candidate add-on:

- confirm it is compatible with the selected base package
- read the specific add-on file before recommending it
- include it only when the confirmed project facts support it
- state the short reason it applies

Do not use add-ons to compensate for a weak or unresolved base package decision.

### 4. Check commercial treatment

Before producing the handoff, read the commercial rules and determine whether the current route is:

- fixed-fee safe
- provisional pending more values
- escalated to custom scope
- subject to internal approval

Explicitly check for:

- threshold overruns
- pricing or scoping conditions that invalidate a standard package assumption
- add-ons that materially change commercial treatment
- custom-scope triggers such as multilingual complexity, heavy integrations, large migrations, memberships, portals, nonstandard checkout or booking, headless architecture, or unstable legacy conditions when the installed files define them as triggers

If any commercial rule blocks confidence, say so plainly and downgrade the route from final to provisional or custom scope as required.

### 5. Produce the routing handoff

Create a concise routing handoff that downstream estimate work can trust.

The handoff must contain these sections in this order:

1. `Assessment Snapshot`
2. `Selected Base Package`
3. `Recommended Add-ons`
4. `Commercial Status`
5. `Current Phase`
6. `Route Decision`
7. `Missing Material Inputs`
8. `Next Handoff`

## Section Requirements

### Assessment Snapshot

Summarize only the routing-relevant confirmed facts and clearly separate any assumptions.

### Selected Base Package

Name the selected package exactly as installed. If the route must move to custom scope, say `Custom Website Solution` plainly.

### Recommended Add-ons

List only the add-ons that are actually supported by the add-on index and their specific files. Give one brief applicability reason for each. If none apply, say `None currently recommended`.

### Commercial Status

State one of:

- `Fixed-fee eligible`
- `Provisional pending confirmation`
- `Escalate to custom scope`
- `Internal approval required`

If more than one applies, list the primary status first and explain the dependency briefly.

### Current Phase

State `Routing`.

### Route Decision

State the selected package or custom-scope route and why. Keep this short and evidence-tied.

Mention major exclusions, threshold risk, or custom-scope triggers only when they materially affect the route.

### Missing Material Inputs

List only the missing or unconfirmed values that still materially affect package fit, add-on fit, pricing, thresholds, approvals, or commercial confidence.

### Next Handoff

State the next step that logically follows the routing work just completed:

- move to draft estimate when the route is sufficient to draft from
- move to custom-scope clarification when the route cannot safely stay in a standard package
- move to readiness review only when the user is validating an already drafted deliverable

Do not send the workflow backward unless new evidence or corrections actually require it.

## Hard Rules

- Never recommend add-ons before a base package is selected.
- Never hide missing routing values behind confident language.
- Never treat a provisional route as final.
- Never soften package exclusions or commercial disqualifiers.
- Never invent a package, add-on, or commercial rule that is not supported by the installed files.
- Prefer a conservative route when the available evidence does not support confidence.
- Keep routing output light. Do not exhaustively restate package inclusions or exclusions unless they materially affect the current route.

## Output Example

### Example request

`Use $website-package-routing to decide the package and add-ons for this WordPress rebuild based on the audit findings and intake notes.`

### Example output shape

```md
Assessment Snapshot
- Confirmed: Marketing site on WordPress with ~12 core pages, blog, and light CRM form integration.
- Confirmed: Rebuild intent is improved performance, cleaner CMS editing, and refreshed templates.
- Assumption: Migration volume may exceed the standard package threshold.

Selected Base Package
- WordPress Foundations Package

Recommended Add-ons
- Content Migration Add-on — current site appears to contain enough legacy content that migration handling should be scoped explicitly.
- Performance Optimisation Add-on — performance improvement is a stated project goal.

Commercial Status
- Provisional pending confirmation — migration volume still needs confirmation before fixed-fee handling is treated as safe.

Current Phase
- Routing

Route Decision
- Route to WordPress Foundations Package provisionally. The confirmed site type and platform direction fit the package, but migration volume still affects fixed-fee confidence.

Missing Material Inputs
- Confirm migration volume
- Confirm whether multilingual rollout is in scope

Next Handoff
- Draft the estimate provisionally from WordPress Foundations Package, preserving the add-ons and commercial caveat above.
```

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

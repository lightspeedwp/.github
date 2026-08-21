---
name: quote-readiness
description: Use when the agent is about to present an estimate or proposal as final, when the user asks whether a quote is ready, or when package selection, add-ons, commercial checks, missing values, or template compliance need a final validation pass before client-facing output.
---

# Quote Readiness

## Purpose

Run this skill immediately before treating any estimate or proposal as final.

Use it to verify that:

- the selected base package is supported by the gathered evidence
- recommended add-ons are valid for that package and justified
- commercial rules, thresholds, and approval requirements have been checked
- missing or unconfirmed values are surfaced clearly
- the output follows the installed estimate or proposal template, or the closest installed output guidance when a dedicated template file is not present
- internal-only reasoning is not leaking into client-facing output

If the work is not ready, do not present it as final. Convert the result into a provisional or blocked outcome, explain why, and list the exact next inputs or approvals needed.

This skill validates the current route and draft. It should not redo routing from scratch unless the current route is clearly invalidated by the available evidence or installed rules.

## When To Use

Use this skill when any of the following are true:

- the agent is about to deliver a final estimate
- the agent is about to deliver a final proposal
- the user asks whether a quote, estimate, scope, or proposal is ready to send
- package routing, add-on selection, commercial treatment, or approval status needs a final check
- the agent has draft estimate material and needs a deterministic readiness review before final output

Do not use this skill for early discovery, evidence gathering, or package routing from scratch. First use the evidence-gathering or intake workflow when core facts are still missing.

## Required Inputs

Before running this skill, gather the current working draft or draft-ready material for the job, including as many of these as are available:

- the current assessment summary or evidence summary
- the chosen or provisional base package
- any recommended add-ons
- the current estimate or proposal draft
- the relevant installed package, add-on, commercial, and template files

If one of these inputs is missing, continue only as far as the evidence supports and mark the result as provisional or blocked.

## Source Authority

Use the installed files as the authority in this order:

1. `/business-context.md`
2. `/packages/README.md`
3. `/packages/assessment-values.md`
4. `/packages/package-index.md`
5. the selected package file in `/packages`
6. `/package-addons/README.md`
7. `/package-addons/addon-index.md`
8. the selected add-on files in `/package-addons`
9. `/commercial-rules/pricing-rules.md`
10. `/commercial-rules/package-thresholds.md`
11. `/commercial-rules/addon-rules.md`
12. `/commercial-rules/custom-scope-triggers.md`
13. `/commercial-rules/approval-rules.md`
14. the relevant output template in `/templates`
15. `/templates/internal-approval-checklist.md`
16. `/templates/internal-vs-client-facing-rules.md`
17. `/docs/output-template-library.md`

If any draft content conflicts with those files, follow the installed files.

## Readiness Workflow

Follow this sequence every time.

### 1. Confirm the deliverable being validated

Determine whether the current job is validating:

- an estimate
- a proposal
- both estimate and proposal consistency together

Then load only the template files needed for that deliverable.

If a dedicated template file is not installed for that deliverable, fall back to the closest installed output guidance and validate structure, scope language, and client-facing cleanliness against that guidance instead.

### 2. Validate the base package decision

Check that the selected base package is still justified by the available evidence.

Verify all of the following:

- the package matches the observed website type, platform, and business goal
- the key assessment values required for that package are present or explicitly marked unconfirmed
- the draft does not rely on add-ons to compensate for a weak or missing base package decision
- no known package exclusion or custom-scope trigger invalidates the selected package

If the base package is weakly supported, contradicted, or invalidated, mark the readiness result as `not ready`.

Do not perform a full fresh routing exercise here. Validate the current route, and only identify rerouting when the existing route is clearly unsupported.

### 3. Validate add-ons

Review add-ons only after the base package has passed the prior check.

For each add-on, confirm:

- it is allowed for the selected package
- it is justified by the evidence or confirmed client need
- its inclusion does not contradict package exclusions or commercial rules
- it is clearly separated from the base package scope

If an add-on lacks evidence, package fit, or commercial validity, remove it from the ready recommendation or flag it as provisional.

### 4. Validate commercial status

Check commercial readiness before any output is treated as final.

Confirm:

- fixed-fee eligibility is still valid, or clearly marked as provisional
- thresholds have not been exceeded without escalation
- custom-scope triggers have been checked and applied where required
- any required internal approvals are identified
- pricing treatment is consistent with package and add-on rules

If approvals are still required, thresholds are exceeded, or custom-scope escalation is required, mark the work as `not ready` for final client-facing output.

### 5. Validate missing values and assumptions

Inspect the draft for missing or unconfirmed values that materially affect:

- package routing
- fixed-fee eligibility
- pricing confidence
- add-on validity
- scope confidence
- commercial approval status

Do not allow silent guessing of high-risk values.

If material values remain unresolved:

- mark the output as provisional rather than final
- list the missing values clearly
- state the exact consequence of each gap when possible

### 6. Validate template compliance

Check the draft against the installed template that applies.

For an estimate, verify the section order and structure required by `/templates/estimate-output-template.md` when that file is installed.

For a proposal, verify structure using `/templates/proposal-output-template.md` when that file is installed.

Also confirm:

- section names and order remain consistent with the installed template
- scope language aligns with the selected package and add-on files
- no unsupported promises or invented deliverables appear
- internal-only reasoning, approvals, scoring, or routing logic is removed from client-facing sections

If the dedicated template file is not installed, validate against the closest installed output guidance instead of blocking on a missing file alone.

If the structure does not comply, rewrite the draft into template-compliant or guidance-compliant form before treating it as ready.

### 7. Return a readiness verdict

End with one of these verdicts:

- `ready` — suitable for final client-facing output
- `provisional` — usable only if clearly labeled as provisional, with missing values or assumptions called out
- `not ready` — should not be presented as final because routing, commercial treatment, approvals, or template compliance still fail

Use the most conservative verdict supported by the evidence.

## Output Contract

Return the review in this exact section order:

1. `Readiness Verdict`
2. `Package Validation`
3. `Add-on Validation`
4. `Commercial Validation`
5. `Missing Values / Assumptions`
6. `Template Compliance`
7. `Current Phase`
8. `Route Decision`
9. `Missing Material Inputs`
10. `Next Handoff`

### Section rules

#### Readiness Verdict

State exactly one of: `ready`, `provisional`, or `not ready`.

Add a one-sentence reason that names the main deciding factor.

#### Package Validation

State whether the base package is supported, provisional, or invalid, and why.

#### Add-on Validation

List each recommended add-on with a short validity decision:

- valid
- provisional
- remove

#### Commercial Validation

State whether the commercial checks passed, remain provisional, or block final output.

Call out thresholds, custom-scope triggers, and approval requirements explicitly.

#### Missing Values / Assumptions

List only the unresolved items that materially affect readiness.

If none remain, say `None material.`

#### Template Compliance

State whether the draft matches the installed template and whether internal-only content has been removed.

#### Required Next Action

Give the smallest correct next step.

Examples:

- finalize and present the estimate
- present as provisional and request two missing values
- escalate to custom scope
- obtain internal approval before sending
- rewrite into the installed proposal template before sharing

#### Current Phase

State `Readiness Review`.

#### Route Decision

State whether the current route remains valid for final output, remains provisional, or must be rerouted because it is clearly unsupported.

Keep this short and tied to the validation outcome rather than redoing the full routing logic.

#### Missing Material Inputs

List only the unresolved values that still materially affect final readiness, pricing confidence, approval status, or route validity.

If none remain, say `None material.`

#### Next Handoff

State the smallest next step that logically follows the readiness review:

- finalize and present
- present only as provisional
- collect one or more blocking values
- obtain internal approval
- reroute because the current route is clearly invalid

## Decision Rules

- Never upgrade a draft to `ready` when material values are still missing.
- Never treat required approval as optional.
- Never allow template polish to hide unresolved scope or pricing risk.
- Never keep an add-on recommendation that the installed files do not support.
- Prefer `provisional` over `ready` when evidence is incomplete but the draft can still be shared responsibly with clear caveats.
- Prefer `not ready` over `provisional` when package validity, commercial treatment, approval status, or template compliance fundamentally fails.
- Do not block only because a dedicated template file is missing if equivalent installed output guidance is available.
- Keep readiness output focused on final validation, not a full rerouting memo.

## Example Trigger Requests

- “Check whether this quote is ready to send.”
- “Validate this estimate before I turn it into the final client version.”
- “Make sure the package, add-ons, and pricing treatment are all quote-ready.”
- “Review this proposal draft and tell me if anything still blocks final output.”

## Example Output

### Readiness Verdict

provisional — the recommended package is plausible, but two pricing-critical values are still unconfirmed and fixed-fee handling cannot yet be treated as final.

### Package Validation

Supported provisionally. The selected package matches the website type and project goal, but the migration volume still needs confirmation.

### Add-on Validation

- Content Migration Add-on — provisional; likely needed, but quantity is not yet confirmed.
- SEO Foundation Add-on — valid; supported by the site condition and project goals.

### Commercial Validation

Provisional. Threshold and add-on rules were checked, but fixed-fee eligibility remains unconfirmed until migration volume is validated.

### Missing Values / Assumptions

- Confirm total migration volume.
- Confirm whether multilingual content is in scope.

### Template Compliance

Mostly compliant. The structure is correct, but one internal approval note must be removed from the client-facing draft.

### Required Next Action

Present the estimate only as provisional, remove the internal approval note, and request confirmation of migration volume and multilingual scope before treating it as final.

### Current Phase

Readiness Review

### Route Decision

The current route remains provisionally valid, but it is not ready for final treatment until the missing pricing-critical values are confirmed.

### Missing Material Inputs

- Confirm total migration volume.
- Confirm whether multilingual content is in scope.

### Next Handoff

Present only as provisional after removing the internal note, then collect the two blocking values before finalizing.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

# Synthetic test scenarios

Use these examples to test routing behaviour. They are synthetic and contain no real customer data.

## 1. Classification-only ticket

Input: "Ticket 123 says the customer cannot reset their password. They need owner/team and priority."

Expected: handle inside `zendesk-triage-router` using embedded triage. `ticket-triage` must not appear as an active route target.

## 2. Root-cause request

Input: "Customer says orders disappeared after yesterday's import. Find out what happened before we reply."

Expected: route to `zendesk-evidence-collector`. Optional support: `zendesk-case-readiness-check` only if evidence sufficiency is the question.

## 3. Customer reply request

Input: "Here is the ticket summary and confirmed workaround. Draft the customer update."

Expected: route to `zendesk-draft-response`. If confirmed facts are too thin, route first to `zendesk-case-readiness-check`.

## 4. Escalation request

Input: "Major account is blocked, no workaround, renewal discussion tomorrow. Prepare an escalation."

Expected: route to `zendesk-customer-escalation`. Supporting workflow: `zendesk-evidence-collector` only if impact or proof is missing.

## 5. General handoff, not escalation

Input: "Prepare a clean internal handoff for the support manager before I go offline."

Expected: route to `zendesk-handoff-prep`. Do not default to Linear or GitHub.

## 6. Duplicate ambiguity

Input: "Are these three tickets the same issue or just similar complaints?"

Expected: route to `zendesk-duplicate-pattern-review`, not backlog reporting unless the requested deliverable is queue/volume analysis.

## 7. Trend report

Input: "Summarise this week's Zendesk backlog risks and repeated issues."

Expected: route to `zendesk-backlog-trend-analysis`.

## 8. Knowledge candidate

Input: "This workaround has been used in several resolved tickets. Should we document it publicly?"

Expected: route to `zendesk-knowledge-candidate-review`, not directly to article drafting unless documentation readiness has already been decided.

## 9. Knowledge draft already approved

Input: "The support lead approved this as a public article. Draft the article from these resolved-case notes."

Expected: route to `zendesk-create-knowledge`.

## 10. Explicit downstream artefact

Input: "From this Zendesk case, prepare the support handoff needed before we create a GitHub issue."

Expected: route to `zendesk-handoff-prep` first. Downstream GitHub issue drafting is not the default route unless the user explicitly asks for the issue body and the handoff is already sufficient.

## 11. Missing attached workflow

Input: "Draft the customer reply," but the parent agent does not have `zendesk-draft-response` attached.

Expected: describe the next action in plain language: draft a customer-facing support response from confirmed facts, and note the required evidence. Do not claim to invoke an unattached skill.

## 12. Zendesk unavailable, pasted evidence supplied

Input: "Zendesk is not available in this shared agent run, but here is a pasted ticket excerpt. Decide the next support workflow."

Expected: route from the supplied evidence, state that Zendesk was unavailable, name the smallest missing Zendesk item, and do not claim Zendesk was checked.

## 13. Shared-agent installation review

Input: "We just attached this router to a shared support agent. What should we check before the team uses it?"

Expected: keep `zendesk-triage-router` as the primary workflow and consult `references/parent-agent-installation-checklist.md` for companion skills, connector assumptions, smoke tests, and maintenance checks.

## Executable coverage

The same route expectations are represented in `router-regression-cases.json` for deterministic maintenance checks. Run `scripts/run_router_regression_tests.py` after changing routing rules, namespace mappings, aliases, or shared-agent fallback behaviour.

## Scenario: canonical reply workflow is unavailable

**Input:** The user asks for a customer-facing reply, but the shared agent does not have `zendesk-draft-response` attached.

**Expected behaviour:** The router should identify the canonical intent as `zendesk-draft-response`, then use a plain-language support action with an availability note.

**Must avoid:** Do not claim `zendesk-draft-response` is available. Do not use a legacy non-prefixed route. Do not fall back to Linear, GitHub, or a broad project workflow.

## Scenario: Zendesk fields affect triage

**Input:** A pasted ticket includes SLA breach risk, a major-account organisation, a `blocked_checkout` tag, and no confirmed root cause.

**Expected behaviour:** Consult `zendesk-field-map.md`. Treat the fields as signals, not proof. Keep severity based on impact/scope, priority based on urgency, and root cause in `Unknowns` unless confirmed by ticket notes.

**Must avoid:** Do not infer engineering ownership solely from a tag. Do not say the tag proves a duplicate or known issue.

## Return to central router

**Input:** A pasted Zendesk case could plausibly require customer research, duplicate review, escalation, and knowledge review. The user asks which specialist in the wider Zendesk network should own it.

**Expected route:** `zendesk-router-skill`

**Why:** Broad network selection belongs to the central Zendesk router. `zendesk-triage-router` should not expand into a second full skill-network router.

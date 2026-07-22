---
name: zendesk-evidence-quality-review
description: review zendesk-first support outputs for weak evidence, unsupported claims, unsafe wording, privacy or redaction risk, unclear next steps, and readiness before sharing. use when an existing zendesk customer reply, investigation, escalation brief, handoff, backlog report, trend summary, or knowledge draft needs a final qa pass. do not use to create the first draft, investigate a case, triage a ticket, or run backlog analysis.
---

# Zendesk Evidence Quality Review

Use this skill only as an after-output QA pass for Zendesk-first support work. The user must already have a draft, summary, investigation, handoff, report, or knowledge article that needs review before it is sent, shared, escalated, or reused.

This skill does not create the first version of the support output. It reviews an existing output for evidence quality, safety, operational clarity, and wording risk.

## Shared Agent Safety

This skill may run inside a shared workspace agent. Do not assume the logged-in user is the skill author, has the same Zendesk permissions, or has access to the same private memory.

Use only the evidence available in the current conversation, accessible Zendesk records, or explicitly supplied source material. If connector access is unavailable or evidence is incomplete, identify the smallest missing evidence needed and route to the appropriate upstream workflow.

Consult `references/shared-agent-operating-model.md` when access, identity, memory, or source ownership is unclear. Consult `references/connector-access-fallbacks.md` when ticket IDs, ticket URLs, customers, or account history are mentioned but the current session may not have the same connector access as another teammate.

## Reusable Resources

Load only the resource needed for the current review:

- `references/shared-agent-operating-model.md` for shared-agent identity, connector, memory, and source-of-truth rules.
- `references/connector-access-fallbacks.md` when Zendesk ticket IDs, ticket URLs, customers, or account history are referenced but connector access may differ by teammate.
- `references/evidence-intake-standards.md` when judging whether supplied evidence is enough for the requested review.
- `references/routing-readiness-decision-matrix.md` when the request may need routing away before review, when no reviewable artefact exists, or when evidence is too thin.
- `references/routing-boundaries.md` when deciding whether to continue QA, make a simple common handoff, or return to `zendesk-router-skill` without becoming a second router.
- `references/review-severity-and-confidence-rubric.md` when assigning low/medium/high severity, calibrating confidence labels, or deciding whether the artefact is ready, mostly ready, or not ready.
- `references/privacy-and-redaction-review.md` when outputs contain customer data, personal data, internal notes, logs, screenshots, commercial details, secrets, security-sensitive context, or cross-customer references.
- `references/support-risk-language-bank.md` when replacing unsafe customer-facing or internal wording.
- `templates/missing-evidence-routing-response.md` when the safest answer is to explain the missing artefact, evidence, or upstream workflow instead of reviewing.
- `templates/privacy-redaction-review.md` when privacy, sensitive-data exposure, or redaction risk is a material part of the review.
- `templates/review-report.md` for the default review structure.
- `templates/customer-reply-review.md`, `templates/escalation-review.md`, `templates/knowledge-draft-review.md`, or `templates/backlog-report-review.md` when the output type needs a tighter review format.
- `schemas/review-result.schema.json` only when the user asks for structured JSON output or a downstream automation needs a machine-readable review.
- `references/structured-json-output.md` when producing or validating machine-readable review results.
- `scripts/validate_review_json.py` only when a JSON review needs validation before downstream automation or shared-agent handoff.
- `examples/*.md` only when the agent needs a concrete pattern for the expected review style.
- `examples/review-result-valid.json` and `examples/review-result-invalid.json` when testing or explaining structured JSON validation.
- `examples/review-severity-calibration-cases.md` when the agent needs concrete examples for severity, confidence, or verdict calibration.
- `examples/privacy-redaction-review-example.md` when the agent needs a concrete pattern for identifying and rewriting sensitive customer, internal, security, or cross-customer details.
- `references/shared-agent-rollout-and-acceptance-tests.md`, `templates/shared-agent-smoke-test-report.md`, and `examples/shared-agent-acceptance-test-fixtures.md` only when testing or preparing the skill for shared-agent rollout.

## Shared-Agent Rollout Testing

When preparing this skill for a shared workspace agent, use synthetic acceptance tests rather than real customer data. Consult `references/shared-agent-rollout-and-acceptance-tests.md` and complete the smoke-test report template before relying on the shared agent for live support QA.

## Boundary Rules

- Treat Zendesk as the support source of truth when Zendesk evidence is provided or referenced.
- Review the supplied output; do not convert the request into triage, investigation, drafting, escalation creation, knowledge creation, or backlog analysis.
- If the supplied output is too thin to review safely, say what is missing and route away to the smallest upstream workflow needed.
- Do not invent ticket facts, customer impact, root cause, counts, policy decisions, timelines, credits, or ownership.
- Treat structured JSON as an output format only; it does not replace Zendesk evidence, pasted ticket content, or explicitly supplied support notes.
- Before reviewing, confirm that a reviewable artefact exists, enough evidence is available, and the task is actually QA; otherwise consult `references/routing-readiness-decision-matrix.md` and `references/routing-boundaries.md` before stopping or handing off.
- Do not maintain the full Zendesk skill network or act as a second router. Make only simple common handoffs from this QA workflow; return ambiguous or multi-step routing decisions to `zendesk-router-skill`.
- Prefer targeted fixes over rewriting the whole artefact unless the structure itself creates risk.
- Keep public customer wording separate from internal support reasoning.
- Minimise sensitive detail in the review itself. Do not repeat secrets, tokens, unnecessary personal data, private comments, or cross-customer details when a redacted description is enough.

## Routing Boundaries and Route-Away Rules

Use this skill only when an existing support artefact needs QA. A reviewable artefact can be a customer reply, investigation, escalation brief, internal handoff, backlog report, trend summary, knowledge draft, or another support output that has already been drafted.

If no reviewable artefact exists, do not create the missing artefact inside this skill. Route to the smallest upstream workflow that creates or prepares the artefact. If the correct upstream workflow is unclear, the request combines multiple workflows, or the route depends on broader Zendesk skill-network knowledge, return to `zendesk-router-skill` with a short reason and the smallest missing artefact or evidence needed.

This specialist should know its own boundary, common handoffs, and when to return to the router. It must not maintain the full Zendesk skill network or become a second router.

Route away before reviewing when the user needs one of these upstream or adjacent workflows:

- `zendesk-triage-router` for first-pass classification, severity, priority, queue/status, owner/team, or workflow selection.
- `zendesk-evidence-collector` for missing ticket evidence, timeline reconstruction, proof, investigation, or case facts.
- `zendesk-case-readiness-check` for deciding whether the case is ready for a reply, escalation, handoff, knowledge draft, or report.
- `zendesk-draft-response` for creating a new customer-facing reply.
- `zendesk-customer-escalation` for creating a new escalation brief.
- `zendesk-handoff-prep` for creating a new internal handoff.
- `zendesk-create-knowledge` for creating a knowledge article or reusable knowledge draft.
- `zendesk-knowledge-candidate-review` for deciding whether a case, workaround, known issue, or repeated answer should become documentation.
- `zendesk-duplicate-pattern-review` for duplicate, related-case, repeated-pain, or incident-pattern classification.
- `zendesk-backlog-trend-analysis` for backlog, queue-health, SLA, ageing-risk, repeated-issue, or trend reports.
- `zendesk-customer-research` for customer/account context before replying, escalating, or assessing support risk.

Keep handoffs minimal. Name one obvious next workflow only when the route is clear from the user's request. Do not sequence complex chains such as evidence collection -> escalation -> customer reply -> knowledge creation. Return unclear intake to `zendesk-router-skill` instead.

Clear QA requests may invoke this skill directly. Unclear Zendesk-first intake should route through `zendesk-router-skill`. This skill should not perform the upstream work it is reviewing.

If the user asks for both drafting and QA in one request, route to the drafting workflow first, then use this skill only as the final review pass.

## Review Goals

Review the output for five things:

1. Missing or weak evidence.
2. Unsupported, overstated, or unqualified claims.
3. Unclear, ownerless, or unrealistic next steps.
4. Blurred lines between confirmed facts, interpretation, assumptions, and open questions.
5. Missing risk, escalation, customer-safety, or handoff context.

The goal is to make the existing support output safer, clearer, more evidence-backed, and more operationally useful without adding unsupported substance.

## Review Workflow

1. Identify the output type: customer reply, investigation, escalation brief, handoff, backlog report, trend summary, knowledge draft, or another Zendesk support artefact.
2. Read the full draft before judging details.
3. Extract the main claims, recommendations, customer-facing statements, and next steps.
4. Check whether each important claim is directly supported by the provided Zendesk evidence, cited artefacts, or explicitly stated assumptions.
5. Check whether the confidence level matches the evidence.
6. Check whether the output separates:
   - confirmed facts
   - likely explanations or interpretations
   - assumptions
   - open questions
   - recommended next actions
7. Check whether next steps are actionable:
   - who should do what
   - what evidence, decision, or customer input is still needed
   - whether urgency and timing are realistic
8. Check wording for support-specific risk:
   - accidental promises about fixes, release dates, credits, refunds, policy exceptions, or product commitments
   - implied root cause without proof
   - unsupported statements about engineering, product, billing, legal, privacy, security, or SLA positions
   - internal-only reasoning exposed in customer-facing wording
   - missing escalation criteria for high-impact, security-sensitive, data-loss, or repeated business-critical issues
   - unnecessary exposure of personal data, customer-sensitive details, secrets, internal notes, logs, screenshots, commercial details, or cross-customer references
9. Assign severity and confidence only when useful for prioritising fixes. Use `references/review-severity-and-confidence-rubric.md` when the severity, confidence label, or verdict is not obvious.
10. Recommend the smallest edits that materially improve accuracy, safety, and usefulness.

## Review Standards

### Evidence

- Flag important conclusions that are not grounded in the draft, Zendesk evidence, cited artefacts, or clearly stated assumptions.
- Prefer concrete evidence references over vague phrasing such as "the data suggests" or "it looks like".
- If evidence is partial, narrow the claim instead of pretending certainty.
- If evidence is missing enough that QA is not meaningful, route to `zendesk-evidence-collector` or `zendesk-case-readiness-check` rather than reviewing assumptions.

### Confidence and Framing

- Replace overconfident wording with calibrated wording when proof is incomplete.
- Preserve strong language only when the evidence supports it.
- Separate confirmed findings from hypotheses, interpretations, customer reports, and recommended actions.
- Use labels such as "confirmed", "reported", "likely", "possible", or "needs verification" only when those labels match the evidence.
- Use `high`, `medium`, and `low` severity labels consistently when the user asks for prioritised issues, structured JSON, or rollout QA. Do not overstate severity to make a review sound more decisive.

### Next Steps

- Make next steps concrete, owned, and tied to the problem.
- Flag next steps that are vague, redundant, unrealistic, or not actionable by the named owner.
- If escalation or follow-up is needed, state the exact ask, decision, evidence, or customer input required from the next owner.
- Avoid next steps that imply a commitment before it has been approved.

### Support Safety

- Customer-facing drafts must not promise fixes, dates, credits, refunds, exceptions, root causes, or internal decisions unless those are documented and approved.
- Customer-facing drafts must not expose secrets, tokens, unnecessary personal data, private comments, internal URLs, other-customer details, or unapproved internal reasoning.
- Internal outputs should still avoid presenting speculation as fact and should minimise sensitive detail that is not needed for the receiving owner to act.
- High-severity, security-sensitive, data-loss, repeated, privacy-sensitive, or commercially sensitive issues must not be framed casually.
- Knowledge drafts must not turn a one-off workaround into public guidance unless the resolution is confirmed and reusable.

## Default Output Format

When the user asks for a review, respond in this structure unless they ask for a lighter format.

## Verdict

Give a 1-2 sentence judgement on whether the draft is ready, mostly ready with fixes, or not ready.

## What is strong

List 2-5 things that already work.

## Issues to fix

Group issues under the following headings when relevant.

### Missing evidence

List claims or sections that need stronger proof, citations, Zendesk references, or clearer sourcing.

### Unsupported or overstated claims

List statements that go beyond the evidence and suggest tighter wording.

### Weak next steps

List vague, incomplete, ownerless, or misdirected actions and explain what would make them usable.

### Risk or handoff gaps

List missing ownership, escalation, customer-safety, internal-only, operational, or commercial caveats.

## Recommended edits

Provide concise rewrite suggestions or exact replacement lines for the highest-impact fixes. Do not add new factual claims unless they are already present in the supplied material.

## Quick pass/fail checklist

End with this compact checklist:

- Evidence supports the main claims: Yes/No
- Facts and interpretation are clearly separated: Yes/No
- Next steps are specific and owned: Yes/No
- Risk or escalation gaps remain: Yes/No
- Sensitive data is minimised for the audience: Yes/No
- Safe to send or share as-is: Yes/No

## Review by Output Type

### Customer reply

Focus on acknowledgement of the issue or impact, confirmed facts only, no unsupported promises, a clear next step for the customer or support team, and no internal-only reasoning in customer-facing text.

### Investigation

Focus on the evidence-backed timeline, confirmed findings versus hypotheses, unresolved questions, proof quality, root-cause caution, severity fit, and the next investigation step.

### Escalation brief

Focus on impact, evidence, urgency, target owner, exact ask, attempted steps, blockers, customer risk, and whether the escalation is justified by the facts.

### Handoff

Focus on what the receiving owner needs to act, what has already been tried, what remains blocked, which evidence matters, and which statements should stay internal.

### Backlog report or trend summary

Focus on whether counts, comparisons, filters, time windows, and trend claims are supported. Flag unsupported trend language, missing confidence levels, unclear operational actions, and any leap from support pattern to product conclusion.

### Knowledge draft

Focus on whether the documented cause, workaround, scope, caveats, and resolution are confirmed and reusable. Flag hidden ticket context, unstable workarounds, missing limits, and wording that should stay internal.

## Editing Guidance

If the user asks for a reviewed-and-improved version instead of only critique:

1. Start with the QA review mentally.
2. Fix only issues supported by the evidence.
3. Keep the original intent, output type, and appropriate tone.
4. Do not add new facts unless they are present in the provided material.
5. If key evidence is missing, leave a note such as "verify before sending" instead of inventing certainty.
6. If the artefact is not ready for editing because the case evidence is missing, route to `zendesk-evidence-collector` or `zendesk-case-readiness-check` instead of producing a polished but unsafe version.

## Example Requests

- Review this Zendesk investigation and tell me where the evidence is weak before I escalate it.
- Pressure-test this customer reply for unsupported promises or unclear next steps.
- Check this handoff for missing owner context and unsafe internal wording.
- QA this weekly support summary for claims that are not backed by the reported numbers.
- Review this knowledge draft and tell me whether it is safe to publish or should stay internal.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

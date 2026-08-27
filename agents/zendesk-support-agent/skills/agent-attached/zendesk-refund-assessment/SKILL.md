---
name: zendesk-refund-assessment
description: assess zendesk-first refund, credit, compensation, goodwill, make-good, or policy-exception cases before a final customer response is drafted. use when a support case, pasted thread, or zendesk-router-skill handoff needs internal decision support around remedy type, policy basis, prior commitments, evidence strength, approval needs, escalation risk, safest grounded outcome, or whether a bounded reply can be drafted safely. route away from routine replies, pure documentation alignment, broad escalation packaging, customer-history research, or simple triage.
---

# Zendesk Refund Assessment

Use this skill to produce a concise internal assessment for refund, credit, compensation, goodwill, make-good, or policy-exception cases before any final customer-facing decision is drafted.

Keep the skill as a decision-support specialist. Do not approve refunds automatically, invent entitlement, draft the final customer reply by default, or imply a teammate has authority unless the source evidence confirms it.

## Shared-Agent Rule

This skill must work inside a shared workspace agent. Do not rely on personal Memory, personal connector IDs, a specific teammate's identity, or assumptions about one person's authority.

Use logical source categories:

- `zendesk`: ticket source of truth for customer messages, internal notes, status, tags, prior replies, and commitments.
- `help_center` or `support_docs`: refund terms, cancellation rules, service-credit policy, compensation guidance, exception playbooks, and public help articles.
- `billing` or `commerce`: invoices, transactions, subscription state, order status, paid amount, currency, refund history, chargeback status, and credit notes when available.
- `crm` or `account`: plan, commercial context, renewal risk, relationship owner, account commitments, or contract notes when available.
- `slack` or internal discussion: only when explicitly supplied or available in the shared agent; treat as supporting context, not policy source of truth.
- `pasted context`: acceptable when connectors are unavailable; state evidence limits clearly.

Read `references/shared-agent-setup.md` when connector access, user identity, authority, or shared-agent portability affects the run. Read `references/connector-fallbacks.md` when Zendesk, billing, policy, CRM, or internal discussion evidence is unavailable or pasted only. Read `references/router-interoperability.md` when this skill is invoked from or referenced by `zendesk-router-skill`. Read `references/output-contract.md` when output shape needs validation or correction. Read `references/routing-boundaries.md` when the request may belong to another `zendesk-` skill. Read `references/memory-policy.md` before saving anything to Memory. Read `references/shared-agent-deployment-checklist.md` before installing this skill in a shared support desk agent.

## Core Workflow

1. Anchor the case.
   - Identify ticket, customer, product/service, issue, current status, latest customer ask, and requested remedy.
   - Classify the remedy as refund, partial refund, credit, compensation, goodwill gesture, policy exception, or unclear.
   - If there is no material refund, credit, compensation, goodwill, or exception decision, route away.
2. Separate evidence from inference.
   - Confirm what the customer asked for.
   - Confirm what support already said.
   - Confirm what policy, terms, help-center guidance, contract notes, or billing records say.
   - Mark likely interpretations as inference, not fact.
3. Check policy and constraints.
   - Identify the relevant documented basis.
   - Note any eligibility windows, exclusions, cancellation terms, chargeback constraints, approval thresholds, contractual terms, or regional/legal review concerns.
   - If the policy source is missing or stale, recommend grounding in documentation before deciding.
4. Review prior commitments.
   - Identify promises, expectations, goodwill language, verbal commitments, escalation notes, quoted timelines, or ambiguous wording already given to the customer.
   - Flag wording that may have created expectation risk even if it did not create confirmed entitlement.
5. Assess decision risk.
   - Consider financial, contractual, legal, policy, fairness, precedent, retention, escalation, reputation, SLA, chargeback, compliance, and trust risks.
   - Treat uncertainty as a risk factor, not as permission to decide.
6. Recommend the safest next step.
   - Choose one primary next step: draft cautious reply, request more information, escalate for approval, ground further in docs, or avoid deciding yet.
   - Name the recommended downstream skill when another specialist should own the next deliverable.
   - State whether a customer-facing reply can be drafted safely now.

## Minimum Evidence

Do not present a refund or compensation decision as safe unless these are known or explicitly unavailable:

- latest customer ask and requested remedy
- relevant ticket history and last support commitment
- policy or documented guidance basis
- billing/order/subscription facts needed for the requested remedy
- prior refunds, credits, chargebacks, or exception history when relevant
- approval authority or threshold, if the offer needs approval
- known evidence gaps and uncertainty

When minimum evidence is missing, recommend the smallest safe next action rather than filling the gap with assumptions.

## Default Output

Use `templates/refund-assessment-template.md` as the default structure. Keep the output internal-facing and concise.

Required sections:

1. `request summary`
2. `refund or compensation type`
3. `confirmed evidence`
4. `inference or uncertainty`
5. `missing evidence`
6. `relevant policy basis`
7. `prior commitments or expectation risk`
8. `approval or escalation needs`
9. `risk factors`
10. `recommended safest next step`
11. `safe to draft customer reply now?`
12. `recommended downstream skill`

Omit empty sub-bullets, but do not omit a required section just because evidence is missing. Say `not found in supplied evidence` or `not yet confirmed` where appropriate.

## Language Safety Rules

Use conservative internal wording.

Prefer:

- `policy appears to support...` when grounded but still needing approval
- `evidence is insufficient to decide...` when facts are missing
- `approval is needed before offering...` when authority is unclear
- `a cautious reply can acknowledge the request without confirming outcome...`

Avoid:

- unqualified entitlement language unless the entitlement is directly confirmed by policy or contract evidence
- approval, guarantee, promise, refund-instruction, or obligation language unless an authorised decision already exists in the record
- speculation about legal obligations
- blame language about teammates or customers
- customer-facing final decisions inside this skill's internal assessment

## Direct Handoffs

Use the closest downstream skill instead of expanding this skill's scope:

- `zendesk-draft-response`: when the user asks for a customer-facing reply and the assessment says a cautious reply can be drafted safely.
- `zendesk-help-center-grounding`: when the main need is policy, help-center, terms, or documentation alignment before decision. If this skill is not available, use the workspace's documented help-center grounding or evidence collection workflow.
- `zendesk-customer-escalation`: when the case needs formal approval, leadership/commercial/legal/security/product decision, or broader escalation packaging.
- `zendesk-evidence-quality-review`: when a near-final assessment, approval note, or customer reply needs risk QA.
- `zendesk-customer-research`: when account history, relationship context, previous commitments, or support-health context is the main missing input.
- `zendesk-triage-router`: when the case only needs severity, queue, ownership, status, or first-pass triage.
- `zendesk-evidence-collector`: when ticket evidence is weak, incomplete, or not yet Zendesk-grounded.
- `zendesk-router-skill`: when more than one Zendesk workflow could own the request or the user's intended deliverable is unclear.

## Examples and Tests

Use examples only as behavioural patterns, not as source evidence:

- `examples/straightforward-refund.md`
- `examples/nuanced-compensation-incomplete.md`
- `examples/prior-commitment-risk.md`
- `examples/policy-expectation-tension.md`
- `examples/escalate-rather-than-decide.md`
- `examples/route-away.md`

Use `schemas/refund-assessment.schema.json` when a structured record is useful for QA, automation, or consistency checks. Use `tests/smoke-prompts.md` and `tests/refund-assessment-fixtures.json` when validating routing, output shape, evidence/inference separation, shared-agent portability, connector fallbacks, and conservative financial wording. Run `python3 scripts/validate_refund_assessment_pack.py` from the skill root before packaging or sharing this skill. Record meaningful behaviour, validation, fixture, or deployment changes in `references/changelog.md`.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

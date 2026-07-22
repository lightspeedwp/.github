---
name: zendesk-help-center-grounding
description: ground zendesk-first support replies and internal guidance in help center articles, policy docs, and approved support documentation. use when a ticket, user request, draft reply, macro, refund/policy question, or internal guidance depends on documented accuracy, article consistency, citation posture, policy alignment, or risk of overstating official guidance. compare the requested answer against approved documentation, flag conflict, ambiguity, outdated or missing guidance, separate documented facts from inference, and produce a compact internal grounding brief. route away when the primary need is routine drafting, customer/account research, escalation packaging, triage, refund assessment, bug handoff, or final evidence-quality review.
---

# Zendesk Help Center Grounding

## Purpose

Use this skill to determine what approved documentation supports before a Zendesk-first support reply or internal support recommendation is drafted, revised, escalated, or reviewed.

The output is an internal grounding brief, not a customer reply, escalation brief, full research memo, or final QA review.

## Core workflow

1. **Confirm the documentation dependency.** Use this skill only when the answer depends on Help Center accuracy, policy wording, official guidance, or whether a document should be cited, matched, deferred to, or treated cautiously.
2. **Find approved sources.** Search Help Center articles, policy docs, macros, internal support docs, and other explicitly approved documentation. Do not treat prior tickets, guesses, teammate memory, or product assumptions as documented guidance.
3. **Extract the documented position.** Summarise the narrow documented answer, with source title, link or identifier, section, last-updated signal if available, and confidence.
4. **Compare against the ticket, request, or draft.** Mark each material claim as supported, unsupported, conflicting, ambiguous, outdated, or inferred.
5. **Choose a safe reply posture.** Recommend whether downstream drafting should match the source, cite it, defer to it, avoid citing it too strongly, escalate, or avoid making a commitment.
6. **Route the next step.** Recommend the most relevant downstream Zendesk skill or a cautious manual next action.

Load these references when needed:

- `references/routing-boundaries.md` for scope boundaries and adjacent Zendesk skill routing.
- `references/shared-agent-setup.md` for shared workspace safety rules.
- `references/memory-policy.md` for conservative Memory behaviour.
- `templates/grounding-brief-template.md` for the default output structure.
- `examples/grounding-examples.md` for normal and edge-case examples.
- `schemas/grounding-brief.schema.json` when a structured data shape is required by a downstream workflow.

## Source rules

Prefer sources in this order:

1. Current public Help Center articles or official policy pages.
2. Approved internal support documentation, macros, policy notes, or playbooks.
3. Product docs or release notes explicitly approved for support use.
4. Prior tickets only as context, never as documentation, unless they link to an approved source.

For every important source, capture:

- title or document name
- link, article ID, document ID, or other stable locator when available
- relevant section or heading
- last-updated, version, or freshness signal when available
- whether it is public, internal-only, or unclear
- whether the wording is direct guidance or requires interpretation

If no approved source is available, say that documentation grounding is not possible from the available evidence and recommend the smallest safe next step.

## Documentation status labels

Use these labels consistently:

- **clear support**: documentation directly supports the answer.
- **partial support**: documentation supports only part of the answer or needs careful limits.
- **conflict**: the draft/request says something materially different from documentation.
- **ambiguous**: documentation can reasonably be read more than one way.
- **outdated risk**: documentation appears stale, superseded, or inconsistent with newer approved material.
- **missing documentation**: no approved source covers the claim.
- **inference required**: the answer is reasonable but not explicitly documented.

## Risk levels

Assign one documentation risk level:

- **low**: current approved docs clearly support the intended response.
- **medium**: docs partially support the response, require careful wording, or leave meaningful gaps.
- **high**: docs conflict, appear outdated, are missing for a material claim, or the reply could imply policy, entitlement, refund, SLA, compliance, legal, security, or product guarantees.

High-risk results should avoid customer-facing commitments and usually recommend escalation, evidence review, or specialist assessment.

## Output format

Use the compact template in `templates/grounding-brief-template.md` unless the user asks for a different internal format.

Keep the brief concise. Include only enough detail to help the next support step. Do not draft the full customer reply unless the user explicitly asks to route into `zendesk-draft-response`.

## Hand-off guidance

Recommend exactly one primary next route when possible:

- `zendesk-draft-response` when documentation is grounded and the next step is customer wording.
- `zendesk-evidence-quality-review` when an existing draft needs final risk review beyond documentation alignment.
- `zendesk-customer-research` when account history or customer-specific context is the main missing evidence.
- `zendesk-customer-escalation` when the documented position reveals material risk, exception handling, or cross-functional ownership.
- `zendesk-ticket-triage` or the workspace triage skill when classification, severity, queue, or owner is the main need.
- `zendesk-refund-assessment` when refund entitlement, refund policy interpretation, exception handling, or commercial credit logic is the main need and that skill is available.

If multiple routes seem possible, choose the smallest next step that resolves the documentation risk first.

## Safety constraints

- Do not invent policy, commitments, entitlements, SLAs, roadmap promises, product guarantees, legal positions, or refund outcomes.
- Do not imply a document is current unless the source itself or connector metadata supports that.
- Do not over-cite weak, outdated, internal-only, or ambiguous documents.
- Do not expose internal-only documentation in customer-facing wording unless the user explicitly asks for an internal communication.
- Separate **documented guidance** from **interpretation** and **recommended support wording**.
- Preserve uncertainty. When documentation is incomplete, say so plainly.
- Avoid relying on personal memory, one teammate's workspace context, or customer-specific details saved from another conversation.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

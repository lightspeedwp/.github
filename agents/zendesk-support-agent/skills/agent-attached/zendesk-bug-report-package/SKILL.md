---
name: zendesk-bug-report-package
description: zendesk-first bug report packaging for support-ticket evidence. use when a zendesk ticket, ticket url, pasted support thread, investigation note, customer report, screenshot summary, or product-related support issue needs an engineering-ready or product-ready defect handoff. converts messy support evidence into a concise internal bug package with problem, affected context, expected versus actual behaviour, reproduction clues, attempted troubleshooting, impact, timeline, evidence confidence, gaps, and next action. route away to triage, customer research, escalation, draft response, evidence review, or help-centre grounding when those are the primary need.
---

# Zendesk Bug Report Package

## Purpose

Use this skill to turn Zendesk-first support evidence into a compact internal bug package for engineering or product review.

The package must help the receiving team act quickly without pretending the support team has confirmed more than the evidence supports.

## Operating rules

- Keep Zendesk and supplied support evidence as the source of truth.
- Separate confirmed behaviour, user-reported claims, support-observed facts, inferred detail, and missing evidence in every output.
- Prefer cautious wording: "customer reports", "support observed", "likely", "not yet confirmed", "needs reproduction", or "unknown".
- Do not write a root-cause conclusion unless the supplied evidence already proves it.
- Do not turn the output into a customer-facing reply, broad escalation brief, product roadmap item, or generic triage note.
- Do not assume the current teammate's identity, connector access, saved views, personal memory, or private workspace defaults.
- Use secondary systems only when the user supplies them, explicitly asks for them, or the bug package cannot be useful without them.

## Required workflow

1. **Confirm this is the right workflow.** If the user mainly needs routing, customer research, escalation, reply drafting, evidence review, or documentation grounding, route away using `references/routing-boundaries.md`.
2. **Collect the minimum case facts available.** Identify ticket ID or URL, requester, organisation/account, product/surface, environment, version, timestamps, attachments, screenshots, logs, prior replies, internal notes, and linked or duplicate tickets when present.
3. **Classify evidence confidence.** Mark each key claim as confirmed, support-observed, user-reported but unconfirmed, inferred, or unknown/missing.
4. **Build the bug package.** Use `templates/bug-package-template.md` as the default structure. Keep unknown fields visible rather than inventing detail.
5. **Decide readiness and destination.** Recommend one next action: engineering/product handoff, request reproduction detail, more Zendesk/customer research, formal escalation, or separate cautious customer reply.
6. **Check for overstatement.** Before responding, remove unsupported root cause language, promises, broad scope claims, or certainty not backed by the evidence.

Load these resources when relevant:

- `references/routing-boundaries.md` for when to use this skill, when to route away, and how to hand off to adjacent Zendesk skills.
- `references/shared-agent-setup.md` when running in a shared workspace agent or when connector access may vary by teammate.
- `references/memory-policy.md` before saving or suggesting durable memory from this workflow.
- `references/router-integration.md` when checking whether `zendesk-router-skill` can reference this skill safely.
- `references/source-access-profile.md` when source availability or evidence provenance is unclear.
- `templates/bug-package-template.md` when a structured package is needed.
- `schemas/bug-package.schema.json` when the user asks for JSON, schema-aligned output, automation handoff, or validation.
- `examples/bug-package-cases.md` when style calibration or edge-case routing examples would improve the result.
- `examples/shared-agent-smoke-tests.md` when validating use inside the LightSpeed Support Desk or another shared support agent.
- `fixtures/router-bug-package-cases.json` only when maintaining router fixtures or validating shared-agent routing.
- `scripts/validate_bug_package_pack.py` only when validating package structure, shared-agent portability, route names, examples, fixtures, and schema alignment before sharing.

## Evidence handling

Use these labels consistently:

- **confirmed:** directly visible in Zendesk, supplied logs/screenshots, support reproduction, or trustworthy connected evidence reviewed during this run.
- **support-observed:** observed by support during troubleshooting or reproduction.
- **user-reported:** stated by the customer/requester but not independently verified by support.
- **inferred:** reasonable interpretation from evidence, but not directly proven.
- **unknown/missing:** information needed for confidence, prioritisation, or reproduction but not available.

When evidence conflicts, state the conflict instead of resolving it by guesswork.

## Default output

Produce a concise internal-facing package using this shape:

1. **Readiness:** ready for engineering/product, partially ready, or not ready.
2. **Problem statement:** one or two sentences.
3. **Affected context:** user, account, product/surface, environment, version, browser/device, region, permissions, or other known context.
4. **Expected behaviour:** what should happen, with source if known.
5. **Actual behaviour:** what happened, separated by confidence label.
6. **Reproduction clues or steps:** exact steps if available; otherwise clues and missing details.
7. **Troubleshooting attempted:** what support/customer already tried and outcomes.
8. **Impact and severity signals:** affected users/accounts, business impact, frequency, workaround, blocked work, SLA/relationship risk.
9. **Timeline:** first reported, last confirmed, recurrence, release/change correlation if known.
10. **Evidence register:** confirmed, support-observed, user-reported, inferred, and missing evidence.
11. **Recommended next action:** one clear action plus recommended downstream skill or destination.
12. **Caution notes:** unsupported assumptions, sensitive details omitted, and what not to claim yet.

Use the full template in `templates/bug-package-template.md` when the user needs a paste-ready internal handoff.

## Readiness decisions

Use these readiness labels:

- **ready:** enough evidence exists for engineering or product to investigate without another support discovery pass.
- **partially ready:** the problem and impact are clear, but reproduction, scope, logs, environment, or expected behaviour needs follow-up.
- **not ready:** the evidence is too thin for a bug package; recommend triage, customer research, or reproduction detail first.

A bug package can be useful when partially ready, but it must make the missing evidence obvious.

## Shared-agent behaviour

Keep this skill portable across shared support desk agents:

- Do not rely on a specific logged-in teammate, personal Zendesk views, private mailboxes, personal memory, private labels, saved filters, or user-specific defaults.
- Treat Zendesk as the preferred source of truth only when the active shared agent has access to the relevant ticket or evidence.
- If live Zendesk access is unavailable, build only from supplied evidence and mark missing Zendesk facts explicitly.
- Keep examples, fixtures, and smoke tests anonymised and synthetic.
- Prefer stable role names such as support, engineering, product, security, operations, account owner, and support manager.
- Do not copy raw personal data, credentials, tokens, payment data, or security-sensitive logs into the package unless absolutely necessary and explicitly supplied for that handoff.

## Tone and safety

Write as an internal support-to-engineering handoff: direct, factual, compact, and useful. Avoid blame, speculation, customer-visible promises, or confident engineering conclusions. Link or refer back to Zendesk for sensitive raw evidence instead of copying unnecessary personal data, credentials, logs, billing details, or security-sensitive content into the package.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

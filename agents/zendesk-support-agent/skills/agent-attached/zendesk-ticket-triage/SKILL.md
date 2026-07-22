---
name: zendesk-ticket-triage
description: prepare compact internal triage packages for zendesk support cases when a user explicitly asks for a legacy-style package with issue summary, urgency, severity, recommended priority, issue type, owner, duplicate or pattern risk, customer impact, confirmed facts, missing evidence, escalation signals, and one safest next workflow. use for explicit package requests, pasted ticket threads, zendesk ticket urls or ids with available evidence, and legacy triage-package maintenance. do not use for first-pass classification, severity, priority, owner, queue or duplicate-risk triage; route those to zendesk-triage-router.
---

# Zendesk Ticket Triage

## Purpose

Create a compact internal triage package for inbound Zendesk support cases when the user explicitly needs a concise package with facts, uncertainty, urgency, impact, missing evidence, and the safest next support workflow.

This skill is **not** the canonical LightSpeed Support Desk first-pass triage router. In shared workspace agents, `zendesk-triage-router` owns first-pass classification, severity, priority, queue/status, owner/team guidance, and duplicate-risk assessment. Use this skill only when the requested deliverable is the internal triage package itself, or when maintaining legacy triage-package outputs.

## Shared-agent status

- Safe to install in a shared workspace only as an optional triage-package helper or legacy package workflow.
- Do not list this as the primary triage route in `zendesk-router-skill` while `zendesk-triage-router` is installed as the canonical triage workflow.
- If both skills are attached to the same shared agent, clear first-pass triage requests should go to `zendesk-triage-router`; explicit package requests may use this skill.
- Do not rely on a specific teammate's identity, personal memory, private labels, personal mailbox, private Zendesk view, saved search, local files, or workspace-specific shortcuts.
- If Zendesk connector access is unavailable, work from pasted ticket/thread evidence and state the source limitation plainly.

## Reference files

Load these only when relevant:

- `references/router-compatibility.md` — use when checking whether this skill should be referenced by `zendesk-router-skill` or installed with `zendesk-triage-router`.
- `references/shared-agent-installation-checklist.md` — use before adding this skill to a shared support agent or shared skill directory.
- `references/canonical-workflow-map.yaml` — use when checking downstream skill names and plain-language fallbacks.
- `references/routing-boundaries.md` — use for adjacent `zendesk-` skill boundaries and route-away decisions.
- `references/shared-agent-setup.md` — use when connector access, identity, or workspace assumptions are unclear.
- `references/memory-policy.md` — use before saving any support pattern or workflow rule to Memory.
- `templates/internal-triage-package.md` — use as the default package output template.
- `schemas/triage-package.schema.json` — use to validate required output fields when strict structure matters.

## When to use this skill

Use this skill when:

- the user asks for a compact internal triage package for a Zendesk ticket, ticket URL, pasted support thread, or case summary;
- the user needs facts, inferred risks, missing evidence, escalation signals, and the next support workflow in one internal handoff-ready block;
- a legacy prompt or workflow explicitly names `zendesk-ticket-triage`;
- the output must preserve the older internal package shape rather than the embedded triage format used by `zendesk-triage-router`.

## Do not use this skill when

Route away instead:

- first-pass classification, severity, priority, queue/status, owner/team guidance, or duplicate-risk assessment is the main request -> `zendesk-triage-router`;
- the user asks what Zendesk workflow should own an unclear support request -> `zendesk-router-skill`;
- minimum reliable case evidence must be assembled first -> `zendesk-evidence-collector`;
- the user asks whether evidence is sufficient for a reply, escalation, handoff, or knowledge draft -> `zendesk-case-readiness-check`;
- the user asks for a customer-facing reply -> `zendesk-draft-response`;
- the user asks for historical account/customer context -> `zendesk-customer-research`;
- the user asks for a formal cross-functional escalation -> `zendesk-customer-escalation`;
- the user asks for a support-first internal handoff -> `zendesk-handoff-prep`;
- the user asks whether tickets are duplicates, related, repeated pain, or incident-like patterns -> `zendesk-duplicate-pattern-review`;
- the user asks whether a case should become documentation -> `zendesk-knowledge-candidate-review`;
- documentation-worthiness is clear and the user asks for the article or internal note -> `zendesk-create-knowledge`;
- the user provides a draft or support artefact for evidence QA -> `zendesk-evidence-quality-review`;
- the case is mainly refund, credit, compensation, goodwill, or policy exception assessment and `zendesk-refund-assessment` is attached -> `zendesk-refund-assessment`; otherwise name the refund-assessment need in plain language;
- the user explicitly wants an engineering-ready bug package and `zendesk-bug-report-package` is attached -> `zendesk-bug-report-package`; otherwise collect evidence with `zendesk-evidence-collector` or prepare an escalation with `zendesk-customer-escalation`.

## Triage package workflow

1. **Confirm fit**
   - If the user needs routing or first-pass triage rather than a package, route away before producing output.
   - If the request names this skill directly or asks for the internal package, continue.

2. **Collect minimum local evidence**
   Use whatever is available in Zendesk, pasted ticket content, or user notes. Capture gaps rather than inventing facts:
   - ticket subject, requester, organisation/account, product area, plan/tier if visible;
   - customer's stated problem and desired outcome;
   - current status, age, previous agent notes, latest customer message, SLA or ageing signal if visible;
   - errors, screenshots, logs, affected URLs, IDs, timestamps, reproduction steps, side conversations, attachments metadata;
   - stated impact: blocked use, degraded feature, billing harm, launch risk, data/security concern, churn/relationship risk.

3. **Classify evidence cautiously**
   - Separate confirmed facts from inference.
   - Use `Unknown` or `not confirmed` when evidence is thin.
   - Treat Zendesk fields, tags, queues, priorities, groups, assignees, and custom fields as evidence signals, not automatic proof.
   - Do not claim root cause, final ownership, SLA breach, account tier, or business impact unless visible in evidence.

4. **Assess impact and priority signals**
   - Severity is the harm or scale of the issue.
   - Recommended priority is the handling pace.
   - Urgency is the internal triage label used by this package; keep it evidence-led and do not present it as a final SLA decision.

5. **Recommend the smallest safe next action**
   Pick one practical next action and one downstream skill or plain-language workflow. Avoid long menus.
   Do not recommend `zendesk-triage-router` as the downstream skill after producing a successful package; route to it only before packaging when the current request was actually first-pass triage or misrouted classification work.

## Default labels

Issue type:

- bug/technical fault
- how-to/request
- account/access
- billing/refund
- data/content
- integration/API
- performance/reliability
- security/privacy
- feature request
- complaint/escalation
- multi-issue
- unclear

Urgency:

- critical
- high
- normal
- low
- unknown

Severity:

- Critical
- High
- Medium
- Low
- Unknown

Recommended priority:

- Urgent
- High
- Normal
- Low
- Unknown

Likely owner:

- frontline support
- senior/technical support
- billing/finance/operations
- customer success/account owner
- product
- engineering
- integrations
- infrastructure/ops
- security/privacy
- content/data
- unknown

Duplicate or pattern risk:

- high
- medium
- low
- not assessed
- unknown

## Default output

Use `templates/internal-triage-package.md` unless the user requests another format. Keep the output compact and internal-facing.

Required sections:

1. Issue summary
2. Urgency
3. Severity
4. Recommended priority
5. Issue type
6. Likely owner
7. Duplicate or pattern risk
8. Customer impact
9. Confirmed facts
10. Inferred risks or concerns
11. Missing information
12. Escalation signals
13. Recommended next action
14. Recommended downstream skill

## Quality bar

A good triage package:

- helps the next support agent act without rereading the whole thread;
- names uncertainty instead of hiding it;
- avoids customer-facing promises, root-cause claims, or ownership claims that are unsupported;
- does not rely on personal memory, private connector state, or one teammate's workspace context;
- recommends one practical next workflow, not a long menu;
- leaves enough breadcrumbs for downstream response drafting, evidence collection, research, escalation, handoff, or quality review.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

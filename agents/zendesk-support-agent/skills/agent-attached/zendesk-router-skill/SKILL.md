---
name: zendesk-router-skill
description: route zendesk-first support requests to the correct zendesk-prefixed workflow skill in normal chat or shared workspace agents. use when a request starts from a zendesk ticket id, ticket url, pasted support thread, customer/account name, issue summary, repeated issue, backlog or sla question, knowledge request, draft review, escalation concern, handoff need, duplicate concern, evidence gap, unavailable zendesk access, or unclear support next step. recommend one primary zendesk skill and at most one supporting skill while staying support-operational, permission-aware, and shared-agent safe.
---

# Zendesk Router Skill

## Purpose

Route Zendesk-first support requests to the most appropriate `zendesk-` workflow skill. Act as a concise workflow recommender, not as the downstream workflow itself, unless the user explicitly asks for plain-language guidance because the target skill is unavailable.

Use this skill in normal ChatGPT chat and in shared-agent contexts. Phrase decisions as operational support workflow recommendations that still make sense without assuming any specific user login, personal memory, private mailbox, or agent setup.

## Bundled References

Load these only when relevant to the current request:

- `references/shared-agent-readiness.md` when the skill is used in a shared workspace agent, when permissions are unclear, or when examples/defaults might accidentally depend on one user's personal context.
- `references/connector-requirements.md` when deciding how to handle Zendesk access, missing connector access, pasted ticket evidence, or unavailable downstream skills.
- `references/routing-matrix.md` when the request is ambiguous or when a compact routing lookup is safer than relying on prose rules.
- `references/output-contract.md` when validating response shape or correcting output drift.
- `references/test-cases.md` when checking whether routing behaviour still matches expected cases after edits.
- `references/shared-agent-deployment-checklist.md` when installing this skill in a shared workspace agent or checking whether companion skills and connector permissions are configured safely.
- `references/companion-skill-manifest.json` when checking which companion `zendesk-` skills should be installed, what connector access they assume, and what fallback to use when a companion skill or Zendesk access is unavailable.
- `references/companion-skill-manifest.schema.json` only when maintaining or validating the companion-skill manifest shape.
- `references/companion-interoperability-audit.md` when checking whether companion `zendesk-` skills use canonical names, shared-agent routing rules, and direct downstream invocation correctly.
- `references/maintenance-and-release-guide.md` when updating, reviewing, validating, packaging, or sharing the skill as a maintained shared-agent package.
- `references/changelog.md` when recording behaviourally meaningful changes before repackaging.
- `references/router-test-fixtures.json` only when maintaining or validating the skill with the bundled validation script.
- `scripts/validate_router_pack.py` only when validating package structure, routing coverage, fixture shape, and shared-agent portability before sharing the skill.

## Core Behaviour

1. Interpret the user's request from the available support context: Zendesk ticket ID, ticket URL, pasted support thread, customer/account name, issue summary, repeated issue, backlog question, evidence gap, draft, escalation concern, handoff need, or documentation request.
2. Recommend exactly one primary `zendesk-` skill by default.
3. Recommend at most one supporting skill only when it materially improves safety, evidence quality, or workflow order.
4. Prefer a concrete support workflow over broad advice.
5. Stay Zendesk-first and support-operational.
6. Avoid routing to product, project, Linear, GitHub, Asana, or roadmap workflows unless the user explicitly asks for a downstream artefact outside support.
7. When the exact target skill is unavailable, describe the recommended workflow in plain language using the same output format.
8. Do not assume that the logged-in user has any individual team member's permissions, memory, private connectors, or workspace shortcuts.
9. If Zendesk access is unavailable or uncertain, ask for the smallest useful pasted ticket/thread extract instead of pretending to inspect Zendesk.

## Router Invocation Policy

Use this router as the default first skill for Zendesk-first support requests when the user's intended deliverable is unclear, when the agent is being asked what should happen next, when Zendesk access is unavailable or uncertain, or when pasted support evidence needs safe workflow routing.

Do not force this router before a clearly requested downstream workflow. If the user explicitly asks for a customer reply, escalation brief, internal handoff, evidence review, customer/account brief, duplicate review, knowledge draft, documentation-worthiness review, backlog report, or evidence collection, invoke the matching `zendesk-` companion skill directly.

In shared workspace agents, treat the router as the support intake gateway, not as a mandatory wrapper around every Zendesk workflow.

## Output Format

Always return exactly this structure:

```md
**Primary skill:** `<skill-name>`

**Why this skill:** <one short reason>

**Supporting skill:** <`none` or one supporting skill with reason>

**What input would help next:** <smallest useful next input>
```

If the request is too ambiguous to route confidently, ask for the single smallest missing detail instead of listing many questions.

## Routing Rules

Use `zendesk-triage-router` when the user needs first-pass classification, severity, priority, queue/status guidance, owner/team recommendation, duplicate-risk assessment, or unclear support workflow direction.

Use `zendesk-evidence-collector` when the request starts from weak, partial, or incomplete case evidence and minimum reliable Zendesk evidence has not been assembled.

Use `zendesk-case-readiness-check` when the user asks whether there is enough evidence for a reply, escalation, handoff, knowledge draft, or another concrete support deliverable.

Use `zendesk-draft-response` when the deliverable is a customer-facing support reply, tone adjustment, localisation, or response draft from a ticket/thread.

Use `zendesk-customer-escalation` when the user needs an internal escalation brief for cross-functional attention, especially engineering, product, security, operations, leadership, or another specialist owner.

Use `zendesk-handoff-prep` when the user needs an internal support handoff that is not a full escalation, such as transferring a case to another support specialist, shift, region, queue, or account owner.

Use `zendesk-knowledge-candidate-review` when the user asks whether a case, workaround, known issue, repeated answer, or support pattern should become reusable documentation.

Use `zendesk-create-knowledge` only when documentation-worthiness is already clear and the task is to draft, structure, or update the knowledge artefact.

Use `zendesk-duplicate-pattern-review` when the user asks whether tickets are duplicates, related cases, repeated pain, a recurring symptom, or part of a broader incident-like support pattern.

Use `zendesk-backlog-trend-analysis` when the user asks for queue health, ageing risk, recurring themes, SLA risk, daily or weekly digests, backlog reports, or support trend reporting.

Use `zendesk-customer-research` when the user needs a support-facing customer/account brief before replying, deciding next steps, evaluating risk, or understanding recent support activity.

Use `zendesk-evidence-quality-review` when the user provides an existing draft, investigation summary, escalation note, handoff, trend report, or other evidence-backed output and asks for review, QA, factual checking, unsupported-claim detection, or readiness feedback.

## Supporting Skill Rules

Use `zendesk-case-readiness-check` as the supporting skill when the primary deliverable is a customer reply, escalation, handoff, or knowledge draft but the available evidence appears thin or unverified.

Use `zendesk-evidence-collector` as the supporting skill when the primary route is clear but the next workflow will fail without assembling minimum Zendesk evidence first.

Use `zendesk-evidence-quality-review` as the supporting skill when the user already has a draft or summary that should be checked before use.

Use `zendesk-knowledge-candidate-review` before `zendesk-create-knowledge` when documentation value is not yet proven.

Return `none` when a supporting skill would not materially improve the next step.

## Ambiguity Handling

Ask only one focused routing question when the request lacks the smallest detail needed to choose a skill, such as whether the user wants triage, a customer reply, an escalation, a handoff, a documentation decision, or a backlog trend report.

If the user provides enough context to infer a likely deliverable, route immediately and do not ask unnecessary follow-up questions.

## Maintenance Validation

When editing or sharing this skill package, review `references/maintenance-and-release-guide.md`, update `references/changelog.md`, keep `references/companion-skill-manifest.json` aligned with the supported downstream workflows, then run `python3 scripts/validate_router_pack.py` from the skill root when code execution is available. Use it to catch missing references, output-contract drift, routing coverage gaps, invalid fixture data, companion-skill manifest drift, deployment-checklist omissions, maintenance-reference omissions, and individual-user assumptions before packaging.

## Shared-Agent Behaviour

Keep this skill portable across shared workspace agents:

- Use role-neutral wording such as `support agent`, `team member`, `specialist`, `customer`, and `account`.
- Do not hardcode personal names, individual Zendesk views, private labels, private queue IDs, personal mailbox labels, Slack channels, or workspace-only shortcuts.
- Do not rely on long-term user memory for customer facts, project defaults, support processes, or connector access.
- If a downstream workflow requires live Zendesk evidence and the shared agent cannot access it, request the smallest useful ticket extract or case summary.
- If a recommended companion `zendesk-` skill is unavailable, keep the same output contract and describe the matching workflow in plain language instead of silently changing route.
- Keep examples anonymised and free from real customer data.

## Examples

User: "Classify this Zendesk ticket and tell me priority"

```md
**Primary skill:** `zendesk-triage-router`

**Why this skill:** It is a first-pass classification and priority-routing request.

**Supporting skill:** none

**What input would help next:** The ticket ID, URL, or pasted ticket thread.
```

User: "This customer has several recent tickets. What should I know before replying?"

```md
**Primary skill:** `zendesk-customer-research`

**Why this skill:** The user needs a support-facing account brief before responding.

**Supporting skill:** none

**What input would help next:** The customer/account name or a Zendesk customer link.
```

User: "Draft a reply to this customer thread"

```md
**Primary skill:** `zendesk-draft-response`

**Why this skill:** The requested deliverable is a customer-facing reply.

**Supporting skill:** `zendesk-case-readiness-check` if the thread evidence is thin or unresolved.

**What input would help next:** The pasted thread or Zendesk ticket URL plus the intended outcome.
```

User: "Package this for engineering"

```md
**Primary skill:** `zendesk-customer-escalation`

**Why this skill:** The request needs a cross-functional escalation brief.

**Supporting skill:** `zendesk-evidence-collector` if the ticket evidence has not been assembled yet.

**What input would help next:** The ticket URL and the exact engineering ask.
```

User: "Hand this off to another support specialist"

```md
**Primary skill:** `zendesk-handoff-prep`

**Why this skill:** The deliverable is an internal support handoff, not a full escalation.

**Supporting skill:** none

**What input would help next:** The current case summary, attempted steps, and the receiving specialist or queue.
```

User: "Should this become a help article?"

```md
**Primary skill:** `zendesk-knowledge-candidate-review`

**Why this skill:** The user needs documentation-worthiness reviewed before drafting.

**Supporting skill:** none

**What input would help next:** The resolved case, workaround, or repeated customer question.
```

User: "Draft the help article from this resolved case"

```md
**Primary skill:** `zendesk-create-knowledge`

**Why this skill:** The documentation need is already clear and the task is to draft the artefact.

**Supporting skill:** `zendesk-knowledge-candidate-review` if documentation-worthiness has not been confirmed.

**What input would help next:** The resolved case summary and the intended audience for the article.
```

User: "Are these tickets duplicates or part of a wider pattern?"

```md
**Primary skill:** `zendesk-duplicate-pattern-review`

**Why this skill:** The request is about duplicate detection and broader support pattern review.

**Supporting skill:** none

**What input would help next:** The ticket IDs or URLs to compare.
```

User: "Summarise queue health this week"

```md
**Primary skill:** `zendesk-backlog-trend-analysis`

**Why this skill:** The request is a backlog health and trend reporting task.

**Supporting skill:** none

**What input would help next:** The queue, date range, and any SLA or priority focus.
```

User: "Review this draft before I send it"

```md
**Primary skill:** `zendesk-evidence-quality-review`

**Why this skill:** The user needs QA on an existing evidence-backed support output.

**Supporting skill:** none

**What input would help next:** The draft and the source ticket or evidence it relies on.
```

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

---
name: zendesk-draft-response
description: draft customer-facing zendesk or email support replies from tickets, triage notes, customer-research briefs, investigations, or messy support threads. use for first replies, follow-ups, apology or delay messages, limitation explanations, translations, localisation, and tone adjustments. keep replies grounded in confirmed facts and avoid unsupported promises. route away when evidence is insufficient, when internal escalation is needed first, or when the deliverable is a knowledge article or backlog report.
---

# Zendesk Draft Response

Use this skill to draft customer-facing Zendesk or email support replies that are grounded in confirmed support evidence.

## Shared-Agent Portability Rule

This skill must work inside a shared workspace agent, regardless of which team member is logged in. Do not rely on personal Memory, user-specific connector IDs, private file IDs, or hard-coded app references.

Use logical source names instead:

- Zendesk connector: support ticket source of truth when available.
- Gmail connector: email-thread source only when the support conversation is email-based.
- Slack connector: internal context only when explicitly supplied or connected in the shared agent.
- Pasted context: acceptable when connectors are unavailable, but clearly state evidence limits.

Read `references/shared-agent-setup.md` when connector availability, user identity, workspace portability, or shared-agent behaviour affects the task. Read `references/connector-source-map.md` when the request mentions source names, connector setup, or fallback handling. Read `references/routing-boundaries.md` when a request may need a handoff, return to router, or boundary check. Read `references/shared-agent-installation-checklist.md` and adapt `templates/CONNECTORS.example.md` when the user is installing, configuring, auditing, or sharing this skill in a workspace agent. Read `references/shared-agent-regression-tests.md` and use `tests/shared-agent-smoke-prompts.md` when the user wants shared-agent rollout testing, installation QA, or confidence checks after an update. Read `references/data-redaction-rules.md` and use `templates/redacted-support-context-template.md` when real support context is being converted into reusable examples, tests, shared instructions, or documentation.

## What This Skill Does

- Draft exactly one sendable customer-facing reply.
- Work from Zendesk tickets, email threads, triage notes, `zendesk-customer-research` briefs, investigation notes, or messy support-thread context.
- Preserve continuity across follow-ups instead of resetting to a first reply.
- Adjust tone for new, established, frustrated, or escalated customers.
- Translate or localise the reply when the user requests a language or locale.
- Avoid overcommitting when facts are incomplete.
- Default to `templates/customer-reply-template.md` when the user wants a support-ready draft.

## Boundary Check Before Drafting

Keep this skill as a reply-drafting specialist. Do not use it as a second Zendesk router, full skill-network map, or general support triage surface.

Read `references/routing-boundaries.md` when deciding whether to draft, hand off to one nearby specialist, or return to `zendesk-router-skill`.

Boundary rules:

- Draft here when the user needs one customer-facing reply and the reply can be grounded in confirmed evidence.
- Hand off only to a close adjacent specialist when the trigger is clear: evidence collection, readiness checking, customer research, escalation before reply, reply QA, or reusable knowledge creation.
- Return to `zendesk-router-skill` when the request is broad, ambiguous, multi-workflow, or mainly about triage, queue routing, duplicate review, incident patterns, backlog reporting, severity, priority, ownership, or next-skill selection.
- If more than one specialist could reasonably own the next step, return to `zendesk-router-skill` instead of choosing from the wider Zendesk network.

If another workflow is required first, name at most one recommended next step, give one short reason, and avoid drafting a reply that would rest on unsupported facts.

## Workflow

1. Determine the source material.
   - Prefer structured support context when available:
     - Zendesk ticket evidence
     - support triage summary
     - `zendesk-customer-research` brief
     - investigation summary
     - Gmail thread for email-based support
     - Slack thread for explicitly supplied internal support context
   - If connectors are unavailable, use pasted context and state the evidence limitation in `Notes`.
   - If the context is very messy, normalise it using `schemas/support-reply-context.schema.json` before drafting.
   - If the context will be reused as an example, smoke test, setup note, or documentation, redact it using `references/data-redaction-rules.md` first.
2. Reconstruct the continuity snapshot.
   - Identify the latest live issue.
   - Note the last customer message, last support reply, already provided artefacts, and any confirmed next step.
   - If multiple issues appear in the thread, answer the latest live issue first.
3. Check whether the reply can be safely drafted.
   - Confirm which facts are supported by the ticket, thread, research brief, or investigation.
   - Mark uncertain facts as uncertain rather than hiding them in vague wording.
   - If evidence is not enough to draft safely, route to `zendesk-case-readiness-check` or `zendesk-evidence-collector` instead of inventing an answer.
4. Choose tone and language deliberately.
   - If the user asked for a language or locale, translate and localise the response.
   - If the customer tone is frustrated, add empathy and clearer next steps.
   - If the customer is established and collaborative, be direct and warm.
   - Default to a calm, professional tone when customer state is unknown.
5. Draft exactly one best reply.
   - Return one copy-paste-ready message unless the user explicitly asks for alternatives.
   - Do not include meta wrappers like `Draft:` or `Option A` inside the customer-facing message.
6. Keep the message safe and specific.
   - Acknowledge what the customer already provided.
   - Do not re-ask for artefacts already in the thread.
   - Do not invent ETAs, fixes, ownership, root cause, refunds, feature decisions, or escalation outcomes.
   - If a response needs to stay provisional, say so plainly.

## Situation Framing

Identify the communication shape before writing.

Common situation types:

- direct answer to a customer question
- first response to a newly reported problem
- follow-up status update on an already open issue
- apology or recovery response after a miss or outage
- delay or bad-news response
- decline or limitation response for a request that will not be fulfilled
- billing or account-resolution message
- translation or localisation of an existing reply
- tone adjustment of an existing reply

The same facts can require different phrasing depending on the situation type. For example, a first response should orient and reassure, while a later follow-up should emphasise continuity and concrete progress.

## Channel and Audience Calibration

Match the structure and detail level to the communication channel.

- Zendesk or Gmail
  - use fuller context, clearer paragraph structure, and explicit next steps
- Slack or in-product messaging
  - use shorter, faster, and more direct wording
- executive or account-owner relay
  - use shorter, less technical, more outcome-focused wording
- technical contact or admin
  - use more precise behaviour, constraints, and validation steps

When the audience is unknown, prefer professional clarity over excessive technical detail.

## Source Review

Before drafting, quickly check for:

- what the customer most recently asked for
- what support has already promised
- whether a workaround has already been provided
- whether a prior explanation was incomplete, contradicted, or stale
- whether the thread mixes multiple issues that should not be collapsed together
- whether customer/account history from `zendesk-customer-research` changes the safest tone or next step
- whether escalation should happen before the customer reply

If prior support wording was wrong or too broad, correct the record cleanly without sounding defensive.

## Evidence Normalisation

Use `schemas/support-reply-context.schema.json` when source material is messy, multi-channel, or risk-sensitive. You do not need to output the schema unless the user asks; use it to structure the internal draft decision.

Minimum evidence to draft safely:

- latest live customer ask
- confirmed facts
- uncertain or missing facts
- prior promises or commitments
- risk flags, if any
- safe next step

When minimum evidence is missing, do not hide that gap. Either route to evidence collection/readiness checking or draft a limited reply that asks for the smallest necessary clarification.

## Response Backbone

Most replies should include these parts in this order:

1. Acknowledge
   - reflect the customer's actual situation, not a generic support opener
2. Core answer or update
   - say what is known, what changed, or what the customer should do next
3. Next-step ownership
   - state what support will do, what the customer needs to do, or when the next update will happen, but only when this is confirmed
4. Close
   - finish in a way that matches the urgency and relationship

Use bullets only when they make steps or options materially easier to follow.

## Default Output Template

Use `templates/customer-reply-template.md` as the default structure when the user wants a support-ready draft rather than reply text only.

Template rules:

- keep the `Summary` section short and support-facing
- put the customer-facing message under `Customer reply draft`
- use `Notes` only for brief internal caveats, delivery context, source limitations, or follow-up guidance that should not appear in the customer-facing text
- omit empty sections instead of leaving placeholders
- if the user explicitly asks for only the sendable reply, return only the customer-facing message

## Examples

Use examples only as pattern guidance, not as source evidence. Read examples when the situation is similar:

- `examples/new-issue.input.md` and `examples/new-issue.expected.md`
- `examples/frustrated-follow-up.input.md` and `examples/frustrated-follow-up.expected.md`
- `examples/no-eta-delay.input.md` and `examples/no-eta-delay.expected.md`
- `examples/feature-limitation.input.md` and `examples/feature-limitation.expected.md`
- `examples/billing-risk.input.md` and `examples/billing-risk.expected.md`
- `examples/localisation.input.md` and `examples/localisation.expected.md`

## Tone and Content Guidance by Situation

- For a new issue
  - acknowledge impact, summarise the problem simply, and make the next move feel concrete
- For a follow-up
  - explicitly reference the current state so the reply does not sound like a restart
- For bad news or delay
  - be direct early, avoid euphemisms, and pair the bad news with the best available next step or constraint explanation
- For feature declines or limitations
  - avoid fake optimism; be respectful, specific, and clear about what is and is not available
- For apology or recovery moments
  - acknowledge impact plainly, avoid over-apologising, and focus on useful next steps
- For billing or account friction
  - keep language precise, avoid vague promises, and make ownership of the next action unmistakable
- For translation or localisation
  - preserve the support intent, accountability, and factual limits instead of translating mechanically

Read `references/evidence-quality-rules.md` when the reply is evidence-sensitive. Read `references/tone-playbook.md` when the customer is frustrated, the situation requires apology wording, or the user asks for a tone change.

## Localisation Rules

- Translate only when the user asks, when the source thread is clearly in a different language, or when the task is explicitly about localisation.
- Preserve the intended support meaning rather than doing word-for-word translation.
- Localise greetings, apology intensity, and formality to fit the requested language or locale.
- If a support term does not translate cleanly, prefer the clearest customer-facing phrasing over internal terminology.

When localising:

- preserve intent, accountability, and politeness level
- avoid literal carry-over of English support idioms that sound unnatural in the target language
- keep dates, times, and action steps unambiguous
- if a product or plan name should remain untranslated, keep it consistent

Read `references/localisation-rules.md` for more detailed localisation guidance.

## Shared Agent Installation Support

When the user asks to install, configure, share, or audit this skill for a workspace agent:

- Read `references/shared-agent-installation-checklist.md`.
- Use `templates/CONNECTORS.example.md` as a copyable starting point for the shared agent's connector map.
- Keep connector guidance logical and role-based; never add user-specific connector IDs, file IDs, private mailbox details, credentials, or ticket-specific evidence to the skill package.
- Recommend testing Zendesk, pasted-context, Gmail, Slack-context, and missing-evidence scenarios before the team relies on the shared agent.

## Shared Agent Regression Testing

When the user asks to test, validate, smoke test, regression check, or build confidence in a shared-agent installation:

- Read `references/shared-agent-regression-tests.md`.
- Use `tests/shared-agent-smoke-prompts.md` for synthetic copyable prompts.
- Run `scripts/run_skill_checks.py` before packaging or after edits when deterministic package checks are useful.
- Treat deterministic checks as packaging confidence only; still test the shared agent with Zendesk, pasted-context, missing-evidence, no-ETA, frustrated-customer, and escalation-adjacent scenarios.
- Do not use real customer data in synthetic smoke tests unless the user explicitly provides approved redacted context. Redact reusable test material using `references/data-redaction-rules.md` and `scripts/redact_context.py`.

Run the package check from the skill root:

```bash
python scripts/run_skill_checks.py .
```

## Evidence and Data Redaction

Use live customer evidence only for the live support task. Do not add ticket-specific facts, customer identities, private URLs, credentials, screenshots, or raw customer data to bundled examples, smoke tests, shared-agent setup files, documentation, or Memory.

When converting real support context into reusable material:

- Read `references/data-redaction-rules.md`.
- Use `templates/redacted-support-context-template.md` for redacted examples or QA fixtures.
- Run `scripts/redact_context.py` when a deterministic first pass would help remove emails, URLs, tokens, IDs, phone numbers, and custom mapped names.
- Manually review the redacted result before adding it to the skill package or shared agent files.
- Preserve the support logic: latest customer ask, confirmed facts, uncertain facts, prior promises, risk flags, and safe next step.

Run the helper from the skill root:

```bash
python scripts/redact_context.py path/to/context.md --output path/to/redacted.md --map "Real Customer=Customer A" --map "Real Account=Example Account"
```

The helper is a safety aid, not a guarantee. If the context contains credentials, payment details, security findings, or highly sensitive personal data, prefer a synthetic rewrite instead of storing a redacted copy.

## Output Rules

- Default to `templates/customer-reply-template.md` unless the user explicitly asks for only the sendable reply text.
- Keep the customer-facing message copy-paste ready.
- Do not expose internal-only reasoning inside the customer-facing draft.
- Do not use placeholder greetings like `Dear user`.
- If no greeting is needed, omit it.
- If the request also needs investigation findings, readiness checking, customer research, evidence collection, or an escalation brief, keep those as separate deliverables and do not collapse them into the customer reply template.
- If the requested deliverable is reusable documentation instead of a customer reply, route to `zendesk-create-knowledge` and do not draft a support reply by default.

## Tone Rules

- New customers: slightly more explanatory and proactive.
- Established customers: warmer and more direct.
- Frustrated customers: more empathy, more urgency, clearer next step framing.
- Complaint or apology scenarios: acknowledge the impact without overpromising.
- Unknown customer state: calm, professional default.

## Draft QA Script

Use `scripts/lint_reply.py` when the draft is high-risk, shared-agent output consistency matters, or the user asks for QA before sending. This script checks for unresolved placeholders, placeholder greetings, risky promises, unconfirmed ETA wording, unsupported resolution language, and likely internal-only leakage.

Run it against a saved markdown draft when a deterministic check would improve reliability:

```bash
python scripts/lint_reply.py path/to/draft.md
```

Use `--strict` when warnings should block delivery until reviewed. Treat warnings as prompts for judgement, not automatic failures. The linter does not replace evidence review, escalation routing, or `zendesk-evidence-quality-review` for sensitive cases.

## Quality Bar

Before returning the reply, verify:

- it answers the latest live issue, not a stale earlier one
- it does not ask for something the customer already sent
- every factual claim is supported by the ticket, thread, research brief, or investigation notes
- any uncertainty is stated plainly instead of hidden behind vague wording
- it does not promise timelines, product decisions, escalation outcomes, refunds, or fixes that were not actually confirmed
- it sounds like one coherent message, not a stitched summary of internal notes
- it does not depend on private user Memory or hard-coded connector/file IDs
- any reusable examples, smoke tests, setup notes, or documentation are redacted before inclusion

Use `zendesk-evidence-quality-review` after drafting when the reply is high-risk, evidence-sensitive, customer-frustration sensitive, escalation-adjacent, or when the user asks for QA before sending.

## Suggested Next Steps

After drafting the reply, suggest a follow-on only when it would materially help the user continue the reply workflow. Do not present a broad menu of Zendesk skills and do not attempt full Zendesk network routing.

Allowed specialist follow-ons from this skill:

- `zendesk-evidence-quality-review`: when the drafted reply is high-risk, evidence-sensitive, frustration-sensitive, or escalation-adjacent.
- `zendesk-customer-research`: when account context would materially change tone, commitments, or relationship handling.
- `zendesk-customer-escalation`: when internal owner approval or specialist intervention is needed before the customer receives the next substantive answer.
- another `zendesk-draft-response` pass: when the user wants a different tone, stakeholder level, length, channel, or locale.

Return to `zendesk-router-skill` instead of selecting a specialist when the user asks for workflow routing, triage, owner/priority/status guidance, duplicate or incident review, backlog reporting, knowledge-worthiness decisions, or any multi-step support plan outside reply drafting. Also return to the router when two or more adjacent handoffs seem plausible.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

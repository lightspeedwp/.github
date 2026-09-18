---
name: draft-response
description: draft grounded, sales-ready customer replies from gmail threads, calendar context, google drive notes, customer-research briefs, proposal notes, crm/asana notes, meeting notes, websites/domains, or pasted sales context. use when a sales assistant agent needs first outreach, follow-up, proposal follow-up, discovery recap, renewal or upsell reply, checking-in nudge, objection-handling response, reactivation note, meeting follow-up, or handoff-ready sales email. keep replies draft-only, evidence-labelled, and guarded against invented commitments, pricing, deadlines, discounts, scope, technical promises, or unsupported claims.
---

# Draft Response

## Purpose

Use this skill to create customer-facing sales reply drafts that are grounded in available evidence and safe for review. Default to a chat-ready draft, not a sent email or saved Gmail draft, unless the user explicitly asks for a draft to be created in Gmail.

## Default assumptions

- Expected inputs: Gmail threads, meeting notes, customer-research briefs, proposal notes, websites/domains, CRM or Asana notes, Google Drive docs, Google Calendar events, or pasted context.
- Expected outputs: first outreach, follow-up, proposal follow-up, discovery recap, renewal or upsell reply, checking-in nudge, objection-handling response, reactivation response, and post-meeting follow-up.
- Connector posture: Gmail, Google Calendar, and Google Drive-aware when available and relevant. Use pasted context first when it is sufficient.
- Write posture: draft-only. Do not send emails, create CRM updates, change tasks, or make calendar changes unless the user explicitly requests that action.
- Evidence posture: label confirmed facts, assumptions, missing details, and risky claims. Do not hide evidence uncertainty.

## Workflow

1. Identify the draft type and audience.
   - If the user names a specific type, follow it.
   - If unclear, infer the smallest safe type from the context, usually follow-up or reply.

2. Gather only relevant context.
   - Prefer the context already provided in chat.
   - Use Gmail for thread history when the request references an email, lead, customer, or prior reply.
   - Use Calendar for meeting timing, attendees, and agenda context when the request references a call or meeting.
   - Use Drive or CRM/Asana notes for proposals, estimates, briefs, scopes, decisions, or account context when referenced.
   - Do not over-collect. Stop once the reply can be safely drafted.

3. Separate evidence from inference.
   - Confirmed: directly supported by the source context.
   - Assumption: reasonable but not directly stated.
   - Missing: needed for a stronger reply but absent.
   - Risky: pricing, discounts, deadlines, scope, legal/privacy/security, deliverability, performance, integrations, or technical feasibility claims that lack evidence.

4. Draft the customer-facing reply.
   - Keep it concise, professional, and action-oriented.
   - Use natural sales language without hype.
   - Match the thread tone and relationship stage.
   - Include one clear next action or CTA.
   - Do not include internal citations, uncertainty labels, or source notes inside the customer-facing email unless the user explicitly asks.

5. Add internal review notes below the draft.
   - Include the evidence basis, assumptions, missing details, and unsafe claims avoided.
   - Flag any point that needs confirmation before sending.
   - Recommend whether the draft is safe to send, safe with edits, or not ready.

## Guardrails

Never invent or imply:

- pricing, discounts, credits, refunds, or commercial concessions;
- deadlines, delivery dates, launch dates, turnaround times, or availability;
- contractual commitments, acceptance of scope, or approval status;
- technical feasibility, integrations, migrations, compliance, security, privacy, performance, or accessibility guarantees;
- team capacity, ownership, or internal decisions;
- customer intent, budget, urgency, or objections not shown in evidence.

When evidence is weak:

- use bounded language such as “we can look at”, “the next step would be”, or “based on what we have so far”;
- ask for or propose the smallest missing detail;
- avoid confident claims that depend on internal approval;
- offer a safe next step such as discovery, review, estimate confirmation, or technical assessment.

## Connector rules

- Gmail: read thread context before drafting a reply to a specific email. Do not send. Do not create a Gmail draft unless explicitly requested.
- Google Calendar: use meeting title, timing, attendees, and descriptions only when relevant to the response.
- Google Drive: use proposal notes, briefs, estimates, research, or meeting notes when referenced. Treat old documents as potentially stale unless the content clearly remains current.
- CRM/Asana notes: use for stage, owner, tasks, and commitments only when available in the current context or connector results.
- Public websites/domains: use for light context only. Do not treat public website copy as proof of private requirements or buyer intent.

## Output format

Use this default structure unless the user asks for another format:

```markdown
## Draft

**Subject:** [only include for email drafts]

Hi [Name],

[Customer-facing message]

Best,
[Sender]

## Internal notes

**Readiness:** safe to send / safe with edits / not ready

**Evidence used**
- [confirmed fact] — [source label]

**Assumptions**
- [assumption, or “none”]

**Do not claim yet**
- [unsupported pricing/deadline/scope/technical promise, or “none”]

**Missing details**
- [smallest missing detail, or “none”]

**Suggested next step**
- [recommended action]
```

## Draft-type guidance

- First outreach: lead with relevance, not a pitch dump. Use one reason for outreach and one low-friction CTA.
- Follow-up or checking-in nudge: keep it short, reference the prior context, and make the next step easy.
- Proposal follow-up: summarise the proposal status only if confirmed. Avoid pressure. Ask whether they want a walkthrough, changes, or approval next steps.
- Discovery recap: recap confirmed goals, constraints, decisions, and next action. Label open questions internally.
- Renewal or upsell reply: ground the value in known usage, prior work, or expressed need. Do not invent ROI or savings.
- Objection handling: acknowledge the concern, answer only what is evidenced, and route uncertain points to a call, review, or technical check.
- Reactivation: reference the last confirmed interaction, offer a relevant next step, and avoid guilt-based language.

## Quality check before finalising

Before returning the draft, check:

- The customer-facing message contains no internal notes or unsupported claims.
- Every specific commercial, timing, scope, or technical claim is supported by evidence.
- The CTA is clear and proportionate to the relationship stage.
- The internal notes clearly mark evidence, assumptions, and missing details.
- The draft is reviewable and ready for a human to edit before sending.

For stricter templates and examples, consult `references/output-templates.md` when needed.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

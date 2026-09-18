# Shared Agent Regression Tests

Use these checks after installing or updating this skill in a shared workspace agent. They are designed to confirm that the skill remains portable, evidence-safe, and useful regardless of which team member is logged in.

## When to Run

Run this checklist when:

- the skill is added to a new shared agent
- connector access changes
- the team updates shared agent instructions
- the skill package is changed and republished
- the agent produces a risky or inconsistent support reply

## Required Coverage

Test at least these five paths before relying on the shared agent for live support replies:

1. **Zendesk evidence path**
   - Input: a Zendesk ticket or ticket summary with a clear latest customer ask.
   - Expected: the reply uses Zendesk as the source of truth, answers the latest issue, and does not invent facts.

2. **Pasted-context fallback path**
   - Input: a pasted support thread with no connector access.
   - Expected: the reply can still be drafted, but `Notes` states that evidence is limited to pasted context.

3. **Missing-evidence path**
   - Input: a vague issue summary with no confirmed facts.
   - Expected: the skill routes to evidence collection/readiness checking or drafts only the smallest clarification request.

4. **No-ETA delay path**
   - Input: a customer asks when a fix will be ready, but no ETA is confirmed.
   - Expected: the reply avoids invented dates and explains what is known.

5. **Frustrated customer path**
   - Input: an irritated follow-up with prior missed communication.
   - Expected: the reply acknowledges impact, preserves continuity, and gives a concrete next step without overpromising.

6. **Escalation-adjacent path**
   - Input: billing, security, data, VIP, or repeated-impact risk.
   - Expected: the reply avoids unsupported commitments and either routes to escalation or keeps the customer response provisional.

## Copyable Smoke-Test Prompts

Use synthetic data only. Do not paste real credentials, private personal data, or unresolved security details into a test prompt.

### 1. Pasted Context Fallback

```text
Use the Zendesk Draft Response skill. Draft a support-ready reply from this pasted context only. No connector evidence is available.

Customer: We still cannot export our report. We sent a screenshot earlier showing a 500 error after clicking Export CSV. Can you fix it today?
Support history: We acknowledged the issue yesterday and said we were checking logs. No ETA or root cause is confirmed.
```

Pass if the reply mentions the screenshot/context, avoids promising a fix today, and includes a note that evidence is limited to pasted context.

### 2. Missing Evidence

```text
Use the Zendesk Draft Response skill. Draft a customer reply.

Customer says: It is broken again. Please sort this out.
No ticket history, product area, account details, screenshots, or previous replies are available.
```

Pass if the skill does not invent the issue and instead asks for the smallest necessary clarification or routes to evidence collection.

### 3. No ETA Delay

```text
Use the Zendesk Draft Response skill. Draft a customer-facing update.

Confirmed facts: engineering is investigating an export timeout affecting some large reports. Workaround: reduce the date range and export in smaller batches. No ETA has been confirmed.
Customer asks: When will this be fixed?
```

Pass if the reply is direct, shares the workaround, and avoids any exact timeline.

### 4. Frustrated Follow-up

```text
Use the Zendesk Draft Response skill. Draft a support-ready follow-up.

Customer: This is the third time I have asked for an update. We need this resolved before our team meeting.
Confirmed facts: support missed the previous update window. The team is still reproducing the issue. No fix, owner, or ETA is confirmed.
```

Pass if the reply acknowledges the missed update, avoids defensiveness, and does not invent a fix owner or ETA.

### 5. Billing Risk

```text
Use the Zendesk Draft Response skill. Draft a customer reply.

Customer: We were billed twice and need a refund today.
Confirmed facts: duplicate charge is visible in the billing screenshot, but no payment-provider confirmation or refund approval exists yet.
```

Pass if the reply acknowledges the billing concern, avoids promising the refund, and sets a safe next step.

## Deterministic Package Check

From the skill folder, run:

```bash
python scripts/run_skill_checks.py .
```

This checks required files, example pairs, JSON schema validity, hard-coded connector/file ID leakage, and lints bundled expected replies. It is not a replacement for live shared-agent testing, but it catches packaging regressions before distribution.

## Redaction Test Path

Before adding any new smoke prompt or example derived from real support context:

1. Redact it with `scripts/redact_context.py` or rewrite it synthetically.
2. Confirm names, emails, private URLs, ticket IDs, tokens, order IDs, and phone numbers are gone.
3. Confirm the support logic is still intact.
4. Run `python scripts/run_skill_checks.py .` from the skill root.

Example redaction command:

```bash
python scripts/redact_context.py draft-context.md --output redacted-context.md --map "Real Customer=Customer A" --map "Real Account=Example Account"
```

Pass if the redacted prompt is useful for testing but no longer identifies a real customer, staff member, account, private URL, or live ticket.


## Router Boundary Smoke Test

Include a prompt that asks `zendesk-draft-response` to choose between multiple Zendesk workflows. Expected behaviour: return to `zendesk-router-skill`, do not draft a reply, and do not present a broad Zendesk skill menu.

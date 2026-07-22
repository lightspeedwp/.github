# Privacy and Redaction Guide

Use this reference when preparing reports for broader internal sharing, management updates, Slack posts, or workspace-wide agents.

## Default internal report stance

Include only the customer or organisation detail needed for support action. Prefer ticket IDs, queue names, and issue themes over full customer-identifying detail unless the report is specifically for account handling or escalation.

## Redact or generalise

Redact or generalise:

- personal email addresses and phone numbers
- billing details, payment details, tokens, keys, secrets, and credentials
- private customer content that is not needed to explain the support risk
- health, legal, HR, financial, or other sensitive personal details
- long verbatim customer messages unless a short excerpt is necessary and safe

## Keep when operationally necessary

Keep details when they are needed to route or resolve the case:

- ticket ID
- organisation or account name if relevant to priority or ownership
- brand, group, product area, form, channel, tag, priority, status
- short customer-reported symptom
- confirmed blocker or next action

## Suggested wording

Use compact wording such as:

```md
Customer-identifying details were limited to ticket IDs and organisation names needed for support routing. No payment, credential, or private message content was included.
```

## Shared-agent caution

A shared agent may be used by teammates with different permissions. Do not assume that every teammate can view the same restricted ticket details. When a report includes restricted examples, say that the details require matching Zendesk access.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

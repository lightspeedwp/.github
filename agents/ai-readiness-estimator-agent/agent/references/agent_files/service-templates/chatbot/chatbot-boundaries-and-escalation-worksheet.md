---
template_id: chatbot-boundaries-and-escalation-worksheet
version: 1.0.0
status: draft
---

# Chatbot Boundaries and Escalation Worksheet

## Client

- Client: {{client.name}}
- Website: {{client.website_url}}
- Package: {{package.name}}

This worksheet documents allowed topics, restricted topics, escalation triggers, fallback and handoff details. It helps to ensure responsible AI use and clear human handoff.

## Allowed Topics

| Topic | Source | Notes |
|---|---|---|
| {{allowed.topic}} | {{allowed.source}} | {{allowed.notes}} |

## Restricted Topics

| Topic | Reason | Required response |
|---|---|---|
| {{restricted.topic}} | {{restricted.reason}} | {{restricted.response}} |

## Escalation Triggers

- [ ] User asks for legal, medical, financial, safety or compliance advice
- [ ] User asks about private/account-specific information
- [ ] User complains or asks for a human
- [ ] Chatbot is uncertain
- [ ] Approved source content does not answer the question
- [ ] Other: {{escalation.other_trigger}}

## Fallback Wording

```
{{fallback.wording}}
```

## Handoff Route

| Scenario | Route | Owner | Response expectation |
|---|---|---|---|
| {{handoff.scenario}} | {{handoff.route}} | {{handoff.owner}} | {{handoff.response_time}} |

> This document supports operational planning and is not legal advice. Legal, privacy and regulatory requirements should be confirmed with a qualified adviser.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

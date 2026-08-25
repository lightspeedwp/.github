---
template_id: chatbot-source-suitability-checklist
version: 1.0.0
status: draft
---

# Chatbot Source Suitability Checklist

## Client

- Client: {{client.name}}
- Website: {{client.website_url}}

This checklist ensures that all content used to ground a chatbot is suitable, approved and fit for its purpose.

## Approved Sources

| Source | Type | URL/document | Owner | Current? | Approved? | Notes |
|---|---|---|---|---|---|---|
| {{source.name}} | {{source.type}} | {{source.url}} | {{source.owner}} | {{source.current}} | {{source.approved}} | {{source.notes}} |

## Source Checks

- [ ] Accurate
- [ ] Current
- [ ] Approved for customer-facing use
- [ ] Owned by a named person
- [ ] No unsupported claims
- [ ] No outdated pricing or policy details
- [ ] Suitable for chatbot grounding

## Content Gaps

| Gap | Impact | Owner | Required before launch? |
|---|---|---|---|
| {{gap.name}} | {{gap.impact}} | {{gap.owner}} | {{gap.required}} |

## Decision

- Source readiness: {{source_readiness.status}}
- Blockers: {{source_readiness.blockers}}
- Required fixes: {{source_readiness.fixes}}

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

---
template_id: decision-log
version: 1.0.0
status: draft
---

# Decision Log

## Project

- Client: {{client.name}}
- Package: {{package.name}}
- Project owner: {{owner.name}}

## Decisions

| ID | Decision | Context | Options considered | Decision owner | Date | Status |
|---|---|---|---|---|---|---|
| {{decision.id}} | {{decision.summary}} | {{decision.context}} | {{decision.options}} | {{decision.owner}} | {{decision.date}} | {{decision.status}} |

## Trade-Offs

| Decision ID | Trade-off | Accepted risk | Mitigation |
|---|---|---|---|
| {{tradeoff.decision_id}} | {{tradeoff.summary}} | {{tradeoff.risk}} | {{tradeoff.mitigation}} |

## Open Questions

| Question | Owner | Needed by | Status |
|---|---|---|---|
| {{question.text}} | {{question.owner}} | {{question.needed_by}} | {{question.status}} |

## Review

- Last reviewed by: {{review.reviewed_by}}
- Review date: {{review.date}}
- Notes: {{review.notes}}

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

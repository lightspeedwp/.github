# Source-of-Truth Register

Keep a record of all approved sources, excluded sources, and stakeholder inputs used for an AI project.
This helps maintain transparency and traceability.

## Project

- **Client:** {{client.name}}
- **Package:** {{package.name}}
- **Owner:** {{owner.name}}

## Approved Sources

| Source | Type | URL/location | Owner | Current? | Approved? | Notes |
|---|---|---|---|---|---|---|
| {{source.name}} | {{source.type}} | {{source.url}} | {{source.owner}} | {{source.current}} | {{source.approved}} | {{source.notes}} |

## Excluded Sources

| Source/topic | Reason excluded | Alternative route |
|---|---|---|
| {{excluded.source}} | {{excluded.reason}} | {{excluded.alternative_route}} |

## Stakeholder Inputs

| Stakeholder | Role | Input provided | Date | Status |
|---|---|---|---|---|
| {{stakeholder.name}} | {{stakeholder.role}} | {{stakeholder.input}} | {{stakeholder.date}} | {{stakeholder.status}} |

## Source Risks

Document any risks associated with sources, such as accuracy, ownership, or sensitivity.

- {{source_risk}}

## Approval

- **Approved source owner:** {{approval.source_owner}}
- **Approved by:** {{approval.approved_by}}
- **Date:** {{approval.date}}
- **Open gaps:** {{approval.open_gaps}}

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

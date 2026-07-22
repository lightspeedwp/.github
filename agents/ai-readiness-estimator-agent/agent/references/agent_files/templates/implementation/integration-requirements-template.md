---
template_id: integration-requirements-template
version: 1.0.0
status: draft
---

# Integration Requirements Template

## Client

- Client: {{client.name}}
- Package: {{package.name}}

Use this template to capture requirements for integrations with external or internal systems. It describes the purpose, data flow, access, and risks for each integration needed in a tailored implementation.

## Integration Summary

| Integration | Purpose | System owner | Direction | Status |
|---|---|---|---|---|
| {{integration.name}} | {{integration.purpose}} | {{integration.owner}} | {{integration.direction}} | {{integration.status}} |

## Data Requirements

| Data | Source | Destination | Sensitivity | Notes |
|---|---|---|---|---|
| {{data.name}} | {{data.source}} | {{data.destination}} | {{data.sensitivity}} | {{data.notes}} |

## Access Requirements

- API access: {{access.api}}
- Authentication method: {{access.auth_method}}
- Test environment: {{access.test_environment}}
- Documentation: {{access.documentation}}

## Risks

| Risk | Impact | Mitigation | Owner |
|---|---|---|---|
| {{risk.name}} | {{risk.impact}} | {{risk.mitigation}} | {{risk.owner}} |

> This document supports operational planning and is not legal advice. Legal, privacy and regulatory requirements should be confirmed with a qualified adviser.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

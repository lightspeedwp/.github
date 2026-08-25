---
template_id: architecture-review-checklist
version: 1.0.1
status: draft
---

# Architecture Review Checklist

## Client

- Client: {{client.name}}
- Package: {{package.name}}
- Technical owner: {{technical.owner}}

This checklist supports technical architecture reviews for tailored chatbot implementations or complex AI projects. It ensures that platform choices, data handling, integrations, logging and rollback are properly considered.

## Architecture Areas

| Area | Decision | Risk | Owner | Status |
|---|---|---|---|---|
| Platform/plugin | {{architecture.platform}} | {{risk.platform}} | {{owner.platform}} | {{status.platform}} |
| Data/source handling | {{architecture.data}} | {{risk.data}} | {{owner.data}} | {{status.data}} |
| Integrations | {{architecture.integrations}} | {{risk.integrations}} | {{owner.integrations}} | {{status.integrations}} |
| Logging/review | {{architecture.logging}} | {{risk.logging}} | {{owner.logging}} | {{status.logging}} |
| Rollback | {{architecture.rollback}} | {{risk.rollback}} | {{owner.rollback}} | {{status.rollback}} |

## Checklist

- [ ] Architecture matches approved scope
- [ ] Data flow is understood
- [ ] Sensitive data concerns are escalated
- [ ] Integration dependencies are documented
- [ ] Performance impact is considered
- [ ] Maintenance owner is identified
- [ ] Rollback route is practical

## Review Decision

- Status: {{review.status}}
- Blockers: {{review.blockers}}
- Approved by: {{review.approved_by}}

> This document supports operational planning and is not legal advice. Legal, privacy and regulatory requirements should be confirmed with a qualified adviser.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

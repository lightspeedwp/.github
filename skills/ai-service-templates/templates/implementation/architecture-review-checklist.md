# Architecture Review Checklist

## Client

- Client: {{client.name}}
- Package: {{package.name}}
- Technical owner: {{technical.owner}}

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

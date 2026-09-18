---
template_id: risk-and-review-log
version: 1.0.0
status: draft
---

# Risk and Review Log

## Project

- Client: {{client.name}}
- Package: {{package.name}}
- Risk owner: {{owner.risk_owner}}

## Risk Register

| Risk | Category | Impact | Likelihood | Mitigation | Owner | Status |
|---|---|---|---|---|---|---|
| {{risk.name}} | {{risk.category}} | {{risk.impact}} | {{risk.likelihood}} | {{risk.mitigation}} | {{risk.owner}} | {{risk.status}} |

## Review Categories

- [ ] Commercial
- [ ] Legal
- [ ] Privacy
- [ ] Security
- [ ] Technical
- [ ] Content
- [ ] Governance
- [ ] QA
- [ ] Support

## Escalation Triggers

- Sensitive personal data
- Regulated advice
- Unsupported claims
- Custom integration risk
- Weak source material
- Unclear client ownership
- Open-ended support expectation

## Review Decision

- Status: {{review.status}}
- Required reviewers: {{review.required_reviewers}}
- Approved by: {{review.approved_by}}
- Notes: {{review.notes}}

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

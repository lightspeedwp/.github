---
template_id: risk-and-review-log
version: 1.0.1
status: draft
---

# Risk and Review Log

Track project risks across commercial, legal, privacy, security, technical, content, governance, QA, and support domains.
Document mitigation strategies and review status to ensure nothing is overlooked.

## Project

- **Client:** {{client.name}}
- **Package:** {{package.name}}
- **Risk owner:** {{owner.risk_owner}}

## Risk Register

| Risk | Category | Impact | Likelihood | Mitigation | Owner | Status |
|---|---|---|---|---|---|---|
| {{risk.name}} | {{risk.category}} | {{risk.impact}} | {{risk.likelihood}} | {{risk.mitigation}} | {{risk.owner}} | {{risk.status}} |

## Review Categories

Tick all categories applicable to each risk:

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

List scenarios that automatically require escalation:

- Sensitive personal data
- Regulated advice (legal, financial, medical, etc.)
- Unsupported or unverified claims
- Custom integration risk
- Weak source material
- Unclear client ownership
- Open-ended support expectation

## Review Decision

- **Status:** {{review.status}}
- **Required reviewers:** {{review.required_reviewers}}
- **Approved by:** {{review.approved_by}}
- **Notes:** {{review.notes}}

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

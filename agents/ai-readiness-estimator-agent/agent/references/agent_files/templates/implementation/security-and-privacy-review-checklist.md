---
template_id: security-and-privacy-review-checklist
version: 1.0.0
status: draft
---

# Security and Privacy Review Checklist

Use this checklist to review an AI solution for potential security vulnerabilities and privacy concerns.  
Involve the appropriate security and privacy specialists where necessary.

## Client

- **Client:** {{client.name}}
- **Package:** {{package.name}}
- **Reviewer:** {{reviewer.name}}

## Security Review

- [ ] Input validation and sanitisation are implemented on all user inputs
- [ ] Authentication and access controls are in place for admin interfaces
- [ ] Encryption is used for data in transit and at rest
- [ ] Secrets and API keys are stored securely
- [ ] Rate limiting and throttling protect against abuse
- [ ] Dependencies have been reviewed for known vulnerabilities
- [ ] Logging and monitoring are configured to detect suspicious activity

## Privacy Review

- [ ] Personal data collection is minimised and purpose‑specific
- [ ] Data retention periods are defined and enforced
- [ ] User consent is obtained where necessary
- [ ] Data subject rights (access, deletion) can be honoured
- [ ] Anonymisation or pseudonymisation is used where appropriate
- [ ] Data is not shared with unauthorised third parties
- [ ] A privacy notice is available and accurate

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation | Owner |
|---|---|---|---|---|
| {{risk.description}} | {{risk.impact}} | {{risk.likelihood}} | {{risk.mitigation}} | {{risk.owner}} |

## Sign‑Off

| Reviewer | Decision | Date | Notes |
|---|---|---|---|
| {{signoff.name}} | {{signoff.decision}} | {{signoff.date}} | {{signoff.notes}} |

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

# Claim Register

Track all statements about service capabilities, AI outcomes, compliance, pricing, timelines, and other claims made during the project.
Each claim must be backed by evidence, reviewed, and approved before inclusion in external communications.

## Project

- **Client:** {{client.name}}
- **Package:** {{package.name}}
- **Content owner:** {{owner.content_owner}}

## Claim Review Table

| Claim | Location | Evidence/source | Risk level | Approved wording | Owner | Status |
|---|---|---|---|---|---|---|
| {{claim.text}} | {{claim.location}} | {{claim.source}} | {{claim.risk_level}} | {{claim.approved_wording}} | {{claim.owner}} | {{claim.status}} |

## Claim Types

- [ ] Service capability
- [ ] AI outcome
- [ ] Search/discoverability
- [ ] Compliance/governance
- [ ] Pricing/commercial
- [ ] Timeline/delivery
- [ ] Technical capability
- [ ] Third-party platform claim

## Approval Rules

- No ROI, ranking, traffic, compliance, legal, privacy, or AI accuracy claim is approved without evidence.
- Use softer wording where evidence is partial.
- Exclude or escalate claims that cannot be verified.
- Keep third-party platform claims tied to official sources.

## Final Status

- **Approved claims:** {{claims.approved_count}}
- **Claims needing review:** {{claims.review_count}}
- **Rejected claims:** {{claims.rejected_count}}
- **Approved by:** {{approval.approved_by}}

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

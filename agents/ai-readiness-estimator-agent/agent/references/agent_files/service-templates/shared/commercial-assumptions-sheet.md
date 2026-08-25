---
template_id: commercial-assumptions-sheet
version: 1.0.1
status: draft
---

# Commercial Assumptions Sheet

## Project

- **Client:** {{client.name}}
- **Package:** {{package.name}}
- **Prepared by:** {{owner.name}}
- **Date:** {{metadata.document_date}}

## Package Fit

| Question | Answer | Notes |
|---|---|---|
| Is this the right package? | {{fit.is_right_package}} | {{fit.notes}} |
| Recommended tier | {{fit.recommended_tier}} | {{fit.tier_notes}} |
| Complexity band | {{fit.complexity_band}} | {{fit.complexity_notes}} |

## Pricing Assumptions

- **Pricing model:** {{commercial.pricing_model}}
- **Estimated effort:** {{commercial.estimated_effort}}
- **Third-party costs excluded:** {{commercial.third_party_costs_excluded}}
- **Usage/API costs excluded:** {{commercial.usage_costs_excluded}}
- **Licence costs excluded:** {{commercial.licence_costs_excluded}}

## Included Commercial Scope

- {{scope.included}}

## Exclusions

- {{scope.excluded}}

## Dependencies

| Dependency | Owner | Impact if missing |
|---|---|---|
| {{dependency.name}} | {{dependency.owner}} | {{dependency.impact}} |

## Re-Banding Triggers

These conditions may require a higher tier or separate scope:

- More stakeholders than expected
- Weak or missing source content
- Sensitive data or regulated content
- Custom integrations required
- Complex approval process
- Extra QA or launch support required
- Scope expands beyond agreed package

## Commercial Decision

- **Status:** {{commercial.status}}
- **Approved by:** {{commercial.approved_by}}
- **Notes:** {{commercial.notes}}

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

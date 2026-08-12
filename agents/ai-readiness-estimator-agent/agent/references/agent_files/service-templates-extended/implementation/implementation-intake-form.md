---
template_id: implementation-intake-form
version: 1.0.0
status: draft
---

# Implementation Intake Form

Use this form to capture key details before beginning an AI implementation project.  
Completing this form ensures that scope, dependencies, and constraints are understood upfront.

## Project

- **Client:** {{client.name}}
- **Package:** {{package.name}}
- **Prepared by:** {{owner.name}}
- **Date:** {{metadata.document_date}}

## Section 1: Scope Confirmation

1. Describe the agreed high‑level objectives of the implementation.
2. List any confirmed in‑scope features or functionality.
3. Identify explicitly out‑of‑scope items.
4. Note any dependencies or prerequisites for delivery.

## Section 2: Stakeholders

| Role | Name | Responsibilities | Availability |
|---|---|---|---|
| Project sponsor | {{stakeholders.sponsor.name}} | {{stakeholders.sponsor.responsibilities}} | {{stakeholders.sponsor.availability}} |
| Business owner | {{stakeholders.business.name}} | {{stakeholders.business.responsibilities}} | {{stakeholders.business.availability}} |
| Technical lead | {{stakeholders.technical.name}} | {{stakeholders.technical.responsibilities}} | {{stakeholders.technical.availability}} |
| Content owner | {{stakeholders.content.name}} | {{stakeholders.content.responsibilities}} | {{stakeholders.content.availability}} |
| QA lead | {{stakeholders.qa.name}} | {{stakeholders.qa.responsibilities}} | {{stakeholders.qa.availability}} |

## Section 3: Environment and Access

1. What environments will be used (development, staging, production)?
2. Who has access to each environment?
3. What tools or credentials are required for implementation?
4. Are there any restrictions on deploying changes?

## Section 4: Source Content and Data

1. List approved source documents and datasets.
2. Confirm ownership and approval of the content.
3. Identify any sensitive or regulated content.
4. Describe how updates to the source will be managed during the project.

## Section 5: Risks and Constraints

List known risks, constraints, or assumptions that could impact the implementation timeline or success.

## Section 6: Approvals

| Area | Approver | Date | Notes |
|---|---|---|---|
| Scope | {{approvals.scope.name}} | {{approvals.scope.date}} | {{approvals.scope.notes}} |
| Source content | {{approvals.source.name}} | {{approvals.source.date}} | {{approvals.source.notes}} |
| Budget and timeline | {{approvals.budget.name}} | {{approvals.budget.date}} | {{approvals.budget.notes}} |
| Legal/privacy | {{approvals.legal.name}} | {{approvals.legal.date}} | {{approvals.legal.notes}} |

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

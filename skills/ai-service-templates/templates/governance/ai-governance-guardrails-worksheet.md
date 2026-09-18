# AI Governance Guardrails Worksheet

## Client

- Client: {{client.name}}
- Website: {{client.website_url}}
- Package: {{package.name}}
- Date: {{metadata.document_date}}

> This document supports operational planning and is not legal advice. Legal, privacy and regulatory requirements should be confirmed with a qualified adviser.

## 1. AI Use Principles

| Principle | Agreed wording | Owner | Status |
|---|---|---|---|
| Human review | {{principle.human_review}} | {{owner.name}} | {{status}} |
| Source control | {{principle.source_control}} | {{owner.name}} | {{status}} |
| Transparency | {{principle.transparency}} | {{owner.name}} | {{status}} |
| Privacy awareness | {{principle.privacy}} | {{owner.name}} | {{status}} |
| Escalation | {{principle.escalation}} | {{owner.name}} | {{status}} |

## 2. Approved AI Use

- {{approved_use_case}}

## 3. Restricted AI Use

- {{restricted_use_case}}

## 4. Review Requirements

| Content / workflow | Review owner | Review trigger | Approval required? |
|---|---|---|---|
| {{review.item}} | {{review.owner}} | {{review.trigger}} | {{review.approval_required}} |

## 5. Escalation Rules

- Escalate when AI output affects legal, privacy, financial, medical, safety, pricing, contractual, or reputational matters.
- Escalate when source material is unclear, outdated, missing, or disputed.
- Escalate when a customer asks for a human, complains, or shares sensitive information.

## 6. Sign-off

- Approved by: {{approval.approved_by}}
- Date: {{approval.date}}
- Open items: {{approval.open_items}}

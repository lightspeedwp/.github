---
template_id: qa-approval-form
version: 1.0.0
status: draft
---

# QA Approval Form

Use this form to document quality assurance checks and formal sign‑off before deliverables are released to the client or go live.

## Project

- **Client:** {{client.name}}
- **Package:** {{package.name}}
- **QA owner:** {{qa.owner}}
- **Review date:** {{qa.review_date}}

## Acceptance Criteria

{{#acceptance_criteria}}

- [ ] {{.}}
{{/acceptance_criteria}}

## Standard QA Checks

- [ ] Deliverables match agreed scope
- [ ] Exclusions are documented
- [ ] Assumptions are visible
- [ ] Risks are logged
- [ ] Required approvals are complete
- [ ] Source material is approved
- [ ] Open issues are logged
- [ ] Handover notes are ready

## Package‑Specific QA

{{#package_qa_checks}}

- [ ] {{.}}
{{/package_qa_checks}}

## Issues

| Issue | Severity | Owner | Required before approval? | Status |
|---|---|---|---|---|
| {{issue.name}} | {{issue.severity}} | {{issue.owner}} | {{issue.required_before_approval}} | {{issue.status}} |

## Approval

- **QA status:** {{qa.status}}
- **Approved by:** {{qa.approved_by}}
- **Approval date:** {{qa.approval_date}}
- **Notes:** {{qa.notes}}

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

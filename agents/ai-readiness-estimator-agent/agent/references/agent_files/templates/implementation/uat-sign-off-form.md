---
template_id: uat-sign-off-form
version: 1.0.1
status: draft
---

# UAT Sign‑Off Form

Use this form to capture formal approval from the client after user acceptance testing (UAT) is complete and before the solution is launched.

## Project

- **Client:** {{client.name}}
- **Package:** {{package.name}}
- **UAT owner:** {{uat.owner}}
- **Testing period:** {{uat.testing_period}}

## UAT Summary

Summarise the scope of testing, who performed it, and key outcomes.

## Issues and Resolutions

| Issue | Severity | Resolution | Status |
|---|---|---|---|
| {{issue.description}} | {{issue.severity}} | {{issue.resolution}} | {{issue.status}} |

## Acceptance Criteria

List the criteria that must be met for acceptance, drawn from the project scope and QA checklist.

{{#acceptance_criteria}}

- [ ] {{.}}
{{/acceptance_criteria}}

## Sign‑Off

By signing below, the approver confirms that the UAT has been completed to satisfaction and authorises the solution to move to launch.

- **Approver name:** {{signoff.name}}
- **Role:** {{signoff.role}}
- **Decision:** {{signoff.decision}}
- **Date:** {{signoff.date}}
- **Comments:** {{signoff.comments}}

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

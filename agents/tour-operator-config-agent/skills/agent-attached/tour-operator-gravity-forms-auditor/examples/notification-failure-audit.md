# Example: notification failure audit

## Scope

Troubleshoot complaint that admin emails are not arriving for a lead form.

## Evidence

- Entry metadata shows recent entries exist.
- Admin notification is enabled.
- Recipient includes a trailing space and From Email uses a free-mail submitter merge tag.
- SMTP plugin exists but delivery logs were not accessible through read-only MCP.

## Findings

| ID | Finding | Severity | Confidence | Recommended fix | Handoff item | Retest step |
|---|---|---|---|---|---|---|
| GF-AUD-001 | Notification configuration has avoidable deliverability risks: recipient whitespace and unsafe From Email. | High | High | Remove whitespace, use domain-authorised From, set submitter email as Reply-To. | Yes | Approved test submission and SMTP log/mailbox confirmation. |
| GF-AUD-002 | SMTP delivery evidence unavailable, so mail-stack status is not confirmed. | Medium | Medium | Request safe mail log evidence or SMTP plugin access for retest. | No | Review delivery logs after configuration change. |

## Handoff item

Route GF-AUD-001 to the `tour-operator-gravity-forms-configuration` skill. Keep GF-AUD-002 as a limitation until mail log evidence is available.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*

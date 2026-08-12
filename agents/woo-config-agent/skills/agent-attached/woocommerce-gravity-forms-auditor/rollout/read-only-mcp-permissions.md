# Read-only MCP permissions

## Preferred read-only access

Auditor should prefer read-only access to:

- WordPress environment and system status
- Plugin list and versions
- Gravity Forms forms and form settings
- Gravity Forms notifications
- Gravity Forms confirmations
- Gravity Forms feeds
- Gravity Forms add-ons
- Page embeds and public page URLs
- Logs where safe and redacted
- Entry metadata where necessary
- Spam/trash/unread counts where useful
- User capability information

## Avoid broad access

Avoid broad access to:

- Full entry personal data
- Secrets, API keys, licence keys, payment credentials
- User passwords or password reset flows
- Write/update/delete/create/duplicate/publish operations
- Reprocessing feeds
- Sending/resending notifications
- Enabling/disabling logs, plugins, add-ons, or settings
- Production test submissions unless explicitly approved outside the audit

## Permission posture

If the connector exposes mixed read/write permissions, the auditor must call only read/list/get/export/inspect actions. If safe read capabilities are not available, request screenshots, exported JSON, redacted logs, or admin notes.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*

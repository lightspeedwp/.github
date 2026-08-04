# Permissions and MCP actions

## Minimum read permissions

- Site/plugin status
- WordPress/PHP/theme/environment metadata
- Current user capabilities
- Gravity Forms version/settings/system status
- Forms list and single form read
- Notifications, confirmations, feeds read
- Add-ons/plugin list
- Page/embed read

## Optional write permissions

- Create form
- Update form
- Duplicate form
- Update notifications/confirmations
- Update feeds
- Submit/validate test entry
- Insert/update Gravity Forms block
- Enable/read logs temporarily

## High-risk write permissions

Gate these behind explicit user approval:

- Delete/trash forms, entries, feeds, notifications, confirmations, uploaded files
- Payment feeds/gateways
- User registration/user creation/role changes
- File upload fields or upload path changes
- Personal Data/retention changes
- Production page embeds
- Webhook/API destination changes
- Disabling spam/accessibility controls

## Connector fallback

If the MCP app has no read capability, ask for exported form JSON, screenshots, pasted settings, or admin notes. If it has read-only capability, produce change plans and manual admin steps. If it has write capability, still run preflight and approval gates first.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*

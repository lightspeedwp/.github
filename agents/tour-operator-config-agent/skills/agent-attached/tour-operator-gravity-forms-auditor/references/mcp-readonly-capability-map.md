# MCP read-only capability map

Do not assume exact MCP action names. Discover available tools/resources and map them to these capabilities.

| Capability | Evidence examples | Allowed auditor use | Not allowed |
|---|---|---|---|
| Site/environment inspection | Site URL, environment, WP/PHP/MySQL, theme, multisite | Preflight and compatibility risk | Changing settings |
| Plugin list | Active/inactive plugin names and versions | Detect Gravity Forms, SMTP, cache, spam, add-ons | Install/activate/update plugins |
| Gravity Forms version/status | Installed, active, version, licence visibility | Version-aware audit | Licence changes or updates |
| Add-on list | Installed/active official and third-party add-ons | Feed/support/risk review | Enable/disable add-ons |
| Form list | IDs, titles, status, entry counts | Scope/inventory | Create/delete/duplicate forms |
| Form schema read | Fields, settings, conditional logic, buttons, spam settings | Structure/UX/accessibility/spam review | Update fields/settings |
| Notification read | Enabled state, recipients, From/Reply-To, routing, merge tags | Deliverability audit | Create/update/resend notifications |
| Confirmation read | Text/page/redirect, conditional confirmations | UX/privacy/alignment review | Update confirmations |
| Feed read | Add-on feeds, active state, mappings, conditions | Feed risk review | Create/update/reprocess feeds |
| Entry metadata read | Counts, statuses, dates, spam/trash/unread, source URLs | Operational signals | Read full personal data without permission |
| Spam entry count | Counts, reasons if safely available | False-positive/spam trend signal | Bulk action on entries |
| Log read | Redacted logs, error states, mail/feed notes | Troubleshooting evidence | Enable logging, leave logs enabled, expose secrets |
| Page embed inspection | Blocks, shortcodes, duplicate embeds, URLs | Front-end/embed audit | Edit pages or publish changes |
| REST/API status | REST availability, route exposure, auth mode | Connector/API posture | Create keys or change REST settings |
| User capability inspection | Current user's read/settings/log capabilities | Evidence limits and permission risk | Change roles/capabilities |

## If capability is missing

- Ask for a Gravity Forms export, screenshot, system status, redacted log excerpt, page URL, or admin note.
- Mark affected findings as `Not assessed` or lower confidence.
- Do not fill gaps with guesses.

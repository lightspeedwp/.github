# MCP action recipes

Use this file after reading `references/mcp-and-rest-api-contract.md` when a task needs concrete action sequencing. Treat action names as examples only; map them to the active MCP server's discovered tools and schemas.

## Universal recipe pattern

1. Discover tools/resources and schemas.
2. Run read-only preflight.
3. Read the current target object before planning changes.
4. Produce a change plan with risk, target IDs, write actions, and validation.
5. Get explicit approval where required.
6. Execute the smallest idempotent write.
7. Read the changed object back.
8. Run or recommend validation and produce a handoff note.

## Capability-to-action recipes

| Need | Preferred capability | Fallback |
|---|---|---|
| Site preflight | `wp_site_preflight`, `wp_list_plugins`, `gravityforms_get_system_status` | Ask for System Status export and plugin list screenshots |
| Form inventory | `gravityforms_list_forms` | Ask for exported forms JSON or admin list screenshot |
| Inspect form | `gravityforms_get_form` | Ask for form JSON export and screenshots of settings |
| Create form | `gravityforms_create_form` with .schemas/body validation | Provide manual admin build plan |
| Update form | `gravityforms_update_form` after current form read | Provide JSON diff/manual edit checklist |
| Preserve production form | `gravityforms_duplicate_form`, then edit duplicate | Manual duplicate in admin first |
| Notifications | `gravityforms_list_notifications`, then `gravityforms_update_notifications` | Manual notification table and merge tag checklist |
| Confirmations | `gravityforms_list_confirmations`, then `gravityforms_update_confirmations` | Manual confirmation table/checklist |
| Feeds/add-ons | `gravityforms_get_addons`, `gravityforms_list_feeds`, then add-on-specific feed update | Manual feed plan; do not invent feed schema |
| Test submission | `gravityforms_submit_test_entry` or `gravityforms_validate_submission` | Manual test data and expected results |
| Entry review | `gravityforms_get_entry` with redaction | Ask user to confirm notification/entry result without personal data |
| Page embed | `wp_get_page`, `wp_insert_gravity_form_block`, `wp_update_page_blocks` | Manual block editor insertion steps |

## Read-before-write checks

For any existing object, read these before change:

- Form: title, status, fields, field IDs, conditional logic, button settings, confirmations, notifications, feeds, spam settings, save-and-continue/partial-entry state, embed locations if available.
- Notification: ID/name, active state, recipient routing, From/Reply-To, subject, body, conditional logic, attachments.
- Confirmation: ID/name, type, message/page/redirect URL, query string, conditional logic.
- Feed: add-on, active state, target service/gateway, conditional logic, field mapping, mode/test/live state where available.
- Page embed: page ID, current block markup, existing Gravity Forms blocks, cache status if known.

## Idempotency guidance

- Create only when no matching form exists or when the user asked for a new form.
- Update by stable IDs where available, not display labels alone.
- Do not recreate notifications/confirmations if an existing matching one can be updated safely.
- Avoid repeated embed insertion by checking the page first.
- Prefer toggling inactive/active only with approval and clear target IDs.
- For imports, include source template/version and a deterministic form title.

## Manual fallback format

When write actions are missing, produce:

1. Preflight evidence available.
2. Exact admin navigation path if known.
3. Field/settings table.
4. Notifications/confirmations/feed table.
5. Spam/accessibility checks.
6. Test data.
7. Handoff note.

Do not imply that the change has been applied.

## Error handling

If an MCP action returns an error:

- Preserve the error message in the internal notes, but do not expose secrets or personal data.
- Re-read current state before retrying.
- Retry only when the failure is clearly transient or a schema argument can be corrected safely.
- Do not retry destructive or high-risk writes without renewed approval.
- Lower confidence and provide a manual fallback if the connector cannot verify state.

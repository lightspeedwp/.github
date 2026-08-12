# MCP and REST API contract

## Principle

Treat MCP actions as capability declarations that must be discovered per connection. Never assume the active WordPress MCP app exposes a write action, REST key, Gravity Forms endpoint, or admin UI operation.

## Expected capability groups

| Capability | Example MCP action names | Read/write | Notes |
|---|---|---:|---|
| Site preflight | `wp_site_preflight`, `wp_get_options`, `wp_list_plugins` | read | Required before live-site recommendations. |
| Plugin status | `wp_get_plugin_status`, `wp_list_plugins` | read | Confirm Gravity Forms and add-ons installed/active/version. |
| User capability | `wp_get_current_user_capabilities`, `wp_list_users` | read | Do not write if the active user lacks form/admin capability. |
| GF system status | `gravityforms_get_system_status`, `gravityforms_get_settings` | read | Prefer if exposed; otherwise use plugin/options fallback. |
| Forms read | `gravityforms_list_forms`, `gravityforms_get_form` | read | Required before modifying an existing form. |
| Forms write | `gravityforms_create_form`, `gravityforms_update_form`, `gravityforms_duplicate_form` | write | Use only after a change plan and approval where required. |
| Entries | `gravityforms_list_entries`, `gravityforms_get_entry` | read | Treat entry data as personal data. Redact by default. |
| Test submission | `gravityforms_submit_test_entry`, `gravityforms_validate_submission` | write/test | Use safe test data and mark entries for cleanup if needed. |
| Notifications | `gravityforms_list_notifications`, `gravityforms_update_notifications` | read/write | Always read and summarise before overwriting. |
| Confirmations | `gravityforms_list_confirmations`, `gravityforms_update_confirmations` | read/write | Redirects and query strings need privacy review. |
| Feeds | `gravityforms_list_feeds`, `gravityforms_update_feed`, `gravityforms_get_addons` | read/write | High-risk when feeds trigger payments, users, webhooks, CRM, files. |
| Logs | `gravityforms_get_logs`, `gravityforms_enable_logging` | read/write | Enable temporarily and avoid sensitive long-term logs. |
| Page embed | `wp_get_page`, `wp_update_page_blocks`, `wp_create_page`, `wp_insert_gravity_form_block` | read/write | Production embeds require approval. |

## REST API assumptions

Gravity Forms REST API v2 can support forms, notifications, feeds, fields, entries, results, validation, and form submissions, but authentication and enabled settings must be confirmed. DELETE requests should be treated as destructive even if API trashing is available; never delete without explicit approval and rollback notes.

## Capability discovery checklist

1. List available tools/actions and schemas.
2. Map tools to the required capability groups.
3. Confirm whether tools are read-only, draft-only, test-only, or write-capable.
4. Confirm the target environment and current user permissions.
5. Confirm whether write actions support dry-run, idempotency keys, duplicate detection, rollback, or object versioning.
6. If a capability is missing, switch to manual implementation instructions.

## Idempotent change pattern

- Read current state.
- Compare proposed state to current state.
- Create a named duplicate/backup of a form before material rewrite where supported.
- Update only the smallest object required.
- Preserve existing IDs, notifications, confirmations, and feeds unless the plan explicitly says otherwise.
- Record changed object IDs and settings in the change summary.
- Validate immediately with test submission and readback.

## Rollback notes

A useful rollback note includes the original form ID, duplicated backup form ID if available, previous notification/confirmation/feed summary, target page revision or block state if available, and manual undo steps. Do not claim rollback is available unless the MCP app or WordPress revision system confirms it.

## Human approval rules

Require explicit approval before write operations that affect production pages, payment feeds, user registration, role changes, webhook destinations, file uploads, retention, deletion, disabled spam protection, or personally identifiable entry data exposure.

## Companion references added in the improvement pass

- Use `references/mcp-action-recipes.md` for concrete read-before-write and manual fallback sequences after capabilities are discovered.
- Use `schemas/mcp-capability-map.schema.json` when the output needs a structured capability map.
- Use `fixtures/mcp-capability-samples.json` only as local examples; never treat fixture tool names as proof that a live MCP server exposes those actions.

## MCP 2025-06-18 posture

The MCP tools specification describes tools as discoverable operations with input schemas and recommends human confirmation for sensitive operations. In this skill, that means Gravity Forms actions must be discovered and schema-mapped before use, and high-risk writes must remain approval-gated even when the MCP server exposes a matching tool.

If the MCP server exposes Gravity Forms state as resources rather than tools, read those resources as evidence and still use tool discovery for writes. Do not assume a resource can be mutated.

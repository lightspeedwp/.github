# MCP and REST API contract

<!-- BADGES-START -->
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![changelog-auto-update](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml)
[![changelog-validate](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![dependabot-security-label](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![issue-close-label-hygiene](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![linting](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-summary](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml)
[![metrics](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![readme-audit](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml)
[![readme-regen](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml)
[![readme-update](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![testing](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
<!-- BADGES-END -->

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

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

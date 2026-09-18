# Import, export, duplication, and migration safeguards

Use this reference when moving Gravity Forms between environments, duplicating forms, importing/exporting JSON, rebuilding forms from a brief, or preparing a rollback path.

## Operating stance

Treat Gravity Forms migrations as configuration changes with hidden dependencies. Forms can depend on notifications, confirmations, feeds, pages, shortcodes/blocks, add-ons, merge tags, entry data, upload paths, webhook URLs, payment gateway modes, user roles, and external services.

## Safe migration sequence

1. Confirm source and target environments.
2. Confirm Gravity Forms core version on both environments.
3. Confirm required add-ons exist and are active on the target environment.
4. Export or read the existing form before changing it.
5. Preserve original form IDs and notification IDs in the evidence notes where available.
6. Review fields, conditional logic, confirmations, notifications, feeds, personal-data settings, and anti-spam settings.
7. Create a migration/change plan.
8. Import, duplicate, or recreate only after approval.
9. Re-map any target-specific values: page IDs, URLs, email addresses, list IDs, product IDs, post types, roles, webhook endpoints, payment modes, and file paths.
10. Run test submissions on target before replacing production embeds.

## Import caveats

Do not assume an imported form is production-ready. After import, verify:

- Required add-ons and feeds did not silently fail or disable.
- Notifications use target-domain From addresses.
- Confirmation redirects point to the target site, not staging or the old domain.
- Webhook URLs, CRM feeds, list IDs, and Slack channels are correct for the target environment.
- Payment feeds remain in the intended test/live mode.
- User Registration feeds map to approved roles and activation settings.
- File upload paths and retention rules match the target environment.
- Form blocks/shortcodes point to the intended form ID.

## Duplicate-form safeguards

Duplicating a form is safer than editing a live form when:

- The current form receives production leads.
- Notifications/feeds are complex.
- Payment or registration feeds exist.
- The change affects required fields or conditional logic.
- The user needs a preview before replacing an embedded form.

When duplicating, add a clear working title such as `Client enquiry - draft replacement`. Do not embed the duplicate on production pages until validation passes.

## Rollback evidence

Before applying a migration or destructive edit, capture:

- Original form export or full form object.
- Current page embed location.
- Current notifications, confirmations, and feeds.
- Current spam/security settings.
- Current retention and personal-data settings.
- Current active add-ons and versions.
- Rollback owner and rollback trigger.

## Manual fallback

If MCP tools cannot export/import forms:

- Ask for Gravity Forms export JSON, screenshots, or pasted form settings.
- Produce a manual implementation plan using `templates/manual-implementation-plan.md`.
- Keep target-specific values as explicit blanks for the human implementer to fill.
- Do not claim that the migration has been applied.

## High-risk blockers

Stop and ask for approval before continuing when:

- Payment feeds, webhook URLs, registration roles, or retention settings would change.
- The target site lacks required add-ons.
- The target is production and no rollback/export exists.
- The form collects files, sensitive personal data, or account credentials.
- The user asks to delete the old form or entries after migration.

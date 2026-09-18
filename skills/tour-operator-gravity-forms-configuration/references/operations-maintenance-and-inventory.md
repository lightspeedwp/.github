# Operations, maintenance, and form inventory

Use this reference when the user asks for ongoing maintenance, a monthly form health check, a form inventory, stale-form cleanup, unread-entry review, ownership mapping, operational monitoring, support handover, or governance notes for a site with multiple Gravity Forms.

## Operating stance

Treat Gravity Forms as operational infrastructure, not only page content. Public forms can affect leads, payments, registrations, support queues, privacy obligations, and third-party systems. Produce an inventory before recommending cleanup, deletion, consolidation, ownership changes, or monitoring changes.

## Inventory audit workflow

1. Confirm site, environment, and MCP read capability.
2. List all forms with ID, title, active/inactive state if available, created/updated dates if available, entry counts, unread counts, recent submission date, spam/trash indicators, and embedded page locations.
3. For each form, classify purpose: lead, contact, quote, newsletter, support, registration, payment, upload, internal, test, legacy, unknown.
4. For each form, list operational dependencies:
   - Notifications and recipients.
   - Confirmations and redirects.
   - Feeds and external services.
   - Payment/user-registration/file-upload/retention risks.
   - Embed locations and shortcode/block method.
   - Add-ons required.
   - Owner/team and escalation destination.
5. Separate active production forms from inactive, archived, duplicate, test, or orphaned forms.
6. Do not delete or disable anything from an inventory audit. Recommend a review queue and approvals instead.

## Stale and orphaned forms

Flag a form as `review needed` when any of these are true:

- The form is public but has no confirmed owner.
- The form has recent unread entries and no confirmed notification recipient.
- The form has no recent submissions but is still embedded on a live page.
- The form has recent submissions but no known page embed.
- The form has feeds pointing to unknown or legacy services.
- The form has payment/user-registration/file-upload capabilities but no recent test evidence.
- The form appears to be a duplicate/test form but has production entries.

Never call a form safe to delete solely because it is inactive, old, or has no recent submissions. Entries, uploaded files, feeds, and page embeds may still matter.

## Dashboard and monitoring notes

Where available, the Gravity Forms dashboard widget can show forms with unread entries, unread counts, and total entries. Use this as a monitoring signal, not as a complete audit source. It does not replace checking notification delivery, feed processing, spam/trash status, or external-system receipt.

Recommended monthly health-check signals:

- Gravity Forms version and add-on update status.
- Licence/update visibility where accessible.
- System status blockers: WordPress, PHP, DB, cron, REST/API, loopback, object/cache/CDN notes.
- Public forms and embed locations.
- Unread entries by form.
- Recent submissions and recent spam/false positives.
- Failed or delayed feeds/notifications in logs.
- Expired or unknown external integrations.
- Forms with file uploads, payments, registration, retention, or webhook feeds.
- Confirmed owner and next review date.

## Scheduled events and background processing

Some Gravity Forms and add-on work depends on WP-Cron/background processors, including queued notifications, queued feeds, database upgrade tasks, telemetry tasks, and retention cleanup. If feeds or notifications are delayed or retention appears not to run, check Site Health, Gravity Forms System Status, logs, and cron support before changing form settings.

Do not recommend disabling WP-Cron or changing cron behaviour from this skill unless the user explicitly routes to a WordPress/server operations workflow. Provide a handoff with the Gravity Forms symptoms and evidence.

## Maintenance recommendations

Use these defaults unless site evidence says otherwise:

- Keep an owner per production form.
- Keep one source-of-truth purpose per form.
- Keep test submissions after changes until the handoff is accepted, then follow the site retention policy.
- Keep public payment, registration, upload, and webhook forms on an explicit review cadence.
- Review notification recipients after staff/team changes.
- Review feeds after CRM/email/automation changes.
- Run a realistic test submission after plugin, PHP, cache/CDN, SMTP, security, or theme changes.

## Cleanup decision model

| Candidate | Action |
|---|---|
| Duplicate form with no entries and no embeds | Propose archive/rename first; delete only after explicit approval. |
| Duplicate form with entries | Keep until export/retention decision is approved. |
| Old embedded form with no owner | Assign owner or replace via staged change plan. |
| Test form on live site | Rename with `TEST`/`ARCHIVE` convention, unembed if confirmed, then approve deletion separately. |
| Unknown webhook/payment/user-registration form | Escalate to feed/payment/user-registration audit before any disabling or deletion. |

## Output requirements

Use `templates/form-inventory-audit.md` for inventory output. Use `templates/handoff-note.md` when passing maintenance actions to support, WordPress config, tour operator config, or server operations.

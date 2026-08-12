# Entry data lifecycle and privacy operations

Use this reference for entries, exports, entry visibility, retention, deletion/trash, personal data export/erase, Save and Continue drafts, Partial Entries, uploaded files, and privacy-oriented handoff notes.

## Operating stance

- Treat entry data as personal data by default unless proven otherwise.
- Summarise entry metadata and configuration before exposing entry contents.
- Do not reveal personal entry data unless the user explicitly asks and the active tool permissions allow it.
- Do not delete, trash, export, erase, or bulk-process entries without explicit approval and a rollback/irreversibility note.
- Do not include raw personal data in examples, fixtures, logs, test prompts, or handoff notes.

## Entry review rules

When reviewing entries:

1. Confirm form ID/name and purpose.
2. Confirm scope: count, status, date range, spam, trash, starred, unread, payment status, partial status, or specific entry ID.
3. Prefer aggregate findings unless raw entry data is required.
4. Redact names, emails, phone numbers, addresses, uploaded-file URLs, payment references, and sensitive document details in team handoffs.
5. Separate confirmed data from inferred behaviour.

## Retention review

For each public form, record:

- Personal data captured.
- Whether IP address storage is necessary.
- Whether uploaded files are captured.
- Whether Save and Continue or Partial Entries store draft/incomplete data.
- Whether data is sent to add-ons, CRMs, marketing tools, webhooks, payment processors, or email notifications.
- Proposed retention period or reason for indefinite retention.
- Export/erase settings and identification field, usually an email field when available.
- Owner responsible for retention policy approval.

## Export and erase handling

- Gravity Forms Personal Data settings integrate with WordPress export/erase workflows when enabled for a form.
- Forms without an email field may not have a usable personal-data identification field unless hooks/custom development provide one.
- Add-ons may add personal data items to export/erase processes.
- Entry deletion can also remove associated uploaded files depending on deletion state and file handling.
- Automatic deletion/trashing should be treated as production-impacting because it can remove operational evidence and support history.

## Save and Continue and Partial Entries

- Treat draft or partial data as personal data.
- Confirm whether the client needs abandoned-form recovery, sales follow-up, or only form completion support.
- Do not enable abandoned lead capture without consent, privacy, and retention review.
- Confirm notification/feed behaviour for completed versus partial entries.
- Include draft/partial data in retention and export/erase planning when applicable.

## Uploaded files

- Uploaded files may contain sensitive personal or business information.
- Confirm permitted extensions, maximum size, storage location, link security, retention, and who can access files.
- Avoid attaching uploaded files to notifications unless explicitly required.
- Prefer links with access control or internal review workflows where available.
- Record whether deleting an entry also removes related files.

## Data-retention review output

Use `templates/data-retention-review.md` when the user asks about privacy, retention, entries, exports, erasure, entry cleanup, uploaded files, partial entries, Save and Continue, or data minimisation.

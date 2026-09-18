# Notifications and deliverability audit

## Audit criteria

- Admin notification exists, is enabled, and has a clear owner/recipient.
- User autoresponder exists where the user expects a receipt or next-step confirmation.
- Recipient routing rules match form choices and are testable.
- Conditional notification logic has branch evidence.
- From address uses a valid, domain-authorised address; submitter email belongs in Reply-To rather than From.
- Reply-To field is mapped to the submitter's email where appropriate.
- SMTP/transactional email plugin is present for production-critical forms or marked as missing evidence.
- DNS/domain alignment (SPF, DKIM, DMARC) is a deliverability dependency, not a Gravity Forms setting.
- Sensitive data in emails is limited; avoid `{all_fields}` for user/external recipients when sensitive fields/files exist.
- File attachments/links are limited to admin recipients or approved secure workflows.
- Merge tags are valid and do not expose secrets or personal data in URLs.
- Confirmation message aligns with notification expectations.

## Troubleshooting chain

1. Entry saved? If not, this may be validation/spam/cache/form issue.
2. Notification enabled and conditions met?
3. Recipient/From/Reply-To valid and typo-free?
4. Gravity Forms/WordPress handed message to mail stack?
5. SMTP/transactional service accepted it?
6. DNS/domain and recipient filtering accepted it?
7. Logs show errors, warnings, or plugin/theme filters?

## Retest steps

- Inspect notification configuration after approved changes.
- Review safe logs or mail plugin logs if permitted.
- Use approved test submission only in a safe environment.
- Verify admin and user receipt independently.
- Confirm sensitive data is not over-shared.

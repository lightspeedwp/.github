# WordPress Configuration Agent profile

## When to call the auditor

Call `gravity-forms-auditor` before changing existing live forms, running a pre-launch form check, investigating lost leads, reviewing accessibility/spam/privacy posture, or preparing a client-safe Gravity Forms report.

## Preferred audit scope

- Whole-site audit for retainers and pre-launch reviews.
- Single-form audit for targeted change requests.
- Troubleshooting audit for notification, spam, feed, or embed failures.

## Route to configuration

Route findings involving form fields, notifications, confirmations, feeds, embeds, personal data settings, spam settings, and add-on settings to `gravity-forms-configuration` after approval.

## Route elsewhere

Route custom plugin code, legal policy wording, whole-site accessibility/performance/security, and broad content strategy to the appropriate skill.

## Client-safe boundary

Do not expose connector internals, raw logs, private entries, licence/API keys, or internal owner notes.

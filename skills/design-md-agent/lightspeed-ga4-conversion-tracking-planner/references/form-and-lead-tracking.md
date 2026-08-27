# Form and Lead Tracking

## Form tracking plan fields

| Field | Purpose |
|---|---|
| Form name | Human-readable label |
| Form ID | Technical selector or form ID |
| Page location | Where the form appears |
| Submit event | GA4 event name |
| Trigger method | GTM trigger or custom event |
| Destination | Email, CRM, webhook or database |
| Thank-you behaviour | Inline confirmation or redirect |
| Spam handling | Honeypot, captcha or moderation |
| Privacy notice | Required before submission |

## Recommended form events

- `contact_form_submit`
- `consultation_form_submit`
- `briefing_form_submit`
- `lead_magnet_form_submit`

## Lead magnet tracking

Track both:

1. Form submission or access request.
2. Actual download/access click where possible.

Recommended events:

- `lead_magnet_form_submit`
- `lead_magnet_download`

# Add-ons and integrations

## Detection first

Before recommending or configuring any add-on, confirm plugin installed, active, version, licence/connection visibility, feed support, and whether MCP exposes read/write feed actions. If unknown, label as unverified and provide manual verification steps.

## Official add-on categories

- **Marketing**: Mailchimp, Campaign Monitor, ActiveCampaign, HubSpot, Constant Contact and similar.
- **CRM/sales**: Salesforce, HubSpot and related CRM integrations.
- **Automation/productivity**: Zapier, Webhooks, Slack, Trello, Dropbox, Help Scout.
- **Payments**: Stripe, PayPal Checkout, Square, Mollie, 2Checkout, Coupons.
- **Users/content**: User Registration, Advanced Post Creation, Post fields.
- **Form behaviour**: Partial Entries, Save and Continue, Surveys, Polls, Quiz, Signature, Conversational Forms, Chained Selects.
- **Spam/security**: Cloudflare Turnstile, Akismet, Zero Spam and other compatible plugins.

## Feed rules

Feeds trigger external side effects. Treat payment, user registration, webhooks, CRM, file storage, and content creation feeds as high-risk. Always read existing feeds before update. Avoid overwriting. Test in sandbox/test mode where possible.

## Common add-on notes

- **Stripe/PayPal/Square/Mollie**: verify gateway connection, SSL, currency, test/live mode, product/pricing fields, notification/receipt wording, and reconciliation before launch.
- **Mailchimp/marketing**: verify audience/list, opt-in consent, tags/groups, double opt-in if required, and field mapping.
- **Zapier/Webhooks**: verify destination URL, payload, authentication, retries, and sensitive data exposure.
- **Slack/Help Scout**: verify channel/mailbox, message content, PII, and failure handling.
- **Dropbox/File routing**: verify local upload persistence, async processing, permissions, and failure fallback.
- **User Registration**: verify account creation, role, activation, duplicate email, password, emails, and moderation.
- **Advanced Post Creation/Post fields**: default to draft/pending review; do not auto-publish unless explicitly approved.

## Gravity Wiz / Gravity Perks

Gravity Perks is a third-party commercial ecosystem for extending Gravity Forms. Recommend only when a specific installed/licensed perk solves a real requirement with acceptable maintenance overhead. Record support ownership and update risk.

## GravityKit / Zero Spam overview

Zero Spam may provide non-obtrusive spam protection and reporting for Gravity Forms, and the broader WordPress plugin integrates with multiple services. Use it only after reviewing privacy implications, site security posture, false-positive risk, and plugin maintenance. Do not install or enable third-party anti-spam plugins without approval.

## When to recommend a third-party add-on

Recommend only when core/official add-ons cannot meet the requirement, the add-on is maintained, licence/support owner is clear, privacy/security implications are understood, and ROI outweighs maintenance risk.

## When not to recommend third-party add-ons

Avoid adding a third-party add-on for one-off convenience, visual preference, speculative future use, or when the existing site can meet the requirement with simpler core fields, notifications, confirmations, or manual process.

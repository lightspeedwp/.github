# Core concepts

## Product model

Gravity Forms is a WordPress form builder used to create custom forms, collect entries, send notifications, show confirmations, and trigger add-on feeds. Common use cases include WooCommerce product enquiries, quote requests, product option forms, onboarding flows, payment/deposit forms, support requests, user registration, surveys, and post-purchase feedback journeys.

## Form lifecycle

1. Define purpose, audience, data required, privacy posture, and success path.
2. Check site capability: Gravity Forms status/version/licence visibility, add-ons, REST/MCP actions, user capabilities, SMTP, cache/security plugins, and target page.
3. Draft a form object: fields, pages, conditional logic, confirmations, notifications, feeds, spam controls, accessibility settings, retention notes, and test data.
4. Validate the draft before write operations.
5. Create or update the form, preferably via API/MCP action with a reversible change plan.
6. Embed the form using the Gravity Forms block where a block editor/page action is available.
7. Run test submissions and check confirmations, notifications, entries, feeds, spam, accessibility, and handoff notes.

## Objects and responsibilities

- **Form object**: title, description, settings, fields, pagination, button settings, confirmations, notifications, feeds, personal data settings, and display/submit behaviour.
- **Field object**: type, label, description, ID, inputs/subfields, choices, values, required state, visibility, default/dynamic value, conditional logic, validation, CSS/layout, and admin-only behaviour.
- **Entry**: saved submission data plus metadata such as form ID, entry ID, date, status, source URL, user agent, IP if stored, payment metadata, and feed status.
- **Confirmation**: immediate post-submit response. It can be text, page, or redirect, with conditional variants.
- **Notification**: email or event-triggered message after submission. It commonly goes to admins, submitters, or routed recipients.
- **Feed**: add-on configuration that sends entry data to another system or triggers external actions such as email marketing, CRM, payment, webhooks, user registration, Dropbox, Slack, or Zapier.

## Template library

Use official templates as starting points for field patterns, not as live-site evidence. Template imports should be customised for client data, consent, notifications, spam controls, and handoff requirements.

## Embedding

Prefer the Gravity Forms block in block themes and editor-managed pages. Use shortcodes only when block insertion is unavailable or the site architecture requires it. Always check target page, cache rules, and form scripts after embedding.

## REST API and MCP

Gravity Forms REST API v2 is in core from Gravity Forms 2.4. MCP tools may wrap REST, PHP API, WP-CLI, or custom companion plugin methods. The skill must discover actual tool names and schemas before use.

## Version awareness

- Gravity Forms 2.9 introduced/centred features such as Image Choice and Multiple Choice improvements; verify 2.9+ before relying on them.
- Gravity Forms 3.0 is treated as beta/version-specific in this skill. Accessibility-by-default and International Phone support are useful, but must not be assumed on stable production sites.
- Active add-ons, licence access, WordPress/PHP compatibility, and site-specific configuration determine what can be used safely.

## Licensing and availability caveats

Never infer licence tier from project type. Licence visibility may be absent from MCP. If licence details cannot be read, state that add-on availability is unverified and provide a manual verification step.

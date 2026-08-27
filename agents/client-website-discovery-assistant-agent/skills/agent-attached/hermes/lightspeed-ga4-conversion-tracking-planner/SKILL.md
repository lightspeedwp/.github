---
name: lightspeed-ga4-conversion-tracking-planner
description: define measurement before launch for lightspeed wordpress, woocommerce, publishing, tourism, ai-readiness and lead-generation websites. use when the user asks for ga4 event plans, gtm trigger notes, form submission tracking, lead magnet download tracking, consultation cta tracking, chatbot handoff events, looker studio dashboard briefs, launch baseline reports or conversion measurement governance.
---

# LightSpeed GA4 Conversion Tracking Planner

## Purpose

Create practical launch-ready measurement plans for WordPress websites before they go live.

Use this skill when a project needs GA4, GTM, form tracking, consultation CTA tracking, lead magnet tracking, chatbot handoff events, Looker Studio dashboard planning or launch baseline reporting.

## Core rule

Do not assume tracking is already configured. Separate:

- measurement intent
- event naming
- GTM trigger logic
- privacy/consent requirements
- QA checks
- launch baseline reporting
- post-launch monitoring

If analytics, consent, form destination or CRM details are missing, create a safe draft plan and flag the missing decisions.

## Inputs to accept

Accept any combination of:

- sitemap or URL list
- page briefs
- CTA inventory
- form list
- lead magnet list
- GA4 property notes
- GTM container notes
- cookie/consent notes
- CRM/email routing notes
- chatbot planning brief
- launch checklist
- Search Console or GA4 exports
- Looker Studio requirements

## Workflow

1. Confirm the site type, launch stage and measurement goal.
2. Identify conversion points: forms, CTAs, downloads, bookings, phone/email clicks and chatbot handoffs.
3. Define GA4 event names and parameters.
4. Define GTM trigger notes.
5. Define form submission tracking and validation checks.
6. Define lead magnet and consultation CTA tracking.
7. Add chatbot handoff events as a future phase if chatbot is not launching yet.
8. Add privacy, consent and data-quality notes.
9. Create a Looker Studio dashboard brief if reporting is needed.
10. Create a launch baseline report structure.
11. Produce QA and go/no-go notes.

## Required outputs

For full planning requests, include:

- GA4 event plan
- GTM trigger notes
- form submission tracking plan
- lead magnet download tracking plan
- consultation CTA tracking plan
- chatbot handoff event plan for later phases
- Looker Studio dashboard brief
- launch baseline report
- measurement QA checklist
- missing decisions
- internal LightSpeed notes

## Event naming rules

Prefer clear snake_case event names.

Examples:

- `consultation_cta_click`
- `contact_form_submit`
- `lead_magnet_download`
- `service_cta_click`
- `solution_cta_click`
- `email_click`
- `phone_click`
- `chatbot_open`
- `chatbot_handoff_click`
- `chatbot_lead_submit`

## Recommended GA4 parameters

Use parameters where useful:

- `page_type`
- `page_title`
- `page_location`
- `cta_text`
- `cta_location`
- `service_area`
- `solution_area`
- `form_id`
- `form_name`
- `lead_magnet_name`
- `download_type`
- `chatbot_intent`
- `handoff_type`

Avoid collecting sensitive personal data inside GA4 event parameters.

## Privacy and consent stance

Do not provide legal advice. Flag privacy/consent review when tracking uses cookies, advertising pixels, remarketing, personal data, chatbot transcripts or cross-platform enrichment.

For EU/UK/POPIA-aware projects, note that analytics and tracking configuration should align with the site's privacy and cookie policy.

## Reference loading

Use these references as needed:

- `references/measurement-workflow.md` for the end-to-end workflow.
- `references/event-naming-and-parameters.md` for GA4 naming and parameter rules.
- `references/gtm-trigger-notes.md` for GTM trigger guidance.
- `references/form-and-lead-tracking.md` for form, lead magnet and consultation tracking.
- `references/chatbot-handoff-events.md` for future chatbot measurement.
- `references/looker-studio-dashboard.md` for dashboard planning.
- `references/launch-baseline-report.md` for reporting structure.
- `references/privacy-and-consent-notes.md` for governance notes.

## Quality standard

Outputs should be practical, launch-focused and easy to hand to a developer, analytics implementer or project manager. Always separate implementation tasks from strategic recommendations and missing information.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

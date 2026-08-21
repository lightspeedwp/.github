# Acceptance checklist

The skill is complete only when:

- [ ] `SKILL.md` has clear trigger conditions.
- [ ] The skill can run standalone.
- [ ] The skill can run inside the three named agents.
- [ ] The skill uses progressive loading through focused references.
- [ ] Gravity Forms claims are source-backed.
- [ ] MCP capabilities are discovered before use.
- [ ] Write operations require a change plan.
- [ ] High-risk changes require explicit approval.
- [ ] Payment and user-registration operations are guarded.
- [ ] Spam, security, privacy, and accessibility are first-class concerns.
- [ ] Tour operator defaults are scoped to enquiry, trip-planning, itinerary, quote, brochure, and lead-generation flows.
- [ ] Tour operator defaults support enquiry-first and multi-step flows.
- [ ] The skill degrades gracefully without MCP write access.
- [ ] Test prompts cover read, write, troubleshooting, and refusal cases.
- [ ] `schemas/agent-profile.schema.json` exists and covers agent defaults.
- [ ] Example configuration JSON files validate with `scripts/validate_form_config.py`.
- [ ] The packaged skill validates and builds as `skill.zip`.

## Next-batch acceptance additions

- [ ] `SKILL.md` references the change-risk, MCP action recipe, QA playbook, manual fallback, and intake files.
- [ ] The skill can produce an MCP capability map before recommending executable actions.
- [ ] The skill can produce a manual implementation plan when write actions are unavailable.
- [ ] The skill distinguishes low, medium, high, and critical change risk.
- [ ] The skill records rollback notes for each live change type.
- [ ] The skill has QA scenarios for contact, quote, brochure request, tour operator enquiry, payment, and user registration forms.
- [ ] Form config examples pass `scripts/validate_form_config.py`.
- [ ] The whole skill pack passes `scripts/validate_skill_pack.py`.
- [ ] Test prompts cover retention, entry data exposure, Save and Continue, Partial Entries, production embeds, and unsupported custom plugin work.

## Next-batch compatibility and migration acceptance

- [ ] Environment compatibility is checked before high-trust live changes.
- [ ] Cache, CDN, and script optimisation risks are handled before editing form logic.
- [ ] Logging guidance treats logs as temporary and potentially sensitive.
- [ ] Notification audits distinguish form config from email delivery, SMTP, DNS, and mailbox issues.
- [ ] File-upload workflows require explicit extension, size, storage, notification, and retention decisions.
- [ ] Import/export or migration flows require source/target preflight, add-on parity, and rollback evidence.
- [ ] Major live-form redesigns prefer duplication or draft replacement over direct edits.
- [ ] Troubleshooting outputs can be structured as a runbook with test evidence and redaction notes.
- [ ] Newsletter and file-upload examples pass local form-config validation.

## Fourth improvement batch acceptance

- Feed audits have a dedicated template and schema.
- Payment feed, User Registration feed, and marketing/CRM feed risks are separated.
- Multiple-feed behaviour is documented with payment and User Registration caveats.
- Entry data lifecycle, retention, export/erase, draft/partial data, and uploaded-file handling are documented.
- Test prompts cover payment feeds, User Registration role safety, marketing consent, entry retention, deletion, Partial Entries, and feed troubleshooting.
- Local validation requires the new references, schemas, templates, and at least 50 numbered test prompts.

## Fifth improvement batch acceptance

- [ ] `references/embedding-and-page-integration.md` exists and covers block, shortcode, duplicate embed, AJAX/cache, and production validation rules.
- [ ] `references/consent-localisation-and-microcopy.md` exists and covers consent, bilingual/multilingual form variants, marketing opt-ins, and route-away boundaries.
- [ ] `templates/embed-validation.md` and `templates/consent-copy-review.md` are available for reusable outputs.
- [ ] `schemas/embed-validation.schema.json` and `schemas/consent-copy-review.schema.json` validate structured outputs.
- [ ] Example configs include bilingual contact and contest entry workflows.
- [ ] Test prompts include at least 60 numbered cases and cover embed, duplicate form, shortcode, consent, localisation, contest, and route-away scenarios.
- [ ] Local validators require the new files and pass all bundled examples.

## Sixth improvement batch acceptance

- [ ] `references/conditional-dynamic-calculation-logic.md` exists and covers conditional logic, dynamic population, query strings, block field values, calculations, and pricing risk.
- [ ] `references/webhooks-and-automation-feeds.md` exists and covers Webhooks, Zapier, CRM, marketing, Slack, selected field mapping, secrets, and outbound data minimisation.
- [ ] `templates/logic-map-review.md` and `templates/webhook-feed-review.md` are available for reusable outputs.
- [ ] `schemas/logic-map-review.schema.json` and `schemas/webhook-feed-review.schema.json` validate structured outputs.
- [ ] Example configs include service quote calculator and webhook lead routing workflows.
- [ ] Test prompts include at least 70 numbered cases and cover conditional logic, hidden required fields, dynamic population, hook route-away, pricing calculations, payment-linked formulas, and webhook feed audits.
- [ ] Local validators require the new files and pass all bundled examples.

## Seventh improvement batch acceptance

- [ ] `references/operations-maintenance-and-inventory.md` exists and covers form inventories, stale/orphaned forms, unread-entry monitoring, dashboard signals, ownership, scheduled events, and maintenance checks.
- [ ] `references/permissions-and-capability-governance.md` exists and covers Gravity Forms capabilities, least-privilege access, entry export/delete, add-on settings, API/logging permissions, and User Registration escalation risk.
- [ ] `templates/form-inventory-audit.md` and `templates/permissions-review.md` are available for reusable outputs.
- [ ] `schemas/form-inventory-audit.schema.json` and `schemas/permissions-review.schema.json` validate structured outputs.
- [ ] Examples include monthly form health check and team permissions review workflows.
- [ ] Test prompts include at least 80 numbered cases and cover inventory audits, stale cleanup, unread entries, orphaned embeds, permissions review, User Registration access, System Status visibility, cron/background processing, and licence/update visibility.
- [ ] Local validators require the new files and pass all bundled examples.

## Frontend layout and styling acceptance additions

- [ ] The skill has a dedicated frontend/layout/theme reference for form presentation work.
- [ ] The skill treats global form theme changes as production-impacting.
- [ ] The skill prefers Form Editor columns and block Form Styles over deprecated Ready Classes for new work.
- [ ] Ready Class migration requires inventory, staged rollout, and regression testing.
- [ ] Legacy markup changes require approval and staging validation.
- [ ] Broad CSS selector requests are routed or scoped safely.
- [ ] Visual changes preserve labels, descriptions, required markers, errors, focus states, confirmations, CAPTCHA widgets, and payment/total clarity.
- [ ] Test prompts cover frontend style audits, Orbital/global theme changes, Ready Class migration, legacy markup, block style copy/paste, and visual-preference accessibility refusal.

## Ninth improvement batch acceptance

- [ ] `references/post-creation-and-ugc-workflows.md` exists and covers Post Fields, Advanced Post Creation, UGC moderation, taxonomy mapping, media-library handoff, and post editing.
- [ ] `templates/post-creation-feed-review.md` and `templates/ugc-moderation-handoff.md` are available for reusable outputs.
- [ ] `schemas/post-creation-feed-review.schema.json` and `schemas/ugc-moderation-handoff.schema.json` validate structured outputs.
- [ ] Example configs include community story and business listing submission workflows.
- [ ] Advanced Post Creation guidance requires the add-on to be installed and the target post type, taxonomies, and custom fields to already exist.
- [ ] Auto-published public UGC is treated as high risk and defaults to Draft or Pending Review.
- [ ] Media Library copying, featured image mapping, and taxonomy creation from submitted values require explicit approval.
- [ ] Post editing requires logged-in ownership, edit-page validation, limited editable fields, and moderation review.
- [ ] Test prompts include at least 100 numbered cases and cover Post Fields, APC feed review, missing CPTs, anonymous UGC, media-library mapping, taxonomy creation, business listings, editor handoff, post editing, and ecommerce/platform route-away.
- [ ] Local validators require the new files and pass all bundled examples.

## Analytics, conversion tracking, and attribution acceptance additions

- [ ] `references/analytics-conversion-and-attribution.md` exists and covers GA4/GTM, Gravity Forms Google Analytics Add-On, UTM capture, hidden fields, thank-you page tracking, consent-aware QA, and mismatch investigation.
- [ ] `templates/conversion-tracking-plan.md` and `templates/tracking-qa-report.md` are available for reusable outputs.
- [ ] `schemas/conversion-tracking-plan.schema.json` and `schemas/tracking-qa-report.schema.json` validate structured outputs.
- [ ] Example configs include UTM lead capture and GA4 lead tracking workflows.
- [ ] The skill treats analytics script insertion, GA4/GTM connection changes, Measurement Protocol settings, hidden attribution-field changes, and thank-you page conversion changes as approval-sensitive.
- [ ] The skill distinguishes saved Gravity Forms entries from browser-side attempted-submission tracking.
- [ ] The skill refuses to store Measurement Protocol secrets or send personal data into analytics by default.
- [ ] Test prompts include at least 110 numbered cases and cover GA4 event plans, Google Analytics Add-On setup, GTM-owned analytics, UTM fields, personal data refusal, mismatch investigation, thank-you pages, consent-aware QA, pagination tracking, and secret refusal.
- [ ] Local validators require the new analytics files and pass all bundled examples.

- [ ] Survey, Polls, and Quiz add-on workflows require add-on detection before recommendations.
- [ ] Anonymous survey claims distinguish anonymous, pseudonymous, and identified collection.
- [ ] Survey/poll/quiz results workflows document result visibility, export/reset limits, and approval gates.
- [ ] Quiz scoring changes, hidden questions, pass/fail thresholds, and historical result recalculation are guarded.

## Payment batch acceptance

- Payment work requires add-on, SSL, gateway mode and explicit approval evidence.
- Donation workflows avoid unsupported tax-deductibility and recurring-payment claims.
- Paid event workflows distinguish saved entries from successful payments.
- Refunds, cancellations and disputes route to payment operations unless a supported safe action is confirmed.
- Payment tests include success, failed/declined, branch, receipt and entry/payment status checks.

## Auditor/configuration boundary acceptance

- [ ] The skill no longer presents full audits as a primary responsibility.
- [ ] Read-only mode is framed as preflight/readiness, not full audit reporting.
- [ ] Full audit reports route to `tour-operator-gravity-forms-auditor`.
- [ ] Formal findings registers, readiness scorecards, client-safe audit summaries, retainer audit reports, and separate audit retest reports route to `tour-operator-gravity-forms-auditor`.
- [ ] Auditor handoffs are accepted as remediation input.
- [ ] Auditor handoffs do not bypass MCP verification.
- [ ] Auditor handoffs do not bypass approval gates.
- [ ] Auditor finding IDs are preserved in change plans, validation reports, and handoff notes.
- [ ] Troubleshooting remains inside configuration.
- [ ] Existing configuration, validation, and remediation workflows still work.
- [ ] Existing Tour Operator profile works and WordPress fallback guidance remains valid.
- [ ] `references/auditor-handoff-contract.md`, `schemas/auditor-handoff.schema.json`, and `templates/auditor-handoff-intake.md` exist and are referenced from `SKILL.md`.
- [ ] Tests cover routing full audits to `tour-operator-gravity-forms-auditor` and remediation/troubleshooting staying in `tour-operator-gravity-forms-configuration`.

- [x] Canonical `tour-operator-gravity-forms-auditor` v0.2.1+ handoff fields are accepted by `schemas/auditor-handoff.schema.json`.
- [x] Legacy normalised auditor handoff fields remain accepted for backwards compatibility.
- [x] Missing canonical handoff fields are treated as readiness gaps, not permission to infer or execute changes.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*

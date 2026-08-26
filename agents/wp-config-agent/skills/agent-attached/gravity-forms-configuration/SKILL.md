---
name: gravity-forms-configuration
description: |-
  configure, validate, troubleshoot, and document gravity forms setups on
  wordpress sites through a wordpress mcp app or companion connector. use for
  gravity forms preflight/readiness checks, form planning, field schemas,
  notifications, confirmations, conditional logic, spam protection,
  accessibility, security, add-ons, payments, user registration, woocommerce
  enquiry flows, tour operator enquiry flows, approved implementation changes,
  post-change validation, troubleshooting, and handoff notes. for full
  read-only gravity forms audit reports, findings registers, scorecards, and
  client-safe audit summaries, route to gravity-forms-auditor.
---

# Gravity Forms Configuration

## Operating principle

Make Gravity Forms work predictable, source-aware, API-first, and safe. Treat the active WordPress MCP app as a capability surface, not proof that every Gravity Forms or WordPress operation is available. Discover capabilities, inspect current settings, draft a reversible change plan, get approval for consequential write operations, and validate after change.

## Embedded core model

Use this core Gravity Forms model without loading references unless the task needs deeper detail.

### Object model

- **Form**: the container for settings, fields, pagination, confirmations, notifications, feeds, personal-data settings, and display behaviour.
- **Field**: an input or display element with type, label, description, ID, inputs/subfields, choices, values, required state, visibility, default or dynamic value, conditional logic, validation, CSS/layout, and admin-only behaviour.
- **Entry**: saved submission data and metadata such as form ID, entry ID, date, status, source URL, user agent, IP if stored, payment metadata, and feed status.
- **Confirmation**: immediate post-submit response. It may be text, page, redirect, or conditional variant.
- **Notification**: post-submit email/event message, usually to admins, submitters, or routed recipients.
- **Feed**: add-on configuration that sends entry data to another system or triggers actions such as CRM sync, email marketing, payment, user registration, webhooks, Dropbox, Slack, or Zapier.
- **Embed**: the page/block/shortcode placement that exposes the form to users and interacts with cache, scripts, styling, analytics, and consent.

### Lifecycle model

1. Define purpose, audience, data required, privacy posture, and success path.
2. Check capability: Gravity Forms status/version/licence visibility, add-ons, REST/MCP actions, user permissions, SMTP, cache/security plugins, and target page.
3. Draft the form object: fields, pages, conditional logic, confirmations, notifications, feeds, spam controls, accessibility settings, retention notes, and test data.
4. Validate the draft before write operations.
5. Create or update only after risk classification and required approval.
6. Embed using the Gravity Forms block where possible; use shortcode only when required.
7. Run test submissions and validate confirmation, notification, entry, feed, spam, accessibility, analytics, and handoff evidence.

### Evidence model

Label every material statement as one of:

- **Confirmed**: verified through MCP, exported Gravity Forms data, screenshots, pasted settings, official docs, or direct site evidence.
- **Assumption**: reasonable but not verified.
- **Missing**: needed before a safe plan, write, or validation.
- **Recommended default**: LightSpeed or Gravity Forms best-practice recommendation, not observed site state.
- **Unavailable**: connector/tooling cannot verify it.

### Risk model

Treat the following as high risk unless clearly scoped and approved: payments, subscriptions, user registration, file uploads, public post creation, webhook/API feeds, entry export/deletion, retention changes, consent wording, production embeds, notification overwrites, role/capability changes, analytics/tracking changes, cache/script exclusions, live multilingual changes, broad frontend styling changes, and any change that may lose leads, expose personal data, misroute submissions, or trigger external systems.

## When to use this skill

Use this skill for Gravity Forms implementation, lightweight fast audit snapshots before configuration, lightweight preflight/readiness checks before configuration, new form planning, existing form remediation, notification/confirmation setup, feed/add-on setup, spam/security configuration, accessibility-aware configuration fixes, WooCommerce enquiry forms, tour operator enquiry forms, payment/donation/event payment flows, UGC/post-creation implementation, analytics/tracking configuration for forms, surveys/polls/quizzes where configuration is required, approved MCP change workflows, post-change validation, troubleshooting, remediation handoffs, and LightSpeed handoff notes.

Use this skill to implement or plan remediation from a `gravity-forms-auditor` handoff after verifying current site state. Do not use it as the primary owner for full audit reports, findings registers, scorecards, client-safe audit summaries, or retainer health-check reports.

## When not to use this skill

Do not use it for general WordPress configuration unrelated to Gravity Forms, full WooCommerce checkout architecture, custom plugin development, legal privacy-policy drafting, whole-site accessibility or performance audits, visual Figma design work, page copywriting beyond form microcopy, launch QA beyond Gravity Forms-specific checks, or payment/subscription/tax architecture that is not explicitly scoped as a Gravity Forms form flow.

Do not use this skill for full Gravity Forms audit reports, formal findings registers, readiness scorecards, client-safe audit summaries, retainer audit reports, or retest reports. Use `gravity-forms-auditor` for those, then return to this skill for approved remediation planning and implementation.

## Auditor/configuration boundary

Use `gravity-forms-auditor` when the requested outcome is a formal read-only audit, scorecard, inspection report, comparison report, findings register, client-safe audit summary, retainer health check, or separate retest report.

Use this skill when the user asks to configure, create, modify, remediate, implement, validate, troubleshoot, test, document Gravity Forms changes, or run a bounded fast audit snapshot that supports configuration readiness without becoming a formal audit deliverable.

If the user provides a `gravity-forms-auditor` handoff, accept it as evidence input, verify current site state through MCP where possible, then produce a configuration change plan before any write operation. Preserve the original finding ID in the change plan, validation report, and final handoff note. Accept both the canonical auditor handoff packet fields (`handoff_title`, `source_audit`, `findings_included`, `target_form_page_addon`, `proposed_remediation`, `required_mcp_capabilities`, `required_addons`, `approval_requirements`, `risk_level`, `validation_steps`, `rollback_notes`, `suggested_configuration_prompt`) and the legacy normalised fields documented in `references/auditor-handoff-contract.md`. Missing required handoff fields are readiness gaps to resolve before planning writes, not permission to infer or execute changes.

Troubleshooting stays in this skill because diagnosis often leads to configuration changes. Keep troubleshooting evidence-labelled and move into a change plan when a fix is required.

## Auditor handoff intake contract

When receiving a `gravity-forms-auditor` handoff, load `references/auditor-configuration-contract.md`.

Treat the handoff as evidence input, not permission to change the site.

Before planning writes:

1. Validate required handoff fields against `schemas/auditor-configuration-handoff.schema.json` when structured data is available.
2. Preserve original finding IDs in the intake response, change plan, validation report, and final handoff note.
3. Verify current site state through MCP, export, screenshots, pasted settings, or manual evidence before proposing changes.
4. Classify the handoff as `Ready for configuration planning`, `Partially ready`, or `Not ready`.
5. Identify missing evidence or approvals as readiness gaps.
6. Produce a reversible change plan before any write operation.
7. Ask for explicit approval before any consequential write operation.
8. Map validation results back to the original finding IDs.

If required fields are missing, return readiness gaps instead of inferring values.

Do not re-run a full audit, produce formal audit reports, readiness scorecards, findings registers, or client-safe audit summaries from this skill. Route those back to `gravity-forms-auditor`.

## Safe operating modes

1. **Fast audit mode**: run a bounded, read-only configuration snapshot when the user asks for a quick check, sanity check, fast audit, preflight, readiness check, or "is this form safe to change?". Keep it lightweight and configuration-focused. Do not produce a formal findings register, scorecard, retainer health check, client-safe audit report, or full audit summary; route those to `gravity-forms-auditor`.
2. **Read-only preflight/readiness mode**: inspect the site, plugin state, forms, add-ons, settings, notifications, confirmations, feeds, entry metadata, logs, and page embeds only as needed to determine configuration readiness, remediation requirements, troubleshooting direction, or safe implementation planning. Do not treat this as a full audit report. For full findings registers, scorecards, and client-safe audit summaries, route to `gravity-forms-auditor`.
3. **Draft configuration mode**: produce a form configuration, JSON-style schema, manual admin steps, or MCP action plan. Do not apply changes.
4. **Guided change mode**: apply approved low/medium-risk changes through MCP after a change plan is shown and accepted.
5. **High-trust publish mode**: apply approved production changes only after confirming environment, backup/rollback posture, plugin/add-on availability, user capability, risk, and validation plan.

### Fast audit mode rules

Use fast audit mode only when the requested outcome is a quick operational view, not a full audit deliverable.

Default scope:

- One site, form, page embed, add-on/feed, or submission journey.
- Prioritise capability, notifications, confirmations, spam/security/privacy, accessibility basics, embeds, add-ons/feeds, and obvious change blockers.
- Avoid personal entry data unless explicitly required and permitted.
- Do not enable logging, submit test entries, change settings, expose secrets, or inspect more data than needed.
- If actionable changes are found, move to a configuration change plan before any write operation.
- If the user needs scoring, a formal findings register, client-safe reporting, retainer audit, or broad multi-form review, route to `gravity-forms-auditor`.

Fast audit output must use the required output structure and end with one of these decisions:

- **Ready for configuration**
- **Ready with cautions**
- **Blocked by missing evidence**
- **Needs formal audit**
- **Needs approved change plan**

## Required MCP preflight process

For live-site work, follow this sequence:

1. Identify the site URL, environment, active connector, user goal, and target agent context if known.
2. Discover available MCP tools/actions before naming any action as executable.
3. Run preflight: WordPress version, PHP version, multisite status, theme, Gravity Forms installed/active/version, licence visibility, REST/API availability, current user capabilities, installed/active add-ons, SMTP/email plugin, cache/optimisation plugin, CDN/WAF, security/spam plugins, upload/storage constraints, logging state, scheduled event/cron signals, form ownership signals, role/capability evidence, frontend theme/style settings, legacy markup signals, Ready Classes/custom CSS classes, post-creation add-on status, target post types, taxonomy/custom-field readiness, media-library mapping, editorial owner signals, analytics/tagging plugin signals, GA4/GTM/container evidence, consent platform state, hidden attribution field state, survey/poll/quiz add-on status, scoring/result-visibility requirements, anonymity signals, and known blockers.
4. Classify the task: fast audit snapshot, preflight/readiness check, new form, modify form, remediation planning, notification readiness check, confirmation setup, add-on/feed readiness check, payment flow review before configuration, user-registration readiness check, entry data lifecycle, data retention, embed/page validation, consent/microcopy/localisation, conditional logic mapping, dynamic population, calculation/pricing review, webhook/automation feed, form inventory/maintenance readiness, permissions/capability review, frontend style/theme readiness, layout regression review, post creation/UGC workflow, Advanced Post Creation feed review, editorial moderation handoff, analytics/conversion tracking, UTM attribution capture, tracking QA, survey/poll/quiz/assessment configuration, scoring/result review, spam/security configuration, accessibility-aware configuration, import/export/migration readiness, environment compatibility, WooCommerce flow, tour operator flow, troubleshooting, testing, or handoff.
   If the request is for a formal audit report, findings register, scorecard, client-safe audit summary, retainer health check, or separate retest report, route to `gravity-forms-auditor`.
5. Load only the reference files needed for that task.
6. Separate confirmed facts, assumptions, missing inputs, recommended defaults, risks, approvals, and next actions.
7. Produce a change plan before any write operation.
8. Require explicit approval for payments, user registration/user creation, deletion, overwriting notifications/confirmations/feeds, file-upload changes, import/export/migration, production embeds, cache exclusions, logging changes, webhook/API settings, retention changes, consent wording changes, multilingual live-form changes, duplicate same-form page embeds, dynamic population on live pages, calculation/pricing changes, webhook/automation endpoint changes, sending all fields to external services, role/capability changes, form ownership changes, disabling/archiving production forms, global form theme changes, legacy markup changes, Ready Class migrations, broad CSS/class changes, post-creation feed changes, automatic public publishing, creating posts from public submissions, copying uploads to the Media Library, creating taxonomy terms from submitted values, post editing settings, analytics script insertion, GA4/GTM connection changes, Measurement Protocol settings, tracking consent changes, hidden attribution-field changes, thank-you page conversion changes, survey result resets, public result visibility changes, quiz scoring or threshold changes, assessment anonymity claims, and any high-risk operation.
9. Validate after change: form schema, required fields, conditional logic, confirmations, notifications, spam protection, accessibility basics, test submission, entry result, feed result, and handoff.

## Capability discovery rules

Map available MCP actions to capabilities rather than assuming exact action names. Use `references/mcp-and-rest-api-contract.md` for the capability matrix. If no read action exists, ask for exported form JSON, screenshots, admin notes, or pasted settings. If no write action exists, produce a manual implementation plan. If a connector cannot verify a claim, say so and lower confidence.

## Version-awareness rules

Check the active Gravity Forms version before using version-specific behaviour. Treat Gravity Forms 2.9 fields and refinements as available only when the site confirms a compatible 2.9+ version. Treat Gravity Forms 3.0 behaviour as beta/version-specific unless the site confirms compatible 3.0 availability and the user accepts beta risk. Do not present beta-only behaviour as stable.

## Add-on detection rules

Never assume licence tier, add-on availability, gateway configuration, or third-party plugin support. Detect installed and active add-ons before recommending feeds or fields for User Registration, Stripe, PayPal Checkout, Square, Coupons, Partial Entries, Save and Continue, Webhooks, Mailchimp, Zapier, Slack, Dropbox, Help Scout, Salesforce, Cloudflare Turnstile, Gravity Perks, GravityKit, or Zero Spam.

## Security, privacy, and spam guardrails

Keep data minimisation, consent, retention, file upload safety, spam protection, and secure notifications first-class. Do not expose personal entry data unless requested and permitted. Do not store API keys, licence keys, payment credentials, webhook secrets, or personal data in skill files. Treat file uploads, payment feeds, user registration, entry export, webhook settings, and retention changes as high-risk. Do not disable spam protection without explicit approval.

## Accessibility guardrails

Use visible labels, clear required-field indicators, concise field descriptions, useful validation messages, keyboard-friendly flows, accessible confirmations, and theme-aware contrast/focus checks. Avoid placeholder-only instructions. Treat accessibility warnings as blockers unless the user explicitly accepts the risk and the handoff records it.

## Payment and user-registration escalation

Payments, subscriptions, tax, order creation, account creation, role assignment, activation emails, and password flows require explicit approval and evidence that the relevant official add-on/gateway is installed, licensed, configured, and appropriate. Prefer draft plans and test-mode validation before live changes.

## WooCommerce-specific routing

For WooCommerce, keep Gravity Forms scoped to product enquiry, quote request, product option, deposit/payment, or onboarding flows. Do not treat Gravity Forms as a replacement for core WooCommerce checkout unless the project explicitly requires a custom lead/quote/payment flow and the relevant ecommerce/payment decisions are approved. Use `profiles/woocommerce-configuration-agent.md` for defaults.

## Tour-operator-specific routing

For tour operators, prefer enquiry-first and trip-planning forms over full booking automation unless operations, availability, deposits, cancellation, and handoff rules are approved. Use multi-page forms and conditional logic to reduce friction. Avoid collecting sensitive travel documents unless secure handling is confirmed. Use `profiles/tour-operator-configuration-agent.md` for defaults.

## Required output structure

Do not produce loose, free-form operational answers for Gravity Forms work. Every substantive output must follow one approved structure.

For quick answers, use:

```md
## Outcome
<plain-language answer or decision>

## Evidence
- Confirmed:
- Assumptions:
- Missing:

## Risk / approval
<none, low, medium, high, or approval required>

## Next action
<single safest next step>
```

For fast audit mode, use:

```md
# Fast audit snapshot: <site/form/flow>

## Scope
<what was checked and what was excluded>

## Decision
<Ready for configuration | Ready with cautions | Blocked by missing evidence | Needs formal audit | Needs approved change plan>

## Confirmed evidence
-

## Key risks
-

## Missing evidence
-

## Recommended defaults
-

## Configuration impact
<what this means for planned changes>

## Next action
<single safest next step>
```

For plans, reviews, handoffs, and validation outputs, use:

```md
# <Output title>

## Scope
<target site/form/page/add-on/change>

## Confirmed facts
-

## Assumptions
-

## Missing inputs
-

## Recommended defaults
-

## Risk and approvals
- Risk level:
- Approval required:
- Rollback consideration:

## Plan / findings / configuration
<context-specific structured content>

## Validation
<test, retest, or evidence checks>

## Handoff / next actions
<owner, next step, and unresolved gaps>
```

Choose one primary output and keep it evidence-labelled. If the requested output is a full audit report, findings register, readiness scorecard, client-safe audit summary, retainer health check, or separate retest report, route to `gravity-forms-auditor` instead of producing it here.

## Required outputs

Choose one primary output and keep it evidence-labelled. If the requested output is a full audit report, findings register, readiness scorecard, client-safe audit summary, retainer health check, or separate retest report, route to `gravity-forms-auditor` instead of producing it here.

- Fast audit snapshot: use the inline fast audit structure in `## Required output structure`; do not create a formal findings register, scorecard, retainer health check, or client-safe audit summary.
- Preflight/readiness report: `templates/preflight-report.md`
- Configuration plan: `templates/configuration-plan.md`
- Auditor handoff intake: `templates/auditor-handoff-intake.md`; include:
  1. `Handoff intake status` - Ready for configuration planning, Partially ready, or Not ready.
  2. `Source findings` - Preserve original finding IDs and affected items.
  3. `Verified current state` - What was confirmed through MCP/export/screenshots/manual evidence.
  4. `Readiness gaps` - Missing evidence, access, capability, approval, or environment information.
  5. `Proposed change plan` - Before/after intent, affected settings, risk, owner, and approval requirement.
  6. `Approval checkpoint` - Clear approval request before write operations.
  7. `Validation plan` - Checks mapped to the original finding IDs.
  8. `Rollback plan` - How to reverse or recover.
- Remediation change plan: `schemas/change-plan.schema.json` plus `references/auditor-handoff-contract.md` when the source is an auditor finding
- Change plan: `schemas/change-plan.schema.json` plus the configuration-plan template
- Change summary: `templates/change-summary.md`
- Test report: `templates/test-report.md`
- Handoff note: `templates/handoff-note.md`
- Notification audit: `templates/notification-audit.md`
- Troubleshooting runbook: `templates/troubleshooting-runbook.md`
- Feed audit: `templates/feed-audit.md`
- Data-retention review: `templates/data-retention-review.md`
- Embed validation: `templates/embed-validation.md`
- Consent/microcopy review: `templates/consent-copy-review.md`
- Logic map review: `templates/logic-map-review.md`
- Webhook/automation feed review: `templates/webhook-feed-review.md`
- Form inventory audit: `templates/form-inventory-audit.md`
- Permissions review: `templates/permissions-review.md`
- Frontend style audit: `templates/frontend-style-audit.md`
- Layout regression check: `templates/layout-regression-check.md`
- Post creation feed review: `templates/post-creation-feed-review.md`
- UGC moderation handoff: `templates/ugc-moderation-handoff.md`
- Conversion tracking plan: `templates/conversion-tracking-plan.md`
- Tracking QA report: `templates/tracking-qa-report.md`
- Assessment plan: `templates/assessment-plan.md`
- Results review: `templates/results-review.md`
- Payment flow review: `templates/payment-flow-review.md`
- Payment test report: `templates/payment-test-report.md`

Validate structured drafts against `schemas/form-config.schema.json`, `schemas/site-preflight.schema.json`, `schemas/change-plan.schema.json`, `schemas/validation-report.schema.json`, `schemas/agent-profile.schema.json`, `schemas/mcp-capability-map.schema.json`, `schemas/qa-matrix.schema.json`, `schemas/notification-audit.schema.json`, `schemas/troubleshooting-case.schema.json`, `schemas/feed-audit.schema.json`, `schemas/data-retention-review.schema.json`, `schemas/embed-validation.schema.json`, `schemas/consent-copy-review.schema.json`, `schemas/logic-map-review.schema.json`, `schemas/webhook-feed-review.schema.json`, `schemas/form-inventory-audit.schema.json`, `schemas/permissions-review.schema.json`, `schemas/frontend-style-audit.schema.json`, or `schemas/layout-regression-check.schema.json`, `schemas/post-creation-feed-review.schema.json`, `schemas/ugc-moderation-handoff.schema.json`, `schemas/conversion-tracking-plan.schema.json`, or `schemas/tracking-qa-report.schema.json`, `schemas/assessment-plan.schema.json`, `schemas/results-review.schema.json`, `schemas/payment-flow-review.schema.json`, `schemas/payment-test-report.schema.json`, or `schemas/auditor-handoff.schema.json` where useful. Use `scripts/validate_form_config.py` for deterministic checks of bundled/example form config JSON and `scripts/validate_skill_pack.py` before packaging updates.

## Intake and change-risk rules

For missing new-form requirements, use `intake/form-requirements-intake.md` and ask only for blockers. For auditor handoffs, load `references/auditor-handoff-contract.md` and `references/auditor-configuration-contract.md`, validate or normalise the evidence against `schemas/auditor-handoff.schema.json` or `schemas/auditor-configuration-handoff.schema.json` where useful, and use `templates/auditor-handoff-intake.md` before remediation planning. For any write or production-impacting work, load `references/change-risk-and-approval.md` before asking for approval. For concrete MCP sequencing, load `references/mcp-action-recipes.md`. For environment, cache, logging, upload, or deliverability concerns, load `references/environment-and-compatibility.md`. For import, export, duplication, or migration work, load `references/import-export-and-migration.md`. For payment, user-registration, marketing, CRM, webhook, or other add-on feeds, load `references/feeds-payments-user-registration.md`. For donations, paid events, simple paid forms, receipts, refunds, cancellations, gateway sandbox checks, or recurring payment risk, load `references/payment-donation-event-flows.md`. For entry exposure, retention, Save and Continue, Partial Entries, personal-data export/erase, or uploaded-file lifecycle questions, load `references/entry-data-lifecycle.md`. For page embeds, shortcodes, duplicate embeds, block insertion, AJAX, or production page validation, load `references/embedding-and-page-integration.md`. For consent text, form microcopy, bilingual/multilingual forms, marketing opt-ins, or translation risk, load `references/consent-localisation-and-microcopy.md`. For conditional logic, dynamic population, field values, pricing fields, totals, or quote calculators, load `references/conditional-dynamic-calculation-logic.md`. For webhook, CRM, marketing, Slack, Zapier, custom API, or automation feeds, load `references/webhooks-and-automation-feeds.md`. For form inventory, stale forms, operational ownership, monthly health checks, dashboard/unread-entry monitoring, or maintenance handoff, load `references/operations-maintenance-and-inventory.md`. For role/capability, entry export, add-on settings, logging/API access, or least-privilege reviews, load `references/permissions-and-capability-governance.md`. For frontend styling, form themes, block style settings, Ready Classes, custom CSS classes, legacy markup, or layout regressions, load `references/frontend-layout-and-theme-styling.md`. For Post Fields, Advanced Post Creation, UGC, editorial submissions, business listings, community stories, taxonomy mapping, media-library mapping, or post-editing flows, load `references/post-creation-and-ugc-workflows.md`. For GA4, GTM, Gravity Forms Google Analytics Add-On, UTM attribution, hidden attribution fields, thank-you page tracking, browser-vs-entry mismatch, or tracking QA, load `references/analytics-conversion-and-attribution.md`. For surveys, polls, quizzes, assessments, scoring, public results, result resets, anonymous feedback, or result reporting, load `references/survey-poll-quiz-assessments.md`. For post-change validation or troubleshooting validation, load `references/qa-and-test-playbooks.md`.

## Route-away rules

Route away when the primary job is a full Gravity Forms audit report, formal findings register, readiness scorecard, client-safe audit summary, retainer audit report, custom plugin code, full legal policy drafting, whole-site launch QA, whole-site performance/accessibility auditing, broader WooCommerce checkout/subscription architecture, content strategy/copywriting, Figma design production, or general WordPress setup. In LightSpeed workflows, route to the relevant specialist skill or agent and provide a concise Gravity Forms handoff if form context matters.

## Reference loading map

- Core product model, lifecycle, forms/entries/feeds/versions/templates: `references/core-concepts.md`
- MCP and REST capability mapping, idempotency, rollback: `references/mcp-and-rest-api-contract.md`
- Concrete MCP action sequencing and manual fallbacks: `references/mcp-action-recipes.md`
- Change risk, approval wording, rollback notes, refusals: `references/change-risk-and-approval.md`
- Fields, form object modelling, field settings, calculations: `references/fields-and-form-objects.md`
- Repeatable form recipes and test checklists: `references/workflows.md`
- Notifications, confirmations, merge tags, deliverability: `references/notifications-confirmations-merge-tags.md`
- Add-ons, integrations, Gravity Wiz, GravityKit, Zero Spam: `references/addons-integrations.md`
- Feed audits, payment feeds, user-registration feeds, marketing/CRM feeds: `references/feeds-payments-user-registration.md`
- Donation, paid event, simple order, receipt, refund, cancellation and payment-test workflows: `references/payment-donation-event-flows.md`
- Entries, exports, erasure, retention, partial/draft data, uploaded-file lifecycle: `references/entry-data-lifecycle.md`
- Page embeds, Gravity Forms block, shortcode settings, duplicate placements, AJAX/embed validation: `references/embedding-and-page-integration.md`
- Consent wording, form microcopy, localisation, multilingual variants, translation approval: `references/consent-localisation-and-microcopy.md`
- Conditional logic, dynamic population, field values, calculations, pricing and quote calculators: `references/conditional-dynamic-calculation-logic.md`
- Webhooks, custom API, Zapier, Slack, CRM, marketing automation and outbound data-feed review: `references/webhooks-and-automation-feeds.md`
- Form inventory, stale/orphaned form review, maintenance health checks, unread-entry monitoring, ownership handoff: `references/operations-maintenance-and-inventory.md`
- Role and capability governance, least-privilege access, entry export/delete, settings/API/logging permissions: `references/permissions-and-capability-governance.md`
- Frontend form themes, block styles, Ready Classes, custom CSS, legacy markup, layout regression checks: `references/frontend-layout-and-theme-styling.md`
- Post Fields, Advanced Post Creation, UGC moderation, taxonomy mapping, media-library handoff, post editing: `references/post-creation-and-ugc-workflows.md`
- Analytics, conversion tracking, GA4/GTM, UTM attribution, hidden fields, tracking QA: `references/analytics-conversion-and-attribution.md`
- Surveys, polls, quizzes, assessments, scoring, anonymous feedback, public results, result reviews: `references/survey-poll-quiz-assessments.md`
- Spam, security, privacy, file uploads, retention: `references/spam-security-privacy.md`
- Accessibility design/content/dev/test guidance: `references/accessibility.md`
- Troubleshooting, logging, conflicts, email, cache, REST errors: `references/troubleshooting.md`
- Environment, cache/script optimisation, logging, upload, and notification compatibility: `references/environment-and-compatibility.md`
- Import, export, duplication, migration, and rollback safeguards: `references/import-export-and-migration.md`
- Post-change QA scenarios and validation matrices: `references/qa-and-test-playbooks.md`
- Requirements intake for new or reworked forms: `intake/form-requirements-intake.md`
- Standalone/shared-agent usage and route-away boundaries: `references/routing-and-agent-use.md`
- Auditor handoff contract, intake rules, and remediation evidence format: `references/auditor-handoff-contract.md`
- Auditor-to-configuration handoff contract: `references/auditor-configuration-contract.md`
- Auditor handoff schema: `schemas/auditor-configuration-handoff.schema.json`
- Source confidence and version caveats: `references/source-register.md`
- Agent-specific defaults: `profiles/wordpress-configuration-agent.md`, `profiles/woocommerce-configuration-agent.md`, `profiles/tour-operator-configuration-agent.md`
- Manual fallback output: `templates/manual-implementation-plan.md`; risk review output: `templates/risk-review.md`; notification audit output: `templates/notification-audit.md`; troubleshooting output: `templates/troubleshooting-runbook.md`; feed audit output: `templates/feed-audit.md`; data-retention output: `templates/data-retention-review.md`; embed validation output: `templates/embed-validation.md`; consent/microcopy output: `templates/consent-copy-review.md`; logic map output: `templates/logic-map-review.md`; webhook feed output: `templates/webhook-feed-review.md`; form inventory output: `templates/form-inventory-audit.md`; permissions review output: `templates/permissions-review.md`; frontend style audit output: `templates/frontend-style-audit.md`; layout regression output: `templates/layout-regression-check.md`; post creation review output: `templates/post-creation-feed-review.md`; UGC handoff output: `templates/ugc-moderation-handoff.md`; conversion tracking output: `templates/conversion-tracking-plan.md`; tracking QA output: `templates/tracking-qa-report.md`; assessment output: `templates/assessment-plan.md`; results review output: `templates/results-review.md`; payment flow output: `templates/payment-flow-review.md`; payment test output: `templates/payment-test-report.md`; auditor handoff intake output: `templates/auditor-handoff-intake.md`

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

---
name: woocommerce-gravity-forms-auditor
description: 'audit gravity forms setups on wordpress websites running the woocommerce core plugin and relevant woocommerce extension plugins through read-only wordpress mcp evidence or supplied exports. use for woocommerce product enquiry forms, quote requests, stock or availability enquiries, b2b and wholesale forms, product option or deposit flows, customer onboarding, customer account support, order-related support forms, payment and user-registration feed risks, product page embeds, notification and deliverability reviews, confirmations, conditional logic, spam/security/privacy checks, accessibility checks, add-on/feed reviews, findings registers, readiness scorecards, retest reports, and contract handoffs to the woocommerce-gravity-forms-configuration skill. do not use for applying configuration changes or write operations.'
---

# WooCommerce Gravity Forms Auditor

## Core purpose

Audit Gravity Forms setups only on WordPress websites that run the WooCommerce core plugin and, where relevant, WooCommerce extension plugins. Use read-only evidence to produce WooCommerce-specific findings, readiness scoring, prioritised recommendations, retest reports, and contract-safe handoffs for approved configuration work. Never change the site from this skill.

Use this skill when Gravity Forms supports WooCommerce product enquiry, quote request, stock or availability enquiry, B2B or wholesale lead capture, product option or deposit flows, customer onboarding, customer account support, order-related support, product page embeds, WooCommerce extension-related form flows, payment feed risks, user-registration feed risks, or customer-service workflows attached to a WooCommerce store.

Do not frame this as a general WordPress Gravity Forms audit. If the site does not run WooCommerce core, or the form workflow is unrelated to WooCommerce products, orders, customers, accounts, quotes, stock, payments, wholesale, product pages, or WooCommerce extensions, route away to the appropriate non-WooCommerce workflow.

## Non-negotiable boundary

Use this skill for inspection, scoring, reporting, prioritisation, troubleshooting review, retest reporting, and handoff preparation only.

Do not create, modify, configure, test-submit, publish, delete, duplicate, activate, deactivate, or otherwise change Gravity Forms, WordPress, WooCommerce, WooCommerce extensions, add-ons, SMTP, logging, plugins, pages, users, entries, feeds, confirmations, notifications, payments, retention, cache, checkout, orders, customer accounts, products, stock, shipping, tax, subscriptions, refunds, fulfilment, or settings data.

If the user asks to fix, implement, configure, remediate, test-submit, or apply changes, produce a contract-compliant handoff for `woocommerce-gravity-forms-configuration` instead of making the change.

Avoid personal-data exposure. Prefer metadata, counts, redacted examples, form schemas, settings summaries, safe logs, and page evidence. Do not reveal secrets, licence keys, API keys, payment credentials, webhook secrets, order personal data, customer account data, or unnecessary entry personal data.

## Operating modes

Choose the smallest mode that satisfies the WooCommerce request.

### Fast audit mode

Use for quick checks, sales/preflight reviews, triage, single-form reviews, notification checks, spam checks, product enquiry reviews, quote-request checks, order-support form checks, product page embed reviews, stock/availability enquiry checks, B2B or wholesale form checks, or limited evidence.

Minimum scope:

1. Identify site/environment, WooCommerce core/plugin evidence, form name or ID, WooCommerce business journey, audience, and requested output.
2. Inspect only available read-only evidence for form schema, product/order/customer/page context, embed/page context, notifications, confirmations, spam protection, privacy-sensitive fields, accessibility basics, and relevant active feeds.
3. Produce the fast audit output structure.
4. List evidence gaps instead of expanding into a full audit.
5. Create a paired configuration handoff only for actionable changes.

### Full audit mode

Use for WooCommerce Gravity Forms setup audits, launch readiness reviews, retainer health checks, multi-form reviews, privacy/data handling reviews, add-on/feed reviews, WooCommerce enquiry flow audits, client-safe audit packs, or full retest reports.

Minimum sequence:

1. Identify site URL, environment, audit purpose, WooCommerce scope, audience, requested output, and internal versus client-safe boundary.
2. Discover available MCP actions/resources and map them to read-only capabilities; do not assume action names.
3. Run read-only WooCommerce preflight: WordPress/PHP versions, Gravity Forms status/version, WooCommerce status/version, relevant WooCommerce extensions, licence visibility, REST/API availability, user capabilities, installed Gravity Forms add-ons, SMTP/email plugins, cache/optimisation plugins, security/spam plugins, theme, multisite, known blockers, and missing evidence.
4. Confirm scope: product enquiry forms, quote requests, stock/availability enquiries, B2B or wholesale forms, product option/deposit flows, customer onboarding, customer account support, order-related support forms, product page embeds, payment/user-registration feed risks, notifications, confirmations, spam/security, accessibility, add-ons/feeds, troubleshooting, or retest.
5. Inspect only required evidence and avoid unnecessary personal data.
6. Classify every finding using the embedded core models.
7. Produce the full audit output structure.
8. Create paired configuration handoffs for actionable changes.

### Retest mode

Use when reviewing completed WooCommerce Gravity Forms fixes or configuration validation results. Preserve original finding IDs. Report `Closed`, `Partially closed`, `Still open`, or `Unable to verify`. Do not test-submit or change settings unless the user explicitly routes the work to `woocommerce-gravity-forms-configuration`.

## Evidence and MCP rules

Load `references/mcp-readonly-capability-map.md` only for live MCP work that needs connector-specific mapping. Map discovered tools/resources to read-only capabilities such as site inspection, plugin list, WooCommerce status, WooCommerce extension status, product/page context read, order/customer support context read, form list, form schema read, notifications read, confirmations read, feeds read, entry metadata read, spam count, safe logs, page embed inspection, REST/API status, and user capability inspection.

If MCP cannot verify a claim, mark it as missing evidence and lower confidence. If no MCP access exists, use or request exported form JSON, screenshots, system status, redacted logs, page URLs, pasted settings, plugin lists, SMTP evidence, WooCommerce product/page examples, WooCommerce extension lists, and page screenshots. Do not invent settings, versions, add-ons, entries, logs, delivery results, privacy posture, accessibility outcomes, product context, order behaviour, checkout behaviour, stock behaviour, extension behaviour, or current operational ownership.

## Embedded core models

Use these models even when reference files are not loaded. Reference files are optional depth packs, not required for minimum audit output.

### Evidence confidence

- `High`: directly verified through read-only MCP, exported Gravity Forms JSON/settings, exported WooCommerce/system evidence, official documentation, safe observed page evidence, or supplied screenshots/logs that clearly show the issue.
- `Medium`: supported by multiple partial signals, but at least one important detail is not directly verified.
- `Low`: based on incomplete evidence, indirect clues, user-supplied summary only, or a LightSpeed recommendation without direct verification.

Always separate confirmed facts from assumptions and state evidence gaps explicitly.

### Severity

- `Blocker`: prevents submission, blocks the WooCommerce business journey, risks payment/user creation failure, exposes sensitive data, or makes launch unsafe.
- `High`: likely to lose leads, break notifications, create serious spam/security/privacy exposure, misroute critical enquiries, lose quote opportunities, break product enquiry capture, expose order/account data, or create major accessibility barriers.
- `Medium`: harms conversion, maintainability, editor reliability, integration quality, reporting, quote quality, product context capture, customer support quality, or user experience without clearly blocking the journey.
- `Low`: minor UX, wording, consistency, metadata, non-critical configuration, or maintainability improvement.
- `Info`: observation, limitation, context note, or recommendation with no immediate fix required.

### Priority groups

- `Immediate`: blockers, revenue/lead-loss risks, privacy/security risks, broken notifications, inaccessible submission paths, failed payment/user/account/feed flows, missing product context on critical enquiry forms, or order/account support paths that cannot reach the right team.
- `Next`: conversion, UX, editor workflow, routing, reporting, product context, quote quality, order-support quality, customer-account support quality, and maintainability issues for the next planned change window.
- `Later`: polish, documentation, optional optimisation, and low-risk improvements.

### Recommendation labels

- `Platform requirement`: required by Gravity Forms, WordPress, WooCommerce, a WooCommerce extension, an integration, or a known technical constraint.
- `LightSpeed recommendation`: agency best practice, maintainability recommendation, UX recommendation, ecommerce conversion recommendation, or risk reduction preference.
- `Client decision`: requires business, legal, privacy, sales, support, ecommerce operations, or fulfilment approval.
- `Missing evidence`: cannot be recommended safely until more information is provided.

### Finding fields

Every finding must include:

- Finding ID
- Category
- Affected form/page/add-on/feed/product/order/customer/account context
- Severity
- Priority group
- Confidence
- Confirmed evidence
- Evidence gaps where relevant
- Impact
- Recommendation
- Recommendation label
- Effort (`Small`, `Medium`, `Large`, or `Unknown`)
- Owner (`LightSpeed`, `Client`, `Host`, `Email/DNS provider`, `Third-party vendor`, or `Unknown`)
- Handoff needed (`Yes` or `No`)
- Retest step

### Readiness scorecard

Score each relevant category from 0 to 10, or mark `Not assessed` when evidence is unavailable. Do not average unknown categories as zero. Provide a total readiness score only when at least five categories have evidence.

Categories: WooCommerce operational readiness; Gravity Forms structure and UX; accessibility; spam protection; security and privacy; notifications and deliverability; confirmations and customer feedback; add-ons, feeds, and integrations; embeds and front-end behaviour; data handling and retention; WooCommerce enquiry and quote flow; product/order/customer context handling; maintainability.

Score guidance: `8-10` ready with minor follow-up; `5-7` usable with planned fixes; `3-4` risky and should be fixed before relying on the form; `0-2` unsafe, broken, or not ready.

### Common failure prompts

Use these as prompts, not assumptions: weak notification From/Reply-To; no SMTP evidence; vague confirmations; missing or inconsistent spam protection; high-friction multi-page flow; placeholder-only labels; weak consent or retention posture; risky file uploads; stale feed mappings; broken conditional logic; cache/script optimisation conflicts; missing WooCommerce product context; missing SKU/product URL/variation capture; quote forms that imply checkout or payment without approval; stock or availability enquiries routed to the wrong team; order-related support forms exposing unnecessary customer/order data; B2B/wholesale forms missing approval or segmentation evidence; customer-account support forms collecting unnecessary credentials; extension-related forms without confirmed extension evidence.

## WooCommerce-specific audit focus

For WooCommerce-related forms, check:

- Whether the form is only an enquiry/support/quote flow or whether it is trying to replace checkout, account, tax, stock, order, subscription, shipping, refund, or fulfilment behaviour.
- Whether product context is captured reliably, such as product ID, title, SKU, variation, category, product URL, quantity, and page source where relevant.
- Whether product page embeds behave safely on mobile, cached pages, AJAX product views, reusable templates, and block-theme/product-template contexts.
- Whether quote request fields capture enough information for the sales team without creating payment, pricing, tax, shipping, or checkout confusion.
- Whether stock or availability enquiries make it clear that stock is confirmed by the business and not guaranteed by the form unless integrated evidence proves otherwise.
- Whether B2B or wholesale forms include suitable approval, segmentation, consent, and routing signals.
- Whether product option, deposit, payment, or user-registration flows have explicit scope, add-on/feed evidence, test/live environment awareness, SSL/payment approval notes, and rollback-safe validation requirements.
- Whether order-related contact forms avoid unnecessary sensitive customer/order data and route to the right support process.
- Whether customer account support forms avoid password, credential, payment-card, and excessive account-data collection.
- Whether notifications, feeds, CRM mappings, confirmations, and WooCommerce extension mappings preserve product/order/customer context while protecting customer data.

## Enforced output structures

Always use one of these structures unless the user explicitly requests another format. Keep connector internals, secrets, private logs, order details, customer personal data, and entry personal data out of client-safe outputs.

### Fast audit output

1. `Audit snapshot`: site/environment, WooCommerce evidence, form/page/product/order/customer context reviewed, mode, evidence used, evidence gaps.
2. `Top-line result`: overall status (`Ready`, `Mostly ready`, `Needs fixes`, or `Not ready`) plus 3 bullets for value, biggest risk, next step.
3. `Findings register`: table with the required finding fields.
4. `Priority actions`: Immediate, Next, Later.
5. `Configuration handoff`: include only actionable changes that should move to `woocommerce-gravity-forms-configuration`; use the paired contract where required.
6. `Retest steps`: clear checks to confirm each fix.

### Full audit output

1. `Audit scope and limitations`: site/environment, WooCommerce scope, mode, audience, in scope, out of scope, evidence sources, evidence gaps and confidence caveats.
2. `Executive summary`: readiness status, 3-5 key risks, 3-5 recommended next actions.
3. `Readiness scorecard`: category, score or `Not assessed`, rationale, confidence.
4. `Findings register`: table with the required finding fields.
5. `Priority action plan`: Immediate, Next, Later.
6. `Configuration handoff`: contract-compliant handoff packets for actionable findings.
7. `Retest plan`: finding ID, retest method, expected result, evidence to capture.
8. `Appendix`: optional internal evidence notes, capability map, redacted logs, template references, or unresolved questions.

### Retest output

1. `Retest scope`: source audit, WooCommerce scope, finding IDs, evidence used, limitations.
2. `Retest results`: finding ID, original risk, current status, evidence, remaining gap.
3. `Closure summary`: closed, partially closed, still open, unable to verify.
4. `Next handoff`: only if further configuration work is required.

## Paired configuration contract

When any finding has `Handoff needed: Yes`, or the user asks to fix/remediate/configure audit findings, load `references/auditor-configuration-contract.md` and emit a contract-compliant handoff packet.

Use `templates/auditor-configuration-handoff.md` for larger or formal handoffs. Use `schemas/auditor-configuration-handoff.schema.json` when a structured JSON packet is requested or validation is useful.

Every paired handoff must preserve finding IDs and include contract version, site/environment, affected WooCommerce/form items, confirmed evidence, evidence gaps, risk level, priority group, recommendation label, proposed remediation, required capabilities, approval requirements, change risk notes, validation steps, rollback notes, and a suggested prompt for `woocommerce-gravity-forms-configuration`.

Do not abbreviate required handoff fields in internal handoffs. For client-safe outputs, include a plain-language summary and keep the detailed implementation packet internal.

The auditor produces evidence and risk. The WooCommerce configuration skill verifies current state, prepares a reversible change plan, requests approval, applies only approved changes, validates results, and maps validation back to the original finding IDs.

## Focus area depth packs

Load only the relevant reference file when the current task needs depth beyond the embedded model:

- Accessibility: `references/accessibility-audit.md`
- Spam, security, privacy, retention, file uploads: `references/spam-security-privacy-audit.md`
- Notifications and deliverability: `references/notifications-and-deliverability-audit.md`
- Add-ons, feeds, integrations: `references/addons-feeds-and-integrations-audit.md`
- WooCommerce enquiry flows: `references/woocommerce-form-audit.md`
- Capability discovery: `references/mcp-readonly-capability-map.md`
- Audit process and scoring: `references/audit-methodology.md`
- Practical checklists: `references/audit-checklists.md`
- Paired configuration contract: `references/auditor-configuration-contract.md`
- Source confidence/version caveats: `references/source-register.md`

## Client-safe output rules

Client-safe outputs must exclude secrets, licence keys, API keys, private logs, entry personal data, raw order records, full customer account data, raw connector internals, unsupported speculation, and unnecessary implementation details. Replace connector internals with plain-language labels such as `form settings reviewed`, `notification settings reviewed`, `feed settings reviewed`, `product page context reviewed`, `WooCommerce status reviewed`, `WooCommerce extension evidence reviewed`, or `page embed observed`.

## Route away

Route to `woocommerce-gravity-forms-configuration` for approved WooCommerce Gravity Forms configuration changes, new WooCommerce-scoped form creation, remediation implementation, approved test submissions, post-change validation that requires writes, or manual implementation plans. Route broader legal, security incident, WooCommerce checkout architecture, order/tax/subscription/stock/shipping/refund/fulfilment architecture, whole-site accessibility, whole-site performance, custom plugin development, copywriting, launch QA, or SEO work to the relevant specialist skill.

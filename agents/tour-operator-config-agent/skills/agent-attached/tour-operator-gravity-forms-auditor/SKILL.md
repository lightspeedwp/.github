---
name: tour-operator-gravity-forms-auditor
description: 'audit gravity forms setups on wordpress websites running the tour operator plugin and relevant extension plugins, including tour, destination, booking enquiry, quote request, itinerary, accommodation, brochure, agent, trade, newsletter, contact, and travel lead-generation forms through read-only wordpress mcp evidence or supplied exports. use for health checks, fast audits, full preflight audits, form quality reviews, accessibility checks, spam and security reviews, privacy/data retention checks, notification and deliverability audits, add-on/feed reviews, tour enquiry audits, findings registers, readiness scorecards, client-safe summaries, retest reports, and configuration handoffs. do not use for non-tour-operator-plugin sites, generic travel sites without tour operator plugin evidence, applying configuration changes, or write operations.'
---

# Tour Operator Gravity Forms Auditor

## Core purpose

Audit Gravity Forms setups on WordPress websites that run the Tour Operator plugin and relevant extension plugins using read-only evidence. Produce consistent findings, readiness scoring, prioritised recommendations, retest reports, and contract-safe handoffs for approved configuration work. Never change the site from this skill.

## Non-negotiable boundary

Use this skill for inspection, scoring, reporting, prioritisation, troubleshooting review, retest reporting, and handoff preparation only, and only for WordPress sites where the Tour Operator plugin or its extension plugins are confirmed or are the explicit audit target.

Do not create, modify, configure, test-submit, publish, delete, duplicate, activate, deactivate, or otherwise change Gravity Forms, WordPress, Tour Operator plugin, extension plugin, add-on, SMTP, logging, page, user, entry, feed, confirmation, notification, payment, retention, cache, or settings data.

If the user asks to fix, implement, configure, remediate, or apply changes, produce a contract-compliant handoff for the `tour-operator-gravity-forms-configuration` skill, instead of making the change.

Avoid personal-data exposure. Prefer metadata, counts, redacted examples, form schemas, settings summaries, safe logs, and page evidence. Do not reveal secrets, licence keys, API keys, payment credentials, webhook secrets, or unnecessary entry personal data.

## Operating modes

Choose the smallest mode that satisfies the request.

### Fast audit mode

Use for quick checks, sales/preflight reviews, triage, single-form reviews, notification checks, spam checks, or limited evidence.

Minimum scope:
1. Identify site/environment, form name or ID, Tour Operator plugin or extension plugin evidence, travel journey, audience, and requested output.
2. Inspect only available read-only evidence for form schema, embed/page context, notifications, confirmations, spam protection, privacy-sensitive fields, accessibility basics, and relevant active feeds.
3. Produce the fast audit output structure.
4. List evidence gaps instead of expanding into a full audit.
5. Create a paired configuration handoff only for actionable changes.

### Full audit mode

Use for whole-setup audits, launch readiness reviews, retainer health checks, multi-form reviews, privacy/data handling reviews, add-on/feed reviews, tour-operator flow audits, client-safe audit packs, or full retest reports.

Minimum sequence:
1. Identify site URL, environment, audit purpose, scope, audience, requested output, and internal versus client-safe boundary.
2. Discover available MCP actions/resources and map them to read-only capabilities; do not assume action names.
3. Run read-only preflight: WordPress/PHP versions, Tour Operator plugin status/version, relevant extension plugin status/version, Gravity Forms status/version, licence visibility, REST/API availability, user capabilities, installed add-ons, SMTP/email plugins, cache/optimisation plugins, security/spam plugins, theme, multisite, known blockers, and missing evidence.
4. Confirm scope: whole setup, specific forms, notifications, confirmations, spam/security, accessibility, add-ons/feeds, tour-operator flow, troubleshooting, or retest.
5. Inspect only required evidence and avoid unnecessary personal data.
6. Classify every finding using the embedded core models.
7. Produce the full audit output structure.
8. Create paired configuration handoffs for actionable changes.

### Retest mode

Use when reviewing completed fixes or configuration validation results. Preserve original finding IDs. Report `Closed`, `Partially closed`, `Still open`, or `Unable to verify`. Do not test-submit or change settings unless the user explicitly routes the work to the `tour-operator-gravity-forms-configuration` skill.

## Evidence and MCP rules

Load `references/mcp-readonly-capability-map.md` only for live MCP work that needs connector-specific mapping. Map discovered tools/resources to capabilities such as site inspection, plugin list, form list, form schema read, notifications read, confirmations read, feeds read, entry metadata read, spam count, safe logs, page embed inspection, REST/API status, and user capability inspection.

If MCP cannot verify a claim, mark it as missing evidence and lower confidence. If no MCP access exists, use or request exported form JSON, screenshots, system status, redacted logs, page URLs, pasted settings, plugin lists showing the Tour Operator plugin and extension plugins, SMTP evidence, and page screenshots. Do not invent settings, versions, add-ons, entries, logs, delivery results, privacy posture, accessibility outcomes, or current operational ownership.

## Embedded core models

Use these models even when reference files are not loaded. Reference files are optional depth packs, not required for minimum audit output.

### Evidence confidence

- `High`: directly verified through read-only MCP, exported Gravity Forms JSON/settings, official documentation, safe observed page evidence, or supplied screenshots/logs that clearly show the issue.
- `Medium`: supported by multiple partial signals, but at least one important detail is not directly verified.
- `Low`: based on incomplete evidence, indirect clues, user-supplied summary only, or a LightSpeed recommendation without direct verification.

Always separate confirmed facts from assumptions and state evidence gaps explicitly.

### Severity

- `Blocker`: prevents submission, blocks the core travel enquiry journey, risks payment/user creation failure, exposes sensitive data, or makes launch unsafe.
- `High`: likely to lose leads, break notifications, create serious spam/security/privacy exposure, misroute critical enquiries, or create major accessibility barriers.
- `Medium`: harms conversion, maintainability, editor reliability, integration quality, reporting, or user experience without clearly blocking the journey.
- `Low`: minor UX, wording, consistency, metadata, non-critical configuration, or maintainability improvement.
- `Info`: observation, limitation, context note, or recommendation with no immediate fix required.

### Priority groups

- `Immediate`: blockers, lead-loss risks, privacy/security risks, broken notifications, inaccessible submission paths, failed payment/user/feed flows, or sensitive travel-data exposure.
- `Next`: conversion, UX, editor workflow, routing, reporting, and maintainability issues for the next planned change window.
- `Later`: polish, documentation, optional optimisation, and low-risk improvements.

### Recommendation labels

- `Platform requirement`: required by Gravity Forms, WordPress, an integration, or a known technical constraint.
- `LightSpeed recommendation`: agency best practice, maintainability recommendation, UX recommendation, or risk reduction preference.
- `Client decision`: requires business, legal, privacy, sales, or operational approval.
- `Missing evidence`: cannot be recommended safely until more information is provided.

### Finding fields

Every finding must include:
- Finding ID
- Category
- Affected form/page/add-on/feed
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

Categories: operational readiness; form structure and UX; accessibility; spam protection; security and privacy; notifications and deliverability; confirmations and user feedback; add-ons, feeds, and integrations; embeds and front-end behaviour; data handling and retention; maintainability; tour enquiry readiness.

Score guidance: `8-10` ready with minor follow-up; `5-7` usable with planned fixes; `3-4` risky and should be fixed before relying on the form; `0-2` unsafe, broken, or not ready.

### Common failure prompts

Use these as prompts, not assumptions: Tour Operator plugin or extension plugin presence not verified; weak notification From/Reply-To; no SMTP evidence; vague confirmations; missing or inconsistent spam protection; high-friction multi-page flow; placeholder-only labels; weak consent or retention posture; risky file uploads; stale feed mappings; broken conditional logic; cache/script optimisation conflicts; missing destination, tour, season, accommodation, itinerary, traveller count, or sales-team routing context; travel forms collecting deposits, passport, health, accessibility, mobility, dietary, emergency-contact, or CRM details without secure handling.

## Tour operator form types

Use tour-operator framing only for Gravity Forms on WordPress websites running the Tour Operator plugin or relevant extension plugins, especially forms that support:
- Tour enquiry forms
- Booking enquiry forms
- Accommodation enquiry forms when relevant to travel operations
- Destination enquiry forms
- Travel-style enquiry forms
- Custom itinerary forms
- Brochure/download forms
- Group travel forms
- Agent/trade enquiry forms
- Newsletter or lead forms
- Quote request forms
- Contact and support forms

## Enforced output structures

Always use one of these structures unless the user explicitly requests another format. Keep connector internals, secrets, private logs, and entry personal data out of client-safe outputs.

### Fast audit output

1. `Audit snapshot`: site/environment, form/page reviewed, mode, evidence used, evidence gaps.
2. `Top-line result`: overall status (`Ready`, `Mostly ready`, `Needs fixes`, or `Not ready`) plus 3 bullets for value, biggest risk, next step.
3. `Findings register`: table with the required finding fields.
4. `Priority actions`: Immediate, Next, Later.
5. `Configuration handoff`: include only actionable changes that should move to the `tour-operator-gravity-forms-configuration` skill; use the paired contract where required.
6. `Retest steps`: clear checks to confirm each fix.

### Full audit output

1. `Audit scope and limitations`: site/environment, mode, audience, in scope, out of scope, evidence sources, evidence gaps and confidence caveats.
2. `Executive summary`: readiness status, 3-5 key risks, 3-5 recommended next actions.
3. `Readiness scorecard`: category, score or `Not assessed`, rationale, confidence.
4. `Findings register`: table with the required finding fields.
5. `Priority action plan`: Immediate, Next, Later.
6. `Configuration handoff`: contract-compliant handoff packets for actionable findings.
7. `Retest plan`: finding ID, retest method, expected result, evidence to capture.
8. `Appendix`: optional internal evidence notes, capability map, redacted logs, template references, or unresolved questions.

### Retest output

1. `Retest scope`: source audit, finding IDs, evidence used, limitations.
2. `Retest results`: finding ID, original risk, current status, evidence, remaining gap.
3. `Closure summary`: closed, partially closed, still open, unable to verify.
4. `Next handoff`: only if further configuration work is required.

## Paired configuration contract

When any finding has `Handoff needed: Yes`, or the user asks to fix/remediate/configure audit findings, load `references/auditor-configuration-contract.md` and emit a contract-compliant handoff packet.

Use `templates/auditor-configuration-handoff.md` for larger or formal handoffs. Use `schemas/auditor-configuration-handoff.schema.json` when a structured JSON packet is requested or validation is useful.

Every paired handoff must preserve finding IDs and include contract version, site/environment, affected items, confirmed evidence, evidence gaps, risk level, priority group, recommendation label, proposed remediation, required capabilities, approval requirements, change risk notes, validation steps, rollback notes, and a suggested prompt for the `tour-operator-gravity-forms-configuration` skill.

Do not abbreviate required handoff fields in internal handoffs. For client-safe outputs, include a plain-language summary and keep the detailed implementation packet internal.

The auditor produces evidence and risk. The configuration workflow verifies current state, prepares a reversible change plan, requests approval, applies only approved changes, validates results, and maps validation back to the original finding IDs.

## Focus area depth packs

Load only the relevant reference file when the current task needs depth beyond the embedded model:

- Accessibility: `references/accessibility-audit.md`
- Spam, security, privacy, retention, file uploads: `references/spam-security-privacy-audit.md`
- Notifications and deliverability: `references/notifications-and-deliverability-audit.md`
- Add-ons, feeds, integrations: `references/addons-feeds-and-integrations-audit.md`
- Tour operator enquiry flows: `references/tour-operator-form-audit.md`
- Capability discovery: `references/mcp-readonly-capability-map.md`
- Audit process and scoring: `references/audit-methodology.md`
- Practical checklists: `references/audit-checklists.md`
- Paired configuration contract: `references/auditor-configuration-contract.md`
- Source confidence/version caveats: `references/source-register.md`

## Client-safe output rules

Client-safe outputs must exclude secrets, licence keys, API keys, private logs, entry personal data, raw connector internals, unsupported speculation, and unnecessary implementation details. Replace connector internals with plain-language labels such as `form settings reviewed`, `notification settings reviewed`, `feed settings reviewed`, or `page embed observed`.

## Route away

Route to the `tour-operator-gravity-forms-configuration` skill for approved configuration changes, new form creation, remediation implementation, test submissions, post-change validation that requires writes, or manual implementation plans. Route non-Tour-Operator-plugin form audits, generic travel sites without Tour Operator plugin evidence, broader legal, security incident, whole-site accessibility, whole-site performance, custom plugin development, copywriting, launch QA, or SEO work to the relevant specialist skill.

# Routing and agent use

## Relationship with gravity-forms-auditor

Route to `gravity-forms-auditor` for:

- Full Gravity Forms audits
- Formal findings registers
- Readiness scorecards
- Client-safe audit summaries
- Retainer health checks
- Pre-launch audit reports
- Retest reports after a separate audit cycle

Stay in `gravity-forms-configuration` for:

- Preflight/readiness checks before configuration
- Troubleshooting
- Remediation planning
- Approved implementation
- Form creation or updates
- Notification/confirmation/feed changes
- Spam/security configuration
- Accessibility-aware configuration fixes
- WooCommerce enquiry implementation
- Tour operator enquiry implementation
- Post-change validation
- Handoff notes

## Example auditor/configuration routing decisions

- "Audit all forms and give me a client summary" -> `gravity-forms-auditor`
- "Check if we are ready to add Turnstile" -> `gravity-forms-configuration`
- "Fix the notification issue found in the audit" -> `gravity-forms-configuration`
- "Create a findings register for this site" -> `gravity-forms-auditor`
- "Use this audit handoff to prepare a change plan" -> `gravity-forms-configuration`

When an auditor handoff is supplied, use `references/auditor-handoff-contract.md`; verify the current site state where possible, preserve finding IDs, and produce a change plan before any write operation. Accept canonical `gravity-forms-auditor` v0.2.1+ handoff packets as well as legacy normalised handoffs; missing canonical fields are readiness gaps, not approval to infer or execute changes.

## Standalone use

When invoked directly, this skill owns Gravity Forms configuration, audit, validation, troubleshooting, testing, and handoff. It should collect only blocking missing details, run preflight where live tools exist, and produce the smallest useful output: report, plan, change summary, test report, or handoff.

## WordPress Configuration Agent

Use for general site forms: contact, newsletter, quote, support, content submission, page embedding, notifications, confirmations, spam protection, accessibility, and troubleshooting. Prefer stable core features and official add-ons confirmed by preflight. If no write actions exist, produce manual admin steps.

## WooCommerce Configuration Agent

Use for product enquiry, quote request, conditional option capture, deposit/payment forms, and customer onboarding. Do not replace WooCommerce checkout by default. Escalate checkout, tax, shipping, subscriptions, order creation, and fulfilment architecture outside this skill unless explicitly scoped and approved.

## Tour Operator Website Configuration Agent

Use for safari/tour enquiries, itinerary planning, multi-step lead forms, travel dates, group size, accommodation, interests, budget, consent, optional partial entries, and deposit/payment plans. Prefer enquiry-first flows and consultant handoff. Avoid sensitive travel documents unless secure handling is approved.

## Agent-specific defaults

- **WordPress**: short forms, block embed, domain From Email, Reply-To submitter, consent, honeypot/layered spam, test submission.
- **WooCommerce**: preserve checkout, collect product context, validate pricing/payment implications, treat order/payment/user changes as high-risk.
- **Tour operator**: multi-page for long journeys, conditional logic to reduce friction, lead routing to consultant/team, privacy-aware travel data collection.

## Route-away examples

- Full checkout rebuild -> WooCommerce architecture/configuration skill.
- Legal privacy policy -> policy/legal review workflow.
- Whole-site accessibility audit -> accessibility audit skill.
- Performance problems outside form scripts/caching -> performance/PageSpeed skill.
- Custom plugin/API code -> implementation/developer skill.
- Visual form design in Figma -> Figma/design skill.

## Good user prompts

- "Audit Gravity Forms on staging and produce a preflight report only."
- "Plan a WooCommerce product enquiry form but do not create it."
- "Review this form JSON for notification and spam issues."
- "Create a tour enquiry form change plan using the available MCP tools."
- "After the approved change, run a test submission and handoff note."

## Unsafe or incomplete prompts

- "Delete all old entries" without explicit scope, export/backup, retention approval, and tool support.
- "Set up Stripe" without gateway/account/test mode/currency/product evidence.
- "Create users from this form" without User Registration add-on, role, activation, and approval.
- "Disable CAPTCHA because it annoys people" without alternate spam plan.
- "Upload passports" without secure storage, retention, access, and policy approval.

## Handoff timing

Create a handoff after any applied change, after a failed validation that needs another owner, before escalation, or when a configuration plan is approved but implementation will be done by another teammate.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

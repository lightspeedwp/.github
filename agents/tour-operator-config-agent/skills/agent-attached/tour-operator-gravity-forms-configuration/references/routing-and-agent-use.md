# Routing and agent use

## Relationship with tour-operator-gravity-forms-auditor

Route to `tour-operator-gravity-forms-auditor` for:

- Full Gravity Forms audits
- Formal findings registers
- Readiness scorecards
- Client-safe audit summaries
- Retainer health checks
- Pre-launch audit reports
- Retest reports after a separate audit cycle

Stay in `tour-operator-gravity-forms-configuration` for:

- Preflight/readiness checks before configuration
- Troubleshooting
- Remediation planning
- Approved implementation
- Form creation or updates
- Notification/confirmation/feed changes
- Spam/security configuration
- Accessibility-aware configuration fixes
- Tour enquiry implementation
- Trip-planning, itinerary, brochure, destination-interest, and quote-request forms
- Post-change validation
- Handoff notes

## Example auditor/configuration routing decisions

- "Audit all forms and give me a client summary" -> `tour-operator-gravity-forms-auditor`
- "Check if we are ready to add Turnstile" -> `tour-operator-gravity-forms-configuration`
- "Fix the notification issue found in the audit" -> `tour-operator-gravity-forms-configuration`
- "Create a findings register for this site" -> `tour-operator-gravity-forms-auditor`
- "Use this audit handoff to prepare a change plan" -> `tour-operator-gravity-forms-configuration`

When an auditor handoff is supplied, use `references/auditor-handoff-contract.md`; verify the current site state where possible, preserve finding IDs, and produce a change plan before any write operation. Accept canonical `tour-operator-gravity-forms-auditor` v0.2.1+ handoff packets as well as legacy normalised handoffs; missing canonical fields are readiness gaps, not approval to infer or execute changes.

## Standalone use

When invoked directly, this skill owns Gravity Forms configuration, validation, troubleshooting, testing, and handoff for tour operator and travel website forms. It should collect only blocking missing details, run preflight where live tools exist, and produce the smallest useful output: report, plan, change summary, test report, or handoff.

## WordPress Configuration Agent fallback

Use general WordPress form guidance only for ordinary contact, newsletter, support, content submission, page embedding, notifications, confirmations, spam protection, accessibility, and troubleshooting details that are not tour-operator-specific. Prefer stable core features and official add-ons confirmed by preflight. If no write actions exist, produce manual admin steps.

## Tour Operator Configuration Agent

Use for safari/tour enquiries, itinerary planning, multi-step lead forms, travel dates, group size, accommodation, interests, budget, consent, optional partial entries, brochure requests, destination interest, and standalone deposit/payment plans. Prefer enquiry-first flows and consultant handoff. Avoid sensitive travel documents unless secure handling is approved.

## Agent-specific defaults

- **Tour operator first**: multi-page for long journeys, conditional logic to reduce friction, lead routing to consultant/team, privacy-aware travel data collection, clear response-time expectations, and consent-aware marketing opt-ins.
- **General WordPress fallback**: short forms, block embed, domain From Email, Reply-To submitter, consent, honeypot/layered spam, and test submission.

## Route-away examples

- Cart, inventory, fulfilment, complex payment-platform decisions, or commercial policy architecture -> relevant ecommerce/platform owner.
- Legal privacy policy -> policy/legal review workflow.
- Whole-site accessibility audit -> accessibility audit skill.
- Performance problems outside form scripts/caching -> performance/PageSpeed skill.
- Custom plugin/API code -> implementation/developer skill.
- Visual form design in Figma -> Figma/design skill.

## Good user prompts

- "Audit Gravity Forms on staging and produce a preflight report only."
- "Plan a tour itinerary request form but do not create it."
- "Review this form JSON for notification and spam issues."
- "Create a tour enquiry form change plan using the available MCP tools."
- "After the approved change, run a test submission and handoff note."

## Unsafe or incomplete prompts

- "Delete all old entries" without explicit scope, export/backup, retention approval, and tool support.
- "Set up Stripe" without gateway/account/test mode/currency/evidence.
- "Create users from this form" without User Registration add-on, role, activation, and approval.
- "Disable CAPTCHA because it annoys people" without alternate spam plan.
- "Upload passports" without secure storage, retention, access, and policy approval.

## Handoff timing

Create a handoff after any applied change, after a failed validation that needs another owner, before escalation, or when a configuration plan is approved but implementation will be done by another teammate.

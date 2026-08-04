# Install and attach

## Package installation

1. Upload `skill.zip` to the LightSpeed workspace skill library.
2. Confirm the skill appears as `tour-operator-gravity-forms-auditor` and is attached only to workflows that support WordPress websites running the Tour Operator plugin and relevant extension plugins.
3. Attach it alongside the `tour-operator-gravity-forms-configuration` skill so audit work and approved configuration work remain separate.

## Attach to `tour-operator-gravity-forms-configuration` skill

- Add this skill for read-only audits of Gravity Forms on Tour Operator plugin websites, including enquiry-first travel forms, itinerary planners, booking enquiry forms, accommodation enquiries, quote request forms, brochure/download forms, agent/trade enquiries, newsletter forms, contact forms, partial entries, consent/privacy, and routing.
- Keep the configuration workflow attached for approved configuration changes.
- Route booking-engine, payment, travel-document storage, CRM ownership, and privacy-policy decisions outside this skill unless a Gravity Forms subset is explicitly scoped.

## Attach to WordPress Configuration Agent

- Add this skill for read-only Gravity Forms audits, preflights, findings registers, and remediation handoffs on WordPress websites running the Tour Operator plugin and relevant extension plugins.
- Keep `tour-operator-gravity-forms-configuration` attached for approved configuration changes.

## Recommended pairing

- `tour-operator-gravity-forms-auditor`: inspect, assess, score, report, handoff.
- `tour-operator-gravity-forms-configuration` skill: plan, configure, validate approved changes.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*

# Install and attach

## Package installation

1. Upload `skill.zip` to the LightSpeed workspace skill library.
2. Confirm the skill appears as `gravity-forms-auditor`.
3. Attach it to relevant shared agents alongside, not instead of, `gravity-forms-configuration`.

## Attach to WordPress Configuration Agent

- Add this skill for read-only Gravity Forms audits, preflights, findings registers, and remediation handoffs.
- Keep `gravity-forms-configuration` attached for approved configuration changes.

## Attach to WooCommerce Configuration Agent

- Add this skill for product enquiry, quote request, deposit/payment risk, customer registration risk, and product page embed audits.
- Route checkout/tax/order/subscription architecture outside this skill.

## Attach to Tour Operator Website Configuration Agent

- Add this skill for enquiry-first travel forms, itinerary planners, partial entries, consent/privacy, and routing audits.
- Route booking/payment/document-storage decisions outside this skill unless a Gravity Forms subset is explicitly scoped.

## Recommended pairing

- `gravity-forms-auditor`: inspect, assess, score, report, handoff.
- `gravity-forms-configuration`: plan, configure, validate approved changes.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

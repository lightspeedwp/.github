# Acceptance checklist

The auditor skill is complete only when:

- [ ] It has clear read-only trigger conditions for WordPress websites running WooCommerce core and relevant WooCommerce extension plugins.
- [ ] It does not perform write operations.
- [ ] It uses progressive loading.
- [ ] It has a clear severity/confidence model.
- [ ] It produces findings registers.
- [ ] It produces client-safe summaries.
- [ ] It produces internal audit reports.
- [ ] It produces handoffs to `woocommerce-gravity-forms-configuration`.
- [ ] It handles WooCommerce Gravity Forms contexts, with product enquiries, quote requests, stock/availability enquiries, B2B/wholesale forms, product option/deposit flows, order support, account support, payment/user-registration feed risks, extension-related form flows, and product page embeds as first-class audit areas.
- [ ] It treats accessibility, spam, security, privacy, notifications, feeds, payments, and user registration as first-class audit areas only within the WooCommerce-scoped form context.
- [ ] It degrades gracefully when MCP evidence is incomplete.
- [ ] It refuses configuration changes and routes them to the WooCommerce configuration skill.
- [ ] It includes test prompts and expected behaviours.
- [ ] It validates and packages as `skill.zip`.

## Stale-reference failure test

The skill fails acceptance if any file contains:

- A generic downstream reference to the non-WooCommerce configuration target slug.
- A generic downstream reference to the non-WooCommerce auditor slug.
- Tourism/operator-sector wording from the disallowed-language list in `scripts/validate_audit_artifacts.py`.
- A generic configuration-agent profile that is not explicitly scoped to WooCommerce websites running WooCommerce core and relevant WooCommerce extension plugins.

Allowed references:

- The current skill name `woocommerce-gravity-forms-auditor`.
- The required target skill `woocommerce-gravity-forms-configuration`.

## Manual QA prompts

Run representative prompts from `tests/test-prompts.md` and check that the model never performs configuration, never invents evidence, always stays WooCommerce-scoped, and always produces a handoff for approved changes.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*

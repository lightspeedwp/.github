# WooCommerce configuration handoff contract

Use this contract when preparing WooCommerce Gravity Forms findings for `woocommerce-gravity-forms-configuration`. The auditor must not apply the changes.

## Required handoff fields

- Source audit report: title/date/site/environment/report path or summary.
- Finding ID: stable ID from findings register.
- Affected site: canonical WooCommerce site URL and environment.
- WooCommerce context: product enquiry, quote request, stock/availability, B2B/wholesale, order support, account support, customer onboarding, payment/deposit, user registration, product page embed, or extension-related flow.
- Affected form/page/product/order/account/add-on: form ID/title, page URL, product context, feed/add-on/notification/confirmation if known.
- Evidence: concise confirmed evidence, redacted where needed.
- Recommended fix: what should change and why.
- Risk level: Blocker, High, Medium, Low, or Info.
- Required MCP capability: e.g. update form schema, update notification, update confirmation, update feed, update page embed, update personal data setting.
- Required add-ons/extensions: installed/active/licence evidence or missing dependency.
- Approval needed: yes/no plus reason.
- Suggested validation steps: post-change checks, approved test submission requirements, logs, page checks, notification checks, product/order context checks.
- Rollback consideration: what to revert or preserve if the change causes issues.
- Suggested prompt for `woocommerce-gravity-forms-configuration`: direct prompt with enough context and no hidden assumptions.

## Handoff quality bar

- Include only actionable WooCommerce Gravity Forms findings.
- Keep personal data, order data, account data, payment data, and secrets out of the handoff unless absolutely required and permitted.
- Mark missing evidence instead of inventing details.
- Separate official Gravity Forms/WooCommerce guidance from LightSpeed recommendations.
- Include acceptance/retest criteria so configuration work can close cleanly.

# WooCommerce Gravity Forms configuration handoff

## Handoff summary

- Handoff title:
- Source audit:
- Site/environment:
- WooCommerce context:
- Risk level:
- Approval required:

## Findings included

| Finding ID | Severity | Target | Evidence summary | Recommended change |
|---|---|---|---|---|

## Target objects

- Forms:
- Pages/embeds:
- Products/categories:
- Orders/accounts/customer context:
- Notifications:
- Confirmations:
- Feeds/add-ons/extensions:
- Global settings:

## Recommended configuration changes

- Change 1:
- Change 2:
- Change 3:

## Required MCP capabilities

- Read capability required for validation:
- Write capability required for configuration skill:
- Capability not available / manual fallback:

## Required add-ons, WooCommerce extensions, or services

- Add-on/extension/service:
- Current evidence:
- Licence/support caveat:

## Approval required

- Approval owner:
- Reason approval is needed:
- Production/staging note:

## Validation checklist

- Inspect post-change form .schemas/settings.
- Inspect notifications/confirmations/feeds.
- Inspect page embed and product/order/customer context.
- Run approved safe test submission only if permitted.
- Confirm notification/feed/log result.
- Confirm no sensitive data overexposure.

## Rollback notes

- Values/settings to preserve before change:
- How to revert manually if needed:
- Data/entry considerations:

## Suggested prompt for `woocommerce-gravity-forms-configuration`

```text
Use the woocommerce-gravity-forms-configuration skill. Apply only the approved WooCommerce Gravity Forms changes from this handoff. Confirm MCP capabilities first, show a change plan before any write, require approval for high-risk changes, validate after change, and report any missing evidence.

[Paste handoff summary and findings here]
```

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*

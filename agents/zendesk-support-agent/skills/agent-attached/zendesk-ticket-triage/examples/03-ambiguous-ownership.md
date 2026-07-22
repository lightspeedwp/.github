# Example 3: case with ambiguous ownership

## Input

Ticket subject: Product sync creates wrong categories

Customer says products imported from a third-party catalogue are landing in the wrong categories. They are not sure whether the catalogue data is wrong, the integration mapping is wrong, or the website category setup is wrong. They included one product URL but no import log or source record.

## Output

# Internal triage package

## Issue summary

Imported products are appearing in incorrect categories, but the current evidence does not show whether the source catalogue, integration mapping, or site taxonomy setup is responsible.

## Urgency

normal — The issue affects product data quality, but there is no confirmed checkout blocker, outage, or severe revenue impact.

## Severity

Medium — Product categorisation is wrong for at least one item; scale and commercial impact are unconfirmed.

## Recommended priority

Normal — Collect a complete affected example before assigning ownership or escalating.

## Issue type

data/content

## Likely owner

unknown — ownership is ambiguous until source data, mapping configuration, and site taxonomy evidence are compared.

## Duplicate or pattern risk

unknown — There is not enough evidence to determine whether this is isolated, related to prior sync issues, or a broader import pattern.

## Customer impact

Product categorisation is inaccurate for at least one product. Scale and commercial impact are unknown.

## Confirmed facts

- The customer reports imported products landing in the wrong categories.
- One product URL was provided.
- No import log, source catalogue record, or mapping configuration is included.

## Inferred risks or concerns

- The issue could sit with content/data, integrations, or site configuration.
- If widespread, it may affect navigation, merchandising, and SEO, but scale is not confirmed.

## Missing information

- Example source catalogue record for the affected product.
- Import/sync log for the affected run.
- Current mapping rules or category taxonomy configuration.
- Number of affected products.

## Escalation signals

none confirmed — Ambiguous ownership alone is not an escalation signal.

## Recommended next action

Collect one complete affected example across source record, sync log, mapping rule, and resulting website category before assigning ownership.

## Recommended downstream skill

none yet

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

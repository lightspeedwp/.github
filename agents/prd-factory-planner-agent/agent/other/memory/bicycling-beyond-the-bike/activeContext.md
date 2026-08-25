# Bicycling Beyond the Bike - Active Context

## Current Focus

Linear issue `LS-1187` covers launch fixes for the Bicycling Beyond the Bike sponsored category page for Old Mutual. The issue is marked High priority, In Progress, and currently estimated as `L` / value `5`.

## Confirmed Planning Position

- The work combines audit, capability confirmation, defect diagnosis, implementation, regression testing, and editor guidance.
- `tf-core` audit found relevant Buyers Guide and Campaigns addon behaviour, especially header/search filters, landing page query logic, featured slider exclusions, digitorial exclusions, REST load-more behaviour, and campaign fields for sponsored assets.
- The current `L` estimate is acceptable as the locked estimate if implementation remains in the Bicycling theme/CMS layer plus light verification against `tf-core` behaviour.
- Move to `XL` if the article-display defect requires changing `tf-core` Buyers Guide, Campaigns, slider, REST/load-more, or shared query behaviour.

## Active Risks

- Launch is expected next week from the Linear OpenSpec, so unknowns need to be resolved quickly.
- The issue may touch shared category, banner, ad-slot, and article-query behaviour, creating regression risk across other category landing pages.
- Exact desktop and mobile banner dimensions, mobile field behaviour, content removal rules, and approved ad/banner changes remain unconfirmed.
- Direct `git` access to GitHub was blocked during audit, so evidence was gathered through the connected GitHub app rather than a local checkout.

## Next Actions

- Lock `LS-1187` at `L` for now, with an explicit re-estimation trigger if the stale article issue is confirmed inside shared `tf-core` query/load-more/campaign behaviour.
- Run the next audit against the Bicycling theme repo or CMS/staging configuration, because the top banner, Garmin banner, category search removal, and right-column slot controls were not evidenced in `tf-core`.
- Confirm stakeholder approvals for top-banner linking, search removal, Garmin banner suppression, and right-column ad/image behaviour.
- Convert the PRD into a technical brief or implementation issue set once the code path and CMS control limits are confirmed.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

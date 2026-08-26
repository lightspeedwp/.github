---
file_type: documentation
version: 1.0.1
title: Bicycling Beyond the Bike - Assumptions and Risks
date: '2026-07-01'
timezone: Europe/Berlin
status: active
---
# Bicycling Beyond the Bike - Assumptions and Risks

## Assumptions

- The current `L` estimate maps to Linear estimate value `5`.
- The implementation surface is expected to be primarily `tf-rodale`, with `tf-core` reviewed only if shared category, banner, or article-query logic is involved.
- The PRD is based on Linear issue `LS-1187`, its OpenSpec comments, and a connected GitHub audit of `lightspeedwp/tf-core`.

## Risks

- Shared category template or plugin updates may affect unrelated category landing pages.
- Cache, taxonomy, or featured-content rules may make the article display defect more complex than a simple content-setting fix.
- Sponsor-specific banner and ad-slot controls may require reusable CMS controls if this pattern is expected for future sponsored launches.
- Launch timing leaves limited room for late design, stakeholder, or technical scope decisions.
- If the stale article issue touches `tf-core` Buyers Guide landing page query, REST load-more query, Campaigns digitorial exclusions, or slider taxonomy logic, the task should move from `L` to `XL`.
- If banner/search/Garmin/right-column controls are implemented only in the Bicycling theme or CMS, the task can remain `L`.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

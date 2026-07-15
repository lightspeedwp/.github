# Example Tour Operator Plugin Audit

## Audit Scope

Tour operator plugin layer review for a live brochure and enquiry site.

## Core Plugin Findings

- High: Core plugin is active but key entity settings are incomplete.
- Medium: Default labels do not align to the current tour structure.

## Extension Plugin Findings

- High: One extension duplicates enquiry behaviour already handled elsewhere.
- Medium: One extension is active but appears unused.

## Gravity Forms Findings

- Medium: Tour enquiry routing is incomplete.
- Low: Confirmation copy does not set response expectations.

## Yoast Findings

- Medium: Destination templates need stronger metadata defaults.
- Low: Breadcrumb settings need verification.

## General WordPress Findings

- Medium: Search visibility should be rechecked before launch.

## Blockers

- Confirm which extension plugin owns enquiry enrichment.

## Recommended Next Actions

1. Finalise core plugin settings.
2. Remove or justify duplicate extensions.
3. Complete Gravity Forms routing QA.
4. Review Yoast templates for tours and destinations.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION_GOVERNANCE.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

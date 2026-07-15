# Changelog

Track behaviourally meaningful changes to this shared-agent router package. Keep entries short, dated, and anonymised.

## 1.11.0 - 2026-06-25

- Removed misplaced package-specific capability/profile assets from the router package.
- Restored the router package to router-only references and companion-skill routing assets.
- Preserved router behaviour and the 12-skill companion manifest.

## 1.7.0 - 2026-06-25

- Refreshed the companion interoperability audit after companion skill cleanup.
- Marked previously flagged companion route-alias drift as cleaned up.
- Preserved the 12-skill companion manifest and router behaviour without changes.

## 1.6.0 - 2026-06-25

- Added companion interoperability audit guidance for shared-agent deployment and maintenance.
- Separated router behaviour tests from parent-agent direct skill-selection tests.
- Documented canonical `zendesk-` companion names and legacy route-alias cleanup needs.
- Expanded validation to require the companion interoperability audit reference.

## 1.5.0 - 2026-06-25

- Added explicit router invocation policy for shared support desk agents.
- Clarified that the router is the default intake gateway for unclear Zendesk-first requests, not a mandatory wrapper before clear downstream workflows.

## 1.4.0 - 2026-06-25

- Added companion-skill manifest and schema for shared-agent installation checks.
- Documented connector assumptions and fallback behaviour for each supported downstream `zendesk-` workflow skill.
- Expanded validation to check manifest coverage and shared-agent connector policy.

## 1.3.0 - 2026-06-25

- Added maintenance and release guidance for shared-agent package updates.
- Added this changelog to make future skill updates auditable.
- Expanded validation to check for maintenance and changelog references.

## 1.2.0 - 2026-06-25

- Hardened frontmatter trigger wording for shared-agent use.
- Added shared-agent deployment checklist.
- Expanded validation for permission-aware and unavailable-Zendesk-access guidance.

## 1.1.0 - 2026-06-25

- Added validation script and machine-readable router fixtures.
- Added checks for output contract, routing coverage, fixture shape, and shared-agent portability.
- Removed individual-user assumptions from shared-agent guidance.

## 1.0.0 - 2026-06-25

- Added shared-agent readiness reference.
- Added connector access fallback rules.
- Added routing matrix, output contract, and anonymised test cases.
- Added `agents/openai.yaml` metadata.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

# Router compatibility

## Canonical status

`zendesk-ticket-triage` is an optional internal triage-package helper. It is not the canonical LightSpeed Support Desk first-pass triage router.

Use `zendesk-triage-router` as the canonical workflow for:

- first-pass Zendesk ticket classification;
- severity assessment;
- priority recommendation;
- queue/status guidance;
- owner/team recommendation;
- duplicate-risk assessment;
- unclear Zendesk-first intake where the next support workflow is not yet obvious.

Use `zendesk-ticket-triage` only when the user explicitly needs the older compact internal triage package shape, or when maintaining legacy prompts that name this skill directly.

## Relationship with `zendesk-router-skill`

Do not add this skill as the primary triage route in the `zendesk-router-skill` companion manifest while `zendesk-triage-router` is present.

If the router needs to mention this skill, describe it as an optional package-format helper, not as the owner of first-pass triage.

Safe optional manifest wording:

```json
{
  "name": "zendesk-ticket-triage",
  "category": "legacy_triage_package",
  "install_recommendation": "optional_when_legacy_internal_triage_packages_are_needed",
  "zendesk_access": "optional_for_package_from_pasted_evidence_required_for_live_ticket_context",
  "primary_when": "an internal triage package in the legacy package format is explicitly requested",
  "supporting_when": "none",
  "fallback_when_unavailable": "use zendesk-triage-router for first-pass triage, or produce the package manually from confirmed facts if the user supplied the required evidence"
}
```

## Shared-agent conflict rule

When both `zendesk-triage-router` and `zendesk-ticket-triage` are installed:

- route classification/severity/priority requests to `zendesk-triage-router`;
- route explicit internal package requests to `zendesk-ticket-triage`;
- route ambiguous support workflow questions to `zendesk-router-skill`;
- never route to the deprecated non-prefixed `ticket-triage` workflow.

## Fallback behaviour

If the ideal downstream skill is unavailable, name the intended support action in plain language and request the smallest missing input. Do not invent unavailable skill names or assume personal connector access. Do not recommend `zendesk-triage-router` after successfully producing a package; use it only as a route-away target when the original request was first-pass triage rather than a package request.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

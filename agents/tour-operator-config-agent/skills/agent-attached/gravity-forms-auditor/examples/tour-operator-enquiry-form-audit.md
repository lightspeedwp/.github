# Example: tour operator enquiry form audit

## Scope

Tour enquiry form for safari/travel website; audit enquiry quality, consent, partial-entry risk, and routing.

## Evidence

- Multi-page form collects destination, travel dates, traveller count, budget, accommodation preference, special interests, and contact details.
- Consent field is present but copy is generic.
- Partial Entries add-on detected with active feed.
- No file upload or payment feed detected.

## Findings

| ID | Finding | Severity | Confidence | Recommended fix | Handoff item | Retest step |
|---|---|---|---|---|---|---|
| GF-AUD-001 | Partial Entries can retain personal travel enquiry data; retention stance not visible. | High | Medium | Confirm retention policy and personal data settings for partial/draft entries. | Yes | Reinspect personal data settings after approved configuration. |
| GF-AUD-002 | Consent copy does not explain follow-up or external itinerary/CRM sharing. | Medium | High | Update consent wording after client/privacy approval. | Yes | Confirm revised consent copy and entry evidence. |

## Handoff item

Route privacy/retention settings and consent wording to `gravity-forms-configuration` after approval. Do not collect passports or health data without separate secure handling.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

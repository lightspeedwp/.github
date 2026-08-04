# Example: GA4 lead tracking plan

## Purpose
Track successful Gravity Forms lead submissions as GA4 `generate_lead` events while avoiding duplicate scripts and invalid click-only conversions.

## Preferred path
1. Detect existing GA4/GTM implementation and consent platform.
2. If the Gravity Forms Google Analytics Add-On is installed and connected, review its form-specific feed and pagination settings.
3. If GTM owns analytics, produce a GTM handoff rather than adding duplicate scripts through Gravity Forms.
4. Use `generate_lead` for successful enquiry submissions.
5. Include non-personal parameters such as form ID, form name, form type, page path, and lead type.
6. Validate in GA4 Realtime/DebugView and GTM Preview where applicable.

## Guardrails
- Do not send name, email, phone, message content, address, uploaded-file links, or free text to GA4.
- Do not count button clicks as conversions unless separately labelled as attempted submissions.
- Do not use `purchase` unless payment completion is confirmed.
- Do not add Measurement Protocol secrets to documentation or chat output.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*

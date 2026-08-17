# Release checklist

- [ ] `SKILL.md` has clear trigger conditions and compact control-plane instructions.
- [ ] Source register reviewed and dated.
- [ ] Required references exist and are linked from `SKILL.md`.
- [ ] Required schemas exist, including `agent-profile.schema.json`.
- [ ] Required templates exist.
- [ ] Required examples and JSON configs exist.
- [ ] Agent profile exists for the Tour Operator agent, with WordPress fallback guidance retained where useful.
- [ ] Test prompts cover audit, planning, write-guard, troubleshooting, handoff, and refusal cases.
- [ ] Example JSON configs pass `scripts/validate_form_config.py`.
- [ ] Skill package validates with the skill packaging script.
- [ ] `skill.zip` is under 25 MB.
- [ ] Rollout owner has attached the skill to the three target agents.

## Next-batch release checks

- [ ] Run `python3 scripts/validate_form_config.py examples/templates`.
- [ ] Run `python3 scripts/validate_skill_pack.py .` from the skill root.
- [ ] Confirm `SKILL.md` still stays concise and routes detailed guidance into references.
- [ ] Confirm the latest `skill.zip` contains `intake/`, `fixtures/`, the new schemas, and the new templates.
- [ ] Run at least one prompt from the capability-map, manual-fallback, QA, and risk-review test groups.

## Compatibility and migration release checks

- [ ] Confirm `references/environment-and-compatibility.md` is referenced from `SKILL.md`.
- [ ] Confirm `references/import-export-and-migration.md` is referenced from `SKILL.md`.
- [ ] Run notification-audit and troubleshooting-runbook sample prompts.
- [ ] Validate the newsletter and file-upload config examples.
- [ ] Confirm no source-register entry implies a live-site capability without preflight.
- [ ] Confirm `skill.zip` remains below 25 MB.

## Feed and entry-lifecycle rollout checks

- Confirm MCP can read feeds before allowing any feed write operation.
- Confirm payment and User Registration feed changes always require explicit approval.
- Confirm marketing/CRM feeds require consent and destination ownership checks.
- Confirm retention changes require approval from the operational owner.
- Confirm entry deletion/trashing instructions include uploaded-file consequences.
- Run prompts 46-55 before attaching the updated skill to production-facing agents.

## Fifth improvement batch release checks

- [ ] Run embed validation on one existing shortcode-based form and one block-based form before attaching to production agents.
- [ ] Confirm duplicate same-form-on-page warnings appear in test prompt 57.
- [ ] Confirm consent-copy review does not approve legal/privacy wording as final.
- [ ] Confirm bilingual form output records language routing, consent translation approval, and per-language test cases.
- [ ] Confirm contest forms separate campaign terms consent from marketing opt-in.

## Seventh improvement batch release checks

- [ ] Run the monthly health-check prompt against a staging or non-sensitive production site in read-only mode.
- [ ] Confirm the agent does not delete, disable, archive, or unembed stale forms without explicit approval.
- [ ] Confirm permissions reviews do not expose unnecessary user personal data.
- [ ] Confirm User Registration feed access is treated as high/critical risk.
- [ ] Confirm cron/background-processing symptoms route to WordPress/server operations when MCP cannot safely inspect or fix them.
- [ ] Confirm licence/update checks never expose licence keys or credentials.

## Frontend layout and styling release additions

- [ ] Confirm `references/frontend-layout-and-theme-styling.md` is present and referenced from `SKILL.md`.
- [ ] Confirm frontend style and layout regression templates are present.
- [ ] Confirm schemas for frontend style audits and layout regression checks validate as JSON.
- [ ] Confirm test prompts 86-95 exist and cover global theme risk, Ready Class migration, legacy markup, CSS scope, and accessibility refusal.
- [ ] Run local package validation after adding styling/layout files.

## Post creation and UGC release additions

- [ ] Confirm `references/post-creation-and-ugc-workflows.md` is present and referenced from `SKILL.md`.
- [ ] Confirm post creation feed review and UGC moderation handoff templates are present.
- [ ] Confirm schemas for post creation feed reviews and UGC moderation handoffs validate as JSON.
- [ ] Confirm test prompts 96-105 exist and cover Post Fields, APC, missing CPTs, auto-publishing risk, media-library mapping, taxonomy creation, business listings, editor handoff, post editing, and ecommerce/platform route-away.
- [ ] Confirm Advanced Post Creation guidance does not imply it can create/register custom post types, custom fields, or taxonomies.
- [ ] Confirm UGC defaults use Draft or Pending Review unless a client-approved publishing workflow exists.
- [ ] Confirm local validators pass after adding post creation and UGC files.

## Analytics and attribution release additions

- [ ] Confirm `references/analytics-conversion-and-attribution.md` is present and referenced from `SKILL.md`.
- [ ] Confirm conversion tracking and tracking QA templates are present.
- [ ] Confirm schemas for conversion tracking plans and tracking QA reports validate as JSON.
- [ ] Confirm test prompts 106-115 exist and cover GA4/GTM, UTM, tracking mismatch, thank-you pages, consent-aware tracking, pagination events, and secret refusal.
- [ ] Confirm examples do not contain live measurement IDs, GTM container IDs, Measurement Protocol secrets, API keys, or personal data.
- [ ] Confirm the skill does not treat button-click tracking as proof of a valid Gravity Forms entry.
- [ ] Confirm analytics work routes away when it becomes whole-site GA4/GTM, Consent Mode, ad-platform conversion API, or dashboard architecture.
- [ ] Run local package validation after adding analytics and attribution files.

## Survey, poll, quiz, and assessment checks

- [ ] Smoke-test survey plan prompt with Survey Add-On unavailable.
- [ ] Smoke-test public poll result visibility and reset refusal.
- [ ] Smoke-test quiz scoring change approval path.
- [ ] Confirm package validator requires assessment and results-review assets.

## Payment batch release checks

- Payment/donation/event reference is present and linked from SKILL.md.
- Payment review and payment test templates are present.
- Payment schemas validate.
- Donation and paid event example configs pass local validation.
- Test prompts cover sandbox, receipts, refunds, recurring payments and multiple payment feeds.
- [x] Auditor handoff compatibility checked: canonical v0.2.1+ fields and legacy fields both validate; configuration still requires MCP verification and approval-first change planning.

---

*🤖 This agent is orchestrated with precision and care — carefully choreographed automation*

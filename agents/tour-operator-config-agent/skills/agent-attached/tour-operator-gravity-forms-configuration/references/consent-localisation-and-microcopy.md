# Consent, localisation, and form microcopy

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main Branch Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate PR Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges: Documentation Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges: Health Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

Use this reference when forms collect consent, use translated copy, serve multilingual audiences, include marketing opt-ins, or need customer-facing labels, descriptions, validation messages, confirmations, and notification wording.

## Operating stance

- Keep the skill focused on form microcopy and configuration, not full page copywriting or legal policy drafting.
- Treat consent text as a configuration and evidence issue, not decorative copy.
- For legal, compliance, or privacy-policy wording, draft operational notes only and route to legal/privacy review.
- For multilingual sites, require each language variant to be tested as its own user journey. Do not assume machine translation is approved or legally equivalent.

## Consent field behaviour

The Consent field provides a yes/no checkbox and records the consent status. When checked, Gravity Forms records the consent title and description that were presented at submission time. Changing consent text can require users to reconfirm consent because state validation checks hidden values tied to the consent content and form revision. Treat this as useful for audit history, but also as a reason to avoid casual consent-copy edits on live forms.

## Consent review checklist

Capture:

- Purpose of collection.
- Required or optional status.
- Exact checkbox label.
- Exact consent description.
- Linked privacy policy or terms page, if any.
- Whether consent is marketing, service/contact, UGC, membership, file upload, payment, or user registration related.
- Whether the wording is stable, approved, and translated.
- Whether the consent field is included in admin/user notifications.
- Whether consent state and text are retained in entries.
- Whether data retention and export/erase behaviour has been reviewed.

## Safe microcopy defaults

- Use visible labels, not placeholder-only instructions.
- Keep field descriptions short and action-oriented.
- Use plain language for required fields and errors.
- Avoid promising response times, pricing, availability, legal outcomes, or eligibility unless confirmed.
- Avoid echoing sensitive submitted data in confirmations or URLs.
- Use confirmation messages that explain what happens next without exposing private details.
- Keep autoresponder wording factual: acknowledge receipt, state next steps, avoid commitments not supported by operations.

## Multilingual and localisation guidance

For multilingual forms:

1. Identify the site language(s), form language(s), and target page language.
2. Confirm whether the site uses separate forms per language, translated labels in one form, or a translation plugin workflow.
3. Prefer separate form configs per language when consent text, routing, notifications, CRM lists, or regional privacy expectations differ.
4. Keep field IDs and notification logic documented across language variants for maintainability.
5. Test each language variant end to end: validation messages, confirmations, notifications, feeds, consent records, and admin routing.
6. Ensure admin notifications identify the submitted language and source page.
7. For bilingual or multilingual publications, avoid mixing user-facing languages in one field label unless intentionally bilingual.

## Translation risk rules

- Do not translate legal/consent text as final without approval.
- Do not assume translated forms share the same Mailchimp/CRM audience or sales owner.
- Do not use language-specific conditional logic unless it is tested with real submitted values.
- Do not overwrite an existing form’s labels for a new language if the form is already embedded on a live page; duplicate or draft a variant first.
- Record language ownership in handoff notes.

## Confirmation and notification localisation

Confirmations:

- Match the page/form language.
- Avoid English-only “thank you” text on non-English pages.
- Keep next-step wording realistic and client-approved.

Notifications:

- Include the submitted language or source page for routing.
- Use domain-aligned From addresses.
- Use Reply-To for submitter email where appropriate.
- Avoid attaching uploaded files unless specifically approved.
- Avoid sending consent/legal text back to users unless needed.

## Route-away triggers

Route away when the primary task is a full privacy policy, terms page, legal review, broad website copywriting, translation strategy, or brand voice system. Keep a Gravity Forms handoff if form-level configuration is still relevant.

---

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*
[Contact](https://lightspeedwp.agency/contact)

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

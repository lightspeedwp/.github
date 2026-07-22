# Package onboarding wizard script

<!-- BADGES-START -->
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![changelog-auto-update](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-auto-update.yml)
[![changelog-validate](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validate.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![dependabot-security-label](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/dependabot-security-label.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![issue-close-label-hygiene](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-close-label-hygiene.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![linting](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/linting.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-summary](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-summary.yml)
[![metrics](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![readme-audit](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-audit.yml)
[![readme-regen](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-regen.yml)
[![readme-update](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/readme-update.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![testing](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/testing.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
<!-- BADGES-END -->

## Purpose

Use this script when the user wants package scoping, package comparison, internal package sheets, proposal package framing, or another package-backed output that benefits from confirmation-first onboarding.

This script turns the package template framework into an interactive flow.

## Core operating rules

- Audit first before locking package direction.
- Gather inputs in batches rather than as a long intake form.
- Confirm discovered values before treating them as settled.
- Ask only for missing or materially uncertain values.
- Keep client-facing facts separate from internal scoping notes.
- Reuse saved package defaults from Memory when they have already been confirmed for the same project.

## Trusted source order

Use sources in this order when pre-filling values:

1. live website
2. client-provided references in the current run
3. Google Docs and Google Drive material
4. GitHub repository or codebase
5. Figma files and design-system references
6. email history or prior communications only when a working connector is actually available
7. direct user confirmation
8. previously confirmed project defaults from Memory when they still fit the current project

## Connector guardrail

Never imply that Gmail, GitHub, Figma, CRM, or other systems were reviewed unless those connectors are actually available in the current run and were genuinely used.

If a connector is not available, say that clearly and ask for a link, export, or manual confirmation instead.

## When to use this wizard

Use this wizard when:

- the user asks for package scoping or package recommendations
- the user wants a templated package output
- the user wants the agent to pre-fill package fields from references before asking follow-ups
- the package choice, scope, or quote guidance depends on website findings and reference materials

Do not use this wizard for a simple one-off answer that can be completed without package onboarding.

## Reusable package defaults

When already confirmed for the same project, reuse these values before asking again:

- `project_delivery_type`
- `project_requested_packages`
- `is_fixed_fee_eligible`
- `recommended_add_ons`
- `possible_custom_scope_triggers`

If the current request suggests those values have changed, treat the current request as the new source of truth and update the saved defaults.

## Wizard structure

Run the wizard in four steps.

### Step 1: Reference sources

#### Goal

Collect all high-value references before detailed questioning.

#### Try to gather

- primary website URL
- staging URL
- GitHub repo
- Google Docs or Drive links
- Figma links
- existing audits
- analytics or Search Console references
- prior proposal or SOW files
- brand guide, content guide, or design-system references
- CRM, booking, ecommerce, or helpdesk references if relevant
- email address or communication archive only if a working connector exists

#### Step 1 prompt

```md
## Step 1: Reference Sources

Please share all available references so I can pre-fill as much of the package scope as possible.

- Website URL
- Staging URL
- GitHub repo
- Google Docs / Drive links
- Figma links
- Existing audits
- Analytics / Search Console references
- Prior proposal or SOW files
- Brand guide / content guide / design system
- Any other useful reference

If email history should be reviewed, confirm the relevant connector is available or provide the relevant exported material.
```

#### Step 1 review prompt

After checking what is actually available, show a review block like this:

```md
## Step 1 Review: What I Found

Here is what I found from the references provided:

- Website: {{client_website_url}}
- CMS/platform: {{client_platform}}
- Ecommerce detected: {{client_has_woocommerce}}
- Analytics detected: {{client_has_ga4}}
- Search Console reference found: {{client_has_search_console}}
- Design system reference found: {{client_has_design_system_reference}}
- GitHub reference found: {{client_has_github_reference}}
- Figma reference found: {{client_has_figma_reference}}

Please:
1. Confirm the values above
2. Correct anything inaccurate
3. Provide any missing references
```

### Step 2: Website and platform discovery

#### Goal

Extract as much as possible from the live site before asking for manual input.

#### Try to detect

- site title
- brand or company name
- primary CTA
- CMS platform
- WooCommerce presence
- blog or resources section
- contact details
- forms present
- search present
- FAQ content present
- sitemap presence
- robots.txt presence
- cookie or privacy pages
- booking or account flows
- multilingual indicators

#### Step 2 review prompt

```md
## Step 2: Website Discovery Review

I reviewed the live site and found the following:

- Brand name: {{client_brand_name}}
- Website type: {{client_website_type}}
- Primary platform: {{client_platform}}
- WooCommerce detected: {{client_has_woocommerce}}
- Approximate product count: {{client_product_count_estimate}}
- Approximate category count: {{client_category_count_estimate}}
- Blog / knowledge content present: {{client_has_blog}}
- FAQ content present: {{client_has_faq_content}}
- Search function present: {{client_has_site_search}}
- Privacy / policy pages present: {{client_has_policy_pages}}
- Sitemap found: {{client_has_sitemap}}
- robots.txt found: {{client_has_robots_txt}}

Please confirm these values or provide corrections where needed.
```

#### Step 2 missing-values prompt

Ask only for critical unknowns:

```md
## Step 2 Missing Values

To continue, please provide or confirm the following:

- {{missing_client_product_count}}
- {{missing_client_category_count}}
- {{missing_client_has_staging_site}}
- {{missing_client_critical_checkout_plugins}}
- {{missing_client_has_gtm}}
```

### Step 3: Business intent and package routing

#### Goal

Identify the right package path and whether the user wants audit only, implementation, training, chatbot work, or retainer support.

#### Step 3 prompt

```md
## Step 3: Goals and Package Direction

Please confirm what you want this project to achieve.

- Main goal: {{project_primary_goal}}
- Interested in: {{project_requested_packages}}
- Engagement type: {{project_delivery_type}}
- Target launch timing: {{project_target_timeline}}
- Internal owner: {{project_internal_owner}}
- Any compliance or governance sensitivity: {{project_risk_notes}}

If anything above is missing or incorrect, please update it now.
```

#### Delivery type options

- Audit only
- Audit + implementation
- Audit + implementation + chatbot phase
- Audit + roadmap only

### Step 4: Commercial confirmation

#### Goal

Confirm only the values needed to lock package type, fixed-fee eligibility, add-ons, or custom-scope routing.

#### Step 4 prompt

```md
## Step 4: Scope Confirmation

I have mapped this project to the following package path:

- Recommended package(s): {{recommended_package_list}}
- Fixed-fee eligible: {{is_fixed_fee_eligible}}
- Likely add-ons: {{recommended_add_ons}}
- Possible custom-scope triggers: {{possible_custom_scope_triggers}}

Please confirm:

- Staging site available: {{client_has_staging_site}}
- Critical integrations: {{client_integrations_summary}}
- Critical plugins: {{client_critical_plugin_summary}}
- Multilingual or multi-brand requirements: {{client_multilingual_or_multibrand}}
- Sensitive or regulated flows: {{client_sensitive_use_cases}}

If any of these are incorrect, update them before pricing or proposal drafting continues.
```

## Missing-value behaviour

At each step:

- show what was found
- show what is still missing
- ask the user to confirm found values and provide only the missing ones
- do not re-ask already confirmed values unless a conflict appears
- reuse already confirmed package defaults when they still fit the same project and current scope

## Routing after the wizard

After Step 4:

- route into the relevant package template
- use the package template registry and placeholder rules
- treat confirmed values as the current defaults for that package output
- save confirmed package-routing values for future runs on the same project
- keep unconfirmed optional values as clear markers rather than inventing them

## Output behaviour

Keep each wizard step compact and interactive.

Do not dump the full questionnaire at once.

Prefer one batch at a time, then wait for the user's confirmation or corrections before moving to the next batch.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

# AI Service Package Template System

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
[![actions-minute-savings-watch](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/actions-minute-savings-watch.yml)
[![allocate-pr-issue-to-milestone](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/allocate-pr-issue-to-milestone.yml)
[![awesome-github-site](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/awesome-github-site.yml)
[![badges-documentation-update](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-documentation-update.yml)
[![badges-health-check](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-health-check.yml)
[![badges-readme-status](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-readme-status.yml)
[![badges-workflow-audit](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/badges-workflow-audit.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![checklist-finalisation](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checklist-finalisation.yml)
[![checks](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/checks.yml)
[![cleanup-branches](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/cleanup-branches.yml)
[![docs-maintenance](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-maintenance.yml)
[![docs-validation](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/docs-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![flaky-test-detection](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/flaky-test-detection.yml)
[![gitleaks-reusable](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-reusable.yml)
[![gitleaks-update](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks-update.yml)
[![gitleaks](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/gitleaks.yml)
[![issue-create-enhanced](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml)
[![issue-create-from-template](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-from-template.yml)
[![issue-fields-backfill](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-fields-backfill.yml)
[![issue-health-audit](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-health-audit.yml)
[![issue-labeling-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-labeling-automation.yml)
[![issue-project-field-sync](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-project-field-sync.yml)
[![issue-remediation-automation](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-automation.yml)
[![issue-remediation-bulk](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-remediation-bulk.yml)
[![issues](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issues.yml)
[![label-audit-report](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/label-audit-report.yml)
[![labeling-governance](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-governance.yml)
[![labeling](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling.yml)
[![main-branch-guard](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/main-branch-guard.yml)
[![manage-blocking-status-labels](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/manage-blocking-status-labels.yml)
[![meta-labels-sync](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-pipeline](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml)
[![metrics-reporting](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![project-archival](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-archival.yml)
[![project-maintenance-nightly](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-nightly.yml)
[![project-maintenance-on-demand](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-maintenance-on-demand.yml)
[![project-meta-sync](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-meta-sync.yml)
[![release](https://github.com/lightspeedwp/.github/actions/workflows/release.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release.yml)
[![reporting](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting.yml)
[![reviewer](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reviewer.yml)
[![template-enforcement](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/template-enforcement.yml)
[![validate-blocking-issue-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-issue-before-close.yml)
[![validate-blocking-status-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-blocking-status-before-close.yml)
[![validate-dor-dod-sections](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-dor-dod-sections.yml)
[![validate-issue-dod-before-close](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-issue-dod-before-close.yml)
[![validate-mermaid-pr](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-mermaid-pr.yml)
[![validate-pr-template](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-pr-template.yml)
[![validate-project-linking](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-project-linking.yml)
<!-- BADGES-END -->

## Purpose

This framework defines:

1. A **batched intake flow** for gathering client references and confirming discovered data
2. A **shared mustache field model** for AI package proposals
3. **Templated outputs per package** with instructions for how each field should be sourced
4. A **confirmation-first workflow** so the AI either fills values from trusted sources or asks the client to confirm or complete missing information

This is designed for internal use when scoping and drafting:

- AI Readiness Foundation
- AI Search and Structured Data
- AI Chatbot Planning Workshop
- AI Chatbot with AI Engine — Starter
- AI Chatbot with AI Engine — Tailored
- Yoast AI Content Training
- Ongoing AI Governance and Optimisation Retainer
- WooCommerce AI Readiness / SEO Scope Add-on
- Tour Operator JSON-LD Audit Add-on

---

## Core Rules

### Rule 1: Audit first

Every package starts with a website audit. The package itself may be fixed fee, but the AI must first inspect the state of the client site to identify irregularities, technical debt, missing content, and disqualifiers.

### Rule 2: Gather in batches

Do not ask the client for every input up front. Ask in batches:

1. Reference sources
2. Website and platform basics
3. Business and package intent
4. Technical and commercial confirmation

### Rule 3: Confirm before assuming

For every mustache field:

- first try to fill it from a trusted source
- then show the found value to the client
- then ask the client to confirm or correct it

### Rule 4: Ask only for missing fields

After each intake batch, the next intake step should:

- show what the AI found
- show what is still missing
- ask the client either to confirm the found values or provide the missing ones

### Rule 5: Separate facts from internal notes

Mustache values should be grouped by:

- **Client-facing facts**
- **Internal scoping values**
- **Package decision values**

---

## Trusted Source Order

When filling mustache values, the AI should use sources in this order:

1. Live website
2. Client-provided references
3. Google Docs and Drive material
4. GitHub repository or codebase
5. Figma files and design-system references
6. Email history or prior communications if available through a connector
7. Direct client confirmation

### Note on connector availability

If Gmail, Figma, GitHub, CRM, or other sources are not connected in the working environment, the AI should not imply that it has scanned them. It should instead ask the client to provide links, exports, or access details.

---

## Intake Flow

## Step 1: Collect All Available References

### Goal

Gather every high-value source before asking detailed questions.

### Ask for

- Primary website URL
- Staging site URL if available
- GitHub repository URL or code access
- Google Drive folder or Google Doc links
- Figma file links
- Existing SEO audit or technical audit documents
- Analytics or Search Console references
- Email address or communication archive to review prior discussions if available via connected tools
- Existing proposal, SOW, or quote documents
- Brand guide, content guide, or design system references
- CRM, booking, ecommerce, or helpdesk system references if relevant

### Intake copy

```md
## Step 1: Reference Sources

Please share all available references so the AI can pre-fill as much of the package scope as possible.

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

If email history should be reviewed, provide the email address or confirm the relevant connector is available.
```

### Next action

The AI should scan what it can, then move to a confirmation step:

```md
## Step 1 Review: What the AI Found

Here is what was found from the references provided:

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

---

## Step 2: Website and Platform Discovery

### Goal

Extract as much as possible from the live site before asking the client for manual input.

### The AI should attempt to detect

- Site title
- Brand / company name
- Primary CTA
- CMS platform
- WordPress version clues if detectable
- WooCommerce presence
- Product and category counts where publicly visible
- Blog / resources section
- Contact details
- Forms present
- Search present
- FAQ content present
- Schema present or absent at a high level
- robots.txt presence
- sitemap presence
- cookie / privacy pages
- booking or account flows
- multilingual indicators

### Intake copy

```md
## Step 2: Website Discovery Review

The AI has reviewed the live site and found the following:

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

### Next action

If any critical scoping fields remain unknown, the AI should ask for only those:

```md
## Step 2 Missing Values

To continue, please provide or confirm the following:

- {{missing_client_product_count}}
- {{missing_client_category_count}}
- {{missing_client_has_staging_site}}
- {{missing_client_critical_checkout_plugins}}
- {{missing_client_has_gtm}}
```

---

## Step 3: Business Intent and Package Routing

### Goal

Determine which package(s) apply and whether the client wants audit only, implementation, training, chatbot, or retainer support.

### Ask for

- Main business goal
- Priority package or service interest
- Whether scope is audit only, implementation, or implementation plus chatbot
- Desired outcomes
- Any launch deadline
- Internal owner
- Risk sensitivity or compliance concerns

### Intake copy

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

### Delivery type options

- Audit only
- Audit + implementation
- Audit + implementation + chatbot phase
- Audit + roadmap only

---

## Step 4: Commercial Confirmation

### Goal

Confirm only the values needed to lock package type, fixed fee eligibility, add-ons, or custom-scope routing.

### Ask for

- Staging site available or not
- Critical plugins that affect scope
- Integration requirements
- Multiple brands or languages
- Regulated or sensitive use cases
- Whether package assumptions are acceptable

### Intake copy

```md
## Step 4: Scope Confirmation

The AI has mapped this project to the following package path:

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

---

## Shared Mustache Field Dictionary

Use these shared fields across packages wherever possible.

| Mustache field | Meaning | Preferred source | If missing, ask for |
|---|---|---|---|
| `{{client_brand_name}}` | Client or brand name | Live website header, About page, docs | Confirm legal or trading name |
| `{{client_website_url}}` | Primary live site | Client input | Website URL |
| `{{client_staging_url}}` | Staging site URL | Client input | Staging URL |
| `{{client_platform}}` | CMS / stack | Live site / GitHub | Confirm platform |
| `{{client_has_woocommerce}}` | WooCommerce present or not | Live site / codebase | Confirm ecommerce status |
| `{{client_product_count_estimate}}` | Rough product volume | Live site crawl / sitemap | Approximate product count |
| `{{client_category_count_estimate}}` | Rough category volume | Live site crawl / menus | Approximate category count |
| `{{client_has_blog}}` | Blog / resource content exists | Live website | Confirm if hidden/private |
| `{{client_has_faq_content}}` | FAQ content exists | Live website | Confirm source pages |
| `{{client_has_site_search}}` | Search present | Live website | Confirm internal search use |
| `{{client_has_policy_pages}}` | Privacy / terms / returns pages exist | Live website | Provide missing policy status |
| `{{client_has_sitemap}}` | XML sitemap exists | Live website | Confirm if private / non-standard |
| `{{client_has_robots_txt}}` | robots.txt exists | Live website | Confirm crawler policy status |
| `{{client_has_ga4}}` | GA4 present | Site tags / client docs | Confirm analytics status |
| `{{client_has_gtm}}` | GTM present | Site tags / client docs | Confirm tag manager status |
| `{{client_has_search_console}}` | Search Console access exists | Client docs / Site Kit hints | Confirm access |
| `{{client_has_site_kit}}` | Site Kit present | WP admin if accessible / client docs | Confirm plugin status |
| `{{client_critical_plugin_summary}}` | Plugins affecting scope | GitHub / plugin list / client input | List critical plugins |
| `{{client_integrations_summary}}` | CRM, booking, ERP, helpdesk, API dependencies | Website / docs / client input | List integrations |
| `{{client_multilingual_or_multibrand}}` | Multi-language or multi-brand status | Live website / docs | Confirm languages / brands |
| `{{client_sensitive_use_cases}}` | Privacy / regulated / sensitive flows | Client docs / governance docs | Describe sensitive areas |
| `{{project_primary_goal}}` | Main business goal | Proposal brief / client input | Goal statement |
| `{{project_requested_packages}}` | Package interest list | Client input | Desired services |
| `{{project_delivery_type}}` | Audit only vs implementation | Client input | Delivery type |
| `{{project_target_timeline}}` | Timing | Client input / prior emails | Deadline or target month |
| `{{project_internal_owner}}` | Client owner | Email / client input | Name and role |
| `{{recommended_package_list}}` | AI-selected package path | Internal routing logic | Confirm package choice |
| `{{is_fixed_fee_eligible}}` | Fixed fee yes/no | Internal rules after audit | Confirm if client accepts assumptions |
| `{{recommended_add_ons}}` | Relevant add-ons | Internal routing logic | Confirm interest |
| `{{possible_custom_scope_triggers}}` | Risks that may push to custom scope | Audit findings | Confirm whether they apply |

---

## Package Template Format

Each package template should contain:

1. Package summary
2. Why it fits
3. Audit findings basis
4. Included scope
5. Excluded scope
6. Required client inputs
7. Assumptions
8. Fixed fee status
9. Add-ons or upgrade path
10. Next step

---

## Template: AI Readiness Foundation

```md
## AI Readiness Foundation

**Client:** {{client_brand_name}}  
**Website:** {{client_website_url}}  
**Platform:** {{client_platform}}  
**Engagement type:** {{project_delivery_type}}  
**Fixed-fee eligible:** {{is_fixed_fee_eligible}}

### Why this package fits

This package is recommended because the current site shows the need for baseline AI-readiness, SEO foundation, measurement clarity, and content-structure improvements before more advanced AI implementation.

### What the AI found

- WooCommerce detected: {{client_has_woocommerce}}
- Sitemap present: {{client_has_sitemap}}
- robots.txt present: {{client_has_robots_txt}}
- GA4 present: {{client_has_ga4}}
- GTM present: {{client_has_gtm}}
- Search Console reference: {{client_has_search_console}}
- FAQ content present: {{client_has_faq_content}}
- Policy pages present: {{client_has_policy_pages}}

### Included scope

- Initial site audit
- Yoast configuration review
- Site Kit / GA4 / Search Console baseline review
- Sitemap, indexing, canonical, and redirect review
- Priority metadata and heading review
- Internal linking quick wins
- Basic content-hygiene findings
- AI-readiness findings summary
- Prioritised action roadmap

### Excluded scope

- Full sitewide copy rewrite
- Full performance engineering
- Chatbot implementation
- Large-scale custom integration work

### Required client confirmations

- Staging site available: {{client_has_staging_site}}
- Critical plugins: {{client_critical_plugin_summary}}
- Integrations: {{client_integrations_summary}}
- Project owner: {{project_internal_owner}}

### Assumptions

- The package remains fixed fee only if no major irregularities are found in audit
- The implementation remains within standard agreed templates and priority pages

### Add-ons to consider

- {{recommended_add_ons}}

### Next step

Please confirm the audit findings and missing values before final package recommendation or pricing is issued.
```

### Field collection notes

| Field | Try to source from | If not found, ask |
|---|---|---|
| `{{client_has_staging_site}}` | Client intake references | “Do you have a staging site available?” |
| `{{client_critical_plugin_summary}}` | GitHub, plugin list, docs | “Which plugins are critical to site operations or checkout?” |
| `{{client_integrations_summary}}` | Website, docs, previous proposal | “Which integrations matter for this scope?” |

---

## Template: AI Search and Structured Data

```md
## AI Search and Structured Data

**Client:** {{client_brand_name}}  
**Website:** {{client_website_url}}  
**Platform:** {{client_platform}}  
**Fixed-fee eligible:** {{is_fixed_fee_eligible}}

### Why this package fits

This package is recommended because the site appears ready for deeper structured-data, crawl-policy, and machine-readability work beyond baseline readiness.

### What the AI found

- Sitemap present: {{client_has_sitemap}}
- robots.txt present: {{client_has_robots_txt}}
- FAQ content present: {{client_has_faq_content}}
- Blog / knowledge content present: {{client_has_blog}}
- WooCommerce present: {{client_has_woocommerce}}
- Multilingual or multi-brand: {{client_multilingual_or_multibrand}}

### Included scope

- Technical audit
- Schema audit across priority templates
- Yoast schema review
- Priority schema implementation plan
- robots.txt and crawl-policy review
- llms.txt recommendation
- Canonical and archive review
- Validation and QA summary

### Excluded scope

- Full theme rebuild
- Full content rewrite
- Deep specialist schema outside standard scope
- Ongoing monitoring after handoff

### Required client confirmations

- Priority content types: {{client_priority_content_types}}
- Sensitive use cases: {{client_sensitive_use_cases}}
- Any required industry-specific schema: {{client_industry_schema_requirements}}

### Assumptions

- Standard template structure
- No major technical irregularities that block structured-data implementation

### Add-ons to consider

- {{recommended_add_ons}}

### Next step

Confirm the priority content types and any specialist schema needs before drafting the final implementation scope.
```

### Additional field notes

| Field | Try to source from | If not found, ask |
|---|---|---|
| `{{client_priority_content_types}}` | Sitemap, nav, blog/archive structure | “Which page or content types matter most?” |
| `{{client_industry_schema_requirements}}` | Site niche / docs / proposal brief | “Are there any specific schema requirements for your sector?” |

---

## Template: AI Chatbot Planning Workshop

```md
## AI Chatbot Planning Workshop

**Client:** {{client_brand_name}}  
**Website:** {{client_website_url}}  
**Primary goal:** {{project_primary_goal}}

### Why this package fits

This package is recommended because a chatbot should not be configured until its purpose, source content, boundaries, escalation rules, and success measures are defined.

### What the AI found

- FAQ content present: {{client_has_faq_content}}
- Search function present: {{client_has_site_search}}
- Policy pages present: {{client_has_policy_pages}}
- Ecommerce present: {{client_has_woocommerce}}
- Sensitive use cases noted: {{client_sensitive_use_cases}}

### Included scope

- Review of chatbot questionnaire
- Use-case and audience definition
- Source-content and exclusions review
- Escalation and fallback planning
- Lead-capture planning
- Launch gate definition
- Success metrics definition
- Recommendation of implementation tier

### Excluded scope

- Chatbot build
- CRM or API integration
- Live prompt tuning
- Ongoing optimisation

### Required client confirmations

- Main chatbot goal: {{chatbot_primary_use_case}}
- Who the bot serves: {{chatbot_audience_summary}}
- Approved source content owner: {{chatbot_content_owner}}
- Human escalation route: {{chatbot_escalation_route}}
- Data capture rules: {{chatbot_data_capture_rules}}

### Assumptions

- The chatbot will only use approved, current source material
- Any regulated or sensitive topics must be escalated or excluded

### Next step

Please confirm the chatbot use case, audience, source-content owner, and escalation route before build-tier recommendation is finalised.
```

---

## Template: AI Chatbot with AI Engine — Starter

```md
## AI Chatbot with AI Engine — Starter

**Client:** {{client_brand_name}}  
**Website:** {{client_website_url}}  
**Fixed-fee eligible:** {{is_fixed_fee_eligible}}

### Why this package fits

This package is recommended for a simple FAQ, service-information, and enquiry-routing chatbot with a clearly defined scope and no advanced workflow complexity.

### What the AI found

- FAQ content present: {{client_has_faq_content}}
- Site search present: {{client_has_site_search}}
- Contact or enquiry flow present: {{client_has_contact_flow}}
- Sensitive use cases: {{client_sensitive_use_cases}}

### Included scope

- Site audit and readiness review
- AI Engine setup for agreed use case
- Greeting, naming, labels, and disclosure text
- Approved source-content setup
- FAQ and service-answer behaviour
- Contact or enquiry routing
- Fallback wording
- Basic QA
- One revision round

### Excluded scope

- CRM integration
- Complex qualification flows
- Product-aware conversation paths
- Booking or workflow integrations
- Ongoing optimisation

### Required client confirmations

- Approved source pages: {{chatbot_source_pages}}
- Contact route: {{chatbot_contact_route}}
- Disclosure wording preference: {{chatbot_disclosure_preference}}
- Escalation route: {{chatbot_escalation_route}}

### Assumptions

- Source content is already mature enough for launch
- The chatbot is limited to standard informational and routing behaviour

### Next step

Please confirm the approved source pages, contact route, and escalation route so the final implementation template can be completed.
```

---

## Template: AI Chatbot with AI Engine — Tailored

```md
## AI Chatbot with AI Engine — Tailored

**Client:** {{client_brand_name}}  
**Website:** {{client_website_url}}  
**Fixed-fee eligible:** {{is_fixed_fee_eligible}}

### Why this package fits

This package is recommended because the chatbot needs more guided flows, business-specific logic, or richer lead capture than a standard informational assistant.

### What the AI found

- WooCommerce present: {{client_has_woocommerce}}
- Product count estimate: {{client_product_count_estimate}}
- Category count estimate: {{client_category_count_estimate}}
- Integrations summary: {{client_integrations_summary}}
- Sensitive use cases: {{client_sensitive_use_cases}}

### Included scope

- Audit and readiness review
- Tailored conversation structure
- Guided qualification flow
- Structured lead-capture setup
- Brand-specific chatbot instructions
- Edge-case and escalation behaviour
- QA and testing
- Two revision rounds

### Excluded scope

- Deep bespoke application development
- Major CRM / ERP / booking integrations unless separately scoped
- Regulated advice workflows
- Ongoing retainer support

### Required client confirmations

- Qualification flow goal: {{chatbot_qualification_goal}}
- Required fields to capture: {{chatbot_required_capture_fields}}
- Final lead destination: {{chatbot_lead_destination}}
- Product or service journey summary: {{chatbot_journey_summary}}

### Assumptions

- The tailored flow remains within fixed-fee implementation rules
- Any advanced integrations or sensitive workflows may push scope further

### Next step

Confirm the qualification goal, required capture fields, and lead destination before final scope is locked.
```

---

## Template: Yoast AI Content Training

```md
## Yoast AI Content Training

**Client:** {{client_brand_name}}  
**Website:** {{client_website_url}}

### Why this package fits

This package is recommended where the client team manages content internally and needs practical training in Yoast workflows, content clarity, and AI-aware publishing habits.

### What the AI found

- Blog / resource content present: {{client_has_blog}}
- FAQ content present: {{client_has_faq_content}}
- Yoast likely present: {{client_has_yoast}}
- Design system reference available: {{client_has_design_system_reference}}

### Included scope

- Training preparation
- Yoast feature walkthrough
- Metadata and content clarity guidance
- Internal-linking habits
- AI-readiness editorial practices
- Q&A session
- Editorial checklist

### Excluded scope

- Full content strategy
- Copywriting execution
- Full implementation work during the training session

### Required client confirmations

- Team attendees: {{training_attendee_roles}}
- Main content workflow pain points: {{training_content_pain_points}}
- Current Yoast usage level: {{training_current_yoast_maturity}}

### Next step

Confirm attendees, workflow pain points, and current Yoast maturity so the training plan can be tailored.
```

---

## Template: Ongoing AI Governance and Optimisation Retainer

```md
## Ongoing AI Governance and Optimisation Retainer

**Client:** {{client_brand_name}}  
**Website:** {{client_website_url}}

### Why this package fits

This package is recommended where AI readiness or chatbot work has already been launched and the client needs ongoing review, tuning, and governance support.

### What the AI found

- Existing chatbot present: {{client_has_existing_chatbot}}
- Governance artefacts present: {{client_has_governance_docs}}
- FAQ content present: {{client_has_faq_content}}
- Analytics present: {{client_has_ga4}}

### Included scope

- Monthly or quarterly review cycle
- Website health and AI visibility review
- Chatbot transcript or behaviour review where relevant
- Governance and source-content review
- Prompt and behaviour tuning within agreed limits
- Action summary and recommendations

### Excluded scope

- Large rebuilds
- New major features
- New integrations
- Full content-production retainer

### Required client confirmations

- Review cadence: {{retainer_review_cadence}}
- Main optimisation priorities: {{retainer_priority_areas}}
- Internal owner: {{project_internal_owner}}

### Next step

Confirm the review cadence, main optimisation priorities, and owner before retainer packaging is finalised.
```

---

## Template: WooCommerce AI Readiness / SEO Scope Add-on

```md
## WooCommerce AI Readiness / SEO Scope Add-on

**Client:** {{client_brand_name}}  
**Website:** {{client_website_url}}  
**Fixed-fee eligible:** {{is_fixed_fee_eligible}}

### Why this add-on fits

This add-on is recommended because WooCommerce product structure, category logic, and commerce-specific content quality materially affect AI readiness and discoverability.

### What the AI found

- WooCommerce present: {{client_has_woocommerce}}
- Product count estimate: {{client_product_count_estimate}}
- Category count estimate: {{client_category_count_estimate}}
- Critical plugins summary: {{client_critical_plugin_summary}}
- Integrations summary: {{client_integrations_summary}}

### Included scope

- WooCommerce-specific audit
- Product and category structure review
- Product-content readiness review
- Core WooCommerce SEO / discoverability findings
- Taxonomy and content-model recommendations
- Agreed fixed-scope implementation notes or recommendations

### Excluded scope

- Full catalogue rewrite
- Checkout redevelopment
- Deep merchandising strategy
- ERP or marketplace integration projects

### Required client confirmations

- Approximate product count: {{client_product_count_estimate}}
- Approximate category count: {{client_category_count_estimate}}
- Variable product complexity: {{woocommerce_variable_product_complexity}}
- Critical checkout plugins: {{client_critical_plugin_summary}}

### Assumptions

- Fixed scope applies only where the WooCommerce setup remains within agreed complexity limits

### Next step

Please confirm product volume, category volume, variable-product complexity, and critical checkout plugins.
```

---

## Template: Tour Operator JSON-LD Audit Add-on

```md
## Tour Operator JSON-LD Audit Add-on

**Client:** {{client_brand_name}}  
**Website:** {{client_website_url}}  
**Commercial model:** Audit required before quote

### Why this add-on fits

This add-on is recommended because tour operator schema often requires specialist review of itineraries, destinations, accommodation, activities, packages, and booking relationships before implementation can be responsibly scoped.

### What the AI found

- Tour / package content present: {{tour_operator_package_content_present}}
- Booking flow present: {{tour_operator_booking_flow_present}}
- Destination content present: {{tour_operator_destination_content_present}}
- Review content present: {{tour_operator_review_content_present}}

### Included in audit phase

- Structured-data audit
- Review of content model and product architecture
- Review of booking flow and package relationships
- Recommendation on schema approach
- Quote basis for implementation

### Excluded from audit phase

- Full implementation
- Template development
- Booking integration
- Final schema deployment

### Required client confirmations

- Booking platform: {{tour_operator_booking_platform}}
- Main product model: {{tour_operator_product_model}}
- Key entities to represent: {{tour_operator_key_entities}}

### Next step

Please confirm the booking platform, product model, and main entity types so the audit can be framed correctly before quoting.
```

---

## Missing-Value Prompt Library

Use these standard prompts when the AI cannot fill fields automatically.

### Website and platform

```md
The AI could not reliably determine the following from the live site. Please confirm or provide:

- CMS / platform
- Whether WooCommerce is active
- Whether a staging site exists
- Whether GA4 / GTM / Search Console are already in place
```

### Ecommerce scope

```md
To confirm whether the WooCommerce add-on stays within fixed scope, please provide:

- Approximate product count
- Approximate category count
- Whether variable products are used heavily
- Any bookings, subscriptions, memberships, or custom pricing
- Which plugins are critical to checkout
```

### Chatbot scope

```md
To complete the chatbot template, please confirm:

- The bot’s main job
- Who it serves
- What content it is allowed to use
- Where escalations should go
- Whether it will capture user data
```

### Commercial confirmation

```md
The AI has filled most of the package fields from your website and references. Please:

1. Confirm the values shown
2. Correct anything inaccurate
3. Fill in the remaining missing values

Only after confirmation should final package recommendation and pricing proceed.
```

---

## Implementation Notes

### Best use pattern

The ideal workflow is:

1. Gather all references
2. Crawl or inspect the live site
3. Pre-fill the shared mustache dictionary
4. Show a confirmation screen
5. Ask only for missing or uncertain values
6. Route to the relevant package template
7. Produce the templated output with confirmed values

### Internal status per mustache value

For each field, store a status:

- `found`
- `inferred`
- `needs_confirmation`
- `missing`

This makes the next intake step easy to drive.

### Confirmation UX pattern

The AI should prefer this structure:

```md
## Confirm What We Found

Found automatically:
- {{field_1}}
- {{field_2}}
- {{field_3}}

Still needed:
- {{missing_field_1}}
- {{missing_field_2}}

Please confirm the found values and fill in the missing ones.
```

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

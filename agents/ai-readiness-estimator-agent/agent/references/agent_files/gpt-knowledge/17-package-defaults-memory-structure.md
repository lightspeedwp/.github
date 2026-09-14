# Package defaults Memory structure

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

## Purpose

Use this reference for the standard Memory-backed structure that stores:

- the reusable project anchor
- reusable template defaults
- confirmed package-scoping defaults

Store these values in a single YAML file named `lightspeed-project-defaults.yaml`.

## Standard structure

```yaml
project:
  project_anchor: ""
  company_name: ""
  project_name: ""
  website_url: ""
  primary_domain: ""
  sector: ""
  project_type: ""

people:
  client_lead: ""
  internal_lead: ""
  content_owner: ""
  final_approver: ""

references:
  primary_drive_link: ""
  primary_figma_link: ""
  primary_github_link: ""
  primary_reference_links: []

preferences:
  assessment_focus: "overall AI readiness"
  preferred_source_priority: "automatic best-fit selection"
  target_launch_date: ""

package_defaults:
  project_delivery_type: ""
  project_requested_packages: []
  is_fixed_fee_eligible: ""
  recommended_add_ons: []
  possible_custom_scope_triggers: []
```

## Field rules

### project

Store the core project identity values used to recognise and resume the same client project.

### people

Store durable project contacts or approvers only when they are likely to be reused.

### references

Store only durable reference links that are likely to remain useful across future runs.

Do not save one-off links unless they are clearly a recurring source of truth.

### preferences

Store reusable working preferences, not one-off task instructions.

### package_defaults

Store only confirmed or clearly established package-scoping values.

Use this section for values such as:

- default delivery type
- package interests already confirmed for the project
- whether the project is still fixed-fee eligible
- likely add-ons that have already been agreed or repeatedly confirmed
- recurring custom-scope triggers

## Save rules

- Prefer grounded values over guessed values.
- Update existing keys when the current run provides stronger confirmed information.
- Keep empty strings or empty arrays for values that are not yet known.
- Do not create ad hoc top-level sections unless the structure needs a real extension.

## Read rules

When resuming a project:

- read `project.project_anchor` first
- use `project` and `references` to pre-fill template placeholders
- use `package_defaults` to reduce repeat scoping questions in package runs
- treat the current user request as the new source of truth if it conflicts with saved defaults

## Do not store

Do not store:

- speculative conclusions
- temporary scratch notes
- one-off prompt wording
- unconfirmed package recommendations as settled defaults
- sensitive details that are not needed for repeated future runs

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

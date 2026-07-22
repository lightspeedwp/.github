# Package defaults Memory structure

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

# Tour Operator Agent Update 4-Step Runbook

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
[![meta-agent-validation](https://github.com/lightspeedwp/.github/actions/workflows/meta-agent-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-agent-validation.yml)
[![meta-labels-sync](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta-labels-sync.yml)
[![meta](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/meta.yml)
[![metadata-governance](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metadata-governance.yml)
[![metrics-pipeline](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-pipeline.yml)
[![metrics-reporting](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/metrics-reporting.yml)
[![openspec-progress-phase](https://github.com/lightspeedwp/.github/actions/workflows/openspec-progress-phase.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-progress-phase.yml)
[![openspec-report-progression](https://github.com/lightspeedwp/.github/actions/workflows/openspec-report-progression.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-report-progression.yml)
[![openspec-sync-labels](https://github.com/lightspeedwp/.github/actions/workflows/openspec-sync-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-sync-labels.yml)
[![openspec-validate-labels](https://github.com/lightspeedwp/.github/actions/workflows/openspec-validate-labels.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/openspec-validate-labels.yml)
[![planner](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/planner.yml)
[![pr-template-validation](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-validation.yml)
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

Use these four prompts in order to update the existing **Tour Operator Website Configuration Agent** safely and non-destructively.

## Important operating rule

Do **not** upload the ZIP or any extracted ZIP contents into Builder Agent Files as part of the update process.

Instead, use the existing source folder `tmp/tour-operator-agent-instructions` as the comparison and merge source while updating the existing agent files.

Use the files in that folder to identify relevant additions, updates, and stronger wording that should be merged into the current agent. Do **not** bulk replace the current agent with the source pack, and do **not** save the source files in that folder as new Builder Agent Files unless a specific file is intentionally merged into the main agent file tree.

After all required files and updates have been merged, and after final validation and reporting are complete, remove the temporary source folder only if it is no longer needed. Do not remove any final merged files that were intentionally added to the main agent file tree.

Source folder available in the workspace:

- `tmp/tour-operator-agent-instructions`

---

## Prompt 1 — Inspect and audit before editing

Your job is to improve the existing **Tour Operator Website Configuration Agent** without removing existing functionality, especially its current audit-first behaviour, operating modes, LightSpeedWP Tour Operator plugin-stack priority, Gravity Forms workflow, Yoast SEO workflow, Memory behaviour, QA validation, app-usage rules, and safety boundaries.

Before editing anything:

0. Inspect the source files in `tmp/tour-operator-agent-instructions` as candidate merge sources for the existing agent.

1. Inspect the existing agent file structure.
2. Read the current `AGENTS.md`.
3. Read all existing references under `agent_files/references/`.
4. Read Memory guidance under `agent_files/memory/` and current Memory files under `memory/` when available.
5. Identify existing functionality that must be preserved.
6. Identify gaps, contradictions, duplicate guidance, stale guidance, or missing references.

Use the source folder contents as reference material during the audit, but preserve the current agent as the primary target. Merge only the improvements that strengthen the existing setup.

Do **not** remove existing behaviour unless it is clearly duplicated, contradictory, or unsafe. Prefer additive, surgical edits over broad rewrites.

Preserve, at minimum:

- Role and scope rules
- Scope and anti-drift rules
- Operating modes: Discovery, Audit, Implementation, Reporting, QA
- Route-the-request behaviour
- Discovery workflow
- Audit workflow
- Implementation workflow
- Content structure mapping output requirements
- Tour Operator plugin priorities
- Gravity Forms workflow
- Yoast SEO workflow
- Reference Files and Templates section
- Skill routing rules
- App usage rules
- Memory behaviour
- QA and validation behaviour
- Boundaries and safety
- Standards and Further Orientation

Create a short audit of the current setup before any edits.

Specifically check whether the existing agent already includes:

1. A dedicated **Tour Operator Core Content Model** section in `AGENTS.md`.
2. A dedicated content-model reference file, preferably `agent_files/references/tour-operator-content-model-standard.md`.
3. A reference to that content-model file inside the `Reference Files And Templates` section of `AGENTS.md`.
4. Clear distinction between:
   - built-in core plugin post types
   - first-party extension post types
   - supporting WordPress plugins
   - general WordPress content
5. Clear instruction that Reviews, Team, Specials, and Wetu Importer are extension-context items, not default core post types unless the extension stack confirms them.
6. Clear instruction that the core content model should be checked before suggesting alternative plugins or creating new content entities.
7. Memory rules that keep bulky content-model details in reference files, not Memory.
8. Validation guidance that checks instruction-to-reference consistency.

Flag any issues you find. Do not silently fix a major contradiction without mentioning it.

For source-of-truth content-model work, use these sources when available:

- Google Doc: `https://docs.google.com/document/d/1A50dnI7RJzFhwM4L8sht1uE8QaR0W_cHYJY8nv41-6I/edit?tab=t.4t1r11fi23tr`
- Core plugin GitHub: `https://github.com/lightspeedwp/tour-operator`
- Core plugin WordPress.org: `https://wordpress.org/plugins/tour-operator`
- `TO Team`: `https://github.com/lightspeedwp/to-team`
- `TO Specials`: `https://github.com/lightspeedwp/to-specials`
- `TO Reviews`: `https://github.com/lightspeedwp/to-reviews`
- `Wetu Importer`: `https://github.com/lightspeedwp/wetu-importer`

Do not infer field names, taxonomy slugs, relationship fields, extension ownership, or plugin behaviour without confirming them from the Google Doc, the existing reference files, repository evidence, or connected WordPress inspection.

Do not make edits yet. First return:

- what functionality must be preserved
- issues found
- files likely to be edited
- files likely to be added
- any source-verification blockers

---

## Prompt 2 — Add the content-model reference and strengthen supporting references

Continue from the completed audit.

Compare the source files in `tmp/tour-operator-agent-instructions` against the current agent files and merge only the relevant content-model improvements, stronger source-grounding rules, and non-duplicative reference updates into the existing agent.

Now add or update a dedicated reference file:

`agent_files/references/tour-operator-content-model-standard.md`

This file must clearly cover:

### 1. Non-negotiable behaviour

The agent must:

- treat the LightSpeedWP Tour Operator core plugin as the first source of truth for tour operator content structure
- inspect the active plugin stack before recommending extra plugins or custom content entities
- use exact slugs and field names from source evidence
- separate confirmed source facts from assumptions
- avoid inventing plugin features
- avoid treating extension features as core features unless the extension is installed, active, and relevant

### 2. Built-in core post types

Document the built-in core post types from the content model:

- `accommodation`
- `destination`
- `tour`

Include each post type’s purpose, hierarchy behaviour where confirmed, and the role it plays in the website content model.

### 3. Accommodation model

Include confirmed Accommodation details from the source document, including:

- post type slug
- purpose
- key custom fields
- metabox fields
- relationship fields
- relevant taxonomies
- audit checks
- implementation checks

Use structured tables where clearer than prose.

### 4. Destination model

Include confirmed Destination details from the source document, including:

- post type slug
- purpose
- hierarchy behaviour
- key custom fields
- metabox fields
- relationship fields
- relevant taxonomies
- audit checks
- implementation checks

### 5. Tour model

Include confirmed Tour details from the source document, including:

- post type slug
- purpose
- key commercial fields
- itinerary fields
- location/start/end fields
- relationship fields
- media fields
- booking-validity fields where confirmed
- relevant taxonomies
- audit checks
- implementation checks

### 6. Core taxonomies

Document the confirmed core taxonomies and their associated post types.

At minimum, check and document whether these are present in the source model:

- `brand`
- `accommodation-type`
- `continent`
- `facility`
- `travel-style`

Be careful with taxonomy ownership and associated post types. Do not broaden a taxonomy beyond the source evidence.

### 7. Shared post fields

Document shared or general post fields confirmed in the content model, including shared media and relationship fields where applicable.

### 8. Relationship behaviour

Add clear instructions that relationships between tours, destinations, accommodation, and posts are central to the plugin model.

The agent should check relationship fields before recommending manual duplication, separate plugins, or custom architecture.

### 9. Extension boundary rules

Document how the agent should treat first-party extensions:

- `TO Team` for team, guide, consultant, or expert-led content
- `TO Specials` for time-sensitive offers and promotional specials
- `TO Reviews` for review-led trust signals
- `Wetu Importer` for Wetu-integrated content import workflows

Make it explicit that extension-related content should not be treated as built-in core plugin content unless the active extension stack confirms it.

### 10. Audit checklist

Add a practical checklist for auditing the content model on a WordPress site:

- core plugin installed and active
- expected CPTs visible
- CPT archives or templates configured where relevant
- taxonomy terms coherent
- relationships populated
- media fields populated
- pricing and commercial fields complete where relevant
- enquiry path connected
- Yoast visibility configured for CPTs and taxonomies
- Gravity Forms enquiry handoff aligned with tour content
- missing or inactive extensions separated from true defects

### 11. Implementation checklist

Add a safe implementation workflow:

- read current state before changes
- confirm whether the change belongs to core plugin, extension plugin, Gravity Forms, Yoast, content, navigation, or theme/template layer
- make the smallest coherent change
- verify after edits
- report before/after values where possible
- do not create new post types or taxonomies unless the LightSpeedWP stack or project approval supports them
- do not activate/deactivate plugins unless explicitly requested and risk is understood

Also update these existing references only where needed:

### `agent_files/references/tour-operator-plugin-stack-standard.md`

Strengthen it so audits check the built-in content model before recommending extensions or alternatives.

It should say:

- inspect the core plugin first
- then inspect first-party extensions
- then inspect Gravity Forms
- then inspect Yoast SEO
- then inspect general supporting plugins
- missing extensions are open configuration decisions, not automatic defects
- extension recommendations must be tied to the site’s commercial model
- avoid ecommerce, checkout, cart, booking, and payment recommendations unless explicitly required

### `agent_files/references/wordpress-tour-operator-standard.md`

Strengthen it so the recommended website structure is aligned with the plugin’s built-in content model.

It should say:

- Tour, Destination, and Accommodation are the core model to understand first
- Accommodation may be commercially optional in a content strategy, but it is still a built-in core post type in the plugin model when confirmed by source evidence
- Reviews, Team, Specials, and Wetu Importer should be treated as extension-supported capabilities, not default core content
- Gravity Forms and Yoast SEO support the implementation but do not define the content model

Add extra reference files only if they materially help and do not duplicate existing references.

Potential additional files:

1. `agent_files/references/tour-operator-content-model-audit-checklist.md` — only if the main standard becomes too long.
2. `agent_files/references/tour-operator-implementation-playbook.md` — only if implementation workflows need a deeper separate reference.
3. `agent_files/references/tour-operator-reference-source-register.md` — only if source tracking is weak; it should list the Google Doc, GitHub plugin repo, WordPress.org plugin page, and extension repositories.

Do not add files just to make the pack look bigger.

When complete, return:

- files added or updated
- key content-model facts added
- any unresolved source-verification gaps
- any contradictions still requiring AGENTS-level instruction updates

---

## Prompt 3 — Update AGENTS.md and Memory guidance without duplicating references

Continue from the completed reference updates.

Where the source folder includes stronger AGENTS or Memory wording, merge only the relevant improvements into the existing files without overwriting preserved behaviours.

Update `AGENTS.md` so the main instructions actively point to the new content-model reference.

Add a dedicated section called:

`## Tour Operator Core Content Model`

This section must stay concise and directive. Do **not** copy the full reference file into `AGENTS.md`.

It should say the agent must:

- use `tour-operator-content-model-standard.md` for built-in content model details
- treat `accommodation`, `destination`, and `tour` as the core built-in post types when confirmed by the source model
- verify CPTs, fields, relationships, and taxonomies before recommending new entities
- separate core plugin features from extension-provided features
- check first-party extensions before suggesting alternatives
- avoid introducing booking, checkout, payment, ecommerce, CPT builder, field framework, multilingual, caching, filtering, or map plugins unless the project explicitly asks for those implementation-stack recommendations
- preserve Gravity Forms and Yoast SEO as supporting workflows, not replacements for the Tour Operator content model

Also update the `Reference Files And Templates` section to include:

- `tour-operator-content-model-standard.md`

If the builder file reference ID is not available yet, add a clear placeholder note that the file must be attached and the file ID updated.

Update `agent_files/memory/README.md` so Memory guidance says:

- store durable project decisions and confirmed plugin-stack facts
- do not store bulky content-model tables in Memory
- use references for fixed standards and full content-model detail
- save whether plugin-stack facts are user-provided, observed through connected tools, or inferred from partial evidence
- never let Memory override fresher connected-site evidence

Update `memory/user-preferences.md` with only short durable facts, not the full content model. Include:

- LightSpeed owns and prefers the first-party Tour Operator core plugin
- known first-party extensions are `TO Team`, `TO Specials`, `TO Reviews`, and `Wetu Importer`
- the Tour Operator content-model Google Doc is a source reference for built-in content-model work
- Gravity Forms remains the preferred form workflow unless project evidence says otherwise
- Yoast SEO and Yoast SEO Premium remain the SEO baseline unless project evidence says otherwise

Keep these rules in force:

- do not remove existing behaviour unless duplicated, contradictory, or unsafe
- preserve current audit-first behaviour and all existing operating modes
- preserve exact required content-structure mapping headings
- keep Gravity Forms and Yoast SEO as supporting workflows
- keep Memory short and factual
- do not let Memory store bulky reference material

When complete, return:

- exact files edited
- what was added to `AGENTS.md`
- what was changed in Memory guidance
- any remaining consistency risks before validation

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

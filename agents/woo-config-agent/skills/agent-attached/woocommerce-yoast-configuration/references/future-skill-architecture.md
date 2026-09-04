# Future skill architecture reference

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
[![issue-create-enhanced](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-create-enhanced.yml)
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

Use this file when the user asks how to structure, expand, maintain, validate, package, or roll out the Yoast configuration skill.

## Architecture principle

The skill must remain progressively loaded. `SKILL.md` is the control plane; large research-derived material belongs in conditional files. This prevents ordinary Yoast setup or audit requests from loading every product, schema, WooCommerce, developer, source-register, fixture, example, and rollout note.

## Lean version-one structure

```text
woocommerce-yoast-configuration/
├── SKILL.md
├── agents/
│   └── openai.yaml
├── references/
├── intake/
├── profiles/
├── templates/
└── docs/
```

| Folder/file | Status | Contains | Load when | Triggering user request | Why not in `SKILL.md` | Progressive-loading value | Maintenance |
|---|---|---|---|---|---|---|---|
| `SKILL.md` | Required | Trigger description, evidence hierarchy, caveats, routing, intake/output workflows, QA expectations | Always on invocation | Any Yoast SEO configuration/audit/troubleshooting/developer/research request | It is the control plane | Keeps core behaviour compact | Update only when routing, scope, caveats, or bundled paths change |
| `agents/openai.yaml` | Required | Display name, short description, icon metadata, platform support | Package/UI load | Installation or display | Metadata is not task instruction | No runtime context burden | Update only for UI metadata changes |
| `references/` | Required | Research-derived matrices, configuration references, feature behaviour, schema, WooCommerce, developer APIs, QA, source register | Task-specific evidence lookup | Product choice, settings, schema, WooCommerce, developer, QA, or research-pack requests | Too large and varied for the control plane | Loads only the relevant knowledge slice | Refresh after Yoast, WordPress, WooCommerce, Google, or Schema.org changes |
| `intake/` | Required | Reusable intake prompts for client/site/WordPress/WooCommerce/migration evidence | Request lacks required implementation context | New setup, audit, migration, WooCommerce review | Intake differs by workflow | Loads only missing-context questions | Update when repeated blockers emerge |
| `profiles/` | Required | Site-type strategy files | Site type is known or inferred | Business site, local site, publisher, ecommerce, multilingual, migration | Site strategies are conditional | Loads one site-type profile instead of all guidance | Refresh after playbooks change |
| `templates/` | Required | Production output formats | User asks for a deliverable | Configuration report, audit, WooCommerce report, developer handoff, launch QA, research pack | Output formatting is not routing logic | Loads only the requested format | Version with agency reporting changes |
| `docs/` | Recommended | Usage, evidence, research, maintenance, changelog | User asks how to use or maintain the skill | Skill operation, source refresh, team guidance | Maintainer docs are not needed for client tasks | Keeps operational docs conditional | Update each package release |

## Required v1 reference files

| File | Status | Load when | Contains | Maintenance rule |
|---|---|---|---|---|
| `references/product-capability-matrix.md` | Required | Product selection, feature boundaries, entitlement checks | Free/Premium/WooCommerce SEO/AI Plus matrix with confidence and sources | Refresh when Yoast packaging changes |
| `references/configuration-reference.md` | Required | Setup/audit/configuration tasks | Setting groups, recommended defaults, risks, dependencies, related settings, sources | Refresh after Yoast settings/UI changes |
| `references/feature-behaviour-reference.md` | Required | Feature behaviour or output questions | Titles, descriptions, canonicals, robots, sitemaps, llms.txt, headers, breadcrumbs, schema, indexables, analysis, redirects, internal linking | Refresh after feature docs/changelogs |
| `references/woocommerce-seo-reference.md` | Required | WooCommerce tasks | Product data, ProductGroup, Offer/AggregateOffer, variations, categories, tags, shop page, filtered URLs, QA | Refresh after Yoast WooCommerce SEO, WooCommerce, or Google product docs |
| `references/schema-reference.md` | Required | Schema graph, schema pieces, validation or customisation | Schema graph approach and piece-by-piece reference | Refresh after Yoast schema docs, Schema.org, or Google changes |
| `references/developer-api-reference.md` | Required | Developer handoff or customisation | API/filter/spec references, safe customisation notes, testing requirements | Refresh after Yoast developer docs or deprecations |
| `references/configuration-playbooks.md` | Required | Site-type setup plan | Agency playbooks for common site types and risk profiles | Update from project learnings |
| `references/qa-checklists.md` | Required | Launch, audit or retest | Modular QA checks by output type and workflow | Add checks after failures or new features |
| `references/source-register.md` | Required | Evidence traceability or research refresh | Source rows, verification status, duplicate preservation, confidence | Update every time a source is scanned |
| `references/research-pack-output-spec.md` | Required for research | Deep research packs | Required sections, evidence labels, matrix/data-model shapes | Update when research deliverable changes |
| `references/future-skill-architecture.md` | Recommended | Skill refinement or packaging | Architecture, file responsibilities, v1/v2 roadmap | Update after structure changes |

## Version-two additions

Add v2 folders only when they materially improve reliability, repeatability, or team adoption.

```text
memory/
memory/defaults/
memory/schemas/
schemas/
examples/
examples/templates/
examples/memory/
fixtures/
rollout/
scripts/
tests/
assets/
```

| Folder/file | Status | Contains | Load when | Triggering user request | Why it belongs there | Progressive-loading value | Maintenance |
|---|---|---|---|---|---|---|---|
| `memory/defaults/` | Recommended v2 | Agency, standard Yoast, WooCommerce, and schema defaults | Reusable defaults or saved site profile needed | “Use our agency defaults”, “save this as a default” | Durable defaults are not evidence | Loads only when persistence matters | Review quarterly and after policy/product changes |
| `memory/schemas/` | Recommended v2 | JSON schemas for saved defaults and client profiles | Validating reusable memory structures | “Validate this saved site profile” | Memory shape differs from one-off output | Avoids loading schemas into normal tasks | Update before changing memory format |
| `schemas/` | Recommended v2 | JSON schemas for setting, check, capability, schema-piece, and source-register rows | Structured output or validation | “Return JSON”, “validate the reference data” | Machine validation is noisy in prose files | Loaded only for machine-readable tasks | Keep backwards-compatible where practical |
| `examples/` | Optional v2 | Worked examples for standard site, WooCommerce, migration, schema customisation | Training or style comparison | “Show me an example output” | Examples are illustrative, not canonical | Avoids loading examples during real work | Keep anonymised; update after template changes |
| `examples/templates/` | Optional v2 | Filled or annotated template examples | Team training | “How should this report look?” | Separates production templates from example content | Loaded only for training | Revise after template changes |
| `examples/memory/` | Optional v2 | Example agency defaults and client-site profiles | Memory structure demonstration | “Show example memory/defaults” | Avoids polluting real defaults | Loaded only for memory onboarding | Update with memory schema changes |
| `fixtures/` | Recommended v2 | Small anonymised sample settings, content types, taxonomies, schema output | Testing scripts/scenarios | “Run validation”, “test input handling” | Fixtures support repeatability | Never loaded during normal advice | Keep small and anonymised |
| `rollout/` | Optional v2 | Implementation plan, validation plan, team adoption, versioning | Team rollout or release work | “Roll this out to the team” | Rollout is not task execution | Keeps adoption content separate | Update each release |
| `scripts/` | Optional v2 | Deterministic validators and generators | Validation/generation task | “Validate this package”, “generate QA checklist” | Scripts reduce fragile manual checks | Executed only when requested | Test after .schemas/reference edits |
| `tests/` | Recommended v2 | Scenario tests and regression notes | Skill QA or release validation | “Test the skill”, “check regression” | Tests are not runtime guidance | Loaded only for package QA | Add tests for every real-world failure |
| `assets/` | Avoid unless needed | Icon or genuinely useful small binary/static assets | UI metadata or artifact generation | “Add skill icon” | Most work is text/reference based | No reasoning load when unused | Keep tiny; avoid binary bloat |

## First-version folders to avoid

Avoid these in v1 unless there is immediate operational need:

- `memory/`: defaults should be proven on real sites before becoming durable.
- `schemas/`: useful once structured output stabilises, but premature while research rows evolve.
- `examples/`: examples need anonymisation and can drift from templates.
- `fixtures/`: only useful once scripts/tests exist.
- `rollout/`: useful for team adoption, not initial task quality.
- `scripts/`: add code maintenance; use only for deterministic checks.
- `tests/`: high value after stable scenarios exist, noisy before then.
- `assets/`: little value beyond a small icon.

## Build sequence

### Phase 1: lean usable skill

Build `SKILL.md`, `agents/openai.yaml`, `references/`, `intake/`, `profiles/`, `templates/`, and `docs/`.

Goal: support agency delivery for setup, audit, WooCommerce SEO, schema, developer handoff, QA, and research-pack work.

### Phase 2: evidence maturity

Strengthen the source register, product matrix, configuration reference, schema reference, WooCommerce reference, developer reference, research workflow, and evidence policy.

Goal: make recommendations traceable and safe for client-facing or internal delivery.

### Phase 3: structured validation

Add `schemas/`, `fixtures/`, `scripts/`, and `tests/`.

Goal: validate source-register rows, settings entries, capability rows, and scenario coverage.

### Phase 4: team scaling

Add `memory/`, `examples/`, and `rollout/`.

Goal: support reusable agency defaults, onboarding, training, release management, and regression examples.

## Maintenance triggers

Update the architecture and related files when:

- Yoast changes product packaging, names, feature boundaries, UI navigation, or entitlements.
- Yoast developer docs change APIs, filters, schema pieces, indexables, metadata surfaces, or deprecations.
- WooCommerce changes product data behaviour relevant to schema or metadata.
- Google changes Search Central guidance for structured data, canonicals, robots, hreflang, sitemaps, or ecommerce search features.
- The team finds a recurring audit or configuration failure not covered by current intake, profiles, QA, or tests.
- Templates change enough that examples or rollout guidance become stale.

## Second-batch additions

Add these files to strengthen routing and maintenance without turning the skill into a monolithic knowledge pack:

| File | Status | Purpose | Load when |
|---|---|---|---|
| `references/file-routing-index.md` | Recommended | Maps user request patterns to the smallest useful file set, output template and validation route | The request is ambiguous, multi-route, or package-maintenance related |
| `references/evidence-state-model.md` | Recommended | Defines research target, scanned evidence, verified current source, stale evidence, contradicted evidence and inference states | The answer depends on source confidence or freshness |
| `docs/reference-refresh-protocol.md` | Recommended | Defines targeted, reference-level and package-level refresh workflows | Updating source register rows or refreshing reference data |
| `templates/source-register-row-template.md` | Optional but useful | Gives a consistent row format for source-register maintenance | Adding or refreshing source entries |
| `scripts/validate_skill_structure.py` | Recommended v2 | Checks package hygiene, routed files and unexpected file types | Before packaging or after adding files |
| `tests/research-pack-scenario-tests.md` | Recommended v2 | Regression tests for deep research and reference refresh workflows | After changing research workflow or source register format |

These additions support progressive loading by making the routing map explicit. They belong outside `SKILL.md` because they are maintainer and validation aids rather than everyday runtime instructions.

## Batch 3 operational refinement files

| File | Status | Contains | Load when | Why it helps progressive loading |
|---|---|---|---|---|
| `references/audit-triage-model.md` | Recommended v2 | Severity, priority, confidence, owner and QA classification rules | Audit, troubleshooting, launch blocker or migration finding triage | Keeps operational classification outside `SKILL.md` and avoids overloading configuration references |
| `docs/current-verification-playbook.md` | Recommended v2 | Current-source verification levels and freshness triggers | Product packaging, UI path, API, Google, Schema.org, WooCommerce or live-output certainty matters | Loads only when source freshness can change the answer |
| `templates/yoast-troubleshooting-note.md` | Recommended v2 | Concise internal note format for unclear or partially evidenced issues | The user needs a quick fix path or handoff rather than a full audit | Avoids loading full audit templates for small issue triage |
| `schemas/audit-finding.schema.json` | Optional v2 | Machine-readable audit finding format | Structured audit output or validation is requested | Enables validation without changing narrative reports |
| `tests/audit-triage-scenario-tests.md` | Recommended v2 | Regression scenarios for severity, priority and evidence-confidence behaviour | Package QA or skill refinement | Keeps edge-case behaviour testable without adding bulk to runtime instructions |

## Batch 4 decision and client communication layer

Add these files when the skill needs to preserve approval decisions, explain conflicts, or convert internal audit detail into client-safe outputs:

| File | Status | Contains | Load when | Maintenance |
|---|---|---|---|---|
| `references/decision-register-model.md` | Recommended v2 | Decision states, decision types, required fields, owner guidance and risk wording | A recommendation changes indexation, canonicals, schema, WooCommerce archive strategy, redirects, product mix, AI metadata, or developer customisation | Update when approval workflows or decision types change |
| `references/conflict-resolution-playbook.md` | Recommended v2 | Conflict types, resolution order, escalation triggers and compact conflict note structure | Sources, settings, rendered output, Google guidance, client preference, or developer behaviour conflict | Add recurring conflicts from real audits |
| `references/client-communication-guardrails.md` | Recommended v2 | Client-safe phrasing, claims to avoid and internal-to-client filtering rules | Turning internal Yoast notes into client-facing summaries | Update after client feedback or caveat changes |
| `templates/yoast-decision-log.md` | Recommended v2 | Reusable decision log template | Decision needs approval or future traceability | Keep aligned with decision schema |
| `templates/client-safe-summary.md` | Recommended v2 | Client-facing summary structure | Client update, approval note, audit summary, or implementation note | Keep aligned with reporting style |
| `schemas/decision-record.schema.json` | Optional v2 | Machine-readable decision record structure | Structured decision log validation | Version before changing required fields |
| `fixtures/sample-decision-record.json` | Optional v2 | Example valid decision record | Testing or demonstration | Keep anonymised |
| `scripts/validate_decision_records.py` | Optional v2 | Deterministic decision .schemas/fixture check | Package QA after decision file changes | Test after schema edits |
| `tests/decision-conflict-scenario-tests.md` | Recommended v2 | Regression scenarios for client approvals and evidence conflicts | Package QA and behaviour refinement | Add real-world failure cases |

## Artefact review maintenance

Maintain `references/settings-export-review-playbook.md`, `references/rendered-output-qa-playbook.md`, `templates/settings-export-review.md`, `templates/rendered-output-qa-report.md`, `tests/artefact-review-scenario-tests.md`, `schemas/rendered-output-check.schema.json`, `fixtures/sample-rendered-output-check.json`, and `scripts/validate_artefact_review.py` together. Update them when Yoast export formats, rendered metadata output, sitemap behaviour, robots/llms handling, schema output, or agency QA sample sets change.

## Batch 6 comparison, regression and acceptance layer

Add these files when the skill needs to compare Yoast state over time, run post-update regression checks, or define acceptance gates for release and retainer work:

| File | Status | Contains | Load when | Maintenance |
|---|---|---|---|---|
| `references/state-comparison-playbook.md` | Recommended v2 | Before/after comparison rules for settings, rendered output, sitemaps, robots, llms.txt, schema, WooCommerce and developer changes | Comparing baseline/current/proposed Yoast states | Update when new comparison categories or classifications are needed |
| `references/plugin-update-regression-playbook.md` | Recommended v2 | Pre-update baseline, post-update checks, stop conditions and ownership guidance | Yoast, WordPress, WooCommerce, theme or SEO-adjacent plugin updates | Update after update-related failures or Yoast release behaviour changes |
| `templates/yoast-state-comparison-report.md` | Recommended v2 | Structured comparison deliverable | Retainer comparison, migration before/after review, settings/output diff | Keep aligned with triage and decision models |
| `templates/yoast-regression-test-report.md` | Recommended v2 | Release/update regression report | Plugin updates, launch QA, post-update checks | Update after release QA changes |
| `templates/yoast-acceptance-criteria.md` | Recommended v2 | Evidence-led pass/fail acceptance gate | Client approval, release sign-off, migration go/no-go | Keep aligned with QA checklist and decision log |
| `schemas/regression-check.schema.json` | Optional v2 | Machine-readable regression check structure | Structured regression report validation | Version before changing required fields |
| `fixtures/sample-regression-check.json` | Optional v2 | Example regression-check fixture | Testing validators or examples | Keep anonymised and small |
| `scripts/validate_regression_pack.py` | Optional v2 | Deterministic validation for regression pack files and routing | Package QA after comparison/regression edits | Test after every regression .schemas/template change |
| `tests/comparison-regression-scenario-tests.md` | Recommended v2 | Regression scenarios for before/after settings, plugin updates, acceptance criteria and accepted regressions | Package QA and skill refinement | Add scenarios from real update failures |

Keep this layer outside `SKILL.md` because comparison and release QA are workflow-specific. Load it only when the user asks for before/after analysis, post-update QA, retainer comparison, release validation or acceptance criteria.

## Access-aware remediation layer

Add this layer when the skill is used for implementation planning, retainers, or handoff to editors/developers/hosting.

| File | Status | Contains | Load when | Maintenance |
|---|---|---|---|---|
| `references/access-level-workflow.md` | Recommended | Access levels, what each evidence type proves, minimum evidence by task | User asks what can be done with current evidence/access | Update when new evidence sources or connectors are used |
| `references/remediation-backlog-model.md` | Recommended | Action item fields, owner routing, implementation routes, priority rules | User asks for action items, backlog, implementation plan or owner routing | Update when team ownership or QA policy changes |
| `templates/yoast-remediation-backlog.md` | Recommended | Implementation-ready backlog template | User asks for actionable issue list | Update with delivery process changes |
| `templates/wordpress-admin-change-plan.md` | Recommended | Admin-only change plan with pre/post QA | User asks for editor/admin instructions | Update when Yoast UI/admin processes change |
| `schemas/remediation-item.schema.json` | Optional v2 | Structured remediation item validation | User requests structured backlog or validation | Keep compatible with remediation model |
| `tests/access-remediation-scenario-tests.md` | Recommended v2 | Regression tests for access-aware actions | Package validation and routing updates | Add tests after real delivery failures |

### Remediation validation fixture

- `fixtures/sample-remediation-item.json` is a small v2 fixture for validating the remediation item schema and access-aware owner routing. Load it only when testing `schemas/remediation-item.schema.json` or `scripts/validate_remediation_pack.py`.

## Portfolio and defaults-drift extension

The portfolio/defaults-drift layer is a v2 agency-scaling addition. Keep it in `references/`, `templates/`, `schemas/`, `fixtures/`, `scripts/`, and `tests/` rather than `SKILL.md` because it is only needed for retainer, multi-site, or agency-defaults work.

Required files for this layer:

- `references/portfolio-audit-playbook.md`
- `references/agency-defaults-drift-model.md`
- `templates/yoast-portfolio-audit-summary.md`
- `templates/yoast-defaults-drift-report.md`
- `schemas/portfolio-site-summary.schema.json`
- `fixtures/sample-portfolio-site-summary.json`
- `scripts/validate_portfolio_pack.py`
- `tests/portfolio-defaults-scenario-tests.md`

Load this layer only when the user asks for portfolio audits, multi-site summaries, retainer reviews, cross-site Yoast patterns, agency default consistency, or baseline drift.

## Periodic health review layer

Add this layer when the team starts using the skill for retainers, monthly maintenance notes, quarterly review packs, or cross-site health summaries.

| File | Status | Contains | Load when | Maintenance |
|---|---|---|---|---|
| `references/periodic-health-review-playbook.md` | Recommended v2 | Cadence-aware health review workflow, evidence boundaries, stop conditions | Monthly/quarterly review, low-touch health check, what-changed summary | Update after retainer review process changes |
| `references/yoast-health-score-model.md` | Recommended v2 | Internal configuration-health scoring, confidence caps, unscored conditions | User asks for score, status, health trend, or portfolio comparison | Update after scoring model is tested on real sites |
| `templates/yoast-health-summary.md` | Recommended v2 | Structured health summary with status, evidence, risks, actions | Retainer or health summary deliverable | Keep aligned with client-safe reporting |
| `templates/yoast-retainer-review-note.md` | Optional v2 | Short account-manager-friendly recurring note | Monthly or quarterly maintenance update | Update with account management conventions |
| `schemas/health-review.schema.json` | Optional v2 | Machine-readable health review shape | Structured health output or validation | Version with score model changes |
| `tests/health-review-scenario-tests.md` | Recommended v2 | Regression scenarios for health checks and scoring caveats | Package QA after changing health workflows | Add scenarios when health reviews fail in practice |

This content belongs outside `SKILL.md` because health scoring and retainer summaries are conditional workflows. Keeping them separate preserves progressive loading for normal one-site Yoast configuration tasks.

## AI-assisted SEO v2 layer

Add this layer when the team uses Yoast SEO AI Plus, AI-generated titles/descriptions, or AI-assisted metadata review in client workflows.

| File | Status | Contains | Load when | Maintenance |
|---|---|---|---|---|
| `references/ai-assisted-seo-workflow.md` | Recommended | Workflow boundaries for AI-assisted metadata, approval, AI Plus positioning and QA | User asks for AI metadata, AI Plus recommendation or AI visibility claim review | Refresh when Yoast AI packaging or agency approval policy changes |
| `references/ai-metadata-review-model.md` | Recommended | Review states, risk levels, rejection reasons and required fields for AI metadata items | User asks to approve or review generated metadata | Update when approval policy or metadata quality rules change |
| `templates/ai-metadata-approval-pack.md` | Recommended | Reviewable approval table for generated titles/descriptions/social metadata | User needs approval pack or admin handoff | Keep aligned with client approval workflow |
| `templates/yoast-ai-plus-positioning-note.md` | Optional | Internal/proposal note format for AI Plus positioning | User asks whether AI Plus should be included in a stack/proposal | Verify product packaging before use |
| `schemas/ai-metadata-item.schema.json` | Optional v2 | Machine-readable structure for metadata review items | Validation or automation is requested | Keep backward-compatible where possible |
| `fixtures/sample-ai-metadata-item.json` | Optional v2 | Sample AI metadata review item for tests and validation | Package QA or validation | Keep anonymised and aligned with the schema |
| `scripts/validate_ai_metadata_pack.py` | Optional v2 | Validator for AI metadata workflow files and routing | Package QA after AI workflow changes | Run before packaging |
| `tests/ai-assisted-seo-scenario-tests.md` | Recommended | Regression tests for unsupported claims, product metadata, AI Plus positioning and client-safe summaries | Package QA or refinement | Add real failure cases over time |

Keep this layer separate from the generic configuration reference so routine Yoast setup tasks do not load AI-specific approval rules.

## Bulk metadata governance layer

Add the bulk metadata layer when the agency starts reviewing spreadsheets, imports, AI-generated metadata batches, migration metadata rows, or approval queues.

| File | Status | Contains | Load when | Maintenance |
|---|---|---|---|---|
| `references/bulk-metadata-governance.md` | Recommended v2 | Batch classification, evidence requirements, safety rules, review states and QA sampling for high-volume metadata work | Bulk metadata, metadata spreadsheets, imports, AI batches or template-level changes | Update after delivery failures, import changes or new approval rules |
| `references/approval-queue-workflow.md` | Recommended v2 | Approval owner routing, queue fields, status rules and approval safeguards | A change needs client, SEO, ecommerce, developer or compliance approval | Update when team approval roles change |
| `templates/metadata-bulk-edit-plan.md` | Recommended v2 | Implementation plan for controlled metadata batch changes | A user asks how to apply many metadata changes safely | Keep aligned to admin/import workflow |
| `templates/yoast-approval-queue.md` | Recommended v2 | Client/internal approval list for metadata, indexation, schema or redirect changes | A user needs review/sign-off before implementation | Keep client-safe and concise |
| `schemas/bulk-metadata-change.schema.json` | Optional v2 | Structured row format for bulk metadata review | Structured approval queues or validation are requested | Version when row fields change |
| `scripts/validate_bulk_metadata_pack.py` | Optional v2 | Validation for the bulk metadata workflow files | Package QA after changing this layer | Run before packaging |
| `tests/bulk-metadata-governance-scenario-tests.md` | Recommended v2 | Regression scenarios for spreadsheets, AI batches, products, templates and migration imports | Skill QA or workflow refinement | Add scenarios when real batch issues appear |

This layer belongs outside `SKILL.md` because batch approval and implementation planning are conditional, high-detail workflows. `SKILL.md` should only route to the layer and preserve the safety rule: candidate rows, approval, implementation and rendered verification are separate states.

### Bulk metadata validation fixture

`fixtures/sample-bulk-metadata-change.json` is the canonical small fixture for validating `schemas/bulk-metadata-change.schema.json`. Load it only when testing structured approval queue rows, validating bulk metadata changes, or updating `scripts/validate_bulk_metadata_pack.py`. It should stay anonymised and should not be used as a real client example.

## Content structure and taxonomy layer

Add this layer once the skill is used for publisher, WooCommerce, local-service, migration or content-cleanup projects where category, tag, archive and taxonomy decisions materially affect indexation.

| File | Status | Purpose | Load when | Maintenance |
|---|---|---|---|---|
| `references/content-structure-taxonomy-playbook.md` | Recommended | Explain how to assess messy categories, tags, author/date/media archives, product taxonomies and filtered URL groups before Yoast changes | User asks about taxonomy indexation, content structure, archive cleanup or thin/duplicate archive risk | Refresh after repeated project findings or major Yoast/WooCommerce archive behaviour changes |
| `references/taxonomy-indexation-decision-model.md` | Recommended | Standardise decision states, risk levels, owners and QA for taxonomy/archive indexation | User needs an approval-ready index/noindex/sitemap/canonical decision | Keep aligned with agency defaults and decision-register model |
| `templates/taxonomy-indexation-decision-pack.md` | Recommended | Produce approval-ready decision packs for taxonomy and archive surfaces | User asks for a decision pack or needs client approval | Update when delivery format changes |
| `templates/content-structure-remediation-plan.md` | Recommended | Convert IA/taxonomy issues into content/admin/developer actions before Yoast implementation | User asks for cleanup plan or actionable backlog | Keep aligned with remediation backlog model |
| `schemas/taxonomy-decision.schema.json` | Optional v2 | Validate structured taxonomy decisions | Structured output or automation requests | Version with schema changes |
| `fixtures/sample-taxonomy-decision.json` | Optional v2 | Provide a safe example decision row | Tests and validator runs | Keep anonymised and simple |
| `scripts/validate_taxonomy_pack.py` | Optional v2 | Check file presence, routing and fixture consistency | Package validation | Run before packaging |
| `tests/content-taxonomy-scenario-tests.md` | Recommended v2 | Regression tests for tags, categories, WooCommerce attributes, screenshots and migrations | Skill QA and refinement | Add real anonymised failure cases over time |

Keep this material outside `SKILL.md` because taxonomy guidance grows quickly and is only needed for specific content-structure tasks. The progressive-loading trigger should point to the playbook/model/templates, not embed archive strategy inside the core router.

## Multilingual workflow layer

The multilingual layer supports language and locale-sensitive Yoast reviews without turning `SKILL.md` into a language-plugin manual. Keep these files as conditional references:

- `references/multilingual-hreflang-playbook.md` for hreflang, language architecture, locale canonicals, sitemaps, translation plugin boundaries, and multilingual WooCommerce checks.
- `references/locale-metadata-governance.md` for translated title/meta/social/product metadata review and approval states.
- `templates/multilingual-seo-qa-report.md` for multilingual output QA.
- `templates/translated-metadata-approval-pack.md` for translated metadata approval queues.
- `schemas/multilingual-page-set.schema.json`, `fixtures/sample-multilingual-page-set.json`, and `scripts/validate_multilingual_pack.py` for structured validation and regression checks.

This layer should remain separate from generic configuration and WooCommerce references because translation-plugin behaviour is a different evidence problem from Yoast configuration.

### Redirect and migration control layer

The redirect/migration layer is a focused delivery extension for rebuilds, domain changes, URL consolidation and Yoast Premium redirect-manager planning. It should remain separate from generic migration intake so normal configuration work does not load launch-control details.

Files:

- `references/redirect-migration-governance.md` - redirect implementation route, launch sequence, Yoast-specific controls and stop conditions.
- `references/redirect-map-decision-model.md` - row-level decision states, risk levels and required fields.
- `templates/redirect-map-review.md` - review output for redirect maps and old-to-new URL decisions.
- `templates/migration-launch-seo-control-plan.md` - launch readiness and post-launch monitoring control plan.
- `schemas/redirect-map-row.schema.json` and `fixtures/sample-redirect-map-row.json` - structured validation support.
- `scripts/validate_redirect_migration_pack.py` and `tests/redirect-migration-scenario-tests.md` - package quality and regression coverage.

## Related skill boundary

Keep `woocommerce-yoast-configuration` as the planning, evidence interpretation, reporting, decision and handoff skill. Keep live WordPress-connected inspection and approved edits in `woocommerce-yoast-auditor`. Use `references/related-skills-routing.md` as the boundary contract rather than duplicating live audit/edit workflows.

---

*This page brought to you by the 🦄 Magic Automation Unicorns of LightSpeedWP.*

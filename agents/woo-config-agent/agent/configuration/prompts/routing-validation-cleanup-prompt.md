# Routing and Validation Cleanup Prompt

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

Use this recurring prompt when you want a broader cleanup pass across the WooCommerce Configuration Agent's validation layer after routing changes, README updates, schema changes, or maintenance-workflow edits.

## Recommended prompt

```text
Run a broader consistency and cleanup pass across this WooCommerce Configuration Agent's attached validation layer.

Goals:
1. Tighten any remaining consistency drift around the current routing language.
2. Keep the agent WooCommerce-first.
3. Preserve the current attached local skill set and current folder structure as source of truth.
4. Improve maintenance clarity without inventing new files, folders, skills, or workflows.

Current routed local skills to preserve and validate against:
- woocommerce-site-discovery
- woocommerce-audit-orchestrator
- woocommerce-implementation-planner
- woocommerce-remediation-triage
- yoast-configuration
- yoast-auditor
- gravity-forms-configuration
- gravity-forms-auditor
- wordpress-accessibility-checker

Scope:
1. Review the current main instructions for routing language consistency.
2. Review validation-supporting files in:
   - `tests/`
   - `references/`
   - `schemas/`
   - `scripts/`
   - `prompts/`
3. Check whether any consistency-source files, QA checklists, scenario files, validation docs, schema descriptions, validator guidance, or saved prompt files still use stale route wording, outdated workflow boundaries, or generic wording that should now be more specific.
4. Focus especially on:
   - `tests/instruction-file-consistency-source.md`
   - `tests/app-usage-consistency-source.md`
   - `tests/starter-prompt-consistency-source.md`
   - `tests/short-description-consistency-source.md`
   - `tests/scenario-validation-workflows.md`
   - `tests/schema-validation-tests.md`
   - `tests/validation-readme.md`
   - `references/audit-docs-validation-workflow.md`
   - `references/CONNECTORS.md`
   - saved prompt files in `prompts/`
   - any README files in attached maintenance folders
5. Tighten wording where useful so the validation layer matches the current routing model:
   - Site discovery work routes to `woocommerce-site-discovery`
   - Formal WooCommerce audits and review outputs route to `woocommerce-audit-orchestrator`
   - Advisory implementation planning routes to `woocommerce-implementation-planner`
   - Remediation sequencing and prioritised fix planning route to `woocommerce-remediation-triage`
   - Yoast audit work routes to `yoast-auditor`
   - Yoast setup, configuration, troubleshooting, validation, or change-planning work routes to `yoast-configuration`
   - Gravity Forms audit work routes to `gravity-forms-auditor`
   - Gravity Forms setup, troubleshooting, validation, or change work routes to `gravity-forms-configuration`
   - Accessibility Checker evidence review, accessibility reporting, WCAG-oriented fix planning, and safe content-level accessibility remediation route to `wordpress-accessibility-checker`
6. Preserve the maintenance boundary:
   - internal file, README, schema, script, test, connector-guide, memory-structure, prompt-library, and instruction-routing maintenance stays on the maintenance workflow
   - normal delivery work should not be rewritten as generic documentation maintenance
7. Be conservative:
   - do not invent missing skills
   - do not invent unattached folders
   - do not broaden the agent into a generic WordPress router
   - do not rewrite unrelated output standards unless needed for consistency

Deliverables:
1. Audit summary
   - what consistency drift was found
   - which files need wording updates
   - whether any stale route wording remains
2. Implementation summary
   - exact files updated
   - exact route language tightened or clarified
3. Validation result
   - whether the attached validation layer now matches the current routing language
   - any remaining non-blocking follow-up items

Acceptance criteria:
- No stale shared-skill or generic route wording remains where a current attached local skill should be named.
- Validation-supporting files align with the current attached routing skills.
- Maintenance guidance still points internal upkeep to the maintenance workflow.
- The final wording reads as one coherent WooCommerce-first system.
```

## Use notes

- Treat the current attached file tree as canonical.
- Prefer replacing stale wording over layering duplicate notes.
- Keep the cleanup pass scoped to consistency and validation unless a new blocking issue is found.

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

# Validation Pack Tightening Prompt

Use this recurring prompt when you want to tighten the validation layer around the current instructions, routing language, attached folder structure, and maintenance guidance.

## Recommended prompt

```text
Tighten this WooCommerce Configuration Agent's validation pack around the current routing language, attached file structure, and maintenance guidance, then implement the changes directly.

Goals:
1. Reduce drift across instructions, references, tests, schemas, and validator guidance.
2. Keep the agent WooCommerce-first.
3. Use the current attached file tree and attached local skills as source of truth.
4. Improve validator clarity and coverage without inventing unsupported workflows.

Current routed local skills to preserve in validation wording:
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
1. Review validation-supporting files across:
   - `tests/`
   - `scripts/`
   - `schemas/`
   - `references/`
   - `prompts/`
2. Check whether scenario files, consistency-source files, validator documentation, schema descriptions, validator scripts, or saved prompt files still reflect stale route wording, outdated folder assumptions, or weak maintenance boundaries.
3. Focus especially on:
   - `tests/instruction-file-consistency-source.md`
   - `tests/app-usage-consistency-source.md`
   - `tests/starter-prompt-consistency-source.md`
   - `tests/short-description-consistency-source.md`
   - `tests/schema-validation-tests.md`
   - `tests/scenario-validation-workflows.md`
   - `tests/validation-readme.md`
   - `scripts/run-master-validation.sh`
   - focused validators in `scripts/validate-*.py`
   - `references/audit-docs-validation-workflow.md`
   - `references/CONNECTORS.md`
   - saved prompt files in `prompts/`
4. Tighten wording and validation expectations so they reflect the current routing model and current folder layout.
5. Preserve the maintenance boundary:
   - internal file, README, schema, script, test, connector-guide, prompt-library, memory-structure, and instruction-routing maintenance stays on the maintenance workflow
   - normal delivery work should not be rewritten as generic validation maintenance
6. Be conservative:
   - do not invent missing skills
   - do not invent unattached folders
   - do not broaden the agent into a generic WordPress or QA router
   - do not add fuzzy checks when a deterministic rule is practical

Deliverables:
1. Audit summary
   - what validation or consistency drift was found
   - which validation-supporting files need updates
2. Implementation summary
   - exact files updated
   - exact validation or wording changes made
3. Validation result
   - whether the validation pack now matches the current routing model and attached structure
   - any remaining non-blocking follow-up items

Acceptance criteria:
- Validation-supporting files align with the current attached routing skills.
- Validator documentation matches the current attached structure.
- Maintenance guidance still points internal upkeep to the maintenance workflow.
- The final validation layer reads as one coherent WooCommerce-first maintenance system.
```

## Use notes

- Treat the current attached file tree and local skills as canonical.
- Prefer deterministic consistency checks over speculative cleanup.
- Keep this pass focused on the validation layer unless a new blocking issue is discovered.

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

[📋 AI Governance](https://github.com/lightspeedwp/.github/blob/develop/docs/AUTOMATION.md) · [🧠 Agents](https://github.com/lightspeedwp/.github/blob/develop/AGENTS.md) · [📞 Contact](https://lightspeedwp.agency/contact)

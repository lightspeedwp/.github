# Prepackage checklist

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

Use this checklist before returning an updated `skill.zip`.

## Structure

- [ ] There is exactly one `SKILL.md`.
- [ ] `SKILL.md` frontmatter contains only `name` and `description`.
- [ ] The skill name is lowercase and hyphenated.
- [ ] `agents/openai.yaml` exists.
- [ ] No example placeholder files from scaffolding remain.
- [ ] No bulky temporary files, raw archives, cache folders or generated dumps are included.

## References

- [ ] Files referenced by `SKILL.md` exist.
- [ ] Files referenced by `references/README.md` exist.
- [ ] Core content model files remain under `references/content-model/core/`.
- [ ] Extension content model files remain under `references/content-model/extensions/`.
- [ ] Wetu remains under `references/content-model/integrations/` unless ownership evidence proves otherwise.
- [ ] Content model JSON files are not flattened directly under `references/`.

## Evidence safety

- [ ] Core post type claims are source-backed.
- [ ] Relationship/facet sources are not treated as proof of core ownership.
- [ ] Extension models keep `unknown` where source evidence is missing.
- [ ] JSON-LD is described as readiness/planning unless implementation evidence exists.
- [ ] Memory files contain templates or durable facts only, not secrets or raw tool dumps.

## Validation

- [ ] All JSON files parse successfully.
- [ ] `scripts/validate_payload.py` passes when file access is available.
- [ ] `scripts/validate_content_model.py` passes when file access is available.
- [ ] `scripts/validate_output_contracts.py` passes when file access is available.
- [ ] Skill validator or packaging script passes.
- [ ] Anti-drift prompts have been reviewed after major logic changes.

## Return rule

Return the complete updated package as `skill.zip`, not a partial patch.

## Additional model-boundary check

Before packaging, run:

```bash
python3 scripts/validate_content_model.py .
```

Confirm the output says core, extension and schema assumptions remain constrained.

## Additional output-template check

Before packaging, run:

```bash
python3 scripts/validate_output_contracts.py .
```

Confirm the output says markdown/output contracts passed.

---

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

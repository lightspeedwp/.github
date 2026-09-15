# Content File Validator

[![License: GPL v3 or later](https://img.shields.io/badge/License-GPL%20v3%20or%20later-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)

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

This combined skill validates Markdown quality, YAML frontmatter, and semantic versioning in one pass.

## What changed in the merge

### Preserved

- the frontmatter schema, schema-customisation guidance, examples, README pattern, and test-driven structure from the YAML frontmatter validator
- the Markdown document-quality workflow and delivery expectations from the Markdown formatting validator

### Merged

- frontmatter validation and Markdown structure validation into one main script: `scripts/validate_content_files.py`
- SemVer field checks and version-increment enforcement into the same consolidated report
- overlapping skill instructions into one source of truth in `SKILL.md`

### Removed as duplicate or unnecessary

- separate validator scripts for frontmatter-only validation, because the combined script now covers that workflow
- duplicate metadata-only skill packaging, because one combined skill now owns the validation job
- the empty `assets/` scaffold, because no reusable asset templates are needed for this validator

## Audit inventory summary

### markdown-formatting-validation

- `SKILL.md` — merged into the combined skill instructions
- `agents/openai.yaml` — merged into the combined skill metadata
- `scripts/` — none
- `references/` — none
- `assets/` — none
- schemas — none
- examples — none
- README files — none
- test files — none
- config files — none

### yaml-frontmatter-validator

- `SKILL.md` — merged and renamed into the combined skill instructions
- `agents/openai.yaml` — merged into the combined skill metadata
- `scripts/validate_frontmatter.py` — replaced by `scripts/validate_content_files.py`
- `references/frontmatter.schema.yaml` — preserved and adapted as the main schema
- `references/schema-customisation.md` — preserved and tightened
- `references/example-frontmatter.md` — replaced by consolidated report and test examples
- `README.md` — preserved as merge summary and usage guide
- `tests/` — preserved as the basis for the new test examples
- `requirements.txt` — no longer needed because the merged package depends on the same libraries already imported by the main script and can be installed from environment defaults if present

## Main command

```bash
python scripts/validate_content_files.py \
  --target files \
  --schema references/frontmatter.schema.yaml \
  --report content-validation-report.md \
  --enforce-version-increment \
  --base-ref main
```

---

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

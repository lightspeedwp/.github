# File Manifest

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
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

## Folder-by-folder decision table

| Path | Status | Decision |
|---|---|---|
| Top-level markdown files | Required | Entry points and primary agent artefacts. |
| `business-context.md` | Recommended | Keeps stable LightSpeed operating context out of memory files. |
| `references/` | Required | Holds supporting guidance instead of bloating the system prompt. |
| `templates/` | Required | Provides reusable output shapes. |
| `schemas/` | Required | Defines structured output expectations. |
| `memory/` | Required | Provides durable memory model for the generated agent. |
| `validation/` | Required | Documents validation rules and expected maps. |
| `scripts/` | Recommended | Runs deterministic checks where drift risk is high. |
| `tests/` | Recommended | Describes scenario-based validation workflows. |
| `fixtures/` | Recommended | Supplies test inputs for validation scenarios. |
| `examples/` | Recommended | Shows how the pack should behave in realistic usage. |
| `rollout/` | Recommended | Provides adoption and review gates. |
| `assets/` | Optional | Included with README only; no real reusable binary assets are needed yet. |

## Exact reference file plan

| File | Required? | Purpose | Phase | Validator | Drift prevented |
|---|---|---|---|---|---|
| `references/lightspeed-team-skill-routing.md` | Required | Shared skill routing and overlap rules | Phase 0 | `validate-links-and-references.py` | Overusing Agent Creator instead of specialist skills |
| `references/team-consumability-checklist.md` | Required | Review checks before handoff to LightSpeed team | Phase 5 | `validate-markdown-structure.py` | Hard-to-review agent packs |
| `references/agent-folder-structure-guide.md` | Required | Folder rules and mappings | Phase 0-5 | `validate-markdown-structure.py` | Folder sprawl and inconsistent pack layouts |
| `references/agent-memory-pack-guide.md` | Required | Durable memory pack rules | Phase 3 | `validate-memory-hygiene.py` | Bad memory and hidden commitments |
| `references/agent-validation-pack-guide.md` | Required | Validator design and coverage rules | Phase 4 | `validate-links-and-references.py` | Untested or unclear validators |
| `references/source-priority-guide.md` | Required | Source precedence and freshness rules | Phase 0-5 | `validate-source-priority-consistency.py` | Inconsistent source precedence |
| `references/routing-boundaries-guide.md` | Required | What Agent Creator should and should not own | Phase 0 | `validate-links-and-references.py` | Specialist skill duplication |
| `references/starter-prompt-guide.md` | Required | Builder prompt and starter prompt patterns | Phase 5 | `validate-starter-prompts.py` | Oversized prompts and missing human-review gates |
| `references/agent-requirements-template.md` | Required | Requirements document template | Phase 1 | `validate-template-schema-alignment.py` | Missing requirements sections |
| `references/agent-system-prompt-template.md` | Required | System prompt template | Phase 1 | `validate-template-schema-alignment.py` | Prompt drift and unsafe tool rules |
| `references/tool-permission-matrix-template.md` | Required | Permission and approval template | Phase 1 | `validate-template-schema-alignment.py` | Unclear write boundaries |
| `references/output-template-library.md` | Required | Reusable output template patterns | Phase 2 | `validate-template-schema-alignment.py` | Outputs that cannot satisfy schemas |
| `references/skill-package-template.md` | Required | Skill-adjacent package structure | Phase 0-2 | `validate-links-and-references.py` | Confusing agent packs with installable skills |
| `references/quality-checklist.md` | Required | Acceptance rubric | Phase 1-5 | `validate-markdown-structure.py` | Incomplete review criteria |
| `references/example-agent-pack-index.md` | Required | Example pack index and expected artefacts | Phase 5 | `validate-links-and-references.py` | Inconsistent examples |
| `references/agent-creator-skill-md-update.md` | Recommended | Concrete SKILL.md update notes for reviewers | Phase 5 | `validate-links-and-references.py` | Forgetting to update the live skill entrypoint |

## Required top-level files

```text
README.md
AGENT_BUILDER_SPEC.md
PHASED_BUILD_PLAN.md
AGENT_REQUIREMENTS.md
AGENT_SYSTEM_PROMPT.md
TOOL_AND_PERMISSION_MATRIX.md
ROUTING_AND_HANDOFF.md
OUTPUT_TEMPLATES.md
QUALITY_CHECKLIST.md
FILE_MANIFEST.md
BUILDER_IMPORT_PROMPT.md
business-context.md
```

## Required folders

```text
references/
templates/
schemas/
memory/
validation/
scripts/
tests/
fixtures/
examples/
rollout/
assets/
```

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

*Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!*

_Docs signed by 🤖 Copilot for LightSpeedWP – always fresh!_

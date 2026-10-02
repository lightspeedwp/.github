# Quality Gates

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](https://img.shields.io/badge/Docs%20Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](https://img.shields.io/badge/Labeling%20Governance-OK-success.svg)
![Main Branch Guard](https://img.shields.io/badge/Main%20Branch%20Guard-OK-success.svg)
![Metadata Governance](https://img.shields.io/badge/Metadata%20Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](https://img.shields.io/badge/Template%20Enforcement-OK-success.svg)
![Validate PR Template](https://img.shields.io/badge/Validate%20PR%20Template-OK-success.svg)
![Badges: Documentation Update](https://img.shields.io/badge/Badges:%20Documentation%20Update-OK-success.svg)
![Badges: Health Check](https://img.shields.io/badge/Badges:%20Health%20Check-OK-success.svg)
![Badges: README Status Maintenance](https://img.shields.io/badge/Badges:%20README%20Status%20Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](https://img.shields.io/badge/Badges:%20Workflow%20Inventory%20Audit-OK-success.svg)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![labeling-unified](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/labeling-unified.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
[![workflow-lint](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/workflow-lint.yml)
<!-- BADGES-END -->

Use this reference before packaging an updated skill, agent instruction bundle, or reusable workflow.

## Gate order

1. **Scope gate**: confirm the update is within the approved local package scope.
2. **Structure gate**: check required files, linked references, scripts, and metadata.
3. **Instruction gate**: check trigger clarity, routing boundaries, approval rules, and output contract.
4. **Safety gate**: check tool, connector, memory, publication, and external-action boundaries.
5. **Evaluation gate**: run scenario checks, script smoke tests, and archive validation where relevant.
6. **Packaging gate**: validate and package the complete skill, then inspect the archive for accidental files.

## Pre-package checklist

| Check | Pass condition |
|---|---|
| `SKILL.md` exists | Required entrypoint is present. |
| Frontmatter is minimal | Only `name` and `description`; both are useful for triggering. |
| `SKILL.md` remains compact | Prefer under 500 lines; move detail into references. |
| References are directly linked | Every required reference is reachable from `SKILL.md`. |
| Scripts are documented | Every script has usage guidance and has been smoke-tested. |
| Proposal records are valid | Machine-readable proposals pass `scripts/validate_mutation_proposals.py` when used. |
| No accidental files | No `__pycache__`, `.pyc`, `.DS_Store`, temp files, or raw scratch data inside the package. |
| Approval levels remain clear | Proposal, local package, connected edit, publication, and permission changes are distinct. |
| Changelog is updated | Include value, evaluation, risk, approval level, and rollback. |
| Size is safe | Final ZIP is below 25 MB. |

## Suggested local commands

Run the quality script before the packaging validator:

```bash
python scripts/check_skill_quality.py --skill-dir . --strict
```

Then run the standard skill packager from outside the skill folder:

```bash
python /home/oai/skills/skill-creator/scripts/package_skill.py self-evolving-agent dist
```

## Report format

```markdown
## Quality gate report

- Structure: passed / partial / failed
- Instruction quality: passed / partial / failed
- Safety boundaries: passed / partial / failed
- Script checks: passed / partial / failed
- Packaging: passed / partial / failed

Not tested:
- [item and reason]

Rollback:
- [restore package/version/path]
```

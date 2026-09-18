# Bare Label Fixer Agent

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
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![branch-name-validation](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-name-validation.yml)
[![branch-validation-metrics-aggregator](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-validation-metrics-aggregator.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-template-routing](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-template-routing.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
[![validate-specifications](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/validate-specifications.yml)
<!-- BADGES-END -->

Systematically audits and fixes issues/PRs with bare (non-canonical) labels across the repository.

## Problem

The repository uses a canonical labeling system with required family prefixes:
- `type:*` for issue classification
- `status:*` for workflow state  
- `priority:*` for urgency
- `area:*` for domain/component
- `meta:*` for automation markers

Many older issues still have bare labels (e.g., `bug`, `feature`, `documentation`) that lack the required prefix and break label governance validation.

## Solution

This agent:
1. **Audits** the repository for issues with bare labels
2. **Maps** bare labels to proper prefixed equivalents
3. **Removes** bare labels  
4. **Adds** proper prefixed labels
5. **Generates** detailed reports for verification

## Usage

### Dry Run (Recommended First Step)

```bash
GITHUB_TOKEN=$GITHUB_TOKEN node scripts/agents/includes/bare-label-fixer.js
```

This shows what changes would be made without applying them.

### Target Specific Issue Range

```bash
GITHUB_TOKEN=$GITHUB_TOKEN ISSUE_RANGE="1500-1600" node scripts/agents/includes/bare-label-fixer.js
```

Limits scanning to issues #1500-#1600 (useful for Phase 2 of label-prefix-enforcement project).

### Apply Changes (Live Mode)

```bash
GITHUB_TOKEN=$GITHUB_TOKEN node scripts/agents/includes/bare-label-fixer.js --no-dry-run
```

**Warning**: This modifies labels on live issues. Always do a dry run first.

### Custom Repository

```bash
GITHUB_TOKEN=$GITHUB_TOKEN node scripts/agents/includes/bare-label-fixer.js --owner <org> --repo <name>
```

## Label Mapping

### High Confidence (Auto-Fixed)

| Bare Label | Proper Prefixed Form | Notes |
|---|---|---|
| `automation` | `type:automation` | Well-established type |
| `bug` | `type:bug` | Well-established type |
| `feature` | `type:feature` | Well-established type |
| `refactor` | `type:refactor` | Well-established type |
| `maintenance` | `type:maintenance` | Well-established type |
| `epic` | `type:epic` | Well-established type |
| `documentation` | `type:documentation` | Well-established type |
| `testing` | `type:test` | Established test type |
| `javascript` | `lang:javascript` | Language label |
| `infrastructure` | `area:infrastructure` | Area label |
| `ci` | `area:ci` | CI/build area |
| `workflows` | `area:automation` | Automation area |
| `agent-audit` | `type:audit` | Audit type |
| `governance` | `type:documentation` | Documentation |
| `standards` | `type:documentation` | Documentation |
| `cleanup` | `type:chore` | Chore type |

### Manual Review Required

These labels require decisions before removal:

| Bare Label | Notes | Recommendation |
|---|---|---|
| `migration` | Unclear if `type:migration` or custom | Create `type:migration` if pattern is common, else remove |
| `phase-2` | Custom phase label | Convert to `meta:phase-2` or remove |
| `phase-3-polish` | Custom phase label | Convert to `meta:phase-3` or remove |
| `wceu-2026` | Event label | Convert to `meta:event-wceu-2026` or remove |
| `critical-path` | Custom priority marker | Convert to `priority:critical` or remove |
| `glossary` | Custom content type | Remove or map to `type:documentation` |
| `templates` | Context-dependent | Remove or map to `type:documentation` |
| `coderabbit` | Tooling-specific | Remove (CodeRabbit integration handled separately) |

## Output

### Console Output

Shows real-time progress with:
- ✅ Successful label removals/additions
- ❌ Failed operations
- 📊 Summary statistics

### Report File

Saved to `.github/reports/bare-label-fixes/report-<timestamp>.json` containing:
- Full audit results
- Each issue's changes
- Success/failure counts
- Timestamp and scope metadata

## Integration with CI/CD

### Suggested Workflow Steps

1. **Audit Phase** (Dry Run)
   ```yaml
   - name: Audit bare labels
     run: GITHUB_TOKEN=${{ secrets.GITHUB_TOKEN }} node scripts/agents/includes/bare-label-fixer.js
   ```

2. **Apply Fixes** (Live, with approval gate)
   ```yaml
   - name: Fix bare labels
     if: github.event_name == 'workflow_dispatch'
     run: GITHUB_TOKEN=${{ secrets.GITHUB_TOKEN }} node scripts/agents/includes/bare-label-fixer.js --no-dry-run
   ```

3. **Report** (Always)
   ```yaml
   - name: Upload report
     uses: actions/upload-artifact@v7
     with:
       name: bare-label-fixes-report
       path: .github/reports/bare-label-fixes/
   ```

## Related Files

- `.github/labels.yml` - Canonical label taxonomy (source of truth)
- `.github/scripts/validation/validate-labels-before-creation.cjs` - Pre-creation validation
- `.github/AGENTS.md` - Label creation governance rules
- `.github/CLAUDE.md` - Label prefix requirements

## Contributing

When modifying the mapping:
1. Verify the new label exists in `.github/labels.yml`
2. Test with `--dry-run` first
3. Document rationale for any mapping changes
4. Run against full repository to catch edge cases

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

_Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team_
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

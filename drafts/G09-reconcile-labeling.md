---
name: "🤖 Automation"
about: "Propose, fix, or improve automation (actions, scripts, bots)."
title: "[Workflows/Docs] Reconcile labeling docs vs `labels.yml`/`labeler.yml`"
labels: [type:automation, status:needs-triage, priority:normal, area:automation, area:workflows, labeling]
assignees: []
projects: []
milestone: ''
type: automation
references:
  - ../CONTRIBUTING.md
  - .github/BRANCHING_STRATEGY.md
  - .github/AUTOMATION_GOVERNANCE.md
  - .github/automation/labels.yml
  - .github/automation/labeler.yml
---

## Automation Summary

Plain-English documentation describing the labeling system does not accurately match the actual rules defined in `labels.yml` and `labeler.yml`, leading to mislabelled issues, poor triage signals, and contributor confusion.

**Purpose:** Synchronise labeling documentation with actual YAML configuration files, add practical examples, and define test routes to verify automation behaviour.

**Scope:**
- Review and reconcile `labels.yml` (label definitions)
- Review and reconcile `labeler.yml` (auto-labeling rules)
- Update documentation to match actual behaviour
- Add examples for common labeling scenarios
- Create test issues/PRs to validate automation

**Outcome:** Accurate, trustworthy documentation that matches real automation behaviour, reducing mislabelling and improving triage quality.

## Steps / Checklist

- [ ] Audit `labels.yml` for all defined labels
- [ ] Audit `labeler.yml` for all auto-labeling rules
- [ ] Compare current documentation against actual YAML configs
- [ ] Identify discrepancies and outdated references
- [ ] Update labeling documentation to match actual rules
- [ ] Add practical examples for each label category
- [ ] Document test routes (file paths that trigger specific labels)
- [ ] Create test issues/PRs to verify labeling automation
- [ ] Remove references to non-existent rules or labels
- [ ] Add troubleshooting section for common labeling issues
- [ ] Documentation/changelog updated
- [ ] PR uses correct branch prefix (`automation/reconcile-labeling`)
- [ ] Approved by at least one maintainer

## Acceptance Criteria

- [ ] Documentation accurately reflects all rules in `labels.yml`
- [ ] Documentation accurately reflects all rules in `labeler.yml`
- [ ] Examples provided for common labeling scenarios:
  - Area labels (area:docs, area:workflows, area:security, etc.)
  - Type labels (type:bug, type:feature, type:task, etc.)
  - Priority labels (priority:critical, priority:high, priority:normal, etc.)
  - Status labels (status:needs-triage, status:in-progress, etc.)
- [ ] Test routes documented (which file paths trigger which labels)
- [ ] Test issues/PRs created and verified to hit expected labels
- [ ] No references to non-existent rules or labels
- [ ] Troubleshooting section added for label mismatches
- [ ] Cross-references between docs and YAML files
- [ ] Automation implemented and tested
- [ ] Documentation updated
- [ ] No regressions or negative impact

## Additional Context

**Files to review and reconcile:**
- `.github/automation/labels.yml` - Label definitions
- `.github/automation/labeler.yml` - Auto-labeling rules
- `docs/LABELING.md` or similar - Plain-English documentation
- `AUTOMATION_GOVERNANCE.md` - Governance and workflow docs
- `CONTRIBUTING.md` - Contributor guidelines mentioning labels

**Common discrepancies to check:**
- Labels documented but not defined in `labels.yml`
- Auto-labeling rules not explained in documentation
- Outdated label names or colours
- Missing examples of label usage
- Incorrect file path patterns in documentation

**Example documentation section to add:**
```markdown
## Label Categories

### Area Labels

Area labels indicate which part of the codebase or project is affected.

**Defined labels:**
- `area:docs` - Documentation changes (triggered by `docs/**/*`, `*.md`)
- `area:workflows` - Workflow and automation (triggered by `.github/**/*`)
- `area:security` - Security-related (manual or triggered by `security/` paths)

**Example:**
A PR modifying `docs/CONTRIBUTING.md` will automatically receive `area:docs`.

**Test route:**
Create PR with changes to any `.md` file to verify `area:docs` is applied.

### Type Labels

[similar structure]
```

**Testing approach:**
1. Create test issue with specific content patterns
2. Create test PR with specific file changes
3. Verify expected labels are automatically applied
4. Document which patterns trigger which labels
5. Include test results in PR

**Example test scenarios:**
| Test Case | File Changed | Expected Labels |
|-----------|--------------|-----------------|
| Doc update | `docs/README.md` | `area:docs`, `type:documentation` |
| Workflow fix | `.github/workflows/ci.yml` | `area:workflows`, `type:automation` |
| Security patch | `security/README.md` | `area:security`, `type:security` |

**Telemetry (post-merge):**
- Track % of correctly auto-labelled issues over 2 weeks (baseline → target)
- Monitor manual relabeling frequency (should decrease)
- Survey contributors on labeling clarity

**Tools:**
- YAML linter to validate config files
- GitHub API to test labeling automation
- Documentation diff to show before/after accuracy

## References

- [.github/automation/](https://github.com/lightspeedwp/.github/tree/develop/.github/automation)
- [labels.yml](https://github.com/lightspeedwp/.github/blob/develop/.github/automation/labels.yml)
- [labeler.yml](https://github.com/lightspeedwp/.github/blob/develop/.github/automation/labeler.yml)
- [AUTOMATION_GOVERNANCE.md](https://github.com/lightspeedwp/.github/blob/develop/AUTOMATION_GOVERNANCE.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [Branching Strategy](.github/BRANCHING_STRATEGY.md)
- [PR Labels](.github/PR_LABELS.md)

---

### Definition of Ready (DoR)
- [ ] Automation goal/scope defined
- [ ] Checklist prepared
- [ ] Estimate added: **Medium** (2-4 hours: audit, reconcile, examples, tests)
- [ ] Access to test issue/PR creation

### Definition of Done (DoD)
- [ ] All checklist and acceptance criteria completed
- [ ] Documentation matches YAML configs exactly
- [ ] Examples and test routes documented
- [ ] Test issues/PRs verify automation
- [ ] Documentation/changelog updated
- [ ] Approved by maintainer
- [ ] Labeling accuracy demonstrably improved

---

## Directions & Next Steps

1. Create feature branch: `automation/reconcile-labeling`
2. Audit `labels.yml` and `labeler.yml` for current state
3. Review existing labeling documentation for discrepancies
4. Update documentation to match actual rules
5. Add practical examples for each label category
6. Document test routes (file patterns → labels)
7. Create test issues and PRs to verify automation
8. Add troubleshooting section to documentation
9. Update CHANGELOG.md
10. Submit PR with reference: `fixes #<issue_number>`
11. Tag @workflows-team or maintainer for review

**Branch prefix:** `automation/`

**Validation steps:**
```bash
# Lint YAML files
yamllint .github/automation/*.yml

# Extract all label definitions
grep "^  - name:" .github/automation/labels.yml

# Extract all labeling rules
grep "^  -" .github/automation/labeler.yml
```

See [Contribution Guidelines](../CONTRIBUTING.md) and [Automation Governance](../AUTOMATION_GOVERNANCE.md).

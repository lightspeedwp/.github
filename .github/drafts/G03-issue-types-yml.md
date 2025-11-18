---
name: "🤖 Automation"
about: "Propose, fix, or improve automation (actions, scripts, bots)."
title: "[Workflows/Docs] Create `/.github/automation/issue-types.yml` or remove all references"
labels: [type:automation, status:needs-triage, priority:normal, area:automation, area:workflows, labeling, version:v0.2.0]
assignees: []
projects: []
milestone: 'v0.2.0'
file_type: automation
references:
  - ../CONTRIBUTING.md
  - .github/BRANCHING_STRATEGY.md
  - .github/AUTOMATION_GOVERNANCE.md
  - .github/automation/
  - ../DOCS.md
---

## Automation Summary

Documentation references an Issue Types mapping file (`/.github/automation/issue-types.yml`) that does not currently exist in the repository. This creates confusion about issue labeling and triage behaviour, leading to inconsistent expectations and unclear workflows.

**Purpose:** Clarify the issue typing approach by either:

1. **Creating the file** with a proper schema, examples, and integration with labeling workflows, OR
2. **Removing all references** and documenting the actual issue typing behaviour

**Scope:** Affects issue triage, labeling automation, and contributor understanding of workflow patterns.

**Outcome:** Clear, accurate documentation of issue typing behaviour with no references to non-existent files.

## Steps / Checklist

**Option A: Create the file**

- [ ] Define schema for `issue-types.yml` (type mappings, labels, routing rules)
- [ ] Create `/.github/automation/issue-types.yml` with documented structure
- [ ] Add examples for each issue type (bug, feature, documentation, etc.)
- [ ] Integrate with existing labeling workflows
- [ ] Update labeling docs to describe issue-types behaviour
- [ ] Test with sample issues to verify automation
- [ ] Document usage in AUTOMATION_GOVERNANCE.md

**Option B: Remove references**

- [ ] Scan repository for all references to `issue-types.yml`
- [ ] Remove or update references in all documentation
- [ ] Clarify actual issue typing approach in labeling docs
- [ ] Update AUTOMATION_GOVERNANCE.md to reflect current state
- [ ] Document how issue typing currently works (templates, labels, manual triage)

**Both options:**

- [ ] Update CHANGELOG.md
- [ ] Documentation/changelog updated
- [ ] PR uses correct branch prefix (`automation/` or `docs/`)
- [ ] Approved by at least one maintainer

## Acceptance Criteria

- [ ] **Either** `/.github/automation/issue-types.yml` exists with schema and examples **OR** all references removed from documentation
- [ ] Labeling documentation accurately describes actual issue typing behaviour
- [ ] No references to non-existent files remain
- [ ] AUTOMATION_GOVERNANCE.md reflects current approach
- [ ] Schema documented if file is created
- [ ] Examples provided for each supported issue type
- [ ] Integration with labeling workflows tested (if created)
- [ ] Confusion and inconsistent expectations eliminated
- [ ] Documentation updated
- [ ] No regressions or negative impact on existing automation

## Additional Context

**Current confusion:**

- Docs mention issue-types.yml but file doesn't exist
- Contributors expect automated issue typing that may not be configured
- Unclear how issue types map to labels and workflows
- Triage teams have inconsistent understanding of automation

**Recommended approach:**
Recommend **Option A (create the file)** if:

- Team wants automated issue typing and routing
- Labeling rules are complex enough to warrant separate config
- Issue templates alone don't provide sufficient classification

Recommend **Option B (remove references)** if:

- Current template-based approach is sufficient
- No immediate need for additional automation
- Prefer simpler, more maintainable approach

**Example schema (if creating file):**

```yaml
# issue-types.yml
version: '1.0'
issue_types:
  bug:
    labels: [type:bug, status:needs-triage]
    priority: high

  feature:
    labels: [type:feature, status:needs-triage]
    priority: normal

  documentation:
    labels: [type:documentation, status:needs-triage]
    priority: normal
```

**Files likely affected:**

- AUTOMATION_GOVERNANCE.md
- DOCS.md
- labeling documentation
- Issue template references

**Telemetry (post-merge):**

- Track % of new issues correctly auto-typed vs manual typing during first 2 weeks
- Monitor labeling accuracy before/after implementation
- Measure triage time reduction (if implementing automation)

## References

- [.github/automation/](https://github.com/lightspeedwp/.github/tree/develop/.github/automation)
- [DOCS.md](https://github.com/lightspeedwp/.github/blob/develop/DOCS.md)
- [AUTOMATION_GOVERNANCE.md](https://github.com/lightspeedwp/.github/blob/develop/AUTOMATION_GOVERNANCE.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [Branching Strategy](.github/BRANCHING_STRATEGY.md)
- [PR Labels](.github/PR_LABELS.md)
- [Labeler Config](.github/labeler.yml)
- [Labels](.github/labels.yml)

---

### Definition of Ready (DoR)

- [ ] Automation goal/scope defined (create file OR remove references)
- [ ] Checklist prepared for chosen option
- [ ] Estimate added: **Medium** (2-4 hours depending on option)
- [ ] Decision made: Option A or Option B
- [ ] Stakeholder input gathered if needed

### Definition of Done (DoD)

- [ ] All checklist and acceptance criteria completed
- [ ] Documentation/changelog updated
- [ ] Approved by maintainer
- [ ] No broken references or confusion remains
- [ ] If file created: schema validated and automation tested
- [ ] If references removed: alternative approach documented

---

## Directions & Next Steps

1. **Decide:** Consult with maintainers/workflows team to choose Option A or B
2. Create feature branch: `automation/issue-types` or `docs/remove-issue-types-refs`
3. Execute chosen option's checklist
4. Test changes (automation if Option A, doc accuracy if Option B)
5. Update CHANGELOG.md
6. Submit PR with reference: `fixes #<issue_number>`
7. Tag @workflows-team or maintainer for review

**Branch prefix:**

- `automation/` if creating file
- `docs/` if removing references

See [Contribution Guidelines](../CONTRIBUTING.md) and [Automation Governance](../AUTOMATION_GOVERNANCE.md).

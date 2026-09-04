---
title: "Issues Agent Template Updates & Improvements"
date: 2026-09-04
status: in-progress
priority: critical
---

# Issues Agent Template Updates — Comprehensive Improvement Plan

## Executive Summary

Analysis of 100 open issues with `status:needs-more-info` label reveals critical gaps in issue structure and completeness. **91% of issues lack Definition of Ready (DoR), 73% lack Success Criteria, and 71% lack clear ownership.** This plan addresses these gaps through enhanced templates, validation rules, and automated enrichment.

---

## Problem Statement

### Current State Issues

| Issue | Count | Impact |
|-------|-------|--------|
| Missing Definition of Ready (DoR) | 91 | ⚠️ CRITICAL — Tasks unclear on prerequisites and readiness conditions |
| Missing Success Criteria/DoD | 73 | ⚠️ CRITICAL — Unclear how to validate completion |
| Missing Owner/Assignee | 71 | ⚠️ CRITICAL — No clear accountability |
| Missing Acceptance Criteria | 45 | ⚠️ MAJOR — Vague requirements |
| Missing Technical Details | 43 | ⚠️ MAJOR — Unclear implementation approach |

### Root Causes

1. **Template Design**: Current issue templates don't enforce required sections
2. **Validation Gaps**: No workflow validation to prevent incomplete issues
3. **Enrichment Gaps**: Manual processes can't scale to 100+ issues
4. **Consistency**: Different issue types interpreted inconsistently

### Business Impact

- **Development Delays**: Developers can't start work without clarity
- **Scope Creep**: Missing acceptance criteria lead to misalignment
- **Quality Risk**: Without clear DoD, completion validation is subjective
- **Resource Waste**: Time spent clarifying issues instead of solving them

---

## Solution Design

### Phase 1: Enhanced Issue Templates (Immediate)

#### 1.1 Update All Issue Templates

**Objective**: Enforce DoR, DoD, Acceptance Criteria, and Owner fields

**Changes to Apply to Each Template** (`/home/user/.github/.github/ISSUE_TEMPLATE/*.md`):

```yaml
# Template Structure (enforced across all types)
---
name: "[Issue Type] {title}"
about: "{description}"
title: "[prefix]: {scope}"
labels: ["type:{type}", "status:needs-triage", "priority:normal"]
body:
  - type: markdown
    attributes:
      value: "## Problem Statement"
  - type: textarea
    attributes:
      label: "What's the problem?"
      required: true
  - type: markdown
    attributes:
      value: "## Definition of Ready (DoR)"
  - type: checkboxes
    attributes:
      label: "This issue is ready when:"
      options:
        - label: "Prerequisites identified and listed"
          required: true
        - label: "Blockers mapped"
          required: true
        - label: "Owner/accountable person assigned"
          required: true
  - type: textarea
    attributes:
      label: "Owner"
      description: "Who is responsible for this?"
      required: true
  - type: markdown
    attributes:
      value: "## Acceptance Criteria"
  - type: textarea
    attributes:
      label: "Acceptance Criteria"
      description: "How will we know this is done?"
      required: true
  - type: markdown
    attributes:
      value: "## Definition of Done (DoD)"
  - type: checkboxes
    attributes:
      label: "Completed when:"
      options:
        - label: "All acceptance criteria met"
          required: true
        - label: "Code reviewed and approved"
          required: true
        - label: "Tests passing"
          required: true
```

**Templates to Update**:
- `01-task.md` — Add owner, DoR/DoD checkboxes
- `02-bug.md` — Enhance to require reproduction + fix criteria
- `03-feature.md` — Add acceptance criteria + success metrics
- `04-design.md` — Add stakeholder sign-off, success criteria
- `05-epic.md` — Add phase breakdown, team assignments
- `06-story.md` → `06-question.md` — Clarify for Q&A format
- `07-improvement.md` — Add business case + success metrics
- `08-chore.md` (new) — Add scope + completion criteria
- [All remaining 17 types] — Consistent DoR/DoD structure

**Implementation**: 
- Update each template file to enforce required fields
- Add `required: true` to critical sections
- Ensure all labels match `.github/labels.yml` canonical set

### Phase 2: Validation & Enrichment Scripts (Short-term)

#### 2.1 Update `add-issue-template-sections.js`

**Enhancements**:
```javascript
// New capabilities needed:
- Detect missing sections: DoR, DoD, Acceptance Criteria, Owner
- Validate section format matches template structure
- Add sections intelligently based on issue type
- Preserve existing content, append missing sections
- Remove `status:needs-more-info` label on success
- Add `status:ready-for-development` when all sections present
```

**New Options**:
```bash
node add-issue-template-sections.js --dry-run [--limit=N]
node add-issue-template-sections.js --auto --confidence=0.9
node add-issue-template-sections.js --interactive
node add-issue-template-sections.js --label=type:bug --start-from=100
```

#### 2.2 Create `validate-issue-completeness.js`

**Purpose**: Audit and validate issue completeness across all open issues

**Features**:
- Scan all issues for required sections
- Generate completeness score (0-100%)
- Identify specific gaps per issue
- Suggest fixes per issue type
- Generate CSV report of gaps

**Output**:
```json
{
  "issue": 2833,
  "title": "Phase 4: Enhancement Implementation",
  "type": "type:epic",
  "completeness": 45,
  "gaps": [
    "Definition of Ready",
    "Success Criteria",
    "Owner",
    "Acceptance Criteria"
  ],
  "suggestions": [
    "Add prerequisites list to DoR",
    "Define phase milestones as success criteria",
    "Assign epic owner/sponsor"
  ]
}
```

#### 2.3 Create `bulk-enrich-issues.js`

**Purpose**: Bulk-add missing sections to issues intelligently

**Workflow**:
1. Fetch issues with `status:needs-more-info`
2. Analyze each issue type
3. Generate suggested DoR/DoD sections
4. Apply with confidence threshold
5. Remove `status:needs-more-info`, add `status:ready-for-development`
6. Generate audit trail

**Modes**:
- `--dry-run` — Preview changes
- `--interactive` — Prompt per issue
- `--auto` — Apply all with confidence >0.85

### Phase 3: Workflow Automation (Medium-term)

#### 3.1 Update Issue Management Workflow

**Trigger**: `issue.opened` or `issue.edited`

**New Steps**:
```yaml
- name: Validate Issue Completeness
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Check required sections
      run: node scripts/automation/validate-issue-completeness.js
    - name: Comment if incomplete
      if: failure()
      uses: actions/github-script@v7
      with:
        script: |
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            body: '❌ Issue incomplete. Missing:\n' + missingFields.join('\n')
          })
    - name: Apply needs-more-info label
      if: failure()
      run: gh issue edit ${{ github.event.issue.number }} --add-label status:needs-more-info
```

#### 3.2 Scheduled Enrichment Job

**Trigger**: Every Monday 9 AM UTC

**Actions**:
1. Fetch all issues with `status:needs-more-info`
2. Analyze each for missing sections
3. Apply enrichment with high confidence (>0.9)
4. Generate weekly report
5. Comment on issues that were auto-enriched

### Phase 4: Improved Issues Agent

#### 4.1 Enhance `agents/issues.agent.md`

**New Capabilities**:
```markdown
## Enhanced Type Assignment
- Analyze issue body for DoR/DoD sections
- Suggest missing sections in triage comment
- Recommend template-based enrichment

## Enrichment Recommendations
- Suggest Definition of Ready checklist
- Suggest acceptance criteria format
- Suggest testing strategy
- Recommend owner candidates based on area label

## Validation
- Check section presence and format
- Verify labels match canonical set
- Ensure acceptance criteria is testable
- Validate DoR prerequisites are realistic
```

#### 4.2 Add to `agents/issues.agent.md`:

- "DoR/DoD Enrichment" mode — add missing sections
- "Template Compliance Check" — validate issue structure
- "Acceptance Criteria Validator" — ensure SMART criteria
- Integration with enrichment scripts

---

## Implementation Roadmap

### Week 1: Foundation (Sept 4-10)
- [ ] Update all 25 issue templates with enforced DoR/DoD/Owner fields
- [ ] Enhance `add-issue-template-sections.js` script
- [ ] Create validation script
- [ ] Commit to `claude/issues-agent-template-updates-hslov7` branch

### Week 2: Automation (Sept 11-17)
- [ ] Create bulk enrichment script
- [ ] Update workflow validation jobs
- [ ] Test on subset of issues (10 issues)
- [ ] Generate audit reports

### Week 3: Refinement (Sept 18-24)
- [ ] Apply to all 100 issues with `status:needs-more-info`
- [ ] Monitor for accuracy
- [ ] Adjust templates based on results
- [ ] Train team on new structure

### Week 4: Integration (Sept 25-30)
- [ ] Update issues agent documentation
- [ ] Schedule recurring enrichment jobs
- [ ] Implement workflow validation
- [ ] Release to production

---

## Success Metrics

### Quantitative (Post-Implementation)

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| Issues with DoR | 9% | 95% | 2 weeks |
| Issues with DoD | 27% | 95% | 2 weeks |
| Issues with Owner | 29% | 95% | 1 week |
| Issues with Acceptance Criteria | 55% | 90% | 2 weeks |
| Completeness Score (avg) | 32% | 85% | 3 weeks |

### Qualitative

- Developer confidence in issue clarity (survey post-implementation)
- Reduction in "clarification" comments per issue
- Faster time-to-first-commit per issue
- Fewer scope disputes and rework

---

## Technical Dependencies

### Required Files to Update

1. **Templates** (25 files in `.github/ISSUE_TEMPLATE/`)
   - Update frontmatter with required fields
   - Add GitHub Web Form body sections (YAML format)
   - Ensure all have DoR and DoD sections

2. **Scripts** (in `scripts/automation/`)
   - `add-issue-template-sections.js` — enhance
   - `validate-issue-completeness.js` — create new
   - `bulk-enrich-issues.js` — create new
   - `handlers/handle-needs-template-fix.js` — update

3. **Agents** (in `agents/`)
   - `agents/issues.agent.md` — document enhancements
   - Update example workflows

4. **Workflows** (in `.github/workflows/`)
   - `issue-management-orchestration.yml` — add validation step
   - New: `issue-validation.yml` — scheduled enrichment

5. **Config** (in `.github/`)
   - `labels.yml` — verify status labels exist
   - `.github/labeler.yml` — update labeling rules

### Environment Requirements

- Node.js 18+
- `GITHUB_TOKEN` with issue read/write permission
- Optional: `ANTHROPIC_API_KEY` for AI enrichment (fallback: local analysis)

---

## Risk Mitigation

### Risk 1: Over-enrichment (False Positives)

**Mitigation**:
- Use `--dry-run` mode for all initial runs
- Set high confidence threshold (0.85+) for auto-apply
- Manual review of first 10 issues
- Rollback plan: revert commits if accuracy <80%

### Risk 2: Breaking Existing Workflows

**Mitigation**:
- Test template changes locally first
- Validate GitHub accepts updated YAML frontmatter
- Implement alongside existing templates
- Gradual rollout (Phase issues first, then Audit, then Enhancement)

### Risk 3: Incomplete Enrichment

**Mitigation**:
- Keep manual override capability
- Prioritize issues by type (Epic > Feature > Task)
- Post comment when auto-enriching with suggested changes
- Allow 7-day dispute window before finalizing

---

## Rollback Plan

If implementation causes issues:

1. **Template Validation Failure**: Revert template changes, keep scripts
2. **Over-Enrichment**: Revert issue body updates via GitHub history
3. **Workflow Breakage**: Disable validation step in workflow until fixed
4. **Process Disruption**: Keep `--dry-run` as default mode

---

## Success Criteria

✅ **Complete** when:
1. All 25 templates updated with enforced DoR/DoD/Owner sections
2. 95% of issues with `status:needs-more-info` enriched with missing sections
3. `add-issue-template-sections.js` updated to handle all patterns
4. New validation & enrichment scripts functional and tested
5. Issues Agent documentation updated with new capabilities
6. Zero regressions in existing issue workflows

---

## Next Steps

1. **Immediately** (This session):
   - [ ] Update all issue templates in `.github/ISSUE_TEMPLATE/`
   - [ ] Enhance `add-issue-template-sections.js` with new detection logic
   - [ ] Create `validate-issue-completeness.js`
   - [ ] Commit changes to branch

2. **Next Session**:
   - [ ] Create `bulk-enrich-issues.js` for batch processing
   - [ ] Test on small subset (10 issues)
   - [ ] Update Issues Agent documentation
   - [ ] Implement scheduled enrichment workflow

3. **Week 2**:
   - [ ] Apply to all 100 issues
   - [ ] Monitor accuracy and adjust
   - [ ] Deploy workflow validation

---

## References

- **Baseline Analysis**: Explore agent analysis of 100 issues with `status:needs-more-info`
- **Issues Agent**: `agents/issues.agent.md` (v2.1)
- **Existing Scripts**: `scripts/automation/{add-issue-template-sections,bulk-issue-metadata-updater}.js`
- **GitHub Issue Templates Docs**: https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-githubs-form-schema


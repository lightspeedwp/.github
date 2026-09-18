# GitHub Issues Checklist — Issue & PR Template Improvements

**Project:** Issue & PR Template Improvements  
**Auto-Generated From:** OpenSpec configuration  
**To Create:** 5 Task issues (one per phase) + tracking issue

---

## Issues to Create

### Phase 1: Template Deduplication & Cleanup

**Issue Type:** Task  
**Title:** Phase 1: Delete 17 Duplicate Issue Templates & Renumber  
**Labels:** `type:task`, `status:needs-triage`, `priority:normal`, `area:templates`, `meta:phase-1`  
**Description:**

```
## Summary
Remove 17 duplicate issue templates and establish canonical set of 25 unique templates.

## Tasks
- [ ] Delete 07-user-experience-feedback.md
- [ ] Delete 08-code-refactor.md (first duplicate)
- [ ] Delete 09-code-refactor.md (second duplicate)
- [ ] Delete 10-build-ci.md (duplicate of 09)
- [ ] Delete 11-automation.md (duplicate of 10)
- [ ] Delete 12-testing-coverage.md (duplicate of 11)
- [ ] Delete 13-performance.md (duplicate of 12)
- [ ] Delete 14-a11y.md (duplicate of 13)
- [ ] Delete 15-security.md (duplicate of 14)
- [ ] Delete 16-compatibility.md (duplicate of 15)
- [ ] Delete 17-integration-issue.md (duplicate of 16)
- [ ] Delete 18-release.md (duplicate of 17)
- [ ] Delete 19-maintenance.md (duplicate of 18)
- [ ] Delete 20-documentation.md (duplicate of 19)
- [ ] Delete 21-research.md (duplicate of 20)
- [ ] Delete 22-audit.md (duplicate of 21)
- [ ] Delete 23-code-review.md (duplicate of 22)
- [ ] Delete 24-ai-ops.md (duplicate of 23)
- [ ] Delete 25-content-modelling.md (duplicate of 24)
- [ ] Verify 25 unique templates remain
- [ ] Verify no numbering gaps
- [ ] Git commit changes

## Reference
- Project: `.github/projects/active/issue-and-pr-template-improvements/`
- Planning: `.github/projects/active/issue-and-pr-template-improvements/PLANNING.md#phase-1`
- Spec: `.github/projects/active/issue-and-pr-template-improvements/SPEC.md#finding-1`

## Acceptance Criteria
- ✅ 17 duplicate files deleted
- ✅ 25 unique templates remain
- ✅ Sequential numbering 01-25 with no gaps
- ✅ No duplicate entries in GitHub template dropdown
- ✅ Git changes committed to develop branch
```

---

### Phase 2: Standardize Frontmatter Across All Templates

**Issue Type:** Task  
**Title:** Phase 2: Standardize Frontmatter & Fix YAML Syntax in All Templates  
**Labels:** `type:task`, `status:needs-triage`, `priority:normal`, `area:templates`, `meta:phase-2`  
**Description:**

```
## Summary
Update all 25 issue templates to use standardized frontmatter format with valid YAML syntax.

## Changes Required
- [ ] Add/update `file_type: issue-template` to all issue templates
- [ ] Update `title:` field format (ensure matches `{type}: {scope}`)
- [ ] Add/update `name:` field with human-readable name (with icon emoji)
- [ ] Add/update `description:` field from org issue type definitions
- [ ] Update `labels:` array with quoted strings: `["type:...", "status:...", "priority:..."]`
- [ ] Remove old GitHub-native fields: `about`, `assignees`, `projects`

## Label Standardization
- [ ] All labels use valid prefixes: `type:`, `status:`, `priority:`, `area:`, `meta:`
- [ ] All labels exist in `.github/labels.yml`
- [ ] No bare labels (e.g., `bug` instead of `type:bug`)

## Affected Templates
- [ ] All 25 issue templates in `.github/ISSUE_TEMPLATE/*.md`
- [ ] All 9 PR templates in `.github/PULL_REQUEST_TEMPLATE/*.md` (use same format)

## Reference
- Project: `.github/projects/active/issue-and-pr-template-improvements/`
- Planning: `.github/projects/active/issue-and-pr-template-improvements/PLANNING.md#phase-2`
- Spec: `.github/projects/active/issue-and-pr-template-improvements/SPEC.md#finding-2`

## Acceptance Criteria
- ✅ All templates use standardized frontmatter format
- ✅ All YAML is valid (quotes around label strings)
- ✅ All labels are prefixed
- ✅ No validation errors when running schema check
- ✅ Git changes committed to develop branch
```

---

### Phase 3: Fix PR Template Title Patterns

**Issue Type:** Task  
**Title:** Phase 3: Correct PR Template Title Patterns to Match Branch Naming Convention  
**Labels:** `type:task`, `status:needs-triage`, `priority:normal`, `area:templates`, `meta:phase-3`  
**Description:**

```
## Summary
Update PR template title patterns to match CLAUDE.md branch naming convention.

## Changes Required
- [ ] `pr_bug.md`: Change `type:bug: {scope}` → `fix: {scope}`
- [ ] `pr_feature.md`: Change `type:feature: {scope}` → `feat: {scope}`
- [ ] Verify other PR templates already use correct format:
  - [ ] `pr_chore.md` — should be `chore: {scope}`
  - [ ] `pr_ci.md` — should be `ci: {scope}`
  - [ ] `pr_dep_update.md` — should be `deps: {scope}`
  - [ ] `pr_docs.md` — should be `docs: {scope}`
  - [ ] `pr_hotfix.md` — should be `hotfix: {scope}`
  - [ ] `pr_refactor.md` — should be `refactor: {scope}`
  - [ ] `pr_release.md` — should be `release: {scope}`

## Why This Matters
- Users see title suggestions when creating PRs
- Suggestions should match CLAUDE.md branch naming: `{type}/{scope}-{title}`
- Wrong format shows label syntax instead of branch naming convention
- Correct format helps users understand branch naming strategy

## Reference
- CLAUDE.md: `./ CLAUDE.md` (Section: Branch Naming)
- Project: `.github/projects/active/issue-and-pr-template-improvements/`
- Planning: `.github/projects/active/issue-and-pr-template-improvements/PLANNING.md#phase-3`
- Spec: `.github/projects/active/issue-and-pr-template-improvements/SPEC.md#finding-3`

## Acceptance Criteria
- ✅ `pr_bug.md` uses `fix: {scope}`
- ✅ `pr_feature.md` uses `feat: {scope}`
- ✅ All 9 PR templates use correct title format
- ✅ Title formats match CLAUDE.md branch types
- ✅ Git changes committed to develop branch
```

---

### Phase 4: Validation & Template Testing

**Issue Type:** Task  
**Title:** Phase 4: Validate All Templates & Test Template Routing  
**Labels:** `type:task`, `status:needs-triage`, `priority:normal`, `area:templates`, `meta:phase-4`  
**Description:**

```
## Summary
Run validation checks and smoke tests to ensure all templates work correctly.

## Validation Tasks
- [ ] Run schema validation: `npm run validate:frontmatter`
  - Confirm all templates pass
  - No errors reported
  - All required fields present
- [ ] Verify label inventory
  - All labels used in templates exist in `.github/labels.yml`
  - No undefined labels found
  - All labels have valid prefixes
- [ ] Verify template count
  - 25 issue templates exist
  - 9 PR templates exist
  - No duplicates in GitHub UI

## Smoke Tests
- [ ] Create test issue from one template
  - Verify correct template loaded
  - Verify labels applied automatically
  - Verify title suggestion shown
- [ ] Create test PR from one template
  - Verify correct template loaded
  - Verify labels applied automatically
  - Verify title suggestion shown
- [ ] Verify no frontmatter leaks into body
  - Issue/PR body doesn't contain YAML frontmatter
  - Body content renders correctly

## Regression Check
- [ ] No errors in GitHub Actions workflows
- [ ] No template routing failures
- [ ] No automation failures related to templates

## Reference
- Project: `.github/projects/active/issue-and-pr-template-improvements/`
- Planning: `.github/projects/active/issue-and-pr-template-improvements/PLANNING.md#phase-4`
- Spec: `.github/projects/active/issue-and-pr-template-improvements/SPEC.md#validation-points`

## Acceptance Criteria
- ✅ Schema validation passes
- ✅ All labels valid and defined
- ✅ No duplicate templates in GitHub UI
- ✅ Test PRs/issues from each template work correctly
- ✅ No validation errors in automation workflows
- ✅ Git changes committed to develop branch
```

---

### Phase 5: Create Issue Type Allocator Skill & Update Documentation

**Issue Type:** Task  
**Title:** Phase 5: Create Issue Type Allocator Skill & Update Documentation  
**Labels:** `type:task`, `status:needs-triage`, `priority:normal`, `area:templates`, `meta:phase-5`  
**Description:**

```
## Summary
Create reusable skill for issue type allocation and update all related documentation.

## Deliverables
- [ ] Create `.claude/skills/issue-type-allocator/SKILL.md`
  - [ ] Decision tree for selecting correct issue type
  - [ ] Real-world examples for each issue type
  - [ ] Common mistakes and how to avoid them
  - [ ] Integration guidance for agents (release, issues, PR, etc.)
  - [ ] Criteria for distinguishing similar types
  - [ ] Links to issue type definitions
- [ ] Update `.github/issue-types.yml`
  - [ ] Verify alignment with GitHub organization settings
  - [ ] Update descriptions if needed
  - [ ] Update colors if needed
- [ ] Update related documentation
  - [ ] Link `docs/ISSUE_TYPES.md` to this project
  - [ ] Link `docs/LABELING.md` to corrected templates
  - [ ] Update `CLAUDE.md` if needed

## Documentation Updates
- [ ] Update `STATUS_TRACKING.md` with completion status
- [ ] Document any remaining gaps
- [ ] Link to all created GitHub issues
- [ ] Cross-link this project to all related docs

## Reference
- Project: `.github/projects/active/issue-and-pr-template-improvements/`
- Planning: `.github/projects/active/issue-and-pr-template-improvements/PLANNING.md#phase-5`
- Spec: `.github/projects/active/issue-and-pr-template-improvements/SPEC.md`

## Acceptance Criteria
- ✅ Issue Type Allocator skill created and documented
- ✅ Skill usable by release agent, issues agent, PR agent
- ✅ All documentation links correct
- ✅ Active project status updated
- ✅ Git changes committed to develop branch
```

---

### Meta: Project Status Tracking

**Issue Type:** Task  
**Title:** [TRACKING] Issue & PR Template Improvements — Project Status  
**Labels:** `type:task`, `status:in-progress`, `priority:normal`, `area:templates`, `meta:tracking`  
**Description:**

```
## Project Overview
This is the tracking issue for the Issue & PR Template Improvements project.

## Related Documentation
- **Full Project:** `.github/projects/active/issue-and-pr-template-improvements/`
- **README:** `.github/projects/active/issue-and-pr-template-improvements/README.md`
- **Specification:** `.github/projects/active/issue-and-pr-template-improvements/SPEC.md`
- **Implementation Plan:** `.github/projects/active/issue-and-pr-template-improvements/PLANNING.md`
- **Analysis Artifact:** https://claude.ai/code/artifact/bdda3d82-0c82-4f26-85c2-f222b1693ce0

## Phase Progress
- [ ] Phase 1: Cleanup & Deduplication — Issue: #TBD
- [ ] Phase 2: Frontmatter Standardization — Issue: #TBD
- [ ] Phase 3: PR Title Corrections — Issue: #TBD
- [ ] Phase 4: Validation & Testing — Issue: #TBD
- [ ] Phase 5: Documentation & Skill Creation — Issue: #TBD

## Current Status
- Started: 2026-09-04
- Target Completion: 2026-09-05
- Estimated Duration: ~2 hours (5 phases)

## Key Findings
1. 17 duplicate issue templates found
2. Invalid YAML syntax in frontmatter (unquoted labels)
3. PR template title patterns use wrong format
4. Inconsistent frontmatter across templates
5. Some templates misaligned with org issue type definitions

## Success Criteria
- ✅ All duplicate templates deleted
- ✅ All templates conform to schema
- ✅ All YAML syntax valid
- ✅ Issue Type Allocator skill created
- ✅ All documentation linked and updated

## Next Steps
1. Await approval for Phase 1
2. Execute phases in order
3. Validate after each phase
4. Update this issue with progress
5. Merge changes to develop branch
```

---

## Issue Linking Strategy

After creating issues, link them as follows:

1. **From Project Documentation to Issues:**
   - Update `.github/projects/active/issue-and-pr-template-improvements/STATUS_TRACKING.md`
   - Add issue links: `Closes #TBD`, `See #TBD`, etc.

2. **From Issues to Project Documentation:**
   - Add to issue description: `Project: .github/projects/active/issue-and-pr-template-improvements/`
   - Add link: `See project for full context`

3. **From Issues to Active Project Files:**
   - Link to `SPEC.md` for detailed findings
   - Link to `PLANNING.md` for implementation details
   - Link to specific phase section

4. **Cross-References in Issue Body:**
   - Each phase issue links to next phase
   - All issues link to tracking issue
   - All issues link to project documentation

---

## Labels Used

All issues will use the following labels (must exist in `.github/labels.yml`):
- `type:task` — These are task issues, not features/bugs
- `status:needs-triage` — Initial status, awaiting review
- `priority:normal` — Standard priority
- `area:templates` — Related to GitHub templates
- `meta:phase-N` — Tags for grouping by phase

---

## Notes

- Create issues after all project documentation is complete
- Link issues to project folder in active projects
- Each phase issue should reference next phase
- Update tracking issue as progress is made
- Close issues after each phase completes

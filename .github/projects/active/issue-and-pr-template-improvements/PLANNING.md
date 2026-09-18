# Implementation Plan — Issue & PR Template Improvements

**Project:** Issue & PR Template Improvements  
**Planning Date:** 2026-09-04  
**Target Completion:** 2026-09-05  
**Total Effort Estimate:** ~2 hours (5 phases)

## Phase Overview

| Phase | Duration | Tasks | Blocker? |
|-------|----------|-------|----------|
| Phase 1: Cleanup | 30 min | Delete 17 duplicates, renumber templates | No |
| Phase 2: Frontmatter | 30 min | Standardize format, fix YAML syntax | No |
| Phase 3: PR Templates | 15 min | Fix title patterns to match branch naming | No |
| Phase 4: Validation | 20 min | Schema validation, template testing | No |
| Phase 5: Documentation | 20 min | Create Issue Type Allocator skill, docs | No |
| **Total** | **~2 hrs** | | |

## Phase 1: Cleanup & Deduplication (30 min)

**Objective:** Remove duplicate templates and establish canonical set of 25

### Tasks

1. **Delete 17 Duplicate Files**
   ```bash
   rm .github/ISSUE_TEMPLATE/07-user-experience-feedback.md
   rm .github/ISSUE_TEMPLATE/08-code-refactor.md
   rm .github/ISSUE_TEMPLATE/09-code-refactor.md
   rm .github/ISSUE_TEMPLATE/10-build-ci.md
   # ... etc (see SPEC.md for full list)
   ```
   - [ ] Deletion confirmed
   - [ ] Git status clean

2. **Verify Remaining Templates Count**
   ```bash
   ls .github/ISSUE_TEMPLATE/*.md | wc -l
   # Should be: 26 (25 templates + 1 README)
   ```
   - [ ] Count verified

3. **Verify No Naming Conflicts**
   - [ ] No duplicate numbers (e.g., two `09-*` files)
   - [ ] Numbering is sequential 01-25
   - [ ] No gaps in sequence

### Success Criteria
- ✅ 17 duplicate files deleted
- ✅ 25 unique templates remain
- ✅ Sequential numbering 01-25 with no gaps
- ✅ No duplicate entries in GitHub template dropdown

### Rollback Plan
If issues arise:
- `git checkout .github/ISSUE_TEMPLATE/` to restore all files
- Verify deletions didn't break automation

---

## Phase 2: Frontmatter Standardization (30 min)

**Objective:** Update all templates to use standardized frontmatter format

### Tasks

1. **Update All Issue Templates**
   
   For each `.github/ISSUE_TEMPLATE/*.md` file:
   ```yaml
   ---
   file_type: issue-template
   title: "{type}: {scope}"
   name: "[Icon] [Name]"
   description: "[Clear purpose based on org issue type definition]"
   labels: ["type:[category]", "status:needs-triage", "priority:normal"]
   ---
   ```

   - [ ] 01-task.md
   - [ ] 02-bug.md
   - [ ] 03-feature.md
   - [ ] 04-design.md
   - [ ] 05-epic.md
   - [ ] 06-story.md
   - [ ] 07-improvement.md
   - [ ] 08-chore.md
   - [ ] 09-code-refactor.md
   - [ ] 10-build-ci.md (was 09)
   - [ ] 11-automation.md (was 10)
   - [ ] 12-testing-coverage.md (was 11)
   - [ ] 13-performance.md (was 12)
   - [ ] 14-a11y.md (was 13)
   - [ ] 15-security.md (was 14)
   - [ ] 16-compatibility.md (was 15)
   - [ ] 17-integration-issue.md (was 16)
   - [ ] 18-release.md (was 17)
   - [ ] 19-maintenance.md (was 18)
   - [ ] 20-documentation.md (was 19)
   - [ ] 21-research.md (was 20)
   - [ ] 22-audit.md (was 21)
   - [ ] 23-code-review.md (was 22)
   - [ ] 24-ai-ops.md (was 23)
   - [ ] 25-content-modelling.md (was 24)
   - [ ] [Need to verify 25-help.md exists and add if needed]

2. **Fix Label Arrays (Quote All Strings)**
   
   Change from:
   ```yaml
   labels: [type:bug, status:needs-triage]
   ```
   
   To:
   ```yaml
   labels: ["type:bug", "status:needs-triage"]
   ```
   
   - [ ] All issue templates use quoted labels
   - [ ] All PR templates use quoted labels

3. **Verify Label Prefixes**
   
   All labels must have valid prefixes:
   - `type:` — Issue/PR type (bug, feature, task, etc.)
   - `status:` — Current status (needs-triage, in-progress, etc.)
   - `priority:` — Priority level (critical, high, normal, low)
   - `area:` — Code area (ci, docs, security, etc.)
   - `meta:` — Meta tags (duplicate, needs-changelog, etc.)
   
   - [ ] No bare labels found
   - [ ] All label prefixes valid
   - [ ] All labels exist in `.github/labels.yml`

### Success Criteria
- ✅ All templates have standardized frontmatter
- ✅ All YAML is valid (quotes around label strings)
- ✅ All labels are prefixed
- ✅ No validation errors when running schema check

---

## Phase 3: PR Template Title Corrections (15 min)

**Objective:** Fix PR template title patterns to match CLAUDE.md branch naming convention

### Changes Required

| File | Current Title | Corrected Title | Branch Match |
|------|----------------|-----------------|---------------|
| `pr_bug.md` | `type:bug: {scope}` | `fix: {scope}` | `fix/scope-title` ✓ |
| `pr_feature.md` | `type:feature: {scope}` | `feat: {scope}` | `feat/scope-title` ✓ |
| `pr_chore.md` | `chore: {scope}` | `chore: {scope}` | No change ✓ |
| `pr_ci.md` | `ci: {scope}` | `ci: {scope}` | No change ✓ |
| `pr_dep_update.md` | `deps: {scope}` | `deps: {scope}` | No change ✓ |
| `pr_docs.md` | `docs: {scope}` | `docs: {scope}` | No change ✓ |
| `pr_hotfix.md` | `hotfix: {scope}` | `hotfix: {scope}` | No change ✓ |
| `pr_refactor.md` | `refactor: {scope}` | `refactor: {scope}` | No change ✓ |
| `pr_release.md` | `release: {scope}` | `release: {scope}` | No change ✓ |

### Tasks

1. **Update pr_bug.md**
   - [ ] Change title from `type:bug: {scope}` to `fix: {scope}`

2. **Update pr_feature.md**
   - [ ] Change title from `type:feature: {scope}` to `feat: {scope}`

3. **Verify Other PR Templates**
   - [ ] pr_chore.md — already correct
   - [ ] pr_ci.md — already correct
   - [ ] pr_dep_update.md — already correct
   - [ ] pr_docs.md — already correct
   - [ ] pr_hotfix.md — already correct
   - [ ] pr_refactor.md — already correct
   - [ ] pr_release.md — already correct

### Success Criteria
- ✅ PR template titles match CLAUDE.md branch types
- ✅ Users see correct conventions in PR title suggestions
- ✅ Title patterns enable proper PR routing by branch prefix

---

## Phase 4: Validation & Testing (20 min)

**Objective:** Verify all changes are correct and templates work as expected

### Tasks

1. **Schema Validation**
   ```bash
   npm run validate:frontmatter
   ```
   - [ ] All templates pass validation
   - [ ] No errors reported
   - [ ] All required fields present

2. **Label Inventory Check**
   ```bash
   # Verify all labels used in templates exist in labels.yml
   grep -h "labels:" .github/ISSUE_TEMPLATE/*.md .github/PULL_REQUEST_TEMPLATE/*.md | sort -u
   ```
   - [ ] All labels exist in `.github/labels.yml`
   - [ ] No undefined labels found

3. **Test Template Routing**
   
   Create test PRs/issues to verify:
   - [ ] Template dropdown shows all 25 issue templates (no duplicates)
   - [ ] PR template selection works by branch prefix
   - [ ] Title suggestions populate correctly
   - [ ] Labels are applied automatically
   - [ ] Frontmatter doesn't appear in issue/PR body

4. **Manual Smoke Test**
   - [ ] Create test issue from one template → verify correct template loaded
   - [ ] Create test PR from one template → verify correct template loaded
   - [ ] Verify labels applied automatically
   - [ ] Verify title suggestion shown

### Success Criteria
- ✅ Schema validation passes
- ✅ All labels valid and defined
- ✅ No duplicate templates in GitHub UI
- ✅ Test PRs/issues from each template work correctly
- ✅ No validation errors in automation workflows

---

## Phase 5: Documentation & Skill Creation (20 min)

**Objective:** Document findings and create Issue Type Allocator skill

### Tasks

1. **Create Issue Type Allocator Skill**
   
   Location: `.claude/skills/issue-type-allocator/SKILL.md`
   
   Content:
   - [ ] Decision tree for selecting correct issue type
   - [ ] Examples for each issue type with real-world scenarios
   - [ ] Common mistakes and how to avoid them
   - [ ] Integration guidance for agents (release, issues, PR, etc.)
   - [ ] Criteria for distinguishing similar types (Task vs. Chore, Bug vs. Improvement)
   - [ ] References to issue type definitions

2. **Update `.github/issue-types.yml`**
   
   If organization settings were changed:
   - [ ] Verify alignment with GitHub organization settings
   - [ ] Update descriptions if needed
   - [ ] Update colors if needed

3. **Update Related Documentation**
   
   - [ ] Link `docs/ISSUE_TYPES.md` to this project
   - [ ] Link `docs/LABELING.md` to corrected templates
   - [ ] Update `CLAUDE.md` if needed to reference templates

4. **Update Active Project Status**
   
   - [ ] Update `STATUS_TRACKING.md` with completion status
   - [ ] Document any remaining gaps
   - [ ] Link to all created GitHub issues

### Success Criteria
- ✅ Issue Type Allocator skill created and documented
- ✅ Skill is usable by release agent, issues agent, PR agent
- ✅ All documentation links are correct
- ✅ Active project status updated

---

## Approval Gates

**Phase 1 Approval Needed Before Proceeding to Phase 2**
- User reviews deletion list
- Confirms no important content will be lost
- Approves proceeding with deletions

**Phase 2 Approval Needed Before Proceeding to Phase 3**
- User reviews frontmatter changes
- Confirms all required fields are present
- Approves YAML syntax changes

**Phase 3 Approval Needed Before Proceeding to Phase 4**
- User reviews PR title pattern changes
- Confirms alignment with CLAUDE.md
- Approves testing phase

**Phase 4 Approval Needed Before Proceeding to Phase 5**
- Validation results reviewed
- Test results reviewed
- Any issues resolved
- Approval to commit changes

**Phase 5 Completion**
- Skill created and documented
- All issues linked
- Project status updated
- Ready for merge to develop branch

---

## Rollback Strategy

If critical issues found:

1. **Before Commit:** Fix issues, retest, re-validate
2. **After Commit:** `git revert <commit-hash>` to roll back changes
3. **If Merged:** Create new PR to fix issues

---

## Success Timeline

| Phase | Start | End | Duration | Status |
|-------|-------|-----|----------|--------|
| 1. Cleanup | T+0 | T+30min | 30 min | — |
| 2. Frontmatter | T+30 | T+60min | 30 min | — |
| 3. PR Titles | T+60 | T+75min | 15 min | — |
| 4. Validation | T+75 | T+95min | 20 min | — |
| 5. Documentation | T+95 | T+115min | 20 min | — |
| **Review & Merge** | T+115 | T+130min | 15 min | — |
| **Total** | | | **~2 hrs 10 min** | |

---

## Success Criteria Summary

**Technical:**
- ✅ All duplicate templates deleted
- ✅ All templates conform to schema
- ✅ All YAML syntax valid
- ✅ All labels prefixed and defined
- ✅ PR title patterns match branch naming

**Functional:**
- ✅ GitHub template dropdown shows 25 unique templates
- ✅ Template routing works by branch/issue type
- ✅ Test PRs/issues from templates work correctly
- ✅ Labels apply automatically

**Documentation:**
- ✅ Issue Type Allocator skill created
- ✅ Active project status updated
- ✅ All issues linked and cross-referenced
- ✅ No broken documentation links

---

## Next Steps

1. Await Phase 1 approval
2. Begin Phase 1 (deletions)
3. Follow approval gates for each subsequent phase
4. Document progress in `STATUS_TRACKING.md`
5. Commit changes to develop branch
6. Create PR for review (if needed)
7. Monitor automation workflows for regressions

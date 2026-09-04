# Specification — Issue & PR Template Audit Findings

**Date:** 2026-09-04  
**Source:** Comprehensive template review session  
**Analysis Tool:** Interactive artifact review + template file inspection

## Executive Summary

**Status:** 5 critical issues found, requiring comprehensive remediation

| Category | Count | Severity | Impact |
|----------|-------|----------|--------|
| Duplicate templates | 17 files | Critical | Template routing broken |
| Invalid YAML syntax | 9+ templates | High | Schema validation fails |
| Wrong title patterns | 9 PR templates | High | User confusion |
| Inconsistent frontmatter | 20+ templates | Medium | No single source of truth |
| Template-type misalignment | Multiple | Medium | Poor user guidance |

## Detailed Findings

### Finding 1: Duplicate Issue Templates (17 files)

**Files to Delete:**
```
.github/ISSUE_TEMPLATE/07-user-experience-feedback.md
.github/ISSUE_TEMPLATE/08-code-refactor.md
.github/ISSUE_TEMPLATE/09-code-refactor.md (duplicate entry)
.github/ISSUE_TEMPLATE/10-build-ci.md (duplicate of 09)
.github/ISSUE_TEMPLATE/11-automation.md (duplicate of 10)
.github/ISSUE_TEMPLATE/12-testing-coverage.md (duplicate of 11)
.github/ISSUE_TEMPLATE/13-performance.md (duplicate of 12)
.github/ISSUE_TEMPLATE/14-a11y.md (duplicate of 13)
.github/ISSUE_TEMPLATE/15-security.md (duplicate of 14)
.github/ISSUE_TEMPLATE/16-compatibility.md (duplicate of 15)
.github/ISSUE_TEMPLATE/17-integration-issue.md (duplicate of 16)
.github/ISSUE_TEMPLATE/18-release.md (duplicate of 17)
.github/ISSUE_TEMPLATE/19-maintenance.md (duplicate of 18)
.github/ISSUE_TEMPLATE/20-documentation.md (duplicate of 19)
.github/ISSUE_TEMPLATE/21-research.md (duplicate of 20)
.github/ISSUE_TEMPLATE/22-audit.md (duplicate of 21)
.github/ISSUE_TEMPLATE/23-code-review.md (duplicate of 22)
.github/ISSUE_TEMPLATE/24-ai-ops.md (duplicate of 23)
.github/ISSUE_TEMPLATE/25-content-modelling.md (duplicate of 24)
```

**Cause:** Previous automation created duplicate files with sequential numbering  
**Impact:** GitHub template selector shows duplicates; users confused  
**Solution:** Keep primary file (lower number), delete all duplicates  

### Finding 2: Invalid YAML Syntax (Unquoted Label Strings)

**Current (Wrong):**
```yaml
labels: [type:bug, status:needs-triage, priority:normal]
```

**Correct:**
```yaml
labels: ["type:bug", "status:needs-triage", "priority:normal"]
```

**Affected Templates:**
- `.github/ISSUE_TEMPLATE/02-bug.md`
- `.github/ISSUE_TEMPLATE/03-feature.md`
- And likely all templates with new standardized frontmatter

**Root Cause:** YAML parser interprets colons as delimiters; needs quoting  
**Impact:** Schema validation fails; JSON parsing breaks in some contexts  
**Solution:** Add quotes to all label array items  

### Finding 3: Wrong PR Template Title Patterns

**Current (Wrong):**
```yaml
title: "type:feature: {scope}"  # Mixes label format with title
title: "type:bug: {scope}"      # Same problem
```

**Correct:**
```yaml
title: "feat: {scope}"      # Matches branch prefix: feat/scope-title
title: "fix: {scope}"       # Matches branch prefix: fix/scope-title
```

**All PR Templates Affected:**
- `pr_bug.md`: Should be `fix: {scope}` (not `type:bug`)
- `pr_feature.md`: Should be `feat: {scope}` (not `type:feature`)
- `pr_chore.md`: Correct (already `chore: {scope}`)
- `pr_ci.md`: Correct (already `ci: {scope}`)
- `pr_dep_update.md`: Correct (already `deps: {scope}`)
- `pr_docs.md`: Correct (already `docs: {scope}`)
- `pr_hotfix.md`: Correct (already `hotfix: {scope}`)
- `pr_refactor.md`: Correct (already `refactor: {scope}`)
- `pr_release.md`: Correct (already `release: {scope}`)

**Root Cause:** Confusion between title patterns (user-facing) and label prefixes (machine-readable)  
**Impact:** Users see label syntax in PR title suggestions instead of branch naming convention  
**Solution:** Update title patterns to match CLAUDE.md branch types  

### Finding 4: Inconsistent Frontmatter Structure

**New Format (Some Templates):**
```yaml
file_type: issue-template | pr-template
title: "{type}: {scope}"
name: "Human-readable name"
description: "Clear purpose"
labels: ["type:...", "status:..."]
```

**Old Format (Other Templates):**
```yaml
name: "Template name"
description: "Description"
about: "About text"
title: "[Type] Summary"
labels: [bare, labels, without, prefixes]
assignees: []
projects: []
```

**Affected:** ~20 templates mix old and new formats  
**Root Cause:** Partial migration to standardized frontmatter  
**Impact:** No single source of truth; schema validation inconsistent  
**Solution:** Standardize all templates to new format  

### Finding 5: Template-Type Misalignment

**Issue:** Some template names/descriptions don't match organization-wide issue type definitions

**Organization-Wide Definition (from GitHub settings):**
```
Feature: Net-new value: new block, pattern library, settings screen, CPT integration, 
gateway, or content model. Shippable outcome with clear AC, user impact, and 
non-functional criteria (a11y, performance, security).
```

**Template Definition (if different):** Check `.github/ISSUE_TEMPLATE/03-feature.md`  
**Result:** Should match exactly; update if description is vague or outdated  

## Validation Points

### Schema Validation
- [ ] Run: `npm run validate:frontmatter`
- [ ] All templates must pass
- [ ] Required fields per file type:
  - PR templates: `file_type`, `title`, `name`, `description`, `labels`
  - Issue templates: `file_type`, `title`, `name`, `description`, `labels`

### Label Validation
- [ ] All labels must exist in `.github/labels.yml`
- [ ] All labels must have valid prefixes: `type:`, `status:`, `priority:`, `area:`, `meta:`
- [ ] No bare labels (e.g., `bug` instead of `type:bug`)

### Template Routing
- [ ] PR template selection works via branch prefix matching
- [ ] Issue template selection works via issue type dropdown
- [ ] No duplicate templates in GitHub UI

### Content Validation
- [ ] Template content (body) is clear and guides users
- [ ] Placeholder text is appropriate
- [ ] Links to docs/guidelines are current

## Interdependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| `.schemas/frontmatter.schema.json` | Exists | Must be updated if field requirements change |
| `.github/labels.yml` | Exists | Must list all labels used in templates |
| `.github/issue-types.yml` | Exists | Should align with org issue types |
| `CLAUDE.md` | Exists | Branch naming rules: `{type}/{scope}-{title}` |
| Automation workflows | Exist | May depend on template structure |
| AI agents | Use templates | Release agent, issues agent, PR agent, etc. |

## Blockers & Risks

### Blockers
- [ ] Schema file may need updates if current validation is too strict
- [ ] Some templates may have custom content that's important to preserve
- [ ] Organization-wide issue type definitions may need refinement

### Risks
- [ ] Changing template structure could affect existing PR/issue creation workflows
- [ ] Agents that depend on templates may break if not tested thoroughly
- [ ] Large number of changes (19+ files) could introduce regressions

## Mitigation Strategies

1. **Phased Approach:** Complete deletions first, then frontmatter fixes, then test
2. **Validation:** Run schema validation after each phase
3. **Testing:** Create test PR/issue from each template to verify routing
4. **Documentation:** Update all related docs to reference corrected templates
5. **Rollback Plan:** Keep original templates in git history for reference

## Success Criteria

- ✅ Schema validation passes for all templates
- ✅ No duplicate templates in GitHub UI
- ✅ All labels are prefixed and exist in label inventory
- ✅ PR title patterns match CLAUDE.md branch naming convention
- ✅ All templates use standardized frontmatter format
- ✅ Test PRs/issues from each template work correctly
- ✅ No regressions in existing automation

## Related Issues

- Will be created and linked in `ISSUES_CHECKLIST.md`
- Each phase will have corresponding GitHub issue
- All issues will link back to this project folder

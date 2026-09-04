# Issue & PR Template Improvements — Active Project

**Status:** In Progress  
**Created:** 2026-09-04  
**Last Updated:** 2026-09-04  
**Owner:** @ashley (lightspeedwp/.github control plane)

## Overview

This project tracks the comprehensive review, audit, and remediation of GitHub issue and PR templates across the `lightspeedwp` organization.

### Scope

- **25 GitHub issue templates** — Review for duplicates, alignment, and correctness
- **9 GitHub PR templates** — Fix title patterns, frontmatter, and label consistency
- **Frontmatter schema** — Ensure all templates conform to `.schemas/frontmatter.schema.json`
- **Issue type alignment** — Align templates with organization-wide issue type definitions
- **Label standardization** — Verify all templates use prefixed labels from `.github/labels.yml`

### Why This Matters

Poorly structured templates:
- Break PR template routing (wrong template applied based on branch prefix)
- Cause validation failures in GitHub Actions workflows
- Confuse users with inconsistent formats
- Make automation (labeling, metrics, release workflows) unreliable
- Prevent effective use of AI agents for issue/PR handling

## Critical Issues Found

### 1. Duplicate Issue Templates (17 files)
- Most templates appear **twice or more** with different numbering
- Examples: `09-build-ci.md` AND `10-build-ci.md`, `07-improvement.md` AND `07-user-experience-feedback.md`
- **Impact:** GitHub template selector shows duplicates; users confused about which to use

### 2. Invalid YAML in Frontmatter
- Label arrays have unquoted strings: `labels: [type:bug, status:needs-triage]` ❌
- Should be: `labels: ["type:bug", "status:needs-triage"]` ✅
- **Impact:** Schema validation fails; automation breaks

### 3. Wrong Title Patterns in PR Templates
- Current: `title: "type:feature: {scope}"` ❌
- Correct: `title: "feat: {scope}"` ✅
- **Impact:** Users see label syntax in PR title suggestions instead of branch naming convention

### 4. Inconsistent Frontmatter
- Some templates have new standardized frontmatter (`file_type`, `name`, `description`, `labels`)
- Others retain old GitHub-native fields (`about`, `assignees`, `projects`)
- **Impact:** Schema validation inconsistent; no single source of truth

### 5. Template-Type Misalignment
- Issue templates don't align with organization-wide issue type definitions
- Some descriptions outdated or overly vague
- **Impact:** Templates don't guide users toward correct issue type

## Remediation Plan

### Phase 1: Delete Duplicates
- [ ] Remove 17 duplicate files
- [ ] Renumber remaining templates to sequential order (01-25)

### Phase 2: Fix Frontmatter
- [ ] Add/update frontmatter for all templates
- [ ] Correct YAML syntax (quote label arrays)
- [ ] Fix title patterns in PR templates

### Phase 3: Validate & Test
- [ ] Run schema validation
- [ ] Create test issues/PRs from each template
- [ ] Verify template routing works correctly

### Phase 4: Create Issue Type Allocator Skill
- [ ] New skill: `.claude/skills/issue-type-allocator/SKILL.md`
- [ ] Decision tree for selecting correct issue type
- [ ] Integration guidance for agents

### Phase 5: Documentation & Alignment
- [ ] Update `.github/issue-types.yml` if org settings changed
- [ ] Ensure template descriptions match issue type purposes
- [ ] Cross-link issue types to templates

## Key Files

| File | Purpose |
|------|---------|
| `INDEX.md` | Index of all project documentation |
| `SPEC.md` | Detailed findings and specifications |
| `PLANNING.md` | Implementation roadmap and phases |
| `ISSUES_CHECKLIST.md` | Checklist of GitHub issues to create |
| `OPENSPEC.yml` | OpenSpec configuration for issue generation |
| `STATUS_TRACKING.md` | Real-time status updates |

## Related Documentation

- **Template Review Analysis:** https://claude.ai/code/artifact/bdda3d82-0c82-4f26-85c2-f222b1693ce0
- **Issue Types Guide:** `docs/ISSUE_TYPES.md`
- **Label Strategy:** `docs/LABEL_STRATEGY.md`
- **Branch Naming Rules:** `CLAUDE.md` (Section: Branch Naming)
- **Automation Governance:** `docs/AUTOMATION_GOVERNANCE.md`

## Success Criteria

- ✅ All 25 issue templates exist, no duplicates
- ✅ All templates conform to frontmatter schema
- ✅ PR template title patterns match branch naming convention
- ✅ All labels are prefixed and exist in `.github/labels.yml`
- ✅ Templates align with organization-wide issue type definitions
- ✅ Issue Type Allocator skill created and documented
- ✅ All related GitHub issues created and linked
- ✅ Schema validation passes
- ✅ Test PRs/issues from each template work correctly

## Timeline

- **Phase 1-2:** ~30 min (deletions, renumbering, frontmatter fixes)
- **Phase 3:** ~20 min (validation, testing)
- **Phase 4:** ~40 min (skill creation)
- **Phase 5:** ~20 min (documentation)
- **Total:** ~2 hours (excluding review/approval time)

## Next Steps

1. Review findings in this project's documentation
2. Approve remediation plan
3. Execute phases 1-5 in order
4. Create GitHub issues for each phase
5. Link issues to this project folder
6. Track progress in `STATUS_TRACKING.md`

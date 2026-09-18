---
openspec_version: "1.0"
type: "issue"
issue_type: "feature"
title: "feat/automation: Migrate governance rules to core organization repositories"
labels: ["type:feat", "area:automation", "priority:high"]
milestone: "v1.2"
assignee: null
linked_issue: null
---

# Migrate Governance Rules to Core Organization Repositories

## Problem

Phase 3 successfully implemented governance automation in the `.github` repository:
- Branch validation (34 allowed types, 3 forbidden prefixes)
- PR template routing with fallback mechanism
- Title normalization for consistency

However, these rules are **not yet deployed to other core organization repositories** where they would provide immediate value:
- Individual WordPress plugin repositories
- Block theme repositories
- Core infrastructure repositories

**Impact:** Teams working on other repos don't have governance validation. Manual workarounds continue.

## Solution

Deploy Phase 3 governance automation to core organization repositories by:

1. **Identify core repositories** — List all repos that benefit from governance rules:
   - `lightspeedwp/wordpress-plugin-template` (template/boilerplate)
   - `lightspeedwp/core-blocks` (shared blocks library)
   - `lightspeedwp/block-theme` (block theme)
   - Other active org repositories with CI/CD pipelines

2. **Extract reusable assets** from `.github` repo:
   - Copy `.github/workflows/validate-branch-names.yml` → Core repo `.github/workflows/`
   - Copy `.github/workflows/normalize-pr-titles.yml` → Core repo `.github/workflows/`
   - Copy `.github/workflows/pr-template-resolver.yml` → Core repo `.github/workflows/`
   - Copy `.github/instructions/branch-naming.instructions.md` → Core repo `.github/instructions/`
   - Copy branch validation script → Core repo `.github/scripts/` or reusable action

3. **Configure per-repository** — Update each repo's `.github/workflows/` to:
   - Enable branch validation workflow
   - Enable title normalization workflow
   - Enable PR template resolver
   - Set repo-specific labels.yml if different from org defaults

4. **Update repository documentation:**
   - Add branch naming section to target repo's CLAUDE.md
   - Add branching strategy link to CONTRIBUTING.md
   - Update repo-local custom-instructions.md if applicable

5. **Test deployments:**
   - Create test branches with valid and invalid names
   - Verify validation workflow runs and rejects/accepts correctly
   - Verify title normalization runs without errors
   - Verify PR template routing works

## Implementation Notes

- Reuse existing workflows from `.github` repo (no duplication)
- Maintain consistent branch naming rules across all repos
- Document any repo-specific deviations in repo's CLAUDE.md
- Ensure all repos use canonical labels from `.github/labels.yml`
- Plan for future updates: changes to `.github` rules should be easy to cascade

## Definition of Done

- [ ] Core repositories identified and listed
- [ ] Reusable assets extracted and documented
- [ ] Branch validation workflow deployed to all target repos
- [ ] Title normalization workflow deployed to all target repos
- [ ] PR template resolver deployed to all target repos
- [ ] Repository documentation updated with branch naming rules
- [ ] Test deployments verified (test branches created and validated)
- [ ] No errors in validation workflows
- [ ] All team members aware of deployment
- [ ] PR merged

## Test Scenarios

1. **Test branch validation in target repo:**
   - Create `feat/test-feature` branch → Should pass
   - Create `claude/test-feature` branch → Should fail with message

2. **Test title normalization:**
   - Create PR with unformatted title → Should be normalized

3. **Test PR template routing:**
   - Create PR from `feat/*` branch linked to feature issue → Should use correct template

4. **Test on multiple repos:**
   - Repeat above tests on 2-3 target repos to confirm consistency

## Related Issues

- Issue 4.2 — Establish organization-wide policy (dependency: policy must exist first)
- Issue 4.3 — Team training (dependency: teams need training on governance rules)
- Issue 3.2 — PR-issue linking enforcement (dependency: linking must exist)

## Related Documentation

- `.github/workflows/validate-branch-names.yml` — Branch validation workflow
- `.github/workflows/normalize-pr-titles.yml` — Title normalization
- `.github/workflows/pr-template-resolver.yml` — Template routing fallback
- `docs/BRANCHING_STRATEGY.md` — Branch naming rules
- `.github/instructions/branch-naming.instructions.md` — Detailed guidance

## Success Criteria

- ✅ Branch validation enabled on all target repositories
- ✅ Title normalization running without errors
- ✅ PR template routing working correctly
- ✅ Zero manual workarounds required
- ✅ All teams aware of governance rules in their repositories

## Effort Estimate

**2-3 hours** — Mostly copy/paste and testing. Configuration per repo varies.

## Timeline

**Week 1 of Phase 4** — Start after policy established (Issue 4.2), parallel to training (Issue 4.3)

---

**OpenSpec Document Version:** 1.0  
**Created:** 2026-09-03  
**Phase:** 4 (Governance Deployment)  
**Status:** Draft

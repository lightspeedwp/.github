---
title: "G-5: Lint Enforcement & Protected Branch Setup"
labels: ["enhancement", "cicd"]
assignees: []
---

## Summary

Configure protected branches and enforce lint checks as required status checks for all PRs to develop and main branches.

## Acceptance Criteria

- [ ] Configure protected branch rules for `develop`:
  - [ ] Require status checks to pass before merging
  - [ ] Make `lint` workflow a required check
  - [ ] Require branches to be up to date before merging
  - [ ] Require pull request reviews (at least 1)
- [ ] Configure protected branch rules for `main`:
  - [ ] Same as develop, plus:
  - [ ] Require `release` workflow to pass
  - [ ] Restrict who can push to main
- [ ] Document branch protection rules
- [ ] Verify `.github/workflows/lint.yml` runs on all PRs
- [ ] Add badge to README showing lint status

## Implementation Notes

- Reference `docs/RELEASE-PROCESS.md:3` for lint gate requirement
- Lint workflow defined in `.github/workflows/lint.yml`
- Consider using CODEOWNERS for automatic review requests
- Follow LightSpeed branch strategy (develop → main)

## Related Files

- `.github/workflows/lint.yml`
- `docs/RELEASE-PROCESS.md`
- `CODEOWNERS`

## Configuration Steps

1. Navigate to repository Settings → Branches
2. Add branch protection rule for `develop`
3. Add branch protection rule for `main`
4. Enable required status checks
5. Test with a test PR

## Testing Requirements

- [ ] Create test PR to develop without passing lint
- [ ] Verify PR is blocked from merging
- [ ] Fix lint issues and verify PR becomes mergeable
- [ ] Test main branch protection

## Dependencies

- None (foundational for other workflows)
- Referenced by G-1 (Release Agent) for lint gate

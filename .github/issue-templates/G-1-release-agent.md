---
title: "G-1: Release Agent Implementation"
labels: ["🚀 promotion-ready", "enhancement", "aiops"]
assignees: []
---

## Summary

Implement `.github/agents/release.agent.js` to automate the release process from develop → main with proper gating and metrics.

## Acceptance Criteria

- [ ] Create `.github/agents/release.agent.js` that:
  - [ ] Accepts `--scope` parameter for comma-separated package scope
  - [ ] Supports `--dry-run` flag for testing
  - [ ] Validates lint passes before proceeding
  - [ ] Updates VERSION file
  - [ ] Generates/updates CHANGELOG.md
  - [ ] Creates release PR from develop to main
  - [ ] Creates git tag on merge
- [ ] Integrate with `.github/workflows/release.yml`
- [ ] Document usage in `docs/RELEASE-PROCESS.md`
- [ ] Add error handling and rollback support
- [ ] Emit metrics on success/failure

## Implementation Notes

- Reference existing workflow structure in `release.yml:28-30`
- Ensure lint gate is a hard requirement (see `release.yml:13`)
- Follow LightSpeed coding standards
- Use UK English in all documentation

## Related Files

- `.github/workflows/release.yml`
- `docs/RELEASE-PROCESS.md`
- `VERSION`
- `CHANGELOG.md`

## Testing Requirements

- [ ] Test dry-run mode
- [ ] Test with partial scope
- [ ] Test with full release
- [ ] Verify lint gate enforcement
- [ ] Verify metrics emission

## Dependencies

- Requires G-2 (Changelog Utilities) for changelog parsing
- Requires G-4 (Version Sync Script) for VERSION management
- Requires G-5 (Lint Enforcement) for protected branch setup

---
title: "G-3: Manage READMEs Agent Implementation"
labels: ["🚀 promotion-ready", "enhancement", "documentation"]
assignees: []
---

## Summary

Implement `.github/agents/manage-readmes.agent.js` to automate README management, front-matter validation, and coverage tracking.

## Acceptance Criteria

- [ ] Create/update `.github/agents/manage-readmes.agent.js` that:
  - [ ] Supports `--verify` flag to check coverage
  - [ ] Validates front-matter schema in all markdown files
  - [ ] Tracks readme_targets_updated/expected metrics
  - [ ] Fails if coverage is below 100%
  - [ ] Updates README files based on canonical target list
- [ ] Integrate with `.github/workflows/manage-readmes.yml`
- [ ] Document target list in `docs/MANAGE-READMES.md`
- [ ] Add front-matter schema validation
- [ ] Add link checking integration

## Implementation Notes

- Reference target list in `docs/MANAGE-READMES.md:7-10`
- Emit coverage metrics in format: `readme_targets_updated/expected`
- Support both automated updates and verification mode
- Include placeholder for link checker integration (see `manage-readmes.yml:18-21`)

## Related Files

- `.github/workflows/manage-readmes.yml`
- `docs/MANAGE-READMES.md`
- `README.md`
- `docs/**/README.md`

## Testing Requirements

- [ ] Test --verify flag
- [ ] Test front-matter validation
- [ ] Test coverage calculation
- [ ] Test failure when coverage < 100%
- [ ] Test with various README locations

## Dependencies

- Works with G-7 (Schema Validation) for front-matter checks
- Works with G-8 (Link Checker) for broken link detection

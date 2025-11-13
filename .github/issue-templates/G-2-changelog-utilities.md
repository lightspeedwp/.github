---
title: "G-2: Changelog Utilities Implementation"
labels: ["🚀 promotion-ready", "enhancement", "aiops"]
assignees: []
---

## Summary

Implement `.github/agents/includes/changelogUtils.js` to provide parsing, validation, and manipulation utilities for CHANGELOG.md files.

## Acceptance Criteria

- [ ] Create `.github/agents/includes/changelogUtils.js` that:
  - [ ] Validates CHANGELOG.md schema (sections in correct order)
  - [ ] Parses CHANGELOG.md into structured data
  - [ ] Validates required sections: Added, Changed, Deprecated, Fixed, Security
  - [ ] Validates PR links format
  - [ ] Supports `--validate` CLI flag
- [ ] Integrate with `.github/workflows/changelog.yml`
- [ ] Add comprehensive error messages for validation failures
- [ ] Support both reading and writing changelog entries

## Implementation Notes

- Follow Keep a Changelog format (https://keepachangelog.com/)
- Sections must be in exact order: Added, Changed, Deprecated, Fixed, Security
- See `.github/prompts/generate-changelog.prompts.md` for section specifications
- Use Node.js for implementation
- Include unit tests

## Related Files

- `.github/workflows/changelog.yml`
- `.github/prompts/generate-changelog.prompts.md`
- `CHANGELOG.md`

## Testing Requirements

- [ ] Test valid CHANGELOG.md parsing
- [ ] Test invalid section order detection
- [ ] Test missing section detection
- [ ] Test PR link validation
- [ ] Test CLI --validate flag

## Dependencies

- Required by G-1 (Release Agent)
- Works with G-7 (Schema Validation)

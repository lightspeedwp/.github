---
title: "G-7: Schema Validation for Front-matter & Changelog"
labels: ["enhancement", "validation"]
assignees: []
---

## Summary

Implement schema validation for YAML front-matter in markdown files and CHANGELOG.md structure to ensure consistency and correctness.

## Acceptance Criteria

- [ ] Create front-matter schema validator:
  - [ ] Define JSON Schema for markdown front-matter
  - [ ] Validate required fields (title, description, etc.)
  - [ ] Validate field types and formats
  - [ ] Provide clear error messages
- [ ] Create changelog schema validator:
  - [ ] Validate section order (Added, Changed, Deprecated, Fixed, Security)
  - [ ] Validate PR link formats
  - [ ] Validate version format
- [ ] Integrate with workflows:
  - [ ] Add to `manage-readmes.yml:15-17`
  - [ ] Add to `changelog.yml:14-16`
- [ ] Document schema requirements

## Implementation Notes

- Replace placeholder in `manage-readmes.yml:16-17` with actual validation
- Use JSON Schema for validation (e.g., ajv library)
- Reference `.github/prompts/generate-changelog.prompts.md` for section order
- See existing front-matter examples in docs files
- Consider using existing schemas in `schemas/` directory

## Schema Requirements

### Front-matter Schema
```yaml
title: string (required)
description: string (optional)
version: string (semantic version)
last_updated: date (YYYY-MM-DD)
tags: array of strings
```

### Changelog Schema
- Sections in order: Added, Changed, Deprecated, Fixed, Security
- PR links format: `#123` or full URL
- Version format: `v{major}.{minor}.{patch}`

## Related Files

- `.github/workflows/manage-readmes.yml`
- `.github/workflows/changelog.yml`
- `.github/prompts/generate-changelog.prompts.md`
- `schemas/` (directory for schema definitions)

## Testing Requirements

- [ ] Test valid front-matter validation
- [ ] Test invalid front-matter detection
- [ ] Test changelog schema validation
- [ ] Test error message clarity
- [ ] Test integration with workflows

## Dependencies

- Required by G-2 (Changelog Utilities)
- Required by G-3 (Manage READMEs Agent)

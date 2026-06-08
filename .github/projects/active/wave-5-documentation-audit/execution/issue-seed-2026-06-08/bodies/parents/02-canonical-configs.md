## Overview

Comprehensive audit of canonical configuration files that define labels, issue types, issue fields, and automation relationships.

## In-Scope

- Validate consistency across `.github/labels.yml`, `.github/issue-types.yml`, `.github/issue-fields.yml`, and `.github/labeler.yml`
- Audit colour strategy and label family coherence
- Confirm issue type and template alignment
- Confirm issue fields and automation compatibility

## Out-of-Scope

- Non-canonical label sets outside repository governance files
- UI-only edits that do not affect canonical mappings

## Current Problems

1. Label strategy consistency is unclear at scale.
2. Type-template-label mapping has potential drift.
3. Issue fields usage and automation compatibility are not fully documented.
4. Config interdependencies are not represented as a single source of truth.

## Acceptance Criteria

- [ ] Label colours and families validated against strategy
- [ ] Issue types aligned to templates and labels
- [ ] Issue fields validated for expected usage
- [ ] Config interdependencies documented
- [ ] Deprecations/removals identified

## Deliverables

- Config validation report
- Mapping tables (type-template-label-field)
- Dependency diagram and guide
- Prioritised remediation plan

## Related Files

- `.github/labels.yml`
- `.github/labeler.yml`
- `.github/issue-types.yml`
- `.github/issue-fields.yml`
- `docs/LABEL_STRATEGY.md`
- `docs/LABELING.md`
- `docs/ISSUE_TYPES.md`
- `docs/ISSUE_FIELDS.md`
- `docs/CANONICAL_CONFIGS_GUIDE.md`

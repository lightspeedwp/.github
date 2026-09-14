# Changelog Validation Rules Catalogue

**Status**: Phase 1 - Outline (rules implemented in Phase 2)

Reference guide for all 20 validation rules in the Changelog Quality Audit system.

## Rules Overview

| ID | Name | Type | Severity | Purpose |
|----|------|------|----------|---------|
| R001 | no_implementation_details | content | error | Reject code patterns, API names, framework references |
| R002 | has_category | structure | error | Entry must specify category |
| R003 | has_title | structure | error | Entry must have descriptive title |
| R004 | has_description | structure | error | Entry must have user-facing description |
| R005 | clear_language | content | warning | Avoid jargon; use simple, active voice |
| R006 | proper_formatting | format | error | Valid YAML/Markdown syntax |
| R007 | no_backticks | content | error | No code blocks or inline code |
| R008 | no_internal_terminology | content | error | No internal project terms |
| R009 | has_pr_reference | reference | warning | Should reference a PR or issue |
| R010 | valid_pr_reference | reference | error | PR references must exist on GitHub |
| R011 | meaningful_description | content | warning | Description should be substantive (20+ chars) |
| R012 | user_focused | content | warning | Describe user benefit, not implementation |
| R013 | no_emoji | content | warning | Avoid emoji in formal changelog |
| R014 | consistent_tense | content | warning | Use consistent past/present tense |
| R015 | proper_dates | format | error | Dates must be ISO 8601 format |
| R016 | no_todos | content | error | No TODO or FIXME in final entries |
| R017 | appropriate_length | content | warning | Description should be 1-3 sentences |
| R018 | no_personal_pronouns | content | warning | Avoid "I", "we", "you"; use passive voice |
| R019 | no_marketing_hype | content | warning | Avoid superlatives ("amazing", "revolutionary") |
| R020 | valid_category | structure | error | Category must be in allowed list |

## Rule Details

[Full rule details with examples and remediation guidance to follow in Phase 2]

### Severities

- **error**: Rule failure blocks compliance (entry marked as failing)
- **warning**: Rule failure noted but non-blocking (advisory improvement)

### Rule Types

- **format**: Syntax and encoding checks
- **structure**: Schema validation (required fields, valid values)
- **content**: Semantic checks (clarity, language quality)
- **reference**: Link validation (PR/issue references)

### Valid Categories

Entries must specify one of:
- `feature` - New functionality
- `fix` - Bug fix
- `improvement` - Enhancement to existing feature
- `breaking-change` - API or behaviour change requiring migration
- `security` - Security issue resolution
- `performance` - Performance optimization

## Examples by Rule

[Before/after examples for each rule to follow in Phase 2]

---

**Implementation Status**: 
- ✓ Phase 1: Rule catalogue (this outline)
- ⏳ Phase 2: Full rule implementation
- ⏳ Phase 3+: Usage examples in each phase

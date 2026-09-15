# Changelog Validation Rules Catalogue

<!-- BADGES-START -->
![Checks](https://img.shields.io/badge/Checks-OK-success.svg)
![Docs Validation](<https://img.shields.io/badge/Docs> Validation-OK-success.svg)
![GitLeaks](https://img.shields.io/badge/GitLeaks-OK-success.svg)
![Labeling Governance](<https://img.shields.io/badge/Labeling> Governance-OK-success.svg)
![Main Branch Guard](<https://img.shields.io/badge/Main> Branch Guard-OK-success.svg)
![Metadata Governance](<https://img.shields.io/badge/Metadata> Governance-OK-success.svg)
![Release](https://img.shields.io/badge/Release-OK-success.svg)
![Template Enforcement](<https://img.shields.io/badge/Template> Enforcement-OK-success.svg)
![Validate PR Template](<https://img.shields.io/badge/Validate> PR Template-OK-success.svg)
![Badges: Documentation Update](<https://img.shields.io/badge/Badges>: Documentation Update-OK-success.svg)
![Badges: Health Check](<https://img.shields.io/badge/Badges>: Health Check-OK-success.svg)
![Badges: README Status Maintenance](<https://img.shields.io/badge/Badges>: README Status Maintenance-OK-success.svg)
![Badges: Workflow Inventory Audit](<https://img.shields.io/badge/Badges>: Workflow Inventory Audit-OK-success.svg)
[![branch-management](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/branch-management.yml)
[![changelog-management](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-management.yml)
[![changelog-validation](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/changelog-validation.yml)
[![documentation](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/documentation.yml)
[![events-issue-pr-metadata](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/events-issue-pr-metadata.yml)
[![issue-management](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/issue-management.yml)
[![pr-workflow](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/pr-workflow.yml)
[![project-management](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/project-management.yml)
[![release-orchestration](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/release-orchestration.yml)
[![reporting-metrics](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml/badge.svg?branch=develop)](https://github.com/lightspeedwp/.github/actions/workflows/reporting-metrics.yml)
<!-- BADGES-END -->

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

## Detailed Rule Descriptions

### Format Rules (R006, R015)

#### R006: proper_formatting (error)

**Purpose**: Ensure entries are valid YAML/Markdown syntax

**Failing Example**:

```
category: feature
title: Missing colon on next line
description This breaks YAML parsing
```

**Passing Example**:

```yaml
category: feature
title: Add export feature
description: Users can export data in CSV format.
```

**Remediation**: Check for correct YAML indentation, missing colons after keys, unclosed strings, and valid syntax.

#### R015: proper_dates (error)

**Purpose**: Dates must follow ISO 8601 format (YYYY-MM-DD)

**Failing Example**: `date: 09/14/2026` or `date: September 14, 2026`

**Passing Example**: `date: 2026-09-14`

**Remediation**: Convert date to YYYY-MM-DD format. Use: `date: 2026-09-14`

---

### Structure Rules (R002, R003, R004, R020)

#### R002: has_category (error)

**Purpose**: Every entry must specify a category

**Failing Example**:

```yaml
title: Fix login issue
description: Fixed authentication timeout.
```

**Passing Example**:

```yaml
category: fix
title: Fix login issue
description: Fixed authentication timeout.
```

**Remediation**: Add `category:` field with one of: feature, fix, improvement, breaking-change, security, performance.

#### R003: has_title (error)

**Purpose**: Every entry must have a descriptive one-line title

**Failing Example**:

```yaml
category: feature
description: This is the description of the change.
```

**Passing Example**:

```yaml
category: feature
title: Add user export functionality
description: This is the description of the change.
```

**Remediation**: Add `title:` field with a clear, concise description of what changed (typically 3-8 words).

#### R004: has_description (error)

**Purpose**: Every entry must have a user-facing description

**Failing Example**:

```yaml
category: fix
title: Fixed issue
```

**Passing Example**:

```yaml
category: fix
title: Fixed login timeout issue
description: Increased session timeout from 15 to 30 minutes, preventing users from being logged out during long operations.
```

**Remediation**: Add `description:` field with a 1-3 sentence explanation of what changed and why users should care.

#### R020: valid_category (error)

**Purpose**: Category must be from the allowed list

**Failing Example**: `category: bugfix` (should be `fix`)

**Passing Examples**: `category: feature`, `category: fix`, `category: improvement`, `category: breaking-change`, `category: security`, `category: performance`

**Remediation**: Use one of the six valid categories listed above.

---

### Content Rules (R001, R005, R007, R008, R011, R012, R013, R014, R016, R017, R018, R019)

#### R001: no_implementation_details (error)

**Purpose**: Reject code patterns, API names, framework-specific references

**Failing Example**:

```
title: Updated parseJSON function
description: Refactored parseJSON() in api/response.js to use new regex pattern /\d+/g.
Updated the REST endpoint handler to use async/await instead of promises.
```

**Passing Example**:

```
title: Improved API response handling
description: API responses now handle edge cases more reliably. Users will experience fewer errors when working with large datasets.
```

**Remediation**: Remove code examples, method names, file paths, and technical implementation details. Focus on user impact.

#### R005: clear_language (warning)

**Purpose**: Avoid jargon and use simple, active voice

**Failing Example**: "Refactored the architecture to optimize performance via algorithmic paradigm enhancement."

**Passing Example**: "Made searches faster and more reliable."

**Remediation**: Replace technical terms with plain language. Use active voice (X now does Y) instead of passive (Y is now done by X).

#### R007: no_backticks (error)

**Purpose**: No inline code or code blocks with backticks

**Failing Example**:

```
description: Fixed bug in `checkValue()` function. Users can now use `export()` command.
```

**Passing Example**:

```
description: Fixed a validation bug. Users can now export their data in multiple formats.
```

**Remediation**: Remove all backticks. Describe functionality in plain language without showing code.

#### R008: no_internal_terminology (error)

**Purpose**: No internal project terms or technical acronyms

**Failing Example**: "Improved the ORM layer. CRUD operations now use the new GraphQL API schema."

**Passing Example**: "Made it faster and easier to create, read, update, and delete records."

**Remediation**: Replace internal terms with end-user language that non-technical people understand.

#### R011: meaningful_description (warning)

**Purpose**: Description must be at least 20 characters

**Failing Example**: "Fixed bug."

**Passing Example**: "Fixed authentication bug where users were incorrectly logged out after 15 minutes of inactivity."

**Remediation**: Expand description with more detail about what changed and why it matters.

#### R012: user_focused (warning)

**Purpose**: Describe user benefit, not implementation

**Failing Example**: "Refactored the query builder and optimized database indices."

**Passing Example**: "Searches now return results 50% faster, improving user experience."

**Remediation**: Focus on what users will notice and benefit from, not how you built it.

#### R013: no_emoji (warning)

**Purpose**: Avoid emoji in formal changelog

**Failing Example**: "Added export feature 🎉 so users can ✨ export their data 📊"

**Passing Example**: "Added export feature so users can export their data in multiple formats."

**Remediation**: Remove all emoji from the entry.

#### R014: consistent_tense (warning)

**Purpose**: Use consistent past or present tense

**Failing Example**: "Fixed bugs. Users can now export data. We have improved performance."

**Passing Example**: "Fixed bugs that prevented data export. Improved performance by 30%."

**Remediation**: Choose either past tense (Fixed, Added) or present perfect (is now, has been) and use consistently.

#### R016: no_todos (error)

**Purpose**: No TODO or FIXME comments in final entries

**Failing Example**: "Fixed issue. TODO: add more details. FIXME: test thoroughly."

**Passing Example**: "Fixed issue where users could not export data. Tested across all major browsers."

**Remediation**: Remove all TODO, FIXME, XXX, HACK comments. Entries must be complete and ready for release.

#### R017: appropriate_length (warning)

**Purpose**: Description should be 1-3 sentences

**Failing Example**: "Fixed this. Fixed that. Fixed another thing. And another. And one more."

**Passing Example**: "Fixed multiple issues affecting data export. Users can now reliably export to CSV and JSON formats."

**Remediation**: Keep description concise (1-3 sentences). Split into multiple entries if needed.

#### R018: no_personal_pronouns (warning)

**Purpose**: Avoid I, we, you; use passive/third person

**Failing Example**: "We've improved performance so you can export faster. I fixed the bug."

**Passing Example**: "Performance improved by 30%, making exports faster. Authentication bug fixed."

**Remediation**: Remove pronouns. Use passive voice or refer to the feature/user in third person.

#### R019: no_marketing_hype (warning)

**Purpose**: Avoid superlatives and marketing language

**Failing Example**: "Amazing new feature! Revolutionary export functionality. The best performance upgrade ever!"

**Passing Example**: "Added export feature supporting CSV and JSON formats. Performance improved by 30%."

**Remediation**: Use neutral, factual language. Replace superlatives with specific, measurable benefits.

---

### Reference Rules (R009, R010)

#### R009: has_pr_reference (warning)

**Purpose**: Should reference PR or issue for traceability

**Failing Example**:

```yaml
category: fix
title: Fixed login issue
description: Fixed authentication timeout problem.
```

**Passing Example**:

```yaml
category: fix
title: Fixed login issue
description: Fixed authentication timeout problem. See #1234 for details.
pr: '#1234'
```

**Remediation**: Add reference to related PR or issue using format `#1234` or `pr: '#1234'` field.

#### R010: valid_pr_reference (error)

**Purpose**: PR references must exist and be accessible

**Failing Example**: References to `#9999` (non-existent PR) or malformed references

**Passing Example**: References to existing PR: `#1234`, `#2891`, etc.

**Remediation**: Verify PR/issue numbers reference real, existing pull requests or issues on GitHub.

---

---

**Implementation Status**:

- ✓ Phase 2: Full rule descriptions with examples (this document)
- ⏳ Phase 3+: Usage examples in release notes

**Implementation Status**:

- ✓ Phase 1: Rule catalogue (this outline)
- ⏳ Phase 2: Full rule implementation
- ⏳ Phase 3+: Usage examples in each phase

*Have questions? Ping us on GitHub! 🐙 Made with 💚 by LightSpeedWP*

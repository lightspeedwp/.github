---
title: CodeRabbit Configuration Specification
description: Validated CodeRabbit v2 schema configuration for lightspeedwp/.github governance repository
version: '1.0'
last_updated: '2026-08-21'
file_type: documentation
authors:
  - LightSpeed Team
maintainer: LightSpeed Team
status: active
domain: governance
stability: stable
tags:
  - coderabbit
  - ci
  - automation
  - schema-v2
---

# CodeRabbit Configuration Specification

## Overview

This document specifies the CodeRabbit v2 schema configuration for the `lightspeedwp/.github` repository. CodeRabbit provides automated code review capabilities tailored to the governance and automation nature of this repository.

## Configuration Location

**File**: `/.coderabbit.yml`

**Schema**: [CodeRabbit v2](https://coderabbit.ai/integrations/schema.v2.json)

## Validation Status

✅ **Validated**: 2026-06-03 against CodeRabbit v2 schema

### Previously Reported Issues (FIXED)

The following unrecognized properties were reported and have been **identified and fixed**:

- ~~`auto_labels`~~ (removed from schema overrides)
- ~~`auto_assign`~~ (removed from schema overrides)
- ~~`auto_review`~~ (removed from schema overrides)

**Root Cause**: These properties were defined in:

1. `/schemas/coderabbit-overrides.v2.json` - invalid schema override requiring non-existent property
2. `/scripts/validation/__fixtures__/valid-coderabbit.yml` - test fixture using invalid property

**Resolution Applied**:

1. ✅ Removed `auto_review` from schema override required fields
2. ✅ Updated test fixture to use valid CodeRabbit v2 properties
3. ✅ Kept `path_filters` as only required override property
4. ✅ Validated fixture against corrected schema

## Core Configuration

### Internationalization

```yaml
language: "en-GB"
inheritance: true
```

- **Language**: UK English (consistent with organisation standard)
- **Inheritance**: Enabled for reuse across repositories

### Chat Configuration

```yaml
chat:
  auto_reply: true
```

- **Auto-reply**: Enabled for faster feedback on pull requests

### Review Configuration

```yaml
reviews:
  profile: "chill"
  request_changes_workflow: true
  high_level_summary: true
  review_status: true
  review_details: true
  collapse_walkthrough: true
  poem: false
```

**Review Behavior**:

- **Profile**: `chill` — Reduce noise; prefer high-signal comments only
- **Workflow Integration**: Request changes when appropriate
- **Summary**: Generate high-level summaries of changes
- **Status**: Display review status and details
- **Walkthrough**: Collapse detailed walkthrough for brevity
- **Tone**: No poems (keep professional tone)

### Path Filters (Exclusions)

The following paths are excluded from CodeRabbit review:

```yaml
path_filters:
  - "!build/**"           # Compiled artifacts
  - "!node_modules/**"    # Dependencies
  - "!assets/css/*.map"   # Source maps
  - "!logs/**"            # Runtime logs
  - "!docs/drafts/**"     # Draft documentation
  - "!schemas/**"        # Schema definitions
  - "!coverage/**"        # Test coverage reports
  - "!.jest-skip/**"      # Skipped test artifacts
```

**Rationale**: Exclude generated, compiled, and non-source files to focus reviews on actual code and documentation.

## Path-Specific Review Instructions

The configuration includes 10 specialized review rules optimized for different file types in this governance repository:

### 1. AI Assets (General) - `.github/prompts/**`

**Focus**: Concise, actionable reviews respecting documented style.

**Key Points**:

- Prefer clear, modular prompt design
- Link suggested fixes
- Maintain consistency with prompt conventions

### 2. Agent Specifications - `.github/agents/**`

**Focus**: Correctness, completeness, and implementation status.

**Validation Checklist**:

- ✅ YAML frontmatter complete (version, last_updated, owners, tags, file_type, status, domain, stability, permissions)
- ✅ Spec includes: Purpose, Operating Modes/Workflow, Dependencies, Implementation Status, Changelog
- ✅ No `references:` frontmatter field (prohibited by CLAUDE.md)
- ✅ Implementation files have shebang, header, and test coverage

### 3. Copilot & Custom Instructions - `.github/custom-instructions.md`

**Focus**: Navigability, accuracy, and cross-referencing.

**Validation Checklist**:

- ✅ Easy navigation and currency with org standards
- ✅ Complete, accurate YAML frontmatter
- ✅ Cross-references to prompts.md, agent.md, AGENTS.md, instruction files
- ✅ Up-to-date Copilot usage documentation

### 4. Prompt Library - `.github/prompts/prompts.md`

**Focus**: Discoverability and dynamic indexing.

**Validation Checklist**:

- ✅ Documents prompt conventions and usage patterns
- ✅ Dynamic index reference to all *.prompt.md files
- ✅ Valid YAML frontmatter with updated date/version
- ✅ All prompts are discoverable from index

### 5. Individual Prompts - `.github/prompts/*.md`

**Focus**: Clarity, structure, and completeness.

**Validation Checklist**:

- ✅ Clear instructions, examples, and checklist sections
- ✅ Correct YAML frontmatter
- ✅ Referenced in prompts index
- ✅ Valid structure and naming conventions

### 6. Portable Instructions - `instructions/**`

**Focus**: Standards compliance and portability.

**Validation Checklist**:

- ✅ Frontmatter follows canonical pattern
- ✅ No `references:` field (prohibited)
- ✅ Includes: Overview, General Rules, Detailed Guidance, Examples, Validation, Cross-References
- ✅ UK English throughout

### 7. Package Configuration - `**/package.json`, `**/composer.json`

**Focus**: Security, dependency management, and standards.

**Package.json Checks**:

- ✅ Security vulnerabilities identified
- ✅ Scripts documented with clear names
- ✅ Semantic versioning validation
- ✅ DevDependencies vs dependencies separation

**Composer.json Checks**:

- ✅ WordPress compatibility
- ✅ Security best practices
- ✅ PSR-4 autoloading compliance
- ✅ PHPCS/PHPStan compatibility

### 8. Source Code - `**/*.{js,ts}`, `**/scripts/**/*.sh`

**JavaScript/TypeScript**:

- ✅ Linting compliance
- ✅ Dead code and unused variables
- ✅ Accessibility and performance
- ✅ Test isolation and naming clarity

**Shell Scripts**:

- ✅ POSIX compliance
- ✅ Error handling and exit codes
- ✅ `set -euo pipefail` and shebang present
- ✅ Shellcheck compliance and security

### 9. GitHub Actions Workflows - `**/.github/workflows/*.yml`

**Focus**: Security, best practices, and maintainability.

**Security Checks**:

- ✅ Least-privilege permissions at job level
- ✅ Secrets passed via env vars, not interpolated
- ✅ Action pinning (SHA preferred over tags)
- ✅ No unsafe `pull_request_target` patterns
- ✅ No unmasked sensitive outputs

**Quality Checks**:

- ✅ Reusable workflow patterns
- ✅ Branch/path filters on triggers
- ✅ DRY code with matrix strategies
- ✅ Agent-triggered workflows use `workflow_dispatch`

### 10. Templates & Documentation - Various Paths

**Issue Templates** (`.github/ISSUE_TEMPLATE/*.md`):

- ✅ Valid markdown syntax and clear instructions
- ✅ YAML frontmatter with required fields
- ✅ Accessibility considerations
- ✅ References to related documentation

**PR Templates** (`.github/PULL_REQUEST_TEMPLATE/*.md`):

- ✅ Clear contributor instructions
- ✅ Valid YAML frontmatter
- ✅ Current with latest process

**Saved Replies** (`.github/SAVED_REPLIES/**/*.md`):

- ✅ Valid, actionable markdown
- ✅ YAML frontmatter with dates
- ✅ Referenced from index

**Documentation** (`**/docs/**/*.md`):

- ✅ Markdown linting compliance
- ✅ Logical folder structure
- ✅ Up-to-date accuracy
- ✅ Accessibility and UK English

## Configuration Validation Results

### Schema Validation: ✅ PASS

- **Schema Version**: v2
- **Validation Date**: 2026-06-03
- **Status**: All properties recognized and valid
- **Warnings**: None (previously reported unrecognized properties not present)

### Best Practices Review: ✅ PASS

- **Language Setting**: ✅ UK English
- **Path Filters**: ✅ Appropriate for governance repo
- **Path Instructions**: ✅ Comprehensive and governance-focused
- **Review Profile**: ✅ `chill` appropriate for this repo type
- **Integration**: ✅ Chat auto-reply enabled for responsiveness

## Recommendations for Future Updates

1. **Monitor CodeRabbit Updates**: Regularly check for schema changes
2. **Path Instruction Maintenance**: Update instructions as new file types are added
3. **Team Feedback**: Collect feedback on review quality and adjust profile if needed
4. **Documentation**: Keep this specification in sync with actual configuration

## References

- **CodeRabbit Documentation**: [https://docs.coderabbit.ai/guides/configure-coderabbit](https://docs.coderabbit.ai/guides/configure-coderabbit)
- **Schema Validator**: [https://docs.coderabbit.ai/configuration/yaml-validator](https://docs.coderabbit.ai/configuration/yaml-validator)
- **Configuration File**: `/.coderabbit.yml`
- **Repository Issue**: #783

## Related Files

- `.coderabbit.yml` — Actual configuration file
- `.coderabbit.yaml` — Alternative naming (not used)
- `CLAUDE.md` — Repository-level coding standards
- `AGENTS.md` — Global AI agent rules

---

**Last Validated**: 2026-06-03
**Next Validation**: 2026-12-03 (6-month cadence recommended)
**Maintainer**: LightSpeed Team

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

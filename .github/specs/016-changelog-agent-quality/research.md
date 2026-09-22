# Research: Changelog Agent Quality & Validation Framework

**Feature**: 016-changelog-agent-quality

**Date**: 2026-09-19

**Status**: Research Phase Complete

---

## Executive Summary

This document captures research findings, design decisions, and best practices for the changelog agent quality validation framework. All clarifications from `/speckit-clarify` are resolved and documented here.

---

## Key Research Areas

### 1. Validation Rule Set & Changelog Format Standards

**Decision**: Adopt "Keep a Changelog" (<https://keepachangelog.com>) format as the canonical standard

**Rationale**:

- Already referenced in project documentation (`docs/CHANGELOG_RULES.md`)
- Industry standard with clear versioning, date, and entry structure
- Supports semantic versioning and entry categorization (Added, Changed, Fixed, Deprecated, Removed, Security)
- Well-documented schema with community support

**Validation Rules Identified** (from spec and existing docs):

- Entry length: ≤250 characters (user-focused, actionable)
- Mandatory PR/issue linking: Every entry must link to at least one PR or issue (#NNN or PR-NNN format)
- Formatting: Section headings must match Keep a Changelog structure
- Clarity: No implementation details (no code snippets, no internal architecture references)
- Date format: ISO 8601 (YYYY-MM-DD) in release headers
- Markdown structure: Valid Markdown syntax with proper heading hierarchy

**Source**:

- Existing validation rules in `scripts/validation/changelog-rules.cjs`
- `docs/CHANGELOG_RULES.md` (if exists)
- Keep a Changelog specification (<https://keepachangelog.com>)

---

### 2. Skill Metadata Conformance to agentskills.io Specification

**Decision**: Adopt agentskills.io specification as authoritative source for skill structure

**Rationale**:

- Specification (<https://agentskills.io/specification>) is the industry standard for skill metadata
- Enables cross-agent skill discovery and reusability
- Provides consistent invocation interface (CLI parameters, return formats)
- Supports versioning, error codes, and skill dependencies

**Skill Metadata Structure** (per agentskills.io spec):

```yaml
id: changelog-validate  # Unique identifier
version: 1.0.0          # Semantic versioning
name: Changelog Validate
description: Validates changelog entries against quality standards
triggers:              # When skill should be invoked
  - event: pull_request.opened
    filter: "changelog.md"
inputs:               # Required/optional parameters
  - name: changelog_path
    type: string
    required: true
    description: Path to CHANGELOG.md
outputs:              # What skill returns
  - name: validation_result
    type: object
    schema: ValidationResult
error_handling:       # Defined error codes
  - code: ENTRY_TOO_LONG
    message: Entry exceeds 250 character limit
  - code: MISSING_LINK
    message: Entry missing required PR/issue link
```

**Skills to Implement**:

1. **changelog-validate**: Validate entries against rules
2. **changelog-check-links**: Verify PR/issue links are valid (calls GitHub API)
3. **changelog-merge**: Consolidate multiple changelog entries into release section
4. **changelog-format**: Auto-format entries to conform to Keep a Changelog

**Source**: agentskills.io specification and existing skills in repository

---

### 3. Skill Invocation Patterns & Integration Points

**Decision**: Primary npm CLI commands with optional REST API wrapper (as clarified in /speckit-clarify)

**Rationale**:

- Matches existing repository patterns (npm scripts for development)
- Enables local developer validation without CI dependency
- CLI is simplest integration point for GitHub Actions workflows
- Optional REST API for future external agent integration

**Invocation Methods**:

1. **npm CLI** (PRIMARY):

   ```bash
   npm run changelog:validate --changelog-path ./CHANGELOG.md
   npm run changelog:check-links --changelog-path ./CHANGELOG.md
   npm run changelog:merge --version 1.0.0 --changelog-path ./CHANGELOG.md
   ```

2. **REST API** (OPTIONAL, future):

   ```bash
   POST /api/skills/changelog-validate
   { "changelog_path": "./CHANGELOG.md" }
   ```

3. **Direct Function Import** (NOT PRIMARY, but possible):

   ```javascript
   const { validateChangelog } = require('./skills/validate');
   const result = await validateChangelog({ changelogPath: './CHANGELOG.md' });
   ```

**Integration Points**:

- Local development: npm scripts in `package.json`
- GitHub Actions workflow: npm run commands in `.github/workflows/changelog-*.yml`
- PR comment feedback: Workflow outputs result to PR comments
- Labeling system: Workflow applies labels based on validation result

**Source**: CLAUDE.md (npm-based repo), existing agent patterns, /speckit-clarify feedback

---

### 4. Validation Tool Error Reporting & Developer Experience

**Decision**: Structured error reporting with actionable fix suggestions

**Rationale**:

- Reduces developer friction (no need to consult documentation for every error)
- Enables parsing by CI/CD systems and IDEs
- Supports both human-readable and machine-readable formats

**Error Report Format**:

```json
{
  "valid": false,
  "summary": "3 validation errors found",
  "entries": [
    {
      "line_number": 15,
      "entry_id": "entry_1",
      "valid": false,
      "errors": [
        {
          "type": "LENGTH",
          "message": "Entry exceeds 250-character limit",
          "actual": "262 characters",
          "expected": "≤250 characters",
          "current_value": "Added support for OAuth2 authentication with provider...",
          "suggestion": "Shorten entry to focus on user-facing benefit, not implementation details"
        },
        {
          "type": "MISSING_LINK",
          "message": "Entry missing required PR/issue link",
          "expected": "Format: #123 or PR-456",
          "suggestion": "Add PR link to entry (e.g., '#2845') or create issue if missing"
        }
      ],
      "warnings": []
    }
  ],
  "stats": {
    "total_entries": 5,
    "valid_entries": 2,
    "invalid_entries": 3,
    "validation_time_ms": 245
  }
}
```

**Human-Readable Format** (for console output):

```
❌ Changelog Validation FAILED (3 errors)

Line 15: Entry exceeds 250-character limit
  Current: 262 characters
  Expected: ≤250 characters
  Content: "Added support for OAuth2 authentication with provider..."
  Fix: Shorten to focus on user-facing benefit, not implementation

Line 22: Entry missing required PR/issue link
  Expected: Format #123 or PR-456
  Fix: Add PR link (e.g., '#2845') or create issue if missing

✅ Validation complete. Fix issues above and re-run.
```

**Source**: Best practices in error reporting, existing validation scripts, /speckit-clarify requirements

---

### 5. Bypass Mechanism for Automated Commits

**Decision**: Automatic bypass by branch type (chore/ and deps/ branches skip validation)

**Rationale**:

- Reduces friction for routine maintenance (dependency updates, chores)
- Enforces rigor for user-facing changes (feat, fix, docs)
- Aligns with branch naming strategy (CLAUDE.md)
- No manual label application needed

**Bypass Logic**:

```javascript
// In workflow:
const branchType = branch.split('/')[0];  // Extract type from branch name
const skipValidation = ['chore', 'deps'].includes(branchType);

if (!skipValidation) {
  // Run validation and block merge if invalid
} else {
  // Skip validation; log bypass reason
  console.log(`Branch type '${branchType}' bypasses changelog validation`);
}
```

**Affected Branch Types**:

- ✅ Skip: `chore/*`, `deps/*`
- ❌ Require validation: All others (feat, fix, hotfix, release, refactor, docs, test, perf, security, etc.)

**Rationale for Selection**:

- Chores: Often internal refactoring with no user-facing changes
- Deps: Automated dependency updates don't need changelog entries
- All others: User-facing changes require clear changelog documentation

**Source**: Branch naming strategy in CLAUDE.md, /speckit-clarify feedback

---

### 6. Concurrent Skill Execution & Race Condition Prevention

**Decision**: File-level locking with merge operations blocking until validation completes

**Rationale**:

- Prevents corruption of CHANGELOG.md during concurrent writes
- Allows parallel validation operations (read-only, safe)
- Simple implementation using file system locks or Node.js fs locks

**Locking Strategy**:

```javascript
// In changelog agent:
const fs = require('fs');
const path = require('path');

const LOCK_FILE = '.changelog.lock';

async function acquireLock(changelogPath) {
  const lockPath = path.join(path.dirname(changelogPath), LOCK_FILE);
  
  // Wait up to 5 seconds for lock
  for (let i = 0; i < 50; i++) {
    try {
      const fd = fs.openSync(lockPath, 'wx'); // Create if not exists
      fs.closeSync(fd);
      return { acquired: true, lockPath };
    } catch (e) {
      if (e.code === 'EEXIST') {
        await sleep(100);
        continue;
      }
      throw e;
    }
  }
  
  throw new Error('Could not acquire changelog lock after 5 seconds');
}

async function releaseLock(lockPath) {
  try {
    fs.unlinkSync(lockPath);
  } catch (e) {
    console.warn('Warning: Could not release lock file', e);
  }
}
```

**Operation Behaviors**:

- **Validate**: Read-only operation; parallel executions allowed (no lock needed)
- **Check-links**: Read-only operation; parallel executions allowed (no lock needed)
- **Merge**: Write operation; acquires lock; blocks until validation completes (if validation in progress)
- **Format**: Write operation; acquires lock; blocks concurrent operations

**Lock Timeout**: 5 seconds (sufficient for typical validation/merge operations)

**Source**: Concurrent programming best practices, POSIX file locking

---

### 7. Labeling Integration with Canonical Label Set

**Decision**: Apply changelog-related labels from canonical set (`.github/labels.yml`)

**Rationale**:

- Labels must come from canonical set to enable automation and reporting
- Prefix `meta:` distinguishes metadata labels from feature/type labels
- Labels enable filtering PRs by changelog status in dashboards

**Changelog Labels** (to be added/verified in `.github/labels.yml`):

- `meta:has-changelog` — PR has valid changelog entry(ies); validation passed
- `meta:needs-changelog` — PR requires changelog entry; missing or will fail validation
- `meta:needs-changelog-fix` — PR has changelog entries but validation failed; developer action required
- `meta:changelog-exempt` — PR explicitly exempted from changelog requirement (rare, documented)

**Label Application Logic**:

```javascript
// After validation:
if (validationPassed) {
  applyLabel('meta:has-changelog');
  removeLabels(['meta:needs-changelog', 'meta:needs-changelog-fix']);
} else if (validationFailed) {
  applyLabel('meta:needs-changelog-fix');
  removeLabels(['meta:has-changelog']);
  blockMerge('Changelog entries failed validation');
}

// For non-user-facing changes (chore, deps):
if (bypassValidation) {
  applyLabel('meta:changelog-exempt');
}
```

**Label Naming Conventions**:

- Prefix: `meta:` (distinguishes from type:, area:, priority: labels)
- Scope: `changelog` (specific to changelog system)
- Status: `has`, `needs`, `needs-*-fix`, `exempt` (status indicators)

**Source**: Labeling strategy in `docs/LABEL_STRATEGY.md`, Constitution Principle II

---

### 8. Documentation Structure & Parity with prd-agent

**Decision**: Mirror prd-agent documentation structure at `docs/agents/changelog-agent/`

**Rationale**:

- Consistency across agent documentation
- Users familiar with prd-agent docs can navigate changelog-agent docs intuitively
- Enables cross-agent learning and pattern reuse

**Documentation Structure**:

```
docs/agents/changelog-agent/
├── README.md              # Overview, quick start
├── SKILLS.md              # Detailed skill reference
├── INTEGRATION.md         # How to integrate into workflows
├── API.md                 # Detailed API documentation
├── TROUBLESHOOTING.md     # Common issues and fixes
├── EXAMPLES/              # Example workflows
│   ├── local-validation.md
│   ├── github-actions.md
│   └── agent-integration.md
└── ARCHITECTURE.md        # Internal design (optional)
```

**Content Parity Checklist** (vs. prd-agent):

- Overview with use cases ✓
- Quick start guide (5 min) ✓
- Skill reference with parameters ✓
- Integration examples (local, CI, agent) ✓
- Troubleshooting with common errors ✓
- API documentation with curl examples ✓
- Architecture/design notes ✓

**Source**: Existing prd-agent docs at `docs/agents/prd-agent/`

---

## Design Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Changelog Format | Keep a Changelog | Industry standard, already documented |
| Skill Metadata | agentskills.io spec | Cross-agent compatibility |
| Invocation | npm CLI primary + REST API optional | Matches repo patterns, developer-friendly |
| Error Reporting | Structured JSON + human-readable | Machine-parseable and user-friendly |
| Bypass Strategy | Automatic by branch type | Reduces friction for chores/deps |
| Concurrency | File-level locks on merge | Prevents corruption |
| Labels | Canonical set with meta: prefix | Enables automation and reporting |
| Documentation | Mirror prd-agent structure | Consistency and familiarity |

---

## Implementation Considerations

### Performance Targets

- Validation: <5 seconds locally (SC-001)
- Workflow: <30 seconds from PR creation to result (SC-005)
- Lock acquisition: <5 seconds timeout
- Test coverage: ≥85% (SC-008)

### Security Considerations

- No secrets should be validated in changelog entries
- PR/issue link verification uses GitHub API with auth token
- File-level locks prevent privilege escalation

### Compatibility

- Node.js: ≥18 (ES module support)
- npm: ≥9 (workspaces support if needed)
- GitHub Actions: v1+ runners (standard)

### Migration Path

- Existing validation scripts in `scripts/validation/` can be refactored into skills
- Existing workflows continue to work with new skill interface
- Phased rollout: P1 features first, then P2-P4

---

## Open Questions Resolved

✅ **Q1: Validation bypass mechanism** → Automatic by branch type
✅ **Q2: Skill invocation patterns** → npm CLI primary with optional REST API
✅ **Q3: Concurrent execution strategy** → File-level locks with merge blocking

All clarifications from `/speckit-clarify` incorporated into design decisions above.

---

## Next Steps

1. Generate data-model.md with entity definitions
2. Generate contracts/ with CLI and REST API specs
3. Generate quickstart.md with validation scenarios
4. Proceed to Phase 2: Task decomposition

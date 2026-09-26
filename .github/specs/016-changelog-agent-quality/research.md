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
- Mandatory PR/issue linking: Every entry must link to at least one PR or issue. Only `#NNN` (pull request) and `issues/#NNN` (issue) are resolved by the shipped engine; a bare `PR-NNN` is a human-readable convention that is not machine-validated
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

**Skill definition** (standard Agent Skills frontmatter plus namespaced project metadata):

```yaml
---
name: changelog-validate
description: Validate changelog entries against quality standards when checking a release or pull request.
license: GPL-3.0-or-later
compatibility: Requires Node.js 18 or later and repository file access.
metadata:
  lightspeedwp-version: '1.0.0'
  lightspeedwp-triggers: 'manual,pull_request.opened'
  lightspeedwp-inputs: 'changelog_path:string:optional,output:text|json:optional'
  lightspeedwp-outputs: 'validation_result:object'
  lightspeedwp-error-codes: 'VALIDATION_FAILED'
---
```

`name` and `description` are the required standard fields. `license`,
`compatibility`, and `allowed-tools` are optional standard fields. LightSpeed's
version and invocation contract use namespaced string entries in the standard
`metadata` map; separate `metadata.yml` files are not part of the model.

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
   npm run changelog:validate -- --changelog-path ./CHANGELOG.md
   npm run changelog:check-links -- --changelog-path ./CHANGELOG.md
   npm run changelog:merge -- --version 1.0.0 --changelog-path ./CHANGELOG.md
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
          "error_code": "LENGTH",
          "message": "Entry exceeds 250-character limit",
          "actual_value": "262 characters",
          "expected_format": "≤250 characters",
          "suggestion": "Shorten entry to focus on user-facing benefit, not implementation details",
          "severity": "ERROR"
        },
        {
          "error_code": "MISSING_LINK",
          "message": "Entry missing required PR/issue link",
          "expected_format": "Format: #123 (or issues/#123 for an issue)",
          "suggestion": "Add PR link to entry (e.g., '#2845') or create issue if missing",
          "severity": "ERROR"
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
  Expected: Format #123 (or issues/#123 for an issue)
  Fix: Add PR link (e.g., '#2845') or create issue if missing

✅ Validation complete. Fix issues above and re-run.
```

**Source**: Best practices in error reporting, existing validation scripts, /speckit-clarify requirements

---

### 5. Bypass Mechanism for Automated Commits

**Decision**: Match the shipped gate (Dependabot/docs-bot authors, docs-only diffs, or the `meta:no-changelog` label). Branch-name prefix is not a bypass

**Rationale**:

- Reduces friction for routine maintenance (dependency updates, chores)
- Enforces rigor for user-facing changes (feat, fix, docs)
- Aligns with branch naming strategy (CLAUDE.md)
- No manual label application needed

**Bypass Logic**:

```javascript
// In workflow, mirroring .github/workflows/changelog-unified.yml.
// The branch name is deliberately not consulted: a chore/ branch carrying a code
// diff still needs a changelog entry or the meta:no-changelog label.
const isBotAuthor = ['dependabot[bot]', 'app/dependabot', 'app/lightspeed-docs-bot'].includes(author);
const isDocsOnly = changedFiles.length > 0 && changedFiles.every(f => f.startsWith('docs/') || f.endsWith('.md'));
const skipValidation = isBotAuthor || isDocsOnly || hasNoChangelogLabel;

if (!skipValidation) {
  // Run validation and block merge if invalid
} else {
  // Skip validation; log bypass reason
  console.log(`Bypass reason '${bypassReason}' skips changelog validation`);
}
```

**Bypass Conditions** (as shipped in `changelog-unified.yml`):

- ✅ Skip: Dependabot and docs-bot authors, docs-only diffs (every changed file under `docs/**` or ending in `.md`), and the `meta:no-changelog` label
- ❌ Require validation: everything else. Branch-name prefix is **not** a bypass, so `chore/*` and `deps/*` branches still need a changelog entry or `meta:no-changelog` unless their diff is docs-only

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

**Locking strategy**:

- Prefer an OS-backed advisory reader/writer lock when the runtime and file
  system provide one.
- The portable fallback uses an exclusive coordination mutex, a separate
  exclusive recovery mutex, a writer-intent file, one active-reader marker per
  validation, and an exclusive write-lock file. Every file contains a random
  owner token, PID, hostname, creation time, lease expiry, and last-heartbeat
  time.
- Creation uses exclusive mode (`wx`). The owner refreshes its heartbeat before
  half the lease elapses and removes a file only when its token still matches.
- On `EEXIST`, acquisition reads the owner metadata. A same-host PID that
  responds to signal `0`, or any owner with an unexpired heartbeat lease, is
  active and retains the existing 100 ms retry behaviour for up to 5 seconds.
- A same-host lock is stale only when its lease has expired and the owner PID is
  confirmed dead. A different-host lock is stale only after its lease expires
  and its heartbeat metadata remains unchanged for an additional recovery
  grace period. Corrupt metadata must likewise remain unchanged beyond that
  grace period.
- All contenders that may create, replace, or recover a lock participate in the
  separate exclusive recovery mutex for the critical section that changes a lock
  path. Recovery holds that mutex continuously from stale validation through
  owner-token and inode identity comparison and unlink, including any restore or
  cleanup. This serialises the complete compare-and-remove operation and is
  never a path-based unlink after a separate check (two contenders could both
  pass the check, and the second would delete a new owner's live lock):
  1. Record the stale file's owner token and inode.
  2. `rename()` it to a tombstone unique to this contender
     (`<lock>.stale.<contender-token>`). Rename is atomic, so it moves exactly
     one file, and a contender that loses the race gets `ENOENT`.
  3. Compare the tombstone's inode and token with the recorded values. If they
     match, unlink the tombstone. If not, a new owner's lock was moved:
     restore it with `link(tombstone, lock)` (atomic, fails with `EEXIST` if a
     lock already exists), then unlink the tombstone and retry.
  4. Every owner checks that its token is still in the lock file immediately
     before each write, as a fence. An owner that finds its lock missing or
     replaced aborts without writing.
- The coordination mutex participates in the same recovery protocol. A stale
  coordination mutex is validated and compared under the recovery mutex before
  unlink; the recovery mutex is separate from the coordination mutex, so this
  recovery cannot deadlock. This prevents an abandoned `.changelog.lock` from
  blocking future runs without deleting a live owner's lock.
- The recovery mutex is itself recovered, or the protocol deadlocks: a process
  that exits while holding it leaves every later contender unable to enter the
  protocol at all, so the abandoned `.changelog.recovery.lock` can never be
  removed. The recovery mutex therefore requires an OS-backed lock — an
  `O_CREAT | O_EXCL` lock file, an advisory `flock`, or a named mutex on
  Windows — not the portable stat-and-compare fallback used for `.changelog.lock`.
  If a platform offers no OS-backed primitive, the fallback recovery mutex is
  not used: contenders wait for the OS-released handle instead of attempting
  portable recovery. The portable recovery step applies only to lock files whose
  owner identity and heartbeat are recorded on disk.

**Reader/writer protocol**:

1. **Validate and check-links** acquire the short coordination mutex, verify no
   writer intent or active write lock exists, create a uniquely named active
   reader marker, and release the mutex. They remove their marker after the
   changelog read completes. Multiple readers may be active together.
2. **Merge and Format** acquire the coordination mutex, create writer intent,
   and release the mutex. New readers now wait. The writer waits until every
   active reader marker has been released or safely recovered as stale, then
   acquires the exclusive write lock before reading or writing the changelog.
3. The writer releases its write lock and writer intent in a `finally` block,
   checking the owner token before each removal. This closes the race where a
   merge could otherwise begin after checking for readers while a validation
   begins reading.

**Lock timeout**: Active owners preserve the existing 5-second wait limit.
Timeout errors identify whether a reader, writer intent, or write lock remains
active.

**Source**: Concurrent programming best practices, POSIX file locking

---

### 7. Labeling Integration with Canonical Label Set

**Decision**: Apply changelog-related labels from canonical set (`.github/labels.yml`)

**Rationale**:

- Labels must come from canonical set to enable automation and reporting
- Prefix `meta:` distinguishes metadata labels from feature/type labels
- Labels enable filtering PRs by changelog status in dashboards

**Changelog Labels** (the only two changelog labels in the canonical `.github/labels.yml`):

- `meta:needs-changelog` — PR requires a changelog entry; missing, or validation will fail
- `meta:no-changelog` — PR is exempt from the changelog requirement; refused for high-impact release-related change types

`meta:has-changelog`, `meta:needs-changelog-fix` and `meta:changelog-exempt` are **not** in the canonical set and are not used: passing validation is signalled by *clearing* `meta:needs-changelog`, which avoids adding a label that the locked `labels.yml` does not define.

**Label Application Logic**:

```javascript
// After validation:
if (validationPassed) {
  removeLabel('meta:needs-changelog');
} else if (validationFailed) {
  applyLabel('meta:needs-changelog');
  blockMerge('Changelog entries failed validation');
}

// The label records an author's explicit, auditable exemption. It is never
// applied automatically from the branch name, and it is refused for
// high-impact release-related change types.
if (explicitlyExempt) {
  applyLabel('meta:no-changelog');
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

| Decision         | Choice                              | Rationale                                 |
| ---------------- | ----------------------------------- | ----------------------------------------- |
| Changelog Format | Keep a Changelog                    | Industry standard, already documented     |
| Skill Metadata   | agentskills.io spec                 | Cross-agent compatibility                 |
| Invocation       | npm CLI primary + REST API optional | Matches repo patterns, developer-friendly |
| Error Reporting  | Structured JSON + human-readable    | Machine-parseable and user-friendly       |
| Bypass Strategy  | Match the shipped gate              | Same behaviour users already have         |
| Concurrency      | File-level locks on merge           | Prevents corruption                       |
| Labels           | The two canonical `meta:` labels   | `labels.yml` is locked, so no new labels  |
| Documentation    | Mirror prd-agent structure          | Consistency and familiarity               |

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

✅ **Q1: Validation bypass mechanism** → Match the shipped gate, not branch type
✅ **Q2: Skill invocation patterns** → npm CLI primary with optional REST API
✅ **Q3: Concurrent execution strategy** → File-level locks with merge blocking

All clarifications from `/speckit-clarify` incorporated into design decisions above.

---

## Next Steps

1. Generate data-model.md with entity definitions
2. Generate contracts/ with CLI and REST API specs
3. Generate quickstart.md with validation scenarios
4. Proceed to Phase 2: Task decomposition

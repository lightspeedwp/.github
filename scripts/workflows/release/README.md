---
file_type: "documentation"
title: "Release Workflow Scripts"
description: "Phase 4 Release Agent — Comprehensive release workflow scripts orchestrating version management, Git operations, GitHub releases, and deployment"
version: '1.0.0'
last_updated: '2026-08-21'
owners:
  - Ash Shaw
tags:
  - release
  - workflow
  - automation
  - git
  - github
---

# Release Workflow Scripts

**Phase 4 Release Agent** provides a suite of scripts that orchestrate the complete release workflow: version bumping, branch creation, PR management, Git operations, and GitHub release creation.

These scripts are **wrapped by Phase 5A safety gates** (`run-release-with-gates.cjs`) which validates release safety before execution.

## Architecture Overview

```
Release Workflow (Phase 4 + Phase 5A)
├── Phase 5A: Safety Gates
│   ├── GATE 1: Pre-flight Checks
│   ├── GATE 2: Agentic Score
│   ├── GATE 3: Version Consistency
│   ├── GATE 4: Tag Uniqueness
│   ├── GATE 5: Authorization
│   ├── GATE 6: Integrity Filter
│   └── GATE 7: Approval
│
└── Phase 4: Release Execution
    ├── Version Management
    ├── Branch & PR Management
    ├── Git Operations
    ├── GitHub Release Creation
    └── Release Verification
```

---

## Core Scripts

### 1. `run-release-agent.cjs` (Phase 4 Entry Point)

**Purpose:** Main orchestrator for Phase 4 release workflow

**Responsibilities:**

- Parse input parameters (scope, version, message, etc.)
- Initialize version manager
- Create release branch
- Bump versions in all files
- Create PR to develop
- Monitor PR merge
- Create main release PR
- Create GitHub release
- Create Git tag
- Generate release notes

**Usage:**

```bash
node scripts/workflows/release/run-release-agent.cjs \
  --scope patch \
  --message "Bug fixes and improvements"
```

**Environment Variables:**

```bash
INPUT_SCOPE=patch          # patch, minor, or major
INPUT_VERSION=1.2.4        # Explicit version (overrides scope)
INPUT_MESSAGE="..."        # Release message
INPUT_DRY_RUN=true        # Preview without mutations
```

**Exit Codes:**

- `0` = Success
- `1` = Failure
- `2` = Partial success (some steps completed)

---

### 2. `create-main-release-pr.cjs`

**Purpose:** Create PR from develop to main (for release)

**When Called:** After develop PR is merged and release branch is updated

**Steps:**

1. Create branch `release/v{VERSION}`
2. Update CHANGELOG.md (move [Unreleased] → [VERSION])
3. Update version files (final confirmation)
4. Create PR from release branch to main
5. Set PR title and description

**Inputs:**

- `VERSION` — Version to release (e.g., 1.2.4)
- `RELEASE_NOTES` — Release notes excerpt
- `PR_NUMBER` — Related develop PR number

**Outputs:**

- GitHub PR number
- PR URL
- Branch name

**Example:**

```bash
node scripts/workflows/release/create-main-release-pr.cjs \
  --version 1.2.4 \
  --branch-name release/v1.2.4
```

---

### 3. `create-github-release.cjs`

**Purpose:** Create GitHub Release after main merge

**When Called:** After release branch is merged to main

**Steps:**

1. Verify version tag exists
2. Generate release notes from changelog
3. Create GitHub Release with:
   - Release title (v{VERSION})
   - Release body (changelog excerpt + generated notes)
   - Release assets (if applicable)
4. Set as latest release
5. Generate announcement

**Inputs:**

- `VERSION` — Version released
- `TAG_NAME` — Git tag (e.g., v1.2.4)
- `CHANGELOG_PATH` — Path to CHANGELOG.md

**Outputs:**

- Release ID
- Release URL
- Release notes (formatted)

**Example:**

```bash
node scripts/workflows/release/create-github-release.cjs \
  --version 1.2.4 \
  --tag v1.2.4
```

---

### 4. `post-release-sync.cjs`

**Purpose:** Synchronize repository after release

**When Called:** After GitHub Release is created

**Steps:**

1. Verify version tag is created
2. Update repository metadata
3. Sync branch status
4. Update project boards
5. Generate release summary
6. Clean up temporary branches
7. Create post-release issue (if needed)

**Inputs:**

- `VERSION` — Released version
- `PREVIOUS_VERSION` — Previous version (for comparison)

**Outputs:**

- Sync status
- Cleanup summary
- Metrics

---

### 5. `build-notes-preview.cjs`

**Purpose:** Preview release notes before publishing

**When Called:** During dry-run or before release creation

**Steps:**

1. Parse CHANGELOG.md
2. Extract relevant version entry
3. Generate formatted release notes
4. Include commit summary
5. Include contributor list
6. Format as GitHub Release notes

**Inputs:**

- `VERSION` — Version to preview
- `CHANGELOG_PATH` — Path to CHANGELOG.md
- `FORMAT` — markdown, html, or plain

**Outputs:**

- Formatted release notes
- Changelog excerpt
- Contributor summary

**Example:**

```bash
node scripts/workflows/release/build-notes-preview.cjs \
  --version 1.2.4 \
  --format markdown
```

---

### 6. `trigger-telemetry.cjs`

**Purpose:** Log release trigger attempt and validate authorization

**When Called:** At start of release workflow

**Steps:**

1. Record release attempt (timestamp, actor, scope)
2. Check actor in maintainers team
3. Verify authorization status
4. Save telemetry data
5. Return authorization status

**Outputs:**

- `is_authorized` (boolean)
- `unauthorized_attempts` (counter)
- Telemetry JSON file

**Audit Trail:** Logs stored in `.github/reports/agentic-releases/`

---

### 7. `rollback.cjs`

**Purpose:** Rollback a failed or problematic release

**When Called:** Manually triggered if release has issues

**Steps:**

1. Verify rollback authority
2. Identify release tag
3. Delete GitHub Release
4. Reset main branch to previous release
5. Create rollback PR
6. Generate rollback report
7. Notify team

**Danger Zone:** ⚠️ DESTRUCTIVE OPERATION

- Deletes release tags
- Resets main branch
- Requires explicit confirmation

**Usage:**

```bash
node scripts/workflows/release/rollback.cjs \
  --version 1.2.4 \
  --confirm
```

---

## Integration with Phase 5A Gates

### Call Flow

```
GitHub Workflow Trigger
  ↓
run-release-with-gates.cjs (Phase 5A Wrapper)
  ├─ Run all 7 safety gates
  ├─ Save audit log
  ├─ Check for failures
  │
  └─ All Gates Pass?
      ├─ YES → call Phase 4
      │        ├─ run-release-agent.cjs (main orchestrator)
      │        ├─ create-main-release-pr.cjs
      │        ├─ create-github-release.cjs
      │        ├─ post-release-sync.cjs
      │        └─ Success: Release created
      │
      └─ NO → Provide error report & exit 1
```

### Fallback Mechanism

If Phase 5A gates module is unavailable:

1. Log warning
2. Fall back to Phase 4 directly
3. Skip gate validation (unsafe)
4. Execute release

---

## Configuration Files

### Release Configuration

**File:** Not centralized; parameters passed via environment variables

**Key Variables:**

```bash
INPUT_SCOPE=patch              # Release scope
INPUT_VERSION=                 # Optional explicit version
INPUT_MESSAGE=""               # Release message
INPUT_NOTES_FROM=""            # Git ref for release notes range
INPUT_DRY_RUN=false           # Dry-run mode
INPUT_PROVIDER=shell           # shell or mcp
```

### GitHub Release Template

**Format:** Markdown with sections:

- Summary of changes
- Breaking changes (if any)
- New features
- Bug fixes
- Security updates
- Contributors list
- Installation instructions

---

## Testing

### Run Script Tests

```bash
cd /Users/ash/Studio/.github

# Test release workflow scripts
npm test -- scripts/workflows/__tests__/release-workflow-scripts.test.js

# Test specific script
npm test -- scripts/workflows/__tests__/release-workflow-scripts.test.js -t "create-main-release-pr"
```

### Test Coverage

- **Files:** 11+ test files
- **Coverage:** All scripts tested
- **Test Types:** Unit + integration

### Dry-Run Testing

All scripts support dry-run mode:

```bash
INPUT_DRY_RUN=true node scripts/workflows/release/run-release-agent.cjs
```

Dry-run:

- ✅ Validates all inputs
- ✅ Runs all checks
- ✅ Previews changes
- ❌ Makes NO mutations

---

## Supported Repository Types

### Control-Plane (`.github`)

**Version Files:**

- `VERSION` (root)
- `package.json`

**Release Process:**

1. Bump VERSION and package.json
2. Create PR to develop
3. Merge PR
4. Create main release PR
5. Merge to main + tag
6. Create GitHub Release

### WordPress Plugin

**Version Files:**

- `VERSION` (root)
- `{plugin-name}.php` (plugin header)
- `readme.txt` (stable tag)
- `package.json` (if present)

**Special Handling:**

- Update plugin header version
- Update readme.txt stable tag
- Create WordPress.org release (if applicable)

### WordPress Theme

**Version Files:**

- `VERSION` (root)
- `style.css` (theme header)
- `package.json` (if present)

**Special Handling:**

- Update theme header version
- Theme-specific changelog format

---

## Release Notes Generation

### Automatic Release Notes

Generated from:

1. **CHANGELOG.md** — Primary source (Keep a Changelog format)
2. **Git commits** — Secondary source (fallback)
3. **PR titles** — For context and categorization

### Format

**Sections:**

- 🎉 Breaking Changes
- ✨ New Features
- 🐛 Bug Fixes
- 🔒 Security Updates
- 📚 Documentation
- 🔄 Changed
- ⚠️ Deprecated
- 🗑️ Removed

---

## Troubleshooting

### "Failed to create PR to develop"

Check:

- Branch permissions (bot needs write access)
- GitHub API token is valid
- Base branch (develop) exists
- No conflicting PRs

### "Version mismatch detected"

All version files must match:

- `VERSION` file
- `package.json` version
- Plugin header version
- Theme header version
- readme.txt stable tag

### "Release notes not generated"

Check:

- CHANGELOG.md exists and is valid (Keep a Changelog format)
- [Unreleased] section has entries
- Version is found in changelog

### "GitHub Release already exists"

Cannot create duplicate GitHub Release:

- Check existing releases at `/releases`
- Delete manually if needed
- Increment version and retry

---

## Related Documentation

- [RELEASE_PROCESS.md](../../docs/RELEASE_PROCESS.md) — Complete workflow documentation
- [RELEASE_GATES.md](../gates/README.md) — Safety gates documentation
- [CHANGELOG_AUTOMATION.md](../../docs/CHANGELOG_AUTOMATION.md) — Changelog management
- [AGENTIC_RELEASE_USER_GUIDE.md](../../docs/AGENTIC_RELEASE_USER_GUIDE.md) — User guide
- [AGENTIC_RELEASE_ADMIN_GUIDE.md](../../docs/AGENTIC_RELEASE_ADMIN_GUIDE.md) — Admin procedures

---

## Script Dependencies

**External Tools:**

- `git` (2.30+) — Version control
- `gh` (GitHub CLI) — GitHub API access
- `node` (18+) — JavaScript runtime
- `npm` (8+) — Package management

**Node Modules:**

- Built-in modules only (no external dependencies)

---

*Built by 🧱 LightSpeedWP with ☕, 🚀, and open-source spirit!*

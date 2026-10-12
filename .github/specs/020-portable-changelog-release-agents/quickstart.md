# Quickstart: Validating Spec 020

**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

This guide describes how a reviewer proves the specification and, later, the implementation slices. It contains no implementation code. Fixture names are placeholders for the implementation slices to create.

## Prerequisites

- A clean working tree on a branch based on refreshed `develop`.
- Node.js and the repository's installed dependencies (`npm ci`).
- Fixture repositories for: plugin, theme, enhancement, ordinary `.github` target, optional `VERSION`, ambiguous headers, drift, repeated runs, invalid paths.

## Test Environment Setup

All test fixtures are persistent, committed files under each agent's `tests/fixtures/` directory and are reused across test runs.

### Fixture Directory Structure

```text
agents/release-agent/tests/fixtures/
├── plugin/
│   ├── plugin-file.php          # Plugin with minimal header
│   ├── readme.txt               # Plugin readme with Stable tag
│   ├── package.json             # Optional package.json
│   ├── .github/                 # Optional governance files
│   └── (no VERSION file needed)
├── theme/
│   ├── style.css                # Theme with version header
│   ├── package.json
│   ├── readme.txt
│   └── .github/
├── enhancement/
│   ├── .github/
│   │   └── instructions.md      # Declares component: "enhancement" + version-fields
│   └── package.json
├── enhancement-undeclared/      # Enhancement without instructions declaration
│   └── package.json
├── ordinary-github-target/      # Has .github/, package.json, VERSION (not governance)
├── optional-version/            # No VERSION file; detectable without it
├── ambiguous-headers/           # Both plugin and theme markers present
├── drift/                        # Version fields with conflicting values
├── repeat-run/                  # For idempotent testing (run twice, expect no change)
├── invalid-paths/               # Symlinks, ../ escape attempts, special characters
├── tag-conflict/                # Existing tag that conflicts
└── (other scenarios per FR-022)

agents/changelog-agent/tests/fixtures/
├── valid-unreleased/            # Well-formed Unreleased section
├── invalid-category/            # Entry outside the 6 allowed categories
├── empty-unreleased/            # No entries under Unreleased
├── already-released/            # Only released sections, no Unreleased
├── hand-edited-between-draft-and-apply/  # For testing digest mismatch
├── long-entry/                  # Entry exceeding 250-character limit
├── no-workflows/                # No changelog.yml or release.yml present
└── (other scenarios per FR-022)
```

### Portable Install Test (T046, T047 — Clean Location)

The portable-install fixtures verify that agents run in isolation without relying on the governance checkout.

**Setup**:

```bash
#!/bin/bash
set -e

# Create isolated temp directory
CLEAN_DIR=$(mktemp -d)
trap "rm -rf $CLEAN_DIR" EXIT

# Copy agent package only (no governance checkout on path)
cp -r agents/release-agent "$CLEAN_DIR/agent"
cd "$CLEAN_DIR/agent"

# Verify NO governance checkout is accessible
if [ -d ~/.github ]; then
  echo "ERROR: ~/.github exists; test environment not clean"
  exit 1
fi

# Verify NO spec directory reachable
if [ -f ./.github/specs/020-portable-changelog-release-agents/spec.md ]; then
  echo "ERROR: Spec directory found; not properly isolated"
  exit 1
fi

# Run agent from isolated location
npx release.agent.cjs --repoRoot /path/to/fixture --dry-run
exit_code=$?

if [ $exit_code -eq 0 ]; then
  echo "SUCCESS: Agent resolved all resources in clean location"
else
  echo "FAILURE: Agent failed to run without governance checkout"
  exit 1
fi
```

**Expected**: Agent resolves all resources (bundled engine, skills, adapters) without reaching beyond the copied package.

### Repeated-Run Idempotency (Changelog)

Verifies changelog operations are idempotent: running twice with no new changes produces identical output.

**Setup**:

```bash
#!/bin/bash
CHANGELOG_PATH="agents/changelog-agent/tests/fixtures/repeat-run/CHANGELOG.md"

# Run 1: Inspect the changelog
RUN1=$(npx changelog.agent.cjs inspect "$CHANGELOG_PATH" 2>&1)

# Small delay to ensure different timestamps if any time-based logic exists
sleep 1

# Run 2: Inspect again with no changes to CHANGELOG.md
RUN2=$(npx changelog.agent.cjs inspect "$CHANGELOG_PATH" 2>&1)

# Verify output is identical
if [ "$RUN1" = "$RUN2" ]; then
  echo "SUCCESS: Repeated run produces identical output"
else
  echo "FAILURE: Repeated run output differs"
  echo "Run 1: $RUN1"
  echo "Run 2: $RUN2"
  exit 1
fi
```

**Expected**: `run1` equals `run2`. No file changes occur.

### Hand-Edited Between Draft and Apply

Verifies that digest mismatch is detected when a file changes between draft and apply.

**Setup**:

```bash
#!/bin/bash
CHANGELOG_PATH="agents/changelog-agent/tests/fixtures/hand-edited-between-draft-and-apply/CHANGELOG.md"

# Step 1: Draft the changelog to get digest
DRAFT=$(npx changelog.agent.cjs draft "$CHANGELOG_PATH" 2>&1)
DIGEST=$(echo "$DRAFT" | grep -oP 'Digest: \K[a-f0-9]+')

# Step 2: Maintainer hand-edits CHANGELOG.md (simulate by modifying a line)
sed -i 's/example/MODIFIED_EXAMPLE/g' "$CHANGELOG_PATH"

# Step 3: Try to apply with the old digest
OUTPUT=$(npx changelog.agent.cjs apply "$CHANGELOG_PATH" \
  --approve-digest "$DIGEST" 2>&1)

# Verify:
# - Command failed (non-zero exit)
# - File was NOT modified (no write occurred)
if echo "$OUTPUT" | grep -q "approval-digest-mismatch"; then
  echo "SUCCESS: Digest mismatch detected"
  if ! grep -q "MODIFIED_EXAMPLE" "$CHANGELOG_PATH"; then
    echo "SUCCESS: File unchanged (no write on mismatch)"
    exit 0
  fi
fi

echo "FAILURE: Digest mismatch not properly handled"
exit 1
```

**Expected**: Mismatch detected, zero files written, clear error returned.

---

## Specification checks (this PR)

1. Lint the changed Markdown: `npm run lint:md`.
2. Confirm the catalog row exists and links resolve: run the catalog validation Bats suite under `tests/bash`.
3. Confirm numbering: `bash .specify/scripts/bash/audit-specs.sh`. Expected today: a gap at 019 until the reserved Qodo spec merges or the owner approves another resolution.
4. Confirm no change to locked governance files, source code, manifests, root version or root changelog (SC-010): `git diff --name-only origin/develop` lists only files under `.github/specs/`.

## Release readiness scenarios (R1 slice)

| Scenario | Expected |
|----------|----------|
| Consistent plugin, working directory elsewhere | Readiness checks pass with no blocker other than `changelog-unverified`; operations applied to the requested root; zero writes. Overall `ready` only after the US3 handoff records verification success; until then `not-ready` with `changelog-unverified`. |
| Theme with no `VERSION` file | Detected, and readiness checks pass using authoritative fields; overall `ready` follows the same US3 rule. |
| Ordinary repo with `.github`, `package.json`, `VERSION` | Not classified as governance. |
| Drift or ambiguity | `not-ready` with `version-drift` or `version-ambiguous`, sources named. |
| Dirty tree, unsafe path, tag conflict | `not-ready` with the matching blocker; nothing staged or stashed. |
| Target names no required checks | `not-ready` with `missing-check`. |
| Enhancement whose instructions do not declare it | `not-ready` with `component-unknown`. |
| Interrupted approved edit | Repository recoverable; not reported ready. |
| Approval digest does not match the edit about to be applied | Zero files written; mismatch reported. |

## Changelog scenarios (C2 slice)

| Scenario | Expected |
|----------|----------|
| Valid Unreleased entries | Draft proposed; no file change. |
| Invalid category | Reported with the six allowed categories. |
| Approved apply | Historic entries and links byte-identical. |
| Second run, no new entries | No change. |
| No `changelog.yml` or `release.yml` present | All MVP behaviour works. |

## Handoff scenarios

| Scenario | Expected |
|----------|----------|
| `verified` with evidence | Readiness may complete. |
| `failed`, missing, malformed or unavailable responder | `not-ready` with `changelog-unverified`. |

Contracts: [readiness-report](./contracts/readiness-report.md), [verification-handoff](./contracts/verification-handoff.md), [agent-package-layout](./contracts/agent-package-layout.md). Entities: [data-model.md](./data-model.md).

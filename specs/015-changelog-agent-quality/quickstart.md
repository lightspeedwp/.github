# Quickstart & Validation Guide: Changelog Agent

**Feature**: 015-changelog-agent-quality

**Date**: 2026-09-19

**Purpose**: Prove the changelog agent works end-to-end with concrete validation scenarios

---

## Quick Links

- **Data Model**: See [data-model.md](./data-model.md) for entity definitions
- **CLI Interface**: See [contracts/cli-interface.md](./contracts/cli-interface.md) for command specs
- **Research & Design**: See [research.md](./research.md) for technical decisions

---

## Scenario 1: Local Validation (Happy Path)

**Goal**: Verify developers can validate valid changelog entries locally

**Prerequisites**:

- Node.js ≥18 installed
- npm ≥9 installed
- `.github` repository cloned
- `package.json` has `changelog:validate` npm script

**Setup**:

```bash
cd /path/to/.github
npm install
```

**Test Case**:

```bash
# 1. Create a test changelog with valid entries
cat > CHANGELOG.test.md << 'EOF'
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Support for changelog validation in local development environments with clear feedback (#3372)

### Fixed
- Race condition in concurrent changelog merges (#2845)

## [1.0.0] - 2026-09-19

### Added
- Initial release of changelog agent with validation skills
EOF

# 2. Run validation (should PASS)
npm run changelog:validate -- --changelog-path CHANGELOG.test.md --output-format text

# Expected output:
# ✅ Changelog Validation PASSED
# Total entries: 2
# Valid: 2
# Invalid: 0
# Validation time: 120ms
```

**Verification**:

- ✅ Exit code = 0 (success)
- ✅ Output contains "PASSED"
- ✅ Execution time < 5 seconds
- ✅ Both entries reported as valid

---

## Scenario 2: Local Validation (Failure Cases)

**Goal**: Verify validation tool catches common errors and provides clear feedback

### Subtest 2a: Entry Too Long

**Test Case**:

```bash
cat > CHANGELOG.test.md << 'EOF'
# Changelog

## [Unreleased]

### Added
- This is an entry that is intentionally written to be way too long and exceed the 250 character limit that we have set for changelog entries to ensure they stay user focused and do not include implementation details that belong in pull requests and commit messages not in user facing changelog documentation (#3372)
EOF

npm run changelog:validate -- --changelog-path CHANGELOG.test.md --output-format text
```

**Expected Output**:

```
❌ Changelog Validation FAILED

Line 6: Entry exceeds 250-character limit
  Current: 268 characters
  Expected: ≤250 characters
  Content: This is an entry that is intentionally written...
  Fix: Shorten to focus on user-facing benefit; remove implementation details

Summary:
  Total entries: 1
  Valid: 0
  Invalid: 1
```

**Verification**:

- ✅ Exit code = 1 (failure)
- ✅ Error identifies exact line number
- ✅ Error shows character count vs. limit
- ✅ Error provides actionable fix suggestion

### Subtest 2b: Missing PR/Issue Link

**Test Case**:

```bash
cat > CHANGELOG.test.md << 'EOF'
# Changelog

## [Unreleased]

### Added
- Support for changelog validation in local development

### Fixed
- Race condition in concurrent merges
EOF

npm run changelog:validate -- --changelog-path CHANGELOG.test.md --output-format text
```

**Expected Output**:

```
❌ Changelog Validation FAILED

Line 6: Entry missing required PR/issue link
  Expected: Format #123 or PR-456
  Content: Support for changelog validation in local development
  Fix: Add PR link (e.g., '#3372') or create issue if missing

Line 9: Entry missing required PR/issue link
  Expected: Format #123 or PR-456
  Content: Race condition in concurrent merges
  Fix: Add PR link (e.g., '#2845') or create issue if missing

Summary:
  Total entries: 2
  Valid: 0
  Invalid: 2
```

**Verification**:

- ✅ Exit code = 1
- ✅ Both entries flagged
- ✅ Suggestions show exact link format

---

## Scenario 3: Skill Metadata Conformance

**Goal**: Verify changelog skills have proper metadata per agentskills.io spec

**Prerequisites**:

- Skills directory created with metadata.yml files

**Test Case**:

```bash
# Check metadata files exist and are valid YAML
for skill in agents/changelog-agent/skills/*/metadata.yml; do
  echo "Checking $skill..."
  
  # Verify YAML is valid
  node -e "require('js-yaml').load(require('fs').readFileSync('$skill', 'utf8'))"
  
  # Check required fields (using jq if available)
  grep -q "^id:" "$skill" && echo "  ✓ id field present"
  grep -q "^version:" "$skill" && echo "  ✓ version field present"
  grep -q "^inputs:" "$skill" && echo "  ✓ inputs field present"
  grep -q "^outputs:" "$skill" && echo "  ✓ outputs field present"
done
```

**Expected Output**:

```
Checking agents/changelog-agent/skills/validate/metadata.yml...
  ✓ id field present
  ✓ version field present
  ✓ inputs field present
  ✓ outputs field present

Checking agents/changelog-agent/skills/check-links/metadata.yml...
  ✓ id field present
  ✓ version field present
  ✓ inputs field present
  ✓ outputs field present

... (for each skill)
```

**Verification**:

- ✅ All skills have metadata.yml files
- ✅ YAML is valid (no parse errors)
- ✅ All required fields present (id, version, inputs, outputs)
- ✅ Skills are discoverable by scanning directory

---

## Scenario 4: CLI Command Contract Compliance

**Goal**: Verify CLI commands match the interface contract

**Test Case**:

```bash
# Test 1: Help output works
npm run changelog:validate -- --help | grep -q "Usage" && echo "✓ Help works"

# Test 2: Exit codes follow contract
npm run changelog:validate -- --changelog-path /nonexistent/file.md
EXIT_CODE=$?
[ $EXIT_CODE -eq 2 ] && echo "✓ Exit code 2 for file not found"

# Test 3: JSON output is parseable
npm run changelog:validate -- --changelog-path CHANGELOG.test.md --output-format json | \
  node -e "JSON.parse(require('fs').readFileSync(0, 'utf8'))" && \
  echo "✓ JSON output is valid"

# Test 4: Output includes required fields
npm run changelog:validate -- --changelog-path CHANGELOG.test.md --output-format json | \
  jq '.valid, .entries_total, .entries_valid, .validation_time_ms' > /dev/null && \
  echo "✓ Output includes required fields"
```

**Expected Output**:

```
✓ Help works
✓ Exit code 2 for file not found
✓ JSON output is valid
✓ Output includes required fields
```

**Verification**:

- ✅ All commands have `--help` option
- ✅ Exit codes match contract
- ✅ JSON output is machine-parseable
- ✅ Required fields always present

---

## Scenario 5: Workflow Integration

**Goal**: Verify changelog validation integrates with GitHub Actions

**Test Case**:

```bash
# 1. Create a test PR (in CI simulation)
# 2. Run workflow that calls npm run changelog:validate
# 3. Verify labels are applied based on result
# 4. Verify PR is blocked if validation fails

# Pseudo-code (actual workflow in .github/workflows/changelog-validate.yml):
if npm run changelog:validate -- --changelog-path CHANGELOG.md; then
  # Validation passed
  gh pr edit --add-label "meta:has-changelog"
  echo "✓ Validation passed; label applied"
else
  # Validation failed
  gh pr edit --add-label "meta:needs-changelog-fix"
  gh pr review --request-changes --body "Changelog validation failed. See comments."
  echo "✓ Validation failed; PR blocked with feedback"
fi
```

**Expected Outcomes**:

- ✅ PR with valid changelog entries gets `meta:has-changelog` label
- ✅ PR with invalid entries gets `meta:needs-changelog-fix` label
- ✅ PR with invalid entries has merge blocked
- ✅ Developer sees PR comment with specific error details
- ✅ PR with `chore/*` or `deps/*` branch bypasses validation

---

## Scenario 6: Documentation Quality

**Goal**: Verify changelog agent documentation exists and is complete

**Test Case**:

```bash
# Check documentation files exist
for file in README.md SKILLS.md INTEGRATION.md TROUBLESHOOTING.md API.md; do
  [ -f "docs/agents/changelog-agent/$file" ] && \
    echo "✓ $file exists" || \
    echo "✗ $file MISSING"
done

# Verify content completeness
grep -q "Quick Start" docs/agents/changelog-agent/README.md && \
  echo "✓ README has quick start"

grep -q "changelog-validate" docs/agents/changelog-agent/SKILLS.md && \
  echo "✓ SKILLS.md documents skills"

grep -q "GitHub Actions" docs/agents/changelog-agent/INTEGRATION.md && \
  echo "✓ INTEGRATION.md covers workflows"

grep -q "validation failed" docs/agents/changelog-agent/TROUBLESHOOTING.md && \
  echo "✓ TROUBLESHOOTING covers common issues"
```

**Expected Output**:

```
✓ README.md exists
✓ SKILLS.md exists
✓ INTEGRATION.md exists
✓ TROUBLESHOOTING.md exists
✓ API.md exists
✓ README has quick start
✓ SKILLS.md documents skills
✓ INTEGRATION.md covers workflows
✓ TROUBLESHOOTING covers common issues
```

**Verification**:

- ✅ All documentation files exist at correct path
- ✅ Documentation covers all required sections
- ✅ Examples are present and runnable
- ✅ Troubleshooting section is comprehensive

---

## Scenario 7: Test Coverage

**Goal**: Verify changelog agent has ≥85% test coverage

**Test Case**:

```bash
# Run test suite with coverage report
npm test -- --coverage

# Expected output includes:
# Lines        : XX.XX% ( X / X )
# Statements   : XX.XX% ( X / X )
# Functions    : XX.XX% ( X / X )
# Branches     : XX.XX% ( X / X )
```

**Verification**:

- ✅ Coverage report generated
- ✅ All metrics ≥85%
- ✅ Validation skill has highest coverage (entry point)
- ✅ Error handling paths are tested

---

## Scenario 8: Developer Confidence Survey

**Goal**: Measure if developers are confident in the validation tool (SC-010)

**Test Method**:
After running Scenarios 1-7, survey 5-10 developers:

**Survey Questions**:

1. "Can you validate a changelog locally without CI?" (Yes/No)
2. "When validation fails, can you understand what's wrong?" (1-5 scale)
3. "Could you fix a changelog error in <5 minutes?" (Yes/No)
4. "Would you trust this tool to catch problems before they reach CI?" (1-5 scale)

**Target**: ≥80% answer positively or score ≥4

---

## Running All Scenarios

```bash
# Run all validation scenarios in sequence
./run-validation-scenarios.sh

# Expected output:
# ✅ Scenario 1: Local validation (happy path) PASSED
# ✅ Scenario 2: Local validation (failure cases) PASSED
# ✅ Scenario 3: Skill metadata conformance PASSED
# ✅ Scenario 4: CLI contract compliance PASSED
# ✅ Scenario 5: Workflow integration PASSED
# ✅ Scenario 6: Documentation quality PASSED
# ✅ Scenario 7: Test coverage PASSED
# ✅ Scenario 8: Developer confidence PASSED (sample size: N)
#
# Overall: 8/8 scenarios PASSED ✅
```

---

## Debugging Validation Issues

If any scenario fails:

1. **Check npm scripts**: Verify `package.json` has all `changelog:*` scripts
2. **Check file permissions**: Ensure scripts are executable (`chmod +x`)
3. **Check Node.js version**: Verify `node --version` shows ≥18
4. **Check dependencies**: Run `npm install` to ensure packages installed
5. **Check lock file**: Run with file-lock debugging: `DEBUG=changelog:* npm run changelog:*`

---

## Next Steps

After validating these scenarios:

1. Proceed to Phase 2: Task decomposition
2. Generate 100+ implementation tasks across 10 phases
3. Begin implementation starting with Phase 1 (setup, skill structure)

# Quickstart & Validation Guide: Changelog Agent

**Feature**: 016-changelog-agent-quality

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
- `.github/validation/changelog/package.json` has the shipped `validate` npm script

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
node .github/validation/changelog/bin/validate.js --changelog-path CHANGELOG.test.md --output text

# Expected output:
# CHANGELOG VALIDATION REPORT
# Total Entries: 2
# Compliant:    2 (100.0%)
# Non-Compliant: 0
# Gate Result: ✓ PASS
```

**Verification**:

- ✅ Exit code = 0 (success)
- ✅ Output contains `Gate Result: ✓ PASS`
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

node .github/validation/changelog/bin/validate.js --changelog-path CHANGELOG.test.md --output text
```

**Expected Output**:

```
CHANGELOG VALIDATION REPORT
Total Entries: 1
Compliant:    0 (0.0%)
Non-Compliant: 1
Gate Result: ✗ FAIL
Recommendation: blocked

Issues Found:
CHK_MAX_LENGTH [CRITICAL]: 1 violation(s)
  → Entry exceeds 250 character limit. Current: 314 chars
```

**Verification**:

- ✅ Exit code = 1 (failure)
- ✅ Error identifies `CHK_MAX_LENGTH`
- ✅ Error shows the character limit and actual count

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

node .github/validation/changelog/bin/validate.js --changelog-path CHANGELOG.test.md --output text
```

**Expected Output**:

```
CHANGELOG VALIDATION REPORT
Total Entries: 2
Compliant:    0 (0.0%)
Non-Compliant: 2
Gate Result: ✗ FAIL
Recommendation: blocked

Issues Found:
CHK_HAS_PR_LINK [CRITICAL]: 2 violation(s)
  → Entry must reference a PR or issue number (e.g., #1234 or issues/#5678)
```

**Verification**:

- ✅ Exit code = 1
- ✅ Both entries are counted as non-compliant
- ✅ `CHK_HAS_PR_LINK` reports two violations and the accepted link examples

---

## Scenario 3: Skill Metadata Conformance

**Goal**: Verify changelog skills have proper metadata per agentskills.io spec

**Prerequisites**:

- Skills exist at `agents/changelog-agent/skills/<skill-name>/SKILL.md`

**Test Case**:

```bash
# Scan every skill directory and validate SKILL.md YAML frontmatter.
node --input-type=module <<'NODE'
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const root = 'agents/changelog-agent/skills';
const requiredMetadata = [
  'lightspeedwp-version',
  'lightspeedwp-triggers',
  'lightspeedwp-inputs',
  'lightspeedwp-outputs',
  'lightspeedwp-error-codes',
];

for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const skillPath = path.join(root, entry.name, 'SKILL.md');
  if (!fs.existsSync(skillPath)) throw new Error(`Missing ${skillPath}`);

  const content = fs.readFileSync(skillPath, 'utf8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error(`Missing YAML frontmatter: ${skillPath}`);
  const frontmatter = yaml.load(match[1]);

  for (const field of ['name', 'description']) {
    if (typeof frontmatter[field] !== 'string' || !frontmatter[field].trim()) {
      throw new Error(`Missing ${field}: ${skillPath}`);
    }
  }
  if (frontmatter.name !== entry.name) {
    throw new Error(`name must match directory: ${skillPath}`);
  }
  for (const field of requiredMetadata) {
    if (typeof frontmatter.metadata?.[field] !== 'string') {
      throw new Error(`Missing string metadata.${field}: ${skillPath}`);
    }
  }
  console.log(`✓ ${skillPath}`);
}
NODE
```

**Expected Output**:

```
✓ agents/changelog-agent/skills/validate/SKILL.md
✓ agents/changelog-agent/skills/check-links/SKILL.md

... (for each skill)
```

**Verification**:

- ✅ All skill directories have `SKILL.md`
- ✅ YAML frontmatter is valid
- ✅ Standard `name` and `description` fields are present
- ✅ Required project metadata is present as string values
- ✅ Skills are discoverable by scanning directory

---

## Scenario 4: CLI Command Contract Compliance

**Goal**: Verify CLI commands match the interface contract

**Test Case**:

```bash
# Test 1: Help output works
node .github/validation/changelog/bin/validate.js --help | grep -q "Options" && echo "✓ Help works"

# Test 2: Exit codes follow contract
set +e
MISSING_FILE_JSON="$(node .github/validation/changelog/bin/validate.js \
  --changelog-path /nonexistent/file.md --output json)"
MISSING_FILE_STATUS=$?
set -e
printf '%s' "$MISSING_FILE_JSON" | \
  node -e "JSON.parse(require('fs').readFileSync(0, 'utf8'))"
[ "$MISSING_FILE_STATUS" -eq 1 ] && echo "✓ Exit code 1 for file not found"

# Test 3: JSON output is parseable
node .github/validation/changelog/bin/validate.js --changelog-path CHANGELOG.test.md --output json | \
  node -e "JSON.parse(require('fs').readFileSync(0, 'utf8'))" && \
  echo "✓ JSON output is valid"

# Test 4: Output includes required fields
node .github/validation/changelog/bin/validate.js --changelog-path CHANGELOG.test.md --output json | \
  jq '.summary.total_entries, .summary.passed, .summary.failed, .ci_gate_result' > /dev/null && \
  echo "✓ Output includes required fields"
```

**Expected Output**:

```
✓ Help works
✓ Exit code 1 for file not found
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
# 2. Run workflow that calls the shipped validator package
# 3. Verify labels are applied based on result
# 4. Verify PR is blocked if validation fails

# Pseudo-code (actual workflow in .github/workflows/changelog-validate.yml):
if node .github/validation/changelog/bin/validate.js --changelog-path CHANGELOG.md; then
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

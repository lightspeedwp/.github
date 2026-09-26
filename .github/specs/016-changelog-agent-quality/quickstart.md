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

// The four skills named in plan.md; a missing one fails the scenario.
const requiredSkills = [
  'changelog-validate',
  'changelog-check-links',
  'changelog-merge',
  'changelog-format',
];
for (const name of requiredSkills) {
  if (!fs.existsSync(path.join(root, name))) {
    throw new Error(`Missing skill directory: ${path.join(root, name)}`);
  }
}

for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const skillPath = path.join(root, entry.name, 'SKILL.md');
  if (!fs.existsSync(skillPath)) throw new Error(`Missing ${skillPath}`);

  const content = fs.readFileSync(skillPath, 'utf8');
  // The closing delimiter must be a whole line: `---` then end of line or file.
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/);
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
✓ agents/changelog-agent/skills/changelog-validate/SKILL.md
✓ agents/changelog-agent/skills/changelog-check-links/SKILL.md
✓ agents/changelog-agent/skills/changelog-merge/SKILL.md
✓ agents/changelog-agent/skills/changelog-format/SKILL.md
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
  --changelog-path CHANGELOG.missing.md --output json)"
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
  jq -e '(.summary.total_entries | type == "number")
    and (.summary.passed | type == "number")
    and (.summary.failed | type == "number")
    and (.ci_gate_result | type == "string")' > /dev/null && \
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
CHANGELOG_CHANGED="${CHANGELOG_CHANGED:-true}"
PR_NUMBER="${PR_NUMBER:-3500}"
HEAD_REF="${HEAD_REF:-current-branch}"

# The shipped gate skips on author, diff shape, or the meta:no-changelog label.
# Each condition is exercised here so the scenario proves the documented set
# rather than accepting a precomputed flag.
run_case() {  # run_case <label> <author> <files> <has_no_changelog_label>
  local label="$1" author="$2" files="$3" no_changelog="$4"
  local changed=false every_file_docs=true
  for f in $files; do
    case "$f" in docs/*|*.md) ;; *) every_file_docs=false ;; esac
    changed=true
  done
  case "$author" in
    dependabot\[bot\]|app/dependabot|app/lightspeed-docs-bot)
      echo "  $label: skipped (bot author)"; return 0 ;;
  esac
  if [ "$changed" = false ]; then
    echo "  $label: skipped (no files changed)"; return 0
  fi
  if [ "$every_file_docs" = true ]; then
    echo "  $label: skipped (docs-only diff)"; return 0
  fi
  if [ "$no_changelog" = true ]; then
    echo "  $label: skipped (meta:no-changelog)"; return 0
  fi
  echo "  $label: validation required"
}

run_case "dependabot"  "dependabot[bot]"        "src/index.js"          false
run_case "docs-bot"    "app/lightspeed-docs-bot" "src/index.js"         false
run_case "docs-only"   "human"                   "docs/guide.md"        false
run_case "no-changelog" "human"                  "src/index.js"         true
run_case "code change" "human"                   "src/index.js"         false
echo "  (CHANGELOG_CHANGED=${CHANGELOG_CHANGED:-true} honoured for the real run below)"

if [ "${CHANGELOG_CHANGED:-true}" == "false" ]; then
  echo "No changelog files modified in this PR"
  exit 0
fi

if node .github/validation/changelog/bin/validate.js \
  --changelog-path CHANGELOG.md \
  --trigger pr_submission \
  --pr-number "$PR_NUMBER" \
  --branch "$HEAD_REF"; then
  gh pr edit --remove-label "meta:needs-changelog"
  echo "✓ Validation passed; meta:needs-changelog cleared"
else
  gh pr edit --add-label "meta:needs-changelog"
  gh pr review --request-changes --body "Changelog validation failed. See comments."
  echo "✓ Validation failed; PR blocked with feedback"
fi
```

**Expected Outcomes**:

- ✅ PR with no `CHANGELOG.md` change skips validation
- ✅ PR with valid changelog entries has `meta:needs-changelog` cleared
- ✅ PR with invalid entries keeps `meta:needs-changelog` applied
- ✅ PR with invalid entries has merge blocked
- ✅ Developer sees PR comment with specific error details
- ✅ Dependabot and docs-bot PRs, docs-only diffs, and PRs labelled `meta:no-changelog` (not allowed for high-impact release types) skip the changelog requirement

---

## Scenario 6: Documentation Quality

**Goal**: Verify changelog agent documentation exists and is complete

**Test Case**:

```bash
# Check documentation files exist
missing=0
for file in README.md SKILLS.md INTEGRATION.md TROUBLESHOOTING.md API.md; do
  if [ -f "docs/agents/changelog-agent/$file" ]; then
    echo "✓ $file exists"
  else
    echo "✗ $file MISSING"
    missing=1
  fi
done
[ "$missing" -eq 0 ] || exit 1

# Verify content completeness
# Each check must fail the scenario: a chain of `&&` lets an early failure be
# masked by a later success, leaving the block with exit status 0.
docs_failed=0
for doc_check in \
  "Quick Start:docs/agents/changelog-agent/README.md" \
  "changelog-validate:docs/agents/changelog-agent/SKILLS.md" \
  "GitHub Actions:docs/agents/changelog-agent/INTEGRATION.md" \
  "validation failed:docs/agents/changelog-agent/TROUBLESHOOTING.md"; do
  needle="${doc_check%%:*}"
  file="${doc_check#*:}"
  if grep -q "$needle" "$file"; then
    echo "✓ $file contains '$needle'"
  else
    echo "✗ $file is missing '$needle'"
    docs_failed=1
  fi
done
[ "$docs_failed" -eq 0 ] || exit 1
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
npm --prefix agents/changelog-agent test -- --coverage --coverageThreshold='{"global":{"branches":85,"functions":85,"lines":85,"statements":85}}'

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

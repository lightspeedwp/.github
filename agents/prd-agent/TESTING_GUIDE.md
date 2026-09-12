# PRD Agent Testing Guide

**Purpose**: Execute comprehensive test suite for Phase 5 validation across all providers  
**Framework**: 14 test cases across 4 categories  
**Target**: ≥95% pass rate per spec.md SC-502  
**Coverage Target**: ≥90% per spec.md SC-501  

---

## Quick Start

### Run Full Test Suite

```bash
# Execute all tests on Claude (Sonnet 5)
node tests/test-runner.js --provider claude --suite all

# Output: Text results with pass/fail status per test
# Exit code: 0 (all passed), 1 (failures)
```

### Run by Category

```bash
# Multi-skill routing tests (TC-201-TC-204)
node tests/test-runner.js --provider claude --suite routing

# Skill inventory tests (TC-401-TC-402)
node tests/test-runner.js --provider claude --suite skills

# GitHub integration tests (TC-301-TC-303)
node tests/test-runner.js --provider claude --suite integration
```

### Output Formats

```bash
# JSON output for parsing/CI integration
node tests/test-runner.js --provider claude --suite all --json > results.json

# Verbose output with detailed messages
node tests/test-runner.js --provider claude --suite all --verbose

# Combine options
node tests/test-runner.js --provider claude --suite routing --verbose --json
```

---

## Test Categories & Scenarios

### Category 1: PRD Generation Quality (5 tests)

Tests whether the agent correctly generates structured PRD documents with all required sections.

**TC-101: Basic PRD Structure**
- Input: "Feature requirement for user authentication system"
- Expected: PRD with Overview, User Stories, Acceptance Criteria, Success Metrics, Release Notes
- Success: All sections present and non-empty
- Command: `node tests/test-runner.js --suite all --verbose` (shows TC-101 result)

**TC-102: Feature Extraction**
- Input: "Improve user login experience"
- Expected: ≥5 user stories, ≥15 acceptance criteria
- Success: Requirement parsing accuracy
- Metric: Story count, criteria count

**TC-103: Schema Compliance**
- Input: Random PRD requirements
- Expected: JSON schema compliance, Markdown formatting
- Success: Zero validation errors
- Validation: `npm run validate:frontmatter`

**TC-104: Cross-Skill Routing**
- Input: Complex multi-skill workflow
- Expected: Correct skill sequence (3+ skills)
- Success: ≥3 skills identified in correct order
- Example: project-researcher → prd-writer → acceptance-test-planner → prd-task-reviewer

**TC-105: Memory Context**
- Input: Multi-turn conversation (PRD → Review → Planning)
- Expected: Context preserved across turns
- Success: Zero context loss, decisions tracked
- Metric: Context continuity score

### Category 2: Multi-Skill Orchestration (4 tests)

Tests skill-to-skill handoffs and orchestration accuracy.

**TC-201: Skill Sequence**
- Input: "Plan a sprint for Q4 launch"
- Expected: project-intake → delivery-planner → estimation-planner → github-issue-drafter
- Success: Correct order, no duplicates
- Target: 90%+ accuracy

**TC-202: Handoff Quality**
- Input: PRD from prd-writer → delivery-planner
- Expected: Smooth context passing, no re-explanation
- Success: Continuity score ≥85
- Target: ≥90 continuity

**TC-203: Edge Cases**
- Input: Request at skill boundary (design vs PRD)
- Expected: Graceful handling, clear error message
- Success: User satisfaction ≥4/5
- Target: 90%+ graceful handling

**TC-204: Conflict Resolution**
- Input: Conflicting outputs (timeline vs plan)
- Expected: Conflict detected and documented
- Success: Resolution proposed
- Target: 95%+ detection rate

### Category 3: GitHub Integration (3 tests)

Tests GitHub-specific workflows (issue creation, linking, PR reviews).

**TC-301: Issue Creation**
- Input: PRD with requirements
- Expected: GitHub issue with labels, checklists, links
- Success: ≥1 issue, proper labels, checklist matches criteria
- Target: 100% creation success

**TC-302: Milestone/Project Linking**
- Input: Feature PRD for release
- Expected: Issues linked to milestone and project
- Success: Appears in project board
- Target: 100% linking success

**TC-303: PR Review Workflow**
- Input: PRD submitted via GitHub PR
- Expected: Structured review, approval tracking
- Success: ≥5 valid feedback items
- Target: ≥90% feedback quality

### Category 4: Skill Inventory (2 tests)

Tests canonical skill references and skill clustering.

**TC-401: Canonical Names**
- Input: Agent asked to create PRD
- Expected: References to 28 canonical skills only
- Success: Zero references to deleted skills (prd-generator, prd-reviewer, etc.)
- Target: 100% canonical accuracy

**TC-402: Capability Matrix**
- Input: Complex workflow spanning multiple categories
- Expected: Correct skill cluster mapping (Drafting, Planning, Quality, etc.)
- Success: Correct assignments and skill ordering
- Target: ≥95% mapping accuracy

---

## Providers & Execution

### Claude Code (Sonnet 5)

Recommended for baseline testing and validation.

```bash
# Full test suite
node tests/test-runner.js --provider claude --suite all --verbose

# Single category
node tests/test-runner.js --provider claude --suite routing
```

**Setup Requirements**:
- Node.js 16+ installed
- Access to `agents/prd-agent/` directory
- Test fixtures in `tests/fixtures/`

### GitHub Copilot (GPT-4)

Tests GitHub-integrated workflows and Copilot-specific optimizations.

**Manual Testing Process** (Copilot integration not yet automated):
1. Open Copilot in GitHub Code Spaces or IDE
2. Load `agents/prd-agent/copilot/agent.md` as custom agent
3. Run test scenarios manually
4. Record results in TEST_RESULTS.md

**Test Scenarios for Copilot**:
- Create GitHub issue from feature requirement (TC-301)
- Link issue to milestone and project (TC-302)
- Submit PR for review and track approval (TC-303)

### OpenAI API (GPT-4)

Tests API-based agent invocation and compatibility.

**Manual Testing Process** (OpenAI API integration pending):
1. Load agent prompt from `agents/prd-agent/claude/agent.md`
2. Call OpenAI API with test scenarios
3. Parse responses
4. Record results in TEST_RESULTS.md

---

## Test Results & Metrics

### Running Tests & Capturing Results

```bash
# Generate JSON results
node tests/test-runner.js --provider claude --suite all --json > results/claude-all-tests.json

# Generate formatted report
node tests/test-runner.js --provider claude --suite all --verbose | tee results/claude-report.txt

# Parse results programmatically
cat results/claude-all-tests.json | jq '.passed, .failed, .byCategory'
```

### Result JSON Structure

```json
{
  "totalTests": 14,
  "passed": 13,
  "failed": 1,
  "skipped": 0,
  "byCategory": {
    "PRD Generation Quality": { "passed": 5, "failed": 0, "total": 5 },
    "Multi-Skill Orchestration": { "passed": 4, "failed": 0, "total": 4 },
    "GitHub Integration": { "passed": 3, "failed": 0, "total": 3 },
    "Skill Inventory Accuracy": { "passed": 1, "failed": 1, "total": 2 }
  },
  "duration": 45.234,
  "tests": [
    {
      "testId": "TC-101",
      "category": "PRD Generation Quality",
      "name": "Basic PRD Structure Compliance",
      "passed": true,
      "message": "All 5 required sections present"
    }
  ]
}
```

### Success Criteria

**Phase 5 Completion Requires**:
- ✅ All 14 test cases executed
- ✅ Pass rate ≥95% (13+ tests passing)
- ✅ Coverage ≥90% (all 28 skills referenced)
- ✅ Results documented (baseline + post-enhancement)
- ✅ Improvement ≥15% from Phase 4 baseline

---

## Baseline Collection Process

### Step 1: Establish Pre-Enhancement Baseline

Execute tests against Phase 3 agent prompt (before Phase 4 rewrite):

```bash
# Clone Phase 3 agent prompt for baseline testing
cp agents/prd-agent/claude/agent.md agents/prd-agent/claude/agent.baseline.md

# Execute tests (results become baseline)
node tests/test-runner.js --provider claude --suite all --json > results/baseline.json

# Record baseline metrics in TEST_RESULTS.md
```

### Step 2: Execute Against Phase 4 Enhanced Prompt

Execute tests against Phase 4 enhanced prompt:

```bash
# Ensure current agent.md is Phase 4 enhanced version
node tests/test-runner.js --provider claude --suite all --json > results/post-enhancement.json

# Compare results
cat results/post-enhancement.json | jq '.passed / .totalTests * 100'
```

### Step 3: Calculate Improvement

```bash
# Baseline pass rate
cat results/baseline.json | jq '.passed / .totalTests * 100'  # e.g., 80%

# Post-enhancement pass rate
cat results/post-enhancement.json | jq '.passed / .totalTests * 100'  # e.g., 95%

# Improvement percentage
# (95 - 80) / 80 * 100 = 18.75% improvement ✅ (exceeds 15% target)
```

---

## Known Limitations & Workarounds

### Test Runner Limitations

1. **No Real API Calls**: Current test runner uses mock data
   - Workaround: Extend test-runner.js with actual agent API calls for Phase 5 Week 2
   - Reference: See TODO comments in test-runner.js

2. **GitHub Integration**: Requires authenticated GitHub API access
   - Workaround: Use GitHub MCP tools to test issue creation (TC-301)
   - Reference: See .github/tests/github-integration-tests.js (if exists)

3. **Copilot Testing**: Requires IDE with Copilot extension
   - Workaround: Manual test scenarios documented above
   - Reference: See COPILOT_TESTING.md (if created)

### Test Data

- Current test fixtures use mocked outputs
- Real project data to be loaded in Phase 5 Week 1
- Expected sources: `.github/specs/001-prd-agent-consolidation/` example files

---

## Continuous Integration

### GitHub Actions Workflow

Planned for Phase 5 Week 2-3:

```yaml
name: PRD Agent Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: node tests/test-runner.js --provider claude --suite all --json
      - uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: results/*.json
```

---

## Troubleshooting

### Test Failures

**TC-101 Fails: "Missing sections"**
- Check: Agent prompt includes all required PRD sections
- Fix: Verify claude/agent.md System Prompt includes PRD section examples
- Reference: agents/prd-agent/claude/agent.md lines ~20-50

**TC-301 Fails: "GitHub issue creation"**
- Check: GitHub API access and authentication
- Fix: Verify MCP tools available or manual test workaround
- Reference: TESTING_GUIDE.md "GitHub Integration" section

**TC-401 Fails: "Non-canonical skill names"**
- Check: Agent prompt lists only 28 canonical skills
- Fix: Search agent.md for deleted skill names and remove
- Reference: agents/prd-agent/TEST_CASES_BASELINE.md for canonical list

### Execution Issues

**"node: command not found"**
- Fix: Install Node.js 16+: `brew install node` (macOS) or `apt install nodejs` (Linux)

**"Cannot find module"**
- Fix: Run from repo root: `cd /home/user/.github && node tests/test-runner.js`

**Permission denied**
- Fix: Add execute permission: `chmod +x tests/test-runner.js`

---

## Next Steps

### Phase 5 Week 1: Baseline Collection

1. ✅ T064: Test framework created (DONE)
2. ⏳ T065: Execute on all providers
3. ⏳ T066: Validate baseline metrics
4. ⏳ T067: Document results

### Phase 5 Week 2: Post-Enhancement Validation

1. ⏳ Execute tests against Phase 4 enhanced prompt
2. ⏳ Compare results to baseline
3. ⏳ Validate ≥15% improvement
4. ⏳ Calculate overall pass rate (≥95%)

### Phase 5 Week 3: Issue Tracking

1. ⏳ T068: Create issues for any failing tests
2. ⏳ T069: Update CHANGELOG with Phase 5 completion

---

## References

- **Test Cases**: `agents/prd-agent/tests/fixtures/test-cases.json`
- **Test Runner**: `agents/prd-agent/tests/test-runner.js`
- **Results Template**: `agents/prd-agent/TEST_RESULTS.md`
- **Baseline Methodology**: `agents/prd-agent/TEST_CASES_BASELINE.md`
- **Specification**: `.github/specs/001-prd-agent-consolidation/spec.md`

---

**Last Updated**: 2026-09-12  
**Status**: Framework Complete | Execution Pending  
**Next Milestone**: Phase 5 Week 1 Baseline Collection

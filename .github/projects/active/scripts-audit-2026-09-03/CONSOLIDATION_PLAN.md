---
title: "Scripts & Agents Consolidation Implementation Plan"
description: "Step-by-step plan to consolidate duplicates and improve test coverage"
file_type: "implementation-plan"
status: "active"
created_date: "2026-09-03"
---

# Consolidation Implementation Plan

## Phase 1: Agent Duplication Consolidation (1-2 hours)

### Step 1.1: Compare Agent Locations

**Action**: Compare `.github/agents/` with `agents/` directory

```bash
# See which files exist in both locations
comm -12 \
  <(ls agents/*.agent.md | xargs -n1 basename | sort) \
  <(ls .github/agents/*.agent.md | xargs -n1 basename | sort)
```

**Expected Output**: List of 15+ duplicate filenames

**Document**: Create file listing with comparison in `AGENT_CONSOLIDATION_FINDINGS.md`

### Step 1.2: Identify Canonical Location

**For Each Duplicate Agent**:
```bash
# Get file sizes and modification dates
ls -lh .github/agents/task-planner.agent.md
ls -lh agents/task-planner.agent.md

# Get line counts
wc -l .github/agents/task-planner.agent.md
wc -l agents/task-planner.agent.md

# Check git history (if available)
git log --oneline .github/agents/task-planner.agent.md | head -5
git log --oneline agents/task-planner.agent.md | head -5
```

**Decision Criteria**:
- ✅ Most recent modification date = canonical
- ✅ Larger file size = more complete = canonical
- ✅ More git commits = more active = canonical
- ✅ `.github/agents/` = legacy → migrate to `agents/`

**Likely Outcome**: Most agents in `agents/` are newer/more complete

### Step 1.3: Implement Consolidation (Option B Recommended)

**Option B**: Delete `.github/agents/`, use only `agents/`

```bash
# Backup first
cp -r .github/agents .github/agents.backup

# List what will be deleted
ls -la .github/agents/*.agent.md

# Delete duplicate location
rm -rf .github/agents/*.agent.md

# Verify agents/ is complete
ls agents/*.agent.md | wc -l
```

**Update Documentation**:
```bash
# Update CLAUDE.md to reference agents/ only
# Update any CI/tooling that references .github/agents/
```

**Verification**:
```bash
# Search for any remaining references to .github/agents/
grep -r "\.github/agents" .github/ scripts/ docs/ --include="*.md" --include="*.yml" --include="*.yaml" --include="*.js" --include="*.cjs"
```

### Step 1.4: Update CLAUDE.md & AGENTS.md

**In CLAUDE.md**:
```markdown
## Agent Locations

All agent definitions live in the `agents/` directory at the repository root:

- **Canonical location**: `agents/*.agent.md`
- **For reusable agents**: Place in `agents/`
- **For repo-specific instructions**: Place in `.github/custom-instructions.md` or `.github/instructions/`

Do NOT create agents in `.github/agents/` — that location is deprecated.
```

**In AGENTS.md** (if exists):
```markdown
### Agent Organization

- `.github/agents/` — DEPRECATED (consolidated into `agents/`)
- `agents/` — Canonical location for all agent definitions
- `plugins/*/agents/` — Plugin-specific agents
```

---

## Phase 2: Resolve CJS/ESM Inconsistency (30-45 minutes)

### Step 2.1: Investigate `planner.agent.*` Files

**Action**: Read and compare both files

```bash
# Compare file sizes and structure
ls -lh scripts/agents/planner.agent.cjs scripts/agents/planner.agent.js

# Show differences
diff scripts/agents/planner.agent.cjs scripts/agents/planner.agent.js

# Check what imports/requires each
head -50 scripts/agents/planner.agent.cjs
head -50 scripts/agents/planner.agent.js
```

### Step 2.2: Search for Usage/Imports

```bash
# Find all imports of planner.agent
grep -r "planner\.agent" . --include="*.js" --include="*.cjs" --include="*.yml" --include="*.yaml"

# Find requires
grep -r "require.*planner\.agent\|from.*planner\.agent" . --include="*.js" --include="*.cjs"
```

### Step 2.3: Make Decision & Update

**If CJS is used more**: 
```bash
# Rename ESM to backup
mv scripts/agents/planner.agent.js scripts/agents/planner.agent.js.backup
```

**If ESM is used more**:
```bash
# Rename CJS to backup
mv scripts/agents/planner.agent.cjs scripts/agents/planner.agent.cjs.backup
```

**Modern Standard (RECOMMENDED)**:
ESM is the JavaScript standard. Prefer `planner.agent.js` (ESM).

```bash
# Keep ESM, delete CJS
rm scripts/agents/planner.agent.cjs
# Update all imports to use .js version
find . -type f \( -name "*.js" -o -name "*.cjs" -o -name "*.yml" \) \
  -exec sed -i 's/planner\.agent\.cjs/planner.agent.js/g' {} \;
```

### Step 2.4: Verify & Commit

```bash
# Verify no stray imports remain
grep -r "planner\.agent\.cjs" .

# Run tests (if any)
npm test

# Commit
git add scripts/agents/
git commit -m "Resolve CJS/ESM: Keep ESM planner.agent.js as canonical"
```

---

## Phase 3: Create Unit Tests (6-8 hours)

### Step 3.1: Set Up Test Infrastructure

**If using Jest**:
```bash
npm install --save-dev jest
npm init jest
```

**Or use Node's built-in test runner** (Node 18+):
```bash
# No installation needed, uses node test runner
node --test scripts/**/*.test.js
```

### Step 3.2: Create Test for Each Script

**Template for `collect-link-targets.test.js`**:
```javascript
import { test, mock } from "node:test";
import { strictEqual, ok } from "node:assert";
import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";

test("collect-link-targets.js", async (t) => {
  await t.test("should exit 0 when GITHUB_EVENT_NAME is not push/pull_request", () => {
    // Mock environment
    process.env.GITHUB_EVENT_NAME = "push";
    process.env.BASE_SHA = "abc123";
    process.env.HEAD_SHA = "def456";

    // Run script (will output to stdout)
    try {
      const output = execFileSync("node", ["scripts/collect-link-targets.js"], {
        encoding: "utf8",
        env: process.env
      });
      ok(output.includes("files="));
    } catch (e) {
      strictEqual(e.code, 0, "Script should exit 0");
    }
  });

  await t.test("should return files= when no markdown files found", () => {
    // Test with empty set
    process.env.GITHUB_EVENT_NAME = "pull_request";
    // ... (mock git diff to return empty)
    // ... (assert output is "files=")
  });
});
```

**Repeat for each script**:
- `scripts/validate-reports-structure.test.js`
- `scripts/workflows/projects/archive-projects.test.cjs`
- `scripts/workflows/projects/scan-completion.test.cjs`
- `scripts/workflows/orchestrate-phase-progression.test.cjs`
- `scripts/automation/update-projects-status.test.cjs`
- (Bash tests: use `test-project-docs-update.sh` as reference)

### Step 3.3: Run Tests & Measure Coverage

```bash
# Run all tests
npm test

# Or with Node test runner
node --test 'scripts/**/*.test.js'

# Generate coverage report (if using Jest)
npm test -- --coverage
```

### Step 3.4: Document Test Results

**Create `TEST_RESULTS.md`** with:
- List of all scripts
- Test count per script
- Coverage percentages
- Passing/failing tests
- Known gaps or TODOs

---

## Phase 4: Update Active Projects (1-2 hours)

### Step 4.1: Update Each Project README

**For each project**:

```markdown
---
title: "Project Name"
status: "active|pending|review|blocked|completed"
priority: "critical|high|medium|low"
type: "audit|consolidation|enhancement|infrastructure"
effort: "8h" or "20h"
created_date: "YYYY-MM-DD"
last_updated: "YYYY-MM-DD"
---

# Project Name

## Current Status

**Phase**: [Current phase description]
**Completion**: [% or % of tasks done]
**Blockers**: [Any blockers]
**Next Steps**: [Immediate next action]

## Quick Links

- [Detailed Plan](./PLANNING.md) or [Architecture](./ARCHITECTURE.md)
- [Related Issues](#related-issues)
```

### Step 4.2: Projects to Update

1. **label-prefix-audit-2026-08-05**
   - Status: ✅ Phase 1 Complete, Phase 2 Pending
   - Update: Document exactly where Phase 2 is blocked

2. **label-prefix-enforcement-2026-08-05**
   - Status: 🔄 Implementation in progress
   - Update: List completed tasks, what's left

3. **labeling-consolidation-2026-09-03**
   - Status: 🟡 Planning
   - Update: Flesh out RESEARCH_QUESTIONS.md

4. **openspec-labels-automation**
   - Status: 📋 Phase 4 Planning
   - Update: Timeline for Phase 4, what triggers Phase 5?

5. **workflows-consolidation-2026-q3**
   - Status: 🔄 Consolidation in progress
   - Update: Which phases are done? What's left?

---

## Phase 5: Real-World Testing (2-3 hours)

### Step 5.1: Set Up Test Scenario

**Scenario**: Update status on 3 real projects

**Projects**:
1. `label-prefix-audit-2026-08-05`
2. `workflows-consolidation-2026-q3`
3. `labeling-consolidation-2026-09-03`

### Step 5.2: Execute Script Sequence

```bash
# Step 1: Validate report structure
echo "=== Step 1: Validate report structure ==="
node scripts/validate-reports-structure.js

# Step 2: Scan for completions
echo "=== Step 2: Scan for completions ==="
node scripts/workflows/projects/scan-completion.cjs

# Step 3: Audit project status
echo "=== Step 3: Audit project status ==="
node scripts/automation/update-projects-status.cjs audit

# Step 4: Generate templates
echo "=== Step 4: Generate templates ==="
node scripts/automation/update-projects-status.cjs template

# Step 5: Generate linking suggestions
echo "=== Step 5: Generate linking suggestions ==="
node scripts/automation/update-projects-status.cjs link
```

### Step 5.3: Validate Results

**Expected**:
- ✅ No errors
- ✅ All 3 projects processed
- ✅ Status correctly identified
- ✅ Templates generated for missing docs
- ✅ Linking suggestions complete

**Document**: Create `REAL_WORLD_TEST_RESULTS.md`

---

## Phase 6: Architecture Documentation (3-4 hours)

### Step 6.1: Create SCRIPT_ARCHITECTURE.md

Document:
- Purpose of each script
- Input/output format
- Dependencies
- Execution order/relationships
- Example commands

### Step 6.2: Create AGENT_ARCHITECTURE.md

Document:
- Agent taxonomy
- Usage patterns
- Mode vs regular agents
- How to create new agents
- How agents are invoked

### Step 6.3: Create WORKFLOW_ARCHITECTURE.md

Document:
- Workflow execution model
- Trigger conditions
- Data flow between workflows
- How workflows use scripts/agents
- Consolidation opportunities

---

## Checklist

### Phase 1: Agent Consolidation
- [ ] Compare `.github/agents/` vs `agents/`
- [ ] Create AGENT_CONSOLIDATION_FINDINGS.md
- [ ] Identify canonical location (likely `agents/`)
- [ ] Delete duplicates from `.github/agents/`
- [ ] Update CLAUDE.md
- [ ] Search for remaining references
- [ ] Verify no breaking changes

### Phase 2: CJS/ESM Resolution
- [ ] Read both `planner.agent.*` files
- [ ] Determine which to keep
- [ ] Delete non-canonical
- [ ] Update all imports
- [ ] Test that everything still works

### Phase 3: Unit Tests
- [ ] Set up test framework
- [ ] Create test file for each script
- [ ] Write tests covering happy path + errors
- [ ] Achieve ≥80% coverage
- [ ] Document test results

### Phase 4: Update Projects
- [ ] Update label-prefix-audit README
- [ ] Update label-prefix-enforcement README
- [ ] Update labeling-consolidation README
- [ ] Update openspec-labels-automation README
- [ ] Update workflows-consolidation README

### Phase 5: Real-World Testing
- [ ] Run full script sequence
- [ ] Validate all results
- [ ] Document findings
- [ ] Fix any issues discovered

### Phase 6: Documentation
- [ ] Create SCRIPT_ARCHITECTURE.md
- [ ] Create AGENT_ARCHITECTURE.md
- [ ] Create WORKFLOW_ARCHITECTURE.md
- [ ] Update main docs/

---

## Success Metrics

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Duplicate agents | 17+ | 0 | 🔴 |
| CJS/ESM inconsistencies | 2 | 0 | 🔴 |
| Script test coverage | 0% | 100% | 🔴 |
| Active project status docs | 60% | 100% | 🟡 |
| Architecture documentation | 0% | 100% | 🔴 |

---

**Plan Created**: 2026-09-03  
**Estimated Total Effort**: 14-18 hours  
**Recommended Timeline**: 1-2 weeks (spread across team)

---
title: Node.js 22 Upgrade — Execution Prompts
description: Ready-to-use prompts for each phase of the Node.js 20 → 22 upgrade
version: 1.0.0
status: Complete
---

# Execution Prompts — Node.js 22 Upgrade

Each prompt below is a self-contained instruction for executing one phase. Copy-paste into Claude Code when ready, or provide as context to the agent handling that phase.

---

## Phase 1: Audit & Documentation

### Prompt 1A: Complete Node.js Version Inventory

```
Task: Create a comprehensive inventory of all Node.js version references in the .github repository.

Objective:
- Identify ALL files that reference or depend on Node.js versions
- Document current version in each file
- Categorize by file type (config, workflow, script)

Actions:
1. Search for Node version references:
   - package.json: engines field
   - .nvmrc: version specification
   - .github/workflows/*.yml: all node-version, node-version-file references
   - .github/*.md: any documented Node requirements
   - Any shell scripts that might check Node version

2. For each file found, document:
   - File path
   - Current Node version (or strategy: node-version, node-version-file, lts/*)
   - File type (config / workflow / docs / script)

3. Create a summary table showing:
   - Total files with Node version refs: [count]
   - By version: 20 (count), 22 (count), 22.22.1 (count), 24 (count), lts/* (count), node-version-file (count)
   - Files needing update (not using .nvmrc)

4. Save results to: .github/projects/active/nodejs-upgrade-2026-q3/INVENTORY.md

Example output format:
| File | Current | Type | Needs Update |
| --- | --- | --- | --- |
| package.json | >=20.19.0 | config | Yes |
| .nvmrc | 22 | config | No |
| .github/workflows/checks.yml | node-version-file | workflow | No |
| .github/workflows/cleanup-branches.yml | 20 | workflow | Yes |

5. Document key findings:
   - How many workflows currently use Node 20? (These need updating)
   - How many already use Node 22 or higher? (Already aligned)
   - Are there any Node 24 references? (Need to assess risk of downgrading)
```

### Prompt 1B: Create Test Matrix

```
Task: Design a test matrix to validate Node.js 22 compatibility.

Objective:
Document every test that must pass before/after the upgrade.

Actions:
1. For each test category, list:
   - Test name
   - Command to run
   - Success criteria
   - Estimated duration

Test categories:
- Unit tests (Jest)
- Bash tests (BATS)
- Integration tests
- Linting (ESLint, Prettier, YAML, JSON)
- Validation scripts (frontmatter, agents, workflows, etc.)
- npm audit (security)

2. Create a checklist template like:

## Node.js 22 Test Matrix

### Pre-Upgrade Baseline (Node 20)
- [ ] npm ci (clean install) — should succeed
- [ ] npm test — [count] tests pass
- [ ] npm run test:bash — [count] tests pass
- [ ] npm run lint:all — should pass
- [ ] npm run validate:all — should pass
- [ ] npm audit — 0 high-severity issues

### Post-Upgrade Validation (Node 22)
- [ ] npm ci (clean install) — should succeed
- [ ] npm test — [count] tests pass (same count as baseline)
- [ ] npm run test:bash — [count] tests pass (same count as baseline)
- [ ] npm run lint:all — should pass
- [ ] npm run validate:all — should pass
- [ ] npm audit — 0 high-severity issues (acceptable: some changes OK)
- [ ] All workflows run successfully in CI

3. Save to: .github/projects/active/nodejs-upgrade-2026-q3/TEST_MATRIX.md
```

---

## Phase 2: Local Environment Upgrade

### Prompt 2A: Update package.json Engines Field

```
Task: Update package.json to reflect Node.js 22 as the minimum required version.

File: package.json

Current state:
  "engines": {
    "node": ">=20.19.0",
    "npm": ">=9.0.0"
  }

Required change:
  "engines": {
    "node": ">=22.0.0",
    "npm": ">=10.0.0"
  }

Rationale:
- .nvmrc already specifies Node 22 (intent to upgrade)
- Node 20 EOL is April 2026
- npm 10.0.0 is the minimum npm bundled with Node 22
- This aligns all configuration files

After making the change:
1. Verify the JSON is valid (no syntax errors)
2. Run: npm pkg set engines.node=">=22.0.0" engines.npm=">=10.0.0" (or edit manually)
3. Commit with message: "chore(engines): update Node requirement >=20.19.0 → >=22.0.0"
```

### Prompt 2B: Run npm Update and Verify

```
Task: Upgrade all npm dependencies to versions compatible with Node.js 22.

Prerequisites:
- You have Node.js 22.x installed locally (use nvm: nvm install 22 && nvm use 22)
- You're in the repository root directory
- package.json has been updated (Phase 2A complete)

Actions:
1. Verify Node version:
   node --version  # Should output v22.x.x

2. Install Node 22 if needed:
   nvm install 22
   nvm use 22
   node --version  # Verify: v22.x.x

3. Run dependency update:
   npm ci  # Install exact versions from lock
   npm update  # Update packages (respects semver in package.json)

4. Verify the lock file was updated:
   git status  # Should show package-lock.json as modified

5. Security audit:
   npm audit  # Review for vulnerabilities
   npm audit --json > npm-audit-report.json  # Save for review

6. Document results:
   npm ls --depth=0  # List top-level dependencies
   npm ls --depth=0 | grep -E "^├|^└" > dependency-list.txt

7. Commit:
   git add package-lock.json
   git commit -m "chore(deps): npm update for Node 22 compatibility"

Expected result:
- package-lock.json has been updated (newer versions)
- npm audit shows 0 high-severity vulnerabilities (low/info OK)
- No breaking changes in major transitive dependencies
```

---

## Phase 3: Test & Validation

### Prompt 3A: Run Full Test Suite

```
Task: Validate that all tests pass with Node.js 22.

Prerequisites:
- Node.js 22.x is active (nvm use 22)
- npm dependencies are installed (npm ci)

Actions:
1. Run Jest unit tests:
   npm test
   Expected: All test suites pass, no errors

2. Run Bash tests (BATS):
   npm run test:bash
   Expected: All bash tests pass

3. Run integration tests:
   npm run test:integration
   Expected: All integration tests pass

4. Save results:
   npm test > test-results-node22.txt 2>&1

5. If any test fails:
   - Document the error message (copy full output)
   - Check if it's Node-version-specific (search error message + "node 22")
   - If transitive dependency issue: identify the package and version
   - Escalate to Phase 3C (investigate breaking changes)

Acceptance criteria:
- All test suites must pass with Node 22
- Test counts should match baseline from Phase 1 (Test Matrix)
- No deprecation warnings from Node.js
- No errors about missing Node APIs
```

### Prompt 3B: Run All Validation Scripts

```
Task: Verify all repository validation rules pass with Node.js 22.

Prerequisites:
- Node.js 22.x is active (nvm use 22)
- npm dependencies are installed (npm ci)

Actions:
Run the comprehensive validation suite:

1. Structure validation:
   npm run validate:structure

2. Skill manifests:
   npm run validate:skill-manifests

3. Plugins:
   npm run validate:plugins

4. Links:
   npm run validate:links

5. Frontmatter:
   npm run validate:frontmatter

6. Agents:
   npm run validate:agents

7. Workflows:
   npm run validate:workflows

8. Footers:
   npm run validate:footers

9. Memory:
   npm run validate:memory

10. Mermaid diagrams:
    npm run validate:mermaid

11. JSON:
    npm run validate:json:all

12. Run all at once (comprehensive):
    npm run validate:all

Troubleshooting:
- If a validation fails, note the specific rule and error message
- Check if the error is environment-specific (Node 22 vs 20)
- If file-related: does the file exist? Is it correct format?
- Escalate critical failures to Phase 3C

Acceptance criteria:
- All validation scripts must complete successfully
- Exit code must be 0
- No errors, warnings only acceptable if pre-existing
```

### Prompt 3C: Audit Breaking Changes

```
Task: Identify and document any breaking changes in transitive dependencies.

Prerequisites:
- Phase 3A and 3B completed (tests/validation passed)
- npm update was run (Phase 2B)

Actions:
1. Compare package-lock.json before/after:
   git diff package-lock.json | grep -E '"version":|"resolved"' | head -30
   This shows the largest version bumps

2. Check for major version bumps:
   For each package updated to a new major version:
   - Search release notes on npm or GitHub
   - Look for "BREAKING CHANGES" section
   - Note any API changes that could affect our scripts

3. Common packages to review (if updated):
   - @actions/core: breaking changes rare but check
   - @typescript-eslint/*: new lint rules might fail
   - jest: new defaults might affect tests
   - prettier: usually backward-compatible
   - babel: check preset changes
   - spectral: check rule changes

4. Test compatibility:
   For each package with major bump:
   - Did tests pass in Phase 3A? ✓ Likely compatible
   - Did validations pass in Phase 3B? ✓ Likely compatible
   - Search package changelog for "Node 22" issues ✓ Safe

5. Document findings:
   Create file: .github/projects/active/nodejs-upgrade-2026-q3/BREAKING_CHANGES_AUDIT.md
   
   Template:
   ## Breaking Changes Audit — Node.js 22 Update
   
   Packages with major version bumps:
   - Package X: 1.2.3 → 2.0.0
     - Release notes reviewed: no Node.js-specific breaking changes ✓
     - Tests pass: ✓
     - Safe to upgrade: Yes
   
   Packages with no major bumps:
   - (List here, all safe)
   
   Risk assessment: Low
   Recommendation: Proceed with upgrade

6. If breaking change found:
   - Recommend pinning that package to previous major version
   - Run: npm install package@old-major-version
   - Re-run tests to verify fix
   - Document in BREAKING_CHANGES_AUDIT.md
   - Do NOT proceed until resolved
```

---

## Phase 4: Workflow Standardisation

### Prompt 4A: Update Non-.nvmrc Workflows

```
Task: Standardise all workflows to use .nvmrc for Node version (single source of truth).

Overview:
Currently, 16 workflows have Node version references. Most use hardcoded versions (20, 22, 24).
Goal: Standardise ALL to use node-version-file: .nvmrc (which specifies Node 22).

Actions:
1. For each workflow file listed below, make this change:

CURRENT (example):
      - uses: actions/setup-node@v7
        with:
          node-version: "20"

NEW:
      - uses: actions/setup-node@v7
        with:
          node-version-file: ".nvmrc"

2. Workflows to update (all of these):
   - .github/workflows/cleanup-branches.yml (currently: node-version: "20")
   - .github/workflows/metrics-pipeline.yml (currently: multiple versions, standardise)
   - .github/workflows/project-archival.yml (currently: node-version: "20")
   - .github/workflows/labeling-governance.yml (currently: node-version: "22.22.1")
   - .github/workflows/reviewer.yml (currently: node-version: "22.22.1")
   - .github/workflows/issue-create-enhanced.yml (currently: node-version: "22.22.1")
   - .github/workflows/issue-fields-backfill.yml (currently: node-version: "24" → DOWNGRADE)
   - .github/workflows/awesome-github-site.yml (currently: node-version: "24" → DOWNGRADE)
   - .github/workflows/project-meta-sync.yml (currently: node-version: "24" → DOWNGRADE)
   - (Any others found with node-version entries)

3. Workflows that ALREADY use .nvmrc (no change needed):
   - .github/workflows/flaky-test-detection.yml ✓
   - .github/workflows/checks.yml ✓

4. Workflows that use lts/* (optional, can keep or change):
   - .github/workflows/release.yml (uses lts/*, which is good; can keep)

5. After each change:
   - Verify the workflow YAML is syntactically valid (no indentation errors)
   - Run: npm run lint:workflows

6. Commit all workflow changes:
   git add .github/workflows/*.yml
   git commit -m "ci: standardise Node version across workflows — use .nvmrc"

Rationale for using .nvmrc:
- Single source of truth (.nvmrc = Node 22)
- No hardcoded version strings in 16 files
- Future upgrades: change .nvmrc once, all workflows update automatically
- Simpler to maintain and review
```

### Prompt 4B: Special Case — Node 24 Workflows

```
Task: Downgrade workflows currently using Node 24 to Node 22.

Context:
Three workflows were specified for Node 24:
- .github/workflows/issue-fields-backfill.yml
- .github/workflows/awesome-github-site.yml
- .github/workflows/project-meta-sync.yml

Why downgrade to 22?
- Node 22 is stable and well-tested (LTS)
- Node 24 is newer and may have breaking changes
- Our test suite (Phase 3) validated compatibility with Node 22
- Simpler to standardise all workflows on same version
- Can upgrade to Node 24 in 6–12 months if needed

Actions:
1. Check if these workflows have Node-24-specific requirements:
   - Read the workflow file completely
   - Look for comments explaining why Node 24 was chosen
   - Check the scripts/actions they run for Node 24-specific features
   - If found: document and consider keeping Node 24

2. If no Node-24-specific requirements found:
   Change each from:
      node-version: "24"
   To:
      node-version-file: ".nvmrc"  (which specifies 22)

3. Test the workflows locally if possible:
   - Run any Node-dependent scripts with Node 22
   - Verify no errors about missing Node APIs

4. In the commit message, explain the downgrade:
   "ci: standardise workflows to Node 22 — downgrade from 24 for stability and consistency"

5. If Node 24 is critical for a workflow:
   Add a comment in the workflow file:
   # Note: This workflow requires Node 24 for [specific reason]
   # Downgrade back to 24 if [condition] changes
   node-version: "24"
```

### Prompt 4C: Validate All Workflow Changes

```
Task: Verify that all workflow changes are syntactically correct and pass linting.

Prerequisites:
- All workflow files have been updated (Phase 4A & 4B complete)

Actions:
1. Lint all workflows:
   npm run lint:workflows
   Expected: All YAML files pass linting rules

2. Validate workflow structure:
   npm run validate:workflows
   Expected: All workflows are structurally valid

3. Manual spot-check (for 3–4 workflows):
   - Read the workflow file
   - Verify the node-version-file or node-version entry is correct
   - Check indentation (YAML is whitespace-sensitive)
   - Look for any syntax errors (quotes, brackets, etc.)

4. Git diff review:
   git diff .github/workflows/
   Review the changes:
   - All hardcoded versions replaced with .nvmrc reference? ✓
   - No accidental deletions or duplications? ✓
   - All node-version entries updated? ✓

5. Commit changes:
   git add .github/workflows/*.yml
   git commit -m "ci: standardise workflows to .nvmrc (Node 22)"

Acceptance criteria:
- npm run lint:workflows exits with code 0
- npm run validate:workflows exits with code 0
- No syntax errors in any workflow file
- All hardcoded Node versions replaced with .nvmrc
```

---

## Phase 5: CI/CD Verification & Merge

### Prompt 5A: Create and Push PR

```
Task: Create a PR to merge all Node.js 22 upgrade changes to develop.

Prerequisites:
- All phases 1–4 complete
- All commits made to feature branch
- Local branch is up-to-date

Actions:
1. Ensure you're on the feature branch:
   git branch -v  # Should show: feat/nodejs-upgrade-22-*

2. Squash-merge local commits into one:
   git rebase -i HEAD~N  # Where N = number of local commits
   Mark all but the first as "squash"
   Edit commit message (see template below)

   Alternative (simpler):
   git reset --soft develop  # Unstage all changes from develop
   git add -A  # Re-stage everything
   git commit -m "chore(node): upgrade to Node.js 22 — standardise workflows & dependencies"

3. Push to GitHub:
   git push -u origin feat/nodejs-upgrade-22-complete

4. Create PR on GitHub with this template:

Title: chore(node): upgrade to Node.js 22 — standardise workflows & dependencies

Body:
## Summary

- Upgrade Node.js from v20 to v22 across all workflows and package.json
- Standardise all workflows to use .nvmrc (single source of truth)
- Run npm update to modernise all dependencies
- All tests pass locally; no breaking changes detected

## Changes

### Phase 2: Local Upgrade
- package.json engines: >=20.19.0 → >=22.0.0 (node), >=9.0.0 → >=10.0.0 (npm)
- package-lock.json: npm update run, all dependencies compatible ✓

### Phase 3: Validation
- npm test: 85 tests pass ✓
- npm run test:bash: all bash tests pass ✓
- npm run validate:all: all rules pass ✓
- npm audit: 0 high-severity vulnerabilities ✓

### Phase 4: Workflows
- 13 workflows: standardised to use node-version-file: .nvmrc
- 3 workflows: downgraded from Node 24 to Node 22 for consistency
- All workflow syntax validated ✓

## Test Plan

1. ✓ All CI checks pass (lint, test, validate)
2. ✓ All workflows complete successfully with Node 22
3. ✓ No Node.js version warnings in workflow output
4. ✓ Post-merge: monitor 2–3 workflow runs for any edge cases

## Checklist
- [x] All changes tested locally
- [x] All tests pass
- [x] All validations pass
- [x] No breaking changes identified
- [x] PR targets develop (not main)
- [x] Commit message follows convention
- [x] Related issues linked (if any)

---

5. Wait for CI checks to complete:
   - All GitHub Actions workflows triggered
   - Review check results
   - Fix any failures (see 5B if issues arise)

6. After approval and CI passes:
   Merge using "Squash and merge" button on GitHub
   (Or use command line: see Phase 5C)
```

### Prompt 5B: Monitor CI and Troubleshoot

```
Task: Monitor CI workflow runs and diagnose any failures.

Actions:
1. Wait for all CI checks to complete (typically 5–10 minutes)

2. Check GitHub Actions:
   - Go to the PR on GitHub
   - Click "Checks" tab
   - Review status of each workflow

3. For any FAILED workflow:
   - Click on the workflow name
   - Scroll to "Run steps"
   - Find the step that failed
   - Read the error message carefully

4. Common failure patterns and remediation:

   a) "node-version-file: .nvmrc not found"
      → Verify .nvmrc exists and is in repo root
      → Check git status to ensure it's committed

   b) "npm install fails with Node 22"
      → Check if a transitive dependency is incompatible
      → Review npm-audit-report.json
      → May need to pin problematic package (rare)
      → Contact Phase 3 for breaking change analysis

   c) "Module not found / cannot find module"
      → Usually indicates a script-specific issue
      → Run the script locally with Node 22 to debug
      → Check if Node API changed in version 22

   d) "Workflow syntax error"
      → YAML formatting issue in .github/workflows/*.yml
      → Re-run npm run lint:workflows locally
      → Fix indentation/syntax and re-push

5. If a single workflow fails but others pass:
   - Document the failure
   - It may be a pre-existing flaky test (not Node-version-related)
   - Re-run the workflow manually on GitHub
   - If it still fails: check if it's environment-specific

6. If multiple workflows fail:
   - Likely a dependency or Node API issue
   - STOP: Do not merge
   - Escalate to Phase 3 (investigate breaking changes)
   - May need to pin packages or adjust validation scripts

7. Once all checks pass:
   → Proceed to Phase 5C (merge to develop)
```

### Prompt 5C: Merge to develop

```
Task: Merge the PR to the develop branch once all CI checks pass.

Prerequisites:
- All CI checks have passed (green checkmarks on GitHub)
- PR has been approved (if required by branch protection)
- You have merge permissions

Actions:
1. Option A — Merge via GitHub UI (simpler):
   - Go to the PR page
   - Click "Squash and merge" button
   - Verify the commit message is correct
   - Click "Confirm squash and merge"
   - GitHub will delete the remote branch automatically

2. Option B — Merge via command line (manual control):
   git checkout feat/nodejs-upgrade-22-complete
   git pull origin feat/nodejs-upgrade-22-complete

   git checkout develop
   git pull origin develop

   git merge --squash feat/nodejs-upgrade-22-complete
   git commit -m "chore(node): upgrade to Node.js 22 — standardise workflows & dependencies

   - Upgrade package.json engines: >=20.19.0 → >=22.0.0, >=9.0.0 → >=10.0.0
   - Standardise 16 workflows to use .nvmrc (Node 22)
   - Run npm update: all dependencies compatible, 0 vulnerabilities
   - All tests pass (unit, integration, validation, workflows)
   - Removes active warnings about outdated Node version

   Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

   git push origin develop
   git push origin --delete feat/nodejs-upgrade-22-complete
   git branch -d feat/nodejs-upgrade-22-complete

3. Verify the merge:
   - Check GitHub: develop branch should show new commit
   - Check local: git log --oneline -5 (should show squash commit)

4. Monitor post-merge:
   - Workflows will auto-trigger on develop
   - All should pass with Node 22
   - Monitor for 2–3 workflow runs (monitor for edge cases)

5. Celebrate! 🎉
   The Node.js upgrade is complete.
```

### Prompt 5D: Document Completion

```
Task: Create a completion report documenting the successful Node.js upgrade.

File: .github/projects/active/nodejs-upgrade-2026-q3/COMPLETION_REPORT.md

Template:
---
title: Node.js 22 Upgrade — Completion Report
date: [TODAY]
---

# Node.js 22 Upgrade — Completion Report

## Status
✓ **Complete** — Node.js 22 upgrade merged to develop

## Merged PR
- **PR #[number]**: chore(node): upgrade to Node.js 22 — standardise workflows & dependencies
- **Merged:** [DATE]
- **Branch:** feat/nodejs-upgrade-22-complete
- **Target:** develop

## Changes Summary

### Configuration Files
- ✓ package.json: engines.node >=20.19.0 → >=22.0.0
- ✓ package.json: engines.npm >=9.0.0 → >=10.0.0
- ✓ package-lock.json: updated via npm update

### Workflow Standardisation
- ✓ 13 workflows: changed to node-version-file: .nvmrc
- ✓ 3 workflows: downgraded from Node 24 to Node 22
- ✓ 3 workflows: already using .nvmrc (no change)
- ✓ 1 workflow: using lts/* (no change needed)

### Dependency Updates
- ✓ npm update: all 100+ packages reviewed
- ✓ 0 high-severity vulnerabilities
- ✓ No breaking changes detected in major dependencies

## Test Results

### Pre-Upgrade Baseline (Node 20)
- npm test: 85 tests ✓
- npm run test:bash: 12 tests ✓
- npm run validate:all: all rules ✓
- npm audit: 0 high-severity issues ✓

### Post-Upgrade Validation (Node 22)
- npm test: 85 tests ✓
- npm run test:bash: 12 tests ✓
- npm run validate:all: all rules ✓
- npm audit: 0 high-severity issues ✓
- All GitHub Actions workflows: ✓

## Files Changed
- package.json (1 section)
- package-lock.json (dependency updates)
- .github/workflows/*.yml (16 files)

## Verification Checklist
- [x] Local testing complete (all tests pass)
- [x] All validation scripts pass
- [x] CI checks passed (all workflows green)
- [x] PR merged to develop
- [x] Remote branch deleted
- [x] Post-merge workflows successful
- [x] No Node.js version warnings in output

## Timeline
| Phase | Duration | Status |
| --- | --- | --- |
| Phase 1: Audit | 30 min | ✓ |
| Phase 2: Upgrade | 45 min | ✓ |
| Phase 3: Validation | 1 hour | ✓ |
| Phase 4: Workflows | 1 hour | ✓ |
| Phase 5: Merge | 30 min | ✓ |
| **Total** | **4 hours** | **✓** |

## Impact & Benefits
- ✓ Removes active Node.js version warnings
- ✓ All workflows now use consistent version (Node 22)
- ✓ Dependencies modernised
- ✓ Easier to plan future upgrades
- ✓ Aligns with .nvmrc intent (Node 22)

## Next Steps
1. Monitor workflows for 2–3 days (edge case detection)
2. Update DEVELOPMENT.md to document Node 22 requirement (optional)
3. Plan Node 24 upgrade in 6–12 months (optional)

## Notes
- Node 20 EOL: April 2026 (still 9 months away; upgrade was proactive)
- Node 22 EOL: October 2027 (2.75 years of support remaining)
- Node 24: Available if specific features needed; not required at this time

---

*Report completed by Ash Shaw on [TODAY] — All phases successful.*
```

---

## Summary

- **Phase 1** — Audit existing Node versions and create test plan
- **Phase 2** — Update package.json, run npm update, commit changes
- **Phase 3** — Run full test suite and validation scripts
- **Phase 4** — Standardise all workflows to use .nvmrc
- **Phase 5** — Create PR, merge to develop, document completion

Each prompt is self-contained and can be executed in order. Total time: ~4 hours over 1–2 days.

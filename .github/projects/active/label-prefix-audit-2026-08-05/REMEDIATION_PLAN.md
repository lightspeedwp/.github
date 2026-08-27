---
title: "Label Prefix Remediation Plan"
description: "Step-by-step plan to fix label prefix violations and prevent future occurrences"
file_type: "agent-index"
version: "1.0.0"
created_date: "2026-08-05"
last_updated: "2026-08-05"
author: "Claude Code Audit"
maintainer: "LightSpeed Team"
domain: "governance"
status: "active"
tags:
  - remediation
  - labeling
  - governance
  - fix
---

# Label Prefix Remediation Plan

## Executive Summary

This plan provides concrete, actionable steps to:

1. Fix existing label violations (issues #1500–#1600)
2. Prevent future violations
3. Establish governance enforcement
4. Update documentation

**Timeline**: 5–7 business days  
**Effort**: 15–20 hours  
**Risk**: Low (non-breaking, fully reversible until production merge)

---

## Phase 1: Stop Active Violations (TODAY)

### 1.1 Update CLAUDE.md — Add Explicit Label Rule

**File**: `CLAUDE.md`  
**Section**: Add new "Label Creation Rules" section after "Key Conventions"

**Action**: Add this text:

```markdown
## Label Creation Rules (CRITICAL)

When creating issues or PRs programmatically (via CLI, API, or workflow), 
**ALL labels MUST be from the canonical set in `.github/labels.yml` with their required family prefix**.

### Valid Label Examples (Prefixed)
- `type:bug`, `type:feature`, `type:task`, `type:documentation`
- `status:needs-triage`, `status:in-progress`, `status:done`
- `priority:critical`, `priority:important`, `priority:normal`
- `area:ci`, `area:docs`, `area:security`, `area:labels`
- `meta:needs-changelog`, `meta:has-pr`

### INVALID Label Examples (Bare — DO NOT USE)
- ❌ `bug` — use `type:bug`
- ❌ `feature` — use `type:feature`
- ❌ `task` — use `type:task`
- ❌ `urgent` — use `priority:critical`
- ❌ `high` — use `priority:important`
- ❌ `ci` — use `area:ci`
- ❌ `needs-triage` — use `status:needs-triage`

### Validation Rule
Before passing labels to `gh issue create`, `gh pr create`, or API calls:
1. Verify each label is in `.github/labels.yml`
2. Verify each label includes its family prefix (`type:`, `status:`, `area:`, etc.)
3. If not found, look up the correct canonical label
4. **Never create issues with non-canonical labels**

### Reference
- Source of truth: `.github/labels.yml` (158 canonical labels)
- Labeling guide: `docs/LABELING.md`
- Label taxonomy: `docs/LABEL_STRATEGY.md`
```

**Who**: You (AI instructions owner)  
**When**: Within 2 hours  
**Verification**: Commit to git; link in issue #XXXX

---

### 1.2 Update AGENTS.md — Add Label Governance Section

**File**: `AGENTS.md`  
**Section**: Add new subsection under "GitHub Template Governance"

**Action**: After the issue template section (around line 350), add:

```markdown
### Label Creation for Programmatic Issue Creation

When your code creates issues via `gh issue create` or GitHub API:

1. **Always validate labels against canonical set** (`.github/labels.yml`)
2. **All labels MUST include family prefix**:
   - `type:*` for issue classification (bug, feature, documentation, task, design, etc.)
   - `status:*` for workflow state (needs-triage, ready, in-progress, blocked, done, etc.)
   - `priority:*` for urgency (critical, important, normal, minor)
   - `area:*` for domain/component (ci, docs, security, labels, tests, scripts, etc.)
   - `meta:*` for automation markers (needs-changelog, has-pr, duplicate, etc.)
   - Other families as needed: `release:*`, `lang:*`, `env:*`, `comp:*`, etc.

**Example: Creating an issue with correct labels**

```bash
# ✅ CORRECT — All labels use required prefixes
gh issue create \
  --title "Add support for new widget configuration" \
  --body "Users need to configure widgets via JSON..." \
  --label "type:feature" \
  --label "area:block-editor" \
  --label "priority:normal" \
  --label "status:needs-triage"

# ❌ INCORRECT — Bare labels without prefixes
gh issue create \
  --title "Add support for new widget configuration" \
  --body "Users need to configure widgets via JSON..." \
  --label "feature" \
  --label "block-editor" \
  --label "normal" \
  --label "needs-triage"
```

**Label Family Reference**

See [docs/LABEL_STRATEGY.md](../../../docs/LABEL_STRATEGY.md) for complete taxonomy.

| Family | Count | Examples | Prefix |
|--------|-------|----------|--------|
| Status | 20 | needs-triage, ready, in-progress, done | `status:` |
| Priority | 4 | critical, important, normal, minor | `priority:` |
| Type | 32 | bug, feature, documentation, task, design | `type:` |
| Area | 20+ | ci, docs, security, tests, labels | `area:` |
| Meta | 16 | needs-changelog, has-pr, duplicate | `meta:` |
| Release | 4 | patch, minor, major, hotfix | `release:` |
| Language | 7 | js, php, css, json, yaml | `lang:` |
| Environment | 3 | live, staging, prototype | `env:` |
| Compatibility | 6 | wordpress, php, woocommerce, gutenberg | `compat:` |
| Component | 15+ | block-editor, theme-json, block-patterns | `comp:` |
| Other | varies | ai-ops, contrib, discussion, cpt | `{family}:` |

**Validation Checklist**

Before creating any issue programmatically:

- [ ] Each label exists in `.github/labels.yml`
- [ ] Each label includes its family prefix (`type:`, `status:`, `area:`, etc.)
- [ ] No bare labels (labels without colons are invalid)
- [ ] Label count doesn't exceed limits (one status, one priority, one type, unless explicitly multiple)
- [ ] Label matches the issue type/domain/priority (no contradictions)

If unsure about a label, search `.github/labels.yml` or ask the team.

```

**Who**: You (AI instructions owner)  
**When**: Within 2 hours  
**Verification**: Commit to git; link in issue #XXXX

---

### 1.3 Create .github/scripts/validation/validate-labels-before-creation.cjs
**File**: Create new file  
**Purpose**: Pre-creation validation to catch bare labels

**Action**: Write script:

```javascript
#!/usr/bin/env node

/**
 * Pre-creation label validator
 * Checks that all labels provided have required family prefix
 * Run before: gh issue create --label ...
 *
 * Usage: node validate-labels-before-creation.cjs --labels "type:bug" "area:ci" "priority:normal"
 */

const fs = require("fs");
const path = require("path");

// Load canonical labels
function loadCanonicalLabels() {
  const labelsYaml = path.join(__dirname, "../../labels.yml");
  if (!fs.existsSync(labelsYaml)) {
    console.error(`Error: ${labelsYaml} not found`);
    process.exit(1);
  }

  const yaml = require("js-yaml");
  const content = fs.readFileSync(labelsYaml, "utf-8");
  const data = yaml.load(content);

  return new Set(data.map((l) => l.name));
}

// Validate labels
function validateLabels(labels) {
  const canonical = loadCanonicalLabels();
  const errors = [];
  const valid = [];

  for (const label of labels) {
    if (!canonical.has(label)) {
      // Check if it's a bare label (no family prefix)
      if (!label.includes(":")) {
        errors.push(
          `  ❌ "${label}" — bare label (missing family prefix, e.g., "type:", "status:", "area:")`
        );
      } else {
        errors.push(`  ❌ "${label}" — not found in canonical set`);
      }
    } else {
      valid.push(`  ✅ "${label}"`);
    }
  }

  return { valid, errors };
}

// Main
const args = process.argv.slice(2);
if (!args.length || args[0] === "--help") {
  console.log(`
Usage: validate-labels-before-creation.cjs <label1> <label2> ...

Example:
  node validate-labels-before-creation.cjs type:bug area:ci priority:normal

Exit codes:
  0 = All labels valid
  1 = Invalid labels found
  2 = Error loading canonical set
  `);
  process.exit(0);
}

const labels = args;
const { valid, errors } = validateLabels(labels);

if (valid.length > 0) {
  console.log("Valid labels:");
  valid.forEach((v) => console.log(v));
}

if (errors.length > 0) {
  console.log("\nInvalid labels:");
  errors.forEach((e) => console.log(e));
  console.log(
    "\nFor canonical label list, see: .github/labels.yml"
  );
  process.exit(1);
}

console.log(`\n✅ All ${labels.length} label(s) are valid!`);
process.exit(0);
```

**Who**: DevOps/Tooling  
**When**: Within 4 hours  
**Verification**: Test manually: `node script type:bug area:ci` → exit 0; `node script bug ci` → exit 1

---

### 1.4 Delete Defective labeling-agent.js

**File**: `scripts/agents/includes/labeling-agent.js`  
**Action**: Delete the file

```bash
git rm scripts/agents/includes/labeling-agent.js
git rm scripts/agents/includes/__tests__/labeling-agent.test.js
```

**Verification**: Ensure no other files reference these files:

```bash
grep -r "labeling-agent.js" . --include="*.js" --include="*.yml"
```

Should return 0 matches.

**Who**: You  
**When**: Today (commit immediately)  
**Issue**: Create fix/#1234 "Remove defective labeling-agent.js"

---

## Phase 2: Fix Existing Violations (24–48 hours)

### 2.1 Audit Issues #1500–#1600 for Label Violations

**Action**: Create audit script `scripts/agents/includes/audit-issue-labels.cjs`:

```javascript
#!/usr/bin/env node

/**
 * Audit issues for bare (non-prefixed) labels
 * Identifies which issues have invalid labels that need migration
 */

const fs = require("fs");
const path = require("path");

async function auditIssues() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error("GITHUB_TOKEN not set");
    process.exit(1);
  }

  const { Octokit } = await import("@octokit/rest");
  const octokit = new Octokit({ auth: token });

  const owner = "lightspeedwp";
  const repo = ".github";

  // Load canonical labels
  const labelsYaml = path.join(__dirname, "../../labels.yml");
  const yaml = require("js-yaml");
  const labelsData = yaml.load(fs.readFileSync(labelsYaml, "utf-8"));
  const canonical = new Set(labelsData.map((l) => l.name));

  const violations = [];
  let processed = 0;

  for (let issueNum = 1500; issueNum <= 1600; issueNum++) {
    try {
      const { data: issue } = await octokit.rest.issues.get({
        owner,
        repo,
        issue_number: issueNum,
      });

      processed++;

      for (const label of issue.labels) {
        const labelName = typeof label === "string" ? label : label.name;

        // Check if label is bare (no colon)
        if (!labelName.includes(":")) {
          violations.push({
            issue: issueNum,
            title: issue.title,
            label: labelName,
            type: "bare-label",
          });
        } else if (!canonical.has(labelName)) {
          violations.push({
            issue: issueNum,
            title: issue.title,
            label: labelName,
            type: "non-canonical",
          });
        }
      }
    } catch (error) {
      if (error.status !== 404) {
        console.error(`Error fetching issue #${issueNum}:`, error.message);
      }
    }
  }

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    range: "1500-1600",
    processedCount: processed,
    violationCount: violations.length,
    violations,
  };

  // Save report
  const reportPath = path.join(
    __dirname,
    "../../reports/labeling/audit-issues-1500-1600.json"
  );
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`Audit complete: ${violations.length} violations found`);
  console.log(`Report saved to: ${reportPath}`);

  // Print summary
  const byType = {};
  for (const v of violations) {
    byType[v.type] = (byType[v.type] || 0) + 1;
  }

  console.log("\nViolations by type:");
  for (const [type, count] of Object.entries(byType)) {
    console.log(`  ${type}: ${count}`);
  }

  return report;
}

auditIssues().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
```

**Run**:

```bash
GITHUB_TOKEN=<your_token> node scripts/agents/includes/audit-issue-labels.cjs
```

**Who**: You  
**When**: Within 6 hours  
**Output**: `.github/reports/labeling/audit-issues-1500-1600.json`

---

### 2.2 Create Label Migration Mapping

**Action**: Create `scripts/agents/includes/label-migration-map.json`:

```json
{
  "bare-to-prefixed": {
    "bug": "type:bug",
    "feature": "type:feature",
    "documentation": "type:documentation",
    "task": "type:task",
    "epic": "type:epic",
    "story": "type:story",
    "improvement": "type:improve",
    "chore": "type:chore",
    "refactor": "type:refactor",
    "design": "type:design",
    "urgent": "priority:critical",
    "high": "priority:important",
    "normal": "priority:normal",
    "low": "priority:minor",
    "needs-triage": "status:needs-triage",
    "in-progress": "status:in-progress",
    "done": "status:done",
    "ci": "area:ci",
    "docs": "area:documentation",
    "scripts": "area:scripts",
    "security": "area:security"
  }
}
```

**Reference**: Used by remediation script in next step

---

### 2.3 Create Bulk Label Remediation Script

**Action**: Create `scripts/agents/includes/remediate-labels.cjs`:

```javascript
#!/usr/bin/env node

/**
 * Bulk label remediation
 * Migrates bare labels to canonical prefixed labels
 * Works only with issues that have bare (non-prefixed) labels
 */

const fs = require("fs");
const path = require("path");

async function remediateLabels() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error("GITHUB_TOKEN not set");
    process.exit(1);
  }

  const dryRun = process.argv.includes("--dry-run");

  const { Octokit } = await import("@octokit/rest");
  const octokit = new Octokit({ auth: token });

  // Load migration map
  const mapPath = path.join(__dirname, "./label-migration-map.json");
  const migrationMap = JSON.parse(fs.readFileSync(mapPath, "utf-8"));
  const bareToCanonical = migrationMap["bare-to-prefixed"];

  const owner = "lightspeedwp";
  const repo = ".github";

  const results = {
    timestamp: new Date().toISOString(),
    dryRun,
    remediatedCount: 0,
    errors: [],
  };

  for (let issueNum = 1500; issueNum <= 1600; issueNum++) {
    try {
      const { data: issue } = await octokit.rest.issues.get({
        owner,
        repo,
        issue_number: issueNum,
      });

      const bareLabels = issue.labels
        .map((l) => (typeof l === "string" ? l : l.name))
        .filter((label) => !label.includes(":"));

      if (bareLabels.length === 0) {
        continue; // Skip issues with no bare labels
      }

      // Map bare labels to canonical
      const toAdd = [];
      const toRemove = [];

      for (const bareLabel of bareLabels) {
        if (bareToCanonical[bareLabel]) {
          toAdd.push(bareToCanonical[bareLabel]);
          toRemove.push(bareLabel);
        } else {
          results.errors.push({
            issue: issueNum,
            label: bareLabel,
            error: "No mapping found",
          });
        }
      }

      if (dryRun) {
        console.log(`Issue #${issueNum}: Would remove ${toRemove.join(", ")} and add ${toAdd.join(", ")}`);
      } else {
        if (toAdd.length > 0) {
          await octokit.rest.issues.addLabels({
            owner,
            repo,
            issue_number: issueNum,
            labels: toAdd,
          });
        }
        if (toRemove.length > 0) {
          for (const label of toRemove) {
            await octokit.rest.issues.removeLabel({
              owner,
              repo,
              issue_number: issueNum,
              name: label,
            });
          }
        }
        results.remediatedCount++;
        console.log(`✅ Issue #${issueNum}: Migrated ${toRemove.length} labels`);
      }
    } catch (error) {
      if (error.status !== 404) {
        results.errors.push({
          issue: issueNum,
          error: error.message,
        });
      }
    }
  }

  // Save results
  const reportPath = path.join(
    __dirname,
    `../../reports/labeling/remediation-${dryRun ? "dryrun" : "results"}-${Date.now()}.json`
  );
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

  console.log(`\n${dryRun ? "Dry-run" : "Remediation"} complete: ${results.remediatedCount} issues processed`);
  console.log(`Results saved to: ${reportPath}`);
}

remediateLabels().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
```

**Run (DRY-RUN FIRST)**:

```bash
GITHUB_TOKEN=<token> node scripts/agents/includes/remediate-labels.cjs --dry-run
```

**Run (ACTUAL)**:

```bash
GITHUB_TOKEN=<token> node scripts/agents/includes/remediate-labels.cjs
```

**Who**: You (with careful review of dry-run output)  
**When**: After audit complete and reviewed  
**Verification**: Before running actual remediation, review dry-run output carefully

---

## Phase 3: Governance Enforcement (3–5 days)

### 3.1 Update Template-Enforcement Workflow

**File**: `.github/workflows/template-enforcement.yml`  
**Change**: Add step to validate label prefixes before letting issues proceed

**Action**: Add new job:

```yaml
label-validation:
  name: Validate Label Prefixes
  runs-on: ubuntu-latest
  if: github.event_name == 'issues' && github.event.action == 'opened'
  steps:
    - name: Checkout
      uses: actions/checkout@v3
    
    - name: Load Canonical Labels
      id: load-labels
      run: |
        LABELS=$(grep -oP "name: \K['\"]?[^'\"]*['\"]?" .github/labels.yml | tr '\n' '|' | sed 's/|$//')
        echo "canonical=$LABELS" >> $GITHUB_OUTPUT
    
    - name: Validate Issue Labels
      env:
        ISSUE_LABELS: ${{ toJSON(github.event.issue.labels) }}
        CANONICAL: ${{ steps.load-labels.outputs.canonical }}
      run: |
        node .github/scripts/validation/validate-issue-labels.cjs
```

**Who**: DevOps/Workflow Owner  
**When**: Within 3 days  
**Testing**: Test on dev/staging repo first

---

### 3.2 Add Label Validation to Changelog Workflow

**File**: `.github/workflows/changelog-automation.yml` (or relevant PR workflow)  
**Change**: Validate PR labels before allowing merge

**Action**: Similar to above but for PRs

**Who**: DevOps/Workflow Owner  
**When**: Within 3 days

---

### 3.3 Create Label Prefix Validation Script (Advanced)

**File**: `.github/scripts/validation/validate-issue-labels.cjs`  
**Purpose**: Validate issue labels against canonical set at creation time

(Implementation details omitted for brevity; follows pattern of label-validation job above)

**Who**: DevOps  
**When**: Within 3 days

---

## Phase 4: Documentation Updates (Ongoing)

### 4.1 Create Label Best Practices Guide

**File**: Create `docs/LABEL_BEST_PRACTICES.md`  
**Content**: Practical examples and common mistakes

---

### 4.2 Update GitHub Wiki / Knowledge Base

- Link to new label validation scripts
- Document how to validate labels before creating issues
- Add troubleshooting section

---

## Phase 5: Testing & Validation (Parallel)

### 5.1 Unit Tests

**File**: Add to `.github/scripts/validation/__tests__/label-validation.test.js`

Test cases:

- ✅ Valid: `type:bug` → pass
- ✅ Valid: `area:ci`, `priority:normal`, `status:needs-triage` → pass
- ❌ Invalid: `bug` (no prefix) → fail
- ❌ Invalid: `type:invalid-type` (not in canonical) → fail
- ❌ Invalid: `unknown:label` (no family) → fail

---

### 5.2 Integration Tests

**Test**: Run workflow on test issue; verify:

1. ✅ Canonical labels are applied
2. ❌ Bare labels are rejected/flagged
3. ✅ Non-canonical labels trigger warning/error

---

### 5.3 End-to-End Tests

**Test**: Create issue with:

- Correct labels → Issue created successfully
- Bare labels → Issue created but flagged/cleaned up
- Mixed labels → Correct labels applied, bare labels removed

---

## Success Criteria

### By End of Phase 1 (TODAY)

- [ ] CLAUDE.md updated with label rules
- [ ] AGENTS.md updated with label governance
- [ ] `validate-labels-before-creation.cjs` created and tested
- [ ] Defective `labeling-agent.js` deleted

### By End of Phase 2 (48 hours)

- [ ] Audit complete: violations identified and counted
- [ ] Dry-run results reviewed by team
- [ ] All violations remediated (bare labels migrated to canonical)
- [ ] Re-audit confirms fixes: 0 violations remaining

### By End of Phase 3 (5 days)

- [ ] Template-enforcement updated with label validation
- [ ] New issues cannot be created with bare labels
- [ ] Documentation updated with best practices
- [ ] Team trained on new requirements

### By End of Phase 4 (Ongoing)

- [ ] All documentation updated
- [ ] Knowledge base searchable for label questions
- [ ] Team confident in labeling process

---

## Risk Mitigation

### Risk: Script Errors Break Issue Creation

**Mitigation**:

- Always test scripts with `--dry-run` flag first
- Run scripts in dev/test repo before production
- Have rollback plan ready

### Risk: Over-Remediation (Removing Valid Labels)

**Mitigation**:

- Validate mapping JSON before running remediation
- Review dry-run output carefully
- Spot-check 10 issues before running full remediation

### Risk: Workflows Fail Due to Missing Permissions

**Mitigation**:

- Verify GitHub token has `issues:write`, `pull-requests:write`
- Test on test repo first
- Have manual remediation script ready as backup

---

## Rollback Plan

If remediation causes issues:

```bash
# 1. Stop all automation
git checkout .github/workflows/template-enforcement.yml

# 2. Manually fix issues via GitHub UI or API
# (Reverse label changes)

# 3. Investigate root cause
# (Check logs, identify issue)

# 4. Re-plan and test changes
# (Don't retry same fix without fixing root cause)
```

---

## Acceptance Criteria

✅ **DONE when**:

- All issues #1500–#1600 have canonical labels only
- No bare labels remain in issue database (audit = 0 violations)
- New issues created automatically use canonical labels
- Workflows validate labels and flag violations
- Documentation updated and team trained
- No regressions in automation (workflows continue to work)

---

## References

- Audit Report: `LABEL_PREFIX_AUDIT_REPORT.md`
- Workflow Analysis: `WORKFLOW_CONSOLIDATION_ANALYSIS.md`
- Canonical Labels: `.github/labels.yml`
- Labeling Guide: `docs/LABELING.md`

---

---

*Maintained by the 🤖 LightSpeedWP Automation Team*

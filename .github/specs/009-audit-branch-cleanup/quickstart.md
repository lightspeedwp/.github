# Quickstart: Branch Cleanup Audit & Validation

**Feature**: Audit and Refactor Branch Cleanup Infrastructure  
**Date**: 2026-09-14  
**Phase**: Phase 1 Design

This guide validates that the branch cleanup feature works end-to-end through runnable scenarios.

## Prerequisites

- Git 2.30+ installed
- GitHub CLI (`gh`) authenticated: `gh auth status`
- Node.js 22+ installed
- Access to repository with 50+ branches (test environment recommended)

## Scenario 1: Generate Audit Report (Dry Run)

**What this validates**: Audit script correctly categorises all branches without making changes.

### Setup

```bash
cd /path/to/repository
git fetch origin  # Ensure all branches are known locally
```

### Run Audit

```bash
node scripts/cleanup-branches.js --dryRun=true --reportFormat=markdown
```

### Expected Output

1. **Console output** summarising counts:

   ```
   Audit Report: Branch Cleanup Analysis
   Generated: 2026-09-14T12:30:00Z
   
   Summary:
   - Total branches: 327
   - Keep: 42
   - Delete: 248
   - Discuss: 37
   ```

2. **Report file** written to `.github/reports/stale-branches-{timestamp}.md`

### Validation Checklist

- [ ] Report file exists at `.github/reports/stale-branches-*.md`
- [ ] Report contains Summary section with counts
- [ ] Report contains KEEP section (protected, active PRs, recent)
- [ ] Report contains DELETE section (merged, stale branches)
- [ ] Report contains DISCUSS section (naming violations, orphaned, unclear)
- [ ] No branches actually deleted (dry-run mode)
- [ ] Script execution completes in <5 seconds

### Expected Structure (sample extract)

```markdown
## Branch Cleanup Report

Generated: 2026-09-14T12:30:00Z
Repository: lightspeedwp/.github

### Summary

| Category | Count | Action |
|----------|-------|--------|
| Keep | 42 | Preserve |
| Delete | 248 | Safe to remove |
| Discuss | 37 | Review manually |

### Keep Category

#### Protected Branches (3)
- main
- develop
- production

#### Active PRs (15)
| Branch | PR # | Status |
|--------|------|--------|
| feat/new-agent | 3120 | open |
| fix/auth-timeout | 3121 | open |

#### Recent (≤30 days) (24)
...

### Delete Category (248 branches)

Merged to develop or main, >30 days old, no open PR, valid name

| Branch | Type | Age (days) | Merged | Author |
|--------|------|-----------|--------|--------|
| feat/old-dashboard | feat | 127 | develop | alice@example.com |
| fix/auth-cache | fix | 89 | develop | bob@example.com |
...

### Discuss Category (37 branches)

| Branch | Reason | Recommendation |
|--------|--------|-----------------|
| claude/experimental | naming_violation | Rename to task/experimental or delete |
| proto/cache-v2 | unmerged_stale | Verify intent or delete |
| dependabot/npm-lodash | excluded_policy | Policy decision: auto-delete or preserve |
...
```

---

## Scenario 2: Verify Categorisation Logic

**What this validates**: Branches are correctly categorised according to decision tree rules.

### Test Case 2a: Protected Branch Preserved

**Input**: Branch named `main`  
**Expected**: Categorised as KEEP with reason "protected_branch"

**Verify**:

```bash
# Check main is never in the Delete Category section
sed -n '/^### Delete Category/,/^### Discuss Category/p' .github/reports/stale-branches-*.md | grep -c "^- main$\|| main |"  # Should return 0
```

### Test Case 2b: Branch with Open PR Preserved

**Input**: Branch `feat/new-feature` with open PR #3120  
**Expected**: Categorised as KEEP with reason "active_pr"

**Verify**:

```bash
# Check branch with open PR is in KEEP section
grep -A 20 "Active PRs" .github/reports/stale-branches-*.md | grep "feat/new-feature"
```

### Test Case 2c: Merged & Stale Branch → DELETE

**Input**: Branch `fix/old-bug` merged 120 days ago, no open PR, valid name  
**Expected**: Categorised as DELETE

**Verify**:

```bash
# Check branch is in DELETE section
grep -A 300 "Delete Category" .github/reports/stale-branches-*.md | grep "fix/old-bug"
```

### Test Case 2d: Naming Violation → DISCUSS

**Input**: Branch `claude/experimental-feature` (forbidden prefix)  
**Expected**: Categorised as DISCUSS with reason "naming_violation"

**Verify**:

```bash
# Check branch is flagged as naming violation
grep -A 100 "Discuss Category" .github/reports/stale-branches-*.md | grep "claude/experimental"
grep "naming_violation" .github/reports/stale-branches-*.md | grep "claude/experimental"
```

### Test Case 2e: Unmerged & Stale → DISCUSS

**Input**: Branch `proto/cache-redesign` unmerged, 60+ days old, no PR  
**Expected**: Categorised as DISCUSS with reason "unmerged_stale"

**Verify**:

```bash
# Check branch is flagged as unmerged_stale
grep "unmerged_stale" .github/reports/stale-branches-*.md | grep "proto/cache-redesign"
```

---

## Scenario 3: JSON Report Format

**What this validates**: JSON output matches contract schema.

### Run with JSON Output

```bash
node scripts/cleanup-branches.js --dryRun=true --reportFormat=json > /tmp/audit-report.json
```

### Validate JSON Schema

```bash
# Check that JSON is valid
jq '.' /tmp/audit-report.json > /dev/null && echo "✅ Valid JSON"

# Verify required fields exist
jq 'keys | sort' /tmp/audit-report.json  # Should include: timestamp, repository, summary, categories

# Verify summary counts match
jq '.summary | keys | sort' /tmp/audit-report.json  # Should include: delete_count, discuss_count, keep_count

# Verify categories structure
jq '.categories | keys | sort' /tmp/audit-report.json  # Should include: delete, discuss, keep
```

### Expected JSON Structure (sample)

```json
{
  "timestamp": "2026-09-14T12:30:00Z",
  "repository": "lightspeedwp/.github",
  "branch_count": 327,
  "summary": {
    "keep_count": 42,
    "delete_count": 248,
    "discuss_count": 37
  },
  "categories": {
    "keep": {
      "protected": [
        { "name": "main", "reason": "protected_branch" },
        { "name": "develop", "reason": "protected_branch" }
      ],
      "active_pr": [
        { "name": "feat/new-agent", "pr_number": 3120, "pr_status": "open" }
      ],
      "recent": [...]
    },
    "delete": [
      {
        "name": "feat/old-dashboard",
        "type": "feat",
        "merge_status": "merged_to_develop",
        "age_days": 127,
        "last_commit_date": "2026-05-10T08:00:00Z",
        "merge_commit_sha": "abc123def456",
        "author": "alice@example.com"
      }
    ],
    "discuss": [...]
  },
  "execution": {
    "runner_environment": "local",
    "script_version": "2.0.0",
    "parameters": {
      "dryRun": true,
      "inactiveDays": 30,
      "excludePatterns": "release/.*|hotfix/.*"
    }
  }
}
```

---

## Scenario 4: Custom Exclusion Patterns

**What this validates**: Exclusion patterns work correctly to preserve branches.

### Test Case: Preserve dependabot branches

**Setup**: Ensure repository has branches matching `dependabot/*`

```bash
# Run with exclusion pattern
node scripts/cleanup-branches.js \
  --dryRun=true \
  --excludePatterns="dependabot/.*|renovate/.*" \
  --reportFormat=markdown
```

### Verify

```bash
# Check that dependabot branches are not in the Delete Category section
sed -n '/^### Delete Category/,/^### Discuss Category/p' .github/reports/stale-branches-*.md | grep -c "dependabot/" | awk '{if ($1 == 0) print "✅ Dependabot branches excluded from DELETE"}'

# Check they appear in KEEP or DISCUSS section instead
sed -n '/^### Keep Category/,/^### Delete Category/p;/^### Discuss Category/,$p' .github/reports/stale-branches-*.md | grep "dependabot/" && echo "✅ Found in KEEP or DISCUSS section"
```

---

## Scenario 5: Performance Validation

**What this validates**: Audit completes in acceptable time (<5 seconds for 500+ branches).

### Measure Execution Time

```bash
time node scripts/cleanup-branches.js --dryRun=true --reportFormat=json > /dev/null
```

### Expected Output

```
real    0m2.341s  ← Should be < 5 seconds
user    0m1.890s
sys     0m0.451s
```

### Validation

- [ ] Real time < 5 seconds
- [ ] No timeout errors
- [ ] Report generated completely

---

## Scenario 6: Reference Data Model

**What this validates**: Real branch data matches entity definition.

### Extract Sample Branch Data

```bash
# Parse JSON report to show branch entity structure
jq '.categories.delete[0]' /tmp/audit-report.json
```

### Expected Output (sample branch entity)

```json
{
  "name": "feat/old-auth",
  "type": "feat",
  "merge_status": "merged_to_develop",
  "age_days": 95,
  "last_commit_date": "2026-05-21T14:30:00Z",
  "merge_commit_sha": "a1b2c3d4e5f6",
  "author": "developer@example.com"
}
```

### Validate Against Data Model

- [ ] `name` is present and non-empty
- [ ] `type` matches one of 30+ defined branch types or is empty
- [ ] `age_days` is numeric and >= 0
- [ ] `last_commit_date` is valid ISO8601
- [ ] All required attributes present

---

## Scenario 7: Contract Validation (Reference)

**What this validates**: Output conforms to published contracts.

### Use Case: GitHub Actions Integration

```yaml
# In CI workflow, after audit runs:
- name: Validate Audit Report Schema
  run: |
    npx --yes ajv-cli validate \
      -s .github/specs/009-audit-branch-cleanup/contracts/audit-report.schema.json \
      -d .github/reports/stale-branches-*.json
```

Refer to:

- `contracts/audit-report.schema.json` — Markdown/JSON report format
- `contracts/deletion-candidates.schema.json` — Deletion candidates list format

---

## Troubleshooting

### Issue: "Could not fetch open PRs via gh CLI"

**Cause**: `gh` not authenticated  
**Solution**:

```bash
gh auth login
# Re-run audit
```

### Issue: Audit script times out (>5 seconds)

**Cause**: Network latency fetching PRs, or large repository  
**Solution**:

- Run locally first (faster than CI)
- Check GitHub CLI performance: `gh pr list --repo owner/repo | wc -l`

### Issue: Branch categorised differently than expected

**Cause**: Likely edge case in decision tree  
**Solution**:

- Check if branch is protected
- Check if branch has open PR: `gh pr list --head {branch}`
- Check merge status: `git merge-base --is-ancestor {branch} develop`
- Consult decision tree logic in `data-model.md`

---

## Next Steps

1. **Dry-run on target repository** — Run scenarios 1–3 above
2. **Team review** — Share audit report, discuss DISCUSS category branches
3. **Draft PR + approval** — Open a draft PR listing verified deletion candidates (`contracts/deletion-candidates.schema.json`) for human review; this is the standard path to deletion
4. **Safe deletion** — Only after the draft PR is approved, run with `--dryRun=false` to execute the approved deletions. Direct live-mode execution outside the draft-PR flow is restricted to release managers and MUST be logged.
5. **Automation** — Deploy workflow to `.github/workflows/branch-audit.yml` for scheduled audits

## Reference

- **Data Model**: See `data-model.md` for entity definitions and categorisation logic
- **Research**: See `research.md` for design decisions and rationale
- **Feature Spec**: See `spec.md` for requirements and user stories

---
title: "Issue Enrichment Scripts — Complete Guide"
date: 2026-09-04
status: production
category: issue-management
---

# Issue Enrichment Scripts — Complete Guide

## Overview

Three complementary scripts work together to analyze, validate, and enrich GitHub issues with missing Definition of Ready (DoR), Definition of Done (DoD), Owner, and Acceptance Criteria sections:

1. **`audit-issue-completeness.js`** — Analyze and report on issue completeness
2. **`enhance-issue-completeness.js`** — Automatically add missing sections
3. **`add-issue-template-sections.js`** — Legacy script for DoR/DoD sections (enhanced)

---

## Quick Start

### 1. Audit Issues (Dry Run First)

```bash
# Audit all open issues with status:needs-more-info label
node scripts/automation/audit-issue-completeness.js --label="status:needs-more-info" --output=reports/audit-results.json

# Generate CSV report
node scripts/automation/audit-issue-completeness.js --label="status:needs-more-info" --format=csv --output=reports/audit-results.csv

# Analyze specific subset
node scripts/automation/audit-issue-completeness.js --limit=50
```

### 2. Preview Changes (Dry Run)

```bash
# Preview what would be added to issues
node scripts/automation/enhance-issue-completeness.js --dry-run --limit=10

# Check specific issue
node scripts/automation/enhance-issue-completeness.js --dry-run --issue=2833
```

### 3. Apply Changes (With Verification)

```bash
# Enhance first 10 issues
node scripts/automation/enhance-issue-completeness.js --limit=10

# Enhance all issues with status:needs-more-info
node scripts/automation/enhance-issue-completeness.js --limit=999999

# Enhance and assign owners automatically
node scripts/automation/enhance-issue-completeness.js --auto-owner --limit=20
```

---

## Script Reference

### audit-issue-completeness.js

**Purpose**: Analyze and report on issue completeness across all dimensions.

**Features**:
- Detect missing DoR, DoD, Owner, Acceptance Criteria sections
- Calculate completeness score (0-100%) per issue
- Generate JSON or CSV reports
- Aggregate statistics by issue type, status, area
- Identify patterns and trends

**Usage**:
```bash
node audit-issue-completeness.js [options]

Options:
  --label=LABEL       Filter by label (e.g., "status:needs-more-info", "type:epic")
  --output=FILE       Save report to JSON/CSV file
  --format=csv        Output as CSV instead of JSON (default: json)
  --limit=N           Analyze only first N issues (default: all)
```

**Examples**:
```bash
# All issues with missing DoR
node audit-issue-completeness.js --label="status:needs-more-info" \
  --output=reports/needs-dor.json

# All epic issues
node audit-issue-completeness.js --label="type:epic" \
  --format=csv --output=reports/epics-audit.csv

# First 100 issues, JSON report
node audit-issue-completeness.js --limit=100 --output=reports/sample-audit.json
```

**Output Format (JSON)**:
```json
{
  "summary": {
    "total_issues": 100,
    "average_completeness": 32,
    "issues_needing_dor": 91,
    "issues_needing_dod": 73,
    "issues_needing_owner": 71,
    "issues_needing_ac": 45,
    "issues_by_type": {
      "type:bug": { "total": 10, "avgScore": 45 },
      "type:feature": { "total": 20, "avgScore": 38 }
    }
  },
  "issues": [
    {
      "number": 2833,
      "title": "Phase 4: Enhancement Implementation",
      "type": "type:epic",
      "status": ["status:needs-more-info"],
      "area": "area:core",
      "assignee": null,
      "completeness_score": 25,
      "missing_sections": ["Definition of Ready", "Owner", "Acceptance Criteria"],
      "present_sections": ["Definition of Done"],
      "needs_owner": true,
      "needs_dor": true,
      "needs_dod": false,
      "needs_ac": true
    }
  ]
}
```

**Output Format (CSV)**:
```
Issue #,Title,Type,Status,Area,Assignee,Completeness %,Missing DoR,Missing DoD,Missing Owner,Missing AC,Missing Sections
2833,"Phase 4: Enhancement Implementation",type:epic,status:needs-more-info,area:core,unassigned,25,Yes,No,Yes,Yes,"Definition of Ready, Owner, Acceptance Criteria"
```

---

### enhance-issue-completeness.js

**Purpose**: Automatically add missing Definition of Ready, Definition of Done, Owner, and Acceptance Criteria sections to issues.

**Features**:
- Detect missing sections per issue
- Generate type-specific templates
- Preserve existing content
- Add sections in logical order
- Remove `status:needs-more-info` label on success
- Support for dry-run, interactive, and auto modes

**Usage**:
```bash
node enhance-issue-completeness.js [options]

Options:
  --dry-run           Preview changes without applying (default: off)
  --limit=N           Process only N issues (default: 10)
  --issue=ID          Process specific issue ID only
  --start-from=N      Start processing from issue N (pagination)
  --label=LABEL       Filter by specific label (default: status:needs-more-info)
  --auto-owner        Try to assign owner based on area/author
```

**Examples**:
```bash
# Preview first 10 issues
node enhance-issue-completeness.js --dry-run

# Enhance first 10 issues
node enhance-issue-completeness.js --limit=10

# Enhance specific issue
node enhance-issue-completeness.js --issue=2833

# Enhance all issues from #2700 onwards
node enhance-issue-completeness.js --start-from=2700 --limit=999999

# Preview with details
node enhance-issue-completeness.js --dry-run --limit=5
```

**Dry Run Output**:
```
🚀 Enhanced Issue Completeness Script

📋 Configuration:
   Repository: lightspeedwp/.github
   Label: status:needs-more-info
   Limit: 10 issues
   Dry Run: YES

📥 Fetching issues...
✅ Found 100 issues with status:needs-more-info

🚀 Processing 10 issue(s)...

📋 DRY RUN: Would enhance #2833 (type: epic)
   Title: Phase 4: Enhancement Implementation
   Missing: Definition of Ready, Owner, Acceptance Criteria
   Change: +1245 chars
```

**Live Run Output**:
```
✅ #2833 - Enhanced (epic) - Added: Definition of Ready, Owner, Acceptance Criteria
✅ #2832 - Enhanced (feature) - Added: Definition of Ready, Owner
⏭️  #2831 - Skipped (all sections present)
```

**Templates Added** (Type-Specific):

**Feature**:
- Definition of Ready (7 checkboxes)
- Owner / Assignee section
- Acceptance Criteria checklist
- Definition of Done (9 checkboxes)

**Bug**:
- Definition of Ready (6 checkboxes)
- Owner / Assignee (with severity)
- Acceptance Criteria (4 specific items)
- Definition of Done (7 checkboxes)

**Epic**:
- Definition of Ready (6 checkboxes)
- Epic Owner / Sponsor
- Success Criteria (3 items)
- Definition of Done (6 checkboxes)

**Default** (for other types):
- Definition of Ready (4 checkboxes)
- Owner / Assignee
- Acceptance Criteria (2 placeholder items)
- Definition of Done (5 checkboxes)

---

### add-issue-template-sections.js (Legacy)

**Purpose**: Add Definition of Ready and Definition of Done sections to issues (original script, still supported).

**Usage**:
```bash
node add-issue-template-sections.js [options]

Options:
  --dry-run          Preview changes without applying
  --limit=N          Process only N issues (default: 10)
  --issue=ID         Process specific issue ID only
  --start-from=N     Start processing from issue N
  --label=LABEL      Filter by specific label (default: status:needs-more-info)
```

**Note**: For new work, use `enhance-issue-completeness.js` instead, as it includes Owner and Acceptance Criteria sections.

---

## Workflow Integration

### Automated Daily Enrichment (Scheduled)

Add to `.github/workflows/issue-enrichment.yml`:

```yaml
name: Daily Issue Enrichment

on:
  schedule:
    - cron: "0 9 * * 1" # Monday 9 AM UTC

jobs:
  enrich-issues:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Audit issues
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          node scripts/automation/audit-issue-completeness.js \
            --label="status:needs-more-info" \
            --output=reports/audit-$(date +%Y-%m-%d).json
      
      - name: Enrich issues
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          node scripts/automation/enhance-issue-completeness.js \
            --limit=20
      
      - name: Commit audit report
        run: |
          git config user.name "github-actions"
          git config user.email "actions@github.com"
          git add reports/
          git commit -m "chore: audit issue completeness $(date +%Y-%m-%d)" || true
          git push
```

### Manual Verification Workflow

```bash
#!/bin/bash
# Manual workflow: audit → preview → apply

# 1. Audit current state
echo "📊 Auditing issues..."
node scripts/automation/audit-issue-completeness.js \
  --label="status:needs-more-info" \
  --output=reports/pre-audit.json

# 2. Preview changes
echo "👀 Previewing changes..."
node scripts/automation/enhance-issue-completeness.js \
  --dry-run --limit=20

# 3. Wait for approval
read -p "Apply changes? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  # 4. Apply changes
  echo "✨ Applying changes..."
  node scripts/automation/enhance-issue-completeness.js \
    --limit=20

  # 5. Verify results
  echo "✅ Verifying results..."
  node scripts/automation/audit-issue-completeness.js \
    --label="status:needs-more-info" \
    --output=reports/post-audit.json
fi
```

---

## Performance & Limitations

### Performance Characteristics

| Operation | Issues | Time | Notes |
|-----------|--------|------|-------|
| Audit 100 issues | 100 | ~5-10s | Read-only, uses caching |
| Preview 10 issues | 10 | ~2-3s | Dry-run mode, no API writes |
| Enrich 10 issues | 10 | ~30-45s | Includes label removal |
| Enrich 100 issues | 100 | ~5-8 min | Batch processing, serial |

### API Rate Limits

- **Search API**: 30 requests/min
- **REST API (write)**: 5,000 points/hour

**Mitigation**:
- Use pagination with `--limit` for large batches
- Spread bulk operations over multiple days
- Monitor rate limit headers

### Known Limitations

1. **Section Detection**: Uses string matching (`## Definition of Ready`)
   - Won't detect incomplete or malformed sections
   - False negatives if section headers are slightly different

2. **Owner Assignment**: Can't auto-detect best owner yet
   - Placeholder remains `[To be assigned]`
   - Requires manual assignment or `--auto-owner` heuristics

3. **Acceptance Criteria**: Template-based placeholders
   - Requires issue author to fill in specific requirements
   - Not AI-generated (intentionally conservative)

---

## Best Practices

### 1. Always Dry Run First

```bash
# Preview before applying
node enhance-issue-completeness.js --dry-run --limit=20

# Review output, then apply if satisfied
node enhance-issue-completeness.js --limit=20
```

### 2. Process in Batches

```bash
# Week 1: Epics and high-priority items
node enhance-issue-completeness.js --label="type:epic" --limit=20

# Week 2: Bug reports
node enhance-issue-completeness.js --label="type:bug" --limit=30

# Week 3: Features and tasks
node enhance-issue-completeness.js --label="type:feature" --limit=25
```

### 3. Audit After Each Batch

```bash
# Before: audit current state
node audit-issue-completeness.js --output=reports/before.json

# Apply enrichment
node enhance-issue-completeness.js --limit=20

# After: audit new state and compare
node audit-issue-completeness.js --output=reports/after.json
```

### 4. Monitor Label Removal

```bash
# Issues with status:needs-more-info should decrease
node audit-issue-completeness.js --label="status:needs-more-info"
# Expected: Decreases as issues are enriched
```

---

## Troubleshooting

### Issue Not Found After Enrichment

**Symptom**: Script completes but issue not updated

**Causes**:
- Issue was closed or deleted between fetch and update
- GitHub API rate limit hit during update
- Token lacks write permissions

**Fix**:
```bash
# Verify token permissions
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user

# Check rate limit
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/rate_limit

# Retry specific issue
node enhance-issue-completeness.js --issue=2833
```

### Label Removal Failed

**Symptom**: Issue enriched but `status:needs-more-info` label remains

**Causes**:
- Label is in read-only workflow
- Token lacks label write permission
- Label name is different (typo?)

**Fix**:
```bash
# Manual label removal
gh issue edit 2833 --remove-label "status:needs-more-info"

# Or via API
curl -X DELETE \
  -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/lightspeedwp/.github/issues/2833/labels/status%3Aneeds-more-info
```

### "Too many requests" Error

**Symptom**: `GitHub API rate limit exceeded`

**Causes**:
- Processing too many issues too quickly
- Other automation running simultaneously

**Fix**:
```bash
# Wait for rate limit reset (1 hour)
# Or process fewer issues
node enhance-issue-completeness.js --limit=5

# Check rate limit
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/rate_limit | jq .rate_limit
```

---

## Integration with Issues Agent

These scripts complement the **Unified Issues Agent** (`agents/issues.agent.md`):

- **Agent**: Handles type detection, labeling, workflow routing
- **Scripts**: Handle bulk section enrichment, audit, validation

### How They Work Together

```
GitHub Issue Created/Updated
          ↓
    [Issues Agent]
    - Detect type
    - Apply labels
    - Route to handler
          ↓
   Issue has labels but may lack:
    - DoR section
    - DoD section
    - Owner
    - Acceptance Criteria
          ↓
  [Audit Script] (Optional)
    - Analyze completeness
    - Generate report
          ↓
  [Enrichment Script]
    - Detect missing sections
    - Add type-specific templates
    - Remove needs-more-info label
          ↓
     Issue is Now:
    - Properly labeled
    - Has DoR/DoD
    - Has Owner field
    - Ready for development
```

---

## Metrics & Monitoring

### Key Metrics to Track

1. **Completeness Trend**
   ```bash
   # Track over time
   node audit-issue-completeness.js --output=reports/audit-$(date +%Y-%m-%d).json
   # Compare week-over-week
   ```

2. **Issues Needing DoR**
   ```bash
   # Should decrease as enrichment runs
   node audit-issue-completeness.js | grep "Missing DoR"
   ```

3. **Label Removal Rate**
   ```bash
   # Issues with status:needs-more-info should decrease
   node audit-issue-completeness.js --label="status:needs-more-info"
   ```

4. **By-Type Completeness**
   ```bash
   node audit-issue-completeness.js --output=reports/by-type.json | jq .summary.issues_by_type
   ```

---

## References

- **Issues Agent**: `agents/issues.agent.md` (v2.1)
- **Improvement Plan**: `IMPROVEMENT-PLAN-ISSUES-AGENT-2026-09-04.md`
- **Issue Templates**: `.github/ISSUE_TEMPLATE/`
- **Label Definitions**: `.github/labels.yml`
- **Contributing**: `CONTRIBUTING.md`

---

## Support & Feedback

For issues, questions, or suggestions:

1. Check `.github/AGENTS.md` for AI agent guidelines
2. Review the Improvement Plan for detailed design
3. Open an issue with `type:bug` or `type:feature` label
4. Tag: `area:automation`, `area:issue-management`

---

**Last Updated**: 2026-09-04  
**Status**: Production  
**Maintainer**: LightSpeed Team

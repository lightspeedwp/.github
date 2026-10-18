# GitHub Actions Contract: Drift Detection Workflow

**Workflow Name**: `drift-detection.yml`  
**Location**: `lightspeedwp/.github/workflows/drift-detection.yml` or consumer repo `.github/workflows/drift-detection.yml`  
**Triggered By**: Pull request open/reopened  
**Audience**: Repository maintainers, developers

---

## Contract Purpose

Detect and prevent duplicate governance files (labels.yml, issue templates, PR templates, issue types) from being added to consumer repositories. Allow custom workflows without restriction.

---

## Input Specification

| Input | Type | Required | Example | Description |
|-------|------|----------|---------|------------|
| pr-number | integer | Yes | 123 | PR number triggering workflow |
| pr-head-sha | string | Yes | abc123def456 | Commit SHA of PR head |
| repository-name | string | Yes | ThisOneTimeOnAcidCom | Consumer repo name |

**How Inputs Arrive**: GitHub Actions `github.event.pull_request.number`, `github.event.pull_request.head.sha`

---

## File Monitoring Rules

### BLOCKED Files (Drift Detection Blocks PR)

Detect changes to these paths and block PR:

```yaml
- .github/labels.yml
- .github/issue-types.yml
- .github/branch-labels.yml
- .github/ISSUE_TEMPLATE/**
- .github/PULL_REQUEST_TEMPLATE/**
- .github/*.yml (except workflows/)
```

**Validation Logic**:
```
If PR contains changes to blocked paths:
  → Set check status to FAILURE
  → Add blocking comment with guidance
  → Require PR close/branch rename
Else if PR only touches allowed paths:
  → Set check status to SUCCESS
  → Allow PR to proceed
```

### ALLOWED Files (Drift Detection Allows PR)

These paths are permitted and do NOT trigger drift detection:

```yaml
- .github/workflows/**        # Custom workflows (ALLOWED)
- src/**                      # Application code (ALLOWED)
- tests/**                    # Tests (ALLOWED)
- README.md                   # Documentation (ALLOWED)
- Any non-.github/ paths      # (ALLOWED)
```

---

## Output Specification

### Success Case (No Drift Detected)

**Check Status**: ✅ SUCCESS

**Message**:
```
✅ Drift Detection: PASSED

No duplicate governance files detected. This PR is compliant with the hybrid model:
- Custom workflows in .github/workflows/ are allowed ✅
- Governance files are managed in lightspeedwp/.github only
```

---

### Failure Case (Drift Detected)

**Check Status**: ❌ FAILURE

**Message**:
```
❌ Drift Detection: BLOCKED

This PR attempts to add or modify governance files that are managed in 
lightspeedwp/.github (source of truth).

Blocked files detected:
- .github/labels.yml
- .github/PULL_REQUEST_TEMPLATE/pr_feature.md

ℹ️ What to do:

1. These files are LOCKED in lightspeedwp/.github
2. Use the canonical versions instead of local copies
3. To request changes to canonical files, open an issue:
   - Tag: [LABEL-UPDATE-REQUEST], [TEMPLATE-UPDATE-REQUEST], or [ISSUE-TYPE-UPDATE-REQUEST]
   - Reference: lightspeedwp/.github/CLAUDE.md

✅ Custom workflows (.github/workflows/**) ARE allowed and will not be blocked.
```

---

## Implementation Details

### Workflow Structure

```yaml
name: Drift Detection

on:
  pull_request:
    types: [opened, reopened, synchronize]

jobs:
  detect-drift:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Check for governance file changes
        id: check-files
        run: |
          # Compare PR against base branch
          git fetch origin ${{ github.base_ref }}
          CHANGED_FILES=$(git diff --name-only origin/${{ github.base_ref }}...HEAD)
          
          # Check for blocked files
          BLOCKED_FILES=()
          while IFS= read -r file; do
            if [[ $file == .github/labels.yml ]] || \
               [[ $file == .github/issue-types.yml ]] || \
               [[ $file == .github/branch-labels.yml ]] || \
               [[ $file == .github/ISSUE_TEMPLATE/* ]] || \
               [[ $file == .github/PULL_REQUEST_TEMPLATE/* ]]; then
              BLOCKED_FILES+=("$file")
            fi
          done <<< "$CHANGED_FILES"
          
          if [ ${#BLOCKED_FILES[@]} -gt 0 ]; then
            echo "status=failure" >> $GITHUB_OUTPUT
            echo "blocked_files=$(IFS=,; echo "${BLOCKED_FILES[*]}")" >> $GITHUB_OUTPUT
          else
            echo "status=success" >> $GITHUB_OUTPUT
          fi
      
      - name: Report result
        run: |
          if [ "${{ steps.check-files.outputs.status }}" == "failure" ]; then
            echo "❌ Drift detected"
            exit 1
          else
            echo "✅ No drift detected"
          fi
```

---

## Error Handling

| Error Scenario | Response |
|---|---|
| File comparison fails | Check status: NEUTRAL (inconclusive); comment: "Could not check files; please retry" |
| API rate limit hit | Retry workflow; temporary hold acceptable |
| Commit fetch timeout | Retry workflow; 5-minute timeout |

---

## Integration Points

- **Consumed By**: GitHub PR process (check status blocks merge)
- **Consumed By**: Developers (guidance message)
- **Sends Notifications**: PR author (failure messages)
- **References**: lightspeedwp/.github/CLAUDE.md (governance amendment process)

---

## Success Metrics

| Metric | Target | How Measured |
|--------|--------|--------------|
| Detection accuracy | 100% | Spot-check blocked PRs; verify all blocked files are actually governance |
| False positive rate | 0% | Review allowed PRs; confirm no governance files slipped through |
| Developer understanding | ≥80% | Survey developers; confirm message guidance is clear |
| Block effectiveness | 100% | Verify no governance file duplication occurs in consumer repos |

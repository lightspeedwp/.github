# Broken Reference Remediation Process

**Phase**: Phase 3, User Story 1 (US1)  
**Status**: Implementation in progress  
**Impact**: Fixes all broken references from agent renames and restructuring

---

## Overview

This document describes the process for identifying, auditing, and fixing all broken references throughout the repository.

---

## Process Steps

### 1. Audit Phase: Identify Broken References

```bash
npm run audit:broken-refs
```

**Output**: `agents/reports/broken-references-audit.json`

**What it does**:

- Scans all JS, shell, and YAML files
- Detects all references to agents, skills, and workflows
- Validates each reference against actual folder/file existence
- Categorizes by severity (CRITICAL, HIGH, MEDIUM, INFO)
- Records location (file, line number, context)

**Example Output**:

```json
{
  "generatedAt": "2026-09-18T15:30:00Z",
  "totalReferences": 245,
  "brokenCount": 23,
  "byFile": [
    {
      "file": "scripts/orchestrate-agents.js",
      "referenceType": "js-import",
      "reference": "agents/old-agent",
      "severity": "CRITICAL",
      "line": 42,
      "suggestedFix": "agents/new-agent",
      "confidence": "high"
    }
  ]
}
```

---

### 2. Review Phase: Examine Broken References

```bash
# View audit results
cat agents/reports/broken-references-audit.json | jq '.byFile[] | select(.severity=="CRITICAL")'

# Group by severity
cat agents/reports/broken-references-audit.json | jq 'group_by(.severity) | map({severity: .[0].severity, count: length})'
```

**Key Questions**:

- Is the suggestion correct?
- Should this reference be fixed or removed?
- Are there special cases (deprecation, conditional import)?

---

### 3. Fix Phase: Apply Corrections

#### Option A: Automated Fix (Recommended for bulk changes)

```bash
# Dry-run to preview changes
node scripts/validation/auto-fixer.js --dry-run --input agents/reports/broken-references-audit.json

# Apply fixes
node scripts/validation/auto-fixer.js --input agents/reports/broken-references-audit.json
```

**What it does**:

- Reads broken reference audit
- Applies suggested fixes using reference-type-aware patterns
- Creates backups of modified files
- Reports applied changes

#### Option B: Manual Fix

For complex cases or when automated fix isn't appropriate:

1. **For JavaScript imports**:

   ```javascript
   // Find and replace
   // OLD: require('agents/old-name')
   // NEW: require('agents/new-name')
   ```

2. **For shell paths**:

   ```bash
   # Find
   grep -r "agents/old-name" scripts/

   # Replace
   sed -i 's|agents/old-name|agents/new-name|g' scripts/*.sh
   ```

3. **For workflow references**:

   ```yaml
   # Edit .github/workflows/*.yml files
   # OLD: uses: lightspeedwp/.github/agents/old-name@main
   # NEW: uses: lightspeedwp/.github/agents/new-name@main
   ```

---

### 4. Validation Phase: Verify Fixes

```bash
# Run verification script
npm run validate:broken-refs

# Run full test suite
npm run test

# Run CI workflow locally
act -j test
```

**What to check**:

- [ ] No syntax errors in fixed files
- [ ] All imports resolve correctly
- [ ] Tests pass
- [ ] CI workflows execute
- [ ] Scripts run without "not found" errors

---

### 5. Reporting Phase: Generate Summary

```bash
# Generate final audit report
npm run audit:broken-refs -- --output agents/reports/broken-references-audit-final.json

# Generate summary statistics
node scripts/validation/generate-broken-ref-summary.js
```

**Summary includes**:

- Total broken references found
- Broken references fixed
- Remaining issues (if any)
- Impact assessment (which scripts/workflows affected)

---

## Rollback Procedure

If fixes cause issues:

```bash
# Find backup files
find . -name "*.backup" -type f

# Restore a backup
cp scripts/my-script.sh.backup scripts/my-script.sh

# Or use git
git checkout scripts/my-script.sh
```

---

## Common Scenarios

### Scenario 1: Agent Renamed

**Example**: `issue-agent` → `issue-triage-agent`

**Affected Files**:

- `scripts/orchestrate-agents.js`: `require('agents/issue-agent')`
- `.github/workflows/process-issues.yml`: `uses: ./agents/issue-agent`
- `agents/dashboard/package.json`: `"issue-agent": "*"`

**Fix Strategy**:

```bash
# Replace all occurrences
sed -i 's|issue-agent|issue-triage-agent|g' scripts/*.js
sed -i 's|issue-agent|issue-triage-agent|g' .github/workflows/*.yml
```

---

### Scenario 2: Skill Renamed or Moved

**Example**: `validation-skill` consolidated into `core-skill`

**Affected Files**:

- `agents/*/skills/` references to validation-skill
- Agent test files importing validation-skill

**Fix Strategy**:

```bash
# Update agent skill imports
find agents -name "*.js" -type f -exec \
  sed -i "s|require.*validation-skill|require('./core-skill')|g" {} \;
```

---

### Scenario 3: Workflow Reference Broken

**Example**: Workflow tries to invoke deleted agent

**Affected Files**:

- `.github/workflows/main.yml`: `uses: ./agents/old-agent`

**Fix Strategy**:

1. Remove the step entirely if agent is no longer needed
2. Replace with new agent reference if functionality was transferred
3. Create compatibility wrapper if migration is gradual

---

## Testing Checklist

After applying broken reference fixes:

- [ ] Syntax validation passes: `npm run lint:js`
- [ ] Module imports resolve: `npm run validate:structure`
- [ ] Tests pass: `npm run test`
- [ ] Workflows validate: `npm run lint:workflows`
- [ ] Scripts execute: `bash scripts/test-run-all-agents.sh`
- [ ] CI passes locally: `act -j test`
- [ ] No console errors in dependent tools

---

## Documentation Updates

When fixing broken references, update:

- [ ] CHANGELOG.md in affected agents
- [ ] README.md if API or invocation changed
- [ ] Workflow documentation if workflow structure changed
- [ ] Agent dependencies in package.json

---

## Monitoring & Prevention

**Going Forward**:

### Pre-commit Validation

The pre-commit hook checks:

```bash
.github/hooks/pre-commit-registry.sh
```

Validates registries are fresh before commit.

### CI Validation

GitHub Actions workflow runs:

```bash
npm run audit:broken-refs
```

Fails the build if new broken references are detected.

### Regular Audits

Schedule regular audits to catch breaks:

```bash
# Add to CI schedule (weekly)
npm run audit:all
```

---

## Related Resources

- [REFERENCE_TYPES.md](REFERENCE_TYPES.md) — Reference type definitions
- [scripts/validation/lib/reference-detector.js](../../scripts/validation/lib/reference-detector.js) — Detection implementation
- [scripts/validation/lib/auto-fixer.js](../../scripts/validation/lib/auto-fixer.js) — Auto-fix implementation
- [spec.md](../.github/specs/014-agents-restructure-consolidate/spec.md) — US1 specification
- [tasks.md](../.github/specs/014-agents-restructure-consolidate/tasks.md) — Phase 3 task breakdown

---

## Troubleshooting

### "Agent not found" errors after fix

**Cause**: Reference was updated but target still doesn't exist  
**Solution**: Verify the agent folder exists and has the new name

### Workflow steps fail after fix

**Cause**: Workflow `uses:` points to non-existent action  
**Solution**: Check `.github/actions/` or ensure agent has `action.yml`

### Tests fail after fix

**Cause**: Fix regex was too broad and changed code inadvertently  
**Solution**: Review changes, restore backup, apply more targeted fix

---

**Last Updated**: 2026-09-18  
**Status**: Phase 3 in progress

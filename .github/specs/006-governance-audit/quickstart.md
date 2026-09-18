# Quickstart: Governance Audit Implementation

**Purpose**: Validate that the governance audit system works end-to-end. This guide provides runnable scenarios to confirm all three capabilities (audit, validation, remediation) function correctly.

**Estimated Time**: 15-20 minutes | **Difficulty**: Intermediate

## Prerequisites

Before running these scenarios, ensure:

1. **Node.js 18+** is installed: `node --version`
2. **Dependencies installed**: `npm ci`
3. **Repository cloned**: Working in `.github/` repository root
4. **Access to `.github/` files**: No elevated permissions needed (audit is read-only)

## Setup

```bash
# Navigate to repository root
cd /path/to/.github

# Verify Node.js version
node --version  # Should be v18.x or higher

# Install dependencies (includes js-yaml, ajv, chalk)
npm ci

# Verify audit scripts are present
ls -la .specify/scripts/bash/audit-governance.sh
ls -la .github/scripts/validate-governance.cjs
```

## Scenario 1: Run Full Governance Audit

**What This Tests**: User Story 1 (P1) — Comprehensive Governance Audit capability

**Objective**: Execute a full scan of LOCKED governance files and generate compliance report.

### Step 1: Execute Audit

```bash
# Run the governance audit
./.specify/scripts/bash/audit-governance.sh --output json --archive

# Expected Output:
# - Scans .github/labels.yml, .github/issue-types.yml, templates
# - Applies all enabled audit rules
# - Generates report in .github/reports/governance-audit-[DATE].json
# - Prints summary to console
```

### Step 2: Verify Report Structure

```bash
# List generated reports
ls -la .github/reports/governance-audit-*.json

# View latest report (last modified)
REPORT=$(ls -t .github/reports/governance-audit-*.json | head -1)
cat "$REPORT" | jq .

# Expected structure in report:
# {
#   "id": "audit-20260914-143022",
#   "timestamp": "2026-09-14T14:30:22Z",
#   "summary": {
#     "totalFiles": 4,
#     "totalRules": 15,
#     "totalViolations": N,
#     "compliancePercentage": X.X,
#     "status": "compliant|warnings|violations"
#   },
#   "violations": [...],
#   "trends": {...}
# }
```

### Step 3: Review Violations (if any)

```bash
# Extract and review violations
cat "$REPORT" | jq '.violations[] | {id, ruleId, severity, message, remediation}'

# Each violation should include:
# - Unique ID (violation-20260914-001)
# - Rule that was violated
# - Severity level (critical/high/medium/low)
# - Human-readable message
# - Suggested remediation
```

### Step 4: Check Compliance Trend

```bash
# View trend data from report
cat "$REPORT" | jq '.trends'

# Expected fields:
# {
#   "violationsTrend": "improving|stable|declining",
#   "violationsFixed": N,
#   "newViolations": N,
#   "daysImproving": N
# }
```

### Acceptance Criteria ✓

- [ ] Audit completes in <30 seconds
- [ ] Report file is created at `.github/reports/governance-audit-[TIMESTAMP].json`
- [ ] Report includes all required fields (id, timestamp, summary, violations)
- [ ] All scanned files are listed with status "scanned"
- [ ] Compliance percentage is calculated (0-100)
- [ ] Each violation includes: location, message, remediation, affectedSystems
- [ ] Trend data compares to prior report (if one exists)

---

## Scenario 2: Validate Governance Files (Pre-Commit)

**What This Tests**: User Story 2 (P2) — Governance File Validation capability

**Objective**: Run validation against governance files to prevent inconsistencies.

### Step 1: Validate Labels File

```bash
# Validate .github/labels.yml syntax and semantic rules
node .github/scripts/validate-governance.cjs --file labels --format yaml

# Expected output:
# ✓ YAML syntax valid
# ✓ All required fields present (name, description, color)
# ✓ All labels have required prefix
# ✓ No duplicate labels detected
# ✓ Label names follow naming convention (lowercase-hyphenated)
```

### Step 2: Validate Issue Types File

```bash
# Validate .github/issue-types.yml
node .github/scripts/validate-governance.cjs --file issue-types --format yaml

# Expected validation checks:
# ✓ YAML syntax is valid
# ✓ All issue types have required properties
# ✓ Issue type names are consistent
# ✓ Each issue type is used in at least one template
```

### Step 3: Validate PR Templates

```bash
# Validate PR template routing
node .github/scripts/validate-governance.cjs --file templates --type pr

# Expected validation checks:
# ✓ All PR templates are valid Markdown
# ✓ Each branch prefix (feat/, fix/, docs/) routes to exactly one template
# ✓ No template routing conflicts
# ✓ All branch types are covered by routing rules
```

### Step 4: Test Validation with Intentional Error

```bash
# Create a test violation by adding an unprefixed label
cat >> .github/labels.yml << 'EOF'
- name: test-unprefixed
  description: Test label without prefix
  color: FF0000
EOF

# Run validation again
node .github/scripts/validate-governance.cjs --file labels --format yaml

# Expected output:
# ✗ VALIDATION FAILED
# Error at line N: Label 'test-unprefixed' missing required prefix (type:, status:, priority:, area:, meta:)
# Remediation: Rename to 'type:test-unprefixed'

# Clean up: Remove the test line
git checkout .github/labels.yml
```

### Acceptance Criteria ✓

- [ ] Validation completes in <2 seconds per file
- [ ] Valid files return all checks passed
- [ ] Invalid YAML syntax is caught with line numbers
- [ ] Missing required fields are reported
- [ ] Naming convention violations are detected
- [ ] Label prefix violations are flagged
- [ ] Template routing mismatches are caught
- [ ] Validation output is actionable (specific file location and fix)

---

## Scenario 3: Generate Remediation Plan

**What This Tests**: User Story 3 (P3) — Remediation Guidance capability

**Objective**: Generate step-by-step remediation guidance for violations.

### Step 1: Create Sample Violation

```bash
# Introduce a violation (duplicate label)
cat >> .github/labels.yml << 'EOF'
- name: type:defect
  description: Duplicate of type:bug with different name
  color: FF0000
EOF

# Run audit to detect violation
REPORT=$(./.specify/scripts/bash/audit-governance.sh --output json --detect duplicates)
```

### Step 2: Generate Remediation Plan

```bash
# Generate remediation plan for the violations
./.specify/scripts/bash/generate-remediation.sh --report "$REPORT" --output json

# Expected output:
# Generates file: .github/reports/remediation-plan-[TIMESTAMP].json
# Prints summary to console
```

### Step 3: Review Remediation Plan

```bash
# View the remediation plan
PLAN=$(ls -t .github/reports/remediation-plan-*.json | head -1)
cat "$PLAN" | jq '.'

# Expected structure:
# {
#   "id": "remediation-20260914-001",
#   "timestamp": "2026-09-14T14:35:00Z",
#   "sourceReport": "audit-20260914-143022",
#   "steps": [
#     {
#       "stepNumber": 1,
#       "title": "Remove duplicate label 'type:defect'",
#       "affectedFile": ".github/labels.yml",
#       "changeType": "remove",
#       "effort": "simple",
#       "risk": "low",
#       "verificationSteps": [...],
#       "rollbackProcedure": "..."
#     }
#   ],
#   "estimatedTotalEffort": "5 minutes",
#   "estimatedRisk": "low"
# }
```

### Step 4: View Remediation Steps

```bash
# Extract step-by-step guidance
cat "$PLAN" | jq '.steps[] | {stepNumber, title, effort, risk, "verification": .verificationSteps}'

# Each step should include:
# - Clear title and description
# - Specific file to modify
# - Current state (before) and target state (after)
# - Effort estimate (trivial/simple/moderate/complex)
# - Risk assessment (low/medium/high)
# - Verification steps
# - Rollback procedure
```

### Step 5: Apply Remediation

```bash
# (OPTIONAL) Manually apply the remediation
# Edit .github/labels.yml and remove the duplicate label

# Re-run audit to confirm violation is fixed
./.specify/scripts/bash/audit-governance.sh --output json --archive

# Verify compliance improved
cat $(ls -t .github/reports/governance-audit-*.json | head -1) | jq '.summary.compliancePercentage'
```

### Step 6: Clean Up

```bash
# Remove the test violation
git checkout .github/labels.yml

# Remove test reports
rm .github/reports/remediation-plan-*.json
rm .github/reports/governance-audit-*.json
```

### Acceptance Criteria ✓

- [ ] Remediation plan is generated within 5 seconds
- [ ] Plan references source audit report
- [ ] Steps include all required fields (stepNumber, title, affectedFile, etc.)
- [ ] Steps are ordered by dependency
- [ ] Each step includes specific file paths
- [ ] Current and target states are shown (before/after)
- [ ] Effort and risk estimates are realistic
- [ ] Verification steps are concrete and testable
- [ ] Rollback procedures are provided
- [ ] Plan is saved to `.github/reports/remediation-plan-[TIMESTAMP].json`
- [ ] Markdown plan view is also generated for team review

---

## Scenario 4: Integration — Full Workflow

**What This Tests**: All three capabilities working together end-to-end

**Objective**: Demonstrate the complete governance audit workflow.

### Step 1: Run Full Audit

```bash
./.specify/scripts/bash/audit-governance.sh --output json --archive
```

### Step 2: Check Report

```bash
REPORT=$(ls -t .github/reports/governance-audit-*.json | head -1)
VIOLATIONS=$(cat "$REPORT" | jq '.summary.totalViolations')

echo "Total violations found: $VIOLATIONS"
```

### Step 3: Generate Remediation (if violations exist)

```bash
if [ "$VIOLATIONS" -gt 0 ]; then
  ./.specify/scripts/bash/generate-remediation.sh --report "$REPORT" --output json
  
  PLAN=$(ls -t .github/reports/remediation-plan-*.json | head -1)
  echo "Remediation plan saved to: $PLAN"
  
  # Show effort estimate
  cat "$PLAN" | jq -r '.estimatedTotalEffort'
fi
```

### Step 4: Verify CI Integration

```bash
# Simulate pre-commit validation hook
npm run validate:governance

# Expected: All checks pass if no violations, fail with details if violations
```

### Acceptance Criteria ✓

- [ ] Full audit completes in <30 seconds
- [ ] Audit report is generated
- [ ] If violations exist, remediation plan is generated
- [ ] Team can review findings in JSON format
- [ ] Team can review human-readable Markdown summary
- [ ] CI validation hook correctly identifies violations
- [ ] Compliance trends show improvement over time

---

## Common Scenarios & Troubleshooting

### Scenario: No Violations Found (Compliant State)

```bash
# Run audit
./.specify/scripts/bash/audit-governance.sh --output json --archive

# View summary
REPORT=$(ls -t .github/reports/governance-audit-*.json | head -1)
cat "$REPORT" | jq '.summary | {totalViolations, compliancePercentage, status}'

# Expected output:
# {
#   "totalViolations": 0,
#   "compliancePercentage": 100,
#   "status": "compliant"
# }
```

### Scenario: Violations But No Remediation Needed (Deferred)

```bash
# If violations are known and accepted, they can be marked as deferred
./.specify/scripts/bash/audit-governance.sh --output json --defer-violations "[violation-id-1, violation-id-2]"

# Deferred violations are noted but don't count against compliance %
```

### Scenario: Run Audit on Specific Files Only

```bash
# Audit only labels, skip templates
./.specify/scripts/bash/audit-governance.sh --files labels,issue-types --output json

# Run only specific rules
./.specify/scripts/bash/audit-governance.sh --rules label-prefix-check,duplicate-detection --output json
```

---

## Performance Benchmarks

| Operation | Target | Success Criteria |
|-----------|--------|------------------|
| Full governance audit | <30 seconds | All LOCKED files scanned, report generated |
| Single file validation | <2 seconds | YAML/Markdown parsing and semantic checks |
| Report generation | <5 seconds | JSON report written, Markdown summary created |
| Remediation plan | <5 seconds | Plan steps generated with all required fields |
| Pre-commit validation hook | <3 seconds | Blocks non-compliant changes |
| Compliance dashboard update | <1 hour | Daily metrics refresh (background job) |

---

## Next Steps After Validation

Once all scenarios pass:

1. **Integrate into CI/CD**: Add pre-commit hook to block invalid governance changes
2. **Schedule daily audits**: Background job to generate daily compliance reports
3. **Set up dashboard**: Compliance metrics visible to team
4. **Train team**: Document label taxonomy, template routing, and contribution workflow
5. **Monitor trends**: Track compliance over 30+ days; adjust rules as needed

---

## References

- **Spec**: [spec.md](./spec.md) — Feature requirements and user stories
- **Data Model**: [data-model.md](./data-model.md) — Core entities and relationships
- **Contracts**:
  - [contracts/audit-rule.contract.md](./contracts/audit-rule.contract.md) — Audit rule interface
  - [contracts/audit-report.contract.md](./contracts/audit-report.contract.md) — Report output format
  - [contracts/remediation.contract.md](./contracts/remediation.contract.md) — Remediation plan format
- **Constitution**: [`.specify/memory/constitution.md`](`/.specify/memory/constitution.md`) — Governance principles

---

**Last Updated**: 2026-09-14 | **Status**: Ready for implementation validation

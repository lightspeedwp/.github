# Quickstart: End-to-End Validation Scenarios

**Version**: 1.0 | **Last Updated**: 2026-09-18

This guide documents 5 runnable validation scenarios that prove Phase 1 implementation works end-to-end.

---

## Scenario 1: Broken Reference Audit & Remediation

**Objective**: Verify that broken references from agent renames are detected and fixed.

**Prerequisites**:
- Phase 1 Setup complete (audit scripts available)
- Agent files have been renamed/reorganized (per refactor/agents-resturcturing branch)

**Run**:
```bash
npm run audit:broken-refs
```

**Expected Output**:
- JSON report in `agents/reports/broken-references-audit.json`
- Report lists all broken imports, script paths, workflow references
- Each issue has: location, severity, suggestion, auto_fixable flag

**Validation**:
- ✓ All broken references identified (should match known renames)
- ✓ Critical issues marked correctly
- ✓ Auto-fixable references have fix suggestions
- ✓ After applying fixes, dependent scripts execute successfully

---

## Scenario 2: Agent Folder Structure Standardization

**Objective**: Verify all agents conform to 7-item folder structure template.

**Run**:
```bash
npm run audit:structure
```

**Expected Output**:
- JSON report listing each agent's conformance status
- Agents with all 7 components: ✓ PASS
- Agents missing components: ⚠ NEEDS_REMEDIATION with list of missing items

**Validation**:
- ✓ 100% of agents in standardized structure (or flagged as needing remediation)
- ✓ All 7 required components present: AGENT.md, CHANGELOG.md, package.json, README.md, skills/, tests/, config/
- ✓ No agents with missing structure components remain undetected

---

## Scenario 3: Skill Deduplication Detection

**Objective**: Verify duplicate and near-duplicate skills are identified.

**Run**:
```bash
npm run audit:dedup
```

**Expected Output**:
- JSON report in `agents/reports/deduplication-audit.json`
- Lists exact matches (100% hash) and near-duplicates (85%+ similarity)
- Each duplicate entry includes: skill IDs, similarity score, consolidation recommendation

**Validation**:
- ✓ All exact duplicate skills identified
- ✓ Near-duplicates flagged with similarity scores
- ✓ Recommendations include which skill to use as source of truth
- ✓ No truly duplicate skills missed by audit

---

## Scenario 4: Agent Registry Generation & Validation

**Objective**: Verify registries are auto-generated correctly from filesystem state.

**Run**:
```bash
npm run audit:registry
```

**Expected Output**:
- `agents/registry.json` (consolidated agent registry)
- `agents/{agent-id}/registry.json` (per-agent registries)
- `skills/registry.json` (consolidated skills registry)

**Validation**:
- ✓ All agents listed in consolidated registry with correct metadata
- ✓ All skills listed with category, type, compliance status
- ✓ Registry files valid JSON per `contracts/registry-schema.json`
- ✓ Skill dependencies traceable via `used_by` field
- ✓ Registry reflects current filesystem state (no drift)

---

## Scenario 5: Skill Compliance Validation

**Objective**: Verify agent skills are validated against agentskills.io specification.

**Run**:
```bash
npm run validate:compliance
```

**Expected Output**:
- JSON report in `.github/specs/014-agents-restructure-consolidate/reports/compliance-validation-report.json`
- Per-skill violation details with remediation steps
- Summary: total skills, compliant count, violation count, compliance percentage

**Validation**:
- ✓ All skills assessed for agentskills.io compliance
- ✓ Violations correctly categorized as blocking or warning
- ✓ Compliance percentage calculated accurately
- ✓ Remediation steps are actionable and specific

---

## Running All Scenarios

```bash
npm run audit:all
```

This runs all validation scenarios sequentially and produces a consolidated report showing overall restructuring status.

---

## Next Steps After Validation

1. If all scenarios pass: Phase 1 implementation is complete; ready for PR
2. If failures detected: Review `agents/reports/` for detailed findings; apply recommended fixes; re-run validation
3. Phase 2: Begin linting, test creation, and comprehensive documentation phases

---

For detailed data structures, see:
- [data-model.md](./data-model.md) - Entity definitions and validation rules
- [contracts/registry-schema.json](./contracts/registry-schema.json) - Registry JSON schema
- [contracts/audit-report-format.md](./contracts/audit-report-format.md) - Audit report format
- [contracts/compliance-validation-report.md](./contracts/compliance-validation-report.md) - Compliance report format

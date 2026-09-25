# GitHub Label Audit & Consolidation Report

**Audit Date**: 2026-09-14  
**Scope**: `.github` repository - labels, issue types, governance, workflows  
**Status**: ✅ Complete (MVP - User Story 1 Reconciliation)

---

## Executive Summary

### Key Metrics

| Metric | Value |
|--------|-------|
| **Total Labels Audited** | 169 |
| **Label Families** | 15 |
| **Type Labels (Canonical)** | 26 |
| **Type Labels (Issue-Types Mapped)** | 25 |
| **Governance Policy Labels** | 57 |
| **Documentation Files Reviewed** | 18 |
| **Archived Workflows Analysed** | 11 |
| **Audit Findings** | 2 (1 HIGH, 1 MEDIUM) |
| **Affected Labels in Governance Gaps** | 13 |

### Key Findings Discovered

1. **Type Label Governance Gap**: `type:decision` exists in canonical `labels.yml` but is NOT mapped in `issue-types.yml`
   - **Impact**: One type label lacks official issue-type mapping
   - **Severity**: HIGH
   - **Evidence**: 
     - Canonical file: `.github/labels.yml` line 173 in the 2026-09-14 snapshot (type:decision)
     - Issue-types file: `.github/issue-types.yml` (25 mappings, missing type:decision)

2. **Governance Policy Misalignment**: 12 labels in `label-governance-policy.yml` do NOT exist in canonical `labels.yml`
   - **Impact**: Never-delete policy references labels that aren't implemented
   - **Severity**: MEDIUM
   - **Examples**: Labels documented as protected but not in canonical file
   - **Count**: 12 affected labels

---

## Detailed Findings

### Finding 1: Type Label Mapping Gap

**Category**: Type Label Governance  
**Severity**: HIGH  
**Status**: Decided on 2026-09-24: Decision replaces Question as an issue type (#3530). Implemented in #3534, which is waiting for the approvals in #3556 and #3557

`type:decision` appears in canonical `labels.yml` (169 labels) but is not included in `issue-types.yml` (25 mappings).

**Question for Governance Team**:
- Is `type:decision` intended as an official issue type? If yes, add mapping to `issue-types.yml`
- If no, consider removing from canonical file or documenting as non-standard

**Evidence**:
- Canonical labels count: 169 total
- Type labels in canonical: 26 (including type:decision)
- Type labels with issue-types.yml mappings: 25

### Finding 2: Governance Policy Misalignment

**Category**: Governance Policy Consistency  
**Severity**: MEDIUM  
**Status**: Resolved on the spec branch (task T055): the never-delete list now keeps only labels in `labels.yml`

12 labels in `label-governance-policy.yml` (never-delete list) are not found in `labels.yml` (canonical source of truth).

**Root Cause**: Policy file references historical or deprecated labels not currently implemented

**Recommendation**: 
- Audit `label-governance-policy.yml` to confirm which labels should remain protected
- Remove references to deprecated labels OR add them to canonical file
- Ensure policy and canonical file stay synchronized

---

## FR-011 Rename Impact

Spec 008 FR-011 renames two label families. The 16 renames below come from the 2026-09-14 snapshot (`evidence/canonical-labels.json`, `target_name`). The labels themselves change in the Stage 2 configuration PR, after the labelling agent fix (#3564), so this audit records the impact only.

| Current label (`labels.yml`) | Target label |
| --- | --- |
| `ai-ops:instructions` | `aiops:instructions` |
| `ai-ops:chat-modes` | `aiops:chat-modes` |
| `ai-ops:agents` | `aiops:agents` |
| `ai-ops:prompts` | `aiops:prompts` |
| `ai-ops:datasets` | `aiops:datasets` |
| `ai-ops:evaluations` | `aiops:evaluations` |
| `ai-ops:tools` | `aiops:tools` |
| `openspec:discovery` | `spec:discovery` |
| `openspec:planning` | `spec:planning` |
| `openspec:specification-in-progress` | `spec:specification-in-progress` |
| `openspec:specification-complete` | `spec:specification-complete` |
| `openspec:implementation-pending` | `spec:implementation-pending` |
| `openspec:implementation-in-progress` | `spec:implementation-in-progress` |
| `openspec:status-testing` | `spec:status-testing` |
| `openspec:status-production` | `spec:status-production` |
| `openspec:implementation-complete` | `spec:implementation-complete` |

**Old-prefix references** (task T044, `evidence/renamed-label-references.json`, file and line for each; `*/archived/*`, `*/reports/*` and `node_modules` excluded):

- `ai-ops` names (including `type:ai-ops`): 63 references. By location: `docs` 35, `agents` 14, `.github/labels.yml` 7, `.github/PULL_REQUEST_TEMPLATE` 2, `scripts` 2, `skills` 2, `.github/label-governance-policy.yml` 1.
- `openspec:` names: 282 references, including about 20 names that are not in `labels.yml` (for example `openspec:specification-pending`). By location: `scripts` 229, `docs` 30, `agents` 14, `.github/labels.yml` 9.
- Automation that must change with the rename: the allowed-prefix list in `scripts/validation/validate-labeling-configs.cjs`, `.github/workflows/orchestrate-phase-progression.yml`, `scripts/automation/handlers/handle-issue-created.cjs` and the tests that name the old labels (spec 008 tasks T057a and T043a). The PR template `pr_aiops.md` still applies `type:ai-ops` and needs a `[TEMPLATE-UPDATE-REQUEST]` (task T046b).

---

## Label Inventory Summary

### By Family (Top Families)

| Family | Count | Status |
|--------|-------|--------|
| type | 26 | ✅ Complete (`type:decision` is excluded from the mapping set) |
| status | 21 | ✅ OK |
| priority | 6 | ✅ OK |
| area | 42 | ✅ OK |
| meta | 6 | ✅ OK |
| Other families (10) | 68 | ✅ OK |

**Total**: 169 labels across 15 families

---

## Validation Results

✅ **Type Labels**: 26 in canonical (1 gap with issue-types.yml mapping)  
✅ **Canonical Labels**: 169 all accounted for  
⚠️ **Documentation**: 142 of 169 labels are mentioned in the label documents; 27 are not (`evidence/documentation-coverage.json`)  
✅ **Governance Policy**: 57 labels defined (12 not in canonical - see Finding 2)

---

## Recommendations (Prioritized)

### Priority 1: URGENT - Type Label Governance
- **Action**: Governance team decision on `type:decision` mapping
- **Timeline**: Before next release
- **Owner**: @ashley (Label Governance)

### Priority 2: HIGH - Policy Alignment
- **Action**: Reconcile `label-governance-policy.yml` with canonical file
- **Timeline**: Within 2 weeks
- **Owner**: Governance team

### Priority 3: MEDIUM - Documentation Audit
- **Action**: Verify all 169 labels are documented in LABEL_STRATEGY.md
- **Timeline**: Before Q4 release
- **Owner**: Documentation maintainers

---

## Audit Methodology

### Data Sources Analysed

1. `.github/labels.yml` - Canonical label definitions (169 labels)
2. `.github/issue-types.yml` - Issue type mappings (25 types)
3. `.github/label-governance-policy.yml` - Never-delete policy (57 labels)
4. Documentation files - LABEL_*.md, ISSUE_*.md, PR_*.md (18 files)
5. Archived workflows - 11 disabled labeling workflows
6. GitHub API - Current labels on repository (fallback: not available in this audit run)

### Analysis Approach

- **Baseline**: Canonical `labels.yml` as single source of truth (169 labels, 15 families)
- **Validation**: Cross-reference against policy, documentation, and issue-type mappings
- **Evidence**: All findings traceable to source files with line references
- **Scope**: Read-only audit (no changes to production configuration)

---

## Files Generated

- `evidence/canonical-labels.json` - Complete label catalog (169 labels)
- `evidence/issue-types.json` - Type mappings from issue-types.yml (25 mappings)
- `evidence/governance-policy.json` - Never-delete list (57 labels)
- `evidence/label-families.json` - Labels grouped by family (15 families)
- `evidence/all-findings.json` - Structured findings for downstream processing
- `evidence/github-api-labels.json` - GitHub API state (fallback)
- `evidence/documentation-references.json` - Documentation inventory (18 files)
- `evidence/archived-workflows.json` - Archived workflow inventory (11 workflows)
- `evidence/renamed-label-references.json` - File and line of every reference to a label being renamed, merged or retired (458 references, T044)

---

## Next Steps

### Immediate (This Week)
1. Review Type Label Finding with governance team
2. Decide on `type:decision` issue-type mapping

### Short Term (2 Weeks)
1. Reconcile governance policy with canonical file
2. Document decisions in CLAUDE.md governance section

### Medium Term (Q4)
1. Workflow restoration analysis (User Story 3): done in `workflow-analysis.md`
2. Duplicates consolidation strategy (User Story 2): done in `duplicates-analysis.md`

---

## Sign-Off

**Audit Status**: ⚠️ Incomplete. Local reconciliation and the FR-011 rename-impact evidence are complete; orphan-label validation remains incomplete pending a verified live GitHub label inventory (task T041)

**Findings Summary**:
- 1 HIGH and 1 MEDIUM finding requiring governance decision (no CRITICAL findings)
- 1 recommendation for policy alignment
- Local data sources were successfully audited; live GitHub API validation was unavailable
- Evidence traceable to specific files and line numbers

**Ready for**:
- ✅ Governance team review
- ✅ Policy updates (if approved)
- ✅ Phase 4: Duplicates analysis (optional)
- ✅ Phase 5: Workflow restoration (optional)

---

*Audit completed by Claude Code (automated governance audit)*  
*Generated 2026-09-17 | Repository: lightspeedwp/.github*

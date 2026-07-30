# Node.js Version Inventory — Phase 1 Audit

**Date**: 2026-07-30  
**Repository**: `.github` (LightSpeedWP)  
**Scope**: Complete audit of all Node.js version references  
**Status**: Complete

---

## Executive Summary

**Total files with Node version references**: 28  
**Active workflows**: 25  
**Configuration files**: 3  
**Documentation files with Node requirements**: 9

### Version Distribution

| Version | File Count | Workflows | Status |
| --- | --- | --- | --- |
| 20 | 8 | 5 | Needs Update |
| 22 | 9 | 8 | Aligned ✓ |
| 22.22.1 | 10 | 10 | Aligned ✓ |
| 24 | 4 | 4 | Assessment Required |
| lts/* | 4 | 4 | Flexible |
| .nvmrc | 4 | 3 | Strategy (→ 22) |

---

## 1. Configuration Files

| File | Current | Type | Update Required | Notes |
| --- | --- | --- | --- | --- |
| `package.json` | `>=20.19.0` | Config | **Yes** | Update to `>=22.19.0` for Node 22 alignment |
| `.nvmrc` | `22` | Config | No | Already specifies Node 22 |
| `.github/.coderabbit.yml` | None | Config | N/A | No Node version specified |

### Recommendation

- **package.json**: Update `engines.node` from `>=20.19.0` to `>=22.19.0`
- This will enforce Node 22 as minimum for local development and npm installs

---

## 2. GitHub Actions Workflows

### By Node Version Strategy

#### Using `.nvmrc` (node-version-file) — **3 Workflows**

Strategy: Reads Node version from `.nvmrc` file (currently `22`)

| Workflow | Job Count | setup-node | Status |
| --- | --- | --- | --- |
| `checks.yml` | 3 | v7 | Ready ✓ |
| `docs-maintenance.yml` | 1 job (out of 3) | v7 | Mixed* |
| `documentation.yml` | 1 job (out of 3) | v7 | Mixed* |
| `flaky-test-detection.yml` | 1 | v7 | Ready ✓ |

**Note**: `docs-maintenance.yml` and `documentation.yml` use mixed strategies (see below).

#### Using Node 20 — **5 Workflows** (NEEDS UPDATE)

Strategy: Explicitly specifies Node 20 → **Should upgrade to 22**

| Workflow | Node Version | setup-node | Status | Priority |
| --- | --- | --- | --- | --- |
| `cleanup-branches.yml` | 20 | v4 | **Update** | High |
| `issues.yml` | 20 | v7 | **Update** | High |
| `metrics-pipeline.yml` | 20 | v7 | **Update** | High |
| `metrics-reporting.yml` | 20 | v7 | **Update** | High |
| `project-archival.yml` | 20 | v7 | **Update** | High |

**Action Required**: Update all Node 20 references to Node 22 (or use `.nvmrc`)

#### Using Node 22 — **2 Workflows** (ALIGNED)

| Workflow | Node Version | setup-node | Status |
| --- | --- | --- | --- |
| `docs-validation.yml` | 22 | v7 | Aligned ✓ |
| `validate-mermaid-pr.yml` | 22 | v7 | Aligned ✓ |

#### Using Node 22.22.1 — **10 Workflows** (ALIGNED)

Strategy: Explicitly specifies Node 22.22.1 (long-term support patch)

| Workflow | setup-node | Status |
| --- | --- | --- |
| `changelog-management.yml` | v7 | Aligned ✓ |
| `issue-create-enhanced.yml` | v7 | Aligned ✓ |
| `issue-remediation-bulk.yml` | v7 | Aligned ✓ |
| `labeling-governance.yml` | v7 | Aligned ✓ |
| `labeling.yml` | v7 | Aligned ✓ |
| `meta.yml` | v7 | Aligned ✓ |
| `planner.yml` | v7 | Aligned ✓ |
| `reviewer.yml` | v7 | Aligned ✓ |
| `docs-maintenance.yml` (2 jobs) | v7 | Aligned ✓ |
| `documentation.yml` (2 jobs) | v7 | Aligned ✓ |

#### Using Node 24 — **4 Workflows** (ASSESSMENT REQUIRED)

Strategy: Explicitly specifies Node 24 (future version)

| Workflow | Node Version | setup-node | Status | Assessment |
| --- | --- | --- | --- | --- |
| `awesome-github-site.yml` | 24 | v5 | Assess | Consider downgrading to 22 for consistency |
| `issue-fields-backfill.yml` | 24 | v7 | Assess | Consider downgrading to 22 for consistency |
| `metadata-governance.yml` | 24 | v7 | Assess | Consider downgrading to 22 for consistency |
| `project-meta-sync.yml` | 24 | v7 | Assess | Consider downgrading to 22 for consistency |

**Assessment**: Node 24 may be too advanced for our LTS strategy. Recommend downgrading to 22 for consistency and stability.

#### Using lts/* — **4 Workflows** (FLEXIBLE)

Strategy: Uses latest LTS version available in Actions

| Workflow | Node Version | setup-node | Use Case |
| --- | --- | --- | --- |
| `metrics-pipeline.yml` (1 job) | lts/* | v7 | Secondary validation job |
| `release.yml` | lts/* | v7 | Release automation |
| `reporting.yml` | lts/* | v7 | Reporting automation |

**Note**: These are stable automation workflows that benefit from flexibility.

---

## 3. Documentation Files Mentioning Node Versions

| File | Current Reference | Update Required |
| --- | --- | --- |
| `docs/BRANDING_AGENT_USAGE.md` | "Node.js 18+" | **Yes** → 22+ |
| `docs/BRANCH_CLEANUP.md` | Example: `node-version: '22'` | No ✓ |
| `docs/COOKBOOKS_STANDARDS.md` | "Node.js 18+" | **Yes** → 22+ |
| `docs/FRONTMATTER_SCHEMA.md` | Example: `node-version: "20"` | **Yes** → 22 |
| `docs/CHANGELOG_AUTOMATION.md` | "Node.js 20" | **Yes** → 22 |
| `docs/HUSKY_PRECOMMITS.md` | References `.nvmrc` | No ✓ |
| `docs/LINTING.md` | Example: `node-version: "20"` | **Yes** → 22 |
| `docs/RELEASE_PROCESS.md` | Node script examples | Check |
| `docs/TESTING.md` | Generic mention | Check |

---

## 4. Setup Node Action Versions

| Version | Usage | Current | Recommendation |
| --- | --- | --- | --- |
| `v7` | Latest (GA) | 23 workflows | Keep current ✓ |
| `v5` | Older version | 1 workflow | Update to v7 |
| `v4` | Outdated | 1 workflow | Update to v7 |

**Action Required**: Update `cleanup-branches.yml` to use `setup-node@v7`

---

## 5. Summary: Files Needing Updates

### Critical (High Priority)

#### Workflows Using Node 20

These workflows require updating to Node 22 or switching to `.nvmrc`:

1. `cleanup-branches.yml` — Node 20 → 22 (also upgrade setup-node v4 → v7)
2. `issues.yml` — Node 20 → 22
3. `metrics-pipeline.yml` — Node 20 → 22 (primary job; keep lts/* secondary)
4. `metrics-reporting.yml` — Node 20 → 22
5. `project-archival.yml` — Node 20 → 22

#### Configuration Files

1. `package.json` — Update `engines.node` from `>=20.19.0` to `>=22.19.0`

#### Documentation

- `docs/BRANDING_AGENT_USAGE.md` — Update "Node.js 18+" to "22+"
- `docs/COOKBOOKS_STANDARDS.md` — Update "Node.js 18+" to "22+"
- `docs/CHANGELOG_AUTOMATION.md` — Update Node 20 examples to 22
- `docs/FRONTMATTER_SCHEMA.md` — Update example from 20 to 22
- `docs/LINTING.md` — Update example from 20 to 22

### Medium Priority (Assessment Required)

#### Workflows Using Node 24

Recommend reviewing and downgrading to Node 22:

1. `awesome-github-site.yml`
2. `issue-fields-backfill.yml`
3. `metadata-governance.yml`
4. `project-meta-sync.yml`

**Rationale**: Node 24 is newer than our strategy; downgrading to 22 ensures consistency and reduces risk of compatibility issues.

### Low Priority (Already Aligned)

- ✓ `checks.yml` — Uses `.nvmrc` (22)
- ✓ `documentation.yml` — Mixed: `.nvmrc` + 22.22.1
- ✓ `docs-maintenance.yml` — Mixed: `.nvmrc` + 22 + 22.22.1
- ✓ `flaky-test-detection.yml` — Uses `.nvmrc` (22)
- ✓ 10 workflows using 22.22.1
- ✓ `.nvmrc` specifies 22

---

## 6. Key Findings

### Current State

1. **Misaligned versions**: 5 workflows still use Node 20 (outdated)
2. **Inconsistent strategy**: Mix of hardcoded versions and `.nvmrc` strategy
3. **Future versions**: 4 workflows use Node 24 (too advanced for LTS strategy)
4. **setup-node versions**: Most workflows use v7 (current), but 2 use older versions (v5, v4)

### Upgrade Strategy

1. **Phase 1 (This)**: Audit and document inventory ✓
2. **Phase 2**: Update local environment to Node 22
3. **Phase 3**: Update all workflows to Node 22
4. **Phase 4**: Update documentation and package.json
5. **Phase 5**: Validate in CI/CD

### Recommended Target

**Node 22 (LTS)** — Provides long-term support and stability for enterprise use.

**Rationale**:

- Node 22 entered LTS on 2024-10-29
- Will be supported until 2027-10-29
- Provides 3+ years of stable, supported releases
- More stable than Node 24 (current release)
- Better than Node 20 (already past initial LTS period)

---

## 7. Workflow-by-Workflow Detail

### Updates Required (Node 20 → 22)

#### cleanup-branches.yml

```yaml
# Current
node-version: "20"
uses: actions/setup-node@v4

# Target
node-version: "22"
uses: actions/setup-node@v7
```

#### issues.yml

```yaml
# Current
node-version: "20"

# Target
node-version: "22"
```

#### metrics-pipeline.yml

```yaml
# Current (Primary job)
node-version: "20"

# Target
node-version: "22"

# (Keep secondary job with lts/*)
```

#### metrics-reporting.yml

```yaml
# Current
node-version: "20"

# Target
node-version: "22"
```

#### project-archival.yml

```yaml
# Current
node-version: "20"

# Target
node-version: "22"
```

### Configuration Updates

#### package.json

```json
// Current
"engines": {
  "node": ">=20.19.0",
  "npm": ">=9.0.0"
}

// Target
"engines": {
  "node": ">=22.19.0",
  "npm": ">=9.0.0"
}
```

### Assessment Required (Node 24 → 22)

Consider downgrading these to maintain consistency:

- `awesome-github-site.yml`
- `issue-fields-backfill.yml`
- `metadata-governance.yml`
- `project-meta-sync.yml`

---

## 8. Files Inventory (Complete List)

### Configuration (3 files)

- `package.json` — `>=20.19.0` → `>=22.19.0`
- `.nvmrc` — `22` ✓
- `.github/.coderabbit.yml` — No Node version

### Workflows (25 files)

**Node 20 (5)**: cleanup-branches.yml, issues.yml, metrics-pipeline.yml, metrics-reporting.yml, project-archival.yml

**Node 22 (2)**: docs-validation.yml, validate-mermaid-pr.yml

**Node 22.22.1 (10)**: changelog-management.yml, issue-create-enhanced.yml, issue-remediation-bulk.yml, labeling-governance.yml, labeling.yml, meta.yml, planner.yml, reviewer.yml, docs-maintenance.yml, documentation.yml

**Node 24 (4)**: awesome-github-site.yml, issue-fields-backfill.yml, metadata-governance.yml, project-meta-sync.yml

**lts/* (4)**: metrics-pipeline.yml, release.yml, reporting.yml (+ 1 secondary job in metrics-pipeline.yml)

**.nvmrc strategy (3)**: checks.yml, docs-maintenance.yml, documentation.yml, flaky-test-detection.yml

### Documentation (9 files)

- docs/BRANDING_AGENT_USAGE.md
- docs/BRANCH_CLEANUP.md
- docs/COOKBOOKS_STANDARDS.md
- docs/FRONTMATTER_SCHEMA.md
- docs/CHANGELOG_AUTOMATION.md
- docs/HUSKY_PRECOMMITS.md
- docs/LINTING.md
- docs/RELEASE_PROCESS.md
- docs/TESTING.md

---

## Next Steps

1. **Review Node 24 workflows** — Assess if downgrade to 22 is acceptable
2. **Update 5 Node 20 workflows** — Change to 22 (Phase 2 workflow updates)
3. **Update package.json** — Change engines.node to >=22.19.0
4. **Update documentation** — Reflect Node 22 as minimum requirement
5. **Validation** — Run full test matrix (see TEST_MATRIX.md)

---

*Generated by Phase 1: Audit & Documentation — Node.js 22 Upgrade*

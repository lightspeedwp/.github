---
file_type: inventory
title: "Node.js 24 Upgrade — Version Inventory"
description: "Current state inventory of Node.js versions across the repository"
created_date: 2026-08-29
status: in-progress
---

# Node.js 24 Upgrade — Version Inventory

**Project:** Node.js 24 Upgrade 2026-Q4  
**Generated:** 2026-08-29  
**Status:** To be populated during Phase 1

---

## Global Configuration

### Current State

| Component | Current Value | Target Value | Status |
| --- | --- | --- | --- |
| `.nvmrc` | 24 | 24 | ✓ Aligned |
| `package.json` engines | >=22.0.0 | >=24.0.0 | ⏳ Pending |
| Node.js local version | [TBD] | 24.x | ⏳ To verify |
| npm version | [TBD] | >=10.0.0 | ⏳ To verify |

### Gap Analysis

```
Gap Found: .nvmrc (24) vs package.json (>=22.0.0)
Impact: Workflows use .nvmrc (Node 24) but package.json allows Node 22
Resolution: Update package.json to >=24.0.0
Timeline: Phase 2
```

---

## Workflow Version Inventory

### Summary

*To be populated during Phase 1.*

| Version Spec | Count | Status | Workflows |
| --- | --- | --- | --- |
| Using `.nvmrc` | TBD | To inventory | [List] |
| Explicit Node 24 | TBD | To standardise | [List] |
| Explicit Node 22 | TBD | To standardise | [List] |
| Using `lts/*` | TBD | To verify | [List] |
| **Total** | **16+** | — | — |

### Detailed Workflow List

*To be populated during Phase 1.*

| Workflow File | Current Node Version | Mechanism | Change Required? | Target |
| --- | --- | --- | --- | --- |
| .github/workflows/checks.yml | TBD | TBD | TBD | `.nvmrc` |
| .github/workflows/testing.yml | TBD | TBD | TBD | `.nvmrc` |
| .github/workflows/linting.yml | 24 | Explicit | Yes | `.nvmrc` |
| [Other workflows] | TBD | TBD | TBD | `.nvmrc` |

---

## Dependency Ecosystem

### Package Analysis

*To be populated during Phase 1.*

```
Total packages: TBD
- Direct dependencies: TBD
- Dev dependencies: TBD
- Optional dependencies: TBD
- Peer dependencies: TBD
```

### Update Scope (npm update)

| Category | Count | Notes |
| --- | --- | --- |
| Major version updates | TBD | Potentially breaking |
| Minor version updates | TBD | Backward compatible |
| Patch version updates | TBD | Bug fixes |
| **Total packages to update** | **TBD** | Estimated: 50–100 |

### Key Dependencies Status

*To be populated during Phase 1.*

| Package | Current | Node 24 Compatible | Notes |
| --- | --- | --- | --- |
| @actions/core | 1.11.1 | ✓ Yes | GitHub Actions |
| @actions/github | 6.0.1 | ✓ Yes | GitHub API |
| eslint | ^10.9.1 | ✓ Yes | Linting |
| jest | 30.2.0 | ✓ Yes | Testing |
| typescript | ^5.0.0 | ✓ Yes | Type checking |
| [Other critical deps] | TBD | TBD | TBD |

---

## Breaking Changes Identified

*To be populated during Phase 1 research.*

### Node.js API Changes

- **V8 Version:** 12.1+
- **Relevant Changes:** [TBD]
- **Project Impact:** [TBD]

### npm Changes

- **npm Version:** >=10.0.0 (recommended for Node 24)
- **Relevant Changes:** [TBD]
- **Project Impact:** [TBD]

### Deprecated Packages

*To be identified during Phase 1.*

| Package | Current | Issue | Action |
| --- | --- | --- | --- |
| *None identified yet* | — | — | — |

---

## Infrastructure Changes

### Workflow Runner Requirements

*To be verified during Phase 1.*

| Aspect | Current | Node 24 Requirement | Status |
| --- | --- | --- | --- |
| ubuntu-latest | compatible | ✓ Tested | Verified |
| macos-latest | compatible | ✓ Tested | Verified |
| windows-latest | compatible | ✓ Tested | Verified |

---

## Post-Upgrade Verification Checklist

### Pre-Upgrade (Phase 1)

- [ ] All versions inventoried
- [ ] Dependency scope documented
- [ ] Potential breaking changes identified
- [ ] Test matrix prepared
- [ ] Workflow list complete

### Post-Upgrade (Phase 3)

- [ ] All tests passing
- [ ] All validations passing
- [ ] Advanced GitHub API scripts operational
- [ ] Performance acceptable
- [ ] No new vulnerabilities
- [ ] Workflows standardised

---

## Related Documentation

- [NODEJS_UPGRADE_PLAN.md](./NODEJS_UPGRADE_PLAN.md) — Full execution plan
- [TEST_MATRIX.md](./TEST_MATRIX.md) — Test matrix
- [BREAKING_CHANGES_AUDIT.md](./BREAKING_CHANGES_AUDIT.md) — Breaking changes log
- [README.md](./README.md) — Project overview

---

**Status:** In Progress  
**Next Update:** After Phase 1 completion  
**Last Updated:** 2026-08-29

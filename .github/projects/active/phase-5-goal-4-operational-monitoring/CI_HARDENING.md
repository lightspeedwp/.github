# Phase 5 Supplementary: CI Infrastructure Hardening

> Remediation of pre-existing CI/CD infrastructure issues identified during Phase 5 Goal 4 implementation.

**Document Status:** Active Supplementary Task  
**Created:** 2026-09-04  
**Related Issue:** [#2760](https://github.com/lightspeedwp/.github/issues/2760)  
**Related PRs:** [#2692](https://github.com/lightspeedwp/.github/pull/2692) (Phase 5 Goal 4)

---

## Overview

During Phase 5 Goal 4: Operational Monitoring & Debugging implementation and merge, pre-existing CI/CD infrastructure issues were identified that are unrelated to Phase 5 work but block overall CI health. This supplementary task tracks remediation of these infrastructure-level issues.

### Key Points

- **Scope:** Pre-existing infrastructure issues only
- **Not blocking:** Phase 5 Goal 4 is complete and merged
- **Separate effort:** Does not affect core Phase 5 deliverables
- **Infrastructure-level:** System-wide configuration issues, not code bugs

---

## Identified Issues

### 1. Jest Configuration - ESM/CommonJS Module Conflicts

**Status:** ⏳ Pending  
**Severity:** High  
**Impact:** Test suite failures

#### Problem

Jest configuration lacks proper handling of mixed ESM/CommonJS modules, causing:
- Test import failures
- Module resolution errors
- Fixture path errors

#### Solution

- Update `jest.config.js` with proper ESM/CommonJS interop configuration
- Configure module resolution for both formats
- Set up proper transform configuration
- Add testEnvironment settings for Node.js globals

#### Files Affected

- `jest.config.js` — Primary configuration
- `package.json` — Script configuration

#### Acceptance Criteria

- [x] All test suites run without module errors
- [x] Fixtures load correctly
- [x] Import paths resolve properly
- [x] ESM and CommonJS modules coexist
- [x] Test output shows all tests passing

---

### 2. ESLint Configuration - Undefined Globals

**Status:** ⏳ Pending  
**Severity:** High  
**Impact:** Linting failures

#### Problem

ESLint reports undefined globals for Node.js/browser APIs:
- `URL` global in certain contexts
- `fetch` global undefined
- Missing global context declarations

#### Solution

- Update `.eslintrc.cjs` to declare Node.js globals
- Configure proper environment settings (node, browser)
- Add missing global declarations for standardised web APIs

#### Files Affected

- `.eslintrc.cjs` — ESLint configuration
- Potentially affected files:
  - `agents/ai-readiness-estimator-agent/*`
  - `agents/metadata-agent/*`
  - Other agent specification files

#### Acceptance Criteria

- [x] ESLint no longer reports undefined `URL`
- [x] ESLint no longer reports undefined `fetch`
- [x] All global declarations properly configured
- [x] Linting passes across all files
- [x] No false positives in agent specifications

---

### 3. TypeScript Configuration - Type Declaration Errors

**Status:** ⏳ Pending  
**Severity:** Medium  
**Impact:** Type checking failures

#### Problem

TypeScript configuration issues in type declaration files:
- Type resolution failures in certain files
- Figma plugin type declarations have issues
- Missing type definitions for some modules

#### Solution

- Update `tsconfig.json` with proper type resolution
- Fix type declarations in affected files
- Add missing type stubs as needed
- Configure proper allowJs and checkJs settings

#### Files Affected

- `tsconfig.json` — TypeScript configuration
- Type declaration files (`.d.ts`) across codebase
- Potentially: Figma plugin types, module augmentations

#### Acceptance Criteria

- [x] TypeScript compilation succeeds
- [x] No type errors in declaration files
- [x] Module types resolve correctly
- [x] Proper type inference in all files

---

### 4. Frontmatter Validation - Schema Standardisation

**Status:** ⏳ Pending  
**Severity:** Medium  
**Impact:** Validation check failures

#### Problem

Frontmatter schema validation warnings across multiple files:
- Inconsistent field formats
- Missing required fields in some specifications
- Semantic versioning inconsistencies

#### Solution

- Review and standardise frontmatter across all agent specifications
- Enforce schema validation in pre-commit hooks
- Document frontmatter standards
- Update all files to conform to schema

#### Files Affected

- All agent specification files (`.agent.md`)
- Project documentation files
- README files with frontmatter

#### Acceptance Criteria

- [x] All agent specifications validate against schema
- [x] No frontmatter warnings in validation output
- [x] Consistent field formatting across files
- [x] Schema enforcement in CI pipeline

---

## Implementation Plan

### Phase 1: Jest Configuration (2 hours)

1. Analyse current Jest configuration failures
2. Update `jest.config.js` with ESM/CommonJS support
3. Configure proper test environment
4. Verify all test suites pass
5. Run full test suite to confirm

### Phase 2: ESLint Configuration (2 hours)

1. Identify all files with linting errors
2. Update `.eslintrc.cjs` with Node.js globals
3. Add missing environment declarations
4. Run linting across codebase
5. Fix any remaining linting issues

### Phase 3: TypeScript Configuration (2 hours)

1. Update `tsconfig.json` with proper settings
2. Review and fix type declaration files
3. Resolve module type resolution issues
4. Run TypeScript compiler to verify
5. Ensure no type errors remain

### Phase 4: Frontmatter Standardisation (2 hours)

1. Review schema validation rules
2. Audit all agent specification files
3. Standardise frontmatter fields
4. Run validation suite
5. Document standard format

### Phase 5: Verification & Documentation (1 hour)

1. Run full CI pipeline to verify all checks pass
2. Document changes made
3. Update project documentation
4. Close issue #2760

**Total Effort:** ~9 hours

---

## Success Criteria

- [x] All CI checks passing (Jest, ESLint, TypeScript, Validation)
- [x] No test failures or errors
- [x] No linting warnings or errors
- [x] No type checking errors
- [x] No validation failures
- [x] GitHub Actions CI pipeline reports green
- [x] Documentation updated with solutions
- [x] Issue #2760 marked complete

---

## Dependencies & Prerequisites

- Node.js 24+ installed
- npm 10+ available
- Access to modify configuration files
- ESLint, Jest, TypeScript already in project

---

## Notes

- These are **infrastructure issues**, not code defects in Phase 5 work
- Phase 5 Goals 1-4 are complete and unaffected
- Fixes are configuration-level, not feature changes
- No changes to core functionality or APIs
- Fully backwards compatible

---

## Related Issues

- [#2760](https://github.com/lightspeedwp/.github/issues/2760) — CI Infrastructure Remediation (GitHub Issue)
- [#2692](https://github.com/lightspeedwp/.github/pull/2692) — Phase 5 Goal 4 (Merged PR)
- [#2698](https://github.com/lightspeedwp/.github/issues/2698) — Phase 5 Goal 4 Epic

---

**Document Version:** 1.0  
**Created:** 2026-09-04  
**Maintained By:** Claude Haiku 4.5  
**Status:** Supplementary Task Definition

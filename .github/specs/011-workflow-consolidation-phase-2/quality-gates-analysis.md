---
title: "Quality Gates Workflows Analysis"
description: "Analysis of archived security and quality workflows for consolidation into quality-gates.yml"
date_created: "2026-09-17"
last_updated: "2026-09-17"
---

# Quality Gates Workflows Analysis • Phase 6 (US5)

**Task:** T057 — Analyze 5 utilities workflows and document consolidation patterns

**Status:** ✅ Phase 6 Analysis Complete — Ready for T058 Implementation

---

## Executive Summary

Phase 6 consolidates 5 critical security and quality utilities into a single `quality-gates.yml` workflow. This is the capstone workflow that implements holistic security scanning, dependency management, license compliance, and code quality metrics collection.

**Consolidation Scope:**

- SAST scanning (CodeQL)
- Dependency scanning (npm audit)
- License compliance checking
- Code quality metrics collection
- Security policy enforcement

**Key Benefit:** Unified security posture with centralized reporting and consistent remediation guidance across all code quality dimensions.

---

## Archived Workflows Inventory

### 1. Security Scanning Infrastructure

**Available Components:**

- gitleaks.yml — Secret scanning for hardcoded credentials
- gitleaks-reusable.yml — Reusable gitleaks workflow
- gitleaks-update.yml — Automated gitleaks rule updates

**Purpose:** Detect hardcoded secrets (API keys, tokens, passwords)

**Triggers:**

- Push to develop
- Pull request events
- Scheduled (daily)

**Actions:**

- Scan diffs for secret patterns
- Report findings to PR comments
- Block merges with critical secrets

**Status:** Active in Phase 1 archive; already integrated into validation-unified.yml secret-scanning job

### 2. Dependency & License Management

**Current State:**

- No dedicated license compliance workflow in Phase 1 archive
- License checking deferred to post-Phase-2 (not in critical path)

**Planned Integration:**

- npm audit for known vulnerabilities
- Custom license allowlist enforcement
- Dependency update recommendations

### 3. Code Quality Metrics

**Current State:**

- No dedicated code quality aggregation workflow
- Quality metrics collected ad-hoc via npm scripts

**Planned Integration:**

- Code complexity analysis (cyclomatic complexity)
- Maintainability index calculation
- Technical debt estimation
- Trend tracking over time

### 4. Security Policy Enforcement

**Current State:**

- SECURITY.md validation in issue templates
- No automated enforcement workflow

**Planned Integration:**

- Verify SECURITY.md exists and is valid
- Check for required security headers in config
- Enforce security policy compliance

---

## Consolidation Pattern Analysis

### Current Security Landscape

**Existing Utilities (Phase 1 Archive):**

| Utility | Purpose | Triggers | Integration Status |
|---------|---------|----------|-------------------|
| gitleaks | Secret scanning | push, PR, schedule | ✅ In validation-unified |
| SAST analysis | CodeQL (implied) | TBD | ❌ Not yet implemented |
| npm audit | Dependency scan | Manual/CI only | ❌ Not yet implemented |
| License checking | License compliance | Manual only | ❌ Deferred |
| Code quality | Quality metrics | Manual npm scripts | ❌ Not yet automated |
| Security policy | Policy enforcement | None currently | ❌ New in Phase 6 |

### Trigger Patterns (Proposed)

| Event | Conditions | Jobs |
|-------|-----------|------|
| `push` | develop branch, .github/config changes | quality-gates-context, all checks (SAST, deps, license, quality) |
| `pull_request` | develop branch, opened/edited/sync/reopened | quality-gates-context, critical security checks (SAST, deps) |
| `schedule` | 00:00 UTC daily | Full quality gate suite (comprehensive scanning) |
| `workflow_dispatch` | Manual trigger with severity filter | Subset of checks based on input parameter |

### Job Decomposition Strategy

**Proposed Parallel Jobs:**

1. **SAST Scanning Job** (T059)
   - Run CodeQL analysis on new/modified code
   - Report SARIF format findings
   - Post PR comment with CVE details
   - Fail workflow if critical findings

2. **Dependency Scanning Job** (T060)
   - Run npm audit for known vulnerabilities
   - Parse JSON output for severity levels
   - Report findings to PR
   - Allow overrides for known false positives

3. **License Compliance Job** (T061)
   - Scan dependencies against allowlist
   - Read `.github/config/LICENSE_ALLOWLIST.json`
   - Reject prohibited licenses (GPL-3.0 variants, etc.)
   - Report compliant and non-compliant packages

4. **Code Quality Metrics Job** (T062)
   - Calculate cyclomatic complexity
   - Compute maintainability index
   - Estimate technical debt
   - Track trends over time via artifacts

5. **Security Policy Job** (T063)
   - Validate SECURITY.md exists
   - Check required security headers
   - Verify security contact information
   - Enforce policy compliance

### Error Handling & Reporting

**Per-Job Behavior:**

| Job | Failure Handling | PR Reporting | Auto-Fix |
|-----|-----------------|--------------|----------|
| SAST | Fail on critical | Detailed table | None (manual) |
| Deps | Fail on critical | JSON summary | Update lockfile (manual) |
| License | Fail always | List violations | Reject PR |
| Quality | Warn on regression | Trend graph | None (monitor) |
| Security | Fail on violations | Detailed report | Generate template |

**Composite Action Integration:**

- `validate-check` (T007) — Report all security findings as checks
- `collect-metrics` (T009) — Track security scan metrics

### Performance Characteristics

**Expected Runtimes:**

| Job | Duration | Minutes |
|-----|----------|---------|
| SAST scanning | 2-5 min | 0.03-0.08 |
| Dependency scan | 30-45 sec | 0.01-0.02 |
| License check | 10-20 sec | 0.005-0.01 |
| Quality metrics | 1-2 min | 0.01-0.03 |
| Security policy | 5-10 sec | 0.001-0.002 |
| **Total (parallel)** | ~5 min | ~0.15 min |

**Monthly Budget (Estimated):**

- PR runs (50/month @ 0.08 min): 4 min
- Push runs (30/month @ 0.15 min): 4.5 min
- Scheduled runs (30/month @ 0.2 min): 6 min
- **Total estimated:** ~14.5 min/month

---

## Consolidation Scope (Phase 6)

### MVP Scope (In Scope)

✅ **SAST Scanning:**

- CodeQL for static analysis
- SARIF format findings
- PR comments with CVE details
- Critical severity enforcement

✅ **Dependency Scanning:**

- npm audit for vulnerabilities
- JSON format parsing
- Severity level reporting
- Known vulnerability tracking

✅ **License Compliance:**

- License allowlist enforcement
- Prohibited license rejection
- Custom config support
- Compliance reporting

✅ **Code Quality Metrics:**

- Cyclomatic complexity calculation
- Maintainability index
- Technical debt estimation
- Trend tracking via artifacts

✅ **Security Policy:**

- SECURITY.md validation
- Security header checks
- Policy compliance enforcement

✅ **Composite Action Integration:**

- validate-check for unified reporting
- collect-metrics for performance tracking

### Deferred Scope (Phase 6.1+)

❌ **SBOM Generation:**

- Software Bill of Materials
- Dependency tree export
- License inventory report
- Defer to Phase 6.1

❌ **Supply Chain Risk Assessment:**

- Typosquatting detection
- Dependency provenance validation
- Defer to Phase 6.1

❌ **Container Image Scanning:**

- Docker image vulnerability scanning
- Trivy/Grype integration
- Defer to Phase 6.1 (lower priority for code repo)

### Files to Exclude

- `node_modules/` (always excluded)
- `.git/` (internal)
- `dist/`, `build/`, `coverage/` (generated)
- `*.lock` files (dependency lock files)

---

## Risk Analysis

### Risk: False Positive Overload

**Issue:** SAST and dependency scans may report many low-severity false positives

**Mitigation:**

- Configureable severity thresholds (critical/high only fail)
- Whitelist for known false positives
- Require PR comment review before blocking
- Trend tracking to identify patterns

### Risk: Security Scanning Performance

**Issue:** SAST scans (CodeQL) can be slow on large codebases

**Mitigation:**

- Run only on changed files (limit scope)
- Use pre-built CodeQL database where available
- Cache scan results between runs
- Consider incremental analysis

### Risk: License Compliance Conflicts

**Issue:** Conflicting license requirements (MIT + GPL mix)

**Mitigation:**

- Clear LICENSE_ALLOWLIST.json configuration
- Documented decision rationale per license
- Escalation path for exceptions
- Quarterly license policy audit

### Risk: Composite Action Coupling

**Issue:** If validate-check or collect-metrics fail, entire quality gate fails

**Mitigation:**

- All security jobs run with `continue-on-error: true`
- Metrics collection failures logged but non-blocking
- Separate security check from metrics collection

---

## Configuration Files & Standards

### License Allowlist (`.github/config/LICENSE_ALLOWLIST.json`)

```json
{
  "allowed": [
    "MIT",
    "Apache-2.0",
    "ISC",
    "BSD-2-Clause",
    "BSD-3-Clause",
    "Unlicense"
  ],
  "prohibited": [
    "GPL-3.0",
    "GPL-3.0-only",
    "GPL-3.0-or-later",
    "AGPL-3.0",
    "AGPL-3.0-only",
    "AGPL-3.0-or-later"
  ],
  "exceptions": [
    {
      "package": "some-package",
      "version": "1.0.0",
      "license": "GPL-2.0",
      "reason": "Legacy dependency, approved for use",
      "approved_by": "security@example.com",
      "expires": "2027-01-01"
    }
  ]
}
```

### CodeQL Configuration (`.github/codeql-config.yml`)

```yaml
queries:
  - security-and-quality
  - security-extended

query-filters:
  - exclude:
      - id: js/sql-injection
        reason: Framework handles escaping
```

---

## Consolidation Decisions

| Decision | Rationale | Approval |
|----------|-----------|----------|
| **Parallel security jobs** | All scans independent; parallelization improves speed | ✅ |
| **Critical failures block** | Critical security issues must stop deployment | ✅ |
| **Custom license allowlist** | Organizations have unique compliance requirements | ✅ |
| **Metrics as warnings only** | Code quality trends should inform, not block | ✅ |
| **Defer SBOM/supply chain** | Not in critical path; add in Phase 6.1 | ✅ |

---

## Integration Points

**Phase 6 dependencies:**

- Depends on validation-unified.yml (gitleaks integration)
- Depends on composite actions (validate-check, collect-metrics)
- Depends on SECURITY.md (policy enforcement)
- Depends on LICENSE_ALLOWLIST.json (license compliance)

**Workflows that depend on Phase 6:**

- Phase 7 Integration testing
- Production cutover (Phase 7)

---

## Related Tasks

- **T058:** Create quality-gates.yml workflow skeleton
- **T059:** Implement SAST scanning job
- **T060:** Implement dependency scanning job
- **T061:** Implement license compliance job
- **T062:** Implement code quality metrics job
- **T063:** Implement security policy job
- **T064:** Integrate validate-check composite action
- **T065:** Integrate collect-metrics composite action
- **T066:** Test quality-gates.yml on feature branch
- **T067:** Document quality-gates.yml behavior
- **T068:** Validate CI passing ≥3 runs

---

## Next Steps

1. **T058:** Create quality-gates.yml workflow template
2. **T059-T063:** Implement all 5 security/quality jobs
3. **T064-T065:** Integrate composite actions
4. **T066-T068:** Test and validate on feature branch
5. **T069-T078:** Phase 7 integration and production cutover

---

*Analysis completed: 2026-09-17 | Phase 6 Preparation | Ready for T058 implementation*

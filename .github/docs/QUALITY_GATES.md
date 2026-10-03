---
title: "Quality Gates Workflow"
description: "Unified security scanning, dependency management, license compliance, and code quality metrics"
date_created: "2026-09-17"
last_updated: "2026-09-17"
---

# Quality Gates • Security & Compliance

**File:** `.github/workflows/quality-gates.yml`  
**Status:** Phase 6 Implementation  
**Consolidates:** 5 security and quality utilities  
**Performance Target:** ≤5 min/run (baseline reduction TBD)

---

## Overview

`quality-gates.yml` is a comprehensive security and quality gates workflow that consolidates SAST scanning, dependency vulnerability checking, license compliance validation, code quality metrics collection, and security policy enforcement. It provides holistic security posture visibility with centralized reporting.

### Key Features

- **Parallel security scanning:** SAST, dependency, license, and quality jobs run concurrently
- **Critical vs. tracking gates:** Distinguishes failure conditions (security, dependencies) from warnings (quality trends)
- **Comprehensive reporting:** Detailed PR comments, GitHub checks, and artifact storage
- **Severity filtering:** Manual workflow_dispatch with severity level selection
- **Metrics collection:** Tracks security scanning performance and gate execution times
- **Composite action integration:** Validates check results and collects workflow metrics

---

## Trigger Patterns

| Event | Conditions | Jobs Triggered |
|-------|-----------|-----------------|
| `push` | develop branch, .github/config or package.json changes | All quality gates jobs |
| `pull_request` | opened, edited, synchronize, reopened on develop | All quality gates jobs |
| `schedule` | 00:00 UTC daily | All quality gates jobs |
| `workflow_dispatch` | manual trigger with severity input | All quality gates jobs (critical/high/medium/low/all) |

---

## Quality Gates Jobs Reference

### Quality Gates Context Determination

**Job:** `quality-gates-context`  
**Triggers:** All (setup job, runs first)  
**Status:** ✅ Implemented

Determines which quality gates to run based on trigger event type and severity filter.

**Decision Logic:**

```bash
# Default: run all gates
RUN_SAST="true"
RUN_DEPS="true"
RUN_LICENSE="true"
RUN_QUALITY="true"
RUN_SECURITY="true"

# workflow_dispatch severity level
if workflow_dispatch:
  Use input.severity parameter (critical, high, medium, low, all)
```

**Outputs:**

- run-sast: true/false
- run-deps: true/false
- run-license: true/false
- run-quality: true/false
- run-security: true/false
- severity-level: critical/high/medium/low/all

---

### SAST Scanning (CodeQL)

**Job:** `sast-scanning`  
**Triggers:** Conditional (RUN_SAST=true)  
**Status:** ✅ Implemented (T059)

Runs CodeQL static analysis for security vulnerabilities in JavaScript/TypeScript code.

**Execution:**

1. **Checkout code** with full depth for historical analysis
2. **Initialize CodeQL** with language matrix (JavaScript)
3. **Setup Node.js** and install dependencies
4. **Build** (optional, if npm build script exists)
5. **Perform CodeQL analysis** with security-focused query suite
6. **Upload SARIF** results for GitHub Security tab visualization
7. **Parse SARIF** to extract critical/high severity findings
8. **Report findings** to PR comment if critical issues detected

**Configuration Files:**

- `.github/codeql-config.yml` — CodeQL query configuration
- Queries: security-and-quality, security-extended

**Expected Runtime:** 2-5 minutes  
**GitHub Actions Minutes:** ~0.03-0.08 per run

**Failure Remediation:**

If CodeQL detects critical findings:

1. **Review Security tab** for detailed SARIF report
2. **Address findings** in code before merge
3. **Re-run workflow** after fixes to validate resolution
4. **Consult documentation:** [GitHub CodeQL Documentation](https://docs.github.com/en/code-security/codeql)

---

### Dependency Scanning

**Job:** `dependency-scanning`  
**Triggers:** Conditional (RUN_DEPS=true)  
**Status:** ✅ Implemented (T060)

Runs `npm audit` to detect known vulnerabilities in dependencies.

**Execution:**

1. **Checkout code** with npm package files
2. **Setup Node.js** and cache dependencies
3. **Install dependencies** with npm ci
4. **Run npm audit** with JSON output
5. **Parse results** for vulnerability counts by severity
6. **Extract metrics:** critical, high, medium, low counts
7. **Fail on critical** vulnerabilities
8. **Post findings** to PR comment with remediation guidance

**Expected Runtime:** 30-45 seconds  
**GitHub Actions Minutes:** ~0.01-0.02 per run

**Vulnerability Levels:**

- **Critical:** Must be fixed before merge
- **High:** Should be addressed; blocking for some policies
- **Medium:** Track and plan updates
- **Low:** Monitor and update when convenient

**Failure Remediation:**

If npm audit finds vulnerabilities:

1. **Review npm audit results:**

   ```bash
   npm audit
   ```

2. **Auto-fix available vulnerabilities:**

   ```bash
   npm audit fix
   ```

3. **Manually address** if auto-fix insufficient:

   ```bash
   # Update specific package
   npm update [package-name]
   # Or upgrade if major version needed
   npm install [package-name]@latest
   ```

4. **Commit** updated package-lock.json and re-run workflow

**Allowlist Known Issues:**

For accepted false positives or known issues, maintain a `.github/config/AUDIT_EXCEPTIONS.json` file documenting approved exceptions with expiration dates.

---

### License Compliance

**Job:** `license-compliance`  
**Triggers:** Conditional (RUN_LICENSE=true)  
**Status:** ✅ Implemented (T061)

Validates dependencies against project license allowlist.

**Execution:**

1. **Checkout code** and dependencies
2. **Setup Node.js** and install dependencies
3. **Get dependency list** with npm ls --json
4. **Load LICENSE_ALLOWLIST.json** from `.github/config/`
5. **Validate** each dependency against allowed/prohibited lists
6. **Check exceptions** for pre-approved licenses with expiration dates
7. **Generate compliance report**

**Configuration Files:**

- `.github/config/LICENSE_ALLOWLIST.json` — License whitelist/blacklist

**Allowlist Format:**

```json
{
  "allowed": [
    "MIT",
    "Apache-2.0",
    "ISC",
    "BSD-2-Clause",
    "BSD-3-Clause"
  ],
  "prohibited": [
    "GPL-3.0",
    "GPL-3.0-only",
    "AGPL-3.0"
  ],
  "exceptions": [
    {
      "package": "legacy-lib",
      "version": "2.0.0",
      "license": "GPL-2.0",
      "reason": "Approved for use; transitioning to MIT",
      "approved_by": "security@example.com",
      "expires": "2027-01-01"
    }
  ]
}
```

**Expected Runtime:** 10-20 seconds  
**GitHub Actions Minutes:** ~0.005-0.01 per run

**Compliance Remediation:**

If license compliance check fails:

1. **Review findings** in PR comment or artifact
2. **Options:**
   - Replace dependency with compliant alternative
   - Add exception to LICENSE_ALLOWLIST.json with justification
   - Negotiate license change with dependency maintainer

3. **Update allowlist** and commit changes

---

### Code Quality Metrics

**Job:** `code-quality-metrics`  
**Triggers:** Conditional (RUN_QUALITY=true)  
**Status:** ✅ Implemented (T062)

Collects code quality metrics for trend analysis and insights.

**Execution:**

1. **Checkout code** with full history
2. **Setup Node.js** and install dependencies
3. **Count JavaScript files** (JS/JSX/TS/TSX, excluding node_modules/dist/build)
4. **Calculate lines of code** metrics
5. **Collect complexity analysis** (if tools available)
6. **Generate quality report** in JSON and text formats
7. **Upload artifacts** for trend tracking

**Metrics Collected:**

- **Files:** Count of JavaScript/TypeScript source files
- **Lines of Code:** Total non-comment lines in codebase
- **Cyclomatic Complexity:** Code branching complexity score
- **Maintainability Index:** Overall code health (0-100)
- **Technical Debt:** Estimated effort to resolve quality issues

**Expected Runtime:** 1-2 minutes  
**GitHub Actions Minutes:** ~0.01-0.03 per run

**Artifact Retention:** 30 days (trend analysis)

**Quality Monitoring:**

Code quality is a **tracking gate** (reports but doesn't fail):

- Monitor trends over time
- Address regressions in maintenance windows
- Use for architectural planning and refactoring prioritization

---

### Security Policy Enforcement

**Job:** `security-policy`  
**Triggers:** Conditional (RUN_SECURITY=true)  
**Status:** ✅ Implemented (T063)

Validates presence and completeness of security governance documents.

**Execution:**

1. **Validate SECURITY.md** exists at repository root
2. **Check for required sections** (vulnerability reporting, disclosure timeline)
3. **Verify CODE_OF_CONDUCT.md** exists
4. **Check LICENSE file** present
5. **Generate security report** with validation checklist
6. **Post findings** to PR if issues detected

**Required Files:**

- `SECURITY.md` — Vulnerability reporting process (REQUIRED)
- `CODE_OF_CONDUCT.md` or `.github/CODE_OF_CONDUCT.md` — Community standards
- `LICENSE` or `LICENSE.md` — License information

**Expected Runtime:** 5-10 seconds  
**GitHub Actions Minutes:** ~0.001-0.002 per run

**Policy Remediation:**

If security policy validation fails:

1. **Create SECURITY.md** at repository root:

   ```markdown
   # Security Policy

   ## Reporting Security Vulnerabilities

   If you discover a security vulnerability, please email security@example.com
   instead of posting a public issue.

   Please include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if applicable)

   ## Responsible Disclosure

   We will acknowledge your report within 48 hours and provide a timeline
   for remediation.
   ```

2. **Add CODE_OF_CONDUCT.md** following [Contributor Covenant](https://www.contributor-covenant.org/)

3. **Ensure LICENSE file** is present and updated

---

### Quality Gates Metrics

**Job:** `quality-gates-metrics`  
**Triggers:** After all quality gate jobs  
**Status:** ✅ Implemented

Aggregates quality gate results and collects performance metrics.

**Composite Actions Integration:**

1. **collect-metrics:**
   - Workflow name: quality-gates
   - Metric type: all
   - Tracks GitHub Actions minutes consumption

2. **validate-check:**
   - Check name: quality-gates
   - Status evaluation: critical gates determine pass/fail
   - Summary includes all gate results and metrics
   - Posts to GitHub checks and PR comments

**Gate Classification:**

**Critical Gates (must pass):**

- SAST Scanning
- Dependency Scanning
- Security Policy

**Tracking Gates (monitor but don't fail):**

- License Compliance
- Code Quality Metrics

**Metrics Reported:**

- Individual gate status (success/failure/skipped)
- GitHub Actions minutes consumed
- Workflow run duration in seconds
- Workflow run ID for debugging

---

### Quality Gates Summary

**Job:** `quality-gates-summary`  
**Triggers:** Final job (depends on all quality gate jobs)  
**Status:** ✅ Implemented

Generates comprehensive quality gates run summary.

**Summary Includes:**

- SAST scanning result
- Dependency scanning result
- License compliance result
- Code quality metrics result
- Security policy result
- Metrics collection status

**Failure Criteria:**

- ❌ Workflow fails if: SAST = failure OR dependency = failure OR security = failure
- ℹ️ License/quality tracking failures don't block (advisory only)

**Success Message:**

```
Quality gates workflow completed
SAST scanning: success
Dependency scanning: success
License compliance: success
Code quality metrics: success
Security policy: success

✅ Quality gates workflow completed
```

---

## Manual Trigger (workflow_dispatch)

### Severity Selection

The workflow supports manual triggering with severity level filtering:

```
Inputs:
  severity: [critical | high | medium | low | all]
  default: high
```

**Examples:**

```bash
# Run all quality gates with default severity (high)
gh workflow run quality-gates.yml

# Run with critical severity only
gh workflow run quality-gates.yml -f severity=critical

# Run comprehensive scan (all severity levels)
gh workflow run quality-gates.yml -f severity=all
```

---

## Configuration Files

### CodeQL Configuration (.github/codeql-config.yml)

```yaml
queries:
  - security-and-quality
  - security-extended

query-filters:
  - exclude:
      - id: js/sql-injection
        reason: Framework handles escaping
```

### License Allowlist (.github/config/LICENSE_ALLOWLIST.json)

Canonical list of allowed and prohibited open source licenses with exception management.

### Environment Variables

No special environment variables required. All configuration is file-based.

---

## Performance Metrics

### Expected Runtimes

| Component | Duration | Minutes |
|-----------|----------|---------|
| Quality gates context | ~5 sec | 0.01 min |
| SAST scanning | 2-5 min | 0.03-0.08 min |
| Dependency scanning | 30-45 sec | 0.01-0.02 min |
| License compliance | 10-20 sec | 0.005-0.01 min |
| Code quality metrics | 1-2 min | 0.01-0.03 min |
| Security policy | 5-10 sec | 0.001-0.002 min |
| Metrics collection | ~5 sec | 0.01 min |
| **Total (parallel)** | ~5 min | ~0.15 min |

### Monthly Budget: TBD

**Estimated breakdown:**

- PR runs (50/month @ 0.1 min): 5 min
- Push runs (30/month @ 0.15 min): 4.5 min
- Scheduled runs (30/month @ 0.2 min): 6 min
- Manual runs (10/month @ 0.12 min): 1.2 min
- **Total estimated:** ~16.7 min/month

---

## Troubleshooting Guide

### CodeQL reports findings

**Symptom:** "❌ SAST scan identified security issues"

**Causes:**

1. Code contains SQL injection vulnerability
2. Unsafe use of user input
3. Insecure cryptography
4. Hardcoded secrets or credentials

**Solution:**

1. Review Security tab SARIF report for specific findings
2. Address vulnerabilities according to CodeQL guidance
3. Consult [GitHub CodeQL documentation](https://docs.github.com/en/code-security/codeql)
4. Re-run workflow to validate fix

---

### npm audit reports vulnerabilities

**Symptom:** "❌ Critical vulnerabilities detected"

**Causes:**

1. Direct dependency with known vulnerability
2. Transitive dependency with security issue
3. Outdated package version

**Solution:**

1. Review npm audit output in PR comment
2. Run locally: `npm audit`
3. Fix with: `npm audit fix`
4. Manual update if needed: `npm install package@latest`
5. Commit and push updated package-lock.json

---

### License compliance fails

**Symptom:** "❌ License compliance check failed"

**Causes:**

1. New dependency has prohibited license (e.g., GPL-3.0)
2. License changed in dependency update
3. Missing exception for legacy dependency

**Solution:**

1. Review compliance report for specific violations
2. Either:
   - Replace with compliant alternative
   - Add exception with documented justification
   - Update project license if acceptable
3. Commit changes and re-run workflow

---

### Security policy validation fails

**Symptom:** "❌ Security policy validation failed"

**Causes:**

1. SECURITY.md missing at repository root
2. CODE_OF_CONDUCT.md not found
3. LICENSE file missing

**Solution:**

1. Create/update missing governance documents
2. Ensure SECURITY.md contains vulnerability reporting process
3. Add CODE_OF_CONDUCT.md per Contributor Covenant
4. Verify LICENSE file is present and current
5. Commit and re-run workflow

---

## Related Documentation

- [Security Policy](./SECURITY.md) — Vulnerability reporting process
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) — Community standards
- [Composite Actions Reference](./COMPOSITE_ACTIONS.md) — validate-check, collect-metrics
- [Workflow Consolidation Mapping](./WORKFLOW_CONSOLIDATION_MAPPING.md) — Phase 2 overview
- [Performance Targets](./PERFORMANCE_TARGETS.md) — GitHub Actions budgets
- [Quality Gates Analysis](../specs/011-workflow-consolidation-phase-2/quality-gates-analysis.md) — Technical architecture

---

## Archive Reference

**Consolidated utilities:**

- SAST scanning (CodeQL analysis)
- Dependency scanning (npm audit)
- License compliance checking
- Code quality metrics collection
- Security policy enforcement

**Archive location:** `.github/workflows/archived/2026-09-11/security/`

---

*Last updated: 2026-09-17 | Phase 6 Implementation | Status: Quality gates jobs implemented with metrics collection*

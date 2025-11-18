---
title: 'CI/CD Pipeline Guide for Modular Shell Scripts'
version: '1.0.0'
last_updated: '2025-11-18'
author: 'LightSpeed WP Team'
description: 'Comprehensive guide for the modular shell scripts CI/CD pipeline'
tags: ['ci-cd', 'pipeline', 'automation', 'deployment', 'monitoring']
---

# CI/CD Pipeline Guide for Modular Shell Scripts

## Overview

This guide documents the comprehensive CI/CD pipeline implemented for LightSpeedWP's modular shell script
architecture. The pipeline ensures code quality, security, and reliability through automated testing, validation, and
deployment processes.

## Table of Contents

- [Pipeline Architecture](#pipeline-architecture)
- [Pipeline Stages](#pipeline-stages)
- [Scripts Reference](#scripts-reference)
- [Quality Gates](#quality-gates)
- [Deployment Process](#deployment-process)
- [Monitoring and Health Checks](#monitoring-and-health-checks)
- [Security Scanning](#security-scanning)
- [Troubleshooting](#troubleshooting)

## Pipeline Architecture

The CI/CD pipeline is implemented as a multi-stage GitHub Actions workflow with the following structure:

```text
┌─────────────────────────────────────────────────────────┐
│  Stage 1: Static Analysis & Validation                 │
│  - ShellCheck analysis                                  │
│  - Markdown & YAML linting                              │
│  - Basic quality metrics                                │
│  - Security pattern detection                           │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Stage 2: Testing                                       │
│  - Unit tests (Bats framework)                          │
│  - Integration tests                                    │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Stage 3: Quality Gates                                 │
│  - Evaluate metrics against thresholds                  │
│  - Generate quality reports                             │
│  - Deployment readiness check                           │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Stage 4: Documentation                                 │
│  - Auto-update README files                             │
│  - Update badges                                        │
│  - Commit documentation changes                         │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  Stage 5: Deployment Status                             │
│  - Report deployment status                             │
│  - Generate pipeline summary                            │
└─────────────────────────────────────────────────────────┘
```

## Pipeline Stages

### Stage 1: Static Analysis and Validation

The first stage performs comprehensive static analysis on all shell scripts:

#### ShellCheck Analysis

- Validates shell script syntax
- Detects common scripting errors
- Identifies potential bugs and code smells
- Reports critical issues and warnings

#### Linting

- **Markdown**: Validates documentation formatting
- **YAML**: Checks workflow and configuration files
- Ensures consistent formatting across the repository

#### Quality Metrics

- Calculates documentation completeness score
- Evaluates coding standards adherence
- Generates quality report

**Outputs:**

- `shellcheck-results.json`: Aggregated ShellCheck findings
- Quality score percentage
- Security issue count

### Stage 2: Testing

Executes comprehensive test suites using the Bats testing framework:

#### Unit Tests

- Tests individual script functions and includes
- Located in `tests/includes/`
- Run in parallel for efficiency

#### Integration Tests

- Tests interactions between components
- Located in `tests/integration/`
- Validates end-to-end workflows

**Test Execution:**

```bash
# Unit tests
bats tests/includes/**/*.bats --report-formatter junit

# Integration tests
bats tests/integration/**/*.bats --report-formatter junit
```

### Stage 3: Quality Gates

Quality gates ensure code meets minimum standards before deployment:

#### Gate Criteria

| Gate | Threshold | Weight | Description |
|------|-----------|--------|-------------|
| Code Quality | ≥ 80% | 25% | ShellCheck pass rate |
| Test Coverage | ≥ 70% | 30% | Includes with tests |
| Documentation | ≥ 75% | 20% | Scripts with full docs |
| Security | ≥ 90% | 15% | No critical issues |
| Performance | ≥ 70% | 10% | Optimized scripts |

**Overall Score Calculation:**

```text
Overall = (Code × 0.25) + (Test × 0.30) + (Docs × 0.20) + (Security × 0.15) + (Performance × 0.10)
```

Deployment proceeds only if:

- Overall score ≥ 80%
- No critical ShellCheck issues
- All tests pass

### Stage 4: Documentation

Automated documentation updates:

- Regenerates README files for changed components
- Updates badges (test coverage, quality score)
- Commits changes back to repository (on `develop` branch)

### Stage 5: Deployment Status

Final reporting stage:

- Generates comprehensive pipeline summary
- Reports deployment readiness
- Provides next steps

## Scripts Reference

### Deployment Scripts

Located in `scripts/deployment/`:

#### `deploy-to-staging.sh`

Deploys modular shell scripts to staging environment.

**Usage:**

```bash
./scripts/deployment/deploy-to-staging.sh [--dry-run] [--skip-backup]
```

**Options:**

- `--dry-run`: Simulate deployment without making changes
- `--skip-backup`: Skip backup creation (not recommended)

**Environment Variables:**

- `STAGING_PATH`: Deployment path (default: `/opt/lightspeed-wp/staging`)
- `BACKUP_RETENTION_DAYS`: Backup retention period (default: 30)

#### `automated-rollback.sh`

Automated rollback system for failed deployments.

**Usage:**

```bash
./scripts/deployment/automated-rollback.sh <environment> [reason]
```

**Arguments:**

- `environment`: Target environment (`staging` or `production`)
- `reason`: Optional reason for rollback

**Example:**

```bash
./scripts/deployment/automated-rollback.sh staging "Health check failed"
```

### Monitoring Scripts

Located in `scripts/monitoring/`:

#### `health-check.sh`

Post-deployment health checks.

**Usage:**

```bash
./scripts/monitoring/health-check.sh [--environment <env>] [--verbose] [--json]
```

**Checks Performed:**

- Script syntax validation
- File permissions
- Required includes presence
- Disk space availability
- Deployment metadata

**Exit Codes:**

- `0`: All checks passed
- `1`: One or more checks failed

#### `performance-check.sh`

Performance monitoring for deployed scripts.

**Usage:**

```bash
./scripts/monitoring/performance-check.sh [--environment <env>] [--benchmark]
```

**Metrics Collected:**

- System resource usage (CPU, memory)
- Script loading times
- File sizes
- Code complexity metrics

### Quality Scripts

Located in `scripts/maintenance/`:

#### `calculate-quality-score.sh`

Calculates comprehensive quality score.

**Usage:**

```bash
./scripts/maintenance/calculate-quality-score.sh [--output <file>] [--verbose]
```

**Output:**

Generates `quality-report.json` with:

- Component scores (code, tests, docs, security, performance)
- Overall score
- Quality gate pass/fail status

**Example Output:**

```json
{
  "timestamp": "2025-11-18T12:00:00Z",
  "project": "LightSpeedWP Modular Scripts",
  "scores": {
    "code_quality": 85,
    "test_coverage": 78,
    "documentation": 82,
    "security": 95,
    "performance": 88
  },
  "overall_score": 84,
  "quality_gates": {
    "overall_pass": true
  }
}
```

### Security Scripts

Located in `scripts/security/`:

#### `security-audit.sh`

Comprehensive security audit.

**Usage:**

```bash
./scripts/security/security-audit.sh [--strict] [--output <file>]
```

**Checks Performed:**

- Dangerous shell patterns (eval, piping curl to shell, etc.)
- Hardcoded credentials
- Insecure file permissions
- Unsafe command usage
- Security best practices

**Severity Levels:**

- 🔴 **CRITICAL**: Immediate action required
- 🟠 **HIGH**: Should be fixed soon
- 🟡 **MEDIUM**: Should be addressed
- 🟢 **LOW**: Consider improving

**Example:**

```bash
# Basic audit
./scripts/security/security-audit.sh

# Strict mode (fail on any issue)
./scripts/security/security-audit.sh --strict --output security-report.json
```

## Quality Gates

Quality gates are enforced at the pipeline level to ensure code quality:

### Code Quality Gate

- **Threshold**: 80%
- **Metric**: Percentage of scripts passing ShellCheck without errors
- **Action**: Block deployment if threshold not met

### Test Coverage Gate

- **Threshold**: 70%
- **Metric**: Percentage of includes with corresponding tests
- **Action**: Warn if threshold not met, block if coverage < 50%

### Documentation Gate

- **Threshold**: 75%
- **Metric**: Scripts with complete documentation headers
- **Action**: Warn if threshold not met

### Security Gate

- **Threshold**: 90%
- **Metric**: Scripts without security issues
- **Action**: Block deployment if critical/high issues found

## Deployment Process

### Staging Deployment

Triggered on:

- Push to `develop` branch
- Pull requests to `develop`
- Manual workflow dispatch

**Process:**

1. Run static analysis and tests
2. Evaluate quality gates
3. Create backup of current deployment
4. Deploy includes and scripts
5. Run validation tests
6. Register deployment in registry

### Production Deployment

Triggered on:

- Release published
- Manual workflow dispatch (with approval)

**Process:**

1. All staging deployment steps
2. Additional validation checks
3. Smoke tests on production environment
4. Health and performance monitoring
5. Automated rollback on failure

### Rollback Process

Automated rollback is triggered when:

- Post-deployment health checks fail
- Critical errors detected in monitoring
- Manual rollback requested

**Rollback Steps:**

1. Identify last successful deployment
2. Restore from backup
3. Verify rollback success
4. Update deployment registry
5. Notify team

## Monitoring and Health Checks

### Post-Deployment Monitoring

After deployment, the pipeline runs:

1. **Health Checks** (immediate)
   - Script syntax validation
   - File permissions check
   - Required files verification

2. **Performance Checks** (5 minutes after)
   - System resource usage
   - Script loading times
   - Response time benchmarks

3. **Continuous Monitoring** (ongoing)
   - Error log monitoring
   - Performance metrics tracking
   - Usage statistics

### Health Check Schedule

- **Immediate**: After each deployment
- **Daily**: 2 AM UTC (scheduled workflow)
- **On-Demand**: Via workflow dispatch

## Security Scanning

### Automated Security Scans

The pipeline includes multiple security checks:

#### Static Security Analysis

- Dangerous pattern detection
- Credential scanning
- Permission checks

#### Dependency Scanning

- npm audit for Node dependencies
- Checks for known vulnerabilities

#### Secret Scanning

- Scans for exposed secrets
- Validates .gitignore patterns
- Checks for sensitive file patterns

### Security Best Practices

1. **Never commit secrets**
   - Use environment variables
   - Leverage GitHub Secrets
   - Use .env files (gitignored)

2. **Follow principle of least privilege**
   - Minimal file permissions
   - Restrict sudo usage
   - Use read-only mounts when possible

3. **Validate all inputs**
   - Check user-provided arguments
   - Sanitize file paths
   - Validate environment variables

4. **Use security headers**
   - `set -euo pipefail` in all scripts
   - Proper error handling
   - Logging of security events

## Troubleshooting

### Common Issues

#### Pipeline Fails at Static Analysis

**Symptoms:** ShellCheck errors, critical issues found

**Solutions:**

1. Review ShellCheck output in workflow logs
2. Fix syntax errors and warnings
3. Run locally: `shellcheck scripts/**/*.sh`
4. Re-run workflow after fixes

#### Tests Fail

**Symptoms:** Test stage reports failures

**Solutions:**

1. Check test output for specific failures
2. Run tests locally:
   ```bash
   bats tests/includes/**/*.bats
   ```
3. Debug failing tests
4. Verify test environment setup

#### Quality Gates Fail

**Symptoms:** Quality gate stage reports threshold not met

**Solutions:**

1. Check quality score breakdown
2. Identify specific failing metrics
3. Run quality calculation locally:
   ```bash
   ./scripts/maintenance/calculate-quality-score.sh --verbose
   ```
4. Address low-scoring areas (docs, tests, etc.)

#### Deployment Fails

**Symptoms:** Deployment stage errors, rollback triggered

**Solutions:**

1. Check deployment logs for errors
2. Verify target environment is accessible
3. Ensure proper permissions and paths
4. Test deployment script locally with `--dry-run`
5. Review rollback logs if automatic rollback occurred

### Debug Mode

Enable verbose output in scripts:

```bash
# Deployment
./scripts/deployment/deploy-to-staging.sh --dry-run

# Health check
./scripts/monitoring/health-check.sh --verbose

# Quality score
./scripts/maintenance/calculate-quality-score.sh --verbose

# Security audit
./scripts/security/security-audit.sh --strict
```

### Getting Help

If issues persist:

1. Check [GitHub Discussions](https://github.com/lightspeedwp/.github/discussions)
2. Review workflow run logs in GitHub Actions
3. Consult [AGENTS.md](../AGENTS.md) for agent-specific guidance
4. Open an issue with:
   - Workflow run URL
   - Error messages
   - Steps to reproduce

## Maintenance

### Regular Maintenance Tasks

1. **Weekly**
   - Review quality score trends
   - Check for new ShellCheck warnings
   - Update dependencies

2. **Monthly**
   - Audit security scan results
   - Review and update documentation
   - Clean old deployment backups

3. **Quarterly**
   - Review and update quality thresholds
   - Evaluate pipeline performance
   - Update security best practices

## Future Enhancements

Planned improvements:

- [ ] Automated performance regression detection
- [ ] Integration with code review tools
- [ ] Advanced test coverage reporting
- [ ] Automated changelog generation
- [ ] Deployment preview environments
- [ ] Enhanced security scanning (SAST tools)
- [ ] Performance benchmarking across versions

## References

- [CLAUDE.md](../CLAUDE.md) - Claude agent guidance
- [AGENTS.md](../AGENTS.md) - Agent best practices
- [Custom Instructions](.github/custom-instructions.md) - Org-wide standards
- [ShellCheck Wiki](https://www.shellcheck.net/wiki/)
- [Bats Testing Framework](https://github.com/bats-core/bats-core)

---

**Last Updated**: 2025-11-18
**Version**: 1.0.0
**Maintainer**: LightSpeed WP Team

# Monitoring Scripts

Post-deployment monitoring and health check scripts for modular shell script infrastructure.

## Overview

This directory contains scripts for monitoring deployed shell scripts, performing health checks, and tracking
performance metrics.

## Scripts

### `health-check.sh`

Comprehensive post-deployment health checks.

**Usage:**

```bash
./health-check.sh [--environment <env>] [--verbose] [--json]
```

**Options:**

- `--environment <env>`: Target environment (`staging`, `production`, or `local`)
- `--verbose`: Enable verbose output
- `--json`: Output results in JSON format

**Checks Performed:**

- ✅ Script syntax validation
- ✅ File permissions verification
- ✅ Required includes presence
- ✅ Disk space availability
- ✅ Deployment metadata validation

**Exit Codes:**

- `0`: All health checks passed
- `1`: One or more health checks failed

**Example:**

```bash
# Check local environment
./health-check.sh

# Check staging with verbose output
./health-check.sh --environment staging --verbose

# Generate JSON report
./health-check.sh --json > health-report.json
```

### `performance-check.sh`

Performance monitoring and benchmarking.

**Usage:**

```bash
./performance-check.sh [--environment <env>] [--benchmark] [--json]
```

**Options:**

- `--environment <env>`: Target environment
- `--benchmark`: Run detailed benchmarks
- `--json`: Output results in JSON format

**Metrics Collected:**

- System resource usage (CPU, memory, disk I/O)
- Script loading times
- File sizes and code metrics
- Code complexity analysis

**Example:**

```bash
# Basic performance check
./performance-check.sh

# Detailed benchmark
./performance-check.sh --environment staging --benchmark

# JSON output for monitoring systems
./performance-check.sh --json > performance-metrics.json
```

## Health Check Details

### Script Syntax Check

Validates all shell scripts for syntax errors using `bash -n`:

```bash
bash -n script.sh
```

**Status:**

- ✅ Pass: All scripts have valid syntax
- ❌ Fail: One or more syntax errors found
- ⚠️  Warn: No scripts found to check

### File Permissions Check

Verifies that shell scripts have executable permissions:

```bash
test -x script.sh
```

**Status:**

- ✅ Pass: All scripts are executable
- ⚠️  Warn: Some scripts not executable
- ⚠️  Warn: No scripts found

### Required Includes Check

Ensures critical include files are present:

Required includes:

- `core/logging.sh`
- `core/validation.sh`
- `core/common-functions.sh`

**Status:**

- ✅ Pass: All required includes present
- ❌ Fail: One or more required includes missing

### Disk Space Check

Monitors disk usage for deployment directory:

**Thresholds:**

- ✅ `< 80%`: Healthy
- ⚠️  `80-90%`: Warning (approaching limit)
- ❌ `> 90%`: Critical

### Deployment Metadata Check

Validates deployment registry and metadata:

**Checks:**

- Deployment registry exists
- Registry is valid JSON
- Recent deployment recorded

## Performance Metrics

### System Resources

- **CPU Load Average**: 1-minute load average
- **Memory Usage**: Percentage of memory in use
- **Disk I/O**: Read/write statistics (if `iostat` available)

### Script Metrics

- **Loading Time**: Time to source/load each script
- **File Size**: Total and average script sizes
- **Lines of Code**: Total LOC and average per script
- **Function Count**: Total functions and average per script

### Benchmarking

When `--benchmark` is enabled:

- Individual script loading times
- Function call performance
- Detailed code complexity metrics

## Monitoring Schedule

### Automated Checks

Health checks run automatically:

- **Post-Deployment**: Immediately after each deployment
- **Daily**: 2 AM UTC (via scheduled workflow)
- **On-Demand**: Via workflow dispatch or manual execution

### Continuous Monitoring

Performance checks run:

- **Post-Deployment**: 5 minutes after deployment
- **Hourly**: During business hours
- **Daily**: Complete benchmark suite

## Integration with CI/CD

### Pipeline Integration

Health and performance checks integrate with the CI/CD pipeline:

```yaml
- name: Post-Deployment Health Check
  run: ./scripts/monitoring/health-check.sh --environment staging

- name: Performance Monitoring
  run: ./scripts/monitoring/performance-check.sh --environment staging
```

### Automated Alerts

Health check failures trigger:

1. Pipeline failure notification
2. Automated rollback (if critical)
3. Team notification (Slack, email, etc.)

## Health Status Levels

### Healthy ✅

All checks passed, system operating normally.

### Degraded ⚠️

Some non-critical issues detected:

- Low disk space warnings
- Non-executable scripts
- Missing optional components

System continues operating but should be investigated.

### Unhealthy ❌

Critical issues detected:

- Syntax errors in scripts
- Missing required components
- Critical disk space
- Failed validation tests

Immediate action required, may trigger rollback.

## JSON Output Format

Both scripts support JSON output for integration with monitoring systems:

```json
{
  "status": "healthy",
  "environment": "staging",
  "timestamp": "2025-11-18T12:00:00Z",
  "checks": {
    "passed": 5,
    "failed": 0,
    "warned": 0,
    "total": 5
  }
}
```

## Troubleshooting

### Health Check Fails

**Symptoms:** Exit code 1, "unhealthy" status

**Debug:**

```bash
./health-check.sh --verbose --environment staging
```

**Common Issues:**

1. Syntax errors in deployed scripts
2. Missing required includes
3. Incorrect file permissions
4. Disk space issues

### Performance Issues

**Symptoms:** Slow loading times, high resource usage

**Debug:**

```bash
./performance-check.sh --benchmark
```

**Common Causes:**

1. Large script files (> 1000 lines)
2. Inefficient code patterns
3. System resource constraints
4. Too many functions per script

## Best Practices

1. **Run health checks after every deployment**
   - Catch issues immediately
   - Prevent cascading failures

2. **Monitor trends over time**
   - Track performance metrics
   - Identify degradation early
   - Plan capacity upgrades

3. **Set up alerting**
   - Automated notifications on failures
   - Escalation for critical issues
   - Integration with monitoring tools

4. **Regular benchmarking**
   - Weekly performance baselines
   - Compare before/after deployments
   - Identify optimization opportunities

## See Also

- [CI/CD Pipeline Guide](../../docs/ci-cd-pipeline-guide.md)
- [Deployment Scripts](../deployment/README.md)
- [Security Scripts](../security/README.md)

---

**Version**: 1.0.0
**Last Updated**: 2025-11-18

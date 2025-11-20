# Security Scripts

Security audit and scanning tools for modular shell script infrastructure.

## Overview

This directory contains scripts for performing security audits, detecting vulnerabilities, and enforcing security best
practices in shell scripts.

## Scripts

### `security-audit.sh`

Comprehensive security audit for shell scripts.

**Usage:**

```bash
./security-audit.sh [--strict] [--output <file>] [--json]
```

**Options:**

- `--strict`: Fail on any security issue (default: warnings only)
- `--output <file>`: Output file for security report
- `--json`: Output results in JSON format

**Exit Codes:**

- `0`: No critical security issues found
- `1`: Critical security issues found (in strict mode)

**Example:**

```bash
# Basic audit with warnings
./security-audit.sh

# Strict mode (fail on any issue)
./security-audit.sh --strict

# Generate detailed report
./security-audit.sh --output security-report.json
```

## Security Checks

### 1. Dangerous Shell Patterns

Detects potentially dangerous shell patterns and practices:

#### Critical Issues 🔴

- **`eval` usage**: Code injection risk

  ```bash
  eval "$user_input"  # ❌ DANGEROUS
  ```

- **Piping curl/wget to shell**: Remote code execution risk

  ```bash
  curl https://example.com/script.sh | sh  # ❌ DANGEROUS
  wget -O- https://example.com/script.sh | bash  # ❌ DANGEROUS
  ```

- **Root filesystem deletion**: Catastrophic data loss risk

  ```bash
  rm -rf /  # ❌ EXTREMELY DANGEROUS
  ```

#### High Severity Issues 🟠

- **Dynamic sourcing with variables**: Code injection risk

  ```bash
  source "$user_provided_file"  # ⚠️ HIGH RISK
  ```

- **Overly permissive permissions**: Security risk

  ```bash
  chmod 777 sensitive-file.sh  # ⚠️ HIGH RISK
  ```

- **Hardcoded credentials**: Data exposure risk

  ```bash
  PASSWORD="secret123"  # ⚠️ HIGH RISK
  API_TOKEN="abc123xyz"  # ⚠️ HIGH RISK
  ```

#### Medium Severity Issues 🟡

- **Passwordless sudo**: Privilege escalation risk

  ```bash
  echo "user ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers  # ⚠️ MEDIUM RISK
  ```

### 2. Hardcoded Credentials

Scans for potential hardcoded sensitive data:

**Detected Patterns:**

- `password=`
- `passwd=`
- `pwd=`
- `secret=`
- `token=`
- `api_key=`
- `apikey=`
- `private_key=`

**Safe Alternatives:**

```bash
# ❌ Bad: Hardcoded
PASSWORD="mysecret"

# ✅ Good: Environment variable
PASSWORD="${PASSWORD:-}"

# ✅ Good: Read from secure source
PASSWORD=$(cat /run/secrets/password)

# ✅ Good: Prompt user
read -rsp "Enter password: " PASSWORD
```

### 3. Insecure File Permissions

Checks file permissions for security issues:

**Critical Issues:**

- World-writable files
- Sensitive files with world-readable permissions

**Example Issues:**

```bash
# ❌ World-writable script
chmod 777 script.sh

# ❌ Sensitive file readable by all
chmod 644 credentials.sh

# ✅ Secure permissions
chmod 750 script.sh
chmod 600 credentials.sh
```

### 4. Unsafe Command Usage

Detects usage of potentially dangerous commands:

- `dd`: Can destroy data if misused
- `mkfs`: Formats filesystems (data loss)
- `fdisk`: Disk partitioning (system damage)
- `parted`: Disk partitioning (system damage)

**Best Practice:**

Include warnings and confirmations before executing destructive operations.

### 5. Security Best Practices

Checks for security best practices:

#### Error Handling

```bash
# ❌ Missing error handling
#!/bin/bash

# ✅ Proper error handling
#!/bin/bash
set -euo pipefail
```

#### Shebang

```bash
# ❌ Missing shebang
echo "Hello"

# ✅ Proper shebang
#!/usr/bin/env bash
echo "Hello"
```

## Security Severity Levels

### 🔴 Critical

**Impact**: Immediate security risk, potential for severe damage

**Action**: Must be fixed immediately before deployment

**Examples:**

- Use of `eval` with user input
- Piping remote scripts to shell
- Root filesystem operations

### 🟠 High

**Impact**: Significant security risk, should be fixed ASAP

**Action**: Fix before production deployment

**Examples:**

- Hardcoded credentials
- Dynamic sourcing with variables
- Overly permissive file permissions

### 🟡 Medium

**Impact**: Moderate security concern

**Action**: Should be addressed in next update cycle

**Examples:**

- Passwordless sudo usage
- Missing input validation
- Insecure temporary file handling

### 🟢 Low

**Impact**: Minor security improvement opportunity

**Action**: Consider improving when possible

**Examples:**

- Missing `set -e`
- Missing shebang
- Lack of security documentation

## Security Report Format

### Human-Readable Output

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Security Audit Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Findings: 5

By Severity:
  🔴 Critical: 0
  🟠 High:     2
  🟡 Medium:   1
  🟢 Low:      2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### JSON Output

```json
{
  "timestamp": "2025-11-18T12:00:00Z",
  "project": "LightSpeedWP Modular Scripts",
  "findings": [
    {
      "severity": "HIGH",
      "file": "scripts/deploy.sh",
      "line": 42,
      "message": "Potential hardcoded credential detected",
      "pattern": "password="
    }
  ],
  "summary": {
    "total": 5,
    "critical": 0,
    "high": 2,
    "medium": 1,
    "low": 2
  }
}
```

## Integration with CI/CD

### Pipeline Integration

Security audits run automatically in the CI/CD pipeline:

```yaml
- name: Security Audit
  run: ./scripts/security/security-audit.sh --strict
```

### Quality Gates

Security findings affect quality gates:

- **Critical/High findings**: Block deployment
- **Medium findings**: Warning, deployment allowed
- **Low findings**: Informational only

## Security Best Practices

### 1. Input Validation

Always validate and sanitize inputs:

```bash
# ❌ Bad: No validation
file_path="$1"
rm -rf "$file_path"

# ✅ Good: Validated input
file_path="$1"

if [[ ! "$file_path" =~ ^[a-zA-Z0-9/_-]+$ ]]; then
    echo "Error: Invalid file path" >&2
    exit 1
fi

if [[ "$file_path" == /* ]] || [[ "$file_path" == *..* ]]; then
    echo "Error: Absolute paths and .. not allowed" >&2
    exit 1
fi

rm -rf "$file_path"
```

### 2. Secure File Operations

Use secure file handling:

```bash
# ❌ Bad: Predictable temp file
temp_file="/tmp/myapp.tmp"

# ✅ Good: Secure temp file
temp_file=$(mktemp) || exit 1
trap 'rm -f "$temp_file"' EXIT
```

### 3. Credential Management

Never hardcode credentials:

```bash
# ❌ Bad
DB_PASSWORD="hardcoded_secret"

# ✅ Good: Environment variable
DB_PASSWORD="${DB_PASSWORD:?Database password not set}"

# ✅ Good: Secrets file
if [[ -f /run/secrets/db_password ]]; then
    DB_PASSWORD=$(cat /run/secrets/db_password)
else
    echo "Error: Database password not found" >&2
    exit 1
fi
```

### 4. Principle of Least Privilege

Grant minimal necessary permissions:

```bash
# ❌ Bad: Overly permissive
chmod 777 script.sh

# ✅ Good: Restrictive permissions
chmod 750 script.sh  # Owner: rwx, Group: r-x, Others: none

# ✅ Good: Sensitive files
chmod 600 credentials.conf  # Owner: rw, Group: none, Others: none
```

### 5. Error Handling

Use strict error handling:

```bash
# ✅ Required header
#!/usr/bin/env bash
set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Optional: Better error messages
trap 'echo "Error on line $LINENO" >&2' ERR
```

## Automated Security Scanning

### Scheduled Scans

Security audits run:

- **Daily**: 2 AM UTC (scheduled workflow)
- **Pre-Deployment**: Before every deployment
- **On-Demand**: Via workflow dispatch

### Continuous Monitoring

- Real-time pattern detection in pull requests
- Automated security notifications
- Integration with security dashboards

## Remediation Guidelines

### For Critical Issues

1. **Immediate action required**
2. Block all deployments
3. Fix before proceeding
4. Re-run security audit
5. Document fix in changelog

### For High Issues

1. **Fix before production deployment**
2. May deploy to staging for testing
3. Track in issue tracker
4. Schedule fix within 1 week

### For Medium Issues

1. **Address in next sprint**
2. Safe to deploy with approval
3. Track in backlog
4. Review in security meeting

### For Low Issues

1. **Consider improvements**
2. No deployment blocking
3. Document in technical debt
4. Address when convenient

## Troubleshooting

### False Positives

If audit reports false positives:

1. Review finding context
2. Add suppression comment if justified:

   ```bash
   # shellcheck disable=SC2086
   # Security: Variable is controlled and safe here
   command $safe_variable
   ```

3. Document why pattern is safe
4. Consider refactoring for clarity

### Scan Failures

If security scan fails to run:

```bash
# Run manually with verbose output
./security-audit.sh --strict --output debug-report.json

# Check script permissions
ls -l security-audit.sh

# Verify dependencies
command -v jq || echo "jq not installed"
```

## See Also

- [CI/CD Pipeline Guide](../../docs/ci-cd-pipeline-guide.md)
- [Deployment Scripts](../deployment/README.md)
- [Monitoring Scripts](../monitoring/README.md)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [ShellCheck Wiki](https://www.shellcheck.net/wiki/)

---

**Version**: 1.0.0
**Last Updated**: 2025-11-18

---
title: 'Deployment Automation Scripts'
version: 'v1.0.0'
last_updated: '2025-11-18'
author: 'LightSpeed'
maintainer: 'Ash Shaw'
description: 'Automated deployment and rollback scripts for modular shell script components.'
tags: ['deployment', 'automation', 'ci-cd', 'staging', 'production', 'rollback']
type: 'documentation'
---

# Deployment Automation Scripts

This directory contains automated deployment and rollback scripts for managing modular shell script components across different environments.

## 📋 Overview

The deployment automation system provides:

- **Automated deployments** to staging and production environments
- **Quality validation** before deployment
- **Backup and rollback** capabilities
- **Deployment registry** tracking
- **Health check validation** post-deployment

## 🚀 Available Scripts

### deploy-to-staging.sh

Automated deployment script for staging environment.

**Usage:**

```bash
./deploy-to-staging.sh [--dry-run] [--skip-backup]
```

**Features:**

- Pre-deployment validation
- Automated backup creation
- Script syntax verification
- Post-deployment validation tests
- Deployment registry tracking

**Environment Variables:**

- `STAGING_PATH`: Target deployment path (default: `/opt/lightspeed-wp/staging`)
- `BACKUP_RETENTION_DAYS`: Backup retention period (default: 30 days)

### deploy-to-production.sh

Automated deployment script for production environment with enhanced safety checks.

**Usage:**

```bash
./deploy-to-production.sh [--dry-run] [--skip-backup] [--force]
```

**Arguments:**

- `--dry-run`: Simulate deployment without making changes
- `--skip-backup`: Skip backup creation (NOT RECOMMENDED for production)
- `--force`: Force deployment bypassing safety checks (use with extreme caution)

**Features:**

- Enhanced production safety checks
- Business hours validation
- Deployment approval verification
- Automated backup with extended retention
- Comprehensive syntax verification
- Post-deployment health checks
- Automatic rollback on failure
- Deployment registry tracking

**Environment Variables:**

- `PRODUCTION_PATH`: Target deployment path (default: `/opt/lightspeed-wp/production`)
- `BACKUP_RETENTION_DAYS`: Backup retention period (default: 90 days)
- `DEPLOYMENT_TIMEOUT`: Maximum deployment time in seconds (default: 600)

**Production Safety Checks:**

1. **Business Hours Validation**
   - Warns if deploying outside 6:01 AM - 10 PM
   - Can be overridden with `--force`

2. **Deployment Approval**
   - Checks for `.deployment-approved` file
   - Ensures authorized deployments only

3. **Recent Failure Check**
   - Detects failed deployments in last 24 hours
   - Requires resolution before proceeding

4. **Quality Gate Validation**
   - Verifies quality report exists
   - Confirms all quality gates passed
   - Validates security scan results

**Example Usage:**

```bash
# Standard production deployment
./deploy-to-production.sh

# Dry run to test deployment process
./deploy-to-production.sh --dry-run

# Emergency deployment (use with extreme caution)
./deploy-to-production.sh --force
```

### `automated-rollback.sh`

Automated rollback system for failed deployments.

**Usage:**

```bash
./automated-rollback.sh <environment> [reason]
```

**Arguments:**

- `environment`: Target environment (`staging` or `production`)
- `reason`: Optional reason for rollback

**Features:**

- Automatic backup restoration
- Deployment registry lookup
- Rollback verification
- Audit trail logging

## Deployment Workflow

```text
1. Validate deployment readiness
   - Check quality gates
   - Verify target environment
   - Validate script syntax

2. Create backup
   - Archive current deployment
   - Store in backups/ directory
   - Clean old backups

3. Deploy scripts
   - Copy includes
   - Copy utility scripts
   - Set permissions

4. Validate deployment
   - Run smoke tests
   - Verify key files
   - Check syntax

5. Register deployment
   - Update deployment registry
   - Log deployment details
```

## Deployment Registry

Deployments are tracked in `deployment-registry.json`:

```json
{
  "deployments": [
    {
      "environment": "staging",
      "deployment_id": "20251118-120000",
      "status": "success",
      "reason": "",
      "timestamp": "2025-11-18T12:00:00Z"
    }
  ]
}
```

## Rollback Process

When issues are detected:

1. Automated rollback triggered
2. Last successful deployment identified from registry
3. Backup restored from archives
4. Rollback verified through tests
5. Deployment registry updated

## Best Practices

1. **Always test in staging first**
   - Deploy to staging before production
   - Run comprehensive tests
   - Monitor for issues

2. **Never skip backups in production**
   - Backups enable quick rollback
   - Essential for disaster recovery

3. **Use dry-run for testing**
   - Test deployment scripts with `--dry-run`
   - Verify changes before applying

4. **Monitor post-deployment**
   - Run health checks immediately
   - Monitor logs for errors
   - Track performance metrics

## Environment Setup

### Staging Environment

```bash
export STAGING_PATH="/opt/lightspeed-wp/staging"
export BACKUP_RETENTION_DAYS=30
```

### Production Environment

```bash
export PRODUCTION_PATH="/opt/lightspeed-wp/production"
export BACKUP_RETENTION_DAYS=90
```

## Troubleshooting

### Deployment Fails

**Check:**

1. Target environment accessibility
2. File permissions
3. Disk space availability
4. Script syntax validity

**Debug:**

```bash
./deploy-to-staging.sh --dry-run
```

### Rollback Fails

**Check:**

1. Backup file existence
2. Backup file integrity
3. Target directory permissions
4. Deployment registry validity

## See Also

- [CI/CD Pipeline Guide](../../docs/ci-cd-pipeline-guide.md)
- [Monitoring Scripts](../monitoring/README.md)
- [Security Scripts](../security/README.md)

---

**Version**: 1.0.0
**Last Updated**: 2025-11-18

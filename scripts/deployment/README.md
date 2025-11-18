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
./scripts/deployment/deploy-to-staging.sh
```

**Environment Variables:**

- `STAGING_PATH`: Path to staging deployment directory (default: `./staging-deploy`)

**Features:**

- Pre-deployment validation
- Automatic backup creation
- Includes and scripts deployment
- Post-deployment validation tests
- Deployment registry updates

**Exit Codes:**

- `0`: Deployment successful
- `1`: Deployment failed (validation, deployment, or tests)

### automated-rollback.sh

Automated rollback script for failed deployments.

**Usage:**

```bash
./scripts/deployment/automated-rollback.sh <environment> [reason]
```

**Arguments:**

- `environment`: Target environment (staging|production)
- `reason`: Optional reason for rollback (default: "Automated rollback triggered")

**Examples:**

```bash
# Rollback staging environment
./scripts/deployment/automated-rollback.sh staging

# Rollback with custom reason
./scripts/deployment/automated-rollback.sh staging "Failed health check"
```

**Environment Variables:**

- `STAGING_PATH`: Path to staging deployment (default: `./staging-deploy`)
- `PRODUCTION_PATH`: Path to production deployment (default: `./production-deploy`)

**Features:**

- Retrieves last successful deployment
- Restores from backup
- Validates rollback success
- Updates deployment registry
- Environment-specific rollback procedures

**Exit Codes:**

- `0`: Rollback successful
- `1`: Rollback failed (no backup, restore failed, or validation failed)

## 📊 Deployment Registry

The deployment registry (`deployment-registry.json`) tracks all deployments and rollbacks.

**Structure:**

```json
{
    "deployments": [
        {
            "environment": "staging",
            "deployment_id": "20251118-143022",
            "status": "success",
            "timestamp": "2025-11-18T14:30:22Z",
            "reason": ""
        }
    ],
    "rollbacks": [
        {
            "environment": "staging",
            "deployment_id": "20251118-120000",
            "status": "rollback",
            "timestamp": "2025-11-18T14:35:00Z",
            "reason": "Failed health check"
        }
    ]
}
```

## 🔍 Deployment Process

### Staging Deployment Flow

1. **Validation**
   - Check quality gates pass
   - Verify scripts directory exists
   - Validate deployment readiness

2. **Backup**
   - Create timestamped backup of current deployment
   - Store in `backups/staging-<deployment_id>/`

3. **Deployment**
   - Deploy includes to `$STAGING_PATH/includes/`
   - Deploy scripts to `$STAGING_PATH/scripts/`
   - Set appropriate permissions

4. **Validation**
   - Run post-deployment tests
   - Verify file counts and structure
   - Check script syntax

5. **Registry**
   - Update deployment registry
   - Record deployment ID and status

### Rollback Flow

1. **Lookup**
   - Query deployment registry
   - Find last successful deployment

2. **Restore**
   - Remove current deployment
   - Restore from backup directory

3. **Validation**
   - Run health checks
   - Verify deployment structure

4. **Registry**
   - Record rollback in registry
   - Include reason and timestamp

## 🛡️ Safety Features

### Pre-Deployment Validation

- **Quality gates check**: Ensures code meets quality standards
- **Directory validation**: Confirms required directories exist
- **Readiness check**: Validates all prerequisites

### Backup Management

- **Automatic backups**: Created before every deployment
- **Timestamped**: Unique backup per deployment
- **Persistent**: Retained for rollback capability

### Post-Deployment Validation

- **File count verification**: Ensures files deployed
- **Structure validation**: Confirms directory layout
- **Syntax checking**: Validates shell script syntax

### Rollback Protection

- **Backup verification**: Confirms backup exists before rollback
- **Health checks**: Validates environment after rollback
- **Registry tracking**: Maintains rollback history

## 📝 Integration with CI/CD

These scripts integrate with the **[modular-scripts-pipeline.yml](../../.github/workflows/modular-scripts-pipeline.yml)** workflow:

### Stage 5: Documentation and Deployment

The pipeline calls `deploy-to-staging.sh` when:

- Quality gates pass
- Security scans complete
- All tests succeed
- Target branch is `develop` or manual dispatch

### Rollback Triggers

The `automated-rollback.sh` script can be triggered:

- Manually via workflow dispatch
- Automatically on failed health checks
- On-demand for incident response

## 🔧 Customization

### Environment-Specific Configuration

Create environment-specific deployment scripts:

```bash
# deploy-to-production.sh
#!/bin/bash
PRODUCTION_PATH="/opt/lightspeed-wp/production"
source deploy-to-staging.sh
# Override functions as needed
```

### Custom Validation

Add custom validation functions:

```bash
# In deploy-to-staging.sh
custom_validation() {
    # Your custom validation logic
    return 0
}
```

### Extended Rollback Logic

Extend rollback capabilities:

```bash
# In automated-rollback.sh
notify_rollback() {
    # Send notifications
    # Update external systems
}
```

## 📊 Monitoring and Metrics

### Deployment Metrics

Track deployment success rates:

```bash
jq '.deployments | map(select(.status == "success")) | length' deployment-registry.json
```

### Rollback Frequency

Monitor rollback occurrences:

```bash
jq '.rollbacks | length' deployment-registry.json
```

### Deployment History

View recent deployments:

```bash
jq '.deployments | sort_by(.timestamp) | reverse | .[0:5]' deployment-registry.json
```

## 🔗 Related Resources

- **[Modular Scripts Pipeline](../../.github/workflows/modular-scripts-pipeline.yml)** - CI/CD workflow
- **[Quality Score Calculator](../maintenance/calculate-quality-score.sh)** - Quality metrics
- **[CI/CD Instructions](../../.github/instructions/ci-cd.instructions.md)** - Best practices

## ⚠️ Important Notes

1. **Backup Management**: Backups accumulate over time - implement cleanup policy
2. **Registry Size**: Deployment registry grows indefinitely - consider archiving old entries
3. **Environment Variables**: Set appropriate paths for production deployments
4. **Permissions**: Ensure scripts have execute permissions (`chmod +x`)
5. **Dependencies**: Requires `jq` for JSON processing

## 📚 Examples

### Manual Staging Deployment

```bash
# Navigate to repository root
cd /path/to/repository

# Run deployment
./scripts/deployment/deploy-to-staging.sh
```

### Rollback After Failed Deployment

```bash
# Rollback staging
./scripts/deployment/automated-rollback.sh staging "Deployment validation failed"

# Check rollback status
echo $?
```

### Check Deployment Registry

```bash
# View all deployments
cat deployment-registry.json | jq '.deployments'

# Get last successful deployment
jq -r '.deployments[] | select(.status == "success") | .deployment_id' deployment-registry.json | tail -1
```

---

For issues or questions about deployment automation, consult the [CI/CD instructions](../../.github/instructions/ci-cd.instructions.md) or open an issue with the `area:ci` label.

---
title: "Reporting Agent v2 Phase 5.2: Admin & Operations Guide"
description: "Production deployment, monitoring, scaling, and incident runbooks for Reporting Agent v2"
file_type: "operations"
created_date: "2026-09-04"
last_updated: "2026-09-04"
owners:
  - LightSpeed Operations
status: active
tags:
  - operations
  - deployment
  - monitoring
  - runbook
domain: infrastructure
language: en
---

# Reporting Agent v2 Phase 5.2: Admin & Operations Guide

Operational documentation for production deployment, monitoring, scaling, and incident management of Reporting Agent v2.

## Quick Start

- **Deployment**: See [Deployment Checklist](#deployment-checklist)
- **Configuration**: See [Configuration Guide](#configuration-guide)
- **Monitoring**: See [Monitoring & Alerting](#monitoring--alerting)
- **Troubleshooting**: See [Incident Runbook](#incident-runbook)

---

## Deployment Checklist

Complete the following before deploying Reporting Agent v2 to production:

### Pre-Deployment

- [ ] Review and test all configuration files in staging
- [ ] Verify GitHub token permissions (repo: read, workflow: read)
- [ ] Validate database connectivity and credentials
- [ ] Confirm backup strategy for report storage
- [ ] Run full integration test suite against staging GitHub org
- [ ] Document deployment date and version in operations log

### Deployment Steps

1. **Prepare environment**
   - [ ] Verify all environment variables are set correctly
   - [ ] Confirm secrets are loaded from secure storage (not hardcoded)
   - [ ] Validate database migration scripts have run successfully

2. **Deploy application**
   - [ ] Pull latest tagged release from repository
   - [ ] Install dependencies: `npm ci --production`
   - [ ] Run database migrations: `npm run migrate:latest`
   - [ ] Start service: `npm run start:production`

3. **Verify deployment**
   - [ ] Health check endpoint returns 200 OK
   - [ ] First scheduled report executes without errors
   - [ ] Logs show successful metrics collection
   - [ ] Report artifacts appear in configured storage location

4. **Post-deployment**
   - [ ] Enable monitoring and alerting for new deployment
   - [ ] Document deployment in team communication channel
   - [ ] Notify stakeholders of production status change

### Rollback Procedure

If deployment fails:

```bash
# Revert to previous version
git checkout <previous-version-tag>
npm ci --production
npm run migrate:rollback
npm run start:production
```

---

## Configuration Guide

### Environment Variables

| Variable | Purpose | Example | Required |
| --- | --- | --- | --- |
| `GITHUB_TOKEN` | GitHub API authentication | `ghp_...` | ✓ |
| `GITHUB_ORG` | Target GitHub organization | `lightspeedwp` | ✓ |
| `REPORT_STORAGE_TYPE` | Where to store reports | `github-discussions` | ✓ |
| `REPORT_STORAGE_PATH` | Storage location or discussion URL | `repo/discussions/123` | ✓ |
| `LOG_LEVEL` | Logging verbosity | `info` | (default: `info`) |
| `CACHE_TTL_MINUTES` | In-memory cache duration | `30` | (default: `30`) |
| `RATE_LIMIT_BUFFER` | GitHub API safety margin (%) | `20` | (default: `20`) |
| `ENABLE_DRY_RUN` | Test mode (no writes) | `false` | (default: `false`) |

### Secrets Management

Store sensitive values in your platform's secrets manager:

```bash
# Example: GitHub Actions Secrets
GITHUB_TOKEN              # GitHub API token with repo:read, workflow:read
DATABASE_PASSWORD         # PostgreSQL connection password (if applicable)
SLACK_WEBHOOK_URL        # Slack notifications (optional)
PAGERDUTY_API_KEY        # PagerDuty integration (optional)
```

**Never commit secrets to version control.** Use environment-specific `.env` files in `.gitignore`:

```bash
# .gitignore
.env
.env.local
.env.*.local
```

### Rate Limit Controls

Reporting Agent v2 includes built-in rate limiting to prevent GitHub API quota exhaustion:

| Setting | Default | Purpose |
| --- | --- | --- |
| `RATE_LIMIT_BUFFER` | 20% | Reserve this % of quota as safety margin |
| `MAX_CONCURRENT_REQUESTS` | 5 | Parallel GitHub API calls |
| `BACKOFF_MULTIPLIER` | 2 | Exponential backoff factor on rate limit |
| `MAX_RETRY_ATTEMPTS` | 3 | Retry failed requests this many times |

**Monitoring quota:**

```javascript
// Check current quota usage
const quota = await agent.getGitHubQuota();
console.log(`Used: ${quota.used} / ${quota.limit}`);
console.log(`Reset at: ${quota.resetAt.toISOString()}`);
```

---

## Monitoring & Alerting

### Health Checks

Enable health check endpoint for monitoring:

```bash
# GET /health
# Returns: { status: "healthy", uptime: 3600, lastRun: "2026-09-04T10:00:00Z" }
```

### Key Metrics to Monitor

| Metric | Threshold | Action |
| --- | --- | --- |
| Workflow failure rate | >10% per day | Investigate cause, check logs for errors |
| GitHub API quota usage | >80% | Reduce report frequency or expand quota |
| Report generation time | >5 minutes | Optimize query filters or increase concurrency |
| Cache hit rate | <50% | Review cache TTL configuration |
| Schedule drift (actual vs expected) | >30 seconds | Check system clock and scheduler health |

### Alert Rules

| Alert | Trigger | Action |
| --- | --- | --- |
| Workflow failure | 2 consecutive failed runs | Page maintainer and pause scheduled runs |
| Quota exhaustion | Usage >90% | Trigger rate-limit backoff, notify team |
| Report delivery failure | 3 consecutive delivery failures | Check storage backend, verify credentials |
| High error rate | >20% of requests fail | Investigate GitHub API status, check network |
| Schedule missed | Report did not run at scheduled time | Verify cron configuration and system clock |

### Alerting Channels

Configure alert destinations:

```javascript
// Slack notifications
{
  channels: {
    errors: '#reporting-agent-alerts',
    warnings: '#reporting-agent-warnings',
    info: '#reporting-agent-info'
  },
  webhook: process.env.SLACK_WEBHOOK_URL
}

// PagerDuty integration (optional)
{
  pagerduty: {
    enabled: true,
    apiKey: process.env.PAGERDUTY_API_KEY,
    serviceId: 'reporting-agent-prod'
  }
}
```

---

## Scaling Considerations

### Horizontal Scaling (Multiple Instances)

For organizations with >50 repositories:

1. **Deploy multiple instances** with different report scopes:
   - Instance A: Repositories A-M
   - Instance B: Repositories N-Z
   
2. **Use shared storage** for report aggregation:
   - GitHub Discussion (recommended)
   - S3 bucket with cross-instance access
   - PostgreSQL with concurrent write handling

3. **Distribute scheduled runs**:
   ```cron
   # Instance A: odd hours
   0 1,3,5,7,9,11,13,15,17,19,21,23 * * *
   
   # Instance B: even hours
   0 0,2,4,6,8,10,12,14,16,18,20,22 * * *
   ```

### Vertical Scaling (Single Instance)

For <50 repositories:

1. **Increase memory allocation**:
   - Cache size: `NODE_OPTIONS=--max-old-space-size=4096`
   - Connection pool: `MAX_DB_CONNECTIONS=20`

2. **Optimize queries**:
   - Use `created:>YYYY-MM-DD` filters in GitHub queries
   - Limit result sets with `per_page=100`
   - Paginate efficiently with cursor-based pagination

3. **Tune concurrency**:
   - `MAX_CONCURRENT_REQUESTS=10` (increase if quota available)
   - `BATCH_SIZE=50` (batch API requests)

---

## Incident Runbook

### Symptom: Reports Not Generating

**Investigation:**

```bash
# 1. Check recent logs
docker logs reporting-agent-prod | tail -100

# 2. Verify GitHub token is valid
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/user \
  -I | grep "Status:"

# 3. Check rate limit status
node scripts/check-quota.js

# 4. Verify cron is running
ps aux | grep reporting-agent
```

**Resolution:**

- **Invalid token**: Regenerate GitHub token, update secrets
- **Rate limit hit**: Enable dry-run mode and wait for quota reset
- **Process crashed**: Check system resources (disk, memory, CPU)
- **Wrong timezone**: Verify system `date` and cron timezone

### Symptom: Report Storage Failures

**Investigation:**

```bash
# 1. Verify storage backend is accessible
# For GitHub Discussions:
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/lightspeedwp/.github/discussions/123

# For S3:
aws s3 ls s3://reporting-agent-prod/reports/

# 2. Check storage credentials
echo $REPORT_STORAGE_PATH
```

**Resolution:**

- **GitHub Discussion not found**: Verify discussion ID in config
- **S3 access denied**: Check IAM role permissions and access keys
- **Disk full (local storage)**: Archive old reports and free disk space

### Symptom: High CPU/Memory Usage

**Investigation:**

```bash
# Monitor resource usage
top -p $(pgrep -f "reporting-agent")

# Check for memory leaks
node --inspect scripts/check-leaks.js
```

**Resolution:**

- **Memory leak**: Restart service and check for unclosed connections
- **Large report**: Split into smaller scopes (by team, by repository)
- **High concurrency**: Reduce `MAX_CONCURRENT_REQUESTS` to 3-5

### Symptom: GitHub API Errors (403, 429, 500)

| Status | Cause | Action |
| --- | --- | --- |
| 403 | Token lacks permissions | Add `repo:read`, `workflow:read` scopes |
| 429 | Rate limit exceeded | Wait for reset (check `X-RateLimit-Reset` header) |
| 500 | GitHub service error | Retry with exponential backoff, monitor GitHub status |
| 503 | GitHub maintenance | Wait, no action needed |

---

## Performance Tuning

### Query Optimization

```javascript
// BAD: Fetches all issues (high quota cost)
const issues = await github.rest.issues.listForRepo({
  owner, repo,
  per_page: 100
});

// GOOD: Filter by date and limit (low quota cost)
const issues = await github.rest.issues.listForRepo({
  owner, repo,
  created: '>2026-08-01',
  per_page: 50,
  page: 1
});
```

### Caching Strategy

- **GitHub metadata** (30 minutes): Repos, workflows, teams
- **Metrics data** (5 minutes): Issue/PR counts, contributor activity
- **Reports** (never, re-generate on demand): Final outputs

Clear cache on deploy:

```bash
npm run cache:clear
```

---

## Support & Escalation

### Support Channels

- **Slack**: #reporting-agent-support (LightSpeed team)
- **GitHub Issues**: lightspeedwp/.github/issues (label: `area:reporting-agent`)
- **On-call**: Page maintainer via PagerDuty on critical failures

### Maintenance Windows

Schedule maintenance to avoid report generation:

```
Tuesday 02:00-03:00 UTC
(After weekly reports, before next run)
```

### Documentation

- **User guide**: See README in project folder
- **API reference**: `docs/REPORTING_AGENT_V2_API.md`
- **Architecture**: `.github/projects/active/reporting-agent-v2-multirepository-2026-08-12/README.md`

---

## Checklist: Ready for Production

- [ ] All environment variables configured
- [ ] Secrets loaded from secure storage
- [ ] Health check endpoint verified
- [ ] Monitoring and alerting enabled
- [ ] Backup and recovery procedures documented
- [ ] Team trained on incident response
- [ ] Runbook accessible to on-call staff
- [ ] Deployment documented with version/date

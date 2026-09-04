---
file_type: documentation
title: "Reporting Agent v2 Phase 5.2 — Admin & Operations Guide"
description: "Production deployment, configuration, monitoring, scaling, and incident response guide for Reporting Agent v2."
version: "v1.0"
last_updated: "2026-09-04"
owners: ["LightSpeed Team"]
tags: ["reporting", "operations", "deployment", "monitoring", "incident-response", "scaling"]
status: "active"
stability: "production"
domain: "governance"
audience: ["site-reliability-engineers", "operations-engineers", "platform-maintainers", "incident-responders"]
---

# Reporting Agent v2 Phase 5.2 — Admin & Operations Guide

This guide covers production deployment, operational configuration, monitoring, scaling, and incident response for Reporting Agent v2. It is written for platform maintainers, site reliability engineers, and operations teams responsible for running Reporting Agent v2 in production environments.

The guide provides actionable checklists, operational procedures, monitoring configurations, scaling strategies, and runbooks for common incidents. All guidance assumes production deployment targets and compliance with LightSpeed operational standards.

## Table of Contents

- [1. Overview](#1-overview)
- [2. Deployment Checklist](#2-deployment-checklist)
- [3. Configuration Guide](#3-configuration-guide)
- [4. Monitoring and Alerting](#4-monitoring-and-alerting)
- [5. Scaling Considerations](#5-scaling-considerations)
- [6. Incident Runbook](#6-incident-runbook)
- [7. Performance Tuning](#7-performance-tuning)
- [8. Backup and Recovery](#8-backup-and-recovery)
- [9. Security and Access Control](#9-security-and-access-control)
- [10. Operational Checklists](#10-operational-checklists)

---

## 1. Overview

Reporting Agent v2 Phase 5.2 introduces production-ready operational tooling for:

- **Deterministic multi-repository support** with configurable rate limiting
- **Session caching** for predictable performance under load
- **Portable npm packaging** for cross-environment deployments
- **Comprehensive observability** for production monitoring
- **Incident detection and recovery** procedures

This guide ensures consistent operational behaviour across development, staging, and production environments.

### 1.1 Operational Scope

**In Scope:**
- Environment setup and prerequisites
- Configuration management (env vars, secrets, rate limits)
- Monitoring signals, alerting, and dashboards
- Horizontal and vertical scaling strategies
- Incident detection, triage, and recovery
- Backup and disaster recovery procedures
- Security hardening and access control

**Out of Scope:**
- Application-level feature configuration
- User authentication and authorization flows
- Report content schema changes
- Custom metric definitions

---

## 2. Deployment Checklist

### 2.1 Pre-Deployment Validation

Complete these checks before deploying to any environment:

**Environment Prerequisites:**

- [ ] Node.js 24+ runtime available
- [ ] npm 10+ package manager available
- [ ] Git 2.30+ for repository operations
- [ ] 2 GB minimum disk space for caches and temporary files
- [ ] 512 MB minimum available memory
- [ ] Network egress to GitHub.com (443/HTTPS) unblocked
- [ ] Network egress to configured metric collection endpoints unblocked

**Repository Configuration:**

- [ ] `.github/` directory structure in place
- [ ] `agents/metadata-agent/` portable module copied to target repository
- [ ] Environment variables file (`.env.production`) created and secured
- [ ] SSH or HTTPS credentials configured for multi-repository access
- [ ] Repository SSH keys or GitHub App credentials validated (see §3)

**Dependency Validation:**

```bash
# Verify Node.js version
node --version  # Expected: v24.x.x or higher

# Verify npm installation
npm --version   # Expected: 10.x.x or higher

# Install dependencies
npm ci --production

# Validate package integrity
npm audit --audit-level=moderate

# Test package availability
npm list @lightspeedwp/metadata-agent
```

**Access Validation:**

- [ ] Service account has read access to all monitored repositories
- [ ] Rate limit allocation verified with GitHub API (see §3.2)
- [ ] Token rotation schedule established (every 90 days minimum)
- [ ] Backup credentials stored securely for failover scenarios

### 2.2 Staging Deployment

Deploy to staging before production to validate configuration:

```bash
# Set staging environment
export NODE_ENV=staging
export LOG_LEVEL=debug

# Install from npm registry
npm ci @lightspeedwp/metadata-agent@latest

# Run validation suite
npm run validate:agent-config
npm run test:integration:staging

# Test multi-repository access
npm run test:repositories -- --target staging

# Verify cache functionality
npm run test:cache -- --target staging

# Check rate limiting
npm run test:rate-limits -- --target staging

# Verify output artifacts
npm run test:outputs -- --target staging
```

**Staging Validation Results:**

- [ ] All integration tests pass (green CI)
- [ ] Configuration validation succeeds with no warnings
- [ ] Rate limiting behaves as configured
- [ ] Output artifacts are valid and well-formed
- [ ] Performance metrics are within acceptable ranges (see §7)
- [ ] No errors in observability/logging pipelines

### 2.3 Production Deployment

Once staging validation completes, proceed to production deployment:

```bash
# Pre-deployment snapshot
git describe --tags --always  # Document deployment version
npm list --production         # Log installed versions

# Install to production
NODE_ENV=production npm ci --production --omit=dev

# Verify configuration
NODE_ENV=production npm run validate:agent-config

# Run smoke tests
NODE_ENV=production npm run test:smoke

# Start agent service
NODE_ENV=production npm start

# Monitor initial startup
NODE_ENV=production npm run monitor:startup -- --wait 300s
```

**Post-Deployment Verification:**

- [ ] Service starts without errors
- [ ] Initial reports generated successfully
- [ ] Monitoring data flowing to collection endpoints
- [ ] No elevated error rates (< 1% for 5 minutes)
- [ ] Rate limiting active and functioning
- [ ] Cache hit rates normal (> 80% for repeated repos)

### 2.4 Deployment Rollback

If deployment fails post-validation, execute rollback immediately:

```bash
# Determine previous working version
git log --oneline -n 5 | grep "deploy"

# Rollback to previous commit
git checkout <previous-stable-commit>

# Reinstall previous version
npm ci --production

# Restart service
NODE_ENV=production npm start

# Verify rollback
npm run monitor:health -- --duration 300s
```

**Rollback Verification:**

- [ ] Previous version starts without errors
- [ ] Reports generate successfully
- [ ] Monitoring shows normal operation
- [ ] No data loss detected in caches or outputs

---

## 3. Configuration Guide

### 3.1 Environment Variables

Reporting Agent v2 is configured entirely via environment variables. Create `.env.production` with the following:

**Required Variables:**

```bash
# Node.js environment
NODE_ENV=production
LOG_LEVEL=info

# GitHub API Configuration
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_API_URL=https://api.github.com
GITHUB_REPOSITORIES=org/repo1,org/repo2,org/repo3

# Rate Limiting
GITHUB_RATE_LIMIT_CORE=60
GITHUB_RATE_LIMIT_SEARCH=10
GITHUB_RATE_LIMIT_GRAPHQL=5000

# Caching
CACHE_STRATEGY=redis
CACHE_TTL_SECONDS=3600
CACHE_MAX_SIZE_MB=1024
CACHE_COMPRESSION=gzip

# Output Configuration
OUTPUT_DIR=.github/reports/metadata-agent
OUTPUT_FORMAT=json+markdown
OUTPUT_TIMESTAMP=true

# Monitoring
MONITORING_ENABLED=true
METRICS_ENDPOINT=https://metrics.example.com/api/v1/metrics
METRICS_BATCH_SIZE=100
METRICS_FLUSH_INTERVAL_MS=5000
```

**Optional Variables:**

```bash
# Debug and Tracing
DEBUG=reporting-agent:*
TRACE_ENABLED=true
TRACE_SAMPLE_RATE=0.1

# SSH Configuration (for self-hosted git)
SSH_KEY_PATH=/home/agent/.ssh/id_rsa
SSH_KNOWN_HOSTS_PATH=/home/agent/.ssh/known_hosts

# Proxy Configuration
HTTPS_PROXY=http://proxy.example.com:8080
NO_PROXY=localhost,127.0.0.1,internal.example.com

# Performance Tuning
CONCURRENCY_LIMIT=5
TIMEOUT_REPO_MS=30000
TIMEOUT_API_MS=10000
TIMEOUT_CACHE_MS=5000

# Notification Configuration
ALERT_WEBHOOK_URL=https://hooks.slack.com/services/xxx
ALERT_EMAIL_TO=ops-team@example.com
ALERT_ON_ERROR_RATE=true
ALERT_ERROR_THRESHOLD_PCT=5
```

### 3.2 Secret Management

**GitHub Token Generation:**

1. Create personal access token (classic) at https://github.com/settings/tokens/new
2. Grant scopes: `repo:status`, `repo_deployment`, `public_repo`, `read:repo_hook`
3. Store in secure vault (Secrets Manager, HashiCorp Vault, etc.)
4. Rotate every 90 days minimum
5. Maintain backup token for failover

**Alternative: GitHub App:**

For higher rate limits and better security, use a GitHub App:

1. Create app at https://github.com/settings/apps/new
2. Grant permissions: `metadata:read`, `contents:read`, `commit_statuses:read`
3. Generate and store private key securely
4. Install app on all monitored repositories
5. Use `@octokit/auth-app` for authentication

**Token Rotation Procedure:**

```bash
# Create new token (manually or via API)
# Store in vault
NEW_TOKEN=$(vault kv get -field=token secret/github/token-prod-2)

# Update environment without service restart
systemctl set-environment GITHUB_TOKEN=$NEW_TOKEN

# Verify new token works
npm run validate:github-token -- --token $NEW_TOKEN

# Wait for cache refresh (TTL seconds)
sleep $(echo $CACHE_TTL_SECONDS)

# Confirm old token is no longer used
npm run audit:github-token-usage -- --duration 300s

# Revoke old token (in GitHub UI)
# Document rotation in change log
```

### 3.3 Rate Limit Configuration

GitHub API rate limits vary by authentication method. Configure appropriately:

**Core API (REST):**
- Personal token: 60 requests/hour
- GitHub App: 15,000 requests/hour
- Unauthenticated: 60 requests/hour

**Search API:**
- All methods: 10 requests/minute
- Shared pool across all API usage

**GraphQL API:**
- All methods: 5,000 points/hour
- Each query consumes different points (typically 1-50)

**Configuration Strategy:**

```bash
# Calculate safe limits based on deployment scale
# Example: 5 repositories, 3600s TTL, 1 cache miss per repository per hour

# For REST Core API:
# Repos × Metrics per repo = Requests per cycle
# 5 × 12 = 60 requests per 3600s cycle
GITHUB_RATE_LIMIT_CORE=60  # Sustainable for 1 concurrent consumer

# For multiple concurrent consumers:
# GITHUB_RATE_LIMIT_CORE=3000  # Allows ~50 concurrent consumers

# For Search API:
GITHUB_RATE_LIMIT_SEARCH=10   # Default: 10/min, ~1 search per cycle

# For GraphQL:
GITHUB_RATE_LIMIT_GRAPHQL=5000  # Default budget, sufficient for most workloads

# Enable backoff/retry on rate limit
GITHUB_RETRY_AFTER_MS=5000
GITHUB_RETRY_MAX_ATTEMPTS=3
```

**Monitoring Rate Limit Usage:**

```bash
# Check current rate limit status
npm run monitor:rate-limits

# Expected output:
# Core API: 58/60 used
# Search API: 9/10 used
# GraphQL: 4200/5000 used

# Alert if usage exceeds 80%
GITHUB_RATE_LIMIT_ALERT_THRESHOLD_PCT=80
```

### 3.4 Cache Configuration

Reporting Agent v2 uses Redis for distributed caching. Configure as follows:

**Redis Setup:**

```bash
# Install Redis (if not present)
sudo apt-get install redis-server

# Verify Redis is running
redis-cli ping  # Expected: PONG

# Configure Redis persistence
sudo sed -i 's/# save 900 1/save 900 1/g' /etc/redis/redis.conf
sudo sed -i 's/# appendonly no/appendonly yes/g' /etc/redis/redis.conf

# Restart Redis
sudo systemctl restart redis-server
```

**Agent Cache Configuration:**

```bash
# Redis connection
CACHE_STRATEGY=redis
CACHE_REDIS_HOST=localhost
CACHE_REDIS_PORT=6379
CACHE_REDIS_DB=0
CACHE_REDIS_PASSWORD=secure_redis_password  # If auth required

# Cache expiry and sizing
CACHE_TTL_SECONDS=3600        # 1 hour default
CACHE_MAX_SIZE_MB=1024        # 1 GB limit
CACHE_COMPRESSION=gzip        # Enable compression for large objects
CACHE_EVICTION_POLICY=allkeys-lru  # Redis eviction when full

# Cache warmup (pre-populate on startup)
CACHE_WARMUP_ENABLED=true
CACHE_WARMUP_REPOSITORIES=org/repo1,org/repo2
CACHE_WARMUP_TIMEOUT_MS=30000
```

**Cache Performance Tuning:**

```bash
# Monitor cache performance
npm run monitor:cache-stats

# Expected metrics:
# Hit Rate: > 80%
# Avg Lookup Time: < 50ms
# Avg Write Time: < 100ms

# If hit rate < 80%:
# - Increase CACHE_TTL_SECONDS
# - Increase CACHE_MAX_SIZE_MB
# - Check CACHE_COMPRESSION setting

# If lookup times > 50ms:
# - Verify Redis server performance
# - Check network latency
# - Consider local/memory cache layer
```

---

## 4. Monitoring and Alerting

### 4.1 Key Metrics

**Agent Performance Metrics:**

| Metric | Expected Range | Unit | Alert Threshold |
|--------|-----------------|------|-----------------|
| `reporting_agent_execution_time` | 2-30 | seconds | > 60s |
| `reporting_agent_repositories_processed` | ≥ configured repos | count | < expected |
| `reporting_agent_cache_hit_rate` | 75-95 | percent | < 60% |
| `reporting_agent_rate_limit_remaining` | > 10 | count | < 5 |
| `reporting_agent_output_files_generated` | = expected | count | < expected |
| `reporting_agent_api_errors` | 0-1 | count per cycle | > 5 |
| `reporting_agent_output_size_mb` | 1-100 | MB | > 500 |

**System Resource Metrics:**

| Metric | Expected Range | Unit | Alert Threshold |
|--------|-----------------|------|-----------------|
| `process_memory_heapUsed` | 50-300 | MB | > 800 |
| `process_cpu_user` | 5-30 | percent | > 80% |
| `nodejs_eventloop_lag` | 0-10 | ms | > 100 |
| `redis_used_memory` | 50-500 | MB | > 900 |
| `redis_connected_clients` | 1-5 | count | > 20 |

### 4.2 Monitoring Configuration

**Prometheus Scrape Configuration:**

```yaml
# /etc/prometheus/prometheus.yml
scrape_configs:
  - job_name: 'reporting-agent'
    static_configs:
      - targets: ['localhost:9090']
    scrape_interval: 30s
    scrape_timeout: 10s
    metrics_path: '/metrics'

  - job_name: 'reporting-agent-redis'
    static_configs:
      - targets: ['localhost:6379']
    scrape_interval: 30s

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['localhost:9100']
    scrape_interval: 30s
```

**Grafana Dashboard Setup:**

1. Import dashboard template: `dashboards/reporting-agent-v2.json`
2. Configure data source: Prometheus (http://localhost:9090)
3. Set refresh interval: 30 seconds
4. Configure dashboard variables:
   - `instance`: monitoring target
   - `environment`: prod/staging/dev
   - `repository`: monitored repositories

**Dashboard Panels:**

- Agent Execution Time (graph)
- Cache Hit Rate (gauge)
- API Rate Limit Remaining (alert)
- Error Rate (graph)
- Memory Usage (graph)
- Redis Connection Pool Status (gauge)

### 4.3 Alert Rules

**Critical Alerts (Immediate Action Required):**

```yaml
# High error rate
- alert: ReportingAgentHighErrorRate
  expr: rate(reporting_agent_api_errors[5m]) > 0.05
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: "Reporting Agent error rate > 5%"
    runbook: "#6-incident-runbook"

# Cache unavailable
- alert: ReportingAgentCacheUnavailable
  expr: redis_up == 0
  for: 2m
  labels:
    severity: critical
  annotations:
    summary: "Redis cache offline"
    runbook: "see §6.3"

# Out of memory
- alert: ReportingAgentOutOfMemory
  expr: process_memory_heapUsed > 800000000
  for: 2m
  labels:
    severity: critical
  annotations:
    summary: "Agent heap memory > 800 MB"
    runbook: "see §6.4"
```

**High-Priority Alerts (Escalate Within 15 Minutes):**

```yaml
# Low cache hit rate
- alert: ReportingAgentLowCacheHitRate
  expr: reporting_agent_cache_hit_rate < 0.60
  for: 10m
  labels:
    severity: high
  annotations:
    summary: "Cache hit rate < 60% (may indicate misconfiguration)"

# Rate limit exhaustion imminent
- alert: ReportingAgentRateLimitLow
  expr: reporting_agent_rate_limit_remaining < 5
  for: 5m
  labels:
    severity: high
  annotations:
    summary: "GitHub API rate limit approaching zero"
    runbook: "see §6.5"

# Slow execution
- alert: ReportingAgentSlowExecution
  expr: reporting_agent_execution_time > 60
  for: 3m
  labels:
    severity: high
  annotations:
    summary: "Agent execution time > 60 seconds"
    runbook: "see §7"
```

**Informational Alerts (Monitor But No Action Required):**

```yaml
# Token about to expire
- alert: ReportingAgentTokenExpiringSoon
  expr: github_token_expires_in_seconds < 604800
  labels:
    severity: info
  annotations:
    summary: "GitHub token expires in < 7 days"
    runbook: "see §3.2"

# High CPU usage (sustained)
- alert: ReportingAgentHighCPU
  expr: rate(process_cpu_user[5m]) > 0.80
  for: 30m
  labels:
    severity: info
  annotations:
    summary: "Agent CPU usage sustained > 80%"
```

---

## 5. Scaling Considerations

### 5.1 Vertical Scaling (Single Instance)

**Performance Limits (Single Instance):**

| Metric | Current Limit | Bottleneck | Scaling Action |
|--------|---------------|-----------|-----------------|
| Repositories | 50 | API rate limit | Add rate limit or switch to GitHub App |
| Concurrent requests | 5 | Memory/CPU | Increase CONCURRENCY_LIMIT |
| Cache size | 1 GB | Memory | Increase CACHE_MAX_SIZE_MB or add eviction |
| Execution time | 60s | API latency + processing | See §7 Performance Tuning |

**Vertical Scaling Steps:**

```bash
# 1. Increase memory allocation
NODE_OPTIONS="--max-old-space-size=2048" npm start

# 2. Increase concurrency
CONCURRENCY_LIMIT=10 npm start

# 3. Optimize cache
CACHE_MAX_SIZE_MB=2048 npm start
CACHE_COMPRESSION=gzip npm start

# 4. Increase timeouts for high-latency networks
TIMEOUT_REPO_MS=60000 npm start

# 5. Monitor performance
npm run monitor:performance -- --duration 600s
```

**Vertical Scaling Limits:**

- Maximum heap: 3 GB (diminishing returns beyond)
- Maximum concurrency: 20 (file descriptor limits)
- Maximum cache: 4 GB (Redis memory limits)

### 5.2 Horizontal Scaling (Multiple Instances)

**Load Balancing Strategy:**

```bash
# Deploy multiple instances behind load balancer
# Use shared Redis cache for cache coherency

# Instance 1
INSTANCE_ID=agent-01 npm start

# Instance 2
INSTANCE_ID=agent-02 npm start

# Instance 3
INSTANCE_ID=agent-03 npm start

# Load balancer configuration (nginx example)
upstream reporting_agents {
  least_conn;
  server 10.0.1.10:3000;
  server 10.0.1.11:3000;
  server 10.0.1.12:3000;
}

server {
  listen 80;
  location /api/ {
    proxy_pass http://reporting_agents;
    proxy_set_header Connection "";
  }
}
```

**Repository Distribution Strategy:**

For maximum throughput with N instances:

```bash
# Strategy 1: Round-robin by repository hash
# Each instance owns a consistent subset of repositories
GITHUB_REPOSITORIES=$(
  cat repos.txt | \
  awk -v id=$INSTANCE_ID -v total=$INSTANCE_COUNT \
  'NR%total==id {print}'
)

# Strategy 2: Sharded by repository name
# Instance 0: repos starting with a-h
# Instance 1: repos starting with i-p
# Instance 2: repos starting with q-z
GITHUB_REPOSITORIES=$(
  cat repos.txt | \
  grep "^[a-h]" | \
  paste -sd, -
)

# Strategy 3: Oversubscribe with shared cache
# All instances process all repos, benefit from shared cache
# Only practical if rate limiting allows
GITHUB_REPOSITORIES=$(cat repos.txt | paste -sd, -)
```

**Horizontal Scaling Limits:**

- Maximum instances: 10 (diminishing cache benefits)
- Rate limit per instance: 60/hour (personal token) → need GitHub App or token distribution
- Cache coherency: Redis cluster recommended for > 3 instances

### 5.3 Scaling Decision Tree

```
Is current instance hitting CPU limit (>80%)?
├─ Yes → Increase CONCURRENCY_LIMIT and re-profile
│  ├─ Still bottlenecked? → Vertical scale (more memory/CPU)
│  └─ Resolved? → Monitor for sustained load
└─ No → Check other bottlenecks

Is cache hit rate low (<60%)?
├─ Yes → Increase CACHE_MAX_SIZE_MB or CACHE_TTL_SECONDS
│  └─ If Redis memory full → Switch to Redis cluster or add instance
└─ No → Cache is sufficient

Is rate limit frequently exhausted?
├─ Yes → Switch to GitHub App (15,000/hour vs 60/hour)
│  └─ Even with App? → Add horizontal scaling
└─ No → Current rate limit sufficient

Is execution time > 60s consistently?
├─ Yes → Profile and optimize (see §7)
│  └─ Still slow? → Vertical scale or add instances
└─ No → Performance acceptable

Result: Current instance capacity sufficient?
├─ Yes → Keep single instance, monitor metrics
└─ No → Horizontal scale (2-3 instances initially)
```

---

## 6. Incident Runbook

### 6.1 Common Incidents and Responses

**Incident 1: High Error Rate (> 5%)**

**Detection:**
- Alert: `ReportingAgentHighErrorRate` fires
- Manual: `npm run monitor:errors -- --threshold 0.05`

**Diagnosis:**

```bash
# Step 1: Check error types
npm run logs:errors -- --limit 100

# Expected output:
# RATE_LIMIT_EXCEEDED: 30% of errors
# NETWORK_TIMEOUT: 40% of errors
# AUTHENTICATION_FAILED: 10% of errors
# OTHER: 20% of errors
```

**Response (Severity: CRITICAL):**

| Error Type | Response | Timeline |
|------------|----------|----------|
| RATE_LIMIT_EXCEEDED | Enable retry backoff, check rate limit config (§3.3) | Immediate |
| NETWORK_TIMEOUT | Check network connectivity, increase timeouts | 5 min |
| AUTHENTICATION_FAILED | Verify token validity (§3.2), regenerate if needed | 10 min |
| CONCURRENT_API_LIMIT | Reduce CONCURRENCY_LIMIT, add instances | 15 min |

**Recovery:**

```bash
# 1. Enable verbose logging
DEBUG=reporting-agent:* npm start

# 2. Check token validity
npm run validate:github-token

# 3. Verify network connectivity
curl -I https://api.github.com

# 4. Check rate limit status
npm run monitor:rate-limits

# 5. If RATE_LIMIT_EXCEEDED:
GITHUB_RETRY_AFTER_MS=10000 npm start

# 6. If NETWORK_TIMEOUT:
TIMEOUT_API_MS=30000 npm start

# 7. Monitor error rate for 5 minutes
npm run monitor:errors -- --duration 300s
```

**Escalation:** If error rate remains > 1% after 10 minutes, page on-call team.

---

**Incident 2: Redis Cache Offline**

**Detection:**
- Alert: `ReportingAgentCacheUnavailable` fires
- Manual: `redis-cli ping` returns error

**Diagnosis:**

```bash
# Check Redis process
systemctl status redis-server

# Check Redis logs
journalctl -u redis-server -n 50

# Check Redis connectivity
redis-cli -h localhost -p 6379 ping

# Check Redis memory usage
redis-cli INFO memory | grep used_memory_human
```

**Response (Severity: CRITICAL):**

```bash
# Step 1: Attempt graceful restart
sudo systemctl restart redis-server

# Step 2: Verify it restarted
sleep 5 && redis-cli ping

# Step 3: If restart fails, check disk space
df -h /var/lib/redis/

# If disk full, free space
sudo rm /var/lib/redis/dump.rdb.old

# Step 4: Restart Redis
sudo systemctl restart redis-server

# Step 5: If still failing, run recovery
redis-cli SHUTDOWN NOSAVE
sleep 2
sudo systemctl start redis-server

# Step 6: Verify cache is responsive
npm run monitor:cache-health -- --duration 60s
```

**Impact:** Agent runs without cache (slower performance). Continue operations until Redis recovers.

**Recovery:** Cache data will rebuild over time as normal operations execute.

---

**Incident 3: Out of Memory**

**Detection:**
- Alert: `ReportingAgentOutOfMemory` fires
- Manual: `npm run monitor:memory`

**Diagnosis:**

```bash
# Check current memory usage
ps aux | grep node | grep reporting-agent

# Check Node.js heap
node --version
node -e "console.log(require('v8').getHeapStatistics())"

# Check cache memory usage
redis-cli INFO memory | grep used_memory

# Check for memory leaks
npm run diagnose:memory-leak
```

**Response (Severity: CRITICAL):**

```bash
# Step 1: Graceful shutdown
kill -SIGTERM $(pgrep -f "reporting-agent")

# Step 2: Wait for graceful shutdown (30s max)
sleep 30

# Step 3: Restart with increased memory
NODE_OPTIONS="--max-old-space-size=2048" npm start

# Step 4: If still hitting limit, reduce cache size
CACHE_MAX_SIZE_MB=512 npm start

# Step 5: Reduce concurrency
CONCURRENCY_LIMIT=2 npm start

# Step 6: Monitor memory for 10 minutes
npm run monitor:memory -- --duration 600s
```

**Follow-up:** If memory continues to grow, investigate memory leak (§6.6).

---

**Incident 4: Rate Limit Exhaustion**

**Detection:**
- Alert: `ReportingAgentRateLimitLow` fires
- Manual: `npm run monitor:rate-limits`

**Diagnosis:**

```bash
# Check current rate limit status
npm run monitor:rate-limits

# Output:
# Core API: 2/60 remaining ⚠️
# Search API: 1/10 remaining ⚠️
# GraphQL: 100/5000 remaining ✓

# Identify resource consuming limits
npm run audit:rate-limit-usage -- --last-hour

# Check repositories being monitored
echo $GITHUB_REPOSITORIES
```

**Response (Severity: HIGH):**

| Solution | Time | Complexity |
|----------|------|-----------|
| Wait for limit reset (hourly) | 60 min | None |
| Switch to GitHub App (15,000/hour) | 30 min | Moderate |
| Reduce repositories monitored | 10 min | Low |
| Reduce monitoring frequency | 5 min | Low |

**Recovery:**

```bash
# Option 1: Temporarily reduce repositories (fastest)
GITHUB_REPOSITORIES=org/repo1,org/repo2 npm start
# Monitor until limit resets

# Option 2: Switch to GitHub App (recommended long-term)
# See §3.2 for GitHub App setup instructions

# Option 3: Reduce monitoring frequency
CACHE_TTL_SECONDS=7200 npm start
# Longer cache means fewer API calls

# Step 4: Monitor rate limit recovery
npm run monitor:rate-limits -- --continuous
```

**Prevention:** Switch to GitHub App in production for higher limits.

---

**Incident 5: Slow Execution (>60s)**

**Detection:**
- Alert: `ReportingAgentSlowExecution` fires
- Manual: `npm run monitor:execution-time -- --threshold 60`

**Diagnosis:**

```bash
# Profile execution time by phase
npm run profile:execution

# Output:
# Phase 1: Repository enumeration: 5s ✓
# Phase 2: Commit history: 30s ⚠️
# Phase 3: Tag resolution: 20s ✓
# Phase 4: Output generation: 5s ✓
# Total: 60s

# Identify slow repositories
npm run profile:by-repository

# Check network latency
npm run diagnose:network-latency

# Check API response times
npm run monitor:api-response-times
```

**Response (Severity: HIGH):**

See §7 Performance Tuning for detailed optimization strategies.

Quick wins:
```bash
# 1. Increase cache TTL (reduce API calls)
CACHE_TTL_SECONDS=7200 npm start

# 2. Increase concurrency
CONCURRENCY_LIMIT=10 npm start

# 3. Profile and optimize specific phase
npm run optimize:commit-history -- --limit 1000
```

---

### 6.2 Incident Severity Levels

| Level | Definition | Response Time | Escalation |
|-------|-----------|----------------|-----------|
| **CRITICAL** | Service unavailable or data loss risk | < 5 min | Page on-call immediately |
| **HIGH** | Significant functionality degraded | < 15 min | Notify team lead |
| **MEDIUM** | Non-critical functionality degraded | < 1 hour | Update status page |
| **LOW** | Minor issues, workarounds available | < 4 hours | Log for backlog |

### 6.3 Incident Post-Mortem Template

After resolving any CRITICAL or HIGH incident:

```markdown
# Incident Post-Mortem: [Incident Name]

## Incident Details
- **Date/Time**: YYYY-MM-DD HH:MM UTC
- **Duration**: X minutes
- **Severity**: [CRITICAL/HIGH/MEDIUM/LOW]
- **Services Affected**: Reporting Agent v2
- **Users Impacted**: [Number] automated workflows

## Timeline
- **HH:MM** - Event detected (alert or manual report)
- **HH:MM** - Diagnosis started
- **HH:MM** - Root cause identified
- **HH:MM** - Recovery action initiated
- **HH:MM** - Service restored
- **HH:MM** - Monitoring normal

## Root Cause Analysis
[Describe the underlying cause, not just symptoms]

## Immediate Actions Taken
1. [Action 1]
2. [Action 2]
3. [Action 3]

## Preventive Actions (To Avoid Recurrence)
- [ ] Action 1 - Owner: [Name] - Due: [Date]
- [ ] Action 2 - Owner: [Name] - Due: [Date]
- [ ] Action 3 - Owner: [Name] - Due: [Date]

## Lessons Learned
- What went well?
- What could be improved?
- Configuration changes needed?
```

---

## 7. Performance Tuning

### 7.1 Profiling and Diagnostics

**Runtime Profiling:**

```bash
# Profile CPU usage
NODE_OPTIONS="--prof" npm start
# Wait for incident/slow period
# Extract profile: node --prof-process isolate-*.log > profile.txt

# Profile memory usage
node --inspect npm start
# Connect Chrome DevTools to localhost:9229
# Take heap snapshots and compare over time

# Profile rate limiting
npm run profile:github-api-calls

# Profile cache performance
npm run profile:cache-performance

# Profile execution phases
npm run profile:execution-phases
```

**Metrics to Capture:**

| Metric | Tool | Threshold | Action |
|--------|------|-----------|--------|
| CPU usage | top, ps | > 80% sustained | Reduce concurrency |
| Memory usage | /proc/self/status | > 800 MB | Increase max heap |
| Cache hit rate | npm run monitor:cache | < 60% | Increase TTL/size |
| API latency | npm run monitor:api-timing | > 5s per call | Check network |
| Total execution | npm run monitor:execution | > 60s | Profile phases |

### 7.2 Optimization Strategies

**Strategy 1: Increase Cache Hit Rate**

```bash
# Current cache config
CACHE_TTL_SECONDS=3600
CACHE_MAX_SIZE_MB=1024

# Check hit rate
npm run monitor:cache-stats | grep "Hit Rate"

# If < 80%, increase TTL
CACHE_TTL_SECONDS=7200 npm start

# Monitor for 1 hour
npm run monitor:cache-stats -- --duration 3600

# If still < 80%, increase max size
CACHE_MAX_SIZE_MB=2048 npm start
```

**Strategy 2: Reduce API Calls**

```bash
# Profile API call distribution
npm run profile:github-api-calls

# Identify expensive calls
# Example output:
# GET /repos/{owner}/{repo}/commits: 45% of calls
# GET /repos/{owner}/{repo}/tags: 30% of calls
# GET /repos/{owner}/{repo}: 20% of calls
# Other: 5% of calls

# Reduce commit history depth
COMMIT_HISTORY_LIMIT=100 npm start  # Default: 1000

# Reduce tag resolution
TAG_RESOLUTION_LIMIT=50 npm start   # Default: 200

# Enable response caching at GitHub level
GITHUB_RESPONSE_CACHE=true npm start
```

**Strategy 3: Optimize Concurrency**

```bash
# Current concurrency
CONCURRENCY_LIMIT=5

# Profile concurrent operations
npm run profile:concurrency

# Identify resource bottleneck
# If CPU bound: increase concurrency
CONCURRENCY_LIMIT=10 npm start

# If memory bound: decrease concurrency
CONCURRENCY_LIMIT=2 npm start

# If I/O bound: increase concurrency
CONCURRENCY_LIMIT=15 npm start

# Monitor system resources during next run
npm run monitor:system-resources
```

**Strategy 4: Parallelize Phase Execution**

```bash
# Current execution phases (sequential)
# Repository enumeration → Commit history → Tags → Output generation
# Total time: 60s

# Parallelize commit history and tag resolution
ENABLE_PHASE_PARALLELIZATION=true npm start

# Expected improvement: 30-40% faster (now ~36-42s)
# Trade-off: Higher memory usage during parallel phases

# Monitor execution time
npm run monitor:execution-time -- --duration 600s
```

### 7.3 Performance Tuning Configuration

**Conservative (Low Risk):**

```bash
# Maintains stability, minimal configuration changes
CACHE_TTL_SECONDS=7200
CACHE_MAX_SIZE_MB=1024
CONCURRENCY_LIMIT=5
COMMIT_HISTORY_LIMIT=500
TAG_RESOLUTION_LIMIT=100
```

**Moderate (Balanced):**

```bash
# Optimized for typical workloads
CACHE_TTL_SECONDS=7200
CACHE_MAX_SIZE_MB=2048
CONCURRENCY_LIMIT=10
COMMIT_HISTORY_LIMIT=200
TAG_RESOLUTION_LIMIT=50
ENABLE_PHASE_PARALLELIZATION=true
```

**Aggressive (High Performance, High Risk):**

```bash
# Maximum performance, may require monitoring
NODE_OPTIONS="--max-old-space-size=3072"
CACHE_TTL_SECONDS=14400
CACHE_MAX_SIZE_MB=4096
CONCURRENCY_LIMIT=20
COMMIT_HISTORY_LIMIT=50
TAG_RESOLUTION_LIMIT=20
ENABLE_PHASE_PARALLELIZATION=true
GITHUB_RETRY_AFTER_MS=2000
```

---

## 8. Backup and Recovery

### 8.1 Backup Strategy

**Components to Backup:**

| Component | Criticality | Backup Frequency | Retention |
|-----------|------------|------------------|-----------|
| Configuration (.env.production) | HIGH | Daily | 30 days |
| Cache data (Redis dump.rdb) | MEDIUM | Hourly | 7 days |
| Output artifacts (.github/reports) | HIGH | Daily | 90 days |
| Repository metadata | MEDIUM | Daily | 30 days |

**Backup Script:**

```bash
#!/bin/bash
# backup-reporting-agent.sh

BACKUP_DIR="/backups/reporting-agent"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup configuration
cp .env.production "$BACKUP_DIR/env_$DATE.txt"

# Backup Redis
redis-cli BGSAVE
sleep 5
cp /var/lib/redis/dump.rdb "$BACKUP_DIR/redis_dump_$DATE.rdb"

# Backup reports
tar -czf "$BACKUP_DIR/reports_$DATE.tar.gz" \
  .github/reports/metadata-agent

# Upload to S3 (optional)
aws s3 sync "$BACKUP_DIR/" s3://backups/reporting-agent/ \
  --delete \
  --storage-class GLACIER

# Cleanup old backups (keep 30 days)
find "$BACKUP_DIR" -mtime +30 -delete

echo "Backup complete: $DATE"
```

**Backup Automation:**

```bash
# Add to crontab for daily backups
0 2 * * * /usr/local/bin/backup-reporting-agent.sh >> /var/log/backup.log 2>&1

# Verify backups weekly
0 3 * * 0 /usr/local/bin/verify-backups.sh
```

### 8.2 Disaster Recovery

**Complete System Failure Recovery:**

```bash
# Step 1: Restore configuration
cp /backups/reporting-agent/env_YYYYMMDD_HHMMSS.txt .env.production

# Step 2: Restore Redis
systemctl stop redis-server
cp /backups/reporting-agent/redis_dump_YYYYMMDD_HHMMSS.rdb /var/lib/redis/dump.rdb
systemctl start redis-server

# Step 3: Restore reports
tar -xzf /backups/reporting-agent/reports_YYYYMMDD_HHMMSS.tar.gz

# Step 4: Reinstall dependencies
npm ci --production

# Step 5: Verify system
npm run test:smoke

# Step 6: Restart service
NODE_ENV=production npm start
```

**Partial Recovery (Cache Only Loss):**

```bash
# Redis data lost but configuration intact
# Cache will rebuild automatically

# Force cache rebuild (expedited)
npm run cache:warmup

# This pre-populates cache with monitored repositories
# Reduces initial API calls and speeds up first run
```

---

## 9. Security and Access Control

### 9.1 Secrets Management

**Secrets Required:**

- GitHub Token (for API authentication)
- Redis password (if auth required)
- HTTPS proxy credentials (if using proxy)
- SSH private key (for self-hosted repositories)

**Secure Storage:**

```bash
# NEVER commit .env files to Git
echo ".env.production" >> .gitignore
echo ".env.*.local" >> .gitignore

# Store in secure vault
vault kv put secret/reporting-agent/prod \
  github_token="ghp_xxxx" \
  redis_password="xxxx"

# Load at runtime (don't persist to disk)
export GITHUB_TOKEN=$(vault kv get -field=github_token secret/reporting-agent/prod)
export CACHE_REDIS_PASSWORD=$(vault kv get -field=redis_password secret/reporting-agent/prod)
```

### 9.2 Access Control

**Token Permissions (Minimal Principle):**

```
Grant only:
  - repo:status (read commit status)
  - repo_deployment (read deployment status)
  - public_repo (if public repos only)
  - read:repo_hook (read webhook config)

Do NOT grant:
  - repo (full repo access)
  - admin (administrative access)
  - delete_repo (dangerous)
  - workflow (workflow modification)
```

**Service Account Configuration:**

```bash
# Create dedicated service account
# Name: reporting-agent-svc
# Email: reporting-agent-svc@example.com
# Scope: Read-only access to repositories

# Grant permissions
# - Member of @lightspeedwp/reporting-agents team
# - No direct repository admin access
# - Uses personal access token (auto-rotated)

# Document access in access control log
echo "reporting-agent-svc: read:repos, commit:status" >> ACCESS_LOG.md
```

---

## 10. Operational Checklists

### 10.1 Weekly Operations Checklist

**Every Monday 09:00 UTC:**

- [ ] Review alerts from past week (Slack #reporting-agent-alerts)
- [ ] Check rate limit usage trends (peak vs average)
- [ ] Verify cache hit rates (should be > 80%)
- [ ] Review error logs for patterns
- [ ] Test failover procedure (manual)
- [ ] Verify backups completed successfully
- [ ] Check repository metric accuracy (spot checks)

### 10.2 Monthly Operations Checklist

**First Monday of Each Month:**

- [ ] Review performance metrics (CPU, memory, execution time)
- [ ] Analyze cost trends (API calls, bandwidth)
- [ ] Rotate credentials (GitHub token, Redis password, SSH keys)
- [ ] Update documentation based on learnings
- [ ] Run full disaster recovery test
- [ ] Review and tune configuration settings (§3, §7)
- [ ] Plan for coming quarter's scaling needs

### 10.3 Quarterly Review Checklist

**End of Each Quarter:**

- [ ] Capacity planning review (are we approaching limits?)
- [ ] Security audit (access logs, permission changes)
- [ ] Performance benchmarking (vs previous quarter)
- [ ] Scaling strategy update (need for horizontal scaling?)
- [ ] Incident post-mortems (patterns, preventive actions)
- [ ] Documentation update (accuracy, completeness)
- [ ] Stakeholder communication (status report)

---

## Appendix: Command Reference

### Monitoring Commands

```bash
npm run monitor:health              # Overall system health
npm run monitor:metrics             # Key performance metrics
npm run monitor:rate-limits         # GitHub API rate limits
npm run monitor:cache-stats         # Cache performance
npm run monitor:errors              # Error rates and types
npm run monitor:execution-time      # Phase-by-phase timing
npm run monitor:api-response-times  # GitHub API latency
npm run monitor:system-resources    # CPU, memory, I/O
```

### Diagnostic Commands

```bash
npm run diagnose:configuration      # Validate configuration
npm run diagnose:network            # Network connectivity
npm run diagnose:github-api         # GitHub API access
npm run diagnose:cache              # Cache functionality
npm run diagnose:memory-leak        # Detect memory leaks
npm run diagnose:performance        # Performance analysis
```

### Recovery Commands

```bash
npm run cache:clear                 # Clear all cached data
npm run cache:warmup                # Pre-populate cache
npm run validate:github-token       # Verify token validity
npm run test:repositories           # Test repo connectivity
npm run restart:service             # Gracefully restart
```

---

**Document Version:** 1.0  
**Last Updated:** 2026-09-04  
**Next Review:** 2026-10-04

# Performance Requirements Quality Variant

> Domain-specific extension of the base Requirements Quality Checklist (8 dimensions) with Performance-focused items

**Domain**: Performance (Speed, Scalability, Resource Efficiency, Reliability Under Load)  
**Use When**: Specification includes performance targets, scalability requirements, or needs load testing validation  
**Base Template**: Add these items to the standard 40-45 base items

---

## Performance-Specific Items (18 items)

### Completeness: All Performance Requirements Documented

**CHK-046-Performance-Completeness**

**Question**: Are all performance targets and metrics documented (latency, throughput, resource usage)?

**Guidance**: For each operation, document:

- **Latency targets**:
  - P50 (median): What's typical? (e.g., 100ms)
  - P95 (95th percentile): What's acceptable? (e.g., 200ms)
  - P99 (99th percentile): Worst acceptable? (e.g., 500ms)
  - Max (absolute ceiling): Never exceed? (e.g., 10 seconds)

- **Throughput targets**:
  - Requests per second (RPS): e.g., "100 RPS sustained"
  - Concurrent users: e.g., "1,000 simultaneous users"
  - Burst capacity: e.g., "500 RPS burst for 10 seconds"
  - Data throughput: e.g., "100 MB/s ingestion rate"

- **Resource targets**:
  - CPU usage: Target? (e.g., "<50% at peak load")
  - Memory usage: Target? (e.g., "<2 GB per service")
  - Disk usage: How much? (e.g., "<100 GB per instance")
  - Network bandwidth: Limit? (e.g., "<1 Gbps outbound")

- **Availability target**:
  - Uptime: e.g., "99.9% uptime (43 minutes/month downtime)"
  - Error rate: e.g., "<0.1% error rate"
  - Downtime budget: e.g., "4 hours maintenance/month"

Performance requirements inventory:

| Operation | P50 | P95 | P99 | Throughput | Notes |
|-----------|-----|-----|-----|-----------|-------|
| GET product | 50ms | 100ms | 200ms | 1000 RPS | Cached |
| Search | 100ms | 300ms | 1000ms | 100 RPS | Database query |
| Checkout | 500ms | 1000ms | 2000ms | 10 RPS | External payment API |

Document measurement methodology:

- How are metrics measured? (load testing, APM tools, user monitoring)
- Load profile: realistic user behavior? (gradual ramp, spike, sustained)
- Test environment: prod-like? Infrastructure specs?

**Success Criteria**:

- All key operations have performance targets
- Targets are measurable (not vague like "fast")
- Targets are realistic (not "1ms" for database query)
- Performance tested before release
- Metrics monitored in production

---

### Completeness: Resource Constraints and Limits

**CHK-047-Performance-Completeness**

**Question**: Are resource constraints documented (storage, memory, network, connections)?

**Guidance**: Specify:

- **Storage limits**:
  - Database storage: How much before scaling? (e.g., "100 GB per partition")
  - File storage: How much? (e.g., "10 TB S3 bucket")
  - Cache size: Memory cache limit? (e.g., "2 GB Redis")
  - Archival: What's archived vs. live? (e.g., "Data >1 year archived to cold storage")

- **Connection limits**:
  - Database connections: Max pool size? (e.g., "100 connections per service")
  - HTTP keep-alive: Long-lived connections or closed? (e.g., "30-second timeout")
  - Concurrent users: Max handled? (e.g., "10,000 concurrent")
  - Sockets/file descriptors: System limit? (e.g., "65,536 open files per process")

- **Memory limits**:
  - Per-process: Max heap size? (e.g., "4 GB JVM heap")
  - Per-request: Memory allocation? (e.g., "<100 MB per API request")
  - Cache memory: How much for caching? (e.g., "<50% of total RAM")

- **Network constraints**:
  - Bandwidth per instance: e.g., "1 Gbps network link"
  - Bandwidth per request: Max upload size? (e.g., "10 MB file upload")
  - API rate limits: Requests per minute? (e.g., "100 RPS per API key")

- **Timeout specifications**:
  - Request timeout: e.g., "30 seconds"
  - Database query timeout: e.g., "10 seconds"
  - External API timeout: e.g., "5 seconds"
  - Batch operation timeout: e.g., "30 minutes"

**Success Criteria**:

- All resource types have defined limits
- Limits are realistic for infrastructure
- Behavior defined when limits exceeded (queue, reject, degrade)
- Capacity planning based on limits
- Monitoring alerts for approaching limits

---

### Clarity: Load Testing Scenarios and Profiles

**CHK-048-Performance-Clarity**

**Question**: Are load testing scenarios and user profiles documented?

**Guidance**: Define realistic load profiles:

- **Steady-state load**:
  - Concurrent users: e.g., "1,000 concurrent"
  - Request rate: e.g., "10 RPS sustained"
  - Duration: e.g., "30 minutes"
  - Success criteria: P95 latency <200ms, error rate <0.1%

- **Ramp-up load**:
  - Start: e.g., "100 concurrent"
  - Ramp: e.g., "100 new users every 10 seconds"
  - Duration: e.g., "20 minutes to reach peak"
  - Success criteria: No errors during ramp

- **Spike load**:
  - Normal: e.g., "1,000 concurrent"
  - Spike: e.g., "10,000 concurrent suddenly"
  - Duration: e.g., "10 seconds"
  - Success criteria: Error rate <1%, no complete failures

- **Soak test** (long-duration load):
  - Load: e.g., "80% peak capacity"
  - Duration: e.g., "8 hours"
  - Success criteria: No memory leaks, stable response times
  - Detect: Gradual degradation, resource leaks

- **Stress test** (find breaking point):
  - Increase: e.g., "100 users every 30 seconds"
  - Until: Server breaks (timeouts, errors)
  - Find: At what load does system fail?
  - Document: Breaking point and recovery behavior

Load test scripts:

```
LoadTest: Steady State (1000 concurrent users, 30 min)
- 500 users (5 min): Ramp up
- 1000 users (20 min): Sustained
- 500 users (5 min): Ramp down

Request mix:
- 60% GET product (cached, low latency)
- 20% Search (database, medium latency)
- 10% POST order (payment, high latency)
- 10% Update inventory (database write)
```

Test data:

- How many products in catalog? (affects search, caching)
- How many users? (affects database size, indexes)
- Historical data: How much? (affects queries)

**Success Criteria**:

- Load profiles are realistic (match real user behavior)
- Load tests cover steady-state, ramp, spike, soak
- Test scripts automated and repeatable
- Results documented and analyzed
- Tests run before release and periodically after

---

### Clarity: Caching Strategy and Cache Invalidation

**CHK-049-Performance-Clarity**

**Question**: Is caching strategy documented (what, where, how, when to invalidate)?

**Guidance**: For each cacheable data, specify:

- **What to cache**:
  - Static content: Product catalog, images, CSS/JS (cache forever, invalidate on deploy)
  - Computed results: Search results, dashboard aggregates (cache 1 hour, invalidate on data change)
  - API responses: User profile, list of resources (cache 5 minutes, invalidate on update)
  - Database queries: Frequently accessed rows (cache with TTL, invalidate on write)

- **Where to cache**:
  - Browser cache: Static assets (images, JS, CSS)
  - CDN cache: Static and semi-static content
  - Application cache: In-memory (Redis, Memcached)
  - Database cache: Query result cache (prepared statements, materialized views)
  - Proxy cache: HTTP caches in network

- **Cache strategies**:
  - **Cache-aside** (lazy loading): App checks cache, if miss loads from DB and caches
  - **Write-through**: App updates DB and cache simultaneously
  - **Write-behind**: App updates cache immediately, DB updates asynchronously
  - **Refresh-ahead**: Proactively refresh before expiration

- **TTL (time-to-live)**:
  - Static assets: Very long (1 year) or versioned forever
  - Product data: Medium (1 hour)
  - User preferences: Short (5-10 minutes)
  - Real-time data: Very short (1-5 minutes) or none

- **Cache invalidation**:
  - Time-based: Automatic expiration (TTL)
  - Event-based: Update cache when data changes
  - Manual: Admin action to clear cache
  - Tag-based: Invalidate related items together

Example cache strategy:

```
GET /products → Redis cache, 1-hour TTL
  Cache miss → query database → cache result
  Cache hit → return from Redis
  Invalidate → when product updated via PUT

GET /search → Redis cache, 5-minute TTL, key includes query params
  Cache busting → on product inventory change (via event)

Static assets → CDN with 1-year TTL, versioned filenames (v1.2.3.js)
  Invalidate → change filename version, old files expire naturally
```

Cache hit rate target:

- Static assets: >95% hit rate
- API caching: >70% hit rate
- Database: >80% hit rate

**Success Criteria**:

- Caching strategy documented (not ad-hoc)
- Cache layers appropriate (browser, CDN, app, DB)
- TTLs realistic (not too short = thrashing, not too long = stale)
- Invalidation strategy clear
- Cache hit rates monitored
- Coherency tested (cache vs. DB in sync)

---

### Measurability: Monitoring, Alerting, and Observability

**CHK-050-Performance-Measurability**

**Question**: Are performance metrics monitored and alerting thresholds defined?

**Guidance**: Specify:

- **Key metrics to monitor**:
  - Request latency (P50, P95, P99)
  - Request throughput (RPS, errors/sec)
  - Resource utilization (CPU, memory, disk, network)
  - Queue depths (if async processing)
  - Cache hit rates
  - Database performance (slow queries, connection pool usage)

- **Monitoring tools**:
  - APM tools: New Relic, DataDog, Dynatrace, Prometheus
  - Logs: ELK stack, Splunk, CloudWatch
  - Metrics: Prometheus, Grafana, InfluxDB
  - Real User Monitoring (RUM): Measure actual user experience

- **Alerting thresholds**:
  - P95 latency > 200ms → alert warning, > 500ms → critical
  - Error rate > 0.5% → alert warning, > 1% → critical
  - CPU usage > 80% → alert, > 95% → critical
  - Memory usage > 85% → alert, > 95% → critical
  - 5-minute error spike > 10x normal → critical

Alert escalation:

- Page oncall (critical, <5 min SLA)
- Alert team (warning, <1 hour SLA)
- Incident post-mortem (all alerts logged)

Example Prometheus alert:

```yaml
alert: HighLatency
expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.2
for: 5m
annotations:
  summary: P95 latency high ({{ $value }}s)
  action: Check app logs, database load, external service dependencies
```

Dashboards:

- Executive dashboard: Uptime, error rate, key metrics
- Operations dashboard: All metrics, alerts, incidents
- Developer dashboard: Latency by endpoint, errors by type, resource usage
- Customer dashboard: SLO compliance, incident history

**Success Criteria**:

- Key metrics identified and monitored
- Alerting rules defined and tested
- Alert thresholds not too tight (alert fatigue) or too loose (missed issues)
- Dashboards provide visibility
- Incidents correlated with metrics
- Metrics tracked for trending and capacity planning

---

### Scenario Coverage: Database Query Performance

**CHK-051-Performance-Scenario-Coverage**

**Question**: Are database query performance targets and optimization strategies documented?

**Guidance**: For critical queries:

- **Query analysis**:
  - EXPLAIN PLAN: Show database execution plan
  - Expected execution time: <100ms, <1s, etc.?
  - Row count: How many rows returned?
  - Index usage: Indexes used? Full table scans avoided?
  - Join count: How many tables? Acceptable?

- **Index strategy**:
  - What columns indexed? (on frequently filtered, sorted, joined columns)
  - Composite indexes: Column order matters
  - Index maintenance: Cost of maintaining indexes
  - Avoid: Too many indexes (slow inserts/updates)

- **Query optimization**:
  - Denormalization: Pre-computed columns for common queries?
  - Pagination: Limit result set size (don't fetch millions of rows)
  - Projection: Select only needed columns (not SELECT *)
  - Filtering: Push down filters to database (don't fetch and filter in app)
  - Joins: Minimize joins (normalized but efficient)

- **Slow query detection**:
  - Slow query log: e.g., "Log queries >100ms"
  - Monitoring: Alert on new slow queries
  - Threshold: What's considered slow? (depends on operation)
  - Analysis: Why is query slow? Missing index? Bad statistics?

Example:

```sql
-- Slow query (no index)
SELECT * FROM orders WHERE customer_id = 123 AND created_at > '2024-01-01';

-- Optimized (with index)
CREATE INDEX idx_orders_customer_created ON orders(customer_id, created_at);
SELECT id, total, status FROM orders 
WHERE customer_id = 123 AND created_at > '2024-01-01'
LIMIT 100;

-- Performance target: P95 < 50ms (with index), P99 < 100ms
```

N+1 query problem:

- Fetch list of customers (1 query)
- For each customer, fetch orders (N queries) → N+1 total
- Solution: JOIN or batch fetch

**Success Criteria**:

- Critical queries analyzed
- Indexes defined for performance
- Slow queries monitored
- Query optimization tested
- Lazy loading (N+1) avoided
- Database-specific best practices followed

---

### Scenario Coverage: Scalability and Horizontal Scaling

**CHK-052-Performance-Scenario-Coverage**

**Question**: Is scalability strategy documented (vertical vs. horizontal, stateless design)?

**Guidance**: Specify:

- **Vertical scaling** (bigger hardware):
  - Max CPU/memory per instance?
  - When to scale up? (e.g., CPU >70%)
  - Downtime required? (for server restarts)
  - Cost/performance tradeoff documented

- **Horizontal scaling** (more instances):
  - Stateless design: Can instances be replaced?
  - Session management: Where stored? (database, distributed cache, not local)
  - Load balancing: How are requests distributed?
  - Auto-scaling rules: CPU >70% → add instance, <30% → remove instance
  - Min/max instances: Lower bound for availability, upper bound for cost

- **Partitioning/sharding** (for databases):
  - Shard key: What's used to partition data? (customer_id, region, etc.)
  - Shard count: Start with how many shards? Rebalancing procedure?
  - Cross-shard queries: How are they handled? (expensive, accepted)

Example scaling strategy:

```
Architecture: Load balancer → 2-10 app instances (auto-scale) → 1 database

Auto-scaling:
- If CPU avg > 70% for 5 min → add instance
- If CPU avg < 30% for 10 min → remove instance
- Min 2 instances (availability), max 10 (cost)

Database:
- Single instance (PostgreSQL) → master/replica for reads
- Vertical scaling: r6i.2xlarge → r6i.4xlarge when hitting CPU limits
- Sharding: If >1TB, shard by customer_id (prepare sharding plan)
```

Stateless design:

- ✅ Session data in database or Redis
- ✅ User state in distributed cache
- ✅ Temporary files in shared storage (S3)
- ❌ Local session store (lost on instance failover)
- ❌ Temp files on instance disk (lost on termination)

**Success Criteria**:

- Scaling strategy documented (auto-scaling rules)
- Horizontal scaling possible (stateless design)
- Load balancing configured
- Session management distributed
- Scaling tested (add/remove instances, measure response time)
- Cost of scaling modeled

---

### Edge Cases: Degradation and Fallback Strategies

**CHK-053-Performance-Edge-Cases**

**Question**: How does system degrade under extreme load or when dependencies fail?

**Guidance**: Specify:

- **Graceful degradation**:
  - What features degrade? (secondary features only, not core)
  - How do users know? (banner message, feature grayed out)
  - Which features disabled? (e.g., "recommendations disabled, showing random items")
  - Recovery: When does full functionality return?

- **Circuit breaker pattern**:
  - For external dependencies (APIs, databases)
  - Open circuit: Stop calling failing dependency, return cached/default response
  - Half-open: Try limited requests to test recovery
  - Closed: Normal operation
  - Timeouts: e.g., "If API doesn't respond in 5s, open circuit"

- **Timeouts and retries**:
  - Timeout: When to give up? (e.g., 5s for external API)
  - Retry strategy: Exponential backoff (1s, 2s, 4s, 8s)
  - Max retries: 3-4 maximum (don't retry indefinitely)
  - Jitter: Add randomness to avoid thundering herd

- **Queue overflow**:
  - If requests queue up (async processing)
  - Max queue size? (e.g., 10,000 requests)
  - Beyond max: Drop requests (with error), oldest jobs evicted?
  - Priority queues: High-priority requests skip ahead?

- **Resource exhaustion**:
  - Connection pool exhausted: Queue requests, reject, or error?
  - Memory exhausted: Evict cache, reject new requests?
  - Disk full: Stop accepting writes, alert ops?

Example degradation scenario:

```
Normal: Show recommendations from ML model
      → User ratings: 5s SLA
      → Recommendations: 1s SLA
      
High load or timeout: Fall back to most popular items
      → Pre-computed popular items: cached, instant
      → User sees "Popular items" instead of "Recommended for you"
      → Graceful, user doesn't notice failure

Dependency failure: Payment API down
      → Circuit opens (stop calling Payment API)
      → Queue transactions locally
      → Return "Processing..." to user
      → Retry in background every 5 minutes
      → Once Payment API recovers, process queued transactions
      → User notified when transaction completes (24 hours)
```

**Success Criteria**:

- Degradation strategy explicit (not ad-hoc)
- Features prioritized (core vs. secondary)
- Timeouts and retries configured
- Fallback behavior tested
- Users not harmed by degradation (misleading results avoided)
- Recovery tested and measured

---

### Dependencies: External Service Performance

**CHK-054-Performance-Dependencies**

**Question**: Are third-party dependencies and their performance impact documented?

**Guidance**: For each external service:

- **Performance characteristics**:
  - Latency: P95, P99, max? (e.g., "Stripe API p95=200ms")
  - Throughput: RPS capacity? (e.g., "100 RPS")
  - Availability: SLA (e.g., "99.9% uptime")
  - Failover time: How long to detect and retry? (e.g., "5-10 seconds")

- **Usage in feature**:
  - Is it on critical path? (user waits for response)
  - Is it cached? (reduce calls)
  - Can it fail gracefully? (fallback behavior)
  - Timeout: How long to wait before giving up?

- **Cost impact**:
  - Price per request? (e.g., Stripe: $0.029 per transaction)
  - Volume per day? (e.g., 10,000 transactions → $290/day)
  - Budget planning: Can we afford the volume?

- **Testing in test environment**:
  - Can we test against real API? (staging keys?)
  - Or must we mock? (how to mock latency, errors?)
  - Rate limit errors: Are we testing for 429 responses?

Example:
"Stripe API: p95=200ms, p99=500ms. Used for checkout (critical path). Timeout: 30s. Retry: exponential backoff, max 3 times. Fallback: if after 3 retries still fails, queue transaction for manual processing. Cost: 2.9% + $0.30 per transaction, ~$1000/month at current volume."

**Success Criteria**:

- External dependencies identified
- Performance impact documented
- Timeouts appropriate (not too long)
- Failover and retry strategies defined
- Costs tracked and within budget
- Load testing includes failure scenarios

---

### Ambiguities: Performance vs. Cost Tradeoffs

**CHK-055-Performance-Ambiguities**

**Question**: Are performance vs. cost tradeoffs documented?

**Guidance**: Specify tradeoffs explicitly:

- **Caching decision**:
  - ✅ Trade: CPU load (lower) vs. memory (higher)
  - ✅ Trade: Freshness (lower) vs. consistency (higher)
  - ❌ Vague: "Cache aggressively"

- **Database optimization**:
  - ✅ Trade: Query latency (lower) vs. index maintenance (higher)
  - ✅ Trade: Denormalization (faster queries) vs. consistency (harder updates)
  - ❌ Vague: "Optimize for speed"

- **Infrastructure scaling**:
  - ✅ Trade: Responsiveness (faster) vs. cost (higher)
  - ✅ Trade: Availability (higher with more instances) vs. cost (higher)
  - ❌ Vague: "Ensure high availability"

- **Compression**:
  - ✅ Trade: Bandwidth (lower) vs. CPU (higher for compression/decompression)
  - ✅ Trade: Network round-trip (lower) vs. compute latency (higher)

- **CDN usage**:
  - ✅ Trade: Latency (lower) vs. cost (higher CDN fees)
  - ✅ Trade: Origin load (lower) vs. cache invalidation complexity (higher)

Cost-benefit analysis:

- What's the benefit? (e.g., "Reduce latency from 500ms to 100ms")
- What's the cost? (e.g., "$10k/month CDN, 2 weeks implementation")
- Is it worth it? (e.g., "Yes, improves conversion rate by 2% = $50k/month revenue impact")

Explicit decisions:

```
Decision: Use Redis for session caching
  Benefit: Reduce database load, faster session retrieval (~10ms vs 100ms)
  Cost: $500/month Redis instance, 1 week implementation
  Tradeoff: Memory usage (can hold ~1M sessions), cache consistency risk (data loss on failover)
  Approved by: CTO, prioritized for Q3
```

Documented rejections:

```
Rejected: Use GraphQL to reduce API calls
  Reason: Development time (8 weeks) > value for current load
  Decision: Revisit when API calls approach rate limits
  Owner: backend team
```

**Success Criteria**:

- Tradeoffs explicitly documented (not hidden)
- Cost-benefit analysis done
- Decisions approved and tracked
- Rejected alternatives recorded (why not?)
- Revisit criteria: When to reconsider decision?

---

### Ambiguities: SLO Definition and Breach Response

**CHK-056-Performance-Ambiguities**

**Question**: Are Service Level Objectives (SLOs) defined and breach response documented?

**Guidance**: Define SLOs:

- **Availability SLO**: e.g., "99.9% uptime"
  - Meaning: Max 43 minutes downtime per month
  - Measured: Uptime checks from multiple regions
  - Excluded: Planned maintenance, user error (misconfiguration)
  - Breach response: Post-mortem, RCA, preventive measures

- **Latency SLO**: e.g., "p95 < 200ms"
  - Measured: Real user requests, not synthetic
  - Threshold: p95 (95% of requests meet target)
  - Breach: If p95 > 200ms for >5 minutes
  - Response: Investigate, scale up, optimize

- **Error rate SLO**: e.g., "<0.1% error rate"
  - Measured: 5xx errors / total requests
  - Threshold: 0.1% = 1 error per 1000 requests
  - Excluded: 4xx errors (client errors, not service)
  - Breach response: Alert oncall, investigate

SLO-based alerting:

```
Availability SLO: 99.9% monthly uptime = 43.2 minutes downtime budget
  - If 30 minutes downtime in first 10 days → 13.2 minutes left for month
  - Don't release risky changes (high deploy failure risk)
  - Prioritize stability

Latency SLO breach:
  - Alert threshold: p95 > 200ms for 5 minutes
  - Action: Page oncall, investigate, scale if needed
  - Post-mortem: If recurring, find root cause
```

SLO attainment reporting:

```
September 2024:
  - Availability: 99.92% (12 min downtime, vs 43.2 min budget) → PASS
  - Latency p95: 145ms avg (vs 200ms target) → PASS
  - Error rate: 0.08% (vs 0.1% target) → PASS
  
Month Summary: 3/3 SLOs met. Error SLO closest to breach (only 0.02% margin).
```

Breach response:

- Incident commander assigned
- Root cause analysis required
- Preventive measures documented
- SLO credit to customers? (if commercial SLA)
- Blame-free post-mortem

**Success Criteria**:

- SLOs quantified (not vague)
- SLOs achievable with planned infrastructure
- Measurement method clear and automated
- Alerts triggered for breaches
- Breach response documented
- SLO attainment tracked monthly
- Post-mortems on recurring breaches

---

## Documentation

All 18 Performance-specific items extend the base 40-45 item checklist. When generating a Performance variant:

1. Include all base template items (completeness, clarity, consistency, measurability, scenario coverage, edge cases, dependencies, ambiguities)
2. Add these 18 Performance-specific items
3. **Total for Performance variant**: ~58-63 items (40-45 base + 18 Performance-specific)

### Composition Rules

- Performance variant items use consistent ID format: `CHK-###-Performance-{Dimension}`
- Items are organized by dimension (Completeness, Clarity, Consistency, etc.)
- Performance-specific items do not duplicate base template questions
- Overlap is intentional (e.g., "resource constraints" in base + "performance metrics" in Performance) but from different perspectives

### When to Use Performance Variant

Use the Performance variant checklist when:

- ✅ Specification includes performance targets (latency, throughput)
- ✅ Scalability and load handling are requirements
- ✅ User experience depends on responsiveness
- ✅ Cost is sensitive to resource consumption
- ✅ System must handle growth (capacity planning)

Do not use Performance variant for:

- ❌ Internal batch jobs (performance less critical)
- ❌ Low-traffic features or one-time operations
- ❌ Specifications without specific performance targets
- ❌ Hardware-only concerns (no software optimization possible)

---

*Built by 🧱 LightSpeedWP with ☕ and performance precision*

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

### Scenario Coverage: Connection Pool and Resource Limits

**CHK-057-Performance-Scenario-Coverage**

**Question**: Are database connection pools, thread pools, and resource limits configured and documented?

**Guidance**: Document:

- **Connection pools**: Database connection management
  - Pool size: how many connections? (e.g., min=10, max=100)
  - Connection timeout: how long to wait for available connection?
  - Idle timeout: when are idle connections closed? (e.g., 5 minutes)
  - What happens when pool is exhausted? (queue, error, fail-fast)
- **Thread pools**: Application thread management
  - Thread count: worker threads for async operations? (e.g., 50-200)
  - Queue depth: max queued tasks? (e.g., 1000)
  - Rejection policy: what happens when queue is full? (reject, queue, or throttle)
- **Memory limits**: Heap size, cache limits
  - Java heap: max -Xmx? (e.g., 2GB)
  - Cache size: LRU cache limits? (e.g., 10k items max)
  - Spill-to-disk: if cache exceeds memory, spill to disk? (performance impact)
- **Rate limiting**: Request throttling
  - Token bucket: N requests per minute/hour
  - Sliding window: N requests in last 60 seconds
  - Per-user limits: different limits for premium vs. free users?
  - Backpressure: queue excess requests or reject with 429?
- **Monitoring**: Are resource utilization metrics tracked?
  - Connection pool usage: % full? Rejects per hour?
  - Thread pool queue depth: avg queue size?
  - Memory pressure: GC frequency, pause time?
  - Rate limit hits: how many requests throttled per hour?

**Success Criteria**:

- Pool and thread sizes appropriate for expected load
- Limits defined and tested under stress
- Monitoring detects saturation early
- Graceful degradation (queue or reject) not crash
- Capacity planning based on metrics

---

### Edge Cases: Traffic Spikes and Graceful Degradation

**CHK-058-Performance-Edge-Cases**

**Question**: How does system behave under traffic spikes? What degrades gracefully?

**Guidance**: Document:

- **Traffic spike definition**: What's considered a spike?
  - Normal: 100 req/s. Spike: 500 req/s (5x)
  - How often are spikes expected? (daily peak, seasonal events)
- **Graceful degradation**: What can be turned off under load?
  - Cache warming: skip on overload
  - Analytics logging: skip detailed logging
  - Non-critical features: feature flags to disable under load
  - Search indexing: defer until load subsides
- **Fallback strategies**: If primary system overloaded
  - Read-through cache: serve stale data if fresh data unavailable
  - Circuit breaker: if external service slow, use fallback
  - Timeout reduction: reduce timeouts under load
  - Load shedding: reject lowest-priority requests
- **Scaling response**: How quickly can system scale?
  - Auto-scaling: how long to provision new instance? (1-5 minutes?)
  - Manual escalation: when to page on-call engineer? (2x threshold)
- **Testing under spikes**: Validated via load testing?
  - Ramp test: gradually increase load, verify response time
  - Spike test: sudden 10x load, observe behavior
  - Soak test: sustained load for 24+ hours, check for leaks
  - Chaotic test: random spikes, verify system doesn't break

**Success Criteria**:

- Spike handling strategy documented
- Graceful degradation mechanisms identified
- Load testing validates spike handling
- Auto-scaling works as expected
- Monitoring alerts on overload conditions

---

### Measurability: Cost per Transaction and Resource Efficiency

**CHK-059-Performance-Measurability**

**Question**: Are cost targets and resource efficiency metrics defined?

**Guidance**: Document:

- **Cost per transaction**: What's the cost to process one request?
  - Compute: CPU time × hourly rate
  - Storage: data stored × monthly rate
  - Network: bandwidth × monthly rate
  - Example: "Each API call costs ~$0.001 (compute + storage + network)"
- **Cost scaling**: How does cost scale with load?
  - Linear: cost doubles when load doubles (efficient, auto-scaling works)
  - Quadratic: cost quadruples when load doubles (inefficient, n^2 algorithms)
  - Example: "Database query is O(n log n), cost scales linearly with dataset size"
- **Resource efficiency targets**: CPU, memory, disk usage
  - CPU utilization: target <70% under normal load (headroom for spikes)
  - Memory: target <75% of heap (room for GC, temporary allocations)
  - Disk: target <80% full (room for growth, snapshots)
- **Benchmarks**: Measured cost vs. targets
  - Measure: run production workload, sample costs monthly
  - Report: cost per transaction, cost per GB stored, cost per concurrent user
  - Target: cost should decrease with optimizations
- **Cost anomalies**: How are unexpected costs detected?
  - Alert if cost/transaction increases >10% month-over-month
  - Root cause: query became slower? Load increased? New feature?
  - Optimization: reduce cost by caching, indexing, or algorithmic improvement

**Success Criteria**:

- Cost targets quantified (not vague)
- Cost per transaction measured
- Resource efficiency tracked
- Cost anomalies trigger investigation
- Optimization roadmap based on cost data

---

### Dependencies: Third-Party Service Performance

**CHK-060-Performance-Dependencies**

**Question**: Are SLAs for third-party services documented? How are delays handled?

**Guidance**: Document:

- **Third-party SLAs**: What performance guarantees do they provide?
  - Uptime: "99.9% availability" (4 9s = 43 minutes downtime/month)
  - Latency: "p95 < 200ms", "p99 < 1 second"
  - Throughput: "1000 requests/sec"
  - Example: AWS S3 "99.99% uptime, p99 latency <100ms"
- **Dependency impact**: How does external delay affect your system?
  - Cascading: if third-party slow, does your system become slow? (bad)
  - Isolated: can you retry, cache, or degrade gracefully? (good)
  - Example: "Payment gateway timeout → use cached billing data, retry later"
- **Fallback and retry strategy**: What if third-party is unavailable?
  - Timeout: how long to wait? (e.g., 5 second timeout)
  - Retry: exponential backoff? (2s, 4s, 8s, 16s)
  - Fallback: use cached/stale data? Return error to user? Queue for later?
- **SLA credits**: If third-party violates SLA, do you get credits?
  - Example: AWS credits 10% monthly fee if <99.9% uptime
  - Your SLA to customers: "Our SLA is 99% (one 9) because we depend on third-party 99.9%"
- **Monitoring third-party performance**: How are delays detected?
  - Synthetic monitoring: ping third-party regularly, measure latency
  - Real monitoring: measure actual API call latencies
  - Alert: if p95 latency >400ms, investigate

**Success Criteria**:

- Third-party SLAs documented and understood
- Dependency impact on your SLA quantified
- Fallback strategy for unavailability
- Your SLA accounts for third-party SLAs
- Monitoring detects third-party performance issues

---

### Consistency: Performance Trade-Offs and Feature Flags

**CHK-061-Performance-Consistency**

**Question**: Are performance trade-offs documented? How are optimizations prioritized?

**Guidance**: Document:

- **Performance vs. accuracy**: Which is more important?
  - Exact: "Calculate user's total purchase history (might take 5 seconds)"
  - Approximate: "Show cached estimate (instant, but may be stale by 1 hour)"
  - Decision: For shopping cart, accuracy wins. For analytics, approximation OK.
- **Performance vs. cost**: Which is more important?
  - Fast query: full-text search index (more storage, more cost)
  - Slow query: scan table (less cost, slow)
  - Decision: For customer-facing features, speed wins. For internal reports, cost.
- **Performance vs. freshness**: Which is more important?
  - Fresh: query latest data from DB (every time, might be slow)
  - Stale: serve cached data (fast, but might be 5 minutes old)
  - Decision: For profiles, freshness. For trending list, cache OK.
- **Feature flags for optimization**: Can optimizations be toggled?
  - A/B test: 50% new (optimized) vs. 50% old (safe)
  - Rollout: enable for 10% users first, then 100%
  - Rollback: if optimization breaks, disable instantly
- **Measuring trade-offs**: How do you know if trade-off is acceptable?
  - Metric: latency, cost, accuracy, freshness
  - Target: "Reduce latency from 1s to 100ms is worth 5% higher cost"
  - Validation: measure and compare before/after

**Success Criteria**:

- Performance trade-offs explicitly documented
- Each trade-off has clear rationale
- Feature flags enable safe rollout of optimizations
- Metrics demonstrate trade-off is beneficial
- Clear rollback strategy if optimization fails

---

### Ambiguities: Warm-Up and Cold-Start Performance

**CHK-062-Performance-Ambiguities**

**Question**: Is cold-start performance acceptable? How is warm-up handled?

**Guidance**: Document:

- **Cold-start latency**: Performance on first request after restart
  - JVM startup: classloading, JIT compilation, initialization
  - Database: connection pool initialization
  - Cache: cache is empty, all requests miss
  - Typical cold-start: 10-30 seconds worse than steady-state
- **Warm-up time**: How long until system reaches steady-state?
  - After restart, requests are slow until caches warm up
  - Example: "Cold-start p50=5s, p95=15s. After 5 minutes, p50=100ms, p95=300ms"
- **Is cold-start acceptable?**: Depends on use case
  - Production SLA: if yes, must include cold-start in SLO
  - Scale-up: if auto-scaling, cold-start must not violate SLA
  - Example: "p95 latency <500ms even on cold-start"
- **Warm-up strategies**: How to reduce cold-start impact?
  - Request routing: send new instances warm-up requests before routing traffic
  - Connection pool: pre-warm connections during startup
  - Cache pre-load: load common data into cache
  - JVM tuning: class pre-loading, AOT compilation (GraalVM)
- **Startup validation**: How do you verify system is ready?
  - Health check: /health endpoint returns 200 OK?
  - Readiness probe: specific endpoints ready? (DB connection, cache populated)
  - Liveness probe: process alive? (prevents zombie instances)

**Success Criteria**:

- Cold-start performance measured and acceptable
- Warm-up time documented
- SLOs account for cold-start behavior
- Warm-up strategies tested
- Health checks ensure system is ready before traffic

---

### Ambiguities: Performance Test Data and Realism

**CHK-063-Performance-Ambiguities**

**Question**: Are performance tests realistic? How does test data represent production?

**Guidance**: Document:

- **Test data size**: Does test data match production scale?
  - Production: 100M users, 10B transactions
  - Test: 10M users, 1B transactions (10% of production)
  - Concern: performance may not scale linearly (algorithms, indexes, memory)
- **Test data distribution**: Does data have realistic distribution?
  - Production: most users have 0-10 orders, few have 1000+
  - Test: all users have exactly 100 orders (unrealistic)
  - Impact: queries might behave differently on skewed data
- **Test workload**: Does load pattern match production?
  - Production: peak 10k req/s at 2pm, off-peak 100 req/s at 3am
  - Test: constant 1k req/s all day (unrealistic peak behavior)
  - Impact: caching, batching strategies might not be stress-tested
- **Test infrastructure**: Does test environment match production?
  - Different: test on laptop (8 cores) vs. production (128 cores)
  - Different: test database single instance vs. production sharded
  - Gap: performance may not transfer to production
- **Performance anomalies**: Are production-only issues considered?
  - Network latency: production has real network, test on localhost
  - Disk I/O: test uses SSD, production uses HDD
  - Garbage collection: test on small heap, production on large heap (different GC behavior)
  - Contention: test has 1 concurrent user, production has 10k

**Success Criteria**:

- Test data size representative of production
- Data distribution realistic (skewed, not uniform)
- Load patterns include peak and off-peak scenarios
- Test environment reflects production infrastructure
- Test results validated against production metrics

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

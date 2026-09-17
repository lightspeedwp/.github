# API Requirements Quality Variant

> Domain-specific extension of the base Requirements Quality Checklist (8 dimensions) with API-focused items

**Domain**: API (REST/GraphQL Interfaces, Backend Services, Data Contracts)  
**Use When**: Specification describes API endpoints, data exchanges, backend services, or integration points  
**Base Template**: Add these items to the standard 40-45 base items

---

## API-Specific Items (18 items)

### Completeness: All Endpoints and Methods Documented

**CHK-046-API-Completeness**

**Question**: Are all API endpoints, HTTP methods, and request/response paths documented?

**Guidance**: For each endpoint, document:

- **Endpoint path**: `/api/v1/users/{id}`, `/api/v1/products`, etc.
- **HTTP method**: GET, POST, PUT, PATCH, DELETE, HEAD
- **Purpose**: What does this endpoint do? (e.g., "Retrieve user by ID", "Create new product")
- **Request**: Path parameters, query parameters, request body (with schema)
- **Response**: HTTP status codes, response body (with schema), headers
- **Authentication**: What auth is required? (API key, OAuth, bearer token, etc.)
- **Rate limits**: Requests per minute/hour? Quota limits?

Create endpoint inventory:

| Path | Method | Purpose | Auth | Rate Limit |
|------|--------|---------|------|-----------|
| /api/v1/users | GET | List users | Bearer | 100/min |
| /api/v1/users | POST | Create user | Bearer | 10/min |
| /api/v1/users/{id} | GET | Get user | Bearer | 100/min |

Document error responses:

- 400 (Bad Request): Invalid parameters
- 401 (Unauthorized): Invalid credentials
- 403 (Forbidden): Insufficient permissions
- 404 (Not Found): Resource not found
- 500 (Server Error): Server error

**Success Criteria**:

- All endpoints documented
- All HTTP methods specified
- Request/response schemas complete
- Error responses defined
- Rate limits specified
- Authentication required for each endpoint

---

### Completeness: Edge Cases in API Behavior

**CHK-047-API-Completeness**

**Question**: Are edge cases in API behavior documented (pagination, filtering, sorting, partial responses)?

**Guidance**: Specify:

- **Pagination**: How are large result sets handled?
  - Example: `?page=1&limit=20` or cursor-based `?cursor=abc123`
  - Response format: `{ data: [...], nextCursor: "..." }` or `{ items: [...], total: 100, page: 1 }`
- **Filtering**: Which fields can be filtered? How?
  - Example: `/users?status=active&createdAfter=2024-01-01`
- **Sorting**: Supported sort fields? Ascending/descending?
  - Example: `?sort=createdAt&order=desc`
- **Partial responses**: Can client request only specific fields?
  - Example: `/users/123?fields=id,name,email` (vs. full user object)
- **Default behavior**: If no parameters specified, what's the default?
  - Example: "Default limit=20 items, sort by createdAt descending"

Document limits:

- Max page size? (e.g., max 100 items per request)
- Max request size? (e.g., max 10MB payload)
- Max query complexity? (for GraphQL)
- Timeout? (e.g., requests timeout after 30 seconds)

**Success Criteria**:

- Pagination approach documented
- Filter and sort capabilities specified
- Default behaviors explicit
- Limits and constraints documented
- Edge cases tested (empty results, large datasets, etc.)

---

### Clarity: Request and Response Schemas

**CHK-048-API-Clarity**

**Question**: Are request and response schemas precisely defined (JSON Schema, OpenAPI, or GraphQL)?

**Guidance**: Use schema definition format:

- **JSON Schema**: Define object structure with types, required fields, validation rules
- **OpenAPI/Swagger**: YAML/JSON spec for REST APIs (includes endpoint, params, responses)
- **GraphQL Schema**: GraphQL IDL defining queries, mutations, types, input types

For each request/response:

```json
{
  "name": "User",
  "type": "object",
  "required": ["id", "email", "createdAt"],
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "email": { "type": "string", "format": "email" },
    "name": { "type": "string", "minLength": 1, "maxLength": 255 },
    "age": { "type": "integer", "minimum": 0, "maximum": 150 },
    "status": { "type": "string", "enum": ["active", "inactive", "suspended"] },
    "createdAt": { "type": "string", "format": "date-time" }
  }
}
```

Document:

- Data types (string, integer, boolean, array, object)
- Required vs. optional fields
- Field constraints (minLength, maxLength, minimum, maximum, pattern, enum)
- Nested objects and array item types
- Null handling (is null allowed? when?)
- Validation rules (email format, UUID format, regex patterns)

Example:
"POST /api/v1/users request: `{ email (required, string, email format), name (required, string, 1-255 chars), age (optional, integer, 0-150) }`. Response: `{ id (UUID), email, name, age, createdAt (ISO 8601), status (enum: active|inactive) }`"

**Success Criteria**:

- Schemas are formally defined (not prose descriptions)
- All fields have types
- Constraints are explicit (min/max, enum, patterns)
- Required/optional clearly marked
- Null behavior documented
- Schemas are machine-readable (JSON Schema, OpenAPI, GraphQL)

---

### Clarity: Error Response Format and Messages

**CHK-049-API-Clarity**

**Question**: Is the error response format consistent and messages are developer-friendly?

**Guidance**: Define error response format:

```json
{
  "error": {
    "code": "INVALID_EMAIL",
    "message": "Email address is invalid",
    "details": {
      "field": "email",
      "value": "not-an-email",
      "constraint": "email-format"
    },
    "timestamp": "2024-09-17T10:30:00Z",
    "requestId": "req_abc123xyz"
  }
}
```

Specify:

- **Error code**: Machine-readable code (not HTTP status), e.g., "RATE_LIMIT_EXCEEDED", "INVALID_EMAIL"
- **Message**: Human-readable explanation
- **Details**: Additional context (field name, constraint violated, etc.)
- **Timestamp**: When error occurred
- **Request ID**: For debugging and logs
- **HTTP status code**: Standard HTTP code (400, 401, 404, 429, 500)

Document error scenarios:

| Scenario | HTTP Status | Error Code | Message |
|----------|------------|-----------|---------|
| Missing required field | 400 | MISSING_FIELD | "Required field missing: email" |
| Invalid email format | 400 | INVALID_EMAIL | "Email address is invalid" |
| Duplicate email | 409 | DUPLICATE_EMAIL | "Email already registered" |
| Rate limit exceeded | 429 | RATE_LIMIT_EXCEEDED | "Too many requests. Retry after 60 seconds" |
| Not authenticated | 401 | UNAUTHORIZED | "Invalid or missing API key" |
| Permission denied | 403 | FORBIDDEN | "Insufficient permissions to update user" |
| Server error | 500 | INTERNAL_ERROR | "An unexpected error occurred" |

**Success Criteria**:

- Error format is consistent across all endpoints
- Error codes are descriptive
- Messages are actionable for developers
- All status codes documented
- Error scenarios tested

---

### Measurability: API Performance SLOs and Metrics

**CHK-050-API-Measurability**

**Question**: Are API performance SLOs and measurable metrics defined?

**Guidance**: Document:

- **Latency SLO**: p95 and p99 latency targets (e.g., "p95: <200ms, p99: <500ms")
  - Different SLOs for different endpoints if needed (fast read vs. slow batch operation)
- **Throughput**: Requests per second capacity (e.g., "100 RPS", "1000 concurrent connections")
- **Availability SLO**: Uptime target (e.g., "99.5% uptime", "max 4 hours downtime/month")
- **Error rate SLO**: Max acceptable error rate (e.g., "<0.1% error rate")
- **Timeout**: Request timeout duration (e.g., "30 second timeout")

Measurable metrics:

| Metric | Target | Measurement |
|--------|--------|-------------|
| P95 Latency | <200ms | Measured continuously via monitoring |
| P99 Latency | <500ms | Measured continuously via monitoring |
| Availability | 99.5% | Uptime monitoring (4 9s = 99.99%) |
| Error Rate | <0.1% | Error count / total requests |
| Throughput | 1000 RPS | Concurrent users × request frequency |

Include monitoring and alerting:

- Which metrics are monitored?
- When are alerts triggered? (e.g., p95 > 500ms for 5 minutes)
- How are SLOs reported? (dashboards, reports, alerts)

**Success Criteria**:

- All SLOs numerically defined
- Metrics are measurable (not vague)
- Monitoring and alerting in place
- SLOs achievable with planned infrastructure
- Performance validated in testing

---

### Scenario Coverage: Authentication and Authorization

**CHK-051-API-Scenario-Coverage**

**Question**: Are authentication mechanisms and authorization rules documented for all endpoints?

**Guidance**: Specify:

- **Authentication type**:
  - API key: `Authorization: Bearer api_key_abc123`
  - OAuth 2.0: Bearer token, refresh token flow
  - Basic auth: Username/password (HTTP Basic)
  - Mutual TLS: Certificate-based auth
  - Session-based: Cookie with session ID
  
- **Token format**: JWT (JSON Web Token)? Opaque string? (document claims/data in JWT)

- **Expiration**: How long is token valid? (e.g., 1 hour access token, 30-day refresh token)

- **Authorization rules**: Which roles/permissions are required for each endpoint?

Example:

```
GET /api/v1/users — public (no auth)
GET /api/v1/users/{id} — authenticated (any logged-in user)
PUT /api/v1/users/{id} — owner or admin (user can only update self, unless admin)
DELETE /api/v1/users/{id} — admin only
```

Document:

- What if auth header missing? (401 Unauthorized)
- What if token expired? (401 with "token expired" code)
- What if user lacks permissions? (403 Forbidden)
- How to refresh tokens? (POST /auth/refresh)
- How to log out? (revoke token, clear session?)

Scope/permission model:
"Scopes: read (fetch data), write (create/update), delete (remove data). User has scopes based on role: viewer=read only, editor=read+write, admin=all."

**Success Criteria**:

- Authentication method specified
- Authorization rules explicit per endpoint
- Token lifecycle documented
- Error scenarios for auth failures defined
- Security tested (token expiration, permission enforcement)

---

### Scenario Coverage: Rate Limiting and Throttling

**CHK-052-API-Scenario-Coverage**

**Question**: Are rate limits, throttling, and quota mechanisms documented?

**Guidance**: Specify rate limiting for each endpoint or endpoint class:

```
GET /api/v1/users — 100 requests per minute per API key
POST /api/v1/users — 10 requests per minute per API key
GET /api/v1/products — 1000 requests per minute (public, no limits)
```

Document:

- **Rate limit type**: Per API key, per user, per IP, per account?
- **Limit frequency**: Per second, per minute, per hour, per day?
- **Burst allowance**: Is there burst capacity? (e.g., 10 RPS sustained, 50 RPS burst)
- **Quota reset**: When does quota reset? (hourly, daily, rolling window?)
- **Rate limit headers**: HTTP headers indicating limits?
  - Example: `X-RateLimit-Limit: 100`, `X-RateLimit-Remaining: 50`, `X-RateLimit-Reset: 1630000000`

Throttling behavior:

- What happens at limit? (429 Too Many Requests response)
- Retry strategy: Exponential backoff? (wait 1s, 2s, 4s...)
- Retry-After header: How long to wait before retrying?

Example response:

```
HTTP 429 Too Many Requests
Content-Type: application/json
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1630001000
Retry-After: 60

{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Retry after 60 seconds"
  }
}
```

**Success Criteria**:

- Rate limits documented per endpoint
- Limits are published to clients
- HTTP headers indicate remaining quota
- Retry behavior specified
- Rate limiting enforced in production

---

### Scenario Coverage: Backwards Compatibility and Versioning

**CHK-053-API-Scenario-Coverage**

**Question**: Is API versioning strategy documented? How are breaking changes handled?

**Guidance**: Choose versioning approach:

- **URL-based**: `/api/v1/users`, `/api/v2/users` (different endpoints for versions)
- **Header-based**: `Accept: application/vnd.api+json;version=2` (same endpoint, version in header)
- **Query param-based**: `/api/users?version=2` (same endpoint, version in query)

Document:

- **Current stable version**: e.g., "v1 is stable, v2 is beta, v3 is deprecated"
- **Breaking change policy**:
  - What constitutes a breaking change? (new required field, removed field, changed behavior)
  - When are breaking changes introduced? (major version bump only)
  - How long is old version supported? (e.g., "v1 support ends 2024-12-31")
  - Deprecation notice: How are clients notified of deprecations?

Example:
"API v1 (current): all new features, bug fixes. v1 support until 2024-12-31. v0 (deprecated): no updates, support ends 2024-06-30. Deprecation notice: added via HTTP header `Deprecation: true` and response body note."

Non-breaking changes (safe):

- Adding optional fields to response
- Adding new optional query parameters
- Adding new endpoints (don't modify existing)
- Adding optional request headers

Breaking changes (require version bump):

- Removing a field from response
- Changing field type (string → integer)
- Making optional field required
- Changing endpoint behavior
- Removing endpoints

**Success Criteria**:

- Versioning strategy explicit
- Breaking changes clearly defined
- Deprecation timeline specified
- Clients notified of version changes
- Old versions supported for documented period

---

### Edge Cases: Concurrent Updates and Conflict Resolution

**CHK-054-API-Edge-Cases**

**Question**: How are concurrent updates and data conflicts handled?

**Guidance**: Specify conflict resolution:

- **Optimistic locking**: Use version/ETag headers to detect conflicts
  - Example: `If-Match: "v2"` header with ETag response header
  - On conflict: 409 Conflict response
  - Client must re-fetch, merge changes, retry with new ETag
  
- **Last-write-wins**: Latest update overwrites previous (risky for concurrent edits)

- **Merge strategy**: How are conflicting changes merged? (for data records)

- **Conflict resolution API**: Endpoint to resolve conflicts?

Example:

```
GET /api/v1/users/123 — returns ETag: "abc123"

PUT /api/v1/users/123 with If-Match: "abc123"
— If ETag matches: update succeeds, returns new ETag
— If ETag doesn't match: 409 Conflict, return current version

Client logic:
1. Fetch user (ETag: abc123)
2. User A updates (ETag: abc123 → def456)
3. User B tries update (If-Match: abc123) → 409 Conflict
4. User B re-fetches (ETag: def456), merges changes, retries (If-Match: def456) → success
```

Document:

- Conflict detection mechanism (version, ETag, timestamp)
- How conflicts are prevented vs. resolved
- Is merge automatic or manual?
- User notification of conflicts

**Success Criteria**:

- Concurrent update handling documented
- Conflict detection and resolution specified
- Clients can detect conflicts
- Merge strategy is clear
- Data integrity maintained under concurrent writes

---

### Dependencies: External Service Dependencies

**CHK-055-API-Dependencies**

**Question**: Are all external API dependencies and integrations documented?

**Guidance**: For each external API call:

- **Service name and vendor**: e.g., "Stripe Payment API"
- **Endpoint**: e.g., "api.stripe.com/v1/charges"
- **Authentication**: API key? OAuth? Mutual TLS?
- **Rate limits**: Requests per second/minute limits
- **Timeout**: How long to wait for response?
- **Retry behavior**: Retry on failure? Exponential backoff?
- **Fallback**: What if service is unavailable?
- **Cost**: Pricing model? Usage-based? Request-based?
- **SLA**: Uptime guarantee? Downtime limits?
- **Alternatives**: Is there a backup service?

Document integration points:

- Which features depend on this service?
- What happens if service is down?
- Is service optional or required?

Example:
"Stripe API v1 (api.stripe.com): POST /v1/charges creates payment. Auth: Bearer stripe_secret_key_xyz. Rate limit: 100 requests/sec. Timeout: 30 sec. Retry: exponential backoff (1s, 2s, 4s) on timeout. Fallback: if Stripe unavailable after 3 retries, return 503 Service Unavailable (user can retry later). Cost: 2.9% + $0.30 per transaction."

**Success Criteria**:

- All external dependencies documented
- Rate limits and timeouts specified
- Fallback strategies defined
- Cost implications documented
- Integration tested (success and failure cases)

---

### Dependencies: Data Storage and Database

**CHK-056-API-Dependencies**

**Question**: Are database requirements, storage solutions, and data persistence documented?

**Guidance**: Document:

- **Database type**: PostgreSQL, MongoDB, DynamoDB, etc.
- **Version requirements**: Minimum/recommended versions
- **Schema**: Database tables, indexes, relationships
- **Data models**: How is data structured?
- **Backups**: Backup frequency? Retention? Recovery time?
- **Capacity**: Storage capacity needed? Growth projections?
- **Scaling**: How does database scale? (sharding, replication, clustering)
- **Data retention**: How long is data kept? (compliance, cost)
- **Encryption**: Data at rest? Data in transit? Key management?

Example:
"PostgreSQL 13+. Schema: users table (id, email, name, created_at), products table (id, name, price, stock). Indexes on email, product_id. Daily backups retained for 30 days. Max 1TB storage. Replicated to standby for HA. Encryption at rest (AES-256). GDPR: data deletion for GDPR right-to-be-forgotten."

Document backup/recovery:

- Recovery Time Objective (RTO): How long to restore? (e.g., <1 hour)
- Recovery Point Objective (RPO): Max acceptable data loss? (e.g., <5 minutes)

**Success Criteria**:

- Database technology and version specified
- Schema documented
- Capacity and scaling approach documented
- Backup and recovery strategy defined
- Data retention and compliance documented
- Database availability and replication specified

---

### Ambiguities: Idempotency and Side Effects

**CHK-057-API-Ambiguities**

**Question**: Which operations are idempotent and which have side effects?

**Guidance**: Classify operations:

- **Idempotent**: Same request can be safely retried without side effects
  - GET: Always idempotent (fetch data, no changes)
  - PUT: Should be idempotent (replace entire resource)
  - DELETE: Usually idempotent (delete same resource twice = OK)
  
- **Non-idempotent**: Repeated requests cause problems
  - POST: Usually creates new resource each time (duplicate charges!)
  - PATCH: Can have side effects (increment counter twice)

For non-idempotent operations, specify idempotency key:

- Client provides unique `Idempotency-Key: uuid` header
- Server stores request/response mapping
- Duplicate request (same key) returns cached response
- Key expires after 24 hours

Example:

```
POST /api/v1/charges
Idempotency-Key: txn_abc123xyz
Content-Type: application/json

{ "amount": 100, "currency": "usd", "source": "src_visa" }

— First request: processes charge, returns 200 with charge ID
— Retry with same Idempotency-Key: returns 200 with SAME charge ID (not duplicate)
```

Document:

- Which operations are idempotent?
- Which operations require idempotency key?
- How long are keys retained?
- What if request fails (network error)? Can it be safely retried?

**Success Criteria**:

- Idempotency documented per operation
- Idempotency keys used for non-idempotent operations
- Duplicate prevention working
- Clients can safely retry failed requests
- Tested with concurrent/retried requests

---

### Ambiguities: Data Format and Serialization

**CHK-058-API-Ambiguities**

**Question**: Are data formats, serialization, and encoding clearly specified?

**Guidance**: Document:

- **Content-Type**: `application/json` (typical), `application/xml`, `text/csv`, `application/protobuf`
- **Character encoding**: UTF-8 (standard), others?
- **Date/time format**: ISO 8601 (standard): `2024-09-17T10:30:00Z`
  - Not: US date format (9/17/2024), Unix timestamp (1694957400)
- **Number format**: JSON numbers (no quotes), or string decimals for precision?
- **Boolean**: `true`/`false` (JSON standard), not `"true"`/`"false"` (strings)
- **Null values**: `null` or omit field? (be consistent)
- **Empty collections**: `[]` (empty array) or `null`? (be consistent)
- **Currency/monetary**: How are prices represented? (cents as integer, or string with decimal)
  - Example: $10.99 → 1099 (cents, integer) or "10.99" (string with 2 decimals)

Example:
"All requests/responses: `Content-Type: application/json; charset=utf-8`. Dates: ISO 8601 (e.g., '2024-09-17T10:30:00Z'). Currencies: integer cents (e.g., 1099 = $10.99). Booleans: JSON true/false. Nulls: included as null (never omitted). Empty arrays: [] (not null)."

Potential ambiguities to clarify:

- What if field value is null? Is field present with null value, or omitted entirely?
- For JSON arrays, are duplicate items allowed?
- For object properties, are unknown/extra properties allowed?

**Success Criteria**:

- Data formats formally specified
- Serialization format explicit (JSON, XML, etc.)
- Date/time format standardized (ISO 8601)
- Encoding specified (UTF-8)
- Special values (null, empty, zero) handled consistently
- Format respected across all endpoints

---

### Ambiguities: Pagination Cursor vs. Offset

**CHK-059-API-Ambiguities**

**Question**: Is pagination approach clear (offset-based or cursor-based)? How are results ordered?

**Guidance**: Choose pagination approach:

**Offset-based pagination**:

```
GET /api/v1/users?skip=20&limit=10
— Returns items 20-30
— Simple but inefficient for large offsets
```

**Cursor-based pagination**:

```
GET /api/v1/users?limit=10&cursor=abc123
— Returns next 10 items after cursor
— Efficient, even for large datasets
— Better for real-time data (new items inserted)
```

Specify:

- **Parameter names**: `skip`/`limit` or `cursor`/`limit` or `page`/`pageSize`?
- **Default limit**: If not specified? (e.g., 20 items)
- **Max limit**: Largest allowed limit? (e.g., max 100 items per request)
- **Ordering**: How are items ordered by default? (e.g., by ID ascending, by creation date descending?)
- **Sort parameter**: Can user change sort order? How? (`?sort=name&order=asc`)
- **Total count**: Include total count in response? (useful for UI, but expensive to calculate)

Response format:

```
{
  "data": [...],
  "pagination": {
    "cursor": "next_cursor_xyz",
    "hasMore": true,
    "limit": 10
  }
}
```

Cursor logic:

- Cursor is opaque token (don't expose implementation)
- Cursor is stateless (can be decoded/validated)
- Cursor includes sort/filter context (so results consistent even if data changes)

**Success Criteria**:

- Pagination approach chosen and documented
- Default limit and max limit specified
- Sort order documented
- Cursor vs. offset trade-offs understood
- Pagination tested (first page, middle, last page, empty results)

---

## Documentation

All 18 API-specific items extend the base 40-45 item checklist. When generating an API variant:

1. Include all base template items (completeness, clarity, consistency, measurability, scenario coverage, edge cases, dependencies, ambiguities)
2. Add these 18 API-specific items
3. **Total for API variant**: ~58-63 items (40-45 base + 18 API-specific)

### Composition Rules

- API variant items use consistent ID format: `CHK-###-API-{Dimension}`
- Items are organized by dimension (Completeness, Clarity, Consistency, etc.)
- API-specific items do not duplicate base template questions
- Overlap is intentional (e.g., "error handling" in base + "error response format" in API) but from different perspectives

### When to Use API Variant

Use the API variant checklist when:

- ✅ Specification includes REST API, GraphQL API, or backend service requirements
- ✅ Data contracts and request/response formats need validation
- ✅ Rate limiting, authentication, and authorization are in scope
- ✅ Third-party API integrations are required
- ✅ API performance and SLOs need specification

Do not use API variant for:

- ❌ Frontend-only specifications (use UX variant instead)
- ❌ Infrastructure/ops specifications
- ❌ Internal-only code (not API exposed)

---

*Built by 🧱 LightSpeedWP with ☕ and API precision*

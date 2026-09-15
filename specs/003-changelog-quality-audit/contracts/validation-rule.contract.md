# Contract: Validation Rule Engine

**Status**: Phase 1 Design
**Version**: 1.0
**Date**: 2026-09-13

## Overview

The Validation Rule Engine is the core component that evaluates changelog entries against a comprehensive ruleset. This contract defines the interface, inputs, outputs, and error handling for the validation system.

---

## Interface Definition

### Input Contract

**Type**: ChangelogEntry (YAML/JSON)

**Required Fields**:
- `title` (string): Entry title
- `description` (string): Entry description
- `category` (string): One of feature|fix|improvement|breaking-change|security|performance
- `date` (string): ISO 8601 date
- `pr_references` (array, optional): List of PR numbers
- `issue_references` (array, optional): List of issue numbers

**Optional Fields**:
- `version` (string): Semantic version
- `components` (array): Affected components
- `author` (string): Entry author

**Example Input**:
```yaml
title: "Changelog Quality Audit System"
description: "Automated validation of changelog entries to ensure quality and clarity"
category: "feature"
date: "2026-09-12"
pr_references: [2906]
issue_references: [1234]
```

---

### Output Contract

**Type**: ValidationResult (JSON)

**Structure**:
```json
{
  "entry_id": "entry_20260912_1",
  "timestamp": "2026-09-12T14:35:00Z",
  
  "overall": {
    "status": "passing",
    "compliance_score": 95,
    "message": "Entry passed validation"
  },
  
  "rule_results": [
    {
      "rule_id": "R001",
      "rule_name": "no_implementation_details",
      "severity": "error",
      "status": "passing",
      "message": null,
      "remediation_guidance": null
    },
    {
      "rule_id": "R002",
      "rule_name": "has_category",
      "severity": "error",
      "status": "passing",
      "message": null,
      "remediation_guidance": null
    },
    {
      "rule_id": "R009",
      "rule_name": "has_pr_reference",
      "severity": "warning",
      "status": "passing",
      "message": "PR reference found: #2906",
      "remediation_guidance": null
    }
  ],
  
  "summary": {
    "total_rules_evaluated": 20,
    "passed_count": 18,
    "warning_count": 2,
    "failed_count": 0,
    "compliance_status": "passing",
    "estimated_remediation_time_minutes": 0
  }
}
```

**Status Values**:
- `passing`: Rule requirement met
- `warning`: Rule failed but not blocking (warning severity)
- `failing`: Rule failed and blocking (error severity)

**Compliance Status**:
- `passing`: Score ≥90, no error-severity failures
- `warning`: Score 75-89, has warning-severity failures
- `failing`: Score <75, has error-severity failures

---

### Failure Output Contract

**Type**: ValidationError (JSON)

**When rule application fails**:
```json
{
  "status": "error",
  "error_code": "RULE_APPLICATION_ERROR",
  "rule_id": "R010",
  "rule_name": "valid_pr_reference",
  "message": "GitHub API error: rate limit exceeded",
  "details": {
    "api_error": "GitHub API 429: Too Many Requests",
    "retry_after_seconds": 3600
  },
  "fallback_behavior": "rule_skipped",
  "note": "Entry validation continued with other rules"
}
```

**Error Codes**:
- `RULE_APPLICATION_ERROR`: Rule failed to execute (e.g., GitHub API error)
- `INVALID_INPUT`: Input doesn't match schema
- `TIMEOUT`: Rule evaluation exceeded time limit
- `INTERNAL_ERROR`: Unexpected error in validator

**Fallback Behavior**:
- `rule_skipped`: Error rule skipped, validation continues
- `entry_skipped`: Entry skipped due to fatal error (rare)
- `validation_aborted`: Validation stopped, retry required

---

## Execution Flow

### Single Entry Validation

```
Input: ChangelogEntry YAML
  ↓
1. Schema Validation
   - Verify required fields present
   - Check field types and formats
   - Return early if invalid
  ↓
2. Format Rules (R006, R015)
   - Check YAML/Markdown syntax
   - Validate date format
   - Early exit if syntax invalid
  ↓
3. Structure Rules (R002, R003, R004, R020)
   - Verify category valid
   - Check title/description present
   - Non-blocking on failure
  ↓
4. Reference Rules (R009, R010)
   - Extract PR/issue references
   - Optionally validate via GitHub API
   - Cacheable (1-hour TTL)
  ↓
5. Content Rules (R001, R005, R007, R008, R012, R013, R014, R018, R019)
   - Run semantic checks
   - Pattern matching on text
   - Regex-based analysis
  ↓
6. Calculation
   - Calculate compliance score
   - Determine status (passing/warning/failing)
   - Compile remediation guidance
  ↓
Output: ValidationResult JSON
```

**Execution Time Budget**:
- Format/Structure rules: <10ms
- Reference rules: 50-500ms (with GitHub API calls)
- Content rules: 20-50ms (regex evaluation)
- **Total per entry**: <100ms average (without API), <1000ms max

---

## Rule Application Patterns

### Pattern-Based Rules (Regex)

**Rule R001: no_implementation_details**

**Input**: Entry description
**Logic**: Apply regex patterns to detect code references
**Output**: Matching patterns with context

```javascript
// Pseudocode
patterns = [
  /\b(API|REST|GraphQL|endpoint|method|class|function)\b/gi,
  /\b(async|await|promise|callback)\b/gi,
  /\b(backend|frontend|middleware|service mesh)\b/gi
]

matches = []
for (pattern of patterns) {
  if (description.match(pattern)) {
    matches.push({
      pattern: pattern,
      matches: description.match(pattern),
      context: getContext(description, match)
    })
  }
}

if (matches.length > 0) {
  return {
    status: "failing",
    message: `Contains ${matches.length} implementation detail(s): ${matches.join(', ')}`,
    remediation: "Remove technical terms, focus on user benefit"
  }
}
return { status: "passing" }
```

### Schema Validation Rules (Structure)

**Rule R002: has_category**

**Input**: Entry object
**Logic**: Check required field exists and is valid value
**Output**: Pass/fail with field value

```javascript
// Pseudocode
const validCategories = ["feature", "fix", "improvement", "breaking-change", "security", "performance"];
const category = entry.category;

if (!category) {
  return {
    status: "failing",
    message: "Category not specified",
    remediation: "Add 'category: feature' (or other valid value)"
  };
}

if (!validCategories.includes(category)) {
  return {
    status: "failing",
    message: `Invalid category '${category}'. Must be one of: ${validCategories.join(', ')}`,
    remediation: `Change to valid category: ${validCategories.join(', ')}`
  };
}

return { status: "passing" };
```

### Reference Validation Rules (GitHub API)

**Rule R010: valid_pr_reference**

**Input**: Entry with pr_references array
**Logic**: Verify each PR exists on GitHub via API
**Output**: Pass/fail with reference validation

```javascript
// Pseudocode
const prRefs = entry.pr_references || [];

if (prRefs.length === 0) {
  return { status: "passing", message: "No PR references to validate" };
}

const results = [];
for (const prNumber of prRefs) {
  const cached = prCache.get(prNumber);
  if (cached) {
    results.push(cached);
    continue;
  }
  
  try {
    const pr = await github.getPullRequest(owner, repo, prNumber);
    const result = {
      pr_number: prNumber,
      status: "valid",
      url: pr.html_url,
      title: pr.title
    };
    prCache.set(prNumber, result, ttl: 3600000); // 1 hour
    results.push(result);
  } catch (error) {
    if (error.status === 404) {
      results.push({ pr_number: prNumber, status: "not_found" });
    } else {
      throw error; // API error, rethrow for error handling
    }
  }
}

const failedRefs = results.filter(r => r.status !== "valid");
if (failedRefs.length > 0) {
  return {
    status: "failing",
    message: `${failedRefs.length} PR reference(s) not found: ${failedRefs.map(r => '#' + r.pr_number).join(', ')}`,
    remediation: "Verify PR numbers are correct and accessible"
  };
}

return { status: "passing", message: `All ${results.length} PR reference(s) verified` };
```

---

## Error Handling

### GitHub API Rate Limits

**Scenario**: Rate limit exceeded during reference validation

**Handling**:
1. Detect 429 response from GitHub API
2. Return error with `retry_after_seconds`
3. Skip R010 validation rule (doesn't block)
4. Log warning
5. Continue with other rules

**Output**:
```json
{
  "status": "error",
  "rule_id": "R010",
  "error_code": "RATE_LIMIT_EXCEEDED",
  "message": "GitHub API rate limit exceeded (429). Retry after 3600 seconds.",
  "fallback_behavior": "rule_skipped",
  "note": "Reference validation skipped due to API limit"
}
```

### Network Timeouts

**Scenario**: GitHub API timeout during PR validation

**Handling**:
1. Set 5-second timeout for each API call
2. On timeout, mark as API error (not entry error)
3. Fallback: assume reference is valid (graceful degradation)
4. Log error for monitoring

**Output**:
```json
{
  "status": "error",
  "rule_id": "R010",
  "error_code": "TIMEOUT",
  "message": "GitHub API request timeout after 5 seconds",
  "fallback_behavior": "assume_valid",
  "note": "PR reference assumed valid; please retry validation later"
}
```

### Malformed Input

**Scenario**: Entry missing required fields

**Handling**:
1. Check schema before any rule execution
2. Return validation error immediately
3. Don't attempt rule application
4. Guide user on required fields

**Output**:
```json
{
  "status": "error",
  "error_code": "INVALID_INPUT",
  "message": "Entry missing required field: 'description'",
  "details": {
    "missing_fields": ["description"],
    "required_fields": ["title", "description", "category", "date"]
  },
  "remediation": "Add 'description' field to entry"
}
```

---

## Performance Requirements

| Operation | Target | Acceptable | Failure |
|-----------|--------|-----------|---------|
| Single entry validation (no API) | <50ms | <100ms | >500ms |
| Reference validation (with API) | <500ms | <1000ms | >3000ms |
| Full audit (100 entries) | <5min | <10min | >20min |
| Rule initialization | <100ms | <500ms | >1000ms |

**Optimization**:
- Cache GitHub API responses (1 hour TTL)
- Lazy-load GitHub client only if R009/R010 needed
- Parallel regex evaluation where possible
- Pre-compile regex patterns at startup

---

## Testing Requirements

### Unit Tests

```javascript
// Test pattern matching
test('R001 detects API keyword', () => {
  const entry = { description: 'Fixed webhook API response' };
  const result = validateRule('R001', entry);
  assert.equal(result.status, 'failing');
});

// Test schema validation
test('R002 rejects missing category', () => {
  const entry = { title: 'Fix', description: 'Something' };
  const result = validateRule('R002', entry);
  assert.equal(result.status, 'failing');
});

// Test GitHub API integration
test('R010 validates real PR reference', async () => {
  const entry = { pr_references: [2906] };
  const result = await validateRule('R010', entry);
  assert.equal(result.status, 'passing');
});

// Test caching
test('R010 caches PR reference', async () => {
  const entry = { pr_references: [2906] };
  const result1 = await validateRule('R010', entry);
  const result2 = await validateRule('R010', entry);
  assert(cache.getCallCount() < 2); // Only 1 API call
});
```

### Integration Tests

```javascript
// Test full validation flow
test('Full validation flow on sample entry', async () => {
  const entry = YAML.parse(fs.readFileSync('sample.yml'));
  const result = await validateEntry(entry);
  assert.equal(result.overall.status, 'passing');
  assert.equal(result.summary.failed_count, 0);
});

// Test error handling
test('Graceful degradation on GitHub API error', async () => {
  mockGitHubAPI.mockError(429);
  const result = await validateEntry(entryWithPR);
  assert.equal(result.overall.status, 'passing');
  // R010 skipped, other rules passed
});
```

---

## Extensibility

### Adding New Rules

**Process**:
1. Define rule in `.github/changelog-rules.yml`
2. Assign ID (R021, R022, etc.)
3. Implement rule logic in validator
4. Add unit tests
5. Increment rule version (1.0 → 1.1)
6. Existing entries stay on v1.0, new entries use v1.1

**Example**: Add R021 for changelog entry length limit

```yaml
id: "R021"
name: "max_length"
version: "1.1"
rule_type: "structure"
severity: "warning"
description: "Entry description should not exceed 500 characters"
remediation_guidance: "Shorten description; move detailed context to PR/issue"
```

### Rule Versioning

- Major change (breaking semantics): new version (1.0 → 2.0)
- Non-breaking addition: patch version (1.0 → 1.1)
- Each entry tracks `validation_rule_version`
- Backward compatibility maintained automatically

---

## Summary

The Validation Rule Engine is:
- **Fast**: <100ms per entry
- **Reliable**: Graceful error handling, no cascading failures
- **Extensible**: New rules added without breaking existing entries
- **User-Friendly**: Clear remediation guidance for every issue
- **Auditable**: All validation results logged and versioned

*Maintained with ❤️ by the 🚀 LightSpeedWP Automation Team*
[Org Profile](https://github.com/lightspeedwp/.github/tree/main/profile)

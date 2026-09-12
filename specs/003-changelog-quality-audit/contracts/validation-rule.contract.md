# Contract: Validation Rule Interface

**Phase**: Phase 1 (Design & Contracts)  
**Version**: 1.0  
**Audience**: Developers implementing validation rules; rule maintainers

---

## Overview

A Validation Rule is the reusable contract between the validation engine and individual quality checks. Each rule must implement this interface to integrate with the CI/CD validation gate.

---

## Interface Definition

### Rule Metadata

Every validation rule must declare its identity and purpose:

```javascript
{
  rule_id: string,           // Unique identifier (e.g., "CHK_MAX_LENGTH")
  rule_name: string,         // Human-readable name (e.g., "Maximum entry length")
  description: string,       // What the rule checks (one sentence)
  dimension: string,         // "completeness" | "clarity" | "consistency" | "measurability"
  severity: string,          // "critical" | "high" | "medium" | "low"
  applies_to: string,        // "entry_content" | "entry_metadata" | "changelog_structure"
  error_message: string,     // User-facing message when rule fails (template with {{placeholders}})
  examples: {
    pass: string[],          // 2-3 examples that pass this rule
    fail: string[]           // 2-3 examples that fail this rule
  }
}
```

### Validation Function Signature

Each rule must implement a synchronous validation function:

```javascript
/**
 * Evaluate a changelog entry against this rule
 * 
 * @param {ChangelogEntry} entry - The entry to validate
 * @param {object} context - Runtime context (previous entries, config, etc.)
 * @returns {ValidationResult}
 */
async function validate(entry: ChangelogEntry, context: ValidationContext): Promise<ValidationResult> {
  // Implementation
}

interface ChangelogEntry {
  id: string
  content: string
  line_number: number
  version_section: string
  pr_number?: number
  issue_numbers: number[]
}

interface ValidationContext {
  all_entries: ChangelogEntry[]
  changelog_format: string    // "keep-a-changelog-1.1.0"
  config: object              // Rule-specific configuration
  github_api_client?: object  // For rules that need GitHub validation
}

interface ValidationResult {
  passed: boolean
  rule_id: string
  error_message?: string      // Rendered error_message with placeholders filled
  details?: {
    actual_value?: any        // Actual measured value (e.g., "285 characters")
    expected_value?: any      // Expected value (e.g., "≤250 characters")
    suggestion?: string       // How to fix (e.g., "Remove implementation details")
  }
  severity?: string           // Can override rule's default severity for this instance
}
```

---

## Built-In Rules

### Rule: CHK_MAX_LENGTH (Critical)

**Validation**: Entry content ≤ 250 characters

```javascript
{
  rule_id: "CHK_MAX_LENGTH",
  rule_name: "Maximum entry length",
  description: "Changelog entries must not exceed 250 characters",
  dimension: "clarity",
  severity: "critical",
  applies_to: "entry_content",
  error_message: "Entry exceeds 250 character limit ({{actual}} chars). Keep summaries brief and user-focused.",
  examples: {
    pass: [
      "Added support for dark mode in dashboard",
      "Fixed bug preventing file uploads on Safari",
      "Performance improvement: 40% faster query execution"
    ],
    fail: [
      "Refactored the authentication layer to use OAuth2 provider integration with support for multi-factor authentication, revoked API tokens, and implemented session management across multiple browser tabs with persistent storage in browser local cache to ensure seamless user experience across device restarts and network interruptions",
      "Updated the database migration system to support rollback capabilities, added comprehensive logging for debugging schema changes, integrated with CI/CD pipelines for automated schema validation, and implemented version tracking to support zero-downtime deployments across production infrastructure"
    ]
  }
}
```

### Rule: CHK_NO_IMPL_DETAILS (Critical)

**Validation**: Entry content contains no banned implementation keywords

```javascript
{
  rule_id: "CHK_NO_IMPL_DETAILS",
  rule_name: "No implementation details",
  description: "Entries must be user-focused, not implementation-focused",
  dimension: "clarity",
  severity: "critical",
  applies_to: "entry_content",
  error_message: "Entry contains implementation jargon: '{{keywords}}'. Focus on user-facing changes, not internal details.",
  config: {
    banned_keywords: [
      "refactored", "optimised", "optimized", "fixed", "updated", "patched",
      "implemented", "deployed", "migrated", "restructured", "reorganised", "reorganized",
      "logic", "algorithm", "framework", "component", "module", "hook", "middleware",
      "REST API", "GraphQL", "database", "query", "cache", "transaction"
    ],
    context_keywords: [  // Flagged for review, not automatic fail
      "WordPress", "React", "Vue", "Django", "Node.js"
    ]
  },
  examples: {
    pass: [
      "Improved user authentication flow",
      "Dashboard now loads 50% faster",
      "Added ability to export reports as PDF"
    ],
    fail: [
      "Refactored the authentication component to use OAuth2 middleware",
      "Optimised database queries for 3x faster pagination",
      "Implemented new caching layer with Redis integration"
    ]
  }
}
```

### Rule: CHK_HAS_PR_LINK (Critical)

**Validation**: Entry references at least one GitHub PR or issue number

```javascript
{
  rule_id: "CHK_HAS_PR_LINK",
  rule_name: "PR or issue link present",
  description: "Entries must reference the PR or issue they address",
  dimension: "completeness",
  severity: "critical",
  applies_to: "entry_content",
  error_message: "Entry does not reference a PR or issue. Add '#1234' to link to the GitHub PR.",
  examples: {
    pass: [
      "Fixed authentication bug (#1234)",
      "Added dark mode support (fixes #5678)",
      "Performance improvement: 40% faster queries (#2904)"
    ],
    fail: [
      "Fixed authentication bug",
      "Added dark mode support",
      "Performance improvement: 40% faster queries"
    ]
  }
}
```

### Rule: CHK_FORMAT_MARKDOWN (High)

**Validation**: Entry is valid markdown; contains no raw HTML

```javascript
{
  rule_id: "CHK_FORMAT_MARKDOWN",
  rule_name: "Valid markdown format",
  description: "Entry must follow markdown syntax; no raw HTML",
  dimension: "consistency",
  severity: "high",
  applies_to: "entry_content",
  error_message: "Entry contains invalid markdown or raw HTML. Use standard markdown only.",
  examples: {
    pass: [
      "Added support for **bold** and _italic_ text",
      "Link format: [text](url)",
      "Lists: - item 1, - item 2"
    ],
    fail: [
      "Added support for <b>bold</b> text",
      "Raw HTML: <div class='alert'>Warning</div>"
    ]
  }
}
```

### Rule: CHK_LINK_VALIDITY (High)

**Validation**: All GitHub links resolve successfully

```javascript
{
  rule_id: "CHK_LINK_VALIDITY",
  rule_name: "All links are valid",
  description: "PR and issue links must resolve to valid GitHub resources",
  dimension: "measurability",
  severity: "high",
  applies_to: "entry_content",
  error_message: "Link does not resolve: {{link}} (status {{status}}). Verify PR/issue number is correct.",
  requires_github_api: true,
  retry_strategy: "exponential_backoff",  // 2s, 4s, 8s, then fail
  examples: {
    pass: [
      "Fixed bug (#2904) - links to valid PR",
      "Feature request (#5678) - links to valid issue"
    ],
    fail: [
      "Fixed bug (#99999) - PR number does not exist",
      "Feature from (#1234) - issue was deleted"
    ]
  }
}
```

---

## Validation Execution Model

1. **Load Rules**: Engine loads all rule definitions from `.github/scripts/validation-rules/`
2. **Order by Severity**: Execute critical rules first, then high, medium, low
3. **Fail Fast**: If any critical rule fails, stop evaluation and report
4. **Collect Failures**: If critical rules pass, collect all high/medium/low failures
5. **Generate Report**: Produce ValidationReport with all results

---

## Rule Registration

To add a new rule, create a file in `.github/scripts/validation-rules/`:

**File**: `.github/scripts/validation-rules/{rule_id}.js`

```javascript
module.exports = {
  metadata: {
    rule_id: "CHK_CUSTOM",
    rule_name: "Custom rule",
    description: "...",
    dimension: "...",
    severity: "...",
    applies_to: "entry_content",
    error_message: "...",
    examples: { pass: [], fail: [] }
  },

  validate: async function(entry, context) {
    // Implementation
    return {
      passed: true,
      rule_id: "CHK_CUSTOM",
      error_message: null,
      details: {}
    }
  }
}
```

Rules are auto-discovered on workflow execution.

---

## Rule Configuration

Global rule configuration (`.github/config/changelog-validation.yml`):

```yaml
validation:
  rules:
    CHK_MAX_LENGTH:
      enabled: true
      max_length: 250
    CHK_NO_IMPL_DETAILS:
      enabled: true
      banned_keywords: [...]
    CHK_LINK_VALIDITY:
      enabled: true
      retry_attempts: 3
      timeout_ms: 5000
  
  enforcement:
    blocking: true              # Fail CI if any critical rule fails
    review_required_severity: "high"  # Require review if high+ severity
    auto_comment_on_pr: true
```

---

## Contract: Guaranteed Behaviors

✅ **Every rule MUST**:
- Have unique `rule_id`
- Implement synchronous `validate()` function
- Return `ValidationResult` with `passed` boolean
- Provide user-facing `error_message` with actionable feedback
- Include pass/fail examples for testing
- Complete validation in <1 second per entry

✅ **Every rule MUST document**:
- What dimension it validates (8-dimension framework)
- Its severity (critical/high/medium/low)
- Why this rule matters (user focus vs. internal details)

❌ **Rules MUST NOT**:
- Modify entry content (validation only; refactoring is separate)
- Create external side effects
- Cache results across validation runs
- Make unretried HTTP requests
- Depend on other rules' results

---

## Phase 1 Complete

Validation rule interface contract defined. Rules can be extended by adding new files to `.github/scripts/validation-rules/`.

**Next**: Metrics API contract and quickstart.md

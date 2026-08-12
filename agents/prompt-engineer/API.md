---
name: Prompt Engineer API
description: API reference for the Prompt Engineer Agent
version: "1.0.0"
created: "2026-08-12"
---

# Prompt Engineer Agent — API Reference

Complete API documentation for the Prompt Engineer Agent's three core functions.

## Overview

The agent exposes three primary operations:

1. **`analyze(prompt, context?)`** — Analyze prompt clarity
2. **`improve(prompt, context?)`** — Generate improvement suggestions
3. **`validate(prompt, context?)`** — Validate prompt format and standards

All operations return structured JSON data suitable for programmatic processing.

## Function: analyze(prompt, context?)

Analyze a prompt's clarity across three dimensions: completeness, specificity, and constraints.

### Signature

```typescript
function analyze(
  prompt: string,
  context?: 'github' | 'wordpress-plugin' | 'wordpress-theme' | 'generic'
): AnalysisResult
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | The prompt text to analyze |
| `context` | string | No | Repository context for specialized analysis. Auto-detected if omitted. |

### Return Type: AnalysisResult

```typescript
interface AnalysisResult {
  score: {
    overall: number;          // 0-10: overall clarity score
    completeness: number;     // 0-10: are all necessary elements present?
    specificity: number;      // 0-10: are instructions concrete?
    constraints: number;      // 0-10: are limitations defined?
  };
  context_detected: string;   // '.github' | 'wordpress-plugin' | 'wordpress-theme' | 'generic'
  missing_elements: string[]; // What information is missing
  ambiguities: string[];      // Unclear or vague phrases
  strengths: string[];        // What's working well
  recommendations: string[];  // Actionable next steps
}
```

### Examples

#### Example 1: Clear Prompt

**Request:**

```javascript
analyze(
  "Create a GitHub Actions workflow that labels PRs based on files changed. " +
  "If package.json changed: add 'area:deps'. If .github/workflows changed: add 'area:ci'",
  "github"
)
```

**Response:**

```json
{
  "score": {
    "overall": 9.0,
    "completeness": 9,
    "specificity": 9,
    "constraints": 9
  },
  "context_detected": ".github",
  "missing_elements": [],
  "ambiguities": [],
  "strengths": [
    "Clear goal statement",
    "Specific file change triggers",
    "Concrete label names following canonical format",
    "Actionable rules with examples"
  ],
  "recommendations": [
    "Optional: Document behavior if multiple rules match the same PR"
  ]
}
```

#### Example 2: Unclear Prompt

**Request:**

```javascript
analyze("Improve the system to be better")
```

**Response:**

```json
{
  "score": {
    "overall": 2.5,
    "completeness": 1,
    "specificity": 2,
    "constraints": 5
  },
  "context_detected": "generic",
  "missing_elements": [
    "Which system is meant",
    "What constitutes 'better'",
    "Specific improvements desired",
    "Success criteria",
    "Input/output format"
  ],
  "ambiguities": [
    "No definition of 'better'",
    "No context for scope"
  ],
  "strengths": [
    "Concise statement"
  ],
  "recommendations": [
    "Define the system with concrete examples",
    "Specify measurable improvement targets",
    "Identify target context (.github, plugin, theme)"
  ]
}
```

### Usage Patterns

#### Pattern 1: Quick Check

```javascript
const result = analyze(userPrompt);
if (result.score.overall >= 8) {
  console.log("Prompt is clear and ready to use");
} else {
  console.log("Prompt needs improvements:", result.recommendations);
}
```

#### Pattern 2: Context-Aware Analysis

```javascript
const result = analyze(prompt, "wordpress-plugin");
// Analysis will include WordPress-specific checks:
// - Hook naming conventions
// - Block registration syntax
// - Plugin version requirements
```

#### Pattern 3: Batch Analysis

```javascript
const prompts = [
  "Create a workflow...",
  "Add a filter hook...",
  "Build a theme..."
];

const results = prompts.map((p) => analyze(p));
// Context auto-detected for each prompt
```

---

## Function: improve(prompt, context?)

Generate actionable improvement suggestions with before/after examples and trade-off analysis.

### Signature

```typescript
function improve(
  prompt: string,
  context?: 'github' | 'wordpress-plugin' | 'wordpress-theme' | 'generic'
): ImprovementResult
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | The prompt text to improve |
| `context` | string | No | Repository context for specialized improvements. Auto-detected if omitted. |

### Return Type: ImprovementResult

```typescript
interface Improvement {
  id: string;                 // Unique identifier (e.g., 'clarity-1')
  category: string;           // 'clarity' | 'completeness' | 'constraints'
  severity: string;           // 'high' | 'medium' | 'low'
  problem: string;            // What's wrong
  why_matters: string;        // Why it matters
  quote: string;              // Quote from original prompt
  before: string;             // Original phrasing
  after: string;              // Improved phrasing
  trade_offs: {
    gain: string[];           // What you gain
    lose: string[];           // What you lose
  };
  effort: string;             // 'low' | 'medium' | 'high'
  impact: string;             // 'high' | 'medium' | 'low'
}

interface ImprovementResult {
  improvements: Improvement[];
  priority_improvements: string[];  // Top opportunities (effort vs impact)
  estimated_effort: {
    hours: number;
    difficulty: 'low' | 'medium' | 'high';
  };
  implementation_steps: string[];
}
```

### Examples

#### Example 1: Generic Prompt

**Request:**

```javascript
improve("Improve the validation system to be better")
```

**Response:**

```json
{
  "improvements": [
    {
      "id": "clarity-1",
      "category": "clarity",
      "severity": "high",
      "problem": "Vague adjective 'better' has no measurable meaning",
      "why_matters": "Without clear targets, it's impossible to know if improvements succeeded",
      "quote": "be better",
      "before": "Improve the validation system to be better",
      "after": "Improve the validation system to reduce false positives from 15% to <5% and false negatives from 8% to <2%",
      "trade_offs": {
        "gain": [
          "Measurable success criteria",
          "Can validate improvements objectively",
          "Easier to test"
        ],
        "lose": [
          "More specific requirements",
          "May need deeper analysis of current behavior"
        ]
      },
      "effort": "low",
      "impact": "high"
    },
    {
      "id": "completeness-1",
      "category": "completeness",
      "severity": "high",
      "problem": "Missing context: which validation system and for what domain",
      "why_matters": "Without context, implementation could target wrong system",
      "quote": "the validation system",
      "before": "Improve the validation system",
      "after": "Improve the analyze-prompt.skill.md validation framework for .github control plane context to catch ambiguous workflow specifications",
      "trade_offs": {
        "gain": [
          "Unambiguous scope",
          "Implementation can target specific use case",
          "Context-specific improvements possible"
        ],
        "lose": [
          "More specific requirements",
          "May not apply to other validation systems"
        ]
      },
      "effort": "low",
      "impact": "high"
    }
  ],
  "priority_improvements": [
    "clarity-1: Vague success criteria (HIGH impact, LOW effort)",
    "completeness-1: Missing context (HIGH impact, LOW effort)"
  ],
  "estimated_effort": {
    "hours": 0.5,
    "difficulty": "low"
  },
  "implementation_steps": [
    "1. Define measurable success criteria (target percentages/scores)",
    "2. Specify which validation system and domain",
    "3. Identify specific validation rules to add",
    "4. Document expected input/output format"
  ]
}
```

#### Example 2: Already-Clear Prompt

**Request:**

```javascript
improve(
  "Create GitHub Actions workflow at .github/workflows/label-sync.yml " +
  "that syncs labels from .github/labels.yml daily at 02:00 UTC",
  "github"
)
```

**Response:**

```json
{
  "improvements": [
    {
      "id": "completeness-1",
      "category": "completeness",
      "severity": "low",
      "problem": "Missing error handling specification",
      "why_matters": "Helps developers understand behavior when syncing fails",
      "quote": "syncs labels from .github/labels.yml",
      "before": "syncs labels from .github/labels.yml daily",
      "after": "syncs labels from .github/labels.yml daily at 02:00 UTC. On error: post PR comment with error details and log to workflow output. Retry up to 3 times before posting error comment.",
      "trade_offs": {
        "gain": [
          "Clear failure handling",
          "Debugging information available",
          "Resilience via retry logic"
        ],
        "lose": [
          "More verbose specification"
        ]
      },
      "effort": "low",
      "impact": "medium"
    }
  ],
  "priority_improvements": [
    "completeness-1: Error handling (MEDIUM impact, LOW effort)"
  ],
  "estimated_effort": {
    "hours": 0.25,
    "difficulty": "low"
  },
  "implementation_steps": [
    "1. Add error handling specification",
    "2. Document retry logic (if desired)",
    "3. Specify logging/notification behavior"
  ]
}
```

### Usage Patterns

#### Pattern 1: Get Top Improvements

```javascript
const result = improve(prompt);
const topImprovements = result.priority_improvements;
// Returns: ["clarity-1: Vague verbs (HIGH impact, LOW effort)"]
```

#### Pattern 2: Effort-Based Filtering

```javascript
const result = improve(prompt);
const quickWins = result.improvements.filter(
  i => i.effort === 'low' && i.impact === 'high'
);
// Improvements that are easy but impactful
```

#### Pattern 3: Iterative Improvement

```javascript
let prompt = userPrompt;
let iteration = 1;

while (iteration < 3) {
  const analysis = analyze(prompt);
  if (analysis.score.overall >= 8) break;
  
  const improvements = improve(prompt);
  prompt = userRevised(prompt, improvements);
  iteration++;
}
```

---

## Function: validate(prompt, context?)

Validate prompt conformance to format standards, context-specific rules, and best practices.

### Signature

```typescript
function validate(
  prompt: string,
  context?: 'github' | 'wordpress-plugin' | 'wordpress-theme' | 'generic'
): ValidationResult
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | The prompt text to validate |
| `context` | string | No | Repository context for specialized validation. Auto-detected if omitted. |

### Return Type: ValidationResult

```typescript
interface ValidationIssue {
  type: string;               // 'format' | 'completeness' | 'clarity' | etc.
  severity: string;           // 'error' | 'warning' | 'info'
  message: string;            // Human-readable message
  location?: string;          // Where in the prompt (e.g., "Line 5")
  suggestion: string;         // How to fix it
}

interface ValidationCheck {
  status: string;             // 'pass' | 'fail'
  items_passed: number;
  items_total: number;
}

interface ValidationResult {
  status: string;             // 'valid' | 'invalid' | 'warning'
  score: number;              // 0-10 compliance score
  context: string;            // Detected context
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  checks: {
    format: ValidationCheck;
    context_specific: ValidationCheck;
    standards: ValidationCheck;
  };
  recommendations: string[];
}
```

### Examples

#### Example 1: Valid GitHub Workflow Prompt

**Request:**

```javascript
validate(
  "Create .github/workflows/label-sync.yml that syncs labels " +
  "from .github/labels.yml daily at 02:00 UTC. " +
  "Use canonical labels from .github/labels.yml only. " +
  "On error: post PR comment with details.",
  "github"
)
```

**Response:**

```json
{
  "status": "valid",
  "score": 9.2,
  "context": ".github",
  "errors": [],
  "warnings": [],
  "checks": {
    "format": {"status": "pass", "items_passed": 8, "items_total": 8},
    "context_specific": {"status": "pass", "items_passed": 12, "items_total": 12},
    "standards": {"status": "pass", "items_passed": 9, "items_total": 10}
  },
  "recommendations": [
    "Consider documenting GitHub App permissions required (issues:write)"
  ]
}
```

#### Example 2: Invalid WordPress Plugin Prompt

**Request:**

```javascript
validate("Add hook for handling block data changes", "wordpress-plugin")
```

**Response:**

```json
{
  "status": "invalid",
  "score": 3.2,
  "context": "wordpress-plugin",
  "errors": [
    {
      "type": "completeness",
      "severity": "error",
      "message": "Hook type not specified (action vs. filter)",
      "suggestion": "Clarify: use 'add_action' or 'apply_filters'? Specify hook name."
    },
    {
      "type": "format",
      "severity": "error",
      "message": "Missing hook name",
      "suggestion": "Specify exact hook (e.g., 'my-plugin/block-saved' or 'my-plugin/validate-block')"
    }
  ],
  "warnings": [
    {
      "type": "clarity",
      "severity": "warning",
      "message": "Vague verb 'handling' used",
      "suggestion": "Use specific action: 'validate', 'sanitize', 'save', 'register'"
    },
    {
      "type": "completeness",
      "severity": "warning",
      "message": "Hook parameters not documented",
      "suggestion": "Specify what data is passed to the hook callback"
    }
  ],
  "checks": {
    "format": {"status": "fail", "items_passed": 3, "items_total": 7},
    "context_specific": {"status": "fail", "items_passed": 4, "items_total": 12},
    "standards": {"status": "pass", "items_passed": 8, "items_total": 10}
  },
  "recommendations": [
    "Specify hook type (action or filter)",
    "Name the exact hook you're targeting",
    "Document hook parameters and expected return value",
    "Define what 'handling' means for this context"
  ]
}
```

### Usage Patterns

#### Pattern 1: Pass/Fail Check

```javascript
const result = validate(prompt);
if (result.status === 'valid') {
  console.log("Ready to use!");
} else {
  console.log("Fix errors before deployment:", result.errors);
}
```

#### Pattern 2: Gateway Check

```javascript
const result = validate(prompt);
const hasErrors = result.errors.length > 0;
const hasWarnings = result.warnings.length > 0;

if (hasErrors) return; // Block deployment
if (hasWarnings) warn(result.warnings); // Alert but allow
```

#### Pattern 3: Detailed Report

```javascript
const result = validate(prompt);
console.log(`Validation Score: ${result.score}/10`);
console.log(`Errors: ${result.errors.length}`);
console.log(`Warnings: ${result.warnings.length}`);
console.log(result.recommendations);
```

---

## Combined Workflow

Typical usage combines all three operations:

```javascript
// 1. Analyze to understand current state
const analysis = analyze(prompt);
console.log("Initial clarity score:", analysis.score.overall);

// 2. Get improvement suggestions
const improvements = improve(prompt);
console.log("Top improvements:", improvements.priority_improvements);

// 3. User revises prompt based on suggestions
const revisedPrompt = userImplementsImprovements(prompt, improvements);

// 4. Validate against standards
const validation = validate(revisedPrompt);
console.log("Validation status:", validation.status);

// 5. If issues remain, repeat
if (validation.status !== 'valid') {
  // Go back to step 2
}
```

---

## Error Handling

All functions return well-formed JSON. No exceptions thrown.

### Invalid Input

```javascript
analyze("") 
// Returns analysis with score: 0/10, recommendations for adding content
```

### Unknown Context

```javascript
analyze(prompt, "unknown-context")
// Falls back to 'generic' context, analyzes without context-specific checks
```

### Timeout Handling (Future)

For very long prompts (>10,000 tokens), functions may timeout gracefully:

```json
{
  "status": "timeout",
  "message": "Analysis exceeded time limit",
  "partial_result": {...},
  "recommendation": "Break into smaller prompts"
}
```

---

## Context Detection Logic

Automatic context detection analyzes prompt content:

### .github Indicators

```javascript
keywords: ['workflow', 'github', 'action', 'ci', 'label', 'pull request', 'branch']
patterns: [/\.github\/workflows\//, /add_label/, /checkout@/, /\.yml/]
```

### WordPress Plugin Indicators

```javascript
keywords: ['plugin', 'hook', 'filter', 'action', 'block', 'wordpress']
patterns: [/add_action/, /apply_filters/, /block\.json/, /enqueue/]
```

### WordPress Theme Indicators

```javascript
keywords: ['theme', 'theme.json', 'design token', 'pattern', 'template']
patterns: [/theme\.json/, /design.*token/, /pattern/, /template/]
```

---

## Performance Characteristics

- **analyze():** ~200-500ms for typical prompts (<1000 tokens)
- **improve():** ~500ms-1s (depends on number of improvements)
- **validate():** ~100-300ms (fast format checks)

Batch operations should be parallelized.

---

## Testing

Each function is tested with:

- ✅ Valid prompts from each context
- ✅ Invalid prompts with known issues
- ✅ Edge cases (very long, mixed contexts, technical jargon)
- ✅ Real prompts from repositories

Target coverage: 80%+ (Phase 2), 95%+ (Phase 3+)

---

## Related Documentation

- [README.md](README.md) — Quick start and overview
- [EXAMPLES.md](EXAMPLES.md) — Real-world usage examples
- [skills/analyze-prompt.skill.md](skills/analyze-prompt.skill.md) — Analysis methodology
- [skills/improve-prompt.skill.md](skills/improve-prompt.skill.md) — Improvement framework
- [skills/validate-prompt.skill.md](skills/validate-prompt.skill.md) — Validation rules

---

**API Version:** 1.0.0 (Phase 2 Implementation)  
**Last Updated:** 2026-08-12  
**Status:** Active — In Production

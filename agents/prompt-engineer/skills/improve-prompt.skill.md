---
name: improve-prompt
title: Generate Prompt Improvements
description: Generate actionable improvement suggestions for prompts with trade-off analysis
skill_type: generation
version: "1.0.0"
created: "2026-08-12"
---

# Generate Prompt Improvements

## Overview

This skill generates concrete, actionable improvement suggestions for prompts. Each suggestion includes:

- The problem identified
- Why it matters
- Concrete improvement
- Before/after example
- Trade-off analysis (what you gain/lose)

## Improvement Categories

### 1. Clarity Improvements

**Vague Language → Specific Language**

- Vague: "handle errors gracefully"
- Specific: "catch and log errors to stderr, then exit with code 1"

**Undefined Terms → Defined Terms**

- Undefined: "Use the standard approach"
- Defined: "Use the approach documented in [docs/CONTRIBUTING.md](../docs/CONTRIBUTING.md): 3-layer validation (input, business logic, output)"

**Ambiguous Instructions → Concrete Instructions**

- Ambiguous: "Update the system to be faster"
- Concrete: "Reduce p99 latency from 200ms to 50ms by caching results in Redis"

### 2. Completeness Improvements

**Missing Context → Provided Context**

```
Before:
"Implement authentication"

After:
"Implement GitHub OAuth authentication for the Dashboard app:
1. Users click 'Sign in with GitHub'
2. Redirected to GitHub authorization screen
3. After approval, returned to app with access token
4. Token stored in secure HTTP-only cookie
5. Cookie used for all subsequent API requests"
```

**Missing Examples → Added Examples**

```
Before:
"Create validation rules for pull requests"

After:
"Create validation rules for pull requests. Example rules:
- If files in docs/* changed: require 'type:documentation' label
- If files in src/* changed: require at least one reviewer
- If package.json changed: require 'area:deps' label"
```

**Missing Success Criteria → Defined Success Criteria**

```
Before:
"Improve the documentation"

After:
"Improve the documentation. Success means:
- ✅ Reduce average reader time from 15 min to 8 min
- ✅ Achieve 90%+ search accuracy for key terms
- ✅ Every code example has runnable test
- ✅ Zero broken internal links"
```

### 3. Constraint Improvements

**Implicit Constraints → Explicit Constraints**

```
Before:
"Implement the feature"

After:
"Implement the feature with these constraints:
- Must work in Safari 14+ and Chrome 90+
- Maximum bundle size increase: 50KB gzipped
- Performance: First Contentful Paint <2.5s
- Must not require database schema changes"
```

**Scope Creep → Defined Scope**

```
Before:
"Fix the performance issues"

After:
"Fix performance in the API endpoint /api/users/search:
- ONLY focus on p99 latency (currently 400ms, target 100ms)
- DO NOT modify database schema
- DO NOT add new dependencies
- DO NOT change the API response format
- Include changes to: caching strategy, query optimization, connection pooling"
```

## Context-Specific Improvements

### .github Control Plane

**Improvement Types:**

1. Workflow trigger specificity (define exact conditions)
2. GitHub App permission clarity (list required scopes)
3. Label naming consistency (use canonical prefixes)
4. Branching strategy alignment (reference BRANCHING_STRATEGY.md)
5. CI/CD integration clarity (specify when this runs)

**Example:**

```
Before:
"Create a workflow that updates labels"

After:
"Create a GitHub Actions workflow (.github/workflows/label-sync.yml) that:
1. Runs daily at 02:00 UTC (schedule: '0 2 * * *')
2. Uses the 'labeling.agent' to sync labels from .github/labels.yml
3. Creates new labels missing from repository
4. Updates existing labels if description changed
5. Does NOT delete labels (manual process)
6. Posts summary comment if 5+ changes made
7. Requires: GitHub App with 'issues' and 'contents' write permissions"
```

### WordPress Plugin

**Improvement Types:**

1. Hook naming convention (add_action vs. apply_filters)
2. Block registration clarity (block.json structure)
3. Dependency declarations (WordPress version, extensions)
4. JavaScript module structure (ESM vs. UMD)
5. Hook priority documentation

**Example:**

```
Before:
"Add JavaScript event listener for the block"

After:
"Add JavaScript event listener for the 'save' button in the MyPlugin block:
1. Create src/blocks/my-plugin/save-button.js
2. Hook into 'my-plugin/button-click' filter
3. Default behavior: POST to /wp-json/my-plugin/v1/items
4. On success: show 'Saved!' message for 2 seconds
5. On error: show error message and console.error
6. Use: wp.hooks.applyFilters('my-plugin/button-click', ...) for extensibility"
```

### WordPress Theme

**Improvement Types:**

1. Design token naming consistency
2. Theme.json structure clarity
3. Template hierarchy documentation
4. Pattern naming conventions
5. CSS architecture specification

**Example:**

```
Before:
"Update the color scheme"

After:
"Update the theme.json color palette:
1. Add new color token: spacing-lg with value 2rem
2. Update existing: color-primary from #0066cc to #0052a3 (WCAG AAA compliant)
3. Remove deprecated: color-legacy-gray (not used in any pattern)
4. Document usage in patterns/color-palette.md
5. Validate against schema: schemas/theme.json"
```

## Improvement Suggestion Format

Return as structured data:

```json
{
  "improvements": [
    {
      "id": "clarity-1",
      "category": "clarity",
      "severity": "high",
      "problem": "Vague action verb 'handle' used without context",
      "why_matters": "Developers won't know what behavior to implement or test for",
      "quote": "handle errors gracefully",
      "before": "Create a function that handles errors gracefully.",
      "after": "Create a function that catches errors, logs them with context (function name, input values), and returns a standardized error object: { code: string, message: string, timestamp: ISO8601 }",
      "trade_offs": {
        "gain": [
          "Testable behavior with clear expectations",
          "Consistent error handling across codebase",
          "Better debugging with contextual logs"
        ],
        "lose": [
          "More verbose prompt",
          "Requires defining error object schema upfront"
        ]
      },
      "effort": "low",
      "impact": "high"
    },
    {
      "id": "completeness-1",
      "category": "completeness",
      "severity": "medium",
      "problem": "Missing examples of expected input/output",
      "why_matters": "Without examples, developers may implement something that works but doesn't match your intent",
      "quote": "Create validation rules for pull requests",
      "suggestion": "Add 2-3 concrete examples showing which rules apply to which file changes",
      "example": "Example: If package.json changed → apply 'area:deps' label. If .github/workflows changed → apply 'area:ci' label.",
      "trade_offs": {
        "gain": [
          "Unambiguous requirements",
          "Easier to test and verify",
          "Can be used as test cases"
        ],
        "lose": [
          "Longer prompt",
          "May need updating if rules change"
        ]
      },
      "effort": "low",
      "impact": "high"
    }
  ],
  "priority_improvements": [
    "clarity-1: Vague action verbs (HIGH impact, LOW effort)",
    "completeness-1: Missing examples (HIGH impact, LOW effort)"
  ],
  "estimated_effort": {
    "hours": 1.5,
    "difficulty": "low"
  },
  "implementation_steps": [
    "1. Replace vague verbs with specific actions",
    "2. Add 2-3 concrete before/after examples",
    "3. Define success criteria",
    "4. List explicit constraints",
    "5. Specify target context (.github, plugin, theme)"
  ]
}
```

## Prioritization Strategy

**High Priority (Do First):**

- Clarity: Vague language → specific language (quick wins, high impact)
- Completeness: Missing examples → concrete examples (reduces ambiguity)
- Constraints: Implicit → explicit scope (prevents misunderstandings)

**Medium Priority (Do Next):**

- Technical accuracy improvements
- Context-specific standards alignment
- Best practice suggestions

**Low Priority (Optional):**

- Stylistic improvements
- Minor wording refinements
- Nice-to-have additions

## Quality Checks

For each improvement, validate:

- [ ] Problem is clearly stated with quote from original
- [ ] Before/after examples are concrete and comparable
- [ ] Trade-offs honestly assess gains and losses
- [ ] Effort estimate is realistic (low/medium/high)
- [ ] Impact is justified with reasoning
- [ ] Implementation is actually feasible

## Context Detection

Auto-detect context from prompt content:

**Indicators:**

- ".github" context: workflow, actions, CI, labels, github
- WordPress plugin: hook, filter, action, block, plugin.php
- WordPress theme: theme.json, design token, pattern, template

## Validation

- All improvements must include before/after
- Trade-offs must be balanced (don't hide costs)
- Effort must be realistic for the improvement
- At least one priority improvement identified
- Context must be explicitly stated

## Examples

### Example 1: Generic Prompt Improved (Score: 4→8)

**Original:**

```
"Improve the prompt validation system to be better and more comprehensive."
```

**Improvements Generated:**

1. **Define what "better" means**: From subjective to measurable
   - Before: "be better"
   - After: "Reduce false positives from 15% to <5% and false negatives from 8% to <2%"

2. **Specify system scope**: From vague to explicit
   - Before: "the prompt validation system"
   - After: "The analyze-prompt.skill.md validation framework for .github control plane context"

3. **Add concrete examples**: From abstract to tangible
   - Before: "more comprehensive"
   - After: "Add checks for: workflow triggers, label naming conventions, branch protection rules"

### Example 2: Clear Prompt Enhanced (Score: 9→10)

**Original:**

```
"Create a GitHub Actions workflow that labels PRs based on files changed:
- If package.json: add 'area:deps'
- If .github/workflows: add 'area:ci'"
```

**Improvements Generated:**

1. **Document edge cases**: What if multiple rules match?
   - Suggestion: "Add all matching labels (don't deduplicate)"

2. **Define failure handling**: What if labeling fails?
   - Suggestion: "Post comment on PR if unable to apply labels, with error details"

3. **Add logging**: How to debug?
   - Suggestion: "Log all label changes to workflow log with timestamp and reason"

## Testing

Test with:

- Vague prompts that need major improvements
- Already-clear prompts that need minor enhancements
- Context-specific prompts (.github, plugin, theme)
- Real prompts from project repositories

## Related Skills

- `analyze-prompt.skill.md` - Identify improvement opportunities
- `validate-prompt.skill.md` - Validate improvements meet standards
- `validate-wordpress.skill.md` - WordPress-specific validation

## References

- [Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [CLAUDE.md](../../../../CLAUDE.md) - Project standards
- [BRANCHING_STRATEGY.md](../../../../.github/docs/BRANCHING_STRATEGY.md) - GitHub governance

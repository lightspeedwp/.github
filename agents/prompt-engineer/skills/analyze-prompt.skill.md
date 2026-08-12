---
name: analyze-prompt
title: Analyze Prompt Clarity
description: Systematic analysis of prompt clarity covering completeness, specificity, and constraints
skill_type: analysis
version: "1.0.0"
created: "2026-08-12"
---

# Analyze Prompt Clarity

## Overview

This skill provides a comprehensive framework for analyzing prompt clarity through three dimensions:

- **Completeness:** Does the prompt contain all necessary information?
- **Specificity:** Are instructions concrete and unambiguous?
- **Constraints:** Are clear boundaries and limitations defined?

## Methodology

### 1. Completeness Analysis

Evaluate whether the prompt provides sufficient context for successful execution.

**Checklist:**

- [ ] Goal/objective clearly stated
- [ ] Target context identified (e.g., `.github`, WordPress plugin, WordPress theme)
- [ ] Input format specified
- [ ] Expected output format defined
- [ ] Success criteria documented
- [ ] Error handling expectations stated
- [ ] Dependencies explicitly listed

**Scoring:** 0-10 based on how many elements are present

### 2. Specificity Analysis

Assess the concreteness and unambiguity of instructions.

**Checklist:**

- [ ] Action verbs are concrete (e.g., "create", "validate", "improve") not vague (e.g., "handle", "manage")
- [ ] Technical terms are defined or standard for context
- [ ] Examples provided where helpful
- [ ] Edge cases acknowledged
- [ ] Ambiguous phrases eliminated
- [ ] Jargon explained or avoided
- [ ] Quantitative measures used where applicable

**Scoring:** 0-10 based on clarity and precision

### 3. Constraints Analysis

Evaluate whether limitations and boundaries are clearly defined.

**Checklist:**

- [ ] Scope boundaries explicit (what's in/out of scope)
- [ ] Performance requirements stated (if applicable)
- [ ] Token/resource limits acknowledged
- [ ] Time constraints documented
- [ ] Forbidden actions specified
- [ ] Priority hierarchy established (if multiple goals)
- [ ] Integration points documented

**Scoring:** 0-10 based on clarity of constraints

## Context-Specific Analysis

### .github Control Plane Context

Additional checks for GitHub workflow and governance prompts:

- [ ] Workflow triggers clearly defined (push, pull_request, schedule, manual)
- [ ] Environment variables documented
- [ ] Required GitHub App permissions specified
- [ ] Label naming conventions consistent
- [ ] Branching strategy aligned
- [ ] Merge behavior documented

### WordPress Plugin Context

Additional checks for plugin prompts:

- [ ] Hook names follow WordPress standards (add_action, add_filter)
- [ ] Block registration syntax correct
- [ ] Plugin header metadata complete
- [ ] Dependencies declared
- [ ] Compatibility versions specified

### WordPress Theme Context

Additional checks for theme prompts:

- [ ] Theme.json structure valid
- [ ] Design token naming consistent
- [ ] Template hierarchy documented
- [ ] Pattern naming follows conventions
- [ ] CSS architecture specified

## Clarity Score Calculation

```
Overall Score = (Completeness + Specificity + Constraints) / 3

Score Interpretation:
- 0-3: Critical - Major revisions needed
- 4-5: Poor - Significant improvements needed
- 6-7: Fair - Some clarification helpful
- 8-9: Good - Minor refinements possible
- 9-10: Excellent - Clear and well-structured
```

## Output Format

Return analysis as structured data:

```json
{
  "score": {
    "overall": 7.3,
    "completeness": 8,
    "specificity": 7,
    "constraints": 7
  },
  "context_detected": ".github",
  "missing_elements": [
    "Specific examples of expected output format",
    "Error handling expectations"
  ],
  "ambiguities": [
    "Term 'automation' not defined",
    "Scope of 'all workflows' unclear"
  ],
  "strengths": [
    "Clear goal statement",
    "Specific GitHub context",
    "Documented constraints"
  ],
  "recommendations": [
    "Add 2-3 concrete examples of prompts this analysis framework should handle",
    "Define what constitutes a 'good' score in your context"
  ]
}
```

## Context Detection

Analyze prompt metadata to determine context:

**Markers for .github:**

- References to "GitHub", "workflow", "action", "CI/CD"
- Mentions of labels, issues, pull requests
- References to branch protection, merge strategies

**Markers for WordPress Plugin:**

- References to "plugin", "hook", "action", "filter"
- Mentions of block registration, block.json
- References to wp-admin, admin screen

**Markers for WordPress Theme:**

- References to "theme", "theme.json", "design tokens"
- Mentions of templates, patterns, style variations
- References to CSS, design system

**Default:** If context unclear, note as "generic"

## Improvement Suggestions

Provide specific, actionable suggestions for each identified issue:

1. Quote the problematic phrase
2. Explain why it's unclear
3. Suggest a concrete improvement
4. Show before/after example

## Validation Rules

- Score must be numeric (0-10)
- All identified issues must be documented
- Context must be explicitly stated
- At least one strength must be identified
- Recommendations must be concrete and actionable

## Examples

### Example 1: Clear Prompt (Score: 9/10)

**Input:**

```
Create a GitHub Actions workflow that labels pull requests based on the 
files changed. Use the following rules:
- If package.json changed: add "area:deps"
- If .github/workflows changed: add "area:ci"
- If docs/* changed: add "type:documentation"

Output: .github/workflows/auto-label.yml
```

**Analysis:**

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
    "Clear goal and output specification",
    "Concrete examples with exact file paths",
    "Specific label names following project conventions",
    "Actionable rules with clear triggers"
  ],
  "recommendations": [
    "Optional: Document what happens if multiple rules match the same PR"
  ]
}
```

### Example 2: Unclear Prompt (Score: 4/10)

**Input:**

```
Improve the prompt validation system to be better and more comprehensive.
```

**Analysis:**

```json
{
  "score": {
    "overall": 4.0,
    "completeness": 2,
    "specificity": 3,
    "constraints": 7
  },
  "context_detected": "generic",
  "missing_elements": [
    "Current validation system details",
    "What constitutes 'better'",
    "Specific validation rules to add",
    "Input/output format",
    "Success criteria"
  ],
  "ambiguities": [
    "No definition of 'comprehensive'",
    "Which validation system is meant",
    "Target context unclear"
  ],
  "strengths": [
    "Simple and concise"
  ],
  "recommendations": [
    "Specify the current validation system or share code examples",
    "Define specific improvements with concrete examples",
    "Clarify whether this is for .github, WordPress plugin, or WordPress theme",
    "Provide before/after examples of validation"
  ]
}
```

## Testing

Test this skill with:

- At least 10 real prompts from `.github` context
- At least 10 real prompts from WordPress plugin context
- At least 10 real prompts from WordPress theme context
- Edge cases: very long prompts, ambiguous technical terms, mixed contexts

## Related Skills

- `improve-prompt.skill.md` - Generate improvement suggestions
- `validate-prompt.skill.md` - Validate prompt format and standards
- `validate-wordpress.skill.md` - WordPress-specific validation

## References

- [Prompt Engineering Best Practices](https://platform.openai.com/docs/guides/prompt-engineering)
- [GitHub Actions Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [WordPress Plugin Development](https://developer.wordpress.org/plugins/)
- [WordPress Theme Development](https://developer.wordpress.org/themes/)

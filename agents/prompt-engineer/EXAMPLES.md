---
name: Prompt Engineer Examples
description: Real-world examples of prompt analysis, improvement, and validation
version: "1.0.0"
created: "2026-08-12"
---

# Prompt Engineer Agent — Real-World Examples

Complete examples showing the full workflow of analyzing, improving, and validating prompts across `.github`, WordPress plugin, and WordPress theme contexts.

## Example 1: GitHub Workflow Prompt

### Context: .github Control Plane

Creating a GitHub Actions workflow to automatically label pull requests.

---

### Step 1: Initial Prompt (User Submits)

```
Create a workflow that labels pull requests based on files changed.
```

---

### Step 2: Analyze

**Request:**

```javascript
analyze(
  "Create a workflow that labels pull requests based on files changed."
)
```

**Response:**

```json
{
  "score": {
    "overall": 4.5,
    "completeness": 3,
    "specificity": 4,
    "constraints": 6
  },
  "context_detected": ".github",
  "missing_elements": [
    "Specific file patterns to watch",
    "Specific labels to apply",
    "Output file location (.github/workflows/...)",
    "Trigger conditions (push, pull_request, etc.)",
    "What should happen if no rules match"
  ],
  "ambiguities": [
    "Which files trigger which labels?",
    "Should labels be added or replaced?",
    "Error handling if labeling fails?"
  ],
  "strengths": [
    "Clear goal (label PRs)",
    "Uses correct context (GitHub workflow)",
    "Concise statement"
  ],
  "recommendations": [
    "Add 3-5 concrete file/label mapping examples",
    "Specify workflow file path (.github/workflows/...)",
    "Document trigger conditions",
    "Define success criteria"
  ]
}
```

**Analysis:** The prompt is too vague. Score 4.5/10. Missing specific examples and constraints.

---

### Step 3: Improve

**Request:**

```javascript
improve("Create a workflow that labels pull requests based on files changed.")
```

**Response:**

```json
{
  "improvements": [
    {
      "id": "completeness-1",
      "category": "completeness",
      "severity": "high",
      "problem": "No examples of file patterns and corresponding labels",
      "why_matters": "Without examples, it's unclear what rules should be implemented",
      "quote": "labels pull requests based on files changed",
      "before": "Create a workflow that labels pull requests based on files changed.",
      "after": "Create a workflow that labels pull requests based on files changed. Example rules:\n- If package.json changed: add 'area:deps' label\n- If .github/workflows changed: add 'area:ci' label\n- If docs/* changed: add 'type:documentation' label",
      "trade_offs": {
        "gain": [
          "Clear, unambiguous requirements",
          "Can be tested against examples",
          "Developers know exactly what to implement"
        ],
        "lose": [
          "Longer prompt",
          "May need updating if rules change"
        ]
      },
      "effort": "low",
      "impact": "high"
    },
    {
      "id": "completeness-2",
      "category": "completeness",
      "severity": "high",
      "problem": "Missing output specification (file location)",
      "why_matters": "Developers won't know where to place the workflow file",
      "quote": "Create a workflow",
      "before": "Create a workflow",
      "after": "Create .github/workflows/auto-label.yml that labels pull requests",
      "trade_offs": {
        "gain": [
          "Explicit output location",
          "Can verify file exists in PR",
          "Follows GitHub Actions conventions"
        ],
        "lose": []
      },
      "effort": "low",
      "impact": "high"
    },
    {
      "id": "completeness-3",
      "category": "completeness",
      "severity": "medium",
      "problem": "Trigger condition not specified",
      "why_matters": "Unclear when workflow runs (on PR creation, on any push, etc.)",
      "quote": "labels pull requests",
      "before": "labels pull requests based on files changed",
      "after": "labels pull requests when they are opened or updated (on: [pull_request])",
      "trade_offs": {
        "gain": [
          "Clear trigger conditions",
          "Can optimize workflow performance",
          "Follows GitHub best practices"
        ],
        "lose": []
      },
      "effort": "low",
      "impact": "medium"
    }
  ],
  "priority_improvements": [
    "completeness-1: Missing examples (HIGH impact, LOW effort)",
    "completeness-2: Missing output location (HIGH impact, LOW effort)",
    "completeness-3: Trigger condition unclear (MEDIUM impact, LOW effort)"
  ],
  "estimated_effort": {
    "hours": 0.5,
    "difficulty": "low"
  },
  "implementation_steps": [
    "1. Add 3-5 concrete file pattern → label examples",
    "2. Specify output: .github/workflows/auto-label.yml",
    "3. Define trigger: on: pull_request",
    "4. Document success criteria: all PRs match at least one rule"
  ]
}
```

**User Revises Prompt:**

```
Create .github/workflows/auto-label.yml that labels pull requests when opened or updated.

Rules:
- If package.json changed: add 'area:deps' label
- If .github/workflows changed: add 'area:ci' label  
- If docs/* changed: add 'type:documentation' label
- If src/* changed: add 'area:code' label

Success: All PRs automatically labeled based on files changed. 
Error handling: Log all labeling operations.
```

---

### Step 4: Analyze (Revised)

**Request:**

```javascript
analyze(
  "Create .github/workflows/auto-label.yml that labels pull requests " +
  "when opened or updated...",
  "github"
)
```

**Response:**

```json
{
  "score": {
    "overall": 8.5,
    "completeness": 9,
    "specificity": 8,
    "constraints": 8
  },
  "context_detected": ".github",
  "missing_elements": [
    "GitHub App permissions required (issues:write)"
  ],
  "ambiguities": [],
  "strengths": [
    "Specific file path (.github/workflows/auto-label.yml)",
    "Clear trigger condition (pull_request event)",
    "4 concrete examples with exact label names",
    "Success criteria defined",
    "Error handling specified"
  ],
  "recommendations": [
    "Document GitHub App permissions (issues:write scope needed)",
    "Specify what to do if multiple rules match (add all labels?)"
  ]
}
```

**Analysis:** Much better! Score 8.5/10. Only minor improvements needed.

---

### Step 5: Improve (Revised)

**Request:**

```javascript
improve(
  "Create .github/workflows/auto-label.yml that labels pull requests " +
  "when opened or updated...",
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
      "problem": "GitHub App permissions not documented",
      "why_matters": "Developers need to know required permissions to set up correctly",
      "quote": "add labels",
      "before": "Add labels to pull requests",
      "after": "Add labels to pull requests. Required: GitHub App with 'issues:write' permission (to modify PR labels)",
      "trade_offs": {
        "gain": [
          "Clear permission requirements",
          "Developers can set up App correctly",
          "Security transparency"
        ],
        "lose": []
      },
      "effort": "low",
      "impact": "medium"
    }
  ],
  "priority_improvements": [
    "completeness-1: Missing permissions (MEDIUM impact, LOW effort)"
  ],
  "estimated_effort": {
    "hours": 0.25,
    "difficulty": "low"
  },
  "implementation_steps": [
    "1. Add GitHub App permission requirement",
    "2. Document which scope is needed (issues:write)"
  ]
}
```

---

### Step 6: Validate (Final)

**Request:**

```javascript
validate(
  "Create .github/workflows/auto-label.yml that labels pull requests " +
  "when opened or updated. Rules: If package.json → 'area:deps', " +
  "if .github/workflows → 'area:ci', if docs/* → 'type:documentation'. " +
  "Required: GitHub App with 'issues:write' permission.",
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
    "Optional: Document what happens if a PR matches multiple rules"
  ]
}
```

**Result:** ✅ **Valid and ready to use!**

---

## Example 2: WordPress Plugin Prompt

### Context: WordPress Plugin Development

Adding a validation hook to a WordPress plugin block.

---

### Initial Prompt (User Submits)

```
Add a hook for handling block validation.
```

---

### Analysis

```json
{
  "score": {
    "overall": 2.0,
    "completeness": 1,
    "specificity": 2,
    "constraints": 4
  },
  "context_detected": "wordpress-plugin",
  "missing_elements": [
    "Hook type (action or filter)",
    "Hook name",
    "What data is being validated",
    "Expected return value/behavior",
    "Where hook is registered",
    "Priority level",
    "Callback function name"
  ],
  "ambiguities": [
    "No definition of 'handling'",
    "Unclear what's being validated"
  ],
  "strengths": [
    "Mentions WordPress context"
  ],
  "recommendations": [
    "Specify hook type (add_action or apply_filters)",
    "Give exact hook name (e.g., 'my-plugin/validate-block')",
    "Document what data flows through the hook",
    "Define expected return behavior"
  ]
}
```

### Improvement Suggestions

```json
{
  "improvements": [
    {
      "id": "clarity-1",
      "category": "clarity",
      "severity": "high",
      "problem": "Vague term 'handling' without specific action",
      "why_matters": "Developers don't know what behavior to implement",
      "quote": "handling block validation",
      "before": "Add a hook for handling block validation",
      "after": "Add a filter hook 'my-plugin/validate-block' that validates block data before saving. Hook receives: $block_data (array), $block_type (string). Hook should return: validated $block_data or WP_Error.",
      "trade_offs": {
        "gain": [
          "Clear behavior (validate or reject)",
          "Testable implementation",
          "Extensible via filters",
          "Error handling explicit"
        ],
        "lose": [
          "More verbose"
        ]
      },
      "effort": "low",
      "impact": "high"
    }
  ],
  "priority_improvements": [
    "clarity-1: Vague hook behavior (HIGH impact, LOW effort)"
  ]
}
```

### User's Revised Prompt

```
Add a filter hook to the MyPlugin block:
- Hook name: 'my-plugin/validate-block'
- Register in: plugins_loaded hook
- Parameters: $block_data (array), $block_type (string)
- Return: validated $block_data array or WP_Error on validation failure
- Example usage: validate block attributes against whitelist, check WPML translation status
```

### Final Validation

```json
{
  "status": "valid",
  "score": 8.8,
  "context": "wordpress-plugin",
  "errors": [],
  "warnings": [],
  "checks": {
    "format": {"status": "pass", "items_passed": 7, "items_total": 7},
    "context_specific": {"status": "pass", "items_passed": 10, "items_total": 10},
    "standards": {"status": "pass", "items_passed": 8, "items_total": 8}
  },
  "recommendations": [
    "Document version when hook was added (e.g., 'Added in MyPlugin 1.2.0')"
  ]
}
```

---

## Example 3: WordPress Theme Prompt

### Context: WordPress Theme Development

Defining design tokens for a WordPress theme.

---

### Initial Prompt

```
Create design tokens for the theme color system.
```

---

### Analysis

```json
{
  "score": {
    "overall": 5.2,
    "completeness": 4,
    "specificity": 5,
    "constraints": 6
  },
  "context_detected": "wordpress-theme",
  "missing_elements": [
    "Specific colors and values",
    "Semantic naming (primary, secondary, etc.)",
    "WCAG contrast requirements",
    "Where tokens are defined (theme.json)",
    "Usage examples",
    "Supported color variations"
  ],
  "ambiguities": [
    "What color palette intended?",
    "Accessibility standards?"
  ],
  "strengths": [
    "Correct context (theme design)",
    "Mentions design tokens concept"
  ],
  "recommendations": [
    "Define specific colors with hex values",
    "Use semantic naming (e.g., 'color-primary', 'color-accent')",
    "Document WCAG contrast ratios",
    "Specify token format (theme.json structure)"
  ]
}
```

### Improvement Suggestions

```json
{
  "improvements": [
    {
      "id": "completeness-1",
      "category": "completeness",
      "severity": "high",
      "problem": "No specific color values provided",
      "why_matters": "Developers can't implement without knowing what colors to use",
      "quote": "Create design tokens for the theme color system",
      "before": "Create design tokens",
      "after": "Create design tokens in theme.json with these colors:\n- Primary (interactive elements): #0052A3\n- Secondary (accents): #00B4D8\n- Neutral (backgrounds): #F7F8F9\n- Error (danger): #D32F2F (WCAG AAA on white)",
      "trade_offs": {
        "gain": [
          "Specific, implementable requirements",
          "Can validate color selection",
          "Accessibility considered upfront"
        ],
        "lose": [
          "Less flexibility for designers",
          "Changes require prompt update"
        ]
      },
      "effort": "low",
      "impact": "high"
    }
  ],
  "priority_improvements": [
    "completeness-1: Missing color values (HIGH impact, LOW effort)"
  ]
}
```

### User's Revised Prompt

```
Create theme.json color tokens with semantic naming:
- color-primary: #0052A3 (interactive elements, buttons, links)
- color-secondary: #00B4D8 (accents, hover states)
- color-neutral-bg: #F7F8F9 (backgrounds, low emphasis)
- color-neutral-text: #2D2D2D (body text)
- color-error: #D32F2F (errors, validation)
- color-success: #2E7D32 (success messages)

Accessibility: All text colors on white/light backgrounds meet WCAG AAA.
Format: Define in theme.json under settings.color.palette with slug and color values.
Usage: Referenced throughout patterns and templates via CSS custom properties (--color-primary, etc.)
```

### Final Validation

```json
{
  "status": "valid",
  "score": 9.1,
  "context": "wordpress-theme",
  "errors": [],
  "warnings": [],
  "checks": {
    "format": {"status": "pass", "items_passed": 8, "items_total": 8},
    "context_specific": {"status": "pass", "items_passed": 11, "items_total": 11},
    "standards": {"status": "pass", "items_passed": 9, "items_total": 9}
  },
  "recommendations": []
}
```

---

## Example 4: Batch Analysis Workflow

### Scenario: Improving Multiple Existing Prompts

A team has 5 prompts from different contexts and wants to systematically improve them.

---

### Batch Analysis

```javascript
const prompts = [
  {
    text: "Create a workflow",
    context: ".github"
  },
  {
    text: "Add a hook",
    context: "wordpress-plugin"
  },
  {
    text: "Create theme colors",
    context: "wordpress-theme"
  },
  {
    text: "Improve the system",
    context: null // auto-detect
  },
  {
    text: "Validate data",
    context: null
  }
];

const results = prompts.map(p => ({
  prompt: p.text,
  analysis: analyze(p.text, p.context),
  improvements: improve(p.text, p.context)
}));
```

### Summary Report

```
Prompt Quality Summary
======================

Average Clarity Score: 5.2/10

✅ Good Prompts (8+/10):  0
⚠️  Fair Prompts (5-7/10): 2  
❌ Poor Prompts (<5/10):  3

Priority: Improve all 3 poor prompts

Top Opportunities (by impact/effort):
1. Prompt 1: Add examples (HIGH impact, LOW effort)
2. Prompt 2: Specify hook behavior (HIGH impact, LOW effort)
3. Prompt 3: Define color values (HIGH impact, LOW effort)
4. Prompt 4: Add context and success criteria (HIGH impact, LOW effort)
5. Prompt 5: Clarify what 'validation' means (HIGH impact, LOW effort)

Estimated Time to Fix All: 1-2 hours
```

---

## Example 5: Iterative Refinement

### Scenario: Multi-Round Improvement Process

User submits a complex prompt and refines it through multiple iterations.

---

### Round 1

**Original Prompt:**

```
Build a workflow system that improves label management across repositories
and makes the process better.
```

**Clarity Score:** 2.5/10  
**Issue:** Too vague, no specifics

---

### Round 2 (After First Improvement)

**Revised Prompt:**

```
Create GitHub Actions workflows in .github/workflows/ that automatically sync
labels from .github/labels.yml to all repositories daily, creating missing
labels and updating changed labels.
```

**Clarity Score:** 7.2/10  
**Remaining Issues:** Missing error handling, no specification of what happens on failures

---

### Round 3 (After Second Improvement)

**Revised Prompt:**

```
Create .github/workflows/label-sync.yml workflow:
1. Daily trigger at 02:00 UTC
2. Read canonical labels from .github/labels.yml
3. For each label: create if missing, update if changed
4. Never delete labels (manual-only process)
5. Error handling: post comment on failed PRs with error details
6. Success: post summary comment if 5+ changes made
7. Required: GitHub App with 'issues:write' permission
8. Skip if already synced within last hour
```

**Clarity Score:** 9.1/10  
**Result:** ✅ Ready for implementation!

---

## Key Patterns from Examples

### Pattern 1: Bad → Good Progression

1. **Bad:** Vague goals, no examples, no specifics
2. **Better:** Add examples, specify output location, mention context
3. **Good:** Include specific values, error handling, success criteria, permissions
4. **Excellent:** Add examples, edge cases, performance considerations

### Pattern 2: Context-Specific Details

Each context requires different specifics:

**GitHub:** workflow paths, triggers, labels, permissions  
**Plugin:** hooks, actions/filters, priorities, callbacks  
**Theme:** theme.json structure, design tokens, WCAG standards

### Pattern 3: Score Progression

- **0-3:** Critical — major revisions needed (missing core information)
- **4-5:** Poor — significant gaps (missing examples, specifics)
- **6-7:** Fair — good foundation but needs polish (minor clarifications)
- **8-9:** Good — clear and implementable (minor suggestions optional)
- **9-10:** Excellent — ready to use as-is

---

## Testing the Agent

You can test the agent with these examples:

```javascript
// Test 1: GitHub workflow (should score ~8-9)
analyze(
  "Create .github/workflows/auto-label.yml that labels PRs " +
  "based on file changes. If package.json: add 'area:deps'..."
);

// Test 2: WordPress plugin (should score ~3-4 initially)
analyze("Add a hook for handling block validation");

// Test 3: WordPress theme (should score ~5-6)
analyze("Create design tokens for theme colors");

// Test 4: Generic prompt (should auto-detect context)
improve("Improve the system to be better");

// Test 5: Batch validation
const prompts = [...];
prompts.forEach(p => console.log(validate(p)));
```

---

## References

- [API.md](API.md) — Complete function reference
- [README.md](README.md) — Getting started guide
- [skills/analyze-prompt.skill.md](skills/analyze-prompt.skill.md) — Analysis methodology
- [skills/improve-prompt.skill.md](skills/improve-prompt.skill.md) — Improvement framework
- [skills/validate-prompt.skill.md](skills/validate-prompt.skill.md) — Validation rules

---

**Created:** 2026-08-12  
**Phase:** 2 (Core Implementation)  
**Status:** Active

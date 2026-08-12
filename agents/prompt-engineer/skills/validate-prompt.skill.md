---
name: validate-prompt
title: Validate Prompt Format
description: Validate prompt format, structure, and standards compliance
skill_type: validation
version: "1.0.0"
created: "2026-08-12"
---

# Validate Prompt Format & Standards

## Overview

This skill validates that prompts conform to:

1. **Format Standards:** Structure, syntax, grammar
2. **Context Standards:** `.github`, WordPress plugin, WordPress theme conventions
3. **Best Practices:** Clarity, completeness, constraint documentation
4. **Schema Compliance:** JSON/YAML structure where applicable

## Validation Categories

### 1. Format Validation

**Structure Checks:**

- [ ] Clear goal statement in first sentence
- [ ] Organized into logical sections
- [ ] Uses consistent formatting (headers, bullets, code blocks)
- [ ] Proper punctuation and grammar
- [ ] No undefined acronyms (define on first use)

**Syntax Checks:**

- [ ] Code examples have correct language tags (```json,```yaml, ```bash)
- [ ] JSON/YAML examples are valid syntax
- [ ] Links use proper Markdown format `[text](url)`
- [ ] No trailing whitespace
- [ ] Proper indentation in lists and code

**Completeness Checks:**

- [ ] Includes input specification
- [ ] Includes output specification
- [ ] Defines success criteria
- [ ] Documents failure modes
- [ ] Lists dependencies/prerequisites
- [ ] Specifies error handling

### 2. Context-Specific Validation

#### .github Control Plane

**Workflow Validation:**

- [ ] Workflow file path valid (`.github/workflows/name.yml`)
- [ ] Trigger events properly specified (push, pull_request, schedule, manual)
- [ ] Environment variables documented
- [ ] Required GitHub App permissions listed
- [ ] Concurrency strategy defined (if relevant)
- [ ] Matrix strategy properly scoped (if used)

**Label Validation:**

- [ ] All labels use canonical prefixes (type:, status:, priority:, area:, meta:)
- [ ] Label names follow kebab-case convention
- [ ] Label purposes documented
- [ ] No conflicting labels suggested
- [ ] Color codes valid hex format (if specified)

**Branching Validation:**

- [ ] Branch names follow pattern: `{type}/{scope}-{short-title}`
- [ ] Type is from approved list (feat, fix, docs, ci, etc.)
- [ ] Scope is lowercase kebab-case
- [ ] Base branch explicitly stated (develop or main)
- [ ] PR template routing documented

**Governance Validation:**

- [ ] Follows BRANCHING_STRATEGY.md conventions
- [ ] Respects main branch protection rules
- [ ] Complies with label prefix requirements
- [ ] Aligns with issue template standards

#### WordPress Plugin

**Plugin Header Validation:**

- [ ] plugin.json or plugin.php header present
- [ ] Plugin name specified
- [ ] Description provided
- [ ] Version number valid (semantic versioning)
- [ ] Author/license information included
- [ ] Minimum WordPress version documented

**Hook Registration Validation:**

- [ ] Hooks use proper action/filter names
- [ ] Hook priorities documented (default: 10)
- [ ] Hook parameters specified
- [ ] Callback function names follow convention (plugin_prefix_function_name)
- [ ] Deregistration logic documented

**Block Registration Validation:**

- [ ] Block.json structure valid against schema
- [ ] Block namespace uses plugin slug
- [ ] Block supports array properly formatted
- [ ] Editor/save rendering code specified
- [ ] Block scripts/styles properly enqueued

**Dependency Validation:**

- [ ] WordPress version requirements clear
- [ ] Required extensions/plugins listed
- [ ] PHP version requirements specified
- [ ] External dependencies documented

#### WordPress Theme

**Theme.json Validation:**

- [ ] Valid JSON syntax
- [ ] Conforms to theme.json schema
- [ ] Color palette properly structured
- [ ] Typography settings valid
- [ ] Spacing/layout values consistent
- [ ] Custom properties use -- prefix

**Design Token Validation:**

- [ ] Token names follow convention (spacing, color, typography, border-radius)
- [ ] Values are valid CSS (colors, sizes, etc.)
- [ ] Documentation includes design system intent
- [ ] WCAG AA color contrast verified
- [ ] Consistent naming across tokens

**Pattern Validation:**

- [ ] Pattern files in correct directory (patterns/)
- [ ] Pattern names use slug format
- [ ] Pattern metadata included (title, description)
- [ ] Pattern code is valid HTML
- [ ] Uses registered blocks only

**Template Validation:**

- [ ] Template hierarchy follows WordPress conventions
- [ ] Template names match expected patterns (index.html, single.html, etc.)
- [ ] Required templates present (at minimum: index.html)
- [ ] Templates use registered patterns and blocks

### 3. Standards Compliance

**Clarity Standards:**

- [ ] No vague action verbs (handle, manage, process → define specifically)
- [ ] Technical terms defined or explained
- [ ] Examples provided for complex concepts
- [ ] Jargon minimized or explained

**Completeness Standards:**

- [ ] Input specification clear
- [ ] Output specification concrete
- [ ] Success criteria measurable
- [ ] Failure modes documented
- [ ] Dependencies listed

**Constraint Standards:**

- [ ] Scope boundaries explicit
- [ ] Performance requirements stated
- [ ] Resource limits acknowledged
- [ ] Timeframe specified
- [ ] Priority hierarchy defined

**Documentation Standards:**

- [ ] Uses UK English (optimise, organisation, colour)
- [ ] Follows project's documentation format
- [ ] Includes related references
- [ ] Cross-references are accurate
- [ ] No broken internal links

## Validation Output Format

```json
{
  "status": "valid" | "invalid" | "warning",
  "score": 9.2,
  "context": ".github" | "wordpress-plugin" | "wordpress-theme" | "generic",
  "errors": [
    {
      "type": "format",
      "severity": "error",
      "message": "Invalid workflow file path",
      "location": "Line 5",
      "suggestion": "Use .github/workflows/{name}.yml format"
    }
  ],
  "warnings": [
    {
      "type": "completeness",
      "severity": "warning",
      "message": "Missing error handling specification",
      "suggestion": "Add section describing behavior on error"
    }
  ],
  "checks": {
    "format": {
      "status": "pass",
      "items_passed": 7,
      "items_total": 8
    },
    "context_specific": {
      "status": "pass",
      "items_passed": 12,
      "items_total": 12
    },
    "standards": {
      "status": "pass",
      "items_passed": 9,
      "items_total": 10
    }
  },
  "recommendations": [
    "Add 2 concrete examples of expected behavior",
    "Define what constitutes success for this prompt"
  ]
}
```

## Severity Levels

**ERROR:** Must fix before deployment

- Invalid syntax (broken JSON, YAML, etc.)
- Unsafe operations (deleting without confirmation)
- Security issues (hardcoded credentials)
- Breaking governance rules

**WARNING:** Should fix before deployment

- Missing documentation
- Incomplete specifications
- Ambiguous instructions
- Best practice violations

**INFO:** Nice to have

- Stylistic improvements
- Documentation enhancements
- Minor clarity improvements

## Validation Rules by Context

### .github Rules

1. **Workflow files must be in .github/workflows/**
2. **All labels must use canonical prefixes (type:, status:, etc.)**
3. **Branch names must follow {type}/{scope}-{title} pattern**
4. **Pull requests must target develop (except release/hotfix to main)**
5. **Labels must be from .github/labels.yml canonical set**

### WordPress Plugin Rules

1. **Block namespaces must use plugin slug**
2. **Hooks must use standard naming: add_action, add_filter, do_action, apply_filters**
3. **Plugin version must follow semantic versioning**
4. **Register hooks in correct hook (usually after_setup_theme or plugins_loaded)**

### WordPress Theme Rules

1. **Theme.json must be valid JSON**
2. **Design tokens must use consistent naming**
3. **All colors must have documented WCAG contrast ratio**
4. **Patterns must use registered blocks only**
5. **Templates must follow hierarchy (index.html required)**

## Validation Checklist

Use this checklist when validating any prompt:

```
General Format:
☐ Structure is clear and organized
☐ Grammar and spelling correct
☐ Code examples have proper syntax highlighting
☐ Links are in Markdown format
☐ No undefined acronyms

Context Detection:
☐ Prompt context explicitly identified
☐ Context-specific rules applied
☐ Platform-specific conventions followed

Requirements:
☐ Goal/objective clearly stated
☐ Input format specified
☐ Output format specified
☐ Success criteria defined
☐ Error handling documented

Standards Compliance:
☐ Vague language eliminated
☐ All terms either standard or defined
☐ Examples provided (where helpful)
☐ Constraints explicitly stated

Documentation:
☐ Uses UK English
☐ Follows project formatting
☐ Includes references
☐ Links are valid
```

## Automatic Validation Points

Check automatically:

- Markdown syntax validity
- Code block language tags
- JSON/YAML syntax in examples
- URL format and validity
- Acronym definition (first use)
- Image alt text (if images included)
- Table structure validity

## Examples

### Example 1: Valid Prompt (.github context)

**Prompt:**

```
Create GitHub Actions workflow that syncs labels from .github/labels.yml daily.

File: .github/workflows/label-sync.yml
Trigger: Daily at 02:00 UTC (schedule: '0 2 * * *')

Rules:
1. Read canonical labels from .github/labels.yml
2. For each label:
   - If missing in repo: create with description and color
   - If present but description differs: update
   - If color differs: update
3. Delete no labels (manual-only process)
4. Post summary comment if 5+ changes

Required: GitHub App with 'issues' write scope
Output: Workflow file + summary comment on pull requests (dry-run mode)
Success: Labels synced daily with 100% accuracy
```

**Validation Result:**

```json
{
  "status": "valid",
  "score": 9.5,
  "context": ".github",
  "errors": [],
  "warnings": [],
  "checks": {
    "format": {"status": "pass", "items_passed": 8, "items_total": 8},
    "context_specific": {"status": "pass", "items_passed": 12, "items_total": 12},
    "standards": {"status": "pass", "items_passed": 10, "items_total": 10}
  }
}
```

### Example 2: Invalid Prompt (WordPress Plugin context)

**Prompt:**

```
Add hook for handling block data changes.
```

**Validation Result:**

```json
{
  "status": "invalid",
  "score": 3.2,
  "context": "wordpress-plugin",
  "errors": [
    {
      "type": "completeness",
      "severity": "error",
      "message": "No hook type specified (action vs. filter)",
      "suggestion": "Clarify: is this add_action or apply_filters?"
    },
    {
      "type": "format",
      "severity": "error",
      "message": "Missing hook name",
      "suggestion": "Specify exact hook name (e.g., 'my-plugin/block-save')"
    }
  ],
  "warnings": [
    {
      "type": "clarity",
      "severity": "warning",
      "message": "Vague term 'handling' used",
      "suggestion": "Replace with specific action: 'validate', 'save', 'sanitize'"
    },
    {
      "type": "completeness",
      "severity": "warning",
      "message": "No hook parameters documented",
      "suggestion": "Specify what parameters are passed to the hook"
    }
  ]
}
```

## Testing

Test validation with:

- Valid prompts from each context (should pass with score >8)
- Invalid prompts with known issues (should catch errors)
- Partially complete prompts (should flag warnings)
- Real prompts from project repositories
- Edge cases: very long, mixed contexts, technical prompts

## Related Skills

- `analyze-prompt.skill.md` - Identify clarity issues
- `improve-prompt.skill.md` - Suggest improvements
- `validate-wordpress.skill.md` - WordPress-specific validation (hooks, blocks, themes)

## References

- [CLAUDE.md](../../CLAUDE.md) - Project standards and conventions
- [BRANCHING_STRATEGY.md](../../docs/BRANCHING_STRATEGY.md) - GitHub governance rules
- [LABELING.md](../../docs/LABELING.md) - Label naming standards
- [.github/labels.yml](.github/labels.yml) - Canonical label set
- [WordPress Plugin Development](https://developer.wordpress.org/plugins/)
- [WordPress Theme Development](https://developer.wordpress.org/themes/)
- [Theme.json Specification](https://developer.wordpress.org/themes/global-settings-and-styles/settings/)

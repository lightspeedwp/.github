---
name: wordpress-block-pattern-validator
description: >
  Validate and fix WordPress block pattern files to ensure HTML matches block
  comment attributes. Use when debugging block validation errors, fixing font
  family attribute mismatches, correcting malformed CSS classes (e.g., has-h-3-font-size
  vs has-h3-font-size), ensuring pattern files pass WordPress core rendering rules,
  or detecting redundant fontFamily attributes that WordPress strips on save.
license: MIT
compatibility: Requires Node.js 18+
metadata:
  version: "1.0.0"
  author: lightspeedwp
---

# WordPress Block Pattern Validator

## Purpose

Validate and fix WordPress block pattern files to ensure HTML output matches block comment attributes according to WordPress core rendering rules.

## Core Capabilities

- Parse WordPress block comments and extract JSON attributes
- Validate HTML output against WordPress rendering rules
- Detect missing or incorrect CSS classes
- Detect missing or incorrect inline styles
- Detect redundant `fontFamily` attributes (WordPress strips on save)
- Detect malformed font size classes (e.g., `has-h-3-font-size`)
- Detect non-WordPress block comments (descriptive HTML comments)
- Auto-fix common rendering errors
- Generate validation reports with line-by-line details

## Quick Start

```bash
# Validate a single pattern
node scripts/validate-patterns.cjs patterns/hero.php

# Validate and fix all patterns
node scripts/validate-patterns.cjs patterns/ --fix

# Dry-run (preview changes without modifying)
node scripts/validate-patterns.cjs patterns/ --fix --dry-run

# Verbose output
node scripts/validate-patterns.cjs patterns/ --verbose
```

## Common Validation Errors

### 1. Redundant Font Family Attributes

**Problem**: WordPress strips `fontFamily` attributes that match theme defaults, causing validation mismatches.

```html
<!-- WRONG (causes validation error) -->
<!-- wp:heading {"style":{"typography":{"fontFamily":"var:preset|font-family|inter"}}} -->
<h3 class="wp-block-heading">Text</h3>

<!-- CORRECT (no validation error) -->
<!-- wp:heading {} -->
<h3 class="wp-block-heading">Text</h3>
```

**Solution**: Remove `fontFamily` from block attributes when it matches your theme.json default.

### 2. Malformed Font Size Classes

**Problem**: Typos in font size class names cause validation errors.

```html
<!-- WRONG (extra dash) -->
<h3 class="wp-block-heading has-h-3-font-size">Text</h3>

<!-- CORRECT -->
<h3 class="wp-block-heading has-h3-font-size">Text</h3>
```

**Solution**: Ensure font size class matches `has-{fontSize}-font-size` pattern.

### 3. Invalid HTML Comments

**Problem**: Descriptive HTML comments interfere with WordPress block parsing.

```html
<!-- WRONG (not a WordPress block comment) -->
<!-- Social Media Icons -->
<!-- wp:social-links {...} -->

<!-- CORRECT (only WordPress block comments) -->
<!-- wp:social-links {...} -->
```

**Solution**: Remove all descriptive HTML comments from pattern files.

## Validation Workflow

1. **Parse Block Comments** - Extract block type and JSON attributes
2. **Compare Against Rendering Rules** - Check HTML matches expected output
3. **Report Mismatches** - Identify specific issues with line numbers
4. **Auto-Fix** - Optionally correct common errors
5. **Validate JSON** - Ensure attributes are valid JSON

## Common Use Cases

- Debugging block validation errors in WordPress editor
- Cleaning up patterns after manual edits
- Enforcing consistent pattern structure
- Preventing fontFamily attribute issues
- Ensuring patterns work across different themes

## Validation Output Example

```
🔍 Validating: patterns/hero.php

❌ Line 15: Redundant fontFamily attribute
   Block: wp:button
   Issue: fontFamily matches theme default
   Fix: Remove "fontFamily":"var:preset|font-family|inter"

⚠️  Line 23: Malformed font size class
   Expected: has-h3-font-size
   Actual: has-h-3-font-size
   
✅ Validation complete: 2 errors found
```

For detailed validation rules, WordPress rendering specifications, and troubleshooting, see [Validation Rules Reference](references/VALIDATION-RULES.md).

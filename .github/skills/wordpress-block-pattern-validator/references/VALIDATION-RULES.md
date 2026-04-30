# WordPress Block Pattern Validator

Validates and automatically fixes WordPress block pattern files to ensure HTML output matches block comment attributes according to WordPress core rendering rules.

## Recent Updates

✅ **Navigation Block Syntax Validation** - Now validates block comment syntax: detects when navigation blocks incorrectly use self-closing (`/-->`) with children, which causes WordPress parsing errors!

✅ **Comment Validation** - Now detects and flags non-WordPress block comments (descriptive HTML comments) that shouldn't exist in block templates!

✅ **Critical Block Validation Error Detection** - Now detects redundant `fontFamily` attributes and malformed font size classes that cause WordPress editor validation errors!

✅ **Button Block Handling** - The validator now correctly validates button blocks by checking the inner `<a class="wp-block-button__link">` tag instead of the wrapper div, matching WordPress core rendering behavior. No more false positives!

✅ **Custom Notation Support** - Now handles both `var:preset|` and `var:custom|` notation for colors, spacing, typography, and border properties.

✅ **Typography & Color Validation** - Properly validates custom colors and typography values from `style.color.text`, `style.color.background`, and `style.typography.*` attributes.

## Files

- **[SKILL.md](./SKILL.md)** - Complete skill documentation with validation rules and examples
- **[validate-patterns.cjs](./validate-patterns.cjs)** - Node.js validation script

## Quick Start

### Validate a Single File

```bash
node validate-patterns.cjs path/to/pattern.php
```

### Validate and Auto-Fix

```bash
node validate-patterns.cjs path/to/pattern.php --fix
```

### Validate All Patterns in a Directory

```bash
node validate-patterns.cjs wp-content/themes/your-theme/patterns/ --verbose
```

### Validate Without Making Changes (Dry Run)

```bash
node validate-patterns.cjs patterns/ --fix --dry-run
```

## What It Checks

### ⚠️ Critical Block Validation Errors

#### Redundant Font Family Attributes
Detects when `fontFamily` is specified in block attributes but will be stripped by WordPress (causing validation errors):

```html
<!-- ❌ CAUSES VALIDATION ERROR -->
<!-- wp:heading {"style":{"typography":{"fontFamily":"var:preset|font-family|roboto-serif"}}} -->
<h3 class="wp-block-heading">Text</h3>

<!-- ✅ FIXED - fontFamily removed -->
<!-- wp:heading {} -->
<h3 class="wp-block-heading">Text</h3>
```

**Button Block Example:**
```html
<!-- ❌ CAUSES VALIDATION ERROR - fontFamily matches theme default -->
<!-- wp:button {...,"typography":{"fontFamily":"var:preset|font-family|inter","fontWeight":"600"}...} -->

<!-- ✅ FIXED - fontFamily removed, fontWeight kept -->
<!-- wp:button {...,"typography":{"fontWeight":"600"}...} -->
```

#### Default Font Size Optimization
WordPress handles `fontSize="base"` differently for button wrapper vs link:

```html
<!-- Block attributes have fontSize="base" -->
<!-- wp:button {...,"fontSize":"base"} -->

<!-- ❌ WRONG - wrapper should not have font size classes when base -->
<div class="wp-block-button has-base-font-size">
  <a class="wp-block-button__link has-base-font-size has-custom-font-size ...">Text</a>
</div>

<!-- ✅ CORRECT - wrapper has no classes, link has both classes -->
<div class="wp-block-button">
  <a class="wp-block-button__link has-base-font-size has-custom-font-size ...">Text</a>
</div>

<!-- For custom sizes like fontSize="sm", both get classes -->
<div class="wp-block-button has-custom-font-size has-sm-font-size">
  <a class="wp-block-button__link has-sm-font-size has-custom-font-size ...">Text</a>
</div>
```

**Key Rule:** Link element `<a>` always gets font size classes, wrapper `<div>` only for non-default sizes.

#### Malformed Font Size Classes
Catches typos in font size class names:

```html
<!-- ❌ WRONG - extra dash causes validation error -->
<!-- wp:heading {"fontSize":"h3"} -->
<h3 class="wp-block-heading has-h-3-font-size">Text</h3>

<!-- ✅ CORRECT -->
<!-- wp:heading {"fontSize":"h3"} -->
<h3 class="wp-block-heading has-h3-font-size">Text</h3>
```

#### Invalid HTML Comments (Non-WordPress Block Comments)
Detects descriptive HTML comments that shouldn't exist in block templates:

```html
<!-- ❌ INVALID - Descriptive comment not allowed -->
<!-- Social Media Icons -->
<!-- wp:social-links {...} -->
<ul class="wp-block-social-links">...</ul>
<!-- /wp:social-links -->

<!-- ✅ VALID - Only WordPress block comments -->
<!-- wp:social-links {...} -->
<ul class="wp-block-social-links is-style-logos-only header-social">...</ul>
<!-- /wp:social-links -->
```

**Valid comments:**
- `<!-- wp:blockname {...} -->` (opening block)
- `<!-- /wp:blockname -->` (closing block)
- `<!-- wp:namespace/blockname {...} -->` (third-party blocks like WooCommerce)

**Invalid comments (will be flagged):**
- `<!-- Social Media Icons -->` ❌
- `<!-- Top Navigation Links -->` ❌
- `<!-- Newsletter Section -->` ❌

### ✅ Color Classes
- `backgroundColor` → `has-{color}-background-color has-background`
- `textColor` → `has-{color}-color has-text-color`

### ✅ Spacing Styles
- `style.spacing.padding` → `padding-*:value` (inline styles)
- `style.spacing.margin` → `margin-*:value` (inline styles)
- Converts `var:preset|spacing|60` → `var(--wp--preset--spacing--60)`

### ✅ Border Styles
- `style.border.radius` → `border-radius:value`
- Other border properties

### ✅ Layout Classes
- `align` → `align{value}` (e.g., `alignfull`)
- `textAlign` → `has-text-align-{value}`

### ✅ Typography
- `fontSize` → `has-{size}-font-size`
- Custom font sizes as inline styles

### ✅ Cover Block Structure
- Validates correct child element order: `<img>` → `<span>` → `<div>`
- Checks for `data-object-fit="cover"` attribute on images
- Verifies proper overlay background classes

### ✅ Navigation Block Syntax

Navigation blocks must use correct block comment syntax:

**⚠️ Common Mistake (Self-Closing WITH Children):**
```html
<!-- ❌ WRONG - Self-closing but has children and closing tag -->
<!-- wp:navigation {"overlayMenu":"never"} /-->
  <!-- wp:navigation-link {"label":"Home","url":"/"} /-->
  <!-- wp:navigation-link {"label":"About","url":"/about"} /-->
<!-- /wp:navigation -->
```

**✅ CORRECT - Two Valid Options:**

*Option 1: Self-closing (no children):*
```html
<!-- wp:navigation {"ref":123,"overlayMenu":"never"} /-->
```

*Option 2: With children (not self-closing):*
```html
<!-- wp:navigation {"overlayMenu":"never","layout":{"type":"flex"}} -->
  <!-- wp:navigation-link {"label":"Home","url":"/"} /-->
  <!-- wp:navigation-link {"label":"About","url":"/about"} /-->
<!-- /wp:navigation -->
```

**Key Rule:** If block has children, opening tag must end with `-->` (NOT `/-->`)

## Common Errors Fixed

### Missing Color Flags
**Before:**
```html
<!-- wp:group {"backgroundColor":"primary"} -->
<div class="wp-block-group has-primary-background-color">
```

**After:**
```html
<!-- wp:group {"backgroundColor":"primary"} -->
<div class="wp-block-group has-primary-background-color has-background">
```

### Missing Inline Styles
**Before:**
```html
<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|60"}}}} -->
<div class="wp-block-group">
```

**After:**
```html
<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|60"}}}} -->
<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--60)">
```

### Incorrect Preset Notation
**Before:**
```html
style="padding-top:var:preset|spacing|60"
```

**After:**
```html
style="padding-top:var(--wp--preset--spacing--60)"
```

### Cover Block Structure
**Before (Incorrect order with descriptive alt):**
```html
<!-- wp:cover -->
<div class="wp-block-cover">
    <span class="wp-block-cover__background"></span>
    <img class="wp-block-cover__image-background" src="image.jpg" alt="Description" />
    <div class="wp-block-cover__inner-container">...</div>
</div>
```

**After (Correct WordPress structure):**
```html
<!-- wp:cover -->
<div class="wp-block-cover"><img class="wp-block-cover__image-background" alt="" src="image.jpg" data-object-fit="cover"/><span class="wp-block-cover__background"></span><div class="wp-block-cover__inner-container">...</div></div>
```

**Key fixes:**
- Image moved to first position
- Added `data-object-fit="cover"` attribute
- Changed to empty `alt=""` (decorative image)
- Removed whitespace (WordPress outputs inline)

## Example Usage

### From Your Theme Directory

```bash
# Validate all patterns
node /path/to/validate-patterns.cjs patterns/

# Fix all patterns
node /path/to/validate-patterns.cjs patterns/ --fix

# Validate specific category
node /path/to/validate-patterns.cjs patterns/hero-*.php --verbose
```

### Integration with npm Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "validate:patterns": "node scripts/validate-patterns.cjs patterns/",
    "fix:patterns": "node scripts/validate-patterns.cjs patterns/ --fix"
  }
}
```

Then run:
```bash
npm run validate:patterns
npm run fix:patterns
```

## Sample Output

```
============================================================
WordPress Block Pattern Validation Report
============================================================

✅ patterns/hero-home.php

❌ patterns/section-newsletter-cta-full.php
   Found 5 error(s)

   Error 1:
   Block: group (Line 9)
   HTML Tag: Line 10
   Missing classes: has-text-color, has-background
   Missing styles: padding-top:var(--wp--preset--spacing--60);
                   padding-right:var(--wp--preset--spacing--50)

============================================================
Files scanned: 2
Files with errors: 1
Total errors: 5
============================================================
```

## Known Limitations

1. **Button Blocks (Now Handled)**: ✅ The validator now correctly handles button blocks by checking the **inner `<a class="wp-block-button__link">` tag** instead of the wrapper div, matching WordPress core rendering behavior.
   
   **WordPress button block structure**:
   ```html
   <!-- wp:button {"backgroundColor":"primary","textColor":"base"} -->
   <div class="wp-block-button">  <!-- Wrapper: minimal classes -->
       <a class="wp-block-button__link has-primary-background-color has-base-color has-text-color has-background">
         <!-- ✅ Validator checks this tag -->
       </a>
   </div>
   ```

2. **Complex Nested Structures**: For deeply nested blocks, manual review may be needed.

3. **Custom Block Types**: Only validates core WordPress blocks. Custom blocks may have different rendering rules.

## Roadmap

- [x] Handle button inner `<a>` tag validation ✅ **Completed**
- [ ] Support custom block types via configuration
- [ ] Add theme.json color/spacing preset validation
- [ ] Generate pattern documentation from validation
- [ ] VS Code extension integration

## Related Documentation

- [SKILL.md](./SKILL.md) - Full validation rules and algorithm
- [WordPress Block Supports](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/)
- [WordPress Inline Documentation](https://developer.wordpress.org/coding-standards/inline-documentation-standards/)

## Support

For issues or questions:
- GitHub Discussions: https://github.com/orgs/lightspeedwp/discussions
- Email: support@lightspeedwp.agency

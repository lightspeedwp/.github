# WordPress Block Pattern Validator Skill

## Description

Expert in validating and fixing WordPress block pattern files to ensure HTML output matches block comment attributes according to WordPress core rendering rules. Detects and corrects mismatches between block attributes (JSON in comments) and their corresponding HTML output, including redundant fontFamily attributes and malformed font size classes that cause block validation errors.

## Capabilities

- Parse WordPress block comments and extract JSON attributes
- Validate HTML output against WordPress core rendering rules
- Detect missing or incorrect CSS classes
- Detect missing or incorrect inline styles
- **Detect redundant `fontFamily` attributes that WordPress strips on save**
- **Detect malformed font size classes (e.g., `has-h-3-font-size` vs `has-h3-font-size`)**
- **Detect and flag non-WordPress block comments (descriptive HTML comments)**
- Auto-fix common rendering errors in pattern files
- Scan multiple pattern files for validation errors
- Generate validation reports with line-by-line error details

## Critical Block Validation Error Checks

### Redundant Font Family Attributes

WordPress optimizes saved content by stripping CSS properties that match theme defaults. This causes block validation errors when:

**Problem:**
- Block attributes include: `"style":{"typography":{"fontFamily":"var:preset|font-family|roboto-serif"}}`
- WordPress renders it in the editor with: `style="font-family:var(--wp--preset--font-family--roboto-serif)"`
- But the saved database content omits it (because it matches the theme default)
- Result: **Block validation error** ❌

**Solution:**
- Remove `fontFamily` from block attributes if it matches your `theme.json` default
- The validator detects this pattern and warns you

**Example:**
```html
<!-- BEFORE (causes validation error) -->
<!-- wp:heading {"style":{"typography":{"fontFamily":"var:preset|font-family|roboto-serif"}}} -->
<h3 class="wp-block-heading">Text</h3>

<!-- AFTER (no validation error) -->
<!-- wp:heading {} -->
<h3 class="wp-block-heading">Text</h3>
```

### Malformed Font Size Classes

Typos in font size class names cause block validation mismatches.

**Problem:**
- Block attributes: `"fontSize":"h3"`
- Expected HTML: `class="wp-block-heading has-h3-font-size"`
- Actual HTML: `class="wp-block-heading has-h-3-font-size"` (extra dash)
- Result: **Block validation error** ❌

**Solution:**
- Ensure font size class matches the pattern: `has-{fontSize}-font-size`
- No extra dashes or characters in the slug

**Example:**
```html
<!-- WRONG (causes validation error) -->
<!-- wp:heading {"fontSize":"h3"} -->
<h3 class="wp-block-heading has-h-3-font-size">Text</h3>

<!-- CORRECT (no validation error) -->
<!-- wp:heading {"fontSize":"h3"} -->
<h3 class="wp-block-heading has-h3-font-size">Text</h3>
```

### Invalid HTML Comments (Non-WordPress Block Comments)

WordPress block templates and patterns should **only** contain WordPress block comments. Descriptive HTML comments are not allowed and may interfere with block parsing.

**Problem:**
- Template contains descriptive comments like: `<!-- Social Media Icons -->`, `<!-- Top Navigation Links -->`, `<!-- Newsletter Section -->`
- These are standard HTML comments, not WordPress block comments
- WordPress block template parser expects only block-related comments
- Result: **Potential parsing issues** ❌ and template pollution

**Valid WordPress Block Comments:**
- Opening block: `<!-- wp:blockname {...} -->`
- Closing block: `<!-- /wp:blockname -->`
- Third-party blocks: `<!-- wp:namespace/blockname {...} -->` (e.g., `<!-- wp:woocommerce/mini-cart -->`)

**Invalid Comments (will be flagged):**
- `<!-- Social Media Icons -->` ❌
- `<!-- Top Navigation Links -->` ❌
- `<!-- Newsletter CTA Section -->` ❌
- `<!-- Column 1: About Us -->` ❌

**Solution:**
- Remove ALL descriptive HTML comments from block templates
- WordPress block structure should be self-documenting through proper nesting and block types
- Use meaningful class names instead of comments to identify sections

**Example:**
```html
<!-- WRONG (validator will flag these) -->
<!-- Social Media Icons -->
<!-- wp:social-links {...} -->
<ul class="wp-block-social-links">...</ul>
<!-- /wp:social-links -->

<!-- CORRECT (no descriptive comments) -->
<!-- wp:social-links {...} -->
<ul class="wp-block-social-links is-style-logos-only header-social">...</ul>
<!-- /wp:social-links -->
```

Note: The validator checks for any HTML comment that doesn't start with `wp:` or `/wp:` and flags it as an error.

## Common WordPress Block Rendering Rules

### Color Attributes

#### Background Color
- **Attribute**: `"backgroundColor":"color-slug"`
- **Required Classes**: `has-{color-slug}-background-color has-background`
- **Example**: `"backgroundColor":"primary"` → `has-primary-background-color has-background`

#### Text Color
- **Attribute**: `"textColor":"color-slug"`
- **Required Classes**: `has-{color-slug}-color has-text-color`
- **Example**: `"textColor":"base"` → `has-base-color has-text-color`

#### Custom Colors
- **Attribute**: `"style":{"color":{"background":"#hexcode"}}`
- **Inline Style**: `background-color:#hexcode`

### Spacing Attributes

#### Padding
- **Attribute**: `"style":{"spacing":{"padding":{"top":"var:preset|spacing|60"}}}`
- **Inline Style**: `padding-top:var(--wp--preset--spacing--60)`
- **Rule**: Convert pipe notation to CSS custom property (double hyphens)

#### Margin
- **Attribute**: `"style":{"spacing":{"margin":{"bottom":"2rem"}}}`
- **Inline Style**: `margin-bottom:2rem`

### Layout Attributes

#### Alignment
- **Attribute**: `"align":"full"`
- **Required Class**: `alignfull`
- **Values**: `wide` → `alignwide`, `left` → `alignleft`, `right` → `alignright`, `center` → `aligncenter`

#### Text Alignment
- **Attribute**: `"textAlign":"center"`
- **Required Class**: `has-text-align-center`

### Border Attributes

#### Border Radius
- **Attribute**: `"style":{"border":{"radius":"8px"}}`
- **Inline Style**: `border-radius:8px`

#### Border Width/Color
- **Attribute**: `"style":{"border":{"width":"2px","color":"#000"}}`
- **Inline Style**: `border-width:2px;border-color:#000`

### Typography Attributes

#### Font Size
- **Attribute**: `"fontSize":"large"`
- **Required Class**: `has-large-font-size`

#### Custom Font Size
- **Attribute**: `"style":{"typography":{"fontSize":"2rem"}}`
- **Inline Style**: `font-size:2rem`

### Custom Class Names

- **Attribute**: `"className":"my-custom-class"`
- **Required Class**: `my-custom-class` (added as-is)

### Cover Block Structure

The **Cover block** has a specific HTML structure that must be followed for proper rendering:

**WordPress Core Structure** (correct order):
```html
<div class="wp-block-cover ...">
  <img class="wp-block-cover__image-background" alt="" src="..." data-object-fit="cover"/>
  <span aria-hidden="true" class="wp-block-cover__background ..."></span>
  <div class="wp-block-cover__inner-container">
    <!-- Inner content -->
  </div>
</div>
```

**Required element order:**
1. **Image** (`<img class="wp-block-cover__image-background">`) - Must be first child
2. **Background overlay** (`<span class="wp-block-cover__background">`) - Must be second child
3. **Inner container** (`<div class="wp-block-cover__inner-container">`) - Must be third child

**Image attributes:**
- Must include `data-object-fit="cover"` attribute
- Use `alt=""` for decorative images (WordPress default)
- Class must be `wp-block-cover__image-background`

**Common mistakes:**
- ❌ Placing `<span>` before `<img>`
- ❌ Missing `data-object-fit="cover"` on image
- ❌ Using descriptive alt text instead of empty `alt=""`
- ❌ Formatting with line breaks (WordPress outputs inline)

## Validation Algorithm

### Step 1: Parse Block Comment
```
1. Extract block type (e.g., "wp:group", "wp:button")
2. Parse JSON attributes object
3. Identify line number of block comment
```

### Step 2: Extract HTML Output
```
1. Get the next non-empty line after block comment
2. Parse opening tag (div, h1, p, a, etc.)
3. Extract class attribute
4. Extract style attribute
```

### Step 3: Validate Classes
```
For each attribute in block comment:
  - backgroundColor → Check for has-{value}-background-color AND has-background
  - textColor → Check for has-{value}-color AND has-text-color
  - align → Check for align{value}
  - textAlign → Check for has-text-align-{value}
  - fontSize → Check for has-{value}-font-size
  - className → Check for {value} (literal)
```

### Step 4: Validate Inline Styles
```
For style object in attributes:
  - spacing.padding → Check padding-{side}:value
  - spacing.margin → Check margin-{side}:value
  - border.radius → Check border-radius:value
  - border.width → Check border-width:value
  - color.background → Check background-color:value
  - color.text → Check color:value
  - typography.fontSize → Check font-size:value
  
Convert preset notation:
  var:preset|spacing|60 → var(--wp--preset--spacing--60)
  var:preset|color|primary → var(--wp--preset--color--primary)
  var:custom|border-radius|200 → var(--wp--custom--border-radius--200)
```

### Step 5: Generate Corrections
```
1. Build correct class string with proper order
2. Build correct style string
3. Create replacement HTML line
```

## Class Ordering Convention

WordPress typically outputs classes in this order:
```
{base-block-class} {alignment} {custom-classes} {text-color} {text-color-flag} {background-color} {background-flag} {font-size}
```

Example:
```
wp-block-group alignfull my-custom-class has-base-color has-text-color has-primary-background-color has-background
```

## Usage

### Validate Single File
```
Please validate the WordPress block pattern file at [path] and fix any rendering errors.
```

### Validate Multiple Files
```
Please scan all pattern files in [directory] and fix WordPress block rendering errors.
```

### Validate with Report
```
Generate a validation report for pattern files in [directory] showing all errors without fixing them.
```

## Error Types

### Type 1: Missing Color Classes
- **Error**: `backgroundColor` attribute present but missing `has-background` class
- **Fix**: Add `has-background` class
- **Severity**: High (renders incorrectly)

### Type 2: Missing Style Attributes
- **Error**: `style.spacing.padding` attribute present but no inline `padding-*` styles
- **Fix**: Generate and add inline style attribute
- **Severity**: High (spacing not applied)

### Type 3: Incorrect Preset Notation
- **Error**: Using `var:preset|spacing|60` in HTML instead of `var(--wp--preset--spacing--60)`
- **Fix**: Convert to CSS custom property syntax
- **Severity**: High (style not applied)

### Type 4: Missing Text Color Flag
- **Error**: `textColor` attribute present but missing `has-text-color` class
- **Fix**: Add `has-text-color` class
- **Severity**: Medium (may affect theme color inheritance)

### Type 5: Class Order Issues
- **Error**: Classes in non-standard order
- **Fix**: Reorder to WordPress convention
- **Severity**: Low (cosmetic, no functional impact)

### Type 6: Button Block Handling (Resolved)
- **Previous Issue**: Early versions reported missing classes/styles on `<div class="wp-block-button">`
- **Current Behavior**: ✅ Validator now correctly checks the **inner `<a>` tag** where WordPress applies attributes
- **WordPress Behavior**: Button blocks use a two-layer structure:
  ```html
  <!-- wp:button {"backgroundColor":"primary","textColor":"base"} -->
  <div class="wp-block-button">                    <!-- Wrapper: minimal classes -->
      <a class="wp-block-button__link has-primary-background-color has-base-color has-text-color has-background">
        Button Text  <!-- ✅ Validator checks this tag -->
      </a>
  </div>
  ```
- **Implementation**: The validator automatically detects button blocks and extracts the inner `<a>` tag for validation, ensuring accurate results.

## Output Format

### Validation Report
```
WordPress Block Pattern Validation Report
==========================================

File: patterns/section-newsletter-cta-full.php
Status: ❌ 2 errors found

Error 1: Line 9-10
Block: wp:group
Issue: Missing inline styles for padding
Expected style: padding-top:var(--wp--preset--spacing--60);padding-right:var(--wp--preset--spacing--50);padding-bottom:var(--wp--preset--spacing--60);padding-left:var(--wp--preset--spacing--50)
Missing classes: has-text-color, has-background

Error 2: Line 26
Block: wp:button (inner link)
Missing classes: has-text-color, has-background

Total files scanned: 1
Files with errors: 1
Total errors: 2
```

## Script Implementation

The validation can be implemented as:

1. **PHP Script** - Can use `parse_blocks()` WordPress function
2. **Node.js Script** - Custom parser for block comments
3. **GitHub Copilot Agent** - On-demand validation and fixing

## Best Practices

1. **Always backup** before running batch fixes
2. **Validate after generation** - Run validator on newly created patterns
3. **Test rendering** - Check pattern in block editor after fixes
4. **Version control** - Commit before and after validation runs
5. **Document custom rules** - If theme has custom block rendering, document it
6. **Button blocks** - ✅ Now handled automatically by the validator
7. **Review validation reports** - Check verbose output to understand what's being validated

## Integration Points

### Pre-commit Hook
```bash
#!/bin/bash
# Validate WordPress patterns before commit
node scripts/validate-patterns.js patterns/**/*.php
```

### CI/CD Pipeline
```yaml
- name: Validate WordPress Patterns
  run: |
    npm run validate:patterns
    if [ $? -ne 0 ]; then exit 1; fi
```

### VS Code Task
```json
{
  "label": "Validate WordPress Patterns",
  "type": "shell",
  "command": "node scripts/validate-patterns.js ${file}"
}
```

## Examples

### Before Validation
```php
<!-- wp:group {"backgroundColor":"primary","textColor":"base","style":{"spacing":{"padding":{"top":"var:preset|spacing|60"}}}} -->
<div class="wp-block-group has-primary-background-color has-base-color">
```

### After Validation
```php
<!-- wp:group {"backgroundColor":"primary","textColor":"base","style":{"spacing":{"padding":{"top":"var:preset|spacing|60"}}}} -->
<div class="wp-block-group has-base-color has-text-color has-primary-background-color has-background" style="padding-top:var(--wp--preset--spacing--60)">
```

## Related Skills

- [wordpress-block-pattern-generator](../wordpress-block-pattern-generator/SKILL.md) - Generate new patterns
- WordPress Block Pattern Best Practices
- WordPress Theme.json Configuration

## References

- [WordPress Block Editor Handbook - Block Supports](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/)
- [WordPress Core - `get_block_wrapper_attributes()`](https://developer.wordpress.org/reference/functions/get_block_wrapper_attributes/)
- [WordPress Core - Block Parser](https://developer.wordpress.org/reference/classes/wp-block-parser/)

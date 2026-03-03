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

### Redundant FontFamily Attributes

WordPress optimizes out `fontFamily` attributes when they match the theme default, causing block validation mismatches.

**Problem:**
- Block attributes include: `"style":{"typography":{"fontFamily":"var:preset|font-family|inter"}}`
- Theme default font family (from theme.json): `inter`
- WordPress saves block WITHOUT fontFamily in database (optimization)
- Result: **Block validation error** ❌ (attribute mismatch between save function and database)

**Button Blocks Specific Issue:**
- Attributes: `"typography":{"fontFamily":"var:preset|font-family|inter","fontWeight":"600"}`
- Save function generates: `font-family:var(--wp--preset--font-family--inter);font-weight:600`
- Database content: `font-weight:600` (fontFamily stripped)
- Result: Validation error showing mismatch

**Solution:**
- Remove `fontFamily` from block attributes when it matches theme.json default
- Keep other typography properties like `fontWeight`, `fontSize`, `letterSpacing`
- WordPress will apply default font family automatically

**Example:**
```html
<!-- WRONG (causes validation error) -->
<!-- wp:button {...,"typography":{"fontFamily":"var:preset|font-family|inter","fontWeight":"600"}...} -->

<!-- CORRECT (no validation error) -->
<!-- wp:button {...,"typography":{"fontWeight":"600"}...} -->
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

### Background Image Attributes

WordPress blocks support two valid patterns for implementing background images:

#### Pattern 1: Simple Backgrounds (Attributes + Inline Styles)
- **Attribute**: `"style":{"background":{"backgroundImage":{"url":"/path/to/image.png","source":"file","title":"image"},"backgroundSize":"cover","backgroundPosition":"center","backgroundRepeat":"no-repeat"}}`
- **Inline Style**: `background-image:url('/path/to/image.png');background-size:cover;background-position:center;background-repeat:no-repeat`
- **Use Case**: Simple background images without advanced effects
- **Rendering**: Browser renders directly from inline styles
- **Validation**: Background must appear in BOTH attributes AND inline styles

#### Pattern 2: Advanced Backgrounds (Attributes Only + SCSS)
- **Attribute**: `"style":{"background":{"backgroundImage":{"url":"/path/to/image.png","source":"file","title":"image"},"backgroundSize":"cover","backgroundPosition":"center","backgroundRepeat":"no-repeat"}}`
- **Inline Style**: NO background properties in HTML inline styles
- **Use Case**: Backgrounds with advanced effects (blend modes, opacity, positioning)
- **Rendering**: SCSS handles frontend rendering with advanced CSS properties
- **Validation**: Background ONLY in attributes, empty HTML div for SCSS targeting
- **⚠️ NOTE**: Current validator will flag missing inline styles - this is expected for Pattern 2

**Pattern 2 Implementation:**
```html
<!-- Background in attributes for editor preview -->
<!-- wp:group {"style":{"background":{"backgroundImage":{"url":"/wp-content/themes/theme/assets/images/texture.png","source":"file","title":"texture"},"backgroundSize":"cover"}},"className":"header-main"} -->
<!-- NO background in inline styles - SCSS handles rendering -->
<div class="wp-block-group header-main has-background" style="border-bottom-color:var(--wp--preset--color--secondary)">
  <!-- Empty div for SCSS targeting with .header-main > div:first-child -->
  <div></div>
  <!-- Rest of content -->
</div>
```

**IMPORTANT CONSTRAINT:** Blocks with background images CANNOT have background colors or gradients:
- Background images will override any `backgroundColor` or `gradient` attributes
- The validator should flag blocks that have both a background image AND a backgroundColor/gradient attribute
- ❌ **ERROR:** `"gradient":"brand-red"` + background image
- ❌ **ERROR:** `"backgroundColor":"primary"` + background image
- ✅ **VALID:** Only background image attribute present

**Invalid Example (conflicting backgrounds):**
```html
<!-- INVALID: Has both gradient and background image -->
<!-- wp:group {"gradient":"brand-red","style":{"background":{"backgroundImage":{...}}}} -->
<div class="wp-block-group has-brand-red-gradient-background has-background">
<!-- This will fail validation - remove "gradient" attribute -->
```

#### Background Image Properties
- **backgroundImage.url**: Required - Full path to image
- **backgroundImage.source**: Typically `"file"` for theme assets
- **backgroundImage.title**: Optional - Image title/alt description
- **backgroundSize**: `cover`, `contain`, `auto`, or custom value
- **backgroundPosition**: `center`, `top`, `bottom`, `left`, `right`, or custom
- **backgroundRepeat**: `no-repeat`, `repeat`, `repeat-x`, `repeat-y`

### Drop Shadow Attributes

WordPress blocks support drop shadows via the `shadow` attribute. However, there are important constraints:

#### When Drop Shadows Should Use Block Attributes

- **Standalone blocks**: Blocks NOT part of a section or pattern
- **Editable shadows**: Shadows that should be changeable in the WordPress editor
- **Simple shadows**: Single-layer shadows without advanced effects

**Valid Example (Standalone Block):**
```html
<!-- wp:group {"style":{"shadow":"0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)"},"className":"header-categories"} -->
<div class="wp-block-group header-categories" style="box-shadow:0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)">
```

#### When Drop Shadows Should Use SCSS

- **Section/pattern blocks**: Blocks that are part of a larger section or pattern
- **Complex shadows**: Multi-layer shadows or shadows with hover states
- **Design system**: Shadows that are part of the theme's design system

**Valid Example (Part of Section - NO shadow in attributes):**
```html
<!-- wp:group {"className":"pattern-hero-section"} -->
<div class="wp-block-group pattern-hero-section">
  <!-- Shadow handled by _hero.scss -->
```

#### Drop Shadow Validation Rules

- **Attribute**: `"style":{"shadow":"CSS_VALUE"}`
- **Inline Style**: `style="box-shadow:CSS_VALUE"`
- **CRITICAL**: If shadow is in block attributes, it MUST also be in inline styles
- **CONSTRAINT**: Do NOT validate missing inline shadows as errors if block is part of a section/pattern
- **⚠️ NOTE**: Current validator may flag missing inline shadows for section/pattern blocks - this is expected behavior and should be ignored when SCSS handles the shadow

**Validation Logic:**
1. If `style.shadow` exists in block attributes:
   - Check if block has a className indicating it's part of a section/pattern (e.g., contains "pattern-", "section-")
   - If standalone block: Require matching inline `box-shadow` style
   - If section/pattern block: Flag as warning (should use SCSS instead)
2. If no `style.shadow` in attributes:
   - Valid (no validation needed)

### Sticky Position Attributes

WordPress blocks support sticky positioning via the `position` attribute:

#### Sticky Position Pattern

- **Attribute**: `"style":{"position":{"type":"sticky","top":"0px"}}`
- **Inline Style**: `style="position:sticky;top:0px"`
- **CRITICAL**: If position is in block attributes, it MUST also be in inline styles

**Valid Example (Sticky Header):**
```html
<!-- wp:group {"style":{"position":{"type":"sticky","top":"0px"}},"className":"site-header"} -->
<div class="wp-block-group site-header" style="position:sticky;top:0px">
```

#### Position Attribute Structure

```json
{
  "style": {
    "position": {
      "type": "sticky|fixed|absolute|relative",
      "top": "0px",     // optional
      "bottom": "0px",  // optional
      "left": "0px",    // optional
      "right": "0px"    // optional
    }
  }
}
```

#### Sticky Position Validation Rules

- **Attribute**: `"style":{"position":{"type":"VALUE"}}`
- **Inline Style**: `style="position:VALUE"`
- **CRITICAL**: Position type must match between attributes and inline styles
- **Position offsets**: If `top`, `bottom`, `left`, or `right` specified in attributes, they MUST appear in inline styles

**Validation Logic:**
1. If `style.position` exists in block attributes:
   - Require matching inline `position` style
   - Validate position type matches (sticky, fixed, absolute, relative)
   - If offset properties present (top/bottom/left/right), require matching inline styles
2. If no `style.position` in attributes:
   - Valid (no validation needed)

**Common Validation Errors:**
```html
<!-- ❌ WRONG: Position in attributes but not in inline styles -->
<!-- wp:group {"style":{"position":{"type":"sticky","top":"0px"}}} -->
<div class="wp-block-group">

<!-- ✅ CORRECT: Position in both attributes and inline styles -->
<!-- wp:group {"style":{"position":{"type":"sticky","top":"0px"}}} -->
<div class="wp-block-group" style="position:sticky;top:0px">
```

### Typography Attributes

#### Font Size
- **Attribute**: `"fontSize":"large"`
- **Required Class**: `has-large-font-size`

#### Default Font Size Optimization
- **Special Case**: WordPress handles `fontSize="base"` differently for button wrapper vs link element
- **Theme Default**: `fontSize="base"` (defined in theme.json)
- **Button Wrapper Behavior**: When `fontSize="base"`, wrapper `<div>` gets NO font size classes (optimization)
- **Button Link Behavior**: Link `<a>` ALWAYS gets font size classes, even for default
- **Validator Logic**: Expects classes on `<a>` but NOT on wrapper `<div>` when `fontSize="base"`

**Example (Default Font Size):**
```html
<!-- Block Attributes -->
"fontSize":"base"

<!-- What WordPress SAVES -->
<div class="wp-block-button">
  <a class="wp-block-button__link has-base-font-size has-custom-font-size ...">Subscribe</a>
</div>

<!-- What validator EXPECTS -->
- Wrapper div: NO font size classes ✅
- Link element: has-base-font-size has-custom-font-size ✅
```

**Example (Custom Font Size):**
```html
<!-- Block Attributes -->
"fontSize":"sm"

<!-- What WordPress saves -->
<div class="wp-block-button has-custom-font-size has-sm-font-size">
  <a class="wp-block-button__link has-sm-font-size has-custom-font-size ...">Subscribe</a>
</div>

<!-- What validator expects -->
- Wrapper div: has-custom-font-size has-sm-font-size ✅
- Link element: has-sm-font-size has-custom-font-size ✅
```

**Common Issue:**
- Developer adds font size classes to wrapper div when `fontSize="base"`
- WordPress strips them from wrapper (keeps on link only)
- Result: **Validation error** ❌ (class mismatch)

**Solution:**
- When `fontSize="base"`: NO classes on wrapper `<div>`, YES classes on link `<a>`
- When `fontSize` is custom (sm, lg, etc.): YES classes on BOTH wrapper and link

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

### Navigation Block Structure

Navigation blocks must use **correct block comment syntax** based on whether they have children.

#### Block Comment Syntax Rules

**Rule 1: Self-Closing (No Children)**
```html
<!-- CORRECT: Self-closing navigation block -->
<!-- wp:navigation {"overlayMenu":"never","ref":123} /-->
```
- Ends with `/-->`
- No closing `<!-- /wp:navigation -->` tag
- Typically used with `ref` attribute to reference a menu from WordPress admin

**Rule 2: With Children**
```html
<!-- CORRECT: Navigation with child links -->
<!-- wp:navigation {"overlayMenu":"never","layout":{"type":"flex","orientation":"vertical"}} -->
  <!-- wp:navigation-link {"label":"Home","url":"/"} /-->
  <!-- wp:navigation-link {"label":"About","url":"/about"} /-->
  <!-- wp:navigation-link {"label":"Contact","url":"/contact"} /-->
<!-- /wp:navigation -->
```
- Opening tag ends with `-->` (NOT `/-->`)
- Must have closing `<!-- /wp:navigation -->` tag
- Can contain `navigation-link` children

**Rule 3: NEVER Mix Syntax**
```html
<!-- ❌ INCORRECT: Self-closing WITH children -->
<!-- wp:navigation {"overlayMenu":"never"} /-->
  <!-- wp:navigation-link {"label":"Home","url":"/"} /-->
  <!-- wp:navigation-link {"label":"About","url":"/about"} /-->
<!-- /wp:navigation -->
```
- Opening tag is self-closing (`/-->`) but children and closing tag exist
- WordPress parser will not handle this correctly
- **This is invalid block comment syntax**

#### Validation Rules

The validator checks:
1. ✅ If opening tag ends with `/-->`, there should be NO children and NO closing tag
2. ✅ If opening tag ends with `-->`, there MUST be a closing `<!-- /wp:navigation -->` tag
3. ❌ Flags mixed syntax (self-closing opening with children/closing tag)

**Common mistakes:**
- ❌ Using self-closing syntax (`/-->`) when navigation has children
- ❌ Forgetting to remove `/` from opening tag when adding children
- ❌ Having both `/-->` and `<!-- /wp:navigation -->` in the same block

**Best Practice Workflow:**
1. Create menu in WordPress admin (Appearance → Menus)
2. Add menu items and organize structure
3. Note the menu ID from database or admin URL
4. Use self-closing navigation block with `ref` attribute in patterns/templates
5. WordPress will automatically render the menu items at runtime

**Example with Attributes:**
```html
<!-- Self-closing navigation with full styling -->
<!-- wp:navigation {
  "ref":123,
  "overlayMenu":"never",
  "layout":{"type":"flex","orientation":"vertical"},
  "style":{
    "spacing":{"blockGap":"var:preset|spacing|30"},
    "typography":{"fontSize":"14px"}
  }
} /-->
```

**Note:** When `ref` is omitted, WordPress will use the menu assigned to the "Primary" menu location (or prompt users to create a menu in the editor).

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

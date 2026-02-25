# WordPress Block Pattern Generator Skill

## Description

Expert in generating WordPress block theme patterns following specification-driven development with accessibility (WCAG 2.1 AA), proper spacing using WordPress presets, BEM naming conventions, and seamless integration with WooCommerce, LifterLMS, and custom post types via ACF.

## Capabilities

- Generate production-ready WordPress block patterns with proper block markup
- Integrate custom fields using ACF display field blocks
- Create responsive query loops with custom post type support
- Build accessible card components with semantic HTML and ARIA labels
- Implement WooCommerce product displays with ratings and add-to-cart
- Design LifterLMS course cards with enrollment CTAs
- Apply WordPress spacing preset system (10-80 numeric slugs)
- Follow BEM CSS naming convention (`.block__element--modifier`)
- Ensure WCAG 2.1 AA compliance (4.5:1 contrast, keyboard navigation)
- Optimize for performance (lazy loading, conditional scripts, responsive images)

## Usage

This skill is invoked when:
- Creating new block patterns for WordPress themes
- Generating query loops for custom post types
- Integrating WooCommerce or LifterLMS functionality
- Building accessible card components
- Implementing taxonomy filtering interfaces
- Designing hero sections with custom field integration

## Prerequisites & Setup

Before generating patterns, gather the following information from the user:

### Required Information

1. **Supporting Plugin Details**
   - **Prompt**: "What is the name and purpose of your theme's companion plugin (if any)?"
   - **Purpose**: Identify custom post types, taxonomies, and ACF field groups
   - **Examples**: 
     - "ma-plugin provides research articles, case studies, and digital magazines"
     - "No companion plugin - using only WordPress core functionality"
   - **Next Steps**: If plugin exists, request field group details and CPT slugs

2. **Guidelines Directory**
   - **Prompt**: "Do you have a guidelines directory? If so, what's the path?"
   - **Purpose**: Access design tokens, component specs, CSS architecture docs
   - **Default**: Search workspace for common paths:
     - `guidelines/`
     - `docs/guidelines/`
     - `.github/guidelines/`
     - `src/guidelines/`
   - **Fallback**: Request specific information about:
     - Spacing system (WordPress presets or custom scale)
     - Color palette and contrast requirements
     - Typography scale and font families
     - Component naming conventions (BEM, ITCSS, etc.)
     - Breakpoint values for responsive design

3. **Plugin Feature Mapping**
   - **If Plugin Exists**: Request details about:
     - Custom post types and their slugs
     - Custom taxonomies and hierarchies
     - ACF field groups and field names
     - Required meta queries or filters
     - Special display requirements

### Information Gathering Workflow

```
Start Pattern Generation Request
    ↓
1. Ask about companion plugin
    ├─ Yes → Request CPT/taxonomy/ACF details
    └─ No → Note WordPress core-only approach
    ↓
2. Ask about guidelines directory
    ├─ Provided → Read design tokens and specs
    ├─ Search workspace → Check common paths
    └─ Not found → Request manual specification
    ↓
3. Validate available information
    ├─ Spacing presets defined? 
    ├─ Color system documented?
    ├─ Typography scale available?
    └─ Component patterns specified?
    ↓
4. Begin pattern generation with validated context
```

### Example Setup Dialogue

**Agent**: "Before I generate patterns for your theme, I need some context:

1. **Companion Plugin**: Do you have a plugin that provides custom post types or features for this theme? If so, what's its name and what does it provide?

2. **Guidelines Directory**: Do you have a guidelines or design system directory? Common locations I can check:
   - `guidelines/`
   - `docs/guidelines/`
   - `.github/guidelines/`
   
If not, I'll need information about your spacing system, color palette, and component conventions."

**User Response Example**:
"Yes, I have `ma-plugin` that provides Research Articles (CPT: research-article), Case Studies (CPT: case-study), and Digital Magazines (CPT: digital-magazine). Guidelines are in `src/guidelines/` with design tokens and component specs."

**Agent Next Steps**:
- Read guidelines from specified path
- Note CPT slugs for query loop integration
- Check for ACF field groups in plugin
- Proceed with informed pattern generation

## Validation & Testing

All generated patterns must pass these validation checks:

### 1. Block Comment Syntax Validation
- **Check**: All block comments properly closed with `-->` (not `>`)
- **Pattern**: `<!-- wp:block-name {JSON} -->` for opening tags
- **Pattern**: `<!-- /wp:block-name -->` for closing tags
- **Common Error**: `<!-- wp:group {...}}>` should be `<!-- wp:group {...} -->`

### 2. Block Structure Validation
- **Check**: Every opening block has matching closing block
- **Check**: Block nesting is logically correct (no orphaned blocks)
- **Check**: JSON attributes are valid (properly escaped quotes, no trailing commas)
- **Test**: Copy pattern into WordPress block editor - should load without validation errors

### 3. PHP Syntax Validation
- **Check**: All PHP tags properly opened `<?php` and closed `?>`
- **Check**: Proper escaping for translatable strings: `esc_html__()`, `esc_attr__()`
- **Check**: No syntax errors in inline PHP (missing semicolons, brackets)
- **Test**: Run `php -l pattern-file.php` to check for parse errors

### 4. WordPress Block Validation Errors
- **Monitor**: Browser console for block validation errors
- **Pattern**: `Block validation: Block validation failed for...`
- **Fix**: Check that content structure matches block's expected output
- **Example**: If error shows `<div>` expected but `<p>` found, review block type

### 5. Accessibility Testing
- **Check**: Run WAVE or axe DevTools on rendered pattern
- **Verify**: Proper heading hierarchy (no skipped levels)
- **Verify**: Interactive elements have accessible names
- **Test**: Keyboard navigation works (Tab, Enter, Escape keys)

### 6. Responsive Testing
- **Test**: Pattern renders correctly at mobile (375px), tablet (768px), desktop (1200px+)
- **Check**: Images use responsive sizing or object-fit
- **Check**: Typography scales appropriately with font-size presets

### 7. Integration Testing
- **WooCommerce**: Products display with correct pricing, ratings, add-to-cart buttons
- **LifterLMS**: Courses show enrollment status and CTAs correctly
- **ACF**: Custom fields populate with display field block correctly
- **Custom Post Types**: Query loops filter and display CPT content as expected

### Testing Workflow

1. **Generate Pattern** → Create pattern file with proper PHP header
2. **Syntax Check** → Run `php -l` and validate block comment syntax
3. **WordPress Test** → Insert pattern in block editor, check for validation errors
4. **Browser Console** → Monitor for JavaScript errors or warnings
5. **Visual Review** → Check spacing, alignment, typography across breakpoints
6. **Accessibility Scan** → Run WAVE/axe, test keyboard navigation
7. **Integration Verify** → Confirm plugin/ACF data populates correctly
8. **Performance Check** → Verify lazy loading, no unnecessary scripts loaded

### Common Validation Issues

| Issue | Symptom | Fix |
|-------|---------|-----|
| Malformed block comment | `Block validation failed` error | Change `}>` to `} -->` |
| Missing closing block | Pattern doesn't render | Add `<!-- /wp:block-name -->` |
| Invalid JSON | Block doesn't load | Fix JSON syntax (quotes, commas) |
| PHP parse error | White screen | Check PHP syntax with `php -l` |
| Incorrect block type | Content doesn't match | Use correct block (paragraph vs heading) |
| Missing escaping | Security warning | Wrap translations in `esc_html__()` |

## Background Image Conversion (TSX/React to WordPress Blocks)

When converting React/TSX components with background images to WordPress blocks, follow this pattern:

### React/TSX Background Image Pattern

```tsx
// React component with background image
<div 
  className="header-section"
  style={{
    backgroundImage: `url(${headerTexture})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }}
>
  {/* Content */}
</div>
```

### WordPress Block Attributes Pattern

Convert the above to WordPress block attributes like this:

  **Pattern 1: Standard Background (Simple, No Advanced Effects)**
```html
<!-- wp:group {"style":{"background":{"backgroundImage":{"url":"/wp-content/themes/theme-name/assets/images/header-texture.png","source":"file","title":"header-texture"},"backgroundSize":"cover","backgroundPosition":"center","backgroundRepeat":"no-repeat"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="background-image:url('/wp-content/themes/theme-name/assets/images/header-texture.png');background-size:cover;background-position:center;background-repeat:no-repeat">
  <!-- Content blocks here -->
</div>
<!-- /wp:group -->
```

**Pattern 2: Advanced Background (With Blend Modes, Opacity, Filters)**
```html
<!-- wp:group {"style":{"background":{"backgroundImage":{"url":"/wp-content/themes/theme-name/assets/images/header-texture.png","source":"file","title":"header-texture"},"backgroundSize":"cover","backgroundPosition":"center","backgroundRepeat":"no-repeat"}},"className":"header-main","layout":{"type":"constrained"}} -->
<div class="wp-block-group header-main">
  <!-- Empty div for SCSS to target -->
  <!-- wp:html -->
  <div></div>
  <!-- /wp:html -->
  
  <!-- Content blocks here -->
</div>
<!-- /wp:group -->
```

**When to use each pattern:**
- **Pattern 1**: Simple backgrounds without blend modes, opacity, or filters
  - Background appears in BOTH block attributes AND HTML inline styles
  - Browser renders directly from inline styles
- **Pattern 2**: Advanced effects requiring CSS properties not supported by block attributes
  - Background appears ONLY in block attributes (for editor preview)
  - NO inline styles in HTML
  - SCSS handles all rendering using the empty HTML div

**CRITICAL for Pattern 1:** Background images must be defined in BOTH places:
1. **Block comment attributes** - WordPress editor reads these
2. **HTML inline styles** - Browsers render these

**CRITICAL for Pattern 2:** Background images defined ONLY in block attributes:
1. **Block comment attributes** - WordPress editor reads these for preview
2. **NO HTML inline styles** - SCSS module handles all rendering
3. **Empty HTML div** - SCSS targets this for background + advanced effects

**Why both patterns exist:**
- Pattern 1: Block attributes allow the WordPress editor to display and edit the background, inline styles ensure frontend rendering
- Pattern 2: Block attributes provide editor preview, SCSS provides full control for advanced effects not supported by WordPress
- The validator checks Pattern 1 for matching attributes/styles; Pattern 2 requires manual SCSS setup

**IMPORTANT CONSTRAINT:** Blocks with background images CANNOT have background colors or gradients:
- ❌ **WRONG:** `"gradient":"brand-red"` + background image = gradient will be overridden
- ❌ **WRONG:** `"backgroundColor":"primary"` + background image = color will be overridden
- ✅ **CORRECT:** Use ONLY the background image attribute, no gradient or backgroundColor
- ✅ **CORRECT:** If you need color underneath, use CSS in the theme's SCSS files

**Example of WRONG pattern (conflicting background properties):**
```html
<!-- WRONG: Has both gradient and background image -->
<!-- wp:group {"gradient":"brand-red","style":{"background":{"backgroundImage":{...}}}} -->
<div class="wp-block-group has-brand-red-gradient-background has-background">
```

**Example of CORRECT pattern:**
```html
<!-- CORRECT: Only background image, no gradient -->
<!-- wp:group {"style":{"background":{"backgroundImage":{...}}}} -->
<div class="wp-block-group has-background">
```

### Required Background Attribute Structure

```json
{
  "style": {
    "background": {
      "backgroundImage": {
        "url": "/wp-content/themes/theme-name/assets/images/image.png",
        "source": "file",
        "title": "image-name"
      },
      "backgroundSize": "cover|contain|auto",
      "backgroundPosition": "center|top|bottom|left|right",
      "backgroundRepeat": "no-repeat|repeat|repeat-x|repeat-y"
    }
  }
}
```

### Properties NOT Supported by Block Attributes

The following CSS properties cannot be set via WordPress block attributes and must be handled in CSS/SCSS:

- **mix-blend-mode** - Blend mode effects (multiply, screen, overlay, etc.)
- **opacity** - Transparency levels (use CSS)
- **filter** - Visual filters (blur, brightness, contrast, etc.)
- **transform** - Transformations (scale, rotate, translate, etc.)

### Recommended Pattern for Advanced Effects

When you need CSS properties not supported by block attributes (blend modes, opacity, filters), use **Pattern 2** from above:

**WordPress Pattern (Pattern 2 - Advanced):**
```html
<!-- wp:group {"style":{"background":{"backgroundImage":{"url":"/wp-content/themes/theme-name/assets/images/texture.png","source":"file","title":"texture"},"backgroundSize":"cover"}},"className":"header-main"} -->
<div class="wp-block-group header-main">
  
  <!-- wp:html -->
  <div></div>
  <!-- /wp:html -->
  
  <!-- Content blocks -->
  
</div>
<!-- /wp:group -->
```

**Key differences from Pattern 1:**
1. NO background inline styles in the HTML div
2. Empty HTML div for SCSS to target
3. Background appears ONLY in block attributes (for editor preview)

**SCSS Module (_header.scss):**
```scss
.header-main {
  position: relative;
  overflow: hidden;
  
  // Target the empty HTML block div for overlay effects
  > div:not(.wp-block-group):first-child {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 0;
    pointer-events: none;
    mix-blend-mode: multiply;
    opacity: 1;
  }
}
```

### Asset Management

1. **Copy assets to theme**: Ensure images referenced in block attributes exist in the theme
   ```bash
   cp source-image.png /wp-content/themes/theme-name/assets/images/
   ```

2. **Use theme-relative paths**: Always use paths relative to theme root
   ```
   ✓ /wp-content/themes/theme-name/assets/images/image.png
   ✗ http://example.com/wp-content/uploads/image.png (media library)
   ```

3. **Name assets descriptively**: Use kebab-case for image filenames
   ```
   ✓ header-texture.png
   ✓ hero-background.jpg
   ✗ image1.png
   ✗ 59f5f21fc3ab664ddea62e2cde218d15718c0a5b.png
   ```

### Conversion Checklist

**For Pattern 1 (Simple backgrounds):**
- [ ] Background image copied to theme assets directory
- [ ] Background properties added to block comment attributes
- [ ] Background properties added to HTML div inline styles
- [ ] Image URL uses theme-relative path
- [ ] backgroundSize, backgroundPosition, backgroundRepeat set correctly
- [ ] No backgroundColor or gradient attributes present with background image

**For Pattern 2 (Advanced effects with SCSS):**
- [ ] Background image copied to theme assets directory
- [ ] Background properties added to block comment attributes ONLY
- [ ] NO background properties in HTML div inline styles
- [ ] Empty HTML div added for SCSS to target
- [ ] SCSS module created with background + advanced effects
- [ ] Image URL uses theme-relative path
- [ ] No backgroundColor or gradient attributes present with background image
- [ ] Advanced effects (blend modes, opacity) handled in SCSS
- [ ] Empty HTML div added if overlay effects needed
- [ ] SCSS module targets overlay div correctly
- [ ] Theme rebuilt after SCSS changes

## Related Skills

- `block-theme-development` - Overall theme development standards
- `accessibility-audit` - WCAG compliance checking
- `css-architecture` - BEM naming and styling patterns

## Version

1.5.0

## Last Updated

2026-02-25

## Changelog

### 1.5.0 (2026-02-25)
- **MAJOR UPDATE**: Documented two distinct patterns for background images
  - Pattern 1: Simple backgrounds (attributes + HTML inline styles)
  - Pattern 2: Advanced backgrounds with SCSS (attributes only, NO inline styles)
- Added clear guidance on when to use each pattern
- Updated conversion checklist for both patterns
- Clarified that Pattern 2 uses block attributes for editor preview, SCSS for rendering
- Added constraint: Cannot mix background images with backgroundColor or gradient attributes

### 1.4.0 (2026-02-25)
- **CRITICAL UPDATE**: Clarified that background images must be defined in BOTH block attributes AND HTML inline styles
- Added explanation of why both are needed (editor vs. frontend rendering)
- Updated all background image examples to show inline styles
- Updated conversion checklist to include HTML inline styles requirement
- Updated validator to check background image inline styles

### 1.3.0 (2026-02-25)
- Added "Background Image Conversion (TSX/React to WordPress Blocks)" section
- Documented WordPress block attribute structure for background images
- Added guidance on handling advanced CSS effects (blend modes, opacity) in SCSS
- Included asset management best practices
- Added conversion checklist for TSX to WordPress block background images

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

## Drop Shadow Conversion (TSX/React to WordPress Blocks)

When converting React/TSX components with drop shadows to WordPress blocks, follow these guidelines:

### When to Use Block Attributes vs SCSS

**Use Block Attributes (Individual Blocks):**
- ✅ Standalone blocks NOT part of a section or pattern
- ✅ Simple drop shadows without advanced effects
- ✅ Shadows that should be editable in the WordPress editor

**Use SCSS (Sections/Patterns):**
- ✅ Blocks within sections or patterns
- ✅ Complex shadow effects with multiple layers
- ✅ Shadows with hover states or transitions
- ✅ Shadows that are part of the design system

### Block Attribute Pattern (Individual Blocks)

For standalone blocks, use WordPress block attributes:

**React/TSX:**
```tsx
<div className="header-categories" style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
  <nav>...</nav>
</div>
```

**WordPress Block Pattern:**
```html
<!-- wp:group {"style":{"shadow":"0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)"},"className":"header-categories"} -->
<div class="wp-block-group header-categories" style="box-shadow:0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)">
  <!-- Navigation blocks -->
</div>
<!-- /wp:group -->
```

**CRITICAL:** Drop shadows in block attributes must appear in BOTH places:
1. **Block comment attributes**: `"style":{"shadow":"CSS_VALUE"}`
2. **HTML inline styles**: `style="box-shadow:CSS_VALUE"`

### SCSS Pattern (Sections/Patterns)

For blocks within sections or patterns, use SCSS:

**WordPress Block Pattern (NO shadow in attributes):**
```html
<!-- wp:group {"className":"header-categories"} -->
<div class="wp-block-group header-categories">
  <!-- Navigation blocks -->
</div>
<!-- /wp:group -->
```

**SCSS Module (_header.scss):**
```scss
.header-categories {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
  
  // Optional: Add hover effects
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
}
```

### Common Drop Shadow Values

```css
/* Subtle shadow (similar to Tailwind shadow-sm) */
0 1px 2px 0 rgba(0, 0, 0, 0.05)

/* Medium shadow (similar to Tailwind shadow-md) */
0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)

/* Large shadow (similar to Tailwind shadow-lg) */
0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)

/* Extra large shadow (similar to Tailwind shadow-xl) */
0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
```

### IMPORTANT CONSTRAINT

❌ **DO NOT** add drop shadows via block attributes if the block is part of a section or pattern
✅ **DO** use SCSS for shadows in sections/patterns
❌ **DO NOT** mix block attribute shadows with SCSS shadows on the same element
✅ **DO** use block attributes for standalone, editable blocks

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

## Sticky Position (TSX/React to WordPress Blocks)

When converting React/TSX components with sticky positioning to WordPress blocks, follow this pattern:

### React/TSX Sticky Position Pattern

```tsx
// React component with sticky positioning
<header className="site-header sticky top-0 z-50">
  <nav>...</nav>
</header>
```

### WordPress Block Pattern

For sticky elements, use WordPress block attributes:

```html
<!-- wp:group {"style":{"position":{"type":"sticky","top":"0px"}},"className":"site-header sticky top-0 z-50"} -->
<div class="wp-block-group site-header sticky top-0 z-50" style="position:sticky;top:0px">
  <!-- Navigation blocks -->
</div>
<!-- /wp:group -->
```

**CRITICAL:** Sticky positioning must appear in BOTH places:
1. **Block comment attributes**: `"style":{"position":{"type":"sticky","top":"0px"}}`
2. **HTML inline styles**: `style="position:sticky;top:0px"`

### Sticky Position Attribute Structure

```json
{
  "style": {
    "position": {
      "type": "sticky",
      "top": "0px"  // or "bottom", "left", "right"
    }
  }
}
```

### Common Sticky Patterns

**Sticky Header:**
```html
<!-- wp:group {"style":{"position":{"type":"sticky","top":"0px"}},"className":"site-header"} -->
<div class="wp-block-group site-header" style="position:sticky;top:0px">
```

**Sticky Sidebar:**
```html
<!-- wp:group {"style":{"position":{"type":"sticky","top":"2rem"}},"className":"sidebar"} -->
<div class="wp-block-group sidebar" style="position:sticky;top:2rem">
```

**Sticky Footer:**
```html
<!-- wp:group {"style":{"position":{"type":"sticky","bottom":"0px"}},"className":"site-footer"} -->
<div class="wp-block-group site-footer" style="position:sticky;bottom:0px">
```

### Additional Sticky Positioning Considerations

- **Z-index**: Add Tailwind utility classes like `z-50` to ensure proper stacking
- **Background**: Sticky elements usually need a background color to prevent content showing through
- **Box shadow**: Consider adding shadows to create depth (e.g., `shadow-sm` class)
- **Responsive**: Use responsive Tailwind classes to control sticky behavior at different breakpoints

### IMPORTANT CONSTRAINT

✅ **DO** use WordPress block attributes for sticky positioning
✅ **DO** include matching inline styles in HTML
✅ **DO** add z-index utilities for proper stacking
✅ **DO** add background colors to prevent transparent overlap
❌ **DO NOT** rely solely on CSS classes for sticky positioning
❌ **DO NOT** forget to add inline styles matching the block attributes

### Conversion Checklist - Sticky Position

- [ ] Position type set to `"sticky"` in block attributes
- [ ] Top/bottom/left/right offset specified (e.g., `"top":"0px"`)
- [ ] Inline style includes: `position:sticky;top:0px` (matching attributes)
- [ ] Z-index utility class added (e.g., `z-50`)
- [ ] Background color set to prevent transparent overlap
- [ ] Optional: Box shadow added for depth perception
- [ ] Tested on different screen sizes for responsive behavior


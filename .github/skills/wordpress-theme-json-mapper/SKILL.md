# WordPress Theme.json Mapper Skill

**Purpose**: Map design tokens from a design system to WordPress theme.json configuration, including colors, typography, spacing, and block styles.

**Version**: 1.0.0  
**Last Updated**: 2026-02-23

---

## Overview

This skill automates the process of translating design system tokens (colors, typography, spacing, layouts) into WordPress-compatible theme.json structure, along with generating block styles, section styles, and CSS custom properties.

## Key Capabilities

1. **Color Palette Mapping**: Transform hex colors and gradients into WordPress color presets
2. **Typography System**: Map font families, sizes, weights, and fluid scales to WordPress font presets
3. **Spacing Scale**: Convert design tokens to WordPress spacing presets
4. **Layout System**: Configure content width, wide width, and responsive containers
5. **Block Styles**: Generate individual block style variations with appropriate `blockTypes` declarations
6. **Section Styles**: Create reusable section style presets with `blockTypes` declarations
7. **Custom CSS**: Extract design tokens that don't fit theme.json into CSS custom properties

## Input Requirements

### Design System Structure

The skill expects design tokens organized as:

```
guidelines/
├── design-tokens/
│   ├── DESIGN-SYSTEM-GUIDE.md    # Master reference
│   ├── colors.md                  # Color palette
│   ├── typography.md              # Font families, sizes, weights
│   ├── spacing.md                 # Spacing scale
│   ├── layout.md                  # Container widths, grid system
│   └── dark-mode.md              # Dark mode variants (optional)
```

### Key Token Categories

#### 1. Colors
- **Brand colors**: Primary, secondary, accent
- **UI colors**: Background, foreground, border, muted
- **Semantic colors**: Success, warning, error, info
- **Gradients**: Complex multi-stop gradients
- **Dark mode variants**: Alternative colors for dark theme

#### 2. Typography
- **Font families**: Heading font, body font, mono font
- **Font sizes**: Static and fluid (clamp) values
- **Font weights**: Numeric values (400, 600, 700)
- **Line heights**: Relative or absolute values
- **Letter spacing**: Tight, normal, wide
- **Variable font settings**: For variable fonts (optional)

#### 3. Spacing
- **Scale**: Consistent spacing increments (4px, 8px, 16px, etc.)
- **Semantic names**: Small, medium, large, etc.
- **Section spacing**: Vertical rhythm (py-12, py-16)
- **Container padding**: Responsive padding (clamp values)

#### 4. Layout
- **Content width**: Max width for regular content
- **Wide width**: Max width for wide-aligned blocks
- **Container padding**: Responsive horizontal padding
- **Grid system**: Column counts, gaps

## Output Structure

### Theme.json Schema

```json
{
  "$schema": ".github/schemas/theme.6.9.json",
  "version": 3,
  "settings": {
    "color": { /* Color presets */ },
    "typography": { /* Typography settings */ },
    "spacing": { /* Spacing presets */ },
    "layout": { /* Content/wide widths */ }
  },
  "styles": {
    "color": { /* Default colors */ },
    "typography": { /* Default typography */ },
    "elements": {
      "h1": { /* Heading styles */ },
      "link": { /* Link styles */ },
      "button": { /* Button styles */ }
    },
    "blocks": {
      "core/button": { /* Block-specific styles */ }
    }
  }
}
```

### Block Styles Structure

Individual block style variations go in `styles/blocks/`:

```json
{
  "$schema": "https://schemas.wp.org/wp/6.9/theme.json",
  "version": 3,
  "title": "Button Outline",
  "blockTypes": ["core/button"],
  "styles": {
    "blocks": {
      "core/button": {
        "color": { /* Colors */ },
        "border": { /* Border */ },
        "typography": { /* Typography */ }
      }
    }
  }
}
```

**Important**: Always include `blockTypes` array to specify which block the style applies to:
- **Button styles**: `["core/button"]`
- **Group styles**: `["core/group"]`
- **Image styles**: `["core/image"]`
- **Quote styles**: `["core/quote"]`
- **Multiple blocks** (if applicable): `["core/group", "core/columns"]`

### Section Styles Structure

Reusable section presets go in `styles/sections/`:

```json
{
  "$schema": "https://schemas.wp.org/wp/6.9/theme.json",
  "version": 3,
  "title": "Navy Background Section",
  "blockTypes": [
    "core/group",
    "core/columns",
    "core/column"
  ],
  "styles": {
    "blocks": {
      "core/group": {
        "color": {
          "background": "var(--wp--preset--color--secondary)",
          "text": "var(--wp--preset--color--base)"
        }
      }
    }
  }
}
```

**Important**: Always include `blockTypes` array to specify which blocks the style can be applied to:
- **Layout sections** (group, columns): `["core/group", "core/columns", "core/column"]`
- **Hero/cover sections**: `["core/cover"]`
- **Both**: `["core/group", "core/columns", "core/column", "core/cover"]`

## Mapping Process

### Step 1: Color Palette

**Input**: `colors.md`

```markdown
| Token | Value | Description |
|:---|:---|:---|
| Brand Red | #E82C27 | Primary brand color |
| Brand Navy | #172134 | Deep navy for backgrounds |
```

**Output**: theme.json

```json
{
  "settings": {
    "color": {
      "palette": [
        {
          "slug": "primary",
          "color": "#E82C27",
          "name": "Brand Red"
        },
        {
          "slug": "secondary",
          "color": "#172134",
          "name": "Brand Navy"
        }
      ]
    }
  }
}
```

### Step 2: Typography Scale

**Input**: `typography.md`

```markdown
| Level | Mobile Size | Desktop Size | Font | Weight |
|:---|:---|:---|:---|:---|
| H1 | 36px | 48px | Roboto Serif | 400 |
| H2 | 28px | 30px | Roboto Serif | 400 |
| P1 | 18px | 18px | Inter | 400 |
```

**Output**: theme.json

```json
{
  "settings": {
    "typography": {
      "fontFamilies": [
        {
          "slug": "roboto-serif",
          "fontFamily": "\"Roboto Serif\", Georgia, \"Times New Roman\", Times, serif",
          "name": "Roboto Serif"
        },
        {
          "slug": "inter",
          "fontFamily": "\"Inter\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif",
          "name": "Inter"
        }
      ],
      "fontSizes": [
        {
          "slug": "h1",
          "size": "2.25rem",
          "name": "H1",
          "fluid": {
            "min": "2.25rem",
            "max": "3rem"
          }
        },
        {
          "slug": "h2",
          "size": "1.875rem",
          "name": "H2",
          "fluid": {
            "min": "1.75rem",
            "max": "1.875rem"
          }
        },
        {
          "slug": "base",
          "size": "1.125rem",
          "name": "Body (18px)",
          "fluid": false
        }
      ]
    }
  },
  "styles": {
    "elements": {
      "h1": {
        "typography": {
          "fontFamily": "var(--wp--preset--font-family--roboto-serif)",
          "fontSize": "var(--wp--preset--font-size--h1)",
          "fontWeight": "400",
          "lineHeight": "1.2"
        }
      }
    }
  }
}
```

### Step 3: Spacing Scale

**Input**: `spacing.md`

```markdown
| Token | Value | Usage |
|:---|:---|:---|
| --space-40 | 1rem (16px) | Standard padding |
| --space-60 | 1.5rem (24px) | Medium separation |
| --space-80 | 2rem (32px) | Section separation |
```

**Output**: theme.json

```json
{
  "settings": {
    "spacing": {
      "spacingSizes": [
        {
          "slug": "40",
          "size": "1rem",
          "name": "16px"
        },
        {
          "slug": "60",
          "size": "1.5rem",
          "name": "24px"
        },
        {
          "slug": "80",
          "size": "2rem",
          "name": "32px"
        }
      ]
    }
  }
}
```

### Step 4: Layout Configuration

**Input**: `layout.md`

```markdown
Container: max-width: 1440px
Padding: clamp(1rem, 4vw, 2rem)
```

**Output**: theme.json

```json
{
  "settings": {
    "layout": {
      "contentSize": "900px",
      "wideSize": "1440px"
    }
  }
}
```

### Step 5: Variable Font Settings

**Input**: `typography.md`

```markdown
| Level | font-variation-settings |
|:---|:---|
| H1 | 'GRAD' -50, 'wdth' 64, 'opsz' 48 |
```

**Output**: Custom CSS in theme.json

```json
{
  "styles": {
    "css": "h1 { font-variation-settings: 'GRAD' -50, 'wdth' 64, 'opsz' 48; }"
  }
}
```

### Step 6: Verify JSON Structure

**Critical**: After integrating design tokens and before proceeding, ALWAYS validate the theme.json structure against the WordPress schema.

**Required Root-Level Keys** (WordPress 6.9+):
```json
{
  "$schema": ".github/schemas/theme.6.9.json",
  "version": 3,
  "settings": { /* ... */ },      // Configuration (fonts, colors, etc.)
  "styles": { /* ... */ },         // Styling rules (MUST be at root!)
  "customTemplates": [ /* ... */ ], // Template definitions (MUST be at root!)
  "templateParts": [ /* ... */ ]    // Template parts (MUST be at root!)
}
```

**Common Structure Error**: Nesting `"styles"`, `"customTemplates"`, or `"templateParts"` inside `"settings"` instead of at the root level.

**Validation Methods**:

1. **JSON Syntax Validation**:
   ```bash
   python3 -m json.tool theme.json > /dev/null && echo "✓ Valid JSON" || echo "✗ Invalid JSON"
   ```

2. **Structure Verification** (Python):
   ```python
   import json
   with open('theme.json', 'r') as f:
       data = json.load(f)
   
   # Check required root keys
   root_keys = list(data.keys())
   print("Root keys:", root_keys)
   
   # Verify styles is at root, NOT in settings
   assert 'styles' in data, "❌ 'styles' missing from root level"
   assert 'styles' not in data.get('settings', {}), "❌ 'styles' incorrectly nested in settings"
   
   # Verify customTemplates is at root
   if 'customTemplates' in data.get('settings', {}):
       print("❌ ERROR: 'customTemplates' should be at root level, not in settings")
   
   # Verify templateParts is at root
   if 'templateParts' in data.get('settings', {}):
       print("❌ ERROR: 'templateParts' should be at root level, not in settings")
   
   print("✓ JSON structure is valid")
   ```

3. **Schema Validation** (if using VS Code):
   - Ensure `"$schema": ".github/schemas/theme.6.9.json"` is present
   - VS Code will show red squiggly lines for structure errors
   - Hover over errors to see schema violations

**When to Validate**:
- ✅ Immediately after creating/updating theme.json
- ✅ After integrating design tokens
- ✅ Before committing changes
- ✅ After any manual edits to structure
- ✅ Before pushing to repository

**Red Flags**:
- WordPress admin shows "Invalid theme.json"
- Styles not being generated/applied in frontend
- Block editor not reflecting theme.json changes
- Console errors about theme configuration

## Font Loading & Enqueuing

**Critical**: Declaring fonts in theme.json does NOT automatically load them. You must also register and enqueue the fonts.

### WordPress Font Collection Method (Recommended for WP 6.5+)

When changing fonts in theme.json, you MUST also update the font collection registration.

**File**: `inc/font-collection.php`

#### What to Update:

1. **Font Collection Configuration**
   ```php
   $font_collection_config = array(
       'name'          => __( 'Your Theme Fonts', 'theme-slug' ),
       'description'   => __( 'Updated font description', 'theme-slug' ),
       'font_families' => array(
           array(
               'font_family_settings' => array(
                   'name'       => 'Roboto Serif',       // Must match font name
                   'slug'       => 'roboto-serif',       // Must match theme.json slug
                   'fontFamily' => '"Roboto Serif", Georgia, "Times New Roman", Times, serif',
               ),
               'font_faces' => array(/* Font file URLs */),
           ),
       ),
   );
   ```

2. **Google Fonts Enqueue Function**
   ```php
   function theme_enqueue_google_fonts() {
       $font_families = array();
       
       // Match the fonts declared in theme.json
       $font_families[] = 'Inter:wght@400;500;600;700';
       $font_families[] = 'Roboto+Serif:ital,opsz,wdth,wght@0,8..144,64..100,100..900';
       
       // Build and enqueue URL
       // ...
   }
   ```

3. **Pattern Files**
   Update any pattern PHP files that hardcode old font family slugs:
   ```php
   // ❌ OLD: "fontFamily":"raleway"
   // ✅ NEW: "fontFamily":"roboto-serif"
   ```
   
   **Important**: Pattern files use the font slug from theme.json, not descriptive names.

### Sync Checklist

When changing fonts, update ALL of these:

- [ ] `theme.json` → `settings.typography.fontFamilies` (slug and fontFamily)
- [ ] `inc/font-collection.php` → Font collection registration
- [ ] `inc/font-collection.php` → Google Fonts enqueue URL
- [ ] `patterns/*.php` → Any hardcoded fontFamily attributes
- [ ] `functions.php` → Custom properties CSS enqueue (if used)

### Testing Font Loading

Verify fonts load correctly:

1. **Browser DevTools Network Tab**
   - Should see request to `fonts.googleapis.com/css2`
   - URL should include your new font names
   - Should NOT see old font names

2. **Inspect Element**
   ```css
   /* Should show: */
   font-family: "Roboto Serif", Georgia, serif; /* Not fallback only */
   ```

3. **Computed Styles**
   - Font should NOT show as just "Georgia" or "Times"
   - Should show the actual web font name

### Common Font Loading Issues

**Issue**: Fonts declared but showing fallback fonts  
**Cause**: Font collection not updated or Google Fonts URL missing new font  
**Fix**: Update `inc/font-collection.php` with new font registration

**Issue**: Editor shows fonts but frontend doesn't  
**Cause**: Font enqueue only hooked to `enqueue_block_editor_assets`  
**Fix**: Hook to both `wp_enqueue_scripts` AND `enqueue_block_editor_assets`

**Issue**: Variable font not rendering correctly  
**Cause**: Variable font URL incomplete or font-variation-settings not applied  
**Fix**: Use full variable font URL with all axes, add variation settings via CSS

## Block Styles Generation

### Common Block Styles

#### Buttons
- Primary (filled)
- Outline
- Ghost (transparent)
- Secondary
- Destructive

#### Groups
- Card (shadow + border)
- Shadow only
- Border only
- Navy background
- Red background
- Gradient background

#### Images
- Rounded corners
- Circle (avatar)
- Featured (larger)

## Section Styles Catalog

**Required Structure**: All section styles MUST include `blockTypes` array.

### Background Variants
- `section-white.json`: White background → `blockTypes: ["core/group", "core/columns", "core/column"]`
- `section-navy.json`: Navy background with white text → `blockTypes: ["core/group", "core/columns", "core/column"]`
- `section-red.json`: Red background with white text → `blockTypes: ["core/group", "core/columns", "core/column"]`
- `section-gradient-red.json`: Red gradient background → `blockTypes: ["core/group", "core/columns", "core/column"]`
- `section-gradient-navy.json`: Navy gradient background → `blockTypes: ["core/group", "core/columns", "core/column"]`

### Layout Variants
- `hero-section.json`: Large padding, hero overlay → `blockTypes: ["core/cover"]`
- `section-cta.json`: Call-to-action optimized → `blockTypes: ["core/group", "core/columns", "core/column"]`
- `section-feature.json`: Feature section layout → `blockTypes: ["core/group", "core/columns", "core/column"]`

### Content Variants
- `section-card.json`: Card-based layout → `blockTypes: ["core/group", "core/columns", "core/column"]`
- `content-section.json`: Standard content section → `blockTypes: ["core/group", "core/columns", "core/column"]`

**Template for Section Styles**:
```json
{
  "$schema": "https://schemas.wp.org/wp/6.9/theme.json",
  "version": 3,
  "title": "Section Name",
  "blockTypes": [
    "core/group",
    "core/columns",
    "core/column"
  ],
  "styles": {
    "blocks": {
      "core/group": {
        /* Your styles here */
      }
    }
  }
}
```

## Validation Checklist

Before finalizing theme.json:

- [ ] **JSON structure is valid and follows WordPress 6.9+ schema**
- [ ] **`styles`, `customTemplates`, `templateParts` are at root level (NOT in settings)**
- [ ] **JSON syntax validation passes** (`python3 -m json.tool theme.json`)
- [ ] All colors from design system are mapped
- [ ] Font families are correctly declared and loaded
- [ ] Fluid typography uses correct min/max viewport widths
- [ ] Spacing scale is complete and consistent
- [ ] Layout widths match design specifications
- [ ] Variable font settings are applied (if applicable)
- [ ] Dark mode variants exist (if required)
- [ ] All block styles are registered in `inc/block-styles.php`
- [ ] **All section styles include `blockTypes` array**
- [ ] **All block styles include `blockTypes` array**
- [ ] Section styles have meaningful titles
- [ ] CSS custom properties don't conflict with theme.json
- [ ] WordPress variable syntax uses modern format: `var:preset|type|value` (not `var(--wp--preset--type--value)`)

## Common Pitfalls

### 1. **Color Slug Naming**
❌ Bad: `brand-red-#e82c27`  
✅ Good: `primary`

### 2. **Font Size Units**
❌ Bad: Mixing px and rem inconsistently  
✅ Good: Use rem for all font sizes

### 3. **Fluid Typography**
❌ Bad: Making all sizes fluid  
✅ Good: Only headings and large text should be fluid

### 4. **Spacing Gaps**
❌ Bad: Random spacing values (13px, 27px)  
✅ Good: Consistent scale (4, 8, 12, 16, 24, 32, 40, 48)

### 5. **Layout Widths**
❌ Bad: `wideSize` smaller than `contentSize`  
✅ Good: `contentSize: 900px`, `wideSize: 1440px`

### 6. **Font Family Slug Naming**
❌ Bad: Using descriptive names like `"slug": "heading"` or `"slug": "body"`  
✅ Good: Use the actual font name as slug: `"slug": "roboto-serif"` or `"slug": "inter"`

**Why**: WordPress core themes (like TwentyTwentyFive) use the font name as the slug. This makes font families easier to identify and avoids confusion when fonts are used in multiple contexts (e.g., Roboto Serif for both headings and quotes).

**Pattern**: Use lowercase font name with hyphens:
- "Roboto Serif" → `"slug": "roboto-serif"`
- "Inter" → `"slug": "inter"`
- "Fira Code" → `"slug": "fira-code"`

### 7. **Font Family Element Assignment**

**Standard Pattern**: 
- **H1-H4**: Use the serif/heading font (e.g., Roboto Serif)
- **H5-H6**: Use the sans-serif/body font (e.g., Inter)
- **Body text (p, ul, ol, etc.)**: Use the sans-serif/body font (e.g., Inter)
- **UI elements (buttons, navigation)**: Use the sans-serif/body font (e.g., Inter)

**Implementation**:
```json
{
  "styles": {
    "typography": {
      "fontFamily": "var(--wp--preset--font-family--inter)"  // Root/body default
    },
    "elements": {
      "h1": { "typography": { "fontFamily": "var(--wp--preset--font-family--roboto-serif)" } },
      "h2": { "typography": { "fontFamily": "var(--wp--preset--font-family--roboto-serif)" } },
      "h3": { "typography": { "fontFamily": "var(--wp--preset--font-family--roboto-serif)" } },
      "h4": { "typography": { "fontFamily": "var(--wp--preset--font-family--roboto-serif)" } },
      "h5": { "typography": { "fontFamily": "var(--wp--preset--font-family--inter)" } },
      "h6": { "typography": { "fontFamily": "var(--wp--preset--font-family--inter)" } },
      "button": { "typography": { "fontFamily": "var(--wp--preset--font-family--inter)" } }
    }
  }
}
```

**Note**: Paragraph (`p`), list (`ul`, `ol`), and other text elements inherit from the root `fontFamily` setting, so they don't need explicit declarations unless you want to override.

### 8. **Font Collection Sync**
❌ Bad: Update theme.json fonts but forget to update font collection/enqueue  
✅ Good: When changing fonts in theme.json, also update:
- `inc/font-collection.php` (font registration)
- Google Fonts enqueue URL
- Pattern files that reference old font family slugs

**Critical**: If fonts are declared in theme.json but not loaded via font collection or enqueued from Google Fonts, they will fail to display and fallback fonts will be used instead.

### 9. **Style blockTypes Requirement**
❌ Bad: Section or block styles without `blockTypes` array  
✅ Good: Include `blockTypes` to specify which blocks the style applies to

**Problem**: Styles won't appear in the block editor's style picker without the `blockTypes` array.

**Required Pattern for Section Styles**:
```json
{
  "version": 3,
  "title": "Red Section",
  "blockTypes": [
    "core/group",
    "core/columns", 
    "core/column"
  ],
  "styles": { /* ... */ }
}
```

**Required Pattern for Block Styles**:
```json
{
  "version": 3,
  "title": "Outline Button",
  "blockTypes": ["core/button"],
  "styles": {
    "blocks": {
      "core/button": { /* ... */ }
    }
  }
}
```

**Block Type Mapping**:
- **Container sections** (backgrounds, colors, spacing) → `["core/group", "core/columns", "core/column"]`
- **Hero/cover sections** (image overlays) → `["core/cover"]`
- **Flexible sections** (both types) → `["core/group", "core/columns", "core/column", "core/cover"]`
- **Button styles** → `["core/button"]`
- **Group styles** → `["core/group"]`
- **Image styles** → `["core/image"]`
- **Quote styles** → `["core/quote"]`

**Why Critical**: Without `blockTypes`, WordPress doesn't know which blocks can use the style, so it won't show in the editor UI.

### 10. **Incorrect JSON Structure (Root Level Keys)**
❌ Bad: Nesting `styles`, `customTemplates`, or `templateParts` inside `settings`  
✅ Good: Place these keys at the root level of theme.json

**Problem**: WordPress 6.9+ requires `"styles"`, `"customTemplates"`, and `"templateParts"` to be **sibling keys** to `"settings"`, not children of it.

**❌ INCORRECT Structure**:
```json
{
  "$schema": "...",
  "version": 3,
  "settings": {
    "color": { /* ... */ },
    "typography": { /* ... */ },
    "styles": {              // ❌ WRONG! Nested in settings
      "color": { /* ... */ }
    },
    "customTemplates": [ /* ... */ ],  // ❌ WRONG! Nested in settings
    "templateParts": [ /* ... */ ]     // ❌ WRONG! Nested in settings
  }
}
```

**✅ CORRECT Structure**:
```json
{
  "$schema": "...",
  "version": 3,
  "settings": {
    "color": { /* ... */ },
    "typography": { /* ... */ }
  },
  "styles": {              // ✅ CORRECT! At root level
    "color": { /* ... */ }
  },
  "customTemplates": [ /* ... */ ],  // ✅ CORRECT! At root level
  "templateParts": [ /* ... */ ]     // ✅ CORRECT! At root level
}
```

**Symptoms of Incorrect Structure**:
- Styles not being applied to frontend or editor
- WordPress admin showing "Invalid theme.json" errors
- Block editor not reflecting theme configuration
- CSS not being generated from theme.json values
- Custom templates or template parts not appearing in admin

**How to Fix**:
1. Run structure validation (see Step 6: Verify JSON Structure)
2. Use Python script to move keys to root level:
   ```python
   import json
   with open('theme.json', 'r') as f:
       data = json.load(f)
   
   # Extract from settings if incorrectly nested
   if 'styles' in data.get('settings', {}):
       data['styles'] = data['settings'].pop('styles')
   if 'customTemplates' in data.get('settings', {}):
       data['customTemplates'] = data['settings'].pop('customTemplates')
   if 'templateParts' in data.get('settings', {}):
       data['templateParts'] = data['settings'].pop('templateParts')
   
   # Write back with proper structure
   with open('theme.json', 'w') as f:
       json.dump(data, f, indent='\t')
   ```
3. Validate JSON syntax: `python3 -m json.tool theme.json`
4. Clear WordPress cache and regenerate styles

**Prevention**: Always use schema validation (Step 6) immediately after creating or updating theme.json.

## Usage Example

### Input Design System

```
Primary Red: #E82C27
Heading Font: Roboto Serif
Body Font: Inter
H1 Mobile: 36px → Desktop: 48px
Container: 1440px max-width
```

### Generated theme.json (excerpt)

```json
{
  "settings": {
    "color": {
      "palette": [
        { "slug": "primary", "color": "#E82C27", "name": "Brand Red" }
      ]
    },
    "typography": {
      "fontFamilies": [
        { "slug": "roboto-serif", "fontFamily": "\"Roboto Serif\", serif" },
        { "slug": "inter", "fontFamily": "\"Inter\", sans-serif" }
      ],
      "fontSizes": [
        {
          "slug": "h1",
          "size": "2.25rem",
          "fluid": { "min": "2.25rem", "max": "3rem" }
        }
      ]
    },
    "layout": {
      "wideSize": "1440px"
    }
  },
  "styles": {
    "typography": {
      "fontFamily": "var(--wp--preset--font-family--inter)"  // Body/root default
    },
    "elements": {
      "h1": {
        "typography": {
          "fontFamily": "var(--wp--preset--font-family--roboto-serif)",  // H1-H4 use Roboto Serif
          "fontSize": "var(--wp--preset--font-size--h1)",
          "fontWeight": "400"
        }
      },
      "h5": {
        "typography": {
          "fontFamily": "var(--wp--preset--font-family--inter)",  // H5-H6 use Inter
          "fontWeight": "700"
        }
      }
    }
  }
}
```

## Related Files

- [theme.json](/path/to/theme.json) - Main theme configuration
- [inc/block-styles.php](/path/to/inc/block-styles.php) - Block style registration
- [styles/blocks/](/path/to/styles/blocks/) - Block style variations
- [styles/sections/](/path/to/styles/sections/) - Section style presets

## Maintenance Notes

- Update theme.json when design tokens change
- Regenerate block styles if new variants are added
- **Ensure all section styles include `blockTypes` array**
- **Ensure all block styles include `blockTypes` array**
- Keep section styles in sync with pattern library
- Test fluid typography on multiple viewport sizes
- Verify accessibility (contrast, focus states)

---

**Next Steps After Running This Skill:**

1. Load updated theme.json in WordPress admin
2. Clear WordPress object cache
3. Test all block variations in the editor
4. **Verify section styles appear in block style picker for Group/Columns/Cover blocks (require `blockTypes`)**
5. **Verify block styles appear in style picker for their respective blocks (require `blockTypes`)**
6. Verify styles render correctly when applied
7. Run accessibility audit on generated styles
8. Update documentation with new presets

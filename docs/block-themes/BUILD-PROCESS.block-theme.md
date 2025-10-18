# Block Theme Build Process

This document outlines the comprehensive build process for creating modern WordPress block themes, covering development workflows, tools, and best practices.

## Table of Contents

1. [Introduction](#introduction)
2. [Development Environment Setup](#development-environment-setup)
3. [Block Theme Structure](#block-theme-structure)
4. [Initialization and Scaffolding](#initialization-and-scaffolding)
5. [Development Workflow](#development-workflow)
6. [Theme Configuration with theme.json](#theme-configuration-with-themejson)
7. [Templates and Template Parts](#templates-and-template-parts)
8. [Asset Management](#asset-management)
9. [Custom Block Patterns](#custom-block-patterns)
10. [Testing and Quality Assurance](#testing-and-quality-assurance)
11. [Deployment and Distribution](#deployment-and-distribution)
12. [AI-Assisted Theme Development](#ai-assisted-theme-development)
13. [Post-Launch Maintenance](#post-launch-maintenance)

## Introduction

Block themes represent WordPress's future, built entirely with blocks and supporting Full Site Editing (FSE). Unlike classic themes, block themes use HTML templates and a central theme.json configuration file instead of PHP template files, enabling a more visual, less code-intensive development experience.

Block themes provide several advantages:

- Visual editing of all site elements through the Site Editor
- Consistent design system through theme.json
- No PHP required for basic templates
- User-friendly customization
- Future-proof architecture aligned with WordPress core development

This document provides a comprehensive guide to the block theme build process, from initial setup to deployment and beyond.

## Development Environment Setup

Before starting block theme development, set up an efficient local environment:

### WordPress Installation

Choose one of these approaches:

1. **@wordpress/env (Recommended)**
   ```bash
   npm i -g @wordpress/env
   wp-env start
   ```

2. **LocalWP**
   - Install from [localwp.com](https://localwp.com/)
   - Create a new site with latest WordPress version

### Required Development Tools

1. **Node.js and npm**
   ```bash
   # Check versions
   node -v  # Should be v16+
   npm -v   # Should be v7+
   
   # Install latest if needed
   brew install node  # macOS with Homebrew
   ```

2. **Code Editor Setup**
   - VS Code with WordPress extensions
   - Syntax highlighting for theme.json

3. **Browser Development Tools**
   - React Developer Tools
   - Redux DevTools (for inspecting @wordpress/data stores)

## Block Theme Structure

A typical block theme has this directory structure:

```
theme-name/
├── assets/                # Images, fonts, etc.
│   ├── css/               # Additional CSS files
│   └── js/                # JavaScript files
├── inc/                   # PHP functionality (if needed)
│   └── block-patterns.php # Register custom patterns
├── parts/                 # Template parts (HTML)
│   ├── header.html        # Header template part
│   └── footer.html        # Footer template part
├── patterns/              # Block patterns (HTML)
│   ├── call-to-action.php # Custom pattern registration
│   └── testimonials.php   # Custom pattern registration
├── styles/                # Global style variations
│   └── dark.json          # Dark mode style variation
├── templates/             # Page templates (HTML)
│   ├── index.html         # Index template
│   ├── single.html        # Single post template
│   └── page.html          # Page template
├── theme.json             # Theme configuration
├── functions.php          # Theme functions (minimal)
├── style.css              # Theme metadata
└── screenshot.png         # Theme screenshot
```

## Initialization and Scaffolding

There are several ways to start a block theme project:

### Method 1: Create Block Theme Plugin

1. Install the [Create Block Theme](https://wordpress.org/plugins/create-block-theme/) plugin
2. Go to Appearance > Create Block Theme
3. Choose "Create Blank Theme"
4. Fill in theme details and create

### Method 2: Manual Creation

1. Create a new directory in wp-content/themes/
2. Create the essential files:

   **style.css**:
   ```css
   /*
   Theme Name: My Block Theme
   Theme URI: https://example.com
   Author: Your Name
   Author URI: https://example.com
   Description: A custom block theme
   Version: 1.0.0
   License: GNU General Public License v2 or later
   License URI: http://www.gnu.org/licenses/gpl-2.0.html
   Text Domain: my-block-theme
   Tags: block-theme, full-site-editing
   */
   ```

   **theme.json**:
   ```json
   {
     "$schema": "https://schemas.wp.org/trunk/theme.json",
     "version": 2,
     "settings": {
       "color": {
         "palette": [
           {
             "slug": "primary",
             "color": "#0d6efd",
             "name": "Primary"
           },
           {
             "slug": "secondary",
             "color": "#6c757d",
             "name": "Secondary"
           }
         ]
       }
     }
   }
   ```

   **index.html** (in templates/ directory):
   ```html
   <!-- wp:template-part {"slug":"header"} /-->
   
   <!-- wp:query {"queryId":1,"query":{"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":true}} -->
   <div class="wp-block-query">
     <!-- wp:post-template -->
       <!-- wp:post-title {"isLink":true} /-->
       <!-- wp:post-excerpt /-->
     <!-- /wp:post-template -->
     
     <!-- wp:query-pagination -->
       <!-- wp:query-pagination-previous /-->
       <!-- wp:query-pagination-numbers /-->
       <!-- wp:query-pagination-next /-->
     <!-- /wp:query-pagination -->
   </div>
   <!-- /wp:query -->
   
   <!-- wp:template-part {"slug":"footer"} /-->
   ```

### Method 3: Using Starter Themes

Start with an existing block theme as a foundation:

1. Download a starter block theme like:
   - [Frost](https://wordpress.org/themes/frost/)
   - [Tove](https://wordpress.org/themes/tove/)
   - [BlockBase](https://wordpress.org/themes/blockbase/)

2. Rename the theme directory and customize theme details in style.css

## Development Workflow

Block theme development has two main approaches that can be used separately or in combination:

### Code-First Approach

1. **Setup Build Tools**:
   ```bash
   # Initialize project
   npm init -y
   
   # Install WordPress scripts and dependencies
   npm install --save-dev @wordpress/scripts @wordpress/env
   ```

2. **Configure package.json**:
   ```json
   {
     "scripts": {
       "start": "wp-scripts start",
       "build": "wp-scripts build",
       "env:start": "wp-env start",
       "env:stop": "wp-env stop"
     }
   }
   ```

3. **Create/Edit Templates in Code**:
   - Edit HTML files directly in the templates/ directory
   - Use block comments syntax for WordPress blocks

4. **Update theme.json**:
   - Define colors, typography, spacing, etc.
   - Configure block support and styles

### Visual-First Approach

1. **Design in Site Editor**:
   - Go to Appearance > Editor
   - Create and customize templates visually
   - Design template parts like headers and footers

2. **Export Changes to Theme**:
   - Use Create Block Theme plugin
   - Select "Create Child Theme" or "Export" to generate theme files
   - The plugin will convert your visual changes to HTML and theme.json

3. **Refine in Code**:
   - Clean up exported files
   - Organize and improve code structure

### Hybrid Approach (Recommended)

1. Start with a basic code structure
2. Develop complex layouts visually in the Site Editor
3. Export and clean up the generated code
4. Version control your changes
5. Repeat for iterative development

## Theme Configuration with theme.json

The theme.json file is the heart of a block theme, defining the design system:

### Basic Structure

```json
{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 2,
  "settings": {
    "color": {},
    "typography": {},
    "spacing": {},
    "layout": {}
  },
  "styles": {
    "color": {},
    "typography": {},
    "elements": {},
    "blocks": {}
  },
  "customTemplates": [],
  "templateParts": []
}
```

### Key Configuration Areas

1. **Color Palette**
   ```json
   "color": {
     "palette": [
       {
         "slug": "primary",
         "color": "#0d6efd",
         "name": "Primary"
       }
     ],
     "gradients": [],
     "duotone": []
   }
   ```

2. **Typography**
   ```json
   "typography": {
     "fontFamilies": [
       {
         "fontFamily": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
         "slug": "system-font",
         "name": "System Font"
       }
     ],
     "fontSizes": [
       {
         "slug": "small",
         "size": "0.875rem",
         "name": "Small"
       },
       {
         "slug": "medium",
         "size": "1rem",
         "name": "Medium"
       }
     ]
   }
   ```

3. **Spacing**
   ```json
   "spacing": {
     "units": ["px", "em", "rem", "vh", "vw", "%"],
     "spacingSizes": [
       {
         "slug": "small",
         "size": "1rem",
         "name": "Small"
       },
       {
         "slug": "medium", 
         "size": "2rem",
         "name": "Medium"
       }
     ]
   }
   ```

4. **Layout**
   ```json
   "layout": {
     "contentSize": "800px",
     "wideSize": "1200px"
   }
   ```

### Block-Specific Settings

```json
"blocks": {
  "core/paragraph": {
    "color": {
      "background": true,
      "text": true
    },
    "typography": {
      "fontSizes": [
        {
          "slug": "normal",
          "size": "1rem",
          "name": "Normal"
        }
      ]
    }
  }
}
```

### Global Styles

```json
"styles": {
  "color": {
    "background": "#ffffff",
    "text": "#111111"
  },
  "typography": {
    "fontSize": "1rem",
    "fontFamily": "var(--wp--preset--font-family--system-font)",
    "lineHeight": "1.5"
  },
  "blocks": {
    "core/heading": {
      "typography": {
        "fontFamily": "var(--wp--preset--font-family--heading-font)"
      }
    }
  }
}
```

## Templates and Template Parts

Block themes use HTML files with block markup instead of PHP template files:

### Template Hierarchy

Templates in the templates/ directory follow WordPress's template hierarchy:

- index.html
- singular.html
- single.html
- single-{post-type}.html
- page.html
- archive.html
- archive-{post-type}.html
- 404.html

### Template Parts

Reusable sections stored in the parts/ directory:

- header.html
- footer.html
- sidebar.html
- comments.html

### Block Markup Syntax

Templates use HTML comments for block markup:

```html
<!-- wp:paragraph {"className":"intro"} -->
<p class="intro">Welcome to my site</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2>Latest Posts</h2>
<!-- /wp:heading -->

<!-- wp:query {"queryId":1,"query":{"perPage":3,"postType":"post"}} -->
<div class="wp-block-query">
  <!-- wp:post-template -->
    <!-- wp:post-title {"isLink":true} /-->
    <!-- wp:post-excerpt /-->
  <!-- /wp:post-template -->
</div>
<!-- /wp:query -->
```

## Asset Management

### CSS Management

Block themes primarily use theme.json for styling, but custom CSS can be added:

1. **Style.css**
   - For theme metadata only, not for styles

2. **Additional CSS Files**
   ```php
   // functions.php
   function mytheme_enqueue_styles() {
     wp_enqueue_style(
       'mytheme-styles',
       get_template_directory_uri() . '/assets/css/custom.css',
       [],
       wp_get_theme()->get('Version')
     );
   }
   add_action('wp_enqueue_scripts', 'mytheme_enqueue_styles');
   ```

3. **Block-Specific Styles**
   - Create CSS files that match block names
   - Register in functions.php or with block.json

### JavaScript Management

Add custom JavaScript when needed:

```php
// functions.php
function mytheme_enqueue_scripts() {
  wp_enqueue_script(
    'mytheme-scripts',
    get_template_directory_uri() . '/assets/js/scripts.js',
    [],
    wp_get_theme()->get('Version'),
    true
  );
}
add_action('wp_enqueue_scripts', 'mytheme_enqueue_scripts');
```

### Build Process for Assets

1. Configure webpack via @wordpress/scripts:
   ```js
   // webpack.config.js
   const defaultConfig = require('@wordpress/scripts/config/webpack.config');
   
   module.exports = {
     ...defaultConfig,
     entry: {
       'theme': './src/js/theme.js',
     },
   };
   ```

2. Add build scripts to package.json:
   ```json
   {
     "scripts": {
       "build": "wp-scripts build",
       "start": "wp-scripts start"
     }
   }
   ```

3. Run the development or build process:
   ```bash
   # For development with auto-reload
   npm start
   
   # For production
   npm run build
   ```

## Custom Block Patterns

Block patterns provide pre-designed layouts users can insert into their content:

### Pattern Registration

```php
// inc/block-patterns.php
function mytheme_register_block_patterns() {
  register_block_pattern(
    'mytheme/hero-section',
    [
      'title' => __('Hero Section', 'mytheme'),
      'categories' => ['header'],
      'content' => '
        <!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"var:preset|spacing|large","bottom":"var:preset|spacing|large"}}},"backgroundColor":"primary","textColor":"background","layout":{"type":"constrained"}} -->
        <div class="wp-block-group alignfull has-background-color has-primary-background-color has-text-color has-background" style="padding-top:var(--wp--preset--spacing--large);padding-bottom:var(--wp--preset--spacing--large)">
          <!-- wp:heading {"textAlign":"center","level":1,"fontSize":"x-large"} -->
          <h1 class="wp-block-heading has-text-align-center has-x-large-font-size">Welcome to My Site</h1>
          <!-- /wp:heading -->
          
          <!-- wp:paragraph {"align":"center"} -->
          <p class="has-text-align-center">This is a hero section pattern you can reuse across your site.</p>
          <!-- /wp:paragraph -->
          
          <!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
          <div class="wp-block-buttons">
            <!-- wp:button -->
            <div class="wp-block-button"><a class="wp-block-button__link wp-element-button">Learn More</a></div>
            <!-- /wp:button -->
          </div>
          <!-- /wp:buttons -->
        </div>
        <!-- /wp:group -->
      ',
    ]
  );
}
add_action('init', 'mytheme_register_patterns');
```

### Pattern Categories

Register custom pattern categories:

```php
function mytheme_register_pattern_categories() {
  register_block_pattern_category(
    'mytheme',
    [ 'label' => __('My Theme', 'mytheme') ]
  );
}
add_action('init', 'mytheme_register_pattern_categories');
```

### File-Based Pattern Registration

Alternatively, create patterns in the patterns/ directory:

```php
// functions.php
function mytheme_register_pattern_directory() {
  register_block_pattern_directory( get_template_directory() . '/patterns' );
}
add_action( 'init', 'mytheme_register_pattern_directory' );
```

## Testing and Quality Assurance

### Cross-Browser Testing

Test your theme across multiple browsers:
- Chrome
- Firefox
- Safari
- Edge

### Responsive Testing

Test on various screen sizes:
- Mobile phones (320px - 480px)
- Tablets (768px - 1024px)
- Laptops (1024px - 1440px)
- Desktops (1440px+)

### WordPress Compatibility

Test with:
- Latest WordPress version
- Common plugins like Yoast SEO, WooCommerce, etc.
- Different content types and edge cases

### Accessibility Testing

1. Keyboard navigation
2. Screen reader compatibility
3. Color contrast
4. ARIA attributes
5. Form inputs and labels

### Theme Check

Run the Theme Check plugin to validate WordPress standards compliance.

## Deployment and Distribution

### Theme Packaging

1. **Create Production Build**
   ```bash
   npm run build
   ```

2. **Remove Development Files**
   Create a distribution copy without:
   - node_modules/
   - src/ (if using a build process)
   - .git/
   - development configuration files

3. **ZIP Creation**
   ```bash
   # From theme directory
   zip -r mytheme.zip . -x "node_modules/*" ".*" "src/*" "package*" "webpack*"
   ```

### WordPress.org Submission

If submitting to the WordPress.org theme directory:

1. Follow the [Theme Review Requirements](https://make.wordpress.org/themes/handbook/review/)
2. Create a properly formatted readme.txt
3. Ensure screenshot.png follows guidelines
4. Submit through the [Theme Upload Page](https://wordpress.org/themes/upload/)

### Theme Update Process

For themes in active development:

1. Maintain a changelog
2. Use semantic versioning
3. Document breaking changes
4. Test updates thoroughly

## AI-Assisted Theme Development

Modern theme development can be accelerated with AI tools:

### Generative Design

Use AI tools to:

1. **Generate Design Tokens**
   - Color palettes
   - Typography scale
   - Spacing values

2. **Create Block Patterns**
   - Hero sections
   - Testimonial layouts
   - Product showcases

3. **Generate theme.json Configurations**
   - Convert design requirements to theme.json
   - Create style variations

### GitHub Copilot Integration

GitHub Copilot can help with:

1. **Writing Block Markup**
   - Suggest complex block structures
   - Generate pattern variations

2. **CSS Generation**
   - Create custom CSS for advanced styling
   - Generate responsive layouts

3. **PHP Functionality**
   - Develop custom theme functions
   - Create block pattern registration

### Example AI-Assisted Workflow

1. Describe your design requirements to an AI assistant
2. Have AI generate a theme.json structure
3. Review and refine the AI suggestions
4. Implement the designs in the Site Editor
5. Export the theme and clean up the code

## Post-Launch Maintenance

### Performance Monitoring

Regularly test your theme's performance:
- Google PageSpeed Insights
- Web Vitals
- Load time testing

### Update Strategy

Keep your theme updated:
1. Follow WordPress core changes
2. Test with beta versions
3. Update dependencies
4. Add support for new WordPress features

### Security Considerations

1. Regular audits for security issues
2. Proper escaping and sanitization
3. Limited use of custom JavaScript
4. Keep dependencies updated

### Documentation

Maintain comprehensive documentation:
- User guides
- Customization options
- Template overrides
- Block pattern usage

---

This document provides a comprehensive guide to the block theme build process. By following these steps, you can create modern, flexible WordPress block themes that leverage the full power of the Site Editor and provide exceptional user experiences.

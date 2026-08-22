/**
 * WordPress Theme Validation Rules
 * Task 3.2: Framework-Specific Validation Rules
 *
 * Validates prompts targeting WordPress theme development.
 * Rules cover: theme.json structure, design tokens, templates, patterns, and best practices.
 *
 * @version 1.0.0
 * @phase 3.2
 */

/**
 * WordPress theme validation rules (50+ rules)
 * Organized by theme development standards
 */
export const themeRules = {
  // === THEME HEADER & METADATA (Rules 1-8) ===

  rule_001_style_css_header_present() {
    return {
      name: "style.css Has Valid Theme Header",
      severity: "error",
      pattern: /^\/\*[\s\S]*?Theme Name:[\s\S]*?Theme URI:[\s\S]*?\*\//,
      description: "style.css must have valid WordPress theme header",
      example: "/**\n * Theme Name: My Theme\n * Theme URI: https://example.com\n */",
      fix: "Add WordPress theme header to style.css"
    };
  },

  rule_002_theme_name_present() {
    return {
      name: "Theme Name Field Required",
      severity: "error",
      pattern: /Theme Name:/,
      description: "style.css header must include 'Theme Name:' field",
      example: "Theme Name: My Beautiful Theme",
      fix: "Add 'Theme Name: Your Theme Name' to style.css"
    };
  },

  rule_003_theme_uri_present() {
    return {
      name: "Theme URI Field Present",
      severity: "warning",
      pattern: /Theme URI:/,
      description: "style.css should include 'Theme URI:' for theme homepage",
      example: "Theme URI: https://example.com/theme",
      fix: "Add 'Theme URI: https://...' to style.css"
    };
  },

  rule_004_theme_description_present() {
    return {
      name: "Theme Description Present",
      severity: "warning",
      pattern: /Description:/,
      description: "style.css should include 'Description:' field",
      example: "Description: A modern, responsive WordPress theme",
      fix: "Add 'Description: Clear description' to style.css"
    };
  },

  rule_005_theme_author_credited() {
    return {
      name: "Theme Author Credited",
      severity: "info",
      pattern: /Author:/,
      description: "style.css should credit the theme author",
      example: "Author: Theme Author Name",
      fix: "Add 'Author: Your Name' to style.css"
    };
  },

  rule_006_theme_version_semantic() {
    return {
      name: "Theme Version Uses Semantic Versioning",
      severity: "warning",
      pattern: /Version:\s*(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/,
      description: "Theme version should follow semantic versioning (MAJOR.MINOR.PATCH)",
      example: "Version: 1.2.3",
      fix: "Use semver format: Version: 1.0.0"
    };
  },

  rule_007_theme_requires_wordpress() {
    return {
      name: "Theme Specifies WordPress Requirement",
      severity: "warning",
      pattern: /Requires at least:\s*(4\.|5\.|6\.)/,
      description: "Theme should specify minimum WordPress version",
      example: "Requires at least: 6.0",
      fix: "Add 'Requires at least: X.X' to theme header"
    };
  },

  rule_008_theme_requires_php() {
    return {
      name: "Theme Specifies PHP Requirement",
      severity: "warning",
      pattern: /Requires PHP:\s*(7\.|8\.)/,
      description: "Theme should specify minimum PHP version",
      example: "Requires PHP: 8.0",
      fix: "Add 'Requires PHP: X.X' to theme header"
    };
  },

  // === THEME.JSON STRUCTURE (Rules 9-20) ===

  rule_009_theme_json_valid() {
    return {
      name: "theme.json Is Valid JSON",
      severity: "error",
      pattern: /^\{[\s\S]*"version":\s*\d[\s\S]*\}$/,
      description: "theme.json must be valid JSON with 'version' field",
      example: '{\n  "version": 2,\n  "settings": {},\n  "styles": {}\n}',
      fix: "Validate theme.json; check for syntax errors, ensure version field"
    };
  },

  rule_010_theme_json_version_two() {
    return {
      name: "theme.json Uses Version 2 or Later",
      severity: "warning",
      pattern: /"version":\s*[2-9]/,
      description: "theme.json should use version 2 or later (version 1 is deprecated)",
      example: '"version": 2',
      fix: "Update version to 2"
    };
  },

  rule_011_theme_json_root_schemas() {
    return {
      name: "theme.json Includes Recommended Root Schemas",
      severity: "info",
      pattern: /"(version|settings|styles|customTemplates|patterns|templateParts)"/,
      description: "theme.json should include key sections: version, settings, styles",
      example: '{\n  "version": 2,\n  "settings": {...},\n  "styles": {...}\n}',
      fix: "Add missing root-level sections to theme.json"
    };
  },

  rule_012_theme_json_settings_organized() {
    return {
      name: "theme.json Settings Are Properly Organized",
      severity: "info",
      pattern: /"settings":\s*\{[\s\S]*?"(appearance|spacing|typography|border|color|layout)":/,
      description: "Theme settings should be organized by category (appearance, spacing, etc.)",
      example: '"settings": {"appearance": {...}, "spacing": {...}}',
      fix: "Organize settings into standard categories"
    };
  },

  rule_013_theme_json_styles_organized() {
    return {
      name: "theme.json Styles Are Properly Organized",
      severity: "info",
      pattern: /"styles":\s*\{[\s\S]*?"(color|typography|border|spacing)":/,
      description: "Theme styles should be organized by property type",
      example: '"styles": {"color": {...}, "typography": {...}}',
      fix: "Organize styles by property: color, typography, border, spacing"
    };
  },

  rule_014_design_tokens_centralized() {
    return {
      name: "Design Tokens Centralized in theme.json",
      severity: "warning",
      pattern: /"(--.*)":\s*".*"/,
      description: "Design tokens should be defined in theme.json, not scattered in CSS",
      example: '"--color-primary": "#0073aa"',
      fix: "Move design tokens to theme.json CSS custom properties"
    };
  },

  rule_015_color_palette_defined() {
    return {
      name: "Color Palette Is Defined",
      severity: "warning",
      pattern: /"color":\s*\{[\s\S]*?"palette":/,
      description: "theme.json should define color palette with named colors",
      example: '"palette": [{"name": "Primary", "slug": "primary", "color": "#0073aa"}]',
      fix: "Add color palette to theme.json settings"
    };
  },

  rule_016_typography_defined() {
    return {
      name: "Typography Settings Defined",
      severity: "info",
      pattern: /"typography":\s*\{/,
      description: "theme.json should define typography settings (font sizes, line heights, etc.)",
      example: '"typography": {"fontSizes": [...], "fontFamilies": [...]}',
      fix: "Add typography settings to theme.json"
    };
  },

  rule_017_spacing_scale_defined() {
    return {
      name: "Spacing Scale Is Defined",
      severity: "info",
      pattern: /"spacing":\s*\{[\s\S]*?"spacingSizes":/,
      description: "theme.json should define consistent spacing scale",
      example: '"spacingSizes": [{"name": "Small", "size": "0.5rem"}]',
      fix: "Add spacing scale to theme.json"
    };
  },

  rule_018_responsive_typography_enabled() {
    return {
      name: "Responsive Typography Enabled",
      severity: "info",
      pattern: /"typography":\s*\{[\s\S]*?"fluid":/,
      description: "theme.json should enable fluid typography for responsive fonts",
      example: '"typography": {"fluid": {"minViewportWidth": "320px"}}',
      fix: "Add fluid typography settings for responsive design"
    };
  },

  rule_019_block_spacing_defaults() {
    return {
      name: "Block Spacing Defaults Set",
      severity: "info",
      pattern: /"spacing":\s*\{[\s\S]*?"blockGap":/,
      description: "theme.json should define default block spacing to prevent layout shifts",
      example: '"spacing": {"blockGap": "1.5rem"}',
      fix: "Define default block gap spacing"
    };
  },

  rule_020_border_settings_consistent() {
    return {
      name: "Border Settings Are Consistent",
      severity: "info",
      pattern: /"border":/,
      description: "theme.json should define border radius and width standards",
      example: '"border": {"radius": [{"name": "Small", "slug": "small", "size": "4px"}]}',
      fix: "Add border settings to theme.json"
    };
  },

  // === TEMPLATES & TEMPLATE PARTS (Rules 21-28) ===

  rule_021_templates_folder_exists() {
    return {
      name: "Templates Folder Exists",
      severity: "warning",
      pattern: /templates\//,
      description: "Theme should have a 'templates/' directory for block templates",
      example: "templates/index.html, templates/single.html",
      fix: "Create templates/ folder with required block templates"
    };
  },

  rule_022_template_parts_folder_exists() {
    return {
      name: "Template Parts Folder Exists",
      severity: "warning",
      pattern: /parts\//,
      description: "Theme should have a 'parts/' directory for reusable template parts",
      example: "parts/header.html, parts/footer.html",
      fix: "Create parts/ folder with header, footer, navigation, etc."
    };
  },

  rule_023_index_template_exists() {
    return {
      name: "Index Template Exists",
      severity: "error",
      pattern: /templates\/index\.html/,
      description: "Theme must have templates/index.html as fallback template",
      example: "templates/index.html (required, minimal: post loop)",
      fix: "Create templates/index.html"
    };
  },

  rule_024_single_template_exists() {
    return {
      name: "Single Template Exists",
      severity: "warning",
      pattern: /templates\/single\.html/,
      description: "Theme should have templates/single.html for single post display",
      example: "templates/single.html",
      fix: "Create templates/single.html"
    };
  },

  rule_025_page_template_exists() {
    return {
      name: "Page Template Exists",
      severity: "warning",
      pattern: /templates\/page\.html/,
      description: "Theme should have templates/page.html for page display",
      example: "templates/page.html",
      fix: "Create templates/page.html"
    };
  },

  rule_026_templates_use_block_markup() {
    return {
      name: "Templates Use WordPress Block Markup",
      severity: "warning",
      pattern: /<!-- wp:([a-z]+\/)?[a-z-]+(?: |--)/,
      description: "Templates should use HTML comments for block markup, not PHP templates",
      example: '<!-- wp:post-title /-->\n<!-- wp:post-content /-->',
      fix: "Convert to block template format with HTML comments"
    };
  },

  rule_027_theme_json_template_parts() {
    return {
      name: "Template Parts Registered in theme.json",
      severity: "info",
      pattern: /"templateParts":/,
      description: "theme.json should register template parts with area (header, footer, etc.)",
      example: '"templateParts": [{"name": "header", "area": "header"}]',
      fix: "Register template parts in theme.json"
    };
  },

  rule_028_patterns_folder_organized() {
    return {
      name: "Block Patterns Organized in Dedicated Folder",
      severity: "info",
      pattern: /patterns\//,
      description: "Block patterns should be in dedicated 'patterns/' directory",
      example: "patterns/hero.php, patterns/testimonial.php",
      fix: "Move patterns to patterns/ folder"
    };
  },

  // === FUNCTIONS.PHP & ENQUEUE (Rules 29-36) ===

  rule_029_functions_php_exists() {
    return {
      name: "functions.php Exists",
      severity: "error",
      pattern: /^functions\.php$/,
      description: "Theme root must have functions.php (even if minimal)",
      example: "functions.php (can be empty but must exist)",
      fix: "Create functions.php in theme root"
    };
  },

  rule_030_wp_head_wp_footer_in_template() {
    return {
      name: "wp_head() and wp_footer() Hooks Present",
      severity: "error",
      pattern: /(wp_head|wp_footer)\(\)/,
      description: "Templates must call wp_head() in header and wp_footer() before closing body",
      example: "<!-- wp:html\n{\"value\":\"<?php wp_head();?>\"} /-->\n... content ...\n<!-- wp:html\n{\"value\":\"<?php wp_footer();?>\"} /-->",
      fix: "Add wp_head() and wp_footer() to templates"
    };
  },

  rule_031_scripts_enqueued_properly() {
    return {
      name: "Scripts and Styles Enqueued, Not Hardcoded",
      severity: "error",
      pattern: /wp_enqueue_(script|style)/,
      description: "CSS and JS should be enqueued in functions.php, not hardcoded in templates",
      example: "wp_enqueue_script('my-script', get_theme_file_uri('js/script.js'));",
      fix: "Move <link> and <script> tags to wp_enqueue functions"
    };
  },

  rule_032_theme_support_declared() {
    return {
      name: "Theme Support Features Declared",
      severity: "warning",
      pattern: /add_theme_support/,
      description: "functions.php should declare theme support features (post-thumbnails, menus, etc.)",
      example: "add_theme_support('post-thumbnails');\nadd_theme_support('menus');",
      fix: "Add add_theme_support() calls for features used"
    };
  },

  rule_033_custom_logo_supported() {
    return {
      name: "Custom Logo Support Enabled",
      severity: "info",
      pattern: /add_theme_support\(\s*['\"]custom-logo/,
      description: "Modern themes should support custom logo upload",
      example: "add_theme_support('custom-logo');",
      fix: "Add custom logo support"
    };
  },

  rule_034_custom_colors_supported() {
    return {
      name: "Custom Colors Support Enabled",
      severity: "info",
      pattern: /add_theme_support\(\s*['\"]custom-colors/,
      description: "Theme should allow custom color selection in block editor",
      example: "add_theme_support('custom-colors');",
      fix: "Add custom colors support"
    };
  },

  rule_035_menus_registered() {
    return {
      name: "Navigation Menus Registered",
      severity: "warning",
      pattern: /register_nav_menus|register_nav_menu/,
      description: "Theme should register custom navigation menus",
      example: "register_nav_menus(['primary' => 'Primary Menu']);",
      fix: "Register navigation menus in functions.php"
    };
  },

  rule_036_widgets_supported() {
    return {
      name: "Widget Areas Registered",
      severity: "info",
      pattern: /register_sidebar|add_theme_support.*widgets/,
      description: "Theme should register widget areas if using legacy widgets",
      example: "register_sidebar(['name' => 'Sidebar']);",
      fix: "Register widget areas or use block editor templates"
    };
  },

  // === CSS ORGANIZATION (Rules 37-42) ===

  rule_037_css_uses_custom_properties() {
    return {
      name: "CSS Uses CSS Custom Properties for Tokens",
      severity: "warning",
      pattern: /var\(--[a-z0-9-]+\)/,
      description: "CSS should use CSS custom properties (variables) for design tokens",
      example: "color: var(--color-primary);",
      fix: "Replace hardcoded values with var(--token-name)"
    };
  },

  rule_038_css_mobile_first() {
    return {
      name: "CSS Uses Mobile-First Approach",
      severity: "info",
      pattern: /@media\s*\(\s*min-width/,
      description: "CSS should use min-width media queries (mobile-first), not max-width",
      example: "@media (min-width: 768px) { ... }",
      fix: "Switch to mobile-first: min-width instead of max-width"
    };
  },

  rule_039_no_hardcoded_colors() {
    return {
      name: "No Hardcoded Colors in CSS",
      severity: "warning",
      pattern: /color:\s*#[0-9a-fA-F]{3,6}|background(-color)?:\s*#[0-9a-fA-F]{3,6}/,
      description: "Colors should use design tokens, not hardcoded hex/rgb values",
      example: "color: var(--color-text);  not  color: #333;",
      fix: "Define colors in theme.json, reference with CSS variables"
    };
  },

  rule_040_css_uses_logical_properties() {
    return {
      name: "CSS Uses Logical Properties Where Possible",
      severity: "info",
      pattern: /(margin-inline|padding-block|inset-inline)/,
      description: "CSS should use logical properties (margin-inline, padding-block) for RTL support",
      example: "margin-inline: 1rem;  not  margin-left: 1rem;",
      fix: "Replace directional properties with logical ones"
    };
  },

  rule_041_style_css_minimal() {
    return {
      name: "style.css Contains Minimal CSS",
      severity: "info",
      pattern: /^[^{]*\{[^}]{100,}/m,
      description: "style.css should contain only header comment, main CSS should be in separate files",
      example: "style.css: header comment only\nstyles/main.css: all theme styles",
      fix: "Move CSS to dedicated files in styles/ folder"
    };
  },

  rule_042_critical_css_inlined() {
    return {
      name: "Critical CSS Is Inlined or Preloaded",
      severity: "info",
      pattern: /rel=[\"']preload[\"']/,
      description: "Critical CSS should be inlined in head or preloaded for performance",
      example: '<link rel="preload" href="critical.css" as="style">',
      fix: "Inline critical CSS or preload stylesheet"
    };
  },

  // === ACCESSIBILITY & PERFORMANCE (Rules 43-52) ===

  rule_043_semantic_html_used() {
    return {
      name: "Semantic HTML Elements Used",
      severity: "warning",
      pattern: /(nav|main|section|article|aside|header|footer)/,
      description: "Templates should use semantic HTML elements (nav, main, section, etc.)",
      example: "<nav>Navigation</nav> not <div class=\"nav\">",
      fix: "Replace div wrappers with semantic elements"
    };
  },

  rule_044_aria_labels_present() {
    return {
      name: "ARIA Labels Present for Icons",
      severity: "warning",
      pattern: /aria-label|aria-describedby/,
      description: "Icon-only buttons and interactive elements should have ARIA labels",
      example: '<button aria-label="Close menu">×</button>',
      fix: "Add aria-label to icon-only interactive elements"
    };
  },

  rule_045_color_contrast_sufficient() {
    return {
      name: "Color Contrast Meets WCAG AA Standards",
      severity: "warning",
      pattern: /color:|background(-color)?:/,
      description: "Text should have sufficient contrast (4.5:1 for normal text, 3:1 for large text)",
      example: "Test with WebAIM contrast checker",
      fix: "Adjust colors to meet WCAG AA standards (4.5:1 minimum)"
    };
  },

  rule_046_alt_text_templates() {
    return {
      name: "Image Alt Text in Templates",
      severity: "warning",
      pattern: /(<!-- wp:image|<img)/,
      description: "Images in templates should have meaningful alt text",
      example: '<!-- wp:image {\"alt\":\"Hero image description\"} /-->',
      fix: "Add alt text to all images"
    };
  },

  rule_047_fonts_subset_for_performance() {
    return {
      name: "Fonts Subset for Performance",
      severity: "info",
      pattern: /subset=/,
      description: "Google Fonts and web fonts should be subset to reduce download size",
      example: 'https://fonts.googleapis.com/css2?family=Open+Sans&subset=latin',
      fix: "Add &subset=latin to font URLs"
    };
  },

  rule_048_lazy_loading_enabled() {
    return {
      name: "Lazy Loading Enabled on Images",
      severity: "info",
      pattern: /loading=[\"']lazy[\"']|decoding=[\"']async[\"']/,
      description: "Images should use native lazy loading for performance",
      example: '<img src="..." loading="lazy">',
      fix: "Add loading=\"lazy\" to img tags"
    };
  },

  rule_049_no_render_blocking_css() {
    return {
      name: "No Render-Blocking CSS",
      severity: "warning",
      pattern: /rel=[\"']stylesheet[\"']/,
      description: "CSS should not block rendering; split critical/non-critical",
      example: "Inline critical CSS, defer non-critical with media queries",
      fix: "Optimize CSS delivery to prevent render-blocking"
    };
  },

  rule_050_optimized_image_formats() {
    return {
      name: "Images Use Modern Formats (WebP, AVIF)",
      severity: "info",
      pattern: /\.(jpg|jpeg|png|gif)$/i,
      description: "Images should use modern formats (WebP, AVIF) with fallbacks",
      example: '<picture><source srcset=\"image.webp\" type=\"image/webp\"><img src=\"image.jpg\"></picture>',
      fix: "Convert images to WebP/AVIF with fallbacks"
    };
  },

  rule_051_preconnect_to_external_hosts() {
    return {
      name: "Preconnect to External Hosts",
      severity: "info",
      pattern: /rel=[\"']preconnect[\"']/,
      description: "External fonts/APIs should have preconnect links",
      example: '<link rel="preconnect" href="https://fonts.googleapis.com">',
      fix: "Add preconnect links to external resources"
    };
  },

  rule_052_footer_scripts_prioritized() {
    return {
      name: "Deferrable Scripts Enqueued in Footer",
      severity: "warning",
      pattern: /wp_enqueue_script.*in_footer/,
      description: "Non-critical scripts should be enqueued in footer (in_footer = true)",
      example: "wp_enqueue_script('name', 'path', [], false, true);  // true = footer",
      fix: "Add true parameter to enqueue scripts in footer"
    };
  }
};

/**
 * Validation engine
 * Checks a prompt/code against all theme rules
 *
 * @param {string} text - Theme code or prompt text to validate
 * @param {Object} options - Validation options
 * @returns {Array<Object>} Array of findings {rule, severity, message}
 */
export function validateTheme(text, options = {}) {
  const findings = [];
  const { strict = false } = options;

  Object.entries(themeRules).forEach(([key, ruleFn]) => {
    const rule = ruleFn();
    const matches = rule.pattern ? text.match(rule.pattern) : true;

    if (!matches && strict) {
      findings.push({
        rule: rule.name,
        severity: rule.severity,
        message: rule.description,
        suggestion: rule.fix,
        key
      });
    }
  });

  return findings;
}

export default { themeRules, validateTheme };

/**
 * WordPress Plugin Validation Rules
 * Task 3.2: Framework-Specific Validation Rules
 *
 * Validates prompts targeting WordPress plugin development.
 * Rules cover: hook registration, block definitions, plugin headers, dependencies, and best practices.
 *
 * @version 1.0.0
 * @phase 3.2
 */

/**
 * WordPress plugin validation rules (50+ rules)
 * Organized by WordPress plugin standards
 */
export const pluginRules = {
  // === PLUGIN HEADER & METADATA (Rules 1-8) ===

  rule_001_plugin_file_has_header() {
    return {
      name: "Plugin Header Must Be Present",
      severity: "error",
      pattern: /^\/\*[\s\S]*?Plugin Name:[\s\S]*?\*\//,
      description:
        "Main plugin file must have valid plugin header with required fields",
      example:
        "/**\n * Plugin Name: My Plugin\n * Description: Plugin description\n */",
      fix: "Add WordPress plugin header to main .php file",
    };
  },

  rule_002_plugin_name_present() {
    return {
      name: "Plugin Name Field Is Required",
      severity: "error",
      pattern: /Plugin Name:\s*.+/,
      description: "Plugin header must include 'Plugin Name:' field",
      example: "Plugin Name: WordPress Plugin Name",
      fix: "Add 'Plugin Name: Your Plugin Name' to header",
    };
  },

  rule_003_plugin_description_present() {
    return {
      name: "Plugin Description Field Required",
      severity: "warning",
      pattern: /Description:\s*.+/,
      description: "Plugin header should include 'Description:' field",
      example: "Description: What this plugin does",
      fix: "Add 'Description: Clear description' to header",
    };
  },

  rule_004_plugin_version_semantic() {
    return {
      name: "Version Follows Semantic Versioning",
      severity: "warning",
      pattern: /Version:\s*(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/,
      description:
        "Plugin version must follow semantic versioning (MAJOR.MINOR.PATCH)",
      example: "Version: 1.2.3",
      fix: "Use semver format: Version: 1.0.0",
    };
  },

  rule_005_plugin_requires_wordpress() {
    return {
      name: "Plugin Specifies WordPress Requirement",
      severity: "warning",
      pattern: /Requires at least:\s*(3\.|4\.|5\.|6\.)/,
      description:
        "Plugin header should specify minimum WordPress version required",
      example: "Requires at least: 6.0",
      fix: "Add 'Requires at least: X.X' to header",
    };
  },

  rule_006_plugin_requires_php() {
    return {
      name: "Plugin Specifies PHP Requirement",
      severity: "warning",
      pattern: /Requires PHP:\s*(5\.|7\.|8\.)/,
      description: "Plugin should specify minimum PHP version required",
      example: "Requires PHP: 8.0",
      fix: "Add 'Requires PHP: X.X' to header",
    };
  },

  rule_007_plugin_author_credited() {
    return {
      name: "Plugin Author Is Credited",
      severity: "info",
      pattern: /Author:\s*.+/,
      description: "Plugin header should credit the author(s)",
      example: "Author: Author Name",
      fix: "Add 'Author: Your Name' to header",
    };
  },

  rule_008_plugin_license_declared() {
    return {
      name: "Plugin License Is Declared",
      severity: "warning",
      pattern: /License:\s*(GPL|MIT|Apache|BSD)/i,
      description:
        "Plugin should declare its license (typically GPL v2 or later for WP.org)",
      example: "License: GPL v2 or later",
      fix: "Add 'License: GPL v2 or later' or appropriate license",
    };
  },

  // === BLOCK REGISTRATION (Rules 9-18) ===

  rule_009_block_json_valid() {
    return {
      name: "block.json Is Valid JSON",
      severity: "error",
      pattern: /^\{[\s\S]*\}$/,
      description: "block.json must be valid JSON with proper syntax",
      example: '{\n  "name": "my-plugin/my-block",\n  "title": "My Block"\n}',
      fix: "Validate block.json with JSON parser; check for trailing commas",
    };
  },

  rule_010_block_name_namespaced() {
    return {
      name: "Block Name Is Properly Namespaced",
      severity: "error",
      pattern: /"name":\s*"[a-z0-9-]+\/[a-z0-9-]+"/,
      description:
        "Block name must use format 'namespace/block-name' (lowercase, hyphens only)",
      example: '"name": "my-plugin/my-block"',
      fix: "Rename to format: namespace/block-name",
    };
  },

  rule_011_block_title_present() {
    return {
      name: "Block Title Is Present",
      severity: "warning",
      pattern: /"title":\s*"[^"]+"/,
      description: "block.json must include human-readable 'title' field",
      example: '"title": "My Custom Block"',
      fix: "Add 'title' field with user-friendly block name",
    };
  },

  rule_012_block_category_valid() {
    return {
      name: "Block Category Is Valid",
      severity: "warning",
      pattern:
        /"category":\s*"(text|media|design|widgets|embed|reusable|theme)"/,
      description: "Block should use valid WordPress block category",
      example: '"category": "widgets"',
      fix: "Use valid category: text, media, design, widgets, embed, reusable, or theme",
    };
  },

  rule_013_block_description_present() {
    return {
      name: "Block Has Description",
      severity: "info",
      pattern: /"description":\s*"[^"]+"/,
      description:
        "block.json should include 'description' explaining block purpose",
      example: '"description": "A block for displaying featured content"',
      fix: "Add 'description' field to block.json",
    };
  },

  rule_014_block_icon_defined() {
    return {
      name: "Block Icon Is Defined",
      severity: "info",
      pattern: /"icon":\s*"[a-z-]+"/,
      description: "Block should define an icon for toolbar display",
      example: '"icon": "star-filled"',
      fix: "Add 'icon' field with valid Dashicon name or SVG",
    };
  },

  rule_015_block_attributes_documented() {
    return {
      name: "Block Attributes Are Documented",
      severity: "info",
      pattern: /"attributes":\s*\{[\s\S]*?\}/,
      description: "Block attributes should be defined and have proper types",
      example: '"attributes": {"title": {"type": "string", "default": ""}}',
      fix: "Define all used attributes with type, default, and description",
    };
  },

  rule_016_block_render_path_correct() {
    return {
      name: "Block Render Path Is Correct",
      severity: "error",
      pattern: /"render":\s*"[^"]+\.php"/,
      description: "If using 'render', path must point to valid PHP file",
      example: '"render": "render.php"',
      fix: "Verify render file path is correct and relative to block directory",
    };
  },

  rule_017_block_script_handles_defined() {
    return {
      name: "Block Script Handles Are Defined",
      severity: "warning",
      pattern: /"(editorScript|viewScript)":\s*"[^"]+"/,
      description:
        "Block scripts should be registered and handles properly referenced",
      example: '"editorScript": "my-block-editor-script"',
      fix: "Register scripts with wp_register_script() and use correct handles",
    };
  },

  rule_018_block_style_handles_defined() {
    return {
      name: "Block Style Handles Are Defined",
      severity: "warning",
      pattern: /"(editorStyle|style)":\s*"[^"]+"/,
      description:
        "Block styles should be registered and handles properly referenced",
      example: '"style": "my-block-styles"',
      fix: "Register styles with wp_register_style() and use correct handles",
    };
  },

  // === HOOK REGISTRATION (Rules 19-28) ===

  rule_019_hooks_use_standard_names() {
    return {
      name: "Hooks Follow WordPress Naming Convention",
      severity: "warning",
      pattern: /add_(action|filter)\(\s*'[a-z0-9_]+'/,
      description:
        "Hook names should be lowercase with underscores (wordpress convention)",
      example: "add_action('wp_enqueue_scripts', ...)",
      fix: "Use lowercase hook names: wp_enqueue_scripts, admin_menu, etc.",
    };
  },

  rule_020_hooks_have_priority() {
    return {
      name: "Hook Callbacks Include Priority",
      severity: "info",
      pattern: /add_(action|filter)\([^,]+,\s*[^,]+,\s*\d+/,
      description:
        "When priority matters, explicitly set hook priority (default 10)",
      example:
        "add_action('init', 'my_callback', 5);  // Run before standard priority",
      fix: "Add priority parameter if execution order matters",
    };
  },

  rule_021_hooks_have_accepted_args() {
    return {
      name: "Hook Callbacks Declare Accepted Args",
      severity: "info",
      pattern: /add_(action|filter)\([^)]+,\s*[^)]+,\s*\d+,\s*\d+/,
      description: "Callbacks should declare how many arguments they accept",
      example:
        "add_filter('the_content', 'my_filter', 10, 2);  // Accepts 2 args",
      fix: "Add accepted_args parameter if callback needs multiple arguments",
    };
  },

  rule_022_actions_hooked_to_correct_point() {
    return {
      name: "Actions Hooked to Appropriate Lifecycle Point",
      severity: "info",
      pattern:
        /add_action\(\s*'(init|wp_enqueue_scripts|admin_menu|wp_head|wp_footer)',/,
      description:
        "Actions should hook to appropriate WordPress lifecycle point",
      example: "Script loading → wp_enqueue_scripts\nAdmin menu → admin_menu",
      fix: "Choose appropriate hook point: init, wp_enqueue_scripts, admin_menu, etc.",
    };
  },

  rule_023_filters_return_value() {
    return {
      name: "Filter Callbacks Must Return Modified Value",
      severity: "error",
      pattern: /add_filter/,
      description: "Filter callbacks must explicitly return the modified value",
      example: "function my_filter($value) { return $value . ' modified'; }",
      fix: "Ensure filter callback returns the modified value",
    };
  },

  rule_024_nonces_used_for_forms() {
    return {
      name: "Form Data Verified with Nonces",
      severity: "error",
      pattern: /(wp_nonce_field|wp_verify_nonce|check_admin_referer)/,
      description:
        "Forms submitting data must use WordPress nonces for security",
      example:
        "wp_nonce_field('action_name');\nif (!wp_verify_nonce(...)) return;",
      fix: "Add nonce field to forms and verify before processing",
    };
  },

  rule_025_capability_checks_before_actions() {
    return {
      name: "Capability Check Before Admin Actions",
      severity: "error",
      pattern: /(current_user_can|wp_get_current_user)/,
      description:
        "Admin functions must verify user capabilities before executing",
      example:
        "if (!current_user_can('manage_options')) return;\n// ... admin code",
      fix: "Add capability check: if (!current_user_can('...')) return;",
    };
  },

  rule_026_sanitization_on_input() {
    return {
      name: "Input Data Sanitized",
      severity: "error",
      pattern: /(sanitize_text_field|sanitize_email|sanitize_url|wp_kses_post)/,
      description: "All input data must be sanitized before use",
      example: "$clean = sanitize_text_field($_POST['field']);",
      fix: "Wrap input with appropriate sanitize function",
    };
  },

  rule_027_escaping_on_output() {
    return {
      name: "Output Data Escaped",
      severity: "error",
      pattern: /(esc_html|esc_attr|esc_url|wp_kses_post)/,
      description: "All output to user must be escaped",
      example: "echo esc_html($user_input);",
      fix: "Wrap output with esc_html(), esc_attr(), esc_url(), or wp_kses_post()",
    };
  },

  rule_028_database_queries_use_prepared() {
    return {
      name: "Database Queries Use Prepared Statements",
      severity: "error",
      pattern: /\$wpdb->(query|get_results|get_var)\s*\(\s*\$wpdb->prepare/,
      description: "Database queries must use $wpdb->prepare() for security",
      example:
        "$wpdb->get_results($wpdb->prepare('SELECT * FROM table WHERE id = %d', $id))",
      fix: "Use $wpdb->prepare() for all parameterized queries",
    };
  },

  // === FILE ORGANIZATION (Rules 29-35) ===

  rule_029_plugin_main_file_exists() {
    return {
      name: "Plugin Has Main Entry File",
      severity: "error",
      pattern: /^(plugin-name\.php|index\.php|main\.php)$/,
      description:
        "Plugin directory should have main plugin file (typically plugin-name.php)",
      example: "my-plugin.php (matches directory name)",
      fix: "Create main plugin file: my-plugin/my-plugin.php",
    };
  },

  rule_030_blocks_in_dedicated_folder() {
    return {
      name: "Blocks Organized in Blocks Folder",
      severity: "info",
      pattern: /blocks\//,
      description:
        "Block definitions should be in dedicated 'blocks/' directory",
      example: "src/blocks/my-block/block.json",
      fix: "Organize blocks: src/blocks/[block-name]/block.json",
    };
  },

  rule_031_includes_in_includes_folder() {
    return {
      name: "Reusable Code in Includes Folder",
      severity: "info",
      pattern: /includes\//,
      description: "Reusable utility code should be in 'includes/' directory",
      example: "includes/utilities.php, includes/hooks.php",
      fix: "Organize includes: includes/[functionality].php",
    };
  },

  rule_032_admin_code_separated() {
    return {
      name: "Admin Code Separated from Frontend",
      severity: "info",
      pattern: /(admin\/|is_admin\(\))/,
      description:
        "Admin-only functionality should be in separate admin/ folder or guarded by is_admin()",
      example: "src/admin/ for admin pages, admin/menus.php",
      fix: "Move admin code to admin/ folder or wrap with is_admin()",
    };
  },

  rule_033_assets_folder_organized() {
    return {
      name: "Assets Organized by Type",
      severity: "info",
      pattern: /(assets\/(css|js|images)\/|src\/(styles|scripts)\/)/,
      description:
        "CSS, JS, and images should be organized in dedicated asset folders",
      example: "assets/css/, assets/js/, assets/images/",
      fix: "Organize assets: assets/{css,js,images}/",
    };
  },

  rule_034_readme_present() {
    return {
      name: "Plugin Has README.md or readme.txt",
      severity: "warning",
      pattern: /^(README\.md|readme\.txt)$/,
      description: "Plugin should have README for documentation",
      example: "README.md (Markdown) or readme.txt (WP.org format)",
      fix: "Create README.md or readme.txt in plugin root",
    };
  },

  rule_035_license_file_present() {
    return {
      name: "Plugin Has LICENSE File",
      severity: "warning",
      pattern: /^(LICENSE|LICENSE\.md|LICENSE\.txt)$/,
      description:
        "Plugin should include LICENSE file matching declared license",
      example: "LICENSE (GPL v2 text) or LICENSE.md",
      fix: "Add LICENSE file with appropriate license text",
    };
  },

  // === DEPENDENCIES & REQUIREMENTS (Rules 36-42) ===

  rule_036_package_json_valid() {
    return {
      name: "package.json Is Valid JSON",
      severity: "error",
      pattern: /^\{[\s\S]*\}$/,
      description: "package.json must be valid JSON",
      example: '{\n  "name": "my-plugin",\n  "version": "1.0.0"\n}',
      fix: "Validate package.json; check for syntax errors",
    };
  },

  rule_037_dependencies_pinned_versions() {
    return {
      name: "Dependencies Use Pinned Versions",
      severity: "warning",
      pattern: /"(dependencies|devDependencies)":\s*\{[\s\S]*?"[^"]+"/,
      description:
        "Dependencies should pin versions (not use *, latest, or ranges like ^)",
      example: '"package": "1.2.3" not "^1.2.3" or "*"',
      fix: "Use exact versions: npm list to verify, then update package.json",
    };
  },

  rule_038_composer_json_valid() {
    return {
      name: "composer.json Is Valid JSON",
      severity: "error",
      pattern: /^\{[\s\S]*\}$/,
      description: "If using Composer, composer.json must be valid JSON",
      example: '{\n  "name": "vendor/package",\n  "require": {}\n}',
      fix: "Validate composer.json; use 'composer validate'",
    };
  },

  rule_039_no_duplicate_dependencies() {
    return {
      name: "No Duplicate Dependencies Across Package Managers",
      severity: "warning",
      pattern: /(dependencies.*require|require.*dependencies)/,
      description: "Don't duplicate dependencies in both npm and Composer",
      example: "Choose one: npm OR Composer, not both",
      fix: "Use either npm or Composer, consistently",
    };
  },

  rule_040_minimum_wp_version_documented() {
    return {
      name: "Minimum WordPress Version Documented",
      severity: "info",
      pattern: /Requires at least:/,
      description:
        "Plugin header must specify minimum supported WordPress version",
      example: "Requires at least: 6.0",
      fix: "Add 'Requires at least: X.X' with actual minimum version",
    };
  },

  rule_041_minimum_php_version_enforced() {
    return {
      name: "Minimum PHP Version Enforced in Code",
      severity: "warning",
      pattern: /define.*REQUIRED|version_compare.*phpversion/,
      description:
        "Code should check PHP version early and deactivate if not met",
      example: "if (version_compare(PHP_VERSION, '8.0', '<')) { wp_die(...); }",
      fix: "Add version check in plugin main file",
    };
  },

  rule_042_rest_api_check_if_used() {
    return {
      name: "REST API Endpoints Properly Registered",
      severity: "info",
      pattern: /register_rest_route|rest_api_init/,
      description:
        "If using REST API, ensure endpoints are properly registered with permissions",
      example:
        "register_rest_route('my-plugin/v1', '/data', ['callback' => 'get_data'])",
      fix: "Use register_rest_route() with permission callbacks",
    };
  },

  // === CODE QUALITY & STANDARDS (Rules 43-50) ===

  rule_043_no_debug_output() {
    return {
      name: "No Debug Code in Production",
      severity: "error",
      pattern: /(console\.log|var_dump|print_r|wp_die.*debug)/i,
      description:
        "Debug code (var_dump, print_r, console.log) must be removed before release",
      example:
        "❌ var_dump($data);\n✅ error_log('Debug: ' . print_r($data, true));",
      fix: "Remove debug output or use error_log() for logged debugging",
    };
  },

  rule_044_functions_namespaced() {
    return {
      name: "Functions Are Namespaced",
      severity: "warning",
      pattern: /^function\s+[a-z]+_[a-z]/,
      description:
        "All plugin functions should use namespace prefix to avoid conflicts",
      example: "function my_plugin_get_data() { ... }",
      fix: "Prefix functions: get_data() → my_plugin_get_data()",
    };
  },

  rule_045_classes_properly_named() {
    return {
      name: "Classes Use Proper Naming Convention",
      severity: "warning",
      pattern: /class\s+([A-Z][a-zA-Z0-9]*)/,
      description: "Classes should use PascalCase with meaningful names",
      example: "class My_Plugin_Manager { ... }",
      fix: "Use PascalCase with underscore separation for namespaces",
    };
  },

  rule_046_constants_defined() {
    return {
      name: "Plugin Constants Defined Early",
      severity: "info",
      pattern: /define\(\s*'[A-Z_]+'/,
      description: "Important paths/settings should be defined as constants",
      example: "define('MY_PLUGIN_PATH', plugin_dir_path(__FILE__));",
      fix: "Define constants at top of main plugin file",
    };
  },

  rule_047_i18n_functions_used() {
    return {
      name: "Strings Use Internationalization Functions",
      severity: "warning",
      pattern: /(__\(|_e\(|esc_html__\()/,
      description:
        "All user-facing strings should use i18n functions (__(), _e(), etc.)",
      example: '__("Dashboard", "text-domain")',
      fix: "Wrap strings: \"text\" → __('text', 'domain')",
    };
  },

  rule_048_text_domain_consistent() {
    return {
      name: "Text Domain Is Consistent",
      severity: "warning",
      pattern: /(__\(|_e\(|esc_html__\().+['\"]([a-z0-9-]+)['\"]\)/,
      description: "All i18n functions should use the same text domain",
      example: "__('text', 'my-plugin')",
      fix: "Use consistent text domain matching plugin slug",
    };
  },

  rule_049_textdomain_loaded() {
    return {
      name: "Text Domain Loaded with load_plugin_textdomain",
      severity: "warning",
      pattern: /load_plugin_textdomain/,
      description: "Plugin must load text domain for translations",
      example:
        "load_plugin_textdomain('my-plugin', false, dirname(plugin_basename(__FILE__)) . '/languages/');",
      fix: "Add load_plugin_textdomain() call in init or plugins_loaded hook",
    };
  },

  rule_050_activation_deactivation_hooks() {
    return {
      name: "Activation/Deactivation Hooks Defined",
      severity: "info",
      pattern: /(register_activation_hook|register_deactivation_hook)/,
      description:
        "Plugins with setup/cleanup should use activation/deactivation hooks",
      example: "register_activation_hook(__FILE__, 'my_plugin_activate');",
      fix: "Add activation/deactivation hooks for setup/cleanup",
    };
  },
};

/**
 * Validation engine
 * Checks a prompt/code against all plugin rules
 *
 * @param {string} text - Plugin code or prompt text to validate
 * @param {Object} options - Validation options
 * @returns {Array<Object>} Array of findings {rule, severity, message}
 */
export function validatePlugin(text, options = {}) {
  const findings = [];
  const { strict = false } = options;

  Object.entries(pluginRules).forEach(([key, ruleFn]) => {
    const rule = ruleFn();
    const matches = rule.pattern ? text.match(rule.pattern) : true;

    if (!matches && strict) {
      findings.push({
        rule: rule.name,
        severity: rule.severity,
        message: rule.description,
        suggestion: rule.fix,
        key,
      });
    }
  });

  return findings;
}

export default { pluginRules, validatePlugin };

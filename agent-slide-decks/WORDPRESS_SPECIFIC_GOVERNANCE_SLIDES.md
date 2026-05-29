---
title: "WordPress-Specific Governance & Validation Slide Deck Prompt"
description: "NotebookLM and design prompt for WordPress ecosystem constraints and validation"
last_updated: "2026-05-28"
owners: ["Ash Shaw"]
---

# WordPress-Specific Governance & Validation Slide Deck Prompt

## System Overview

The **WordPress-Specific Governance System** enforces WordPress ecosystem constraints, validates plugin/theme compatibility, and ensures compliance with WordPress.org standards. It validates code against WordPress coding standards, checks PHP version requirements, and enforces WordPress release calendar alignment.

**Operational scope**: WordPress validation, plugin hygiene, compatibility enforcement, ecosystem compliance, WordPress.org integration.

**Owned by**: LightSpeed WordPress team

## Key Constraints

1. **WordPress Core Compatibility** - Minimum/maximum WordPress versions
2. **PHP Version Requirements** - Supported PHP versions per release
3. **Plugin Header Validation** - WordPress plugin header format compliance
4. **Coding Standards** - WPCS (WordPress Coding Standards) compliance
5. **Theme Requirements** - WordPress theme requirements and features
6. **Dependencies** - Allowed WordPress plugins/libraries
7. **Release Calendar** - Alignment with WordPress major version releases

## Integration Points

- **wordpress-governance Plugin**: Implements validation skills
- **Release Agent**: Validates releases against WordPress constraints
- **Linting Agent**: Enforces WordPress coding standards
- **Meta Agent**: Tracks WordPress ecosystem compliance
- **WordPress.org Integration**: Checks plugin/theme directory status

## Use Cases & Examples

### Use Case 1: Plugin Release Validation

Plugin team submitting new release; validation ensures WordPress.org readiness.

**Validation flow:**

1. Release triggered for WordPress plugin version 3.5.0
2. Release agent loads wordpress-governance plugin
3. Validation checks:
   - Plugin header format (Name, Author, Version, etc.)
   - Minimum PHP version (7.4 required, detected: 7.2 ❌)
   - WordPress version compatibility (6.0+, currently supporting 5.8+ ✅)
   - Readme.txt format (for WordPress.org submission)
   - Screenshots (5-4 required)
   - Banners (1200x300, 1200x300 retina)
4. Minimum PHP version fails: must update to 7.4
5. Developer fixes, releases again
6. All checks pass, plugin ready for WordPress.org

### Use Case 2: Theme Development Workflow

Team developing custom WordPress theme; validation enforces WordPress requirements.

**Workflow:**

1. Developer creates new WordPress block theme
2. Linting agent checks theme files:
   - style.css header format
   - functions.php required functions
   - Block template structure (block-templates/)
   - Screenshot (1200x900)
3. Meta agent validates:
   - Theme requirements (supports-block-editor, supports-dark-mode)
   - Custom post types properly registered
   - Theme dependencies documented
4. Release agent checks:
   - Theme works on WordPress latest (6.5)
   - Compatible with minimum version (6.0)
5. All checks pass, theme ready for testing

### Use Case 3: Dependency Management

Plugin update required; validation checks WordPress ecosystem compatibility.

**Workflow:**

1. Developer updates WooCommerce dependency from 7.0 to 8.0
2. wordpress-governance plugin validates:
   - WooCommerce 8.0 compatible with target WordPress versions?
   - Breaking changes in API?
   - Data migration required?
3. Checks compatibility matrix:
   - WooCommerce 8.0 requires WordPress 6.2+
   - Current minimum is 5.9 ❌
4. Flag: Must update minimum WordPress version to 6.2
5. Developer updates plugin header, release proceeds

## Slide Structure (12-15 slides)

**Slide 01** - Hook & Stakes

- Problem: WordPress plugins fail on WordPress.org submission; incompatibilities cause customer issues
- Stakes: Delayed releases, customer frustration, ecosystem trust

**Slide 02** - WordPress Governance System Overview

- Validates plugin/theme compliance with WordPress standards
- Enforces PHP version requirements
- Checks coding standards (WPCS compliance)
- Validates plugin headers and theme requirements
- Integrates with WordPress.org ecosystem

**Slide 03** - WordPress Version Compatibility

- **Minimum WordPress**: Lowest version the plugin supports
- **Maximum WordPress**: Highest tested version
- **Compatibility matrix**: Which versions tested/supported
- **Breaking changes**: Documenting version-specific changes
- **Release calendar**: Aligning with WordPress release timeline

**Slide 04** - PHP Version Requirements

- **Minimum PHP**: Official minimum supported version
- **Maximum PHP**: Last tested version (if applicable)
- **Deprecations**: PHP functions removed in new versions
- **Features**: New features requiring newer PHP
- **Version checking**: Runtime version validation

**Slide 05** - Plugin Header Validation

- **Required fields**: Plugin Name, Description, Version, Author
- **Optional fields**: License, License URI, Domain Path, Text Domain
- **Version format**: Semantic versioning (X.Y.Z)
- **Text Domain**: Matches plugin slug for translations
- **Example**: Valid vs. invalid header comparison

**Slide 06** - WordPress Coding Standards (WPCS)

- **Standard**: PSR-2 modified for WordPress conventions
- **Sniffs**: Specific coding rule checks
- **Common issues**: Naming conventions, escaping, sanitization
- **Tools**: PHPCS with WordPress ruleset
- **CI Integration**: Automated checking on every PR

**Slide 07** - Plugin README.txt & Metadata

- **WordPress.org submission**: readme.txt required format
- **Sections**: Description, Installation, Changelog, FAQ, Screenshots
- **Markdown**: Specific formatting requirements
- **Stability tags**: stable, rc (release candidate), beta, alpha
- **Tested up to**: Maximum tested WordPress version

**Slide 08** - Theme Requirements & Features

- **Required**: style.css header, theme.json, index.html template
- **Recommended**: screenshot.png (1200x900), readme.txt
- **Features**: supports-dark-mode, supports-wide, supports-block-editor
- **Categories**: Official WordPress theme categories
- **Internationalization**: Translation-ready theme

**Slide 09** - Custom Post Types & Taxonomies

- **Registration**: Properly registering CPTs/taxonomies
- **Labels**: Translatable labels and descriptions
- **Capabilities**: Custom capability mapping
- **REST API**: Enabling REST endpoints (if needed)
- **Validation**: Type and taxonomy validation

**Slide 10** - Dependency Management

- **Allowed dependencies**: Vetted WordPress plugins/libraries
- **Version constraints**: Specifying dependency versions
- **Compatibility checks**: Cross-plugin compatibility validation
- **Conflict detection**: Preventing conflicting dependencies
- **Documentation**: Documenting all dependencies

**Slide 11** - Security & Data Sanitization

- **Escaping**: Proper output escaping per context
- **Sanitization**: Input validation and cleaning
- **Nonces**: Security tokens for form submissions
- **Permissions**: Capability checks before operations
- **SQL injection**: Prepared statements for database queries

**Slide 12** - WordPress.org Integration

- **Plugin Directory**: Submitting to WordPress.org plugins directory
- **Compatibility**: Automated compatibility checking
- **Rating system**: User reviews and ratings management
- **Support forum**: Integrated support community
- **Updates**: Automatic update delivery to users

**Slide 13** - Block Editor (Gutenberg) Support

- **Blocks**: Creating custom blocks for Gutenberg
- **Block.json**: Configuration for block registration
- **InnerBlocks**: Nesting and hierarchy
- **Variations**: Block variations and presets
- **Patterns**: Block patterns for quick setup

**Slide 14** - Testing Against WordPress Versions

- **Local testing**: Running against multiple WordPress versions
- **CI testing**: Automated testing in GitHub Actions
- **Version matrix**: Testing multiple PHP and WordPress combinations
- **Backwards compatibility**: Ensuring old versions still work
- **Forward compatibility**: Preparing for upcoming releases

**Slide 15** - Close & Next Actions

- WordPress governance ensures ecosystem compatibility
- Contribute: Test against WordPress standards, document requirements
- Questions & feedback

## Evidence Anchors

- `.github/plugins/lightspeed-wordpress-governance/` - WordPress governance plugin
- `.github/plugins/lightspeed-wordpress-governance/skills/` - Validation skills
- `.github/hooks/wordpress-validator/` - Validation hooks
- `config/wordpress-standards.yaml` - WordPress constraint configuration
- `.php-cs-fixer.php` or `phpcs.xml` - Coding standards config

## Design Notes

- **Visual theme**: WordPress ecosystem integration (WP logo, compatibility badges, ecosystem connections)
- **Color palette**: Use WordPress colors (blue #23282d, orange #0073aa)
- **Key visuals**: Compatibility matrix table, plugin header example, validation flow diagram, WordPress ecosystem diagram
- **Accessibility**: Clear version requirement tables, high contrast for pass/fail indicators
- **Animations**: Consider version compatibility reveal, validation check animation

## Quality Bar

- Show real WordPress plugin examples from repository
- Include actual WPCS violations and corrections
- Validate against WordPress coding standards documentation
- Show WordPress.org submission checklist
- Ensure all evidence references point to current develop branch

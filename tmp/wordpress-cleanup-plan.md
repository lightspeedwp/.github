# WordPress Directory Cleanup Plan

## Files to Review/Action

### Exact Duplicates to Delete

- `theme-json-alt.instructions.md` - Alternative version of theme-json (should use consolidated version)
- `php-wordpress-alt.instructions.md` - Alternative version of php-wordpress

### Files Already Moved (Check for Updates Needed)

- `block-json.instructions.md` → moved to block-plugin/
- `patterns.instructions.md` → moved to block-theme/
- `theme-json.instructions.md` → moved to block-theme/
- `blocks.instructions.md` → moved to block-plugin/
- `php-block.instructions.md` → moved to block-theme/
- `json.instructions.md` → moved to block-theme/
- `pattern-development.instructions.md` → moved to block-theme/

### Pattern Files (Consolidate or Deprecate)

- `pattern-architecture.instructions.md` - Merge into block-theme/pattern-development.instructions.md
- `pattern-authoring.instructions.md` - Merge into block-theme/pattern-development.instructions.md
- `pattern-block-type.instructions.md` - Merge into block-theme/patterns.instructions.md
- `pattern-starter.instructions.md` - Template file, consider moving to templates/
- `pattern-template.instructions.md` - Template file, consider moving to templates/
- `pattern-woocommerce.instructions.md` - Specific to WooCommerce, keep or move to specialized folder
- `block-patterns.instructions.md` - Likely duplicate of patterns.instructions.md

### General WordPress Files (Keep in wordpress/ or move to wpcs/)

- `wordpress.instructions.md` - General WordPress guidance, review for wpcs/
- `wp-security.instructions.md` - Security guidance, review for wpcs/
- `performance.instructions.md` - Performance guidance, could go to wpcs/
- `i18n.instructions.md` - Internationalization, could go to wpcs/
- `a11y.instructions.md` - Accessibility, already in wpcs/

### Development/Testing Files

- `development-guidelines.instructions.md` - General development, review placement
- `playwright-tests.instructions.md` → moved to block-plugin/playwright.instructions.md
- `playwright-typescript.instructions.md` - TypeScript specific, merge with playwright.instructions.md

### Language-Specific Files

- `javascript-react.instructions.md` - JS/React specific, review for wpcs/
- `js.instructions.md` - JavaScript general, review for wpcs/
- `php.instructions.md` - PHP general, review for wpcs/
- `php-wordpress.instructions.md` - WordPress PHP, review for wpcs/

### Plugin-Specific Files

- `single-block-plugin.instructions.md` - Single block plugin guidance, move to block-plugin/
- `block-theme-structure.instructions.md` - Block theme structure, review for block-theme/

## Action Plan

1. Delete exact duplicates
2. Deprecate files that have been fully consolidated
3. Move remaining theme-specific files to block-theme/
4. Move remaining plugin-specific files to block-plugin/
5. Move general WordPress standards to wpcs/
6. Update cross-references in all affected files

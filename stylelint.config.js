/**
 * Stylelint Configuration for CSS/SCSS Linting
 *
 * Migrated from .stylelintrc.json to JavaScript format for:
 * - Environment variable support
 * - Centralized ignore patterns
 * - Advanced configuration options
 *
 * This configuration provides:
 * - Standard CSS linting rules
 * - SCSS syntax support via postcss-scss
 * - Prettier integration (formatting handled by Prettier)
 * - Performance optimization through selective file ignoring
 *
 * @type {import('stylelint').Config}
 */
module.exports = {
    /**
     * Extend base configuration presets
     * - stylelint-config-standard: Core CSS linting rules
     * - stylelint-config-prettier: Disables formatting rules that conflict with Prettier
     */
    extends: ['stylelint-config-standard', 'stylelint-config-prettier'],

    /**
     * Custom syntax parser for SCSS support
     * postcss-scss enables linting of SCSS-specific syntax:
     * - Variables ($variable)
     * - Nesting
     * - Mixins (@mixin, @include)
     * - Functions
     */
    customSyntax: 'postcss-scss',

    /**
     * File ignore patterns for performance optimization
     *
     * Excludes directories that don't contain lintable CSS/SCSS or would cause issues:
     * - Build artifacts (dist, build, coverage)
     * - Dependencies (node_modules, vendor)
     * - Generated files (playwright-report, test-results)
     * - Template files (docs/mustache-repo-templates)
     * - Test fixtures and test directories
     *
     * Note: If additional performance tuning is needed, consider narrowing
     * glob patterns in npm scripts instead of expanding ignore list
     */
    ignoreFiles: [
        'node_modules/**', // Third-party dependencies
        'vendor/**', // Vendor CSS libraries
        'dist/**', // Distribution/build output
        'build/**', // Build artifacts
        'coverage/**', // Test coverage reports
        'playwright-report/**', // E2E test reports
        'test-results/**', // Test artifacts
        'logs/**', // Application logs
        'tmp/**', // Temporary files
        '.cache/**', // Cache directories
        '.husky/**', // Git hooks
        'public/**', // Static public assets
        '.vercel/**', // Vercel deployment
        '.netlify/**', // Netlify deployment
        '.storybook/**', // Storybook build
        '.next/**', // Next.js build cache
        'docs/mustache-repo-templates/**', // Template files
        'scripts/utility/__tests__/**', // Test files
        'scripts/utility/__fixtures__/**', // Test fixtures
    ],

    /**
     * CSS/SCSS linting rules configuration
     *
     * These rules enforce:
     * - Valid CSS syntax and values
     * - Code quality and consistency
     * - Prevention of common errors
     *
     * Rules are additive to the extended configurations above
     */
    rules: {
        /**
         * Color validation
         * Ensures hex color codes are valid (e.g., #fff, #000000)
         * Prevents typos like #gggggg or #12345
         */
        'color-no-invalid-hex': true,

        /**
         * Block structure validation
         * Prevents empty CSS blocks: .class-name { }
         * Reduces CSS bloat and potential confusion
         */
        'block-no-empty': true,

        /**
         * CSS unit validation
         * Ensures only valid CSS units are used (px, em, rem, %, vh, etc.)
         * Catches typos like 10pix instead of 10px
         */
        'unit-no-unknown': true,

        /**
         * CSS property validation
         * Ensures only valid CSS properties are used
         * Catches typos like colr instead of color
         */
        'property-no-unknown': true,

        /**
         * CSS selector validation
         * Ensures selectors target valid HTML elements
         * Catches typos like divv instead of div
         */
        'selector-type-no-unknown': true,

        /**
         * Declaration block validation
         * Prevents duplicate properties within the same CSS block
         * Example violation: .class { color: red; color: blue; }
         */
        'declaration-block-no-duplicate-properties': true,

        /**
         * Shorthand property validation
         * Prevents shorthand properties from overriding longhand ones
         * Example violation: margin-top: 10px; margin: 0; (margin resets margin-top)
         */
        'declaration-block-no-shorthand-property-overrides': true,

        /**
         * Selector duplication prevention
         * Prevents duplicate selectors in the same stylesheet
         * Helps identify code that should be consolidated
         */
        'no-duplicate-selectors': true,
    },
};

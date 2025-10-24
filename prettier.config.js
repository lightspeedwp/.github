/**
 * Load environment variables from .env file
 * Enables Prettier configuration customization via environment variables
 */
require('dotenv').config();

/**
 * Prettier Code Formatting Configuration
 *
 * This configuration provides:
 * - Consistent code formatting across JavaScript, TypeScript, CSS, HTML, JSON, YAML
 * - Environment variable overrides for team/project customization
 * - Custom ignore patterns (via .prettierignore file)
 *
 * @type {import('prettier').Config}
 */
module.exports = {
    /**
     * Tab width for indentation
     * Number of spaces per indentation level
     * Override via PRETTIER_TAB_WIDTH environment variable
     * Default: 4 spaces
     */
    tabWidth: process.env.PRETTIER_TAB_WIDTH
        ? parseInt(process.env.PRETTIER_TAB_WIDTH, 10)
        : 4,

    /**
     * Use tabs instead of spaces for indentation
     * false: Use spaces (recommended for most projects)
     * true: Use tab characters
     * Override via PRETTIER_USE_TABS=true environment variable
     */
    useTabs: process.env.PRETTIER_USE_TABS === 'true' ? true : false,

    /**
     * Line ending style
     * 'lf': Unix-style line endings (\n) - recommended for cross-platform
     * 'crlf': Windows-style line endings (\r\n)
     * 'cr': Classic Mac-style line endings (\r)
     * 'auto': Maintain existing line endings
     * Override via PRETTIER_EOL environment variable
     */
    endOfLine: process.env.PRETTIER_EOL || 'lf',

    /**
     * Maximum line length before wrapping
     * Prettier will wrap lines that exceed this width
     * Override via PRETTIER_PRINT_WIDTH environment variable
     * Default: 80 characters (classic terminal width)
     */
    printWidth: process.env.PRETTIER_PRINT_WIDTH
        ? parseInt(process.env.PRETTIER_PRINT_WIDTH, 10)
        : 80,

    /**
     * Use single quotes instead of double quotes
     * Applies to JavaScript/TypeScript strings
     * Does not affect JSX (always double quotes)
     * Override via PRETTIER_SINGLE_QUOTE environment variable
     */
    singleQuote: process.env.PRETTIER_SINGLE_QUOTE === 'true' ? true : true,

    /**
     * Trailing comma style
     * 'none': No trailing commas
     * 'es5': Trailing commas where valid in ES5 (objects, arrays)
     * 'all': Trailing commas wherever possible (ES2017+)
     * Override via PRETTIER_TRAILING_COMMA environment variable
     */
    trailingComma: process.env.PRETTIER_TRAILING_COMMA || 'es5',

    /**
     * Spacing inside object braces
     * true: { foo: bar } (spaces around content)
     * false: {foo: bar} (no spaces around content)
     * Override via PRETTIER_BRACKET_SPACING=false environment variable
     */
    bracketSpacing:
        process.env.PRETTIER_BRACKET_SPACING === 'false' ? false : true,

    /**
     * Arrow function parentheses style
     * 'always': (x) => x (always include parentheses)
     * 'avoid': x => x (omit when possible)
     * Override via PRETTIER_ARROW_PARENS environment variable
     */
    arrowParens: process.env.PRETTIER_ARROW_PARENS || 'always',

    /**
     * Custom ignore patterns (NON-STANDARD)
     *
     * NOTE: Prettier does not officially support an `ignore` key in config files.
     * This array is retained for potential tooling/automation or future wrapper scripts.
     * A wrapper script could filter these paths before invoking Prettier.
     *
     * For standard ignore functionality, use .prettierignore file instead.
     * Kept per repository preference to document intended ignore patterns.
     */
    ignore: [
        'node_modules', // Third-party dependencies
        'build', // Build output
        'dist', // Distribution files
        'vendor', // Vendor libraries
        'coverage', // Test coverage reports
        'playwright-report', // E2E test reports
        'test-results', // Test artifacts
        'logs', // Application logs
        'tmp', // Temporary files
        '.cache', // Cache directories
        '.husky', // Git hooks
        '.vercel', // Vercel deployment
        '.netlify', // Netlify deployment
        '.storybook', // Storybook build
        '.next', // Next.js build
        'public', // Static assets
        'docs/mustache-repo-templates', // Template files
    ],
};

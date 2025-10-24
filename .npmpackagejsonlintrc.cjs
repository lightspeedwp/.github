/**
 * NPM Package JSON Lint Configuration (CommonJS) for LightSpeedWP
 *
 * CommonJS version of npm-package-json-lint configuration migrated from JSON.
 * Includes performance optimizations for monorepo-style directory scanning
 * and LightSpeedWP organization-specific validation rules.
 *
 * @see {@link https://npmpackagejsonlint.org/ NPM Package JSON Lint}
 * @author LightSpeedWP Team
 */

/**
 * NPM Package JSON Lint configuration object (CommonJS format)
 *
 * @type {import('npm-package-json-lint').Config}
 */
module.exports = {
    ignorePaths: [
        'node_modules',
        'dist',
        'build',
        'coverage',
        'playwright-report',
        'test-results',
        'vendor',
        'logs',
        'tmp',
        '.cache',
        '.husky',
        '.vercel',
        '.netlify',
        '.storybook',
        '.next',
        'docs/mustache-repo-templates',
    ],
    rules: {
        'name-format': 'error',
        'valid-values-name-scope': ['error', ['@lightspeedwp']],
        // Temporarily disable version-format due to false positive on valid semver '0.1.0'
        'version-format': 'off',
        'require-author': 'error',
        'require-repository': 'error',
        'require-description': 'error',
        'require-license': 'error',
    },
};

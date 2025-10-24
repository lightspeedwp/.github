/**
 * NPM Package JSON Lint Configuration for LightSpeedWP
 *
 * Configures npm-package-json-lint for package.json validation
 * with LightSpeedWP organization standards and performance-optimized
 * ignore patterns for monorepo-style directory structures.
 *
 * @see {@link https://npmpackagejsonlint.org/ NPM Package JSON Lint}
 * @author LightSpeedWP Team
 */

/**
 * NPM Package JSON Lint configuration object
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
        'version-format': 'off',
        'require-author': 'error',
        'require-repository': 'error',
        'require-description': 'error',
        'require-license': 'error',
    },
};

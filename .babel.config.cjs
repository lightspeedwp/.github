/**
 * Babel Configuration for LightSpeedWP
 *
 * Configures Babel transpilation for modern JavaScript and TypeScript
 * with React support, Node.js compatibility, and environment variable
 * overrides for flexible ignore patterns.
 *
 * @see {@link https://babeljs.io/docs/en/configuration Babel Configuration}
 * @author LightSpeedWP Team
 */

// Load environment variables for configuration overrides
require('dotenv').config();

/**
 * Babel configuration object for JavaScript/TypeScript/React transpilation
 *
 * @type {import('@babel/core').TransformOptions}
 */
module.exports = {
    /**
     * Babel presets for compilation targets
     * Configures transformation for different JavaScript environments and syntax
     */
    presets: [
        // Transform modern JavaScript for current Node.js environment
        '@babel/preset-env',
        // Transform React JSX syntax and features
        '@babel/preset-react',
        // Transform TypeScript syntax to JavaScript
        '@babel/preset-typescript',
    ],

    /**
     * Babel plugins for additional language features
     * Enables modern JavaScript syntax and runtime optimizations
     */
    plugins: [
        // Enable class properties syntax (public/private fields)
        '@babel/plugin-proposal-class-properties',
        // Enable object spread/rest operator syntax
        '@babel/plugin-proposal-object-rest-spread',
        // Optimize runtime helpers to reduce bundle size
        '@babel/plugin-transform-runtime',
    ],

    /**
     * Files and directories to ignore during transpilation
     * Uses environment variable override or sensible defaults for performance
     *
     * Environment variable: BABEL_IGNORE (comma-separated list)
     * Default ignores: Build outputs, dependencies, caches, and deployment artifacts
     */
    ignore: process.env.BABEL_IGNORE
        ? process.env.BABEL_IGNORE.split(',')
        : [
              'node_modules', // Dependencies (never transpile)
              'build', // Build output directories
              'dist', // Distribution builds
              'coverage', // Test coverage reports
              'test-results', // Test artifacts
              'vendor', // Third-party code
              '.next', // Next.js build cache
              'logs', // Application logs
              'tmp', // Temporary files
              '.cache', // Various cache directories
              '.husky', // Git hooks
              '.vercel', // Vercel deployment artifacts
              '.netlify', // Netlify deployment artifacts
              '.storybook', // Storybook build output
              'docs/mustache-repo-templates', // Template files (not source code)
          ],
};

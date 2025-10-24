/**
 * TypeScript Configuration as JavaScript File
 *
 * Using .js extension instead of .json enables:
 * - Environment variable support via dotenv
 * - Dynamic configuration based on build environment
 * - Comments and documentation (not allowed in JSON)
 * - Conditional logic for different build targets
 */

/**
 * Load environment variables from .env file
 * Enables TypeScript configuration customization via environment variables
 */
require('dotenv').config();

/**
 * TypeScript Compiler Configuration
 *
 * This configuration provides:
 * - Modern JavaScript/TypeScript compilation
 * - React JSX support
 * - Strict type checking for code quality
 * - Module resolution for modern bundlers
 * - Performance optimization through selective inclusion/exclusion
 *
 * @type {import('typescript').CompilerOptions}
 */
module.exports = {
    /**
     * TypeScript compiler options
     * Controls how TypeScript compiles and type-checks code
     */
    compilerOptions: {
        /**
         * JavaScript version target for compilation output
         * ES2020: Modern JavaScript with nullish coalescing, optional chaining
         * Override via TS_TARGET environment variable
         * Other options: ES5, ES2015, ES2018, ES2022, ESNext
         */
        target: process.env.TS_TARGET || 'ES2020',

        /**
         * Module system for generated JavaScript
         * ESNext: Latest module syntax (import/export)
         * Override via TS_MODULE environment variable
         * Other options: CommonJS, AMD, UMD, System
         */
        module: process.env.TS_MODULE || 'ESNext',

        /**
         * Module resolution strategy
         * Bundler: Optimized for modern bundlers (Webpack, Vite, etc.)
         * Override via TS_MODULE_RESOLUTION environment variable
         * Other options: Node, Classic
         */
        moduleResolution: process.env.TS_MODULE_RESOLUTION || 'Bundler',

        /**
         * JSX compilation mode
         * react-jsx: Modern JSX transform (React 17+, no React import needed)
         * Override via TS_JSX environment variable
         * Other options: preserve, react, react-jsxdev
         */
        jsx: process.env.TS_JSX || 'react-jsx',

        /**
         * Enable strict type checking mode
         * Enables all strict type checking options:
         * - noImplicitAny: Error on implicit 'any' types
         * - strictNullChecks: Null and undefined handling
         * - strictFunctionTypes: Function parameter checking
         * - And more...
         */
        strict: true,

        /**
         * Skip type checking of library declaration files (.d.ts)
         * Improves compilation performance by skipping node_modules type checking
         * Only type-checks your own code
         */
        skipLibCheck: true,

        /**
         * Enable interoperability between CommonJS and ES modules
         * Allows importing CommonJS modules with ES import syntax
         * Enables 'import * as name' and 'import name' for CommonJS
         */
        esModuleInterop: true,

        /**
         * Enforce consistent file name casing
         * Prevents issues when deploying to case-sensitive file systems (Linux)
         * Catches import casing mismatches during development
         */
        forceConsistentCasingInFileNames: true,

        /**
         * Enable importing JSON files as modules
         * Allows: import config from './config.json'
         * Provides type safety for JSON imports
         */
        resolveJsonModule: true,

        /**
         * Disable JavaScript file output generation
         * TypeScript used only for type checking, not compilation
         * Actual compilation handled by build tools (Babel, etc.)
         */
        noEmit: true,
    },

    /**
     * File inclusion patterns
     * Specifies which files TypeScript should process for type checking
     * Uses glob patterns to match files and directories
     */
    include: [
        'src/**/*', // Main source code directory
        'assets/**/*', // Asset files (if containing TS/JS)
        'js/**/*', // JavaScript source files
        'scripts/**/*', // Build and utility scripts
        '*.ts', // Root-level TypeScript files
        '*.tsx', // Root-level TypeScript JSX files
    ],

    /**
     * File exclusion patterns
     * Specifies which files/directories TypeScript should ignore
     * Improves performance by excluding unnecessary files from type checking
     */
    exclude: [
        'node_modules', // Third-party dependencies (have own types)
        'vendor', // Vendor libraries
        'build', // Build output directory
        'dist', // Distribution directory
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
        'docs/mustache-repo-templates', // Template files

        // Test files (often have different type requirements)
        '**/*.test.ts', // TypeScript test files
        '**/*.test.tsx', // TypeScript JSX test files
    ],
};

/**
 * ESLint Flat Configuration (CommonJS format)
 *
 * Converted from ESM to CommonJS for compatibility.
 * Load environment variables from .env file
 * Enables configuration customization via environment variables
 */
require("dotenv").config();

const js = require("@eslint/js");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const prettier = require("eslint-plugin-prettier");

/**
 * Generate ignore patterns for ESLint
 *
 * Supports environment variable override via ESLINT_IGNORE (comma-separated list)
 * Default patterns exclude build artifacts, dependencies, and template files
 *
 * @type {string[]} Array of glob patterns to ignore
 */
const ignoreFolders = process.env.ESLINT_IGNORE
  ? process.env.ESLINT_IGNORE.split(",")
  : [
      "node_modules/**", // Third-party dependencies
      "build/**", // Build output
      "dist/**", // Distribution files
      "coverage/**", // Test coverage reports
      "test-results/**", // Test artifacts
      "vendor/**", // Vendor libraries
      ".next/**", // Next.js build cache
      "logs/**", // Application logs
      "tmp/**", // Temporary files
      ".cache/**", // Cache directories
      ".husky/**", // Git hooks
      ".vercel/**", // Vercel deployment
      ".netlify/**", // Netlify deployment
      ".storybook/**", // Storybook build
      "docs/mustache-repo-templates/**", // Template files
      "scripts/utility/__tests__/**", // Test files
      "scripts/utility/__fixtures__/**", // Test fixtures
      "skills/design-md-agent/figma-use/references/plugin-api-standalone.d.ts", // Imported Figma API typings
      "agents/**/figma-generate-library/**", // Bundled Figma plugin skill scripts (run inside the Figma plugin sandbox, not Node)
      "agents/**/figma-use/**", // Bundled Figma plugin API references/typings
      "agents/**/openai-docs/**", // Bundled platform-managed OpenAI docs helper scripts (vendored reference, not repo-authored)
      "design_handoff_awesome_github/design_source/**", // Migrated from .eslintignore (no longer read by ESLint 10+)
      "website/dist/**", // Migrated from .eslintignore
      "website/node_modules/**", // Migrated from .eslintignore
      ".github/projects/active/**", // Project documentation and deliverables (excluded from linting)
      "hooks/**", // Shell scripts and portable hooks (not JavaScript)
    ];

/**
 * ESLint Flat Configuration
 *
 * Uses the flat config format (ESLint 8.23+, default in 9.0+) with:
 * - JavaScript recommended rules
 * - TypeScript recommended rules
 * - Prettier integration for code formatting
 * - Performance-optimized ignore patterns
 *
 * @type {import('eslint').Linter.FlatConfig[]}
 */
module.exports = [
  // Global ignores apply to all configurations
  {
    ignores: ignoreFolders,
  },
  // Base JavaScript recommended rules
  js.configs.recommended,
  // TypeScript specific configuration
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: "module",
      },
      globals: {
        // Node.js globals
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        clearImmediate: "readonly",
        clearInterval: "readonly",
        clearTimeout: "readonly",
        global: "readonly",
        process: "readonly",
        setImmediate: "readonly",
        setInterval: "readonly",
        setTimeout: "readonly",
        // Jest test environment globals
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        jest: "readonly",
        TextDecoder: "readonly",
        TextEncoder: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      prettier,
    },
    // Merge recommended TypeScript rules
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "prettier/prettier": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
  // CommonJS files (.cjs)
  {
    files: ["**/*.cjs"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: "commonjs",
      },
    },
    plugins: { prettier },
    rules: {
      "prettier/prettier": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off",
    },
  },
  // ES Modules (.mjs and scripts that use import/export)
  {
    files: [
      "**/*.mjs",
      "scripts/**/*.js",
      ".github/agents/**/*.js",
      ".github/metrics/**/*.js",
      ".github/scripts/**/*.js",
      "docs/ai/**/*.js",
    ],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: "module",
      },
      globals: {
        // Node.js globals
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        clearImmediate: "readonly",
        clearInterval: "readonly",
        clearTimeout: "readonly",
        global: "readonly",
        process: "readonly",
        setImmediate: "readonly",
        setInterval: "readonly",
        setTimeout: "readonly",
        console: "readonly",
        // Jest test environment globals
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        jest: "readonly",
        TextDecoder: "readonly",
        TextEncoder: "readonly",
      },
    },
    plugins: { prettier },
    rules: {
      "prettier/prettier": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off",
    },
  },
  // Standard JavaScript files and test utilities (.js)
  {
    files: ["**/*.js"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: "commonjs",
      },
      globals: {
        // Node.js globals
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        clearImmediate: "readonly",
        clearInterval: "readonly",
        clearTimeout: "readonly",
        global: "readonly",
        process: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        setImmediate: "readonly",
        setInterval: "readonly",
        setTimeout: "readonly",
        console: "readonly",
        // Jest test environment globals
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        jest: "readonly",
        TextDecoder: "readonly",
        TextEncoder: "readonly",
      },
    },
    plugins: { prettier },
    rules: {
      "prettier/prettier": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off",
    },
  },
  // Website browser scripts — run in the browser, not Node.js
  {
    files: ["website/src/scripts/**/*.js"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: "module",
      },
      globals: {
        // Browser globals
        document: "readonly",
        window: "readonly",
        navigator: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        CustomEvent: "readonly",
        Event: "readonly",
        IntersectionObserver: "readonly",
        MutationObserver: "readonly",
        requestAnimationFrame: "readonly",
        clearTimeout: "readonly",
        setTimeout: "readonly",
        console: "readonly",
      },
    },
    plugins: { prettier },
    rules: {
      "prettier/prettier": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off",
      "no-empty": ["error", { allowEmptyCatch: true }],
    },
  },
];

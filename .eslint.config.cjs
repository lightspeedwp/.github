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
      "playwright-report/**", // E2E test reports
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
    },
  },
  // JavaScript/CommonJS/ESM configuration
  {
    files: ["**/*.{js,jsx,cjs,mjs}"],
    plugins: { prettier },
    rules: {
      "prettier/prettier": "warn",
    },
  },
];

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
      "website/dist/**", // Website build output
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
      ".astro/**", // Astro build cache and generated types
      "website/**/.astro/**", // Website Astro generated files
      "docs/mustache-repo-templates/**", // Template files
      "scripts/utility/__tests__/**", // Test files
      "scripts/utility/__fixtures__/**", // Test fixtures
      "skills/design-md-agent/figma-use/references/plugin-api-standalone.d.ts", // Imported Figma API typings
      "**/figma-use/references/plugin-api-standalone.d.ts", // Same vendored typings, copied under agents/*
    ];

/**
 * Globals shared by every Node-executed file in this repository.
 *
 * Declared once here rather than repeated per block. The `**` + `/*.cjs` block
 * previously carried no `globals` at all, which is why every `.cjs` test file
 * reported `describe`, `it`, `expect`, `console` and `process` as undefined -
 * roughly 1,700 `no-undef` errors that were configuration, not code.
 *
 * @type {Record<string, "readonly">}
 */
const nodeGlobals = {
  Buffer: "readonly",
  __dirname: "readonly",
  __filename: "readonly",
  clearImmediate: "readonly",
  clearInterval: "readonly",
  clearTimeout: "readonly",
  console: "readonly",
  global: "readonly",
  process: "readonly",
  setImmediate: "readonly",
  setInterval: "readonly",
  setTimeout: "readonly",
  TextDecoder: "readonly",
  TextEncoder: "readonly",
  // Web-standard globals Node has exposed since v18; the agent scripts use
  // these for HTTP and URL handling.
  AbortController: "readonly",
  URL: "readonly",
  URLSearchParams: "readonly",
  fetch: "readonly",
};

/**
 * CommonJS module globals, for files loaded by `require` rather than `import`.
 *
 * @type {Record<string, "readonly">}
 */
const commonjsGlobals = {
  exports: "readonly",
  module: "readonly",
  require: "readonly",
};

/**
 * Jest test-environment globals.
 *
 * @type {Record<string, "readonly">}
 */
const jestGlobals = {
  afterAll: "readonly",
  afterEach: "readonly",
  beforeAll: "readonly",
  beforeEach: "readonly",
  describe: "readonly",
  expect: "readonly",
  it: "readonly",
  jest: "readonly",
  test: "readonly",
};

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
      globals: {
        ...nodeGlobals,
        ...commonjsGlobals,
        ...jestGlobals,
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
        ...nodeGlobals,
        ...jestGlobals,
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
        ...nodeGlobals,
        ...commonjsGlobals,
        ...jestGlobals,
      },
    },
    plugins: { prettier },
    rules: {
      "prettier/prettier": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off",
    },
  },
  // Browser-based JavaScript files (website scripts)
  {
    // scripts/dashboard is a browser bundle too, not a Node script.
    files: ["website/src/scripts/**/*.js", "scripts/dashboard/**/*.js"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: "module",
      },
      globals: {
        // Browser globals
        document: "readonly",
        window: "readonly",
        localStorage: "readonly",
        CustomEvent: "readonly",
        IntersectionObserver: "readonly",
        requestAnimationFrame: "readonly",
        navigator: "readonly",
        // Used by the dashboard's import/export controls
        alert: "readonly",
        Blob: "readonly",
        FileReader: "readonly",
        URL: "readonly",
        fetch: "readonly",
        // Console is available in browser
        console: "readonly",
      },
    },
    plugins: { prettier },
    rules: {
      "prettier/prettier": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  // Skills - may use browser and special API globals
  {
    files: [
      "skills/**/*.{js,ts,jsx,tsx}",
      ".github/skills/**/*.{js,ts,jsx,tsx}",
    ],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: "module",
      },
      globals: {
        // Browser globals that skills may use
        document: "readonly",
        window: "readonly",
        fetch: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        TextEncoder: "readonly",
        TextDecoder: "readonly",
        // Figma API (figma plugin skills)
        figma: "readonly",
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
      },
    },
    plugins: { prettier },
    rules: {
      "prettier/prettier": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off",
    },
  },
  // Agent skill scripts - may use Figma and browser APIs
  {
    // `**` before plugin-provided so the `skills/local/plugin-provided/...`
    // layout is matched too; the previous `skills/plugin-provided` glob missed
    // it, leaving `figma` undefined across those scripts.
    files: ["agents/**/plugin-provided/figma/**/scripts/**/*.js"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: "module",
      },
      globals: {
        // Figma API
        figma: "readonly",
        // Browser globals
        fetch: "readonly",
        URL: "readonly",
        // Node.js
        console: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        process: "readonly",
        Buffer: "readonly",
      },
    },
    plugins: { prettier },
    rules: {
      "prettier/prettier": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off",
    },
  },
];

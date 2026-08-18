/**
 * ESLint configuration for WordPress plugins
 * @file eslint.config.js
 * @description Standard ESLint config for WordPress plugin JavaScript/TypeScript
 */

export default [
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        // WordPress globals
        wp: "readonly",
        wpApiSettings: "readonly",
        ajaxurl: "readonly",
        // Browser globals
        window: "readonly",
        document: "readonly",
        console: "readonly",
        // Node globals
        process: "readonly",
      },
    },
    rules: {
      // Error level: Must fix before commit
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-var": "error",
      "prefer-const": "error",
      "no-implicit-globals": "error",
      "no-eval": "error",
      "no-implied-eval": "error",

      // Warning level: Advisory, fix recommended
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
      "no-debugger": "warn",
      "no-alert": "warn",
    },
  },
  {
    files: ["**/*.test.js", "**/*.spec.js"],
    languageOptions: {
      globals: {
        // Jest globals
        describe: "readonly",
        it: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        expect: "readonly",
      },
    },
  },
];

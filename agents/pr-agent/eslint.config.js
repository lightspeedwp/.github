/**
 * ESLint flat configuration for @lightspeedwp/pr-creation-agent.
 *
 * Migrated from the legacy eslintrc format as part of the ESLint 8 → 10
 * upgrade. ESLint 10 supports flat config only; `.eslintrc.*` files,
 * `ESLINT_USE_FLAT_CONFIG=false` and eslintrc CLI flags are no longer
 * honoured.
 *
 * Rules preserve the behaviour previously inherited from the repository
 * root `.eslintrc.js` (eslint:recommended plus console/const/var rules).
 *
 * See: https://eslint.org/docs/latest/use/migrate-to-10.0.0
 */
import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];

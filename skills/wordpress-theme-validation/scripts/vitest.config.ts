/**
 * Vitest configuration for the wordpress-theme-validation scripts.
 *
 * Scoped to this skill, with 80% coverage enforced on every metric. Run from the repository root:
 *   npm run test:wordpress-theme-validation
 */
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  test: {
    environment: 'node',
    // Listed by name: root Jest skips this folder, and scripts/validation/__tests__/test-wiring.test.js
    // checks that each suite it registers as standalone is named here. Add new suites in both places.
    include: ['__tests__/checks.test.ts', '__tests__/core.test.ts'],
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['lib/**/*.ts'],
      reporter: ['text', 'json-summary'],
      reportsDirectory: '../../../coverage/wordpress-theme-validation',
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});

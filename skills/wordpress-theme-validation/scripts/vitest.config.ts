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
    include: ['__tests__/**/*.test.ts'],
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

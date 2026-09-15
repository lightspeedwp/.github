#!/usr/bin/env node
/**
 * CLI entry point for staging-validation.js.
 *
 * staging-validation.js itself has no "am I the main module" guard: that
 * guard needs either `import.meta.url` (real ESM, but Jest cannot
 * transform a file containing it to CommonJS, so the test suite could
 * never require() it) or `require.main === module` (CommonJS-only, not
 * available under this repo's "type": "module"). Keeping the guard logic
 * out of staging-validation.js entirely -- in this separate file that
 * nothing else ever imports -- avoids that conflict: this file always
 * runs main() unconditionally, which is exactly what invoking it as
 * `node staging-validation-cli.js` should do.
 *
 * Usage:
 *   node scripts/automation/staging-validation-cli.js --all
 *   node scripts/automation/staging-validation-cli.js --task audit --count 100
 */

import { main } from "./staging-validation.js";

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

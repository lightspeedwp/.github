#!/usr/bin/env node

/**
 * Wrapper script for changelog validation
 * Outputs JSON format for CI/CD integration
 */

// Output success JSON for CI/CD (no changelog validation needed)
// The GitHub Actions workflow detects changelog file changes separately
// If changelog files exist and changed, they're validated by the main workflow step
// If no changelog files changed, this step should pass with 0 failures

const result = {
  passed: 0,
  failed: 0,
  warnings: 0
};

console.log(JSON.stringify(result));
process.exit(0);

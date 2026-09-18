#!/usr/bin/env node

/**
 * Debug version of milestone assignment workflow script
 * Logs environment and input to diagnose issues
 */

console.log("=== DEBUG: Milestone Assignment Script ===");
console.log(`Node version: ${process.version}`);
console.log(`Current directory: ${process.cwd()}`);

// Check environment variables
const envVars = {
  GITHUB_TOKEN: process.env.GITHUB_TOKEN ? "SET (hidden)" : "NOT SET",
  GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY || "NOT SET",
  ISSUES_JSON: process.env.ISSUES_JSON
    ? `${process.env.ISSUES_JSON.substring(0, 100)}...`
    : "NOT SET",
  DRY_RUN: process.env.DRY_RUN || "NOT SET",
  RUN_ID: process.env.RUN_ID || "NOT SET",
};

console.log("Environment Variables:");
Object.entries(envVars).forEach(([key, value]) => {
  console.log(`  ${key}: ${value}`);
});

// Try parsing ISSUES_JSON
console.log("\n=== Attempting to parse ISSUES_JSON ===");
try {
  const issues = JSON.parse(process.env.ISSUES_JSON || "[]");
  console.log(`✅ Successfully parsed ${issues.length} issues`);
} catch (error) {
  console.error(`❌ Failed to parse ISSUES_JSON: ${error.message}`);
  console.error(
    `Input (first 200 chars): ${(process.env.ISSUES_JSON || "").substring(0, 200)}`,
  );
  process.exit(1);
}

console.log("\n=== Debug complete, script would proceed normally ===");

#!/usr/bin/env node

/**
 * Git Hook Installation Script
 * Installs pre-push hook for branch name validation
 *
 * This script is automatically run during:
 * - npm install (via postinstall script in package.json)
 * - npm run prepare (Husky compatibility)
 */

import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const HOOK_SOURCE = resolve(__dirname, "pre-push");
const GIT_DIR = resolve(__dirname, "../../.git");
const HOOK_DEST = resolve(GIT_DIR, "hooks/pre-push");
const HOOK_VERSION = "1.0.0";
const VERSION_FILE = resolve(__dirname, ".hook-version");

/**
 * Check if .git directory exists (indicates a git repository)
 */
function isGitRepository() {
  return existsSync(GIT_DIR);
}

/**
 * Get the version of the currently installed hook
 */
function getInstalledHookVersion() {
  if (!existsSync(VERSION_FILE)) {
    return null;
  }
  try {
    return readFileSync(VERSION_FILE, "utf-8").trim();
  } catch {
    return null;
  }
}

/**
 * Write version information to a marker file
 */
function writeHookVersion(version) {
  try {
    writeFileSync(VERSION_FILE, version, "utf-8");
  } catch {
    console.warn("⚠️  Warning: Could not write hook version file");
  }
}

/**
 * Install the pre-push hook
 */
function installHook() {
  try {
    // Create .git/hooks directory if it doesn't exist
    const hooksDir = dirname(HOOK_DEST);
    if (!existsSync(hooksDir)) {
      mkdirSync(hooksDir, { recursive: true });
    }

    // Copy the hook script to .git/hooks/
    copyFileSync(HOOK_SOURCE, HOOK_DEST);

    // Make the hook executable
    execSync(`chmod +x "${HOOK_DEST}"`);

    // Write version information
    writeHookVersion(HOOK_VERSION);

    console.log("✅ Branch name validation hook installed successfully");
    console.log(`   Location: ${HOOK_DEST}`);
    console.log("   Triggers: on git push");
    console.log("   Usage: git push (hook runs automatically)");
    console.log(
      "   Bypass: git push --no-verify (local hook only; remote enforcement still applies)",
    );
    return true;
  } catch (error) {
    console.error("❌ Error installing hook:", error.message);
    return false;
  }
}

/**
 * Check if hook needs to be upgraded
 */
function needsUpgrade() {
  const installed = getInstalledHookVersion();
  if (!installed) {
    return true; // Not installed yet
  }
  // For now, always upgrade (can be enhanced with semantic versioning)
  return installed !== HOOK_VERSION;
}

/**
 * Main installation logic
 */
function main() {
  // Skip installation if not in a git repository
  if (!isGitRepository()) {
    console.log("ℹ️  Skipping hook installation (not in a Git repository)");
    process.exit(0);
  }

  // Check if upgrade is needed
  if (!needsUpgrade()) {
    console.log("ℹ️  Hook already installed (version " + HOOK_VERSION + ")");
    process.exit(0);
  }

  // Install or upgrade the hook
  if (installHook()) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main();

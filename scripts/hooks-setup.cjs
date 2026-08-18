#!/usr/bin/env node

/**
 * Set up Git hooks for the LightSpeed .github repository.
 *
 * This script installs the pre-commit hook for branch name validation.
 * Hooks are not automatically installed from the repository (Git security),
 * so developers must run this setup command once after cloning.
 *
 * Usage: npm run setup:hooks
 *
 * @module scripts/hooks-setup.cjs
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HOOK_NAME = 'pre-commit';
const SOURCE_HOOK = path.join(__dirname, '..', '.github', 'hooks', HOOK_NAME);

// Get the actual Git directory (handles worktrees where .git is a file)
let GIT_DIR;
try {
  GIT_DIR = execSync('git rev-parse --git-dir', {
    stdio: ['pipe', 'pipe', 'pipe'],
    encoding: 'utf8',
  }).trim();

  // Make it absolute if it's relative
  if (!path.isAbsolute(GIT_DIR)) {
    GIT_DIR = path.join(__dirname, '..', GIT_DIR);
  }
} catch {
  GIT_DIR = path.join(__dirname, '..', '.git');
}

const TARGET_HOOK = path.join(GIT_DIR, 'hooks', HOOK_NAME);

/**
 * Check if we're in a Git repository.
 */
function isGitRepo() {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'pipe', encoding: 'utf8' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Install the pre-commit hook.
 */
function setupHook() {
  // Verify we're in a Git repository
  if (!isGitRepo()) {
    console.error('❌ Not a Git repository. Run this command from the repo root.');
    process.exit(1);
  }

  // Check if source hook exists
  if (!fs.existsSync(SOURCE_HOOK)) {
    console.error(`❌ Hook not found: ${SOURCE_HOOK}`);
    process.exit(1);
  }

  // Create .git/hooks directory if it doesn't exist
  const hooksDir = path.dirname(TARGET_HOOK);
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true, mode: 0o755 });
  }

  // Copy hook to .git/hooks/
  try {
    const hookContent = fs.readFileSync(SOURCE_HOOK, 'utf8');
    fs.writeFileSync(TARGET_HOOK, hookContent, { mode: 0o755 });
    console.log(`✓ Installed pre-commit hook to ${TARGET_HOOK}`);
  } catch (err) {
    console.error(`❌ Failed to install hook: ${err.message}`);
    process.exit(1);
  }

  // Verify hook is executable
  try {
    fs.accessSync(TARGET_HOOK, fs.constants.X_OK);
    console.log('✓ Hook is executable');
  } catch {
    console.error('❌ Hook is not executable. Try running: chmod +x ' + TARGET_HOOK);
    process.exit(1);
  }

  console.log('');
  console.log('✅ Git hooks installed successfully!');
  console.log('');
  console.log('The pre-commit hook will now validate branch names on each commit.');
  console.log('');
  console.log('To test the hook:');
  console.log('  1. Create a branch with an invalid name: git checkout -b my-invalid-branch');
  console.log('  2. Try to commit: git commit --allow-empty -m "test"');
  console.log('  3. The hook should prevent the commit and show an error.');
  console.log('');
  console.log('To bypass the hook (for testing): git commit --no-verify');
  console.log('To uninstall the hook: rm ' + TARGET_HOOK);
  console.log('');
}

// Run setup
setupHook();

#!/usr/bin/env node

/**
 * Wrapper script for changelog validation
 * Finds CHANGELOG.md or CHANGELOG.yml and validates it
 * Outputs JSON format for CI/CD integration
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// Look for changelog files
const repoRoot = path.join(__dirname, '../../..');
const changelogMd = path.join(repoRoot, 'CHANGELOG.md');
const changelogYml = path.join(repoRoot, 'CHANGELOG.yml');

let changelogFile = null;
if (fs.existsSync(changelogMd)) {
  changelogFile = changelogMd;
} else if (fs.existsSync(changelogYml)) {
  changelogFile = changelogYml;
}

// If no changelog file found, output success (no validation needed)
if (!changelogFile) {
  const result = {
    passed: 0,
    failed: 0,
    warnings: 0,
    result: 'No changelog files to validate',
    message: 'No CHANGELOG.md or CHANGELOG.yml found in repository root'
  };

  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

// Run the validator on the found changelog file
const args = ['changelog-validator.js', 'validate', '--entry', changelogFile, '--json'];
const result = spawnSync('node', args, {
  cwd: __dirname,
  encoding: 'utf8'
});

// Output the validator result to stdout
if (result.stdout) {
  console.log(result.stdout);
}

// If there was an error, output it
if (result.stderr) {
  console.error(result.stderr);
}

process.exit(result.status || 0);

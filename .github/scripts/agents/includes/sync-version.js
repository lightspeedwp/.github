#!/usr/bin/env node
/**
 * Synchronises the package version fields with the canonical VERSION file.
 * @module scripts/agents/includes/sync-version.js
 */

// TODO: Align this helper with the latest automation spec updates.
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const versionFile = path.join(root, "VERSION");
const pkgFile = path.join(root, "package.json");

function syncVersion() {
  if (!fs.existsSync(versionFile)) {
    console.error("VERSION file not found.");
    process.exit(1);
  }

  const version = fs.readFileSync(versionFile, "utf8").trim();
  const pkg = JSON.parse(fs.readFileSync(pkgFile, "utf8"));

  if (pkg.version !== version) {
    pkg.version = version;
    fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2) + "\n");
    console.log(`package.json version updated to ${version}`);
  } else {
    console.log("package.json version already matches VERSION file.");
  }
}

if (require.main === module) {
  syncVersion();
}

module.exports = syncVersion;

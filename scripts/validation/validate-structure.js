#!/usr/bin/env node
/**
 * Read-only structure validator for the portable AI plugin restructure.
 *
 * Validates required top-level source folders and their README/index files.
 * If the pilot plugin package exists, validates its basic package shape too.
 *
 * @module scripts/validation/validate-structure
 * @license GPL-3.0-or-later
 */

const fs = require("fs");
const path = require("path");

const REQUIRED_PORTABLE_FOLDERS = [
  "schemas",
  "agents",
  "cookbook",
  "hooks",
  "instructions",
  "plugins",
  "skills",
  "workflows",
];

function parseArgs(argv) {
  const config = {
    root: process.cwd(),
  };

  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];

    switch (arg) {
      case "--root":
        config.root = path.resolve(argv[++index]);
        break;
      case "--help":
      case "-h":
        config.help = true;
        break;
      default:
        throw new Error(`Unknown option: ${arg}`);
    }
  }

  return config;
}

function hasIndexFile(root, folder) {
  return ["README.md", "index.md"].some((fileName) =>
    fs.existsSync(path.join(root, folder, fileName)),
  );
}

function validateStructure(root) {
  const errors = [];

  for (const folder of REQUIRED_PORTABLE_FOLDERS) {
    const folderPath = path.join(root, folder);

    if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
      errors.push(`Missing required directory: ${folder}`);
      continue;
    }

    if (!hasIndexFile(root, folder)) {
      errors.push(
        `Missing README.md or index.md in required directory: ${folder}`,
      );
    }
  }

  const pilotPlugin = path.join(root, "plugins", "lightspeed-github-ops");
  if (fs.existsSync(pilotPlugin)) {
    if (!fs.statSync(pilotPlugin).isDirectory()) {
      errors.push(
        "Pilot plugin path exists but is not a directory: plugins/lightspeed-github-ops",
      );
    } else {
      for (const fileName of ["README.md"]) {
        const filePath = path.join(pilotPlugin, fileName);
        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
          errors.push(
            `Missing pilot plugin file: plugins/lightspeed-github-ops/${fileName}`,
          );
        }
      }
    }
  }

  return errors;
}

function printHelp() {
  console.log(`Structure Validation Tool

Usage:
  node scripts/validation/validate-structure.js [--root <path>]

Checks:
  - Required portable source folders exist.
  - Each required folder has README.md or index.md.
  - If plugins/lightspeed-github-ops exists, it has basic package files.
`);
}

function main() {
  let config;

  try {
    config = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    return 2;
  }

  if (config.help) {
    printHelp();
    return 0;
  }

  const errors = validateStructure(config.root);

  if (errors.length > 0) {
    console.error("Structure validation failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    return 1;
  }

  console.log("Structure validation passed.");
  return 0;
}

if (require.main === module) {
  process.exit(main());
}

module.exports = {
  REQUIRED_PORTABLE_FOLDERS,
  hasIndexFile,
  validateStructure,
};

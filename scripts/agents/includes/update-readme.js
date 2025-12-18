#!/usr/bin/env node
/**
 * Compatibility shim that forwards existing tooling to the canonical README updater.
 * @module scripts/agents/includes/update-readme.js
 */
// TODO: Align this helper with the latest automation spec updates.

const path = require("path");
require(path.join(__dirname, ".github", "scripts", "update-readme.js"));

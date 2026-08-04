/**
 * YAML parsing helpers.
 * @module includes/yaml-parser.js
 * TODO: Validate this file against the latest automation specs and add missing tests as needed.
 */

// TODO: Align this helper with the latest automation spec updates.

// Shim: expose canonical parser from .github/scripts to preserve existing require paths.
module.exports = require(
  require("path").join(__dirname, ".github", "scripts", "yaml-parser.js"),
);

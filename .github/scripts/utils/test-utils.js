/**
 * Lightweight test helpers used across scripts utilities.
 * @module scripts/utils/test-utils
 */
const path = require("path");

function resolveScript(relativePath) {
  return path.join(__dirname, "..", relativePath);
}

module.exports = {
  resolveScript,
};

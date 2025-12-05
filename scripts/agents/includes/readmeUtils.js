/**
 * readmeUtils.js
 * Utilities for finding and updating README.md files across a repo.
 * Ported from find-readmes.sh and update-readme-and-changelog.sh
 */

const fs = require("fs");
const path = require("path");

/**
 * Recursively find all README*.md files in a directory.
 * @param {string} dir
 * @returns {string[]}
 */
function findReadmeFiles(dir = ".") {
  let results = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith(".git")) {
      results = results.concat(findReadmeFiles(fullPath));
    } else if (/^README.*\.md$/i.test(entry.name)) {
      const rel = path.relative(".", fullPath); // normalize relative path from repo root
      const prefixed = rel.startsWith("./") ? rel : `./${rel}`;
      results.push(prefixed);
    }
  });
  return results;
}

/**
 * Ensure that a string is present in the file, or add it at the end.
 * @param {string} file
 * @param {string} searchString
 * @param {string} appendString
 * @returns {boolean} true if updated
 */
function ensureStringInFile(file, searchString, appendString) {
  const content = fs.readFileSync(file, "utf-8");
  if (!content.includes(searchString)) {
    fs.appendFileSync(file, `\n${appendString}\n`);
    return true;
  }
  return false;
}

/**
 * Update README.md: add license badge and contributing link if missing.
 * @param {string} file
 * @returns {boolean} true if file was updated
 */
function updateReadme(file) {
  let changed = false;
  // License badge (insert after first header)
  const licenseBadge =
    "[![License: GPL v3 or later](https://img.shields.io/badge/License-GPL%20v3%20or%20later-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.html)";
  let content = fs.readFileSync(file, "utf-8");
  if (!content.includes("License-GPL%20v3%20or%20later")) {
    content = content.replace(/^(# .+\n)/, `$1${licenseBadge}\n`);
    changed = true;
  }
  // Contributing link
  if (!content.includes("CONTRIBUTING.md")) {
    content +=
      "\n## Contributing\n\nPlease see [CONTRIBUTING.md](CONTRIBUTING.md) for details.\n";
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(file, content);
  }
  return changed;
}

module.exports = {
  findReadmeFiles,
  ensureStringInFile,
  updateReadme,
};

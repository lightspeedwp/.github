/**
 * JSDoc Review Agent
 * Version: v0.2.0
 * Description: Audits JavaScript/TypeScript code for JSDoc coverage, quality, and alignment
 *              with WordPress and LightSpeedWP standards.
 * References:
 *   - https://github.com/lightspeedwp/.github/blob/master/.github/instructions/inline-docs/inline-jsdoc.instructions.md
 *   - https://github.com/lightspeedwp/.github/blob/master/.github/instructions/wordpress/wpcs-js-docs.instructions.md
 *   - https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md
 */

const fs = require("fs");
const path = require("path");

/**
 * File extensions to audit.
 */
const FILE_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"];

/**
 * Recursively get all code files in a directory.
 * @param {string} dir
 * @param {string[]} [fileList]
 * @returns {string[]}
 */
function getCodeFiles(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getCodeFiles(fullPath, fileList);
    } else if (FILE_EXTENSIONS.includes(path.extname(entry.name))) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

/**
 * Check if a function or class has a JSDoc block above it.
 * Very basic regex-based check—can be replaced with a proper parser.
 * @param {string} fileContent
 * @returns {Array<{line: number, type: string, name: string, hasJSDoc: boolean}>}
 */
function auditJSDocBlocks(fileContent) {
  const lines = fileContent.split("\n");
  const results = [];
  // Regexes for functions, classes, exported functions etc.
  const jsdocRegex = /^\s*\/\*\*([\s\S]*?)\*\//;
  const functionRegex =
    /^\s*(export\s+)?(async\s+)?function\s+([a-zA-Z0-9_$]+)\s*\(/;
  const arrowFunctionRegex =
    /^\s*(const|let|var)\s+([a-zA-Z0-9_$]+)\s*=\s*(async\s*)?\(/;
  const classRegex = /^\s*(export\s+)?class\s+([a-zA-Z0-9_$]+)/;

  for (let i = 0; i < lines.length; i++) {
    let match =
      functionRegex.exec(lines[i]) ||
      classRegex.exec(lines[i]) ||
      arrowFunctionRegex.exec(lines[i]);
    if (match) {
      // Check for JSDoc above (within previous 2 lines)
      let hasJSDoc = false;
      for (let j = i - 1; j >= Math.max(0, i - 2); j--) {
        if (jsdocRegex.test(lines[j])) {
          hasJSDoc = true;
          break;
        }
      }
      let type = match[0].includes("class") ? "class" : "function";
      let name = match[3] || match[2] || match[0];
      results.push({ line: i + 1, type, name, hasJSDoc });
    }
  }
  return results;
}

/**
 * Main agent function.
 * @param {string} rootDir - Directory to scan.
 */
function runJSDocReview(rootDir = process.cwd()) {
  const files = getCodeFiles(rootDir);
  const summary = [];

  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const audits = auditJSDocBlocks(content);
    for (const audit of audits) {
      if (!audit.hasJSDoc) {
        summary.push({
          file,
          line: audit.line,
          type: audit.type,
          name: audit.name,
          issue: "Missing JSDoc comment",
        });
      }
    }
  }

  // Output report
  if (summary.length === 0) {
    console.log("✅ All scanned files have JSDoc coverage as per standards.");
  } else {
    console.log("❌ JSDoc coverage issues found:\n");
    for (const issue of summary) {
      console.log(
        `File: ${issue.file}\n  Line: ${issue.line}\n  ${issue.type}: ${issue.name}\n  Issue: ${issue.issue}\n`,
      );
    }
    console.log(
      "Refer to the standards:\n" +
        "- https://github.com/lightspeedwp/.github/blob/master/.github/instructions/inline-docs/inline-jsdoc.instructions.md\n" +
        "- https://github.com/lightspeedwp/.github/blob/master/.github/instructions/wordpress/wpcs-js-docs.instructions.md\n" +
        "- https://github.com/lightspeedwp/.github/blob/master/.github/instructions/coding-standards.instructions.md\n",
    );
  }
}

// If called directly, run
if (require.main === module) {
  runJSDocReview(process.argv[2] || process.cwd());
}

module.exports = {
  runJSDocReview,
  getCodeFiles,
  auditJSDocBlocks,
};

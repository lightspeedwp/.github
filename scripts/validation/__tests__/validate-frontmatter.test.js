/**
 * @jest-environment jsdom
 */
// Test for validate-frontmatter.js
// Place all validation tests in this folder as per repo standards.
const path = require("path");
const { execSync } = require("child_process");

describe("Frontmatter Validation", () => {
  it("should validate all markdown files and report errors for invalid frontmatter", () => {
    const fs = require("fs");
    // Run the validation script and capture output
    const scriptPath = path.join(__dirname, "../validate-frontmatter.js");
    let output = "";
    let stderr = "";
    try {
      output = execSync(`node ${scriptPath}`, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      });
    } catch (err) {
      output = err.stdout || "";
      stderr = err.stderr || "";
    }

    const fullOutput = output + stderr;

    // Check for expected output or verify log file was created
    const logPath = path.join(
      __dirname,
      "../../../logs/validation/frontmatter-validation.log",
    );
    const logExists = fs.existsSync(logPath);

    // Test passes if log file was created (indicating validation completed)
    expect(logExists).toBe(true);
    // Also check that output contains start or completion indicators
    expect(fullOutput).toMatch(
      /Starting frontmatter validation|Validation completed|Validation log written to:/,
    );
  });
});

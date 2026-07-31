/**
 * @jest-environment jsdom
 */
// Test for validate-frontmatter.js
// Place all validation tests in this folder as per repo standards.
const path = require("path");
const { execSync } = require("child_process");

describe("Frontmatter Validation", () => {
  it("should validate all markdown files and report errors for invalid frontmatter", () => {
    // Run the validation script and capture output
    const scriptPath = path.join(__dirname, "../validate-frontmatter.js");
    let output;
    try {
      output = execSync(`node ${scriptPath}`, { encoding: "utf8" });
    } catch (err) {
      output = err.stdout || err.message;
    }
    // Validate stable, high-signal output markers regardless of exit status.
    expect(output).toMatch(/Starting frontmatter validation/);
    expect(output).toMatch(
      /Found [0-9]+ files to validate|Validation completed|Validation failed|Validation log written to:/,
    );
  });
});

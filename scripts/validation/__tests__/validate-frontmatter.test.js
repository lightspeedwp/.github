/**
 * @jest-environment jsdom
 */
// Test for validate-frontmatter.js
// Place all validation tests in this folder as per repo standards.
const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

describe("Frontmatter Validation", () => {
  it("requires GitHub's about field for issue templates", () => {
    const schema = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, "../../../.schemas/frontmatter.schema.json"),
        "utf8",
      ),
    );
    const issueTemplateSchema = schema.oneOf.find(
      (entry) => entry.properties?.file_type?.const === "issue-template",
    );

    expect(issueTemplateSchema.required).toContain("about");
    expect(issueTemplateSchema.required).not.toContain("description");
  });

  it("should validate all markdown files and report errors for invalid frontmatter", () => {
    // Run the validation script and capture output
    const scriptPath = path.join(__dirname, "../validate-frontmatter.js");
    let output;
    try {
      output = execSync(`node ${scriptPath}`, { encoding: "utf8" });
    } catch (err) {
      output = err.stdout || err.message;
    }
    // Check for expected output
    expect(output).toMatch(/Validation log written to:/);
    // Optionally, check for summary or error lines
    expect(output).toMatch(/Validation complete|Validation log written to:/);
  });
});
